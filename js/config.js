/* ABÓBORA V3: script clássico, sem módulos, CDN, fetch ou servidor. */
(function(){'use strict';
const G=window.ABO=window.ABO||{};
G.W=960;G.H=540;G.FLOOR=448;G.TOTAL=36;G.STEP=1/60;
G.clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
G.overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
G.hash=(x)=>{let n=Math.sin(x*127.17+13.89)*43758.5453;return n-Math.floor(n);};
G.rng=(seed)=>{let s=seed>>>0;return ()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;}};
G.worlds=[
 {name:'FLORESTA DAS ABÓBORAS',short:'FLORESTA',sky:['#100c21','#44305d','#9a6476'],far:'#393151',mid:'#59415f',tree:'#422b3e',leaf:'#455263',foliage:'#62745f',soil:'#4a3546',grass:'#87a86b',glow:'#f8c36d',enemy:'scarecrow',stages:['A Primeira Faísca','Raízes que Sussurram','O Bosque Suspenso','Os Olhos na Mata','Trilha das Lanternas','A Árvore Devoradora']},
 {name:'VILA DOS SINOS',short:'VILA',sky:['#161026','#54416b','#a06c8c'],far:'#41355c',mid:'#584566',tree:'#4c3759',leaf:'#534864',foliage:'#5e6470',soil:'#50384b',grass:'#83b6a7',glow:'#f9d081',enemy:'skeleton',stages:['Rua das Janelas','Telhados Torcidos','A Ponte Velha','O Mercado Vazio','Última Procissão','O Sineiro Esquecido']},
 {name:'CEMITÉRIO DAS VOZES',short:'CEMITÉRIO',sky:['#130f29','#393365','#866ca7'],far:'#343254',mid:'#4b406b',tree:'#352d4c',leaf:'#49435d',foliage:'#62647a',soil:'#393444',grass:'#829f97',glow:'#9affef',enemy:'ghost',stages:['Lápides ao Luar','Almas na Névoa','O Mausoléu','Passagem Invisível','As Três Velas','A Viúva do Cemitério']},
 {name:'PÂNTANO DA BRUMA',short:'PÂNTANO',sky:['#0c2026','#25505a','#6b7970'],far:'#29474d',mid:'#335b55',tree:'#293a3b',leaf:'#365b50',foliage:'#67806d',soil:'#39544b',grass:'#75aa78',glow:'#b9f17e',enemy:'frog',stages:['Águas Silenciosas','A Ponte Afundada','Luzes Enganosas','Raízes Submersas','Atravessando a Bruma','A Criatura do Pântano']},
 {name:'CATACUMBAS ESQUECIDAS',short:'CATACUMBAS',sky:['#0f101d','#29283d','#58435a'],far:'#252434',mid:'#3d3545',tree:'#3b2e3b',leaf:'#4f3b47',foliage:'#615364',soil:'#51404c',grass:'#b29783',glow:'#ffae78',enemy:'bone',stages:['Descida ao Subsolo','Ossos em Marcha','Labirinto de Velas','Câmara do Eco','A Ponte dos Mortos','O Guardião de Pedra']},
 {name:'CASTELO DO ÚLTIMO SINO',short:'CASTELO',sky:['#110c20','#332348','#794062'],far:'#39243d',mid:'#56304b',tree:'#442438',leaf:'#583a50',foliage:'#7f4b60',soil:'#52303e',grass:'#c08886',glow:'#ffd186',enemy:'knight',stages:['Portões de Ferro','As Torres Tortas','Relógio das Sombras','Salão dos Retratos','O Campanário','O Rei do Último Sino']}
];
G.settingsDefault={quality:'high',particles:true,light:true,shake:true,music:true,sfx:true,volume:.7};
G.saferead=()=>{try{let r=localStorage.getItem('abobora_v3_save');if(!r)return null;let obj=JSON.parse(r);if(!obj||obj.version!==3||!Number.isInteger(obj.unlocked))return null;obj.unlocked=G.clamp(obj.unlocked,0,G.TOTAL);obj.level=G.clamp(obj.level|0,0,G.TOTAL-1);obj.candy=G.clamp(obj.candy|0,0,999999);obj.settings={...G.settingsDefault,...obj.settings};return obj;}catch(e){return null;}};
G.safewrite=(save)=>{try{localStorage.setItem('abobora_v3_save',JSON.stringify(save));return true;}catch(e){return false;}};
G.newSave=()=>({version:3,level:0,unlocked:0,candy:0,cleared:[],resume:null,playSeconds:0,settings:{...G.settingsDefault}});
})();
