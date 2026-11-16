import {mkdir, cp, rm, readFile, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root=fileURLToPath(new URL('../',import.meta.url));
const output=path.join(root,'dist');
await rm(output,{recursive:true,force:true});
await mkdir(output,{recursive:true});
for(const name of ['index.html','favicon.svg','src'])await cp(path.join(root,name),path.join(output,name),{recursive:true});
// Self-contained preview for review without a server; the published app remains modular.
const css=await readFile(path.join(root,'src/style.css'),'utf8');
const modules=await Promise.all(['processes','world','app'].map(name=>readFile(path.join(root,'src',name+'.js'),'utf8')));
const script=modules.map(code=>code.replace(/^import .+;\n/gm,'').replace(/export (const|class) /g,'$1 ')).join('\n');
const html=(await readFile(path.join(root,'index.html'),'utf8'))
  .replace(/<link rel="stylesheet"[^>]+>/,'<style>'+css+'</style>')
  .replace(/  <script type="module"[^>]+><\/script>\n/,'')
  .replace('</body>','<script>\n(()=>{\n'+script+'\n})();\n</script>\n</body>');
await writeFile(path.join(output,'preview.html'),html);
console.log('Site statique prêt dans dist/.');
