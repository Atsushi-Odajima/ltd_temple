import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { build } from './build.mjs';
function fixture(t, html = '<h1 id="top">Example</h1>') {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'freedom-build-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'assets'), { recursive: true });
  fs.writeFileSync(path.join(root, 'public-files.json'), JSON.stringify({ pages: ['index.html'], assets: ['assets'] }));
  fs.writeFileSync(path.join(root, 'index.html'), html);
  return root;
}
test('ships assets referenced only from CSS or JavaScript and excludes legacy files', t => {
  const root = fixture(t, '<link href="assets/style.css"><script src="assets/main.js"></script>');
  fs.writeFileSync(path.join(root, 'assets/style.css'), '.hero { background: url("background.webp"); }');
  fs.writeFileSync(path.join(root, 'assets/main.js'), 'const image = "assets/secondary.webp";');
  for (const name of ['background.webp', 'secondary.webp']) fs.writeFileSync(path.join(root, 'assets', name), 'fixture');
  fs.writeFileSync(path.join(root, 'legacy.html'), 'not published');
  const files = build(root);
  assert.ok(files.includes('assets/secondary.webp'));
  assert.ok(fs.existsSync(path.join(root, 'dist/assets/background.webp')));
  assert.ok(!fs.existsSync(path.join(root, 'dist/legacy.html')));
});
test('rejects broken image references before replacing the last build', t => {
  const root = fixture(t, '<img src="assets/missing.webp">');
  fs.mkdirSync(path.join(root, 'dist')); fs.writeFileSync(path.join(root, 'dist/keep.txt'), 'keep');
  assert.throws(() => build(root), /Missing public reference/);
  assert.ok(fs.existsSync(path.join(root, 'dist/keep.txt')));
});
test('rejects broken CSS assets and internal anchors', t => {
  const root = fixture(t, '<a href="#missing">Go</a>');
  assert.throws(() => build(root), /Missing anchor/);
  fs.writeFileSync(path.join(root, 'index.html'), '<h1 id="top">Example</h1>');
  fs.writeFileSync(path.join(root, 'assets/style.css'), 'a { background:url(missing.webp) }');
  assert.throws(() => build(root), /Missing public reference/);
});
test('validates metadata-only OGP image and srcset files', t => {
  const root = fixture(t, '<meta property="og:image" content="https://freedom-inc.pages.dev/assets/share.jpg">');
  assert.throws(() => build(root), /Missing public reference/);
  fs.writeFileSync(path.join(root, 'assets/share.jpg'), 'fixture');
  build(root);
  assert.ok(fs.existsSync(path.join(root, 'dist/assets/share.jpg')));
  fs.writeFileSync(path.join(root, 'index.html'), '<img srcset="assets/missing.webp 2x">');
  assert.throws(() => build(root), /Missing public reference/);
});
test('rejects paths outside the project and the dist output as input', t => {
  const root = fixture(t);
  for (const bad of ['../outside', 'dist']) {
    fs.writeFileSync(path.join(root, 'public-files.json'), JSON.stringify({ pages: [bad], assets: [] }));
    assert.throws(() => build(root), /Invalid public path/);
  }
});
test('validates local ES module imports used by the motion layer', t => {
  const root = fixture(t, '<script type="module" src="assets/motion.mjs"></script>');
  fs.writeFileSync(path.join(root, 'assets/motion.mjs'), "import { form } from './form.mjs';");
  assert.throws(() => build(root), /Missing public reference/);
  fs.writeFileSync(path.join(root, 'assets/form.mjs'), 'export const form = [];');
  assert.ok(build(root).includes('assets/form.mjs'));
});
