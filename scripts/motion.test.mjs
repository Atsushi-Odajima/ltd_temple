import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../assets/js/motion.mjs',import.meta.url),'utf8').replace(/^import .*;\r?\n/,'');
function setup(reduce=false,hasCanvas=true) {
  const raf=new Map(), samples=[];let id=0,paints=0,intersection,resize,now=0,ready=false;
  const context={clearRect(){paints++;},save(){},restore(){},translate(){},scale(){},beginPath(){},lineTo(){},moveTo(){},closePath(){},fill(){},setTransform(){}};
  const art={classList:{add(){ready=true;}},getBoundingClientRect:()=>({width:900,height:720})};
  const canvas={getContext:()=>hasCanvas?context:null};
  const media={matches:reduce,addEventListener(_,fn){this.change=fn;}};
  const doc={hidden:false,events:{},getElementById:id=>id==='freedom-form'?canvas:null,querySelector:q=>q==='.hero-art'?art:null,addEventListener(k,fn){this.events[k]=fn;}};
  vm.runInNewContext(source,{sculpture:(time,spread)=>{samples.push({time,spread});return [];},document:doc,matchMedia:()=>media,devicePixelRatio:2,performance:{now:()=>now},requestAnimationFrame:fn=>{raf.set(++id,fn);return id;},cancelAnimationFrame:id=>raf.delete(id),IntersectionObserver:class{constructor(fn){intersection=fn;}observe(){}},ResizeObserver:class{constructor(fn){resize=fn;}observe(){}}});
  return {media,doc,raf,samples,ready:()=>ready,paintCount:()=>paints,intersection:v=>intersection([{isIntersecting:v}]),resize:()=>resize(),advance(ms){for(let t=0;t<ms;t+=34){now+=34;const callbacks=[...raf.values()];raf.clear();for(const fn of callbacks)fn(now);}}};
}

test('autoplay opens and closes repeatedly without any interaction',()=>{
  const s=setup();assert.equal(s.raf.size,1);assert.equal(s.ready(),true);
  s.advance(26000);
  const spreads=s.samples.map(p=>p.spread);
  assert.ok(Math.min(...spreads)<.06&&Math.max(...spreads)>.94,'both open and closed poses must occur');
  let openingPeaks=0;
  for(let i=1;i<spreads.length;i++) if(spreads[i-1]<.9&&spreads[i]>=.9)openingPeaks++;
  assert.ok(openingPeaks>=2,'the motion must keep repeating');
  assert.ok(s.samples.at(-1).time>25);
  assert.equal(s.raf.size,1);
});
test('reduced motion renders a stable still without scheduling animation',()=>{
  const s=setup(true);assert.equal(s.raf.size,0);assert.equal(s.ready(),true);
  const pose=s.samples.at(-1);s.advance(1000);s.resize();
  assert.deepEqual(s.samples.at(-1),pose);assert.equal(s.raf.size,0);
});
test('visibility and viewport stop rendering; resume creates one frame loop',()=>{
  const s=setup();s.advance(100);
  s.intersection(false);const n=s.paintCount();s.advance(1000);assert.equal(s.paintCount(),n);assert.equal(s.raf.size,0);
  s.intersection(true);assert.equal(s.raf.size,1);
  s.doc.hidden=true;s.doc.events.visibilitychange();assert.equal(s.raf.size,0);
  s.doc.hidden=false;s.doc.events.visibilitychange();assert.equal(s.raf.size,1);
  s.media.matches=true;s.media.change();assert.equal(s.raf.size,0);
  s.media.matches=false;s.media.change();s.media.change();assert.equal(s.raf.size,1);
  s.advance(100);assert.ok(s.paintCount()>n);
});
test('no canvas support leaves the static poster visible',()=>{
  const s=setup(false,false);assert.equal(s.raf.size,0);assert.equal(s.ready(),false);assert.equal(s.paintCount(),0);
});
