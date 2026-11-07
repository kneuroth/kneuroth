import { useEffect, useMemo, useRef, useState } from 'react';
// The sentence's ✕ is a library icon button, built by the scene outside React.
import '@/components/ui/glow-link.css';
import { Header } from '@/header';
import { buildKellyGraph, type ThingNode } from './kelly-graph';
import type { Kelly } from './kelly.model';
import kelly from './kelly.json';
import { PyramidScene, type PyramidChoice } from './pyramid-scene';
import { sentenceEndings, spokenSentence } from './sentence';
import './about.css';

const GRAPH = buildKellyGraph(kelly satisfies Kelly);

/**
 * kelly.json as a glass pyramid: one face per thing, named under its bottom
 * edge, with its categories on the glass — sense-making at the top, habits
 * bottom left, biases bottom right — and the exact habits, sense-making and
 * biases clustered round them, joined by straight lines. Each thing opens a
 * sentence under its face — "when approaching a problem" — that a chosen
 * category or leaf finishes right there, in its kind's colour.
 *
 * The scene (pyramid-scene.ts) is plain three.js and owns its own DOM and
 * render loop; this mounts it, holds what it reports, and writes the
 * sentence's words back into it. Lazy-loaded: three.js is only needed here.
 */
export function About() {
  const stage = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState<PyramidScene | null>(null);
  /** The thing whose face is toward the viewer. */
  const [front, setFront] = useState<ThingNode | null>(null);
  /** What the visitor chose, if anything. */
  const [choice, setChoice] = useState<PyramidChoice | null>(null);

  useEffect(() => {
    const scene = new PyramidScene(stage.current!, GRAPH, {
      front: setFront,
      choose: setChoice,
    });
    setScene(scene);
    return () => {
      scene.dispose();
      setScene(null);
    };
  }, []);

  const endings = useMemo(() => sentenceEndings(choice), [choice]);

  // Each ending is written under its thing's face, in the scene.
  useEffect(() => {
    scene?.finish(endings);
  }, [scene, endings]);

  return (
    <div className="kp-about">
      <Header />
      {/* PyramidScene fills this with the frost, the canvas and the label
          layer; drag turns it, the wheel or a pinch zooms, arrow keys step
          face to face. */}
      <div
        ref={stage}
        className="kp-stage"
        tabIndex={0}
        role="group"
        aria-label="how kelly makes sense of things — drag or use the arrow keys to turn it, scroll or pinch to zoom, and choose a word to trace it back"
      >
        {/* The sentence is drawn by the scene under each face's thing; this is
            the same sentence for screen readers, read out as it changes. */}
        <p className="kp-spoken" aria-live="polite">
          {spokenSentence(choice, front, endings)}
        </p>
      </div>
    </div>
  );
}
