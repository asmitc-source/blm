import { createMiddleware } from "@tanstack/react-start";

export const deskMiddleware = createMiddleware({ type: "function" })
  .client(async ({ next }) => {
    const { getDeskToken } = await import("./token");
    return next({ sendContext: { deskToken: getDeskToken() ?? undefined } });
  })
  .server(async ({ next, context }) => {
    const { sessionAdmin } = await import("./store");
    let token = (context as { deskToken?: string }).deskToken;
    if (!token) {
      try {
        const { getCookie } = await import("@tanstack/react-start/server");
        token = getCookie("blm_desk") ?? undefined;
      } catch {
        /* not in a request */
      }
    }
    const admin = await sessionAdmin(token);
    return next({ context: { deskToken: token, admin } });
  });
