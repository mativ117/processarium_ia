import test from 'node:test';
import assert from 'node:assert/strict';
import {World} from '../src/world.js';
import {primaryPack,frUI,enUI,translationEntries} from '../src/i18n.js';
import {guides} from '../src/processes.js';
import {resourceProfile,roleTypes} from '../src/resources.js';

globalThis.ResizeObserver=class{observe(){}};
globalThis.IntersectionObserver=class{observe(){}};
globalThis.matchMedia=()=>({matches:false});
globalThis.devicePixelRatio=1;
globalThis.requestAnimationFrame=()=>{};
const canvas=()=>({getContext:()=>null,addEventListener(){},getBoundingClientRect:()=>({width:900,height:460})});
test('resource inventory separates software from agents and respects PDF branches',()=>{
  const g=guides.find(x=>x.id==='calque');
  const mixed=resourceProfile(g,2),text=resourceProfile(g,2,{input:'text'}),scan=resourceProfile(g,2,{input:'scan'});
  assert.equal(mixed.agents,0);assert.equal(mixed.toolRoles,1);assert.equal(mixed.quantities.ocrPages,8);
  assert.equal(text.quantities.ocrPages,0);assert.ok(!text.tools.includes('ocr'));
  assert.equal(scan.quantities.ocrPages,12);
  assert.equal(resourceProfile(g,3).agents,1);assert.equal(resourceProfile(g,3).toolRoles,1);
  for(const guide of guides)for(const step of guide.steps)for(const id of step.actors)assert.ok(roleTypes[id]);
});

test('people keep their real positions across scenes, with bounded frame-to-frame movement',async()=>{
  const world=new World(canvas(),{},()=>{});world.setView(['tri','red','rel'],'tri',[],[]);
  let now=1;world.animate(now);
  for(const id of ['tri','red','rel']){
    const before=world.people.map(p=>({u:p.u,v:p.v}));
    const done=world.travelTo([id]);
    assert.deepEqual(world.people.map(p=>({u:p.u,v:p.v})),before,'starting a scene must not teleport anyone');
    let previous=before,frames=0,distance=0;
    while(world.travel){now+=1000/60;world.animate(now);const next=world.people.map(p=>({u:p.u,v:p.v}));next.forEach((p,i)=>{const delta=Math.hypot(p.u-previous[i].u,p.v-previous[i].v);assert.ok(delta<.18,'no frame should contain a positional jump');if(world.people[i].id===id)distance+=delta;});previous=next;frames++;assert.ok(frames<500);}
    assert.ok(distance>3,'the worker must actually walk, not just stay within a jump limit');
    assert.equal(await done,true);assert.ok(frames>250,'there is a readable transfer, work and result sequence');
  }
});
test('workers carry the result to the next role and return while that role works',async()=>{
  const world=new World(canvas(),{},()=>{});world.setView(['tri','red','rel'],'tri',[],[]);
  let now=1;world.animate(now);
  const first=world.travelTo(['tri'],{automatic:true,recipients:['red']});
  const worker=world.people.find(p=>p.id==='tri'),recipient=world.people.find(p=>p.id==='red');
  let sawCarrying=false,sawWorking=false;
  while(world.travel){now+=16;world.animate(now);sawCarrying||=!!(worker.walking&&worker.package);sawWorking||=!!worker.working;}
  assert.equal(await first,true);assert.ok(sawCarrying&&sawWorking);
  assert.deepEqual([worker.u,worker.v],[recipient.u,recipient.v],'handoff happens at the recipient');
  const before=world.people.map(p=>[p.u,p.v]);
  const second=world.travelTo(['red'],{automatic:true,recipients:['rel']});
  assert.deepEqual(world.people.map(p=>[p.u,p.v]),before,'the next scene preserves positions');
  now+=16;world.animate(now);
  assert.ok(worker.walking&&recipient.working,'the previous worker returns during the next task');
  world.pauseTravel();const paused=world.people.map(p=>[p.u,p.v]);
  now+=500;world.animate(now);assert.deepEqual(world.people.map(p=>[p.u,p.v]),paused);
  world.resumeTravel();
  while(world.travel){now+=16;world.animate(now);}
  assert.equal(await second,true);
  const [u,v]=world.getLot('tri');assert.ok(Math.hypot(worker.u-u-.9,worker.v-v-.8)<.001);
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

test('the file moves continuously between workshops without screen-space explanation panels',async()=>{
 const world=new World(canvas(),{},()=>{});world.setView(['tri','red','rel'],'tri',[],[]);world.animate(1);
 assert.equal(typeof world.actionPanels,'undefined');
 const pending=world.travelTo(['tri']);const route=world.travel.routes[0];let now=1,moved=false,last=null;
 while(world.travel){now+=1000/60;world.animate(now);const point=route.packet;if(point){assert.ok(Number.isFinite(point.u)&&Number.isFinite(point.v));if(last){const d=Math.hypot(point.u-last.u,point.v-last.v);assert.ok(d<1,'the file must not teleport');if(d>.001)moved=true;}last={...point};}}
 assert.ok(moved);assert.equal(await pending,true);assert.ok(Math.hypot(route.packet.u-route.home.u,route.packet.v-route.home.v)<.001);
});
