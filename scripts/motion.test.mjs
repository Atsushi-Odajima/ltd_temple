import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { sculpture } from '../assets/js/form.mjs';
const source=fs.readFileSync(new URL('../assets/js/motion.mjs',import.meta.url),'utf8').replace(/^import .*;\r?\n/,'');
function setup(reduce=false,hasCanvas=true) {
  const raf=new Map();let id=0,paints=0,intersection,resize;
  const el=()=>({hidden:true,disabled:false,textContent:'',attrs:{},events:{},classList:{add(){}},setAttribute(k,v){this.attrs[k]=v;},addEventListener(k,fn){this.events[k]=fn;}});
  const context={clearRect(){paints++;},save(){},restore(){},translate(){},scale(){},beginPath(){},lineTo(){},moveTo(){},closePath(){},fill(){},setTransform(){}};
  const elements={'freedom-form':{getContext:()=>hasCanvas?context:null},'motion-toggle':el(),'form-toggle':el(),controls:el(),art:{classList:{add(){}},getBoundingClientRect:()=>({width:900,height:720})}};
  const media={matches:reduce,addEventListener(_,fn){this.change=fn;}};
  const doc={hidden:false,events:{},getElementById:id=>elements[id],querySelector:q=>q==='.hero-art'?elements.art:elements.controls,addEventListener(k,fn){this.events[k]=fn;}};
  vm.runInNewContext(source,{sculpture,document:doc,matchMedia:()=>media,devicePixelRatio:2,performance:{now:()=>0},requestAnimationFrame:fn=>{raf.set(++id,fn);return id;},cancelAnimationFrame:id=>raf.delete(id),IntersectionObserver:class{constructor(fn){intersection=fn;}observe(){}},ResizeObserver:class{constructor(fn){resize=fn;}observe(){}}});
  return {elements,media,doc,raf,paintCount:()=>paints,intersection:v=>intersection([{isIntersecting:v}]),resize:()=>resize()};
}
test('reduced motion renders a still and lets the shape change without animation',()=>{
  const s=setup(true);assert.equal(s.raf.size,0);assert.equal(s.elements.controls.hidden,false);assert.equal(s.elements['motion-toggle'].disabled,true);
  const n=s.paintCount();s.elements['form-toggle'].events.click();assert.ok(s.paintCount()>n);assert.equal(s.raf.size,0);
});
test('pause, visibility and viewport changes stop rendering; resuming has only one frame loop',()=>{
  const s=setup();assert.equal(s.raf.size,1);
  s.elements['motion-toggle'].events.click();assert.equal(s.raf.size,0);
  s.elements['motion-toggle'].events.click();assert.equal(s.raf.size,1);
  s.intersection(false);assert.equal(s.raf.size,0);s.intersection(true);assert.equal(s.raf.size,1);
  s.doc.hidden=true;s.doc.events.visibilitychange();assert.equal(s.raf.size,0);
  s.doc.hidden=false;s.doc.events.visibilitychange();assert.equal(s.raf.size,1);
  s.media.matches=true;s.media.change();assert.equal(s.raf.size,0);
  s.media.matches=false;s.media.change();assert.equal(s.raf.size,1);
});
test('no canvas support leaves the static image and hides inactive controls',()=>{
  const s=setup(false,false);assert.equal(s.raf.size,0);assert.equal(s.elements.controls.hidden,true);
});
