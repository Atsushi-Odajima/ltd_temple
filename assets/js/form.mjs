// Original layered annulus with a restrained, repeating geometric inlay.
// Newly drawn triangles, chevrons and bars, not traced traditional tatau.
const TAU = Math.PI * 2;
const SEGMENTS = 72;
const circle = Array.from({length:SEGMENTS+1},(_,i)=>[Math.cos(i*TAU/SEGMENTS),Math.sin(i*TAU/SEGMENTS)]);
export function sculpture(time = 0, open = 0) {
  const faces = [];
  const yaw = -.46 + Math.sin(time * .19) * .14 - open * .28;
  const pitch = .25 + Math.cos(time * .15) * .08;
  const cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
  function point(x, y, z, twist) {
    const a = Math.cos(twist), b = Math.sin(twist);
    const xx = x * a - y * b, yy = x * b + y * a;
    const xxx = xx * cy + z * sy;
    const zz = -xx * sy + z * cy;
    const yyy = yy * cp - zz * sp;
    const zzz = yy * sp + zz * cp;
    const scale = 700 / (700 + zzz);
    return [450 + xxx * scale, 360 + yyy * scale, zzz];
  }
  function face(points, tone, bronze = false, accents = []) {
    const base = bronze ? [166,130,88] : [194,210,222];
    const fill = `rgb(${base.map(c => Math.round(Math.max(20, Math.min(250, c * tone)))).join(',')})`;
    faces.push({ points, fill, accents, depth: points.reduce((sum,p) => sum + p[2],0) / points.length });
  }
  for (let layer=0; layer<13; layer++) {
    const z = (layer - 6) * (12 + open * 10);
    const twist = (layer - 6) * (.025 + open * .028) + time * .045;
    const radius = 247 - layer * .9;
    const innerRadius = layer===0 ? radius-46 : radius-22;
    const ring=(r,dz)=>circle.map(([x,y])=>point(x*r,y*r,z+dz,twist));
    const outer=ring(radius,0), inner=ring(innerRadius,0), back=ring(radius,4), inside=ring(innerRadius,4);
    const bronze=layer===6;
    for(let j=0;j<SEGMENTS;j++) {
      const n=j+1;
      const tone=.76 + Math.cos(j*TAU/SEGMENTS-.8)*.16;
      if(layer!==0) face([outer[j],outer[n],inner[n],inner[j]],1.06,bronze);
      else if(j%2===0) {
        // Each inlay belongs to a front facet, keeping occlusion correct while moving.
        const angle=j*TAU/SEGMENTS, step=2*TAU/SEGMENTS;
        const polar=(u,r)=>point(Math.cos(angle+u*step)*r,Math.sin(angle+u*step)*r,z,twist);
        const accents=[];
        const motif=(coords,fill='#365369')=>accents.push({points:coords.map(([u,r])=>polar(u,r)),fill});
        const lo=innerRadius+10, hi=radius-10, mid=(lo+hi)/2;
        if((j/2)%3===0) {
          motif([[.16,lo],[.84,lo],[.5,hi]]);
          motif([[.37,lo+4],[.63,lo+4],[.5,mid]],'#cddfeb');
        } else if((j/2)%3===1) {
          for(const r of [lo,lo+10]) motif([[.13,r],[.5,r+12],[.87,r],[.87,r+4],[.5,r+16],[.13,r+4]]);
        } else {
          for(const u of [.22,.46,.70]) motif([[u,lo],[u+.10,lo],[u+.10,hi],[u,hi]],'#668295');
        }
        motif([[0,innerRadius+3],[.5,innerRadius+3],[1,innerRadius+3],[1,innerRadius+5],[.5,innerRadius+5],[0,innerRadius+5]],'#a68258');
        face([outer[j],outer[j+1],outer[j+2],inner[j+2],inner[j+1],inner[j]],1.06,false,accents);
      }
      face([outer[j],back[j],back[n],outer[n]],tone,bronze);
      face([inner[j],inner[n],inside[n],inside[j]],tone*.62,bronze);
    }
  }
  return faces.sort((a,b)=>b.depth-a.depth);
}
