import test from 'node:test';
import assert from 'node:assert/strict';
import { sculpture, ring } from '../assets/js/form.mjs';

test('every pose stays finite and inside the drawing area while the emblem turns and opens',()=>{
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

test('three triangle frames and three overlapping rings are drawn',()=>{
  const faces=sculpture(3,.5);
  const layers=kind=>[...new Set(faces.filter(face=>face.kind===kind).map(face=>face.layer))].sort();
  assert.deepEqual(layers('triangle'),[0,1,2]);
  assert.deepEqual(layers('ring'),[3,4,5]);
});

test('each ring is broken by a clearly visible opening',()=>{
  const [from,to]=ring.solid;
  assert.ok(360-(to-from)>=40);
  assert.ok(ring.dashes.every(([a,b])=>a>=to-360&&b<=from),'dashes dissolve inside the opening');
});

test('patterns sit inside the band of a ring, and only on part of it',()=>{
  const faces=sculpture(12,1);
  const inlays=faces.filter(face=>face.kind.startsWith('inlay-'));
  assert.deepEqual([...new Set(inlays.map(face=>face.kind))].sort(),['inlay-diamond','inlay-paisley','inlay-teeth']);
  assert.ok(inlays.every(face=>face.layer>=3&&face.layer<=5),'inlays belong to rings');
  for(const {from,to} of ring.inlays) assert.ok(from>=ring.solid[0]&&to<=ring.solid[1],'an inlay never leaves the solid band');
  const covered=ring.inlays.reduce((sum,{from,to})=>sum+to-from,0);
  assert.ok(covered<(ring.solid[1]-ring.solid[0])*.7,'part of every band stays plain');
});

test('the still emblem repeats itself every third of a turn',()=>{
  for(const spread of [0,.38,1]) {
    const faces=sculpture(0,spread);
    const centre=face=>face.points.reduce(([x,y],p)=>[x+p[0]/face.points.length,y+p[1]/face.points.length],[0,0]);
    for(const [kind,tolerance] of [['triangle',.01],['drop',.01],['ring',.01],['inlay-teeth',.01]]) {
      const points=faces.filter(face=>face.kind===kind).map(centre);
      assert.ok(points.length>0);
      for(const [x,y] of points) {
        const dx=x-450,dy=y-360,c=Math.cos(Math.PI*2/3),s=Math.sin(Math.PI*2/3);
        const rx=450+dx*c-dy*s,ry=360+dx*s+dy*c;
        assert.ok(points.some(([px,py])=>Math.hypot(px-rx,py-ry)<=tolerance),`${kind} must have three-fold symmetry at spread ${spread}`);
      }
    }
  }
});
