import {cp, readdir, readFile, rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root=fileURLToPath(new URL('../',import.meta.url));
const source=path.join(root,'dist');
const target=path.join(root,'docs');

async function files(dir,prefix='') {
  const entries=await readdir(dir,{withFileTypes:true});
  const result=[];
  for(const entry of entries){
    const name=path.join(prefix,entry.name);
    if(entry.isDirectory())result.push(...await files(path.join(dir,entry.name),name));
    else result.push(name);
  }
  return result.sort();
}

if(process.argv.includes('--check')){
  try{
    const expected=await files(source),actual=await files(target);
    if(JSON.stringify(expected)!==JSON.stringify(actual))throw Error('Liste des fichiers différente');
    for(const name of expected){
      const [a,b]=await Promise.all([readFile(path.join(source,name)),readFile(path.join(target,name))]);
      if(!a.equals(b))throw Error('Fichier différent : '+name);
    }
  }catch(error){
    console.error('Export Pages manquant ou périmé. Exécuter npm run pages.\n'+error.message);
    process.exit(1);
  }
  console.log('docs/ correspond exactement au site construit.');
}else{
  await rm(target,{recursive:true,force:true});
  await cp(source,target,{recursive:true});
  console.log('Site prêt pour GitHub Pages dans docs/.');
}
