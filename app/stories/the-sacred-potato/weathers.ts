// The desert's vocabulary. Each scene declares one of these signatures;
// the engine blends between neighbours as the walk carries the reader through.
// All values are targets — the two clocks (scroll, lived time) modulate them.

export type Weather = {
  sky: [string, string, string]; // top, mid, horizon
  stars: number; // 0..1
  glow: number; // horizon light strength 0..1
  glowColor: string;
  glowX: number; // 0..1 viewport x
  heat: number; // shimmer 0..1+
  wind: number; // particle drift 0..2
  dust: number; // particle density 0..1
  tree: number; // presence of the tree 0..1
  treeX: number; // 0..1 viewport x
  treeNear: number; // 0 distant silhouette .. 1 close
  grove: number; // extra trees 0..1
  dim: number; // interior darkness over the stage 0..1
  bleach: number; // the recycling desert washing out 0..1
};

const BASE: Weather = {
  sky: ["#08090d", "#0a0c11", "#0e1016"],
  stars: 0,
  glow: 0,
  glowColor: "#3c4356",
  glowX: 0.5,
  heat: 0,
  wind: 0.3,
  dust: 0.3,
  tree: 0,
  treeX: 0.5,
  treeNear: 0.2,
  grove: 0,
  dim: 0,
  bleach: 0,
};

const w = (o: Partial<Weather>): Weather => ({ ...BASE, ...o });

export const WEATHERS: Record<string, Weather> = {
  // the dark before the first word
  void: w({ stars: 0.12, glow: 0.1, dim: 0.55, wind: 0.25, dust: 0.18 }),

  // the ninth-season crossing: heat expressed as warmth, not brightness
  hardlight: w({
    sky: ["#150e07", "#1f1406", "#38230d"],
    glow: 0.6,
    glowColor: "#c98a3f",
    glowX: 0.62,
    heat: 0.75,
    wind: 1,
    dust: 0.55,
  }),

  duskwalk: w({
    sky: ["#120f18", "#1c1420", "#33202a"],
    stars: 0.22,
    glow: 0.32,
    glowColor: "#b06a4a",
    glowX: 0.3,
    heat: 0.25,
    wind: 0.55,
    dust: 0.4,
  }),

  nightstars: w({
    sky: ["#060910", "#0a0e18", "#121a2a"],
    stars: 1,
    glow: 0.1,
    glowColor: "#6a7c9c",
    wind: 0.3,
    dust: 0.28,
  }),

  // memory interiors: the desert almost gone, a warmth far off
  memory: w({
    sky: ["#0a0910", "#0d0b12", "#141017"],
    stars: 0.06,
    glow: 0.14,
    glowColor: "#8a6a4a",
    wind: 0.2,
    dust: 0.15,
    dim: 0.8,
  }),

  // "the hour when light begins to change" — the tree arrives
  treehour: w({
    sky: ["#181109", "#27190b", "#4a2e13"],
    glow: 0.78,
    glowColor: "#d99a4f",
    heat: 0.45,
    wind: 0.6,
    dust: 0.5,
    tree: 1,
    treeNear: 0.12,
  }),

  // under the branches with Senna: the canopy looms in from the side
  shade: w({
    sky: ["#101208", "#181a0e", "#2a2716"],
    glow: 0.3,
    glowColor: "#9a8a4f",
    heat: 0.12,
    wind: 0.35,
    dust: 0.3,
    tree: 1,
    treeX: 0.8,
    treeNear: 0.95,
  }),

  // the first bite: three heartbeats of actual quiet
  firstbite: w({
    sky: ["#070708", "#09090b", "#0d0c0d"],
    glowColor: "#c9762a",
    wind: 0.1,
    dust: 0.08,
    dim: 0.92,
  }),

  // seven trees in a loose circle
  grove: w({
    sky: ["#161008", "#241708", "#3d2810"],
    glow: 0.42,
    glowColor: "#c98a3f",
    glowX: 0.42,
    heat: 0.5,
    wind: 0.7,
    dust: 0.5,
    tree: 1,
    treeX: 0.6,
    treeNear: 0.28,
    grove: 1,
  }),

  firenight: w({
    sky: ["#0a0a10", "#0e0d14", "#181220"],
    stars: 0.75,
    glow: 0.3,
    glowColor: "#c97a3a",
    heat: 0.06,
    wind: 0.25,
    dust: 0.25,
  }),

  // the recycling desert: the same place returning, faster and more bleached
  relapse1: w({
    sky: ["#150e07", "#1f1406", "#38230d"],
    glow: 0.6,
    glowColor: "#c98a3f",
    glowX: 0.62,
    heat: 0.9,
    wind: 1.15,
    dust: 0.6,
    tree: 0.9,
    treeX: 0.72,
    treeNear: 0.16,
    bleach: 0.3,
  }),
  relapse2: w({
    sky: ["#171008", "#221606", "#3b250e"],
    glow: 0.55,
    glowColor: "#c9975a",
    glowX: 0.62,
    heat: 1.05,
    wind: 1.3,
    dust: 0.68,
    tree: 0.9,
    treeX: 0.72,
    treeNear: 0.16,
    bleach: 0.6,
  }),
  relapse3: w({
    sky: ["#171008", "#221606", "#3b250e"],
    glow: 0.6,
    glowColor: "#cfae7e",
    glowX: 0.62,
    heat: 1.2,
    wind: 1.5,
    dust: 0.75,
    tree: 0.9,
    treeX: 0.72,
    treeNear: 0.16,
    bleach: 0.85,
  }),

  // letters: paper held close in the dark
  parchment: w({
    sky: ["#0b0a0d", "#0e0c0e", "#151013"],
    stars: 0.1,
    glow: 0.2,
    glowColor: "#8a6a4a",
    wind: 0.2,
    dust: 0.15,
    dim: 0.7,
  }),

  // the collapse: heat past meaning
  whiteout: w({
    sky: ["#3a3024", "#463a29", "#584732"],
    glow: 0.9,
    glowColor: "#e8c890",
    heat: 1,
    wind: 0.9,
    dust: 0.6,
    bleach: 0.5,
  }),

  // the season of gentle rain: the first cool tone in the whole read
  rainhint: w({
    sky: ["#0c1210", "#121a15", "#1c2820"],
    stars: 0.15,
    glow: 0.22,
    glowColor: "#5a7c62",
    glowX: 0.4,
    wind: 0.45,
    dust: 0.3,
  }),

  // the glassblower's fire
  ember: w({
    sky: ["#100b08", "#170e08", "#26130a"],
    stars: 0.2,
    glow: 0.6,
    glowColor: "#d96a2a",
    heat: 0.2,
    wind: 0.2,
    dust: 0.2,
    dim: 0.25,
  }),

  villagewarm: w({
    sky: ["#100e12", "#181218", "#2c1d1e"],
    stars: 0.35,
    glow: 0.35,
    glowColor: "#c08050",
    heat: 0.15,
    wind: 0.4,
    dust: 0.3,
  }),

  predawn: w({
    sky: ["#0a0e18", "#101828", "#26304a"],
    stars: 0.8,
    glow: 0.18,
    glowColor: "#8a94ac",
    glowX: 0.6,
    wind: 0.25,
    dust: 0.22,
  }),

  // the ninth-year morning: this weather also drives the page's inversion
  dawn: w({
    sky: ["#101828", "#2a3350", "#7a5e46"],
    stars: 0.5,
    glow: 0.8,
    glowColor: "#e8b070",
    glowX: 0.6,
    heat: 0.1,
    wind: 0.3,
    dust: 0.25,
    tree: 1,
    treeX: 0.78,
    treeNear: 0.32,
  }),
};

export const DEFAULT_WEATHER = WEATHERS.void;
