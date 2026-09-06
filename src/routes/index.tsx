import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { HomePage } from "@/components/home/home-page";
import { pageHead } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => pageHead({ title: SITE.name, description: SITE.description, path: "/" }),
  component: Home,
});

function Home() {
  return (
    <SiteShell>
      <HomePage />
    </SiteShell>
  );
}
