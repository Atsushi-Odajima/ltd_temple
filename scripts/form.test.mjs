import test from 'node:test';
import assert from 'node:assert/strict';
import { sculpture, ringArcs } from '../assets/js/form.mjs';

test('every pose stays finite and inside the drawing area while the frames sway and the ring turns',()=>{
  for(let time=0;time<=140;time+=.7) {
    for(const spread of [0,.38,.7,1]) {
      for(const face of sculpture(time,spread)) {
        for(const [x,y,z] of face.points) {
          assert.ok([x,y,z].every(Number.isFinite),'projection must not create invalid canvas coordinates');
          assert.ok(x>0&&x<900&&y>0&&y<720,`opening and turning must not clip the artwork (time ${time}, spread ${spread})`);
        }
      }
    }
  }
});

test('three separate triangle frames are drawn',()=>{
  const layers=new Set(sculpture(3,.5).filter(face=>face.kind==='triangle').map(face=>face.layer));
  assert.deepEqual([...layers].sort(),[0,1,2]);
});

test('the ring is broken: several openings, one of them wide',()=>{
  const gaps=ringArcs.map((arc,i)=>{
    const next=ringArcs[(i+1)%ringArcs.length];
    return ((next.from-arc.to)%360+360)%360;
  });
  assert.ok(gaps.every(gap=>gap>=10),'each arc must be separated from the next');
  assert.ok(Math.max(...gaps)>=40,'one opening must be clearly visible');
  assert.ok(ringArcs.reduce((sum,arc)=>sum+arc.to-arc.from,0)<300,'the ring must not read as a closed circle');
});

test('saw-tooth and diamond bands are accents, not the whole surface',()=>{
  const faces=sculpture(12,1);
  const count=kind=>faces.filter(face=>face.kind===kind).length;
  assert.ok(count('niho')>0,'saw-tooth band on the ring');
  assert.ok(count('malu')>0,'diamond chain on the middle triangle');
  assert.ok(count('niho')+count('malu')<faces.length*.4);
  assert.ok(faces.filter(face=>face.kind==='malu').every(face=>face.layer===1));
});
