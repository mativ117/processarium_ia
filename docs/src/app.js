import {agents, guides} from './processes.js';
import {World} from './world.js';
import {primaryPack, message, generateLanguage} from './i18n.js';

const $=id=>document.getElementById(id),key='processarium:v1';
const state={version:1,guide:'publication',selected:'tri',completed:[],met:[],runs:{},language:'fr',speed:1};
let storageAvailable=true,playing=false,busy=false,generation=0,level=0;
let sceneProgress=0,scenePhase='transfer',pack,ui,translationController=null,translationTicket=0;
let cache={};
const automaticPacks=new Map();
function readState(){
  try{
    const raw=JSON.parse(localStorage.getItem(key));if(raw?.version!==1)return;
    state.guide=guides.some(g=>g.id===raw.guide)?raw.guide:'publication';
    state.selected=agents[raw.selected]?raw.selected:'tri';
    state.language=raw.language==='en'?'en':'fr';
    state.speed=[.75,1,1.5,2].includes(raw.speed)?raw.speed:1;
    state.completed=Array.isArray(raw.completed)?[...new Set(raw.completed.filter(id=>guides.some(g=>g.id===id)))]:[];
    const previousEclipse=['plan','rech','design','art','test','code','rel'];
    state.met=Array.isArray(raw.met)?[...new Set(raw.met.filter(id=>agents[id]))]:[...new Set(state.completed.flatMap(id=>id==='eclipse'?previousEclipse:guides.find(g=>g.id===id).steps.flatMap(s=>s.actors)))];
    for(const g of guides){const r=raw.runs?.[g.id];if(!r)continue;const updated=(r.revision||1)!==(g.revision||1);state.runs[g.id]={step:r.finished?g.steps.length:updated?0:Number.isInteger(r.step)?Math.max(0,Math.min(g.steps.length,r.step)):0,fix:updated?0:Number.isInteger(r.fix)?Math.max(0,Math.min(3,r.fix)):0,input:['scan','text'].includes(r.input)?r.input:'mixed',finished:!!r.finished,revision:g.revision||1};}
  }catch{storageAvailable=false;}
}
readState();
const queryLanguage=new URL(location.href).searchParams.get('lang');
if(['fr','en'].includes(queryLanguage))state.language=queryLanguage;
pack=primaryPack(state.language);ui=pack.ui;
const t=(name,values)=>message(ui,name,values);
const text=(id,value)=>{const el=$(id);if(el.textContent!==String(value))el.textContent=value;};
function save(){try{localStorage.setItem(key,JSON.stringify(state));}catch{storageAvailable=false;}text('storage-note',storageAvailable?ui.storage:ui.storageUnavailable);}
function baseGuide(){return pack.guides.find(g=>g.id===state.guide);}
function run(){return state.runs[state.guide]??={step:0,fix:0,input:'mixed',finished:false,revision:baseGuide().revision||1};}
function duration(seconds){seconds=Math.round(seconds);return seconds<120?seconds+' s':Math.floor(seconds/60)+' min'+(seconds%60?' '+seconds%60+' s':'');}
function guide(){
  const g=baseGuide(),r=run();if(g.id!=='calque'||r.input==='mixed')return g;
  const steps=g.steps.map(s=>({...s})),isText=r.input==='text';
  steps[1].output=isText?ui.pdfTextPath:ui.pdfScanPath;
  steps[2].seconds=isText?48:420;steps[2].effort=steps[2].seconds;
  steps[2].output=isText?ui.pdfTextResult:ui.pdfScanResult;steps[2].resource=isText?ui.pdfTextResource:ui.pdfScanResource;
  return {...g,input:isText?ui.pdfTextInput:ui.pdfScanInput,steps};
}
function roles(g=guide()){return [...new Set(g.steps.flatMap(s=>s.actors))];}
function button(label,fn,className=''){const b=document.createElement('button');b.type='button';b.textContent=label;b.className=className;b.addEventListener('click',fn);return b;}
function firstSentence(value){try{return [...new Intl.Segmenter(pack.locale,{granularity:'sentence'}).segment(value)][0]?.segment.trim()||value;}catch{return value;}}
function nameList(ids){const names=ids.map(id=>pack.agents[id].name);try{return new Intl.ListFormat(pack.locale,{style:'short',type:'conjunction'}).format(names);}catch{return names.join(', ');}}
const world=new World($('world'),Object.fromEntries(Object.entries(pack.agents).map(([id,a])=>[id,a.name])),id=>{state.selected=id;render();save();});
world.speed=state.speed;
level=baseGuide().level;
function pause(){playing=false;world.pauseTravel();}
function cancel(){generation++;busy=false;pause();world.stopTravel();sceneProgress=0;}
function choose(id){if(id===state.guide)return;cancel();state.guide=id;level=baseGuide().level;state.selected=roles()[0];world.center();render(true);save();}
function nextActors(){const g=guide(),r=run();if(r.finished)return[];if(r.step<g.steps.length)return g.steps[r.step].actors;if(r.fix===1)return[roles().includes('code')?'code':roles().includes('red')?'red':'lecture'];if(r.fix===2)return[roles().includes('test')?'test':'rel'];return[];}
function fixing(){const r=run();return r.step===guide().steps.length&&(r.fix===1||r.fix===2);}
function needsHuman(){const r=run(),g=guide();return !fixing()&&(r.step===g.steps.length||g.steps[r.step]?.human);}
function renderStatic(){
  document.documentElement.lang=pack.locale;
  let direction='ltr';try{const l=new Intl.Locale(pack.locale);direction=l.getTextInfo?.().direction||l.textInfo?.direction||(['ar','fa','he','ur','ps','sd','ug','yi','dv'].includes(pack.locale.split('-')[0])?'rtl':'ltr');}catch{}
  document.documentElement.dir=direction;document.title=ui.pageTitle;
  document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=ui[el.dataset.i18n]);
  document.querySelectorAll('[data-i18n-aria]').forEach(el=>el.setAttribute('aria-label',ui[el.dataset.i18nAria]));
  document.querySelectorAll('[data-level]').forEach(b=>b.textContent=ui.levels[Number(b.dataset.level)]);
  document.querySelectorAll('[data-language]').forEach(b=>b.setAttribute('aria-pressed',String(!pack.automatic&&pack.locale===b.dataset.language)));
  text('automatic-warning',ui.automaticWarning);$('automatic-warning').hidden=!pack.automatic;
  $('translation-target').placeholder=ui.languagePlaceholder;
  $('glossary').replaceChildren(...ui.glossary.flatMap(item=>{const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=item.word;dd.textContent=item.meaning;return[dt,dd];}));
  world.names=Object.fromEntries(Object.entries(pack.agents).map(([id,a])=>[id,a.name]));
  cache={};
}
function setLanguage(nextPack){pack=nextPack;ui=pack.ui;if(!pack.automatic){state.language=pack.locale;try{const url=new URL(location.href);url.searchParams.set('lang',pack.locale);history.replaceState(null,'',url);}catch{}}renderStatic();render();save();}
function renderStory(){
  const g=guide(),r=run(),n=g.steps.length,gate=r.step===n,actors=nextActors();
  const waiting=!busy&&needsHuman()&&!r.finished;
  text('story-number',t('stepOf',{step:Math.min(r.step+1,n),total:n}));
  text('story-phase',busy?(world.travel?.pausedAt?ui.paused:ui.phaseLabels[scenePhase]):r.finished?ui.teamDone:waiting?ui.humanGate:ui.nextUp);
  text('story-title',r.finished?g.result:fixing()?(r.fix===1?ui.applyFix:ui.verifyAgain):gate?ui.humanGate:g.steps[r.step].name);
  const description=r.finished?ui.catalogFoot:waiting?(gate?ui.finalExplain:ui.humanExplain):fixing()?firstSentence(g.fix):!busy&&r.step===0?ui.beforeStart:firstSentence(g.steps[Math.min(r.step,n-1)].output);
  text('story-text',description);
  text('story-actors',actors.length?ui.who+' '+nameList(actors)+(actors.length>1?' · '+ui.sameTime:''):'');
  text('map-caption',busy?(world.travel?.pausedAt?ui.paused:ui.phaseLabels[scenePhase]+' · '+(fixing()?(r.fix===1?ui.applyFix:ui.verifyAgain):g.steps[Math.min(r.step,n-1)].name)):r.finished?ui.teamDone:waiting?ui.humanGate:ui.ready);
}
function paintProgress(){
  const g=guide(),r=run(),n=g.steps.length,p=(r.step+(busy&&r.step<n?sceneProgress:0))/n;
  $('progress').style.transform='scaleX('+Math.min(1,p)+')';
  const percentage=String(Math.round(p*100));if($('progress-track').getAttribute('aria-valuenow')!==percentage)$('progress-track').setAttribute('aria-valuenow',percentage);
  $('progress-track').setAttribute('aria-label',t('stepsDone',{step:r.step,total:n}));
  const done=g.steps.slice(0,r.step),factor=[1,2,5,12][level];
  const extraTime=(r.fix===3?36:r.fix===2?24:0)*factor,extraWork=(r.fix===3?48:r.fix===2?32:0)*factor;
  const current=busy&&r.step<n?g.steps[r.step]:null;
  text('elapsed',duration(done.reduce((sum,s)=>sum+s.seconds,0)+extraTime+(current?current.seconds*sceneProgress:0)));
  text('effort',duration(done.reduce((sum,s)=>sum+s.effort,0)+extraWork+(current?current.effort*sceneProgress:0)));
  text('human',done.filter(s=>s.human).length+(r.fix?1:0)+(r.finished?1:0));
}
world.onProgress=(p,phase)=>{sceneProgress=p;if(scenePhase!==phase){scenePhase=phase;renderStory();}paintProgress();};
function render(reset=false){
  const g=guide(),r=run(),n=g.steps.length,gate=r.step===n,active=nextActors(),crew=roles(g),done=g.steps.slice(0,r.step);
  if(!crew.includes(state.selected))state.selected=crew[0];
  document.querySelectorAll('[data-level]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.level)===level)));
  const catalogKey=pack.locale+':'+level+':'+g.id+':'+state.completed.join();
  if(cache.catalog!==catalogKey){
    $('guide-list').replaceChildren(...pack.guides.filter(x=>x.level===level).map((x,i)=>{const b=button('',()=>choose(x.id),'guide-button'+(x.id===g.id?' selected':''));b.setAttribute('aria-pressed',String(x.id===g.id));const num=document.createElement('span');num.className='guide-number';num.textContent=String(i+1).padStart(2,'0');const content=document.createElement('span'),title=document.createElement('strong'),sub=document.createElement('small');title.textContent=x.title;sub.textContent=t('guideInfo',{steps:x.steps.length,roles:roles(x).length})+(state.completed.includes(x.id)?' · '+ui.completed:'');content.append(title,sub);b.append(num,content);return b;}));
    $('guide-picker').replaceChildren(...pack.guides.filter(x=>x.level===level).map(x=>{const o=document.createElement('option');o.value=x.id;o.textContent=x.title;o.selected=x.id===g.id;return o;}));cache.catalog=catalogKey;
  }
  text('level-label',ui.levelLabels[level]);text('guide-title',g.title);text('guide-size',t('rolesSteps',{roles:crew.length,steps:n}));
  text('level-description',ui.subtitles[level]);text('prerequisites',ui.beforeRequirements+(g.requires||ui.defaults[level]));
  text('peak-workers',Math.max(...g.steps.map(s=>s.actors.length)));text('planned-work',duration(g.steps.reduce((sum,s)=>sum+s.effort,0)));
  text('parallel-key',active.length>1?t('parallel',{n:active.length}):'');
  text('next',r.finished?ui.finished:fixing()?(r.fix===1?ui.applyFix:ui.verifyAgain):gate?ui.finishGuide:g.steps[r.step].human?ui.humanAction:r.step===0?ui.start:ui.next);
  $('next').disabled=busy||r.finished||playing;
  $('play').disabled=r.finished||(gate&&!fixing());
  text('play-symbol',playing?'Ⅱ':'▶︎');text('play-text',playing?ui.pause:ui.play);
  $('play').setAttribute('aria-pressed',String(playing));$('play').setAttribute('aria-label',playing?ui.pauseAria:ui.playAria);
  $('speed').value=String(state.speed);
  text('step-status',r.finished?ui.collected:gate?ui.humanGate:t('stepsDone',{step:r.step,total:n}));
  text('document-label',r.finished?g.result:gate&&r.fix?['',ui.backRequested,ui.correctionApplied,ui.correctionChecked][r.fix]:r.step===0?ui.initialRequest:t('outputLabel',{name:g.steps[r.step-1].name}));
  text('document-content',gate&&r.fix?g.fix:r.step===0?g.input:g.steps[r.step-1].output);
  $('correct').hidden=!gate||!!r.fix||r.finished;$('correct').disabled=busy;
  text('resources',(done.length?done.at(-1).resource:ui.subtitles[level])+' '+(done.some(s=>s.actors.length>1)?ui.parallelNote+' ':'')+ui.simulatedNote);
  $('branch').hidden=g.id!=='calque';$('pdf-type').value=r.input;$('pdf-type').disabled=busy||r.step>0;
  const roleKey=pack.locale+':'+g.id;
  if(cache.roles!==roleKey){$('role-list').replaceChildren(...crew.map(id=>{const b=button(pack.agents[id].name,()=>{state.selected=id;render();save();});b.dataset.role=id;return b;}));cache.roles=roleKey;}
  $('role-list').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.role===state.selected)));
  text('role-detail',pack.agents[state.selected].name+' · '+(pack.agents[state.selected].kind||ui.roleKind)+' — '+pack.agents[state.selected].detail);
  const pathKey=pack.locale+':'+g.id+':'+r.step;
  if(cache.path!==pathKey){$('process-path').replaceChildren(...g.steps.map((s,i)=>{const el=document.createElement('span');el.className='path-step'+(i<r.step?' done':i===r.step?' current':'');el.textContent=(i<r.step?'✓ ':String(i+1)+'. ')+s.name;return el;}));cache.path=pathKey;}
  text('source-note',g.source?ui.sourceReal:ui.sourceFiction);$('source-link').hidden=!g.source;if(g.source)$('source-link').href='https://github.com/mativ117/'+g.source+'/blob/main/README.md';
  world.setView(crew,state.selected,active,done.flatMap(s=>s.actors),reset);
  renderStory();paintProgress();renderCollection();
}
function renderCollection(){
  text('collection-count',state.completed.length);text('collection-summary',t('collectionSummary',{done:state.completed.length,total:pack.guides.length,met:state.met.length,roles:Object.keys(pack.agents).length}));
  const collectionKey=pack.locale+':'+state.completed.join()+':'+state.met.join();if(cache.collection===collectionKey)return;cache.collection=collectionKey;
  $('collected-agents').replaceChildren(...Object.entries(pack.agents).map(([id,a])=>{const unlocked=state.met.includes(id),el=document.createElement('div');el.className='agent-card'+(unlocked?'':' locked');const portrait=document.createElement(unlocked?'canvas':'span');portrait.className='agent-portrait';if(unlocked)world.portrait(portrait,id);else portrait.textContent='?';portrait.setAttribute('aria-hidden','true');const name=document.createElement('span');name.textContent=a.name;el.append(portrait,name);return el;}));
  $('collection-guides').replaceChildren(...pack.guides.map(g=>{const b=button('',()=>{$('collection-dialog').close();choose(g.id);});const name=document.createElement('span'),status=document.createElement('span');name.textContent=g.title;status.textContent=state.completed.includes(g.id)?ui.completeStatus:ui.discover;b.append(name,status);return b;}));
}
async function advance(){
  if(busy||run().finished)return;
  const g=guide(),r=run(),n=g.steps.length,atGate=r.step===n,fix=fixing();
  if(atGate&&!fix){r.finished=true;if(!state.completed.includes(g.id))state.completed.push(g.id);state.met=[...new Set([...state.met,...roles(g)])];pause();render();save();return;}
  const ticket=++generation;busy=true;sceneProgress=0;scenePhase='transfer';
  const moving=world.travelTo(nextActors(),{automatic:playing});render();
  const moved=await moving;if(ticket!==generation||!moved)return;
  if(fix)r.fix++;else r.step++;
  busy=false;sceneProgress=0;
  if(needsHuman()||r.finished)pause();
  render();save();
  // Start the following scene in the same frame; there is no inter-scene timer.
  if(playing)void advance();
}
$('next').addEventListener('click',()=>{pause();void advance();});
$('play').addEventListener('click',()=>{if(playing){pause();render();return;}if(run().finished)return;if(!busy&&needsHuman()){pause();render();$('next').focus();return;}playing=true;world.resumeTravel();render();if(!busy)void advance();});
$('replay').addEventListener('click',()=>{cancel();const input=run().input;state.runs[state.guide]={step:0,fix:0,input,finished:false,revision:baseGuide().revision||1};render(true);save();});
$('correct').addEventListener('click',()=>{pause();run().fix=1;render();save();});
$('speed').addEventListener('change',e=>{state.speed=Number(e.target.value);world.speed=state.speed;save();});
for(const b of document.querySelectorAll('[data-level]'))b.addEventListener('click',()=>choose(pack.guides.find(g=>g.level===Number(b.dataset.level)).id));
$('guide-picker').addEventListener('change',e=>choose(e.target.value));
$('pdf-type').addEventListener('change',e=>{if(!busy&&run().step===0){run().input=e.target.value;render();save();}});
$('zoom-in').addEventListener('click',()=>world.changeZoom(.15));$('zoom-out').addEventListener('click',()=>world.changeZoom(-.15));$('zoom-reset').addEventListener('click',()=>world.center());
$('collection-toggle').addEventListener('click',()=>{pause();render();save();$('collection-dialog').showModal();});$('close-collection').addEventListener('click',()=>$('collection-dialog').close());
for(const b of document.querySelectorAll('[data-language]'))b.addEventListener('click',()=>setLanguage(primaryPack(b.dataset.language)));
function cancelTranslation(){translationTicket++;translationController?.abort();translationController=null;$('generate-language').disabled=false;text('translation-status',ui.translationCancelled);}
$('more-languages').addEventListener('click',()=>{pause();render();text('translation-status',typeof globalThis.Translator?.availability==='function'?'':ui.translationUnavailable);$('language-dialog').showModal();});
$('close-language').addEventListener('click',()=>{cancelTranslation();$('language-dialog').close();});
$('cancel-translation').addEventListener('click',()=>{cancelTranslation();$('language-dialog').close();});
$('language-dialog').addEventListener('cancel',cancelTranslation);
$('translation-form').addEventListener('submit',async e=>{
  e.preventDefault();cancelTranslation();const ticket=translationTicket,controller=new AbortController();translationController=controller;
  const target=$('translation-target').value.trim();$('generate-language').disabled=true;text('translation-status',ui.translationPreparing);
  const timeout=setTimeout(()=>controller.abort(),300000);
  try{
    const translated=automaticPacks.get(target)||await generateLanguage(target,{signal:controller.signal,onDownload:()=>text('translation-status',ui.translationDownloading),onProgress:(done,total)=>text('translation-status',t('translationProgress',{done,total}))});
    if(ticket!==translationTicket||controller.signal.aborted)return;
    automaticPacks.set(target,translated);setLanguage(translated);$('language-dialog').close();
  }catch(error){if(ticket!==translationTicket)return;const kind=controller.signal.aborted?'Cancelled':error.message==='invalid'?'Invalid':error.message==='unsupported'?'Unsupported':error.message==='unavailable'?'Unavailable':'Failed';text('translation-status',ui['translation'+kind]);}
  finally{clearTimeout(timeout);if(ticket===translationTicket){translationController=null;$('generate-language').disabled=false;}}
});
document.addEventListener('visibilitychange',()=>{if(document.hidden){pause();render();}});
renderStatic();render(true);save();
