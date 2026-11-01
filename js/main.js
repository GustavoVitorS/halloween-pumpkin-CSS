(function(){'use strict';try{
 if(!window.ABO||!window.ABO.Game)throw new Error('Um script do motor não carregou corretamente.');
 window.ABO.game=new window.ABO.Game();
}catch(error){console.error('[ABÓBORA V3]',error);const el=document.querySelector('#fatal'),text=document.querySelector('#fatalText');if(el){el.classList.remove('hidden');text.textContent=String(error.message||error)+' — Verifique se todos os arquivos js/ estão ao lado do index.html.';}}
})();
