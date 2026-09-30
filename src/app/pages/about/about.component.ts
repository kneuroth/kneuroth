import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  NgZone,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { HeaderComponent } from '@app/header/header.component';
import { GlowButtonComponent } from '@shared/ui/glow-button/glow-button.component';
import kelly from '../../../../public/kelly.json';
import { buildKellyGraph, Kind, ThingNode } from './kelly-graph';
import {
  BIAS_PHRASE,
  CATEGORY_PHRASES,
  LEAF_PHRASES,
} from './kelly-phrases.data';
import { Kelly } from './kelly.model';
import { PyramidChoice, PyramidScene } from './pyramid-scene';

const KELLY: Kelly = kelly;

/** Fallback for a name with no phrase written yet: the words, unhyphenated. */
const words = (label: string) => label.replace(/-/g, ' ');

/**
 * kelly.json as a glass pyramid: one face per thing, named under its bottom
 * edge, its categories on the glass, the exact habits, sense-making and biases
 * floating on threads in front. Under it, one sentence — "when thinking about
 * <the thing facing you>" — that a chosen category or leaf finishes, in its
 * kind's colour. The scene lives in `pyramid-scene.ts`; this mounts it and
 * writes the sentence.
 *
 * Unencapsulated because the scene builds its labels itself, outside Angular's
 * templates — every selector in the stylesheet is scoped under `app-about`.
 */
@Component({
  selector: 'app-about',
  imports: [HeaderComponent, GlowButtonComponent],
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

  /** The things the sentence is about: the choice's, else the one in front. */
  protected readonly subject = computed(() => {
    const things = this.choice()?.things ?? [];
    const front = this.front();
    const labels = things.length
      ? things.map((thing) => thing.label)
      : front
        ? [front.label]
        : [];
    return labels.join(' and ');
  });

  /** The rest of the sentence, and the kind that colours it. */
  protected readonly ending = computed(() => {
    const choice = this.choice();
    if (!choice) return null;
    const { leaf } = choice;
    const category = choice.categories[0];
    const kind: Kind = leaf?.kind ?? category?.kind ?? 'habit';

    const middle =
      leaf?.kind === 'bias'
        ? BIAS_PHRASE
        : category
          ? (CATEGORY_PHRASES[`${category.kind}:${category.name}`] ??
            words(category.label))
          : '';
    const end = leaf
      ? (LEAF_PHRASES[leaf.id as `${Kind}:${string}`] ?? words(leaf.label))
      : '';
    return { kind, text: ['kelly', middle, end].filter(Boolean).join(' ') };
  });

  private scene: PyramidScene | null = null;

  /** The sentence's X: drop the choice, back to just the thing in front. */
  protected clear(): void {
    this.scene?.clearSelection();
  }

  constructor() {
    const destroyRef = inject(DestroyRef);
    const zone = inject(NgZone);

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
      this.scene = scene;
      destroyRef.onDestroy(() => scene.dispose());
    });
  }
}
