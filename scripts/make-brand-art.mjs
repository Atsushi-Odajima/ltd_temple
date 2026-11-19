import fs from 'node:fs';
import { sculpture } from '../assets/js/form.mjs';
const polygon=f=>`<polygon points="${f.points.map(p=>p.slice(0,2).map(n=>n.toFixed(1)).join(',')).join(' ')}" fill="${f.fill}"/>`;
const polygons=sculpture(0,.38).map(polygon).join('');
fs.writeFileSync(new URL('../assets/img/freedom/open-form.svg',import.meta.url),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 720" width="900" height="720"><title>三つの欠けた輪が編むように重なり、その中で三つの三角形と三つのペイズリーが回るエンブレム</title>${polygons}</svg>`);
