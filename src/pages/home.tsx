import { GlassPanel } from '@/components/ui/glass-panel';
import { SweepLink } from '@/components/ui/sweep-link';
import { useDesk } from '@/desk/desk-state';
import { SweepNavLink } from '@/lib/router';

/**
 * The home page is the desk — the photograph in the layout — so whenever the
 * desk is projecting, this renders nothing at all.
 *
 * It exists for when it can't: the manifest fails to load, or a variant drops
 * every surface. Then the introduction and its links are said in ordinary
 * markup instead. The words are duplicated from desk.tsx on purpose — the same
 * page said a second way, short enough to keep in step by hand.
 */
export function Home() {
  const { projecting } = useDesk();
  // Projecting, or not known yet: the desk is (about to be) the page.
  if (projecting !== false) return null;

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <GlassPanel className="w-full max-w-md p-6 sm:p-8">
        <h1 className="text-4xl font-semibold tracking-tight text-frenchgrey">
          hello, i'm kelly
        </h1>
        <div className="mt-7 flex flex-col items-start gap-4 text-lg font-semibold">
          <SweepNavLink to="/portfolio">My projects</SweepNavLink>
          <SweepNavLink to="/about">About me</SweepNavLink>
          <SweepLink
            href="https://github.com/kneuroth"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/kneuroth
          </SweepLink>
        </div>
      </GlassPanel>
    </div>
  );
}
