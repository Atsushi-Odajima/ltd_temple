import test from 'node:test';
import assert from 'node:assert/strict';
import { sculpture, rings } from '../assets/js/form.mjs';

test('every pose stays finite and inside the drawing area while the frames sway and the rings turn',()=>{
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

test('three triangle frames and three rings are drawn, and nothing else',()=>{
  const faces=sculpture(3,.5);
  const layers=kind=>[...new Set(faces.filter(face=>face.kind===kind).map(face=>face.layer))].sort();
  assert.deepEqual(layers('triangle'),[0,1,2]);
  assert.deepEqual(layers('ring'),[3,4,5]);
  assert.deepEqual([...new Set(faces.map(face=>face.kind))].sort(),['accent','inlay-teeth','ring','triangle']);
});

test('each ring is opened wider than the one behind it',()=>{
  const gaps=rings.map(ring=>ring.gap);
  assert.ok(gaps[0]>=15,'even the most complete ring is visibly broken');
  for(let i=1;i<gaps.length;i++) assert.ok(gaps[i]>=gaps[i-1]+40,'the openings must differ clearly, step by step');
  assert.ok(gaps.at(-1)<=200,'the widest opening still leaves most of a ring');
});

test('the pattern is a single accent on one ring',()=>{
  const patterned=rings.filter(ring=>ring.accent);
  assert.equal(patterned.length,1);
  const {from,to}=patterned[0].accent;
  assert.ok(to-from<=50,'the accent covers a short stretch of the band');
  const inlays=sculpture(12,1).filter(face=>face.kind==='inlay-teeth');
  assert.ok(inlays.length>0);
  assert.equal(new Set(inlays.map(face=>face.layer)).size,1);
});
