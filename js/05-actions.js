/* ================================================================
   交互动作
   ================================================================ */
function startYun(){
  if(S.yunning) return;
  if(S.exp){ banner("探索中不可运功，请先结束探索"); return; }
  if(S.cycle){ S.cycle=null; logEvent("运功前已停止循环制造"); }
  if(S.making){ banner("炼制中不可运功，请等待完成"); return; }
  S.collect={}; // 互斥：运功时停止采集挂机
  S.yunning=true; S.clicks++;
  const crit=Math.random()<critChance();
  S.critBoost=!!crit;
  logEvent("开始运功"+(crit?"（会心爆发·产出×3）":""), crit?'sys':'');
  banner(crit?"⚡ 会心爆发！运功灵气产出×3":"开始运功，灵气源源而入");
  sound(crit?640:520,.15);
  render();
}
function stopYun(){
  if(!S.yunning) return;
  S.yunning=false; S.critBoost=false;
  logEvent("停止运功，灵气产出暂停");
  banner("已停止运功，灵气产出暂停");
  blip();
  render();
}
/* ============ 境界审计（v32.4）：记录每一次境界变化，便于定位"重新登录后境界跳变" ============ */
function pushRealmLog(from,to,why){
  S.realmLog=S.realmLog||[];
  S.realmLog.push({t:Date.now(),from:from,to:to,why:why});
  if(S.realmLog.length>30) S.realmLog.splice(0,S.realmLog.length-30);
}
function realmDiagText(){
  const rows=(S.realmLog||[]).slice(-12).map(x=>{
    const d=new Date(x.t);
    const p=n=>("0"+n).slice(-2);
    const nm=i=>(REALMS[i]||{}).full||String(i);
    return p(d.getHours())+":"+p(d.getMinutes())+":"+p(d.getSeconds())+"  "+nm(x.from)+" → "+nm(x.to)+"（"+x.why+"）";
  }).join("\n")||"（无记录）";
  return "当前境界："+realm().full+"（S.realm="+S.realm+"）\n最后保存："+(S.lastSaved?new Date(S.lastSaved).toLocaleString():"—")+"\n版本："+VERSION+"\n\n"+rows;
}
/* 突破防连点：700ms 内的重复触发视为同一次点击 */
const BREAK_LOCK_MS=700;
function doBreak(){
  const need=realmNeed();
  if(S.essence<need) return;
  const nowT=Date.now();
  if(nowT-(S._brkAt||0)<BREAK_LOCK_MS) return;   // 防连点/防按键重复触发
  S._brkAt=nowT;
  if(Math.random()<breakChance()){
    const _from=S.realm;
    S.essence-=need; S.realm++;
    S.peakRealm=Math.max(S.peakRealm||0,S.realm);   /* 记录历史最高境界（飞升不回落） */
    pushRealmLog(_from,S.realm,"突破成功");
    S.hpMax=hpMaxFor(S.realm); S.hp=S.hpMax;
    sfxLevelUp(); banner("突破成功！晋入「"+realm().full+"」");
    logEvent("突破成功，晋入「"+realm().full+"」",'sys');
  }else{
    const loss=need*CFG.breakFailLoss; S.essence=Math.max(0,S.essence-loss);
    sfxFail(); banner("突破失败，损失 "+fmt(loss)+" 灵力");
    logEvent("突破失败，损失 "+fmt(loss)+" 灵力",'n');
  }
  checkAchievements(); render(); save();
}
function buyFac(i){
  const g=FAC[i]; if(!g || S.realm<g.unlock) return;
  const p=floorPriceL(facCostL(i));
  if(payL(p)){ S.fa[i]++; blip(); logEvent("强化「"+g.name+"」至 Lv"+S.fa[i]+"（-"+priceLText(p)+"）",'','up'); }
}
function buyUp(id){
  const u=UPS.find(x=>x.id===id); if(!u || S.realm<(u.unlock||0)) return;
  const p=floorPriceL(upCostL(id));
  if(payL(p)){ S.ups[id]++; blip(); logEvent("强化「"+u.name+"」至 lv"+S.ups[id],'','up'); }
}
function doExch(e,mult){
  mult=mult||1;
  const isUp = e.fa>1; // 低→高：支付方加收1%；高→低：所得扣减1%
  const cost = (isUp ? Math.ceil(e.fa*1.01) : e.fa)*mult;
  const gain = (isUp ? e.ta : Math.floor(e.ta*0.99))*mult;
  if((S[e.from]||0)<cost){ banner("灵石不足 "+cost+"，无法兑换「"+e.n+"」。"); return; }
  S[e.from]-=cost; S[e.to]+=gain;
  logEvent("兑换 "+e.n+"（手续费1%）"+(mult>1?"×"+mult+"：":"：")+"-"+cost+" → +"+gain,'','trade');
  banner("兑换成功：「"+e.n+"」×"+gain+"（手续费1%）");
}
const ZONES={
  外:{nm:"外围区域",lo:1,hi:4,unlock:0},
  中:{nm:"中部区域",lo:1,hi:6,unlock:3},
  内:{nm:"核心区域",lo:1,hi:8,unlock:6},
};
// v27 采集重做：三项采集所有区域共用统一稀有度概率表（稀1-8），区域仅限制最高可采集稀有度
const RARITY_POOL_PROB=[40,25,15,8,5,3,2,2]; // 稀1-8 绝对概率（%）：区域只截断超上限档位，不做归一化；每件材料独立按档位概率结算
function zoneOf(cid){ return ZONES[(S.collectZone&&S.collectZone[cid])||"外"]||ZONES.外; }
function setZone(cid,z){
  if(!zoneUnlocked(z)){ banner(ZONES[z].nm+"需"+REALMS[ZONES[z].unlock].full+"境界解锁"); return; }
  S.collectZone=S.collectZone||{beast:"外",ore:"外",herb:"外"};
  S.collectZone[cid]=z;
  logEvent("采集区域切换至"+ZONES[z].nm+"（"+ (cid==="beast"?"狩猎":cid==="ore"?"挖矿":"采药") +"）",'sys');
  save();
}
/* ================= 采集抽取（v32.6） =================
   ① 区域只做「上限截断」，不做归一化：超出区域上限的档位不参与，其余档位按基础表绝对概率结算；
   ② 单灵根元素亲和：对应采集类区域上限 +1（封顶 8）；
   ③ 每次采集先掷 50% 成功率，失败本次无产出；
   ④ 成功后每件材料各自按所属稀有度档位概率独立结算（不按档内件数平摊）；
   ⑤ 每次只产出 1 件：多件同时命中时，在命中者中随机取一件（蓄水池抽样，单次遍历、无临时数组）。
*/
const COLLECT_CAT={beast:"妖兽材料",ore:"矿石",herb:"草药"};
/* 区域上限（含单灵根元素亲和 +1，封顶 8） */
function collectHi(cid, zn){
  let hi=zn.hi;
  if(S.root && S.root.type==="single"){
    const el=(S.root.elems||[])[0];
    const aff=(cid==="ore"  && (el==="金"||el==="土"))
            ||(cid==="herb" && el==="木")
            ||(cid==="beast"&& (el==="水"||el==="火"));
    if(aff) hi=Math.min(zn.hi+1, 8);
  }
  return hi;
}
/* 某采集类在某区域的可产出材料（抽取与界面"可出"列表共用，避免两处口径漂移） */
function collectPool(cid, z){
  const cat=COLLECT_CAT[cid]||"草药";
  const zn=(z && ZONES[z]) ? ZONES[z] : (zoneOf(cid)||ZONES.外);
  const hi=collectHi(cid, zn);
  return {cat, zn, hi, items:MATS.filter(m=>m.cat===cat && (m.rarity||1)>=zn.lo && (m.rarity||1)<=hi)};
}
/* 单次采集结算：返回 [] 或 [1 件材料] */
function rollCollect(cid, z){
  if(Math.random()>=0.5) return [];                 // ③ 50% 成功率
  const items=collectPool(cid, z).items;
  let pick=null, seen=0;
  for(const m of items){
    const p=(RARITY_POOL_PROB[Math.min(Math.max((m.rarity||1)-1,0),7)]||0)/100;
    if(p<=0 || Math.random()>=p) continue;          // ④ 每件独立掷骰
    seen++;                                          // ⑤ 蓄水池抽样：第 k 件命中以 1/k 概率替换
    if(Math.random()<1/seen) pick=m;
  }
  return pick?[pick]:[];
}
/* 兼容旧调用：只取第一件（新逻辑请用 rollCollect） */
function randMatOfCat(cid, z){ const a=rollCollect(cid,z); return a.length?a[0]:null; }
const SV_EFF={甲:0.9,乙:0.75,丙:0.6,丁:0.4}; // 傀儡效率 = 玩家效率（100%）的比例
const SV_AV={甲:"💎",乙:"⚙️",丙:"🗿",丁:"🪵"}; // 傀儡头像：玉傀 / 铁傀 / 石傀 / 木傀
const LV_NM={甲:"玉",乙:"铁",丙:"石",丁:"木"}; // 傀儡等级显示名
/* 傀儡上限：随境界分批开放，合体期释放完毕 5 台 */
const PU_CAP_STEPS=[{realm:0,cap:1},{realm:2,cap:2},{realm:3,cap:3},{realm:4,cap:4},{realm:6,cap:5}];
/* v33.2：飞升保留——傀儡槽位上限与采集区域按「历史最高境界」判定，飞升不回落 */
function effRealm(){ return Math.max(S.realm||0, S.peakRealm||0); }
function zoneUnlocked(z){ const n=ZONES[z]; return !!n && effRealm()>=n.unlock; }
function puCap(){ let c=1; PU_CAP_STEPS.forEach(s=>{ if(effRealm()>=s.realm) c=s.cap; }); return c; }
function puNext(){ const n=PU_CAP_STEPS.find(s=>s.realm>effRealm()); return n?{realm:n.realm,cap:n.cap}:null; }
function puCapMsg(){ const n=puNext(); return "傀儡已达上限（"+S.servants.length+"/"+puCap()+"）"+(n?("，下一档「"+REALMS[n.realm].full+"」解锁至 "+n.cap+" 台"):"（已满额）"); }
/* 后三秘境底关 BOSS 掉落：石傀(丙) / 铁傀(乙) / 玉傀(甲)，各 1% */
const PU_DROP={yl:{lv:"丙",nm:"石傀"},sg:{lv:"乙",nm:"铁傀"},kj:{lv:"甲",nm:"玉傀"}};
function maybeDropPu(area){
  const d=PU_DROP[area]; if(!d) return false;
  if(Math.random()>=0.01) return false;
  const exp=S.exp;
  if(S.servants.length<puCap()){
    S.servants.push({lv:d.lv, task:null, prog:0, curR:null});
    logEvent("BOSS 遗落「"+d.nm+"」！已收入傀儡栏（"+S.servants.length+"/"+puCap()+"）",'sys');
    banner("获得 "+d.nm+"！");
    if(exp) exp.loot.push({kind:"pu",id:d.lv,name:d.nm,qty:1});
  } else {
    const comp={yl:50,sg:150,kj:400}[area]||50;   // 满额折算：中品灵石×comp
    logEvent("BOSS 遗落「"+d.nm+"」，但傀儡已满（"+S.servants.length+"/"+puCap()+"），折算中品灵石 ×"+comp,'warn');
    banner(d.nm+" 已满额，折算中品灵石 ×"+comp);
    if(exp) exp.loot.push({kind:"stone",tier:"M",qty:comp});
  }
  save(); return true;
}

const SV_VAL={甲:300000,乙:120000,丙:60000,丁:30000}; // 傀儡价值（下品）：出售自动换算高档灵石
function craftTime(r){ const v=r.value||1; if(v<200)return 10; if(v<1000)return 20; if(v<5000)return 40; if(v<20000)return 90; return 180; }
function collectByCat(cid){
  if(S.exp){ banner("探索中不可采集，请先结束探索"); return; }
  const got=rollCollect(cid);
  S.collectCd=Date.now()+15000; // 采集耗时 15 秒（玩家效率 100%）
  if(got.length){ got.forEach(m=>{ S.mats[m.id]=(S.mats[m.id]||0)+1; }); sound(520,.1);
    logEvent("采集到 "+got.map(m=>"「"+m.name+"」×1").join("、")+(got.length>1?"（共 "+got.length+" 件）":""),'','collect'); }
  else { sound(300,.08); logEvent("采集失败，一无所获",'dim'); }
  checkAchievements(); render();
}
function craftItem(r){
  if(!r || S.making) return;
  if(S.exp){ banner("探索中不可制造，请先结束探索"); return; }
  if(r.isPu && (S.servants.length+(S.tres[r.id]||0))>=puCap()){ banner(puCapMsg()); return; }
  for(const k in r.need){ if((S.mats[k]||0)<r.need[k]) return; }
  if(S.yunning){ banner("运功中不可制造，请先停止运功"); return; }
  if(Object.keys(S.collect).some(k=>S.collect[k]!==undefined)){ banner("采集挂机中不可制造，请先停止挂机采集"); return; }
  for(const k in r.need) S.mats[k]-=r.need[k];
  S.making={rId:r.id, end:Date.now()+(evt.craftBoost>Date.now()?craftTime(r)*0.5:craftTime(r))*1000}; // v30.8.7 炉火纯青：制造时间减半
  sound(560,.12); logEvent("开始炼制「"+r.name+"」，耗时 "+craftTime(r)+" 秒",'sys','craft');
  banner("开始炼制「"+r.name+"」（"+craftTime(r)+" 秒）");
  checkAchievements(); render();
}
function useTres(r){
  if(!r || (S.tres[r.id]||0)<1) return;
  if(r.isPu){
    if(S.servants.length>=puCap()){ banner(puCapMsg()); return; } // 上限随境界分批开放（合体 5 台）
    S.tres[r.id]--;
    S.servants.push({lv:r.puLv||"丁", task:null, prog:0, curR:null});
    const nm=LV_NM[r.puLv||"丁"]||"丁";
    logEvent("使用「"+r.name+"」，获得 1 名"+nm+"傀",'sys');
    banner("获得「"+r.name+"」"); sound(680,.15);
    checkAchievements(); save(); render();
    return;
  }
  if(!r.eff && !r.heal){ logEvent("「"+r.name+"」无可使用效果，可出售",'dim'); banner("「"+r.name+"」无可使用效果"); return; }
  S.tres[r.id]--;
  if(r.heal){ const h=Math.ceil(S.hpMax*r.heal/100); S.hp=Math.min(S.hpMax,S.hp+h); logEvent("服用「"+r.name+"」，恢复 "+h+" 气血","sys"); }
  const now=Date.now();
  if(!S.buffs[r.id]) S.buffs[r.id]={stack:0,until:0};
  const b=S.buffs[r.id];
  b.stack=Math.min(r.maxStack||1, b.stack+1);
  b.until=now + (r.durMin||1)*60000;
  S.buffWarned[r.id]=0; S.buffEnded[r.id]=0;
  logEvent("使用「"+r.name+"」："+effText(r)+(b.stack>1?"（叠层 "+b.stack+"/"+r.maxStack+"）":""));
  banner("使用「"+r.name+"」"); sound(680,.15);
  checkAchievements(); save(); render();
}/* 飞升碎片（v32.9 削弱）：指数 0.55 + 总量 ×0.5 —— 同进度约为旧版的 1/3~1/6 */
/* 飞升碎片（v32.10）：平方根 × 0.1 —— 化神首飞约 12 枚，神通需多次飞升攒够 */
function ascendShards(){ return Math.max(1, Math.floor(Math.pow((S.lifetime||0)/1e6, 0.5) * 0.1)); }
function ascend(){
  const fNeed=realmNeed()*2; // 飞升消耗 = 下一境界突破需求 × 灵根需求倍率 × 2
  if(S.realm<4){ banner("化神期方可开启飞升之门"); return; }
  if(S.essence<fNeed){ banner("飞升需 "+fmt(fNeed)+" 灵力"); return; }
  const dao=ascendShards();
  S.essence=0;
  S.dao+=dao; S.daoTotal+=dao; S.ascensions++;
  banner("飞升成功！获得 "+dao+" 大道碎片（傀儡上限与已解锁采集区域已保留）");
  logEvent("飞升成功，消耗 "+fmt(fNeed)+" 灵力，获得 "+dao+" 大道碎片",'sys');
  pushRealmLog(S.realm,0,"飞升");
  S.realm=0; S.lifetime=0; S.fa=FAC.map(()=>0);
  S.mats={}; S.tres={}; S.collect={};
  save(); render();
}
function buyShen(a){
  if(!a) return;
  if(S.dao<a.cost){ banner("大道碎片不足（需 "+a.cost+"）"); return; }
  if(S.shen.includes(a.id)){ banner("已习得此神通"); return; }
  S.dao-=a.cost; S.shen.push(a.id);
  logEvent("习得神通「"+a.name+"」（-"+a.cost+" 大道碎片）",'sys');
  banner("习得神通 "+a.name); blip(); save(); render();
}

/* 成就 */
function claimableTimes(a){
  if(a.multi){
    const v=(a.prog? a.prog(S):0);
    if(a.thr){ // v30.4 强化里程碑：thr 为起点阈值，超出末阈值后每 50 级再计一次
      const hit=a.thr.filter(t=>v>=t).length;
      const last=a.thr[a.thr.length-1];
      const extra=v>last?Math.floor((v-last)/50):0;
      return Math.min(hit+extra, a.max||999);
    }
    return Math.min(Math.floor(v/a.step), a.max||999);
  }
  return (a.cond(S) && !S.ach.includes(a.id))? 1 : 0;
}
function checkAchievements(){
  ACHS.forEach(a=>{
    const got=(S.achGot[a.id]||0) + (a.multi?0:(S.ach.includes(a.id)?1:0));
    if(got>=claimableTimes(a)) return;
    if(!S.achPending.includes(a.id)) S.achPending.push(a.id);
  });
  updateBadges();
}
function claimAch(a){
  const can=claimableTimes(a);
  const got=(S.achGot[a.id]||0) + (a.multi?0:(S.ach.includes(a.id)?1:0));
  if(got>=can) return;
  if(a.multi) S.achGot[a.id]=got+1; else S.ach.push(a.id);
  S.achPending=S.achPending.filter(x=>x!==a.id);
  // v30.4 奖励支持递增函数（第 g 次领取 rw(g)），发放后自动换算显示
  const rwVal = typeof a.rw==="function" ? a.rw(got+1) : (a.rw||0);
  if(rwVal>0){ addL(splitPriceL(rwVal)); const tx=priceLText(splitPriceL(rwVal)); logEvent("领取成就「"+a.nm+"」奖励 "+tx+"（"+fmt(rwVal)+" 下品）",'sys'); banner("领取成就："+a.nm+" +"+tx); }
  else { logEvent("达成成就「"+a.nm+"」",'sys'); banner("成就达成："+a.nm); }
  sound(620,.15); updateBadges(); save(); render();
}
function triggerEvent(){
  const e=EVENTS[Math.floor(Math.random()*EVENTS.length)];
  evt.nextAt=Date.now()+180000+Math.random()*420000;
  e.fx(); banner((e.good?"✨ ":"🌑 ")+e.nm+"："+e.txt);
  logEvent((e.good?"吉兆 ":"危机 ")+e.nm+"："+e.txt,e.good?'sys':'n');
  sound(e.good?560:200,.3);
}

