/** The shape of `public/kelly.json`. Mirrors the file; never written back. */
export interface KellyCategory {
  type: string;
  examples: string[];
}

/** One "thing" — a subject Kelly makes sense of. Each is a face of the pyramid. */
export interface KellyThing {
  type: string;
  sensemaking?: KellyCategory[];
  habits?: KellyCategory[];
  biases?: string[];
}

export interface Kelly {
  things: KellyThing[];
}
