import { Kelly, KellyCategory } from './kelly.model';

/** What a leaf is — and so which neon it wears. */
export type Kind = 'sensemaking' | 'habit' | 'bias';
export type CategoryKind = Exclude<Kind, 'bias'>;

/** A top-level thing: one face of the pyramid. */
export interface ThingNode {
  id: string;
  /** The type exactly as written in kelly.json. */
  name: string;
  label: string;
  face: number;
}

/** A broad habit or way of sense-making, drawn on its thing's face. */
export interface CategoryNode {
  id: string;
  /** The type exactly as written in kelly.json. */
  name: string;
  label: string;
  kind: CategoryKind;
  thing: string;
  face: number;
  leaves: string[];
}

/**
 * The lowest level — an exact habit, sense-making method or bias. `parents`
 * are category ids, or the thing id for a leaf listed straight under its thing
 * (every bias, and any habit or sense-making not in a category). A leaf named
 * under more than one thing is one leaf with several parents and faces — and
 * may hang from a category on one face and straight off the thing on another.
 */
export interface LeafNode {
  id: string;
  label: string;
  kind: Kind;
  parents: string[];
  faces: number[];
}

export interface KellyGraph {
  things: ThingNode[];
  categories: CategoryNode[];
  leaves: LeafNode[];
}

/** A triangular pyramid shows three sides; the base is never shown. */
const FACES = 3;

/**
 * Spelling fixes applied to what is drawn only — kelly.json itself is left
 * exactly as written. Words are matched between the hyphens.
 */
const SPELLING: Record<string, string> = {
  personna: 'persona',
  sillyness: 'silliness',
};

export function displayName(name: string): string {
  return name
    .split('-')
    .map((word) => SPELLING[word] ?? word)
    .join('-');
}

export function buildKellyGraph(kelly: Kelly): KellyGraph {
  const things: ThingNode[] = [];
  const categories: CategoryNode[] = [];
  const leaves = new Map<string, LeafNode>();

  const addLeaf = (
    kind: Kind,
    name: string,
    parent: string,
    face: number,
  ): string => {
    const id = `${kind}:${name}`;
    const leaf = leaves.get(id) ?? {
      id,
      label: displayName(name),
      kind,
      parents: [],
      faces: [],
    };
    leaves.set(id, leaf);
    if (!leaf.parents.includes(parent)) leaf.parents.push(parent);
    if (!leaf.faces.includes(face)) leaf.faces.push(face);
    return id;
  };

  kelly.things.slice(0, FACES).forEach((thing, face) => {
    const thingId = `thing:${thing.type}`;
    things.push({
      id: thingId,
      name: thing.type,
      label: displayName(thing.type),
      face,
    });

    const branches: [CategoryKind, (KellyCategory | string)[] | undefined][] = [
      ['sensemaking', thing.sensemaking],
      ['habit', thing.habits],
    ];
    for (const [kind, list] of branches) {
      for (const category of list ?? []) {
        // A plain name is a leaf straight under the thing, like a bias.
        if (typeof category === 'string') {
          addLeaf(kind, category, thingId, face);
          continue;
        }
        const id = `${thingId}/${kind}/${category.type}`;
        categories.push({
          id,
          name: category.type,
          label: displayName(category.type),
          kind,
          thing: thingId,
          face,
          leaves: category.examples.map((example) =>
            addLeaf(kind, example, id, face),
          ),
        });
      }
    }

    for (const bias of thing.biases ?? []) addLeaf('bias', bias, thingId, face);
  });

  return { things, categories, leaves: [...leaves.values()] };
}
