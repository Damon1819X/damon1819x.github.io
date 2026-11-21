/* ================================================================
   渲染
   ================================================================ */
function updateBadges(){
  const b=$("achBadge"); if(b){ const n=S.achPending?S.achPending.length:0; b.style.display=n?"":"none"; b.textContent=n; }
}
function renderStats(){
  const pn=$("playerNm"); if(pn) pn.textContent=S.name||"无名散修";
  $("essenceVal").textContent=fmt(S.essence);
  $("essenceRate").textContent = S.yunning? fmt(prodPerSec())+"/s" : "0/s · 待机";
  $("realmName").textContent=realm().full;
  $("realmTitle").textContent=realm().full;
  $("daoVal").textContent=fmt(S.dao);
  $("yunMult").textContent = S.yunning? (S.critBoost? "运功×3" : "运功中") : "暂停";
  $("yunMult").style.color = S.yunning? "var(--jade)" : "var(--ink-dim)";
  $("cL").textContent=fmt(S.stoneL);
  $("cM").textContent=fmt(S.stoneM);
  $("cH").textContent=fmt(S.stoneH);
  $("cT").textContent=fmt(S.stoneT);
  $("cG").textContent=fmt(S.stoneG);
  $("cPerSec").textContent = S.yunning? fmt(prodPerSec())+" 灵气/s" : "0/s · 待机";
  const hpEl=$("cHP");
  if(hpEl){ const pct2=Math.max(0,Math.round(S.hp/S.hpMax*100)); hpEl.textContent=Math.floor(S.hp)+"/"+S.hpMax; hpEl.style.color=pct2>60?"var(--jade)":pct2>30?"#e67e22":"#d9534f"; }
  $("yunBtn").textContent = S.yunning? "运功中…" : "盘膝打坐 · 开始运功";
  $("yunBtn").disabled = S.yunning;
  $("stopYunBtn").style.display = S.yunning? "" : "none";
  const acts=Object.keys(S.buffs).filter(id=>S.buffs[id].until>Date.now());
  $("buffLine").innerHTML = acts.length ? ("生效："+acts.map(id=>{const r=REC_BY_ID[id];const b=S.buffs[id];return `<span style="margin:0 4px">${icOf(r,18)}${r.name}×${b.stack} ${Math.ceil((b.until-Date.now())/60000)}分</span>`;}).join("")) : "";
  const rb=$("rollBtn"); if(rb) rb.style.display=S.root?"none":"";
  const rt=$("rollTip"); if(rt) rt.style.display=S.root?"none":"";
  $("realmDesc").textContent=realm().desc;
  $("metaMult").textContent="×"+fmt(realm().mult);
  $("metaChance").textContent=Math.round(breakChance()*100)+"%";
  if(S.root){
    $("rootName").textContent=S.root.name;
    $("rootLine").innerHTML=S.root.name+' <span class="rootChip">修炼 ×'+S.root.speed+'</span><span class="rootChip">突破上限 '+Math.round(S.root.breakCap*100)+'%</span><span class="rootChip">突破灵力 ×'+S.root.reqMult+'</span>'+(S.root.type==="single"?'<span class="rootChip">修炼暴击 15%</span><span class="rootChip">元素亲和采集</span>':'');
  }else{ $("rootName").textContent="未定"; $("rootLine").textContent="未定灵根"; }
  const need=realmNeed();
  $("breakNeed").textContent=fmt(need);
  $("essenceProg").textContent=fmt(Math.min(S.essence,need))+" / "+fmt(need);
  const bb=$("breakBtn");
  const aff=S.essence>=need;
  bb.disabled=!aff;
  const pct=need>0?Math.min(100,S.essence/need*100):0;
  const bp=$("breakProg"); if(bp) bp.style.width=pct+"%";
  if(aff){ bb.style.background=""; bb.textContent="冲击突破（"+Math.round(breakChance()*100)+"%·失败损失40%所需灵力）"; }
  else { bb.style.background="transparent"; bb.textContent="灵力不足 · 已积累 "+pct.toFixed(1)+"%"; }
  const fb=$("flyBtn");
  if(fb){
    const canFly=S.realm>=4; // 化神期及以上开启飞升之门
    fb.style.display=canFly?"":"none";
    if(canFly){
      const fNeed=realmNeed()*2;
      const gain=ascendShards();
      fb.disabled=S.essence<fNeed;
      fb.textContent = S.essence>=fNeed ? ("飞升（消耗 "+fmt(fNeed)+" 灵力 · 得 "+fmt(gain)+" 大道碎片）") : ("飞升需 "+fmt(fNeed)+" 灵力（当前 "+fmt(S.essence)+"）");
    }
  }
  try{ syncBattleEntry(); }catch(e){}
}
let activeTab="cult";
function switchTab(tab){
  activeTab=tab;
  document.querySelectorAll(".menu-item").forEach(m=>m.classList.toggle("active", m.dataset.tab===tab));
  renderTab();
}
// 多文件拆分后不再有跨脚本函数提升，渲染表改为调用时惰性构建（依赖 08/09 等后续脚本已加载）
let RENDERERS=null;
function getRenderer(tab){
  if(!RENDERERS) RENDERERS={qiang:renderQiang,eqp:renderEqp,attr:renderAttr,xu:renderXu,pu:renderPu,ls:renderPets,gong:renderGong,shen:renderShen,cai:renderCai,zao:renderZao,shop:renderShop,battle:renderBattle,ach:renderAchs};
  return RENDERERS[tab];
}
function renderTab(){
  const cult = activeTab==="cult";
  $("mainPanel").classList.toggle("hide", !cult);
  $("tabBody").classList.toggle("show", !cult);
  if(cult){ render(); renderBattleBar(); renderEquipBar(); return; }
  const fn=getRenderer(activeTab); if(fn) fn($("tabBody"));
  renderBattleBar(); renderEquipBar();
}
function buyBtn(afford, fn, label){
  const b=document.createElement("button"); b.textContent=label; b.disabled=!afford; b.addEventListener("click",()=>fn()); return b;
}
function renderQiang(body){
  body.innerHTML="";
  let st=document.createElement("div");st.className="sectionTitle";st.textContent="— 强化 · 设施产灵气 —";body.appendChild(st);
  let p=document.createElement("div");p.className="hint";p.textContent="强化设施（由原功法迁入）以灵石购买，统一产出灵气。灵石经坊市出售材料兑换获得。";body.appendChild(p);
  FAC.forEach((g,i)=>{
    const unlocked=S.realm>=g.unlock;
    const costL=facCostL(i);
    const p=floorPriceL(costL);
    const afford=canPayL(p);
    const item=document.createElement("div");
    item.className="item"+(unlocked?"":" locked")+(afford&&unlocked?" afford":"");
    item.innerHTML=`<div class="ic">${g.ic}</div><div class="body">
      <div class="nm">${g.name} <span style="font-size:11px;color:var(--mystic)">Lv ${S.fa[i]}</span></div>
      <div class="ds">${unlocked?g.ds:"需突破至「"+realmAt(g.unlock).full+"」解锁"}</div>
      <div class="ln">灵气 +${fmt(facEssOne(i))}/秒（下一级 +${fmt(facEssNext(i))}/秒）</div>
      <div class="cost">${priceLText(p)}</div>
    </div>`;
    item.appendChild(buyBtn(unlocked&&afford,()=>{buyFac(i);render();},"购买"));
    body.appendChild(item);
  });
  st=document.createElement("div");st.className="sectionTitle";st.textContent="— 强化 · 修行升级 —";body.appendChild(st);
  UPS.forEach(u=>{
    const unlocked=S.realm>=u.unlock;
    const costL=upCostL(u.id); const p=floorPriceL(costL); const afford=canPayL(p); const lv=S.ups[u.id];
    const item=document.createElement("div");
    item.className="item"+(unlocked?"":" locked")+(afford&&unlocked?" afford":"");
    item.innerHTML=`<div class="ic">${u.ic}</div><div class="body">
      <div class="nm">${u.name} <span style="font-size:11px;color:var(--mystic)">Lv ${lv}</span></div>
      <div class="ds">${unlocked?u.desc:"需突破至「"+realmAt(u.unlock).full+"」解锁"}</div>
      <div class="cost">${priceLText(p)}</div>
    </div>`;
    item.appendChild(buyBtn(unlocked&&afford,()=>{buyUp(u.id);render();},"升级"));
    body.appendChild(item);
  });
}
function renderGong(body){
  body.innerHTML="";
  const st=document.createElement("div");st.className="sectionTitle";st.textContent="— 功法库（只产灵气，非神通）—";body.appendChild(st);
  const p=document.createElement("div");p.className="hint";p.innerHTML="<b>功法库</b>：收录修炼功法（仅产灵气、非神通）。功法仅能通过<b>坊市随机刷新 / 拍卖会</b>获取，购入后存于须弥空间，点「研习」习得；<b>同一时间只能激活一本</b>，激活的功法决定灵气产出倍率（当前 ×"+gongMul()+"），开局赠送「黄庭经」并默认激活。";body.appendChild(p);
  GONGFAS.forEach(g=>{
    const owned=S.gongs.includes(g.id);
    const have=(S.tres[g.id]||0)>0;
    const active=S.activeGong===g.id;
    const item=document.createElement("div");item.className="item";
    item.innerHTML=`<div class="ic">${icOf(g)}</div><div class="body">
      <div class="nm">${g.name}<span class="cat">${g.tier}</span>${owned?'<span class="cm-tag">已研习</span>':''}${active?'<span class="cm-tag">已激活</span>':''}</div>
      <div class="ds">${g.ds}</div>
      <div class="ln">灵气倍率 ×${g.ess}${have?(' · 持有 '+fmt(S.tres[g.id])):''}</div>
    </div>`;
    if(owned) item.querySelector(".body").appendChild(active
      ? buyBtn(false,()=>{},"已激活")
      : buyBtn(true,()=>{actGong(g.id);},"激活"));
    else if(have) item.querySelector(".body").appendChild(buyBtn(true,()=>{studyGong(g.id);},"研习"));
    body.appendChild(item);
  });
}
function renderShen(body){
  body.innerHTML="";
  const st=document.createElement("div");st.className="sectionTitle";st.textContent="— 神通库（战斗技能）—";body.appendChild(st);
  const p=document.createElement("div");p.className="hint";p.innerHTML="<b>神通库</b>：收录 12 个战斗神通，以<b>大道碎片</b>购买习得；习得后在战斗中以「神通·XX」施展（消耗灵力、按回合冷却），<b>不提供常驻战力/属性加成</b>；碎片也可选择留作修炼加成。<br>大道碎片获取：<b>飞升</b>为主要来源（化神期起每次飞升按累计灵力获得）；<b>阴阳灵根</b>额外 +25%。";body.appendChild(p);
  SHEN.forEach(a=>{
    const owned=S.shen.includes(a.id);
    const item=document.createElement("div");item.className="item";
    item.innerHTML=`<div class="ic">${a.ic}</div><div class="body">
      <div class="nm">${a.name}<span class="cat">${a.cat}</span></div>
      <div class="ds">${a.ds}</div>
      <div class="ln">战斗大招：耗灵 ${(SHEN_BS[a.id]&&SHEN_BS[a.id].cost)||"—"} · 冷却 ${(SHEN_BS[a.id]&&SHEN_BS[a.id].cd)||"—"} 回合 <span class="cm-tag">仅战斗内生效</span></div>
    </div>`;
    item.querySelector(".body").appendChild(owned
      ? buyBtn(false,()=>{},"已习得")
      : buyBtn(S.dao>=a.cost,()=>{buyShen(a);},"购买 · "+a.cost+" 大道碎片"));
    body.appendChild(item);
  });
}
let caiCat="beast";
function renderCai(body){
  body.innerHTML="";
  const st=document.createElement("div");st.className="sectionTitle";st.textContent="— 采集 · 狩猎 / 挖矿 / 采药 —";body.appendChild(st);
  const p=document.createElement("div");p.className="hint";p.innerHTML="深入<b>十万大山</b>采集，狩猎 / 挖矿 / 采药共用一张<b>统一稀有度概率表</b>：<b>外围区域</b>可采稀有 1-4（炼气解锁）· <b>中部区域</b>可采稀有 1-6（元婴解锁）· <b>核心区域</b>可采稀有 1-8（合体解锁），区域只做<b>上限截断、不做归一化</b>；每次采集 50% 成功率，成功后<b>每件材料各自按所属稀有度档位的概率独立结算</b>（不按件数平摊），但<b>每次只采得 1 件</b>——若多件同时命中，在命中者中<b>随机取一件</b>。每个采集框独立选择区域、独立挂机；「立即采集」全局 15 秒冷却（三框共享）。材料存放于须弥空间，可用于制造。"+(S.yunning?'<br><b style="color:#e05555">运功进行中，采集已暂停，请先停止运功。</b>':"");body.appendChild(p);
  const CATS=[
    {cid:"beast", nm:"狩猎", ic:"🏹", cat:"妖兽材料", ds:"进入深山猎取妖兽，随机得到一种妖兽材料。"},
    {cid:"ore",   nm:"挖矿", ic:"⛏️", cat:"矿石",       ds:"下矿层挖掘，随机得到一种矿石。"},
    {cid:"herb",  nm:"采药", ic:"🪴", cat:"草药",       ds:"进入灵山采撷，随机得到一种草药。"},
  ];
  // 顶部子页按钮
  const bar=document.createElement("div");bar.className="craftBar";body.appendChild(bar);
  CATS.forEach(c=>{
    const b=buyBtn(true,()=>{ caiCat=c.cid; render(); }, c.ic+" "+c.nm);
    if(caiCat===c.cid) b.classList.add("active");
    bar.appendChild(b);
  });
  const cur=CATS.find(c=>c.cid===caiCat)||CATS[0];
  const blocked=S.yunning||!!S.making;
  const cdLeft=Math.max(0,Math.ceil((S.collectCd-Date.now())/1000));
  const auto = S.collect[cur.cid]!==undefined;
  const zn=zoneOf(cur.cid);
  const cp=collectPool(cur.cid);            // 与抽取共用口径（含单灵根元素亲和）
  const pool=cp.items;
  const item=document.createElement("div");item.className="item";
  item.innerHTML=`<div class="ic">${cur.ic}</div><div class="body">
    <div class="nm">${cur.nm}<span class="cat">${cur.cat}</span></div>
    <div class="ds">${cur.ds}</div>
  </div>`;
  const bodyEl=item.querySelector(".body");
  // 区域下拉
  const zbar=document.createElement("div");zbar.style.cssText="display:flex;align-items:center;gap:8px;margin:2px 0 6px;font-size:12px;color:var(--ink-dim);flex-wrap:wrap;";
  zbar.appendChild(document.createTextNode("🗺️ 区域："));
  const zsel=document.createElement("select");zsel.style.cssText="padding:4px 6px;border-radius:6px;font-size:12px;background:var(--panel2);color:var(--ink);border:1px solid var(--line);max-width:220px";
  ["外","中","内"].forEach(z=>{
    const o=document.createElement("option");o.value=z;o.textContent=ZONES[z].nm+"（稀有"+ZONES[z].lo+"-"+ZONES[z].hi+"）"+(zoneUnlocked(z)?"":" · "+REALMS[ZONES[z].unlock].full+"解锁");
    o.disabled=!zoneUnlocked(z);
    if(zn===ZONES[z]) o.selected=true;
    zsel.appendChild(o);
  });
  zsel.addEventListener("change",()=>{ setZone(cur.cid, zsel.value); render(); });
  zbar.appendChild(zsel); bodyEl.appendChild(zbar);
  const znRow=document.createElement("div");znRow.style.cssText="margin:2px 0 2px;font-size:12px;color:var(--jade)";
  znRow.textContent="当前："+zn.nm+"（稀有 "+zn.lo+"-"+cp.hi+(cp.hi>zn.hi?" · 元素亲和 +1":"")+"）"+(pool.length?(" · 可出 "+pool.map(m=>m.name).join("、")):"");
  bodyEl.appendChild(znRow);
  const wr=document.createElement("div");wr.className="btnRow";
  const c1=document.createElement("button");c1.id="collectBtn-"+cur.cid;c1.textContent=cdLeft>0?"采集中 "+cdLeft+"s":"立即采集";c1.disabled=blocked||cdLeft>0;
  c1.addEventListener("click",()=>{ if(S.yunning){banner("运功中不可采集，请先停止运功");return;} if(S.making){banner("炼制中不可采集，请等待完成");return;} collectByCat(cur.cid); render(); });
  const c2=document.createElement("button");c2.textContent=auto?"停止挂机":"挂机";c2.className=auto?"on":"";c2.disabled=blocked;
  c2.addEventListener("click",()=>{ if(S.yunning){banner("运功中不可采集，请先停止运功");return;} if(S.making){banner("炼制中不可采集，请等待完成");return;} auto? delete S.collect[cur.cid] : S.collect[cur.cid]=0; render(); });
  wr.appendChild(c1);wr.appendChild(c2); bodyEl.appendChild(wr);
  body.appendChild(item);
  // 材料全览（可滚动）
  const st2=document.createElement("div");st2.className="sectionTitle";st2.textContent="— "+cur.cat+" 全览 —";body.appendChild(st2);
  const sc=document.createElement("div");sc.style.cssText="max-height:240px;overflow-y:auto;border:1px solid var(--line);border-radius:8px;padding:6px 8px;background:var(--panel2)";
  // v28 三采全览按稀有度升序排列（稀1 → 稀8，与统一概率表顺序一致）
  MATS.filter(m=>m.cat===cur.cat).sort((a,b)=>a.rarity-b.rarity).forEach(m=>{
    const row=document.createElement("div");row.className="exchRow";
    const _in=pool.some(x=>x.id===m.id);
    const _p=(RARITY_POOL_PROB[Math.min(Math.max((m.rarity||1)-1,0),7)]||0);
    row.innerHTML=`<span class="ex-n">${m.ic} ${m.name} · 稀有${m.rarity} · 单价 ${m.value}`
      +(_in?` <span style="color:var(--jade);font-size:11px">· 可采 · 档位 ${_p}%</span>`:` <span style="color:var(--ink-dim);font-size:11px">· 超区域上限</span>`)+`</span>`;
    sc.appendChild(row);
  });
  body.appendChild(sc);
}
let zaoCat="制符";
let cycQtyId=null;
function openCycQty(rId){
  cycQtyId=rId; const r=REC_BY_ID[rId];
  const t=(S.cycle&&S.cycle.rId===rId)?S.cycle.target:1;
  $("cycQtyTitle").textContent="— 循环制造目标 —";
  $("cycQtyInfo").innerHTML="「"+(r?r.name:rId)+"」达到目标件数后自动停止循环。";
  const q=$("cycQty"); q.min=1; q.value=t;
  $("cycQtyOverlay").classList.add("show");
}
function closeCycQty(){ cycQtyId=null; $("cycQtyOverlay").classList.remove("show"); }
function setCycQty(){
  if(!cycQtyId) return;
  let t=parseInt($("cycQty").value)||1; if(t<1) t=1;
  if(S.cycle && S.cycle.rId===cycQtyId){ S.cycle.target=t; if(S.cycle.made>S.cycle.target) S.cycle.made=S.cycle.target; logEvent("循环目标调整为 "+t+" 件",'sys'); }
  else { S.cycle={rId:cycQtyId, target:t, made:0}; startCycleFirst(); }
  closeCycQty(); render(); save();
}
function startCycleFirst(){
  const cr=REC_BY_ID[S.cycle.rId];
  if(S.yunning){ S.yunning=false; S.critBoost=false; logEvent("循环制造开始，已停止运功",'','craft'); }
  for(const c in S.collect){ if(S.collect[c]!==undefined){ delete S.collect[c]; logEvent("循环制造开始，已停止挂机采集",'','craft'); break; } }
  if(!cr) return;
  logEvent("开启循环制造：「"+cr.name+"」，目标 "+S.cycle.target+" 件",'sys','craft');
  banner("循环制造开启：目标 "+S.cycle.target+" 件");
  if(!S.making && !S.yunning){
    let ok3=true; for(const k in cr.need){ if((S.mats[k]||0)<cr.need[k]){ ok3=false; break; } }
    if(ok3){ craftItem(cr); S.cycle.made++; }
  }
}
function toggleCycle(rId){
  if(S.cycle && S.cycle.rId===rId){ S.cycle=null; logEvent("已停止循环制造",'','craft'); return; }
  openCycQty(rId); // 开启时弹出对话框供玩家输入循环目标数量，确认后启动
}
function renderZao(body){
  body.innerHTML="";
  const st=document.createElement("div");st.className="sectionTitle";st.textContent="— 制造 —";body.appendChild(st);
  const p=document.createElement("div");p.className="hint";p.innerHTML="以材料合成物品，分制符 / 炼丹 / 炼器 / 阵法四类配方。点击上方分类按钮查看对应配方，炼器产出装备，其余产出各类物品，均存入背包（须弥空间）。"+(S.yunning?'<br><b style="color:#e05555">运功进行中，制造已暂停，请先停止运功。</b>':"");body.appendChild(p);
  // 分类按钮 sticky 置顶中列（不随配方列表滚动）：点按切换显示对应分类明细
  const bar=document.createElement("div");bar.className="craftBar";
  bar.style.cssText="position:sticky;top:0;z-index:5;background:var(--bg,#1a1f2e);padding:8px 0;margin:6px 0;border-bottom:1px solid var(--line);";
  body.appendChild(bar);
  CRAFT.forEach(c=>{
    const b=buyBtn(true,()=>{ zaoCat=c.cat; render(); }, c.ic+" "+c.cat);
    if(zaoCat===c.cat) b.classList.add("active");
    bar.appendChild(b);
  });
  const cur=CRAFT.find(c=>c.cat===zaoCat)||CRAFT[0];
  if(S.cycle){ const hc=document.createElement("div");hc.className="hint";const hr=REC_BY_ID[S.cycle.rId];hc.innerHTML='<b style="color:var(--jade)">🔄 循环制造中：「'+(hr?hr.name:S.cycle.rId)+'」</b> · 目标 <b>'+S.cycle.target+'</b> 件 · 已制 <b>'+S.cycle.made+'</b> 件（达到目标或材料不足自动停止）';body.appendChild(hc); }
  const stC=document.createElement("div");stC.className="sectionTitle";stC.textContent=cur.ic+" — "+cur.cat+" · "+cur.ds+" —";body.appendChild(stC);
  cur.rec.forEach(r=>{
    const item=document.createElement("div");item.className="item";
    const needTxt=Object.keys(r.need).map(k=>{ const m=MATS_BY_ID[k]; return (m?m.name:k)+"×"+r.need[k]+"（持有 "+(S.mats[k]||0)+"）"; }).join(" + ");
    let can=true; for(const k in r.need){ if((S.mats[k]||0)<r.need[k]){ can=false; break; } }
    can = can && !S.yunning && !S.making; // 运功/制造中禁止制造
    item.innerHTML=`<div class="ic">${icOf(r)}</div><div class="body">
      <div class="nm">${r.name}<span class="cat">${cur.cat}</span>${r.slot?`<span class="cat">装备</span><span class="cat">${SLOT_NAMES[r.slot]}</span>`:""}</div>
      <div class="ds">${r.ds||"无"}</div>
      <div class="ln" style="color:var(--jade)">效果：${r.isPu?("制成"+(LV_NM[r.puLv||"丁"]||"丁")+"傀 · 效率"+Math.round(SV_EFF[r.puLv||"丁"]*100)+"% · 自动采集制造"):(isEquip(r.id)?eqText(r):effText(r))}</div>
      <div class="ln">持有 <b>${fmt(isEquip(r.id)?equipCount(r.id):S.tres[r.id]||0)}</b> · 价值 ${priceLText(splitPriceL(r.value))}</div>
      <div class="cost">配方：${needTxt}</div>
    </div>`;
    const busy=S.making&&S.making.rId===r.id; const mkTxt=busy?("炼制中 "+Math.max(0,Math.ceil((S.making.end-Date.now())/1000))+"s"):"合成";
    const mkBtn=buyBtn(can,()=>{craftItem(r);render();},mkTxt);
    item.querySelector(".body").appendChild(mkBtn);
    // 循环制造：滑块开关 + 目标数量（点击目标弹出对话框填写）
    const cycOn=!!(S.cycle&&S.cycle.rId===r.id);
    const cycRow=document.createElement("div");cycRow.style.cssText="display:flex;align-items:center;gap:8px;margin-top:7px;font-size:12px";
    const sw=document.createElement("label");sw.className="sw";sw.title="循环制造开关";
    const cb=document.createElement("input");cb.type="checkbox";cb.checked=cycOn;
    cb.addEventListener("change",()=>{ toggleCycle(r.id); render(); });
    const sl=document.createElement("span");sl.className="sl";sw.appendChild(cb);sw.appendChild(sl);
    cycRow.appendChild(sw);
    const cycTxt=document.createElement("span");
    cycTxt.textContent=cycOn?("目标 "+S.cycle.target+" 件 · 已制 "+S.cycle.made):"循环制造（目标 1 件）";
    cycTxt.style.cursor="pointer";cycTxt.style.color=cycOn?"var(--jade)":"var(--ink-dim)";
    cycTxt.title=cycOn?"点击修改目标数量":"开启循环后点击可修改目标数量";
    cycTxt.addEventListener("click",()=>{ if(S.cycle&&S.cycle.rId===r.id) openCycQty(r.id); });
    cycRow.appendChild(cycTxt);
    item.querySelector(".body").appendChild(cycRow);
    // 傀儡制造：下拉只列空闲傀儡（未指派任务），可把本配方直接指派给该傀儡
    const idleList=S.servants.map((s,i)=>({s,i})).filter(o=>!o.s.task);
    const puRow=document.createElement("div");puRow.style.cssText="display:flex;align-items:center;gap:8px;margin-top:7px;font-size:12px;flex-wrap:wrap";
    const puLbl=document.createElement("span");puLbl.textContent="傀儡制造：";puLbl.style.color="var(--ink-dim)";puRow.appendChild(puLbl);
    const puSel=document.createElement("select");
    puSel.style.cssText="padding:6px 8px;border-radius:7px;font-size:12px;background:var(--panel2);color:var(--ink);border:1px solid var(--line);max-width:200px;";
    if(idleList.length){
      idleList.forEach(o=>{ const op=document.createElement("option");op.value=o.i;op.textContent=(SV_AV[o.s.lv]||"🪵")+" "+(LV_NM[o.s.lv]||o.s.lv)+"傀 · 效率 "+Math.round((SV_EFF[o.s.lv]||0.4)*100)+"%";puSel.appendChild(op); });
    } else {
      const op=document.createElement("option");op.value="";op.textContent="无空闲傀儡";puSel.appendChild(op);puSel.disabled=true;
    }
    puRow.appendChild(puSel);
    // v31.16：探索中与整页制造互斥一致，禁止指派（此前探索态残留时仍可点，容易误判为"傀儡制造锁死运功"）
    if(S.exp) puSel.disabled=true;
    const puBtn=buyBtn(!S.exp && idleList.length>0,()=>{
      if(S.exp){ banner("探索中不可指派傀儡制造，请先结束探索"); return; }
      const idx=parseInt(puSel.value,10); const sv0=S.servants[idx];
      if(!sv0||sv0.task){ banner("该傀儡已在任务中"); render(); return; }
      sv0.task={kind:"zao", t:cur.cat, rId:r.id}; sv0.prog=0; sv0.curR=null;
      const nm=(LV_NM[sv0.lv]||sv0.lv)+"傀";
      logEvent("指派"+nm+"制造「"+r.name+"」",'sys','craft');
      banner(nm+"开始制造「"+r.name+"」");
      render();
    },"傀儡制造");
    puRow.appendChild(puBtn);
    // 已有傀儡在做本配方时给出提示
    const puBusy=S.servants.filter(sv2=>sv2.task&&sv2.task.kind==="zao"&&sv2.task.rId===r.id);
    if(puBusy.length){
      const tip2=document.createElement("span");tip2.style.color="var(--jade)";tip2.style.fontSize="12px";
      tip2.textContent="⏳ "+puBusy.map(sv2=>(LV_NM[sv2.lv]||sv2.lv)+"傀").join("、")+"制造中";
      puRow.appendChild(tip2);
    }
    item.querySelector(".body").appendChild(puRow);
    body.appendChild(item);
  });
}
function uiConfirm(title,msgHtml,okLabel,onOk){
  const mask=document.createElement("div");mask.className="eqPickMask";
  mask.onclick=(ev)=>{ if(ev.target===mask) mask.remove(); };
  const box=document.createElement("div");box.className="eqPickBox";
  box.style.cssText="align-items:stretch;gap:10px;";
  const t=document.createElement("div");t.className="eqTitle";t.textContent=title;box.appendChild(t);
  const m=document.createElement("div");m.style.cssText="font-size:13px;line-height:1.7;color:var(--ink,#e8e8ee);";m.innerHTML=msgHtml;box.appendChild(m);
  const bt=document.createElement("div");bt.style.cssText="display:flex;justify-content:flex-end;gap:8px;margin-top:6px;";
  bt.appendChild(buyBtn(true,()=>{mask.remove();},"取消"));
  bt.appendChild(buyBtn(true,()=>{mask.remove();onOk&&onOk();},okLabel||"确定"));
  box.appendChild(bt);
  mask.appendChild(box);
  document.body.appendChild(mask);
}
function renderPu(body){
  body.innerHTML="";
  const st=document.createElement("div");st.className="sectionTitle";st.textContent="— 傀儡 —";body.appendChild(st);
  const nx=puNext();
  const capBar=document.createElement("div");capBar.className="hint";
  capBar.innerHTML="<b>傀儡上限："+S.servants.length+" / "+puCap()+"</b>　（炼气 1 → 金丹 2 → 元婴 3 → 化神 4 → <b>合体 5</b>）<span style='color:var(--jade)'>· 按历史最高境界保留，飞升不回落</span>"+(nx?("　下一档：<b>"+REALMS[nx.realm].full+"</b> 解锁至 "+nx.cap):"　<b style=\"color:var(--jade)\">已达满额 5 台</b>")+"<br>石傀 / 铁傀 / 玉傀 另可由<b>原始禁区 / 上古战场 / 跨界空间</b>底关 BOSS 以 <b>1%</b> 概率掉落。";
  body.appendChild(capBar);
  const p=document.createElement("div");p.className="hint";p.innerHTML="傀儡以玩家效率（100%）的比例代你采集 / 制造：<b>玉 90%</b>、铁 75%、石 60%、<b>木 40%</b>（玉傀最快、木傀最慢）。指派任务后自动持续产出，无需手动操作；傀儡产出与玩家状态（运功 / 采集 / 制造）互不干扰。制造任务可细分到<b>具体配方</b>（也可选「随机配方」），材料不足时自动等待重试。指派后按钮变为红色「停止」，点击即可停止任务。";body.appendChild(p);
  if(!S.servants.length){ const e=document.createElement("div");e.className="hint";e.textContent="尚无傀儡。";body.appendChild(e); return; }
  const taskOpts=[["","— 无任务 —"],["cai:beast","狩猎（兽类材料）"],["cai:ore","挖矿（矿石）"],["cai:herb","采药（草药）"],["zao:制符","制造·制符"],["zao:炼丹","制造·炼丹"],["zao:炼器","制造·炼器"],["zao:阵法","制造·阵法"]];
  const selStyle="padding:6px 8px;border-radius:7px;font-size:12px;background:var(--panel2);color:var(--ink);border:1px solid var(--line);max-width:180px;";
  S.servants.forEach((s,i)=>{
    const item=document.createElement("div");item.className="item";
    const effTxt=Math.round(SV_EFF[s.lv]*100)+"%";
    let taskTxt="空闲";
    if(s.task){
      if(s.task.kind==="cai") taskTxt = (s.task.t==="beast"?"狩猎":s.task.t==="ore"?"挖矿":"采药")+(s.task.zone&&ZONES[s.task.zone]?("·"+ZONES[s.task.zone].nm):"");
      else taskTxt = "制造·"+s.task.t+(s.task.rId ? (REC_BY_ID[s.task.rId]?"（"+REC_BY_ID[s.task.rId].name+"）":"（"+s.task.rId+"）") : "（随机配方）");
    }
    let progTxt="";
    if(s.task){
      const eff=SV_EFF[s.lv]||0.4;
      let iv=15/eff;
      if(s.task.kind==="zao"){
        const full=(CRAFT.find(c=>c.cat===s.task.t)||{rec:[]}).rec;
        const r0=s.curR||(s.task.rId?full.find(r=>r.id===s.task.rId):full[0]);
        if(r0) iv=craftTime(r0)/eff;
      }
      progTxt=' · 进度 <span id="svProg'+i+'">'+s.prog.toFixed(1)+"/"+iv.toFixed(1)+"s</span>";
    }
    item.innerHTML=`<div class="ic">👤</div><div class="body">
      <div class="nm">${SV_AV[s.lv]||"🪵"} ${LV_NM[s.lv]||s.lv}傀 <span class="cat">效率 ${effTxt}</span></div>
      <div class="ds">任务：${taskTxt}${progTxt}</div>
    </div>`;
    const wr=document.createElement("div");wr.className="btnRow";wr.style.cssText="width:100%;flex-wrap:wrap;";
    const sel=document.createElement("select");sel.style.cssText=selStyle;
    taskOpts.forEach(o=>{ const op=document.createElement("option");op.value=o[0];op.textContent=o[1];sel.appendChild(op); });
    const cur=s.task?(s.task.kind+":"+s.task.t):"";
    sel.value=cur;
    const sel2Wrap=document.createElement("div");sel2Wrap.style.cssText="display:"+(cur.startsWith("zao:")?"flex":"none")+";gap:6px;align-items:center;";
    const sel2=document.createElement("select");sel2.style.cssText=selStyle;
    sel2Wrap.appendChild(sel2);
    function fillRecipes(){
      sel2.innerHTML="";
      const op0=document.createElement("option");op0.value="";op0.textContent="随机配方";sel2.appendChild(op0);
      const cat=(sel.value||"").split(":")[1];
      const full=cat?(CRAFT.find(c=>c.cat===cat)||{rec:[]}).rec:[];
      full.forEach(r=>{ const op=document.createElement("option");op.value=r.id;op.textContent=r.name;sel2.appendChild(op); });
      sel2.value=(s.task&&s.task.kind==="zao"&&s.task.rId)?s.task.rId:"";
    }
    const sel3Wrap=document.createElement("div");sel3Wrap.style.cssText="display:"+(cur.startsWith("cai:")?"flex":"none")+";gap:6px;align-items:center;";
    const sel3=document.createElement("select");sel3.style.cssText=selStyle;
    [["外","外围区域（稀有1-4）"],["中","中部区域（稀有1-6）"],["内","核心区域（稀有1-8）"]].forEach(z=>{ const op=document.createElement("option");op.value=z[0];op.textContent=z[1]; if(!zoneUnlocked(z[0])){ op.disabled=true; op.textContent+="（需"+REALMS[ZONES[z[0]].unlock].full+"）"; } sel3.appendChild(op); });
    sel3.value=(s.task&&s.task.kind==="cai"&&s.task.zone)?s.task.zone:"外";
    sel3Wrap.appendChild(sel3);
    fillRecipes();
    sel.addEventListener("change",()=>{ const v=sel.value; if(v.startsWith("zao:")){ fillRecipes(); sel2Wrap.style.display="flex"; sel3Wrap.style.display="none"; } else if(v.startsWith("cai:")){ sel2Wrap.style.display="none"; sel3Wrap.style.display="flex"; } else { sel2Wrap.style.display="none"; sel3Wrap.style.display="none"; } });
    wr.appendChild(sel);
    wr.appendChild(sel2Wrap);
    wr.appendChild(sel3Wrap);
    if(s.task){
      const stopBtn=buyBtn(true,()=>{ s.task=null; s.prog=0; s.curR=null; logEvent((LV_NM[s.lv]||s.lv)+"傀停止任务",'dim'); render(); },"停止");
      stopBtn.style.background="linear-gradient(135deg,#d9534f,#b03a35)"; stopBtn.style.color="#fff";
      wr.appendChild(stopBtn);
    } else {
      wr.appendChild(buyBtn(true,()=>{
        const v=sel.value;
        if(!v){ s.task=null; s.prog=0; s.curR=null; logEvent((LV_NM[s.lv]||s.lv)+"傀停止任务",'dim'); }
        else {
          const parts=v.split(":");
          const rId=parts[0]==="zao"?(sel2.value||null):null;
          s.task={kind:parts[0],t:parts[1],rId:rId, zone:parts[0]==="cai"?(sel3.value||"外"):undefined};
          s.prog=0; s.curR=null;
          const nm=parts[0]==="cai"?(parts[1]==="beast"?"狩猎":parts[1]==="ore"?"挖矿":"采药"):"制造·"+parts[1]+(rId?(REC_BY_ID[rId]?"（"+REC_BY_ID[rId].name+"）":""):"（随机）");
          logEvent("指派"+(LV_NM[s.lv]||s.lv)+"傀「"+nm+"」",'sys'); banner((LV_NM[s.lv]||s.lv)+"傀开始"+nm);
        }
        render();
      },"指派"));
    }
    item.querySelector(".body").appendChild(wr);
    // 出售按钮：独立挂于傀儡框最右端（不随指派按钮行），垂直居中贴右
    const sv=SV_VAL[s.lv]||30000;
    const svUp=Math.floor(sv/10000), svL=sv%10000;
    const gainTxt=(svUp?svUp+" 上品":"")+(svL?svL+" 下品":"")+"灵石";
    const nm=(LV_NM[s.lv]||s.lv)+"傀";
    const sellBtn=buyBtn(true,()=>{
      uiConfirm("出售"+nm, "是否确定以 <b>"+gainTxt+"</b> 出售「"+nm+"」？<br>此傀儡将被移除且任务结束。", "出售", ()=>{
        S.servants.splice(i,1);
        S.stoneH=(S.stoneH||0)+svUp;
        if(svL) S.stoneL=(S.stoneL||0)+svL;
        logEvent("出售"+nm+"，获得 "+gainTxt,'sys');
        banner("已出售"+nm+" +"+gainTxt);
        render();
      });
    },"出售");
    sellBtn.style.cssText="align-self:center;margin-left:auto;white-space:nowrap;flex-shrink:0;";
    item.appendChild(sellBtn);
    body.appendChild(item);
  });
}
/* ===== 装备系统 v18 ===== */
function isEquip(id){ const r=REC_BY_ID[id]; return !!(r&&r.slot); }
const SLOT_NAMES={w:"武器",h:"头部",a:"防具",r1:"戒指·壹",r2:"戒指·贰",n:"项链",m:"法宝"};
const SLOT_KEYS=["w","h","a","r1","r2","n","m"];
function eqText(r,it){
  const p=[];
  if(r.atk)p.push("战力 +"+r.atk+"%");
  if(r.hp)p.push("气血上限 +"+r.hp+"%");
  if(r.ess)p.push("灵气产出 +"+r.ess+"%");
  if(r.crit)p.push("会心 +"+r.crit+"%");
  if(r.brk)p.push("突破成功率 +"+r.brk+"%");
  if(r.dmgR)p.push("受伤减免 "+r.dmgR+"%");
  const s=subText(it);
  if(s)p.push(s);
  return p.join(" · ");
}
function equippedItems(){ const o=[]; for(const sl in S.equipped){ const uid=S.equipped[sl]; if(uid!=null){ const it=(S.equip||[]).find(x=>x.uid===uid); if(it)o.push(it); } } return o; }
function eqSum(key){ return equippedItems().reduce((a,it)=>{ const r=REC_BY_ID[it.id]; return a+(r&&r[key]?r[key]:0); },0); }
/* v31：灵兽加成改为出战灵兽聚合，petSum 新实现在「灵兽系统」数据块 */
/* ============ 装备副属性词条（人物属性设计 7.2）：炼器装备随机 1–2 条，数值随稀有度提升 ============ */
const SUB_DEF={spd:["速度",[1,2,3,4,5,6,8,9,10,12]],hit:["命中",[1,2,2,3,3,4,5,6,8,10]],dodge:["闪避",[1,1,2,2,3,3,4,5,6,8]],res:["五行抗性",[2,2,3,3,4,4,5,6,8,10]],critDmg:["暴击伤害",[3,4,5,6,8,10,12,15,18,22]],pool:["灵力池",[2,3,4,5,6,8,10,12,15,18]]};
const RES_ELMS=["金","木","水","火","土"];
function rollSubstats(id){
  const r=REC_BY_ID[id]; if(!r||!r.slot) return null;
  const rarity=Math.min(10,Math.max(1,r.rarity||1));
  const want=1+(Math.random()<(0.20+rarity*0.05)?1:0);
  const keys=Object.keys(SUB_DEF);
  const got={}; const sub=[]; let guard=0;
  while(sub.length<want&&guard++<12){
    const k=keys[Math.floor(Math.random()*keys.length)];
    if(got[k]) continue;
    got[k]=1;
    const arr=SUB_DEF[k][1];
    sub.push(k==="res"?{k,e:RES_ELMS[Math.floor(Math.random()*RES_ELMS.length)],v:arr[rarity-1]}:{k,v:arr[rarity-1]});
  }
  return sub;
}
function newEquip(id){ return {uid:++S.uid,id,sub:rollSubstats(id)}; }
function eqSubSum(k){ return equippedItems().reduce((a,it)=>{ if(!it.sub) return a; let s=0; it.sub.forEach(x=>{ if(x.k===k)s+=x.v; }); return a+s; },0); }
function eqResSum(e){ return equippedItems().reduce((a,it)=>{ if(!it.sub) return a; let s=0; it.sub.forEach(x=>{ if(x.k==="res"&&x.e===e)s+=x.v; }); return a+s; },0); }
function subText(it){
  if(!it||!it.sub||!it.sub.length) return "";
  return it.sub.map(x=>x.k==="res"?("五行抗性·"+x.e+" +"+x.v+"%"):(SUB_DEF[x.k][0]+" +"+x.v+(x.k==="spd"?"":"%"))).join(" · ");
}
function wearEquip(id){
  const r=REC_BY_ID[id]; if(!r||!r.slot) return;
  const it=(S.equip||[]).find(x=>x.id===id && !(x.uid===S.equipped[r.slot]));
  if(!it){ banner("没有可穿戴的「"+r.name+"」"); return; }
  S.equipped[r.slot]=it.uid;
  logEvent("穿戴「"+r.name+"」（"+SLOT_NAMES[r.slot]+"）",'sys'); sound(520,.15);
  save(); render();
}
function unequipEquip(sl){ if(S.equipped[sl]==null) return; const uid=S.equipped[sl]; S.equipped[sl]=null; const it=(S.equip||[]).find(x=>x.uid===uid); logEvent("卸下「"+(it?REC_BY_ID[it.id].name:"装备")+"」",'dim'); save(); render(); }
function sellEquip(id){
  const r=REC_BY_ID[id]; if(!r) return;
  const worn=Object.values(S.equipped||{}).filter(u=>u!=null);
  const idx=(S.equip||[]).findIndex(x=>x.id===id && !worn.includes(x.uid));
  if(idx<0){ banner("已穿戴的装备不可出售，请先卸下"); return; }
  const uid=S.equip[idx].uid; S.equip.splice(idx,1);
  for(const sl in S.equipped){ if(S.equipped[sl]===uid) S.equipped[sl]=null; }
  addL(splitPriceL(r.value));
  logEvent("出售装备「"+r.name+"」，获 "+priceLText(splitPriceL(r.value))+"（"+fmt(r.value)+" 下品）",'sys'); sound(520,.15); save(); render();
}
function equipCount(id){ return (S.equip||[]).filter(x=>x.id===id).length; }
/* ============ 灵兽页 v31：蛋仓 · 孵化槽 · 温养 · 兽栏养成 ============ */
function petTraitText(b){
  const p=[];
  if(b.type==="攻") p.push("战力 +"+b.attr+"%");
  else p.push("修炼 +"+b.attr+"%");
  if(b.extra&&b.extra.atk) p.push("战力 +"+b.extra.atk+"%");
  if(b.traits){ if(b.traits.ess)p.push("灵气 +"+b.traits.ess+"%"); if(b.traits.crit)p.push("会心 +"+b.traits.crit+"%"); if(b.traits.brk)p.push("突破 +"+b.traits.brk+"%"); if(b.traits.dmgR)p.push("减伤 +"+b.traits.dmgR+"%"); }
  return p.join(" · ")||"—";
}
function feedPickModal(uid){
  const it=petByUid(uid); if(!it) return;
  const b=NEW_BEAS_BY_ID[it.id];
  const mask=document.createElement("div");mask.className="eqPickMask";mask.onclick=(ev)=>{ if(ev.target===mask) mask.remove(); };
  const box=document.createElement("div");box.className="eqPickBox";
  const t=document.createElement("div");t.className="eqTitle";t.textContent="喂养「"+b.name+"」· 选择材料";box.appendChild(t);
  const stat=document.createElement("div");stat.className="hint";stat.style.cssText="margin:6px 0 8px;font-size:12px;color:var(--jade)";box.appendChild(stat);
  const list=document.createElement("div");list.className="eqList";box.appendChild(list);
  function refresh(){
    stat.textContent="饱食 "+Math.floor(it.sat)+"/100 · 亲密 "+Math.floor(it.int)+"/100";
    list.innerHTML="";
    const full=it.sat>=100&&it.int>=100;
    if(full){ const e=document.createElement("div");e.className="hint";e.textContent="饱食与亲密均已满，无需再喂养。";list.appendChild(e); }
    const opts=Object.keys(S.mats).filter(k=>(S.mats[k]||0)>0&&MATS_BY_ID[k]);
    if(!opts.length&&!full){ const e=document.createElement("div");e.className="hint";e.textContent="须弥空间中没有材料，先去采集或探索。";list.appendChild(e); }
    opts.forEach(k=>{
      const m=MATS_BY_ID[k];
      const row=document.createElement("div");row.className="eqPickRow";
      row.innerHTML=`<span class="nm">${m.ic||""} ${m.name}<div class="sub">${m.cat} · 稀${m.rarity} · 持有 ${S.mats[k]}</div></span><span class="sub">饱食+${10*m.rarity} / 亲密+${m.rarity}</span>`;
      const fb=buyBtn(!full&&(S.mats[k]||0)>=1,()=>{ feedPetByMat(uid,k); refresh(); },"喂养"); fb.className="goldBtn"; row.appendChild(fb);
      list.appendChild(row);
    });
  }
  refresh();
  const close=document.createElement("div");close.className="btnPair";const cb=buyBtn(true,()=>mask.remove(),"关闭");cb.className="goldBtn";close.appendChild(cb);box.appendChild(close);
  mask.appendChild(box); document.body.appendChild(mask);
}
function warmPickModal(uid, slot){
  const isHatch=slot!=null;
  if(isHatch){ banner("孵化中的蛋温养值已固定，不可温养"); return; }
  const egg=eggByUid(uid); if(!egg) return;
  if((egg.warm||0)>=100){ banner("温养值已满，不可再温养"); return; }
  const ed=EGG_BY_ID[egg.id];
  const mask=document.createElement("div");mask.className="eqPickMask";mask.onclick=(ev)=>{ if(ev.target===mask) mask.remove(); };
  const box=document.createElement("div");box.className="eqPickBox";
  const t=document.createElement("div");t.className="eqTitle";t.textContent="温养「"+ed.name+"」· 材料（偏好 "+ed.pref+" ×1，其余 ×0.5）";box.appendChild(t);
  const list=document.createElement("div");list.className="eqList";box.appendChild(list);
  const CATS=["妖兽材料","矿石","草药"];
  function refresh(){
    list.innerHTML="";
    const opts=Object.keys(S.mats).filter(k=>(S.mats[k]||0)>0&&MATS_BY_ID[k]);
    if(!opts.length){ const e=document.createElement("div");e.className="hint";e.textContent="须弥空间中没有材料。也可用灵兽精魄温养（每枚 +1）。";list.appendChild(e); return; }
    CATS.forEach(cat=>{
      const items=opts.filter(k=>MATS_BY_ID[k].cat===cat);
      if(!items.length) return;
      items.sort((a,b)=>{
        const ma=MATS_BY_ID[a],mb=MATS_BY_ID[b];
        const pa=ma.cat===ed.pref?1:0, pb=mb.cat===ed.pref?1:0;
        if(pa!==pb) return pb-pa;
        return mb.rarity-ma.rarity;
      });
      const sec=document.createElement("div");sec.className="eqPickSec";
      sec.textContent=cat+(cat===ed.pref?" · 偏好×1":" · ×0.5");
      list.appendChild(sec);
      items.forEach(k=>{
        const m=MATS_BY_ID[k];
        const g=warmGain(ed,m);
        const row=document.createElement("div");row.className="eqPickRow";
        row.innerHTML=`<span class="nm">${m.ic||""} ${m.name}<div class="sub">稀${m.rarity} · 持有 ${S.mats[k]}</div></span><span class="sub">温养度 +${g%1?g.toFixed(1):g}${m.cat===ed.pref?"（偏好）":""}</span>`;
        const wb=buyBtn((S.mats[k]||0)>=1,()=>{ if(isHatch) warmHatchByMat(slot,k); else warmEggByMat(uid,k); refresh(); },"温养"); wb.className="goldBtn"; row.appendChild(wb);
        list.appendChild(row);
      });
    });
  }
  refresh();
  const close=document.createElement("div");close.className="btnPair";
  const essb=buyBtn(S.petEss>=1,()=>{ mask.remove(); if(isHatch) warmHatchByEss(slot); else warmByEss(uid); },"精魄 +1（余 "+S.petEss+"）"); essb.className="goldBtn"; close.appendChild(essb);
  const cb2=buyBtn(true,()=>mask.remove(),"关闭"); cb2.className="goldBtn"; close.appendChild(cb2);
  box.appendChild(close);
  mask.appendChild(box); document.body.appendChild(mask);
}
function showHatchFx(eggId,pet,band,full){
  const wrap=$("hatchFx"); if(!wrap) return;
  const img=$("hxPet"), nm=$("hxName"), sub=$("hxSub");
  const vid0=$("hxVid"); if(vid0) vid0.style.display="none"; // 复位：隐藏上一次破壳展示的视频
  if(img){ img.className="eggImg hatching"; img.src=EGG_IMG[eggId]||""; img.style.display=EGG_IMG[eggId]?"":"none"; }
  if(nm) nm.textContent="破壳中…";
  if(sub) sub.textContent=EGG_BY_ID[eggId]?EGG_BY_ID[eggId].name:"";
  wrap.classList.add("show");
  const close=function(){ wrap.classList.remove("show"); wrap.onclick=null; };
  wrap.onclick=close;
  setTimeout(function(){
    const vid=PET_VID[pet.id], src=PET_IMG[pet.id];
    if(img){
      if(vid){
        let v=$("hxVid");
        if(!v){ v=document.createElement("video"); v.id="hxVid"; v.autoplay=true; v.muted=true; v.loop=true; v.playsInline=true; v.setAttribute("playsinline",""); v.style.cssText="width:190px;height:190px;object-fit:contain;vertical-align:middle;filter:drop-shadow(0 0 30px rgba(224,185,94,.55));animation:petFloat 4s ease-in-out infinite"; img.insertAdjacentElement("afterend", v); }
        v.src=vid; v.style.display=""; img.style.display="none";
      } else if(src){
        img.style.display=""; img.className="petArt"; img.src=src;
      } else { img.style.display="none"; if(nm) nm.innerHTML='<span class="hxEmoji">'+pet.ic+'</span>'; }
    }
    if(nm&&(vid||src)) nm.textContent=pet.name;
    if(nm&&!vid&&!src) nm.innerHTML='<span class="hxEmoji">'+pet.ic+'</span><div style="margin-top:6px">'+pet.name+'</div>';
    if(sub) sub.textContent=(band==="凡"?"凡品":band==="灵"?"灵品":"圣品")+" · 稀"+pet.rarity+(full?" · 满温养":"");
    sound(720,.2);
  },700);
  setTimeout(function(){ if(wrap.classList.contains("show")) close(); },4600);
}
let petTab="yard";   // yard | egg | train
let petFold={bookSec:true, 凡:true, 灵:true, 玄:true, 天:true};
/* 灵兽页折叠分组（独立记忆，默认展开） */
function petFoldSec(body,title,key,count){
  if(petFold[key]===undefined) petFold[key]=true;
  const d=document.createElement("div");d.className="sectionTitle fold";
  d.style.cssText="cursor:pointer;display:flex;align-items:center;gap:6px";
  d.innerHTML=(petFold[key]?"▾ ":"▸ ")+title+(count?`<span class="gcount">${count} 种</span>`:"");
  d.addEventListener("click",()=>{ petFold[key]=!petFold[key]; render(); });
  body.appendChild(d); return petFold[key];
}
function renderPets(body){
  body.innerHTML="";
  const cap=petCap();
  const st=document.createElement("div");st.className="sectionTitle";st.textContent="— 灵兽 · 孵化养成 —";body.appendChild(st);
  /* 顶部标签页 */
  const bar=document.createElement("div");bar.className="craftBar";
  [["yard","🐾 兽栏"],["egg","🥚 蛋仓孵化"],["train","📜 培养·兽诀"]].forEach(p=>{
    const b=buyBtn(true,()=>{ petTab=p[0]; render(); },p[1]);
    if(petTab===p[0]) b.classList.add("active");
    bar.appendChild(b);
  });
  body.appendChild(bar);
  /* 三页共用统计条 */
  const top=document.createElement("div");top.className="hint";top.style.cssText="display:flex;gap:10px;align-items:center;margin:6px 0;flex-wrap:wrap";
  top.innerHTML="<b>灵兽精魄：</b>"+(S.petEss||0)+" 枚　<b>图鉴：</b>"+Object.keys(S.petDex||{}).length+"/30　<b>兽诀：</b>"
    +((S.books||[]).length)+" 本　<b>锁灵符：</b>"+(S.petItems.lock||0)+"　<b>洗练石：</b>"+(S.petItems.wash||0);
  const sb=buyBtn(S.petEss>=1,()=>sellPetEss(),"出售精魄 ×1"); sb.className="goldBtn"; top.appendChild(sb);
  body.appendChild(top);
  if(petTab==="egg"){ renderPetsEgg(body); return; }
  if(petTab==="train"){ renderPetsTrain(body); return; }
  renderPetsYard(body,cap);
}
/* ---------- 兽栏 ---------- */
function renderPetsYard(body,cap){
  const hint=document.createElement("div");hint.className="hint";
  hint.innerHTML="出战上限按境界解锁（筑基 1 / 金丹 2 / 元婴及以上 3）；出战灵兽按<b>亲密</b>折算加成（饱食归零时再打五折）。点「培养」可打书、洗练、合宠；饱食/亲密归零会进入叛变倒计时，<b>喂食</b>可重置。";
  body.appendChild(hint);
  const vs=document.createElement("div");vs.className="sectionTitle";vs.textContent="兽栏（"+(S.pets||[]).length+"/50）· 出战上限 "+cap+"（当前出战 "+(S.petActive||[]).length+"）";body.appendChild(vs);
  if(!S.pets.length){ const e=document.createElement("div");e.className="hint";e.textContent="尚无灵兽。到「蛋仓孵化」页孵化灵兽蛋，或炼化重复灵兽获取精魄。";body.appendChild(e); }
  (S.pets||[]).forEach((it,i)=>{
    const b=NEW_BEAS_BY_ID[it.id]; if(!b) return;
    const bandC={凡:"var(--ink-dim)",灵:"var(--jade)",圣:"#e0b95e"}[b.band];
    const active=(S.petActive||[]).indexOf(it.uid)>=0;
    const c=petCoef(it);
    const effParts=[];
    if(b.type==="攻")effParts.push("战力 +"+Math.round(b.attr*c)+"%"); else effParts.push("修炼 +"+Math.round(b.attr*c)+"%");
    if(b.extra&&b.extra.atk)effParts.push("战力 +"+Math.round(b.extra.atk*c)+"%");
    if(b.traits){ if(b.traits.ess)effParts.push("灵气 +"+Math.round(b.traits.ess*c)+"%"); if(b.traits.crit)effParts.push("会心 +"+Math.round(b.traits.crit*c)+"%"); if(b.traits.brk)effParts.push("突破 +"+Math.round(b.traits.brk*c)+"%"); if(b.traits.dmgR)effParts.push("减伤 +"+Math.round(b.traits.dmgR*c)+"%"); }
    let skHtml='<div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:6px">';
    const _cap=petSlotCap(b);
    for(let si=0;si<_cap;si++){
      const sk=(it.skills||[])[si];
      const cls="skSlot"+(sk?"":" empty")+(sk&&(it.locks||[])[si]?" locked":"");
      const s=sk?(PET_SKILL_BY_ID[sk.sid]||{name:sk.sid,tier:"凡"}):null;
      const bd=s?((PS_TIER[s.tier]||{}).color||"#888"):"";
      const txt=sk?(s.name+(sk.lv>1?(" "+sk.lv+"阶"):"")+((it.locks||[])[si]?" 🔒":"")):"＋";
      skHtml+='<span class="'+cls+'"'+(bd?' style="border-color:'+bd+'"':'')+'>'+txt+'</span>';
    }
    skHtml+='<span class="skSlot" style="border-color:#9aa5f0">灵韵 '+Math.round(it.apt||60)+'</span></div>';
    const item=document.createElement("div");item.className="item petCard";
    const betray=it.betrayAt?("　<span style='color:#d9534f'>⚠ 叛变倒计时 "+Math.max(1,Math.ceil((it.betrayAt-Date.now())/3600000))+" 小时</span>"):"";
    item.innerHTML=`<div class="ic petIc">${petArtHtml(b)}</div><div class="body">
      <div class="nm">${b.name} <span class="cat" style="color:${bandC}">${b.band}品·稀${b.rarity}</span> ${active?'<span style="font-size:11px;color:var(--gold)">[出战]</span>':''}</div>
      <div class="ds">${b.type==="攻"?"攻击型":"修炼型"} · ${petTraitText(b)}${betray}</div>
      <div style="display:flex;gap:8px;margin-top:4px;font-size:11px;color:var(--ink-dim)"><span>饱食 <span id="petSat${i}">${Math.floor(it.sat)}</span>/100</span><span>亲密 <span id="petInt${i}">${Math.floor(it.int)}</span>/100</span></div>
      <div style="height:6px;background:var(--panel);border:1px solid var(--line);border-radius:3px;margin:2px 0"><div id="petSatBar${i}" style="height:100%;width:${it.sat}%;background:linear-gradient(90deg,#45d0a0,#e0b95e);border-radius:3px"></div></div>
      <div style="height:6px;background:var(--panel);border:1px solid var(--line);border-radius:3px"><div id="petIntBar${i}" style="height:100%;width:${it.int}%;background:linear-gradient(90deg,#4aa8ff,#9aa5f0);border-radius:3px"></div></div>
      ${skHtml}
    </div>`;
    const bw2=document.createElement("div");bw2.className="petBtns";
    if(PET_VID[it.id]) bw2.appendChild(buyBtn(true,()=>playPetVideo(it.id),"▶ 动态"));
    bw2.appendChild(buyBtn(true,()=>togglePetActive(it.uid),active?"休战":"出战"));
    bw2.appendChild(buyBtn(true,()=>openPetForge(it.uid),"培养"));
    bw2.appendChild(buyBtn(true,()=>feedPickModal(it.uid),"喂食"));
    bw2.appendChild(buyBtn(true,()=>refinePet(it.uid),"炼化 · 得"+b.rarity+"精魄"));
    bw2.appendChild(buyBtn(true,()=>releasePet(it.uid),"放生 · "+priceLText(splitPriceL(b.rarity*10100))));
    item.appendChild(bw2);
    body.appendChild(item);
  });
}
/* ---------- 蛋仓孵化 ---------- */
function renderPetsEgg(body){
  const hint=document.createElement("div");hint.className="hint";
  hint.innerHTML="击败<b>精英守卫／秘境 BOSS</b> 低概率出蛋（普通妖兽不掉）：区域基础 2.0%~6.5% + 层数×0.15%，封顶 10%（护巢诀可再加）。蛋可先用材料（偏好×1／其余×0.5）或精魄（每枚 +1）<b>温养</b>，再放入孵化槽倒计时，到期破壳按温养档位掷凡/灵/圣。";
  body.appendChild(hint);
  const es=document.createElement("div");es.className="sectionTitle";es.textContent="蛋仓（"+(S.eggs||[]).length+" 枚）";body.appendChild(es);
  if(!S.eggs.length){ const e=document.createElement("div");e.className="hint";e.textContent="蛋仓空空如也。击败精英守卫或秘境BOSS有概率掉落蛋，筑基后首次击败精英守卫必得木灵蛋。";body.appendChild(e); }
  (S.eggs||[]).forEach(egg=>{
    const ed=EGG_BY_ID[egg.id];
    const item=document.createElement("div");item.className="item petCard";
    const w=Math.floor((egg.warm||0)*10)/10;
    item.innerHTML=`<div class="ic">${icOf(ed,46)}</div><div class="body">
      <div class="nm">${ed.name} <span class="cat">稀${ed.rarity}</span> <span style="font-size:11px;color:var(--mystic)">偏好 ${ed.pref} · 孵化 ${Math.round(ed.hatchSec/3600)} 小时</span></div>
      <div class="ds">温养度 ${w}/100（基础→满温养：凡品${ed.probs.fan[0]}%→${ed.probs.fan[1]}% · 灵品${ed.probs.ling[0]}%→${ed.probs.ling[1]}% · 圣品${ed.probs.sheng[0]}%→${ed.probs.sheng[1]}%）</div>
      <div style="height:6px;background:var(--panel);border:1px solid var(--line);border-radius:3px;margin:4px 0"><div style="height:100%;width:${w}%;background:linear-gradient(90deg,#45d0a0,#e0b95e);border-radius:3px"></div></div>
    </div>`;
    const wfull=(egg.warm||0)>=100;
    const bwrap=document.createElement("div");bwrap.className="petBtns";
    bwrap.appendChild(buyBtn(!wfull,()=>warmPickModal(egg.uid,null),wfull?"温养已满":"温养"));
    bwrap.appendChild(buyBtn(!wfull&&S.petEss>=1,()=>warmByEss(egg.uid),wfull?"精魄已满":"精魄+1"));
    bwrap.appendChild(buyBtn(true,()=>startHatch(egg.uid),"放入孵化槽"));
    item.appendChild(bwrap);
    body.appendChild(item);
  });
  const hs=document.createElement("div");hs.className="sectionTitle";hs.textContent="孵化槽（已解锁 "+(S.hatchSlots||1)+"/4）";body.appendChild(hs);
  for(let i=0;i<(S.hatchSlots||1);i++){
    const h=S.hatch[i]||null;
    const box2=document.createElement("div");box2.className="item";box2.id="hatchSlot"+i;
    if(h){
      const ed=EGG_BY_ID[h.id]; const left=h.endAt-Date.now(); const w=Math.floor((h.warm||0)*10)/10;
      box2.innerHTML=`<div class="ic">${icOf(ed,46)}</div><div class="body">
        <div class="nm">${ed.name} <span class="cat">稀${ed.rarity}</span> <span id="hatchTimer${i}" style="font-size:11px;color:var(--gold)"></span></div>
        <div class="ds">温养度 ${w}/100（孵化中温养值固定，不可再温养）；破壳按当前档位概率掷档位</div>
        <div style="height:6px;background:var(--panel);border:1px solid var(--line);border-radius:3px;margin:4px 0"><div style="height:100%;width:${w}%;background:linear-gradient(90deg,#45d0a0,#e0b95e);border-radius:3px"></div></div>
      </div>`;
      const hb=buyBtn(left<=0,()=>hatchDone(i),"破壳"); hb.className+=" hatchGo"+i; box2.appendChild(hb);
      const tEl=box2.querySelector("#hatchTimer"+i);
      if(left<=0) tEl.textContent="✓ 可破壳";
      else { const hh=Math.floor(left/3600000), mm=Math.floor(left%3600000/60000); tEl.textContent=hh+" 小时 "+mm+" 分"; }
    } else {
      box2.innerHTML=`<div class="ic">▫️</div><div class="body"><div class="nm">孵化槽 ${i+1}（空）</div><div class="ds">放入蛋仓中的蛋，按孵化时长倒计时，到期点击破壳。</div></div>`;
    }
    body.appendChild(box2);
  }
  const expBtn=document.createElement("div");expBtn.className="hint";expBtn.style.cssText="display:flex;gap:10px;align-items:center;margin:6px 0";
  if((S.hatchSlots||1)<4){ const fee=HATCH_FEES[S.hatchSlots]; expBtn.innerHTML="扩容第 "+(S.hatchSlots+1)+" 槽："; const eb=buyBtn(canPayL(fee),()=>expandHatch(),"扩容 · "+priceLText(fee)); eb.className="goldBtn"; expBtn.appendChild(eb); }
  else expBtn.textContent="孵化槽已满（4 槽）";
  body.appendChild(expBtn);
}
/* ---------- 培养 · 兽诀 ---------- */
function renderPetsTrain(body){
  const hint=document.createElement("div");hint.className="hint";
  hint.innerHTML="兽诀共 13 种（凡/灵/玄/天）。在「兽栏」点灵兽的「培养」→「打入」：<b>空格必成</b>，<b>满格随机顶替一格</b>（同名不重复）；<b>锁灵符</b>可保护一格，同一格连续被顶 3 次后自动保底。<b>洗练石</b>重掷灵韵（资质），<b>合宠</b>可继承材料兽最多 2 门兽诀。两本同阶同名兽诀可升阶（效果 ×1.5 / ×2）。";
  body.appendChild(hint);
  /* 道具购买 */
  const shop=document.createElement("div");shop.className="hint";shop.style.cssText="display:flex;gap:8px;align-items:center;margin:6px 0;flex-wrap:wrap";
  shop.innerHTML="<b>培养道具：</b>锁灵符 "+(S.petItems.lock||0)+" · 洗练石 "+(S.petItems.wash||0);
  const lk=buyBtn(true,()=>buyPetItem("lock"),"购买锁灵符 · "+fmt(PET_ITEM.lock.price)); lk.className="goldBtn"; shop.appendChild(lk);
  const ws=buyBtn(true,()=>buyPetItem("wash"),"购买洗练石 · "+fmt(PET_ITEM.wash.price)); ws.className="goldBtn"; shop.appendChild(ws);
  body.appendChild(shop);
  /* 兽诀库（折叠） */
  if(!petFoldSec(body,"— 兽诀库 · 藏 "+((S.books||[]).length)+" 本 —","bookSec",PET_SKILLS.length)) return;
  const kb=document.createElement("div");kb.className="hint";
  kb.innerHTML="兽诀来源：<b>坊市</b>（凡/灵/玄）· <b>拍卖会</b>（玄/天）· <b>秘境 BOSS</b> 掉落。稀有度越高效果越强；升阶需两本同阶同名兽诀。";
  body.appendChild(kb);
  ["凡","灵","玄","天"].forEach(tier=>{
    const list=PET_SKILLS.filter(s=>s.tier===tier); if(!list.length) return;
    const owned=list.reduce((a,s)=>a+(S.books||[]).filter(b=>b.sid===s.id).length,0);
    if(!petFoldSec(body,"· "+tier+"阶兽诀","t_"+tier,list.length)) return;
    list.forEach(sk=>{
      const t=PS_TIER[sk.tier]||{color:"#888"};
      const c1=(S.books||[]).filter(x=>x.sid===sk.id&&(x.lv||1)===1).length;
      const c2=(S.books||[]).filter(x=>x.sid===sk.id&&(x.lv||1)===2).length;
      const c3=(S.books||[]).filter(x=>x.sid===sk.id&&(x.lv||1)===3).length;
      const row=document.createElement("div");row.className="exchRow";
      row.innerHTML='<span class="ex-n"><b style="color:'+t.color+'">'+sk.name+'</b> · '+sk.ds+'　<span style="color:var(--ink-dim)">持有 '+c1+' / '+c2+' / '+c3+' 阶</span></span>';
      if(c1>=2) row.appendChild(buyBtn(true,()=>petUpgradeBook(sk.id,1),"升阶 1→2"));
      if(c2>=2) row.appendChild(buyBtn(true,()=>petUpgradeBook(sk.id,2),"升阶 2→3"));
      body.appendChild(row);
    });
  });
}
/* 灵兽页轻量实时刷新（gameTick 调用）：进度条 / 倒计时 / 破壳按钮 */
function petTickLiteUI(){
  (S.pets||[]).forEach((it,i)=>{
    const el1=$("petSat"+i), el2=$("petInt"+i);
    if(el1) el1.textContent=Math.floor(it.sat);
    if(el2) el2.textContent=Math.floor(it.int);
    const b1=$("petSatBar"+i); if(b1) b1.style.width=Math.max(0,Math.min(100,it.sat))+"%";
    const b2=$("petIntBar"+i); if(b2) b2.style.width=Math.max(0,Math.min(100,it.int))+"%";
  });
  for(let i=0;i<(S.hatchSlots||1);i++){
    const h=S.hatch[i]; if(!h) continue;
    const tEl=$("hatchTimer"+i); if(!tEl) continue;
    const left=h.endAt-Date.now();
    if(left<=0){ tEl.textContent="✓ 可破壳"; const hb=document.querySelector(".hatchGo"+i); if(hb&&hb.disabled){ hb.disabled=false; } }
    else { const hh=Math.floor(left/3600000), mm=Math.floor(left%3600000/60000); const s=hh+" 小时 "+mm+" 分"; if(tEl.textContent!==s) tEl.textContent=s; }
  }
}

/* 灵兽动态视频弹窗：播放贴图/灵兽 目录下的本地 mp4（file:// 下 video 直读本地文件） */
function playPetVideo(id){
  const src=PET_VID[id]; if(!src) return;
  const b=NEW_BEAS_BY_ID[id];
  const mask=document.createElement("div");mask.className="eqPickMask";mask.style.cssText="z-index:70;background:rgba(0,0,0,.85)";
  mask.onclick=(ev)=>{ if(ev.target===mask) mask.remove(); };
  const box=document.createElement("div");box.className="eqPickBox";box.style.cssText="width:min(560px,92vw);align-items:center;gap:6px;z-index:71";
  const t=document.createElement("div");t.className="eqTitle";t.textContent=(b?b.name:"灵兽")+" · 灵兽动态";box.appendChild(t);
  const v=document.createElement("video");v.src=src;v.controls=true;v.autoplay=true;v.loop=true;v.muted=true;
  v.style.cssText="width:100%;border-radius:10px;background:#000;max-height:52vh";
  box.appendChild(v);
  const close=document.createElement("div");close.className="btnPair";
  const cb=buyBtn(true,()=>{ v.pause(); mask.remove(); },"关闭"); cb.className="goldBtn"; close.appendChild(cb);
  box.appendChild(close);
  mask.appendChild(box); document.body.appendChild(mask);
  const pr=v.play(); if(pr&&pr.catch) pr.catch(()=>{});
}
function renderEqp(body){
  body.innerHTML="";
  const st=document.createElement("div");st.className="sectionTitle";st.textContent="— 装备 · 穿戴 —";body.appendChild(st);
  const p=document.createElement("div");p.className="hint";p.innerHTML="<b>装备系统</b>：炼器制成的装备可穿戴，属性常驻生效（战力/气血/灵气/会心/突破/减伤）。护甲分头部 / 衣物槽，饰品分 2 个戒指槽与 1 个项链槽，另有武器槽与法宝槽。点击装备栏上的槽位方块，在弹窗中选择穿戴。";body.appendChild(p);
  const wrap=document.createElement("div");wrap.className="dummyWrap";
  const d=document.createElement("div");d.className="dummy";
  /* 装备栏贴图 7 槽位中心百分比（贴图/装备栏.png 922×1152，右侧一列）：头部/项链/防具/武器/戒指壹/戒指贰/法宝 */
  const PARTS=[
    {sl:"h",  left:0.857, top:0.123},
    {sl:"n",  left:0.857, top:0.252},
    {sl:"a",  left:0.857, top:0.379},
    {sl:"w",  left:0.857, top:0.509},
    {sl:"r1", left:0.857, top:0.641},
    {sl:"r2", left:0.857, top:0.765},
    {sl:"m",  left:0.857, top:0.899},
  ];
  d.innerHTML='<img class="avatarImg" src="'+avatarObj().src+'" alt="'+avatarObj().name+'" onerror="this.style.opacity=0"><img class="equipBarImg" src="贴图/装备栏.png" alt="装备栏">';
  PARTS.forEach(pa=>{
    const uid=S.equipped[pa.sl]; const it=uid!=null?(S.equip||[]).find(x=>x.uid===uid):null; const r=it?REC_BY_ID[it.id]:null;
    const b=document.createElement("button");b.className="slotBtn"+(r?" worn":"");
    b.style.left=(pa.left*100)+"%";b.style.top=(pa.top*100)+"%";b.title=SLOT_NAMES[pa.sl]+"槽"+(r?("·"+r.name):"（空）");
    b.innerHTML=r?('<span class="eqname">'+icOf(r)+" "+r.name+'</span>') : ('<span class="plus">＋</span><span class="eqname">'+SLOT_NAMES[pa.sl]+'</span>');
    b.onclick=()=>openEquipPick(pa.sl);
    d.appendChild(b);
  });
  wrap.appendChild(d);
  const side=document.createElement("div");side.style.flex="1";
  const stw=document.createElement("div");stw.className="sectionTitle";stw.textContent="当前穿戴";side.appendChild(stw);
  SLOT_KEYS.forEach(sl=>{
    const row=document.createElement("div");row.className="exchRow";
    const uid=S.equipped[sl]; const it=uid!=null?(S.equip||[]).find(x=>x.uid===uid):null; const r=it?REC_BY_ID[it.id]:null;
    row.innerHTML=`<span class="ex-n">${SLOT_NAMES[sl]}：${r?(icOf(r)+" "+r.name+"（"+eqText(r,it)+"）"):"（空）"}</span>`;
    if(r) row.appendChild(buyBtn(true,()=>{unequipEquip(sl);},"卸下"));
    side.appendChild(row);
  });
  const bonus=document.createElement("div");bonus.className="hint";
  const bs=[]; if(eqSum("atk"))bs.push("战力 +"+eqSum("atk")+"%"); if(eqSum("hp"))bs.push("气血 +"+eqSum("hp")+"%"); if(eqSum("ess"))bs.push("灵气 +"+eqSum("ess")+"%"); if(eqSum("crit"))bs.push("会心 +"+eqSum("crit")+"%"); if(eqSum("brk"))bs.push("突破 +"+eqSum("brk")+"%"); if(eqSum("dmgR"))bs.push("减伤 +"+eqSum("dmgR")+"%");
  if(eqSubSum("spd"))bs.push("速度 +"+eqSubSum("spd"));
  if(eqSubSum("hit"))bs.push("命中 +"+eqSubSum("hit")+"%");
  if(eqSubSum("dodge"))bs.push("闪避 +"+eqSubSum("dodge")+"%");
  if(eqSubSum("critDmg"))bs.push("暴伤 +"+eqSubSum("critDmg")+"%");
  if(eqSubSum("pool"))bs.push("灵力池 +"+eqSubSum("pool")+"%");
  RES_ELMS.forEach(e=>{ if(eqResSum(e))bs.push("抗"+e+" +"+eqResSum(e)+"%"); });
  bonus.textContent="装备加成："+(bs.length?bs.join(" · "):"无");
  side.appendChild(bonus);
  wrap.appendChild(side);
  body.appendChild(wrap);
  /* 装备框下：更换人物形象（免费 5 次，之后每次 50 上品灵石）v26.5 */
  const avBar=document.createElement("div");avBar.className="hint";avBar.style.marginTop="10px";
  avBar.innerHTML="人物形象：<b>"+avatarObj().name+"</b>　免费更换剩余 <b>"+Math.max(0,AVATAR_FREE_N-(S.avatarUses||0))+"</b> 次"+(S.avatarUses>=AVATAR_FREE_N?"（之后每次 "+AVATAR_FEE_H+" 上品灵石）":"");
  const avBtn=document.createElement("button");avBtn.className="goldBtn";avBtn.textContent="选择人物形象";
  avBtn.addEventListener("click",openAvatarPick);
  avBar.appendChild(avBtn);
  body.appendChild(avBar);
}
/* ============ 属性面板（人物属性设计 2.2/3/4 章）：六维 + 次级 + 五行抗性 + 来源明细 ============ */
function renderAttr(body){
  body.innerHTML="";
  const pA=battleAttrs();
  const st=document.createElement("div");st.className="sectionTitle";st.textContent="— 人物属性 · 战斗面板 —";body.appendChild(st);
  const h=document.createElement("div");h.className="hint";h.innerHTML="六维与次级属性均为<b>实时派生值</b>，随境界 / 灵根 / 功法 / 装备 / 灵兽 / 增益变化即时刷新。法力（灵力池）与战斗内状态仅在战斗中生效，战斗外不保留。防御力按乘法叠加，上限 70%。";body.appendChild(h);
  const card=function(grid,nm,val,sub){ const d=document.createElement("div");d.style.cssText="background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:10px;";d.innerHTML=`<div style="font-size:12px;color:var(--ink-dim)">${nm}</div><div style="font-size:19px;font-weight:700;color:var(--gold);margin:3px 0">${val}</div><div style="font-size:11px;color:var(--ink-dim);line-height:1.4">${sub||""}</div>`;grid.appendChild(d); };
  const grid=document.createElement("div");grid.style.cssText="display:grid;grid-template-columns:repeat(auto-fit,minmax(148px,1fr));gap:8px;margin:10px 0;";
  card(grid,"血气（气血上限）",Math.floor(pA.hp)+" / "+pA.hpMax,"⌊100×1.45^境界×(1+气血%)⌋；突破回满");
  card(grid,"攻击力",pA.atk,"⌊战力 / 4⌋；当前战力 "+playerPower());
  card(grid,"防御力（减伤）",(pA.dmgRed*100).toFixed(1)+"%","1−∏(1−单项)，上限 70%");
  card(grid,"法力（灵力池）",pA.pool,"每回合回灵 "+Math.round(pA.regain*100)+"%");
  card(grid,"速度",pA.speed,"100+境界×15+词条；决定先手");
  body.appendChild(grid);
  const st2=document.createElement("div");st2.className="sectionTitle";st2.textContent="— 次级属性 —";body.appendChild(st2);
  const grid2=document.createElement("div");grid2.style.cssText="display:grid;grid-template-columns:repeat(auto-fit,minmax(148px,1fr));gap:8px;margin:10px 0;";
  const card2=function(g,nm,val,sub){ const d=document.createElement("div");d.style.cssText="background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:10px;";d.innerHTML=`<div style="font-size:12px;color:var(--ink-dim)">${nm}</div><div style="font-size:17px;font-weight:700;color:var(--jade);margin:3px 0">${val}</div><div style="font-size:11px;color:var(--ink-dim);line-height:1.4">${sub||""}</div>`;g.appendChild(d); };
  card2(grid2,"命中",(pA.hit*100).toFixed(1)+"%","基础 95% + 命中词条，上限 100%");
  card2(grid2,"闪避",(pA.dodge*100).toFixed(1)+"%","基础 0%，变异风 +10%，上限 60%");
  card2(grid2,"暴击率",(pA.crit*100).toFixed(1)+"%","会心（升级/符箓/装备/灵兽）+ 功法 + 变异雷，上限 75%");
  card2(grid2,"暴击伤害","×"+pA.critDmg.toFixed(2),"基础 ×1.5 + 功法 + 暴伤词条 + 变异雷 ×1.7");
  body.appendChild(grid2);
  const st3=document.createElement("div");st3.className="sectionTitle";st3.textContent="— 五行抗性（受被克伤害再减免）—";body.appendChild(st3);
  const resRow=document.createElement("div");resRow.style.cssText="display:flex;gap:8px;flex-wrap:wrap;margin:10px 0;";
  RES_ELMS.forEach(e=>{
    const v=pA.res&&pA.res[e]?pA.res[e]:0;
    const d=document.createElement("div");d.style.cssText="background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:6px 12px;font-size:13px;";
    d.innerHTML=`<b style="color:var(--ink)">${e}</b> <span style="color:var(--jade);font-weight:700">${(v*100).toFixed(0)}%</span>`;
    resRow.appendChild(d);
  });
  body.appendChild(resRow);
  const st4=document.createElement("div");st4.className="sectionTitle";st4.textContent="— 属性来源明细 —";body.appendChild(st4);
  const src=document.createElement("div");src.className="hint";src.style.lineHeight="1.7";
  const lines=[];
  const r=GONGFAS.find(x=>x.id===S.activeGong);
  lines.push("<b>灵根：</b>"+(S.root?S.root.name+"（战斗加成 ×"+S.root.combat+"，突破上限 "+(S.root.breakCap*100)+"%）："+S.root.ds:"未定灵根，先定灵根方可战斗"));
  lines.push("<b>功法：</b>"+(r?r.name+"（"+r.ds+(r.passive&&r.passive!=="无"?"；"+r.passive:"")+"）":"—"));
  const eq=equippedItems().map(it=>{ const rr=REC_BY_ID[it.id]; return rr?rr.name+"（"+eqText(rr,it)+"）":null; }).filter(Boolean);
  lines.push("<b>装备（7 槽）：</b>"+(eq.length?eq.join("；"):"未穿戴"));
  const petLines=petActiveUids().map(uid=>{ const it=petByUid(uid); const b=it?NEW_BEAS_BY_ID[it.id]:null; if(!b)return null; const c=petCoef(it); const p=[]; if(b.type==="攻")p.push("战力+"+Math.round(b.attr*c)+"%"); else p.push("修炼+"+Math.round(b.attr*c)+"%"); if(b.extra&&b.extra.atk)p.push("战力+"+Math.round(b.extra.atk*c)+"%"); if(b.traits){ if(b.traits.ess)p.push("灵气+"+Math.round(b.traits.ess*c)+"%"); if(b.traits.crit)p.push("会心+"+Math.round(b.traits.crit*c)+"%"); if(b.traits.brk)p.push("突破+"+Math.round(b.traits.brk*c)+"%"); if(b.traits.dmgR)p.push("减伤+"+Math.round(b.traits.dmgR*c)+"%"); } return b.name+(p.length?"（"+p.join("，")+"）":""); }).filter(Boolean);
  lines.push("<b>灵兽：</b>"+(petLines.length?petLines.join("；"):"无"));
  const acts=Object.keys(S.buffs).filter(id=>S.buffs[id].until>Date.now());
  lines.push("<b>增益（丹药/符箓）：</b>"+(acts.length?acts.map(id=>{const x=REC_BY_ID[id];return x?x.name+"×"+S.buffs[id].stack:null;}).filter(Boolean).join("；"):"无"));
  src.innerHTML=lines.join("<br>");
  body.appendChild(src);
}
/* 装备页固定面板（滚动区外下端）：战前技能槽在上，装备库在下，装备库内部独立滚动 */
function renderEquipBar(){
  const bar=$("equipSetupBar");
  if(activeTab!=="eqp"){ bar.classList.remove("show"); $("tabBody").classList.remove("noScroll"); return; }
  $("tabBody").classList.add("noScroll");
  bar.innerHTML="";
  const cap=slotCapOf(S.root);
  const slots=resolveSlots(S.root);
  const head=document.createElement("div");head.className="esHead";
  const t=document.createElement("div");t.className="esTitle";t.textContent="⚙️ 战前技能槽 · 技能战斗";head.appendChild(t);
  const cfg=document.createElement("button");cfg.textContent="配置技能槽";cfg.addEventListener("click",openSlotsConfig);head.appendChild(cfg);
  bar.appendChild(head);
  const s=document.createElement("div");s.className="esSummary";
  s.innerHTML="法术 <b>"+(slots.dmg.map(id=>SPELLS_BY_ID[id]&&SPELLS_BY_ID[id].name).join("、")||"—")+"</b> ｜ 身法 <b>"+(slots.shen.map(id=>SPELLS_BY_ID[id]&&SPELLS_BY_ID[id].name).join("、")||"—")+"</b> ｜ 神通 <b>"+(slots.shenSh.map(id=>SHEN.find(x=>x.id===id)&&SHEN.find(x=>x.id===id).name).join("、")||"—")+"</b>（法"+cap.dmg+"/身"+cap.shen+"/神"+cap.shenSh+"）";
  bar.appendChild(s);
  const lt=document.createElement("div");lt.className="esLibTitle";lt.textContent="— 装备库 · 持有 "+(S.equip||[]).length+" 件 · 可装备 "+((S.equip||[]).length-Object.values(S.equipped||{}).filter(u=>u!=null).length)+" 件 —";bar.appendChild(lt);
  const lib=document.createElement("div");lib.className="esLib";
  const ids=Array.from(new Set((S.equip||[]).map(x=>x.id)));
  if(!ids.length){ const e=document.createElement("div");e.className="hint";e.textContent="装备库空空如也，前往「制造 · 炼器」炼制装备。";lib.appendChild(e); }
  else ids.forEach(id=>{
    const r=REC_BY_ID[id]; if(!r) return;
    const inst0=(S.equip||[]).find(x=>x.id===id);
    const row=document.createElement("div");row.className="esRow";
    const nm=document.createElement("span");nm.className="esN";
    nm.innerHTML=icOf(r)+" "+r.name+"　"+SLOT_NAMES[r.slot]+"　"+eqText(r,inst0)+"　稀有"+r.rarity+"　持有"+equipCount(id);
    row.appendChild(nm);
    const btns=document.createElement("div");btns.className="esBtns";
    btns.appendChild(buyBtn(true,()=>wearEquip(id),"穿戴"));
    btns.appendChild(buyBtn(true,()=>sellEquip(id),"出售"));
    row.appendChild(btns);
    lib.appendChild(row);
  });
  bar.appendChild(lib);
  bar.classList.add("show");
}
function openEquipPick(sl){
  const mask=document.createElement("div");mask.className="eqPickMask";
  mask.onclick=(ev)=>{ if(ev.target===mask) mask.remove(); };
  const box=document.createElement("div");box.className="eqPickBox";
  const t=document.createElement("div");t.className="eqTitle";t.textContent="选择"+SLOT_NAMES[sl]+"装备";box.appendChild(t);
  const cur=S.equipped[sl];
  if(cur!=null){
    const it=(S.equip||[]).find(x=>x.uid===cur); const r=it?REC_BY_ID[it.id]:null;
    const row=document.createElement("div");row.className="eqPickRow";
    row.innerHTML=`<span class="nm">当前：${r?icOf(r)+" "+r.name+"（"+eqText(r,it)+"）":"未知"}</span>`;
    row.appendChild(buyBtn(true,()=>{ mask.remove(); unequipEquip(sl); },"卸下"));
    box.appendChild(row);
  }
  const list=document.createElement("div");list.className="eqList";
  const ids=Array.from(new Set((S.equip||[]).map(x=>x.id).filter(id=>{const r=REC_BY_ID[id];return r&&r.slot===sl;})));
  if(!ids.length){ const e=document.createElement("div");e.className="hint";e.textContent="该部位暂无装备，可前往「制造 · 炼器」炼制。";list.appendChild(e); }
  ids.forEach(id=>{
    const r=REC_BY_ID[id];
    const inst0=(S.equip||[]).find(x=>x.id===id&&x.uid!==cur);
    const wornId=(S.equip||[]).find(x=>x.uid===cur);
    const isOn=wornId&&wornId.id===id;
    const row=document.createElement("div");row.className="eqPickRow";
    row.innerHTML=`<span class="nm">${icOf(r)} ${r.name}<div class="sub">${eqText(r,inst0||wornId)} · 稀有${r.rarity}</div></span><span class="sub">持有 ${equipCount(id)}</span>`;
    row.appendChild(buyBtn(!isOn,()=>{ mask.remove(); wearEquip(id); },"穿戴"));
    list.appendChild(row);
  });
  box.appendChild(list);
  const close=document.createElement("div");close.className="btnPair";
  close.appendChild(buyBtn(true,()=>mask.remove(),"关闭"));
  box.appendChild(close);
  mask.appendChild(box);
  document.body.appendChild(mask);
}
let xumiFold={tres:true,equip:true,mat:true,matBeast:true,matOre:true,matHerb:true};
function xuSec(body,title,key,count){
  if(xumiFold[key]===undefined) xumiFold[key]=true;   // v33.1：新分组默认展开，且每个分组独立记忆
  const d=document.createElement("div");d.className="sectionTitle fold";d.style.cursor="pointer";d.style.display="flex";d.style.alignItems="center";d.style.gap="6px";
  d.innerHTML=(xumiFold[key]?"▾ ":"▸ ")+title+(count?`<span class="gcount">${count}种</span>`:"");
  d.addEventListener("click",()=>{ xumiFold[key]=!xumiFold[key]; render(); });
  body.appendChild(d); return xumiFold[key];
}
function whRow(infoHtml,tipHtml,acts,iconHtml){
  const row=document.createElement("div");row.className="whRow";
  const inf=document.createElement("div");inf.className="whInfo";inf.innerHTML=infoHtml;
  row.appendChild(inf);
  const ac=document.createElement("div");ac.className="whActs";
  (acts||[]).forEach(a=>{ const b=buyBtn(a[0],a[1],a[2]); ac.appendChild(b); });
  row.appendChild(ac);
  if(tipHtml) bindTip(row,iconHtml||"",tipHtml);
  return row;
}
let xuFilter="all", xuKw="";
// v30.7.6 须弥空间物品按稀有度排序（升序；同稀有度按 id 稳定排序）
const rarOf=id=>{ let r=REC_BY_ID[id]||TRES_BY_ID[id]; if(!r) r=GONGFAS.find(x=>x.id===id); return r?r.rarity:99; };
const byRarity=(a,b)=>((rarOf(a))-(rarOf(b)))||(a<b?-1:1);
function renderXu(body){
  body.innerHTML="";
  const st=document.createElement("div");st.className="sectionTitle";st.textContent="— 须弥空间 · 背包 —";body.appendChild(st);
  const p=document.createElement("div");p.className="hint";p.innerHTML="物品可使用 / 出售（弹窗选数量），使用不受运功 / 采集 / 制造 / 探索状态限制。";body.appendChild(p);
  const tresIds=Object.keys(S.tres).filter(id=>(S.tres[id]||0)>0);
  const hasMat=MATS.some(m=>(S.mats[m.id]||0)>0);
  const wornUids=Object.values(S.equipped||{}).filter(u=>u!=null);
  const unwornEq=(S.equip||[]).filter(x=>!wornUids.includes(x.uid));
  const eqIds=Array.from(new Set(unwornEq.map(x=>x.id)));
  const total=tresIds.length+MATS.filter(m=>(S.mats[m.id]||0)>0).length+eqIds.length;
  if(total===0){ const e=document.createElement("div");e.className="hint";e.textContent="背包空空如也，前往「制造」合成物品或「采集」获取材料。";body.appendChild(e); return; }
  // 顶部：统计 + 搜索（仿仓库界面）
  const top=document.createElement("div");top.className="whTop";
  const stat=document.createElement("span");stat.className="whStat";stat.textContent=total+" 种 · 无限容量";top.appendChild(stat);
  const sr=document.createElement("input");sr.className="whSearch";sr.placeholder="搜索物品…";sr.value=xuKw;
  sr.addEventListener("input",()=>{ xuKw=sr.value.trim(); render(); });
  top.appendChild(sr); body.appendChild(top);
  // 分类筛选
  const fbar=document.createElement("div");fbar.className="whFilter";
  [["all","全部"],["mat","材料"],["tres","成品"],["gong","功法"],["eq","装备"]].forEach(fl=>{
    const b=document.createElement("button");b.className="lfBtn"+(xuFilter===fl[0]?" active":"");b.textContent=fl[1];
    b.onclick=()=>{ xuFilter=fl[0]; render(); }; fbar.appendChild(b);
  });
  body.appendChild(fbar);
  const kf=s=>!xuKw||s.indexOf(xuKw)>=0;
  const catOf=id=>{ let r=REC_BY_ID[id]||TRES_BY_ID[id]; if(!r) r=GONGFAS.find(x=>x.id===id); if(!r) return "未知"; if(GONGFAS.some(g=>g.id===id)) return "功法"; for(const c of CRAFT){ if(c.rec.some(x=>x.id===r.id)) return c.cat; } return "成品"; };
  // 成品 / 功法：按分类分组
  const gmap={};
  tresIds.forEach(id=>{ const cn=catOf(id); (gmap[cn]=gmap[cn]||[]).push(id); });
  const GROUP_ORDER=["功法","制符","炼丹","炼器","阵法"];
  const showG=xuFilter==="all"||xuFilter==="gong"||xuFilter==="tres";
  if(showG){
    GROUP_ORDER.forEach(cn=>{
      const gids=gmap[cn]; if(!gids||!gids.length) return;
      if(xuFilter==="gong"&&cn!=="功法") return;
      if(xuFilter==="tres"&&cn==="功法") return;
      gids.sort(byRarity); // v30.7.6 成品/功法组内按稀有度排序
      if(!xuSec(body,cn,"tres:"+cn,gids.length)) return;   // v33.1：制符/炼丹/炼器/阵法/功法 各自独立折叠
      gids.forEach(id=>{
        let r=REC_BY_ID[id]||TRES_BY_ID[id]; if(!r) r=GONGFAS.find(x=>x.id===id); if(!r) return;
        if(!kf(r.name)) return;
        const useable=!!(r.eff||r.heal)||!!r.isPu; const gIs=GONGFAS.some(g=>g.id===r.id);
        const tip=`<b>${r.name}</b>（稀有${r.rarity} · ${cn}）<br>${r.ds||"无"}<br><span style="color:var(--jade)">${gIs?("功法 · 灵气倍率 ×"+r.ess):(useable?"效果："+effText(r):"无可使用效果，可出售")}</span><br>价值 ${priceLText(splitPriceL(r.value))} · 持有 ${fmt(S.tres[id])}`;
        const acts=[];
        if(gIs){ const o2=S.gongs.includes(r.id); acts.push([o2?false:true,()=>{o2?(S.activeGong===r.id?banner("已是当前激活功法"):actGong(r.id)):studyGong(r.id);},"已激活"]);
          if(o2) acts[0]=[S.activeGong!==r.id,()=>{actGong(r.id);},S.activeGong===r.id?"已激活":"激活"]; }
        else if(useable) acts.push([true,()=>{useTres(r);render();},"使用"]);
        else acts.push([true,()=>{banner("「"+r.name+"」无可使用效果，可出售");},"查看"]);
        acts.push([true,()=>{openSell("tres",r);},"出售"]);
        body.appendChild(whRow(`<span class="whName"><span class="ic">${icOf(r)}</span>${r.name}<span class="cat">${cn}</span></span><div class="whSub">持有 ${fmt(S.tres[id])} · 稀有${r.rarity} · 价值 ${priceLText(splitPriceL(r.value))}</div>`,tip,acts,icOf(r)));
      });
    });
  }
  // 装备
  if(eqIds.length && (xuFilter==="all"||xuFilter==="eq") && xuSec(body,"装备","equip",eqIds.length)){
    eqIds.sort(byRarity); // v30.7.6 装备按稀有度排序
    eqIds.forEach(id=>{
      const r=REC_BY_ID[id]; if(!r) return;
      if(!kf(r.name)) return;
      const n=unwornEq.filter(x=>x.id===id).length;
      const tip=`<b>${r.name}</b>（稀有${r.rarity} · ${SLOT_NAMES[r.slot]}）<br>${r.ds||"无"}<br><span style="color:var(--jade)">${eqText(r)}</span><br>价值 ${priceLText(splitPriceL(r.value))} · 持有 ${n}`;
      body.appendChild(whRow(`<span class="whName"><span class="ic">${icOf(r)}</span>${r.name}<span class="cat">${SLOT_NAMES[r.slot]}</span></span><div class="whSub">持有 ${n} · 稀有${r.rarity} · ${eqText(r)}</div>`,tip,[[true,()=>wearEquip(id),"穿戴"],[true,()=>sellEquip(id),"出售"]],icOf(r)));
    });
  }
  // 材料：按妖兽材料/矿石/草药分组
  if(hasMat && (xuFilter==="all"||xuFilter==="mat")){
    ["妖兽材料","矿石","草药"].forEach(cat=>{
      const list=MATS.filter(m=>m.cat===cat && (S.mats[m.id]||0)>0 && kf(m.name));
      if(!list.length) return;
      if(!xuSec(body,cat,cat==="妖兽材料"?"matBeast":cat==="矿石"?"matOre":"matHerb",list.length)) return;
      list.sort((a,b)=>(a.rarity-b.rarity)||(a.id<b.id?-1:1)); // v30.7.6 材料按稀有度排序
      list.forEach(m=>{
        const tip=`<b>${m.name}</b>（稀有${m.rarity} · ${m.cat}）<br>${m.ds||"无"}<br>单价 ${priceLText(splitPriceL(m.value))} · 持有 ${fmt(S.mats[m.id]||0)}`;
        body.appendChild(whRow(`<span class="whName"><span class="ic">${m.ic}</span>${m.name}<span class="cat">${cat}</span></span><div class="whSub">持有 ${fmt(S.mats[m.id]||0)} · 稀有${m.rarity} · 单价 ${priceLText(splitPriceL(m.value))}</div>`,tip,[[true,()=>{openSell("mat",m);},"出售"]],m.ic));
      });
    });
  }
}
let tipEl=null;
function ensureTip(){ if(!tipEl){ tipEl=document.createElement("div"); tipEl.id="itemTip"; document.body.appendChild(tipEl); document.addEventListener("mousemove",e=>{ if(tipEl && tipEl.style.display==="block"){ tipEl.style.left=Math.min(e.clientX+14,window.innerWidth-300)+"px"; tipEl.style.top=Math.min(e.clientY+14,window.innerHeight-160)+"px"; } }); } return tipEl; }
function bindTip(el,iconHtml,htmlOrFn){ ensureTip(); el.addEventListener("mouseenter",()=>{ tipEl.innerHTML=`<div class="tipFlex"><div class="tipIcon">${iconHtml}</div><div class="tipBody">${typeof htmlOrFn==="function"?htmlOrFn():htmlOrFn}</div></div>`; tipEl.style.display="block"; }); el.addEventListener("mouseleave",()=>{ tipEl.style.display="none"; }); }
let sellRef=null;
function openSell(kind,obj){
  sellRef={kind,obj}; if(!obj) return;
  const n = kind==="mat" ? (S.mats[obj.id]||0) : (S.tres[obj.id]||0);
  $("sellTitle").textContent="— 出售「"+obj.name+"」—";
  $("sellInfo").innerHTML="持有 <b>"+n+"</b> · 单价 <b>"+priceLText(splitPriceL(obj.value))+"</b>";
  const q=$("sellQty"); q.max=Math.max(1,n); q.min=1; q.value=Math.max(1,n);
  $("sellOverlay").classList.add("show");
}
function closeSell(){ sellRef=null; $("sellOverlay").classList.remove("show"); }
function sellTres(qty){
  if(!sellRef) return; const {kind,obj}=sellRef;
  qty=Math.max(0,Math.floor(qty)||0);
  const key = kind==="mat" ? "mats" : "tres";
  const n=S[key][obj.id]||0; if(qty<=0||n<qty) return;
  S[key][obj.id]=n-qty; if(S[key][obj.id]<=0) delete S[key][obj.id];
  const gain=obj.value*qty; addL(splitPriceL(gain));
  logEvent("出售「"+obj.name+"」×"+qty+"，获 "+priceLText(splitPriceL(gain))+"（"+fmt(gain)+" 下品）",'sys');
  sound(520,.15); save(); render();
}const SHOP_W={1:16,2:8,3:4,4:2,5:1,6:0.5}; // 稀有度→刷新权重（越稀有越低，坊市仅 1~6）
const SHOP_STOCK={1:10,2:8,3:5,4:3,5:1,6:1}; // 稀有度→库存（越稀有越少，最多10最少1）
function shopPool(){ const a=[]; MATS.forEach(m=>{if(m.rarity<=6)a.push({kind:"mat",obj:m});}); CRAFT.forEach(c=>c.rec.forEach(r=>{if(r.rarity<=6&&!r.slot)a.push({kind:"tres",obj:r});})); GONGFAS.forEach(g=>{if(g.id!=="yj"&&g.rarity<=6)a.push({kind:"gong",obj:g});}); SPELLS.forEach(s=>{a.push({kind:"skill",obj:s});}); PET_SKILLS.forEach(s=>{ if(s.tier!=="天"){ const o=petBookObj(s.id,1); if(o) a.push({kind:"book",obj:o}); } }); return a; }
function spellRarityOf(s){ // v31.10 技能无 rarity 字段，按耗灵档位推定稀有度（坊市/拍卖统一口径）
  if(s.cost>=30) return 7; if(s.cost>=20) return 6; if(s.cost>=12) return 5; return 4;
}
function weightedShopPick(pool){ let total=0; pool.forEach(p=>total+=(SHOP_W[p.kind==="skill"?spellRarityOf(p.obj):p.obj.rarity]||1)); let rnd=Math.random()*total; for(const p of pool){ rnd-=(SHOP_W[p.kind==="skill"?spellRarityOf(p.obj):p.obj.rarity]||1); if(rnd<=0) return p; } return pool[0]; }
function refreshShop(now){
  const pool=shopPool();
  const chosen=new Set();
  const list=[];
  // v31.11 每次刷新只出 1 本功法 + 1 本技能，其余槽位全池随机
  const take=(src,need)=>{ for(let i=0;i<need && src.length;i++){ let pick=weightedShopPick(src); let guard=0; while(chosen.has(pick.obj.id) && guard<300){ pick=weightedShopPick(src); guard++; } if(chosen.has(pick.obj.id)) continue; chosen.add(pick.obj.id); list.push({kind:pick.kind, id:pick.obj.id, stock:(SHOP_STOCK[pick.obj.rarity]||1)}); } };
  take(pool.filter(p=>p.kind==="gong"),1);
  take(pool.filter(p=>p.kind==="skill"),1);
  const fill=pool.filter(p=>p.kind!=="gong"&&p.kind!=="skill"); // v31.11 补货只出材料/成品，功法技能恒各1本
  for(let i=list.length;i<10 && chosen.size<fill.length;i++){ let pick=weightedShopPick(fill); let guard=0; while(chosen.has(pick.obj.id) && guard<300){ pick=weightedShopPick(fill); guard++; } if(chosen.has(pick.obj.id)) continue; chosen.add(pick.obj.id); list.push({kind:pick.kind, id:pick.obj.id, stock:(SHOP_STOCK[pick.obj.rarity]||1)}); }
  S.shop={list, until:now+10*60*1000};
}
function shopItem(id){ const _bk=PET_BOOK_BY_ID[id]; if(_bk) return {kind:"book",obj:_bk}; const m=MATS_BY_ID[id]; if(m) return {kind:"mat",obj:m}; const g=GONGFAS.find(x=>x.id===id); if(g) return {kind:"gong",obj:g}; const s=SPELLS_BY_ID[id]; if(s) return {kind:"skill",obj:s}; const r=REC_BY_ID[id]; if(r) return {kind:"tres",obj:r}; return null; }
function buyShop(entry){ if(!entry||entry.stock<=0) return; const it=shopItem(entry.id); if(!it) return; const p=splitPriceL(it.obj.value); if(!canPayL(p)&&!canPayAutoL(it.obj.value)){ logEvent("灵石不足（可自动以高品折低品支付，或先至「灵石兑换」低换高凑齐），无法购买「"+it.obj.name+"」。",'warn'); return; } if(it.kind==="skill"){ if((S.skills||[]).includes(entry.id)){ logEvent("已习得「"+it.obj.name+"」，无需重复购买",'dim'); return; } const rEl=S.root?rootSpellElems(S.root):[]; if(!rEl.includes(it.obj.elem)){ logEvent("「"+it.obj.name+"」属"+it.obj.elem+"灵根，与自身灵根（"+(S.root?S.root.name:"未定")+"）不符，无法修炼",'warn'); return; } if(!payL(p)) payAutoL(it.obj.value); entry.stock--; S.skills.push(entry.id); logEvent("购得并习得「"+it.obj.name+"」（"+it.obj.elem+"·"+(it.obj.type==="shen"?"身法":"灵根法术")+"）· 可至战前技能槽装备",'sys','trade'); sound(520,.15); save(); render(); return; } if(it.kind==="book"){ if(!payL(p)) payAutoL(it.obj.value); entry.stock--; S.books.push({sid:it.obj.bookSid,lv:it.obj.bookLv||1}); logEvent("于坊市购得兽诀「"+it.obj.name+"」",'sys','trade'); sound(520,.15); save(); render(); return; } if(!payL(p)) payAutoL(it.obj.value); entry.stock--; if(it.kind==="mat"){ S.mats[entry.id]=(S.mats[entry.id]||0)+1; } else { S.tres[entry.id]=(S.tres[entry.id]||0)+1; } logEvent("于坊市购入「"+it.obj.name+"」（-"+priceLText(p)+"）",'sys','trade'); sound(520,.15); save(); render(); }/* ============ 拍卖会（坊市子项）============ */
let shopCat="shop"; // "shop" 坊市 / "auction" 拍卖会
function auctionPool(minR,maxR){
  const a=[];
  MATS.forEach(m=>{ if(m.rarity>=minR&&m.rarity<=maxR) a.push({kind:"mat",obj:m}); });
  // v30.8 旧奇珍库已清空不再上架；恢复三件装备可拍卖（青莲宝座/定灵珠/星辰鉴）
  ["qinglian","dingling","xingtian"].forEach(id=>{ const r=REC_BY_ID[id]; if(r && r.rarity>=minR && r.rarity<=maxR) a.push({kind:"tres",obj:r}); });
  CRAFT.forEach(c=>c.rec.forEach(r=>{ if(r.rarity>=minR&&r.rarity<=maxR && !r.slot) a.push({kind:"tres",obj:r}); }));
  GONGFAS.forEach(g=>{ if(g.id!=="yj" && g.rarity>=minR&&g.rarity<=maxR) a.push({kind:"gong",obj:g}); }); // v31.11 黄庭经不再出售
  SPELLS.forEach(s=>{ const r=spellRarityOf(s); if(r>=minR&&r<=maxR) a.push({kind:"skill",obj:s}); }); // v31.10 拍卖池加入技能
  PET_SKILLS.forEach(s=>{ const o=petBookObj(s.id,1); if(o&&o.rarity>=minR&&o.rarity<=maxR) a.push({kind:"book",obj:o}); }); // v33 兽诀入拍卖
  return a;
}
function itemCat(it){
  if(it.kind==="gong") return "功法";
  if(it.kind==="skill") return it.obj.type==="shen"?"身法":"灵根法术";
  if(it.kind==="book") return "兽诀";
  if(it.kind==="mat") return it.obj.cat||"材料";
  const r=it.obj;
  if(r.slot){
    if(r.slot==="w") return "武器";
    if(r.slot==="h"||r.slot==="a") return "防具";
    if(r.slot==="m") return "法宝";
    return "饰品";
  }
  if(it.kind==="tres"){ const c=CRAFT.find(x=>x.rec.indexOf(r)>=0); if(c) return c.cat; }
  return "成品";
}
function shopTipHtml(it,en){
  const r=it.obj;
  let eff="";
  if(it.kind==="gong") eff="功法 · 灵气倍率 ×"+r.ess;
  else if(it.kind==="skill") eff="购后习得，可装配至战前技能槽";
  else if(it.kind==="book") eff="兽诀 · "+r.ds;
  else if(it.kind==="mat"){ /* 材料无效果段 */ }
  else if(r.slot) eff=eqText(r);
  else { const useable=!!(r.eff||r.heal); eff=useable?("效果："+effText(r)):"无可使用效果，可出售"; }
  let held="";
  if(it.kind==="mat") held=" · 持有 "+fmt(S.mats[en.id]||0);
  else if(it.kind==="gong") held=" · "+(S.gongs.includes(en.id)?"已习得":"未习得");
  else if(it.kind==="skill"){
    const rEl=S.root?rootSpellElems(S.root):[];
    const wrong=!rEl.includes(r.elem);
    held=" · "+(S.skills.includes(en.id)?"已习得":(wrong?'<b style="color:#e05555">本灵根不可用</b>':"未习得"));
  }
  else if(it.kind==="book") held=" · 持有 "+((S.books||[]).filter(b=>b.sid===r.bookSid&&(b.lv||1)===(r.bookLv||1)).length);
  else held=" · 持有 "+fmt(S.tres[en.id]||0);
  return `<b>${r.name}${it.kind==="skill"?"（"+r.elem+"灵根）":""}</b>（稀有${it.kind==="skill"?spellRarityOf(r):r.rarity} · ${itemCat(it)}）<br>${it.kind==="skill"?battleSkillDesc("spell",r):(r.ds||"无")}${eff?`<br><span style="color:var(--jade)">${eff}</span>`:""}<br>${it.kind==="skill"?"单价 "+priceLText(splitPriceL(r.value)):(it.kind==="mat"?"单价":"价值")+" "+r.value+" 下品灵石"} · 库存 ${en.stock}${held}`;
}
/* v28 拍卖会货物悬浮详情：与坊市随机出售同机制（#itemTip/bindTip），展示名称/分类/描述/效果与底价、当前出价 */
function auctionTipHtml(it,en){
  const r=it.obj;
  let eff="";
  if(it.kind==="gong") eff="功法 · 灵气倍率 ×"+r.ess;
  else if(it.kind==="mat"){ /* 材料无效果段 */ }
  else { const useable=!!(r.eff||r.heal); eff=useable?("效果："+effText(r)):"无可使用效果，可出售"; }
  const who=en.bidder==="player"?"你":en.bidder==="npc"?"虚灵商客":"无人出价";
  let held=""; // v31.13 拍卖悬浮显示当前持有数量
  if(it.kind==="mat") held=" · 持有 "+fmt(S.mats[en.id]||0);
  else if(it.kind==="tres") held=" · 持有 "+fmt(S.tres[en.id]||0);
  else if(it.kind==="gong") held=" · "+(S.gongs.includes(en.id)?"已习得":"未习得");
  else if(it.kind==="skill") held=" · "+(S.skills.includes(en.id)?"已习得":"未习得");
  return `<b>${r.name}</b>（稀有${it.kind==="skill"?spellRarityOf(r):r.rarity} · ${itemCat(it)}）<br>${it.kind==="skill"?battleSkillDesc("spell",r):(r.ds||"无")}${eff?`<br><span style="color:var(--jade)">${eff}</span>`:""}<br>底价 ${ceilPriceText(en.base)} · 当前 ${ceilPriceText(en.bid)}（${who}）${held}`;
}
function auctionItem(kind,id){
  if(kind==="mat"){ const m=MATS_BY_ID[id]; return m?{kind:"mat",obj:m}:null; }
  const g=GONGFAS.find(x=>x.id===id); if(g) return {kind:"gong",obj:g};
  if(kind==="skill"){ const s=SPELLS_BY_ID[id]; if(s) return {kind:"skill",obj:s}; } // v31.10 拍卖池支持技能
  if(kind==="book"){ const bk=PET_BOOK_BY_ID[id]; if(bk) return {kind:"book",obj:bk}; }
  const r=REC_BY_ID[id]; if(r) return {kind:"tres",obj:r};
  return null;
}
function nextAuctionTime(now){
  const d=new Date(now); d.setSeconds(0,0); const m=d.getMinutes();
  if(m===0||m===30) return d.getTime();
  return m<30 ? d.getTime()+(30-m)*60000 : d.getTime()+(60-m)*60000;
}
function refreshAuction(now, startAt){
  const st = startAt || now;
  if(st+15*60*1000 <= now){ S.auctionNext=nextAuctionTime(now); return; } // v31.10 整场已错过（离线过久），直接指向下一场
  const large = new Date(st).getMinutes()===0; // v31.10 模式由预定开场时刻决定：整点→大型、半点→小型
  const minR = large?5:4, maxR = large?8:6;
  const n = large?10:5;
  const pool=auctionPool(minR,maxR);
  // v31.11 拍卖会每场只刷 1 本功法；技能保底：大型 2 本、小型 1 本
  const picked=[];
  const take=(src,need)=>{ for(let i=0;i<need && src.length;i++){ picked.push(src.splice(Math.floor(Math.random()*src.length),1)[0]); } };
  take(pool.filter(p=>p.kind==="gong"), 1);
  take(pool.filter(p=>p.kind==="skill"), large?2:1);
  const taken=new Set(picked.map(p=>p.kind+":"+p.obj.id));
  const rest=pool.filter(p=>p.kind!=="gong"&&!taken.has(p.kind+":"+p.obj.id)); // v31.11 补货不含功法，拍卖每场恒1本功法
  [...rest].sort(()=>Math.random()-0.5).slice(0,Math.max(0,n-picked.length)).forEach(p=>picked.push(p));
  S.auction={list:picked.map(p=>{const base=Math.max(1,Math.ceil(p.obj.value*2)); return {kind:p.kind,id:p.obj.id,base:base,bid:base,bidder:null,pPaid:0};}), mode:large?"大型":"小型", start:st, end:st+15*60*1000, live:true, npcLast:st, settled:false};
  logEvent("拍卖会开场："+S.auction.mode+"拍卖（"+S.auction.list.length+" 件 · 15 分钟竞价）",'sys','trade');
  S.auctionNext=nextAuctionTime(S.auction.end); // 开场后立即指向下一场，避免重复开场
}
function bidAuction(en){
  if(!en || !S.auction || !S.auction.live) return;
  const it0=auctionItem(en.kind,en.id);
  if(it0 && it0.kind==="skill"){ // v31.17 拍卖技能同坊市：非本灵根不可竞拍
    if((S.skills||[]).includes(en.id)){ logEvent("已习得「"+it0.obj.name+"」，无需重复竞拍",'dim'); return; }
    const r0=S.root?rootSpellElems(S.root):[];
    if(!r0.includes(it0.obj.elem)){ logEvent("「"+it0.obj.name+"」属"+it0.obj.elem+"灵根，与自身灵根（"+(S.root?S.root.name:"未定")+"）不符，无法竞拍",'warn'); return; }
  }
  const add=Math.max(1,Math.ceil(en.base*0.1)); // 加价 = 底价 10%
  const nb=en.bid+add;
  const extra=nb-(en.pPaid||0); // 只需补差额
  const it=it0;
  if(extra>0 && !canPayL(splitPriceL(extra)) && !canPayAutoL(extra)){ logEvent("灵石不足（可自动以高品折低品支付，或先至「灵石兑换」低换高凑齐），无法出价「"+(it?it.obj.name:"")+"」（需 "+fmt(nb)+" 下品灵石）。",'warn'); return; }
  if(extra>0 && !payL(splitPriceL(extra))) payAutoL(extra);
  en.bid=nb; en.pPaid=nb; en.bidder="player";
  logEvent("你出价 "+fmt(nb)+" 下品灵石竞拍「"+(it?it.obj.name:"")+"」",'sys','trade'); sound(620,.1); save(); render();
}
function npcBid(now){
  if(!S.auction || !S.auction.live) return;
  if(Math.random()>=0.1) return; // 每分钟 10% 几率 NPC 竞价
  const open=S.auction.list.filter(en=>en.bidder!=="npc");
  if(!open.length) return;
  const en=open[Math.floor(Math.random()*open.length)];
  const add=Math.max(1,Math.ceil(en.base*0.1));
  en.bid=en.bid+add; en.bidder="npc";
  const it=auctionItem(en.kind,en.id);
  logEvent("虚灵商客出价 "+fmt(en.bid)+" 下品灵石竞拍「"+(it?it.obj.name:"")+"」",'warn','trade'); sound(300,.08);
}
function settleAuction(now){
  if(!S.auction || !S.auction.live) return;
  S.auction.live=false; S.auction.settled=true;
  let won=0, npc=0, voided=0, refund=0;
  S.auction.list.forEach(en=>{
    const it=auctionItem(en.kind,en.id);
    if(en.bidder==="player"){
      if(it){ if(it.kind==="mat") S.mats[en.id]=(S.mats[en.id]||0)+1; else if(it.kind==="skill"){ const rq=S.root?rootSpellElems(S.root):[]; if(rq.includes(it.obj.elem)){ if(!S.skills.includes(en.id)) S.skills.push(en.id); logEvent("拍卖拍得技能「"+it.obj.name+"」并习得",'sys','trade'); } else { addL(splitPriceL(en.pPaid||0)); refund+=(en.pPaid||0); logEvent("「"+it.obj.name+"」属"+it.obj.elem+"灵根，与本灵根不符，未能习得（已退还 "+fmt(en.pPaid||0)+" 下品灵石）",'warn','trade'); } } // v31.10 技能拍得直接习得
        else if(it.kind==="book"){ S.books.push({sid:it.obj.bookSid,lv:it.obj.bookLv||1}); }
        else if(it.kind==="gong"){ S.tres[en.id]=(S.tres[en.id]||0)+1; } else if(isEquip(en.id)){ S.equip.push(newEquip(en.id)); } else { S.tres[en.id]=(S.tres[en.id]||0)+1; } }
      won++; if(it) logEvent("拍卖成交：以 "+fmt(en.bid)+" 下品灵石拍得「"+it.obj.name+"」",'sys','trade');
    } else if(en.bidder==="npc"){
      if(en.pPaid>0){ addL(splitPriceL(en.pPaid)); refund+=en.pPaid; }
      npc++; if(it) logEvent("「"+it.obj.name+"」被虚灵商客以 "+fmt(en.bid)+" 拍走"+(en.pPaid>0?"，已退还 "+fmt(en.pPaid)+" 下品灵石":""),'warn');
    } else { voided++; if(it) logEvent("「"+it.obj.name+"」无人竞拍，自动取消",'dim','trade'); }
  });
  if(refund>0) logEvent("拍卖结算：退还被超价出价 "+fmt(refund)+" 下品灵石",'sys','trade');
  banner("拍卖结算："+won+" 件成交、"+(npc+voided)+" 件未得");
  if(won>0) sfxCoin(); else sound(420,.12); save(); render();
  S.auctionNext=nextAuctionTime(now);
}
function renderAuction(body){
  const st=document.createElement("div");st.className="sectionTitle";st.textContent="— 拍卖会 · "+((S.auction&&S.auction.mode)||"—")+" —";body.appendChild(st);
  const live=!!(S.auction&&S.auction.live);
  const p=document.createElement("div");p.className="hint";
  if(live){
    const left=Math.max(0,S.auction.end-Date.now());
    const mm=Math.floor(left/60000), ss=Math.floor((left%60000)/1000);
    p.innerHTML="每<b>半点</b>小型（5 件稀有 4~6）、每<b>整点</b>大型（10 件稀有 5~8）。<b>竞价 15 分钟</b>，结束后价高者得；无人出价自动取消。每分钟 10% 几率虚灵商客竞价。当前 <b>"+S.auction.mode+"</b>，剩余 <b id='aucTimer'>"+mm+"分"+ss+"秒</b>。";
  } else {
    const next=Math.max(0,(S.auctionNext||0)-Date.now());
    p.innerHTML="拍卖休市中。每<b>半点</b>小型、每<b>整点</b>大型开场；竞价 15 分钟，价高者得，无人出价自动取消。距下一场开场约 <b>"+Math.ceil(next/60000)+"</b> 分钟。";
  }
  body.appendChild(p);
  if(live && S.auction.list.length) S.auction.list.forEach((en,idx)=>{
    const it=auctionItem(en.kind,en.id); if(!it) return;
    const who=en.bidder==="player"?"你":en.bidder==="npc"?"虚灵商客":"无人出价";
    const add=Math.max(1,Math.ceil(en.base*0.1));
    const nb=en.bid+add, extra=nb-(en.pPaid||0);
    const row=document.createElement("div");row.className="exchRow";
    const rElA=S.root?rootSpellElems(S.root):[]; const wrongA=it.kind==="skill"&&!rElA.includes(it.obj.elem);
    row.innerHTML=`<span class="ex-n">${icOf(it.obj)} ${it.obj.name}${it.kind==="skill"?"（"+it.obj.elem+"灵根）":""}${wrongA?'<b style="color:#e05555"> · 本灵根不可用</b>':""} · 稀有${it.kind==="skill"?spellRarityOf(it.obj):it.obj.rarity} · ${itemCat(it)} · 底价 ${ceilPriceText(en.base)} · 当前 <span id="aucBid${idx}">${ceilPriceText(en.bid)}（${who}）</span></span>`;
    row.appendChild(buyBtn(!wrongA&&(canPayL(splitPriceL(extra))||canPayAutoL(extra)),()=>{bidAuction(en);},wrongA?"不可用":"出价 "+ceilPriceText(nb)));
    bindTip(row,icOf(it.obj),()=>auctionTipHtml(it,en)); // v30.9 拍卖悬浮实时取最新竞价/竞拍者，避免快照过期
    body.appendChild(row);
  });
  else if(!live){ const e=document.createElement("div");e.className="hint";e.textContent="拍卖已结算或等待开场，请稍候。";body.appendChild(e); }
}
function renderShop(body){
  body.innerHTML="";
  const bar=document.createElement("div");bar.className="craftBar";
  [["shop","🏪 坊市"],["auction","🎩 拍卖会"],["exch","💱 灵石兑换"]].forEach(pair=>{
    const b=document.createElement("button");b.textContent=pair[1];b.className="craftB";
    if(shopCat===pair[0]) b.classList.add("active");
    b.onclick=()=>{ shopCat=pair[0]; render(); };
    bar.appendChild(b);
  });
  body.appendChild(bar);
  if(shopCat==="auction"){ renderAuction(body); return; }
  if(shopCat==="exch"){ renderExch(body); return; }
  const now=Date.now();
  if(!S.shop.until || now>=S.shop.until){ refreshShop(now); }
  if(S.auction && S.auction.live){
    if(Date.now()>=S.auction.end){ settleAuction(Date.now()); } // v31.10 先结算过期场
    else if(Date.now()>=S.auction.npcLast+60000){ S.auction.npcLast=Date.now(); npcBid(Date.now()); }
  }
  if(!S.auctionNext) S.auctionNext=nextAuctionTime(now);
  if(now>=S.auctionNext){ refreshAuction(now, S.auctionNext); }
  let st=document.createElement("div");st.className="sectionTitle";st.textContent="— 坊市 · 随机出售（每10分钟刷新）—";body.appendChild(st);
  const p=document.createElement("div");p.className="hint";p.innerHTML="随机上架 10 种材料 / 成品，越稀有刷新率越低、库存越少（稀有度1~5 → 库存10~1）。以灵石购买：<b>下品不足时自动以高品折抵</b>（高→低折算含 1% 手续费，多余找回下品）；<b>高品不足不自动低换高</b>，需先至「灵石兑换」手动凑齐。"+(S.shop.list.length?(" 距下次刷新 <b>"+Math.ceil((S.shop.until-Date.now())/60000)+"</b> 分钟。"):"");body.appendChild(p);
  if(!S.shop.list.length){ const e=document.createElement("div");e.className="hint";e.textContent="暂无上架商品。";body.appendChild(e); }
  else S.shop.list.forEach(en=>{ const it=shopItem(en.id); if(!it) return; const pr=splitPriceL(it.obj.value); const rEl=S.root?rootSpellElems(S.root):[]; const wrong=it.kind==="skill"&&!rEl.includes(it.obj.elem); const row=document.createElement("div");row.className="exchRow"; row.innerHTML=`<span class="ex-n">${icOf(it.obj)} ${it.obj.name}${it.kind==="skill"?"（"+it.obj.elem+"灵根）":""}${wrong?'<b style="color:#e05555"> · 本灵根不可用</b>':""} · 稀有${it.kind==="skill"?spellRarityOf(it.obj):it.obj.rarity} · ${itemCat(it)} · 库存 ${en.stock} · ${priceLText(pr)}</span>`; bindTip(row,icOf(it.obj),()=>shopTipHtml(it,en)); const learned=it.kind==="skill"&&(S.skills||[]).includes(en.id); row.appendChild(buyBtn(en.stock>0&&(canPayL(pr)||canPayAutoL(it.obj.value))&&!learned&&!wrong,()=>{buyShop(en);render();},learned?"已习得":(wrong?"不可用":"购买"))); body.appendChild(row); });
}
function renderExch(body){
  const st2=document.createElement("div");st2.className="sectionTitle";st2.textContent="— 坊市 · 灵石兑换（手续费1%）—";body.appendChild(st2);
  const p2=document.createElement("div");p2.className="hint";p2.textContent="兑换比：1神品=100极品=1万上品=100万中品=1亿下品。兑换收取固定 1% 手续费：低→高支付多付（如 100 下品→1 中品扣 101），高→低所得扣减（如 1 中品→100 下品得 99）。「×10」一次 10 份，「×50」一次 50 份，「×100」一次 100 份。";body.appendChild(p2);
  const EXCH=[
    {n:"下品 → 中品",from:"stoneL",to:"stoneM",fa:100,ta:1},
    {n:"中品 → 上品",from:"stoneM",to:"stoneH",fa:100,ta:1},
    {n:"上品 → 极品",from:"stoneH",to:"stoneT",fa:100,ta:1},
    {n:"中品 → 下品",from:"stoneM",to:"stoneL",fa:1,ta:100},
    {n:"上品 → 中品",from:"stoneH",to:"stoneM",fa:1,ta:100},
    {n:"极品 → 上品",from:"stoneT",to:"stoneH",fa:1,ta:100},
    {n:"神品 → 极品",from:"stoneG",to:"stoneT",fa:1,ta:100},
  ];
  EXCH.forEach(e=>{
    const row=document.createElement("div");row.className="exchRow";
    const cost=e.fa>1?Math.ceil(e.fa*1.01):e.fa;
    const gain=e.fa>1?e.ta:Math.floor(e.ta*0.99);
    const ok=(S[e.from]||0)>=cost;
    const ok10=(S[e.from]||0)>=cost*10;
    const ok50=(S[e.from]||0)>=cost*50;
    const ok100=(S[e.from]||0)>=cost*100;
    row.innerHTML=`<span class="ex-n">${e.n}（${cost}:${gain} 含1%）${ok?"":"<span style='color:#e05555;font-size:11px'>（不足"+cost+"）</span>"}</span>`;
    const btns=document.createElement("div");btns.style.display="flex";btns.style.gap="6px";
    btns.appendChild(buyBtn(ok,()=>{doExch(e,1);render();},"兑换1个"));
    btns.appendChild(buyBtn(ok10,()=>{doExch(e,10);render();},"×10"));
    btns.appendChild(buyBtn(ok50,()=>{doExch(e,50);render();},"×50"));
    btns.appendChild(buyBtn(ok100,()=>{doExch(e,100);render();},"×100"));
    row.appendChild(btns);
    body.appendChild(row);
  });
}
function renderBattle(body){
  body.innerHTML="";
  const st=document.createElement("div");st.className="sectionTitle";st.textContent="— 探索 · 秘境 —";body.appendChild(st);
  if(battleActive()){
    const ec=document.createElement("div");ec.className="item";ec.id="battleEntryCard";ec.style.borderColor="var(--gold)";
    ec.innerHTML='<div class="ic">⚔️</div><div class="body"><div class="nm">战斗进行中 <span class="cat">未结算</span></div>'
      +'<div class="ds" id="battleEntryTxt">'+battleEntryLabel()+'</div>'
      +'<div class="ln">战斗界面收起后不会丢失战况，点右侧按钮即可回到战斗。</div></div>';
    ec.appendChild(buyBtn(true,()=>reopenBattle(),"进入战斗"));
    body.appendChild(ec);
  }
  const canExp=S.realm>=1;
  const p=document.createElement("div");p.className="hint";
  p.innerHTML="进入区域遭遇凶险、寻获机缘：蜂窝秘境共 10 层，难度与奖励逐层递增，最终层或遇 BOSS；气血耗尽将被迫撤离并损失一半收获。灵根直接影响战斗数值——单灵根战力最强（+30%）、五灵根最低（+10%），灵根越多突破越稳；变异灵根各具战斗特性，神通库中的技能为可施展神通。"+(S.root?(" 当前灵根「"+S.root.name+"」战斗加成 +"+Math.round(S.root.combat*100)+"%。"):"")+(canExp?"":" <b style=\"color:#e05555\">炼气期尚未开悟，筑基后方可踏入秘境。</b>");
  body.appendChild(p);
  const AREAS=[
    {key:"dt", nm:"洞天福地", lv:"中危", lvC:"#e67e22", ic:"🏞️", ds:"灵气浓郁之地，机缘众多，偶有低阶妖兽与珍稀灵植，适宜稳步积累。"},
    {key:"yl", nm:"原始禁区", lv:"高危", lvC:"#d9534f", ic:"🌋", ds:"上古遗种出没之地，凶兽成群、灵脉暴走，深入需谨慎，收益亦更丰厚。"},
    {key:"sg", nm:"上古战场", lv:"极危", lvC:"#8e44ad", ic:"⚔️", ds:"仙魔陨落之地，残念横行、法则崩坏，唯有强者方能全身而退。"},
    {key:"kj", nm:"跨界空间", lv:"九死一生", lvC:"#6b1f1f", ic:"🌀", ds:"虚空裂缝中的禁忌之地，一步一险、十不存一，但埋藏着真正的逆天机缘。"}
  ];
  AREAS.forEach(a=>{
    const item=document.createElement("div");item.className="item";
    const df=areaDifficulty(a.key);
    item.innerHTML=`<div class="ic">${a.ic}</div><div class="body">
      <div class="nm">${a.nm} <span class="cat" style="color:${df.lvC};border-color:${df.lvC};">${df.lv}</span></div>
      <div class="ds">${a.ds}</div>
      <div class="ln" style="margin-top:3px;color:var(--jade)">适合探索 · 建议境界 ${EXP_AREAS[a.key].rec}</div>
      <div class="ln" style="margin-top:2px;color:var(--ink-dim)">当前难度获取灵力 ×${df.mult.toFixed(1)}</div>
      <div class="ln" style="margin-top:2px">蜂窝秘境 · 共 10 层，每层难度与奖励递增，最终层或遇 BOSS</div>
    </div>`;
    const wr=document.createElement("div");wr.className="btnRow";
    wr.appendChild(buyBtn(canExp,()=>startExplore(a.key),"进入探索"));
    item.appendChild(wr);
    body.appendChild(item);
  });
}
/* 战前技能槽 · 固定于滚动页外下端：仅探索子页显示，内容滚动时保持在底部 */
function renderBattleBar(){
  const bar=$("battleSetupBar");
  if(activeTab!=="battle"){ bar.classList.remove("show"); $("tabBody").style.paddingBottom=""; return; }
  const cap=slotCapOf(S.root);
  const slots=resolveSlots(S.root);
  const dmgN=slots.dmg.map(id=>SPELLS_BY_ID[id]&&SPELLS_BY_ID[id].name).join("、")||"—";
  const shenN=slots.shen.map(id=>SPELLS_BY_ID[id]&&SPELLS_BY_ID[id].name).join("、")||"—";
  const shenShN=slots.shenSh.map(id=>SHEN.find(x=>x.id===id)&&SHEN.find(x=>x.id===id).name).join("、")||"—";
  bar.innerHTML=`<div class="bsBar">
    <div class="bsTitle">⚙️ 战前技能槽 · 技能战斗</div>
    <div class="bsSummary">法术 <b>${dmgN}</b> ｜ 身法 <b>${shenN}</b> ｜ 神通 <b>${shenShN}</b>（法${cap.dmg}/身${cap.shen}/神${cap.shenSh}）</div>
    <button id="bsCfgBtn">配置技能槽</button>
  </div>`;
  $("bsCfgBtn").addEventListener("click",openSlotsConfig);
  bar.classList.add("show");
  placeBattleBar();
  $("tabBody").style.paddingBottom=bar.offsetHeight+18+"px";
}
/* 把固定条对齐到中列（tabBody）的宽度与位置 */
function placeBattleBar(){
  const tb=$("tabBody"), bar=$("battleSetupBar");
  if(activeTab!=="battle")return;
  const r=tb.getBoundingClientRect();
  bar.style.left=r.left+"px";
  bar.style.width=r.width+"px";
}
/* 战前技能槽配置弹窗：在可用池中点击切换装备，保存到 S.slots */
function openSlotsConfig(){
  const root=S.root; if(!root){ banner("先定灵根才能配置"); return; }
  const cap=slotCapOf(root);
  const pool=spellPoolFor(root);
  const dmgPool=pool.filter(s=>s.type==="dmg"||s.type==="fa"), shenPool=pool.filter(s=>s.type==="shen");
  const learned=SHEN.filter(x=>S.shen.includes(x.id));
  const st=S.slots||{dmg:[],shen:[],shenSh:[]};
  $("slotsTitle").textContent="— 战前技能槽配置 · "+root.name+"（法"+cap.dmg+" 身"+cap.shen+" 神"+cap.shenSh+"）—";
  const box=$("slotsBody"); box.innerHTML="";
  let dmgSel=st.dmg.slice(), shenSel=st.shen.slice(), shenShSel=st.shenSh.slice();
  const saveIt=()=>{ S.slots={dmg:dmgSel,shen:shenSel,shenSh:shenShSel}; save(); renderPicks(); renderTab(); };
  const renderPicks=()=>{
    box.innerHTML="";
    putRow(box,"法术槽（最多 "+cap.dmg+"）",dmgPool,cap.dmg,dmgSel,v=>{dmgSel=v;saveIt();});
    putRow(box,"身法槽（最多 "+cap.shen+"）",shenPool,cap.shen,shenSel,v=>{shenSel=v;saveIt();});
    putRow(box,"神通槽（最多 "+cap.shenSh+"）",learned.map(x=>({id:x.id,name:x.name,cost:SHEN_BS[x.id]&&SHEN_BS[x.id].cost})),cap.shenSh,shenShSel,v=>{shenShSel=v;saveIt();},"shensh");
  };
  renderPicks();
  $("slotsOverlay").classList.add("show");
}
function putRow(box,label,opts,cap,sel,on,kind){
  box.appendChild(Object.assign(document.createElement("div"),{className:"slotRow",textContent:label+"（"+sel.length+"/"+cap+"）"}));
  opts.forEach(o=>{
    const onNow=sel.includes(o.id);
    const b=document.createElement("button");b.className="slotPick"+(onNow?" on":"");
    const desc=battleSkillDesc(kind||"spell",o);
    b.innerHTML=(onNow?"✓ ":"")+(SPELL_IMG[o.id]?("<img class=\"skIcon\" src=\""+SPELL_IMG[o.id]+"\" alt=\"\">"):"")+"<span class='sdName'>"+(o.name||o.id)+(o.cost?"（耗"+o.cost+"）":"")+"</span>"+(desc?"<span class='sd'>"+desc+"</span>":"");
    // 始终可点选：未装备且槽满时，点选即替换当前槽中最旧的一个（自由选择技能）
    b.addEventListener("click",()=>{
      const arr=sel.slice();
      if(onNow){ arr.splice(arr.indexOf(o.id),1); }
      else if(arr.length<cap){ arr.push(o.id); }
      else { arr.shift(); arr.push(o.id); }
      on(arr);
    });
    box.appendChild(b);
  });
}
