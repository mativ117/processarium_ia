const palette = {
  tri: ['#9eae7c','#e0e7ca'], red: ['#b68d64','#f2debc'], rel: ['#879e9b','#d2e1da'],
  plan: ['#5c8b78','#c6dac4'], rech: ['#899d7e','#d9e4cd'], design: ['#9b96af','#e5dfee'],
  code: ['#6f9b9b','#cce3dc'], test: ['#c19b59','#f3e5bb'], lecture: ['#809db1','#d7e4e9'],
  export: ['#b79873','#eadac5'], art: ['#a490ac','#e5d7e9'],
  arch:['#718795','#d3dfe3'],data:['#78998a','#d1e2d8'],perf:['#ba9a63','#eddfc1'],
  ops:['#8e9381','#dce2d1'],security:['#8c8da7','#dddceb'],eval:['#a79278','#e5ddca']
};
export const roleVisuals={tri:'▤',red:'✎',rel:'✓',plan:'⑂',rech:'⌕',design:'▱',code:'{}',test:'☑',lecture:'▥',export:'▣',art:'◇',arch:'⌘',data:'≋',perf:'↗',ops:'⇧',security:'⬡',eval:'≔'};
const lots = [[-3,-3],[0,-3],[3,-3],[-3,0],[0,0],[3,0],[0,3]];
const iso = (u,v) => ({ x:(u-v)*39,y:(u+v)*20 });
const lerp=(a,b,t)=>a+(b-a)*t;
function groundRoute(from,to){
  if(Math.hypot(from.u-to.u,from.v-to.v)<.001){const path=[{...from}];path.distances=[];path.distance=0;return path;}
  const a={u:from.u+.55,v:from.v+.65},b={u:to.u+.55,v:to.v+.65};
  const corners=[from,a,{u:a.u,v:b.v},b,to].filter((p,i,all)=>!i||Math.hypot(p.u-all[i-1].u,p.v-all[i-1].v)>.001);
  const result=[{...from}];
  for(let i=1;i<corners.length-1;i++){
    const prev=corners[i-1],p=corners[i],next=corners[i+1],d1=Math.hypot(p.u-prev.u,p.v-prev.v),d2=Math.hypot(next.u-p.u,next.v-p.v);
    const radius=Math.min(.4,d1/3,d2/3);
    const before={u:p.u+(prev.u-p.u)*radius/d1,v:p.v+(prev.v-p.v)*radius/d1},after={u:p.u+(next.u-p.u)*radius/d2,v:p.v+(next.v-p.v)*radius/d2};
    result.push(before);
    for(let j=1;j<=8;j++){const t=j/8;result.push({u:(1-t)**2*before.u+2*(1-t)*t*p.u+t*t*after.u,v:(1-t)**2*before.v+2*(1-t)*t*p.v+t*t*after.v});}
  }
  result.push({...to});
  result.distances=result.slice(1).map((p,i)=>Math.hypot(p.u-result[i].u,p.v-result[i].v));
  result.distance=result.distances.reduce((a,b)=>a+b,0);
  return result;
}
// A continuous, rounded route in world coordinates. Endpoints never reset a person.
function routePoint(points,progress){
  const segments=points.distances;
  let distance=progress*points.distance;
  for(let i=0;i<segments.length;i++){
    if(distance<=segments[i]||i===segments.length-1){const t=segments[i]?distance/segments[i]:1,a=points[i],b=points[i+1];return {u:lerp(a.u,b.u,t),v:lerp(a.v,b.v,t)};}
    distance-=segments[i];
  }
  return {...points.at(-1)};
}

export class World {
  constructor(canvas, names, onSelect) {
    this.canvas=canvas; this.ctx=canvas.getContext('2d'); this.names=names; this.onSelect=onSelect;
    this.roles=[];this.selected='';this.active=[];this.done=new Set();this.people=[];
    this.zoom=1;this.targetZoom=1;this.pan={x:0,y:0};this.time=0;this.visible=true;this.speed=1;this.lastFrame=0;this.handoff={u:-4,v:3};this.onProgress=()=>{};this.paused=true;
    this.reduced=matchMedia('(prefers-reduced-motion: reduce)');
    this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(canvas);
    this.observer=new IntersectionObserver(entries=>{this.visible=entries[0].isIntersecting;});this.observer.observe(canvas);
    canvas.addEventListener('pointerdown',e=>{this.drag={x:e.clientX,y:e.clientY,ox:this.pan.x,oy:this.pan.y,moved:false};canvas.setPointerCapture(e.pointerId);});
    canvas.addEventListener('pointermove',e=>{if(!this.drag)return;const dx=e.clientX-this.drag.x,dy=e.clientY-this.drag.y;if(Math.hypot(dx,dy)>5)this.drag.moved=true;if(this.drag.moved){this.pan.x=this.drag.ox+dx;this.pan.y=this.drag.oy+dy;}});
    canvas.addEventListener('pointerup',e=>{if(this.drag&&!this.drag.moved){const box=canvas.getBoundingClientRect(),x=e.clientX-box.left,y=e.clientY-box.top;let near=null,distance=Infinity;for(const role of this.roles){const lot=this.getLot(role),point=this.screen(lot[0],lot[1]);const d=Math.hypot(point.x-x,point.y-y-26*this.scale);if(d<distance){distance=d;near=role;}}if(distance<65*this.scale&&near)this.onSelect(near);}this.drag=null;});
    canvas.addEventListener('pointercancel',()=>{this.drag=null;});
    this.animate=this.animate.bind(this);this.resize();requestAnimationFrame(this.animate);
  }
  resize(){const box=this.canvas.getBoundingClientRect();this.width=box.width;this.height=box.height;const dpr=Math.min(devicePixelRatio||1,2);this.canvas.width=Math.round(box.width*dpr);this.canvas.height=Math.round(box.height*dpr);this.dpr=dpr;const radius=this.roles.length>7?7:5.2;this.baseScale=Math.max(.08,Math.min((box.width-34)/(radius*156+9),(box.height-85)/(radius*80+44)));if(this.ctx)this.draw();}
  screen(u,v){const p=iso(u,v);return {x:this.width/2+this.pan.x+p.x*this.scale,y:this.height*.53+this.pan.y+p.y*this.scale};}
  get scale(){return this.baseScale*this.zoom;}
  getLot(id){return this.placements?.[id]||[0,0];}
  setView(roles,selected,active,done,reset=false){
    if(reset||roles.join()!==this.roles.join()){
      this.roles=roles;this.placements={};const expanded=Array.from({length:roles.length},(_,i)=>[-4.5+(i%4)*3,-3+Math.floor(i/4)*3]);const sparse=roles.length===3?[[-3,-1],[0,2],[3,-1]]:roles.length>7?expanded:lots;
      roles.forEach((id,i)=>this.placements[id]=sparse[i]);
      this.people=roles.map((id,i)=>{const [u,v]=this.getLot(id);return {id,u:u+.9,v:v+.8,phase:i*1.7};});
      this.zoom=1;this.pan={x:0,y:0};
      this.targetZoom=1;this.handoff=roles.length>7?{u:-6,v:5}:{u:-4.2,v:3.8};
      this.resize();
    }
    this.selected=selected;this.active=active;this.done=new Set(done);
    if(this.ctx)this.draw();
  }
  changeZoom(delta){this.targetZoom=Math.max(.65,Math.min(2.4,this.targetZoom+delta));}
  center(){this.targetZoom=1;this.pan={x:0,y:0};}
  stopTravel(){if(this.travel){const resolve=this.travel.resolve;this.travel=null;this.people.forEach(p=>{p.walking=false;p.package=false;p.working=false;});resolve(false);}}
  pauseTravel(){this.paused=true;if(this.travel)this.travel.pausedAt=true;}
  resumeTravel(){this.paused=false;if(this.travel)this.travel.pausedAt=false;}
  travelTo(ids,{automatic=false,recipients=[]}={}){
    this.stopTravel();
    this.paused=false;
    const moving=this.people.filter(p=>ids.includes(p.id));
    const source={...this.handoff};
    const routes=moving.map((person,i)=>{
      const [u,v]=this.getLot(person.id),home={u:u+.9,v:v+.8},from={u:person.u,v:person.v};
      const next=recipients[i%recipients.length],lot=next?this.getLot(next):null;
      const target=lot?{u:lot[0]+.9,v:lot[1]+.8}:home;
      const collect=groundRoute(from,source),deliver=groundRoute(source,home),outgoing=groundRoute(home,target);
      const total=collect.distance+deliver.distance+outgoing.distance+6;
      return {person,source,home,from,target,collect,deliver,outgoing,workStart:(collect.distance+deliver.distance)/total,workEnd:(collect.distance+deliver.distance+6)/total,pickup:collect.distance/total,total};
    });
    for(const person of this.people){
      if(ids.includes(person.id)){person.returning=null;continue;}
      const [u,v]=this.getLot(person.id),home={u:u+.9,v:v+.8};
      const path=groundRoute(person,home);person.returning=path.distance>.05?{path,progress:0}:null;
    }
    if(this.reduced.matches&&!automatic){routes.forEach(r=>Object.assign(r.person,r.target));this.handoff={...(routes.at(-1)?.target||source)};return Promise.resolve(true);}
    const routeDuration=Math.max(6000,...routes.map(r=>(r.total-6)*260+2000));
    return new Promise(resolve=>{this.travel={routes,resolve,elapsed:0,progress:0,phase:'transfer',pausedAt:false,duration:this.reduced.matches?1800:routeDuration};});
  }
  animate(now){
    const dt=this.lastFrame?Math.min(50,Math.max(0,now-this.lastFrame)):0;this.lastFrame=now;
    if(!this.paused)this.time+=dt*this.speed;
    this.zoom=this.reduced.matches?this.targetZoom:lerp(this.zoom,this.targetZoom,1-Math.exp(-dt/140));
    if(this.travel&&!this.travel.pausedAt){
      const t=this.travel;t.elapsed+=dt*this.speed;t.progress=Math.min(1,t.elapsed/t.duration);
      const workStart=Math.max(...t.routes.map(r=>r.workStart)),workEnd=Math.max(...t.routes.map(r=>r.workEnd));
      t.phase=t.progress<workStart?'transfer':t.progress<workEnd?'work':'result';
      for(const r of t.routes){
        let pos;
        if(t.progress<r.workStart){
          const distance=t.progress*r.total;
          pos=distance<r.collect.distance?routePoint(r.collect,distance/Math.max(.001,r.collect.distance)):routePoint(r.deliver,(distance-r.collect.distance)/Math.max(.001,r.deliver.distance));
        }else if(t.progress<r.workEnd){pos=r.home;}
        else{pos=routePoint(r.outgoing,(t.progress-r.workEnd)/Math.max(.001,1-r.workEnd));}
        const delta=iso(pos.u-r.person.u,pos.v-r.person.v);
        if(Math.abs(delta.x)>.001)r.person.facing=delta.x>0?1:-1;
        r.person.walking=Math.hypot(pos.u-r.person.u,pos.v-r.person.v)>.0001;
        if(!this.reduced.matches)Object.assign(r.person,pos);
        r.packet={u:r.person.u,v:r.person.v};
        r.person.package=t.progress>=r.pickup;r.person.working=t.progress>=r.workStart&&t.progress<r.workEnd;
      }
      for(const person of this.people){
        const trip=person.returning;if(!trip||this.reduced.matches)continue;
        trip.progress=Math.min(1,trip.progress+dt*this.speed*.0028/trip.path.distance);
        const pos=routePoint(trip.path,trip.progress),dx=iso(pos.u-person.u,pos.v-person.v).x;
        if(Math.abs(dx)>.001)person.facing=dx>0?1:-1;
        Object.assign(person,pos);person.walking=trip.progress<1;person.package=false;person.working=false;
        if(trip.progress>=1)person.returning=null;
      }
      this.onProgress(t.progress,t.phase);
      if(t.progress>=1){for(const r of t.routes){Object.assign(r.person,r.target);r.person.walking=false;r.person.package=false;r.person.working=false;}this.handoff={...t.routes.at(-1)?.target||this.handoff};this.travel=null;t.resolve(true);}
    }
    if(this.visible&&this.ctx)this.draw();
    requestAnimationFrame(this.animate);
  }
  poly(points,fill,stroke){const c=this.ctx;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=.7;c.stroke();}}
  line(points,color,width=1){const c=this.ctx;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.stroke();}
  ellipse(x,y,rx,ry,color){const c=this.ctx;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=color;c.fill();}
  tile(u,v,fill,size=.5){const points=[iso(u-size,v-size),iso(u+size,v-size),iso(u+size,v+size),iso(u-size,v+size)];this.poly(points.map(p=>[p.x,p.y]),fill);}
  draw(){
    const c=this.ctx,w=this.width,h=this.height,s=this.scale;if(w<40||h<100)return;c.setTransform(this.dpr,0,0,this.dpr,0,0);c.clearRect(0,0,w,h);
    c.translate(w/2+this.pan.x,h*.53+this.pan.y);c.scale(s,s);
    const radius=this.roles.length>7?7:5.2,edge=Math.floor(radius),corners=[iso(-radius,-radius),iso(radius,-radius),iso(radius,radius),iso(-radius,radius)];
    this.ellipse(5,58,radius*65,radius*30,'#203c2810');
    this.poly(corners.map(p=>[p.x,p.y+14]),'#bdc8ad');
    this.poly(corners.map(p=>[p.x,p.y]),'#dce3ca','#c5d0b6');
    for(let u=-edge;u<=edge;u++)for(let v=-edge;v<=edge;v++){
      if(Math.abs(u)===edge||Math.abs(v)===edge)this.tile(u,v,'#e9e8d4',.39);
      else if((u*13+v*7)%5===0)this.tile(u,v,'#d5dfbf',.49);
      if(u===0||v===0)this.tile(u,v,'#ede9d7',.49);
    }
    // The movement corridors sit between lots rather than running through buildings.
    const streetsU=new Set(this.roles.map(id=>this.getLot(id)[0]+1.45)),streetsV=new Set(this.roles.map(id=>this.getLot(id)[1]+1.45));
    for(const u of streetsU){const a=iso(u,-edge+.7),b=iso(u,edge-.7);this.line([[a.x,a.y],[b.x,b.y]],'#eae7d4',15);}
    for(const v of streetsV){const a=iso(-edge+.7,v),b=iso(edge-.7,v);this.line([[a.x,a.y],[b.x,b.y]],'#eae7d4',15);}
    // Each workshop has its own paved approach to the shared paths.
    for(const id of this.roles){const [u,v]=this.getLot(id);for(let x=Math.min(0,u);x<=Math.max(0,u);x++)this.tile(x,v+1,'#eae7d4',.32);}
    if(this.travel&&!this.reduced.matches){
      for(const r of this.travel.routes){
        if(!r.person.walking)continue;
        const path=this.travel.progress<r.pickup?r.collect:this.travel.progress<r.workStart?r.deliver:r.outgoing;
        this.ctx.setLineDash([3,6]);this.line(path.map(p=>{const v=iso(p.u,p.v);return[v.x,v.y];}),'#b6935640',1);this.ctx.setLineDash([]);
      }
    }
    const trees=this.roles.length>7?[[-6,-5],[-3,-5],[2,-5],[5,-5],[-6,0],[-6,4],[-3,5],[2,5],[6,4],[6,0]]:[[-4,-4],[-2,-4],[2,-4],[4,-4],[-4,0],[-4,3],[-2,4],[2,4],[4,3],[4,0]];
    const objects=trees.map(([u,v],i)=>({depth:u+v,draw:()=>this.tree(u,v,i)}));
    for(const id of this.roles){const [u,v]=this.getLot(id);objects.push({depth:u+v,draw:()=>this.building(id,u,v)});}
    for(const person of this.people)objects.push({depth:person.u+person.v+.1,draw:()=>this.person(person)});
    objects.sort((a,b)=>a.depth-b.depth).forEach(o=>o.draw());
    const labeled=this.width<510?new Set([this.selected,this.active[0]]):this.roles.length>7?new Set([this.selected,...this.active.slice(0,3)]):new Set(this.roles);
    for(const id of this.roles){const [u,v]=this.getLot(id),p=iso(u,v);if(!labeled.has(id))continue;this.label(this.names[id],p.x,p.y-102,this.active.includes(id));}
    c.setTransform(this.dpr,0,0,this.dpr,0,0);

  }
  tree(u,v,index){const p=iso(u,v),c=this.ctx;this.ellipse(p.x+3,p.y+4,14,6,'#7b91672a');c.fillStyle='#aa9b77';c.fillRect(p.x-2,p.y-22,4,25);this.ellipse(p.x,p.y-30,14,19,index%2?'#97b18b':'#a8be90');this.ellipse(p.x-5,p.y-34,8,12,index%2?'#a5bf96':'#b7caa2');}
  building(id,u,v){
    const {x,y}=iso(u,v),c=this.ctx,[roof,light]=palette[id]||palette.plan,active=this.active.includes(id),selected=this.selected===id;
    this.ellipse(x+11,y+12,54,18,'#63735316');
    if(active||selected){const t=this.reduced.matches?0:Math.sin(this.time/480)*.05;this.ellipse(x,y+2,57,29,active?`rgba(210,162,77,${.12+t})`:'#436c5820');}
    this.poly([[x-44,y],[x,y+22],[x+44,y],[x,y-22]],'#eeeada');
    this.poly([[x-37,y-2],[x,y+16],[x,y-34],[x-37,y-52]],'#fffdf1');
    this.poly([[x,y+16],[x+37,y-2],[x+37,y-52],[x,y-34]],light);
    this.poly([[x-43,y-54],[x,y-33],[x+43,y-54],[x,y-75]],roof);
    this.poly([[x-43,y-54],[x,y-33],[x,y-29],[x-43,y-50]],'#fffdf133');
    // Doors and windows follow the same projection as their wall.
    this.poly([[x-15,y+9],[x-4,y+14],[x-4,y-9],[x-15,y-14]],'#9fbaad');
    this.poly([[x-31,y-26],[x-21,y-21],[x-21,y-11],[x-31,y-16]],'#c1d8ce');
    this.poly([[x+10,y-20],[x+29,y-29],[x+29,y-15],[x+10,y-6]],'#98b7a6');
    this.line([[x+19,y-24],[x+19,y-10]],'#e8efe2',1.4);
    c.fillStyle='#fffdf2';c.beginPath();c.roundRect(x-17,y-62,34,24,4);c.fill();c.font='bold 18px system-ui';c.fillStyle=roof;c.textAlign='center';c.textBaseline='middle';c.fillText(roleVisuals[id],x,y-50);
    if(['code','lecture','export'].includes(id)){this.poly([[x-15,y-59],[x+2,y-51],[x+19,y-59],[x+2,y-67]],'#dbe8dd');this.line([[x-11,y-59],[x+2,y-53],[x+15,y-59]],'#91b2a3',1);}
    if(id==='art'||id==='design'){c.fillStyle='#f1e7cf';c.fillRect(x+17,y-74,6,20);this.ellipse(x+20,y-76,7,3,roof);}
    if(id==='plan'){this.line([[x,y-74],[x,y-100]],'#708f73',2);const flutter=this.reduced.matches?0:Math.sin(this.time/400)*2;this.poly([[x,y-100],[x+20,y-96+flutter],[x,y-88]],'#e7ba72');}
    if(active&&this.people.find(p=>p.id===id)?.working){
      const task=this.travel.routes.find(r=>r.person.id===id);const q=this.reduced.matches?1:task?Math.max(0,Math.min(1,(this.travel.progress-task.workStart)/Math.max(.001,task.workEnd-task.workStart))):0;
      if(id==='lecture')this.line([[x-29,y-24+q*26],[x+1,y-9+q*26]],'#c69842',2);
      else if(id==='red'||id==='code'||id==='design'){for(let j=0;j<3;j++)if(q>j/3)this.line([[x-29,y-23+j*6],[x-8,y-13+j*6]],'#7d9d87',1.5);}
      else if(id==='tri'){for(let j=0;j<3;j++){const xx=x-28+lerp(j*11,j*3,q);this.poly([[xx,y+4],[xx+6,y+7],[xx+6,y+14],[xx,y+11]],'#f6eed5','#b39d70');}}
      else {const phase=this.reduced.matches?1:Math.sin(this.time/180);this.ellipse(x+10,y+11,4+phase,2,'#84a581');}
    }
    const color=active?'#d4a14f':this.done.has(id)?'#699c76':'#c4cbb6';this.ellipse(x+40,y-55,4,4,color);
    if(active){const radius=this.reduced.matches?6:6+Math.sin(this.time/350)*1.3;c.strokeStyle='#d4a14f88';c.lineWidth=1;c.beginPath();c.arc(x+40,y-55,radius,0,Math.PI*2);c.stroke();}
  }
  person(person){
    const p=iso(person.u,person.v),c=this.ctx,walking=person.walking&&!this.reduced.matches&&!this.paused;
    c.save();c.translate(p.x,p.y);const size=person.portrait?1.2:Math.max(1,.95/this.scale);c.scale(size*(person.facing||1),size);
    const phase=this.time/95+person.phase,bob=walking?Math.abs(Math.sin(phase))*.8:0,x=0,y=-bob,[coat]=palette[person.id]||palette.plan;
    this.ellipse(x+2,2,7,3,'#3c584e28');
    if(person.id==='lecture'||person.id==='export'){
      c.fillStyle=person.id==='lecture'?'#809db1':'#b79873';c.beginPath();c.roundRect(-8,-23,16,22,3);c.fill();
      c.fillStyle='#edf3e8';c.fillRect(-5,-20,10,10);this.line([[-4,-15],[4,-15]],'#56766e',1);
      if(person.id==='lecture'){const scan=person.working&&!this.reduced.matches?Math.sin(this.time/220)*3:0;this.line([[-5,-15+scan],[5,-15+scan]],'#e8bd64',2);}else c.fillRect(-5,-7,10,3);
      if(person.package){c.fillStyle='#fff6d8';c.fillRect(4,-15,7,10);}
      this.ellipse(-5,1,3,3,'#445e58');this.ellipse(5,1,3,3,'#445e58');c.restore();return;
    }
    c.lineWidth=3;c.strokeStyle='#526c63';c.lineCap='round';const stride=walking?Math.sin(phase)*3:0;
    this.line([[x-2,y-4],[x-3+stride,y+2]],'#526c63',3);this.line([[x+2,y-4],[x+3-stride,y+2]],'#526c63',3);
    c.fillStyle=coat;c.beginPath();c.roundRect(x-5,y-16,10,12,3);c.fill();
    const work=person.working&&!this.paused&&!this.reduced.matches?Math.sin(this.time/140)*1.5:0;
    this.line([[x-5,y-14],[x-7-stride*.4,y-7+work]],'#d9bd8a',2.5);this.line([[x+5,y-14],[x+7+stride*.4,y-7-work]],'#d9bd8a',2.5);
    this.ellipse(x,y-22,5,5.5,'#e7c89c');this.ellipse(x,y-25,6.5,3,person.id==='plan'?'#d1a151':'#536d5d');
    if(['code','arch','ops'].includes(person.id)){c.fillStyle='#dec07d';c.beginPath();c.arc(x,y-25,6,Math.PI,0);c.fill();}
    if(['rel','rech','eval'].includes(person.id)){c.strokeStyle='#354e46';c.lineWidth=1;c.strokeRect(x-3,y-24,3,3);c.strokeRect(x+1,y-24,3,3);}
    if(['red','art','design'].includes(person.id)){c.fillStyle='#f0dfb3';c.fillRect(x-3,y-12,6,7);this.line([[x+5,y-10],[x+10,y-17]],'#a6784c',2);}
    if(person.id==='tri'){c.fillStyle='#cfb278';c.fillRect(x-8,y-13,4,9);}
    if(person.id==='security'){this.poly([[x-3,y-13],[x+3,y-13],[x+3,y-9],[x,y-6],[x-3,y-9]],'#f6e8b7');}
    this.ellipse(x+2,y-22,.7,.7,'#3d544a');
    if(person.package){this.poly([[x+3,y-13],[x+10,y-16],[x+10,y-7],[x+3,y-4]],'#fbf6df','#b6bd9d');this.line([[x+5,y-11],[x+8,y-12]],'#a4ad91',.6);}
    c.restore();
  }
  portrait(canvas,id){canvas.width=88;canvas.height=88;const context=canvas.getContext('2d');if(!context)return;context.setTransform(2,0,0,2,44,68);const original=this.ctx;this.ctx=context;this.person({id,u:0,v:0,phase:0,walking:false,package:false,portrait:true});this.ctx=original;}
  label(text,x,y,active){const c=this.ctx,s=this.scale;c.font=`500 ${Math.max(12,12/s)}px system-ui`;const tw=c.measureText(text).width;const height=23/s;c.fillStyle=active?'#294c40':'#fffff4ed';c.beginPath();c.roundRect(x-tw/2-6/s,y-height/2,tw+12/s,height,4/s);c.fill();c.fillStyle=active?'#fff9e9':'#596b58';c.textAlign='center';c.textBaseline='middle';c.fillText(text,x,y+.5);}
}
