// Three triangle frames stacked toward the lower right, inside three rings stacked the same way.
// Each ring is opened a little wider than the one behind it. One ring carries one patterned accent.
const DEG = Math.PI / 180;
const BLUE = [30, 67, 93], BRONZE = [150, 114, 72], STEEL = [118, 147, 168], LIGHT = [226, 233, 238];
const BAR = 11, DEPTH = 7, SIZE = 1.05;

// Proportions follow the reference drawing: each frame is larger and sits lower right of the last.
const triangles = [
  { points: [[-41, -190], [105, 63], [-185, 63]], color: STEEL },
  { points: [[-10, -169], [155, 95], [-176, 95]], color: BRONZE },
  { points: [[19, -148], [191, 129], [-155, 129]], color: BLUE },
];
// Back to front. Every opening starts at the same upper-right angle and reaches further round.
export const rings = [
  { centre: [-12, -12], radius: 236, gap: 24, color: STEEL },
  { centre: [0, 0], radius: 250, gap: 78, color: BRONZE },
  { centre: [12, 12], radius: 264, gap: 150, color: BLUE, accent: { from: 150, to: 192, cells: 7 } },
];
const GAP_START = -64, HALF = 6, ACCENT_HALF = 15;

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
  const yaw = -.1 + Math.sin(time * .52) * .24 - open * .08;
  const pitch = .08 + Math.sin(time * .41) * .1 + open * .04;
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  function project(x, y, z) {
    const xx = x * cy + z * sy, zz = -x * sy + z * cy;
    const yy = y * cp - zz * sp, zzz = y * sp + zz * cp;
    const scale = SIZE * 700 / (700 + zzz);
    return [450 + xx * scale, 360 + yy * scale, zzz];
  }
  // `bias` only moves a face earlier or later in paint order; it keeps the inlay above its own band.
  function face(points, color, tone, layer, kind, bias = 0) {
    const fill = `rgb(${color.map(c => Math.round(Math.max(12, Math.min(244, c * tone)))).join(',')})`;
    faces.push({ points, fill, layer, kind, depth: points.reduce((sum, p) => sum + p[2], 0) / points.length - bias });
  }
  function slab(outline, place, color, layer, kind) {
    const front = outline.map(([x, y]) => place(x, y, 0)), back = outline.map(([x, y]) => place(x, y, DEPTH));
    face(front, color, 1, layer, kind);
    face(back, color, .52, layer, kind);
    outline.forEach((p, i) => {
      const n = (i + 1) % outline.length, q = outline[n];
      face([front[i], front[n], back[n], back[i]], color, .68 + Math.cos(Math.atan2(q[1] - p[1], q[0] - p[0]) - .9) * .14, layer, kind);
    });
  }
  const polar = (radius, degrees) => [Math.cos(degrees * DEG) * radius, Math.sin(degrees * DEG) * radius];
  function arc(from, to, inner, outer, place, color, layer, kind) {
    const steps = Math.max(1, Math.ceil((to - from) / 4));
    for (let i = 0; i < steps; i++) {
      const a = from + (to - from) * i / steps, b = from + (to - from) * (i + 1) / steps;
      slab([polar(outer, a), polar(outer, b), polar(inner, b), polar(inner, a)], place, color, layer, kind);
    }
  }

  for (const [index, ring] of rings.entries()) {
    // Rings turn together; opening fans them apart so the three openings step round one after another.
    const turn = time * .2 + open * (index - 1) * .45;
    const tilt = Math.sin(time * .8 - index * .8) * (.05 + open * .12);
    const lift = 10 - (index - 1) * (10 + open * 34) + Math.sin(time * 1.4 - index * .9) * 5;
    const ct = Math.cos(turn), st = Math.sin(turn);
    const place = (x, y, z) => {
      const rx = x * ct - y * st, ry = x * st + y * ct;
      return project(ring.centre[0] + rx, ring.centre[1] + ry * Math.cos(tilt) - z * Math.sin(tilt), lift + ry * Math.sin(tilt) + z * Math.cos(tilt));
    };
    const from = GAP_START + ring.gap, to = GAP_START + 360, layer = 3 + index;
    const inner = ring.radius - HALF, outer = ring.radius + HALF;
    if (!ring.accent) { arc(from, to, inner, outer, place, ring.color, layer, 'ring'); continue; }
    // The single accent: the band swells and holds one row of teeth, a triangle repeat from Samoan tatau and siapo.
    const accent = ring.accent, low = ring.radius - ACCENT_HALF, high = ring.radius + ACCENT_HALF;
    arc(from, accent.from, inner, outer, place, ring.color, layer, 'ring');
    arc(accent.from, accent.to, low, high, place, ring.color, layer, 'accent');
    arc(accent.to, to, inner, outer, place, ring.color, layer, 'ring');
    const step = (accent.to - accent.from - 4) / accent.cells;
    for (let i = 0; i < accent.cells; i++) {
      const a = accent.from + 2 + step * i;
      const tooth = [polar(low + 5, a + .5), polar(low + 5, a + step - .5), polar(high - 5, a + step / 2)];
      face(tooth.map(([x, y]) => place(x, y, -1)), LIGHT, 1, layer, 'inlay-teeth', 5);
    }
  }

  for (const [index, triangle] of triangles.entries()) {
    const outer = triangle.points, inner = inset(outer, BAR);
    const centre = [(outer[0][0] + outer[1][0] + outer[2][0]) / 3, (outer[0][1] + outer[1][1] + outer[2][1]) / 3];
    // A wave passes from the back frame to the front: each one sways and bobs a beat later.
    const sway = Math.sin(time * 1.25 - index * .75) * (.04 + open * .16);
    const lift = -(index - 1) * (14 + open * 36) + Math.sin(time * 1.6 - index * .9) * 6 * (.3 + open);
    const cs = Math.cos(sway), ss = Math.sin(sway);
    const place = (x, y, z) => {
      const lx = x - centre[0];
      return project(centre[0] + lx * cs + z * ss, y, lift - lx * ss + z * cs);
    };
    for (let edge = 0; edge < 3; edge++) {
      const n = (edge + 1) % 3;
      slab([outer[edge], outer[n], inner[n], inner[edge]], place, triangle.color, index, 'triangle');
    }
  }
  return faces.sort((a, b) => b.depth - a.depth);
}
