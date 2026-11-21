/* ================= 探索系统 v7：气血 + 蜂窝秘境 ================= */
const EXP_AREAS={
  dt:{nm:"洞天福地", lv:"中危", power:60, rec:"筑基~元婴"},
  yl:{nm:"原始禁区", lv:"高危", power:140, rec:"化神~合体"},
  sg:{nm:"上古战场", lv:"极危", power:320, rec:"大乘~真仙"},
  kj:{nm:"跨界空间", lv:"九死一生", power:700, rec:"真仙及以上"}
};
function areaBasePower(area){ const seg={dt:2,yl:5,sg:8,kj:9}[area]||1; return Math.floor(100*(1+seg*0.45)*2.0); }
function areaDifficulty(area){
  const r=playerPower()/areaBasePower(area);
  if(r>=1.6) return {lv:"毫无难度", lvC:"#45d0a0", mult:0.4};
  if(r>=1.05) return {lv:"中危", lvC:"#e0b95e", mult:1.0};
  if(r>=0.85) return {lv:"高危", lvC:"#e8963b", mult:1.6};
  if(r>=0.65) return {lv:"极危", lvC:"#e05b4a", mult:2.4};
  return {lv:"九死一生", lvC:"#d9403a", mult:3.5};
}
function hpMaxFor(n){ return Math.floor(100*Math.pow(1.45,Math.max(0,n))*(1+(eqSum("hp")+petSum("hp"))/100)); }
function playerPower(){ return Math.floor(100*(1+S.realm*0.45)*(1+(S.root?S.root.combat:0))*(1+buffEffSum("combat")/100)*(1+eqSum("atk")/100)*(1+petSum("atk")/100)); }
/* v18.49：按「玩家全装+全buff+有回血丹药」基准重新设计难度。
   区域难度绑定境界段——洞天福地=筑基/金丹/元婴，原始禁区=化神/炼虚/合体，
   上古战场=大乘/渡劫/真仙，跨界空间=真仙及以上（九死一生，怪强度系数更高）。
   全装+全buff 典型战力倍率 = 灵根战斗加成 × 满配装备攻击 × 战斗符箓/丹药叠加 ≈ 2.0；
   普通怪 = 全装战力基准 ×(50%~70%)（全装玩家可轻松取胜），精英 = 该层普通 ×1.35（守门，势均力敌），
   BOSS = 全装战力基准 × 危险系数（洞天 1.15 / 禁区 1.25 / 战场 1.35 / 跨界 1.5，需装备与回血丹药方可挑战）。 */
function enemyPower(floor, area, boss){
  const SEG={dt:[1,2,3],yl:[4,5,6],sg:[7,8,9],kj:[9,9,9]};
  const MUL={dt:1.15,yl:1.25,sg:1.35,kj:1.5};
  const LATE={dt:1,yl:1.1,sg:1.1,kj:1.1}; /* v30.9：后三张地图（禁区/战场/跨界）整体难度 +10%，洞天不变 */
  const FULLKIT=2.0;
  const seg=floor<=3?0:(floor<=7?1:2);
  const r=SEG[area][seg];
  const pw=100*(1+r*0.45)*FULLKIT;
  const rate=(area==="kj")?(0.65+Math.random()*0.2):(0.5+Math.random()*0.2);
  let p=pw*rate*(LATE[area]||1);
  if(boss) p=pw*MUL[area]*(LATE[area]||1);
  return Math.floor(p);
}
function areaRec(area, floor, cat){
  const c=CRAFT.find(x=>x.cat===cat); if(!c||!c.rec.length) return null;
  /* 丹符按秘境分层：洞天 1-7 / 禁区 1-8 / 战场 2-9 / 跨界 3-10；权重 11-rarity+lift 递减，高阶越难出 */
  const R={dt:[1,7],yl:[1,8],sg:[2,9],kj:[3,10]};
  const rr=R[area]||[1,10];
  let pool=c.rec.filter(r=>{ const ra=r.rarity||1; return ra>=rr[0]&&ra<=rr[1]; });
  if(!pool.length) pool=c.rec; // 保底：区间无出品时回退全池
  const lift=Math.min(2,Math.floor(((floor||1)-1)/2));
  const ws=pool.map(r=>Math.max(1,(11-(r.rarity||1))+lift));
  let tot=0; ws.forEach(w=>tot+=w); let x=Math.random()*tot;
  for(let i=0;i<pool.length;i++){ x-=ws[i]; if(x<=0) return pool[i]; }
  return pool[0];
}
/* 区域产出稀有度区间——洞天 1-7 / 禁区 1-8 / 战场 2-9 / 跨界 3-10；权重 11-rarity+lift 递减，稀有度越高产出概率越低。 */
function areaMat(area, floor){
  const A={dt:["herb","herb","ore"],yl:["beast","beast","ore"],sg:["beast","ore","ore"],kj:["beast","ore","ore","herb"]};
  const R={dt:[1,7],yl:[1,8],sg:[2,9],kj:[3,10]};
  const cats=A[area]||["herb"]; const cat=cats[Math.floor(Math.random()*cats.length)];
  const rr=R[area]||[1,10];
  const pool=MATS.filter(m=>m.cat===(cat==="herb"?"草药":cat==="ore"?"矿石":"妖兽材料")&&(m.rarity||1)>=rr[0]&&(m.rarity||1)<=rr[1]);
  if(!pool.length) return {id:"skin", name:"妖狼皮", qty:1};
  const lift=Math.min(2,Math.floor((floor-1)/2));
  const ws=pool.map(m=>Math.max(1,(11-(m.rarity||1))+lift));
  let tot=0; ws.forEach(w=>tot+=w); let r=Math.random()*tot;
  for(let i=0;i<pool.length;i++){ r-=ws[i]; if(r<=0) return pool[i]; }
  return pool[0];
}
function areaStone(area, floor){
  const T={dt:["L","L","M"],yl:["M","M","H"],sg:["H","H","H","H","H","H","H","H","T","T"],kj:["T","T","T","T","T","T","T","T","G"]};
  const arr=T[area]||["L"];
  let tier=arr[Math.floor(Math.random()*arr.length)];
  const _lp=petSkillSum("loot");
  if(_lp>0 && Math.random()*100<_lp){ const _ord=["L","M","H","T","G"]; const _i=_ord.indexOf(tier); if(_i>=0&&_i<4) tier=_ord[_i+1]; }
  let qty=1;
  if(tier==="L") qty=Math.max(1,Math.floor((10+Math.random()*50)*(1+floor*0.03)*0.3));
  else if(tier==="M") qty=Math.max(1,Math.floor((3+Math.random()*20)*(1+floor*0.03)*0.3));
  else if(tier==="H") qty=Math.max(1,Math.floor((1+Math.random()*8)*(1+floor*0.03)*0.3));
  return {tier, qty:Math.max(1,qty)};
}
function expCellIcon(t){
  return t==="start"?"🧍":t==="mat"?"🌿":t==="fight"?"⚔️":t==="trap"?"☠️":t==="stone"?"💎":t==="dan"?"💊":t==="fu"?"🧧":t==="down"?"⬇️":t==="boss"?"👹":t==="exit"?"🚪":"·";
}
function expMapR(floor){ return floor<=3?4:floor<=7?5:7; }
function genExpMap(floor, area){
  const R=expMapR(floor);
  const cells={}; const all=[];
  for(let q=-R;q<=R;q++)for(let r=-R;r<=R;r++){ if(Math.abs(q+r)>R) continue; all.push([q,r]); }
  cells["0,0"]={q:0,r:0,t:"start",used:true,revealed:true};
  const rest=all.filter(c=>!(c[0]===0&&c[1]===0));
  const sp=rest.splice(Math.floor(Math.random()*rest.length),1)[0];
  const pool=[];
  for(let i=0;i<25;i++)pool.push("blank");
  for(let i=0;i<7;i++)pool.push("mat");
  for(let i=0;i<35;i++)pool.push("fight");
  for(let i=0;i<15;i++)pool.push("trap");
  for(let i=0;i<6;i++)pool.push("stone");
  for(let i=0;i<6;i++)pool.push("dan");
  for(let i=0;i<6;i++)pool.push("fu");
  rest.forEach(c=>{ cells[c[0]+","+c[1]]={q:c[0],r:c[1],t:pool[Math.floor(Math.random()*pool.length)],used:false,revealed:false}; });
  // 初始揭示起点相邻一圈，保证开局可走
  [[1,0],[0,1],[-1,1],[-1,0],[0,-1],[1,-1]].forEach(n=>{ const nc=cells[n[0]+","+n[1]]; if(nc) nc.revealed=true; });
  const isFinal=floor>=10;
  if(isFinal){ cells[sp[0]+","+sp[1]]={q:sp[0],r:sp[1],t:Math.random()<0.5?"boss":"exit",used:false,revealed:false}; }
  else { cells[sp[0]+","+sp[1]]={q:sp[0],r:sp[1],t:"down",used:false,revealed:false}; }
  return {cells, pos:{q:0,r:0}};
}
function startExplore(area){
  if(S.realm<1){ logEvent("练气期尚未开悟，筑基后方可踏入秘境",'warn'); return; }
  // 探索与运功/采集/制造互斥：进入探索自动停止三者
  if(S.yunning){ S.yunning=false; S.critBoost=false; logEvent("探索开始，已停止运功",'sys'); }
  if(S.making){ S.making=null; logEvent("探索开始，已停止炼制",'sys'); }
  if(S.cycle){ S.cycle=null; }
  for(const c in S.collect){ if(S.collect[c]!==undefined){ delete S.collect[c]; logEvent("探索开始，已停止挂机采集",'sys'); break; } }
  expTab="explore";
  if(!S.exp){
    S.exp={area, floor:1, map:genExpMap(1,area), loot:[], over:false, pos:{q:0,r:0}};
    logEvent("踏入「"+EXP_AREAS[area].nm+"」（"+areaDifficulty(area).lv+"），秘境探险开始",'sys');
  }
  renderExpPanel(); $("expOverlay").classList.add("show");
}
function expLootToBag(){
  if(!S.exp) return;
  let rare=false; /* v31.22 稀有掉落判定 */
  S.exp.loot.forEach(it=>{
    if(it.kind==="mat"){ const mm=MATS_BY_ID[it.id]; if(mm&&(mm.rarity||1)>=6) rare=true; S.mats[it.id]=(S.mats[it.id]||0)+it.qty; }
    else if(it.kind==="tres"){ if(isEquip(it.id)){ S.equip.push(newEquip(it.id)); } else { S.tres[it.id]=(S.tres[it.id]||0)+it.qty; } }
    else if(it.kind==="stone"){
      if(it.tier==="L")S.stoneL+=it.qty; else if(it.tier==="M")S.stoneM+=it.qty; else if(it.tier==="H")S.stoneH+=it.qty; else if(it.tier==="T")S.stoneT+=it.qty; else S.stoneG+=it.qty;
    }
  });
  if(rare) sfxRare();
}
function expFinish(){
  const exp=S.exp; if(!exp||exp.over) return;
  exp.over=true; expLootToBag();
  expSummary("探索完成 · 收获总结");
  logEvent("探索「"+EXP_AREAS[exp.area].nm+"」结束，战利品已收入须弥空间",'sys');
  S.exp=null; $("expOverlay").classList.remove("show"); save(); renderTab(); renderStats();
}
function expFail(){
  const exp=S.exp; if(!exp||exp.over) return;
  exp.over=true;
  exp.loot=exp.loot.slice(Math.floor(exp.loot.length/2));
  expLootToBag();
  expSummary("探索失败 · 收获总结","气血耗尽被迫撤离，损失一半战利品");
  logEvent("气血耗尽，被迫撤离秘境！损失一半战利品",'warn');
  S.exp=null; $("expOverlay").classList.remove("show"); save(); renderTab(); renderStats();
}
function expRetreat(){
  const exp=S.exp; if(!exp||exp.over) return;
  const hpL=Math.ceil(S.hp*0.5); S.hp=Math.max(1,S.hp-hpL);
  exp.over=true;
  exp.loot=exp.loot.slice(Math.floor(exp.loot.length/2));
  expLootToBag();
  expSummary("主动撤出 · 收获总结","损失 "+hpL+" 气血、一半战利品");
  logEvent("主动撤出秘境：损失 "+hpL+" 气血、一半战利品",'warn');
  S.exp=null; $("expOverlay").classList.remove("show"); save(); renderTab(); renderStats();
}
/* v31.16 修复：刷新/重开后 S.exp 仍留在存档但探索界面不恢复，运功被"探索中"永久拦截（表现为"无法修炼"）。
   有效进度 → 自动恢复探索界面；数据不完整 → 清理，避免死状态。 */
function resumeExploreIfAny(){
  if(!S.exp) return;
  const e=S.exp;
  const valid = !e.over && e.map && e.pos && EXP_AREAS[e.area] && typeof renderExpPanel==="function";
  if(!valid){
    S.exp=null;
    logEvent("上次探索进度不完整，已自动清理（可重新开启探索）",'warn');
    save();
    return;
  }
  expTab="explore";
  renderExpPanel();
  $("expOverlay").classList.add("show");
  logEvent("已恢复未结束的探索「"+EXP_AREAS[e.area].nm+"」（可继续深入或撤出）",'sys');
  banner("已恢复上次未结束的探索，可继续或撤出");
}
/* 探索收获总结（v33.4）：卡片式弹窗，战利品按类别分组（材料/成品/装备/兽诀/傀儡/灵石） */
function expSummary(title, lossNote){
  const exp=S.exp; if(!exp) return;
  const AREA=EXP_AREAS[exp.area]||{nm:"秘境"};
  const diff=(typeof areaDifficulty==="function")?areaDifficulty(exp.area):{lv:"—"};
  const STONE_NM={L:"下品灵石",M:"中品灵石",H:"上品灵石",T:"极品灵石",G:"神品灵石"};
  const STONE_VAL={L:1,M:100,H:10000,T:1000000,G:100000000};
  const agg={};
  const add=(g,it)=>{ const k=g.key+"|"+(it.id||it.tier||"")+"|"+(it.sid||"");
    if(!agg[k]) agg[k]={g:g,it:it,qty:0};
    agg[k].qty += (it.qty||1); };
  (exp.loot||[]).forEach(it=>{
    if(it.kind==="mat"){
      const m=MATS_BY_ID[it.id];
      const cat=m?m.cat:"材料";
      const ic=cat==="妖兽材料"?"🐺":cat==="矿石"?"⛏️":"🌿";
      const order=cat==="妖兽材料"?1:cat==="矿石"?2:3;
      add({key:"mat:"+cat,title:cat,ic:ic,order:order},it);
    } else if(it.kind==="tres"){
      const r=REC_BY_ID[it.id];
      let cat="成品", ic="📦", order=6;
      if(r){
        if(r.slot){ cat="装备"; ic="🛡️"; order=8; }
        else if(r.isPu){ cat="傀儡"; ic="🤖"; order=10; }
        else { const c=CRAFT.find(x=>x.rec.indexOf(r)>=0); cat=c?c.cat:"成品";
          ic=({制符:"🧧",炼丹:"💊",炼器:"⚒️",阵法:"⛩️"})[cat]||"📦";
          order=({制符:4,炼丹:5,炼器:6,阵法:7})[cat]||6; }
      }
      add({key:"tres:"+cat,title:cat,ic:ic,order:order},it);
    } else if(it.kind==="stone"){ add({key:"stone",title:"灵石",ic:"💰",order:11},it); }
    else if(it.kind==="pu"){ add({key:"pu",title:"傀儡",ic:"🤖",order:10},it); }
    else if(it.kind==="book"){ add({key:"book",title:"兽诀",ic:"📜",order:9},it); }
  });
  /* 整理为分组 */
  const gmap={};
  Object.keys(agg).forEach(k=>{
    const a=agg[k], g=a.g, it=a.it;
    let name=it.name||"?", sub="", val=0, ic=g.ic;
    if(it.kind==="mat"){ const m=MATS_BY_ID[it.id]; if(m){ name=m.name; val=(m.value||0)*a.qty; sub="稀有"+m.rarity; } }
    else if(it.kind==="tres"){ const r=REC_BY_ID[it.id]; if(r){ name=r.name; val=(r.value||0)*a.qty; sub=r.slot?SLOT_NAMES[r.slot]:(r.isPu?"傀儡":"稀有"+r.rarity); ic=icOf?icOf(r):g.ic; } }
    else if(it.kind==="stone"){ name=STONE_NM[it.tier]||"灵石"; val=(STONE_VAL[it.tier]||1)*a.qty; sub=""; }
    else if(it.kind==="pu"){ name=it.name||"傀儡"; val=0; sub="已入傀儡栏"; }
    else if(it.kind==="book"){ name=it.name||"兽诀"; const o=(typeof petBookObj==="function"&&it.sid)?petBookObj(it.sid,it.lv||1):null; val=o?(o.value||0)*a.qty:0; sub="兽诀"; }
    const key=g.key;
    if(!gmap[key]) gmap[key]={title:g.title,ic:g.ic,order:g.order,qty:0,val:0,rows:[]};
    gmap[key].qty+=a.qty; gmap[key].val+=val;
    gmap[key].rows.push({ic:ic,name:name,sub:sub,qty:a.qty,val:val});
  });
  const secs=Object.keys(gmap).map(k=>gmap[k]).sort((a,b)=>a.order-b.order);
  secs.forEach(s=>s.rows.sort((a,b)=>b.val-a.val));
  const total=secs.reduce((a,s)=>a+s.val,0);
  /* 弹窗 */
  const mask=document.createElement("div");mask.className="expSumMask";
  mask.onclick=ev=>{ if(ev.target===mask) mask.remove(); };
  const card=document.createElement("div");card.className="expSumCard";
  let html='<div class="expSumHead">'+(lossNote?"⚠️ ":"🏆 ")+title+'</div>';
  html+='<div class="expSumMeta">'
    +'<span class="esChip">🗺️ '+AREA.nm+(diff&&diff.lv?(" · "+diff.lv):"")+'</span>'
    +'<span class="esChip">⬇️ 第 '+(exp.floor||1)+' 层</span>'
    +'<span class="esChip">❤️ 气血 '+Math.floor(S.hp)+'/'+S.hpMax+'</span>'
    +(lossNote?('<span class="esChip bad">'+lossNote+'</span>'):"")
    +'</div>';
  if(!secs.length){
    html+='<div class="expSumEmpty">本次没有获得战利品</div>';
  }else{
    html+='<div class="expSumBody">';
    secs.forEach(g=>{
      html+='<div class="esSec"><div class="esSecH"><span>'+g.ic+' '+g.title+'</span><em>'+g.rows.length+' 种 · '+fmt(g.qty)+' 件</em>'+(g.val?'<b>+'+fmt(g.val)+'</b>':'')+'</div>';
      g.rows.forEach(r=>{
        html+='<div class="esRow"><span class="esIc">'+r.ic+'</span><span class="esNm">'+r.name+(r.sub?('<i>'+r.sub+'</i>'):'')+'</span><span class="esQty">×'+fmt(r.qty)+'</span><span class="esVal">'+(r.val?fmt(r.val):"—")+'</span></div>';
      });
      html+='</div>';
    });
    html+='</div>';
  }
  html+='<div class="expSumFoot"><span>合计估值 <b>'+priceLText(splitPriceL(total))+'</b><i style="font-style:normal;color:var(--ink-dim)">（'+fmt(total)+' 下品）</i></span><button type="button" class="esBtn">收入须弥空间</button></div>';
  card.innerHTML=html;
  const btn=card.querySelector(".esBtn"); if(btn) btn.onclick=()=>mask.remove();
  mask.appendChild(card); document.body.appendChild(mask);
}
function expRevealNearby(){
  const exp=S.exp; if(!exp) return;
  const nb=[];
  for(const k in exp.map.cells){ const c=exp.map.cells[k]; if(c.revealed===false&&!c.used&&Math.abs(c.q-exp.pos.q)<=1&&Math.abs(c.r-exp.pos.r)<=1&&Math.abs(c.q+c.r-exp.pos.q-exp.pos.r)<=1&&!(c.q===exp.pos.q&&c.r===exp.pos.r)) nb.push(c); }
  const pick=Math.min(2,nb.length);
  for(let i=0;i<pick;i++){ const c=nb.splice(Math.floor(Math.random()*nb.length),1)[0]; c.revealed=true; }
}
function expDmg(base){ const r=Math.max(0,1-(buffEffSum("dmg_reduce")+eqSum("dmgR")+petSum("dmgR"))/100); return Math.max(1,Math.ceil(base*r)); }
function expMove(q,r){
  const exp=S.exp; if(!exp||exp.over) return;
  const dq=q-exp.pos.q, dr=r-exp.pos.r;
  if(dq===0&&dr===0) return;
  if(Math.abs(dq)>1||Math.abs(dr)>1||Math.abs(dq+dr)>1){ banner("只能移动到相邻格子"); return; }
  const c=exp.map.cells[q+","+r];
  if(!c) return;
  if(c.used){ exp.pos={q,r}; save(); renderExpPanel(); renderStats(); return; }
  const prev={q:exp.pos.q,r:exp.pos.r};
  exp.pos={q,r}; c.used=true; c.revealed=true;
  let retreat=false;
  switch(c.t){
    case "blank": logEvent("空无一物",'dim'); break;
    case "mat":{ if(Math.random()<0.5){ const m=areaMat(exp.area,exp.floor); exp.loot.push({kind:"mat",id:m.id,name:m.name,qty:1}); logEvent("拾获 "+m.name+" ×1",'sys','collect'); } else logEvent("此地灵气稀薄，一无所获",'dim'); }break;
    case "stone":{ const st=areaStone(exp.area,exp.floor); exp.loot.push({kind:"stone",tier:st.tier,qty:st.qty}); logEvent("拾获 "+(st.tier==="L"?"下品":st.tier==="M"?"中品":st.tier==="H"?"上品":st.tier==="T"?"极品":"神品")+"灵石 ×"+st.qty,'sys','trade'); }break;
    case "dan":{ if(Math.random()<0.55){ const r=areaRec(exp.area,exp.floor,"炼丹"); if(r){ exp.loot.push({kind:"tres",id:r.id,name:r.name,qty:1}); logEvent("拾获丹药 "+r.name+" ×1",'sys','collect'); } } else logEvent("丹炉残渣，一无所获",'dim'); }break;
    case "fu":{ if(Math.random()<0.55){ const r=areaRec(exp.area,exp.floor,"制符"); if(r){ exp.loot.push({kind:"tres",id:r.id,name:r.name,qty:1}); logEvent("拾获符箓 "+r.name+" ×1",'sys','collect'); } } else logEvent("符纸受潮，一无所获",'dim'); }break;
    case "trap":{ const dmg=expDmg(Math.ceil(S.hpMax*0.06)); S.hp-=dmg; logEvent("触发机关！损失 "+dmg+" 气血",'warn'); if(S.hp<=0){ S.hp=1; retreat=true; } }break;
    case "fight":{
      enterBattle("fight",q,r,c,prev); return;
    }break;
    case "down":{
      enterBattle("elite",q,r,c,prev); return;
    }break;
    case "boss":{
      enterBattle("boss",q,r,c,prev); return;
    }break;
    case "exit":{
      const st=areaStone(exp.area,exp.floor); exp.loot.push({kind:"stone",tier:st.tier,qty:st.qty});
      /* v33.5：出口传送与 BOSS 享受同样的额外掉落判定（蛋 / 傀儡 / 兽诀） */
      maybeDropEgg(exp.area, exp.floor);
      maybeDropPu(exp.area);
      maybeDropBook(exp.area, exp.floor);
      logEvent("找到出口传送，携少量收获离开秘境",'sys');
      expFinish(); return;
    }break;
  }
  if(retreat){ expFail(); return; }
  if(c.used) expRevealNearby();
  save(); renderExpPanel(); renderStats();
}
let expTab="explore";
function renderExpPanel(){
  const exp=S.exp; if(!exp) return;
  const ar=EXP_AREAS[exp.area];
  $("expTitle").textContent=ar.nm+"（"+areaDifficulty(exp.area).lv+"）· 第 "+exp.floor+" 层 / 10";
  const viewE=$("expViewExplore"), viewL=$("expViewLoot");
  const tabE=$("expTabExplore"), tabL=$("expTabLoot");
  if(expTab==="loot"){ tabE.classList.remove("active"); tabL.classList.add("active"); viewE.style.display="none"; viewL.style.display="block"; renderExpLoot(); return; }
  tabE.classList.add("active"); tabL.classList.remove("active"); viewE.style.display="block"; viewL.style.display="none";
  const pct=Math.max(0,Math.round(S.hp/S.hpMax*100));
  $("expInfo").textContent="气血 "+Math.floor(S.hp)+"/"+S.hpMax+"（"+pct+"%） · 战力 "+playerPower()+" · 已获 "+exp.loot.length+" 件";
  $("expLegend").textContent="图例：🧍 起点 · 🦶 已探索 · ❓ 迷雾 · ⚔️ 妖兽 · ☠️ 机关 · 🌿 材料 · 💎 灵石 · 💊 丹药 · 🧧 符箓 · ⬇️ 下层入口 · 👹 BOSS · 🚪 出口";
  const svg=$("expSvg"); svg.innerHTML="";
  const R=expMapR(exp.floor), size=Math.floor(140/(R+1)), ox=280, oy=250;
  const pt=(q,r)=>[ox+size*(Math.sqrt(3)*q+Math.sqrt(3)/2*r), oy+size*(1.5*r)];
  const hex=(x,y)=>{ let p=""; for(let i=0;i<6;i++){ const a=Math.PI/180*(60*i+30); p+=(i?" ":"")+(x+size*Math.cos(a)).toFixed(1)+","+(y+size*Math.sin(a)).toFixed(1); } return p; };
  for(const k in exp.map.cells){
    const c=exp.map.cells[k]; const xy=pt(c.q,c.r);
    const isPos=c.q===exp.pos.q&&c.r===exp.pos.r;
    const g=document.createElementNS("http://www.w3.org/2000/svg","g");
    const poly=document.createElementNS("http://www.w3.org/2000/svg","polygon");
    poly.setAttribute("points",hex(xy[0],xy[1]));
    let fill="#2a3550";
    if(c.revealed===false) fill="#151b29";
    else if(isPos) fill="#e8b04b"; else if(c.used) fill="#3d3d3d"; else if(c.t==="boss") fill="#8e2f2f"; else if(c.t==="exit") fill="#2f6e8e"; else if(c.t==="down") fill="#6e4f8e";
    poly.setAttribute("fill",fill); poly.setAttribute("stroke",c.revealed===false?"#26334a":"#c9b88a"); poly.setAttribute("stroke-width","1.2");
    g.appendChild(poly);
    const txt=document.createElementNS("http://www.w3.org/2000/svg","text");
    txt.setAttribute("x",xy[0]); txt.setAttribute("y",xy[1]+4); txt.setAttribute("text-anchor","middle"); txt.setAttribute("font-size",c.revealed===false?"12":"11");
    txt.textContent=c.used?(c.t==="start"?"🧍":"🦶"):(c.revealed===false?"❓":expCellIcon(c.t));
    g.appendChild(txt);
    if(c.t!=="start"){ g.style.cursor="pointer"; g.addEventListener("click",()=>expMove(c.q,c.r)); }
    svg.appendChild(g);
  }
  try{ syncBattleEntry(); }catch(e){}
}
function renderExpLoot(){
  const exp=S.exp; const box=$("expViewLoot");
  if(!exp||!exp.loot.length){ box.innerHTML='<div style="text-align:center;color:var(--ink-dim);padding:40px 0">战利品：（暂无）</div>'; return; }
  const agg={};
  exp.loot.forEach(it=>{
    let nm=it.name||"未知", ic="📦", val=0;
    if(it.kind==="mat"){ const m=MATS_BY_ID[it.id]; if(m){ nm=m.name; val=m.value; ic="🌿"; } }
    else if(it.kind==="tres"){ const r=REC_BY_ID[it.id]; if(r){ nm=r.name; val=r.value||0; ic=icOf(r); } }
    else if(it.kind==="stone"){ const nm2={L:"下品灵石",M:"中品灵石",H:"上品灵石",T:"极品灵石",G:"神品灵石"}[it.tier]||"灵石"; const v2={L:1,M:100,H:10000,T:1000000,G:100000000}[it.tier]||0; nm=nm2; val=v2*(it.qty||1); ic="💎"; }
    const key=nm;
    if(!agg[key]) agg[key]={ic,nm,qty:0,val:0};
    agg[key].qty+=it.qty||1; agg[key].val+=val*(it.qty||1);
  });
  let t='<table style="width:100%;border-collapse:collapse;font-size:13px"><tr style="color:var(--ink-dim);border-bottom:1px solid var(--line)"><th style="text-align:left;padding:6px">物品</th><th style="text-align:center">数量</th><th style="text-align:right">估价(下品)</th></tr>';
  let tot=0;
  Object.keys(agg).forEach(k=>{ const a=agg[k]; tot+=a.val; t+='<tr style="border-bottom:1px solid var(--line)"><td style="padding:6px">'+a.ic+" "+a.nm+'</td><td style="text-align:center">×'+a.qty+'</td><td style="text-align:right">'+fmt(a.val)+'</td></tr>'; });
  t+='<tr style="font-weight:700"><td style="padding:6px">合计</td><td style="text-align:center"></td><td style="text-align:right">'+fmt(tot)+'</td></tr></table>';
  box.innerHTML=t;
}
function renderAchs(body){
  body.innerHTML="";
  const st=document.createElement("div");st.className="sectionTitle";st.textContent="— 证道成就 —";body.appendChild(st);
  const p=document.createElement("div");p.className="hint";p.textContent="成就达成后奖励不会自动发放，需在下方手动点击「领取」。部分累计型成就（设施/大道碎片）可多次领取。";body.appendChild(p);
  ACHS.forEach(a=>{
    const pend=S.achPending.includes(a.id);
    const got=(S.achGot[a.id]||0) + (a.multi?0:(S.ach.includes(a.id)?1:0));
    const can=claimableTimes(a);
    // v31.6 非 multi 成就已领判定：领取后 claimableTimes 归 0，按 got>0 判定已领取
    const done = a.multi ? (got>=can && can>0) : got>0;
    const item=document.createElement("div");
    item.className="item"+(pend?" afford":"")+(done?"":" locked");
    // v30.4 奖励自动换算：multi 成就显示下次领取奖励，普通成就显示固定奖励
    const nextRw = typeof a.rw==="function" ? a.rw(Math.min(got+1, Math.max(can,1))) : (a.rw||0);
    // v31.3 奖励显示：本次奖励+换算灵石，括号内显示下一级领取（换算），不再显示下品数
    const hasNxt = a.multi && typeof a.rw==="function" && (got+1) < (a.max||999);
    const rwTx = nextRw>0 ? "+"+priceLText(splitPriceL(nextRw))+(hasNxt?("（下一级领取 "+priceLText(splitPriceL(a.rw(got+2)))+"）"):"") : "无";
    const progLine = a.multi
      ? (a.max && a.max<999)
        ? `<div class="ln">领取次数 <b>${got}</b>/${a.max}${got>=a.max?"（已达成）":""}</div>`
        : `<div class="ln">已领 <b>${got}</b> 次 / 不限${done?"（已领完当前进度）":(can>0?" · 可再领 "+(can-got)+" 次":"（未达成）")}</div>`
      : (done?`<div class="ln">已领取</div>`:`<div class="ln">${a.cond(S)?"已达成，待领取":"未达成"}</div>`);
    item.innerHTML=`<div class="ic">${a.ic}</div><div class="body">
      <div class="nm">${a.nm}${done?' <span style="color:var(--jade)">✔</span>':''}</div>
      <div class="ds">${a.ds}</div>
      <div class="cost">${a.multi?"本次奖励":"奖励"} ${rwTx}</div>
      ${progLine}
    </div>`;
    if(pend && !done) item.appendChild(buyBtn(true,()=>{claimAch(a);},"领取"));
    body.appendChild(item);
  });
}

