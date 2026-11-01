/* Canvas art authored for Abóbora V3. All geometry, texture and lettering is original.
   Backgrounds are prerendered once per world and reused with scrolling parallax. */
(function(){'use strict';const G=window.ABO;
const color=(c,a)=>c;const PI=Math.PI;
function line(ctx,x1,y1,x2,y2,c,w=1){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
function ellipse(ctx,x,y,rx,ry,fill,rotation=0){ctx.fillStyle=fill;ctx.beginPath();ctx.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),rotation,0,Math.PI*2);ctx.fill();}
function path(ctx,points,fill,stroke=null,w=1){ctx.beginPath();ctx.moveTo(...points[0]);points.slice(1).forEach(p=>ctx.lineTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.lineWidth=w;ctx.strokeStyle=stroke;ctx.stroke();}}
function rr(rng,a,b){return a+(b-a)*rng();}
function branch(ctx,x,y,len,ang,w,depth,rng,shade){if(depth<=0||len<9)return;
 const xx=x+Math.cos(ang)*len,yy=y+Math.sin(ang)*len;
 ctx.strokeStyle=shade;ctx.lineCap='round';ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+Math.cos(ang-.23)*len*.45,y+Math.sin(ang-.23)*len*.45,xx,yy);ctx.stroke();
 if(depth>1){branch(ctx,xx,yy,len*.76,ang-.4-rr(rng,0,.26),w*.67,depth-1,rng,shade);branch(ctx,xx,yy,len*.72,ang+.4+rr(rng,0,.25),w*.64,depth-1,rng,shade);}
}
function tree(ctx,x,y,size,world,rng,front=false){let wi=world,scale=size;ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
 // root and trunk, with bark gradients and curling roots
 let g=ctx.createLinearGradient(-75,0,85,0);g.addColorStop(0,'#241b2e');g.addColorStop(.35,front?'#4e3345':'#3e2c42');g.addColorStop(.75,front?'#71505e':'#58415c');g.addColorStop(1,'#211b2e');
 ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-36,10);ctx.bezierCurveTo(-30,-86,-42,-174,-49,-251);ctx.bezierCurveTo(-39,-288,-22,-285,-15,-257);ctx.bezierCurveTo(-10,-213,2,-175,6,-143);ctx.bezierCurveTo(22,-215,38,-253,55,-256);ctx.bezierCurveTo(70,-254,61,-221,45,-179);ctx.bezierCurveTo(32,-135,25,-68,35,9);ctx.lineTo(3,-4);ctx.lineTo(-22,16);ctx.closePath();ctx.fill();
 ctx.strokeStyle='#241b2a';ctx.lineWidth=13;ctx.lineCap='round';for(let i=0;i<5;i++){let sx=(i-2)*10;ctx.beginPath();ctx.moveTo(sx,2);ctx.quadraticCurveTo(sx*3,16,sx*5+Math.sin(i)*17,25);ctx.stroke();}
 for(let i=0;i<11;i++){let ox=rr(rng,-33,31),sy=rr(rng,-210,-10);line(ctx,ox,sy,ox+rr(rng,-4,4),sy+rr(rng,18,65),i%2?'#241e30a0':'#9c687159',rr(rng,1,2.5));}
 let tw=wi===4?40:75;
 branch(ctx,-25,-183,tw,-2.8,15,4,rng,'#2a2031');branch(ctx,24,-200,tw,-.4,17,4,rng,'#2b2133');branch(ctx,-10,-250,tw,-1.72,10,3,rng,'#33263a');
 // luminous sinister face; no eyes on distant trees.
 if(front){
  ellipse(ctx,-21,-125,13,17,'#221b2e');ellipse(ctx,23,-125,13,17,'#221b2e');
  ctx.save();ctx.shadowColor=wi===3?'#ccf97b':'#f2bb75';ctx.shadowBlur=16;ellipse(ctx,-19,-124,3,5,wi===3?'#e5f5b2':'#ffa765');ellipse(ctx,21,-124,3,5,wi===3?'#e5f5b2':'#ffa765');ctx.restore();
  ctx.strokeStyle='#1e192c';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(-23,-62);ctx.quadraticCurveTo(0,-74,24,-58);ctx.stroke();line(ctx,0,-60,3,-47,'#1e192c',4);
 }
 if(wi!==4){ // lush crown of hand-drawn, layered overlapping leaves
   for(let j=0;j<75;j++){let theta=rr(rng,0,PI*2),rad=Math.sqrt(rng()),lx=Math.cos(theta)*rad*139,ly=-264+Math.sin(theta)*rad*64;ellipse(ctx,lx,ly,rr(rng,14,37),rr(rng,6,20),j%5===0?world.leaf:world.foliage,rr(rng,-.8,.8));}
   for(let j=0;j<82;j++){let theta=rr(rng,0,PI*2),rad=Math.sqrt(rng()),lx=Math.cos(theta)*rad*146,ly=-259+Math.sin(theta)*rad*70;ellipse(ctx,lx,ly,rr(rng,5,14),rr(rng,3,8),j%3===0?'#8a8aa955':world.leaf,rr(rng,-1,1));}
 }
 ctx.restore();}
function house(ctx,x,baseline,scale,wi,rng){ctx.save();ctx.translate(x,baseline);ctx.scale(scale,scale);ctx.fillStyle=wi===5?'#282234':'#28233d';ctx.fillRect(-63,-144,128,144);
 path(ctx,[[-87,-138],[-49,-186],[-10,-143],[28,-213],[76,-141],[76,-135]],'#332842','#241a31',2);
 if(rng()>.35){ctx.fillStyle='#2b2337';ctx.fillRect(-45,-211,28,80);path(ctx,[[-57,-210],[-31,-250],[-4,-210]],'#392842');}
 for(let i=0;i<4;i++){let xx=-43+(i%2)*68,yy=-115+Math.floor(i/2)*52;ctx.fillStyle='#bda16a';ctx.fillRect(xx,yy,20,32);ctx.fillStyle='#ffe7a6';ctx.shadowColor='#ffe08c';ctx.shadowBlur=12;ctx.fillRect(xx+4,yy+4,12,23);ctx.shadowBlur=0;line(ctx,xx+10,yy,xx+10,yy+32,'#574051',3);line(ctx,xx,yy+16,xx+20,yy+16,'#574051',2);}
 ctx.restore();}
function mausoleum(ctx,x,y,rng){ctx.save();ctx.translate(x,y);ctx.fillStyle='#332b4a';ctx.fillRect(-40,-100,82,100);path(ctx,[[-50,-95],[0,-146],[52,-95]],'#54425f','#271d36',4);ctx.fillStyle='#1c1934';ctx.fillRect(-17,-65,36,65);ellipse(ctx,1,-64,18,17,'#1c1934');line(ctx,-45,0,48,0,'#75627e',7);ctx.restore();}
function hill(ctx,width,y,amp,color,rand,detail=0){ctx.beginPath();ctx.moveTo(0,540);ctx.lineTo(0,y);for(let x=0;x<=width;x+=45)ctx.lineTo(x,y+Math.sin(x*.0043+detail)*amp+Math.cos(x*.011+detail)*amp*.5);ctx.lineTo(width,540);ctx.closePath();ctx.fillStyle=color;ctx.fill();}
function makeLayer(wi,type){const world=G.worlds[wi],rng=G.rng(wi*619+127+type*1341),cv=document.createElement('canvas');cv.width=1920;cv.height=540;let ctx=cv.getContext('2d'),W=1920;
 if(type===0){
  let gradient=ctx.createLinearGradient(0,0,0,540);world.sky.forEach((c,i)=>gradient.addColorStop(i/2,c));ctx.fillStyle=gradient;ctx.fillRect(0,0,W,540);
  for(let i=0;i<215;i++){let x=rng()*W,y=rng()*330,r=rr(rng,.4,2);ellipse(ctx,x,y,r,r,rng()>.92?'#ffe4b8b0':'#e9b5d786');}
  ctx.save();ctx.shadowColor=world.glow;ctx.shadowBlur=45;ellipse(ctx,1460,104,65,65,world.glow);ctx.restore();ellipse(ctx,1460,104,69,69,'#fff1c4a3');for(let i=0;i<8;i++)ellipse(ctx,1430+rng()*68,75+rng()*63,3+rng()*9,5+rng()*8,'#d8bcaaa0');
  hill(ctx,W,355,35,world.far,rng,wi);
  hill(ctx,W,393,24,world.mid,rng,wi+1.2);
  for(let i=0;i<22;i++){let x=i*103+rng()*32,y=386+rng()*45;
    if(wi===1||wi===2||wi===5){if(i%3===0)house(ctx,x,y+10,.5+rng()*.4,wi,rng);else {ctx.fillStyle='#352b4b';ctx.fillRect(x-12,y-75,22,70);path(ctx,[[x-22,y-70],[x,y-100],[x+20,y-70]],'#37294b');}}
    else if(wi===4){path(ctx,[[x-31,y],[x-19,y-122],[x+4,y-163],[x+29,y-100],[x+42,y]],'#332b3d');}
    else{ctx.strokeStyle='#252538';ctx.lineWidth=5;branch(ctx,x,y,37,-PI/2,5,3,rng,'#2b2738');}
  }
  // drifting soft mist bands baked into distant layer
  for(let i=0;i<25;i++)ellipse(ctx,rng()*W,360+rng()*115,rr(rng,70,195),rr(rng,8,27),'#edbcf00c');
 }else if(type===1){
  hill(ctx,W,441,17,wi===3?'#2b4144':'#30283d',rng,2);
  for(let i=0;i<17;i++){let x=i*120+rr(rng,-30,40);
   if(wi===1||wi===5){house(ctx,x,462,rr(rng,.62,1.18),wi,rng);}
   else if(wi===2){i%3===0?mausoleum(ctx,x,458,rng):tree(ctx,x,490,rr(rng,.55,.85),world,rng,false);}
   else if(wi===4){mausoleum(ctx,x,474,rng);}
   else tree(ctx,x,495,rr(rng,.56,.96),world,rng,false);
  }
  for(let i=0;i<70;i++){let x=rng()*W,y=435+rng()*85;ellipse(ctx,x,y,rr(rng,20,62),rr(rng,10,19),'#2e253955');}
 }else{
  for(let i=0;i<11;i++){
   let x=85+i*180+rr(rng,-45,45),size=rr(rng,.7,1.3);
   if(wi===1||wi===5){if(i%3===0)tree(ctx,x,500,size,world,rng,true);else house(ctx,x,490,size,wi,rng);}else if(wi===4){i%3===0?tree(ctx,x,509,size,world,rng,true):mausoleum(ctx,x,508,rng);}
   else tree(ctx,x,500,size,world,rng,true);
  }
  if(wi===2){for(let i=0;i<28;i++){let x=i*75+rng()*20;ctx.fillStyle='#363149';ctx.fillRect(x,466-rng()*25,6,48);line(ctx,x-6,470,x+9,470,'#50445b',3);}}
 }
 // Architecture unique to the underground world and the final castle.
 if(wi===4){
   if(type===0){
     ctx.fillStyle='#171521';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(1920,0);for(let x=1920;x>=0;x-=38){ctx.lineTo(x,50+rr(rng,8,60));if(rng()<.4){ctx.lineTo(x-12,145+rr(rng,0,65));ctx.lineTo(x-25,46);}}ctx.closePath();ctx.fill();
     for(let i=0;i<24;i++){let x=i*84+rr(rng,-30,30),y=100+rr(rng,0,120);ctx.save();ctx.shadowBlur=12;ctx.shadowColor='#96b8c4';path(ctx,[[x,y-25],[x+14,y],[x,y+13],[x-10,y]],i%3?'#536d83':'#7c749a');ctx.restore();}
   }else if(type===1){
     for(let x=-70;x<2000;x+=280){ctx.strokeStyle='#2b2537';ctx.lineWidth=29;ctx.beginPath();ctx.arc(x+134,487,119,PI,2*PI);ctx.stroke();ctx.fillStyle='#3c3446';ctx.fillRect(x-2,296,32,220);ctx.fillRect(x+238,296,32,220);}
     for(let i=0;i<18;i++){let x=i*114+rr(rng,-10,10);line(ctx,x,158,x,280+rr(rng,0,110),'#4b3d52',3);ellipse(ctx,x,273,6,15,'#a77b73');}
   }else{
     for(let x=-30;x<1920;x+=310){ctx.fillStyle='#312b39';ctx.fillRect(x,192,36,355);ctx.fillStyle='#534353';ctx.fillRect(x+7,211,8,320);ctx.strokeStyle='#574354';ctx.lineWidth=6;ctx.beginPath();ctx.arc(x+156,270,150,PI,2*PI);ctx.stroke();}
   }
 }
 if(wi===5){
   if(type===0){for(let i=0;i<9;i++){let x=i*245+40;ctx.fillStyle='#291d35';ctx.fillRect(x,160,65,320);path(ctx,[[x-28,164],[x+32,73],[x+95,164]],'#2a1d33');ctx.fillStyle='#e4a77c';ctx.shadowColor='#eab57b';ctx.shadowBlur=12;ctx.fillRect(x+24,190,16,44);ctx.shadowBlur=0;}}
   else if(type===1){for(let i=0;i<7;i++){let x=i*327+40;ctx.fillStyle='#3a2a41';ctx.fillRect(x-32,196,130,290);path(ctx,[[x-55,200],[x+32,103],[x+125,200]],'#3b2a40');for(let k=0;k<3;k++){ctx.fillStyle='#e5ad7d';ctx.fillRect(x-7+k*26,267,15,44);}}}
 }
 return cv;
}
const cache={};
const Art={
 world(wi){if(!cache[wi])cache[wi]=[makeLayer(wi,0),makeLayer(wi,1),makeLayer(wi,2)];return cache[wi];},
 bg(ctx,wi,camera,time,settings){const layers=this.world(wi);for(let i=0;i<3;i++){let speed=[.08,.22,.42][i],off=((camera*speed)%1920+1920)%1920;ctx.drawImage(layers[i],-off,0);ctx.drawImage(layers[i],1920-off,0);}
  // soft light shafts and gliding mist over background
  if(settings.light&&settings.quality!=='low'){ctx.save();ctx.globalAlpha=.12;ctx.fillStyle='#ebc8f1';for(let j=0;j<5;j++){let x=((j*360+time*7-camera*.28)%1920+1920)%1920;path(ctx,[[x,180],[x+75,180],[x+145,455],[x-65,455]],'#e2b6f1');}ctx.restore();}
 },
 pumpkin(ctx,x,y,scale=1,time=0,state='idle',facing=1,energy=100){ctx.save();ctx.translate(x,y);ctx.scale(facing*scale,scale);let run=state==='run'?Math.sin(time*17):0,jump=state==='jump',fall=state==='fall';ctx.translate(0,(state==='idle'?Math.sin(time*3)*1.5:run*1.7));let squash=state==='jump'?-0.10:state==='fall'?.08:0;ctx.scale(1+squash,1-squash);
  // small feet, cape and arms
  ctx.fillStyle='#4e3a66';ellipse(ctx,-10,20+Math.abs(run)*2,9,5,'#352a49');ellipse(ctx,11,20+Math.abs(run)*2,9,5,'#352a49');
  path(ctx,[[-16,-3],[-29,8+run*5],[-18,7],[3,4]],'#72405b');
  let stem=ctx.createLinearGradient(-3,-27,8,-11);stem.addColorStop(0,'#b1dc6c');stem.addColorStop(1,'#356d49');
  path(ctx,[[-6,-16],[-6,-25],[-1,-29],[8,-27],[6,-20],[2,-17]],stem,'#254736',1.5);
  let g=ctx.createRadialGradient(-9,-9,2,0,2,28);g.addColorStop(0,'#ffe8a0');g.addColorStop(.22,'#ffc064');g.addColorStop(.62,'#fb863a');g.addColorStop(1,'#bd4b37');ellipse(ctx,0,2,22,21,g);
  ctx.strokeStyle='#b95435';ctx.lineWidth=1.7;for(let j of [-13,-6,6,13]){ctx.beginPath();ctx.moveTo(j,-17);ctx.bezierCurveTo(j*1.45,-8,j*1.35,12,j,21);ctx.stroke();}
  ellipse(ctx,-8,-1,4.2,5.5,'#2e2239');ellipse(ctx,9,-1,4.2,5.5,'#2e2239');ellipse(ctx,-9,-3,1.4,1.7,'#fff8d4');ellipse(ctx,8,-3,1.4,1.7,'#fff8d4');ellipse(ctx,-15,8,4,2.6,'#f36b62cc');ellipse(ctx,16,8,4,2.6,'#f36b62cc');
  ctx.fillStyle='#3b2437';ctx.beginPath();ctx.moveTo(-6,8);ctx.quadraticCurveTo(0,13,7,8);ctx.quadraticCurveTo(5,19,0,16);ctx.quadraticCurveTo(-6,18,-6,8);ctx.fill();path(ctx,[[-3,9],[1,9],[-1,14]],'#fff0c4');path(ctx,[[3,9],[6,9],[5,13]],'#fff0c4');
  if(state==='attack'){line(ctx,13,-3,38,-24,'#ffe4ac',5);ctx.strokeStyle='#fff7c9';ctx.lineWidth=6;ctx.beginPath();ctx.arc(14,-3,29,-1.4,.45);ctx.stroke();}
  if(energy>1 && state==='flame'){ctx.shadowBlur=19;ctx.shadowColor='#ffd787';ellipse(ctx,0,2,17,17,'#fcb65033');}
  ctx.restore();},
 enemy(ctx,e,time,wi){ctx.save();ctx.translate(e.x+e.w/2,e.y+e.h/2);let t=time*2+e.t;if(e.stun>0)ctx.globalAlpha=.55;if(e.type==='bat'){
   let flap=Math.sin(t*4)*10;path(ctx,[[-6,0],[-30,-14-flap],[-26,4],[-11,9],[0,1]],'#42335b','#20192c',2);path(ctx,[[6,0],[30,-14-flap],[26,4],[11,9],[0,1]],'#49375e','#20192c',2);ellipse(ctx,0,0,10,12,'#34263c');ellipse(ctx,-4,-2,2,3,'#e9a566');ellipse(ctx,5,-2,2,3,'#e9a566');
  }else if(e.type==='ghost'){ctx.save();ctx.shadowBlur=19;ctx.shadowColor='#aeeff4';path(ctx,[[-15,-15],[-9,-29],[3,-34],[15,-20],[15,18],[8,13],[0,23],[-10,15],[-17,19]],'#b8e7dccc');ctx.restore();ellipse(ctx,-5,-8,3,6,'#3c3759');ellipse(ctx,6,-8,3,6,'#3c3759');}
  else if(e.type==='skeleton'||e.type==='bone'){ellipse(ctx,0,-13,13,13,'#ded3b6','#a39c94');path(ctx,[[-12,-4],[-12,10],[-5,13],[8,13],[12,-4]],'#bfc0ad');ellipse(ctx,-5,-15,4,5,'#3d2a3d');ellipse(ctx,6,-15,4,5,'#3d2a3d');line(ctx,-8,14,-13,27,'#d6cfbd',5);line(ctx,8,14,13,27,'#d6cfbd',5);}
  else if(e.type==='frog'){ellipse(ctx,0,7,21,14,'#528566');ellipse(ctx,-11,-4,10,11,'#78ab78');ellipse(ctx,12,-4,10,11,'#78ab78');ellipse(ctx,-11,-5,4,5,'#f2daae');ellipse(ctx,12,-5,4,5,'#f2daae');}
  else{path(ctx,[[-13,13],[-9,-22],[10,-24],[14,13]],e.type==='knight'?'#566077':'#806276','#322840',2);ellipse(ctx,0,-22,11,11,e.type==='knight'?'#9996ad':'#b0ad88');path(ctx,[[-15,-26],[-20,-30],[0,-35],[20,-30],[15,-26]],'#482e41');ellipse(ctx,-5,-21,3,3,'#ffcc7a');ellipse(ctx,6,-21,3,3,'#ffcc7a');line(ctx,-11,15,-12,27,'#30263c',5);line(ctx,11,15,12,27,'#30263c',5);}
  ctx.restore();},
 boss(ctx,b,wi,t){ctx.save();ctx.translate(b.x+b.w/2,b.y+b.h/2);let pulse=Math.sin(t*4);ctx.save();ctx.shadowColor=['#ffad76','#ffe0a0','#c1f8ed','#baf28e','#eeb1a1','#ff9fd0'][wi];ctx.shadowBlur=30+10*pulse;ellipse(ctx,0,-17,65,70,'#2e2136');ctx.restore();
  if(wi===0){for(let j=-2;j<=2;j++)branch(ctx,j*9,30,65,-PI/2+j*.17,9,3,G.rng(j*35+98),'#533449');}
  ellipse(ctx,0,-17,48+3*pulse,52+2*pulse,['#70415a','#6c5a76','#625177','#556e65','#5e5264','#65445b'][wi]);
  if(wi===1){ // Sineiro: huge bronze bell for a body
   path(ctx,[[-46,-2],[-37,-52],[-23,-65],[25,-65],[37,-52],[46,-2]],'#9e7869','#362839',6);
   ellipse(ctx,0,0,50,10,'#dfb478');ellipse(ctx,0,19,11,13,'#46263c');
  }else if(wi===2){ // Veil of the cemetery widow
   path(ctx,[[-48,-54],[-29,-91],[18,-89],[50,-52],[58,21],[27,58],[-31,55],[-55,21]],'#b29ab633','#e3c7f2',4);
   for(let j=0;j<6;j++)line(ctx,-44+j*16,-70,-61+j*19,46,'#a38bac88',1.5);
  }else if(wi===3){ // Swamp beast has vine tentacles and luminous warts
   for(let j=0;j<7;j++){let x=-46+j*15;ctx.strokeStyle='#3c675a';ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(x,16);ctx.quadraticCurveTo(x+14*(j%2?1:-1),55,x+4,79);ctx.stroke();ellipse(ctx,x,-60,6,5,'#cbeb94');}
  }else if(wi===4){ // Stone guardian with slabs and fractured horns
   path(ctx,[[-42,-44],[-54,-78],[-20,-64],[0,-88],[25,-64],[50,-78],[42,-43]],'#746c7b','#342c3e',5);
   for(let j=-2;j<3;j++)line(ctx,j*18,-50,j*10,38,'#d9b39c66',3);
  }else if(wi===5){ // Last bell king
   path(ctx,[[-47,-55],[-50,-101],[-23,-82],[-7,-115],[9,-86],[30,-108],[47,-54]],'#d6a66e','#36263a',6);
   for(let j=-1;j<=1;j++)ellipse(ctx,j*27,-82-(j===0?18:0),6,8,'#f9b9d4');
  }
  path(ctx,[[-46,-23],[-29,-57],[0,-71],[33,-56],[50,-23]],'#251b38');
  ellipse(ctx,-17,-26,12,14,'#2a192f');ellipse(ctx,19,-26,12,14,'#2a192f');
  ellipse(ctx,-17,-25,5,7,'#ffc37c');ellipse(ctx,19,-25,5,7,'#ffc37c');
  ctx.strokeStyle='#2c1d2e';ctx.lineWidth=9;ctx.beginPath();ctx.arc(0,1,25,.2,PI-.2);ctx.stroke();
  for(let i=0;i<6;i++)line(ctx,-20+i*8,20,-20+i*8,11,'#f2d5ae',3);
  ctx.restore();}
};
G.Art=Art;
})();
