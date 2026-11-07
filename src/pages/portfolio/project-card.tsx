import { ArrowRight, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { GlassPanel } from '@/components/ui/glass-panel';
import { GlowButton } from '@/components/ui/glow-button';
import { cx } from '@/components/ui/kn-utils';
import { GithubIcon } from '@/icons';
import { asset, useRouterLink } from '@/lib/router';
import type { Project, ProjectLink } from './projects';

/** Tiles are laid out around this shape, so it's what an image is judged against. */
const TILE_ASPECT = 4 / 3;
/** How far from the tile's shape an image may be before cropping it does more
    harm than letterboxing it. A 3.77:1 wordmark cropped to 4:3 is three letters. */
const CROP_TOLERANCE = 1.7;
/** Below this, an asset is a sprite or icon: filling a tile means upscaling. */
const MIN_NATURAL_PX = 200;

/**
 * One project, as a glass slab joined to a screen edge. `side` drives
 * everything that follows from it: the panel's bleed edge, the mirrored layout
 * (words against the edge, thumbnails toward the middle of the page) and the
 * deeper padding on the bleed side.
 */
export function ProjectCard({
  project,
  side,
}: {
  project: Project;
  side: 'left' | 'right';
}) {
  const right = side === 'right';
  const thumbnails = project.images?.slice(0, 3) ?? [];

  // Cover vs contain is decided from the file, not the data: these entries
  // carry phone screenshots, wordmarks and 64px sprites, and a single crop rule
  // turns the odd ones into a meaningless slice of their own middle.
  const [contained, setContained] = useState<ReadonlySet<string>>(new Set());
  const onLoad =
    (src: string) => (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
      if (!w || !h) return;
      const aspect = w / h;
      const off =
        aspect > TILE_ASPECT * CROP_TOLERANCE ||
        aspect < TILE_ASPECT / CROP_TOLERANCE;
      if (off || w < MIN_NATURAL_PX || h < MIN_NATURAL_PX) {
        setContained((set) => new Set(set).add(src));
      }
    };
  // Cropped screenshots hold their top edge, where the interesting part is.
  const fit = (src: string) =>
    contained.has(src) ? 'object-contain p-1' : 'object-cover object-top';

  const tile = (src: string, className?: string) => (
    <figure key={src} className={cx('thumb', className)}>
      <img
        className={cx('h-full w-full', fit(src))}
        src={asset(src)}
        onLoad={onLoad(src)}
        alt=""
        loading="lazy"
        decoding="async"
      />
    </figure>
  );

  return (
    <GlassPanel
      edge={side}
      className={cx('p-4 sm:p-6', right ? 'pr-8 sm:pr-12' : 'pl-8 sm:pl-12')}
    >
      {/* On a phone the cluster drops below the text instead of squeezing it. */}
      <div
        className={cx(
          'flex flex-col gap-4 sm:flex-row',
          right && 'sm:flex-row-reverse',
        )}
      >
        <div>
          <h2 className="text-lg font-bold text-white">{project.title}</h2>
          <p className="mt-1 text-white/70">{project.description}</p>
        </div>

        {thumbnails.length > 0 && (
          // A lone thumbnail gets a narrower cluster, or it letterboxes 2:1.
          <div
            className={cx(
              'flex h-24 w-32 shrink-0 gap-2 sm:ml-auto sm:h-32 lg:h-36',
              thumbnails.length === 1
                ? 'sm:w-44 lg:w-48'
                : 'sm:w-64 lg:w-[19rem]',
              right ? 'flex-row-reverse self-start' : 'self-end',
            )}
          >
            {tile(
              thumbnails[0]!,
              thumbnails.length >= 3 ? 'flex-[1.9]' : 'flex-1',
            )}
            {thumbnails.length > 1 && (
              // On a phone only the lead survives.
              <div className="hidden flex-1 flex-col gap-2 sm:flex">
                {thumbnails.slice(1).map((src) => tile(src, 'flex-1'))}
              </div>
            )}
          </div>
        )}
      </div>

      {project.links?.map((link) => (
        <ProjectLinkButton
          key={'to' in link ? link.to : link.href}
          link={link}
        />
      ))}
    </GlassPanel>
  );
}

const LABELS = {
  page: 'Read more',
  site: 'Open project',
  github: 'View source on GitHub',
} as const;

function ProjectLinkButton({ link }: { link: ProjectLink }) {
  const shared = {
    variant: 'icon' as const,
    rounded: true,
    size: 'lg' as const,
    'aria-label': LABELS[link.kind],
  };
  if (link.kind === 'page') return <PageButton to={link.to} {...shared} />;
  return (
    <GlowButton
      {...shared}
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      icon={link.kind === 'github' ? <GithubIcon /> : <ExternalLink />}
    />
  );
}

function PageButton({
  to,
  ...props
}: {
  to: string;
  'aria-label': string;
  variant: 'icon';
  rounded: boolean;
  size: 'lg';
}) {
  return <GlowButton {...props} {...useRouterLink(to)} icon={<ArrowRight />} />;
}
