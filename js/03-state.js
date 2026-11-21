/* ================================================================
   状态 / 存档
   ================================================================ */
let suppressSave=false;
let S=null;
function newState(){
  return {
    version:VERSION, root:null, freeRolls:CFG.freeRerolls, paidRolls:0,
    realm:0, peakRealm:0, essence:0, lifetime:0, clicks:0, dao:0, daoTotal:0, hp:100, hpMax:100,
    stoneL:0, stoneM:0, stoneH:0, stoneT:0, stoneG:0,
    fa:FAC.map(()=>0), ups:Object.fromEntries(UPS.map(u=>[u.id,0])),
    mats:{}, tres:{}, collect:{}, collectZone:{beast:"外",ore:"外",herb:"外"}, equip:[], equipped:{}, uid:0, servants:[{lv:"丁",task:null,prog:0,curR:null}], pets:[], eggs:[], hatch:[null], hatchSlots:1, petEss:0, petActive:[], petDex:{}, petGuide:false, petV31:false, gongs:["yj"], activeGong:"yj", slots:null,
    shen:[], shenProd:0, shenBreak:0, shenCrit:0, shenOffline:0, shenDaoProd:0,
    ach:[], achGot:{}, achPending:[], log:[], ascensions:0, yunning:false, critBoost:false, buffs:{}, buffWarned:{}, buffEnded:{}, cycle:null, shop:{list:[],until:0}, lastSaved:Date.now(), avatar:null, avatarUses:0,
    settings:{theme:"dark",lang:"zh"},
  };
}
function normalizeState(){
  S.fa=(S.fa||FAC.map(()=>0)); while(S.fa.length<FAC.length)S.fa.push(0);
  S.achGot=S.achGot||{}; S.achPending=S.achPending||[]; S.buffWarned=S.buffWarned||{}; S.buffEnded=S.buffEnded||{};
  S.mats=S.mats||{}; S.tres=S.tres||{}; S.collect=S.collect||{};
  S.equip=S.equip||[]; S.equipped=S.equipped||{}; S.uid=S.uid||0;
  if(!S.avatar || !LIHUI.some(x=>x.id===S.avatar)) S.avatar=null; // 旧档缺省：装备页按默认立绘显示
  S.avatarUses=(S.avatarUses||0); // 装备页形象更换：免费 5 次，之后每次 50 上品灵石
  S.gongs=S.gongs||["yj"]; S.gongs=S.gongs.filter(id=>GONGFAS.some(g=>g.id===id));
  if(S.slots===undefined)S.slots=null; // 旧档缺省：战斗时按灵根池自动补齐技能槽
  if(!S.gongs.includes(S.activeGong)) S.activeGong=S.gongs[0]||null;
  if(S.equipped.t!=null){ const uid=S.equipped.t; delete S.equipped.t; if(uid!=null){ const it=(S.equip||[]).find(x=>x.uid===uid); const r=it?REC_BY_ID[it.id]:null; if(r&&r.slot) S.equipped[r.slot]=uid; } }
  for(const k in S.tres){ if(isEquip(k)&&(S.tres[k]||0)>0){ for(let i=0;i<S.tres[k];i++) S.equip.push({uid:++S.uid,id:k}); delete S.tres[k]; } }
  // v30.8 清理旧档废弃奇珍（TRES 库已清空，奇珍不再参与制造/出售/采集/购买/装备/战斗/修炼等任何活动）
  let clearedTres=0;
  for(const k in S.tres){
    if((S.tres[k]||0)>0 && !isEquip(k) && !GONGFAS.some(g=>g.id===k) && !CRAFT.some(c=>c.rec.some(r=>r.id===k))){ delete S.tres[k]; clearedTres++; }
  }
  if(clearedTres>0) logEvent("已清理 "+clearedTres+" 种废弃奇珍（奇珍体系已停用）",'warn');
  S.making=S.making||null; S.collectCd=S.collectCd||0; S.cycle=S.cycle||null; S.collectZone=S.collectZone||{beast:"外",ore:"外",herb:"外"};
  // v31.18：探索与运功/炼制/挂机采集互斥——读档时若探索未结束却残留运功/炼制状态，强制归一，避免"探索中仍在产灵气"
  if(S.exp && !S.exp.over){
    if(S.yunning){ S.yunning=false; S.critBoost=false; }
    if(S.making) S.making=null;
    S.collect={};
  }
  if(!S.servants || !S.servants.length) S.servants=[{lv:"丁",task:null,prog:0,curR:null}];
  S.servants.forEach(s=>{ s.lv=s.lv||"丁"; s.task=s.task||null; if(s.task&&s.task.kind==="cai"&&!s.task.zone)s.task.zone="外"; s.prog=s.prog||0; s.curR=s.curR||null; });
  if(!S.pets||!Array.isArray(S.pets)) S.pets=[];
  /* v31 灵兽系统：旧档「寻兽结缘」灵兽（带 lv 字段）折算为精魄（数量=稀有度），并初始化新字段 */
  if(S.petV31===undefined){
    const legacy=(S.pets||[]).filter(it=>it&&it.lv!==undefined);
    if(legacy.length){
      let ess=0;
      legacy.forEach(it=>{ const b=BEAS_BY_ID[it.id]; if(b) ess+=b.rarity; });
      S.petEss=(S.petEss||0)+ess;
      logEvent("旧档灵兽 "+legacy.length+" 只已折算为 "+ess+" 枚灵兽精魄（v31 灵兽系统上线）",'warn');
    }
    S.petV31=true;
  }
  S.pets=(S.pets||[]).filter(it=>it&&it.lv===undefined);
  S.eggs=S.eggs||[]; S.hatch=S.hatch||[null]; while(S.hatch.length<4) S.hatch.push(null);
  S.hatchSlots=Math.max(1,Math.min(4,S.hatchSlots||1));
  S.petEss=S.petEss||0; S.petActive=(S.petActive||[]).filter(u=>petByUid(u)); S.petDex=S.petDex||{}; S.petGuide=!!S.petGuide;
  /* v33：兽诀库存 / 锁灵符 / 洗练石 / 灵兽技能格与灵韵迁移 */
  S.books=Array.isArray(S.books)?S.books.filter(x=>x&&PET_SKILL_BY_ID[x.sid]):[];
  S.petItems=S.petItems||{lock:0,wash:0}; S.petItems.lock=S.petItems.lock||0; S.petItems.wash=S.petItems.wash||0;
  (S.pets||[]).forEach(it=>{ it.skills=Array.isArray(it.skills)?it.skills.filter(x=>x&&PET_SKILL_BY_ID[x.sid]):[];
    it.locks=Array.isArray(it.locks)?it.locks:[]; it.pity=Array.isArray(it.pity)?it.pity:[];
    if(it.apt==null){ const _b=NEW_BEAS_BY_ID[it.id]||{rarity:1}; it.apt=Math.max(20,Math.min(100,40+(_b.rarity||1)*4)); } });
  S.pets.forEach(it=>{ it.sat=it.sat===undefined?80:Math.max(0,Math.min(100,it.sat)); it.int=it.int===undefined?80:Math.max(0,Math.min(100,it.int)); it.lastFeedAt=it.lastFeedAt||Date.now(); });

  for(const k in S.collect){ if(!["beast","ore","herb"].includes(k)) delete S.collect[k]; }
  S.ups=S.ups||Object.fromEntries(UPS.map(u=>[u.id,0]));
  S.shen=S.shen||[]; S.ach=S.ach||[];
  S.skills=S.skills||[]; if(!S.skills.length&&S.root) S.skills=starterSkillsFor(S.root); // 灵根技能/身法：须坊市购书学习；老档按灵根赠入门法术
  S.settings=S.settings||{}; if(S.settings.theme===undefined)S.settings.theme="dark"; if(S.settings.lang===undefined)S.settings.lang="zh";
  if(!Array.isArray(S.log))S.log=[];
  if(S.crystal){ S.stoneL=(S.stoneL||0)+Math.floor(S.crystal/100); delete S.crystal; } S.stoneL=S.stoneL||0; S.stoneM=S.stoneM||0; S.stoneH=S.stoneH||0; S.stoneT=S.stoneT||0; S.stoneG=S.stoneG||0;
  if(S.freeRolls===undefined)S.freeRolls=CFG.freeRerolls;
  if(S.paidRolls===undefined)S.paidRolls=0;
  if(S.shenProd===undefined)S.shenProd=0;
  if(S.shenBreak===undefined)S.shenBreak=0;
  if(S.shenCrit===undefined)S.shenCrit=0;
  if(S.shenOffline===undefined)S.shenOffline=0;
  if(S.shenDaoProd===undefined)S.shenDaoProd=0;
  if(S.daoTotal===undefined)S.daoTotal=S.dao||0;
  if(S.yunning===undefined)S.yunning=false;
  if(S.critBoost===undefined)S.critBoost=false;
  if(!S.buffs||typeof S.buffs!=="object")S.buffs={};
  if(!S.shop||!S.shop.list)S.shop={list:[],until:0};
  if(!S.auction||!S.auction.list||!('live' in S.auction))S.auction={list:[],mode:'',start:0,end:0,live:false,npcLast:0,settled:false};
  if(!S.auctionNext)S.auctionNext=nextAuctionTime(Date.now());
  if(S.clicks===undefined)S.clicks=0; if(S.lifetime===undefined)S.lifetime=0;
  if(S.ascensions===undefined)S.ascensions=0;
  if(S.essence===undefined)S.essence=0;
  // v32.4 境界完整性校验：非整数 / 越界 / 脏数据一律校正并留痕
  const _rawRealm=S.realm;
  S.realm=Math.max(0,Math.min(REALMS.length-1,Math.floor(Number(S.realm)||0)));
  if(!Array.isArray(S.realmLog)) S.realmLog=[];
  if(_rawRealm!==S.realm) pushRealmLog(Number(_rawRealm)||0,S.realm,"校正脏值");
  /* v33.2：历史最高境界（飞升保留傀儡上限与采集区域用） */
  S.peakRealm=Math.max(0,Math.min(REALMS.length-1,Math.floor(Number(S.peakRealm)||0)));
  if(S.peakRealm<S.realm) S.peakRealm=S.realm;
  if((S.ascensions||0)>0) S.peakRealm=Math.max(S.peakRealm,4);   /* 已飞升者至少保留化神档解锁 */
  S.hpMax=hpMaxFor(S.realm); if(S.hp===undefined||S.hp>S.hpMax)S.hp=S.hpMax;
  if(S.exp===undefined)S.exp=null;
  if(S.exp&&S.exp.map&&!S.exp.pos)S.exp.pos={q:0,r:0};
  // 战斗中刷新中断恢复：已进入但未结算完成的战斗格（used 且无 finished），重置为未占用，避免永久空置
  if(S.exp&&S.exp.map&&S.exp.map.cells){
    for(const k in S.exp.map.cells){ const c=S.exp.map.cells[k]; if(c&&c.used&&["fight","down","boss"].includes(c.t)&&!c.finished){ c.used=false; } }
  }
}
function save(){
  if(suppressSave) return;
  S.lastSaved=Date.now();
  try{ localStorage.setItem(CFG.saveKey, JSON.stringify(S)); }catch(e){}
}
function load(){
  let d=null;
  try{ const raw=localStorage.getItem(CFG.saveKey); if(raw) d=JSON.parse(raw); }catch(e){}
  if(d && d.realm!==undefined){
    S=d; normalizeState();
    // v32.4：与审计记录比对——若读到的境界没有对应的突破/飞升记录，说明被外部改写（多开/手改/异常）
    { const _lg=(S.realmLog||[]); const _last=_lg[_lg.length-1];
      if(_last && _last.to!==S.realm){
        const _a=(REALMS[_last.to]||{}).full||_last.to, _b=(REALMS[S.realm]||{}).full||S.realm;
        pushRealmLog(_last.to,S.realm,"载入不一致");
        logEvent("存档境界与记录不符："+_a+" → "+_b+"（可能为多开覆盖或存档被改写）",'warn');
      } }
    const away=(Date.now()-S.lastSaved)/1000;
    let sec=0; // v30.9 修复：sec 提到 if 块外，否则块外 petTick(sec) 抛 ReferenceError 中断 load()，导致界面不初始化
    if(away>10 && S.root){
      const cap=CFG.offlineCapHours*3600;
      sec=Math.max(0,Math.min(away,cap));
      const eff=offlineEfficiency();
      // 灵气默认暂停：未运功不产灵气；离线仅补发挂机采集的材料
      for(const c in S.collect){
        if(S.collect[c]===undefined||!["beast","ore","herb"].includes(c)) continue;
        const totalSec=S.collect[c]+sec;
        const n=Math.floor(totalSec*eff/15);
        S.collect[c]=totalSec-n*15/eff;
        for(let i=0;i<n;i++){ rollCollect(c).forEach(m=>{ S.mats[m.id]=(S.mats[m.id]||0)+1; }); }
      }
      for(const sv of S.servants){
        if(!sv.task||sv.task.kind!=="cai") continue;
        const eff2=SV_EFF[sv.lv]||0.4, iv2=15/eff2;
        const n2=Math.floor(sec/iv2);
        for(let i=0;i<n2;i++){ rollCollect(sv.task.t, sv.task.zone).forEach(m=>{ S.mats[m.id]=(S.mats[m.id]||0)+1; }); }
        sv.prog=Math.max(0,sec-n2*iv2);
      }
      // v30.10：离线前在运功则离线期间继续结算灵力
      let essenceGain=0;
      if(S.yunning){ essenceGain=prodPerSec()*eff*sec; S.essence+=essenceGain; S.lifetime+=essenceGain; }
      if(away>10){
        const capped = away>cap;
        const head = S.yunning
          ? "离开期间继续运功修炼，获得灵力 +"+fmt(essenceGain)+"，并采得若干材料。\n"
          : "离开期间挂机采得若干材料。\n（灵气产出默认暂停，未运功不产灵气）\n";
        showModal("闭关归来", head+"离线时长 "+fmt(sec)+" 秒 · "+(S.yunning?"修炼":"采集")+"效率 "+Math.round(eff*100)+(capped?"%\n（离线收益上限 12 小时，超出部分不计）":"%"));
      }
    }
    if(S.pets&&S.pets.length) petTick(sec);
    S.lastSaved=Date.now();
    save(); // v30.9：离线结算后立即写回，避免下次 away 仍从旧值计算
    return;
  }
  S=newState();
  save();
}

/* ================================================================
   货币
   ================================================================ */
/* 下品灵石计价：价格满 100 自动进位成「高品+低品」混合显示；支付优先按各品精确组合（无手续费），组合不足时 v29 起自动以高品折低品补足（1% 手续费），低换高不自动 */
function facCostL(i){ const g=FAC[i]; return Math.ceil(g.cost*Math.pow(g.costM,S.fa[i])); }
function upCostL(id){ const u=UPS.find(x=>x.id===id); return Math.ceil(u.cost*Math.pow(u.costM,S.ups[id])); }
function rerollCostL(){ return Math.ceil(CFG.rerollBaseCost*Math.pow(CFG.rerollCostM,S.paidRolls)); }
function splitPriceL(n){ // 下品灵石 n 进位分解：1 神品=1e8下品、1 极品=1e6下品、1上品=1e4下品、1中品=100下品
  return { g:Math.floor(n/1e8), t:Math.floor((n%1e8)/1e6), h:Math.floor((n%1e6)/1e4), m:Math.floor((n%1e4)/100), l:n%100 };
}
function floorPriceL(n){ // 强化价只保留最高面值，低位向下取整（如 2中品63下品 → 2中品）
  const g=Math.floor(n/1e8); if(g>0) return {g:g,t:0,h:0,m:0,l:0};
  const t=Math.floor(n/1e6); if(t>0) return {g:0,t:t,h:0,m:0,l:0};
  const h=Math.floor(n/1e4); if(h>0) return {g:0,t:0,h:h,m:0,l:0};
  const m=Math.floor(n/100); if(m>0) return {g:0,t:0,h:0,m:m,l:0};
  return {g:0,t:0,h:0,m:0,l:Math.floor(n)};
}
function priceLText(p){ const parts=[]; if(p.g)parts.push(fmt(p.g)+" 神品灵石"); if(p.t)parts.push(fmt(p.t)+" 极品灵石"); if(p.h)parts.push(fmt(p.h)+" 上品灵石"); if(p.m)parts.push(fmt(p.m)+" 中品灵石"); if(p.l)parts.push(fmt(p.l)+" 下品灵石"); return parts.length?parts.join("+"):"0 下品灵石"; }
function ceilPriceText(n){ n=Math.max(0,Math.ceil(n)); if(n>=1e8) return fmt(Math.ceil(n/1e8))+" 神品灵石"; if(n>=1e6) return fmt(Math.ceil(n/1e6))+" 极品灵石"; if(n>=1e4) return fmt(Math.ceil(n/1e4))+" 上品灵石"; if(n>=100) return fmt(Math.ceil(n/100))+" 中品灵石"; return fmt(n)+" 下品灵石"; }
function canPayL(p){ return S.stoneG>=p.g && S.stoneT>=p.t && S.stoneH>=p.h && S.stoneM>=p.m && S.stoneL>=p.l; }
function payL(p){ if(!canPayL(p)) return false; S.stoneG-=p.g; S.stoneT-=p.t; S.stoneH-=p.h; S.stoneM-=p.m; S.stoneL-=p.l; return true; }
/* v29 购买自动折算：低品灵石不足时自动用更高品折算补足（高→低折 1% 手续费，与「灵石兑换」一致）；低→高不自动，需手动经「灵石兑换」凑齐高品 */
function canPayAutoL(n){ // 总价值：各品按 99% 折算为下品后是否足够（精确组合由 canPayL 先行判定、无需手续费）
  return S.stoneL + Math.floor(S.stoneM*99) + Math.floor(S.stoneH*9900) + Math.floor(S.stoneT*990000) + Math.floor(S.stoneG*99000000) >= n;
}
function upNormL(){ // v31.18 无损升品归整：100 下→1 中、100 中→1 上、100 上→1 极、100 极→1 神
  const l=S.stoneL||0; S.stoneM=(S.stoneM||0)+Math.floor(l/100); S.stoneL=l%100;
  const m=S.stoneM; S.stoneH=(S.stoneH||0)+Math.floor(m/100); S.stoneM=m%100;
  const h=S.stoneH; S.stoneT=(S.stoneT||0)+Math.floor(h/100); S.stoneH=h%100;
  const t=S.stoneT; S.stoneG=(S.stoneG||0)+Math.floor(t/100); S.stoneT=t%100;
}
function payAutoL(n){ // 自动高换低支付 n 下品：低品不足时从低到高逐级折算高品（每品折得 = 面值×99%）
  if(S.stoneL>=n){ S.stoneL-=n; return true; }
  if(!canPayAutoL(n)) return false;
  const bk={G:S.stoneG,T:S.stoneT,H:S.stoneH,M:S.stoneM,L:S.stoneL};
  let rem=n-S.stoneL; // 需高品折算补足的缺口
  S.stoneL=0; // v31.18 原有低品全部计入本次支付，折算找零单独归整
  let change=0;
  const rates=[["M",100],["H",1e4],["T",1e6],["G",1e8]]; // 中→上→极→神，逐级向上取，最小消耗高品
  for(let i=0;i<rates.length;i++){
    if(rem<=0) break;
    const k=rates[i][0], v=rates[i][1];
    if(S["stone"+k]<=0) continue;
    const per=Math.floor(v*0.99); // 每品折得下品（1% 手续费）
    const take=Math.min(Math.ceil(rem/per), S["stone"+k]);
    S["stone"+k]-=take;
    const got=take*per, used=Math.min(rem,got);
    rem-=used; change+=got-used; // 本次折算中未用完的部分作为找零
  }
  if(rem>0){ S.stoneG=bk.G; S.stoneT=bk.T; S.stoneH=bk.H; S.stoneM=bk.M; S.stoneL=bk.L; return false; }
  S.stoneL+=change;
  upNormL(); // v31.18 找零无损升品，避免整块高品折算后余量全堆在下品
  return true;
}
function addL(p){ S.stoneG+=p.g; S.stoneT+=p.t; S.stoneH+=p.h; S.stoneM+=p.m; S.stoneL+=p.l; }

