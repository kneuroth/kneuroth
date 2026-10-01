import * as THREE from 'three';
import {
  CSS3DObject,
  CSS3DRenderer,
} from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import {
  CategoryNode,
  Kind,
  KellyGraph,
  LeafNode,
  ThingNode,
} from './kelly-graph';
import { thingPhrase } from './kelly-phrases.data';

/* ── Geometry ─────────────────────────────────────────────────────────────
   A regular tetrahedron centred on the origin: apex up, base down. Faces 0–2
   are the three things; the base is never drawn and never shown. */

/** The tetrahedron's edge length. */
const EDGE = 4.6;
/** A side face's normal leans up by asin(1/3); this tilt stands it square. */
const REST_TILT = Math.asin(1 / 3);
/** Tilt is x-axis rotation. Below level the camera would see the base. */
const TILT_MIN = 0;
const TILT_MAX = 0.8;
/** Lifts drawn marks just off the glass. */
const SURFACE = 0.01;

/* ── Layout (see `layoutSurface`) ─────────────────────────────────────── */

/** Each kind's zone sits this far from a face's centre toward its corner:
    sense-making the apex, habits the bottom left, biases the bottom right.
    The apex is narrow, so sense-making stays nearer the middle. */
const ZONE_REACH: Record<Kind, number> = {
  sensemaking: 0.3,
  habit: 0.4,
  bias: 0.4,
};
/** Clusters sharing a zone start one above the other, this far apart and
    leaning this far aside; between two zones, side by side this far apart. */
const HUB_GAP = 1.1;
const HUB_GAP_UP = 0.75;
const HUB_LEAN = 0.35;
/** A category's leaves hang this far to its side, the first row this far
    below it and each row after this much lower. */
const LEAF_SIDE = 0.3;
const LEAF_DROP = 0.15;
const LEAF_ROW = 0.2;
/** Labels stay this far inside the face's edges, and this far apart. */
const SURFACE_MARGIN = 0.06;
const LABEL_GAP = 0.05;
/** Nudging labels apart: this many rounds, each drawing every label back
    this much of the way toward where it belongs, then a few more with no
    pull, so none is left overlapping. */
const SETTLE_STEPS = 400;
const SETTLE_PULL = 0.04;
const SETTLE_FINISH = 100;

/** Labels are printed flat on the glass (CSS3D), so their size is in world
    units: FLAT_PX-pixel type, each CSS pixel FLAT_SCALE world units. The
    rest matches `.kp-node` in the stylesheet — a monospace face (0.6em a
    character), a 1.2 line height, the tag's padding, a category's rise above
    its dot — so the layout knows each label's true footprint. */
const FLAT_PX = 20;
const FLAT_SCALE = 0.0043;
const FLAT_CHAR = 0.6 * FLAT_PX * FLAT_SCALE;
const FLAT_PAD_X = 8 * FLAT_SCALE;
const FLAT_DROP = 8 * FLAT_SCALE;
/** A leaf's dot radius, and where its words start beside it (`.kp-leaf`). */
const FLAT_DOT = 6 * FLAT_SCALE;
const FLAT_BESIDE = 14 * FLAT_SCALE;
/** Categories, and leaves with no category, are this much bigger
    (`.kp-category`, `.kp-big`). */
const FLAT_BIG = 1.15;

/* ── Camera ───────────────────────────────────────────────────────────── */
/** The radius the camera frames at zoom 1; zooming in stops this far from
    the centre. */
const FIT_RADIUS = 3.5;
const MIN_DISTANCE = 3.4;
/** The view centre's height. */
const VIEW_Y = 0.1;
/** How far the view can drift off centre when zoomed right in, and the floor
    that keeps the camera above the base plane, so the base never shows. */
const PAN_EXTENT = 3.6;
const PAN_FLOOR = -0.8;
const WHEEL_ZOOM = 0.0015;

/* ── Motion ───────────────────────────────────────────────────────────── */
/** The opening spin: full speed for INTRO_HOLD, then eases out onto the face
    of the leaf picked to show first (see the constructor). */
const INTRO_SPEED = 9;
const INTRO_HOLD = 0.5;

const DRAG_YAW = 0.008;
const DRAG_TILT = 0.006;
const INERTIA = 3.5;
const FOCUS_RATE = 5;
const SEGMENTS = 32;

/** The propagation up: leaf → category, then category → thing. */
const THREAD_TIME = 0.45;
const STEM_TIME = 0.4;
/** While something is chosen, everything else drops to this. On top of that,
    faces other than the front one are dimmed by `presence()`. Labels only
    step back a little — they're still what you press next, so they have to
    stay readable; the chosen chain stands out by its glow, not by the rest
    fading. The lines can go further, they're just scenery. */
const DIM_LABEL = 0.85;
const DIM_LINE = 0.4;

const KIND_TOKEN: Record<Kind, string> = {
  bias: '--neon-bias',
  habit: '--neon-habit',
  sensemaking: '--neon-sensemaking',
};

interface Face {
  apex: THREE.Vector3;
  left: THREE.Vector3;
  right: THREE.Vector3;
  centroid: THREE.Vector3;
  normal: THREE.Vector3;
  tangent: THREE.Vector3;
  up: THREE.Vector3;
  /** Direction the face looks, as a yaw from +z. */
  angle: number;
}

interface ThingState {
  node: ThingNode;
  root: HTMLElement;
  local: THREE.Vector3;
  /** Where the chosen sentence's ending is written, after the thing's name. */
  ending: HTMLElement;
}

interface CategoryState {
  node: CategoryNode;
  root: HTMLElement;
  button: HTMLButtonElement;
  object: CSS3DObject;
  /** Shared with its leaves' threads as their anchor — move it in place. */
  local: THREE.Vector3;
  stem: Strand;
}

interface Thread {
  parent: string;
  /** The kind this line joins the leaf as — and so its colour. */
  kind: Kind;
  anchor: THREE.Vector3;
  strand: Strand;
}

interface LeafState {
  node: LeafNode;
  root: HTMLElement;
  button: HTMLButtonElement;
  object: CSS3DObject;
  rest: THREE.Vector3;
  /** Out from the glass: its face's normal, or its faces' between them. */
  lift: THREE.Vector3;
  /** Listed under no category anywhere, so drawn bigger (`.kp-big`). */
  big: boolean;
  threads: Thread[];
}

/** What was chosen: a leaf, or a category on its own. */
interface Selection {
  button: HTMLButtonElement;
  leaf: LeafState | null;
  at: number;
  categories: Set<string>;
  things: Set<string>;
}

interface Press {
  id: number;
  x: number;
  y: number;
  lastX: number;
  lastY: number;
  lastT: number;
  moved: boolean;
  onNode: boolean;
}

/** A choice as the page sees it — enough to finish the sentence. */
export interface PyramidChoice {
  leaf: LeafNode | null;
  categories: CategoryNode[];
  things: ThingNode[];
}

/**
 * The rest of one thing's sentence: one part per way the choice hangs off
 * that thing — usually one, but a leaf listed as two kinds under the same
 * thing has a part for each — each in its own kind's colour.
 */
export interface SentenceEnding {
  parts: { kind: Kind; text: string }[];
}

export interface PyramidEvents {
  /** The thing whose face is most squarely toward the viewer changed. */
  front(thing: ThingNode): void;
  /** A leaf or category was chosen, or the choice cleared (null). */
  choose(choice: PyramidChoice | null): void;
}

interface Point {
  x: number;
  y: number;
}

/** A rectangle in a face's plane coordinates. */
interface Rect {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

/** A label being laid out on a face: its dot at (x, y), the room it takes
    around the dot, and where it would rather be. */
interface Spot extends Point {
  box: Rect;
  fixed: boolean;
  home: () => Point;
}

/**
 * The about page's pyramid: kelly.json drawn on a glass tetrahedron. Each side
 * face is a thing, with its categories and their leaves — the exact habits,
 * sense-making methods and biases — printed on the glass (see
 * `layoutSurface`). Choosing one lights the path back down to its thing,
 * leaving the pyramid where it is.
 *
 * Plain three.js, mounted into `stage` and torn down by `dispose()`. Labels are
 * real DOM so they are readable, focusable buttons, laid flat on their face
 * (CSS3DRenderer). Under each face its thing opens a sentence — "when
 * approaching a problem" (see THING_PHRASES) — that a choice finishes; the
 * frosted blur is a CSS backdrop-filter clipped to the pyramid's projected
 * outline, which is the only way the glass can blur the photograph behind the
 * canvas.
 */
export class PyramidScene {
  private readonly renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  private readonly labels = new CSS3DRenderer();
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  private readonly group = new THREE.Group();
  private readonly frost = document.createElement('div');
  private readonly faces = buildFaces(EDGE);
  private readonly corners: THREE.Vector3[];
  private readonly faceMeshes: THREE.Mesh<
    THREE.BufferGeometry,
    THREE.MeshBasicMaterial
  >[] = [];
  private readonly edges: { line: Line2; faces: number[] }[] = [];
  private readonly things = new Map<string, ThingState>();
  private readonly categories = new Map<string, CategoryState>();
  private readonly leaves: LeafState[] = [];
  private readonly facing = [0, 0, 0];
  private readonly faceNormals = this.faces.map(() => new THREE.Vector3());
  private readonly colors: Record<Kind, THREE.Color>;
  private readonly reducedMotion = matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  private readonly dpr = Math.min(window.devicePixelRatio || 1, 2);
  private readonly resize = new ResizeObserver(() => this.fit());

  private yaw = 0;
  private tilt = REST_TILT;
  private yawVel = 0;
  private tiltVel = 0;
  private intro: number | null = null;
  private focus: { yaw: number; tilt: number } | null = null;
  private press: Press | null = null;
  /** Every pointer down on the stage — two at once is a pinch. */
  private readonly pointers = new Map<number, { x: number; y: number }>();
  /** A pinch in progress: the zoom it began at, the finger spread, and the
      world point under the fingers, which stays under them as they move. */
  private pinch: { zoom: number; spread: number; x: number; y: number } | null =
    null;
  private zoom = 1;
  private maxZoom = 1;
  private fitDistance = 10;
  private readonly pan = new THREE.Vector2();
  private suppressClick = false;
  private selection: Selection | null = null;
  private front: ThingNode | null = null;
  private width = 1;
  private height = 1;
  private raf = 0;
  private last = 0;
  /** The spin's total turn: once round and on, to end square on to the
      picked leaf's face. */
  private introYaw = Math.PI * 2;
  /** The leaf lit once the opening spin has settled. */
  private pending: LeafState | null = null;
  private introDecay = 0;

  // Scratch space for the render loop, so a frame allocates nothing.
  private readonly tmp = new THREE.Vector3();
  private readonly toCamera = new THREE.Vector3();

  constructor(
    private readonly stage: HTMLElement,
    graph: KellyGraph,
    private readonly events: PyramidEvents,
  ) {
    const style = getComputedStyle(stage);
    const token = (name: string, fallback: string) =>
      new THREE.Color(style.getPropertyValue(name).trim() || fallback);
    this.colors = {
      bias: token(KIND_TOKEN.bias, '#ff3131'),
      habit: token(KIND_TOKEN.habit, '#39ff14'),
      sensemaking: token(KIND_TOKEN.sensemaking, '#1f8fff'),
    };

    this.frost.className = 'kp-frost';
    this.renderer.setPixelRatio(this.dpr);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.domElement.className = 'kp-canvas';
    this.labels.domElement.className = 'kp-labels';
    stage.append(this.frost, this.renderer.domElement, this.labels.domElement);

    this.scene.add(this.group);
    this.corners = [this.faces[0].apex, ...this.faces.map((f) => f.left)];

    this.buildGlass();
    this.buildNodes(graph);

    stage.addEventListener('pointerdown', this.onPointerDown);
    stage.addEventListener('keydown', this.onKeyDown);
    // Not passive: the wheel zooms the pyramid instead of scrolling the page.
    stage.addEventListener('wheel', this.onWheel, { passive: false });
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('pointercancel', this.onPointerUp);
    this.resize.observe(stage);
    this.fit();

    // Open on a random leaf: the spin settles with its face (or, for a shared
    // leaf, its edge) toward the viewer, and then its pathway lights up.
    const pick = this.leaves[Math.floor(Math.random() * this.leaves.length)];
    if (pick) {
      let sin = 0;
      let cos = 0;
      for (const f of pick.node.faces) {
        sin += Math.sin(this.faces[f].angle);
        cos += Math.cos(this.faces[f].angle);
      }
      const turn = Math.PI * 2;
      const facing = ((-Math.atan2(sin, cos) % turn) + turn) % turn;
      this.introYaw = turn + facing;
      if (this.reducedMotion) this.yaw = facing;
      this.pending = pick;
    }
    this.introDecay = INTRO_SPEED / (this.introYaw - INTRO_SPEED * INTRO_HOLD);
    if (!this.reducedMotion) this.intro = performance.now() / 1000;
    this.last = performance.now() / 1000;
    this.raf = requestAnimationFrame(this.frame);
  }

  dispose(): void {
    cancelAnimationFrame(this.raf);
    this.resize.disconnect();
    this.stage.removeEventListener('pointerdown', this.onPointerDown);
    this.stage.removeEventListener('keydown', this.onKeyDown);
    this.stage.removeEventListener('wheel', this.onWheel);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('pointercancel', this.onPointerUp);
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh || object instanceof Line2) {
        object.geometry.dispose();
        (object.material as THREE.Material).dispose();
      }
    });
    this.renderer.dispose();
    this.frost.remove();
    this.renderer.domElement.remove();
    this.labels.domElement.remove();
  }

  /* ── Construction ─────────────────────────────────────────────────────── */

  /** Three glass faces and six edges. The base gets edges but no pane. */
  private buildGlass(): void {
    for (const face of this.faces) {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        face.apex,
        face.left,
        face.right,
      ]);
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.05,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geometry, material);
      this.group.add(mesh);
      this.faceMeshes.push(mesh);
    }

    const [apex] = this.corners;
    const base = this.corners.slice(1);
    const pairs: [THREE.Vector3, THREE.Vector3, number[]][] = [
      // Apex edges sit between two side faces; base edges border one.
      [apex, base[0], [0, 2]],
      [apex, base[1], [0, 1]],
      [apex, base[2], [1, 2]],
      [base[0], base[1], [0]],
      [base[1], base[2], [1]],
      [base[2], base[0], [2]],
    ];
    for (const [a, b, faces] of pairs) {
      const line = makeLine(new THREE.Color(0xffffff), 1 * this.dpr, 0.75, 2);
      writeLine(line, [a, b]);
      this.group.add(line);
      this.edges.push({ line, faces });
    }
  }

  private buildNodes(graph: KellyGraph): void {
    for (const node of graph.things) {
      const face = this.faces[node.face];
      // The thing sits right on the middle of the base edge, where its lines
      // end, and its sentence is printed on the face's plane carried on down
      // past that edge, turning with the pyramid like everything else.
      const local = facePoint(face, 0, 1).addScaledVector(face.normal, SURFACE);
      const { root, ending } = thingElement(
        thingPhrase(node.name, node.label),
        () => this.clearSelection(),
      );
      const object = flatObject(root);
      object.position.copy(local);
      object.quaternion.setFromRotationMatrix(faceBasis(face));
      this.group.add(object);
      this.things.set(node.id, { node, root, local, ending });
    }

    for (const node of graph.categories) {
      const root = nodeElement(`kp-category kp-${node.kind}`, node.label);
      const button = pressable(root, `${node.label}, ${node.kind}`, () =>
        this.select(null, category),
      );
      const object = flatObject(root);
      this.group.add(object);
      const category: CategoryState = {
        node,
        root,
        button,
        object,
        local: new THREE.Vector3(),
        stem: new Strand(this.group, this.colors[node.kind], this.dpr),
      };
      this.categories.set(node.id, category);
    }

    for (const node of graph.leaves) this.leaves.push(this.buildLeaf(node));
    this.layoutSurface();
  }

  private buildLeaf(node: LeafNode): LeafState {
    // Its words sit beside its dot, clear of the lines that meet there.
    const root = nodeElement(`kp-leaf kp-${node.kind}`, node.label);
    const button = pressable(
      root,
      `${node.label}, ${node.kinds.join(' and ')}`,
      () => this.select(leaf, null),
    );
    // A leaf of more than one kind wears its second colour too (see
    // .kp-multi); each of its lines is in its own kind's.
    if (node.kinds.length > 1) {
      root.classList.add('kp-multi');
      root.style.setProperty('--kind-2', `var(${KIND_TOKEN[node.kinds[1]]})`);
    }
    // A leaf under no category stands in for one, so it's as big as one.
    const big = node.links.every((link) => !this.categories.has(link.parent));
    root.classList.toggle('kp-big', big);
    const object = flatObject(root);
    this.group.add(object);

    const lift = new THREE.Vector3();
    for (const f of node.faces) lift.add(this.faces[f].normal);
    lift.normalize();

    const threads = node.links.map(
      ({ parent, kind }): Thread => ({
        parent,
        kind,
        anchor:
          this.categories.get(parent)?.local ??
          this.things.get(parent)?.local ??
          new THREE.Vector3(),
        strand: new Strand(this.group, this.colors[kind], this.dpr),
      }),
    );

    const leaf: LeafState = {
      node,
      root,
      button,
      object,
      rest: new THREE.Vector3(),
      lift,
      big,
      threads,
    };
    return leaf;
  }

  /**
   * Lays everything on the glass.
   *
   * Each face has a zone per kind — sense-making at the top, habits bottom
   * left, biases bottom right — and each category sits in its kind's zone
   * with its leaves clustered just below it, clear of its name above. A leaf
   * under no category is
   * a cluster of its own, in its kind's zone (between two zones, if it's two
   * kinds). A leaf on two faces sits on the edge between them, as high as
   * what it hangs from; one on all three, on the apex.
   *
   * Then labels that overlap are nudged apart, each drawn back toward where
   * it belongs, until none do. Every line is straight: leaf to category, and
   * category — or leaf under no category — to the thing at the middle of the
   * base.
   */
  private layoutSurface(): void {
    const { faces } = this;
    const bounds = triangle(EDGE);
    const zoneOf = (kind: Kind): Point => {
      const corner =
        kind === 'sensemaking'
          ? { x: 0, y: bounds.apexY }
          : { x: ((kind === 'habit' ? -1 : 1) * EDGE) / 2, y: bounds.baseY };
      const reach = ZONE_REACH[kind];
      return { x: corner.x * reach, y: corner.y * reach };
    };
    const thingOn = (k: number) =>
      [...this.things.values()].find((thing) => thing.node.face === k);
    const onOneFace = (leaf: LeafState) => leaf.node.faces.length === 1;
    const sizeOf = (leaf: LeafState) => (leaf.big ? FLAT_BIG : 1);
    const leafBox = (leaf: LeafState, left: boolean) =>
      leafRectAt(
        0,
        0,
        flatWidth(leaf.node.label, sizeOf(leaf)),
        flatHeight(sizeOf(leaf)),
        left,
      );

    // The clusters' centres — categories, and leaves under no category on
    // their face — each in its zone, spread out where they share one.
    const hubs = new Map<string, Spot>();
    const words = new Map<LeafState, boolean>();
    for (let k = 0; k < faces.length; k++) {
      const groups = new Map<string, { id: string; box: Rect }[]>();
      const join = (kinds: Kind[], id: string, box: Rect) => {
        const key = [...new Set(kinds)].sort().join('+');
        groups.set(key, [...(groups.get(key) ?? []), { id, box }]);
      };
      for (const category of this.categories.values()) {
        if (category.node.face !== k) continue;
        const w = flatWidth(category.node.label, FLAT_BIG);
        join([category.node.kind], category.node.id, {
          x0: -w / 2,
          x1: w / 2,
          y0: -FLAT_DOT,
          y1: FLAT_DROP + flatHeight(FLAT_BIG),
        });
      }
      for (const leaf of this.leaves) {
        const direct = leaf.node.links.filter((l) => this.things.has(l.parent));
        if (!onOneFace(leaf) || leaf.node.faces[0] !== k || !direct.length) {
          continue;
        }
        // Its words lead away from the face's middle, where its line runs.
        const at = mean(direct.map((l) => zoneOf(l.kind)));
        const left = at.x < -0.01;
        words.set(leaf, left);
        join(
          direct.map((l) => l.kind),
          leaf.node.id,
          leafBox(leaf, left),
        );
      }
      for (const [key, group] of groups) {
        const at = mean(key.split('+').map((kind) => zoneOf(kind as Kind)));
        // Stacked in the narrow top, the bigger clusters go lower, where the
        // face is wider.
        const size = (id: string) =>
          this.categories.get(id)?.node.leaves.length ?? 0;
        group.sort((a, b) => size(a.id) - size(b.id));
        group.forEach(({ id, box }, i) => {
          const along = i - (group.length - 1) / 2;
          // One above the other, they lean alternately left and right, so
          // the upper one's stem runs down past the lower one's name.
          // In a bottom corner each lower one steps out toward the corner,
          // for the same reason; clusters between two zones sit side by side.
          const lean = group.length > 1 ? (i % 2 ? 1 : -1) * HUB_LEAN : 0;
          const corner = key === 'habit' ? -1 : key === 'bias' ? 1 : 0;
          const home =
            key === 'sensemaking'
              ? { x: at.x + lean, y: at.y - along * HUB_GAP_UP }
              : corner
                ? {
                    x: at.x + corner * along * HUB_LEAN,
                    y: at.y - along * HUB_GAP_UP,
                  }
                : { x: at.x + along * HUB_GAP, y: at.y };
          hubs.set(id, { ...home, box, fixed: false, home: () => home });
        });
      }
    }
    /** Where a leaf's line leads on its face: its category, or for a leaf
        straight under the thing, its kind's zone. */
    const towards = (link: LeafNode['links'][number]): Point =>
      hubs.get(link.parent) ?? zoneOf(link.kind);

    // Leaves on more than one face: on the edge between them, about as high
    // as what they hang from, words on the face fewer of their lines reach.
    const slant = bounds.apexY - bounds.baseY;
    const shared = this.leaves.filter((leaf) => !onOneFace(leaf));
    const wordsOn = new Map<LeafState, number>();
    for (const leaf of shared) {
      const { faces: on, links } = leaf.node;
      if (on.length > 2) {
        leaf.rest.copy(faces[0].apex);
        wordsOn.set(leaf, on[0]);
        words.set(leaf, false);
      } else {
        const [j, k] = on;
        // Face k spans base vertices k and k+1; the shared one is the edge,
        // the left side of face `vertex` and the right of the one before.
        const vertex =
          [j, (j + 1) % 3].find((v) => v === k || v === (k + 1) % 3) ?? j;
        const before = (vertex + 2) % 3;
        const y = mean(links.map(towards)).y;
        const t = clamp((y - bounds.baseY) / slant, 0.15, 0.75);
        leaf.rest.lerpVectors(faces[vertex].left, faces[0].apex, t);
        const into = (f: number) => links.filter((l) => l.face === f).length;
        const left = into(vertex) > into(before);
        wordsOn.set(leaf, left ? before : vertex);
        words.set(leaf, left);
      }
      leaf.rest.addScaledVector(leaf.lift, SURFACE);
    }

    for (let k = 0; k < faces.length; k++) {
      const face = faces[k];
      const thing = thingOn(k);
      if (!thing) continue;
      const base = planePoint(face, thing.local);
      const spots: Spot[] = [];

      // Shared leaves are already in place: their words, on the face they
      // lie on, and just their dot on the other.
      for (const leaf of shared) {
        if (!leaf.node.faces.includes(k)) continue;
        const at = planePoint(face, leaf.rest);
        const box =
          wordsOn.get(leaf) === k
            ? leafBox(leaf, !!words.get(leaf))
            : { x0: -FLAT_DOT, x1: FLAT_DOT, y0: -FLAT_DOT, y1: FLAT_DOT };
        spots.push({ ...at, box, fixed: true, home: () => at });
      }

      const placed = new Map<string, Spot>();
      for (const category of this.categories.values()) {
        const hub = hubs.get(category.node.id);
        if (category.node.face === k && hub) placed.set(category.node.id, hub);
      }
      for (const leaf of this.leaves) {
        const hub = hubs.get(leaf.node.id);
        if (hub && leaf.node.faces[0] === k) placed.set(leaf.node.id, hub);
      }
      spots.push(...placed.values());

      // Each category's own leaves hang just below it in rows: either side
      // of it in the middle of the face, where its stem runs straight down
      // between them, or on its outer side in a bottom corner, clear of a
      // stem that runs off inward.
      const leafSpots = new Map<LeafState, Spot>();
      for (const category of this.categories.values()) {
        const hub = hubs.get(category.node.id);
        if (category.node.face !== k || !hub) continue;
        const own = this.leaves.filter(
          (leaf) =>
            onOneFace(leaf) &&
            !hubs.has(leaf.node.id) &&
            !leafSpots.has(leaf) &&
            leaf.node.parents.includes(category.node.id),
        );
        const outer = Math.sign(hub.x - base.x) || 1;
        const both = Math.abs(hub.x - base.x) < LEAF_SIDE;
        own.forEach((leaf, i) => {
          const side = both && i % 2 ? -outer : outer;
          const row = both ? Math.floor(i / 2) : i;
          const offset = {
            x: side * LEAF_SIDE,
            y: -(LEAF_DROP + row * LEAF_ROW),
          };
          // Drawn toward all its categories here, at its place round the first.
          const parents = leaf.node.parents.flatMap((id) => {
            const spot = placed.get(id);
            return spot ? [spot] : [];
          });
          const home = () => {
            const at = mean(parents);
            return { x: at.x + offset.x, y: at.y + offset.y };
          };
          const left = offset.x < -0.01;
          words.set(leaf, left);
          const spot = {
            ...home(),
            box: leafBox(leaf, left),
            fixed: false,
            home,
          };
          leafSpots.set(leaf, spot);
          spots.push(spot);
        });
      }

      // Where each leaf placed here has its lines run to.
      const leafLines = new Map<LeafState, { spot: Spot; to: Point[] }>();
      for (const leaf of this.leaves) {
        const spot = leafSpots.get(leaf) ?? placed.get(leaf.node.id);
        if (!spot) continue;
        const to = leaf.node.links.map(
          (link) => placed.get(link.parent) ?? base,
        );
        leafLines.set(leaf, { spot, to });
      }

      settle(spots, bounds, SETTLE_STEPS);
      // Now that they've settled, each leaf's words go on the side its lines
      // don't — and anything they now run into is nudged apart again, which
      // can move a leaf across its line, so a few times over.
      for (let pass = 0; pass < 4; pass++) {
        let flipped = false;
        for (const [leaf, { spot, to }] of leafLines) {
          const dx = mean(to).x - spot.x;
          const left = Math.abs(dx) < 0.01 ? !!words.get(leaf) : dx > 0;
          if (left === !!words.get(leaf)) continue;
          words.set(leaf, left);
          spot.box = leafBox(leaf, left);
          flipped = true;
        }
        if (!flipped) break;
        settle(spots, bounds, 0);
      }

      for (const [id, spot] of placed) {
        const at = fromPlane(face, spot.x, spot.y);
        const category = this.categories.get(id);
        if (category) {
          category.local.copy(at);
          category.object.position.copy(at);
          category.object.quaternion.setFromRotationMatrix(faceBasis(face));
          category.stem.setPolyline([category.local, thing.local]);
        } else {
          const leaf = this.leaves.find((l) => l.node.id === id);
          leaf?.rest.copy(at);
        }
      }
      for (const [leaf, spot] of leafSpots) {
        leaf.rest.copy(fromPlane(face, spot.x, spot.y));
      }
    }

    // Lay every leaf in its face's plane, then draw its lines.
    const across = new THREE.Vector3();
    const up = new THREE.Vector3();
    const basis = new THREE.Matrix4();
    for (const leaf of this.leaves) {
      leaf.root.classList.toggle('kp-beside-left', !!words.get(leaf));
      leaf.object.position.copy(leaf.rest);
      // A shared leaf lies across its edge, reading along what its two faces
      // agree is up. On the apex all three agree only on straight up, which
      // isn't in any plane, so it takes its first face's.
      up.set(0, 0, 0);
      for (const f of leaf.node.faces) up.add(faces[f].up);
      up.addScaledVector(leaf.lift, -up.dot(leaf.lift));
      if (up.lengthSq() < 1e-6) {
        leaf.object.quaternion.setFromRotationMatrix(
          faceBasis(faces[leaf.node.faces[0]]),
        );
      } else {
        up.normalize();
        across.crossVectors(up, leaf.lift);
        leaf.object.quaternion.setFromRotationMatrix(
          basis.makeBasis(across, up, leaf.lift),
        );
      }
      for (const thread of leaf.threads) {
        thread.strand.setPolyline([leaf.rest, thread.anchor]);
      }
    }
  }

  /* ── Interaction ──────────────────────────────────────────────────────── */

  /** Choose a leaf, or a category on its own; choosing it again clears it. */
  private select(leaf: LeafState | null, category: CategoryState | null): void {
    if (this.suppressClick) return;
    const button = leaf?.button ?? category?.button;
    if (!button) return;
    if (this.selection?.button === button) {
      this.clearSelection();
      return;
    }

    const categories = new Set<string>();
    const things = new Set<string>();
    for (const parent of leaf?.node.parents ?? [category?.node.id ?? '']) {
      const parentCategory = this.categories.get(parent);
      if (parentCategory) {
        categories.add(parent);
        things.add(parentCategory.node.thing);
      } else if (this.things.has(parent)) {
        things.add(parent);
      }
    }

    this.selection?.button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-pressed', 'true');
    this.selection = {
      button,
      leaf,
      at: performance.now() / 1000,
      categories,
      things,
    };
    this.events.choose({
      leaf: leaf?.node ?? null,
      categories: [...categories].flatMap((id) => {
        const node = this.categories.get(id)?.node;
        return node ? [node] : [];
      }),
      things: [...things].flatMap((id) => {
        const node = this.things.get(id)?.node;
        return node ? [node] : [];
      }),
    });
    // The pyramid stays where the visitor left it: choosing lights the path,
    // it doesn't turn the face round.
  }

  /** Drops the current choice, if any. Each thing's X calls this too. */
  clearSelection(): void {
    if (!this.selection) return;
    this.selection.button.setAttribute('aria-pressed', 'false');
    this.selection = null;
    this.events.choose(null);
  }

  /**
   * Finishes the sentence under each chosen thing's face — both faces, for a
   * shared leaf, each in its own words — in the chosen kind's colour, keyed
   * by thing id; `null` takes them all away. The page writes the words; this
   * puts them after the thing's name.
   */
  finish(endings: ReadonlyMap<string, SentenceEnding> | null): void {
    for (const thing of this.things.values()) {
      const ending = endings?.get(thing.node.id);
      thing.root.classList.toggle('is-finished', !!ending);
      const words = thing.ending.firstElementChild as HTMLElement;
      words.replaceChildren(
        ...(ending?.parts ?? []).flatMap((part, i) => {
          const span = document.createElement('span');
          span.className = `kp-thing-part kp-${part.kind}`;
          span.textContent = part.text;
          return i ? [', and ', span] : [span];
        }),
      );
    }
  }

  private turnTo(yaw: number, tilt: number): void {
    this.intro = null;
    this.yawVel = this.tiltVel = 0;
    const target = {
      yaw: this.yaw + wrapAngle(yaw - this.yaw),
      tilt: clamp(tilt, TILT_MIN, TILT_MAX),
    };
    if (this.reducedMotion) {
      this.yaw = target.yaw;
      this.tilt = target.tilt;
      this.focus = null;
    } else {
      this.focus = target;
    }
  }

  private readonly onPointerDown = (event: PointerEvent): void => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    // A second finger turns the gesture into a pinch: no turning, no click.
    if (this.pointers.size === 2) {
      const [a, b] = [...this.pointers.values()];
      const mid = this.toWorld((a.x + b.x) / 2, (a.y + b.y) / 2);
      this.pinch = {
        zoom: this.zoom,
        spread: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)),
        ...mid,
      };
      this.press = null;
      this.suppressClick = true;
      this.stage.classList.remove('is-dragging');
      return;
    }
    if (this.pointers.size > 2) return;

    this.suppressClick = false;
    const now = performance.now();
    this.press = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      lastT: now,
      moved: false,
      onNode: !!(event.target as Element | null)?.closest?.(
        '.kp-leaf, .kp-category, .kp-thing-close',
      ),
    };
  };

  private readonly onPointerMove = (event: PointerEvent): void => {
    if (this.pointers.has(event.pointerId)) {
      this.pointers.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });
    }

    const pinch = this.pinch;
    if (pinch && this.pointers.size >= 2) {
      const [a, b] = [...this.pointers.values()];
      const spread = Math.max(1, Math.hypot(a.x - b.x, a.y - b.y));
      this.zoomAt(
        (a.x + b.x) / 2,
        (a.y + b.y) / 2,
        (pinch.zoom * spread) / pinch.spread,
        pinch,
      );
      return;
    }

    const press = this.press;
    if (!press || press.id !== event.pointerId) return;
    if (!press.moved) {
      if (Math.hypot(event.clientX - press.x, event.clientY - press.y) < 5)
        return;
      press.moved = true;
      this.intro = null;
      this.focus = null;
      this.stage.classList.add('is-dragging');
    }
    const now = performance.now();
    const dt = Math.max((now - press.lastT) / 1000, 1 / 240);
    const dYaw = (event.clientX - press.lastX) * DRAG_YAW;
    const dTilt = (event.clientY - press.lastY) * DRAG_TILT;
    this.yaw += dYaw;
    this.tilt = clamp(this.tilt + dTilt, TILT_MIN, TILT_MAX);
    this.yawVel = lerp(this.yawVel, dYaw / dt, 0.5);
    this.tiltVel = lerp(this.tiltVel, dTilt / dt, 0.5);
    press.lastX = event.clientX;
    press.lastY = event.clientY;
    press.lastT = now;
  };

  private readonly onPointerUp = (event: PointerEvent): void => {
    this.pointers.delete(event.pointerId);
    if (this.pinch) {
      // The finger left behind after a pinch doesn't start turning.
      if (this.pointers.size < 2) this.pinch = null;
      if (this.pointers.size === 0) {
        setTimeout(() => (this.suppressClick = false));
      }
      return;
    }

    const press = this.press;
    if (!press || press.id !== event.pointerId) return;
    this.press = null;
    this.stage.classList.remove('is-dragging');
    if (press.moved) {
      // The click that follows a drag isn't a choice.
      this.suppressClick = true;
      setTimeout(() => (this.suppressClick = false));
      if (performance.now() - press.lastT > 80 || this.reducedMotion) {
        this.yawVel = this.tiltVel = 0;
      }
    } else if (!press.onNode) {
      this.clearSelection();
    }
  };

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    const yaw = this.focus?.yaw ?? this.yaw;
    const tilt = this.focus?.tilt ?? this.tilt;
    const step = (Math.PI * 2) / 3;
    switch (event.key) {
      case 'ArrowLeft':
        this.turnTo(yaw - step, tilt);
        break;
      case 'ArrowRight':
        this.turnTo(yaw + step, tilt);
        break;
      case 'ArrowUp':
        this.turnTo(yaw, tilt - 0.2);
        break;
      case 'ArrowDown':
        this.turnTo(yaw, tilt + 0.2);
        break;
      case '+':
      case '=':
        this.zoomAt(null, null, this.zoom * 1.25);
        break;
      case '-':
      case '_':
        this.zoomAt(null, null, this.zoom / 1.25);
        break;
      case '0':
        this.zoomAt(null, null, 1);
        break;
      case 'Escape':
        this.clearSelection();
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  private readonly onWheel = (event: WheelEvent): void => {
    event.preventDefault();
    const unit =
      event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? this.height : 1;
    // A trackpad pinch arrives as a wheel with ctrlKey, in much smaller steps.
    const rate = event.ctrlKey ? WHEEL_ZOOM * 6 : WHEEL_ZOOM;
    this.zoomAt(
      event.clientX,
      event.clientY,
      this.zoom * Math.exp(-event.deltaY * unit * rate),
    );
  };

  /**
   * Sets the zoom, keeping `anchor` — by default the world point under the
   * given screen point (the cursor, or the middle of a pinch) — under that
   * screen point, so zooming heads for what you're pointing at. No screen
   * point zooms on the middle of the view.
   */
  private zoomAt(
    clientX: number | null,
    clientY: number | null,
    zoom: number,
    anchor?: { x: number; y: number },
  ): void {
    const rect = this.stage.getBoundingClientRect();
    const sx = clientX ?? rect.left + this.width / 2;
    const sy = clientY ?? rect.top + this.height / 2;
    const at = anchor ?? this.toWorld(sx, sy);

    this.zoom = clamp(zoom, 1, this.maxZoom);
    const { nx, ny, halfW, halfH } = this.view(sx, sy);
    this.pan.set(at.x - nx * halfW, at.y - ny * halfH - VIEW_Y);
    this.placeCamera();
  }

  /** A screen point as a point on the plane through the pyramid's centre. */
  private toWorld(clientX: number, clientY: number): { x: number; y: number } {
    const { nx, ny, halfW, halfH } = this.view(clientX, clientY);
    return {
      x: this.pan.x + nx * halfW,
      y: this.pan.y + VIEW_Y + ny * halfH,
    };
  }

  /** Where a screen point falls in the view (-1…1), and the view's half-size
      on that centre plane at the current zoom. */
  private view(clientX: number, clientY: number) {
    const rect = this.stage.getBoundingClientRect();
    const halfH =
      (this.fitDistance / this.zoom) *
      Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    return {
      nx: ((clientX - rect.left) / this.width) * 2 - 1,
      ny: 1 - ((clientY - rect.top) / this.height) * 2,
      halfW: halfH * this.camera.aspect,
      halfH,
    };
  }

  private placeCamera(): void {
    // Drifting off centre is only allowed as far as the zoom makes room for.
    const room = PAN_EXTENT * (1 - 1 / this.zoom);
    this.pan.set(
      clamp(this.pan.x, -room, room),
      clamp(this.pan.y, Math.max(-room, PAN_FLOOR), room),
    );
    const y = this.pan.y + VIEW_Y;
    this.camera.position.set(this.pan.x, y, this.fitDistance / this.zoom);
    this.camera.lookAt(this.pan.x, y, 0);
  }

  /* ── Frame ────────────────────────────────────────────────────────────── */

  private fit(): void {
    this.width = Math.max(1, this.stage.clientWidth);
    this.height = Math.max(1, this.stage.clientHeight);
    this.renderer.setSize(this.width, this.height);
    this.labels.setSize(this.width, this.height);

    // Back the camera off until the pyramid fits the narrower of the two
    // directions.
    const aspect = this.width / this.height;
    const halfV = THREE.MathUtils.degToRad(this.camera.fov / 2);
    const halfH = Math.atan(Math.tan(halfV) * aspect);
    this.fitDistance = FIT_RADIUS / Math.sin(Math.min(halfV, halfH));
    this.maxZoom = Math.max(1, this.fitDistance / MIN_DISTANCE);
    this.zoom = Math.min(this.zoom, this.maxZoom);
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
    this.placeCamera();
  }

  private readonly frame = (ms: number): void => {
    this.raf = requestAnimationFrame(this.frame);
    const t = ms / 1000;
    const dt = clamp(t - this.last, 0, 1 / 30);
    this.last = t;

    this.turn(t, dt);
    // The opening leaf lights once the spin is over — or cut short.
    if (this.pending && this.intro === null) {
      const leaf = this.pending;
      this.pending = null;
      this.select(leaf, null);
    }
    this.group.rotation.set(this.tilt, this.yaw, 0);
    this.group.updateMatrixWorld(true);

    this.updateFacing();
    this.updateFront();
    this.updateHighlight(t);
    this.updateGlass();

    this.renderer.render(this.scene, this.camera);
    this.labels.render(this.scene, this.camera);
  };

  private turn(t: number, dt: number): void {
    if (this.press?.moved) return;

    if (this.intro !== null) {
      const e = t - this.intro;
      if (e < INTRO_HOLD) {
        this.yaw = INTRO_SPEED * e;
      } else {
        const fade = Math.exp(-this.introDecay * (e - INTRO_HOLD));
        this.yaw =
          INTRO_SPEED * INTRO_HOLD +
          (INTRO_SPEED / this.introDecay) * (1 - fade);
        if (INTRO_SPEED * fade < 0.01) {
          this.yaw = this.introYaw;
          this.intro = null;
        }
      }
      return;
    }

    if (this.focus) {
      const k = 1 - Math.exp(-dt * FOCUS_RATE);
      this.yaw += (this.focus.yaw - this.yaw) * k;
      this.tilt += (this.focus.tilt - this.tilt) * k;
      if (
        Math.abs(this.focus.yaw - this.yaw) < 1e-3 &&
        Math.abs(this.focus.tilt - this.tilt) < 1e-3
      ) {
        this.yaw = this.focus.yaw;
        this.tilt = this.focus.tilt;
        this.focus = null;
      }
      return;
    }

    if (Math.abs(this.yawVel) > 1e-3 || Math.abs(this.tiltVel) > 1e-3) {
      const decay = Math.exp(-dt * INERTIA);
      this.yaw += this.yawVel * dt;
      this.tilt += this.tiltVel * dt;
      if (this.tilt < TILT_MIN || this.tilt > TILT_MAX) {
        this.tilt = clamp(this.tilt, TILT_MIN, TILT_MAX);
        this.tiltVel = 0;
      }
      this.yawVel *= decay;
      this.tiltVel *= decay;
    }
  }

  /** How squarely each face looks at the camera, -1…1. */
  private updateFacing(): void {
    const q = this.group.quaternion;
    this.faces.forEach((face, k) => {
      const normal = this.faceNormals[k].copy(face.normal).applyQuaternion(q);
      const centre = this.tmp
        .copy(face.centroid)
        .applyMatrix4(this.group.matrixWorld);
      this.toCamera.subVectors(this.camera.position, centre).normalize();
      this.facing[k] = normal.dot(this.toCamera);
    });
  }

  /** Tells the page when a different thing turns to face the viewer. */
  private updateFront(): void {
    let best: ThingNode | null = null;
    let bestFacing = -Infinity;
    for (const thing of this.things.values()) {
      const facing = this.facing[thing.node.face];
      if (facing > bestFacing) {
        bestFacing = facing;
        best = thing.node;
      }
    }
    if (best && best !== this.front) {
      this.front = best;
      this.events.front(best);
    }
  }

  private updateHighlight(t: number): void {
    const selection = this.selection;
    const e = selection ? t - selection.at : 0;
    // A chosen category starts the propagation itself; a leaf reaches it
    // after its thread has lit.
    const categoryAt = selection?.leaf ? THREAD_TIME : 0;
    const threadLit = clamp(e / THREAD_TIME, 0, 1);
    const stemLit = clamp((e - categoryAt) / STEM_TIME, 0, 1);
    // The path reaches a thing straight down a leaf's thread for a leaf
    // listed right under it, else down its category's stem after.
    const thingAt = (thing: ThingState) =>
      selection?.leaf?.node.parents.includes(thing.node.id)
        ? THREAD_TIME
        : categoryAt + STEM_TIME;

    const front = Math.max(...this.facing);

    for (const leaf of this.leaves) {
      // A shared leaf shows as much as the better-placed of its faces.
      const facing = Math.max(
        ...leaf.node.faces.map((f) => presence(this.facing[f], front)),
      );
      const chosen = selection?.leaf === leaf;
      const dim = !!selection && !chosen;
      paint(leaf.root, facing, chosen, dim);
      for (const thread of leaf.threads) {
        thread.strand.show(
          facing * (dim ? DIM_LINE : 1),
          chosen ? threadLit : 0,
        );
      }
    }

    for (const category of this.categories.values()) {
      const facing = presence(this.facing[category.node.face], front);
      const involved = !!selection?.categories.has(category.node.id);
      paint(
        category.root,
        facing,
        involved && e >= categoryAt,
        !!selection && !involved,
      );
      category.stem.show(
        facing * (selection && !involved ? DIM_LINE : 1),
        involved ? stemLit : 0,
      );
    }

    for (const thing of this.things.values()) {
      const facing = presence(this.facing[thing.node.face], front);
      const involved = !!selection?.things.has(thing.node.id);
      paint(
        thing.root,
        facing,
        involved && e >= thingAt(thing),
        !!selection && !involved,
      );
    }
  }

  private updateGlass(): void {
    // Panes: a little brighter where the window light falls.
    const light = this.tmp.set(0.3, 0.8, 0.5).normalize();
    this.faceMeshes.forEach((mesh, k) => {
      const lambert = Math.max(0, this.faceNormals[k].dot(light));
      mesh.material.opacity = this.facing[k] > 0 ? 0.04 + 0.1 * lambert : 0.03;
    });

    // Edges: a thin, steady stroke — fainter where it runs behind the glass.
    for (const edge of this.edges) {
      const front = edge.faces.some((f) => this.facing[f] > 0);
      edge.line.material.opacity = front ? 0.75 : 0.25;
    }

    // Frost: the photograph blurred behind the pyramid's outline, drawn in
    // from the stroke so a clear strip shows between them, like the panels.
    const points = this.corners.map((corner) => {
      const p = this.tmp
        .copy(corner)
        .applyMatrix4(this.group.matrixWorld)
        .project(this.camera);
      return {
        x: ((p.x + 1) / 2) * this.width,
        y: ((1 - p.y) / 2) * this.height,
      };
    });
    const outline = inset(hull(points), 7);
    this.frost.style.clipPath = `polygon(${outline
      .map((p) => `${p.x.toFixed(1)}px ${p.y.toFixed(1)}px`)
      .join(', ')})`;
  }
}

/* ── Strands ────────────────────────────────────────────────────────────── */

/**
 * One connection — a thread or a stem — drawn as a neon line: a wide soft glow
 * under a thin core. A second copy, brighter, is drawn over the first part of
 * the path to carry the propagation as it travels.
 */
class Strand {
  private readonly points = Array.from(
    { length: SEGMENTS + 1 },
    () => new THREE.Vector3(),
  );
  private readonly partial = Array.from(
    { length: SEGMENTS + 1 },
    () => new THREE.Vector3(),
  );
  private readonly glow: Line2;
  private readonly core: Line2;
  private readonly litGlow: Line2;
  private readonly litCore: Line2;

  constructor(parent: THREE.Object3D, color: THREE.Color, dpr: number) {
    const bright = color.clone().lerp(new THREE.Color(0xffffff), 0.35);
    this.glow = makeLine(color, 4 * dpr, 0.18);
    this.core = makeLine(color, 1 * dpr, 0.7);
    this.litGlow = makeLine(color, 6 * dpr, 0.55);
    this.litCore = makeLine(bright, 1.6 * dpr, 1);
    parent.add(this.glow, this.core, this.litGlow, this.litCore);
  }

  /**
   * A path of straight runs through `vertices`, bending exactly at each one.
   * Every run gets at least one segment and the rest go to the longest, so
   * the propagation still travels along it at an even pace.
   */
  setPolyline(vertices: THREE.Vector3[]): void {
    const lengths = vertices
      .slice(1)
      .map((vertex, i) => vertex.distanceTo(vertices[i]));
    const counts = lengths.map(() => 1);
    for (let spare = SEGMENTS - lengths.length; spare > 0; spare--) {
      let widest = 0;
      counts.forEach((count, i) => {
        if (lengths[i] / count > lengths[widest] / counts[widest]) widest = i;
      });
      counts[widest]++;
    }
    let n = 0;
    this.points[0].copy(vertices[0]);
    counts.forEach((count, i) => {
      for (let s = 1; s <= count; s++) {
        this.points[++n].lerpVectors(vertices[i], vertices[i + 1], s / count);
      }
    });
    writeLine(this.glow, this.points);
    writeLine(this.core, this.points);
  }

  /** `strength` scales the resting line; `lit` is how far along it's lit. */
  show(strength: number, lit: number): void {
    this.glow.material.opacity = 0.18 * strength;
    this.core.material.opacity = 0.7 * strength;
    const on = lit > 0;
    this.litGlow.visible = this.litCore.visible = on;
    if (!on) return;
    for (let i = 0; i <= SEGMENTS; i++) {
      const s = lit * i;
      const index = Math.min(Math.floor(s), SEGMENTS - 1);
      this.partial[i].lerpVectors(
        this.points[index],
        this.points[index + 1],
        s - index,
      );
    }
    writeLine(this.litGlow, this.partial);
    writeLine(this.litCore, this.partial);
  }
}

function makeLine(
  color: THREE.Color,
  width: number,
  opacity: number,
  points = SEGMENTS + 1,
): Line2 {
  const geometry = new LineGeometry();
  geometry.setPositions(new Float32Array(points * 3));
  const material = new LineMaterial({
    color,
    linewidth: width,
    transparent: true,
    opacity,
    depthWrite: false,
  });
  const line = new Line2(geometry, material);
  line.frustumCulled = false;
  line.renderOrder = 1;
  return line;
}

/** Rewrites a line's points in place rather than reallocating its buffers. */
function writeLine(line: Line2, points: THREE.Vector3[]): void {
  const attribute = line.geometry.getAttribute(
    'instanceStart',
  ) as THREE.InterleavedBufferAttribute;
  const array = attribute.data.array as Float32Array;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const o = i * 6;
    array[o] = a.x;
    array[o + 1] = a.y;
    array[o + 2] = a.z;
    array[o + 3] = b.x;
    array[o + 4] = b.y;
    array[o + 5] = b.z;
  }
  attribute.data.needsUpdate = true;
}

/* ── Layout helpers ─────────────────────────────────────────────────────── */

/**
 * Nudges a face's labels apart until none overlap: each round draws each
 * loose label a little back toward where it belongs (for the first
 * `pullRounds`), then pushes every overlapping pair apart the short way and
 * keeps them on the face.
 */
function settle(
  spots: Spot[],
  bounds: ReturnType<typeof triangle>,
  pullRounds: number,
): void {
  const loose = spots.filter((spot) => !spot.fixed);
  for (let round = 0; round < pullRounds + SETTLE_FINISH; round++) {
    const pull = round < pullRounds ? SETTLE_PULL : 0;
    for (const spot of loose) {
      const home = spot.home();
      spot.x += (home.x - spot.x) * pull;
      spot.y += (home.y - spot.y) * pull;
      keepOnFace(spot, bounds);
    }
    for (let i = 0; i < spots.length; i++) {
      for (let j = i + 1; j < spots.length; j++) {
        const a = spots[i];
        const b = spots[j];
        if (a.fixed && b.fixed) continue;
        const px =
          Math.min(a.x + a.box.x1, b.x + b.box.x1) -
          Math.max(a.x + a.box.x0, b.x + b.box.x0) +
          LABEL_GAP;
        const py =
          Math.min(a.y + a.box.y1, b.y + b.box.y1) -
          Math.max(a.y + a.box.y0, b.y + b.box.y0) +
          LABEL_GAP;
        if (px <= 0 || py <= 0) continue;
        const horizontal = px < py;
        const ac = horizontal
          ? a.x + (a.box.x0 + a.box.x1) / 2
          : a.y + (a.box.y0 + a.box.y1) / 2;
        const bc = horizontal
          ? b.x + (b.box.x0 + b.box.x1) / 2
          : b.y + (b.box.y0 + b.box.y1) / 2;
        const sign = bc >= ac ? 1 : -1;
        const push = (horizontal ? px : py) * (a.fixed || b.fixed ? 1 : 0.5);
        const axis = horizontal ? 'x' : 'y';
        if (!a.fixed) a[axis] -= sign * push;
        if (!b.fixed) b[axis] += sign * push;
      }
    }
    for (const spot of loose) keepOnFace(spot, bounds);
  }
}

/** Moves a label back onto its face, SURFACE_MARGIN in from every side. */
function keepOnFace(spot: Spot, bounds: ReturnType<typeof triangle>): void {
  const m = SURFACE_MARGIN;
  const { box } = spot;
  const slant = bounds.apexY - bounds.baseY;
  // The face narrows upward, so a wide label can't go as high as a narrow one.
  const half = (box.x1 - box.x0) / 2;
  const top = Math.min(
    bounds.apexY - m,
    bounds.apexY - ((half + m) * slant) / (EDGE / 2),
  );
  spot.y = clamp(spot.y, bounds.baseY + m - box.y0, top - box.y1);
  const room = bounds.halfWidth(spot.y + box.y1) - m;
  spot.x = clamp(spot.x, -room - box.x0, room - box.x1);
}

/** The room a leaf's dot and words take, with its dot at (x, y) and its words
    to the right of it — or, `left`, to the left. */
function leafRectAt(
  x: number,
  y: number,
  w: number,
  h: number,
  left = false,
): Rect {
  return left
    ? {
        x0: x - FLAT_BESIDE - w,
        x1: x + FLAT_DOT,
        y0: y - h / 2,
        y1: y + h / 2,
      }
    : {
        x0: x - FLAT_DOT,
        x1: x + FLAT_BESIDE + w,
        y0: y - h / 2,
        y1: y + h / 2,
      };
}

function mean(points: Point[]): Point {
  const n = Math.max(1, points.length);
  return {
    x: points.reduce((s, p) => s + p.x, 0) / n,
    y: points.reduce((s, p) => s + p.y, 0) / n,
  };
}

/* ── Labels ─────────────────────────────────────────────────────────────── */

/**
 * A node's label: a zero-size box at the node's point, holding a glowing dot
 * and the words. CSS places the words around the dot per node type.
 */
function nodeElement(className: string, label: string): HTMLElement {
  const root = document.createElement('div');
  root.className = `kp-node ${className}`;
  const dot = document.createElement('span');
  dot.className = 'kp-dot';
  const text = document.createElement('button');
  text.className = 'kp-label';
  text.textContent = label;
  text.type = 'button';
  root.append(dot, text);
  return root;
}

/** A label printed flat on the glass, sized in world units (FLAT_SCALE). */
function flatObject(root: HTMLElement): CSS3DObject {
  const object = new CSS3DObject(root);
  object.scale.setScalar(FLAT_SCALE);
  return object;
}

/**
 * A thing's label, which is also the sentence, centred under its face and
 * wrapping onto more lines as it grows: its lead ("when approaching a"), the
 * name that lights up ("problem"), and an ending — empty until a choice
 * finishes the sentence (see `finish`) — with the X that clears the choice.
 */
function thingElement(
  phrase: { lead: string; name: string },
  onClear: () => void,
): { root: HTMLElement; ending: HTMLElement } {
  const root = document.createElement('div');
  root.className = 'kp-node kp-thing';
  const dot = document.createElement('span');
  dot.className = 'kp-dot';
  const text = document.createElement('span');
  text.className = 'kp-label';

  const lead = document.createElement('span');
  lead.className = 'kp-thing-lead';
  lead.textContent = `${phrase.lead} `;
  const name = document.createElement('span');
  name.className = 'kp-thing-name';
  name.textContent = phrase.name;

  const ending = document.createElement('span');
  ending.className = 'kp-thing-ending';
  const words = document.createElement('span');
  words.className = 'kp-thing-words';
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'kp-thing-close glow-link glow-link-icon';
  close.setAttribute('aria-label', 'clear the choice');
  const icon = document.createElement('i');
  icon.className = 'pi pi-times';
  close.append(icon);
  close.addEventListener('click', onClear);
  ending.append(words, close);

  text.append(lead, name, ending);
  root.append(dot, text);
  return { root, ending };
}

/** Wires up a node's button: its accessible name, pressed state and click. */
function pressable(
  root: HTMLElement,
  name: string,
  onPress: () => void,
): HTMLButtonElement {
  const button = root.querySelector('button') as HTMLButtonElement;
  button.setAttribute('aria-pressed', 'false');
  button.setAttribute('aria-label', name);
  button.addEventListener('click', onPress);
  return button;
}

/** Fades a label with its face turning away, and marks it lit or dimmed. */
function paint(
  root: HTMLElement,
  facing: number,
  lit: boolean,
  dim: boolean,
): void {
  const opacity =
    (lit ? Math.max(facing, 0.6) : facing) * (dim ? DIM_LABEL : 1);
  root.style.opacity = opacity.toFixed(3);
  root.classList.toggle('is-lit', lit);
  root.classList.toggle('is-dim', dim);
}

/**
 * How present a face's labels and lines are, from how squarely it faces the
 * viewer (`facing`, -1…1) against the face that does so most (`front`).
 *
 * The front face is at full strength. A face still in view but less turned
 * toward you steps back only slightly — its words can still be pressed, so
 * they have to stay readable — and one turned away behind the pyramid drops
 * to about a quarter, the same as ever. Each step is eased over a narrow band
 * rather than switched, so nothing flickers as two faces trade places at an
 * edge.
 */
function presence(facing: number, front: number): number {
  const offFront = smoothstep(0, 0.12, front - facing);
  const behind = smoothstep(0.05, -0.15, facing);
  return (1 - 0.2 * offFront) * (1 - 0.68 * behind);
}

/** 0 at `from`, 1 at `to`, eased between; `to` may be below `from`. */
function smoothstep(from: number, to: number, x: number): number {
  const t = clamp((x - from) / (to - from), 0, 1);
  return t * t * (3 - 2 * t);
}

/* ── Geometry helpers ───────────────────────────────────────────────────── */

function buildFaces(edge: number): Face[] {
  const height = edge * Math.sqrt(2 / 3);
  const baseY = -height * 0.25;
  const baseR = edge / Math.sqrt(3);
  const apex = new THREE.Vector3(0, height * 0.75, 0);
  // Base vertex k at yaw -60° + k·120°, so face 0 (vertices 0 and 1) looks
  // straight down +z and face k looks along yaw k·120°.
  const base = [0, 1, 2].map((k) => {
    const a = -Math.PI / 3 + (k * Math.PI * 2) / 3;
    return new THREE.Vector3(baseR * Math.sin(a), baseY, baseR * Math.cos(a));
  });
  return [0, 1, 2].map((k) => {
    const left = base[k];
    const right = base[(k + 1) % 3];
    const centroid = apex.clone().add(left).add(right).divideScalar(3);
    const normal = new THREE.Vector3()
      .crossVectors(left.clone().sub(apex), right.clone().sub(apex))
      .normalize();
    if (normal.dot(centroid) < 0) normal.negate();
    const middle = left.clone().add(right).multiplyScalar(0.5);
    return {
      apex,
      left,
      right,
      centroid,
      normal,
      tangent: right.clone().sub(left).normalize(),
      up: apex.clone().sub(middle).normalize(),
      angle: (k * Math.PI * 2) / 3,
    };
  });
}

/** A point on a face: `v` runs apex (0) → base (1), `u` left (-1) → right (1). */
function facePoint(face: Face, u: number, v: number): THREE.Vector3 {
  const middle = face.left.clone().add(face.right).multiplyScalar(0.5);
  return face.apex
    .clone()
    .addScaledVector(middle.sub(face.apex), v)
    .addScaledVector(face.right.clone().sub(face.left), 0.5 * u * v);
}

/**
 * A side face as a flat triangle, in its own plane coordinates: x along the
 * base (`tangent`), y up the face (`up`), both from the centroid.
 */
function triangle(edge: number) {
  const slant = (edge * Math.sqrt(3)) / 2;
  const apexY = (2 * slant) / 3;
  return {
    apexY,
    baseY: -slant / 3,
    /** Half the face's width at height `y`. */
    halfWidth: (y: number) => ((apexY - y) / slant) * (edge / 2),
  };
}

/** A point on (or near) a face, in that face's plane coordinates. */
function planePoint(face: Face, p: THREE.Vector3): Point {
  const d = p.clone().sub(face.centroid);
  return { x: d.dot(face.tangent), y: d.dot(face.up) };
}

/** A plane point back on the face, lifted just off the glass. */
function fromPlane(face: Face, x: number, y: number): THREE.Vector3 {
  return face.centroid
    .clone()
    .addScaledVector(face.tangent, x)
    .addScaledVector(face.up, y)
    .addScaledVector(face.normal, SURFACE);
}

/** Turns a flat label into a face's plane, reading along its base. */
function faceBasis(face: Face): THREE.Matrix4 {
  return new THREE.Matrix4().makeBasis(face.tangent, face.up, face.normal);
}

/** A flat label's width and height in world units, at `scale` × the leaf
    type (see the FLAT_* constants). */
function flatWidth(label: string, scale: number): number {
  return label.length * FLAT_CHAR * scale + 2 * FLAT_PAD_X;
}

function flatHeight(scale: number): number {
  return (FLAT_PX * scale * 1.2 + 2 * 3) * FLAT_SCALE;
}

/** Convex hull (monotone chain) — the pyramid's outline on screen. */
function hull(points: Point[]): Point[] {
  const sorted = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
  const cross = (o: Point, a: Point, b: Point) =>
    (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const half = (list: Point[]) => {
    const out: Point[] = [];
    for (const p of list) {
      while (
        out.length >= 2 &&
        cross(out[out.length - 2], out[out.length - 1], p) <= 0
      ) {
        out.pop();
      }
      out.push(p);
    }
    out.pop();
    return out;
  };
  return [...half(sorted), ...half([...sorted].reverse())];
}

/** Draws an outline in towards its middle by roughly `by` pixels. */
function inset(points: Point[], by: number): Point[] {
  const cx = points.reduce((s, p) => s + p.x, 0) / points.length;
  const cy = points.reduce((s, p) => s + p.y, 0) / points.length;
  return points.map((p) => {
    const d = Math.hypot(p.x - cx, p.y - cy) || 1;
    const k = Math.max(0, d - by) / d;
    return { x: cx + (p.x - cx) * k, y: cy + (p.y - cy) * k };
  });
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Wraps an angle into (-π, π], so a turn always takes the short way round. */
function wrapAngle(angle: number): number {
  const turn = Math.PI * 2;
  return angle - turn * Math.round(angle / turn);
}
