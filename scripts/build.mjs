import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const origin = 'https://freedom-inc.pages.dev/';

export function build(root = projectRoot) {
  root = path.resolve(root);
  const output = path.join(root, 'dist');
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'public-files.json'), 'utf8'));
  const files = new Set();
  function safePath(file) {
    const resolved = path.resolve(root, file);
    if (!resolved.startsWith(root + path.sep) || resolved.startsWith(output + path.sep) || resolved === output) {
      throw new Error(`Invalid public path: ${file}`);
    }
    return resolved;
  }
  function collect(file) {
    const resolved = safePath(file);
    const stat = fs.lstatSync(resolved);
    if (stat.isSymbolicLink()) throw new Error(`Symlinks are not public files: ${file}`);
    if (stat.isDirectory()) {
      for (const entry of fs.readdirSync(resolved)) collect(path.posix.join(file, entry));
    } else if (stat.isFile()) files.add(file);
  }
  for (const entry of [...manifest.pages, ...manifest.assets, ...(manifest.files || [])]) collect(entry);

  function validateReference(ref, from) {
    if (!ref || /^(?:data:|mailto:|tel:|blob:)/i.test(ref)) return;
    if (ref.startsWith(origin)) ref = ref.slice(origin.length) || 'index.html';
    else if (/^(?:[a-z]+:|\/\/)/i.test(ref)) return;
    const [pathname, fragment] = ref.split('#');
    const clean = decodeURIComponent(pathname.split('?')[0]);
    let file = clean ? (clean.startsWith('/') ? clean.slice(1) : path.posix.join(path.posix.dirname(from), clean)) : from;
    if (!file || file.endsWith('/')) file += 'index.html';
    safePath(file);
    if (!files.has(file)) throw new Error(`Missing public reference: ${ref} in ${from}`);
    if (fragment && file.endsWith('.html')) {
      const ids = [...fs.readFileSync(safePath(file), 'utf8').matchAll(/\bid=["']([^"']+)["']/g)].map(m => m[1]);
      if (!ids.includes(decodeURIComponent(fragment))) throw new Error(`Missing anchor: ${ref} in ${from}`);
    }
  }
  // Validate before touching dist. All declared asset directories are copied,
  // including images loaded by CSS/JavaScript and metadata-only OGP assets.
  for (const file of files) {
    if (!/\.(html|css|m?js)$/.test(file)) continue;
    const source = fs.readFileSync(safePath(file), 'utf8');
    if (file.endsWith('.html')) {
      for (const match of source.matchAll(/\b(?:src|href|poster)=["']([^"']+)["']/g)) validateReference(match[1], file);
      for (const match of source.matchAll(/\bsrcset=["']([^"']+)["']/g)) {
        for (const candidate of match[1].split(',')) validateReference(candidate.trim().split(/\s+/)[0], file);
      }
      for (const tag of source.matchAll(/<meta\b[^>]*>/g)) {
        if (/(?:og:image|twitter:image)/.test(tag[0]) && !/(?:width|height|alt)/.test(tag[0])) {
          const content = tag[0].match(/content=["']([^"']+)["']/)?.[1];
          if (content) validateReference(content, file);
        }
      }
    }
    if (file.endsWith('.css')) {
      for (const match of source.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)) validateReference(match[1], file);
      for (const match of source.matchAll(/@import\s+["']([^"']+)["']/g)) validateReference(match[1], file);
    }
    if (/\.m?js$/.test(file)) {
      for (const match of source.matchAll(/\b(?:import|export)\s+(?:[^;'"\n]+?\s+from\s*)?["'](\.[^"']+)["']/g)) validateReference(match[1], file);
    }
  }
  if (path.dirname(output) !== root || path.basename(output) !== 'dist') throw new Error('Invalid build directory');
  fs.rmSync(output, { recursive: true, force: true });
  for (const file of files) {
    const destination = path.join(output, file);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(safePath(file), destination);
  }
  console.log(`Built and validated ${files.size} public files in dist.`);
  return [...files];
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) build();
