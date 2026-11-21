/* ================================================================
   菜单切换
   ================================================================ */
document.querySelectorAll(".menu-item").forEach(m=>m.addEventListener("click",()=>{
  switchTab(m.dataset.tab);
  // v30.8.2 新手指引：功能步要求点击对应菜单，命中后自动进入下一步
  if(tutStep>=0 && TUT_STEPS[tutStep] && TUT_STEPS[tutStep].menu===m.dataset.tab) tutNext();
}));
$("breakBtn").addEventListener("click",()=>{ const _b=$("breakBtn"); if(_b&&_b.disabled) return; if(_b)_b.disabled=true; doBreak(); setTimeout(()=>{ try{ renderStats(); }catch(e){} },420); });
$("flyBtn").addEventListener("click",()=>ascend());
$("yunBtn").addEventListener("click",()=>{
  // 兜底：引导/灵根弹窗若残留（定根后未正常关闭）先移除，确保点击必响应
  if(S.root && $("rrOverlay").classList.contains("show")) $("rrOverlay").classList.remove("show");
  if((S.tut==="done"||S.tut==="skip") && $("tutOverlay").classList.contains("show")) $("tutOverlay").classList.remove("show");
  startYun();
});
$("stopYunBtn").addEventListener("click",()=>stopYun());
$("rollBtn").addEventListener("click",()=>{ if(S.root && S.freeRolls<=0){ banner("灵根已定，可用重生重置"); } else openReroll(); });
$("mBtn").addEventListener("click",()=>$("overlay").classList.remove("show"));
let expConfirming=false, expConfirmTimer=null;
$("expRetreatBtn").addEventListener("click",()=>{
  if(!S.exp||S.exp.over) return;
  if(!expConfirming){
    expConfirming=true; const b=$("expRetreatBtn");
    b.textContent="⚠ 确认撤出？再点一次生效（4 秒后自动取消）"; b.style.background="linear-gradient(135deg,#ffb03f,#d9534f)";
    expConfirmTimer=setTimeout(()=>{ expConfirming=false; b.textContent="撤出秘境（-50%气血 · -50%战利品）"; b.style.background="linear-gradient(135deg,#d9534f,#b03a35)"; },4000);
    return;
  }
  clearTimeout(expConfirmTimer); expConfirming=false; expRetreat();
});
$("expCloseBtn").addEventListener("click",()=>$("expOverlay").classList.remove("show"));
$("expTabExplore").addEventListener("click",()=>{ expTab="explore"; renderExpPanel(); });
$("expTabLoot").addEventListener("click",()=>{ expTab="loot"; renderExpPanel(); });

/* ================================================================
   游戏循环
   ================================================================ */
let lastTick=performance.now();
let lastAucTick=0;
function gameTick(now){
  const dt=(now-lastTick)/1000; lastTick=now;
  const _bnow=Date.now();
  for(const id in S.buffs){
    const b=S.buffs[id]; if(!b) continue;
    const left=b.until-_bnow;
    const nm=(REC_BY_ID[id]&&REC_BY_ID[id].name)||id;
    if(left<=0){ if(!S.buffEnded[id]){ S.buffEnded[id]=1; logEvent("「"+nm+"」效果已结束",'dim'); } delete S.buffs[id]; continue; }
    if(left<=5000 && !S.buffWarned[id]){ S.buffWarned[id]=1; logEvent("「"+nm+"」即将失效（5 秒内）",'warn'); }
  }
  if(!S.shop.until || Date.now()>=S.shop.until){ refreshShop(Date.now()); if(activeTab==="shop") renderTab(); }
  if(S.auction && S.auction.live){
    if(Date.now()>=S.auction.end){ settleAuction(Date.now()); if(activeTab==="shop") renderTab(); } // v31.10 先结算过期场
    else if(Date.now()>=S.auction.npcLast+60000){ S.auction.npcLast=Date.now(); npcBid(Date.now()); }
  }
  if(!S.auctionNext) S.auctionNext=nextAuctionTime(Date.now());
  if(Date.now()>=S.auctionNext){ refreshAuction(Date.now(), S.auctionNext); if(activeTab==="shop") renderTab(); }
  // 拍卖页轻量刷新（仅更新计时与竞价文本，不重建 DOM，避免位置跳动/闪烁）
  if(activeTab==="shop" && shopCat==="auction" && S.auction && S.auction.live && Date.now()-lastAucTick>=1000){
    lastAucTick=Date.now();
    const t=$("aucTimer"); if(t){ const left=Math.max(0,S.auction.end-Date.now()); const mm=Math.floor(left/60000),ss=Math.floor((left%60000)/1000); t.textContent=mm+"分"+ss+"秒"; }
    S.auction.list.forEach((en,i)=>{ const el=$("aucBid"+i); if(el){ const who=en.bidder==="player"?"你":en.bidder==="npc"?"虚灵商客":"无人出价"; el.textContent=ceilPriceText(en.bid)+"（"+who+"）"; } });
  }
  if(!S.exp && S.hp<S.hpMax){
    S.hp+=S.hpMax*dt/7200; // v26.9 自然回血：任意等级 2 小时（7200s）从 0 回满
    if(S.hpMax-S.hp<1) S.hp=S.hpMax; // 收尾补满：规避浮点累加误差
    S.hp=Math.min(S.hpMax,S.hp);
  }
  petTick(dt); // v31 灵兽饱食/亲密衰减与叛变倒计时
  if(activeTab==="ls") petTickLiteUI();
  let mult=1;
  if(evt.prodBoost>Date.now()) mult*=2;
  if(evt.prodBoost3>Date.now()) mult*=3;
  if(evt.prodPenalty>Date.now()) mult*=0.5;
  if(evt.prodLow>Date.now()) mult*=0.6;
  // B 单灵根修炼暴击（v18.59）：15% 概率该秒灵力产出 ×3
  let critMult=1;
  if(S.root && S.root.type==="single" && Math.random()<0.15*dt){ critMult=3; logEvent("灵气暴击！修炼产出 ×3","sys","sys"); }
  const hpPct=Math.max(0.1, S.hp/S.hpMax);
  const eGain=prodPerSec()*mult*critMult*hpPct*dt;
  if(eGain>0){ S.essence+=eGain; S.lifetime+=eGain; }
  let caiProduced=false;
  for(const c in S.collect){
    if(S.collect[c]===undefined||!["beast","ore","herb"].includes(c)) continue;
    S.collect[c]+=dt;
    const iv=15;
    if(S.collect[c]>=iv){
      const n=Math.floor(S.collect[c]/iv); S.collect[c]-=n*iv;
      for(let i=0;i<n;i++){ const got=rollCollect(c); caiProduced=true; if(got.length){ got.forEach(m=>{ S.mats[m.id]=(S.mats[m.id]||0)+1; }); logEvent("挂机采集到 "+got.map(m=>"「"+m.name+"」×1").join("、")+(got.length>1?"（共 "+got.length+" 件）":""),'','collect'); } else { logEvent("挂机采集失败，一无所获",'dim'); } }
    }
  }
  if(caiProduced && (activeTab==="cai"||activeTab==="xu")) renderTab(); // v30.7.6 须弥空间页同步刷新
  // 单次采集冷却：实时倒计时 + 到期自动恢复（轻量更新按钮，不重建中列避免闪烁；三框共享冷却）
  if(S.collectCd>0 && activeTab==="cai"){
    const left=Math.max(0,Math.ceil((S.collectCd-Date.now())/1000));
    document.querySelectorAll('[id^="collectBtn-"]').forEach(cb=>{
      if(!cb) return;
      if(left>0){ const t="采集中 "+left+"s"; if(cb.textContent!==t){ cb.textContent=t; cb.disabled=true; } }
      else { S.collectCd=0; if(cb.textContent!=="立即采集") cb.textContent="立即采集"; cb.disabled=S.yunning||!!S.making; }
    });
  }
  // 制造完成
  if(S.making && Date.now()>=S.making.end){
    const rid=S.making.rId, r=REC_BY_ID[rid]; S.making=null;
    if(r){ if(isEquip(r.id)){ S.equip.push(newEquip(r.id)); } else { S.tres[rid]=(S.tres[rid]||0)+1; } sound(660,.2); logEvent("炼成「"+r.name+"」",'sys'); banner("炼成「"+r.name+"」"); }
    // 循环制造续作：目标未达成且材料足够则自动下一炉，否则停止
    if(S.cycle && !S.yunning){
      const cr=REC_BY_ID[S.cycle.rId];
      let ok2=!!cr;
      if(ok2){ for(const k in cr.need){ if((S.mats[k]||0)<cr.need[k]){ ok2=false; break; } } }
      if(ok2 && S.cycle.made<S.cycle.target){ craftItem(cr); S.cycle.made++; }
      else if(!ok2 || S.cycle.made>=S.cycle.target){
        const done=S.cycle.made>=S.cycle.target;
        logEvent(done?("循环制造完成：共炼制 "+S.cycle.made+" 件「"+(cr?cr.name:S.cycle.rId)+"」"):"循环制造已停止：材料不足",'warn','craft');
        banner(done?"循环制造完成":"循环制造已停止：材料不足");
        S.cycle=null;
      }
    }
    if(activeTab==="zao"||activeTab==="pu"||activeTab==="xu") renderTab(); // v30.7.6 须弥空间页同步刷新
  }
  // 傀儡自动采集 / 制造
  let svProduced=false;
  S.servants.forEach(s=>{
    if(!s.task) return;
    const eff=SV_EFF[s.lv]||0.4;
    if(s.task.kind==="cai"){
      const iv=15/eff;
      s.prog+=dt;
      while(s.prog>=iv){ s.prog-=iv; const got=rollCollect(s.task.t, s.task.zone); if(got.length){ got.forEach(m=>{ S.mats[m.id]=(S.mats[m.id]||0)+1; }); logEvent((LV_NM[s.lv]||s.lv)+"傀采集到 "+got.map(m=>"「"+m.name+"」×1").join("、")+(got.length>1?"（共 "+got.length+" 件）":""),'sys','collect'); svProduced=true; } else { logEvent((LV_NM[s.lv]||s.lv)+"傀采集失败，一无所获",'dim','collect'); } }
    } else {
      const cat=s.task.t;
      const full=(CRAFT.find(c=>c.cat===cat)||{rec:[]}).rec;
      const can=(r)=>{ for(const k in r.need){ if((S.mats[k]||0)<r.need[k]) return false; } return true; };
      const tgt=s.task.rId?full.find(r=>r.id===s.task.rId):null;
      let pool = tgt ? (can(tgt)?[tgt]:[]) : full.filter(can);
      if(!pool.length){ s.prog=0; s.curR=null; return; }
      if(!s.curR || !pool.some(p=>p.id===s.curR.id)) s.curR=pool[Math.floor(Math.random()*pool.length)];
      const r=s.curR, iv=craftTime(r)/eff;
      s.prog+=dt;
      while(s.prog>=iv){ s.prog-=iv; s.curR=null; for(const k in r.need) S.mats[k]-=r.need[k]; if(isEquip(r.id)){ S.equip.push(newEquip(r.id)); logEvent((LV_NM[s.lv]||s.lv)+"傀炼制出「"+r.name+"」",'sys','craft'); } else { S.tres[r.id]=(S.tres[r.id]||0)+1; logEvent((LV_NM[s.lv]||s.lv)+"傀制成「"+r.name+"」×1",'sys','craft'); } svProduced=true; }
    }
  });
  if(svProduced && (activeTab==="pu"||activeTab==="xu")) renderTab(); // v30.7.6 须弥空间页同步刷新
  // 傀儡任务进度：轻量更新倒计时文本（不重建中列避免闪烁）
  if(activeTab==="pu"){
    S.servants.forEach((s,i)=>{
      if(!s.task) return;
      const el=$("svProg"+i); if(!el) return;
      const eff2=SV_EFF[s.lv]||0.4;
      let iv2=15/eff2;
      if(s.task.kind==="zao"){
        const full=(CRAFT.find(c=>c.cat===s.task.t)||{rec:[]}).rec;
        const r0=s.curR||(s.task.rId?full.find(r=>r.id===s.task.rId):full[0]);
        if(r0) iv2=craftTime(r0)/eff2;
      }
      const t=s.prog.toFixed(1)+"/"+iv2.toFixed(1)+"s";
      if(el.textContent!==t) el.textContent=t;
    });
  }
  // v30.7.6 挂机日志即时刷新（置于可能抛错的 renderStats 之前，保证采集/傀儡/buff 日志不因该 tick 异常而积压）
  if(logDirty){ logDirty=false; renderLog(); }
  checkAchievements();
  renderStats();
  // 中列不再于 100ms 循环重建，避免按钮闪烁 / 单击丢失；仅采集产出与坊市刷新时按需渲染
}
let saveTick=0;
function autoLoop(){
  saveTick++;
  gameTick(performance.now());
  if(saveTick%15===0) save();
}
let bgInit=false;
function sizeBg(){ const cv=$("bg"); if(cv){ cv.width=window.innerWidth; cv.height=window.innerHeight; } }
function drawBg(now){
  const cv=$("bg"); if(!cv||cv.width===0) return;
  const ctx=cv.getContext("2d"); ctx.clearRect(0,0,cv.width,cv.height);
  const cols=[["#e0b95e","#45d0a0"],["#9aa5f0","#e0b95e"],["#45d0a0","#9aa5f0"]];
  const c=cols[Math.floor(now/6000)%cols.length];
  const grd=ctx.createLinearGradient(0,0,cv.width,cv.height);
  grd.addColorStop(0,"rgba(0,0,0,0)"); grd.addColorStop(1,c[1]+"22");
  ctx.fillStyle=grd; ctx.fillRect(0,0,cv.width,cv.height);
}
window.addEventListener("resize",sizeBg);

/* ================================================================
   启动
   ================================================================ */
function render(){
  // v30.9 任何重渲染先关闭悬浮框：DOM 重建后旧悬浮框内容可能过期（如竞拍/购买后仍显示旧价/旧竞拍者）
  if(tipEl) tipEl.style.display="none";
  // 弹窗自愈：定根后残留灵根弹窗 / 引导完成后残留引导弹窗 → 自动关闭，避免遮挡点击
  if(S.root && $("rrOverlay").classList.contains("show")) $("rrOverlay").classList.remove("show");
  if((S.tut==="done"||S.tut==="skip") && $("tutOverlay").classList.contains("show")) $("tutOverlay").classList.remove("show");
  renderStats();
  renderLog();
  if(activeTab!=="cult") renderTab();
}
load();
applyTheme(S.settings.theme||"dark");
renderLog();
if(!S.root){ if(S.tut==="done"||S.tut==="skip") openReroll(); else openTutAsk(); }
sizeBg();
updateBadges();
render();
resumeExploreIfAny(); // v31.16：刷新后恢复未结束的探索，避免"探索中"永久锁死运功
setInterval(autoLoop,1000);
setInterval(()=>{ if(S.root && S.realm>=1 && Date.now()>=evt.nextAt) triggerEvent(); },60000);
// 中列已改为按需刷新（点击/采集产出/坊市刷新），移除高频自动重建以避免按钮闪烁与单击丢失
window.addEventListener("beforeunload",()=>save());
document.addEventListener("visibilitychange",()=>{ if(document.hidden) save(); });
