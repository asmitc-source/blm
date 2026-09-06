import { createMiddleware } from "@tanstack/react-start";

export const deskMiddleware = createMiddleware({ type: "function" })
  .client(async ({ next }) => {
    const { getDeskToken } = await import("./token");
    return next({ sendContext: { deskToken: getDeskToken() ?? undefined } });
  })
  .server(async ({ next, context }) => {
    const { sessionAdmin } = await import("./store");
    const token = (context as { deskToken?: string }).deskToken;
    const admin = await sessionAdmin(token);
    return next({ context: { deskToken: token, admin } });
  });
