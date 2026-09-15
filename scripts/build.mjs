import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const files = new Set(['index.html']);
for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  const ref = match[1];
  if (/^(?:https?:|data:)/.test(ref)) continue;
  const file = ref.split(/[?#]/)[0];
  const resolved = path.resolve(root, file);
  if (!resolved.startsWith(root + path.sep) || !fs.statSync(resolved).isFile()) {
    throw new Error(`Invalid local asset: ${ref}`);
  }
  files.add(file);
}
if (path.dirname(output) !== root || path.basename(output) !== 'dist') throw new Error('Invalid build directory');
fs.rmSync(output, { recursive: true, force: true });
for (const file of files) {
  const destination = path.join(output, file);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(path.join(root, file), destination);
}
console.log(`Built ${files.size} public files in dist.`);
