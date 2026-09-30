import * as THREE from 'three';
import {
  CSS2DObject,
  CSS2DRenderer,
} from 'three/examples/jsm/renderers/CSS2DRenderer.js';
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

/* ── Layouts ──────────────────────────────────────────────────────────────
   Two ways to draw the same graph. `floating`: leaves hang in front of their
   face on slack threads that the turning pyramid yanks. `surface`: leaves lie
   on the glass itself (a shared one on the edge between its two faces), and
   every connection is a rigid trace scratched into the face on a meandering
   path. Surface needs the room, so its pyramid is bigger — and with nothing
   floating out in front, the camera can frame it more tightly. */
export type PyramidLayout = 'floating' | 'surface';

interface LayoutConfig {
  /** Leaves on the glass on rigid traces, rather than floating on threads. */
  surface: boolean;
  /** The tetrahedron's edge length. */
  edge: number;
  /** Radius the camera frames at zoom 1. */
  fitRadius: number;
  /** Zooming in stops this far from the centre. */
  minDistance: number;
  /** The view centre's height. */
  viewY: number;
  /** How far the view can drift off centre when zoomed right in. */
  panExtent: number;
  /** Keeps the camera above the base plane, so the base never shows. */
  panFloor: number;
}

const LAYOUTS: Record<PyramidLayout, LayoutConfig> = {
  floating: {
    surface: false,
    edge: 3.2,
    // The pyramid and its leaves; the view sits a little low, where they hang.
    fitRadius: 3.9,
    minDistance: 5.5,
    viewY: -0.15,
    panExtent: 3,
    panFloor: -0.4,
  },
  surface: {
    surface: true,
    edge: 4.6,
    fitRadius: 3.5,
    minDistance: 3.4,
    viewY: 0.1,
    panExtent: 3.6,
    panFloor: -0.8,
  },
};

/* ── Geometry ─────────────────────────────────────────────────────────────
   A regular tetrahedron centred on the origin: apex up, base down. Faces 0–2
   are the three things; the base is never drawn and never shown. */

/** A side face's normal leans up by asin(1/3); this tilt stands it square. */
const REST_TILT = Math.asin(1 / 3);
/** Tilt is x-axis rotation. Below level the camera would see the base. */
const TILT_MIN = 0;
const TILT_MAX = 0.8;

/** A face's thing is named just below its bottom edge. */
const THING_DROP = 0.18;
/** Where categories sit on a face, as a fraction from apex (0) to base (1).
    More than two are staggered over two rows so their labels don't collide. */
const CATEGORY_V = 0.56;
const CATEGORY_ROWS = [0.46, 0.66];
const CATEGORY_SPREAD = 0.62;
/** Where a shared leaf sits along the edge between its two faces. */
const SHARED_V = 0.7;
/** How far leaves float out in front of their face. */
const LEAF_LIFT = 1.15;
/** Leaves fan out below their category on arms this long, this far apart. */
const ARM_LENGTH = 0.85;
const ARM_ANGLE = 0.7;
/** Lifts drawn marks just off the glass. */
const SURFACE = 0.01;

/** Surface layout: categories sit higher, leaving the wide lower half of the
    face for the leaves, which fan down off them on shorter arms. */
const SURFACE_CATEGORY_V = 0.45;
const SURFACE_CATEGORY_ROWS = [0.4, 0.56];
const SURFACE_SHARED_V = 0.72;
const SURFACE_ARM_LENGTH = 0.6;
const SURFACE_ARM_ANGLE = 0.85;
/** Labels stay this far inside the face's edges. */
const SURFACE_MARGIN = 0.06;
/** A trace bends at a waypoint every so often along its length, each pushed
    sideways by up to this much of the length (capped) — so it wanders, but
    plainly heads from one end to the other. */
const TRACE_STEP = 0.4;
const TRACE_WANDER = 0.22;
const TRACE_WANDER_MAX = 0.28;

/** Surface leaves are printed flat on the glass (CSS3D), so their size is in
    world units: FLAT_PX-pixel type, each CSS pixel FLAT_SCALE world units.
    The rest matches `.kp-flat` in the stylesheet — a monospace face (0.6em a
    character), a 1.2 line height, the tag's padding and its drop below the
    dot — so the layout knows each label's true footprint. */
const FLAT_PX = 20;
const FLAT_SCALE = 0.0043;
const FLAT_CHAR = 0.6 * FLAT_PX * FLAT_SCALE;
const FLAT_PAD_X = 8 * FLAT_SCALE;
const FLAT_H = (FLAT_PX * 1.2 + 2 * 3) * FLAT_SCALE;
const FLAT_DROP = 8 * FLAT_SCALE;

/** Rough label footprint in world units, for spacing the leaves apart — at the
    floating layout's framing; other framings scale it by their fit radius. */
const CHAR_W = 0.062;
const LABEL_H = 0.26;
const LABEL_GAP = 0.12;

/* ── Camera ───────────────────────────────────────────────────────────── */
const WHEEL_ZOOM = 0.0015;

/* ── Motion ───────────────────────────────────────────────────────────── */
/** The opening spin: full speed for INTRO_HOLD, then eases out onto face 0. */
const INTRO_SPEED = 9;
const INTRO_HOLD = 0.5;
const INTRO_YAW = Math.PI * 2;
const INTRO_DECAY = INTRO_SPEED / (INTRO_YAW - INTRO_SPEED * INTRO_HOLD);

const DRAG_YAW = 0.008;
const DRAG_TILT = 0.006;
const INERTIA = 3.5;
const FOCUS_RATE = 5;

/** Leaves are masses on springs, so turning the pyramid yanks their threads. */
const SPRING = 40;
const DAMPING = 7;
/** Threads are barely longer than the rest distance, so they hang nearly
    straight and only sag a little. */
const SLACK = 1.02;
const SAG = 0.3;
/** …and can only be pulled so far before they drag the leaf along. */
const MAX_STRETCH = 1.3;
const SEGMENTS = 16;

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
  local: THREE.Vector3;
  stem: Strand;
}

interface Thread {
  parent: string;
  anchor: THREE.Vector3;
  world: THREE.Vector3;
  length: number;
  strand: Strand;
}

interface LeafState {
  node: LeafNode;
  root: HTMLElement;
  button: HTMLButtonElement;
  object: CSS2DObject | CSS3DObject;
  rest: THREE.Vector3;
  lift: THREE.Vector3;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  phase: number;
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

export interface PyramidEvents {
  /** The thing whose face is most squarely toward the viewer changed. */
  front(thing: ThingNode): void;
  /** A leaf or category was chosen, or the choice cleared (null). */
  choose(choice: PyramidChoice | null): void;
}

interface Box {
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  /** Label centre relative to the node's point. */
  ox: number;
  oy: number;
  w: number;
  h: number;
  fixed: boolean;
}

/**
 * The about page's pyramid: kelly.json drawn on a glass tetrahedron. Each side
 * face is a thing, with its categories marked on the glass; the exact habits,
 * sense-making methods and biases either float in front on threads or lie on
 * the glass on rigid traces (see `PyramidLayout`). Choosing one lights the
 * path back up to its category and thing and turns that face round.
 *
 * Plain three.js, mounted into `stage` and torn down by `dispose()`. Labels are
 * real DOM so they are readable, focusable buttons — facing the screen
 * (CSS2DRenderer), or for surface leaves printed flat on their face
 * (CSS3DRenderer). Under each face its thing's name is the middle of a
 * sentence, "when thinking about <thing>", which a choice finishes; the frosted
 * blur is a CSS backdrop-filter clipped to the pyramid's projected outline,
 * which is the only way the glass can blur the photograph behind the canvas.
 */
export class PyramidScene {
  private readonly renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  private readonly labels = new CSS2DRenderer();
  private readonly flatLabels = new CSS3DRenderer();
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  private readonly group = new THREE.Group();
  private readonly frost = document.createElement('div');
  private readonly layout: LayoutConfig;
  private readonly faces: Face[];
  private readonly corners: THREE.Vector3[];
  private readonly faceMeshes: THREE.Mesh<
    THREE.BufferGeometry,
    THREE.MeshBasicMaterial
  >[] = [];
  private readonly edges: { glow: Line2; core: Line2; faces: number[] }[] = [];
  private readonly things = new Map<string, ThingState>();
  private readonly categories = new Map<string, CategoryState>();
  private readonly leaves: LeafState[] = [];
  private readonly facing = [0, 0, 0];
  private readonly faceNormals: THREE.Vector3[];
  private readonly colors: Record<Kind, THREE.Color>;
  private readonly edgeBlue: THREE.Color;
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
  private placed = false;

  // Scratch space for the render loop, so a frame allocates nothing.
  private readonly tmp = new THREE.Vector3();
  private readonly tmp2 = new THREE.Vector3();
  private readonly target = new THREE.Vector3();
  private readonly acc = new THREE.Vector3();
  private readonly toCamera = new THREE.Vector3();

  constructor(
    private readonly stage: HTMLElement,
    graph: KellyGraph,
    private readonly events: PyramidEvents,
    layout: PyramidLayout = 'floating',
  ) {
    this.layout = LAYOUTS[layout];
    this.faces = buildFaces(this.layout.edge);
    this.faceNormals = this.faces.map(() => new THREE.Vector3());

    const style = getComputedStyle(stage);
    const token = (name: string, fallback: string) =>
      new THREE.Color(style.getPropertyValue(name).trim() || fallback);
    this.colors = {
      bias: token(KIND_TOKEN.bias, '#ff3131'),
      habit: token(KIND_TOKEN.habit, '#39ff14'),
      sensemaking: token(KIND_TOKEN.sensemaking, '#1f8fff'),
    };
    this.edgeBlue = token('--sweep-base', '#a5c5de');

    this.frost.className = 'kp-frost';
    this.renderer.setPixelRatio(this.dpr);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.domElement.className = 'kp-canvas';
    this.labels.domElement.className = 'kp-labels';
    this.flatLabels.domElement.className = 'kp-labels';
    stage.append(
      this.frost,
      this.renderer.domElement,
      this.flatLabels.domElement,
      this.labels.domElement,
    );

    this.scene.add(this.group);
    const face0 = this.faces[0];
    this.corners = [face0.apex, ...this.faces.map((f) => f.left)];

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
    this.flatLabels.domElement.remove();
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
      const glow = makeLine(
        new THREE.Color(120 / 255, 165 / 255, 215 / 255),
        10 * this.dpr,
        0,
        2,
      );
      const core = makeLine(new THREE.Color(0xffffff), 2 * this.dpr, 0.7, 2);
      for (const line of [glow, core]) {
        writeLine(line, [a, b]);
        this.group.add(line);
      }
      this.edges.push({ glow, core, faces });
    }
  }

  private buildNodes(graph: KellyGraph): void {
    const { faces } = this;

    for (const node of graph.things) {
      const face = faces[node.face];
      const local = facePoint(face, 0, 1)
        .addScaledVector(face.up, -THING_DROP)
        .addScaledVector(face.normal, SURFACE);
      const { root, ending } = thingElement(node.label, () =>
        this.clearSelection(),
      );
      this.group.add(labelObject(root, local));
      this.things.set(node.id, { node, root, local, ending });
    }

    const leafById = new Map(graph.leaves.map((leaf) => [leaf.id, leaf]));

    for (let k = 0; k < faces.length; k++) {
      const face = faces[k];
      // Categories holding a leaf shared with a neighbouring face go on that
      // side, so the shared leaf's two threads stay short.
      const score = (category: CategoryNode) =>
        category.leaves.reduce((sum, id) => {
          const others = (leafById.get(id)?.faces ?? []).filter((f) => f !== k);
          return (
            sum +
            others.reduce(
              (s, f) =>
                s + (f === (k + 1) % 3 ? 1 : f === (k + 2) % 3 ? -1 : 0),
              0,
            )
          );
        }, 0);
      const onFace = graph.categories
        .filter((category) => category.face === k)
        .sort((a, b) => score(a) - score(b));

      const { surface } = this.layout;
      const rows = surface ? SURFACE_CATEGORY_ROWS : CATEGORY_ROWS;
      onFace.forEach((node, i) => {
        const u =
          onFace.length === 1
            ? 0
            : -CATEGORY_SPREAD +
              (2 * CATEGORY_SPREAD * i) / (onFace.length - 1);
        const v =
          onFace.length > 2
            ? rows[i % rows.length]
            : surface
              ? SURFACE_CATEGORY_V
              : CATEGORY_V;
        const local = facePoint(face, u, v).addScaledVector(
          face.normal,
          SURFACE,
        );
        const root = nodeElement(
          `kp-category kp-${node.kind}`,
          node.label,
          true,
        );
        const button = pressable(root, `${node.label}, ${node.kind}`, () =>
          this.select(null, category),
        );
        this.group.add(labelObject(root, local));

        const thing = this.things.get(node.thing);
        const stem = new Strand(this.group, this.colors[node.kind], this.dpr);
        if (thing) {
          if (surface) {
            stem.setPolyline(this.trace(face, local, thing.local, node.id));
          } else {
            stem.setPath((t, out) => out.lerpVectors(local, thing.local, t));
          }
        }
        const category: CategoryState = { node, root, button, local, stem };
        this.categories.set(node.id, category);
      });
    }

    for (const node of graph.leaves) this.leaves.push(this.buildLeaf(node));
    if (this.layout.surface) {
      this.layoutSurface();
      return;
    }
    this.layoutLeaves();

    for (const leaf of this.leaves) {
      for (const thread of leaf.threads) {
        thread.length = leaf.rest.distanceTo(thread.anchor) * SLACK;
      }
    }
  }

  private buildLeaf(node: LeafNode): LeafState {
    const root = nodeElement(`kp-leaf kp-${node.kind}`, node.label, true);
    const button = pressable(root, `${node.label}, ${node.kind}`, () =>
      this.select(leaf, null),
    );

    // On the surface a leaf is fixed to the glass, so it and its traces turn
    // with the pyramid; floating, it's placed in the world each frame.
    const holder = this.layout.surface ? this.group : this.scene;
    let object: CSS2DObject | CSS3DObject;
    if (this.layout.surface) {
      // Printed on the glass: turned into its face's plane by layoutSurface.
      root.classList.add('kp-flat');
      object = new CSS3DObject(root);
      object.scale.setScalar(FLAT_SCALE);
    } else {
      const facing = new CSS2DObject(root);
      facing.center.set(0, 0);
      object = facing;
    }
    holder.add(object);

    const lift = new THREE.Vector3();
    for (const f of node.faces) lift.add(this.faces[f].normal);
    lift.normalize();

    const threads = node.parents.map((parent): Thread => {
      const anchor =
        this.categories.get(parent)?.local ?? this.things.get(parent)?.local;
      return {
        parent,
        anchor: anchor ?? new THREE.Vector3(),
        world: new THREE.Vector3(),
        length: 1,
        strand: new Strand(holder, this.colors[node.kind], this.dpr),
      };
    });

    const leaf: LeafState = {
      node,
      root,
      button,
      object,
      rest: new THREE.Vector3(),
      lift,
      pos: new THREE.Vector3(),
      vel: new THREE.Vector3(),
      phase: this.leaves.length * 1.7,
      threads,
    };
    return leaf;
  }

  /**
   * Rest positions. A leaf shared by two faces floats off the edge between
   * them; every other leaf floats in front of its face, starting under its
   * category (or beside its thing, for a bias) and nudged until no two labels
   * overlap.
   */
  private layoutLeaves(): void {
    const { faces } = this;

    for (const leaf of this.leaves) {
      if (leaf.node.faces.length < 2) continue;
      const [j, k] = leaf.node.faces;
      // Face k spans base vertices k and k+1; the shared one is the edge.
      const vertex =
        [j, (j + 1) % 3].find((v) => v === k || v === (k + 1) % 3) ?? j;
      const edgeFoot = faces[vertex].left;
      leaf.rest
        .lerpVectors(faces[0].apex, edgeFoot, SHARED_V)
        .addScaledVector(leaf.lift, LEAF_LIFT);
    }

    for (let k = 0; k < faces.length; k++) {
      const face = faces[k];
      const toPlane = (p: THREE.Vector3) => {
        const d = this.tmp.subVectors(p, face.centroid);
        return { x: d.dot(face.tangent), y: d.dot(face.up) };
      };
      const boxes: Box[] = [];
      const fixed = (
        p: THREE.Vector3,
        w: number,
        h: number,
        ox: number,
        oy: number,
      ) => {
        const { x, y } = toPlane(p);
        boxes.push({ x, y, homeX: x, homeY: y, ox, oy, w, h, fixed: true });
      };

      // Things are named below their dot, categories above theirs.
      for (const thing of this.things.values()) {
        if (thing.node.face !== k) continue;
        const w = thing.node.label.length * CHAR_W * 1.35 + 0.1;
        const h = LABEL_H * 1.35;
        fixed(thing.local, w, h, 0, -(0.1 + h / 2));
      }
      for (const category of this.categories.values()) {
        if (category.node.face !== k) continue;
        const w = category.node.label.length * CHAR_W * 1.1 + 0.1;
        fixed(category.local, w, LABEL_H, 0, 0.08 + LABEL_H / 2);
      }

      const leafBox = (leaf: LeafState) => {
        const w = leaf.node.label.length * CHAR_W + 0.12;
        return { w, h: LABEL_H, ox: 0, oy: -(0.06 + LABEL_H / 2) };
      };
      const shared = this.leaves.filter(
        (leaf) => leaf.node.faces.length > 1 && leaf.node.faces.includes(k),
      );
      for (const leaf of shared) {
        const { w, h, ox, oy } = leafBox(leaf);
        fixed(leaf.rest, w, h, ox, oy);
      }

      const own = this.leaves.filter(
        (leaf) => leaf.node.faces.length === 1 && leaf.node.faces[0] === k,
      );
      const movable: { leaf: LeafState; box: Box }[] = [];
      let biasIndex = 0;
      for (const leaf of own) {
        let x = 0;
        let y = 0;
        const parent = leaf.node.parents[0];
        const category = this.categories.get(parent);
        const thing = this.things.get(parent);
        if (category) {
          // Fanned out below the category, like fingers off a hand.
          const at = toPlane(category.local);
          const siblings = category.node.leaves;
          const j = siblings.indexOf(leaf.node.id);
          const angle = (j - (siblings.length - 1) / 2) * ARM_ANGLE;
          x = at.x + Math.sin(angle) * ARM_LENGTH;
          y = at.y - Math.cos(angle) * ARM_LENGTH;
        } else if (thing) {
          // Biases hang off their thing, either side of it along the base.
          const at = toPlane(thing.local);
          const side = biasIndex % 2 === 0 ? 1 : -1;
          x = at.x + side * (1.2 + 0.45 * Math.floor(biasIndex / 2));
          y = at.y + 0.35;
          biasIndex++;
        }
        const box: Box = {
          x,
          y,
          homeX: x,
          homeY: y,
          ...leafBox(leaf),
          fixed: false,
        };
        boxes.push(box);
        movable.push({ leaf, box });
      }

      relax(boxes);

      for (const { leaf, box } of movable) {
        leaf.rest
          .copy(face.centroid)
          .addScaledVector(face.tangent, box.x)
          .addScaledVector(face.up, box.y)
          .addScaledVector(face.normal, LEAF_LIFT);
      }
    }
  }

  /**
   * Surface rest positions. A shared leaf sits right on the edge between its
   * two faces; every other leaf lies on its own face, fanned down below its
   * category (or along the base beside its thing, for a bias) and nudged until
   * no two labels overlap or run off the glass. Then each leaf is traced back
   * to its parents.
   */
  private layoutSurface(): void {
    const { faces } = this;
    const { edge, fitRadius } = this.layout;
    const bounds = triangle(edge);
    // Labels are a fixed size on screen; this framing makes them this much
    // bigger in world units than the floating one does.
    const scale = fitRadius / LAYOUTS.floating.fitRadius;
    const charW = CHAR_W * scale;
    const labelH = LABEL_H * scale;

    for (const leaf of this.leaves) {
      if (leaf.node.faces.length < 2) continue;
      const [j, k] = leaf.node.faces;
      const vertex =
        [j, (j + 1) % 3].find((v) => v === k || v === (k + 1) % 3) ?? j;
      leaf.rest
        .lerpVectors(faces[0].apex, faces[vertex].left, SURFACE_SHARED_V)
        .addScaledVector(leaf.lift, SURFACE);
    }

    for (let k = 0; k < faces.length; k++) {
      const face = faces[k];
      const toPlane = (p: THREE.Vector3) => {
        const d = this.tmp.subVectors(p, face.centroid);
        return { x: d.dot(face.tangent), y: d.dot(face.up) };
      };
      const boxes: Box[] = [];
      const fixed = (
        p: THREE.Vector3,
        w: number,
        h: number,
        ox: number,
        oy: number,
      ) => {
        const { x, y } = toPlane(p);
        boxes.push({ x, y, homeX: x, homeY: y, ox, oy, w, h, fixed: true });
      };

      for (const thing of this.things.values()) {
        if (thing.node.face !== k) continue;
        const w = thing.node.label.length * charW * 1.35 + 0.1;
        const h = labelH * 1.35;
        fixed(thing.local, w, h, 0, -(0.1 + h / 2));
      }
      for (const category of this.categories.values()) {
        if (category.node.face !== k) continue;
        const w = category.node.label.length * charW * 1.1 + 0.1;
        fixed(category.local, w, labelH, 0, 0.08 + labelH / 2);
      }

      // Leaves are printed at a fixed world size, so their boxes are exact.
      const leafBox = (leaf: LeafState) => {
        const w = leaf.node.label.length * FLAT_CHAR + 2 * FLAT_PAD_X;
        return { w, h: FLAT_H, ox: 0, oy: -(FLAT_DROP + FLAT_H / 2) };
      };
      for (const leaf of this.leaves) {
        if (leaf.node.faces.length < 2 || !leaf.node.faces.includes(k)) {
          continue;
        }
        const { w, h, ox, oy } = leafBox(leaf);
        fixed(leaf.rest, w, h, ox, oy);
      }

      const movable: { leaf: LeafState; box: Box }[] = [];
      let biasIndex = 0;
      for (const leaf of this.leaves) {
        if (leaf.node.faces.length !== 1 || leaf.node.faces[0] !== k) continue;
        let x = 0;
        let y = 0;
        const parent = leaf.node.parents[0];
        const category = this.categories.get(parent);
        const thing = this.things.get(parent);
        if (category) {
          const at = toPlane(category.local);
          const siblings = category.node.leaves;
          const j = siblings.indexOf(leaf.node.id);
          const angle = (j - (siblings.length - 1) / 2) * SURFACE_ARM_ANGLE;
          x = at.x + Math.sin(angle) * SURFACE_ARM_LENGTH;
          y = at.y - Math.cos(angle) * SURFACE_ARM_LENGTH;
        } else if (thing) {
          // Biases lie along the base, either side of their thing.
          const at = toPlane(thing.local);
          const side = biasIndex % 2 === 0 ? 1 : -1;
          x = at.x + side * (0.8 + 0.6 * Math.floor(biasIndex / 2));
          y = bounds.baseY + 0.45;
          biasIndex++;
        }
        const box: Box = {
          x,
          y,
          homeX: x,
          homeY: y,
          ...leafBox(leaf),
          fixed: false,
        };
        boxes.push(box);
        movable.push({ leaf, box });
      }

      relax(boxes, LABEL_GAP * scale, (box) => keepBoxOnFace(box, bounds));

      for (const { leaf, box } of movable) {
        leaf.rest
          .copy(face.centroid)
          .addScaledVector(face.tangent, box.x)
          .addScaledVector(face.up, box.y)
          .addScaledVector(face.normal, SURFACE);
      }
    }

    const basis = new THREE.Matrix4();
    const across = new THREE.Vector3();
    const up = new THREE.Vector3();
    for (const leaf of this.leaves) {
      leaf.object.position.copy(leaf.rest);
      // Lay the label in its face's plane, reading along the base. A shared
      // leaf lies across its edge, reading along what its two faces agree is
      // up, so it's the same tilt from either side.
      up.set(0, 0, 0);
      for (const f of leaf.node.faces) up.add(faces[f].up);
      up.addScaledVector(leaf.lift, -up.dot(leaf.lift)).normalize();
      across.crossVectors(up, leaf.lift);
      leaf.object.quaternion.setFromRotationMatrix(
        basis.makeBasis(across, up, leaf.lift),
      );
      for (const thread of leaf.threads) {
        const face =
          this.categories.get(thread.parent)?.node.face ??
          this.things.get(thread.parent)?.node.face ??
          leaf.node.faces[0];
        thread.strand.setPolyline(
          this.trace(
            faces[face],
            leaf.rest,
            thread.anchor,
            `${leaf.node.id}>${thread.parent}`,
          ),
        );
      }
    }
  }

  /**
   * A rigid trace across a face from `from` to `to`: straight runs between
   * waypoints, each stepped off the direct line by a seeded random amount — so
   * a connection takes the same path every visit — that eases to nothing at
   * the ends. Waypoints are kept on the face, so a trace never strays onto the
   * next one; only its ends may sit on an edge or hang just under the base.
   */
  private trace(
    face: Face,
    from: THREE.Vector3,
    to: THREE.Vector3,
    seed: string,
  ): THREE.Vector3[] {
    const random = seededRandom(seed);
    const bounds = triangle(this.layout.edge);
    const toPlane = (p: THREE.Vector3) => {
      const d = this.tmp.subVectors(p, face.centroid);
      return new THREE.Vector2(d.dot(face.tangent), d.dot(face.up));
    };
    const a = toPlane(from);
    const b = toPlane(to);
    const length = a.distanceTo(b);
    const side = new THREE.Vector2(a.y - b.y, b.x - a.x).divideScalar(
      length || 1,
    );
    const runs = clamp(Math.round(length / TRACE_STEP) + 1, 2, 7);
    const wander = Math.min(length * TRACE_WANDER, TRACE_WANDER_MAX);

    const points = [from.clone()];
    for (let i = 1; i < runs; i++) {
      const t = (i + (random() - 0.5) * 0.6) / runs;
      const offset = (random() * 2 - 1) * wander * Math.sin(Math.PI * t);
      const p = a.clone().lerp(b, t).addScaledVector(side, offset);
      p.y = clamp(p.y, bounds.baseY + SURFACE_MARGIN, bounds.apexY);
      const room = Math.max(0, bounds.halfWidth(p.y) - SURFACE_MARGIN);
      p.x = clamp(p.x, -room, room);
      points.push(
        face.centroid
          .clone()
          .addScaledVector(face.tangent, p.x)
          .addScaledVector(face.up, p.y)
          .addScaledVector(face.normal, SURFACE),
      );
    }
    points.push(to.clone());
    return points;
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

    // Turn the thing's face to the viewer — for a shared leaf, the edge
    // between its faces, so both things are in view.
    let sin = 0;
    let cos = 0;
    for (const f of leaf?.node.faces ?? [category?.node.face ?? 0]) {
      sin += Math.sin(this.faces[f].angle);
      cos += Math.cos(this.faces[f].angle);
    }
    this.turnTo(-Math.atan2(sin, cos), REST_TILT);
  }

  /** Drops the current choice, if any. Each thing's X calls this too. */
  clearSelection(): void {
    if (!this.selection) return;
    this.selection.button.setAttribute('aria-pressed', 'false');
    this.selection = null;
    this.events.choose(null);
  }

  /**
   * Finishes the sentence under the chosen thing's face — or both faces, for
   * a shared leaf — in the chosen kind's colour; `null` takes it away. The
   * page writes the words; this puts them after the thing's name.
   */
  finish(ending: { kind: Kind; text: string } | null): void {
    for (const thing of this.things.values()) {
      const shown = !!ending && !!this.selection?.things.has(thing.node.id);
      thing.root.classList.toggle('is-finished', shown);
      const words = thing.ending.firstElementChild as HTMLElement;
      words.className = `kp-thing-words kp-${ending?.kind ?? 'habit'}`;
      words.textContent = shown && ending ? ending.text : '';
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
    this.pan.set(at.x - nx * halfW, at.y - ny * halfH - this.layout.viewY);
    this.placeCamera();
  }

  /** A screen point as a point on the plane through the pyramid's centre. */
  private toWorld(clientX: number, clientY: number): { x: number; y: number } {
    const { nx, ny, halfW, halfH } = this.view(clientX, clientY);
    return {
      x: this.pan.x + nx * halfW,
      y: this.pan.y + this.layout.viewY + ny * halfH,
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
    const room = this.layout.panExtent * (1 - 1 / this.zoom);
    this.pan.set(
      clamp(this.pan.x, -room, room),
      clamp(this.pan.y, Math.max(-room, this.layout.panFloor), room),
    );
    const y = this.pan.y + this.layout.viewY;
    this.camera.position.set(this.pan.x, y, this.fitDistance / this.zoom);
    this.camera.lookAt(this.pan.x, y, 0);
    // Labels grow a little as you zoom, so zooming in also makes them easier
    // to read, not just further apart.
    this.stage.style.setProperty(
      '--kp-zoom',
      Math.pow(this.zoom, 0.35).toFixed(3),
    );
  }

  /* ── Frame ────────────────────────────────────────────────────────────── */

  private fit(): void {
    this.width = Math.max(1, this.stage.clientWidth);
    this.height = Math.max(1, this.stage.clientHeight);
    this.renderer.setSize(this.width, this.height);
    this.labels.setSize(this.width, this.height);
    this.flatLabels.setSize(this.width, this.height);

    // Back the camera off until the pyramid and its floating leaves fit the
    // narrower of the two directions.
    const aspect = this.width / this.height;
    const halfV = THREE.MathUtils.degToRad(this.camera.fov / 2);
    const halfH = Math.atan(Math.tan(halfV) * aspect);
    this.fitDistance = this.layout.fitRadius / Math.sin(Math.min(halfV, halfH));
    this.maxZoom = Math.max(1, this.fitDistance / this.layout.minDistance);
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
    this.group.rotation.set(this.tilt, this.yaw, 0);
    this.group.updateMatrixWorld(true);

    this.updateFacing();
    this.updateFront();
    this.stepLeaves(t, dt);
    this.updateHighlight(t);
    this.updateGlass(t);

    this.renderer.render(this.scene, this.camera);
    this.flatLabels.render(this.scene, this.camera);
    this.labels.render(this.scene, this.camera);
  };

  private turn(t: number, dt: number): void {
    if (this.press?.moved) return;

    if (this.intro !== null) {
      const e = t - this.intro;
      if (e < INTRO_HOLD) {
        this.yaw = INTRO_SPEED * e;
      } else {
        const fade = Math.exp(-INTRO_DECAY * (e - INTRO_HOLD));
        this.yaw =
          INTRO_SPEED * INTRO_HOLD + (INTRO_SPEED / INTRO_DECAY) * (1 - fade);
        if (INTRO_SPEED * fade < 0.01) {
          this.yaw = INTRO_YAW;
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

  private stepLeaves(t: number, dt: number): void {
    // Surface leaves are fixed to the glass and turn with it.
    if (this.layout.surface) return;
    const world = this.group.matrixWorld;
    for (const leaf of this.leaves) {
      const target = this.target.copy(leaf.rest);
      if (!this.reducedMotion) {
        target.addScaledVector(
          leaf.lift,
          0.05 * Math.sin(t * 1.1 + leaf.phase),
        );
      }
      target.applyMatrix4(world);
      for (const thread of leaf.threads) {
        thread.world.copy(thread.anchor).applyMatrix4(world);
      }

      if (!this.placed || this.reducedMotion) {
        leaf.pos.copy(target);
        leaf.vel.set(0, 0, 0);
      } else {
        this.acc
          .subVectors(target, leaf.pos)
          .multiplyScalar(SPRING)
          .addScaledVector(leaf.vel, -DAMPING);
        leaf.vel.addScaledVector(this.acc, dt);
        leaf.pos.addScaledVector(leaf.vel, dt);

        // A thread pulled past its give drags the leaf along behind it.
        for (const thread of leaf.threads) {
          const d = this.tmp.subVectors(leaf.pos, thread.world);
          const max = thread.length * MAX_STRETCH;
          const len = d.length();
          if (len > max) {
            d.multiplyScalar(1 / len);
            leaf.pos.copy(thread.world).addScaledVector(d, max);
            const outward = leaf.vel.dot(d);
            if (outward > 0) leaf.vel.addScaledVector(d, -outward);
          }
        }
      }
      leaf.object.position.copy(leaf.pos);

      // Slack threads sag; a yanked one pulls straight.
      for (const thread of leaf.threads) {
        const a = leaf.pos;
        const b = thread.world;
        const d = a.distanceTo(b);
        const sag =
          d < thread.length ? Math.sqrt(thread.length ** 2 - d ** 2) * SAG : 0;
        const control = this.tmp2.addVectors(a, b).multiplyScalar(0.5);
        control.y -= sag;
        thread.strand.setPath((s, out) => quadratic(a, control, b, s, out));
      }
    }
    this.placed = true;
  }

  private updateHighlight(t: number): void {
    const selection = this.selection;
    const e = selection ? t - selection.at : 0;
    // A chosen category starts the propagation itself; a leaf reaches it
    // after its thread has lit.
    const categoryAt = selection?.leaf ? THREAD_TIME : 0;
    const threadLit = clamp(e / THREAD_TIME, 0, 1);
    const stemLit = clamp((e - categoryAt) / STEM_TIME, 0, 1);
    const thingAt =
      selection?.leaf?.node.kind === 'bias'
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
        involved && e >= thingAt,
        !!selection && !involved,
      );
    }
  }

  private updateGlass(t: number): void {
    // Panes: a little brighter where the window light falls.
    const light = this.tmp.set(0.3, 0.8, 0.5).normalize();
    this.faceMeshes.forEach((mesh, k) => {
      const lambert = Math.max(0, this.faceNormals[k].dot(light));
      mesh.material.opacity = this.facing[k] > 0 ? 0.04 + 0.1 * lambert : 0.03;
    });

    // Edges: the site's .glass-edge — a stroke breathing white→blue with a
    // blue bloom that comes in as it goes blue, on the same 4s rhythm.
    const blue = this.reducedMotion
      ? 0
      : 0.75 * (0.5 - 0.5 * Math.cos((t / 4) * Math.PI * 2));
    for (const edge of this.edges) {
      const front = edge.faces.some((f) => this.facing[f] > 0);
      edge.core.material.color.setRGB(1, 1, 1).lerp(this.edgeBlue, blue);
      edge.core.material.opacity = front ? 0.75 : 0.25;
      edge.glow.material.opacity = blue * (front ? 0.45 : 0.12);
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

  setPath(at: (t: number, out: THREE.Vector3) => void): void {
    this.points.forEach((point, i) => at(i / SEGMENTS, point));
    writeLine(this.glow, this.points);
    writeLine(this.core, this.points);
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

/* ── Labels ─────────────────────────────────────────────────────────────── */

/**
 * A node's label: a zero-size box at the node's point, holding a glowing dot
 * and the words. CSS places the words around the dot per node type.
 */
function nodeElement(
  className: string,
  label: string,
  button = false,
): HTMLElement {
  const root = document.createElement('div');
  root.className = `kp-node ${className}`;
  const dot = document.createElement('span');
  dot.className = 'kp-dot';
  const text = document.createElement(button ? 'button' : 'span');
  text.className = 'kp-label';
  text.textContent = label;
  if (button) (text as HTMLButtonElement).type = 'button';
  root.append(dot, text);
  return root;
}

/**
 * A thing's label, which is also the sentence: the name sits centred under
 * its face with "when thinking about" before it, and after it an ending —
 * empty until a choice finishes the sentence (see `finish`) — with the X that
 * clears the choice.
 */
function thingElement(
  label: string,
  onClear: () => void,
): { root: HTMLElement; ending: HTMLElement } {
  const root = nodeElement('kp-thing', label);
  const text = root.querySelector('.kp-label') as HTMLElement;
  text.textContent = '';

  const lead = document.createElement('span');
  lead.className = 'kp-thing-lead';
  lead.textContent = 'when thinking about';
  const name = document.createElement('span');
  name.className = 'kp-thing-name';
  name.textContent = label;

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

function labelObject(root: HTMLElement, at: THREE.Vector3): CSS2DObject {
  const object = new CSS2DObject(root);
  object.center.set(0, 0);
  object.position.copy(at);
  return object;
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

/** Keeps a label box inside a face, clear of its edges by SURFACE_MARGIN. */
function keepBoxOnFace(box: Box, bounds: ReturnType<typeof triangle>): void {
  const m = SURFACE_MARGIN;
  const halfBase = bounds.halfWidth(bounds.baseY);
  const slant = bounds.apexY - bounds.baseY;
  // The face narrows upward, so it's the box's top edge that has to fit.
  const highest =
    bounds.apexY - ((box.w / 2 + m) * slant) / halfBase - box.h / 2;
  const cy = clamp(box.y + box.oy, bounds.baseY + box.h / 2 + m, highest);
  const room = Math.max(0, bounds.halfWidth(cy + box.h / 2) - box.w / 2 - m);
  const cx = clamp(box.x + box.ox, -room, room);
  box.x = cx - box.ox;
  box.y = cy - box.oy;
}

/** A repeatable random sequence in [0, 1) from a string (mulberry32). */
function seededRandom(seed: string): () => number {
  let h = 1779033703;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = (h + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function quadratic(
  a: THREE.Vector3,
  control: THREE.Vector3,
  b: THREE.Vector3,
  t: number,
  out: THREE.Vector3,
): THREE.Vector3 {
  const u = 1 - t;
  return out.set(
    u * u * a.x + 2 * u * t * control.x + t * t * b.x,
    u * u * a.y + 2 * u * t * control.y + t * t * b.y,
    u * u * a.z + 2 * u * t * control.z + t * t * b.z,
  );
}

/**
 * Pushes overlapping label boxes apart, each still drawn back to its start —
 * and, given `bound`, held within it after every step.
 */
function relax(
  boxes: Box[],
  gap = LABEL_GAP,
  bound?: (box: Box) => void,
): void {
  for (let iteration = 0; iteration < 500; iteration++) {
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i];
        const b = boxes[j];
        if (a.fixed && b.fixed) continue;
        const dx = b.x + b.ox - (a.x + a.ox);
        const dy = b.y + b.oy - (a.y + a.oy);
        const px = (a.w + b.w) / 2 + gap - Math.abs(dx);
        const py = (a.h + b.h) / 2 + gap - Math.abs(dy);
        if (px <= 0 || py <= 0) continue;
        const share = a.fixed || b.fixed ? 1 : 0.5;
        const horizontal = px < py;
        const push = (horizontal ? px : py) * share;
        const sign = (horizontal ? dx : dy) >= 0 ? 1 : -1;
        if (!a.fixed) {
          if (horizontal) a.x -= sign * push;
          else a.y -= sign * push;
        }
        if (!b.fixed) {
          if (horizontal) b.x += sign * push;
          else b.y += sign * push;
        }
      }
    }
    for (const box of boxes) {
      if (box.fixed) continue;
      box.x += (box.homeX - box.x) * 0.02;
      box.y += (box.homeY - box.y) * 0.02;
      bound?.(box);
    }
  }
}

interface Point {
  x: number;
  y: number;
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
