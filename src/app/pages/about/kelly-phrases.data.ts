import { CategoryKind, Kind } from './kelly-graph';

/*
 * The sentence under the pyramid: "<thing's lead> <thing>, kelly <category>
 * <leaf>" — e.g. "when approaching a problem, kelly habitually zooms out by
 * finding blindspots". kelly.json holds the names; these are the same names
 * reworded to read in that sentence. Keyed by kind and the name exactly as
 * it is in the file.
 *
 * Each category's phrase — or, for a leaf with no category, the stand-in —
 * carries its kind's word: "habitually", "makes sense", "is biased", so the
 * sentence also says what its colour means.
 */

/**
 * How each thing opens its sentence, keyed by its type in the file. `lead`
 * comes first; `name` is the word lit up as the thing itself.
 */
export const THING_PHRASES: Record<string, { lead: string; name: string }> = {
  'problem-solving': { lead: 'when approaching a', name: 'problem' },
  people: { lead: 'when interacting with', name: 'people' },
  design: { lead: 'when thinking about', name: 'design' },
};

/** A thing with no phrase written yet reads the way the others used to. */
export function thingPhrase(
  name: string,
  label: string,
): { lead: string; name: string } {
  return THING_PHRASES[name] ?? { lead: 'when thinking about', name: label };
}

/**
 * A leaf listed straight under its thing has no category to put between
 * "kelly" and its own phrase; this stands in for one. Every bias takes
 * BIAS_PHRASE. A habit or sense-making method takes one worded for its thing,
 * keyed by kind and the thing's type ("them" is the people), or else its
 * kind's general one.
 */
export const BIAS_PHRASE = 'is biased';

export const DIRECT_PHRASES: Record<`${CategoryKind}:${string}`, string> = {
  'sensemaking:people': 'makes sense of them',
  'habit:people': 'habitually connects with them',
  'habit:problem-solving': 'habitually tackles it',
  'habit:design': 'habitually looks at it',
};

const DIRECT_FALLBACK: Record<CategoryKind, string> = {
  sensemaking: 'makes sense of it',
  habit: 'habitually works through it',
};

export function directPhrase(kind: Kind, thing: string): string {
  if (kind === 'bias') return BIAS_PHRASE;
  return DIRECT_PHRASES[`${kind}:${thing}`] ?? DIRECT_FALLBACK[kind];
}

export const CATEGORY_PHRASES: Record<`${CategoryKind}:${string}`, string> = {
  'sensemaking:contextualizing': 'makes sense of it in context',
  'sensemaking:solution-exploring': 'makes sense of its possible solutions',
  'sensemaking:internalizing': 'makes sense of it from the inside',
  'sensemaking:empathizing': 'makes sense of them through empathy',
  'habit:zooming-out': 'habitually zooms out',
  'habit:documenting': 'habitually documents',
  'habit:joking': 'habitually brings humour',
  'habit:planning': 'habitually plans',
};

/**
 * Each leaf's phrase ends every sentence it's in, so a leaf under more than
 * one thing has to read after each of its middles: habit:map-making follows
 * both "habitually documents" (problem-solving) and "habitually plans"
 * (design).
 */
export const LEAF_PHRASES: Record<`${Kind}:${string}`, string> = {
  'sensemaking:whole-picture-seeing': 'by seeing the whole picture',
  'sensemaking:stakeholder-mapping': "by working out who is and isn't involved",
  'sensemaking:solution-generating': 'by thinking up several',
  'sensemaking:solution-categorizing': 'by sorting them into groups',
  'sensemaking:priority-weighing': 'by weighing their priorities',
  'sensemaking:problem-becoming': 'by becoming the problem',
  'sensemaking:first-hand-experiencing': 'by experiencing it first-hand',
  'sensemaking:own-word-phrasing': 'by rephrasing it',
  'sensemaking:humour': 'through humour',
  'sensemaking:connection-finding': 'by finding connections',
  'sensemaking:question-asking': 'by asking about their life',
  'sensemaking:listening': 'by listening',
  'sensemaking:shoe-standing': 'by standing in their shoes',
  'sensemaking:user-imagining':
    'by imagining the people who will experience it',
  'sensemaking:intuition-following': 'by following intuition',
  'sensemaking:edge-case-finding': 'by finding edge cases',

  'habit:solution-jumping': 'by jumping straight to solutions',
  'habit:context-seeking': 'by looking for more context',
  'habit:blindspot-finding': 'by finding blindspots',
  'habit:map-making': 'by mapping things out',
  'habit:note-taking': 'by writing down what matters',
  'habit:being-present': 'by being present',
  'habit:joke-making': 'by making jokes',
  'habit:laugh-finding': 'by finding what makes them laugh',
  'habit:rationale-finding': 'by figuring out why each choice was made',
  'habit:aesthetic-polishing':
    'by making sure it is aesthetically pleasing on top of its function',
  'habit:visualizing': 'by visualizing it',
  'habit:prototyping': 'by prototyping it',

  'bias:best-solution-seeking': 'toward finding the best solution',
  'bias:problem-skepticism':
    "toward skepticism of the problem as it's described",
  'bias:laughter-loving': 'toward people who enjoy laughing',
  'bias:comfort-seeking': 'toward people who are comfortable to be around',
  'bias:commonality-seeking': 'toward people with things in common',
  'bias:software-design': 'toward software design',
  'bias:tidiness': 'toward tidy designs',
  'bias:minimalism': 'toward minimalist designs',
  'bias:user-centered': 'toward designing for human usability',
};
