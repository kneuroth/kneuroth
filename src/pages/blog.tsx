import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Header } from '@/header';

/**
 * Nothing is written yet, so the page says so instead of standing empty — and
 * since there's nothing to read, it isn't a place to stay: a click anywhere
 * (or Escape) closes it, back to wherever you came from, or to the desk if you
 * landed here directly. The keyboard on the desk glows a dim grey for the same
 * reason.
 */
export function Blog() {
  const navigate = useNavigate();
  const { key } = useLocation();

  // "default" is the key of the first entry in this tab's session, so there's
  // nowhere in the site to go back to.
  const close = useCallback(() => {
    if (key === 'default') navigate('/', { replace: true });
    else navigate(-1);
  }, [key, navigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  return (
    <div
      className="min-h-screen cursor-pointer"
      onClick={(e) => {
        // The header's links (and the house) still go where they say.
        if ((e.target as HTMLElement).closest('a, button')) return;
        close();
      }}
    >
      <Header />
      <div className="flex min-h-[70vh] items-center justify-center p-6">
        <GlassPanel className="w-full max-w-md p-6 text-center sm:p-8">
          <h2 className="text-3xl font-semibold tracking-tight text-frenchgrey">
            no blog yet
          </h2>
          <p className="mt-4 text-white/70">
            i don't have a blog. what am i a nerd? yes
          </p>
          <p className="mt-6 text-xs text-white/45">click anywhere to close</p>
        </GlassPanel>
      </div>
    </div>
  );
}
