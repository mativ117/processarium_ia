const palette = {
  tri: ['#9eae7c','#e0e7ca'], red: ['#b68d64','#f2debc'], rel: ['#879e9b','#d2e1da'],
  plan: ['#5c8b78','#c6dac4'], rech: ['#899d7e','#d9e4cd'], design: ['#9b96af','#e5dfee'],
  code: ['#6f9b9b','#cce3dc'], test: ['#c19b59','#f3e5bb'], lecture: ['#809db1','#d7e4e9'],
  export: ['#b79873','#eadac5'], art: ['#a490ac','#e5d7e9']
};
const lots = [[-3,-2],[0,-3],[3,-2],[-3,1],[0,0],[3,1],[0,3]];
const iso = (u,v) => ({ x:(u-v)*39,y:(u+v)*20 });
const lerp=(a,b,t)=>a+(b-a)*t;

export class World {
  constructor(canvas, names, onSelect) {
    this.canvas=canvas; this.ctx=canvas.getContext('2d'); this.names=names; this.onSelect=onSelect;
    this.roles=[];this.selected='';this.active=[];this.done=new Set();this.people=[];
    this.zoom=1;this.pan={x:0,y:0};this.time=0;this.visible=true;
    this.reduced=matchMedia('(prefers-reduced-motion: reduce)');
    this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(canvas);
    this.observer=new IntersectionObserver(entries=>{this.visible=entries[0].isIntersecting;});this.observer.observe(canvas);
    canvas.addEventListener('pointerdown',e=>{this.drag={x:e.clientX,y:e.clientY,ox:this.pan.x,oy:this.pan.y,moved:false};canvas.setPointerCapture(e.pointerId);});
    canvas.addEventListener('pointermove',e=>{if(!this.drag)return;const dx=e.clientX-this.drag.x,dy=e.clientY-this.drag.y;if(Math.hypot(dx,dy)>5)this.drag.moved=true;if(this.drag.moved){this.pan.x=this.drag.ox+dx;this.pan.y=this.drag.oy+dy;}});
    canvas.addEventListener('pointerup',e=>{if(this.drag&&!this.drag.moved){const box=canvas.getBoundingClientRect(),x=e.clientX-box.left,y=e.clientY-box.top;let near=null,distance=Infinity;for(const role of this.roles){const lot=this.getLot(role),point=this.screen(lot[0],lot[1]);const d=Math.hypot(point.x-x,point.y-y-26*this.scale);if(d<distance){distance=d;near=role;}}if(distance<65*this.scale&&near)this.onSelect(near);}this.drag=null;});
    canvas.addEventListener('pointercancel',()=>{this.drag=null;});
    this.animate=this.animate.bind(this);this.resize();requestAnimationFrame(this.animate);
  }
  resize(){const box=this.canvas.getBoundingClientRect();this.width=box.width;this.height=box.height;const dpr=Math.min(devicePixelRatio||1,2);this.canvas.width=Math.round(box.width*dpr);this.canvas.height=Math.round(box.height*dpr);this.dpr=dpr;this.baseScale=Math.min((box.width-34)/820,(box.height-85)/460);}
  screen(u,v){const p=iso(u,v);return {x:this.width/2+this.pan.x+p.x*this.scale,y:this.height*.53+this.pan.y+p.y*this.scale};}
  get scale(){return this.baseScale*this.zoom;}
  getLot(id){return this.placements?.[id]||[0,0];}
  setView(roles,selected,active,done,reset=false){
    if(reset||roles.join()!==this.roles.join()){
      this.roles=roles;this.placements={};const sparse=roles.length===3?[[-3,-1],[0,2],[3,-1]]:lots;
      roles.forEach((id,i)=>this.placements[id]=sparse[i]);
      this.people=roles.map((id,i)=>{const [u,v]=this.getLot(id);return {id,u:u+.9,v:v+.8,phase:i*1.7};});
      this.zoom=1;this.pan={x:0,y:0};
    }
    this.selected=selected;this.active=active;this.done=new Set(done);
  }
  changeZoom(delta){this.zoom=Math.max(.65,Math.min(1.8,this.zoom+delta));}
  center(){this.zoom=1;this.pan={x:0,y:0};}
  stopTravel(){if(this.travel){const resolve=this.travel.resolve;this.travel=null;resolve(false);}}
  pauseTravel(){if(this.travel&&!this.travel.pausedAt)this.travel.pausedAt=performance.now();}
  resumeTravel(){if(this.travel?.pausedAt){this.travel.start+=performance.now()-this.travel.pausedAt;delete this.travel.pausedAt;}}
  travelTo(ids){
    this.stopTravel();
    const moving=this.people.filter(p=>ids.includes(p.id));
    const routes=moving.map((person,i)=>{const [u,v]=this.getLot(person.id);return {person,from:{u:u-1.2,v:v+1.25},to:{u:u+.9,v:v+.8},delay:i*120};});
    if(this.reduced.matches){routes.forEach(r=>Object.assign(r.person,r.to));return Promise.resolve(true);}
    return new Promise(resolve=>{this.travel={start:performance.now(),routes,resolve,duration:1700};});
  }
  animate(now){
    this.time=now;
    if(this.travel&&!this.travel.pausedAt){const t=this.travel,elapsed=now-t.start;for(const r of t.routes){const k=Math.max(0,Math.min(1,(elapsed-r.delay)/(t.duration-240)));const ease=k*k*(3-2*k);r.person.u=lerp(r.from.u,r.to.u,ease);r.person.v=lerp(r.from.v,r.to.v,ease);r.person.walking=k<1;r.person.package=k<1;}if(elapsed>=t.duration){for(const r of t.routes){r.person.walking=false;r.person.package=false;}this.travel=null;t.resolve(true);}}
    if(this.visible&&this.ctx)this.draw();
    requestAnimationFrame(this.animate);
  }
  poly(points,fill,stroke){const c=this.ctx;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=.7;c.stroke();}}
  line(points,color,width=1){const c=this.ctx;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.stroke();}
  ellipse(x,y,rx,ry,color){const c=this.ctx;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=color;c.fill();}
  tile(u,v,fill,size=.5){const points=[iso(u-size,v-size),iso(u+size,v-size),iso(u+size,v+size),iso(u-size,v+size)];this.poly(points.map(p=>[p.x,p.y]),fill);}
  draw(){
    const c=this.ctx,w=this.width,h=this.height,s=this.scale;c.setTransform(this.dpr,0,0,this.dpr,0,0);c.clearRect(0,0,w,h);
    c.translate(w/2+this.pan.x,h*.53+this.pan.y);c.scale(s,s);
    const corners=[iso(-5.2,-5.2),iso(5.2,-5.2),iso(5.2,5.2),iso(-5.2,5.2)];
    this.ellipse(5,58,340,160,'#203c2810');
    this.poly(corners.map(p=>[p.x,p.y+14]),'#bdc8ad');
    this.poly(corners.map(p=>[p.x,p.y]),'#dce3ca','#c5d0b6');
    for(let u=-5;u<=5;u++)for(let v=-5;v<=5;v++){
      if(Math.abs(u)===5||Math.abs(v)===5)this.tile(u,v,'#e9e8d4',.39);
      else if((u*13+v*7)%5===0)this.tile(u,v,'#d5dfbf',.49);
      if(u===0||v===0)this.tile(u,v,'#ede9d7',.49);
    }
    // Each workshop has its own paved approach to the shared paths.
    for(const id of this.roles){const [u,v]=this.getLot(id);for(let x=Math.min(0,u);x<=Math.max(0,u);x++)this.tile(x,v+1,'#eae7d4',.32);}
    const trees=[[-4,-4],[-2,-4],[2,-4],[4,-4],[-4,0],[-4,3],[-2,4],[2,4],[4,3],[4,0]];
    const objects=trees.map(([u,v],i)=>({depth:u+v,draw:()=>this.tree(u,v,i)}));
    for(const id of this.roles){const [u,v]=this.getLot(id);objects.push({depth:u+v,draw:()=>this.building(id,u,v)});}
    for(const person of this.people)objects.push({depth:person.u+person.v+.1,draw:()=>this.person(person)});
    objects.sort((a,b)=>a.depth-b.depth).forEach(o=>o.draw());
    for(const id of this.roles){const [u,v]=this.getLot(id),p=iso(u,v);if(this.width<510&&id!==this.selected&&!this.active.includes(id))continue;this.label(this.names[id],p.x,p.y+43,this.active.includes(id));}
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
    if(['code','lecture','export'].includes(id)){this.poly([[x-15,y-59],[x+2,y-51],[x+19,y-59],[x+2,y-67]],'#dbe8dd');this.line([[x-11,y-59],[x+2,y-53],[x+15,y-59]],'#91b2a3',1);}
    if(id==='art'||id==='design'){c.fillStyle='#f1e7cf';c.fillRect(x+17,y-74,6,20);this.ellipse(x+20,y-76,7,3,roof);}
    if(id==='plan'){this.line([[x,y-74],[x,y-100]],'#708f73',2);const flutter=this.reduced.matches?0:Math.sin(this.time/400)*2;this.poly([[x,y-100],[x+20,y-96+flutter],[x,y-88]],'#e7ba72');}
    const color=active?'#d4a14f':this.done.has(id)?'#699c76':'#c4cbb6';this.ellipse(x+40,y-55,4,4,color);
    if(active){const radius=this.reduced.matches?6:6+Math.sin(this.time/350)*1.3;c.strokeStyle='#d4a14f88';c.lineWidth=1;c.beginPath();c.arc(x+40,y-55,radius,0,Math.PI*2);c.stroke();}
  }
  person(person){
    const p=iso(person.u,person.v),c=this.ctx,walking=person.walking&&!this.reduced.matches&&!this.travel?.pausedAt;
    const phase=this.time/95+person.phase,bob=walking?Math.abs(Math.sin(phase))*.8:0,x=p.x,y=p.y-bob,[coat]=palette[person.id]||palette.plan;
    this.ellipse(x+2,p.y+2,7,3,'#3c584e28');
    c.lineWidth=3;c.strokeStyle='#526c63';c.lineCap='round';const stride=walking?Math.sin(phase)*3:0;
    this.line([[x-2,y-4],[x-3+stride,y+2]],'#526c63',3);this.line([[x+2,y-4],[x+3-stride,y+2]],'#526c63',3);
    c.fillStyle=coat;c.beginPath();c.roundRect(x-5,y-16,10,12,3);c.fill();
    this.line([[x-5,y-14],[x-7-stride*.4,y-7]],'#d9bd8a',2.5);this.line([[x+5,y-14],[x+7+stride*.4,y-7]],'#d9bd8a',2.5);
    this.ellipse(x,y-22,5,5.5,'#e7c89c');this.ellipse(x,y-25,6.5,3,person.id==='plan'?'#d1a151':'#536d5d');
    this.ellipse(x+2,y-22,.7,.7,'#3d544a');
    if(person.package){this.poly([[x+3,y-13],[x+10,y-16],[x+10,y-7],[x+3,y-4]],'#fbf6df','#b6bd9d');this.line([[x+5,y-11],[x+8,y-12]],'#a4ad91',.6);}
  }
  portrait(canvas,id){canvas.width=88;canvas.height=88;const context=canvas.getContext('2d');if(!context)return;context.setTransform(2,0,0,2,44,68);const original=this.ctx;this.ctx=context;this.person({id,u:0,v:0,phase:0,walking:false,package:false});this.ctx=original;}
  label(text,x,y,active){const c=this.ctx,s=this.scale;c.font=`500 ${Math.max(11,10/s)}px system-ui`;const tw=c.measureText(text).width;const height=20/s;c.fillStyle=active?'#294c40':'#fffff4ed';c.beginPath();c.roundRect(x-tw/2-6/s,y-height/2,tw+12/s,height,4/s);c.fill();c.fillStyle=active?'#fff9e9':'#596b58';c.textAlign='center';c.textBaseline='middle';c.fillText(text,x,y+.5);}
}
