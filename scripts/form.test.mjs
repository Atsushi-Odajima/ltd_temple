import test from 'node:test';
import assert from 'node:assert/strict';
import { sculpture } from '../assets/js/form.mjs';

test('closed and expanded rings stay finite and inside the drawing area throughout rotation',()=>{
  for(const time of [0,5,20,50,100,140]) {
    for(const spread of [0,.38,1]) {
      const faces=sculpture(time,spread);
      for(const face of faces) {
        for(const [x,y,z] of face.points) {
          assert.ok([x,y,z].every(Number.isFinite),'projection must not create invalid canvas coordinates');
          assert.ok(x>0&&x<900&&y>0&&y<720,'expanding and rotating must not clip the sculpture');
        }
      }
    }
  }
});

test('geometric ribs belong to interior sheets, leaving the front and back unpatterned',()=>{
  const faces=sculpture(12,1);
  const patterned=faces.filter(face=>face.kind==='inset-rib');
  assert.ok(patterned.length>0);
  assert.ok(patterned.every(face=>face.layer>0&&face.layer<12));
  assert.ok(faces.some(face=>face.layer===0&&face.kind==='spine'));
});
