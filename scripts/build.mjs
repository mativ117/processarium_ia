import {mkdir, cp, rm, readFile, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {createHash} from 'node:crypto';

const root=fileURLToPath(new URL('../',import.meta.url));
const output=path.join(root,'dist');
await rm(output,{recursive:true,force:true});
await mkdir(output,{recursive:true});
await writeFile(path.join(output,'.nojekyll'),'');
for(const name of ['index.html','favicon.svg','src'])await cp(path.join(root,name),path.join(output,name),{recursive:true});
// Both the published build and the standalone preview share the same runtime.
const css=await readFile(path.join(root,'src/style.css'),'utf8');
const modules=await Promise.all(['processes','content-en','i18n','world','app'].map(name=>readFile(path.join(root,'src',name+'.js'),'utf8')));
const script=modules.map(code=>code.replace(/^import .+;\n/gm,'').replace(/export (async function|function|const|class) /g,'$1 ')).join('\n');
const sourceHtml=await readFile(path.join(root,'index.html'),'utf8');
const runtime='(()=>{\n'+script+'\n})();\n';
const fingerprint=value=>createHash('sha256').update(value).digest('hex').slice(0,12);
const scriptFile='app-'+fingerprint(runtime)+'.js',styleFile='style-'+fingerprint(css)+'.css';
await writeFile(path.join(output,scriptFile),runtime);
await writeFile(path.join(output,styleFile),css);
await writeFile(path.join(output,'index.html'),sourceHtml
  .replace(/<link rel="stylesheet"[^>]+>/,()=>'<link rel="stylesheet" href="./'+styleFile+'">')
  .replace(/<script type="module"[^>]+><\/script>/,()=>'<script defer src="./'+scriptFile+'"></script>'));
const html=sourceHtml
  .replace(/<link rel="stylesheet"[^>]+>/,()=>'<style>'+css+'</style>')
  .replace(/  <script type="module"[^>]+><\/script>\n/,'')
  .replace('</body>',()=>'<script>\n'+runtime+'</script>\n</body>');
await writeFile(path.join(output,'preview.html'),html);
console.log('Site statique prêt dans dist/.');
