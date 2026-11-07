import { GlassPanel } from '@/components/ui/glass-panel';
import { Header } from '@/header';

/** Nothing is written yet, so the page says so instead of standing empty. The
    notebook on the desk glows grey for the same reason. */
export function Blog() {
  return (
    <>
      <Header />
      <div className="flex min-h-[70vh] items-center justify-center p-6">
        <GlassPanel className="w-full max-w-md p-6 text-center sm:p-8">
          <h2 className="text-3xl font-semibold tracking-tight text-frenchgrey">
            no blog yet
          </h2>
          <p className="mt-4 text-white/70">
            i don't have a blog. what am i a nerd? yes
          </p>
        </GlassPanel>
      </div>
    </>
  );
}
