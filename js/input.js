(function(){'use strict';const G=window.ABO;
class Input{
 constructor(){this.held=new Set();this.edge=new Set();this.touchSet=new Set();this.bindings={left:['ArrowLeft','KeyA'],right:['ArrowRight','KeyD'],jump:['ArrowUp','KeyW','Space'],run:['ShiftLeft','ShiftRight'],attack:['KeyJ'],flame:['KeyK','KeyF'],dash:['KeyL'],interact:['KeyE'],pause:['Escape','KeyP']};
 const mapping=()=>Object.values(this.bindings).flat();
 window.addEventListener('keydown',e=>{if(mapping().includes(e.code)){e.preventDefault();if(!this.held.has(e.code)){this.edge.add(e.code);}this.held.add(e.code);}}, {passive:false});
 window.addEventListener('keyup',e=>{this.held.delete(e.code);if(mapping().includes(e.code))e.preventDefault();});
 window.addEventListener('blur',()=>this.clear());document.addEventListener('visibilitychange',()=>{if(document.hidden)this.clear();});
 for(const btn of document.querySelectorAll('[data-action]')){
  const action=btn.dataset.action,down=e=>{e.preventDefault();btn.setPointerCapture?.(e.pointerId);this.touchSet.add(action);if(!btn.classList.contains('pressed'))this.edge.add('touch:'+action);btn.classList.add('pressed');},up=e=>{e.preventDefault();this.touchSet.delete(action);btn.classList.remove('pressed');};
  btn.addEventListener('pointerdown',down);btn.addEventListener('pointerup',up);btn.addEventListener('pointercancel',up);btn.addEventListener('lostpointercapture',up);
 }
 }
 down(action){return this.touchSet.has(action)||this.bindings[action]?.some(x=>this.held.has(x))||false;}
 pressed(action){return this.edge.has('touch:'+action)||this.bindings[action]?.some(x=>this.edge.has(x))||false;}
 flush(){this.edge.clear();}
 clear(){this.held.clear();this.edge.clear();this.touchSet.clear();}
}
G.Input=Input;
})();
