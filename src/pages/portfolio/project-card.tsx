import { ArrowRight, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { GlassPanel } from '@/components/ui/glass-panel';
import { GlowButton } from '@/components/ui/glow-button';
import { cx } from '@/components/ui/kn-utils';
import { SweepLink } from '@/components/ui/sweep-link';
import { GithubIcon } from '@/icons';
import { SweepNavLink, asset, useRouterLink } from '@/lib/router';
import type { Project, ProjectLink } from './projects';

/**
 * One featured project, as a glass slab joined to a screen edge. `side` drives
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
  const tile = useTile();

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
          <h2 className="text-lg font-bold text-white">
            <ProjectTitle project={project} />
          </h2>
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

      <ProjectLinks links={project.links} size="lg" />
    </GlassPanel>
  );
}

/**
 * Every other project, as a slim floating panel in the list under the featured
 * cards: small tiles in a row, the words, and the links at the end. No
 * entrance — the fly-in is reserved for the three that lead the page.
 */
export function ProjectRow({ project }: { project: Project }) {
  const thumbnails = project.images?.slice(0, 3) ?? [];
  const tile = useTile();

  return (
    <GlassPanel className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-5 sm:px-5">
      {thumbnails.length > 0 && (
        <div className="flex h-14 shrink-0 gap-1.5">
          {/* On a phone only the lead survives, as on the cards. */}
          {thumbnails.map((src, i) =>
            tile(src, cx('w-[4.5rem]', i > 0 && 'hidden sm:block')),
          )}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h3 className="font-bold text-white">
          <ProjectTitle project={project} />
        </h3>
        <p className="mt-0.5 line-clamp-2 text-sm text-white/70">
          {project.description}
        </p>
      </div>
      <ProjectLinks links={project.links} size="md" />
    </GlassPanel>
  );
}

/** The heading is a link of its own: to the project's page on this site if it
    has one, else to the live project. Neither, and it's just the name. */
function ProjectTitle({ project }: { project: Project }) {
  const page = project.links?.find((l) => l.kind === 'page');
  if (page && 'to' in page)
    return <SweepNavLink to={page.to}>{project.title}</SweepNavLink>;
  const site = project.links?.find((l) => l.kind === 'site');
  if (site && 'href' in site)
    return (
      <SweepLink href={site.href} target="_blank" rel="noopener noreferrer">
        {project.title}
      </SweepLink>
    );
  return <>{project.title}</>;
}

/** Tiles are laid out around this shape, so it's what an image is judged against. */
const TILE_ASPECT = 4 / 3;
/** How far from the tile's shape an image may be before cropping it does more
    harm than letterboxing it. A 3.77:1 wordmark cropped to 4:3 is three letters. */
const CROP_TOLERANCE = 1.7;
/** Below this, an asset is a sprite or icon: filling a tile means upscaling. */
const MIN_NATURAL_PX = 200;

/**
 * A thumbnail tile renderer. Cover vs contain is decided from the file, not
 * the data: these entries carry phone screenshots, wordmarks and 64px sprites,
 * and a single crop rule turns the odd ones into a meaningless slice of their
 * own middle.
 */
function useTile() {
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

  return (src: string, className?: string) => (
    <figure key={src} className={cx('thumb', className)}>
      <img
        className={cx(
          'h-full w-full',
          // Cropped screenshots hold their top edge, where the interesting
          // part is; letterboxed ones get a little air.
          contained.has(src) ? 'object-contain p-1' : 'object-cover object-top',
        )}
        src={asset(src)}
        onLoad={onLoad(src)}
        alt=""
        loading="lazy"
        decoding="async"
      />
    </figure>
  );
}

const LABELS = {
  page: 'Read more',
  site: 'Open project',
  github: 'View source on GitHub',
} as const;

function ProjectLinks({
  links,
  size,
}: {
  links: ProjectLink[] | undefined;
  size: 'md' | 'lg';
}) {
  if (!links?.length) return null;
  return (
    <div className="flex shrink-0 gap-1">
      {links.map((link) => (
        <ProjectLinkButton
          key={'to' in link ? link.to : link.href}
          link={link}
          size={size}
        />
      ))}
    </div>
  );
}

function ProjectLinkButton({
  link,
  size,
}: {
  link: ProjectLink;
  size: 'md' | 'lg';
}) {
  const shared = {
    variant: 'icon' as const,
    rounded: true,
    size,
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
  size: 'md' | 'lg';
}) {
  return <GlowButton {...props} {...useRouterLink(to)} icon={<ArrowRight />} />;
}
