import { sculpture } from './form.mjs';
const canvas = document.getElementById('freedom-form');
const art = document.querySelector('.hero-art');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const context = canvas?.getContext('2d');
if (context) {
  let onScreen = true, frame = 0, last = 0, elapsed = 0;
  let width = 900, height = 720;
  function paint() {
    context.clearRect(0,0,width,height);
    const scale = Math.min(width/900,height/720);
    context.save(); context.translate((width-900*scale)/2,(height-720*scale)/2); context.scale(scale,scale);
    function polygon(face) {
      context.beginPath(); face.points.forEach(([x,y],i)=>i?context.lineTo(x,y):context.moveTo(x,y));
      context.closePath(); context.fillStyle=face.fill; context.fill();
    }
    // A smooth 12-second opening cycle runs without interaction; the model adds rotation.
    const time = reduced.matches ? 0 : elapsed;
    const spread = reduced.matches ? .38 : .5 - .46 * Math.cos(time * Math.PI / 6 + 1.3);
    for (const face of sculpture(time,spread)) {
      polygon(face);
    }
    context.restore();
  }
  const canRun = () => !reduced.matches && onScreen && !document.hidden;
  function tick(now) {
    frame=0;
    if(!canRun()) return;
    if(now-last>=1000/30) {
      elapsed+=Math.min((now-last)/1000,.05);last=now;
      paint();
    }
    frame=requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame);frame=0;
    if(reduced.matches) paint();
    if(canRun()){last=performance.now();frame=requestAnimationFrame(tick);}
  }
  function resize() {
    const rect=art.getBoundingClientRect();
    const dpr=Math.min(devicePixelRatio||1,1.5);
    width=rect.width;height=rect.height;
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    context.setTransform(dpr,0,0,dpr,0,0);paint();
  }
  reduced.addEventListener('change',sync);
  document.addEventListener('visibilitychange',sync);
  new IntersectionObserver(entries=>{onScreen=entries[0].isIntersecting;sync();}).observe(art);
  new ResizeObserver(resize).observe(art);
  resize();art.classList.add('art-ready');sync();
}
