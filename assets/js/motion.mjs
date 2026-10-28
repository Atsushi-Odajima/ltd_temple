import { sculpture } from './form.mjs';
const canvas = document.getElementById('freedom-form');
const art = document.querySelector('.hero-art');
const controls = document.querySelector('.motion-controls');
const pause = document.getElementById('motion-toggle');
const shape = document.getElementById('form-toggle');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const context = canvas?.getContext('2d');
if (context) {
  let userPaused = false, onScreen = true, frame = 0, last = 0, elapsed = 0, opened = false, spread = .38;
  let width = 900, height = 720;
  function paint() {
    context.clearRect(0,0,width,height);
    const scale = Math.min(width/900,height/720);
    context.save(); context.translate((width-900*scale)/2,(height-720*scale)/2); context.scale(scale,scale);
    function polygon(face) {
      context.beginPath(); face.points.forEach(([x,y],i)=>i?context.lineTo(x,y):context.moveTo(x,y));
      context.closePath(); context.fillStyle=face.fill; context.fill();
    }
    for (const face of sculpture(elapsed,spread)) {
      polygon(face);
      for(const accent of face.accents) polygon(accent);
    }
    context.restore();
  }
  const canRun = () => !userPaused && !reduced.matches && onScreen && !document.hidden;
  function tick(now) {
    frame=0;
    if(!canRun()) return;
    if(now-last>=1000/30) {
      elapsed+=Math.min((now-last)/1000,.05);last=now;
      spread+=(Number(opened)-spread)*.025;
      paint();
    }
    frame=requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame);frame=0;
    const stopped=userPaused||reduced.matches;
    pause.setAttribute('aria-pressed',String(stopped));
    pause.textContent=reduced.matches?'動きを減らす設定中':userPaused?'動きを再生する ▶':'動きを止める Ⅱ';
    pause.disabled=reduced.matches;
    if(canRun()){last=performance.now();frame=requestAnimationFrame(tick);}
  }
  function resize() {
    const rect=art.getBoundingClientRect();
    const dpr=Math.min(devicePixelRatio||1,1.5);
    width=rect.width;height=rect.height;
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    context.setTransform(dpr,0,0,dpr,0,0);paint();
  }
  pause.addEventListener('click',()=>{userPaused=!userPaused;sync();});
  shape.addEventListener('click',()=>{
    opened=!opened;shape.setAttribute('aria-pressed',String(opened));shape.textContent=opened?'輪郭を重ねる −':'輪郭をひらく ＋';
    if(!canRun()){spread=Number(opened);paint();}
  });
  reduced.addEventListener('change',sync);
  document.addEventListener('visibilitychange',sync);
  new IntersectionObserver(entries=>{onScreen=entries[0].isIntersecting;sync();}).observe(art);
  new ResizeObserver(resize).observe(art);
  resize();art.classList.add('art-ready');controls.hidden=false;sync();
}
