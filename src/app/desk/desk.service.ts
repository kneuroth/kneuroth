import { Injectable, signal } from '@angular/core';

/**
 * Whether the desk is currently projecting its surfaces.
 *
 * The answer is a media-query decision made inside the manifest (a photograph
 * framed for landscape can't hold a legible laptop screen on a portrait phone),
 * so the desk reports it rather than the page guessing at it: pages that need a
 * fallback read this signal instead of re-writing the breakpoint in CSS, where
 * it would drift out of step with the manifest.
 */
@Injectable({ providedIn: 'root' })
export class DeskService {
  /** True while the surfaces are angled onto the photo. */
  readonly projecting = signal(false);
}
