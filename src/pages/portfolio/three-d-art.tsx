import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { GlassPanel } from '@/components/ui/glass-panel';
import { GlowButton } from '@/components/ui/glow-button';
import { Header } from '@/header';
import { asset } from '@/lib/router';
import { PageTitle } from '@/page-title';

const PRINTS = [
  { image: 'flower-1.jpg', name: 'Flower 1' },
  { image: 'flower-2.jpg', name: 'Flower 2' },
  { image: 'flower-3.jpg', name: 'Flower 3' },
  { image: 'tetris.JPG', name: 'Tetris' },
  { image: 'tetris2.jpg', name: 'Tetris 2' },
  { image: 'tetris3.jpg', name: 'Tetris 3' },
  { image: 'table-top-1.JPG', name: 'Tabletop 1' },
  { image: 'table-top.jpg', name: 'Tabletop' },
  { image: 'table-top-2.JPG', name: 'Tabletop 2' },
  { image: 'bricks1.JPG', name: 'Bricks 1' },
  { image: 'bricks2.JPG', name: 'Bricks 2' },
  { image: 'bricks3.JPG', name: 'Bricks 3' },
];

/**
 * The 3D-printed pieces, as one gallery on one glass card — the prints read as
 * a collection, not a row of separately framed objects.
 *
 * The track is native horizontal scroll with snap points (swipe, trackpad and
 * shift-wheel all just work); the two icon buttons page it by one view.
 * Every print is `contain` in a fixed-height frame: they run from 0.67 to 2.22
 * aspect, so the row comes out level and nothing is cropped.
 */
export function ThreeDArt() {
  const track = useRef<HTMLDivElement>(null);
  const page = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({
      left: dir * el.clientWidth,
      behavior: reduce ? 'auto' : 'smooth',
    });
  };

  return (
    // A scrim of its own over the veil: warm photographs need the room darker
    // still before they read as separate objects rather than more windowsill.
    <div className="min-h-screen bg-gradient-to-b from-[rgb(6_10_20/0.35)] to-[rgb(6_10_20/0.5)]">
      <Header />
      <PageTitle
        title="3D Art"
        subtitle="A collection of 3D printed art pieces"
      />
      {/* A gutter each side: the panel's edge stands 9px proud of it, and a
          full-width panel would push that past the viewport. */}
      <GlassPanel className="mx-auto my-8 w-[calc(100%-2rem)] max-w-7xl p-4 sm:p-6">
        <div
          ref={track}
          tabIndex={0}
          aria-label="3D art prints"
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain rounded-lg pb-3 [scrollbar-width:thin] focus-visible:outline-2 focus-visible:outline-[var(--sweep-base)]"
        >
          {PRINTS.map((print) => (
            <img
              key={print.image}
              src={asset(`3d-art/${print.image}`)}
              alt={print.name}
              loading="lazy"
              decoding="async"
              className="h-56 w-full flex-none snap-start rounded-lg object-contain shadow-lg shadow-black/30 sm:h-64 sm:w-[calc((100%-1rem)/2)] lg:h-72 xl:w-[calc((100%-2rem)/3)]"
            />
          ))}
        </div>
        <div className="mt-3 flex justify-center gap-3">
          <GlowButton
            variant="icon"
            rounded
            aria-label="Previous prints"
            icon={<ChevronLeft />}
            onClick={() => page(-1)}
          />
          <GlowButton
            variant="icon"
            rounded
            aria-label="Next prints"
            icon={<ChevronRight />}
            onClick={() => page(1)}
          />
        </div>
      </GlassPanel>
    </div>
  );
}
