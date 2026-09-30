import { CategoryKind, Kind } from './kelly-graph';

/*
 * The sentence under the pyramid: "when thinking about <thing>, kelly
 * <category> <leaf>". kelly.json holds the names; these are the same names
 * reworded to read in that sentence. Keyed by kind and the name exactly as
 * it is in the file.
 *
 * Each category's phrase carries its kind's word — "habitually", "makes sense
 * of it", "is biased" — so the sentence also says what its colour means.
 */

/** A bias has no category of its own; this stands in for one. */
export const BIAS_PHRASE = 'is biased';

export const CATEGORY_PHRASES: Record<`${CategoryKind}:${string}`, string> = {
  'sensemaking:contextual': 'does sensemaking contextually ',
  'sensemaking:experiential': 'makes sense through experience',
  'habit:visual': 'habitually visualizes',
  'habit:categorical': 'habitually categorizes',
};

export const LEAF_PHRASES: Record<`${Kind}:${string}`, string> = {
  'sensemaking:option-gathering': 'by gathering options',
  'sensemaking:boundary-defining': 'by defining the boundaries',
  'sensemaking:scope-defining': 'by defining the scope',
  'sensemaking:zooming-out': 'by zooming out',
  'sensemaking:own-word-forming': 'by putting it in his own words',
  'sensemaking:personna-assuming': 'by becoming a persona',
  'sensemaking:question-asking': 'by asking questions',
  'sensemaking:humour-centeredness': 'by being humourous',
  'sensemaking:sillyness-evaluating':
    "by silly-checking (it's similar to a vibe check)",
  'sensemaking:intuiting': 'by intuiting',
  'sensemaking:break-finding': 'by finding where things break',

  'habit:map-creating': 'by creating maps',
  'habit:visual-aid': 'with visual aids',
  'habit:breaking-down': 'by breaking things down',
  'habit:group-naming': 'by distinguishing groups',
  'habit:pattern-matching': 'by finding patterns',

  'bias:solution-oriented':
    "toward a solution always existing, even when it doesn't",
  'bias:people-pleasing': 'toward pleasing people',
  'bias:humour-sensitive': 'by a proclivity to find humour',
  'bias:function-centered': 'toward function',
  'bias:user-centered': 'toward the user experience',
};
