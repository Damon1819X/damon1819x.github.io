/* ================================================================
   立绘库（v25）：玩家初始形象，装备页替代假人显示
   ================================================================ */
const LIHUI=[
  {id:"boy1", name:"少年·一", src:"贴图/立绘/少年1.png"},
  {id:"boy2", name:"少年·二", src:"贴图/立绘/少年2.png"},
  {id:"girl1", name:"少女·一", src:"贴图/立绘/少女1.png"},
  {id:"girl2", name:"少女·二", src:"贴图/立绘/少女2.png"},
  {id:"male1", name:"男修·一", src:"贴图/立绘/男1.png"},
  {id:"male2", name:"男修·二", src:"贴图/立绘/男2.png"},
  {id:"male3", name:"男修·三", src:"贴图/立绘/男3.png"},
  {id:"male4", name:"男修·四", src:"贴图/立绘/男4.png"},
  {id:"fem1", name:"女修·一", src:"贴图/立绘/女1.png"},
  {id:"fem2", name:"女修·二", src:"贴图/立绘/女2.png"},
  {id:"fem3", name:"女修·三", src:"贴图/立绘/女3.png"},
  {id:"fem4", name:"女修·四", src:"贴图/立绘/女4.png"},
  {id:"myst", name:"神秘修士", src:"贴图/立绘/神秘修士.png"},
];
function avatarObj(){ return LIHUI.find(x=>x.id===S.avatar)||LIHUI[4]; } // 默认男修·一

/* 装备页更换形象：免费 5 次，之后每次 50 上品灵石（v26.5） */
const AVATAR_FREE_N=5, AVATAR_FEE_H=50;
function openAvatarPick(){
  const mask=document.createElement("div");mask.className="eqPickMask";
  mask.onclick=(ev)=>{ if(ev.target===mask) mask.remove(); }; // 点遮罩=取消：形象不变、次数不减
  const box=document.createElement("div");box.className="eqPickBox";
  const t=document.createElement("div");t.className="eqTitle";t.textContent="选择人物形象";box.appendChild(t);
  const info=document.createElement("div");info.className="hint";box.appendChild(info);
  const grid=document.createElement("div");grid.className="avGrid";box.appendChild(grid);
  const btnRow=document.createElement("div");btnRow.style.cssText="display:flex;gap:8px;justify-content:flex-end;margin-top:12px;";
  const okBtn=document.createElement("button");okBtn.className="goldBtn";okBtn.textContent="确认";
  const cancelBtn=document.createElement("button");cancelBtn.className="ghostBtn";cancelBtn.textContent="取消";
  btnRow.appendChild(cancelBtn);btnRow.appendChild(okBtn);
  box.appendChild(btnRow);
  mask.appendChild(box);document.body.appendChild(mask);
  let picked=S.avatar; // 预览候选；确认前不写入 S.avatar
  const pickedName=()=>{ const a=LIHUI.find(x=>x.id===picked); return a?a.name:"未知"; };
  function updateInfo(){
    const left=Math.max(0,AVATAR_FREE_N-(S.avatarUses||0));
    info.innerHTML="免费更换剩余 <b>"+left+"</b> 次，用完后每次更换消耗 <b>"+AVATAR_FEE_H+" 上品灵石</b>。点击立绘预览，确认后生效。";
    okBtn.textContent=(picked===S.avatar)?"确认（未变更）":"确认更换 · "+pickedName();
  }
  function draw(){
    updateInfo();
    grid.innerHTML="";
    LIHUI.forEach(a=>{
      const c=document.createElement("div");
      c.className="avCell"+(picked===a.id?" sel":"");
      c.innerHTML='<img src="'+a.src+'" alt="'+a.name+'"><div class="avNm">'+a.name+'</div>';
      c.onclick=()=>{ picked=a.id; blip(); draw(); }; // 仅预览：高亮候选、更新确认按钮文案
      grid.appendChild(c);
    });
  }
  okBtn.addEventListener("click",()=>{
    if(picked===S.avatar){ mask.remove(); return; } // 未变更：直接关闭
    if((S.avatarUses||0)<AVATAR_FREE_N){ S.avatar=picked; S.avatarUses=(S.avatarUses||0)+1; blip(); }
    else if(payL({l:0,m:0,h:AVATAR_FEE_H,t:0,g:0})){ S.avatar=picked; blip(); }
    else { banner("上品灵石不足：更换形象需 "+AVATAR_FEE_H+" 上品灵石"); return; }
    save(); renderTab(); mask.remove(); // 生效：持久化并重渲染装备页（立绘 + 剩余次数）
  });
  cancelBtn.addEventListener("click",()=>{ mask.remove(); }); // 取消：恢复原形象（未写入 S.avatar）
  draw();
}

/* ================================================================
   新手指引（v18.4）
   ================================================================ */
const TUT_STEPS=[
  {t:"— 仙途伊始 · 一 —", b:"混沌初开，天地灵气沉浮。你的一缕真灵穿越虚空，坠入这方修仙世界——百族林立，宗门如云，凡人寿不过百，唯有踏入仙途，方可超脱生死轮回。"},
  {t:"— 仙途伊始 · 二 —", b:"你自荒山野岭中醒来，衣衫褴褛，周身灵气稀薄，却隐隐感到体内灵根暗藏、气机勃发。这是你的新生，也是你问道长生的起点。"},
  {t:"— 仙途伊始 · 三 —", b:"临行前，为自己取一个行走修仙界的名号吧。这个名字将伴随你从炼气到飞升，被世间道友传颂。", input:true},
  {t:"— 仙途伊始 · 四 —", b:"选定你的初始形象。它将显示在装备页，伴随你行走修仙界、问道长生。", avatar:true},
  {t:"— 修炼 —", menu:"cult", b:"请点击左侧菜单栏<b>『修炼』</b>（当前即在此页）。点击『盘膝打坐 · 开始运功』即可开始积累灵气，灵气满额后可尝试『突破』冲击更高境界。<br><br>注意：灵气产出默认暂停，仅在运功时产出；运功与采集 / 制造互斥，停止运功即停止产出。"},
  {t:"— 采集 —", menu:"cai", b:"请点击左侧菜单栏<b>『采集』</b>。『采集』可狩猎 / 挖矿 / 采药，随机获得妖兽材料、矿石与草药；还可选择外围 / 中部 / 核心区域，区域越深稀有材料越多。"},
  {t:"— 制造 —", menu:"zao", b:"请点击左侧菜单栏<b>『制造』</b>。『制造』以材料合成符箓、丹药、装备与阵法，分制符 / 炼丹 / 炼器 / 阵法四类配方。<br><br>所有材料与成品都存放在<b>『须弥空间』</b>（菜单栏『须弥空间』），可随时使用或出售。"},
  {t:"— 傀儡 —", menu:"pu", b:"请点击左侧菜单栏<b>『傀儡』</b>。『傀儡』可替你自动采集或制造：玉傀效率最高（玩家 90%）、木傀最低（40%）。指派任务后自动持续产出，点击红色『停止』按钮即可随时停止。"},
  {t:"— 灵根 —", roots:true, b:""},
];
let tutStep=-2; // -2 询问态
function openTutAsk(){ tutStep=-2; renderTut(); $("tutOverlay").classList.add("show"); }
function startTut(){ tutStep=0; renderTut(); }
function skipTut(){ S.tut="skip"; tutStep=TUT_STEPS.findIndex(s=>s.input); renderTut(); }
function tutNext(){
  if(tutStep===-2){ startTut(); return; }
  const st=TUT_STEPS[tutStep];
  if(st && st.input){
    const nm=$("tutName").value.trim().slice(0,12);
    if(!nm){ $("tutName").style.borderColor="#e05555"; $("tutName").placeholder="请输入道号后再继续…"; return; }
    $("tutName").style.borderColor=""; S.name=nm;
    if(S.tut==="skip"){ tutStep=TUT_STEPS.findIndex(s=>s.avatar); renderTut(); return; } // 直接开始也强制选择形象
  }
  if(st && st.avatar){
    if(!S.avatar){ banner("请先选择你的初始形象"); return; }
    if(S.tut==="skip"){ finishTut(); return; } // 直接开始：选完形象即完成创建
  }
  tutStep++;
  if(tutStep>=TUT_STEPS.length){ finishTut(); return; }
  renderTut();
}
function renderTut(){
  if(tutStep===-2){
    $("tutTitle").textContent="— 新手指引 —";
    $("tutBody").innerHTML="你即将重生在一个<b>修仙异世界</b>：百族林立、宗门如云，凡人唯有踏上仙途方能超脱生死。<br><br>是否开启<b>新手指引</b>，快速了解如何修炼、采集制造与驱使傀儡？";
    $("tutNameWrap").style.display="none";
    $("tutSkip").style.display="inline-block"; $("tutSkip").textContent="直接开始";
    $("tutNext").textContent="开始指引";
    return;
  }
  const st=TUT_STEPS[tutStep];
  $("tutTitle").textContent=st.t;
  $("tutBody").innerHTML=st.b;
  $("tutNameWrap").style.display=st.input?"block":"none";
  $("tutSkip").style.display=(tutStep===-2)?"inline-block":"none"; // v30.8.3 选择开始指引后不再显示跳过按钮
  $("tutNext").textContent=(tutStep===TUT_STEPS.length-1)?"去选择灵根":"下一步";
  if(st.avatar) renderAvatarPick();
  if(st.roots) renderTutRoots();
  // v30.8.2 引导点击菜单：功能步遮罩穿透（可点左侧菜单），点击对应菜单后自动进入下一步
  const loose=!!st.menu;
  $("tutOverlay").classList.toggle("tutLoose", loose);
  $("tutNext").style.display=loose?"none":"";
  if(st.menu){
    const tip=document.createElement("div");
    tip.style.cssText="margin-top:10px;padding:8px 12px;border-radius:8px;background:linear-gradient(135deg,rgba(224,185,94,.18),rgba(224,185,94,.06));border:1px solid rgba(224,185,94,.4);color:var(--gold);font-weight:700;font-size:13px;";
    tip.innerHTML="👆 请点击左侧菜单栏『"+TUT_MENU_NM[st.menu]+"』查看";
    $("tutBody").appendChild(tip);
  }
}
const TUT_MENU_NM={cult:"修炼",cai:"采集",zao:"制造",pu:"傀儡"};
function renderTutRoots(){
  const box=$("tutBody");
  box.innerHTML='<div style="font-size:13px;line-height:1.7;color:var(--ink-dim)">即将为你<b>随机分配</b>一个灵根（可免费重刷 5 次）。先了解各灵根的特殊属性：</div>'
  +'<div style="max-height:300px;overflow-y:auto;margin-top:8px;border:1px solid var(--line);border-radius:10px;padding:10px 12px;background:var(--panel)">'
  +'<div style="font-weight:700;color:var(--gold);margin:4px 0">— 五行灵根（灵根越少修炼越快、战力越强、突破越难）—</div>'
  +'<table style="width:100%;font-size:12px;border-collapse:collapse;margin:4px 0"><tr style="color:var(--ink-dim)"><td style="padding:2px 4px">灵根</td><td style="padding:2px 4px">修炼速度</td><td style="padding:2px 4px">突破所需灵力</td><td style="padding:2px 4px">突破上限</td><td style="padding:2px 4px">战力</td></tr>'
  +'<tr><td style="padding:2px 4px">单灵根（金/木/水/火/土）</td><td style="padding:2px 4px">×2.0</td><td style="padding:2px 4px">×0.4</td><td style="padding:2px 4px">10%</td><td style="padding:2px 4px">+30%</td></tr>'
  +'<tr><td style="padding:2px 4px">双灵根</td><td style="padding:2px 4px">×1.6</td><td style="padding:2px 4px">×0.6</td><td style="padding:2px 4px">20%</td><td style="padding:2px 4px">+25%</td></tr>'
  +'<tr><td style="padding:2px 4px">三灵根</td><td style="padding:2px 4px">×1.3</td><td style="padding:2px 4px">×0.8</td><td style="padding:2px 4px">30%</td><td style="padding:2px 4px">+20%</td></tr>'
  +'<tr><td style="padding:2px 4px">四灵根</td><td style="padding:2px 4px">×1.15</td><td style="padding:2px 4px">×1.0</td><td style="padding:2px 4px">40%</td><td style="padding:2px 4px">+15%</td></tr>'
  +'<tr><td style="padding:2px 4px">五灵根</td><td style="padding:2px 4px">×1.0</td><td style="padding:2px 4px">×1.25</td><td style="padding:2px 4px">50%</td><td style="padding:2px 4px">+10%</td></tr>'
  +'</table>'
  +'<div style="font-weight:700;color:var(--gold);margin:8px 0 4px">— 变异灵根（修炼 ×1.8~2.2 · 突破所需灵力 ×0.4 · 上限 35% · 基础战力 +20%，各带特殊属性）—</div>'
  +'<div style="line-height:1.9">❄️ 冰灵根：突破概率 +8%<br>⚡ 雷灵根：会心 +20%<br>🌪️ 风灵根：战斗速度 +15%、闪避 +10%<br>☠️ 毒灵根：战力 +25%<br>☯️ 阴阳灵根：大道碎片 +25%</div>'
  +'<div style="font-size:12px;color:var(--ink-dim);margin-top:6px">变异灵根同样可能随机刷出，各有独立特性，不套用五行梯度。</div>'
  +'</div>';
}
function renderAvatarPick(){
  const box=$("tutBody");
  let grid=box.querySelector(".avGrid");
  if(!grid){ grid=document.createElement("div"); grid.className="avGrid"; box.appendChild(grid); }
  grid.innerHTML="";
  LIHUI.forEach(a=>{
    const c=document.createElement("div");
    c.className="avCell"+(S.avatar===a.id?" sel":"");
    c.innerHTML='<img src="'+a.src+'" alt="'+a.name+'"><div class="avNm">'+a.name+'</div>';
    c.onclick=()=>{ S.avatar=a.id; renderAvatarPick(); };
    grid.appendChild(c);
  });
}
function finishTut(){
  const nm=S.name||"无名散修"; S.name=nm;
  if(!S.avatar) S.avatar=LIHUI[4].id; // 未选时默认男修·一
  S.tut="done";
  $("tutOverlay").classList.remove("show");
  sound(700,.2); banner("欢迎来到修仙界，"+nm+"！");
  logEvent("道友「"+nm+"」踏入仙途，新手指引完成",'sys');
  if(!S.root) openReroll();
  save(); render();
}

/* ================================================================
   刷灵根弹窗
   ================================================================ */
function randomRoot(){ return ROOTS[Math.floor(Math.random()*ROOTS.length)]; }
let rrCand=null;
function openReroll(){
  rrCand=randomRoot();
  renderRr();
  $("rrOverlay").classList.add("show");
}
function renderRr(){
  const r=rrCand;
  const free=S.freeRolls>0;
  const extra=r.extra? Object.entries(r.extra).map(([k,v])=> (({break:"突破额外+"+Math.round(v*100)+"%",crit:"会心+"+Math.round(v*100)+"%",offline:"离线+"+Math.round(v*100)+"%",prod:"生产+"+Math.round(v*100)+"%",dao:"大道碎片+"+Math.round(v*100)+"%"})[k])).join(" · ") : "";
  $("rrBody").innerHTML=`<div style="font-size:16px;font-weight:700">${r.ic} ${r.name}</div>
    <div style="margin:8px 0">${r.elems.map(e=>`<span class="rootChip">${e}</span>`).join("")}</div>
    <div style="font-size:13px;color:var(--ink-dim)">${r.ds}</div>
    <div class="ln" style="margin-top:6px">修炼速度 ×${r.speed} · 突破上限 ${Math.round(r.breakCap*100)}% · 突破灵力 ×${r.reqMult} · 战斗 +${Math.round(r.combat*100)}%</div>
    ${extra?`<div class="ln">${extra}</div>`:""}`;
  const rp=splitPriceL(rerollCostL());
  $("rrAgain").disabled = !free && !canPayL(rp);
  $("rrAgain").textContent = free ? "再刷一次（免费 · 剩 "+S.freeRolls+"）" : ("再刷一次（"+priceLText(rp)+"）");
  $("rrHint").textContent = free ? "开局免费 "+CFG.freeRerolls+" 次，之后以灵石付费刷取。" : "免费次数已用完，需花费灵石刷取。";
}
function rrKeep(){
  S.root=rrCand; S.freeRolls=0;
  S.skills=starterSkillsFor(S.root); // 定根赠各元素入门法术；进阶法术与身法需坊市购书学习
  logEvent("定根：「"+S.root.name+"」（修炼 ×"+S.root.speed+"·突破上限 "+Math.round(S.root.breakCap*100)+"%·突破灵力 ×"+S.root.reqMult+"）",'sys');
  logEvent("习得入门法术："+S.skills.map(id=>SPELLS_BY_ID[id].name).join("、")+"；更多灵根技能与身法可至坊市购书学习",'sys');
  $("rrOverlay").classList.remove("show");
  sound(700,.2); banner("灵根已定："+S.root.name);
  checkAchievements(); save(); render();
}
function rrAgain(){
  if(S.freeRolls>0){ S.freeRolls--; }
  else if(canPayL(splitPriceL(rerollCostL()))){ payL(splitPriceL(rerollCostL())); S.paidRolls++; }
  else return;
  rrCand=randomRoot();
  renderRr(); sound(430,.1);
}
$("tutNext").addEventListener("click",()=>tutNext());
$("tutSkip").addEventListener("click",()=>skipTut());
$("tutName").addEventListener("keydown",e=>{ if(e.key==="Enter") tutNext(); });
$("rrKeep").addEventListener("click",()=>rrKeep());
$("sellOk").addEventListener("click",()=>{ if(sellRef){ const q=parseInt($("sellQty").value)||0; sellTres(q); } closeSell(); });
$("sellCancel").addEventListener("click",closeSell);
$("cycQtyOk").addEventListener("click",()=>{ setCycQty(); });
$("cycQtyCancel").addEventListener("click",closeCycQty);
$("rrAgain").addEventListener("click",()=>rrAgain());

/* ================================================================
   设置 / 主题
   ================================================================ */
function applyTheme(t){
  document.documentElement.setAttribute("data-theme", t);
  document.querySelectorAll("#themeBtns button").forEach(b=>b.classList.toggle("sel", b.dataset.theme===t));
}
function renderSetModal(){
  $("setVer").textContent=VERSION+" · ruleset "+RULESET_ID;
  document.querySelectorAll("#themeBtns button").forEach(b=>b.classList.toggle("sel", b.dataset.theme===S.settings.theme));
}
$("settingsBtn").addEventListener("click",()=>{ renderSetModal(); $("setOverlay").classList.add("show"); });
/* 玩家手册 · 图鉴（v30.1）—— 左导航 + 右详情拆解，如图例 */
const MANUAL_SECTIONS=[
  {t:"入门总览", ic:"🧭", secs:[
    {h:"目标", b:"从炼气一路修到真仙，飞升换取<b>大道碎片</b>做永久成长。单次打开 5~10 分钟就能看到明显推进，离线也有收益。"},
    {h:"核心循环", b:"<b>运功</b>产灵力 → <b>突破</b>境界，解锁设施与区域；<b>采集</b>材料 → <b>制造</b>成品 → <b>出售</b>换灵石 → 买<b>强化设施</b>与功法技能。<b>探索</b>秘境产出材料、灵力与灵兽蛋。"},
    {h:"互斥关系", b:"<b>运功 / 采集（含挂机）/ 制造 / 探索</b> 同一时间只能进行一项：开始运功会停掉采集挂机，进入探索会自动停掉运功、炼制、循环制造与挂机采集，反之亦然。探索中刷新或重开页面会自动恢复未结束的探索界面，继续深入或撤出即可；探索期间运功、采集、制造（含傀儡制造）均不可用。"},
    {h:"界面", b:"左栏菜单（14 项）／中栏内容（滚动区）／右栏事件日志（可按 系统·交易·采集·制造·强化 过滤）。顶部为道号、灵力、境界、灵根与大道碎片；下方货币栏含五品灵石与气血。"},
    {h:"事件日志可收起", b:"日志左边界有一条竖排按钮：点 <b>›</b> 收起右栏，中栏自动加宽；收起后按钮固定在屏幕右侧，箭头变为 <b>‹</b>，再点一次恢复日志。收起状态会被记住，下次打开沿用上次的选择。"},
    {h:"新手指引", b:"首次进入会询问是否开启指引：道号必填 → 选择立绘 → 刷取灵根（免费 10 次）。指引可随时跳过（仍要填道号）。"},
  ]},
  {t:"创建角色", ic:"🧑‍🚀", secs:[
    {h:"道号", b:"3 步指引第 3 页输入，必填、最多 12 字；显示在顶栏与日志。之后不可改名（重生可重来）。"},
    {h:"立绘", b:"13 张初始形象（少年/少女/男修/女修/神秘修士）。选定后在「装备」页「选择人物形象」可更换：前 5 次免费，之后每次 50 上品灵石。"},
    {h:"灵根", b:"开局 10 次免费刷取；用完后以灵石付费（100 下品 × 1.5^已刷次数），且需持有对应各品灵石。定根后不可更改（重生可重置）。详见「灵根」。"},
  ]},
  {t:"灵根", ic:"🌟", secs:[
    {h:"总览", b:"共 31 种：单灵根 5、相生双灵根 5、三灵根 10、四灵根 5、五灵根 1、变异灵根 5。决定修炼速度、突破需求倍率、突破成功率上限、战力加成。"},
    {h:"五行梯度", b:"单：修炼×2.0 / 突破需求×0.4 / 上限 10% / 战斗 +30%；双：×1.6 / ×0.6 / 20% / +25%；三：×1.3 / ×0.8 / 30% / +20%；四：×1.15 / ×1.0 / 40% / +15%；五：×1.0 / ×1.25 / 50% / +10%。<br>即：<b>灵根越纯修炼越快、战力越高，但突破上限越低</b>；越杂突破越稳、修炼越慢。"},
    {h:"变异灵根", b:"冰/雷/风/毒/阴阳：修炼×1.8（阴阳×2.2）、突破需求×0.4、上限 35%、战斗 +20%（毒 +25%）。专属：冰 突破+8%、雷 会心+20%、风 速度+15% 且闪避+10%、毒 战力额外+25%、阴阳 大道碎片+25%。"},
    {h:"元素亲和（采集）", b:"单灵根额外获得对应采集类的区域上限 +1（封顶稀8）：<b>金/土 → 挖矿</b>、<b>木 → 采药</b>、<b>水/火 → 狩猎</b>。多灵根无亲和。"},
    {h:"怎么选", b:"想快刷灵石/战力走单灵根或毒变异；想稳突破走五灵根。灵根战斗加成直接并入战力，元素还决定你能学哪些法术（见「法术与技能槽」）。"},
  ]},
  {t:"境界与突破", ic:"🧘", secs:[
    {h:"十重境界", b:"炼气(需求0,×1) → 筑基(1.6万,×3) → 金丹(24万,×10) → 元婴(400万,×35) → 化神(6400万,×120) → 炼虚(200亿,×420) → 合体(4000亿,×1500) → 大乘(8e12,×5400) → 渡劫(1.6e14,×2万) → 真仙(4e15,×7.5万)。<br>境界倍率直接乘灵气产出；突破需求再乘灵根需求倍率。"},
    {h:"突破成功率", b:"= 灵根上限（10%~50%，变异 35%）+ 突破机缘（每级+2%）+ 突破丹药（2%~10%）+ 符箓（1%~10%）+ 阵法（5%~15%）+ 随机事件（+30%），<b>总上限 80%</b>。"},
    {h:"代价", b:"成功：扣掉所需灵力、境界+1、气血回满。失败：损失<b>所需灵力的 40%</b>，境界不变。"},
    {h:"防连点与留痕", b:"突破按钮 700ms 内重复点击只算一次，且每次突破<b>立即存档</b>；「设置 → 诊断 → 境界记录」可查最近 12 次境界变化（突破/飞升/载入不一致/校正脏值）。"},
    {h:"解锁", b:"筑基解锁探索、金丹解锁会心一击、元婴解锁中部采集/闭关收益、化神可飞升、合体解锁核心采集与 5 台傀儡上限。"},
  ]},
  {t:"运功与灵力", ic:"⏳", secs:[
    {h:"运功", b:"「修炼」页点『盘膝打坐』开始运功，<b>灵气只在运功时产出</b>，无时长上限；点『停止运功』即停产。离线若仍在运功则继续结算（上限 12 小时）。"},
    {h:"会心爆发", b:"每次开始运功按「会心概率」判定一次，触发则本次运功产出 <b>×3</b>（会心概率上限 50%，可由升级、符箓、装备、灵兽、雷灵根叠加）。"},
    {h:"灵力来源", b:"① 灵根修炼：10 × 灵根速度 × 境界倍率 × 修炼加速 × 功法倍率 × 大道碎片加成；② 强化设施的灵气产出；③ 探索战斗胜利（约突破需求×0.1%×场次系数 1/2.5/6×区域难度）；④ 丹药/符箓的灵气增益。"},
    {h:"气血影响", b:"运功产出会乘以当前气血百分比（最低 10%）；气血靠丹药回补，突破成功自动回满。"},
  ]},
  {t:"强化", ic:"🏗️", secs:[
    {h:"设施（10 座）", b:"聚灵阵(炼气)、驭兽台(筑基)、洞府(金丹)、丹药炉(元婴)、仙田(化神)、剑冢(炼虚)、炼丹童子(合体)、灵脉(大乘)、护山大阵(渡劫)、天雷淬体(真仙)。以灵石购买，每级产出 ×1.12~1.19；成本与产出同步增长（约 10 份产出回本）。"},
    {h:"修行升级（5 类）", b:"运功效率(+10%/级·炼气)、修炼加速(+10%/级·炼气)、会心一击(+1%/级·筑基·上限50%)、突破机缘(+2%/级·金丹)、闭关收益(+10%离线效率/级·元婴)。价格每级 ×1.35~1.50。"},
    {h:"解锁与价格", b:"未达境界的设施/升级显示「需突破至 XX 解锁」且不可购买。强化价按<b>下品灵石</b>计价，满 100 自动进位显示（如 108 下品 → 1 中品 8 下品），购买时向下取整到最高面值。"},
  ]},
  {t:"属性面板", ic:"📊", secs:[
    {h:"六维", b:"血气 ⌊100×1.45^境界×(1+装备/灵兽气血%)⌋；攻击 ⌊战力/4⌋；防御＝乘法减伤（上限 70%）；法力＝功法灵力池；速度 100+境界×15+装备速度词条。"},
    {h:"次级属性", b:"命中 基础95%+词条（上限100%）；闪避 基础0%+风灵根10%+词条（上限60%）；暴击＝会心属性+功法+雷灵根20%（上限75%）；暴击伤害 基础×1.5+词条；五行抗性 仅在「被克」时再减免。"},
    {h:"战力公式", b:"100×(1+境界×0.45) ×(1+灵根战斗加成) ×(1+战斗类符箓丹药) ×(1+装备攻击%) ×(1+灵兽攻击%)。攻击、战力都直接受这五项影响。"},
    {h:"查看", b:"左栏「属性」页实时显示六维、次级、五行抗性与来源明细，随境界/装备/灵兽/增益即时刷新。"},
  ]},
  {t:"功法", ic:"📜", secs:[
    {h:"20 本功法", b:"入门→绝品共 20 本，灵气倍率 <b>×1 → ×512</b>；同时提供战斗数值：灵力池 50→168、每回合回灵 10%→16%、以及战斗被动（法系威力、暴击、回血、减伤、身法冷却、回灵率等）。"},
    {h:"获取", b:"只能通过<b>坊市随机刷新</b>或<b>拍卖会</b>买书；无直接购买入口。购得后存于须弥空间。"},
    {h:"激活制", b:"在「功法」页『研习』习得后，点『激活』切换主修——<b>同一时间只有一本生效</b>，灵气倍率与战斗字段取当前激活的那本。开局默认已激活「黄庭经」。"},
  ]},
  {t:"法术与技能槽", ic:"⚔️", secs:[
    {h:"40 种法术", b:"10 个属性（金木水火土 冰雷风毒阴阳）× 4 种 = 2 个伤害法术 + 2 个身法。伤害法术有倍率/耗灵/冷却与附加状态（破甲、减速、燃烧、冰冻、中毒等）；身法提供护盾、减伤、闪避、回血、反伤等。"},
    {h:"学习", b:"定根时赠送<b>各属性首个伤害法术</b>；其余需在坊市买<b>技能书</b>（仅本灵根所含属性可用，买不符的会被拒绝）。技能书也会随机出现在拍卖会。"},
    {h:"技能槽", b:"按灵根扩容（法术/身法/神通）：单 2/1/1、双 3/1/1、三 3/2/1、四 4/2/1、五 4/2/2、变异 2/2/1。战前在「探索」页底部或「装备」页点『配置技能槽』，战斗中不可更换。"},
  ]},
  {t:"神通", ic:"⚡", secs:[
    {h:"12 门神通", b:"以<b>大道碎片</b>购买：下品 20 / 中品 40 / 上品 70 / 极品 110 / 至尊 180 碎片。习得后只能在<b>战斗内</b>以「神通·XX」施展（耗灵 40~120、冷却 4~10 回合），<b>不提供常驻战力或属性加成</b>；碎片也可以不花，留作每点 +5% 修炼。<br>碎片很稀缺：<b>首次飞升约 12 枚</b>，最便宜的神通（20）也要<b>飞升 2 次</b>才买得起，至尊需约 5 次。"},
    {h:"大招速查", b:"太虚剑诀(50灵/5T 单体×2.5)、九转玄功(40/5 回血30%)、御火术(45/4 单体×2.2+灼烧)、天罡北斗阵(60/5 全体×1.6+降攻)、混元一气(50/5 全属性+30%)、呼风唤雨(55/5 全体×1.5+减速)、大衍神算(70/6 闪避+40%必中)、万剑归宗(75/6 全体×2.0)、九霄雷法(80/6 全体×2.2+破甲)、诛仙剑阵(100/8 全体×2.6+破甲)、天魔解体(60/6 自损15% 攻击×2.5+吸血)、法天象地(120/10 全属性+50%+无敌1回合)。"},
    {h:"碎片来源", b:"飞升（主要）、成就、随机事件、阴阳灵根 +25%。"},
  ]},
  {t:"战斗", ic:"🗡️", secs:[
    {h:"流程", b:"探索踩到战斗格进入回合制：按速度决定先手，每回合双方各行动一次，可在右侧列表选择 普攻 / 防御（本回合减伤50%）/ 法术·身法 / 神通 / 道具 / 逃跑。气血归零即败。"},
    {h:"五行克制", b:"金克木·木克土·土克水·水克火·火克金：用克制属性打法伤 <b>×1.35</b>，被克 <b>×0.8</b>。敌人带 1~2 个属性，选对属性收益最大；无属性普攻不吃克制。"},
    {h:"命中与伤害", b:"命中率 = 95% − 敌闪避（下限 5%）；暴击按会心概率触发、伤害 ×1.5（+暴伤词条）；最终伤害再乘（1−敌方减伤），敌方减伤按类型 5%/12%/20%（普通/精英/BOSS）。"},
    {h:"逃跑与失败", b:"逃跑成功率 = 50% +（我方速度−敌速度）×0.1%，区间 5%~90%；失败则敌方追加一击。战斗失败：气血收至 1，被迫撤离并损失 50% 战利品。"},
    {h:"敌方 AI", b:"气血低于 40% 时可能「回气」（回 20% 气血）或「运功蓄势」（攻+30%）；平时按区域元素池施法（普通/精英/BOSS 施法概率 35%/45%/55%），并有对应元素抗性差异。"},
    {h:"久战力竭", b:"第 16 回合起，敌方气血每回合额外流失 <b>4% 上限</b>（无视护盾与减伤），且「回气」只在 1~15 回合内触发。用于终结「护盾越叠越厚 + 低血回气」造成的无限僵持；正常 5~10 回合的战斗不受影响。"},
    {h:"护盾与反伤", b:"护盾/反伤<b>不叠加</b>：重复施放只取较高值并刷新持续回合；状态到期即清除（不会再残留护盾数值被下一次施放累加）。「荆棘反噬」为自身获得反伤。"},
    {h:"战斗中离开与返回", b:"战斗中可点右上「收起战斗（可随时返回）」收起界面；此时「探索」页顶部会出现「战斗进行中」卡片、秘境地图底部出现「⚔ 返回战斗（第 N 回合）」，点任一即可回到原战斗，回合数/血量/灵力/冷却全部保留。战斗结算后这些入口自动消失。"},
    {h:"自动战斗", b:"战斗界面点『自动战斗』：低血优先开护盾/回血/减伤身法，否则使用最省灵力的可用法术。适合挂机刷秘境，但不如手动选克制属性高效。"},
  ]},
  {t:"探索", ic:"🗺️", secs:[
    {h:"四大区域", b:"洞天福地（建议筑基~元婴）、原始禁区（化神~合体）、上古战场（大乘~真仙）、跨界空间（真仙及以上）。炼气期不可探索；区域难度按玩家战力实时评估（毫无难度→九死一生，影响战斗灵力收益倍率 0.4~3.5）。"},
    {h:"蜂窝秘境", b:"每区域 10 层；浅层(1-3)半径 4、中层(4-7)半径 5、深层(8-10)半径 7。格子内容初始为迷雾，走入即揭示并触发，随机再揭开相邻 2 格；已走过的格子可重复行走（用于绕路），但不再触发事件、也不再揭雾。"},
    {h:"格子概率", b:"战斗 35% / 机关 15% / 空白 25% / 妖兽材料 7% / 灵石 6% / 丹药 6% / 符箓 6%；每层另有 1 个『下层入口』（精英守卫，击败才进下一层）；第 10 层 50% 为 BOSS、50% 为出口传送；<b>出口传送与 BOSS 一样会判定出蛋 / 傀儡 / 兽诀掉落</b>，并额外赠一份灵石。"},
    {h:"伤害与难度", b:"机关扣<b>气血上限的 6%</b>（受减伤影响）；普通怪强度 = 全装基准×50%~70%；精英强度相同但施法概率 45%、减伤 12%；BOSS = 全装基准 × 危险系数（洞天1.15 / 禁区1.25 / 战场1.35 / 跨界1.5，后三图额外 ×1.1）。"},
    {h:"结束方式", b:"①通关（击杀 BOSS 或走到出口传送）；②气血耗尽：被迫撤离、损失一半收获；③主动撤出（-50% 气血、-50% 战利品，需二次确认）。三种结束都会弹出<b>收获总结</b>，战利品在「🎒 战利品」页可查明细与估价。"},
    {h:"秘境界石块位", b:"灵石掉落按区域：洞天=下/中品、禁区=中/上品、战场=上品为主（少量极品）、跨界=极品为主（少量神品）。"},
  ]},
  {t:"采集", ic:"⛏️", secs:[
    {h:"三系与节奏", b:"狩猎 / 挖矿 / 采药三系独立挂机；每 <b>15 秒</b>判定一次，先掷 <b>50% 成功率</b>，失败本次无产出。「立即采集」共享 15 秒冷却（三系共用），冷却中按钮显示倒计时。"},
    {h:"区域只截断不归一化", b:"外围 1-4（炼气）、中部 1-6（元婴）、核心 1-8（合体）；<b>飞升后已解锁的中部/核心仍可继续采集</b>。超出区域上限的档位<b>直接不参与</b>，其余档位保持原有绝对概率，<b>不会因为少了高档位而把概率匀给低档位</b>。"},
    {h:"档位概率", b:"稀1 40% / 稀2 25% / 稀3 15% / 稀4 8% / 稀5 5% / 稀6 3% / 稀7 2% / 稀8 2%。单灵根元素亲和可让对应采集类上限 +1（封顶 8）。"},
    {h:"结算方式", b:"成功后<b>每件材料各自按所属稀有度档位的概率独立掷骰</b>（不按档内件数平摊）；<b>每次只采得 1 件</b>，若多件同时命中，在命中者中<b>随机取一件</b>。"},
    {h:"实测单件概率", b:"核心区（含 50% 成功率）：稀1 单件约 9%、稀2 约 5.3%、稀3 约 3.2%、稀4 约 1.7%、稀5 约 0.95%、稀6 约 0.6%、稀7/稀8 约 0.4%。合计约 0.45 件/次（≈ 每 2.2 次出 1 件）。"},
    {h:"离线与傀儡", b:"挂机、傀儡、离线补发全部走同一套判定；傀儡采集周期 = 15 秒 ÷ 傀儡效率（玉90%/铁75%/石60%/木40%）。"},
  ]},
  {t:"制造", ic:"🏭", secs:[
    {h:"四类 88 配方", b:"制符 20 / 炼丹 20 / 炼器 28（装备）/ 阵法 20。按成品稀有度分四套：稀1-3（炼气~金丹）、稀4-6（元婴~炼虚）、稀7-9（合体~渡劫）、稀10（真仙）；套位越高材料越稀、要求越严。"},
    {h:"材料规则", b:"每个配方材料总量 50~74；越稀有的材料用量越少（稀9/10 常见 ×1~2）；高套位配方会禁用低稀材料。配方行内实时显示「灵草×24（持有 X）」。"},
    {h:"耗时", b:"按成品价值分档：<200 → 10 秒；<1000 → 20 秒；<5000 → 40 秒；<20000 → 90 秒；≥20000 → 180 秒。炼制中不可运功/采集/探索。"},
    {h:"循环制造", b:"每个配方行有循环开关：打开后弹窗输入目标件数，达到目标或材料不足会自动停止并记日志。注意循环制造与运功互斥。"},
    {h:"炼器=装备", b:"炼器产出的是<b>装备</b>（自动进装备库，不进背包），详见「装备」。"},
  ]},
  {t:"装备", ic:"🛡️", secs:[
    {h:"7 槽 × 4 套 = 28 件", b:"武器 / 头部 / 防具 / 戒指·壹 / 戒指·贰 / 项链 / 法宝。四套按稀有度递进（稀1-3、4-6、7-9、10）。"},
    {h:"主属性", b:"武器=攻击%；头部=气血%；防具=减伤%；戒指=攻击或会心；项链=突破或灵气；法宝=灵气产出。数值均为<b>百分比</b>，随套位递增。"},
    {h:"副属性词条", b:"每件装备随机 1~2 条（速度 / 命中 / 闪避 / 五行抗性 / 暴击伤害 / 灵力池），稀有度越高数值越大；同名装备属性不同属正常。"},
    {h:"操作", b:"「装备」页点人物栏凹槽 → 弹窗选择穿戴；已穿戴装备不可出售（需先卸下）；装备库可出售换灵石。属性常驻生效并实时计入属性面板。"},
  ]},
  {t:"丹药·符箓·阵法", ic:"💊", secs:[
    {h:"效果类型", b:"灵气固定值 / 灵气百分比 / 突破成功率 / 会心 / 战力 / 秘境减伤 / 回气血。数值与持续时间按套位递增（10~120 分钟）。"},
    {h:"叠层", b:"同类可叠加到各自上限（maxStack 1~5），重复使用刷新持续时间；到期前 5 秒日志提醒「即将失效」，结束时提示「效果已结束」。"},
    {h:"使用场景", b:"战斗外用「须弥空间」使用；<b>战斗内</b>可点战斗界面「道具」打开战斗背包，使用回血丹药与战斗类符箓/丹药/阵图（不占技能槽，消耗一次行动）。"},
    {h:"注意", b:"突破类丹药只影响突破，别在战斗前误用；灵气类丹药与运功叠加计算。"},
  ]},
  {t:"须弥空间", ic:"🎒", secs:[
    {h:"分组", b:"无限容量，按 功法 / 制符 / 炼丹 / 炼器 / 阵法 / 奇珍 / 装备 / 妖兽材料 / 矿石 / 草药 分组，标题可折叠并显示数量。"},
    {h:"查找", b:"顶部有「N 种 · 无限容量」统计、名称搜索框、分类筛选（全部/材料/成品/功法/装备）；行内右侧是 使用/研习/激活/穿戴/出售 按钮，悬浮看详情。"},
    {h:"出售", b:"弹窗选数量，按换算后的价值（高稀材料价值已按 ×100 换算）入账为对应品级灵石；已穿戴装备不可出售。"},
  ]},
  {t:"坊市", ic:"🏮", secs:[
    {h:"随机出售", b:"每 10 分钟刷新 10 种（材料 / 成品 / 功法 / 技能书）。稀有度越低刷新权重越高、库存越多（稀1 库存10 → 稀5/6 库存1）。"},
    {h:"支付", b:"优先按你持有的各品灵石精确支付；某品不足时自动用更高品级折算补足（折算含 1% 手续费，多余找零）。<b>低品凑高品不会自动</b>，需要去「灵石兑换」手动换。"},
    {h:"灵石兑换", b:"下↔中↔上↔极↔神 共 7 行，固定 1% 手续费（低→高多付、高→低少得），按钮 ×10 / ×50 / ×100 批量兑换。"},
    {h:"拍卖会", b:"半点（xx:30）小型 5 件稀4-6；整点（xx:00）大型 10 件稀5-8。竞价 15 分钟，每次加价=底价 10%；被超价会退还已付；每分钟 10% 概率虚灵商客加价；价高者得，无人出价流拍。战后休市至下一场。"},
  ]},
  {t:"傀儡", ic:"🤖", secs:[
    {h:"四档效率", b:"玉傀 90% / 铁傀 75% / 石傀 60% / 木傀 40%（玩家为 100% 基准）。采集周期 = 15 秒 ÷ 效率；制造成本周期 = 配方耗时 ÷ 效率。"},
    {h:"上限分批开放", b:"炼气 1 台 → 金丹 2 台 → 元婴 3 台 → 化神 4 台 → <b>合体 5 台</b>（满额）。傀儡页顶部实时显示「当前 N / 上限」与下一档解锁境界。<b>飞升后上限保留</b>（按历史最高境界），不会回落到 1 台。"},
    {h:"任务", b:"采集：狩猎/挖矿/采药，可选采集区域（按境界解锁）；制造：选分类 + 具体配方或「随机配方」。材料不足会自动等待重试，产出实时入须弥空间并记日志。"},
    {h:"获取", b:"① 炼器「木傀」成品，使用后 +1 台木傀；② 后三秘境底关 BOSS <b>1%</b> 掉落：原始禁区→石傀、上古战场→铁傀、跨界空间→玉傀（傀儡满额时折算中品灵石：50/150/400）。"},
    {h:"操作", b:"指派后按钮变红「停止」，点击即停止任务；傀儡与玩家状态互不干扰（玩家运功/采集/制造时傀儡照常工作）。"},
  ]},
  {t:"灵兽与蛋", ic:"🐉", secs:[
    {h:"出蛋", b:"击败精英守卫或秘境 BOSS 有概率出蛋（普通怪不掉）：区域基础 2.0% / 3.5% / 5.0% / 6.5% + 层数×0.15%，封顶 10%；筑基后首战必得「木灵蛋」。蛋存入蛋仓。"},
    {h:"孵化", b:"10 种蛋（木/土/水/火/金/风/冰/雷/毒/阴阳），孵化 2~24 小时（在线离线均计时）。孵化槽默认 1 个，可扩容至 4：100 下品 / 1 中品 / 10 中品。"},
    {h:"温养", b:"偏好类别材料 +1×稀有度、其余材料 +0.5×稀有度；灵兽精魄每枚 +1。温养度越高，破壳出「灵品/圣品」概率越高（三档合计 100%）；满温养初始饱食/亲密 +20。"},
    {h:"30 只灵兽", b:"每颗蛋对应凡/灵/圣三档共 3 只，10 蛋共 30 只。修炼型 +1%×稀有度 修炼速度、攻击型 +2%×稀有度 战力；圣品（稀9-10）额外带 灵气/会心/突破/减伤 特性。出战上限：筑基 1 / 金丹 2 / 元婴及以上 3。"},
    {h:"养成与叛变", b:"饱食每小时衰减（凡20/灵18/圣15），亲密每小时 -5（饱食为 0 时 -15）。喂食 1 份任意材料：饱食 +10×稀有度、亲密 +稀有度。亲密归零后进入叛变倒计时（72 小时；饱食也为 0 则 48 小时），期间喂食即重置，到期永久逃离。"},
    {h:"兽诀与打书", b:"兽诀共 13 种（凡/灵/玄/天四档），可在<b>坊市、拍卖会</b>购买，或由秘境 BOSS 掉落。每只灵兽按稀有度拥有技能格：稀1-2 两格、稀3-4 三格、稀5-6 四格、稀7-8 五格、稀9-10 六格（圣品 +1）。在灵兽卡点「培养」→「打入」：<b>空格必成</b>；<b>满格时随机顶替一格</b>（同名不重复）。打书另耗灵石（一阶 8000 / 二阶 24000 / 三阶 72000 下品）。"},
    {h:"锁灵与保底", b:"「锁灵符」（8 万下品）可锁住一个技能格，打书时不会被顶替，点已锁格子可解锁。反挫败保底：同一格<b>连续被顶 3 次</b>后，下一次打书不会再选中它。"},
    {h:"灵韵与洗练", b:"灵兽另有「灵韵」（20-100，孵化时按稀有度生成）：灵韵越高该兽所有加成越强（系数 0.85~1.15 线性）。「洗练石」（3 万下品）可重掷灵韵，基准随稀有度上移。"},
    {h:"合宠与升阶", b:"「培养」里可选另一只灵兽<b>合宠</b>：主兽保留自身技能，随机继承材料兽最多 2 门（格子够时），材料兽消失；新灵韵 = 主兽 60% + 材料 40% 再浮动。两本<b>同阶同名</b>兽诀可升阶（1→2→3 阶），效果分别 ×1.5、×2。"},
    {h:"炼化与放生", b:"重复灵兽可『炼化』得精魄（数量=稀有度，图鉴保留）；『放生』返还 稀有度×(1 上品+100 下品)。精魄可用于温养任意蛋（+1）或出售（1 上品/枚）。"},
  ]},
  {t:"成就", ic:"🏆", secs:[
    {h:"领取制", b:"达成条件后需在「成就」页手动点『领取』，不会自动发放。红色小圆点表示有待领取。"},
    {h:"可多次领取", b:"境界突破（每重一次）、一朝飞升（每次飞升）、碎片盈身/问道长生（按累计碎片档位）、灵气如潮（按产量档位）、各强化设施/修行升级里程碑（每 50 级一次）。"},
    {h:"奖励显示", b:"奖励以下品灵石记账，界面自动换算为高品（如 200 → 2 中品），并显示「已领 X 次 / 总 Z 次」或「不限」。"},
  ]},
  {t:"飞升", ic:"🦢", secs:[
    {h:"条件", b:"化神期（境界≥4）起，修炼页出现紫色「飞升」按钮；消耗 = 下一境界突破需求 × 灵根需求倍率 × <b>2</b>（界面实时显示所需灵力与可获碎片）。"},
    {h:"收益", b:"获得大道碎片 = ⌊(本轮累计灵力 / 100万)^0.5 × 0.1⌋（至少 1）。例：累计 160 亿 → 约 12 枚；1 万亿 → 约 100 枚；100 万亿 → 约 3160 枚。每点碎片<b>永久 +5% 修炼</b>，也可用于购买神通（下品 20 → 至尊 180）。"},
    {h:"重置范围", b:"境界归 0、灵力清零、强化设施清零、材料/成品/采集清空；<b>保留</b>灵根、功法、神通、大道碎片、成就、灵石、装备、灵兽、阵容与形象，以及<b>傀儡槽位上限</b>与<b>已解锁的采集中部/核心区域</b>（按历史最高境界判定，飞升不回落）。"},
  ]},
  {t:"存档与安全", ic:"💾", secs:[
    {h:"自动存档", b:"每 15 秒自动保存一次，切到后台或关闭页面前也会保存；设置里可手动『保存』『导出存档』『导入存档』（JSON，含规则集校验）。"},
    {h:"多开警告", b:"<b>请只开一个窗口</b>：多个标签页/窗口各自持有一份状态，后写的会覆盖先写的，可能表现为境界或进度「自己跳变」。检测到其他窗口写入存档时会弹提示并记警告日志。"},
    {h:"境界记录", b:"设置 → 诊断 →「境界记录」：查看当前境界、最后保存时间、最近 12 次境界变化（突破成功/飞升/载入不一致/校正脏值）。若发现「载入不一致」多为多开覆盖或导入旧存档。"},
    {h:"重生", b:"设置里红色「重生」会清空全部修仙数据并重载（灵根/货币/境界/材料/成就/日志），不可撤销。"},
  ]},
  {t:"疑难速查", ic:"❓", secs:[
    {h:"点了没反应", b:"先看是否有弹窗遮挡（运功/突破/探索会自动清理残留的引导与灵根弹窗）；挂机采集 15 秒一次、且有 50% 成功率，短时间没产出是正常的。"},
    {h:"采集拿不到高级材料", b:"检查当前区域上限（外围1-4 / 中部1-6 / 核心1-8）与境界解锁；单灵根元素亲和可 +1。稀9-10 材料<b>不会</b>从采集获得，只能靠秘境/拍卖。"},
    {h:"灵石不够", b:"出售须弥空间里的材料/成品（高稀材料已按 ×100 换算）；坊市可用高品自动折抵 1% 手续费，但低品凑高品要手动「灵石兑换」。"},
    {h:"战斗卡住/找不到战斗", b:"战斗中可收起界面，回「探索」页点「进入战斗」或秘境地图点「⚔ 返回战斗」；若刷新页面，未结算的战斗格会复位，重新走上去即可再打。"},
    {h:"境界自己变了", b:"开「设置 → 诊断 → 境界记录」：有「突破成功」记录属正常；「载入不一致」基本是多开/导档覆盖。另外突破按钮已有 700ms 防连点。"},
    {h:"反馈", b:"顶栏「QQ群」按钮可一键复制群号 1128330622，问题、建议、存档都可以在群里反馈。"},
  ]},
];
let manualIdx=0, manualQuery="";
function manualPlain(s){ return (s.t+" "+s.secs.map(x=>x.h+" "+x.b).join(" ")).replace(/<[^>]+>/g,""); }
function manualMatch(s,q){
  if(!q) return true;
  const h=manualPlain(s).toLowerCase();
  return q.toLowerCase().split(/\s+/).filter(Boolean).every(k=>h.indexOf(k)>=0);
}
function renderManual(){
  const nav=$("manualNav"), box=$("manualBody");
  if(!nav||!box) return;
  nav.innerHTML=""; box.innerHTML="";
  const sw=document.createElement("input");
  sw.id="manualSearch"; sw.type="search"; sw.placeholder="搜索：采集 / 突破 / 蛋 / 灵石…"; sw.value=manualQuery;
  sw.style.cssText="width:100%;box-sizing:border-box;margin:0 0 8px;padding:6px 8px;border-radius:7px;border:1px solid var(--line);background:var(--panel2);color:var(--ink);font-size:12px;outline:none";
  sw.addEventListener("input",()=>{ manualQuery=sw.value.trim(); renderManual(); const e=$("manualSearch"); if(e){ e.focus(); try{ e.setSelectionRange(e.value.length,e.value.length); }catch(err){} } });
  nav.appendChild(sw);
  const hits=MANUAL_SECTIONS.map((s,i)=>({s,i})).filter(o=>manualMatch(o.s,manualQuery));
  if(hits.length && !hits.some(o=>o.i===manualIdx)) manualIdx=hits[0].i;
  $("manualCount").textContent=manualQuery?("（匹配 "+hits.length+" / "+MANUAL_SECTIONS.length+" 节）"):("（共 "+MANUAL_SECTIONS.length+" 节）");
  if(!hits.length){
    const e=document.createElement("div");
    e.style.cssText="font-size:12px;color:var(--ink-dim);padding:6px 4px;line-height:1.6";
    e.textContent="没有匹配的章节，换个关键词试试（如：采集 / 突破 / 蛋 / 拍卖）。";
    nav.appendChild(e);
  }
  hits.forEach(o=>{
    const on=o.i===manualIdx;
    const nv=document.createElement("div");
    nv.style.cssText="padding:8px 10px;border-radius:8px;cursor:pointer;margin:2px 0;font-size:13px;display:flex;align-items:center;gap:8px;"
      +(on?"background:rgba(154,165,240,.25);color:#fff;font-weight:700":"");
    nv.innerHTML="<span>"+o.s.ic+"</span><span>"+o.s.t+"</span>";
    nv.title=o.s.secs.map(x=>x.h).join(" / ");
    nv.addEventListener("click",()=>{ manualIdx=o.i; renderManual(); const b=$("manualBody"); if(b) b.scrollTop=0; });
    nav.appendChild(nv);
  });
  const s=MANUAL_SECTIONS[manualIdx];
  const head=document.createElement("div");
  head.innerHTML='<div style="font-size:16px;font-weight:800">'+s.ic+" "+s.t+'</div>'
    +'<div style="font-size:11px;color:var(--ink-dim);margin:2px 0 8px">第 '+(manualIdx+1)+" / "+MANUAL_SECTIONS.length+" 节 · 共 "+s.secs.length+" 条 · 可用 ← → 翻页、Esc 关闭</div>";
  box.appendChild(head);
  s.secs.forEach((sec,si)=>{
    const d=document.createElement("div");
    d.style.cssText="margin:8px 0;padding:10px 12px;background:rgba(255,255,255,.04);border-left:3px solid var(--mystic,#8e7cf0);border-radius:8px";
    d.innerHTML='<div style="font-weight:700;color:#eee;margin-bottom:3px">'+(si+1)+". "+sec.h+'</div>'
      +'<div style="color:var(--ink-dim,#bbb);line-height:1.85">'+sec.b+"</div>";
    box.appendChild(d);
  });
}
$("manualBtn").addEventListener("click",()=>{ manualIdx=0; manualQuery=""; renderManual(); $("manualOverlay").classList.add("show"); });
document.addEventListener("keydown",e=>{
  const ov=$("manualOverlay"); if(!ov||!ov.classList.contains("show")) return;
  const tg=e.target||{}; if(tg.tagName==="INPUT"||tg.tagName==="TEXTAREA"||tg.tagName==="SELECT") return;
  if(e.key==="ArrowLeft"||e.key==="ArrowRight"){
    manualIdx=(manualIdx+(e.key==="ArrowRight"?1:MANUAL_SECTIONS.length-1))%MANUAL_SECTIONS.length;
    renderManual(); const b=$("manualBody"); if(b) b.scrollTop=0; e.preventDefault();
  } else if(e.key==="Escape"){ ov.classList.remove("show"); }
});
$("manualClose").addEventListener("click",()=>{ $("manualOverlay").classList.remove("show"); });
$("manualPrev").addEventListener("click",()=>{ manualIdx=(manualIdx+MANUAL_SECTIONS.length-1)%MANUAL_SECTIONS.length; renderManual(); });
$("manualNext").addEventListener("click",()=>{ manualIdx=(manualIdx+1)%MANUAL_SECTIONS.length; renderManual(); });
/* v31.21 事件日志收起/展开：按钮贴在日志列左边界，收起后固定到屏幕右侧并变为向左展开 */
(function(){
  const KEY="xiuxian_log_collapsed";
  const app=$("app"), btn=$("logToggleBtn"), wrap=$("logWrap"); if(!app||!btn||!wrap) return;
  // 位置用像素计算：窄窗口下日志列会被压缩，固定 right 值会跑位
  function place(){
    const collapsed=app.classList.contains("log-collapsed")||wrap.offsetParent===null;
    if(window.innerWidth<=760){
      btn.style.position="fixed"; btn.style.left="auto"; btn.style.right="8px";
      btn.style.top="auto"; btn.style.bottom="14px"; btn.style.transform="none";
      btn.style.width="24px"; btn.style.height="48px"; btn.style.borderRadius="6px";
      return;
    }
    btn.style.width="16px"; btn.style.height="72px"; btn.style.borderRadius="6px 0 0 6px";
    if(collapsed){
      btn.style.position="fixed"; btn.style.left="auto"; btn.style.right="0";
      btn.style.top="50%"; btn.style.bottom="auto"; btn.style.transform="translateY(-50%)";
      return;
    }
    const ar=app.getBoundingClientRect(), wr=wrap.getBoundingClientRect();
    btn.style.position="absolute"; btn.style.left="auto";
    btn.style.top="50%"; btn.style.bottom="auto"; btn.style.transform="translateY(-50%)";
    btn.style.right=(wr.width>0)?Math.round(ar.right-wr.left+2)+"px":"2px";
  }
  const apply=c=>{
    app.classList.toggle("log-collapsed",c);
    btn.textContent=c?"‹":"›";
    const label=c?"展开事件日志":"收起事件日志";
    btn.title=label; btn.setAttribute("aria-label",label);
    try{ localStorage.setItem(KEY,c?"1":"0"); }catch(e){}
    place();
  };
  btn.addEventListener("click",()=>apply(!app.classList.contains("log-collapsed")));
  window.addEventListener("resize",place);
  let saved=false; try{ saved=localStorage.getItem(KEY)==="1"; }catch(e){}
  apply(saved);
  setTimeout(place,60); setTimeout(place,600);
})();
$("qqGroupBtn").addEventListener("click",()=>{
  const num="1128330622";
  const done=()=>{ banner("QQ群号已复制：1128330622"); logEvent("已复制官方QQ群号 1128330622",'sys'); };
  if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(num).then(done).catch(()=>fallbackCopy(num,done)); }
  else fallbackCopy(num,done);
});
function fallbackCopy(txt,cb){
  const ta=document.createElement("textarea");
  ta.value=txt; ta.style.position="fixed"; ta.style.opacity="0";
  document.body.appendChild(ta); ta.select();
  try{ document.execCommand("copy"); cb(); }catch(e){ banner("复制失败，请手动复制：1128330622"); }
  document.body.removeChild(ta);
}
$("setOverlay").addEventListener("click",e=>{ if(e.target.id==="setOverlay")$("setOverlay").classList.remove("show"); });
$("setClose").addEventListener("click",()=>$("setOverlay").classList.remove("show"));
document.querySelectorAll("#themeBtns button").forEach(b=>b.addEventListener("click",()=>{ S.settings.theme=b.dataset.theme; applyTheme(S.settings.theme); save(); }));
$("saveBtn").addEventListener("click",()=>{ save(); banner("已保存"); });
if($("diagBtn"))$("diagBtn").addEventListener("click",()=>{ showModal("境界记录（最近 12 条）",realmDiagText()); });
// v32.4 多窗口检测：另一个标签页/窗口写入存档时提示（多开互相覆盖会造成境界与进度跳变）
window.addEventListener("storage",e=>{ if(!e||e.key!==CFG.saveKey) return;
  if(!window._multiWinWarned){ window._multiWinWarned=1;
    banner("检测到另一个窗口也在运行本游戏，可能导致境界/进度跳变，建议只保留一个窗口");
    logEvent("检测到其他窗口写入存档：多开可能造成境界与进度异常，请只保留一个窗口",'warn'); }
});
$("exportBtn").addEventListener("click",()=>{
  const data=JSON.stringify({r:RULESET_ID,s:S});
  const a=document.createElement("a"); a.href="data:application/json;charset=utf-8,"+encodeURIComponent(data); a.download="xiuxian_"+VERSION+"_save.json"; a.click();
});
$("importBtn").addEventListener("click",()=>{
  const inp=document.createElement("input"); inp.type="file"; inp.accept=".json";
  inp.onchange=()=>{ const f=inp.files[0]; if(!f) return; const rd=new FileReader(); rd.onload=()=>{ try{ const d=JSON.parse(rd.result); if(d.r!==RULESET_ID) throw new Error("版本不符"); S=d.s; normalizeState(); save(); render(); banner("存档已导入"); }catch(e){ banner("导入失败"); } }; rd.readAsText(f); };
  inp.click();
});
$("pathBtn").addEventListener("click",()=>{ if(window.showSaveFilePicker){ showSaveFilePicker().then(h=>h.createWritable().then(w=>w.write(JSON.stringify({r:RULESET_ID,s:S})).then(()=>w.close())).then(()=>banner("已保存至所选路径"))).catch(()=>banner("未选择路径")); } else banner("当前环境不支持选择路径，请用导出存档"); });
$("rebirthBtn").addEventListener("click",()=>{
  if(confirm("【重生】将删除全部修仙数据（灵根、强化、神通、货币、境界、材料、成品、成就与日志），并重置为开局状态。此操作不可撤销，确定继续吗？")){
    suppressSave=true; localStorage.removeItem(CFG.saveKey); location.reload();
  }
});

