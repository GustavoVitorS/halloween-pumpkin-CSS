(function(){'use strict';const G=window.ABO,{clamp,overlap}=G;
class Player{
 constructor(){this.w=37;this.h=47;this.maxHp=5;this.doubleJump=false;this.reset(90,true);}
 reset(x=90,fresh=false){this.x=x;this.y=G.FLOOR-this.h;this.vx=0;this.vy=0;this.grounded=false;this.coyote=0;this.buffer=0;this.facing=1;this.jumps=0;this.dash=0;this.dashCd=0;this.attack=0;this.attackCd=0;this.fireCd=0;this.invuln=1;this.squash=0;this.runTick=0;this.t=0;this.flame=true;this.energy=fresh?100:this.energy;this.hp=fresh?5:this.hp;this.hurtTick=0;this.death=false;this.isMoving=false;}
 hurt(game,amount=1,dir=1){if(this.invuln>0||this.dash>0||this.death)return;this.hp-=amount;this.invuln=1.2;this.hurtTick=.27;this.vy=-280;this.vx=dir*225;game.shake=.4;game.audio.play('hit');game.burst(this.x+17,this.y+21,'#ff9d79',18);if(this.hp<=0){this.death=true;game.audio.play('death');game.die();}}
 update(dt,game){const inp=game.input,lv=game.level;this.t+=dt;this.invuln=Math.max(0,this.invuln-dt);this.attack=Math.max(0,this.attack-dt);this.attackCd=Math.max(0,this.attackCd-dt);this.fireCd=Math.max(0,this.fireCd-dt);this.hurtTick=Math.max(0,this.hurtTick-dt);this.dashCd=Math.max(0,this.dashCd-dt);this.squash+=(0-this.squash)*Math.min(1,dt*10);
  if(inp.pressed('flame')){this.flame=!this.flame;if(this.energy<=5)this.flame=false;game.audio.play('flame');game.toast(this.flame?'CHAMA DESPERTA · PLATAFORMAS OCULTAS REVELADAS':'CHAMA ADORMECIDA · ENERGIA RECUPERANDO',2.5);}
  if(this.flame&&this.energy>0){this.energy=Math.max(0,this.energy-3.1*dt);if(this.energy===0){this.flame=false;game.toast('A CHAMA PRECISA DESCANSAR',2);}}
  else this.energy=Math.min(100,this.energy+10.5*dt);
  const move=(inp.down('right')?1:0)-(inp.down('left')?1:0);this.isMoving=!!move;if(move)this.facing=move;
  if(inp.pressed('jump'))this.buffer=.15;else this.buffer=Math.max(0,this.buffer-dt);
  this.coyote=this.grounded?.115:Math.max(0,this.coyote-dt);
  if(inp.pressed('dash')&&this.dashCd<=0){this.dash=.17;this.dashCd=.85;this.vy=0;game.audio.play('dash');game.burst(this.x+this.w/2,this.y+35,'#ffd38b',8);}
  if(this.dash>0){this.dash-=dt;this.vx=this.facing*470;this.vy=0;}else{
   const max=inp.down('run')?335:255;
   if(move){this.vx=clamp(this.vx+move*(this.grounded?2400:1750)*dt,-max,max);}else{
    const brake=(this.grounded?2100:860)*dt;this.vx=Math.abs(this.vx)<=brake?0:this.vx-Math.sign(this.vx)*brake;}
   this.vy=Math.min(780,this.vy+((this.vy>0)?1500:1320)*dt);
  }
  if(this.buffer>0&&(this.coyote>0||(this.doubleJump&&this.jumps<2))){this.vy=this.jumps===0?-555:-508;this.jumps++;this.grounded=false;this.coyote=0;this.buffer=0;this.squash=-.18;game.audio.play('jump');game.burst(this.x+18,this.y+47,'#f9cf94',7);}
  if(!inp.down('jump')&&this.vy< -125)this.vy+=1900*dt;
  let lastX=this.x,oldFeet=this.y+this.h,oldTop=this.y;
  this.x=clamp(this.x+this.vx*dt,2,lv.width-this.w);
  // Ground walls at level edges; platform tops remain one-way for precise platforming.
  this.y+=this.vy*dt;
  let landing=false;const candidates=lv.ground.concat(lv.platforms);
  for(const s of candidates){if(s.kind==='spectral'&&!(this.flame&&this.energy>0))continue;let sx=s.x,sy=s.y;
   if(!((this.x+this.w)>sx+4&&this.x<sx+s.w-4))continue;
   if(this.vy>=0 && oldFeet<=sy+9 && this.y+this.h>=sy && this.y<=sy){this.y=sy-this.h;this.vy=0;landing=true;
      if(s.kind==='moving'){this.x+=s.dx||0;}
   }else if(this.vy<0&&s.kind==='mystery'&&!s.used&&oldTop>=sy+s.h-6&&this.y<=sy+s.h){this.y=sy+s.h;this.vy=30;s.used=true;game.audio.play('mystery');game.level.coins.push({x:s.x+s.w/2,y:s.y-27,kind:'heart',got:false,t:0});game.burst(s.x+s.w/2,s.y,'#ffdb88',14);game.toast('BLOCO MISTERIOSO! UMA RECOMPENSA!',2);}
  }
  if(landing&&!this.grounded){this.squash=.22;game.audio.play('land');game.burst(this.x+17,this.y+47,'#d2c4af',6);}
  this.grounded=landing;if(landing)this.jumps=0;
  if(this.y>G.H+140){this.hurt(game,1,1);if(!this.death)game.respawn();return;}
  if(this.grounded&&Math.abs(this.vx)>75){this.runTick+=dt;if(this.runTick>.32){this.runTick=0;if(game.settings.sfx)game.audio.play('step');}}else this.runTick=0;
  if(inp.pressed('attack')&&this.attackCd<=0){this.attack=.19;this.attackCd=.30;game.audio.play('attack');const box={x:this.facing>0?this.x+25:this.x-48,y:this.y-7,w:60,h:60};
   for(const e of lv.enemies){if(e.alive&&overlap(box,e)){game.hitEnemy(e,1,this.facing);}}
   if(lv.bossEntity?.alive&&overlap(box,lv.bossEntity))game.hitBoss(1);
   if(this.flame&&this.energy>7){this.energy-=7;game.projectiles.push({x:this.x+(this.facing>0?37:-4),y:this.y+20,vx:this.facing*420,life:.62,hostile:false,w:16,h:12});this.fireCd=.3;}
  }
 }
 drawInfo(){return this.hurtTick>0?'hurt':this.attack>0?'attack':this.dash>0?'dash':!this.grounded?(this.vy<0?'jump':'fall'):Math.abs(this.vx)>30?'run':'idle';}
}
G.Player=Player;
G.updateFoes=(game,dt)=>{
 const lv=game.level,p=game.player;for(const e of lv.enemies){if(!e.alive)continue;e.t+=dt;e.stun=Math.max(0,e.stun-dt);e.attack-=dt;if(e.stun>0)continue;
  let dx=p.x-e.x;
  if(e.type==='bat'||e.type==='ghost'){
   e.y=(G.FLOOR-(e.type==='bat'?165:120))+Math.sin(e.t*2.6)*28;
   if(Math.abs(dx)<250&&Math.abs(p.y-e.y)<160)e.x+=Math.sign(dx)*(e.type==='ghost'?67:90)*dt;else e.x+=Math.sin(e.t)*35*dt;
  }else{
   if(Math.abs(dx)<220){e.dir=Math.sign(dx)||1;e.x+=e.dir*65*dt;}
   else{e.x+=e.dir*(e.type==='knight'?52:42)*dt;if(e.x>e.max||e.x<e.min)e.dir*=-1;}
   e.y=G.FLOOR-e.h;
  }
  if(G.overlap(p,e)){if(p.vy>110&&p.y+p.h<e.y+21&&p.y+p.h>e.y-14){game.hitEnemy(e,2,p.facing);p.vy=-350;game.audio.play('jump');}
   else p.hurt(game,1,Math.sign(p.x-e.x)||1);}
  if(p.flame&&p.energy>0&&Math.abs(p.x-e.x)<68&&Math.abs(p.y-e.y)<90&&(e.type==='ghost'||e.type==='bat')){if(e.attack<=0){game.hitEnemy(e,1,1);e.attack=.6;}}
 }
 const b=lv.bossEntity;if(b?.alive){b.stun=Math.max(0,b.stun-dt);b.phase+=dt;b.attack-=dt;if(b.stun<=0){const dist=p.x-b.x;b.x+=Math.sign(dist)*(40+lv.wi*8)*dt;
  if(lv.wi===2&&Math.floor(b.phase/6)!==Math.floor((b.phase-dt)/6)){
    b.x=G.clamp(p.x+(dist>0?-160:170),lv.width-1150,lv.width-380);
    game.burst(b.x+50,b.y+45,'#a7f9ff',22);
  }
  if(b.attack<=0){b.attack=2.3-lv.wi*.12;game.burst(b.x+b.w/2,b.y+28,'#a97aff',20);const toward=Math.sign(dist)||-1;
    const shots=lv.wi===1||lv.wi===4?3:lv.wi===5?4:1;
    for(let j=0;j<shots;j++){
      const spread=j-(shots-1)/2;
      game.projectiles.push({x:b.x+b.w/2,y:b.y+40,vx:toward*(170+lv.wi*20)+spread*22,
        vy:lv.wi===3?-250:lv.wi===1?spread*55:lv.wi===4?spread*80:lv.wi===5?spread*75:0,
        gravity:lv.wi===3?170:0,life:3.6,hostile:true,w:20,h:20});
    }
    game.audio.play('boss');
  }
 }
 if(G.overlap(p,b)){if(p.vy>130&&p.y+p.h<b.y+27){game.hitBoss(2);p.vy=-420;}else p.hurt(game,1,Math.sign(p.x-b.x)||1);}
 }
 for(const q of game.projectiles){q.x+=q.vx*dt;q.y+=(q.vy||0)*dt;if(q.gravity)q.vy+=q.gravity*dt;q.life-=dt;if(q.y>G.FLOOR+80)q.life=0;if(q.hostile){if(G.overlap(q,p)){p.hurt(game,1,Math.sign(q.vx));q.life=0;}}
 else{for(const e of lv.enemies){if(e.alive&&G.overlap(q,e)){game.hitEnemy(e,1,Math.sign(q.vx));q.life=0;break;}}if(b?.alive&&G.overlap(q,b)){game.hitBoss(1);q.life=0;}}
 }
 game.projectiles=game.projectiles.filter(x=>x.life>0);
};
})();
