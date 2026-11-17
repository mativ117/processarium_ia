import test from 'node:test';
import assert from 'node:assert/strict';
import {World} from '../src/world.js';
import {primaryPack,frUI,enUI,translationEntries} from '../src/i18n.js';
import {guides} from '../src/processes.js';

globalThis.ResizeObserver=class{observe(){}};
globalThis.IntersectionObserver=class{observe(){}};
globalThis.matchMedia=()=>({matches:false});
globalThis.devicePixelRatio=1;
globalThis.requestAnimationFrame=()=>{};
const canvas=()=>({getContext:()=>null,addEventListener(){},getBoundingClientRect:()=>({width:900,height:460})});

test('people keep their real positions across scenes, with bounded frame-to-frame movement',async()=>{
  const world=new World(canvas(),{},()=>{});world.setView(['tri','red','rel'],'tri',[],[]);
  let now=1;world.animate(now);
  for(const id of ['tri','red','rel']){
    const before=world.people.map(p=>({u:p.u,v:p.v}));
    const done=world.travelTo([id]);
    assert.deepEqual(world.people.map(p=>({u:p.u,v:p.v})),before,'starting a scene must not teleport anyone');
    let previous=before,frames=0;
    while(world.travel){now+=1000/60;world.animate(now);const next=world.people.map(p=>({u:p.u,v:p.v}));next.forEach((p,i)=>assert.ok(Math.hypot(p.u-previous[i].u,p.v-previous[i].v)<.18,'no frame should contain a positional jump'));previous=next;frames++;assert.ok(frames<500);}
    assert.equal(await done,true);assert.ok(frames>250,'there is a readable transfer, work and result sequence');
  }
});
test('pause freezes progress and positions; resume and cancellation resolve safely',async()=>{
  const world=new World(canvas(),{},()=>{});world.setView(['tri','red','rel'],'tri',[],[]);
  world.animate(1);const pending=world.travelTo(['tri']);
  for(let i=1;i<=30;i++)world.animate(1+i*16);
  world.pauseTravel();const elapsed=world.travel.elapsed,positions=world.people.map(p=>[p.u,p.v]);
  for(let i=31;i<120;i++)world.animate(1+i*16);
  assert.equal(world.travel.elapsed,elapsed);assert.deepEqual(world.people.map(p=>[p.u,p.v]),positions);
  world.resumeTravel();world.speed=2;world.animate(2000);assert.equal(world.travel.elapsed-elapsed,100,'playback speed applies to the capped frame delta');
  world.stopTravel();assert.equal(await pending,false);assert.equal(world.travel,null);
});
test('large parallel groups finish at their destinations, including the last worker',async()=>{
  const world=new World(canvas(),{},()=>{});const roles=['tri','red','rel','plan','test','code','data','arch','ops','perf','eval','security'];world.setView(roles,'tri',[],[]);
  let now=1;world.animate(now);const done=world.travelTo(roles.slice(0,5));
  while(world.travel){now+=16;world.animate(now);}
  assert.equal(await done,true);
  world.people.slice(0,5).forEach(p=>{const [u,v]=world.getLot(p.id);assert.equal(p.u,u+.9);assert.equal(p.v,v+.8);});
});
test('both reference languages cover every UI key, role and guide without partial fallback',()=>{
  assert.deepEqual(Object.keys(frUI).sort(),Object.keys(enUI).sort());
  const fr=primaryPack('fr'),en=primaryPack('en');
  assert.equal(en.guides.length,8);assert.equal(Object.keys(en.agents).length,17);
  for(const g of guides){const translated=en.guides.find(x=>x.id===g.id);assert.ok(translated.title);assert.equal(translated.steps.length,g.steps.length);translated.steps.forEach((s,i)=>{assert.equal(s.seconds,g.steps[i].seconds);assert.equal(s.effort,g.steps[i].effort);assert.ok(s.name&&s.output&&s.resource);});}
  const placeholders=s=>[...s.matchAll(/\{\w+\}/g)].map(x=>x[0]).sort();
  for(const key of Object.keys(frUI))if(typeof frUI[key]==='string')assert.deepEqual(placeholders(frUI[key]),placeholders(enUI[key]),key);
  const paths=translationEntries(fr).map(x=>JSON.stringify(x.path));assert.equal(new Set(paths).size,paths.length);
  assert.ok(!translationEntries(en).some(x=>x.path.at(-1)==='id'||x.path.at(-1)==='source'));
});
