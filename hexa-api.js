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

function setPayload(btn, val) {
  document.querySelectorAll('.ptbtn').forEach(function(b){ b.classList.remove('on'); });
  btn.classList.add('on');
  document.getElementById('payload-toggle').value = val;
}

// ── Base payloads ────────────────────────────────────────────────────────────
var PAYLOAD_MULE = {"myHexa":{"skillCore1":"0","skillCore2":"0","masteryCore1":"0","masteryCore2":"0","masteryCore3":"0","masteryCore4":"0","reinCore1":"0","reinCore2":"0","reinCore3":"0","reinCore4":"0","generalCore2":"0","hexaStat":3,"character_class":"   ","hexaSkill":{"skillCore1":0,"skillCore2":0,"masteryCore1":0,"masteryCore2":0,"masteryCore3":0,"masteryCore4":0,"reinCore1":0,"reinCore2":0,"reinCore3":0,"reinCore4":0},"hexaSkill_general":{"generalCore1":0},"hexaSkill_used":{"sole_Erda":15,"sole_ErdaPrice":0},"hexaStat_opened":false},"specEff":{"dmgeff1":0.0010481469392156217,"atkeff1":0.00036484082122312245,"atkPereff1":0.004638046825720554,"cridmgeff1":0.003558718861209842,"igreff1":0.00022956727257361642,"mainStateff1":0.0001172730255902652,"mainStatPereff1":0.0012453749778095764,"mainStatAbseff1":2.151798634683777e-05,"subStateff1":1.2534227047032997e-05,"subStatPereff1":0.00017209009580883405,"subStatAbseff1":5.379496586709332e-06,"ssubStateff1":0,"ssubStatPereff1":0,"ssubStatAbseff1":0,"allStatEff":0.001417465073618411,"igreffminus40":-0.015304484838247312,"igreffminus35":-0.012361314677046042,"igreffminus30":-0.009838597396016224,"igreffminus20":-0.005739181814342853,"igreffminus15":-0.004051187163065295,"igreffminus10":-0.0025507474730414037,"igreff1_380":0.0002925763037686657,"igreffminus40_380":-0.01950508691791497,"igreffminus35_380":-0.0157541086644698,"igreffminus30_380":-0.012538984447231005,"igreffminus20_380":-0.0073144075942183084,"igreffminus15_380":-0.005163111242977303,"igreffminus10_380":-0.0032508478196527912},"sole":false,"suro":false,"cycle":"3","userStat":{"doping":{"bigHero":false,"greatIgnoreGuard":false,"dragonsMeal":false,"extreme":true,"fish":false,"guildBlessing":false,"jangBi":false,"legendHero":false,"legendHp":false,"rebootAtkPotion":false,"shiningRed":true,"shiningBlue":false,"statPotion":true,"stat":"30","superPower":false,"unionsPower":true,"urus":false,"heroesHawl":true,"noblessBoss":true,"noblessDmg":true,"noblessCriDmg":true,"noblessIgnore":false,"nobless":["15","15","15","13"],"sayram":true,"collector":false,"buff275":false,"additional1":true,"additional2":false,"championAll":"0","championAtk":"0","championBoss":"0","championIgnore":"0","championCriDmg":"0","authenticDmg":false,"moonshine":false,"cake":false,"apple":false,"tengu":false,"candy":false,"house":false,"wedding":false,"specialWedding":false,"whiteBear":false,"ultraVip":false,"superVip":false,"truffle":false,"medal":false,"hyperRainbow":false,"rainbow":false,"thanks":false},"linkSkill":{"ark":"3","illium":"3","kadena":"3","kain":"3","magician":"9","thief":"9","angel":"3","hoyoung":"0","mukhyun":"3","mihile":"0","kaiser":"0","hayato":"0","kanna":"3"},"special":{"isReboot":true,"combat":true,"epiSoul":"0","mugongSoul":"0","genesis":true,"destiny":true,"oneHandSword":false,"useRuinForceShild":false,"useContinuousRingAsMainRing":false,"restraintRing":"4","weaponRing":"0","riskTaker":"0","ringOfSum":"0","statThird":"13024","statFourth":"11797","continuosRing":"5","challenge":false,"is30min":false,"destiny2ndSkill":false},"stat":{"myClass":"   ","level":"260","mainStatBase":"5116","mainStatPer":"445","mainStatAbs":"12950","subStatBase":"3154","subStatPer":"133","subStatAbs":"470","ssubStatBase":"0","ssubStatPer":"0","ssubStatAbs":"0","arcaneForce":"1340","authenticForce":"20","atkBase":"2545","atkAbs":"0","dmg":"115","bossDmg":"377","normalDmg":"12","ignoreDef":"98.36","buffDuration":"94","critical":"100","criticalDmg":"108","weaponAtk":"577","atkPercent":"74","coolTimeReducePercent":"6","coolTimeReduce":"0","wildhunterUnion":"260","resetCoolDown":"7.5","statusAdditionalDmg":"22","passiveSkillLevelUp":false,"increaseTarget":false,"summonPersistTime":"15","artifact_increaseTarget":true,"artifact_finalAttack":"15","subStat_hyper":"","subStat_ability":"","subStat_union":"","subStat_doping":"","subStat_afterDoping":"","ssubStat_hyper":"","ssubStat_ability":"","ssubStat_union":"","ssubStat_doping":"","ssubStat_afterDoping":"","ignoreElementalResist":"4","maple_combatPower":"","tms_fd":"0"},"hexa":{"skillCore1":"0","skillCore2":"0","masteryCore1":"0","masteryCore2":"0","masteryCore3":"0","masteryCore4":"0","reinCore1":"0","reinCore2":"0","reinCore3":"0","reinCore4":"0","generalCore2":"0","hexaStat":3,"character_class":"   ","hexaSkill":{"skillCore1":0,"skillCore2":0,"masteryCore1":0,"masteryCore2":0,"masteryCore3":0,"masteryCore4":0,"reinCore1":0,"reinCore2":0,"reinCore3":0,"reinCore4":0},"hexaSkill_general":{"generalCore1":0},"hexaSkill_used":{"sole_Erda":15,"sole_ErdaPrice":0},"hexaStat_opened":false},"seedRing":{"restraintRing":{"level":"4","efficiency":27.027027027027017},"weaponRing":{"level":"0","efficiency":0},"ringOfSum":{"level":"0","efficiency":0},"riskTakerRing":{"level":"0","efficiency":0},"criDamageRing":{"level":"0","efficiency":0},"levelRing":{"level":"0","efficiency":0},"continuosRing":{"level":"5","efficiency":0},"ultiRing":{"level":"0","efficiency":0},"durabilityRing":{"level":"0","efficiency":0}},"entireStat":{"str":"13024","dex":"11797","int":"109057","luk":"17228"},"isGMS":true,"isTMS":false,"isMSEA":false,"isJMS":false,"power":{"mainStatBase":0,"mainStatPer":0,"mainStatAbs":0,"subStatBase":0,"subStatPer":0,"subStatAbs":0,"ssubStatBase":0,"ssubStatPer":0,"ssubStatAbs":0,"atk":0,"atkPer":0,"bossDmg":0,"criDmg":0},"huntSkill":{"solJanus":"0","erdaShower":"0"}}};
var PAYLOAD_ENDGAME = {"myHexa":{"skillCore1":"0","skillCore2":"0","masteryCore1":"0","masteryCore2":"0","masteryCore3":"0","masteryCore4":"0","reinCore1":"0","reinCore2":"0","reinCore3":"0","reinCore4":"0","generalCore2":"0","hexaStat":0,"character_class":"   ","hexaSkill":{"skillCore1":0,"skillCore2":0,"masteryCore1":0,"masteryCore2":0,"masteryCore3":0,"masteryCore4":0,"reinCore1":0,"reinCore2":0,"reinCore3":0,"reinCore4":0},"hexaSkill_general":{"generalCore1":0},"hexaSkill_used":{"sole_Erda":0,"sole_ErdaPrice":0},"hexaStat_opened":false},"specEff":{"dmgeff1":0.0008434917877429005,"atkeff1":0.00020429009193057013,"atkPereff1":0.004332755632582286,"cridmgeff1":0.0029610195437406173,"igreff1":0.00015344729257571466,"mainStateff1":7.769694156584573e-05,"mainStatPereff1":0.0008620324309052198,"mainStatAbseff1":1.0090511891668319e-05,"subStateff1":6.331796212021734e-06,"subStatPereff1":0.00011646973350958101,"subStatAbseff1":2.522627972917135e-06,"ssubStateff1":0,"ssubStatPereff1":0,"ssubStatAbseff1":0,"allStatEff":0.0009785021644148008,"igreffminus40":-0.010229819505058302,"igreffminus35":-0.008262546523316594,"igreffminus30":-0.006576312538965956,"igreffminus20":-0.003836182314396752,"igreffminus15":-0.0027078933983980535,"igreffminus10":-0.001704969917510013,"igreff1_380":0.00019516517239082098,"igreffminus40_380":-0.013011011492733426,"igreffminus35_380":-0.010508893897977378,"igreffminus30_380":-0.008364221673899941,"igreffminus20_380":-0.0048791293097749655,"igreffminus15_380":-0.003444091277488681,"igreffminus10_380":-0.0021685019154560337},"sole":false,"suro":false,"cycle":"3","userStat":{"doping":{"bigHero":false,"greatIgnoreGuard":false,"dragonsMeal":false,"extreme":true,"fish":false,"guildBlessing":true,"jangBi":true,"legendHero":false,"legendHp":false,"rebootAtkPotion":false,"shiningRed":true,"shiningBlue":false,"statPotion":true,"stat":"30","superPower":true,"unionsPower":true,"urus":true,"heroesHawl":true,"noblessBoss":true,"noblessDmg":true,"noblessCriDmg":true,"noblessIgnore":true,"nobless":["15","15","15","9"],"sayram":true,"collector":true,"buff275":true,"additional1":true,"additional2":false,"championAll":"5","championAtk":"5","championBoss":"5","championIgnore":"5","championCriDmg":"5","house":true,"candy":true,"moonshine":false,"apple":true,"cake":false,"tengu":false,"whiteBear":false,"specialWedding":true,"wedding":true},"linkSkill":{"ark":"0","illium":"0","kadena":"3","kain":"3","magician":"9","thief":"9","angel":"3","hoyoung":"0","mukhyun":"3","mihile":"0","kaiser":"0","kanna":"3"},"special":{"isReboot":true,"combat":true,"epiSoul":"0","mugongSoul":"0","genesis":true,"oneHandSword":false,"useRuinForceShild":false,"useContinuousRingAsMainRing":true,"restraintRing":"4","weaponRing":"4","ringOfSum":"4","statThird":"7702","statFourth":"7921","continuosRing":"5","challenge":false},"stat":{"myClass":"   ","level":"293","mainStatBase":"7714","mainStatPer":"670","mainStatAbs":"30300","subStatBase":"4485","subStatPer":"151","subStatAbs":"500","ssubStatBase":"0","ssubStatPer":"0","ssubStatAbs":"0","arcaneForce":"1350","authenticForce":"770","atkBase":"4234","atkAbs":"0","dmg":"118","bossDmg":"528","normalDmg":"37","ignoreDef":"98.54","buffDuration":"100","critical":"101","criticalDmg":"152.1","weaponAtk":"871","atkPercent":"108","coolTimeReducePercent":"6","coolTimeReduce":"4","wildhunterUnion":"250","resetCoolDown":"17.5","statusAdditionalDmg":"23","passiveSkillLevelUp":false,"increaseTarget":false,"summonPersistTime":"10","artifact_increaseTarget":true,"artifact_finalAttack":"30","subStat_hyper":"","subStat_ability":"","subStat_union":"","subStat_doping":"","subStat_afterDoping":"","ssubStat_hyper":"","ssubStat_ability":"","ssubStat_union":"","ssubStat_doping":"","ssubStat_afterDoping":"","ignoreElementalResist":"5","maple_combatPower":"","tms_fd":"0"},"hexa":{"skillCore1":"0","skillCore2":"0","masteryCore1":"0","masteryCore2":"0","masteryCore3":"0","masteryCore4":"0","reinCore1":"0","reinCore2":"0","reinCore3":"0","reinCore4":"0","generalCore2":"0","hexaStat":0,"character_class":"   ","hexaSkill":{"skillCore1":0,"skillCore2":0,"masteryCore1":0,"masteryCore2":0,"masteryCore3":0,"masteryCore4":0,"reinCore1":0,"reinCore2":0,"reinCore3":0,"reinCore4":0},"hexaSkill_general":{"generalCore1":0},"hexaSkill_used":{"sole_Erda":0,"sole_ErdaPrice":0},"hexaStat_opened":false},"seedRing":{"restraintRing":{"level":"4","efficiency":35.08771929824559},"weaponRing":{"level":"4","efficiency":19.951847813178137},"ringOfSum":{"level":"4","efficiency":21.685758396942422},"riskTakerRing":{"level":"4","efficiency":21.92982456140351},"criDamageRing":{"level":"4","efficiency":8.482278097546203},"levelRing":{"level":"4","efficiency":7.307040367943163},"continuosRing":{"level":"5","efficiency":22.212102955309643},"ultiRing":{"level":"0","efficiency":0},"durabilityRing":{"level":"0","efficiency":0}},"entireStat":{"str":"14093","dex":"97828","int":"8756","luk":"9753"},"isGMS":true,"isTMS":false,"power":{"mainStatBase":0,"mainStatPer":0,"mainStatAbs":0,"subStatBase":0,"subStatPer":0,"subStatAbs":0,"ssubStatBase":0,"ssubStatPer":0,"ssubStatAbs":0,"atk":0,"atkPer":0,"bossDmg":0,"criDmg":0},"huntSkill":{"solJanus":"30","erdaShower":"25"},"isJMS":false,"isMSEA":false}};

function getBasePayload() {
  return JSON.parse(JSON.stringify(
    document.getElementById('payload-toggle').value === 'endgame' ? PAYLOAD_ENDGAME : PAYLOAD_MULE
  ));
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

  var body = getBasePayload();
  body.cycle = cycle;

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
