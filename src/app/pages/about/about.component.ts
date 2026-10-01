import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  NgZone,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { HeaderComponent } from '@app/header/header.component';
import kelly from '../../../../public/kelly.json';
import { buildKellyGraph, ThingNode } from './kelly-graph';
import {
  CATEGORY_PHRASES,
  directPhrase,
  LEAF_PHRASES,
  thingPhrase,
} from './kelly-phrases.data';
import { Kelly } from './kelly.model';
import { PyramidChoice, PyramidScene, SentenceEnding } from './pyramid-scene';

const KELLY: Kelly = kelly;

/** Fallback for a name with no phrase written yet: the words, unhyphenated. */
const words = (label: string) => label.replace(/-/g, ' ');

/**
 * kelly.json as a glass pyramid: one face per thing, named under its bottom
 * edge, with its categories on the glass — sense-making at the top, habits
 * bottom left, biases bottom right — and the exact habits, sense-making and
 * biases clustered round them, joined by straight lines. Each thing opens a
 * sentence under its face — "when approaching a problem" — that a chosen
 * category or leaf finishes right there, in its kind's colour. The scene
 * lives in `pyramid-scene.ts`; this mounts it and writes the sentence's words.
 *
 * Unencapsulated because the scene builds its labels itself, outside Angular's
 * templates — every selector in the stylesheet is scoped under `app-about`.
 */
@Component({
  selector: 'app-about',
  imports: [HeaderComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class AboutComponent {
  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');

  /** The thing whose face is toward the viewer. */
  private readonly front = signal<ThingNode | null>(null);
  /** What the visitor chose, if anything. */
  private readonly choice = signal<PyramidChoice | null>(null);

  /**
   * The rest of each chosen thing's sentence, keyed by thing id. Each is
   * worded for its own thing: a leaf shared between faces may hang from a
   * category on one and straight off the thing on the other, so the middle of
   * the sentence — the category's phrase, or the stand-in for a leaf with no
   * category — is chosen per thing. A leaf listed as two kinds under the same
   * thing gets a part for each: "kelly makes sense of them through humour,
   * and is biased by a proclivity to find humour".
   */
  protected readonly endings = computed(() => {
    const choice = this.choice();
    if (!choice) return null;
    const { leaf } = choice;
    const categoryOf = (id: string) =>
      choice.categories.find((category) => category.id === id);
    const endings = new Map<string, SentenceEnding>();
    for (const thing of choice.things) {
      let parts: SentenceEnding['parts'];
      if (leaf) {
        // One part per line from this leaf to this thing, directly or
        // through one of its categories.
        parts = leaf.links
          .filter(
            (link) =>
              link.parent === thing.id ||
              categoryOf(link.parent)?.thing === thing.id,
          )
          .map((link) => {
            const category = categoryOf(link.parent);
            const middle = category
              ? (CATEGORY_PHRASES[`${category.kind}:${category.name}`] ??
                words(category.label))
              : directPhrase(link.kind, thing.name);
            const end =
              LEAF_PHRASES[`${link.kind}:${leaf.name}`] ?? words(leaf.label);
            return { kind: link.kind, middle: middle.trim(), end };
          })
          // Parts that end the same way say it once, at the end: "makes
          // sense of them, and habitually connects with them by finding
          // commonalities".
          .map((part, i, all) => ({
            kind: part.kind,
            text:
              i < all.length - 1 && all.every((p) => p.end === part.end)
                ? part.middle
                : `${part.middle} ${part.end}`,
          }));
      } else {
        parts = choice.categories
          .filter((category) => category.thing === thing.id)
          .map((category) => ({
            kind: category.kind,
            text: (
              CATEGORY_PHRASES[`${category.kind}:${category.name}`] ??
              words(category.label)
            ).trim(),
          }));
      }
      if (!parts.length) continue;
      parts[0] = { ...parts[0], text: `kelly ${parts[0].text}` };
      endings.set(thing.id, { parts });
    }
    return endings;
  });

  /** The whole sentence, for screen readers: each chosen thing's, else just
      the opening of the one in front. */
  protected readonly spoken = computed(() => {
    const chosen = this.choice()?.things ?? [];
    const front = this.front();
    const things = chosen.length ? chosen : front ? [front] : [];
    const endings = this.endings();
    return things
      .map((thing) => {
        const { lead, name } = thingPhrase(thing.name, thing.label);
        const ending = endings?.get(thing.id);
        const rest = ending?.parts.map((part) => part.text).join(', and ');
        return `${lead} ${name}${rest ? `, ${rest}` : ''}`;
      })
      .join('; ');
  });

  private readonly scene = signal<PyramidScene | null>(null);

  constructor() {
    const destroyRef = inject(DestroyRef);
    const zone = inject(NgZone);

    // Each ending is written under its thing's face, in the scene.
    effect(() => {
      const endings = this.endings();
      this.scene()?.finish(endings);
    });

    afterNextRender(() => {
      // The render loop runs every frame; keep it out of change detection,
      // and step back in only when the sentence has something new to say.
      const scene = zone.runOutsideAngular(
        () =>
          new PyramidScene(this.stage().nativeElement, buildKellyGraph(KELLY), {
            front: (thing) => zone.run(() => this.front.set(thing)),
            choose: (choice) => zone.run(() => this.choice.set(choice)),
          }),
      );
      this.scene.set(scene);
      destroyRef.onDestroy(() => scene.dispose());
    });
  }
}
