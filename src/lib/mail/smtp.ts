/**
 * Minimal SMTP client (STARTTLS / implicit TLS) for GoDaddy / Microsoft 365.
 * No third-party mail package — uses Node `net` + `tls` only.
 *
 * Env:
 *   SMTP_HOST   e.g. smtp.office365.com or smtpout.secureserver.net
 *   SMTP_PORT   e.g. 587 (STARTTLS) or 465 (TLS)
 *   SMTP_USER   e.g. hello@nakama.in
 *   SMTP_PASS   mailbox password (Vercel / local env only — never commit)
 *   SMTP_FROM   e.g. "BLM <hello@nakama.in>" or hello@nakama.in
 */
import { createConnection, type Socket } from "node:net";
import { connect as tlsConnect, type TLSSocket } from "node:tls";

export type MailMessage = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

function env(key: string): string | undefined {
  const v = process.env[key]?.trim();
  return v || undefined;
}

export function smtpConfigured(): boolean {
  return Boolean(env("SMTP_HOST") && env("SMTP_USER") && env("SMTP_PASS") && env("SMTP_FROM"));
}

function encodeSubject(subject: string): string {
  if (/^[\x20-\x7E]*$/.test(subject)) return subject;
  return `=?UTF-8?B?${Buffer.from(subject, "utf8").toString("base64")}?=`;
}

function buildMime(from: string, msg: MailMessage): string {
  const boundary = `blm_${Date.now().toString(36)}`;
  const text =
    msg.text ??
    msg.html
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  const lines = [
    `From: ${from}`,
    `To: ${msg.to}`,
    `Subject: ${encodeSubject(msg.subject)}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    'Content-Type: text/plain; charset="utf-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    text,
    "",
    `--${boundary}`,
    'Content-Type: text/html; charset="utf-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    msg.html,
    "",
    `--${boundary}--`,
    "",
  ];
  return lines.join("\r\n");
}

class SmtpSession {
  private buf = "";
  constructor(private socket: Socket | TLSSocket) {}

  private readLine(): Promise<string> {
    return new Promise((resolve, reject) => {
      const tryResolve = () => {
        const idx = this.buf.indexOf("\r\n");
        if (idx === -1) return false;
        const line = this.buf.slice(0, idx);
        this.buf = this.buf.slice(idx + 2);
        resolve(line);
        return true;
      };
      if (tryResolve()) return;
      const onData = (chunk: string | Buffer) => {
        this.buf += typeof chunk === "string" ? chunk : chunk.toString("utf8");
        if (tryResolve()) {
          this.socket.off("data", onData);
          this.socket.off("error", onErr);
        }
      };
      const onErr = (err: Error) => {
        this.socket.off("data", onData);
        reject(err);
      };
      this.socket.on("data", onData);
      this.socket.once("error", onErr);
    });
  }

  async expect(okPrefix: string): Promise<string> {
    let line = await this.readLine();
    // multi-line replies: "250-..." then "250 ..."
    while (/^\d{3}-/.test(line)) {
      line = await this.readLine();
    }
    if (!line.startsWith(okPrefix)) {
      throw new Error(`SMTP unexpected reply: ${line}`);
    }
    return line;
  }

  async command(cmd: string, okPrefix: string): Promise<string> {
    this.socket.write(`${cmd}\r\n`);
    return this.expect(okPrefix);
  }

  write(data: string) {
    this.socket.write(data);
  }

  end() {
    this.socket.end();
  }
}

function connectRaw(host: string, port: number): Promise<Socket> {
  return new Promise((resolve, reject) => {
    const socket = createConnection({ host, port }, () => resolve(socket));
    socket.setEncoding("utf8");
    socket.once("error", reject);
  });
}

function upgradeTls(socket: Socket, host: string): Promise<TLSSocket> {
  return new Promise((resolve, reject) => {
    const tlsSocket = tlsConnect(
      { socket, host, servername: host },
      () => resolve(tlsSocket),
    );
    tlsSocket.setEncoding("utf8");
    tlsSocket.once("error", reject);
  });
}

function connectTls(host: string, port: number): Promise<TLSSocket> {
  return new Promise((resolve, reject) => {
    const socket = tlsConnect({ host, port, servername: host }, () => resolve(socket));
    socket.setEncoding("utf8");
    socket.once("error", reject);
  });
}

/**
 * Send one email. Throws on SMTP failure.
 * Callers should catch and continue when mail is best-effort.
 */
export async function sendMail(msg: MailMessage): Promise<void> {
  if (!smtpConfigured()) {
    throw new Error("SMTP is not configured");
  }
  const host = env("SMTP_HOST") as string;
  const port = Number(env("SMTP_PORT") ?? "587");
  const user = env("SMTP_USER") as string;
  const pass = env("SMTP_PASS") as string;
  const from = env("SMTP_FROM") as string;
  const implicitTls = port === 465;

  const raw = implicitTls ? await connectTls(host, port) : await connectRaw(host, port);
  let session = new SmtpSession(raw);
  await session.expect("220");
  await session.command(`EHLO blm.local`, "250");

  if (!implicitTls) {
    await session.command("STARTTLS", "220");
    const tlsSock = await upgradeTls(raw as Socket, host);
    session = new SmtpSession(tlsSock);
    await session.command(`EHLO blm.local`, "250");
  }

  await session.command("AUTH LOGIN", "334");
  await session.command(Buffer.from(user, "utf8").toString("base64"), "334");
  await session.command(Buffer.from(pass, "utf8").toString("base64"), "235");

  const fromAddr = from.includes("<") ? (from.match(/<([^>]+)>/)?.[1] ?? user) : from;
  await session.command(`MAIL FROM:<${fromAddr}>`, "250");
  await session.command(`RCPT TO:<${msg.to}>`, "250");
  await session.command("DATA", "354");
  const mime = buildMime(from, msg);
  // terminate DATA with <CRLF>.<CRLF>
  session.write(`${mime.replace(/^\./gm, "..")}\r\n.\r\n`);
  await session.expect("250");
  await session.command("QUIT", "221").catch(() => undefined);
  session.end();
}

/**
 * Best-effort send: returns { ok, skipped?, error? } and never throws.
 */
export async function trySendMail(msg: MailMessage): Promise<{
  ok: boolean;
  skipped?: boolean;
  error?: string;
}> {
  if (!smtpConfigured()) {
    return { ok: false, skipped: true, error: "SMTP not configured" };
  }
  try {
    await sendMail(msg);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "send failed" };
  }
}
