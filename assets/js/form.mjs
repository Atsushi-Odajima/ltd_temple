// Original split-loop sculpture: two interrupted arcs and a curved diagonal spine.
// The two inner slotted layers are geometric structure, never a front-face ornament.
const TAU = Math.PI * 2;
const SEGMENTS = 72;
const LAYERS = 13;
const GAP = 3;
const STEP = TAU / SEGMENTS;
const circle = Array.from({length:SEGMENTS+1},(_,i)=>[Math.cos(i*STEP),Math.sin(i*STEP)]);

// An offset S-curve gives the circular silhouette a directional, asymmetric centre.
function spine(t) {
  const u=1-t;
  const p=[[-174,126],[85,119],[-95,-129],[175,-126]];
  const x=u*u*u*p[0][0]+3*u*u*t*p[1][0]+3*u*t*t*p[2][0]+t*t*t*p[3][0];
  const y=u*u*u*p[0][1]+3*u*u*t*p[1][1]+3*u*t*t*p[2][1]+t*t*t*p[3][1];
  const dx=3*u*u*(p[1][0]-p[0][0])+6*u*t*(p[2][0]-p[1][0])+3*t*t*(p[3][0]-p[2][0]);
  const dy=3*u*u*(p[1][1]-p[0][1])+6*u*t*(p[2][1]-p[1][1])+3*t*t*(p[3][1]-p[2][1]);
  const length=Math.hypot(dx,dy);
  return {x,y,nx:-dy/length,ny:dx/length};
}
const spinePoints=Array.from({length:41},(_,i)=>spine(i/40));

export function sculpture(time = 0, open = 0) {
  const faces=[];
  const yaw=-.42+Math.sin(time*.19)*.12-open*.22;
  const pitch=.23+Math.cos(time*.15)*.08;
  const cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
  function point(x,y,z,twist) {
    const a=Math.cos(twist),b=Math.sin(twist);
    const xx=x*a-y*b, yy=x*b+y*a;
    const xxx=xx*cy+z*sy, zz=-xx*sy+z*cy;
    const yyy=yy*cp-zz*sp, zzz=yy*sp+zz*cp;
    const scale=700/(700+zzz);
    return [450+xxx*scale,360+yyy*scale,zzz];
  }
  function face(points,tone,layer,kind='shell') {
    const base=layer===6 ? [166,130,88] : [194,210,222];
    const fill=`rgb(${base.map(c=>Math.round(Math.max(20,Math.min(250,c*tone)))).join(',')})`;
    faces.push({points,fill,layer,kind,depth:points.reduce((sum,p)=>sum+p[2],0)/points.length});
  }
  for(let layer=0;layer<LAYERS;layer++) {
    const z=(layer-6)*(10+open*11);
    // A gentle oscillation preserves the intended silhouette while the layers fan open.
    const twist=(layer-6)*(.016+open*.03)+Math.sin(time*.13)*.12;
    const radius=242-layer*.65;
    const patterned=layer===4||layer===8;
    const innerRadius=radius-(patterned?43:20);
    const ring=(r,dz)=>circle.map(([x,y])=>point(x*r,y*r,z+dz,twist));
    const outer=ring(radius,0),inner=ring(innerRadius,0),back=ring(radius,4),inside=ring(innerRadius,4);
    const active=j=>j>=GAP&&j<36-GAP||j>=36+GAP&&j<SEGMENTS-GAP;
    for(let j=0;j<SEGMENTS;j++) {
      if(!active(j)) continue;
      const n=j+1;
      const tone=.76+Math.cos(j*STEP-.8)*.16;
      // Interior layers are split into angular ribs, leaving real negative-space slots.
      if(patterned&&j%4===1) continue;
      face([outer[j],outer[n],inner[n],inner[j]],1.06,layer,patterned?'inset-rib':'shell');
      face([outer[j],back[j],back[n],outer[n]],tone,layer);
      face([inner[j],inner[n],inside[n],inside[j]],tone*.62,layer);
      if(!active(j-1)||(patterned&&(j-1)%4===1)) face([outer[j],inner[j],inside[j],back[j]],.74,layer);
      if(!active(n)||(patterned&&n%4===1)) face([outer[n],back[n],inside[n],inner[n]],.68,layer);
    }
    const width=patterned?24:17;
    const ribbon=(offset,dz)=>spinePoints.map(p=>point(p.x+p.nx*offset,p.y+p.ny*offset,z+dz,twist));
    const left=ribbon(-width/2,0),right=ribbon(width/2,0),leftBack=ribbon(-width/2,4),rightBack=ribbon(width/2,4);
    for(let j=0;j<40;j++) {
      const n=j+1;
      // Short transverse slots run through the middle sheets only.
      if(patterned&&j%6===2) continue;
      face([left[j],left[n],right[n],right[j]],1.08,layer,patterned?'inset-rib':'spine');
      face([left[j],leftBack[j],leftBack[n],left[n]],.70,layer);
      face([right[j],right[n],rightBack[n],rightBack[j]],.53,layer);
      if(j===0||(patterned&&(j-1)%6===2)) face([left[j],right[j],rightBack[j],leftBack[j]],.73,layer);
      if(n===40||(patterned&&n%6===2)) face([left[n],leftBack[n],rightBack[n],right[n]],.68,layer);
    }
  }
  return faces.sort((a,b)=>b.depth-a.depth);
}
