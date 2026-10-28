import fs from 'node:fs';
import { sculpture } from '../assets/js/form.mjs';
const polygon=f=>`<polygon points="${f.points.map(p=>p.slice(0,2).map(n=>n.toFixed(2)).join(',')).join(' ')}" fill="${f.fill}"/>`;
const polygons=sculpture(0,.38).map(f=>polygon(f)+f.accents.map(polygon).join('')).join('');
fs.writeFileSync(new URL('../assets/img/freedom/open-form.svg',import.meta.url),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 720" width="900" height="720"><title>幾何学模様を刻んだ円環がひらく立体の輪郭</title>${polygons}</svg>`);
