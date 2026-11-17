// Scenario inventory, not runtime instrumentation or measured hardware usage.
export const roleTypes={tri:'editorial',red:'editorial',rel:'quality',plan:'coordination',rech:'research',design:'design',code:'engineering',test:'quality',lecture:'tool',export:'tool',art:'design',arch:'coordination',data:'engineering',perf:'engineering',ops:'delivery',security:'quality',eval:'quality'};
const inventories={
  calque:[['file'],['pdf'],['pdf','ocr'],['word','validation'],['comparison']],
  coachos:[['docs'],['design','test'],['react','storage'],['test','browser'],['build']],
  eclipse:[['docs'],['code','profiling'],['docs'],['blender','three','test'],['blender','three','build'],['browser','profiling'],['code','blender','test','profiling'],['devices'],['build','test']],
  documentaire:[['docs'],['index','test','profiling'],['access'],['pdf','ocr','storage'],['index','model','storage'],['index','model'],['test','access','profiling'],['index','code','test'],['docs'],['monitoring','test']]
};
export function resourceProfile(g,index,{input='mixed',actors=null}={}){
  const step=g.steps[Math.min(index,g.steps.length-1)],ids=actors??step.actors;
  let tools=inventories[g.id]?.[Math.min(index,g.steps.length-1)]??['model'];
  if(g.id==='calque'&&index===2&&input==='text')tools=['pdf'];
  const hardware=new Set();
  if(g.level>=2){hardware.add('cpu');hardware.add('memory');}
  if(g.id==='eclipse'&&tools.some(x=>['blender','three','profiling','devices'].includes(x)))hardware.add('gpu');
  const quantities=g.id==='calque'&&index===2?{pages:12,ocrPages:input==='text'?0:input==='scan'?12:8,textPages:input==='text'?12:input==='scan'?0:4}:null;
  const calls={publication:[1,1,1],reponse:[1,1,1],reunion:[1,2,1,2],comparatif:[1,0,2,1]};
  const modelRequests=g.id==='calque'?0:calls[g.id]?.[Math.min(index,g.steps.length-1)]??null;
  return {modelRequests,agents:ids.filter(id=>roleTypes[id]!=='tool').length,toolRoles:ids.filter(id=>roleTypes[id]==='tool').length,tools:[...new Set(tools)],hardware:[...hardware],workSeconds:step.effort,quantities,human:!!step.human};
}
