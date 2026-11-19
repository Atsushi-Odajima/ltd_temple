// Three offset triangle frames inside a broken ring.
// Saw-tooth and diamond bands are point accents, never an all-over surface pattern.
const DEG = Math.PI / 180;
const BLUE = [30, 67, 93], BRONZE = [150, 114, 72], STEEL = [118, 147, 168];
const BAR = 11, DEPTH = 7, SIZE = 1.2;

// Ring-local angles in degrees. Everything between the arcs is open air.
export const ringArcs = [
  { from: -8, to: 138, inner: 238, outer: 250, kind: 'ring', color: BLUE },
  { from: 156, to: 232, inner: 245, outer: 250, kind: 'niho', color: BRONZE },
  { from: 246, to: 304, inner: 252, outer: 260, kind: 'ring-float', color: STEEL },
];
// The solid arc breaks up into shorter and thinner strokes before the widest opening.
const dashes = [[-13.5, -10.5, 239, 249], [-18.5, -16, 240.5, 247.5], [-22.5, -21, 242, 246]];

// Proportions follow the reference drawing: each frame is larger and sits lower right of the last.
const triangles = [
  { points: [[-41, -190], [105, 63], [-185, 63]], color: STEEL },
  { points: [[-10, -169], [155, 95], [-176, 95]], color: BRONZE },
  { points: [[19, -148], [191, 129], [-155, 129]], color: BLUE },
];

function inset(points, distance) {
  const [a, b, c] = points;
  const la = Math.hypot(b[0] - c[0], b[1] - c[1]), lb = Math.hypot(a[0] - c[0], a[1] - c[1]), lc = Math.hypot(a[0] - b[0], a[1] - b[1]);
  const perimeter = la + lb + lc;
  const centre = [(la * a[0] + lb * b[0] + lc * c[0]) / perimeter, (la * a[1] + lb * b[1] + lc * c[1]) / perimeter];
  const area = Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1])) / 2;
  const k = 1 - distance / (2 * area / perimeter);
  return points.map(p => [centre[0] + (p[0] - centre[0]) * k, centre[1] + (p[1] - centre[1]) * k]);
}

export function sculpture(time = 0, open = 0) {
  const faces = [];
  const yaw = -.16 + Math.sin(time * .52) * .3 - open * .12;
  const pitch = .1 + Math.sin(time * .41) * .1 + open * .04;
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  function project(x, y, z) {
    const xx = x * cy + z * sy, zz = -x * sy + z * cy;
    const yy = y * cp - zz * sp, zzz = y * sp + zz * cp;
    const scale = SIZE * 700 / (700 + zzz);
    return [450 + xx * scale, 360 + yy * scale, zzz];
  }
  function face(points, color, tone, layer, kind) {
    const fill = `rgb(${color.map(c => Math.round(Math.max(12, Math.min(244, c * tone)))).join(',')})`;
    faces.push({ points, fill, layer, kind, depth: points.reduce((sum, p) => sum + p[2], 0) / points.length });
  }
  // Extrudes a flat outline into a thin slab: front, back, then one wall per edge.
  function slab(outline, place, color, layer, kind) {
    const front = outline.map(([x, y]) => place(x, y, 0)), back = outline.map(([x, y]) => place(x, y, DEPTH));
    face(front, color, 1, layer, kind);
    face(back, color, .52, layer, kind);
    outline.forEach((p, i) => {
      const n = (i + 1) % outline.length, q = outline[n];
      const light = Math.atan2(q[1] - p[1], q[0] - p[0]);
      face([front[i], front[n], back[n], back[i]], color, .68 + Math.cos(light - .9) * .14, layer, kind);
    });
  }

  // The ring turns continuously and rocks like a gyroscope behind the triangles.
  const spin = time * .2 + open * .6;
  const rock = Math.sin(time * .8) * .1 * (.4 + open);
  const ringZ = 26 + open * 30;
  const onRing = (extraTurn, lift) => (x, y, z) => {
    const a = spin + extraTurn, c = Math.cos(a), s = Math.sin(a);
    const rx = x * c - y * s, ry = x * s + y * c, rz = z + lift;
    return project(rx, ry * Math.cos(rock) - rz * Math.sin(rock), ringZ + ry * Math.sin(rock) + rz * Math.cos(rock));
  };
  const polar = (radius, degrees) => [Math.cos(degrees * DEG) * radius, Math.sin(degrees * DEG) * radius];
  function arc(from, to, inner, outer, place, color, layer, kind) {
    const steps = Math.max(1, Math.ceil((to - from) / 4));
    for (let i = 0; i < steps; i++) {
      const a = from + (to - from) * i / steps, b = from + (to - from) * (i + 1) / steps;
      slab([polar(outer, a), polar(outer, b), polar(inner, b), polar(inner, a)], place, color, layer, kind);
    }
  }
  const still = onRing(0, 0);
  // One arc floats forward and counter-rotates, so the circle never quite closes.
  const floating = onRing(-(Math.sin(time * .9) * 8 + open * 10) * DEG, -(18 + open * 26));
  for (const [index, part] of ringArcs.entries()) {
    arc(part.from, part.to, part.inner, part.outer, part.kind === 'ring-float' ? floating : still, part.color, 3 + index, part.kind === 'niho' ? 'rim' : part.kind);
  }
  const drift = Math.sin(time * 1.4) * 1.5;
  for (const [from, to, inner, outer] of dashes) arc(from - drift, to - drift, inner, outer, still, BLUE, 3, 'dash');
  // Saw-tooth band: a row of inward teeth whose height travels as a wave.
  const teeth = ringArcs[1], count = 12, pitchAngle = (teeth.to - teeth.from) / count;
  for (let i = 0; i < count; i++) {
    const a = teeth.from + pitchAngle * i, height = 15 + Math.sin(time * 3 - i * .8) * 5 * (.5 + open * .5);
    slab([polar(243, a + .7), polar(243, a + pitchAngle - .7), polar(243 - height, a + pitchAngle / 2)], still, BRONZE, 4, 'niho');
  }

  for (const [index, triangle] of triangles.entries()) {
    const outer = triangle.points, inner = inset(outer, BAR);
    const centre = [(outer[0][0] + outer[1][0] + outer[2][0]) / 3, (outer[0][1] + outer[1][1] + outer[2][1]) / 3];
    // A wave passes from the back frame to the front: each one sways and bobs a beat later.
    const sway = Math.sin(time * 1.25 - index * .75) * (.04 + open * .18);
    const roll = Math.sin(time * .7 - index * .6) * .05 * open;
    const lift = -(index - 1) * (16 + open * 52) + Math.sin(time * 1.6 - index * .9) * 6 * (.3 + open);
    const grow = 1 + open * .04 * (index - 1);
    const cs = Math.cos(sway), ss = Math.sin(sway), cr = Math.cos(roll), sr = Math.sin(roll);
    const place = (x, y, z) => {
      const lx = (x - centre[0]) * grow, ly = (y - centre[1]) * grow;
      const rx = lx * cr - ly * sr, ry = lx * sr + ly * cr;
      return project(centre[0] + rx * cs + z * ss, centre[1] + ry, lift - rx * ss + z * cs);
    };
    for (let edge = 0; edge < 3; edge++) {
      const n = (edge + 1) % 3;
      // The middle frame swaps its base for a chain of diamonds.
      if (index === 1 && edge === 1) {
        const start = [(outer[1][0] + inner[1][0]) / 2, (outer[1][1] + inner[1][1]) / 2];
        const end = [(outer[2][0] + inner[2][0]) / 2, (outer[2][1] + inner[2][1]) / 2];
        const links = 13, half = BAR * .8;
        for (let i = 0; i < links; i++) {
          const x = start[0] + (end[0] - start[0]) * (i + .5) / links, y = start[1];
          const reach = Math.abs(end[0] - start[0]) / links / 2;
          slab([[x - reach, y], [x, y - half], [x + reach, y], [x, y + half]], place, triangle.color, index, 'malu');
        }
        continue;
      }
      slab([outer[edge], outer[n], inner[n], inner[edge]], place, triangle.color, index, 'triangle');
    }
    if (index === 2) {
      const [x, y] = outer[0];
      slab([[x - 9, y - 6], [x, y - 17], [x + 9, y - 6], [x, y + 5]], (px, py, pz) => place(px, py, pz - 5), BRONZE, index, 'node');
    }
  }
  return faces.sort((a, b) => b.depth - a.depth);
}
