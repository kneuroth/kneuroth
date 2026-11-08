import { House } from 'lucide-react';
import { GlassPanel } from '@/components/ui/glass-panel';
import { GlowButton } from '@/components/ui/glow-button';
import { cx } from '@/components/ui/kn-utils';
import { SweepLink } from '@/components/ui/sweep-link';
import { RESEARCH_URL, offsite } from '@/lib/links';
import { SweepNavLink, useRouterLink } from '@/lib/router';

/** The places to go. No "Home" — the house beside these goes there, and the
    home page is the one page that never shows this bar. `pending` marks one
    that isn't ready yet; `href` one that leaves the site (in a new tab). */
const NAV: {
  label: string;
  to?: string;
  href?: string;
  pending?: boolean;
}[] = [
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Research', href: RESEARCH_URL },
  { label: 'Blog', to: '/blog', pending: true },
  { label: 'About', to: '/about' },
];

const NAV_CLASS = 'rounded-2xl px-5 py-2.5 text-lg font-bold';

export function Header({ animateOnLoad = false }: { animateOnLoad?: boolean }) {
  const home = useRouterLink('/');
  return (
    <header className="mb-5">
      <GlassPanel variant="header" as="div" className="mx-3 sm:mx-6">
        <nav
          aria-label="Global"
          className="flex flex-col items-center gap-5 p-6 sm:flex-row sm:justify-between sm:gap-4 lg:px-8"
        >
          {/* The house is an icon button like any other; .logo-link adds only
              its own load bloom and squash (index.css), played on the page the
              cube lands you on. */}
          <GlowButton
            variant="icon"
            rounded
            aria-label="Home"
            icon={<House strokeWidth={1.75} />}
            className={cx(
              'logo-link text-2xl',
              animateOnLoad && 'animate-intro',
            )}
            {...home}
          />
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:gap-6">
            {NAV.map((item) =>
              item.href ? (
                <SweepLink
                  key={item.label}
                  href={item.href}
                  className={NAV_CLASS}
                  {...offsite}
                >
                  {item.label}
                </SweepLink>
              ) : (
                <SweepNavLink
                  key={item.label}
                  to={item.to!}
                  pending={item.pending}
                  className={NAV_CLASS}
                >
                  {item.label}
                </SweepNavLink>
              ),
            )}
          </div>
        </nav>
      </GlassPanel>
    </header>
  );
}
