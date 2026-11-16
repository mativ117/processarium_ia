import {agents, guides} from './processes.js';
import {World} from './world.js';

const $=id=>document.getElementById(id),key='processarium:v1';
const titles={publication:'Une idée → un post',reponse:'Un message → une réponse',reunion:'Une réunion → un plan',comparatif:'Comparer pour choisir',calque:'Calque · lire et convertir',coachos:'CoachOS · faire évoluer l’éditeur',eclipse:'Un jeu 3D · de la conception à la livraison',documentaire:'Un assistant documentaire à grande échelle'};
const subtitles=['Une chaîne courte : trier, rédiger, relire. Deux guides pour commencer.','Coordonner plusieurs rôles, travailler en parallèle et repérer les informations manquantes.','Construire un livrable technique avec des branches, de l’intégration et des contrôles.','Orchestrer plusieurs métiers, des calculs lourds, des campagnes de tests et des décisions humaines.'];
let storageAvailable=true,playing=false,busy=false,generation=0,level=0,timer=null;
const state={version:1,guide:'publication',selected:'tri',completed:[],met:[],runs:{}};
function readState(){try{const raw=JSON.parse(localStorage.getItem(key));if(raw?.version!==1)return;state.guide=guides.some(g=>g.id===raw.guide)?raw.guide:'publication';state.selected=agents[raw.selected]?raw.selected:'tri';state.completed=Array.isArray(raw.completed)?[...new Set(raw.completed.filter(id=>guides.some(g=>g.id===id)))]:[];for(const g of guides){const r=raw.runs?.[g.id];if(r){const updated=(r.revision||1)!==(g.revision||1);state.runs[g.id]={step:r.finished?g.steps.length:updated?0:Number.isInteger(r.step)?Math.max(0,Math.min(g.steps.length,r.step)):0,fix:updated?0:Number.isInteger(r.fix)?Math.max(0,Math.min(3,r.fix)):0,input:['scan','text'].includes(r.input)?r.input:'mixed',finished:!!r.finished,revision:g.revision||1};}}}catch{storageAvailable=false;}}
readState();
// Preserve earned characters when an existing guide receives additional roles.
try{const old=JSON.parse(localStorage.getItem(key));if(old?.version===1){const previousEclipse=['plan','rech','design','art','test','code','rel'];state.met=Array.isArray(old.met)?[...new Set(old.met.filter(id=>agents[id]))]:[...new Set(state.completed.flatMap(id=>id==='eclipse'?previousEclipse:guides.find(g=>g.id===id).steps.flatMap(s=>s.actors)))];}}catch{}
function save(){try{localStorage.setItem(key,JSON.stringify(state));}catch{storageAvailable=false;}$('storage-note').textContent=storageAvailable?'Collection enregistrée dans ce navigateur. Aucun compte, aucune synchronisation.':'Le navigateur ne permet pas l’enregistrement. La collection reste disponible dans cet onglet seulement.';}
function baseGuide(){return guides.find(g=>g.id===state.guide);}
function run(){return state.runs[state.guide]??={step:0,fix:0,input:'mixed',finished:false,revision:baseGuide().revision||1};}
function duration(seconds){return seconds<120?seconds+' s':Math.floor(seconds/60)+' min'+(seconds%60?' '+seconds%60+' s':'');}
function guide(){const g=baseGuide(),r=run();if(g.id!=='calque'||r.input==='mixed')return g;const steps=g.steps.map(s=>({...s}));steps[1].output=r.input==='text'?'Douze pages avec du texte natif exploitable : extraction directe, sans reconnaissance de caractères.':'Douze pages scannées : reconnaissance de caractères pour chaque page.';steps[2].seconds=r.input==='text'?48:420;steps[2].effort=steps[2].seconds;steps[2].output=r.input==='text'?'Le texte des douze pages est extrait directement.':'Les douze pages sont reconnues par le moteur OCR ; les mots incertains sont signalés.';steps[2].resource=r.input==='text'?'Extraction PDF.js locale, sans OCR ni appel IA distant.':'PDF.js et Tesseract locaux ; calcul et mémoire du navigateur.';return {...g,input:r.input==='text'?'PDF fictif : douze pages avec du texte natif.':'PDF fictif : douze pages scannées.',steps};}
function roles(g=guide()){return [...new Set(g.steps.flatMap(s=>s.actors))];}
function button(text,fn,className=''){const b=document.createElement('button');b.type='button';b.textContent=text;b.className=className;b.addEventListener('click',fn);return b;}
const world=new World($('world'),Object.fromEntries(Object.entries(agents).map(([id,a])=>[id,a.name])),id=>{state.selected=id;render();save();});
level=baseGuide().level;
function pause(){playing=false;clearTimeout(timer);timer=null;world.pauseTravel();}
function cancel(){generation++;busy=false;pause();world.stopTravel();}
function choose(id){if(id===state.guide)return;cancel();state.guide=id;level=baseGuide().level;state.selected=roles()[0];world.center();render(true);save();}
function nextActors(){const g=guide(),r=run();if(r.finished)return[];if(r.step<g.steps.length)return g.steps[r.step].actors;if(r.fix===1)return[roles().includes('code')?'code':roles().includes('red')?'red':'lecture'];if(r.fix===2)return[roles().includes('test')?'test':'rel'];return[];}
function render(reset=false){
  const g=guide(),r=run(),n=g.steps.length,gate=r.step===n,active=nextActors(),crew=roles(g),done=g.steps.slice(0,r.step),fixing=gate&&(r.fix===1||r.fix===2);
  if(!crew.includes(state.selected))state.selected=crew[0];
  document.querySelectorAll('[data-level]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.level)===level)));
  $('guide-list').replaceChildren(...guides.filter(x=>x.level===level).map((x,i)=>{const b=button('',()=>choose(x.id),'guide-button'+(x.id===g.id?' selected':''));b.setAttribute('aria-pressed',String(x.id===g.id));const num=document.createElement('span');num.className='guide-number';num.textContent=String(i+1).padStart(2,'0');const content=document.createElement('span'),title=document.createElement('strong'),sub=document.createElement('small');title.textContent=titles[x.id];sub.textContent=x.steps.length+' étapes · '+roles(x).length+' rôles'+(state.completed.includes(x.id)?' · terminé':'');content.append(title,sub);b.append(num,content);return b;}));
  $('guide-picker').replaceChildren(...guides.filter(x=>x.level===level).map(x=>{const o=document.createElement('option');o.value=x.id;o.textContent=titles[x.id];o.selected=x.id===g.id;return o;}));
  $('level-label').textContent=['NIVEAU 1 · SIMPLE','NIVEAU 2 · INTERMÉDIAIRE','NIVEAU 3 · AVANCÉ','NIVEAU 4 · EXPERT'][level];$('guide-title').textContent=titles[g.id];$('guide-size').textContent=crew.length+' rôles · '+n+' étapes';
  $('level-description').textContent=subtitles[level];$('prerequisites').textContent='Pour se lancer : '+(g.requires||['aucun prérequis ; partir d’une idée ou d’un message.','savoir formuler une demande et relire un résultat.','comprendre un livrable technique et vérifier les cas limites.'][level]);
  $('peak-workers').textContent=Math.max(...g.steps.map(s=>s.actors.length));$('planned-work').textContent=duration(g.steps.reduce((sum,s)=>sum+s.effort,0));
  $('map-caption').textContent=busy?(world.travel?.pausedAt?'Lecture en pause':'Le dossier circule…'):r.finished?'L’équipe a terminé':fixing?(r.fix===1?'Retour à l’atelier pour corriger':'Une nouvelle vérification attend'):gate?'La décision t’appartient':g.steps[r.step].name+' · '+active.length+' poste'+(active.length>1?'s en parallèle':'');
  $('parallel-key').textContent=active.length>1?active.length+' postes en parallèle':'';
  $('next').textContent=busy?'En cours…':r.finished?'Guide terminé ✓':fixing?(r.fix===1?'Appliquer la correction':'Vérifier à nouveau'):gate?'Terminer le guide':g.steps[r.step].human?'Confirmer la relecture':g.steps[r.step].name;
  $('next').disabled=busy||r.finished;$('play').disabled=r.finished||gate;$('play').textContent=playing?'Ⅱ':'▶';$('play').setAttribute('aria-pressed',String(playing));$('play').setAttribute('aria-label',playing?'Mettre la lecture en pause':'Lancer la lecture automatique');
  $('replay').disabled=busy;$('step-status').textContent=r.finished?'Ajouté à la collection':gate?(fixing?'Correction en cours':'Validation humaine'):r.step+'/'+n+' étapes';$('progress').style.width=(r.finished?100:r.step/n*100)+'%';
  $('document-label').textContent=r.finished?g.result:gate&&r.fix?['','Retour demandé','Correction appliquée','Nouvelle vérification terminée'][r.fix]:r.step===0?'La demande de départ':g.steps[r.step-1].name+' · résultat';
  $('document-content').textContent=gate&&r.fix?g.fix:r.step===0?g.input:g.steps[r.step-1].output;
  $('correct').hidden=!gate||!!r.fix||r.finished;$('correct').disabled=busy;
  const factor=[1,2,5,12][level],extraTime=(r.fix===3?36:r.fix===2?24:0)*factor,extraEffort=(r.fix===3?48:r.fix===2?32:0)*factor;
  $('elapsed').textContent=duration(done.reduce((a,s)=>a+s.seconds,0)+extraTime);$('effort').textContent=duration(done.reduce((a,s)=>a+s.effort,0)+extraEffort);$('human').textContent=done.filter(s=>s.human).length+(r.fix?1:0)+(r.finished?1:0);
  $('resources').textContent=(done.length?done.at(-1).resource:subtitles[level])+' '+(done.some(s=>s.actors.length>1)?'Le travail cumulé additionne les contributions simultanées. ':'')+'Durées illustratives, sans mesure réelle.';
  $('branch').hidden=g.id!=='calque';$('pdf-type').value=r.input;$('pdf-type').disabled=busy||r.step>0;
  $('role-list').replaceChildren(...crew.map(id=>{const b=button(agents[id].name,()=>{state.selected=id;render();save();});b.setAttribute('aria-pressed',String(state.selected===id));return b;}));
  $('role-detail').textContent=agents[state.selected].name+' · '+(agents[state.selected].kind||'Rôle illustratif')+' — '+agents[state.selected].detail;
  $('process-path').replaceChildren(...g.steps.map((s,i)=>{const el=document.createElement('span');el.className='path-step'+(i<r.step?' done':i===r.step?' current':'');el.textContent=(i<r.step?'✓ ':String(i+1)+'. ')+s.name;return el;}));
  $('source-note').textContent=g.source?'Inspiré du projet documenté. Les rôles, les durées et les incidents sont une mise en scène pédagogique. Aucun changement n’est exécuté sur le projet.':'Exemple pédagogique fictif. La simulation montre une méthode ; elle n’exécute pas d’agent IA et n’envoie aucun message.';
  $('source-link').hidden=!g.source;if(g.source)$('source-link').href='https://github.com/mativ117/'+g.source+'/blob/main/README.md';
  world.setView(crew,state.selected,active,done.flatMap(s=>s.actors),reset);
  renderCollection();
}
function renderCollection(){
  const earned=state.met;$('collection-count').textContent=state.completed.length;$('collection-summary').textContent=state.completed.length+'/'+guides.length+' guides terminés · '+earned.length+'/'+Object.keys(agents).length+' personnages rencontrés';
  $('collected-agents').replaceChildren(...Object.entries(agents).map(([id,a])=>{const unlocked=earned.includes(id),el=document.createElement('div');el.className='agent-card'+(unlocked?'':' locked');const portrait=document.createElement(unlocked?'canvas':'span');portrait.className='agent-portrait';if(unlocked)world.portrait(portrait,id);else portrait.textContent='?';portrait.setAttribute('aria-hidden','true');const name=document.createElement('span');name.textContent=a.name;el.append(portrait,name);return el;}));
  $('collection-guides').replaceChildren(...guides.map(g=>{const b=button('',()=>{$('collection-dialog').close();choose(g.id);});const name=document.createElement('span'),status=document.createElement('span');name.textContent=titles[g.id];status.textContent=state.completed.includes(g.id)?'Terminé ✓':'À découvrir →';b.append(name,status);return b;}));
}
async function advance(){
  if(busy||run().finished)return;
  const g=guide(),r=run(),n=g.steps.length,atGate=r.step===n,fixing=atGate&&(r.fix===1||r.fix===2);
  if(atGate&&!fixing){r.finished=true;if(!state.completed.includes(g.id))state.completed.push(g.id);state.met=[...new Set([...state.met,...roles(g)])];pause();render();save();return;}
  const ticket=++generation;busy=true;render();
  const moved=await world.travelTo(nextActors());
  if(ticket!==generation||!moved)return;
  if(fixing)r.fix++;else r.step++;
  busy=false;if(r.step===n)pause();render();save();
  if(playing)schedule();
}
function schedule(){clearTimeout(timer);if(!playing)return;const r=run(),s=guide().steps[r.step];if(!s||s.human){pause();render();return;}timer=setTimeout(()=>advance(),1000);}
$('next').addEventListener('click',()=>{pause();advance();});
$('play').addEventListener('click',()=>{if(playing){pause();render();return;}if(run().finished||run().step===guide().steps.length)return;const step=guide().steps[run().step];if(step.human){pause();render();$('next').focus();return;}playing=true;world.resumeTravel();render();if(!busy)advance();});
$('replay').addEventListener('click',()=>{cancel();const input=run().input;state.runs[state.guide]={step:0,fix:0,input,finished:false,revision:baseGuide().revision||1};render(true);save();});
$('correct').addEventListener('click',()=>{pause();run().fix=1;render();save();});
document.querySelectorAll('[data-level]').forEach(b=>b.addEventListener('click',()=>{const target=guides.find(g=>g.level===Number(b.dataset.level));choose(target.id);}));
$('guide-picker').addEventListener('change',e=>choose(e.target.value));
$('pdf-type').addEventListener('change',e=>{if(!busy&&run().step===0){run().input=e.target.value;render();save();}});
$('zoom-in').addEventListener('click',()=>world.changeZoom(.15));$('zoom-out').addEventListener('click',()=>world.changeZoom(-.15));$('zoom-reset').addEventListener('click',()=>world.center());
$('collection-toggle').addEventListener('click',()=>{pause();render();save();$('collection-dialog').showModal();});$('close-collection').addEventListener('click',()=>$('collection-dialog').close());
document.addEventListener('visibilitychange',()=>{if(document.hidden){pause();render();}});
render(true);save();
