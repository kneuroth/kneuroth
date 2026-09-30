/** The shape of `public/kelly.json`. Mirrors the file; never written back. */
export interface KellyCategory {
  type: string;
  examples: string[];
}

/**
 * One "thing" — a subject Kelly makes sense of. Each is a face of the pyramid.
 * Sense-making and habits are listed either in categories or, as plain names,
 * straight under the thing (the way biases always are).
 */
export interface KellyThing {
  type: string;
  sensemaking?: (KellyCategory | string)[];
  habits?: (KellyCategory | string)[];
  biases?: string[];
}

export interface Kelly {
  things: KellyThing[];
}
