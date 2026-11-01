/* Fases: 36 capítulos a partir de trechos de desafios curados. Cada trecho introduz um ritmo,
   plataformas, perigos e oportunidades próprias. Variações procedurais apenas em decoração. */
(function(){'use strict';const G=window.ABO;
const Y=G.FLOOR;
const patterns=[
 ['meadow','hops','mushrooms','arch','bridges','vertical','runway'],
 ['meadow','bridges','hops','spectral','arch','vertical','runway'],
 ['meadow','vertical','mushrooms','bridges','spectral','hops','runway'],
 ['meadow','arch','vertical','runway','bridges','spectral','hops'],
 ['meadow','mushrooms','bridges','arch','spectral','vertical','runway'],
 ['meadow','hops','vertical','arch','bridges','spectral','runway']
];
function stage(index){
 const wi=(index/6)|0,si=index%6,world=G.worlds[wi],rand=G.rng(99731+index*7417),boss=si===5;
 const width=(boss?5700:6200)+wi*180+si*120;
 const lv={index,wi,si,world,width,boss,ground:[],platforms:[],hazards:[],souls:[],coins:[],lamps:[],enemies:[],decor:[],doors:[],checkpoint:[],particles:[],bossEntity:null,gate:{x:width-190,y:Y-110,w:71,h:110},time:0,weather:rand()*9};
 const addGround=(x,w)=>{if(w>1)lv.ground.push({x,y:Y,w,h:230,kind:'ground'});};
 const addPlat=(x,y,w,kind='wood',extra={})=>lv.platforms.push({x,y,w,h:17,kind,...extra});
 const coin=(x,y,kind='candy')=>lv.coins.push({x,y,kind,got:false,t:rand()*9});
 const foe=(x,type=world.enemy)=>lv.enemies.push({x,y:Y-44,w:34,h:44,type,base:x,dir:rand()<.5?1:-1,min:x-88,max:x+100,hp: type==='ghost'?2:2,alive:true,stun:0,t:rand()*7,attack:rand()*2,vy:0});
 const torch=(x)=>lv.lamps.push({x,y:Y-83,lit:false});
 const pit=(x,w)=>{let end=x+w;for(let k=lv.ground.length-1;k>=0;k--){let g=lv.ground[k],a=g.x,b=g.x+g.w;if(a>=end||b<=x)continue;lv.ground.splice(k,1);addGround(a,Math.max(0,x-a));addGround(end,Math.max(0,b-end));}};
 // safe starting stretch
 addGround(0,width);lv.checkpoint.push({x:110,y:Y,active:true});
 for(let seg=0;seg<7;seg++){
  let sx=220+seg*800;const variant=patterns[si][(seg+Math.floor(wi/2))%7];
  // never spawn invisible jumps before introducing the torch mechanic
  let kind=seg===0?'meadow':variant;
  if(kind==='meadow'){
   addPlat(sx+310,Y-90,160,'moss');addPlat(sx+500,Y-142,128,'wood');coin(sx+382,Y-116);coin(sx+550,Y-167);
   if(seg>1)foe(sx+255,seg%3===0?'bat':world.enemy);
  }else if(kind==='hops'){
   pit(sx+320,105);addPlat(sx+240,Y-85,118,'moss');addPlat(sx+455,Y-106,125,'wood');
   coin(sx+370,Y-126);foe(sx+640,seg%2?'bat':world.enemy);
  }else if(kind==='bridges'){
   pit(sx+325,135);addPlat(sx+300,Y-74,155,'moving',{baseX:sx+300,range:92,speed:.75+wi*.08,phase:seg});
   addPlat(sx+495,Y-142,155,'wood');coin(sx+370,Y-136);coin(sx+555,Y-176);
  }else if(kind==='spectral'){
   pit(sx+310,128);addPlat(sx+300,Y-50,174,'spectral');addPlat(sx+520,Y-120,150,'moss');
   coin(sx+385,Y-85,'flame');coin(sx+592,Y-160);lv.decor.push({type:'reveal',x:sx+300,y:Y-115});
  }else if(kind==='mushrooms'){
   addPlat(sx+235,Y-105,112,'mushroom');addPlat(sx+395,Y-162,112,'mushroom');addPlat(sx+554,Y-114,142,'moss');
   coin(sx+290,Y-140);coin(sx+450,Y-197);foe(sx+660,world.enemy);
  }else if(kind==='vertical'){
   addPlat(sx+236,Y-80,150,'wood');addPlat(sx+433,Y-154,144,'wood');addPlat(sx+594,Y-94,140,'moss');
   coin(sx+310,Y-113);coin(sx+510,Y-189,'flame');foe(sx+616,'bat');
  }else if(kind==='arch'){
   addPlat(sx+290,Y-94,130,'mystery',{used:false});addPlat(sx+470,Y-140,158,'moss');
   coin(sx+355,Y-124);coin(sx+535,Y-174);foe(sx+655,'scarecrow');
  }else if(kind==='runway'){
   for(let k=0;k<3;k++)addPlat(sx+180+k*172,Y-70-k*30,115,'wood');
   coin(sx+285,Y-122);coin(sx+515,Y-164);foe(sx+570,world.enemy);
  }
  if(seg===2||seg===4)lv.checkpoint.push({x:sx+710,y:Y,active:false});
  if(seg===1||seg===3||seg===5)lv.souls.push({x:sx+585,y:Y-88,t:rand()*9,got:false});
  if(seg%2===0){torch(sx+95);coin(sx+165,Y-47);}
  // Obstáculos legíveis: espinhos sempre em terreno firme, nunca dentro de um fosso.
  if(seg>1&&(kind==='arch'||kind==='vertical'||(wi>=3&&kind==='meadow'))){
    const hx=sx+715; if(lv.ground.some(g=>hx>g.x+15&&hx+39<g.x+g.w-15))lv.hazards.push({x:hx,y:Y-20,w:39,h:20,kind:wi===3?'acid':'spikes'});
  }
  if(seg===4){lv.decor.push({type:'secret',x:sx+155,y:Y-120});coin(sx+155,Y-172,'heart');}
  for(let j=0;j<9;j++){let dx=sx+j*83+rand()*40;lv.decor.push({type:['fern','stone','pumpkin','flower','fern','skull'][Math.floor(rand()*6)],x:dx,y:Y,scale:.7+rand()*.55});}
 }
 for(let x=650;x<width-380;x+=950){if(rand()<.6)lv.decor.push({type:'sign',x,y:Y});}
 // boss arena always guarantees solid footing, safe place to learn the attack pattern.
 if(boss){const arena=width-1240;
  lv.ground=lv.ground.flatMap(g=>{if(g.x>=arena)return [];if(g.x+g.w>arena)return [{...g,w:arena-g.x}];return [g];});
  addGround(arena,1240);lv.platforms=lv.platforms.filter(p=>p.x<width-1380);
  lv.hazards=lv.hazards.filter(h=>h.x<arena);
 lv.enemies=lv.enemies.filter(e=>e.x<width-1390);lv.bossEntity={x:width-740,y:Y-125,w:118,h:125,hp:10+wi*3,maxHp:10+wi*3,alive:true,stun:0,phase:0,attack:0,mode:0,type:'boss',base:width-740};
 addPlat(width-1070,Y-140,165,'moss');addPlat(width-525,Y-160,140,'wood');torch(width-1040);lv.checkpoint.push({x:width-1170,y:Y,active:false});
 }
 lv.souls=lv.souls.slice(0,3);
 lv.enemies=lv.enemies.filter(e=>e.x<width-330);
 return lv;
}
G.makeLevel=stage;
})();
