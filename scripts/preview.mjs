import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(fileURLToPath(new URL('../dist/',import.meta.url)));
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png'};
const port=Number(process.env.PORT||5173);
http.createServer((req,res)=>{
  let url;
  try { url=new URL(req.url,'http://localhost'); } catch {res.writeHead(400).end();return;}
  let pathname;
  try { pathname=decodeURIComponent(url.pathname); } catch {res.writeHead(400).end();return;}
  let file=path.resolve(root,'.'+pathname);
  if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  if(pathname.endsWith('/')) file=path.join(file,'index.html');
  else if(!path.extname(file)&&fs.existsSync(file+'.html')) file+='.html';
  let status=200;
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){file=path.join(root,'404.html');status=404;}
  res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Content-Type-Options','nosniff');
  // Preview-only accessibility checks; this is not part of the published bundle.
  if(url.searchParams.get('test')==='nojs') res.setHeader('Content-Security-Policy',"script-src 'none'");
  res.writeHead(status);
  if(req.method==='HEAD')res.end();else fs.createReadStream(file).pipe(res);
}).listen(port,'127.0.0.1',()=>console.log(`Freedom preview: http://127.0.0.1:${port}`));
