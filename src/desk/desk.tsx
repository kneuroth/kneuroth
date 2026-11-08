import { ImageSurface, type Layout } from '@image-aware/react';
import { Mail } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Link } from 'react-router';
import { GlassButton } from '@/components/ui/glass-button';
import '@/components/ui/glass.css';
import { SweepLink } from '@/components/ui/sweep-link';
import { GithubIcon } from '@/icons';
import { RESEARCH_URL, offsite } from '@/lib/links';
import { SweepNavLink, SweptLabel, asset, useRouterLink } from '@/lib/router';
import { useDesk } from './desk-state';
import './desk.css';

/** The squares, fetched at runtime. They sit beside the photo in `public/`
    because that's where image-aware's editor reads and saves them
    (`pnpm mark`). */
const MANIFEST_URL = asset('opportunities.surfaces.json');

/**
 * The desk — the photograph the whole site is built on.
 *
 * `opportunities.jpg` is fixed behind every page, and on the home route it IS
 * the page: `<ImageSurface>` projects real, live DOM onto the flat surfaces
 * marked in `opportunities.surfaces.json`, angled to match the shot, so the
 * introduction is written on the laptop screen and the cube on the sill is the
 * way through to the projects. Everywhere else the same photo drops behind a
 * veil and goes back to being scenery.
 *
 * Mounted once in the layout, so navigating never rebuilds the room.
 *
 * Slot names are surface ids. Re-marking the photo (`pnpm mark`) replaces the
 * manifest; after that, check every `slot` below still matches an id, and the
 * design-space px in desk.css against the new `resolution`s.
 */
export function Desk({ live }: { live: boolean }) {
  const { projecting, setProjecting } = useDesk();

  /** Ids of every surface the manifest marks, so slots for surfaces that
      don't exist yet (the blog's, until it's marked) aren't rendered. */
  const [surfaces, setSurfaces] = useState<ReadonlySet<string>>(new Set());
  /** Ids of the surfaces the manifest is floating rather than projecting. */
  const [floating, setFloating] = useState<ReadonlySet<string>>(new Set());

  const onLayout = useCallback(
    (layout: Layout) => {
      setSurfaces(new Set(layout.surfaces.map((surface) => surface.id)));
      setProjecting(
        layout.surfaces.some((surface) => surface.placement === 'projected'),
      );
      // A placement that isn't a string keyword is a floating rect: the surface
      // keeps its box but loses the transform, so its content is laid out in
      // real page px instead of design space. That's a different stylesheet,
      // and this is how it gets told — from what the element decided.
      setFloating(
        new Set(
          layout.surfaces
            .filter((surface) => typeof surface.placement !== 'string')
            .map((surface) => surface.id),
        ),
      );
    },
    [setProjecting],
  );

  // A manifest that won't load means nothing to click; report "not projecting"
  // so the home page's ordinary panel takes over.
  const onError = useCallback(
    (error: Error) => {
      console.error('[desk] the photo could not be projected', error);
      setProjecting(false);
    },
    [setProjecting],
  );

  // The veil lifts only when the desk is usable as the interface.
  const lifted = live && projecting === true;
  const laptopFloats = floating.has('laptop');

  return (
    <div className={live ? 'desk is-live' : 'desk'}>
      <ImageSurface
        className="photo"
        manifest={MANIFEST_URL}
        src={asset('opportunities.jpg')}
        fit="cover"
        onLayout={onLayout}
        onError={onError}
      >
        {live && (
          <>
            {/* The laptop screen: the introduction, and the off-site links. */}
            <div
              slot="laptop"
              className={
                laptopFloats
                  ? 'surface-laptop is-floating glass-edge glass-dark'
                  : 'surface-laptop'
              }
            >
              {/* The name itself is the way in to `about`. The hint says so,
                  since a name doesn't look like a button; it's outside the link
                  (the sweep would paint it as one) and hidden from screen
                  readers, which already announce the link. */}
              <h2 className="laptop-hello">
                Hello, I'm{' '}
                <span className="laptop-name-wrap">
                  <SweepNavLink to="/about" className="laptop-name">
                    Kelly
                  </SweepNavLink>
                  <span className="laptop-name-hint" aria-hidden="true">
                    (click for 'about')
                  </span>
                </span>
              </h2>
              {/* Icons sit beside their links, never inside: the sweep clips
                  its background to the glyphs and would swallow them. */}
              <div className="laptop-links">
                <div className="laptop-link-row">
                  <GithubIcon className="laptop-icon" />
                  <SweepLink
                    className="laptop-link"
                    href="https://github.com/kneuroth"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    github.com/kneuroth
                  </SweepLink>
                </div>
                <div className="laptop-link-row">
                  <Mail className="laptop-icon" aria-hidden="true" />
                  {/* No target=_blank: a mailto shouldn't leave an empty tab. */}
                  <SweepLink
                    className="laptop-link"
                    href="mailto:kelly.neuroth@outlook.com"
                  >
                    kelly.neuroth@outlook.com
                  </SweepLink>
                </div>
              </div>
            </div>

            {/* The cube: two faces and a word, one object. `data-group` relates
                them, and `:has()` on the photo lights the whole group from any
                one. The faces are decorative duplicates so a click anywhere on
                the cube works; the label is the real link and its text is the
                accessible name. */}
            <Link
              slot="cube-teal"
              className="cube-face"
              data-group="cube"
              to="/portfolio"
              aria-hidden="true"
              tabIndex={-1}
            >
              <span
                className="surface-lit"
                style={{ '--face': '#0d8a8a' } as React.CSSProperties}
              />
            </Link>
            <Link
              slot="cube-red"
              className="cube-face"
              data-group="cube"
              to="/portfolio"
              aria-hidden="true"
              tabIndex={-1}
            >
              <span
                className="surface-lit"
                style={{ '--face': '#c41e3a' } as React.CSSProperties}
              />
            </Link>
            <Link
              slot="cube-label"
              className="surface-label"
              data-group="cube"
              to="/portfolio"
            >
              <SweptLabel className="label-text">portfolio</SweptLabel>
            </Link>

            {/* The notebook is the research wall: the same object-and-a-word
                pattern, off-site. Lit in the links' own pale blue — a live
                place, unlike the blog's grey. */}
            <a
              slot="notebook"
              className="notebook-face"
              data-group="notebook"
              href={RESEARCH_URL}
              {...offsite}
              aria-hidden="true"
              tabIndex={-1}
            >
              <span
                className="surface-lit"
                style={
                  {
                    '--face': '#a5c5de',
                    '--lit-opacity': 0.6,
                    '--lit-rest': 0.6,
                  } as React.CSSProperties
                }
              />
            </a>

            {floating.has('notebook-label') ? (
              // Floated, there is no notebook (the manifest drops it), so the
              // word would be a stray caption on open photograph. It becomes a
              // glass button instead — dark tone, because out here the ground is
              // the raw photograph — with `blog` and `about` hanging below it.
              // `about` replaces the hint under the name, hidden out here.
              <NotebookButtons />
            ) : (
              <a
                slot="notebook-label"
                className="surface-label"
                data-group="notebook"
                href={RESEARCH_URL}
                {...offsite}
              >
                <SweptLabel className="label-text">research</SweptLabel>
              </a>
            )}

            {/* The blog: lit grey — part of the desk, but dull, because it's
                still empty. It has no surface of its own until the photo is
                re-marked with `blog` / `blog-label`; until then these simply
                don't render. */}
            {surfaces.has('blog') && (
              <Link
                slot="blog"
                className="notebook-face"
                data-group="blog"
                to="/blog"
                aria-hidden="true"
                tabIndex={-1}
              >
                <span
                  className="surface-lit"
                  style={
                    {
                      '--face': '#b8b8c0',
                      '--lit-opacity': 0.55,
                      '--lit-rest': 0.75,
                    } as React.CSSProperties
                  }
                />
              </Link>
            )}
            {surfaces.has('blog-label') && !floating.has('blog-label') && (
              <Link
                slot="blog-label"
                className="surface-label"
                data-group="blog"
                to="/blog"
              >
                <SweptLabel pending className="label-text">
                  blog
                </SweptLabel>
              </Link>
            )}
          </>
        )}
      </ImageSurface>

      {/* Off the desk, the photo is scenery: a veil drops so every other page's
          frosted panels read against it. */}
      <div className={lifted ? 'veil is-lifted' : 'veil'} aria-hidden="true" />
    </div>
  );
}

/** The phone's floated stack: research fills the placement the manifest gave
    the notebook's word; blog and about hang below it, one gap apart. */
function NotebookButtons() {
  const blog = useRouterLink('/blog');
  const about = useRouterLink('/about');
  return (
    <div slot="notebook-label" className="notebook-buttons">
      <GlassButton
        tone="dark"
        className="notebook-button"
        href={RESEARCH_URL}
        {...offsite}
      >
        <SweptLabel>research</SweptLabel>
      </GlassButton>
      <GlassButton
        tone="dark"
        className="notebook-button is-stacked-1"
        {...blog}
      >
        <SweptLabel pending>blog</SweptLabel>
      </GlassButton>
      <GlassButton
        tone="dark"
        className="notebook-button is-stacked-2"
        {...about}
      >
        <SweptLabel>about</SweptLabel>
      </GlassButton>
    </div>
  );
}
