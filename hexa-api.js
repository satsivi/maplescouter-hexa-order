// hexa-api.js — UI logic, fetch, render, tooltip
// Depends on skill-data.js being loaded first.

// ── Tooltip ──────────────────────────────────────────────────────────────
(function(){
  var tip = document.getElementById('tip');
  document.addEventListener('mouseover', function(e){
    var c = e.target.closest && e.target.closest('.ic');
    if (!c || !c.dataset.t) { tip.style.display='none'; return; }
    tip.innerHTML = decodeURIComponent(c.dataset.t);
    tip.style.display = 'block';
    move(e);
  });
  document.addEventListener('mousemove', function(e){
    if (tip.style.display === 'none') return;
    if (!(e.target.closest && e.target.closest('.ic'))) { tip.style.display='none'; return; }
    move(e);
  });
  function move(e){
    var m=14, tw=215, th=tip.offsetHeight||120;
    var x = e.clientX+m, y = e.clientY-th-m;
    if (x+tw > window.innerWidth-8) x = e.clientX-tw-m;
    if (y < 8) y = e.clientY+m;
    tip.style.left = x+'px'; tip.style.top = y+'px';
  }
})();

// ── Class map ────────────────────────────────────────────────────────────
var classList = Object.entries(CLASS_MAP).sort(function(a,b){return a[0].localeCompare(b[0]);});



// Mastery ID -> label

function xlate(imgPath, koFallback) {
  if (imgPath && imgPath.indexOf('nexon.com') !== -1) return 'HEXA Stat';
  if (!imgPath) return koFallback || '—';
  var fname = imgPath.split('/').pop().replace('.png','').replace('.jpg','');
  return IMG_NAMES[fname] || koFallback || fname;
}

function displayName(imgPath, koFallback, imgId) {
  var name = xlate(imgPath, koFallback);
  var label = MASTERY_LABEL[imgId];
  return label ? label + ': ' + name : name;
}

// ── Dropdown ─────────────────────────────────────────────────────────────
var selKo = '';
var dd = document.getElementById('dd');
var csearch = document.getElementById('csearch');

function renderDD(items) {
  if (!items.length) { dd.innerHTML = '<div class="ddi" style="color:var(--muted)">No match</div>'; return; }
  dd.innerHTML = items.map(function(p){
    return '<div class="ddi" onmousedown="pick(\''+p[0].replace(/'/g,"\\'")+'\',' +
           '\''+p[1].replace(/'/g,"\\'")+'\')">' + p[0] + '<span>'+p[1]+'</span></div>';
  }).join('');
}

csearch.addEventListener('input', function(){
  var q = this.value.toLowerCase();
  var f = q ? classList.filter(function(p){ return p[0].toLowerCase().indexOf(q) !== -1; }) : classList;
  renderDD(f); dd.style.display = 'block';
});
csearch.addEventListener('focus', function(){
  var q = this.value.toLowerCase();
  var f = q ? classList.filter(function(p){ return p[0].toLowerCase().indexOf(q) !== -1; }) : classList;
  renderDD(f); dd.style.display = 'block';
});
csearch.addEventListener('blur', function(){ setTimeout(function(){ dd.style.display='none'; }, 160); });

function pick(en, ko) {
  selKo = ko;
  csearch.value = en;
  document.getElementById('sellabel').textContent = '→ ' + ko;
  dd.style.display = 'none';
}

// ── Cycles ───────────────────────────────────────────────────────────────
var cycle = '2';
function setCycle(btn) {
  document.querySelectorAll('.cbtn').forEach(function(b){ b.classList.remove('on'); });
  btn.classList.add('on');
  cycle = btn.dataset.c;
}

// ── Test payload ─────────────────────────────────────────────────────────
var TEST = {"class_hexa":[
  ["커맨드 VI",1,"/hexaskill/WildHunter_8.png",3,50,3,50,1.778,0.563873],
  ["와일드 발칸 : 에이펙스 VI",1,"/hexaskill/WildHunter_2.png",3,50,6,100,1.027,0.573521],
  ["어시스트 VI",1,"/hexaskill/WildHunter_7.png",3,50,9,150,1.001,0.583087],
  ["커맨드 VI",2,"/hexaskill/WildHunter_8.png",1,15,10,165,0.843,0.585546],
  ["어나더 바이트 VI/파이널 어택 VI/트랩 시더 VI",1,"/hexaskill/WildHunter_9.png",3,50,13,215,0.725,0.592622],
  ["어시스트 VI",2,"/hexaskill/WildHunter_7.png",1,15,14,230,0.71,0.594724],
  ["커맨드 VI",3,"/hexaskill/WildHunter_8.png",1,18,15,248,0.689,0.597183],
  ["커맨드 VI",4,"/hexaskill/WildHunter_8.png",1,20,16,268,0.617,0.599641],
  ["와일드 발칸 : 에이펙스 VI",2,"/hexaskill/WildHunter_2.png",1,15,17,283,0.595,0.601425],
  ["어시스트 VI",3,"/hexaskill/WildHunter_7.png",1,18,18,301,0.583,0.603528],
  ["어나더 바이트 VI/파이널 어택 VI/트랩 시더 VI",2,"/hexaskill/WildHunter_9.png",1,15,19,316,0.536,0.605146],
  ["커맨드 VI",5,"/hexaskill/WildHunter_8.png",1,23,20,339,0.53,0.607604],
  ["어시스트 VI",4,"/hexaskill/WildHunter_7.png",1,20,21,359,0.519,0.609707],
  ["와일드 발칸 : 에이펙스 VI",3,"/hexaskill/WildHunter_2.png",1,18,22,377,0.488,0.611491],
  ["커맨드 VI",6,"/hexaskill/WildHunter_8.png",1,25,23,402,0.482,0.613949],
  ["어시스트 VI",5,"/hexaskill/WildHunter_7.png",1,23,24,425,0.447,0.616052],
  ["어나더 바이트 VI/파이널 어택 VI/트랩 시더 VI",3,"/hexaskill/WildHunter_9.png",1,18,25,443,0.438,0.61767],
  ["와일드 발칸 : 에이펙스 VI",4,"/hexaskill/WildHunter_2.png",1,20,26,463,0.433,0.619454],
  ["커맨드 VI",7,"/hexaskill/WildHunter_8.png",1,28,27,491,0.425,0.621912],
  ["어시스트 VI",6,"/hexaskill/WildHunter_7.png",1,25,28,516,0.406,0.624015],
  ["커맨드 VI",8,"/hexaskill/WildHunter_8.png",2,30,30,546,0.394,0.626473],
  ["어나더 바이트 VI/파이널 어택 VI/트랩 시더 VI",4,"/hexaskill/WildHunter_9.png",1,20,31,566,0.387,0.628091],
  ["와일드 발칸 : 에이펙스 VI",5,"/hexaskill/WildHunter_2.png",1,23,32,589,0.371,0.629875],
  ["어시스트 VI",7,"/hexaskill/WildHunter_7.png",1,28,33,617,0.358,0.631978],
  ["커맨드 VI",9,"/hexaskill/WildHunter_8.png",2,33,35,650,0.354,0.634436],
  ["와일드 발칸 : 에이펙스 VI",6,"/hexaskill/WildHunter_2.png",1,25,36,675,0.337,0.63622],
  ["기어 스톰",1,"/hexaskill/WildHunter_10.png",5,100,41,775,0.333,0.643288],
  ["어나더 바이트 VI/파이널 어택 VI/트랩 시더 VI",5,"/hexaskill/WildHunter_9.png",1,23,42,798,0.328,0.644906],
  ["어시스트 VI",8,"/hexaskill/WildHunter_7.png",2,30,44,828,0.326,0.647009],
  ["프라이멀 블룸",1,"/hexaskill/WildHunter_5.png",4,75,55,1047,0.249,0.660001],
  ["오버바이트",1,"/hexaskill/WildHunter_4.png",4,75,59,1122,0.247,0.664079],
  ["커맨드 : 프레데터스 아이",4,"/hexaskill/WildHunter_3.png",7,155,70,1340,0.228,0.675349],
  ["링크드 임팩트",2,"/hexaskill/WildHunter_1.png",1,30,175,4476,0.105,0.753218],
  ["와일드 발칸 : 오버 드라이브",1,"/hexaskill/WildHunter_6.png",4,75,95,2085,0.18,0.693407],
  ["헥사스탯1 떡작",1,"https://open.api.nexon.com/static/maplestory/skill/icon/KAPCLAPBMA",5,324,78,1720,0.192,0.678004]
]};

// ── Render ───────────────────────────────────────────────────────────────
function render(data, label, ko) {
  var out = document.getElementById('results');
  var order = data.class_hexa || data.order || (Array.isArray(data) ? data : null);
  if (!order) {
    out.innerHTML = '<div class="panel"><div class="plabel">Raw Response</div><pre style="font-size:11px;color:var(--muted);white-space:pre-wrap;word-break:break-all">'+JSON.stringify(data,null,2)+'</pre></div>';
    return;
  }
  var icons = order.map(function(item, i) {
    var ko   = item[0]||'';
    var lvl  = item[1]!==undefined ? item[1] : '?';
    var img  = item[2]||'';
    var e    = item[3]!==undefined ? item[3] : '?';
    var f    = item[4]!==undefined ? item[4] : '?';
    var ce   = item[5]!==undefined ? item[5] : '?';
    var cf   = item[6]!==undefined ? item[6] : '?';
    var eff  = item[7]!==undefined ? item[7].toFixed(3) : '—';
    var cfd  = item[8]!==undefined ? (item[8]*100).toFixed(4) : '—';
    var imgId = parseInt((img.split('/').pop().replace('.png','').match(/_(\d+)$/) || [0,0])[1]);
    var en   = displayName(img, ko, imgId);
    var src  = img.startsWith('http') ? img : 'https://maplescouter.com'+img;
    var delay= Math.min(i*12, 900);
    var t = encodeURIComponent(
      '<div class="tn">'+en+'</div>'
      +'<div class="tr">Level up to: <b>'+lvl+'</b></div>'
      +'<div class="tr">Cost: <b>'+e+' Erda &middot; '+f+' Frags</b></div>'
      +'<div class="tr">Cumulative: <b>'+ce+' Erda &middot; '+cf+' Frags</b></div>'
      +'<div class="tr">Eff/frag: <b class="te">'+eff+'%</b></div>'
      +'<div class="tr">Total FD: <b>+'+cfd+'%</b></div>'
    );
    return '<div class="ic" style="animation:none" data-t="'+t+'">'
      +'<img src="'+src+'" alt="'+en+'" onerror="this.style.opacity=\'0.15\'">'
      +'<span class="lv">'+lvl+'</span>'
      +'</div>';
  }).join('');

  out.innerHTML = '<div class="panel">'
    +'<div class="res-head">'
    +'<span class="res-title">Level-Up Order &middot; '+label+' <span style="color:var(--muted)">'+ko+'</span></span>'
    +'<span class="res-meta">'+order.length+' steps &middot; cycle '+cycle+'</span>'
    +'</div>'
    +'<div class="grid">'+icons+'</div>'
    +'</div>';
}

// ── Fetch / Go ────────────────────────────────────────────────────────────
async function go() {
  var searchVal = csearch.value.trim();

  // Test mode
  if (searchVal.toLowerCase() === 'test') {
    render(TEST, 'Wild Hunter (Test)', '와일드헌터');
    return;
  }

  if (!selKo) { document.getElementById('results').innerHTML = '<div class="err">Please select a class from the list.</div>'; return; }

  var btn = document.getElementById('gobtn');
  btn.disabled = true;
  document.getElementById('results').innerHTML = '<div class="loading">CALCULATING</div>';

  var body = {
    myHexa:{skillCore1:"0",skillCore2:"0",masteryCore1:"0",masteryCore2:"0",masteryCore3:"0",masteryCore4:"0",reinCore1:"0",reinCore2:"0",reinCore3:"0",reinCore4:"0",generalCore2:"0",hexaStat:0,character_class:"    ",hexaSkill:{skillCore1:0,skillCore2:0,masteryCore1:0,masteryCore2:0,masteryCore3:0,masteryCore4:0,reinCore1:0,reinCore2:0,reinCore3:0,reinCore4:0},hexaSkill_general:{generalCore1:0},hexaSkill_used:{sole_Erda:0,sole_ErdaPrice:0},hexaStat_opened:false},
    specEff:{dmgeff1:0.0009377403569348353,atkeff1:0.0001703867779860868,atkPereff1:0.0033959086093073854,cridmgeff1:0.0032020493115594295,igreff1:0.00012894647962991002,mainStateff1:0.00007407087764984443,mainStatPereff1:0.0007579544580424502,mainStatAbseff1:0.000007504648191473562,subStateff1:0.000006529043926582156,subStatPereff1:0.00009129404524927631,subStatAbseff1:0.000001876162047868446,ssubStateff1:0,ssubStatPereff1:0,ssubStatAbseff1:0,allStatEff:0.0008492485032917263,igreffminus40:-0.00859643197533655,igreffminus35:-0.0069432719800790466,igreffminus30:-0.005526277698430504,igreffminus20:-0.003223661990751081,igreffminus15:-0.0022755261111182534,igreffminus10:-0.001432738662555777,igreff1_380:0.00016389577508402198,igreffminus40_380:-0.010926385005601058,igreffminus35_380:-0.008825157119907945,igreffminus30_380:-0.007024104646457641,igreffminus20_380:-0.004097394377100105,igreffminus15_380:-0.0028922783838352117,igreffminus10_380:-0.0018210641675997508},
    sole:false,suro:false,cycle:cycle,
    userStat:{doping:{bigHero:false,greatIgnoreGuard:false,dragonsMeal:false,extreme:true,fish:true,guildBlessing:false,jangBi:true,legendHero:false,legendHp:false,rebootAtkPotion:false,shiningRed:true,shiningBlue:false,statPotion:true,stat:"30",superPower:true,unionsPower:true,urus:true,heroesHawl:true,noblessBoss:true,noblessDmg:true,noblessCriDmg:true,noblessIgnore:true,nobless:["15","15","15","13"],sayram:true,collector:true,buff275:true,additional1:true,additional2:false,championAll:"5",championAtk:"5",championBoss:"5",championIgnore:"5",championCriDmg:"5",authenticDmg:true,moonshine:false,cake:false,apple:false,tengu:false,candy:false,house:false,wedding:false,specialWedding:false,whiteBear:false,ultraVip:false,superVip:false,truffle:false,medal:false,hyperRainbow:false,rainbow:false,thanks:false},linkSkill:{ark:"3",illium:"2",kadena:"3",kain:"3",magician:"6",thief:"6",angel:"3",hoyoung:"0",mukhyun:"0",mihile:"0",kaiser:"0",hayato:"0",kanna:"0"},special:{isReboot:false,combat:true,epiSoul:"0",mugongSoul:"0",genesis:true,destiny:true,oneHandSword:false,useRuinForceShild:false,useContinuousRingAsMainRing:false,restraintRing:"4",weaponRing:"4",riskTaker:"0",ringOfSum:"0",statThird:"13024",statFourth:"11797",continuosRing:"5",challenge:false,is30min:false,destiny2ndSkill:false},stat:{myClass:"    ",level:"295",mainStatBase:"8096",mainStatPer:"887",mainStatAbs:"29150",subStatBase:"4741",subStatPer:"248",subStatAbs:"730",ssubStatBase:"0",ssubStatPer:"0",ssubStatAbs:"0",arcaneForce:"1350",authenticForce:"890",atkBase:"5444",atkAbs:"0",dmg:"94",bossDmg:"539",normalDmg:"12",ignoreDef:"98.4619",buffDuration:"105",critical:"100",criticalDmg:"131.8",weaponAtk:"1135",atkPercent:"170",coolTimeReducePercent:"6",coolTimeReduce:"5",wildhunterUnion:"260",resetCoolDown:"27.5",statusAdditionalDmg:"17",passiveSkillLevelUp:false,increaseTarget:false,summonPersistTime:"0",artifact_increaseTarget:true,artifact_finalAttack:"15",subStat_hyper:"",subStat_ability:"",subStat_union:"",subStat_doping:"",subStat_afterDoping:"",ssubStat_hyper:"",ssubStat_ability:"",ssubStat_union:"",ssubStat_doping:"",ssubStat_afterDoping:"",ignoreElementalResist:"5",maple_combatPower:"",tms_fd:"0"},hexa:{skillCore1:"0",skillCore2:"0",masteryCore1:"0",masteryCore2:"0",masteryCore3:"0",masteryCore4:"0",reinCore1:"0",reinCore2:"0",reinCore3:"0",reinCore4:"0",generalCore2:"0",hexaStat:0,character_class:"    ",hexaSkill:{skillCore1:0,skillCore2:0,masteryCore1:0,masteryCore2:0,masteryCore3:0,masteryCore4:0,reinCore1:0,reinCore2:0,reinCore3:0,reinCore4:0},hexaSkill_general:{generalCore1:0},hexaSkill_used:{sole_Erda:0,sole_ErdaPrice:0},hexaStat_opened:false},seedRing:{restraintRing:{level:"4",efficiency:27.027027027027017},weaponRing:{level:"4",efficiency:31.251866171781508},ringOfSum:{level:"0",efficiency:0},riskTakerRing:{level:"0",efficiency:0},criDamageRing:{level:"0",efficiency:0},levelRing:{level:"0",efficiency:0},continuosRing:{level:"5",efficiency:0},ultiRing:{level:"0",efficiency:0},durabilityRing:{level:"0",efficiency:0}},entireStat:{str:"13024",dex:"11797",int:"109057",luk:"17228"},isGMS:true,isTMS:false,isMSEA:false,isJMS:false,power:{mainStatBase:0,mainStatPer:0,mainStatAbs:0,subStatBase:0,subStatPer:0,subStatAbs:0,ssubStatBase:0,ssubStatPer:0,ssubStatAbs:0,atk:0,atkPer:0,bossDmg:0,criDmg:0},huntSkill:{solJanus:"30",erdaShower:"30"}}
  };

  try {
    var enc = encodeURIComponent(selKo);
    var res = await fetch('https://sorryconversionpeople.satsivi-ow.workers.dev/api/calc/hexa-order?class='+enc, {
      method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(body)
    });
    if (!res.ok) throw new Error('HTTP '+res.status);
    var data = await res.json();
    render(data, csearch.value, selKo);
  } catch(err) {
    document.getElementById('results').innerHTML = '<div class="err">Request failed: '+err.message+'</div>';
  } finally {
    btn.disabled = false;
  }
}
