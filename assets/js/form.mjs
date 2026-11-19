// A three-fold emblem in three zones: outside, three broken rings overlapped like a triple
// exposure; between, three triangle frames fanned about one centre; inside, three paisley drops.
// Turning the model 120 degrees about its centre gives the same figure at every moment.
const DEG = Math.PI / 180, THIRD = 120 * DEG;
const BLUE = [30, 67, 93], BRONZE = [150, 114, 72], STEEL = [118, 147, 168], LIGHT = [226, 233, 238];
const DEPTH = 7, SIZE = 1.36;

// Ring-local angles in degrees; 0 points away from the emblem's centre.
// Patterns sit inside the band, between its edges, never as spikes outside it.
export const ring = {
  offset: 16, spread: 20, inner: 183, outer: 207,
  solid: [28, 344],
  dashes: [[18.5, 22, 3], [24, 26, 7]],
  inlays: [
    { kind: 'inlay-teeth', from: 44, to: 110, cells: 11 },
    { kind: 'inlay-paisley', from: 150, to: 210, cells: 6 },
    { kind: 'inlay-diamond', from: 262, to: 322, cells: 9 },
  ],
};
const ringColors = [BLUE, BRONZE, STEEL], triangleColors = [STEEL, BLUE, BRONZE], dropColors = [BRONZE, STEEL, BLUE];

// A paisley drop: round head, belly sweeping forward, tip curling back over an inner hollow.
const drop = (() => {
  const points = [];
  for (let a = 60; a <= 300; a += 24) points.push([Math.cos(a * DEG) * 7.5, Math.sin(a * DEG) * 7.5]);
  const start = points[0], end = points.at(-1), tip = [19, 8];
  const curve = (a, c, b, t) => [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]];
  for (let i = 1; i <= 6; i++) points.push(curve(end, [13, -9], tip, i / 6));
  for (let i = 1; i < 6; i++) points.push(curve(tip, [10, 2.5], start, i / 6));
  return points;
})();
const dot = [0, 60, 120, 180, 240, 300].map(a => [Math.cos(a * DEG), Math.sin(a * DEG)]);

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
  // The camera starts square-on, so the still image is the flat, symmetric mark.
  const yaw = Math.sin(time * .5) * .26, pitch = Math.sin(time * .41) * .11;
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  function project(x, y, z) {
    const xx = x * cy + z * sy, zz = -x * sy + z * cy;
    const yy = y * cp - zz * sp, zzz = y * sp + zz * cp;
    const scale = SIZE * 700 / (700 + zzz);
    return [450 + xx * scale, 360 + yy * scale, zzz];
  }
  // `bias` only moves a face earlier or later in paint order; it keeps inlays above their own band.
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
  const plate = (outline, place, color, layer, kind, bias = 5) => face(outline.map(([x, y]) => place(x, y, -1)), color, 1, layer, kind, bias);
  const polar = (radius, degrees) => [Math.cos(degrees * DEG) * radius, Math.sin(degrees * DEG) * radius];
  function arc(from, to, inner, outer, place, color, layer, kind) {
    const steps = Math.max(1, Math.ceil((to - from) / 5));
    for (let i = 0; i < steps; i++) {
      const a = from + (to - from) * i / steps, b = from + (to - from) * (i + 1) / steps;
      slab([polar(outer, a), polar(outer, b), polar(inner, b), polar(inner, a)], place, color, layer, kind);
    }
  }
  const turned = (angle, x, y) => [x * Math.cos(angle) - y * Math.sin(angle), x * Math.sin(angle) + y * Math.cos(angle)];

  // Three rings sit almost on top of each other, woven together. Opening pushes them apart and tips them forward.
  const bloom = open * .16 + Math.sin(time * 1.1) * .03;
  const ringTurn = time * .2 + open * .5;
  const apart = ring.offset + open * ring.spread + Math.sin(time * 1.7) * 3;
  // Each ring leans the same way round, so it passes over one neighbour and under the other.
  const weave = .05 + open * .07;
  const mid = (ring.inner + ring.outer) / 2, low = ring.inner + 4, high = ring.outer - 4;
  for (let k = 0; k < 3; k++) {
    const heading = -90 * DEG + k * THIRD + ringTurn, color = ringColors[k], layer = 3 + k;
    const place = (x, y, z) => {
      const tx = x * Math.cos(bloom) + z * Math.sin(bloom), tz = -x * Math.sin(bloom) + z * Math.cos(bloom);
      const wy = y * Math.cos(weave) - tz * Math.sin(weave), wz = y * Math.sin(weave) + tz * Math.cos(weave);
      const [rx, ry] = turned(heading, apart + tx, wy);
      return project(rx, ry, 30 + open * 22 + wz);
    };
    arc(ring.solid[0], ring.solid[1], ring.inner, ring.outer, place, color, layer, 'ring');
    for (const [from, to, thin] of ring.dashes) arc(from, to, ring.inner + thin, ring.outer - thin, place, color, layer, 'ring-dash');
    for (const inlay of ring.inlays) {
      const step = (inlay.to - inlay.from) / inlay.cells;
      for (let i = 0; i < inlay.cells; i++) {
        const a = inlay.from + step * i;
        if (inlay.kind === 'inlay-teeth') {
          // Alternating light triangles leave dark ones between them: one row of teeth inside the band.
          plate([polar(low, a + .5), polar(low, a + step - .5), polar(high, a + step / 2)], place, LIGHT, layer, inlay.kind);
        } else if (inlay.kind === 'inlay-diamond') {
          const centre = a + step / 2;
          plate([polar(mid, a + .6), polar(high, centre), polar(mid, a + step - .6), polar(low, centre)], place, LIGHT, layer, inlay.kind);
          plate([polar(mid, centre - step * .16), polar(mid + 3, centre), polar(mid, centre + step * .16), polar(mid - 3, centre)], place, color, layer, inlay.kind, 8);
        } else {
          // Small paisley drops follow the curve of the band, heads leading.
          const along = (u, v) => polar(mid + v * .8, a + step * .3 + u * .8 / mid / DEG);
          plate(drop.map(([u, v]) => along(u, v)), place, LIGHT, layer, inlay.kind);
          plate(dot.map(([u, v]) => along(u * 2.4, v * 2.4)), place, color, layer, inlay.kind, 8);
        }
      }
    }
  }

  // Three equal triangles share the centre, 40 degrees apart: a nine-pointed outline.
  const fan = -time * .22 - open * 40 * DEG;
  for (let k = 0; k < 3; k++) {
    const turn = fan + k * 40 * DEG, lift = (k - 1) * (5 + open * 30) - open * 12;
    const outer = [0, 1, 2].map(j => polar(150, -90 + j * 120)), inner = inset(outer, 10);
    const place = (x, y, z) => { const [rx, ry] = turned(turn, x, y); return project(rx, ry, lift + z); };
    for (let edge = 0; edge < 3; edge++) {
      const n = (edge + 1) % 3;
      slab([outer[edge], outer[n], inner[n], inner[edge]], place, triangleColors[k], k, 'triangle');
    }
  }

  // The core: three paisley drops chase each other, widening as the emblem opens.
  const whirl = time * .85 + open * 1.3, reach = 29 + open * 9, near = -(30 + open * 46) - Math.sin(time * 1.6) * 5;
  for (let k = 0; k < 3; k++) {
    const angle = whirl + k * THIRD + 30 * DEG;
    const place = (x, y, z) => {
      const [hx, hy] = turned(angle + 96 * DEG, x * 2.5, y * 2.5);
      const [rx, ry] = turned(angle, reach, 0);
      return project(rx + hx, ry + hy, near + z);
    };
    slab(drop, place, dropColors[k], 6, 'drop');
    plate(drop.map(([x, y]) => [x * .56 + .6, y * .56 + .2]), (x, y, z) => place(x, y, z - .4), LIGHT, 6, 'drop-inlay');
    plate(dot.map(([x, y]) => [x * 1.5 + .4, y * 1.5]), (x, y, z) => place(x, y, z - .4), dropColors[k], 6, 'drop-inlay', 8);
  }
  return faces.sort((a, b) => b.depth - a.depth);
}
