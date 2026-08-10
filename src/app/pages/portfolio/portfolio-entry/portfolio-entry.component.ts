import { Component, computed, input, signal } from '@angular/core';
import { PortfolioEntry } from '../model';
import { KeyValuePipe, NgClass } from '@angular/common';
import { GlowButtonComponent } from '@shared/ui/glow-button/glow-button.component';
import { GlassPanelComponent } from '@shared/ui/glass-panel/glass-panel.component';

/** Tiles are laid out around this shape, so it's what an image is judged against. */
const TILE_ASPECT = 4 / 3;

/** How far from the tile's shape an image may be before cropping it does more
    harm than letterboxing it. A 3.77:1 wordmark cropped to 4:3 is three letters. */
const CROP_TOLERANCE = 1.7;

/** Below this, an asset is a sprite or an icon rather than a screenshot: filling
    a tile with it means upscaling, which never looks like anything but a mistake. */
const MIN_NATURAL_PX = 200;

@Component({
  selector: 'app-portfolio-entry',
  imports: [GlowButtonComponent, KeyValuePipe, NgClass, GlassPanelComponent],
  templateUrl: './portfolio-entry.component.html',
  styles: `
    /* The frame is the tile, not the picture: a fixed box with a hairline and a
       soft fill, so a letterboxed logo and a cropped screenshot still read as
       the same kind of object sitting on the glass. */
    .thumb {
      position: relative;
      overflow: hidden;
      margin: 0;
      border-radius: 0.5rem;
      border: 1px solid rgb(255 255 255 / 0.55);
      background: rgb(255 255 255 / 0.12);
      box-shadow: 0 4px 14px rgb(0 0 0 / 0.25);
      transition: transform 0.3s ease;
    }

    .thumb:hover {
      transform: translateY(-0.25rem) scale(1.04);
      z-index: 1;
    }

    @media (prefers-reduced-motion: reduce) {
      .thumb {
        transition: none;
      }
      .thumb:hover {
        transform: none;
      }
    }
  `,
})
export class PortfolioEntryComponent {
  portfolioEntry = input.required<PortfolioEntry>();

  /**
   * Which screen edge this card is joined to. One input drives everything that
   * follows from the side: the panel's bleed edge, the mirrored layout (so the
   * thumbnails lean toward the screen edge), and the deeper padding on the
   * bleed side so content isn't pressed against the edge of the display.
   */
  side = input<'left' | 'right'>('left');

  protected readonly bleedsRight = computed(() => this.side() === 'right');

  /** A lead tile plus at most two beside it; more than three stops reading as a
      cluster and starts reading as a contact sheet. */
  protected readonly thumbnails = computed(
    () => this.portfolioEntry().image?.slice(0, 3) ?? [],
  );

  /** Sources that have to letterboxed rather than cropped. See `onThumbnailLoad`. */
  private readonly contained = signal<ReadonlySet<string>>(new Set());

  /**
   * Decide `cover` vs `contain` from the file itself, once it has loaded.
   *
   * These entries carry whatever the project had — phone screenshots at 0.45,
   * a 3.77:1 wordmark, 64px game sprites — and a single `object-cover` rule
   * turns the odd ones into a meaningless crop of their own middle. Nothing in
   * the data says which is which, but the image's own dimensions do, so ask
   * them instead of hand-tagging every entry.
   */
  protected onThumbnailLoad(event: Event, src: string): void {
    const image = event.target as HTMLImageElement;
    if (!image.naturalWidth || !image.naturalHeight) return;

    const aspect = image.naturalWidth / image.naturalHeight;
    const tooFarFromTile =
      aspect > TILE_ASPECT * CROP_TOLERANCE ||
      aspect < TILE_ASPECT / CROP_TOLERANCE;
    const tooSmallToFill =
      image.naturalWidth < MIN_NATURAL_PX ||
      image.naturalHeight < MIN_NATURAL_PX;

    if (!tooFarFromTile && !tooSmallToFill) return;
    this.contained.update((set) => new Set(set).add(src));
  }

  /** Cropped screenshots hold their top edge, where the interesting part of a
      screenshot almost always is; anything letterboxed gets a little air. */
  protected fitClass(src: string): string {
    return this.contained().has(src)
      ? 'object-contain p-1'
      : 'object-cover object-top';
  }

  /** Accessible labels for the icon-only media buttons, keyed by icon class. */
  private readonly MEDIA_LABELS: Record<string, string> = {
    'pi-github': 'View source on GitHub',
    'pi-youtube': 'Watch on YouTube',
    'pi-external-link': 'Open project',
  };

  mediaLabel(key: string): string {
    return this.MEDIA_LABELS[key] ?? 'Open link';
  }

  onMediaClick(url: string) {
    window.open(url, '_blank');
  }
}
