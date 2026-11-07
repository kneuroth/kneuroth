import { House } from 'lucide-react';
import { GlassPanel } from '@/components/ui/glass-panel';
import { GlowButton } from '@/components/ui/glow-button';
import { cx } from '@/components/ui/kn-utils';
import { SweepNavLink, useRouterLink } from '@/lib/router';

/** The three places to go. No "Home" — the house beside these goes there, and
    the home page is the one page that never shows this bar. No "Projects"
    either: the portfolio is reached through the cube on the desk. `pending`
    marks one that isn't ready yet. */
const NAV = [
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Blog', to: '/blog', pending: true },
  { label: 'About', to: '/about' },
];

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
            {NAV.map((item) => (
              <SweepNavLink
                key={item.to}
                to={item.to}
                pending={item.pending}
                className="rounded-2xl px-5 py-2.5 text-lg font-bold"
              >
                {item.label}
              </SweepNavLink>
            ))}
          </div>
        </nav>
      </GlassPanel>
    </header>
  );
}
