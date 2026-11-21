/* ================================================================
   灵根加成
   ================================================================ */
function rootSpeed(){ return S.root ? S.root.speed : 1; }
function rootReqMult(){ return S.root ? S.root.reqMult : 1; }
function rootBreakCap(){ return S.root ? (S.root.type==='mut'? 0.35 : S.root.elems.length*0.10) : 1; }
function rootCritBonus(){ return S.root && S.root.extra && S.root.extra.crit ? S.root.extra.crit : 0; }
function rootOfflineBonus(){ return S.root && S.root.extra && S.root.extra.offline ? S.root.extra.offline : 0; }
function rootProdBonus(){ return S.root && S.root.extra && S.root.extra.prod ? S.root.extra.prod : 0; }
function rootDaoBonus(){ return S.root && S.root.extra && S.root.extra.dao ? S.root.extra.dao : 0; }
function rootCombatBonus(){ return S.root ? S.root.combat : 0; }

/* ================================================================
   产出 / 突破 / 运功
   ================================================================ */
function prodUpMult(){ return 1 + UPS[1].fx(S.ups.prod); }
function gongMul(){ const g=GONGFAS.find(x=>x.id===S.activeGong); return g?g.ess:1; }
function actGong(id){
  const g=GONGFAS.find(x=>x.id===id); if(!g) return;
  if(!S.gongs.includes(id)){ banner("尚未研习「"+g.name+"」"); return; }
  if(S.activeGong===id){ banner("「"+g.name+"」已是当前激活功法"); return; }
  S.activeGong=id;
  logEvent("激活功法「"+g.name+"」，灵气产出倍率 ×"+gongMul(),'sys');
  sound(620,.12); save(); render();
}
function studyGong(id){
  const g=GONGFAS.find(x=>x.id===id); if(!g) return;
  if(S.gongs.includes(id)){ banner("已研习「"+g.name+"」"); return; }
  if((S.tres[id]||0)<1){ banner("须弥空间中没有「"+g.name+"」，可前往坊市购买"); return; }
  S.tres[id]--; S.gongs.push(id);
  logEvent("研习功法「"+g.name+"」，灵气产出倍率提升至 ×"+gongMul(),'sys');
  sound(620,.12); save(); render();
}
function daoMult(){ return 1 + S.dao*0.05 + rootDaoBonus() + S.daoTotal*S.shenDaoProd; }
function facEssSec(){
  let sum=0;
  FAC.forEach((f,i)=>{ if(S.fa[i]>=1) sum += f.out*Math.pow(f.outM,S.fa[i]-1)*(1+rootProdBonus()); });
  return sum;
}
function facEssOne(i){ const g=FAC[i]; return S.fa[i]>=1? g.out*Math.pow(g.outM,S.fa[i]-1)*(1+rootProdBonus()):0; }
function facEssNext(i){ const g=FAC[i]; return g.out*Math.pow(g.outM,S.fa[i])*(1+rootProdBonus()); }
function essencePerSec(){
  let m = 0;
  if(S.root) m = CFG.huangBase * rootSpeed() * realm().mult * prodUpMult() * daoMult() * gongMul();
  m += facEssSec();
  m += buffEffSum("ess_flat");
  if(m>0) m *= (1 + buffEffSum("ess_pct")/100 + eqSum("ess")/100 + petSum("ess")/100 + petSum("cult")/100); // v31 修炼型灵兽：修炼速度加成并入灵气产出
  return m;
}
function yunEffMult(){ return 1 + UPS[0].fx(S.ups.click); }
function yunOutPerSec(){ return S.yunning ? essencePerSec()*yunEffMult()*(S.critBoost?3:1) : 0; }
function prodPerSec(){ return yunOutPerSec(); }
function critChance(){ return Math.min(0.50, UPS[2].fx(S.ups.crit) + buffEffSum("crit")/100) + rootCritBonus() + eqSum("crit")/100 + petSum("crit")/100; }
function realmNeed(){
  const n = Math.min(S.realm+1, REALMS.length-1);
  return REALMS[n].req * rootReqMult();
}
function breakChance(){
  let base = rootBreakCap() + UPS[3].fx(S.ups.break) + buffEffSum("brk"); // 灵根×10% + 突破升级 + 丹药buff，上限80%
  base += eqSum("brk") + petSum("brk");
  if(evt.breakBoost>Date.now()) base += (evt.breakBoostAmt||0.30); // 顿悟+10% / 大道共鸣+30%
  if(evt.breakPenalty>Date.now()) base -= 0.20; // v30.8.7 心猿意马：突破成功率-20%
  return Math.min(0.80, base);
}
function offlineEfficiency(){ return 0.5 + UPS[4].fx(S.ups.offline) + rootOfflineBonus() + petSkillSum("offline")/100; }

