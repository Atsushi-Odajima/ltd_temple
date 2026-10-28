// Original Freedom sculpture: the ten vertices come from the existing brand mark.
const outline = [[50,96],[39.13,64.97],[6.25,64.21],[32.41,44.28],[22.96,12.79],[50,31.5],[77.04,12.79],[67.59,44.28],[93.75,64.21],[60.87,64.97]];
export function sculpture(time = 0, open = 0) {
  const faces = [];
  const yaw = -.56 + Math.sin(time * .19) * .13 - open * .28;
  const pitch = .28 + Math.cos(time * .15) * .08;
  function point(x, y, z, twist) {
    const a = Math.cos(twist), b = Math.sin(twist);
    const xx = x * a - y * b, yy = x * b + y * a;
    const xxx = xx * Math.cos(yaw) + z * Math.sin(yaw);
    const zz = -xx * Math.sin(yaw) + z * Math.cos(yaw);
    const yyy = yy * Math.cos(pitch) - zz * Math.sin(pitch);
    const zzz = yy * Math.sin(pitch) + zz * Math.cos(pitch);
    const scale = 700 / (700 + zzz);
    return [450 + xxx * scale, 360 + yyy * scale, zzz];
  }
  function face(points, tone, bronze = false) {
    const base = bronze ? [166,130,88] : [194,210,222];
    const fill = `rgb(${base.map(c => Math.round(Math.max(20, Math.min(250, c * tone)))).join(',')})`;
    faces.push({ points, fill, depth: points.reduce((sum,p) => sum + p[2],0) / points.length });
  }
  for (let layer=0; layer<15; layer++) {
    const z = (layer - 7) * (13 + open * 8);
    const twist = (layer - 7) * (.024 + open * .022) + Math.sin(time * .12) * .05;
    const radius = 5.65 - layer * .032;
    const vertices = (ratio,dz) => outline.map(([x,y]) => point((x-50)*radius*ratio,(y-52)*radius*ratio,z+dz,twist));
    const outer=vertices(1,0), inner=vertices(.91,0), back=vertices(1,5), inside=vertices(.91,5);
    for(let j=0;j<10;j++) {
      const n=(j+1)%10;
      const tone=.79 + Math.sin(j*.61+layer*.07)*.17;
      const bronze=layer===7;
      face([outer[j],outer[n],inner[n],inner[j]],1.06,bronze);
      face([outer[j],back[j],back[n],outer[n]],tone,bronze);
      face([inner[j],inner[n],inside[n],inside[j]],tone*.62,bronze);
    }
  }
  return faces.sort((a,b)=>b.depth-a.depth);
}
