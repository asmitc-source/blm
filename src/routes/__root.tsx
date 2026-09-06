import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { ThemeProvider, themeBootScript } from "@/components/theme";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";
import { SITE } from "@/lib/site";
import { defaultShareImage, shareMeta } from "@/lib/seo";
import { NotFound } from "@/components/not-found";

const FONT_CSS =
  "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,500;1,6..72,600&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap";

export const Route = createRootRoute({
  // Session is resolved client-side via Better Auth useSession (AuthSlot).
  // A root beforeLoad that awaited getSession blocked every soft navigation.
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${SITE.name} · ${SITE.legalName}` },
      { name: "description", content: SITE.description },
      { name: "theme-color", content: "#f4f1ea" },
      { name: "google-site-verification", content: "SANgNulrO0igNLnWomn54tf-G9uZr7EsL01oN56JWwo" },
      ...shareMeta({ title: SITE.name, description: SITE.description, path: "/" }),
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "image_src", href: defaultShareImage() },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "preload", as: "style", href: FONT_CSS },
      { rel: "stylesheet", href: FONT_CSS },
    ],
  }),
  notFoundComponent: NotFound,
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-svh bg-paper text-ink">
        <AuthProvider>
          <ThemeProvider>
            <Outlet />
          </ThemeProvider>
        </AuthProvider>
        <Toaster richColors position="top-center" />
        <Scripts />
      </body>
    </html>
  );
}
