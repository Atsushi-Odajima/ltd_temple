import test from 'node:test';
import assert from 'node:assert/strict';
import { sculpture } from '../assets/js/form.mjs';

test('closed and expanded rings stay finite and inside the drawing area throughout rotation',()=>{
  for(const time of [0,5,20,50,100,140]) {
    for(const spread of [0,.38,1]) {
      const faces=sculpture(time,spread);
      for(const face of faces) {
        for(const polygon of [face,...face.accents]) {
          for(const [x,y,z] of polygon.points) {
            assert.ok([x,y,z].every(Number.isFinite),'projection must not create invalid canvas coordinates');
            assert.ok(x>0&&x<900&&y>0&&y<720,'expanding and rotating must not clip the sculpture');
          }
        }
      }
    }
  }
});
