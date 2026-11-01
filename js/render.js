(function(){'use strict';const G=window.ABO,A=G.Art;
const PI=Math.PI;
function ellipse(c,x,y,rx,ry,fill){c.fillStyle=fill;c.beginPath();c.ellipse(x,y,Math.max(1,rx),Math.max(1,ry),0,0,2*PI);c.fill();}
function line(c,x,y,X,Y,col,w=1){c.beginPath();c.moveTo(x,y);c.lineTo(X,Y);c.strokeStyle=col;c.lineWidth=w;c.stroke();}
function glow(c,x,y,r,col){let gr=c.createRadialGradient(x,y,1,x,y,r);gr.addColorStop(0,col);gr.addColorStop(1,'#fff0');c.fillStyle=gr;c.fillRect(x-r,y-r,r*2,r*2);}
class Renderer{
 constructor(canvas){this.cv=canvas;this.c=canvas.getContext('2d',{alpha:false});this.c.imageSmoothingEnabled=true;}
 menu(t){let c=this.c;c.clearRect(0,0,960,540);A.bg(c,0,t*20,t,G.settingsDefault);this.vignette(c,.38);for(let i=0;i<46;i++){let x=(G.hash(i*7)*960+t*(i%4+1)*3)%960,y=G.hash(i*19)*480;ellipse(c,x,y,1.2+G.hash(i+3)*2,1.2,'#ffdb9a88');} }
 terrain(c,g,world,t){const x=g.x,y=g.y,w=g.w;
  const dirt=c.createLinearGradient(0,y,0,540);dirt.addColorStop(0,world.soil);dirt.addColorStop(1,'#1f1b2e');c.fillStyle=dirt;c.fillRect(x,y,w,540-y);c.fillStyle='#241c31';c.fillRect(x,y+16,w,7);
  for(let k=Math.floor(x/24)*24;k<x+w;k+=24){let rx=k+G.hash(k+21)*13,ty=y+28+(Math.floor(k/24)%3)*16;if(rx>x+2&&rx<x+w-3){ellipse(c,rx,ty+G.hash(k)*52,2+G.hash(k+5)*4,1+G.hash(k+3)*3,'#bf79755c');line(c,rx+10,ty+35,rx+25,ty+31,'#94718360',2);}}
  let grad=c.createLinearGradient(0,y-9,0,y+12);grad.addColorStop(0,world.grass);grad.addColorStop(1,'#365e4a');c.fillStyle=grad;c.fillRect(x,y-7,w,18);c.fillStyle='#a5cf7c';c.fillRect(x,y-8,w,4);
  for(let bx=x+3;bx<x+w-1;bx+=9){let h=4+G.hash(bx)*7;line(c,bx,y-8,bx+G.hash(bx+19)*4-2,y-8-h,world.grass,2);}
 }
 platform(c,p,world,t,lit){if(p.kind==='spectral'&&!lit){c.save();c.globalAlpha=.13;}else c.save();
  let x=p.x,y=p.y,w=p.w,h=p.h;
  if(p.kind==='moving'){x=p.x;}
  c.shadowBlur=p.kind==='spectral'?15:0;c.shadowColor='#aafcff';
  let grad=c.createLinearGradient(0,y,0,y+25);if(p.kind==='spectral'){grad.addColorStop(0,'#b9ffee');grad.addColorStop(1,'#657ea6');}else if(p.kind==='mystery'){grad.addColorStop(0,p.used?'#a89380':'#ffd56b');grad.addColorStop(1,p.used?'#69536a':'#a85f56');}else if(p.kind==='mushroom'){grad.addColorStop(0,'#de9db9');grad.addColorStop(1,'#744e75');}else{grad.addColorStop(0,world.grass);grad.addColorStop(1,'#3c4f5b');}
  c.fillStyle='#251d36';c.fillRect(x-3,y-3,w+6,24);c.fillStyle=grad;c.fillRect(x,y,w,17);c.fillStyle='#fee4a888';c.fillRect(x+3,y+2,w-6,3);
  c.fillStyle='#544058';for(let i=x+8;i<x+w;i+=32)c.fillRect(i,y+14,14,5);
  if(p.kind==='mystery'&&!p.used){c.textAlign='center';c.font='bold 26px Georgia';c.fillStyle='#6a3b48';c.fillText('?',x+w/2,y+24);c.font='bold 25px Georgia';c.fillStyle='#fff0b1';c.fillText('?',x+w/2,y+23);}
  if(p.kind==='spectral'){c.globalAlpha=.18;glow(c,x+w/2,y,w*.75,'#8bf7e0aa');}
  c.restore();}
 decor(c,d,wi,t){const x=d.x,y=d.y;if(d.type==='fern'){c.strokeStyle='#4b695e';c.lineWidth=2;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+9,y-22,x+7,y-43);c.stroke();for(let j=0;j<7;j++){let yy=y-5-j*5;ellipse(c,x+7-j,yy,12-j*.55,3.4,wi===3?'#507f68':'#627b66');}}
  else if(d.type==='flower'){line(c,x,y,x,y-19,'#78976e',2);ellipse(c,x,y-20,5,5,'#fbd7a0');ellipse(c,x-5,y-21,3,4,'#db9abc');ellipse(c,x+4,y-21,3,4,'#db9abc');}
  else if(d.type==='pumpkin'){ellipse(c,x,y-13,17,15,'#d96f37');ellipse(c,x-7,y-13,7,14,'#fa8a42');ellipse(c,x+7,y-13,7,14,'#fa8a42');line(c,x,y-28,x+3,y-33,'#82ad66',4);ellipse(c,x-5,y-16,2,3,'#41263d');ellipse(c,x+6,y-16,2,3,'#41263d');}
  else if(d.type==='stone'){ellipse(c,x,y-9,22,13,'#636078');ellipse(c,x-6,y-13,12,6,'#9290a1');}
  else if(d.type==='skull'){ellipse(c,x,y-12,12,13,'#b8aca1');ellipse(c,x-4,y-14,3,4,'#3c2b41');ellipse(c,x+5,y-14,3,4,'#3c2b41');}
  else if(d.type==='sign'){line(c,x,y,x,y-72,'#4c343e',7);c.fillStyle='#977654';c.fillRect(x-30,y-75,74,29);c.fillStyle='#f7d9a3';c.font='bold 13px Georgia';c.fillText('☠  →',x-20,y-56);}
  else if(d.type==='reveal'){c.fillStyle='#bdfbea8a';c.font='15px Georgia';c.fillText('✦',x+65,y-1);}
  else if(d.type==='secret'){c.save();c.shadowColor='#ffde9a';c.shadowBlur=15;c.fillStyle='#ffdaa9';c.font='19px Georgia';c.fillText('✦',x,y-3);c.restore();}
 }
 lamp(c,l,t){const flick=Math.sin(t*6+l.x)*.1;c.save();c.translate(l.x,l.y);line(c,0,81,0,7,'#372d47',7);ellipse(c,0,-4,14,15,'#71576a');c.fillStyle='#ffe7ac';c.shadowColor='#fbd18f';c.shadowBlur=18;ellipse(c,0,-4,8,10,'#ffe9aa');c.fillStyle='#6e5566';c.shadowBlur=0;c.fillRect(-14,-18,28,5);c.fillRect(-13,6,26,5);line(c,0,-14,0,7,'#805f6a',3);c.restore();}
 draw(game,alpha=0){const c=this.c,lv=game.level;if(!lv){this.menu(game.time);return;}const t=game.time,cam=game.camera;
 c.clearRect(0,0,960,540);A.bg(c,lv.wi,cam,t,game.settings);
 c.save();if(game.settings.shake&&game.shake>0)c.translate(Math.sin(t*59)*game.shake*5,Math.cos(t*89)*game.shake*3);
 c.translate(-cam,0);
 const l=cam-160,r=cam+1120,inView=x=>x>l&&x<r;
 // structures emerge among trees; mid layer anchored in world
 for(const g of lv.ground)if(g.x+g.w>l&&g.x<r)this.terrain(c,g,lv.world,t);
 for(const s of lv.platforms)if(s.x+s.w>l&&s.x<r)this.platform(c,s,lv.world,t,game.player.flame);
 for(const h of lv.hazards)if(inView(h.x)){for(let x=h.x;x<h.x+h.w;x+=13){c.fillStyle='#2e273b';c.beginPath();c.moveTo(x,h.y+h.h);c.lineTo(x+6.5,h.y);c.lineTo(x+13,h.y+h.h);c.fill();c.strokeStyle=lv.wi===3?'#b3ee9b':'#c2a7a8';c.lineWidth=2;c.beginPath();c.moveTo(x+3,h.y+h.h-2);c.lineTo(x+6.5,h.y+4);c.lineTo(x+9,h.y+h.h-2);c.stroke();}}
 for(const d of lv.decor)if(inView(d.x))this.decor(c,d,lv.wi,t);
 for(const q of lv.lamps)if(inView(q.x))this.lamp(c,q,t);
 for(const cp of lv.checkpoint)if(inView(cp.x)){let live=cp.active;line(c,cp.x,G.FLOOR,cp.x,G.FLOOR-92,'#53394e',5);c.fillStyle=live?'#ffc97a':'#806b85';c.beginPath();c.moveTo(cp.x,G.FLOOR-98);c.lineTo(cp.x+35,G.FLOOR-86);c.lineTo(cp.x,G.FLOOR-66);c.fill();if(live&&game.settings.light)glow(c,cp.x+7,G.FLOOR-83,64,'#f9ad6977');}
 for(const s of lv.souls)if(!s.got&&inView(s.x)){let yy=s.y+Math.sin(t*3+s.t)*5;c.save();c.shadowColor='#d6f9fd';c.shadowBlur=17;ellipse(c,s.x,yy,13,16,'#a3ecf6');ellipse(c,s.x,yy,5,9,'#fff8c7');c.restore();c.fillStyle='#f8e7ac';c.font='17px Georgia';c.fillText('✦',s.x-7,yy+6);}
 for(const item of lv.coins)if(!item.got&&inView(item.x)){let yy=item.y+Math.sin(t*4+item.t)*4;c.save();c.shadowColor=item.kind==='heart'?'#ff7f8b':'#ffce79';c.shadowBlur=10;if(item.kind==='heart'){c.fillStyle='#ff8c8d';c.font='22px Georgia';c.fillText('♥',item.x-11,yy+8);}else if(item.kind==='flame'){ellipse(c,item.x,yy,8,13,'#8ce8ce');ellipse(c,item.x,yy+2,3,7,'#fffad3');}else{ellipse(c,item.x,yy,8,10,'#efaf53');ellipse(c,item.x-2,yy-3,3,5,'#fff2bd');}c.restore();}
 for(const e of lv.enemies)if(e.alive&&inView(e.x))A.enemy(c,e,t,lv.wi);
 if(lv.bossEntity?.alive&&inView(lv.bossEntity.x)){const b=lv.bossEntity;if(b.attack<.42){c.save();c.strokeStyle='#ffca9b';c.globalAlpha=.5+Math.sin(t*18)*.25;c.lineWidth=4;c.beginPath();c.arc(b.x+b.w/2,b.y+42,83,0,6.283);c.stroke();c.restore();}A.boss(c,lv.bossEntity,lv.wi,t);c.fillStyle='#231628';c.fillRect(b.x-5,b.y-34,130,10);c.fillStyle='#f38576';c.fillRect(b.x-4,b.y-33,128*(b.hp/b.maxHp),8);}
 for(const q of game.projectiles)if(inView(q.x)){c.save();c.shadowBlur=17;c.shadowColor=q.hostile?'#bd75f1':'#ffbd71';ellipse(c,q.x+8,q.y+6,q.w/2,q.h/2,q.hostile?'#be86f8':'#ffdf94');c.restore();}
 if(inView(lv.gate.x)){let p=lv.gate,open=game.canExit();let col=open?'#9ef2d0':'#8c657e';c.save();c.shadowColor=open?'#86ffe9':'#e69bbb';c.shadowBlur=open?22:10;c.fillStyle='#2f283e';c.fillRect(p.x-10,p.y-8,p.w+20,p.h+8);ellipse(c,p.x+p.w/2,p.y+12,p.w/2+10,24,'#52435d');c.fillStyle=col;c.fillRect(p.x,p.y+13,p.w,p.h-13);glow(c,p.x+p.w/2,p.y+60,48,open?'#a3fff383':'#8e78a040');c.fillStyle='#271d34';c.fillRect(p.x+12,p.y+17,p.w-24,p.h-18);c.font='32px Georgia';c.fillStyle=open?'#d6fff5':'#e6bdbe';c.fillText(open?'✦':'♧',p.x+p.w/2-13,p.y+69);c.restore();}
 if(game.player.invuln<=0||Math.floor(t*15)%2===0)A.pumpkin(c,game.player.x+game.player.w/2,game.player.y+game.player.h/2,1,t,game.player.drawInfo(),game.player.facing,game.player.energy);
 for(const p of lv.particles)if(inView(p.x)){c.globalAlpha=Math.max(0,p.life/p.max);ellipse(c,p.x,p.y,p.r,p.r,p.color);c.globalAlpha=1;}
 c.restore();
 if(game.settings.light){this.lighting(c,game);}
 if(game.settings.particles&&game.settings.quality!=='low')for(let i=0;i<(game.settings.quality==='high'?53:24);i++){let z=G.hash(i*18.01+lv.wi*9),x=((i*77+t*(i%4+1)*5-cam*.25)%1030+1030)%1030-35,y=G.hash(i*3.17+9)*450+28;ellipse(c,x,y,(1+z*1.9),1+z*1.9,i%3?'#c6d4b67e':'#ffe0a4bc');}
 this.vignette(c,lv.wi>=2?.20:.15);
 }
 lighting(c,game){let x=game.player.x-game.camera+18,y=game.player.y+21,p=game.player,world=game.level.world;
  if(p.flame&&p.energy>0){c.save();c.globalCompositeOperation='screen';glow(c,x,y,145,'#f9a45833');glow(c,x,y,62,'#ffe6a233');c.restore();}
  for(const l of game.level.lamps){let xx=l.x-game.camera;if(xx>-100&&xx<1060){c.save();c.globalCompositeOperation='screen';glow(c,xx,l.y,100,'#ffe79a22');c.restore();}}
 }
 vignette(c,amount){let gr=c.createRadialGradient(480,260,140,480,260,630);gr.addColorStop(0,'#0000');gr.addColorStop(1,'rgba(8,5,21,'+amount+')');c.fillStyle=gr;c.fillRect(0,0,960,540);}
}
G.Renderer=Renderer;
})();
