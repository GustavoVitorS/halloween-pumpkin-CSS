(function(){'use strict';const G=window.ABO;
class Game{
 constructor(){this.canvas=document.getElementById('screen');this.renderer=new G.Renderer(this.canvas);this.input=new G.Input();this.audio=new G.Audio();this.save=G.saferead()||G.newSave();this.settings={...G.settingsDefault,...this.save.settings};this.ui=new G.UI(this);this.mode='menu';this.level=null;this.player=new G.Player();this.time=0;this.frame=0;this.camera=0;this.shake=0;this.projectiles=[];this.stageCandy=0;this.checkX=90;this.stageTime=0;this.last=0;this.acc=0;this.previousMode='menu';this.renderer.menu(0);document.addEventListener('visibilitychange',()=>{if(document.hidden&&this.mode==='playing')this.ui.pause();});requestAnimationFrame(t=>this.loop(t));}
 startNew(){this.save=G.newSave();this.settings={...this.save.settings};this.loadStage(0);this.toast('A CHAMA NASCEU. ENCONTRE AS TRÊS ALMAS.',3);}
 continue(){this.loadStage(this.save.level||0);}
 loadStage(index){index=G.clamp(index|0,0,G.TOTAL-1);this.level=G.makeLevel(index);this.player=new G.Player();this.player.doubleJump=index>=6;this.player.reset(90,true);this.camera=0;this.checkX=90;this.projectiles=[];this.stageCandy=0;const resume=this.save.resume;if(resume&&resume.level===index){this.checkX=G.clamp(resume.checkX||90,90,this.level.width-250);this.player.reset(this.checkX,true);this.level.souls.forEach((s,i)=>s.got=(resume.souls||[]).includes(i));this.stageCandy=resume.candy||0;this.level.checkpoint.forEach(cp=>cp.active=cp.x<=this.checkX+10);}this.stageTime=0;this.shake=0;this.audio.world=-1;this.audio.play('door');this.mode='playing';this.previousMode='playing';this.save.level=index;this.persist();this.ui.mode('playing');this.ui.toast('ATO '+(this.level.wi+1)+' — '+this.level.world.stages[this.level.si],3);this.input.clear();}
 persist(){this.save.settings={...this.settings};G.safewrite(this.save);this.ui.syncMenu();}
 checkpointSave(){if(!this.level||this.mode!=='playing')return;this.save.resume={level:this.level.index,checkX:this.checkX,souls:this.level.souls.flatMap((s,i)=>s.got?[i]:[]),candy:this.stageCandy};this.persist();}
 returnMenu(){this.mode='menu';this.level=null;this.projectiles=[];this.ui.mode('menu');this.ui.syncMenu();this.input.clear();}
 toast(s,t){this.ui.toast(s,t);}
 canExit(){return this.level.souls.every(s=>s.got)&&(!this.level.bossEntity||!this.level.bossEntity.alive);}
 nearGate(){return this.level && Math.abs(this.player.x+this.player.w/2-(this.level.gate.x+this.level.gate.w/2))<85 && Math.abs(this.player.y+this.player.h-(this.level.gate.y+this.level.gate.h))<90;}
 burst(x,y,color,n=14){if(!this.level||!this.settings.particles)return;let rng=G.rng(Math.round(this.time*12941)+n+Math.floor(x));for(let i=0;i<n;i++){const a=i*6.283/n+((rng()-.5)*.6),s=45+rng()*145,life=.25+rng()*.53;this.level.particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-35,color,life,max:life,r:2+rng()*3});}if(this.level.particles.length>230)this.level.particles.splice(0,90);}
 hitEnemy(e,amount,dir){if(!e.alive||e.stun>0)return;e.hp-=amount;e.stun=.35;this.audio.play('hit');this.burst(e.x+e.w/2,e.y+e.h/2,'#d2bded',12);this.shake=.18;if(e.hp<=0){e.alive=false;this.stageCandy+=3;this.audio.play('coin');this.burst(e.x+15,e.y+15,'#f3d7a5',23);}}
 hitBoss(amount){const b=this.level.bossEntity;if(!b?.alive||b.stun>0)return;b.hp-=amount;b.stun=.24;this.shake=.22;this.audio.play('hit');this.burst(b.x+b.w/2,b.y+30,'#ffd1ab',20);if(b.hp<=0){b.alive=false;this.audio.play('checkpoint');this.burst(b.x+b.w/2,b.y+30,'#ffe5a9',60);this.toast('GUARDIÃO DERROTADO · O PORTAL DESPERTOU',3);}}
 die(){this.mode='dead';this.ui.death();}
 respawn(full=false){if(full){this.player=new G.Player();this.player.doubleJump=this.level.index>=6;}let p=this.player;p.hp=Math.max(3,p.hp);p.energy=Math.max(70,p.energy);p.death=false;p.reset(this.checkX);p.invuln=2;this.camera=G.clamp(this.checkX-240,0,this.level.width-960);this.mode='playing';this.ui.mode('playing');this.input.clear();this.projectiles=[];this.toast('A CHAMA AINDA VIVE',2);}
 clearStage(){let lv=this.level;this.save.candy+=this.stageCandy;this.save.resume=null;this.stageCandy=0;this.save.unlocked=Math.max(this.save.unlocked,lv.index+1);this.save.cleared=Array.from(new Set([...(this.save.cleared||[]),lv.index]));this.save.level=Math.min(G.TOTAL-1,lv.index+1);this.save.playSeconds+=this.stageTime;this.persist();this.audio.play('door');this.mode='end';this.ui.stageEnd(lv.index===G.TOTAL-1);}
 tick(dt){this.time+=dt;this.frame++;if(this.mode==='modal'&&this.ui.kind==='PAUSA'&&this.input.pressed('pause')){this.ui.close();this.input.flush();return;}if(this.mode==='playing'){
   if(this.input.pressed('pause')){this.ui.pause();this.input.flush();return;}
   this.stageTime+=dt;const lv=this.level,p=this.player;lv.time+=dt;
   for(const plat of lv.platforms){if(plat.kind!=='moving')continue;let before=plat.x;plat.x=plat.baseX+Math.sin(this.time*plat.speed+plat.phase)*plat.range;plat.dx=plat.x-before;}
   p.update(dt,this);if(this.mode!=='playing'){this.input.flush();return;}
   G.updateFoes(this,dt);
   for(const s of lv.souls){if(!s.got&&Math.hypot(p.x+p.w/2-s.x,p.y+p.h/2-s.y)<42){s.got=true;this.audio.play('checkpoint');this.burst(s.x,s.y,'#d1fcfb',26);this.toast('ALMA RECUPERADA · '+lv.souls.filter(x=>x.got).length+' DE 3',2);this.checkpointSave();}}
   for(const item of lv.coins){if(item.got||Math.hypot(p.x+p.w/2-item.x,p.y+p.h/2-item.y)>37)continue;item.got=true;this.burst(item.x,item.y,'#ffd18b',9);this.audio.play('coin');if(item.kind==='heart'){p.hp=Math.min(5,p.hp+1);this.toast('CORAÇÃO RESTAURADO',1.8);}else if(item.kind==='flame'){p.energy=Math.min(100,p.energy+35);this.toast('CHAMA RESTAURADA +35%',1.8);}else this.stageCandy++;}
   for(const cp of lv.checkpoint){if(!cp.active&&p.x>cp.x){cp.active=true;this.checkX=cp.x+8;this.audio.play('checkpoint');this.burst(cp.x,G.FLOOR-80,'#ffe1b0',16);this.toast('CHECKPOINT ATIVADO',2);this.checkpointSave();}}
   for(const haz of lv.hazards){if(G.overlap(p,haz))p.hurt(this,1,Math.sign(p.x-haz.x)||1);}
   if(this.input.pressed('interact')&&this.nearGate()){if(this.canExit())this.clearStage();else{this.toast('O PORTAL EXIGE TRÊS ALMAS E O GUARDIÃO VENCIDO',2.5);this.audio.play('hit');}}
   this.camera+=(G.clamp(p.x-(p.facing>0?310:510),0,Math.max(0,lv.width-960))-this.camera)*Math.min(1,dt*4.6);
   this.shake=Math.max(0,this.shake-dt*2.5);
   for(const q of lv.particles){q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=180*dt;q.life-=dt;}lv.particles=lv.particles.filter(q=>q.life>0);
   this.audio.update(dt,lv.wi);
 }
 this.ui.update(dt);this.input.flush();}
 loop(t){let dt=G.clamp((t-(this.last||t))/1000,0,.05);this.last=t;this.acc=Math.min(.13,this.acc+dt);
 let count=0;while(this.acc>=G.STEP&&count<6){this.tick(G.STEP);this.acc-=G.STEP;count++;}
 if(this.mode==='menu'||(!this.level&&this.mode==='modal')){this.time+=dt*.5;this.renderer.menu(this.time);}else if(this.level)this.renderer.draw(this);
 requestAnimationFrame(v=>this.loop(v));}
}
G.Game=Game;
})();
