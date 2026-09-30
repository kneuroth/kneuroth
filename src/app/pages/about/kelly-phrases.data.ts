import { CategoryKind, Kind } from './kelly-graph';

/*
 * The sentence under the pyramid: "<thing's lead> <thing>, kelly <category>
 * <leaf>" — e.g. "when approaching a problem, kelly habitually categorizes by
 * finding commonalities". kelly.json holds the names; these are the same names
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
  'sensemaking:contextualizing': 'does sensemaking contextually',
  'sensemaking:experiencing': 'makes sense through experience',
  'habit:visualizing': 'habitually visualizes',
  'habit:categorizing': 'habitually categorizes',
};

/**
 * Each leaf's phrase ends every sentence it's in, so a leaf under more than
 * one thing has to read after each of its middles: habit:commonality-finding
 * follows both "habitually categorizes" (problem-solving) and "habitually
 * connects with them" (people).
 */
export const LEAF_PHRASES: Record<`${Kind}:${string}`, string> = {
  'sensemaking:option-gathering': 'by gathering options',
  'sensemaking:boundary-defining': 'by defining the boundaries',
  'sensemaking:scope-defining': 'by defining the scope',
  'sensemaking:zooming-out': 'by zooming out',
  'sensemaking:own-word-forming': 'by putting it in his own words',
  'sensemaking:personna-assuming': 'by becoming a persona',
  'sensemaking:intuiting': 'by intuiting',
  'sensemaking:break-finding': 'by finding where things break',
  'sensemaking:commonality-finding': 'by finding commonalities',
  'sensemaking:being-silly': 'by being silly',
  'sensemaking:humour': 'through humour',

  'habit:map-creating': 'by creating maps',
  'habit:visual-aid': 'with visual aids',
  'habit:breaking-down': 'by breaking things down',
  'habit:group-naming': 'by distinguishing groups',
  'habit:commonality-finding': 'by finding commonalities',
  'habit:question-asking': 'by asking questions',

  'bias:solution-oriented':
    "toward a solution always existing, even when it doesn't",
  'bias:people-pleasing': 'toward pleasing people',
  'bias:humour': 'by a proclivity to find humour',
  'bias:function-centered': 'toward function',
  'bias:user-centered': 'toward the user experience',
};
