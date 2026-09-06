import { FOOTER, SITE } from "@/lib/site";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-cream">
      <div className="chrome-pad flex flex-col gap-12 py-16 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xs shrink-0">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-muted">{SITE.oneLiner}</p>
          <p className="mt-4 text-sm text-faint">{SITE.email}</p>
        </div>
        <div className="grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-4 lg:gap-x-14">
          <FooterCol title="Product" items={FOOTER.product} />
          <FooterCol title="Resources" items={FOOTER.resources} />
          <FooterCol title="Compare" items={FOOTER.compare} />
          <FooterCol title="Company" items={[...FOOTER.company, ...FOOTER.legal]} />
        </div>
      </div>
      <div className="border-t border-line">
        <div className="chrome-pad flex flex-col gap-2 py-5 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
          </p>
          <p>Create a workspace · Book a demo · Early access</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: ReadonlyArray<{ href: string; label: string }>;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={`${item.href}-${item.label}`}>
            <a className="text-sm text-ink-soft transition-colors hover:text-ink" href={item.href}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
