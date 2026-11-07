import type { ThingNode } from './kelly-graph';
import {
  CATEGORY_PHRASES,
  directPhrase,
  LEAF_PHRASES,
  thingPhrase,
} from './kelly-phrases.data';
import type { PyramidChoice, SentenceEnding } from './pyramid-scene';

/** Fallback for a name with no phrase written yet: the words, unhyphenated. */
const words = (label: string) => label.replace(/-/g, ' ');

/**
 * The rest of each chosen thing's sentence, keyed by thing id. Each is worded
 * for its own thing: a leaf shared between faces may hang from a category on
 * one and straight off the thing on the other, so the middle of the sentence —
 * the category's phrase, or the stand-in for a leaf with no category — is
 * chosen per thing. A leaf listed as two kinds under the same thing gets a part
 * for each — were "humour" also listed as a people bias: "kelly makes sense of
 * them through humour, and is biased toward humour".
 */
export function sentenceEndings(
  choice: PyramidChoice | null,
): Map<string, SentenceEnding> | null {
  if (!choice) return null;
  const { leaf } = choice;
  const categoryOf = (id: string) =>
    choice.categories.find((category) => category.id === id);
  const endings = new Map<string, SentenceEnding>();
  for (const thing of choice.things) {
    let parts: SentenceEnding['parts'];
    if (leaf) {
      // One part per line from this leaf to this thing, directly or through one
      // of its categories.
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
        // Parts that end the same way say it once, at the end: were
        // question-asking a people habit too, "makes sense of them, and
        // habitually connects with them by asking about their life".
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
    parts[0] = { ...parts[0]!, text: `kelly ${parts[0]!.text}` };
    endings.set(thing.id, { parts });
  }
  return endings;
}

/** The whole sentence, for screen readers: each chosen thing's, else just the
    opening of the one in front. */
export function spokenSentence(
  choice: PyramidChoice | null,
  front: ThingNode | null,
  endings: Map<string, SentenceEnding> | null,
): string {
  const chosen = choice?.things ?? [];
  const things = chosen.length ? chosen : front ? [front] : [];
  return things
    .map((thing) => {
      const { lead, name } = thingPhrase(thing.name, thing.label);
      const rest = endings
        ?.get(thing.id)
        ?.parts.map((part) => part.text)
        .join(', and ');
      return `${lead} ${name}${rest ? `, ${rest}` : ''}`;
    })
    .join('; ');
}
