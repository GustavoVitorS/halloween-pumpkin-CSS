(function(){'use strict';const G=window.ABO;
class Audio{
 constructor(){this.ctx=null;this.enabled=false;this.musicTime=0;this.note=0;this.world=-1;}
 start(){if(!this.ctx){try{this.ctx=new(window.AudioContext||window.webkitAudioContext)();}catch(e){return;}}if(this.ctx.state==='suspended')this.ctx.resume().catch(()=>{});this.enabled=true;}
 tone(freq=440,dur=.12,wave='sine',volume=.045,slide=1){if(!this.ctx||!this.enabled||!G.game?.settings.sfx)return;let c=this.ctx,t=c.currentTime,o=c.createOscillator(),a=c.createGain();o.type=wave;o.frequency.setValueAtTime(Math.max(freq,20),t);if(slide!==1)o.frequency.exponentialRampToValueAtTime(Math.max(30,freq*slide),t+dur);a.gain.setValueAtTime(Math.max(.0001,volume*G.game.settings.volume),t);a.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(a);a.connect(c.destination);o.start(t);o.stop(t+dur+.01);}
 play(k){const notes={jump:[480,.15,'triangle',.045,1.42],land:[110,.09,'sine',.03,.7],coin:[820,.2,'sine',.065,1.47],hit:[120,.18,'sawtooth',.045,.45],attack:[390,.11,'triangle',.042,.65],dash:[180,.17,'sawtooth',.032,2.8],flame:[270,.2,'triangle',.055,1.4],step:[160,.05,'sine',.02,.9],heal:[580,.3,'sine',.048,1.6],checkpoint:[600,.35,'sine',.065,1.5],boss:[95,.6,'sawtooth',.09,.5],door:[440,.52,'sine',.06,.48],menu:[740,.15,'sine',.04,1.2],death:[260,.45,'triangle',.05,.3],mystery:[680,.2,'square',.027,1.6]};this.tone(...(notes[k]||notes.step));}
 update(dt,wi){if(!this.ctx||!this.enabled||!G.game?.settings.music)return;this.musicTime+=dt;if(wi!==this.world){this.world=wi;this.musicTime=.4;this.note=0;}if(this.musicTime<.34)return;this.musicTime=0;
  let minor=[0,3,5,7,10,7,5,3,0,-2,3,7,5,3,-2,0],bass=[0,0,5,5,3,3,7,7],i=this.note++,root=[196,174.6,155.6,146.8,130.8,116.5][G.clamp(wi,0,5)];let t=this.ctx.currentTime;const f=root*Math.pow(2,minor[i%minor.length]/12),o=this.ctx.createOscillator(),a=this.ctx.createGain();o.type='triangle';o.frequency.value=f;a.gain.setValueAtTime(.0001,t);a.gain.linearRampToValueAtTime(.015*G.game.settings.volume,t+.018);a.gain.exponentialRampToValueAtTime(.0001,t+.31);o.connect(a);a.connect(this.ctx.destination);o.start(t);o.stop(t+.32);
  if(i%4===0){let b=this.ctx.createOscillator(),v=this.ctx.createGain();b.type='sine';b.frequency.value=root/2*Math.pow(2,bass[Math.floor(i/4)%bass.length]/12);v.gain.setValueAtTime(.013*G.game.settings.volume,t);v.gain.exponentialRampToValueAtTime(.0001,t+.7);b.connect(v);v.connect(this.ctx.destination);b.start(t);b.stop(t+.71);}
 }
}
G.Audio=Audio;
})();
