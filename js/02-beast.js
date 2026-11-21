/* ================================================================
   灵兽系统 v31：探索出蛋 → 蛋仓 → 孵化槽 → 温养 → 兽栏养成
   设计依据：《灵兽系统设计》v0.1（探索出蛋 / 10 蛋 / 30 灵兽 / 温养
   / 饱食亲密叛变 / 炼化精魄 / 货币体系：1 上品=100 中品=10000 下品）
   ================================================================ */
const NEW_BEAS=[
  /* 蛋1 木灵蛋（草药 · 修炼） */
  {id:"mulingt", name:"木灵兔", ic:"🐰", rarity:1, band:"凡", egg:"eg1", type:"修", attr:1, traits:{}},
  {id:"qingtengy", name:"青藤猿", ic:"🐵", rarity:5, band:"灵", egg:"eg1", type:"修", attr:5, traits:{}},
  {id:"jianmusl", name:"建木神鹿", ic:"🦒", rarity:9, band:"圣", egg:"eg1", type:"修", attr:9, traits:{ess:3}},
  /* 蛋2 土灵蛋（矿石 · 修炼） */
  {id:"yanjiaxg", name:"岩甲玄龟", ic:"🐢", rarity:2, band:"凡", egg:"eg2", type:"修", attr:2, traits:{}},
  {id:"dimaikn", name:"地脉夔牛", ic:"🐃", rarity:6, band:"灵", egg:"eg2", type:"修", attr:6, traits:{}},
  {id:"houtuoql", name:"后土麒麟", ic:"🦄", rarity:10, band:"圣", egg:"eg2", type:"修", attr:10, traits:{dmgR:3,ess:3}},
  /* 蛋3 水灵蛋（草药 · 修炼） */
  {id:"yululil", name:"玉露灵鲤", ic:"🐟", rarity:1, band:"凡", egg:"eg3", type:"修", attr:1, traits:{}},
  {id:"biboxs", name:"碧波玄蛇", ic:"🐍", rarity:5, band:"灵", egg:"eg3", type:"修", attr:5, traits:{}},
  {id:"beimilk", name:"北冥灵鲲", ic:"🐳", rarity:9, band:"圣", egg:"eg3", type:"修", attr:9, traits:{crit:3}},
  /* 蛋4 火灵蛋（妖兽 · 攻击） */
  {id:"chiyanlm", name:"赤焰灵猫", ic:"🐱", rarity:2, band:"凡", egg:"eg4", type:"攻", attr:4, traits:{}},
  {id:"yanlinhp", name:"炎鳞火蟒", ic:"🔥", rarity:6, band:"灵", egg:"eg4", type:"攻", attr:12, traits:{}},
  {id:"chiyanzq", name:"赤炎朱雀", ic:"🦩", rarity:9, band:"圣", egg:"eg4", type:"攻", attr:18, traits:{crit:3}},
  /* 蛋5 金灵蛋（矿石 · 攻击） */
  {id:"jinjiax", name:"金甲玄犀", ic:"🦏", rarity:3, band:"凡", egg:"eg5", type:"攻", attr:6, traits:{}},
  {id:"xuanjinjh", name:"玄金剑虎", ic:"🐯", rarity:7, band:"灵", egg:"eg5", type:"攻", attr:14, traits:{}},
  {id:"baihusb", name:"白虎圣兽", ic:"🐅", rarity:10, band:"圣", egg:"eg5", type:"攻", attr:20, traits:{dmgR:3,brk:3}},
  /* 蛋6 风灵蛋（妖兽 · 攻击） */
  {id:"jifenglq", name:"疾风灵雀", ic:"🐦", rarity:3, band:"凡", egg:"eg6", type:"攻", attr:6, traits:{}},
  {id:"zhuifengtl", name:"追风天狼", ic:"🐺", rarity:7, band:"灵", egg:"eg6", type:"攻", attr:14, traits:{}},
  {id:"jinchidp", name:"金翅大鹏", ic:"🦅", rarity:9, band:"圣", egg:"eg6", type:"攻", attr:18, traits:{crit:3}},
  /* 蛋7 冰灵蛋（草药 · 修炼） */
  {id:"shuangjxs", name:"霜晶雪貂", ic:"🐾", rarity:4, band:"凡", egg:"eg7", type:"修", attr:4, traits:{}},
  {id:"hanyuanbp", name:"寒渊冰蟒", ic:"❄️", rarity:7, band:"灵", egg:"eg7", type:"修", attr:7, traits:{}},
  {id:"xuanbingth", name:"玄冰天凰", ic:"🦢", rarity:10, band:"圣", egg:"eg7", type:"修", attr:10, traits:{crit:3,brk:3}},
  /* 蛋8 雷灵蛋（妖兽 · 攻击） */
  {id:"leiwenzd", name:"雷纹紫貂", ic:"🐁", rarity:4, band:"凡", egg:"eg8", type:"攻", attr:8, traits:{}},
  {id:"zidianlb", name:"紫电雷豹", ic:"🐆", rarity:8, band:"灵", egg:"eg8", type:"攻", attr:16, traits:{}},
  {id:"tianleiql", name:"天雷麒麟", ic:"🐉", rarity:10, band:"圣", egg:"eg8", type:"攻", attr:20, traits:{crit:3,brk:3}},
  /* 蛋9 毒灵蛋（妖兽 · 攻击） */
  {id:"biduch", name:"碧毒蟾", ic:"🐸", rarity:3, band:"凡", egg:"eg9", type:"攻", attr:6, traits:{}},
  {id:"jiuyoump", name:"九幽毒蟒", ic:"☠️", rarity:8, band:"灵", egg:"eg9", type:"攻", attr:16, traits:{}},
  {id:"wanguwdm", name:"万蛊毒母", ic:"🕷️", rarity:9, band:"圣", egg:"eg9", type:"攻", attr:18, traits:{dmgR:3}},
  /* 蛋10 阴阳蛋（草药 · 修炼+战力双属性） */
  {id:"shuangwlm", name:"双尾灵猫", ic:"🐈", rarity:4, band:"凡", egg:"eg10", type:"修", attr:4, traits:{}},
  {id:"taijixg", name:"太极玄龟", ic:"🐚", rarity:8, band:"灵", egg:"eg10", type:"修", attr:8, traits:{}},
  {id:"hundunys", name:"混沌阴阳兽", ic:"☯️", rarity:10, band:"圣", egg:"eg10", type:"修", attr:10, extra:{atk:10}, traits:{dmgR:3,crit:3}},
];
const NEW_BEAS_BY_ID={}; NEW_BEAS.forEach(x=>NEW_BEAS_BY_ID[x.id]=x);
/* 10 种蛋：概率为 基础→满温养；圣品随蛋稀有度单调递减（基础 15%→5%、满温养 25%→10%），三档合计恒 100% */
const EGGS=[
  {id:"eg1",  name:"木灵蛋",   ic:"🌱", rarity:1,  pref:"草药",     hatchSec:7200,  probs:{fan:[60,35],ling:[25,40],sheng:[15,25]}, pool:["mulingt","qingtengy","jianmusl"]},
  {id:"eg2",  name:"土灵蛋",   ic:"🗿", rarity:2,  pref:"矿石",     hatchSec:7200,  probs:{fan:[57,34],ling:[29,43],sheng:[14,23]}, pool:["yanjiaxg","dimaikn","houtuoql"]},
  {id:"eg3",  name:"水灵蛋",   ic:"💧", rarity:3,  pref:"草药",     hatchSec:10800, probs:{fan:[55,33],ling:[32,46],sheng:[13,21]}, pool:["yululil","biboxs","beimilk"]},
  {id:"eg4",  name:"火灵蛋",   ic:"🔥", rarity:4,  pref:"妖兽材料", hatchSec:14400, probs:{fan:[53,32],ling:[36,49],sheng:[11,19]}, pool:["chiyanlm","yanlinhp","chiyanzq"]},
  {id:"eg5",  name:"金灵蛋",   ic:"⚔️", rarity:5,  pref:"矿石",     hatchSec:21600, probs:{fan:[51,31],ling:[39,52],sheng:[10,17]}, pool:["jinjiax","xuanjinjh","baihusb"]},
  {id:"eg6",  name:"风灵蛋",   ic:"🌪️", rarity:6,  pref:"妖兽材料", hatchSec:28800, probs:{fan:[49,30],ling:[42,55],sheng:[9,15]},  pool:["jifenglq","zhuifengtl","jinchidp"]},
  {id:"eg7",  name:"冰灵蛋",   ic:"❄️", rarity:7,  pref:"草药",     hatchSec:43200, probs:{fan:[47,29],ling:[45,58],sheng:[8,13]},  pool:["shuangjxs","hanyuanbp","xuanbingth"]},
  {id:"eg8",  name:"雷灵蛋",   ic:"⚡", rarity:8,  pref:"妖兽材料", hatchSec:57600, probs:{fan:[45,28],ling:[48,60],sheng:[7,12]},  pool:["leiwenzd","zidianlb","tianleiql"]},
  {id:"eg9",  name:"毒灵蛋",   ic:"☠️", rarity:9,  pref:"妖兽材料", hatchSec:72000, probs:{fan:[42,27],ling:[52,62],sheng:[6,11]},  pool:["biduch","jiuyoump","wanguwdm"]},
  {id:"eg10", name:"阴阳蛋",   ic:"☯️", rarity:10, pref:"草药",     hatchSec:86400, probs:{fan:[40,27],ling:[55,63],sheng:[5,10]},  pool:["shuangwlm","taijixg","hundunys"]},
];
const EGG_BY_ID={}; EGGS.forEach(x=>EGG_BY_ID[x.id]=x);
/* ================= 灵兽兽诀系统（v33 · 三期实装） ================= */
const PS_TIER={凡:{rarity:2,value:8000,color:"#9aa7b0"},灵:{rarity:3,value:35000,color:"#45d0a0"},玄:{rarity:5,value:150000,color:"#e0b95e"},天:{rarity:8,value:600000,color:"#cf7bff"}};
const PET_SKILLS=[
  {id:"tuna",   name:"吐纳诀", tier:"凡", kind:"ess",    val:2,  ds:"出战灵兽灵气产出 +2%"},
  {id:"juling", name:"聚灵诀", tier:"灵", kind:"ess",    val:4,  ds:"出战灵兽灵气产出 +4%"},
  {id:"dazhout",name:"大周天", tier:"玄", kind:"ess",    val:8,  ds:"出战灵兽灵气产出 +8%"},
  {id:"wangji", name:"忘机诀", tier:"灵", kind:"offline",val:20, ds:"离线收益效率 +20%"},
  {id:"siyao",  name:"撕咬诀", tier:"凡", kind:"atk",    val:3,  ds:"战力 +3%"},
  {id:"pojia",  name:"破甲诀", tier:"灵", kind:"atk",    val:6,  ds:"战力 +6%"},
  {id:"shixin", name:"噬心诀", tier:"玄", kind:"atk",    val:10, ds:"战力 +10%"},
  {id:"lingxi", name:"灵犀诀", tier:"灵", kind:"crit",   val:5,  ds:"会心 +5%"},
  {id:"guixi",  name:"龟息诀", tier:"凡", kind:"dmgR",   val:4,  ds:"探索减伤 +4%"},
  {id:"bumie",  name:"不灭诀", tier:"玄", kind:"dmgR",   val:8,  ds:"探索减伤 +8%"},
  {id:"xunbao", name:"寻宝诀", tier:"玄", kind:"loot",   val:10, ds:"秘境灵石有 10% 概率提升一档"},
  {id:"huchao", name:"护巢诀", tier:"玄", kind:"egg",    val:2,  ds:"秘境出蛋率 +2 个百分点"},
  {id:"huajiao",name:"化蛟诀", tier:"天", kind:"legacy", val:50, ds:"该灵兽基础特性 ×1.5"},
];
const PET_SKILL_BY_ID={}; PET_SKILLS.forEach(s=>PET_SKILL_BY_ID[s.id]=s);
function petBookName(sid,lv){ const s=PET_SKILL_BY_ID[sid]; return (s?s.name:sid)+((lv||1)>1?("·"+["","一","二","三"][lv]+"阶"):""); }
function petBookObj(sid,lv){
  lv=lv||1; const s=PET_SKILL_BY_ID[sid]; if(!s) return null; const t=PS_TIER[s.tier]||PS_TIER.凡;
  return {id:"bk_"+sid+(lv>1?("_"+lv):""), name:petBookName(sid,lv), ic:"📜", rarity:Math.min(9,t.rarity+lv-1), value:Math.round(t.value*Math.pow(2.2,lv-1)), bookSid:sid, bookLv:lv, ds:s.ds+"（兽诀：打入灵兽技能格生效；满格会随机顶替一格）"};
}
const PET_BOOK_BY_ID={}; PET_SKILLS.forEach(s=>{ for(let lv=1;lv<=3;lv++){ const o=petBookObj(s.id,lv); PET_BOOK_BY_ID[o.id]=o; } });
const PET_ITEM={lock:{name:"锁灵符",price:80000,ic:"🔒",ds:"锁定一个技能格，打书时不会被顶替"},wash:{name:"洗练石",price:30000,ic:"🧪",ds:"重掷一只灵兽的灵韵"}};
/* 技能格：稀1-2→2、3-4→3、5-6→4、7-8→5、9-10→6；圣品 +1（上限 7） */
function petSlotCap(b){ if(!b) return 0; const r=b.rarity||1; let n = r<=2?2 : r<=4?3 : r<=6?4 : r<=8?5 : 6; if(b.band==="圣") n++; return Math.min(7,n); }
function petAptMul(it){ const a=Math.max(0,Math.min(100,(it&&it.apt!=null)?it.apt:60)); return 0.85+0.30*a/100; }
function petHasSkill(it,sid){ return !!((it&&it.skills)||[]).some(s=>s.sid===sid); }
function petSkillSum(key){
  const cap=petCap(); if(cap<=0) return 0;
  const act=S.petActive||[]; let sum=0;
  for(let i=0;i<Math.min(cap,act.length);i++){
    const it=petByUid(act[i]); if(!it) continue;
    const c=petCoef(it);
    ((it.skills)||[]).forEach(sk=>{ const s=PET_SKILL_BY_ID[sk.sid]; if(!s||s.kind!==key) return; sum+=s.val*(1+0.5*((sk.lv||1)-1))*c; });
  }
  return sum;
}
/* 打书：空格必成；满格随机顶替（排除锁定格与保底格） */
function petUseBook(uid, bookIdx){
  const it=petByUid(uid); const bk=(S.books||[])[bookIdx]; if(!it||!bk) return;
  const s=PET_SKILL_BY_ID[bk.sid]; if(!s) return;
  const lv=bk.lv||1; const b=NEW_BEAS_BY_ID[it.id]||{name:"灵兽",rarity:1,band:"凡"};
  const cap=petSlotCap(b);
  it.skills=it.skills||[]; it.locks=it.locks||[]; it.pity=it.pity||[]; while(it.pity.length<cap) it.pity.push(0);
  if(it.skills.some(k=>k.sid===bk.sid&&(k.lv||1)>=lv)){ banner("「"+b.name+"」已拥有同阶或更高的"+s.name); return; }
  const cost=Math.round(8000*Math.pow(3,lv-1));
  if(!canPayL(splitPriceL(cost))&&!canPayAutoL(cost)){ banner("打书需 "+fmt(cost)+" 下品灵石"); return; }
  const free=[]; for(let i=0;i<cap;i++){ if(!it.skills[i]) free.push(i); }
  if(free.length){
    if(!payL(splitPriceL(cost))) payAutoL(cost);
    S.books.splice(bookIdx,1);
    it.skills[free[0]]={sid:bk.sid,lv};
    logEvent("「"+b.name+"」习得兽诀「"+petBookName(bk.sid,lv)+"」（第"+(free[0]+1)+"格）",'sys');
    banner("打书成功："+s.name); sound(680,.15); save(); renderTab(); return;
  }
  const cands=[]; for(let i=0;i<cap;i++){ if(!it.locks[i]&&(it.pity[i]||0)<3) cands.push(i); }
  if(!cands.length){ banner("技能格全部锁定或处于保底，无法打书"); return; }
  if(!payL(splitPriceL(cost))) payAutoL(cost);
  S.books.splice(bookIdx,1);
  const idx=cands[Math.floor(Math.random()*cands.length)];
  const old=it.skills[idx]; const oldName=old?petBookName(old.sid,old.lv||1):"空";
  it.skills[idx]={sid:bk.sid,lv};
  it.pity=it.pity.map((v,i)=> i===idx?((v||0)+1):0);
  logEvent("「"+b.name+"」打书「"+petBookName(bk.sid,lv)+"」，顶替「"+oldName+"」（第"+(idx+1)+"格）",'n');
  banner("顶替成功："+s.name+"（失去 "+oldName+"）"); sound(640,.15); save(); renderTab();
}
function petToggleLock(uid, idx){
  const it=petByUid(uid); if(!it) return; it.locks=it.locks||[];
  if(it.locks[idx]){ it.locks[idx]=false; logEvent("解锁技能格 "+(idx+1),'dim'); save(); renderTab(); return; }
  if(!it.skills||!it.skills[idx]){ banner("空格无需锁定"); return; }
  if((S.petItems.lock||0)<1){ banner("锁灵符不足（灵兽页可购买）"); return; }
  S.petItems.lock--; it.locks[idx]=true; logEvent("锁定技能格 "+(idx+1)+"（不会被顶替）",'sys'); save(); renderTab();
}
function petWash(uid){
  const it=petByUid(uid); if(!it) return;
  if((S.petItems.wash||0)<1){ banner("洗练石不足（灵兽页可购买）"); return; }
  S.petItems.wash--;
  const b=NEW_BEAS_BY_ID[it.id]||{rarity:1};
  const base=40+(b.rarity||1)*4;
  const old=Math.round(it.apt||60);
  it.apt=Math.max(20,Math.min(100, Math.round(base+(Math.random()*24-12))));
  logEvent("洗练「"+b.name+"」：灵韵 "+old+" → "+it.apt,'sys');
  banner("洗练完成：灵韵 "+it.apt); save(); renderTab();
}
function petMerge(uid, matUid){
  const a=petByUid(uid), m=petByUid(matUid); if(!a||!m||a.uid===m.uid) return;
  const ba=NEW_BEAS_BY_ID[a.id]||{name:"灵兽",rarity:1,band:"凡"}, bm=NEW_BEAS_BY_ID[m.id]||{name:"灵兽",rarity:1};
  const cap=petSlotCap(ba); a.skills=(a.skills||[]).filter(Boolean);
  const pool=(m.skills||[]).filter(s=>s&&!a.skills.some(x=>x.sid===s.sid));
  let got=0;
  while(got<2 && pool.length && a.skills.length<cap){
    const k=pool.splice(Math.floor(Math.random()*pool.length),1)[0];
    a.skills.push({sid:k.sid,lv:k.lv||1}); got++;
  }
  const oldApt=Math.round(a.apt||60);
  a.apt=Math.max(20,Math.min(100, Math.round((a.apt||60)*0.6+(m.apt||60)*0.4+(Math.random()*10-2))));
  S.pets=S.pets.filter(x=>x.uid!==m.uid); S.petActive=(S.petActive||[]).filter(u=>u!==m.uid);
  logEvent("合宠：「"+ba.name+"」吞噬「"+bm.name+"」，继承 "+got+" 门兽诀，灵韵 "+oldApt+" → "+a.apt,'sys');
  banner("合宠完成：继承 "+got+" 门兽诀 · 灵韵 "+a.apt); sound(720,.2); save(); renderTab();
}
function petUpgradeBook(sid, lv){
  lv=lv||1;
  if(lv>=3){ banner("已是三阶，无法再升"); return; }
  const arr=(S.books||[]).filter(b=>b.sid===sid&&(b.lv||1)===lv);
  if(arr.length<2){ banner("需要 2 本同阶「"+petBookName(sid,lv)+"」"); return; }
  let removed=0;
  S.books=S.books.filter(b=>{ if(b.sid===sid&&(b.lv||1)===lv&&removed<2){ removed++; return false; } return true; });
  S.books.push({sid,lv:lv+1});
  logEvent("兽诀升阶：「"+petBookName(sid,lv)+"」×2 → 「"+petBookName(sid,lv+1)+"」",'sys'); banner("升阶成功"); save(); renderTab();
}
function buyPetItem(kind){
  const d=PET_ITEM[kind]; if(!d) return;
  const p=splitPriceL(d.price);
  if(!canPayL(p)&&!canPayAutoL(d.price)){ banner("灵石不足（需 "+fmt(d.price)+"）"); return; }
  if(!payL(p)) payAutoL(d.price);
  S.petItems[kind]=(S.petItems[kind]||0)+1;
  logEvent("购入「"+d.name+"」×1（-"+fmt(d.price)+" 下品）",'sys','trade'); save(); renderTab();
}
/* 秘境 BOSS 掉落兽诀：灵/玄 按区域 1%~4%，天诀 0.1%~0.8% */
function maybeDropBook(area, floor){
  const conf={dt:[1.0,0.1],yl:[2.0,0.3],sg:[3.0,0.5],kj:[4.0,0.8]}[area]||[1.0,0.1];
  const isTian=Math.random()*100<conf[1];
  if(!isTian && Math.random()*100>=conf[0]) return false;
  const pool=PET_SKILLS.filter(s=>isTian ? s.tier==="天" : (s.tier==="玄"||s.tier==="灵"));
  if(!pool.length) return false;
  const s=pool[Math.floor(Math.random()*pool.length)];
  S.books.push({sid:s.id,lv:1});
  if(S.exp) S.exp.loot.push({kind:"book",sid:s.id,lv:1,name:petBookName(s.id,1),qty:1});
  logEvent("BOSS 遗落兽诀「"+petBookName(s.id,1)+"」（"+s.tier+"阶）",'sys');
  sfxRare(); banner("获得兽诀："+s.name); return true;
}
/* 培养弹窗：技能格 / 打书 / 锁定 / 洗练 / 合宠 */
function openPetForge(uid){
  const it=petByUid(uid); if(!it) return;
  const mask=document.createElement("div");mask.className="eqPickMask";
  mask.onclick=ev=>{ if(ev.target===mask) mask.remove(); };
  const box=document.createElement("div");box.className="eqPickBox";box.style.width="min(560px,94vw)";
  const paint=()=>{
    box.innerHTML="";
    const b=NEW_BEAS_BY_ID[it.id]||{name:"灵兽",rarity:1,band:"凡"};
    const cap=petSlotCap(b);
    const hd=document.createElement("div");hd.className="eqTitle";
    hd.textContent="培养「"+b.name+"」· 灵韵 "+Math.round(it.apt||60)+" · 技能 "+(it.skills||[]).filter(Boolean).length+"/"+cap;
    box.appendChild(hd);
    const sg=document.createElement("div");sg.style.cssText="display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 10px";
    for(let i=0;i<cap;i++){
      const sk=(it.skills||[])[i];
      const d=document.createElement("button");d.className="skSlot big"+(sk?"":" empty")+((it.locks||[])[i]?" locked":"");
      if(sk){ const s=PET_SKILL_BY_ID[sk.sid]||{name:sk.sid,tier:"凡",ds:""};
        d.style.borderColor=(PS_TIER[s.tier]||{}).color||"#888";
        d.textContent=s.name+(sk.lv>1?(" "+sk.lv+"阶"):"")+((it.locks[i])?" 🔒":"");
        d.title=(s.ds||"")+"（点击"+(it.locks[i]?"解锁":"用锁灵符锁定")+"）";
        d.onclick=()=>{ petToggleLock(it.uid,i); paint(); };
      } else { d.textContent="＋ 空格"; d.disabled=true; }
      sg.appendChild(d);
    }
    box.appendChild(sg);
    const t1=document.createElement("div");t1.style.cssText="font-size:12px;color:var(--ink-dim);margin:2px 0 4px";
    t1.textContent="兽诀库存（"+(S.books||[]).length+" 本）：空格必成，满格随机顶替一格";box.appendChild(t1);
    const list=document.createElement("div");list.style.cssText="max-height:22vh;overflow-y:auto;display:flex;flex-direction:column;gap:5px";
    if(!(S.books||[]).length){ const e=document.createElement("div");e.className="hint";e.textContent="暂无兽诀：坊市/拍卖可购，秘境 BOSS 也会掉落。";list.appendChild(e); }
    (S.books||[]).forEach((x,idx)=>{
      const s=PET_SKILL_BY_ID[x.sid]; if(!s) return;
      const row=document.createElement("div");row.className="eqPickRow";
      row.innerHTML='<span class="nm">'+petBookName(x.sid,x.lv||1)+'<div class="sub">'+s.ds+'</div></span>';
      const btn=document.createElement("button");btn.textContent="打入";btn.onclick=()=>{ petUseBook(it.uid, idx); paint(); };
      row.appendChild(btn);list.appendChild(row);
    });
    box.appendChild(list);
    const ops=document.createElement("div");ops.style.cssText="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px";
    const wBtn=document.createElement("button");wBtn.textContent="洗练灵韵（洗练石 "+((S.petItems||{}).wash||0)+"）";wBtn.onclick=()=>{ petWash(it.uid); paint(); };
    ops.appendChild(wBtn);
    const others=(S.pets||[]).filter(x=>x.uid!==it.uid);
    if(others.length){
      const sel=document.createElement("select");sel.style.cssText="padding:6px;border-radius:6px;background:var(--panel2);color:var(--ink);border:1px solid var(--line);font-size:12px";
      others.forEach(o=>{ const ob=NEW_BEAS_BY_ID[o.id]||{name:o.id}; const op=document.createElement("option");op.value=o.uid;op.textContent="吞噬："+ob.name+"（灵韵"+Math.round(o.apt||60)+"）";sel.appendChild(op); });
      ops.appendChild(sel);
      const mBtn=document.createElement("button");mBtn.textContent="合宠";mBtn.onclick=()=>{ const v=parseInt(sel.value)||0; if(!v) return; petMerge(it.uid, v); mask.remove(); };
      ops.appendChild(mBtn);
    }
    const cBtn=document.createElement("button");cBtn.textContent="关闭";cBtn.onclick=()=>mask.remove();
    ops.appendChild(cBtn);
    box.appendChild(ops);
  };
  paint();
  mask.appendChild(box);document.body.appendChild(mask);
}

function petByUid(uid){ return (S.pets||[]).find(x=>x.uid===uid); }
function eggByUid(uid){ return (S.eggs||[]).find(x=>x.uid===uid); }
/* 出战上限：筑基 1 / 金丹 2 / 元婴及以上 3 */
function petCap(){ return S.realm<=0?0:S.realm===1?1:S.realm===2?2:3; }
function petActiveUids(){ const cap=petCap(); return (S.petActive||[]).slice(0,cap); }
/* 属性生效系数：亲密 40%→100% 线性（40%+60%×亲密/100）；饱食 0 时 ×0.5 */
function petCoef(it){ const c=(0.4+0.6*Math.max(0,Math.min(100,it.int))/100)*petAptMul(it); return it.sat<=0?c*0.5:c; }
/* 出战灵兽加成聚合：修炼型=修炼速度%、攻击型=战力%、圣品特性=灵气/会心/突破/减伤 */
function petSum(key){
  const cap=petCap(); if(cap<=0) return 0;
  const act=S.petActive||[]; let sum=0;
  for(let i=0;i<Math.min(cap,act.length);i++){
    const it=petByUid(act[i]); if(!it) continue;
    const b=NEW_BEAS_BY_ID[it.id]; if(!b) continue;
    const legacy=petHasSkill(it,"huajiao")?1.5:1;   /* 化蛟诀：该兽基础特性 ×1.5 */
    const c=petCoef(it)*legacy;
    if(key==="atk"){ if(b.type==="攻") sum+=b.attr*c; if(b.extra&&b.extra.atk) sum+=b.extra.atk*c; }
    else if(key==="cult"){ if(b.type==="修") sum+=b.attr*c; }
    else if(b.traits&&b.traits[key]) sum+=b.traits[key]*c;
  }
  return sum+petSkillSum(key);   /* 兽诀加成 */
}
/* 探索战斗胜利出蛋判定（设计 3.1）：区域基础出蛋率 + 层数×0.15%，封顶 10% */
function maybeDropEgg(area, floor){
  if(!S.root || S.realm<1) return;
  /* 新手保底（3.3）：筑基后首场战斗胜利必得木灵蛋 */
  if(!S.petGuide){ S.petGuide=true; addEgg("eg1"); logEvent("首战告捷！获得新手引导蛋「木灵蛋」×1",'sys'); banner("获得木灵蛋"); save(); return; }
  const base={dt:2.0,yl:3.5,sg:5.0,kj:6.5}[area]||2.0;
  const rate=Math.min(20, base+floor*0.15+petSkillSum("egg"));
  if(Math.random()*100>=rate) return;
  const dist={dt:[[1,40],[2,30],[3,20],[4,10]],yl:[[2,25],[3,25],[4,20],[5,20],[6,10]],sg:[[4,15],[5,20],[6,20],[7,20],[8,15],[9,10]],kj:[[6,10],[7,15],[8,20],[9,25],[10,30]]}[area]||[[1,100]];
  let rr=Math.random()*100, pick=dist[0][0];
  for(const d of dist){ rr-=d[1]; if(rr<=0){ pick=d[0]; break; } }
  addEgg("eg"+pick);
}
function addEgg(id){
  const ed=EGG_BY_ID[id]; if(!ed) return;
  S.eggs.push({uid:++S.uid, id, warm:0});
  logEvent("获得「"+ed.name+"」×1（可前往灵兽页孵化）",'sys');
  banner("获得 "+ed.name);
}
/* 孵化：入槽（蛋仓中蛋移入槽，温养度随身）→ 倒计时 → 破壳掷档位 */
function startHatch(uid){
  const egg=eggByUid(uid); if(!egg) return;
  const slot=S.hatch.findIndex((x,i)=>!x&&i<(S.hatchSlots||1));
  if(slot<0){ banner("孵化槽已满，请等待空位（或扩容解锁更多槽位）"); return; }
  const ed=EGG_BY_ID[egg.id];
  S.eggs=S.eggs.filter(e=>e.uid!==uid);
  S.hatch[slot]={id:egg.id, warm:egg.warm, endAt:Date.now()+ed.hatchSec*1000};
  logEvent("「"+ed.name+"」放入孵化槽"+(slot+1)+"，需 "+Math.round(ed.hatchSec/3600)+" 小时",'sys'); sound(560,.12); save(); renderTab();
}
function hatchDone(slot){
  const h=S.hatch[slot]; if(!h) return;
  if(h.endAt>Date.now()){ banner("孵化尚未完成"); return; }
  const ed=EGG_BY_ID[h.id]; if(!ed){ S.hatch[slot]=null; save(); renderTab(); return; }
  const w=Math.max(0,Math.min(100,h.warm||0));
  const p=ed.probs;
  const fan=p.fan[0]+(p.fan[1]-p.fan[0])*w/100;
  const ling=p.ling[0]+(p.ling[1]-p.ling[0])*w/100;
  const rr=Math.random()*100;
  const band= rr<fan?"凡" : rr<fan+ling?"灵" : "圣";
  const bid=ed.pool[band==="凡"?0:band==="灵"?1:2];
  const nb=NEW_BEAS_BY_ID[bid];
  S.hatch[slot]=null;
  S.hatchCnt=(S.hatchCnt||0)+1; // v31.7 兽潮涌动成就：孵化计数
  const full=w>=100;
  const it={uid:++S.uid, id:nb.id, sat:full?100:80, int:full?100:80, lastFeedAt:Date.now(), betrayAt:null,
    skills:[], locks:[], pity:[],
    apt:Math.max(20,Math.min(100, 40+(nb.rarity||1)*4+(band==="圣"?5:0)+Math.round((Math.random()*2-1)*8)))};
  S.pets.push(it);
  if(!S.petDex[nb.id]) S.petDex[nb.id]=1;
  if(S.petActive.length<petCap()) S.petActive.push(it.uid);
  logEvent("「"+ed.name+"」破壳，孵化出「"+nb.name+"」（"+(band==="凡"?"凡品":band==="灵"?"灵品":"圣品")+" · 稀"+nb.rarity+"）"+(full?"（满温养：初始饱食/亲密+20）":""),'sys');
  banner("孵化出 "+nb.name); sound(660,.18); showHatchFx(ed.id,nb,band,full); save(); renderTab();
}
/* 温养收益：普通材料 0.5×材料稀有度、偏好材料 1×材料稀有度（设计 4.3 新口径） */
function warmGain(ed, mat){ return mat.cat===ed.pref ? mat.rarity : mat.rarity*0.5; }
function warmEggByMat(uid, matId){
  const egg=eggByUid(uid); if(!egg) return;
  if((egg.warm||0)>=100){ banner("温养值已满，不可再温养"); return; }
  const m=MATS_BY_ID[matId]; if(!m||(S.mats[matId]||0)<1) return;
  const ed=EGG_BY_ID[egg.id]; const g=warmGain(ed,m);
  S.mats[matId]--; egg.warm=Math.min(100, egg.warm+g);
  logEvent("温养「"+ed.name+"」"+m.name+"：温养度 +"+(g%1?g.toFixed(1):g),'','collect'); sound(520,.1); save(); renderTab();
}
function warmHatchByMat(slot, matId){
  banner("孵化中的蛋温养值已固定，不可温养"); return;
  const h=S.hatch[slot]; if(!h) return;
  const m=MATS_BY_ID[matId]; if(!m||(S.mats[matId]||0)<1) return;
  const ed=EGG_BY_ID[h.id]; if(!ed) return; const g=warmGain(ed,m);
  S.mats[matId]--; h.warm=Math.min(100, (h.warm||0)+g);
  logEvent("温养孵化中的「"+ed.name+"」"+m.name+"：温养度 +"+(g%1?g.toFixed(1):g),'','collect'); sound(520,.1); save(); renderTab();
}
function warmByEss(uid){
  if(S.petEss<1){ banner("灵兽精魄不足"); return; }
  const egg=eggByUid(uid); if(!egg) return;
  if((egg.warm||0)>=100){ banner("温养值已满，不可再温养"); return; }
  S.petEss--; egg.warm=Math.min(100, egg.warm+1);
  logEvent("以 1 枚精魄温养「"+EGG_BY_ID[egg.id].name+"」，温养度 +1",'sys'); sound(520,.1); save(); renderTab();
}
function warmHatchByEss(slot){
  banner("孵化中的蛋温养值已固定，不可温养"); return;
  if(S.petEss<1){ banner("灵兽精魄不足"); return; }
  const h=S.hatch[slot]; if(!h) return;
  S.petEss--; h.warm=Math.min(100,(h.warm||0)+1);
  logEvent("以 1 枚精魄温养孵化中的蛋，温养度 +1",'sys'); sound(520,.1); save(); renderTab();
}
/* 喂养：消耗 1 份任意材料，饱食+10×稀有度、亲密+1×稀有度（原 +2×稀有度 ÷2 取整；上限 100），重置叛变倒计时 */
function feedPetByMat(uid, matId){
  const it=petByUid(uid); if(!it) return;
  const m=MATS_BY_ID[matId]; if(!m||(S.mats[matId]||0)<1) return;
  S.mats[matId]--;
  it.sat=Math.min(100, it.sat+10*m.rarity);
  it.int=Math.min(100, it.int+m.rarity);
  it.lastFeedAt=Date.now(); it.betrayAt=null;
  const b=NEW_BEAS_BY_ID[it.id];
  logEvent("喂养「"+b.name+"」"+m.name+"：饱食 +"+(10*m.rarity)+"、亲密 +"+m.rarity,'sys'); sound(560,.12); save(); renderTab();
}
/* 炼化：移除灵兽得精魄（数量=稀有度），图鉴保留；放生：返还 稀有度×(1上品+100下品)（略高于炼化） */
function refinePet(uid){
  const it=petByUid(uid); if(!it) return;
  const b=NEW_BEAS_BY_ID[it.id]; if(!b) return;
  S.pets=S.pets.filter(x=>x.uid!==uid);
  S.petActive=S.petActive.filter(u=>u!==uid);
  S.petEss+=b.rarity;
  logEvent("炼化「"+b.name+"」，获得 "+b.rarity+" 枚灵兽精魄",'sys'); sound(620,.15); save(); renderTab();
}
function releasePet(uid){
  const it=petByUid(uid); if(!it) return;
  const b=NEW_BEAS_BY_ID[it.id]; if(!b) return;
  S.pets=S.pets.filter(x=>x.uid!==uid);
  S.petActive=S.petActive.filter(u=>u!==uid);
  addL(splitPriceL(b.rarity*10100));
  logEvent("放生「"+b.name+"」，返还 "+priceLText(splitPriceL(b.rarity*10100))+"，图鉴收录保留",'sys'); sound(520,.12); save(); renderTab();
}
/* 精魄出售：每枚 1 上品灵石 */
function sellPetEss(){
  if(S.petEss<1){ banner("没有灵兽精魄"); return; }
  S.petEss--; addL(splitPriceL(10000));
  logEvent("出售 1 枚灵兽精魄，得 1 上品灵石",'sys'); sound(520,.1); save(); renderTab();
}
/* 孵化槽：默认 1 个，可扩至 4 槽（100 下品 / 1 中品 / 10 中品） */
const HATCH_FEES=[null,{g:0,t:0,h:0,m:0,l:100},{g:0,t:0,h:0,m:1,l:0},{g:0,t:0,h:0,m:10,l:0}];
function expandHatch(){
  if(S.hatchSlots>=4){ banner("已达孵化槽上限（4 槽）"); return; }
  const fee=HATCH_FEES[S.hatchSlots]; if(!canPayL(fee)){ banner("灵石不足，扩容需 "+priceLText(fee)); return; }
  payL(fee); S.hatchSlots++;
  logEvent("扩容孵化槽至 "+S.hatchSlots+" 槽，花费 "+priceLText(fee),'sys'); sound(560,.12); save(); renderTab();
}
/* 出战切换（受境界解锁上限） */
function togglePetActive(uid){
  const it=petByUid(uid); if(!it) return;
  const idx=(S.petActive||[]).indexOf(uid);
  if(idx>=0){ S.petActive.splice(idx,1); }
  else{
    if(S.petActive.length>=petCap()){ banner("出战上限 "+petCap()+" 只（筑基1/金丹2/元婴3），请先休战一只"); return; }
    S.petActive.push(uid);
  }
  save(); renderTab();
}
/* 养成 tick：饱食/亲密衰减 + 叛变倒计时（设计 6.1-6.4；每秒随 gameTick 调用） */
function petTick(dt){
  if(!S.pets||!S.pets.length) return;
  const now=Date.now();
  for(const it of S.pets){
    const b=NEW_BEAS_BY_ID[it.id]; if(!b) continue;
    const dec={凡:20,灵:18,圣:15}[b.band]||20;
    it.sat=Math.max(0, it.sat - dec*dt/3600);
    if(it.sat<=0) it.int=Math.max(0, it.int - 15*dt/3600); /* 无饱食：每小时 -15（有饱食的 3 倍） */
    else it.int=Math.max(0, it.int - 5*dt/3600); /* 有饱食：每小时 -5 */
    if(it.int<=0){
      if(it.betrayAt==null){ it.betrayAt=now + ((it.sat<=0?48:72)*3600*1000); }
      else if(it.betrayAt<=now){ S.pets=S.pets.filter(x=>x.uid!==it.uid); S.petActive=S.petActive.filter(u=>u!==it.uid); logEvent("灵兽「"+b.name+"」叛变逃离（长期未喂养）",'warn'); banner("「"+b.name+"」叛变逃离"); }
      else if(it.sat<=0 && it.betrayAt>now+49*3600*1000){ it.betrayAt=now+48*3600*1000; }
    } else it.betrayAt=null;
  }
}


/* 制造配方库（制符/炼丹/炼器/阵法）— v20 四套 88 种 */
const CRAFT = [
  {cat:"制符", ic:"🧧", ds:"以材料炼制符箓", rec:[
    {id:"jufu",name:"聚灵符",ic:"🧧",value:624,eff:"ess_flat",val:20,durMin:30,maxStack:5,ds:"聚灵纳气，符光流转，灵气自涌。", need:{"herb":24,"bone":18,"skin":12,"gold":6}},
    {id:"ningshen",name:"凝神符",ic:"🧠",value:2884,eff:"crit",val:10,durMin:30,maxStack:3,ds:"凝神静气，会心通明，心魔不侵。", need:{"zishen":10,"herb":22,"tort":12,"lingzhi":6,"longxian":4}},
    {id:"dundi",name:"遁地符",ic:"🌀",value:1358,eff:"dmg_reduce",val:15,durMin:60,maxStack:2,ds:"遁地符成，千山万壑如履平地。", need:{"han":12,"herb":26,"iron":20,"tort":8}},
    {id:"yuhuo",name:"御火符",ic:"🔥",value:3033,eff:"combat",val:8,durMin:30,maxStack:3,ds:"御火之符，火灵护体，攻伐凌厉。", need:{"huoshi":9,"skin":25,"tong":16,"longxian":5,"bone":6,"fea":6}},
    {id:"pojun",name:"破军符",ic:"⚔️",value:2538,eff:"brk",val:1,durMin:10,maxStack:2,ds:"破军之势，无坚不摧，突破更易。", need:{"gold":12,"tiger":4,"skin":28,"iron":22,"lingzhi":8}},
    {id:"xuanling",name:"玄灵符",ic:"✨",value:17576,eff:"ess_flat",val:50,durMin:60,maxStack:4,ds:"玄灵之气，绵绵不绝，福泽自生。", need:{"qing":20,"core":18,"myst":10,"jiuye":6,"xie":4}},
    {id:"zhenfu",name:"镇神符",ic:"🧿",value:15496,eff:"crit",val:12,durMin:60,maxStack:3,ds:"镇神定魄，会心澄澈，外邪难犯。", need:{"zishen":20,"bing":18,"heshouwu":10,"zhu":4,"xuanhuang":4}},
    {id:"jiadun",name:"金甲遁地符",ic:"🛡️",value:12376,eff:"dmg_reduce",val:20,durMin:60,maxStack:2,ds:"金甲护体，遁走无形，攻守兼备。", need:{"qing":22,"xie":18,"jiao":10,"tiger":6,"huoshi":6}},
    {id:"fentian",name:"焚天御火符",ic:"🔥",value:36244,eff:"combat",val:12,durMin:60,maxStack:3,ds:"焚天烈焰，御火成势，战力激增。", need:{"huoshi":20,"chiyan":16,"zhu":8,"dihuo":6,"fenghuangy":2}},
    {id:"zixiao",name:"紫霄破阵符",ic:"⚡",value:24492,eff:"brk",val:2,durMin:10,maxStack:2,ds:"紫霄神雷，破阵克敌，势如破竹。", need:{"lei":18,"bing":18,"xlangz":6,"hansui":10,"peng":4}},
    {id:"taichufu",name:"太初灵符",ic:"🌀",value:61620,eff:"ess_pct",val:5,durMin:120,maxStack:2,ds:"太初之气，灵蕴无穷，产出倍增。", need:{"jiuye":18,"peng":16,"hwl":10,"xinghui":4,"wanfuf":2,"hundung":1}},
    {id:"dinghun",name:"定魂符",ic:"💀",value:67340,eff:"crit",val:16,durMin:120,maxStack:1,ds:"定魂镇魄，魂归本位，会心大增。", need:{"niepan":18,"xuanhuang":16,"xianhe":10,"jiuyang":2,"yinyangh":2,"biluoy":2}},
    {id:"hundunfu",name:"混元遁形符",ic:"🌑",value:68562,eff:"dmg_reduce",val:25,durMin:120,maxStack:1,ds:"混元一气，遁形无迹，减免伤势。", need:{"jiuye":20,"peng":16,"longxue":8,"qilinj":4,"xuanwubei":2,"hunyuan":1}},
    {id:"jiuyangfu",name:"九阳焚天符",ic:"☀️",value:71552,eff:"combat",val:20,durMin:120,maxStack:1,ds:"九阳齐出，焚天煮海，战力无双。", need:{"niepan":18,"xuanhuang":16,"chiyan":12,"zhulongm":4,"fenghuangy":2,"yinglongl":1}},
    {id:"zhuxianpo",name:"诛仙破妄符",ic:"⚔️",value:79690,eff:"brk",val:5,durMin:10,maxStack:1,ds:"诛仙之力，破妄归真，突破无碍。", need:{"xuanhuang":18,"jiuye":16,"xlangz":8,"qilinj":4,"tianwai":2,"hongmengj":1,"hundung":1}},
    {id:"hunyuanqi",name:"混元一气符",ic:"🌌",value:189670,eff:"ess_pct",val:10,durMin:120,maxStack:1,ds:"混元归一气，道韵自天成，灵气暴涨。", need:{"xinghui":10,"zijinm":14,"fenghuangy":10,"taichu":4,"hongmengj":1,"hundung":1}},
    {id:"taiyizhen",name:"太一镇神符",ic:"☯️",value:185900,eff:"crit",val:22,durMin:120,maxStack:1,ds:"太一镇神，万邪辟易，会心通神。", need:{"zixiaot":18,"qilinj":12,"jiuyang":8,"yinyangh":10,"hunjing":1,"taichu":1}},
    {id:"wujidun",name:"无极遁世符",ic:"🌀",value:205270,eff:"dmg_reduce",val:30,durMin:120,maxStack:1,ds:"无极之境，遁世无争，万法不侵。", need:{"wanfuf":18,"xinghui":8,"xuanwubei":8,"biluoy":4,"yinglongl":2,"hunjing":1,"chuangshij":1}},
    {id:"hundunpo",name:"混沌破天符",ic:"💥",value:218920,eff:"combat",val:30,durMin:120,maxStack:1,ds:"混沌之力，破天裂地，战力滔天。", need:{"zijinm":18,"zhulongm":14,"fenghuangy":10,"qilinj":6,"hundun":1,"chuangshij":1,"zulongy":1}},
    {id:"hongmengzheng",name:"鸿蒙证道符",ic:"🪷",value:229320,eff:"brk",val:10,durMin:10,maxStack:1,ds:"鸿蒙初开，证道成符，突破如神。", need:{"qilinj":18,"xinghui":8,"jiuyang":10,"hunyuan":3,"hongmengj":2,"chuangshil":1,"zulongy":1}},
  ]},
  {cat:"炼丹", ic:"⚗️", ds:"以草药妖兽精华炼丹药", rec:[
    {id:"juqi",name:"聚气丹",ic:"💊",value:705,eff:"ess_flat",val:20,durMin:30,maxStack:5,heal:10,ds:"聚气归元，灵气充盈，兼能恢复气血。", need:{"lingzhi":10,"herb":26,"iron":18,"skin":16}},
    {id:"chuiti",name:"淬体丹",ic:"💪",value:572,eff:"combat",val:8,durMin:30,maxStack:3,ds:"淬炼肉身，筋骨如铁，战力提升。", need:{"skin":24,"iron":20,"tong":12,"bone":10}},
    {id:"yangshen",name:"养神丹",ic:"💆",value:2920,eff:"crit",val:10,durMin:30,maxStack:3,ds:"滋养神魂，神思清明，会心提升。", need:{"zishen":8,"longxian":12,"herb":24,"lingzhi":8,"tort":10}},
    {id:"zhuji",name:"筑基丹",ic:"🫙",value:3711,eff:"brk",val:2,durMin:10,maxStack:3,ds:"稳固根基，筑基有望，突破更易。", need:{"heshouwu":8,"core":6,"herb":26,"iron":20,"lingzhi":6}},
    {id:"jinganghu",name:"金刚护体丹",ic:"🛡️",value:1316,eff:"dmg_reduce",val:15,durMin:60,maxStack:2,heal:20,ds:"金刚不坏，减免伤势，兼能恢复气血。", need:{"bone":24,"tort":12,"skin":20,"gold":10}},
    {id:"huiling",name:"回灵丹",ic:"✨",value:16848,eff:"ess_flat",val:50,durMin:60,maxStack:4,heal:30,ds:"回灵养元，灵气奔涌，兼能恢复气血。", need:{"qing":20,"core":18,"myst":8,"jiuye":4,"peng":4}},
    {id:"huoyuancu",name:"火元淬体丹",ic:"🌋",value:35412,eff:"combat",val:12,durMin:60,maxStack:3,ds:"火元淬体，百炼成钢，战力大增。", need:{"huoshi":20,"chiyan":16,"zhu":6,"dihuo":6,"fenghuangy":2}},
    {id:"qiqiao",name:"七窍养神丹",ic:"🧠",value:16432,eff:"crit",val:12,durMin:60,maxStack:3,ds:"七窍通明，神游太虚，会心大增。", need:{"zishen":20,"bing":18,"heshouwu":10,"peng":4,"xuanhuang":4}},
    {id:"pojing",name:"破境丹",ic:"💠",value:15886,eff:"brk",val:3,durMin:10,maxStack:2,ds:"破境开悟，瓶颈松动，突破更易。", need:{"qing":20,"core":16,"lei":6,"xuanyang":10,"dihuo":8}},
    {id:"xuanguihu",name:"玄龟护体丹",ic:"🐢",value:22568,eff:"dmg_reduce",val:20,durMin:60,maxStack:2,ds:"玄龟之甲，坚不可摧，减免伤势。", need:{"xie":18,"jiao":18,"tiger":8,"myst":8,"xuanwubei":2}},
    {id:"tianyuan",name:"天元丹",ic:"🔆",value:62270,eff:"ess_pct",val:3,durMin:120,maxStack:2,ds:"天元之气，生生不息，灵气暴涨。", need:{"jiuye":18,"peng":16,"xuanhuang":10,"niepan":6,"zijinm":4,"hunyuan":1}},
    {id:"jiuzhuanlian",name:"九转炼体丹",ic:"💪",value:59904,eff:"combat",val:20,durMin:120,maxStack:1,ds:"九转炼体，肉身成圣，战力滔天。", need:{"xuanhuang":18,"niepan":16,"chiyan":10,"longxue":6,"qilinj":3,"fenghuangy":2}},
    {id:"taiyiding",name:"太一定神丹",ic:"🧿",value:66040,eff:"crit",val:16,durMin:120,maxStack:1,ds:"太一定神，道心稳固，会心通神。", need:{"jiuye":18,"peng":16,"xianhe":10,"xinghui":4,"jiuyang":2,"yinyangh":2}},
    {id:"poxudujie",name:"破虚渡劫丹",ic:"🌩️",value:66326,eff:"brk",val:5,durMin:10,maxStack:1,ds:"破虚渡劫，天劫不侵，突破如神。", need:{"xuanhuang":18,"niepan":16,"hwl":8,"longxue":4,"qilinj":2,"taichu":1,"hundung":1}},
    {id:"hundunhu",name:"混元护体丹",ic:"🛡️",value:77870,eff:"dmg_reduce",val:25,durMin:120,maxStack:1,heal:60,ds:"混元护体，万法难伤，兼能恢复气血。", need:{"jiuye":20,"peng":16,"liuli":8,"qilinj":3,"xuanwubei":2,"hunyuan":1,"yinglongl":1}},
    {id:"hundunzaohua",name:"混沌造化丹",ic:"🌌",value:169650,eff:"ess_pct",val:6,durMin:120,maxStack:1,ds:"混沌造化，灵气如渊，源源不绝。", need:{"xinghui":10,"zijinm":14,"jiuyang":10,"wanfuf":6,"hundung":1,"chuangshil":1}},
    {id:"daoticuihuo",name:"道体淬炼丹",ic:"✨",value:156000,eff:"combat",val:30,durMin:120,maxStack:1,ds:"道体淬炼，浑然天成，战力无双。", need:{"zijinm":18,"zhulongm":14,"qilinj":10,"jiuyang":8,"fenghuangy":2,"yinglongl":1}},
    {id:"hongmengding",name:"鸿蒙定魂丹",ic:"🧠",value:147160,eff:"crit",val:22,durMin:120,maxStack:1,ds:"鸿蒙定魂，神念如虹，会心无双。", need:{"qilinj":16,"zixiaot":14,"xinghui":8,"yinyangh":10,"jiuyang":2,"hongmengj":1}},
    {id:"jiuzhuanpoxu",name:"九转破虚丹",ic:"💥",value:212420,eff:"brk",val:10,durMin:10,maxStack:1,ds:"九转破虚，直指大道，突破无碍。", need:{"qilinj":18,"xinghui":6,"jiuyang":10,"fenghuangy":6,"taichu":1,"hundun":1,"zulongy":1}},
    {id:"wujijinshen",name:"无极金身丹",ic:"🛡️",value:186160,eff:"dmg_reduce",val:30,durMin:120,maxStack:1,heal:60,ds:"无极金身，金刚不坏，兼能恢复气血。", need:{"wanfuf":18,"zixiaot":16,"tianwai":10,"biluoy":4,"xuanwubei":2,"taotieg":1,"chuangshij":1}},
  ]},
  {cat:"炼器", ic:"⚒️", ds:"炼器成装备，穿戴生效", rec:[
    {id:"mu_kui",name:"木傀",ic:"🪵",isPu:true,puLv:"丁",value:30000,ds:"地火淬形、玄阳注灵、蛟鳞点睛、青金塑骨、内丹启智，制成初阶木傀儡，可代劳采集与制造。", need:{dihuo:40,xuanyang:30,jiao:30,qing:30,core:10}},
    {id:"qingfengjian",name:"青锋剑",ic:"🗡️",slot:"w",atk:6,hp:0,ess:0,crit:0,brk:0,dmgR:0,value:819,ds:"青锋三尺，锋芒初露，斩妖除魔。", need:{"iron":24,"gold":10,"skin":18,"bone":12}},
    {id:"xuantiekui",name:"玄铁盔",ic:"⛑️",slot:"h",atk:0,hp:8,ess:0,crit:0,brk:0,dmgR:0,value:749,ds:"玄铁铸盔，坚不可摧，气血绵长。", need:{"iron":22,"bone":18,"skin":12,"gold":8}},
    {id:"tielinjia",name:"铁鳞甲",ic:"🛡️",slot:"a",atk:0,hp:0,ess:0,crit:0,brk:0,dmgR:10,value:910,ds:"铁鳞覆甲，刀枪难入，减免伤势。", need:{"iron":20,"skin":22,"tort":10,"tong":12}},
    {id:"xuantiejie",name:"玄铁戒",ic:"💍",slot:"r1",atk:5,hp:0,ess:0,crit:0,brk:0,dmgR:0,value:669,ds:"玄铁为戒，锋锐内敛，战力提升。", need:{"iron":24,"skin":20,"tong":12,"lingzhi":6}},
    {id:"feicui",name:"翡翠指环",ic:"💚",slot:"r2",atk:0,hp:0,ess:0,crit:7,brk:0,dmgR:0,value:1020,ds:"翡翠通灵，会心澄明，福缘自生。", need:{"gold":10,"herb":24,"iron":18,"tort":8}},
    {id:"yunling",name:"蕴灵珠串",ic:"📿",slot:"n",atk:0,hp:0,ess:6,crit:0,brk:0,dmgR:0,value:2127,ds:"蕴灵纳气，灵气绵长，修炼加速。", need:{"gold":8,"bing":6,"herb":24,"iron":20,"lingzhi":4}},
    {id:"zihulu",name:"紫金葫芦",ic:"🧡",slot:"m",atk:0,hp:0,ess:8,crit:0,brk:0,dmgR:0,value:921,ds:"紫金葫芦，纳灵聚气，灵气自涌。", need:{"gold":12,"tong":18,"herb":22,"bone":10}},
    {id:"liangtianchi",name:"量天尺",ic:"📏",slot:"w",atk:10,hp:0,ess:0,crit:0,brk:0,dmgR:0,value:15496,ds:"量天测地，锋芒毕露，战力大增。", need:{"qing":20,"core":16,"myst":8,"xuanhuang":4,"peng":4}},
    {id:"zijinguan",name:"紫金冠",ic:"👑",slot:"h",atk:0,hp:14,ess:0,crit:0,brk:0,dmgR:0,value:15236,ds:"紫金冠冕，气血充盈，威严自生。", need:{"qing":20,"core":16,"myst":10,"hansui":6,"zhu":6}},
    {id:"fuyaosuo",name:"缚妖索",ic:"🪢",slot:"a",atk:0,hp:0,ess:0,crit:0,brk:0,dmgR:15,value:22230,ds:"缚妖索出，万妖俯首，减免伤势。", need:{"jiao":18,"xie":16,"qing":18,"tiger":6,"xuanwubei":2}},
    {id:"chiyanhuan",name:"赤焰环",ic:"🔥",slot:"r1",atk:10,hp:0,ess:0,crit:0,brk:0,dmgR:0,value:36920,ds:"赤焰环绕，灼灼其华，战力滔天。", need:{"huoshi":18,"chiyan":16,"zhu":6,"dihuo":6,"xuanyang":6,"fenghuangy":2}},
    {id:"qiankun",name:"乾坤戒",ic:"💍",slot:"r2",atk:0,hp:0,ess:0,crit:12,brk:0,dmgR:0,value:16016,ds:"乾坤藏纳，会心通玄，妙用无穷。", need:{"zishen":18,"bing":18,"myst":8,"heshouwu":8,"xuanhuang":4}},
    {id:"dingling",name:"定灵珠",ic:"🔮",slot:"n",atk:0,hp:0,ess:0,crit:0,brk:15,dmgR:0,value:17576,ds:"定灵镇气，突破更易，灵韵自生。", need:{"qing":20,"core":14,"bing":18,"myst":8,"xlangz":4}},
    {id:"qinglian",name:"青莲宝座",ic:"🪷",slot:"m",atk:0,hp:0,ess:12,crit:0,brk:0,dmgR:0,value:16536,ds:"青莲宝座，灵气如莲，清泉自涌。", need:{"qing":20,"core":16,"myst":8,"jiuye":4,"peng":4}},
    {id:"yinyangjing",name:"阴阳镜",ic:"☯️",slot:"w",atk:18,hp:0,ess:0,crit:0,brk:0,dmgR:0,value:69030,ds:"阴阳照彻，攻守兼备，战力无双。", need:{"xuanhuang":18,"jiuye":16,"niepan":10,"qilinj":4,"yinyangh":2,"hunyuan":1}},
    {id:"taixuguan",name:"太虚冠",ic:"🎩",slot:"h",atk:0,hp:22,ess:0,crit:0,brk:0,dmgR:0,value:61360,ds:"太虚之冠，气血如海，威压四方。", need:{"peng":18,"xuanhuang":16,"niepan":10,"xinghui":4,"yinyangh":2,"fenghuangy":2}},
    {id:"xingtian",name:"星辰鉴",ic:"🌠",slot:"a",atk:0,hp:0,ess:0,crit:0,brk:0,dmgR:20,value:83980,ds:"星辰为鉴，光照万里，减免伤势。", need:{"peng":18,"jiuye":16,"xuanhuang":10,"qilinj":4,"xuanwubei":2,"zulongy":1}},
    {id:"jiuyaohuan",name:"九曜环",ic:"💍",slot:"r1",atk:20,hp:0,ess:0,crit:0,brk:0,dmgR:0,value:63310,ds:"九曜齐辉，锋芒毕露，战力无双。", need:{"xuanhuang":18,"niepan":16,"chiyan":10,"qilinj":4,"zijinm":3,"fenghuangy":2}},
    {id:"dayan",name:"大衍戒",ic:"💍",slot:"r2",atk:0,hp:0,ess:0,crit:18,brk:0,dmgR:0,value:67210,ds:"大衍之数，算无遗策，会心通神。", need:{"jiuye":18,"peng":16,"xianhe":10,"xinghui":4,"jiuyang":2,"hunyuan":1}},
    {id:"suoling",name:"锁灵珠串",ic:"📿",slot:"n",atk:0,hp:0,ess:0,crit:0,brk:22,dmgR:0,value:60450,ds:"锁灵固元，突破如神，道韵自生。", need:{"peng":18,"xuanhuang":16,"jiuye":8,"qilinj":4,"zixiaot":2,"wanfuf":2,"yinglongl":1}},
    {id:"hundundingq",name:"混元鼎",ic:"🏺",slot:"m",atk:0,hp:0,ess:22,crit:0,brk:0,dmgR:0,value:55120,ds:"混元宝鼎，容纳万灵，灵气暴涨。", need:{"peng":18,"xuanhuang":16,"niepan":10,"jiuye":4,"zijinm":3,"hunyuan":1}},
    {id:"haotianjing",name:"昊天镜",ic:"🌕",slot:"w",atk:30,hp:0,ess:0,crit:0,brk:0,dmgR:0,value:185250,ds:"昊天镜照，洞彻九霄，战力滔天。", need:{"xinghui":10,"zijinm":14,"fenghuangy":10,"zhulongm":4,"hundun":1,"changsheng":1}},
    {id:"hongmengzjg",name:"鸿蒙紫金冠",ic:"👑",slot:"h",atk:0,hp:30,ess:0,crit:0,brk:0,dmgR:0,value:152880,ds:"鸿蒙紫金，冠绝群仙，气血如渊。", need:{"xinghui":10,"qilinj":14,"jiuyang":10,"zixiaot":4,"zijinm":2,"fenghuangy":2,"hongmengj":1}},
    {id:"taiyixuanjia",name:"太一玄甲",ic:"🛡️",slot:"a",atk:0,hp:0,ess:0,crit:0,brk:0,dmgR:25,value:180310,ds:"太一玄甲，万法不侵，减免伤势。", need:{"wanfuf":18,"xinghui":8,"tianwai":10,"biluoy":2,"qilinj":2,"xuanwubei":2,"yinglongl":1,"chuangshij":1}},
    {id:"hundunhuan",name:"混沌环",ic:"💍",slot:"r1",atk:32,hp:0,ess:0,crit:0,brk:0,dmgR:0,value:192660,ds:"混沌之力，环抱乾坤，战力无双。", need:{"zhulongm":18,"zijinm":16,"fenghuangy":10,"qilinj":6,"hunjing":1,"hundun":1}},
    {id:"taiyijie",name:"太一戒",ic:"💍",slot:"r2",atk:0,hp:0,ess:0,crit:25,brk:0,dmgR:0,value:173030,ds:"太一之戒，道韵天成，会心无双。", need:{"qilinj":18,"xinghui":8,"yinyangh":10,"wanfuf":4,"jiuyang":2,"hongmengj":1,"chuangshil":1}},
    {id:"dadao",name:"大道珠串",ic:"📿",slot:"n",atk:0,hp:0,ess:0,crit:0,brk:30,dmgR:0,value:198770,ds:"大道珠串，道韵流转，突破如神。", need:{"xinghui":10,"zijinm":14,"jiuyang":10,"fenghuangy":4,"wanfuf":2,"chuangshil":1,"changsheng":1}},
    {id:"chuangshiding",name:"创世鼎",ic:"🏺",slot:"m",atk:0,hp:0,ess:32,crit:0,brk:0,dmgR:0,value:231140,ds:"创世宝鼎，造化万物，灵气无量。", need:{"zijinm":18,"qilinj":14,"jiuyang":8,"fenghuangy":6,"hunjing":1,"taichu":1,"chuangshij":2}},
  ]},
  {cat:"阵法", ic:"⛩️", ds:"布置法阵", rec:[
    {id:"juling",name:"聚灵阵图",ic:"🌀",value:614,eff:"ess_flat",val:25,durMin:30,maxStack:5,ds:"聚灵成阵，灵气自涌，修炼加速。", need:{"iron":24,"herb":22,"skin":12,"gold":6,"fea":8}},
    {id:"jingxin",name:"静心阵",ic:"🧘",value:2487,eff:"crit",val:10,durMin:60,maxStack:4,ds:"静心凝神，会心澄澈，外邪不侵。", need:{"herb":26,"zishen":8,"bone":18,"tort":12,"lingzhi":5}},
    {id:"hushen",name:"护身阵",ic:"🛡️",value:991,eff:"dmg_reduce",val:15,durMin:60,maxStack:2,ds:"护身法阵，坚如磐石，减免伤势。", need:{"iron":22,"bone":20,"skin":10,"tort":12}},
    {id:"jianzhen",name:"剑阵图",ic:"🗡️",value:851,eff:"combat",val:8,durMin:60,maxStack:2,ds:"剑气纵横，攻伐凌厉，战力提升。", need:{"iron":24,"gold":10,"skin":18,"tong":12}},
    {id:"taiji",name:"太极阵",ic:"☯️",value:2933,eff:"brk",val:5,durMin:10,maxStack:3,ds:"太极流转，阴阳互济，突破更易。", need:{"qing":8,"han":12,"lingzhi":10,"herb":24,"skin":18}},
    {id:"wuxing",name:"五行聚灵阵",ic:"🎨",value:16744,eff:"ess_flat",val:50,durMin:60,maxStack:4,ds:"五行齐聚，灵气如潮，绵绵不绝。", need:{"qing":20,"core":14,"myst":8,"huoshi":18,"peng":4}},
    {id:"xingdou",name:"星斗凝神阵",ic:"🌌",value:15990,eff:"crit",val:12,durMin:60,maxStack:3,ds:"星斗列阵，神思清明，会心提升。", need:{"zishen":20,"bing":18,"heshouwu":8,"lei":6,"xuanhuang":4}},
    {id:"xuanjia",name:"玄甲护身阵",ic:"🛡️",value:21502,eff:"dmg_reduce",val:20,durMin:60,maxStack:2,ds:"玄甲覆阵，固若金汤，减免伤势。", need:{"qing":22,"xie":16,"jiao":10,"tiger":6,"xuanwubei":2}},
    {id:"tiangang",name:"天罡剑阵",ic:"🗡️",value:23192,eff:"combat",val:12,durMin:60,maxStack:2,ds:"天罡剑气，所向披靡，战力大增。", need:{"qing":18,"lei":6,"xie":16,"jiao":10,"zhu":6,"fenghuangy":2}},
    {id:"liangyi",name:"两仪破境阵",ic:"☯️",value:44408,eff:"brk",val:8,durMin:10,maxStack:2,ds:"两仪相生，破境开悟，突破更易。", need:{"qing":20,"core":16,"bing":18,"xlangz":4,"yinyangh":6}},
    {id:"jiuyao",name:"九曜聚灵阵",ic:"✨",value:51870,eff:"ess_pct",val:8,durMin:120,maxStack:2,ds:"九曜聚灵，星光入阵，灵气暴涨。", need:{"peng":18,"jiuye":16,"xuanhuang":10,"xinghui":4,"wanfuf":2,"zixiaot":2}},
    {id:"taiyin",name:"太阴定神阵",ic:"🌙",value:70850,eff:"crit",val:16,durMin:120,maxStack:1,ds:"太阴镇魂，神念如冰，会心大增。", need:{"niepan":18,"peng":16,"xianhe":10,"xinghui":2,"yinyangh":2,"jiuyang":2,"hunyuan":1}},
    {id:"hundunhudun",name:"混元护盾阵",ic:"🛰️",value:63232,eff:"dmg_reduce",val:25,durMin:120,maxStack:1,ds:"混元护盾，万法难侵，减免伤势。", need:{"jiuye":18,"peng":16,"longxue":8,"liuli":6,"xuanwubei":2,"hunyuan":1}},
    {id:"zhuxian",name:"诛仙剑阵",ic:"⚔️",value:84968,eff:"combat",val:20,durMin:120,maxStack:1,ds:"诛仙剑阵，杀伐果断，战力滔天。", need:{"xuanhuang":18,"niepan":16,"chiyan":8,"xinghui":4,"wanfuf":2,"taotieg":1,"hunjing":1}},
    {id:"fengshen",name:"封神破妄阵",ic:"🏯",value:76700,eff:"brk",val:10,durMin:10,maxStack:1,ds:"封神破妄，直指本心，突破无碍。", need:{"xuanhuang":20,"jiuye":16,"xlangz":6,"qilinj":4,"tianwai":2,"biluoy":2,"hunyuan":1}},
    {id:"hongmengjuling",name:"鸿蒙聚灵大阵",ic:"🌌",value:147160,eff:"ess_pct",val:10,durMin:120,maxStack:1,ds:"鸿蒙聚灵，天地灵气尽归，产出无双。", need:{"xinghui":10,"zijinm":14,"wanfuf":10,"jiuyang":4,"hongmengj":1,"chuangshil":1}},
    {id:"hundunding",name:"混沌定魂阵",ic:"🌑",value:161200,eff:"crit",val:22,durMin:120,maxStack:1,ds:"混沌定魂，神念不朽，会心无双。", need:{"zixiaot":20,"qilinj":14,"yinyangh":10,"xinghui":4,"hunjing":1,"taichu":1}},
    {id:"wujijinshenz",name:"无极金身大阵",ic:"🛡️",value:190970,eff:"dmg_reduce",val:30,durMin:120,maxStack:1,ds:"无极金身，万劫不磨，减免伤势。", need:{"wanfuf":18,"zixiaot":14,"tianwai":10,"biluoy":6,"xuanwubei":2,"yinglongl":1,"chuangshij":1}},
    {id:"wanjian",name:"万剑诛仙阵",ic:"🗡️",value:183560,eff:"combat",val:30,durMin:120,maxStack:1,ds:"万剑归宗，诛仙灭魔，战力无双。", need:{"zhulongm":14,"xinghui":6,"fenghuangy":10,"qilinj":8,"zijinm":2,"yinglongl":1,"hongmengj":1,"chuangshij":1}},
    {id:"jiuzhuanzheng",name:"九转证道大阵",ic:"🪷",value:238940,eff:"brk",val:15,durMin:10,maxStack:1,ds:"九转证道，大道可期，突破无碍。", need:{"qilinj":18,"xinghui":6,"jiuyang":10,"fenghuangy":8,"chuangshil":1,"zulongy":1,"changsheng":1}},
  ]},
];
const REC_RARE={jufu:1,ningshen:2,dundi:1,yuhuo:2,pojun:3,xuanling:4,zhenfu:5,jiadun:4,fentian:5,zixiao:6,taichufu:7,dinghun:8,hundunfu:7,jiuyangfu:8,zhuxianpo:9,hunyuanqi:10,taiyizhen:10,wujidun:10,hundunpo:10,hongmengzheng:10,juqi:1,chuiti:1,yangshen:2,zhuji:2,jinganghu:3,huiling:4,huoyuancu:4,qiqiao:5,pojing:5,xuanguihu:6,tianyuan:7,jiuzhuanlian:8,taiyiding:8,poxudujie:9,hundunhu:9,hundunzaohua:10,daoticuihuo:10,hongmengding:10,jiuzhuanpoxu:10,wujijinshen:10,juling:1,jingxin:1,hushen:2,jianzhen:2,taiji:3,wuxing:4,xingdou:5,xuanjia:4,tiangang:5,liangyi:6,jiuyao:7,taiyin:8,hundunhudun:7,zhuxian:8,fengshen:9,hongmengjuling:10,hundunding:10,wujijinshenz:10,wanjian:10,jiuzhuanzheng:10,mu_kui:3,qingfengjian:1,xuantiekui:2,tielinjia:1,xuantiejie:2,feicui:3,yunling:1,zihulu:3,liangtianchi:4,zijinguan:5,fuyaosuo:4,chiyanhuan:5,qiankun:6,dingling:4,qinglian:5,yinyangjing:7,taixuguan:8,xingtian:7,jiuyaohuan:8,dayan:9,suoling:9,hundundingq:8,haotianjing:10,hongmengzjg:10,taiyixuanjia:10,hundunhuan:10,taiyijie:10,dadao:10,chuangshiding:10};
const REC_BY_ID={}; CRAFT.forEach(c=>c.rec.forEach(r=>{ r.rarity=REC_RARE[r.id]||1; REC_BY_ID[r.id]=r; }));
/* 符箓贴图映射（v21）：制造/背包/坊市/拍卖/增益条统一走 icOf()，无图配方回退 emoji */
const FU_IMG={jufu:"贴图/符箓/聚灵符.png",dundi:"贴图/符箓/遁地符.png",yuhuo:"贴图/符箓/御火符.png",ningshen:"贴图/符箓/凝神符.png",pojun:"贴图/符箓/破军符.jpg",xuanling:"贴图/符箓/玄灵符.jpg",jiadun:"贴图/符箓/金甲遁地.jpg",zhenfu:"贴图/符箓/镇神符.jpg",fentian:"贴图/符箓/焚天御火.jpg",zixiao:"贴图/符箓/紫霄破阵.jpg",hundunfu:"贴图/符箓/混元遁形.jpg",dinghun:"贴图/符箓/定魂.jpg",jiuyangfu:"贴图/符箓/九阳焚天.jpg",zhuxianpo:"贴图/符箓/诛仙破妄.jpg",hunyuanqi:"贴图/符箓/混元一气.jpg",taiyizhen:"贴图/符箓/太一镇神符.jpg",wujidun:"贴图/符箓/无极遁世符.jpg",hundunpo:"贴图/符箓/混沌破天符.jpg",hongmengzheng:"贴图/符箓/鸿蒙证道符.jpg",taichufu:"贴图/符箓/太初灵符.jpeg"};
/* 功法贴图映射（v22）：贴图/功法/ 下 20 张，统一走 icOf() */
const GONG_IMG={yj:"贴图/功法/黄庭经.jpg",lz:"贴图/功法/炼气真经.jpg",xp:"贴图/功法/玄牝功.jpg",qq:"贴图/功法/青莲剑歌.jpg",zf:"贴图/功法/紫府真章.jpg",tz:"贴图/功法/太乙玄功.jpg",xt:"贴图/功法/玄天经.jpg",cs:"贴图/功法/长春不老功.jpg",dz:"贴图/功法/大周天诀.jpg",hd:"贴图/功法/混元一气.jpg",jw:"贴图/功法/金乌诀.jpg",wf:"贴图/功法/万物生息诀.jpg",xx:"贴图/功法/星宿真经.jpg",ql:"贴图/功法/青龙九章.jpg",jh:"贴图/功法/九转玄功.jpg",ts:"贴图/功法/天地同寿诀.jpg",ht:"贴图/功法/混沌诀.jpg",tx:"贴图/功法/太虚神录.jpg",wl:"贴图/功法/无量真经.jpg",hm:"贴图/功法/鸿蒙大道经.jpg"};
/* 丹药贴图映射（v23）：贴图/丹药/ 下 20 张（文件名带品级前缀），统一走 icOf() */
const DANYAO_IMG={juqi:"贴图/丹药/1聚气丹.png",chuiti:"贴图/丹药/1淬体丹.png",yangshen:"贴图/丹药/1养神丹.png",zhuji:"贴图/丹药/1筑基丹.png",jinganghu:"贴图/丹药/1金刚护体丹.png",huiling:"贴图/丹药/2回灵丹.png",huoyuancu:"贴图/丹药/2火元淬体丹.png",qiqiao:"贴图/丹药/2七窍养神丹.png",pojing:"贴图/丹药/2破境丹.png",xuanguihu:"贴图/丹药/2玄龟护体丹.png",tianyuan:"贴图/丹药/3天元丹.png",jiuzhuanlian:"贴图/丹药/3九转炼体丹.png",taiyiding:"贴图/丹药/3太一定神丹.png",poxudujie:"贴图/丹药/3破虚渡劫丹.png",hundunhu:"贴图/丹药/3混元护体丹.png",hundunzaohua:"贴图/丹药/4混沌造化丹.png",daoticuihuo:"贴图/丹药/4道体淬炼丹.png",hongmengding:"贴图/丹药/4鸿蒙定魂丹.png",jiuzhuanpoxu:"贴图/丹药/4九转破虚丹.png",wujijinshen:"贴图/丹药/4无极金身丹.png"};
/* 炼器贴图映射（v24）：贴图/炼器/ 下 26 张（紫金葫芦/紫金冠无图保留 emoji） */
const LQ_IMG={qingfengjian:"贴图/炼器/青锋剑.jpg",xuantiekui:"贴图/炼器/玄铁盔.jpg",tielinjia:"贴图/炼器/铁鳞甲.jpg",xuantiejie:"贴图/炼器/玄铁戒.jpg",feicui:"贴图/炼器/翡翠指环.jpg",yunling:"贴图/炼器/蕴灵珠串.jpg",liangtianchi:"贴图/炼器/量天尺_6ba4690a-f75f-4dd8-bd2d-2ea575bc56ad_PhotoGrid.png",fuyaosuo:"贴图/炼器/缚妖索.jpeg",qiankun:"贴图/炼器/乾坤戒_f3f521cc-f1fa-44fd-a58d-5a88ef5e36f5_PhotoGrid.png",dingling:"贴图/炼器/定灵珠.png",qinglian:"贴图/炼器/青莲宝座.png",yinyangjing:"贴图/炼器/阴阳镜.jpg",taixuguan:"贴图/炼器/太虚冠.jpg",xingtian:"贴图/炼器/星辰鉴.webp",jiuyaohuan:"贴图/炼器/九耀戒指.webp",dayan:"贴图/炼器/大衍戒.webp",suoling:"贴图/炼器/锁灵珠串.webp",hundundingq:"贴图/炼器/混元鼎.webp",haotianjing:"贴图/炼器/昊天镜.webp",hongmengzjg:"贴图/炼器/鸿蒙紫金冠.webp",taiyixuanjia:"贴图/炼器/太一甲.webp",hundunhuan:"贴图/炼器/混沌指环.webp",taiyijie:"贴图/炼器/太一戒.webp",dadao:"贴图/炼器/大道珠串.webp",chuangshiding:"贴图/炼器/创世鼎.webp",chiyanhuan:"贴图/炼器/火焰环.jpeg"};
/* 阵法贴图映射（v24）：贴图/阵法/ 下 20 张 */
const ZHENFA_IMG={juling:"贴图/阵法/聚灵阵.jpg",jingxin:"贴图/阵法/静心阵.jpg",hushen:"贴图/阵法/护身阵.jpg",jianzhen:"贴图/阵法/剑阵.jpg",taiji:"贴图/阵法/太极阵.jpg",wuxing:"贴图/阵法/五行聚灵阵.jpg",xingdou:"贴图/阵法/星斗凝神阵.jpg",xuanjia:"贴图/阵法/玄甲护身阵.jpg",tiangang:"贴图/阵法/天罡剑阵.jpg",liangyi:"贴图/阵法/两仪破境阵.jpg",jiuyao:"贴图/阵法/九曜聚灵阵.jpg",taiyin:"贴图/阵法/太阴定神阵.jpg",hundunhudun:"贴图/阵法/混元护盾阵.jpg",zhuxian:"贴图/阵法/诛仙剑阵.jpg",fengshen:"贴图/阵法/封神破妄阵.jpg",hongmengjuling:"贴图/阵法/鸿蒙聚灵大阵.jpg",hundunding:"贴图/阵法/混沌定魂阵.jpg",wujijinshenz:"贴图/阵法/无极金身大阵.jpg",wanjian:"贴图/阵法/万剑诛仙阵.jpg",jiuzhuanzheng:"贴图/阵法/九转证道大阵.jpg"};
const EGG_IMG={"eg1":"贴图/灵兽蛋/eg1.svg","eg2":"贴图/灵兽蛋/eg2.svg","eg3":"贴图/灵兽蛋/eg3.svg","eg4":"贴图/灵兽蛋/eg4.svg","eg5":"贴图/灵兽蛋/eg5.svg","eg6":"贴图/灵兽蛋/eg6.svg","eg7":"贴图/灵兽蛋/eg7.svg","eg8":"贴图/灵兽蛋/eg8.svg","eg9":"贴图/灵兽蛋/eg9.svg","eg10":"贴图/灵兽蛋/eg10.svg"};
const SPELL_IMG={"s-jin1":"贴图/技能/s-jin1.svg","s-jin2":"贴图/技能/s-jin2.svg","s-jin3":"贴图/技能/s-jin3.svg","s-jin4":"贴图/技能/s-jin4.svg","s-mu1":"贴图/技能/s-mu1.svg","s-mu2":"贴图/技能/s-mu2.svg","s-mu3":"贴图/技能/s-mu3.svg","s-mu4":"贴图/技能/s-mu4.svg","s-shui1":"贴图/技能/s-shui1.svg","s-shui2":"贴图/技能/s-shui2.svg","s-shui3":"贴图/技能/s-shui3.svg","s-shui4":"贴图/技能/s-shui4.svg","s-huo1":"贴图/技能/s-huo1.svg","s-huo2":"贴图/技能/s-huo2.svg","s-huo3":"贴图/技能/s-huo3.svg","s-huo4":"贴图/技能/s-huo4.svg","s-tu1":"贴图/技能/s-tu1.svg","s-tu2":"贴图/技能/s-tu2.svg","s-tu3":"贴图/技能/s-tu3.svg","s-tu4":"贴图/技能/s-tu4.svg","s-ice1":"贴图/技能/s-ice1.svg","s-ice2":"贴图/技能/s-ice2.svg","s-ice3":"贴图/技能/s-ice3.svg","s-ice4":"贴图/技能/s-ice4.svg","s-lei1":"贴图/技能/s-lei1.svg","s-lei2":"贴图/技能/s-lei2.svg","s-lei3":"贴图/技能/s-lei3.svg","s-lei4":"贴图/技能/s-lei4.svg","s-feng1":"贴图/技能/s-feng1.svg","s-feng2":"贴图/技能/s-feng2.svg","s-feng3":"贴图/技能/s-feng3.svg","s-feng4":"贴图/技能/s-feng4.svg","s-du1":"贴图/技能/s-du1.svg","s-du2":"贴图/技能/s-du2.svg","s-du3":"贴图/技能/s-du3.svg","s-du4":"贴图/技能/s-du4.svg","s-yiny1":"贴图/技能/s-yiny1.svg","s-yiny2":"贴图/技能/s-yiny2.svg","s-yiny3":"贴图/技能/s-yiny3.svg","s-yiny4":"贴图/技能/s-yiny4.svg","j1":"贴图/技能/j1.svg","x1":"贴图/技能/x1.svg","s1":"贴图/技能/s1.svg","z1":"贴图/技能/z1.svg","x2":"贴图/技能/x2.svg","s3":"贴图/技能/s3.svg","m1":"贴图/技能/m1.svg","j2":"贴图/技能/j2.svg","s2":"贴图/技能/s2.svg","z2":"贴图/技能/z2.svg","m2":"贴图/技能/m2.svg","p1":"贴图/技能/p1.svg"};
/* 灵兽美术：贴图/灵兽/灵兽立绘/<中文名>_立绘.png(.jpeg) 作为兽栏/图鉴头像；
   动态循环视频 贴图/灵兽/<中文名>.mp4 用于破壳展示与▶动态播放。
   映射按当前目录文件维护；缺图时显示占位符，不伪造美术 */
const PET_IMG={
  "mulingt":"贴图/灵兽/灵兽立绘/木灵兔_立绘.jpeg","qingtengy":"贴图/灵兽/灵兽立绘/青藤猿_立绘.png","jianmusl":"贴图/灵兽/灵兽立绘/建木神鹿_立绘.png",
  "yanjiaxg":"贴图/灵兽/灵兽立绘/岩甲玄龟_立绘.png","dimaikn":"贴图/灵兽/灵兽立绘/地脉夔牛_立绘.png","houtuoql":"贴图/灵兽/灵兽立绘/后土麒麟_立绘.png",
  "yululil":"贴图/灵兽/灵兽立绘/玉露灵鲤_立绘.png","biboxs":"贴图/灵兽/灵兽立绘/碧波玄蛇_立绘.png","beimilk":"贴图/灵兽/灵兽立绘/北冥灵鲲_立绘.png",
  "chiyanlm":"贴图/灵兽/灵兽立绘/赤焰灵猫_立绘.jpeg","yanlinhp":"贴图/灵兽/灵兽立绘/炎鳞火蟒_立绘.png","chiyanzq":"贴图/灵兽/灵兽立绘/赤炎朱雀_立绘.png",
  "jinjiax":"贴图/灵兽/灵兽立绘/金甲玄犀_立绘.png","xuanjinjh":"贴图/灵兽/灵兽立绘/玄金剑虎_立绘.png","baihusb":"贴图/灵兽/灵兽立绘/白虎圣兽_立绘.png",
  "jifenglq":"贴图/灵兽/灵兽立绘/疾风灵雀_立绘.png","zhuifengtl":"贴图/灵兽/灵兽立绘/追风天狼_立绘.png","jinchidp":"贴图/灵兽/灵兽立绘/金翅大鹏_立绘.png",
  "shuangjxs":"贴图/灵兽/灵兽立绘/霜晶雪貂_立绘.png","hanyuanbp":"贴图/灵兽/灵兽立绘/寒渊冰蟒_立绘.png","xuanbingth":"贴图/灵兽/灵兽立绘/玄冰天凰_立绘.png",
  "leiwenzd":"贴图/灵兽/灵兽立绘/雷纹紫貂_立绘.jpeg","zidianlb":"贴图/灵兽/灵兽立绘/紫电雷豹_立绘.png","tianleiql":"贴图/灵兽/灵兽立绘/天雷麒麟_立绘.png",
  "biduch":"贴图/灵兽/灵兽立绘/碧毒蟾_立绘.png","jiuyoump":"贴图/灵兽/灵兽立绘/九幽毒蟒_立绘.png","wanguwdm":"贴图/灵兽/灵兽立绘/万蛊毒母_立绘.png",
  "shuangwlm":"贴图/灵兽/灵兽立绘/双尾灵猫_立绘.png","taijixg":"贴图/灵兽/灵兽立绘/太极玄龟_立绘.png","hundunys":"贴图/灵兽/灵兽立绘/混沌阴阳兽_立绘.png"
};
const PET_VID={
  "mulingt":"贴图/灵兽/木灵兔.mp4","qingtengy":"贴图/灵兽/青藤猿.mp4","jianmusl":"贴图/灵兽/建木神鹿.mp4",
  "yanjiaxg":"贴图/灵兽/岩甲玄龟.mp4","dimaikn":"贴图/灵兽/地脉夔牛.mp4","houtuoql":"贴图/灵兽/后土麒麟.mp4",
  "yululil":"贴图/灵兽/玉露灵鲤.mp4","biboxs":"贴图/灵兽/碧波玄蛇.mp4","beimilk":"贴图/灵兽/北冥灵鲲.mp4",
  "chiyanlm":"贴图/灵兽/赤焰灵猫.mp4","yanlinhp":"贴图/灵兽/炎鳞火蟒.mp4","chiyanzq":"贴图/灵兽/赤炎朱雀.mp4",
  "leiwenzd":"贴图/灵兽/雷纹紫貂.mp4","jinjiax":"贴图/灵兽/金甲玄犀.mp4","xuanjinjh":"贴图/灵兽/玄金剑虎.mp4"
};
function petArtHtml(b,size){
  const src=PET_IMG[b.id];
  if(src) return '<img class="petArt" src="'+src+'" alt="'+b.name+'" style="width:'+(size||64)+'px;height:'+(size||64)+'px" loading="lazy">';
  return '<span class="petPh" title="'+b.name+'：待放入 '+('贴图/灵兽/'+b.id+'.webp')+'"><span>'+b.ic+'</span><span class="phR">稀'+b.rarity+'</span></span>';
}
function icOf(o,size){
  const p=o&&(FU_IMG[o.id]||GONG_IMG[o.id]||DANYAO_IMG[o.id]||LQ_IMG[o.id]||ZHENFA_IMG[o.id]||PET_IMG[o.id]||EGG_IMG[o.id]||SPELL_IMG[o.id]);
  if(p) return '<img class="icImg" src="'+p+'" alt="'+o.name+'" style="width:'+(size||30)+'px;height:'+(size||30)+'px;object-fit:cover;border-radius:6px;vertical-align:middle;margin-right:2px">';
  return o.ic||""; // v29.1 无图标对象（技能书/身法等无 ic 字段）回退空串，避免名字前出现 undefined
}
function effText(r){
  const suf = (r.maxStack>1)? "，可叠加至 "+r.maxStack+" 层" : "";
  let base="";
  switch(r.eff){
    case "ess_flat": base="灵气产出 +"+r.val+" 点，持续 "+r.durMin+" 分钟"+suf; break;
    case "ess_pct":  base="灵气产出 +"+r.val+"%，持续 "+r.durMin+" 分钟"+suf; break;
    case "brk":      base="突破成功率 +"+r.val+"%，持续 "+r.durMin+" 分钟"+suf+"（突破率上限 80%）"; break;
    case "crit":     base="会心概率 +"+r.val+"%，持续 "+r.durMin+" 分钟"+suf; break;
    case "combat":   base="战力 +"+r.val+"%，持续 "+r.durMin+" 分钟"+suf; break;
    case "dmg_reduce": base="秘境受伤减免 "+r.val+"%，持续 "+r.durMin+" 分钟"+suf; break;
  }
  if(r.heal) base += (base?" · ":"")+"服用恢复气血 "+r.heal+"%";
  return base;
}
function buffEffSum(eff){
  let sum=0; const now=Date.now();
  for(const id in S.buffs){ const b=S.buffs[id]; if(b.until<=now) continue; const r=REC_BY_ID[id]; if(r && r.eff===eff) sum+=r.val*b.stack; }
  return sum;
}

/* 神通库（战斗系统使用的技能） */
const SHEN = [
  {id:"j1", name:"太虚剑诀", cat:"剑诀", ic:"⚔️", tier:"下品", combat:0.10, cost:20,  ds:"剑出太虚，破敌之先。"},
  {id:"x1", name:"九转玄功", cat:"心法", ic:"🌀", tier:"下品", combat:0.08, cost:20,  ds:"九转护体，气血绵长。"},
  {id:"s1", name:"御火术",   cat:"仙术", ic:"🔥", tier:"下品", combat:0.12, cost:20,  ds:"御火焚天，攻伐凌厉。"},
  {id:"z1", name:"天罡北斗阵",cat:"阵法",ic:"🌌", tier:"中品", combat:0.15, cost:40,  ds:"北斗列阵，困敌护己。"},
  {id:"x2", name:"混元一气", cat:"心法", ic:"☯️", tier:"中品", combat:0.12, cost:40,  ds:"混元护身，卸力化劲。"},
  {id:"s3", name:"呼风唤雨", cat:"仙术", ic:"🌧️", tier:"中品", combat:0.18, cost:40,  ds:"呼风唤雨，掌控战局。"},
  {id:"m1", name:"大衍神算", cat:"秘术", ic:"🔮", tier:"上品", combat:0.20, cost:70,  ds:"窥探天机，料敌先机。"},
  {id:"j2", name:"万剑归宗", cat:"剑诀", ic:"🗡️", tier:"上品", combat:0.25, cost:70,  ds:"万剑齐发，一往无前。"},
  {id:"s2", name:"九霄雷法", cat:"仙术", ic:"⚡", tier:"上品", combat:0.28, cost:70,  ds:"召九霄神雷，毁天灭地。"},
  {id:"z2", name:"诛仙剑阵", cat:"阵法", ic:"🛡️", tier:"极品", combat:0.35, cost:110, ds:"诛仙剑阵，势不可挡。"},
  {id:"m2", name:"天魔解体大法",cat:"禁术",ic:"👹", tier:"极品", combat:0.40, cost:110, ds:"以命搏命，战力暴增。"},
  {id:"p1", name:"法天象地", cat:"神通", ic:"🏛️", tier:"至尊", combat:0.50, cost:180, ds:"法相天地，威压众生。"},
];

/* 灵根（31 种） */
const WX = ["金","木","水","火","土"];
const WX_IC = {金:"🟡",木:"🟢",水:"🔵",火:"🔴",土:"🟤"};
const PARAM = {
  single:{speed:2.0, req:0.40, cap:0.10, combat:0.30},
  double:{speed:1.6, req:0.60, cap:0.20, combat:0.25},
  triple:{speed:1.3, req:0.80, cap:0.30, combat:0.20},
  quad:  {speed:1.15,req:1.00, cap:0.40, combat:0.15},
  quint: {speed:1.0, req:1.25, cap:0.50, combat:0.10},
};
const MUT = [
  {id:"mut-ice",  name:"冰灵根", ic:"❄️", speed:1.8, req:0.40, cap:0.35, combat:0.20, extra:{break:0.08},  ds:"寒冰之体，突破更易。"},
  {id:"mut-thun", name:"雷灵根", ic:"⚡", speed:1.8, req:0.40, cap:0.35, combat:0.20, extra:{crit:0.20},   ds:"天雷之体，会心大增。"},
  {id:"mut-wind", name:"风灵根", ic:"🌪️", speed:1.8, req:0.40, cap:0.35, combat:0.20, extra:{bs:0.15},    ds:"御风之体，身法如风（战斗速度+15%、闪避+10%）。"},
  {id:"mut-ven",  name:"毒灵根", ic:"☠️", speed:1.8, req:0.40, cap:0.35, combat:0.25, extra:{},           ds:"万毒之体，战力大增（+25%）。"},
  {id:"mut-yin",  name:"阴阳灵根",ic:"☯️", speed:2.2, req:0.40, cap:0.35, combat:0.20, extra:{dao:0.25},   ds:"阴阳之体，大道碎片大增。"},
];
function combos(arr,k){ const res=[]; function rec(s,st){ if(st.length===k){res.push(st.slice());return;} for(let i=s;i<arr.length;i++){st.push(arr[i]);rec(i+1,st);st.pop();} } rec(0,[]); return res; }
const ROOTS=[];
ROOTS.push({id:"root-金",name:"金灵根",ic:WX_IC["金"],type:"single",elems:["金"],speed:PARAM.single.speed,reqMult:PARAM.single.req,breakCap:PARAM.single.cap,combat:PARAM.single.combat,ds:"五行纯一，修炼最快、战力最强、突破最难。"});
ROOTS.push({id:"root-木",name:"木灵根",ic:WX_IC["木"],type:"single",elems:["木"],speed:PARAM.single.speed,reqMult:PARAM.single.req,breakCap:PARAM.single.cap,combat:PARAM.single.combat,ds:"五行纯一，修炼最快、突破最难。"});
ROOTS.push({id:"root-水",name:"水灵根",ic:WX_IC["水"],type:"single",elems:["水"],speed:PARAM.single.speed,reqMult:PARAM.single.req,breakCap:PARAM.single.cap,combat:PARAM.single.combat,ds:"五行纯一，修炼最快、突破最难。"});
ROOTS.push({id:"root-火",name:"火灵根",ic:WX_IC["火"],type:"single",elems:["火"],speed:PARAM.single.speed,reqMult:PARAM.single.req,breakCap:PARAM.single.cap,combat:PARAM.single.combat,ds:"五行纯一，修炼最快、突破最难。"});
ROOTS.push({id:"root-土",name:"土灵根",ic:WX_IC["土"],type:"single",elems:["土"],speed:PARAM.single.speed,reqMult:PARAM.single.req,breakCap:PARAM.single.cap,combat:PARAM.single.combat,ds:"五行纯一，修炼最快、突破最难。"});
const DOUBLES=[["金","水"],["水","木"],["木","火"],["火","土"],["土","金"]];
DOUBLES.forEach(p=>{ ROOTS.push({id:"root-"+p.join(""),name:p.join("")+"双灵根",ic:"🔁",type:"double",elems:p.slice(),speed:PARAM.double.speed,reqMult:PARAM.double.req,breakCap:PARAM.double.cap,combat:PARAM.double.combat,ds:"相生双灵根，兼顾修炼与突破。"}); });
combos(WX,3).forEach(p=>{ ROOTS.push({id:"root-"+p.join(""),name:p.join("")+"三灵根",ic:"🔃",type:"triple",elems:p.slice(),speed:PARAM.triple.speed,reqMult:PARAM.triple.req,breakCap:PARAM.triple.cap,combat:PARAM.triple.combat,ds:"三灵根，战力渐强。"}); });
combos(WX,4).forEach(p=>{ ROOTS.push({id:"root-"+p.join(""),name:p.join("")+"四灵根",ic:"💠",type:"quad",elems:p.slice(),speed:PARAM.quad.speed,reqMult:PARAM.quad.req,breakCap:PARAM.quad.cap,combat:PARAM.quad.combat,ds:"四灵根，突破更稳、战力更强。"}); });
ROOTS.push({id:"root-五行",name:"五灵根",ic:"🌟",type:"quint",elems:WX.slice(),speed:PARAM.quint.speed,reqMult:PARAM.quint.req,breakCap:PARAM.quint.cap,combat:PARAM.quint.combat,ds:"五行俱全，突破最稳、战力均衡。"});
MUT.forEach(m=>{ ROOTS.push({id:m.id,name:m.name,ic:m.ic,type:"mut",elems:[m.name.slice(0,1)],speed:m.speed,reqMult:m.req,breakCap:m.cap,combat:m.combat,extra:m.extra,ds:m.ds}); });

/* 境界（req 为 v4 ×100 后数值） */
const REALMS = [
  {full:"炼气期", desc:"初入仙途，凡躯炼灵，采气入体。", req:0,     mult:1,     unlock:0},
  {full:"筑基期", desc:"筑基凝神，根基初成，灵气入体。", req:16000,  mult:3,     unlock:1},
  {full:"金丹期", desc:"金丹大成，丹火焚身，气贯长河。", req:240000, mult:10,    unlock:2},
  {full:"元婴期", desc:"元婴出窍，神游太虚，法力通玄。", req:4e6,    mult:35,    unlock:3},
  {full:"化神期", desc:"化神登临，可开飞升之门。",       req:6.4e7,    mult:120,   unlock:4},
  {full:"炼虚期", desc:"炼虚合道，剑指苍天。",           req:2e10, mult:420,   unlock:5},
  {full:"合体期", desc:"合体归一，力破虚空。",           req:4e11,   mult:1500,  unlock:6},
  {full:"大乘期", desc:"大乘圆满，万象归一。",           req:8e12,   mult:5400,  unlock:7},
  {full:"渡劫期", desc:"渡劫飞升，逆天改命。",           req:1.6e14,   mult:20000, unlock:8},
  {full:"真仙境", desc:"飞升成仙，逍遥九天。",           req:4e15,   mult:75000, unlock:9},
];
function realm(){ return REALMS[Math.min(S.realm, REALMS.length-1)]; }
function realmAt(n){ return REALMS[Math.min(n, REALMS.length-1)]; }

/* 成就（v30.4：等级突破 r1-r4 合并为「境界突破」、灵气产量 p1/p2 合并为「灵气如潮」、一朝飞升改多次领取累计奖励、新增每种强化里程碑成就；rw 可为函数 g=>奖励 表示第 g 次领取的奖励） */
const ACHS = [
  {id:"root2", nm:"万中无一",   ds:"拥有灵根（选择任意灵根）", ic:"💎", rw:5000, cond:s=>!!s.root},
  {id:"r",     nm:"境界突破",   ds:"每突破一个大境界可领一次（筑基→金丹→元婴→化神…奖励递增）", ic:"🏮", rw:g=>200*Math.pow(10,g-1), multi:true, step:1, max:10, prog:s=>s.realm, cond:s=>s.realm>=1},
  {id:"g2",    nm:"兽潮涌动",   ds:"每孵化 20 灵兽可领一次",     ic:"🐉", rw:g=>50*Math.pow(10,g-1), multi:true, step:20, max:20, prog:s=>s.hatchCnt||0, cond:s=>(s.hatchCnt||0)>=20},
  {id:"p",     nm:"灵气如潮",   ds:"灵气产量每达一档（100/1K/1M/1G/1T 每秒…）可领一次，奖励随档位递增", ic:"💨", rw:g=>1000*Math.pow(100,g-1), multi:true, step:1, max:10, prog:()=>{ const v=prodPerSec(); if(v<100) return 0; if(v<1e3) return 1; return Math.floor(Math.log(v/1e3)/Math.log(1000))+2; }, cond:()=>prodPerSec()>=100},
  {id:"d1",    nm:"一朝飞升",   ds:"每飞升一次可领一次累计奖励", ic:"🦢", rw:g=>100000*g, multi:true, step:1, max:20, prog:s=>s.ascensions, cond:s=>s.ascensions>=1},
  {id:"d2",    nm:"碎片盈身",   ds:"每累计 100 大道碎片可领一次",   ic:"💫", rw:1000, multi:true, step:100, max:20, prog:s=>s.daoTotal, cond:s=>s.daoTotal>=100},
  {id:"d3",    nm:"问道长生",   ds:"每累计 1000 大道碎片可领一次",  ic:"🌠", rw:10000, multi:true, step:1000, max:10, prog:s=>s.daoTotal, cond:s=>s.daoTotal>=1000},
  /* v30.4 每种强化里程碑：设施/修行升级达 10/50/100 级，之后每 50 级各领一次（thr 为起点阈值，超出末阈值按每 50 级一次递推） */
  ...FAC.map((f,i)=>({id:"fa"+f.id, nm:"设施·"+f.name, ds:"强化「"+f.name+"」达 10/50/100/之后每50级各领一次", ic:f.ic, rw:g=>200*(g+1), multi:true, thr:[10,50,100], max:999, prog:s=>s.fa[i], cond:s=>s.fa[i]>=10})),
  ...UPS.map(u=>({id:"up"+u.id, nm:"修行·"+u.name, ds:"强化「"+u.name+"」达 10/50/100/之后每50级各领一次", ic:u.ic, rw:g=>200*(g+1), multi:true, thr:[10,50,100], max:999, prog:s=>s.ups[u.id], cond:s=>s.ups[u.id]>=10})),
];

/* 随机事件 */
const EVENTS=[
  {id:"rain", nm:"天降灵雨", good:true,  txt:"灵雨润泽，60秒内修炼速度翻倍！", fx:()=>{ evt.prodBoost=Date.now()+60000; }},
  {id:"heart",nm:"心魔来袭", good:false, txt:"心魔突袭，灵台蒙尘！300秒内修炼速度减半，且灵气散失 5%（损失上限＝当前突破所需灵力的 2%）。", fx:()=>{ evt.prodPenalty=Date.now()+300000; const cap=Math.max(1,Math.floor(realmNeed()*0.02)); const l=Math.min(Math.floor(S.essence*0.05), cap); if(l>0){ S.essence-=l; logEvent("心魔之下，灵气散失 "+fmt(l)+"（上限 "+fmt(cap)+"）！",'warn'); } }},
  {id:"meet", nm:"偶得奇遇", good:true,  txt:"深山偶遇仙缘，收获一笔灵石！", fx:()=>{ const r=Math.random()*100; if(r<90){ const n=Math.max(1,Math.floor(1+Math.random()*50)); S.stoneL+=n; logEvent("奇遇得财，下品灵石 +"+fmt(n)+"！",'sys'); } else if(r<94){ const n=Math.floor(100+Math.random()*900); S.stoneL+=n; logEvent("奇遇得财，下品灵石 +"+fmt(n)+"！",'sys'); } else if(r<97){ const n=Math.floor(10+Math.random()*90); S.stoneM+=n; logEvent("奇遇得财，中品灵石 +"+fmt(n)+"！",'sys'); } else if(r<99){ const n=Math.floor(1+Math.random()*9); S.stoneH+=n; logEvent("奇遇得财，上品灵石 +"+fmt(n)+"！",'sys'); } else { const n=1+Math.floor(Math.random()*3); S.stoneT+=n; logEvent("惊天奇遇！极品灵石 +"+n+"！",'sys'); } }},
  {id:"dawn", nm:"一朝顿悟", good:true,  txt:"顿悟天道，60秒内修炼速度翻倍、突破成功率+10%！", fx:()=>{ evt.prodBoost=Date.now()+60000; evt.breakBoost=Date.now()+60000; evt.breakBoostAmt=0.10; }},
  {id:"tide", nm:"灵气潮汐", good:true,  txt:"灵气潮涌，30秒内修炼速度提升三倍！", fx:()=>{ evt.prodBoost3=Date.now()+30000; }},
  {id:"herb", nm:"仙草现世", good:true,  txt:"荒山仙草现世，采得数株灵药！", fx:()=>{ const hs=MATS.filter(m=>m.cat==="草药"); for(let i=0;i<3;i++){ const h=hs[Math.floor(Math.random()*hs.length)]; S.mats[h.id]=(S.mats[h.id]||0)+1; } }},
  {id:"beast",nm:"妖兽袭营", good:false, txt:"妖兽夜袭，撞散储物袋，损失部分材料！", fx:()=>{ const m2=MATS.filter(m=>(S.mats[m.id]||0)>0); if(m2.length){ for(let i=0;i<2;i++){ const m=m2[Math.floor(Math.random()*m2.length)]; const lose=Math.min((S.mats[m.id]||0),3); S.mats[m.id]=(S.mats[m.id]||0)-lose; logEvent("妖兽劫走 "+m.name+" ×"+lose+"！",'warn'); } } }},
  {id:"ruin", nm:"上古秘藏", good:true,  txt:"发掘上古秘藏，获得一批中品灵石与随机采集物！", fx:()=>{ const n=Math.floor(5+Math.random()*45); S.stoneM+=n; const cnt=1+Math.floor(Math.random()*3); const got={}; for(let i=0;i<cnt;i++){ let tot=0; const ws=MATS.map(m=>{ const w=RARITY_POOL_PROB[Math.min(Math.max((m.rarity||1)-1,0),7)]||0; tot+=w; return w; }); let rd=Math.random()*tot; let pick=MATS[MATS.length-1]; for(let j=0;j<MATS.length;j++){ rd-=ws[j]; if(rd<=0){ pick=MATS[j]; break; } } S.mats[pick.id]=(S.mats[pick.id]||0)+1; got[pick.name]=(got[pick.name]||0)+1; } logEvent("秘藏开掘，中品灵石 +"+fmt(n)+"、"+Object.keys(got).map(k=>k+"×"+got[k]).join("、")+"！",'sys'); }},
  {id:"drought",nm:"灵气枯竭", good:false, txt:"地脉枯竭，120秒内修炼速度降至六成。", fx:()=>{ evt.prodLow=Date.now()+120000; }},
  {id:"dao", nm:"大道共鸣", good:true,  txt:"大道共鸣，顿悟灵力，90秒内突破成功率大增！", fx:()=>{ evt.breakBoost=Date.now()+90000; evt.breakBoostAmt=0.30; const g=Math.max(1,Math.floor(realmNeed()*0.02)); S.essence+=g; if(S.lifetime===undefined)S.lifetime=0; S.lifetime+=g; logEvent("大道共鸣，灵力 +"+fmt(g)+"（当前突破所需灵力的 2%）",'sys'); }},
  /* v30.8.7 新增事件：2 吉 + 3 凶 */
  {id:"hunt", nm:"路遇妖兽", good:true,  txt:"路遇妖兽，将其斩杀，夺得妖兽内丹！", fx:()=>{ const n=2+Math.floor(Math.random()*3); S.mats.core=(S.mats.core||0)+n; logEvent("斩杀妖兽，获得妖兽内丹 ×"+n+"！",'sys'); }},
  {id:"forge", nm:"炉火纯青", good:true,  txt:"丹炉火旺，60秒内制造速度翻倍！", fx:()=>{ evt.craftBoost=Date.now()+60000; }},
  {id:"wander", nm:"心猿意马", good:false, txt:"心猿意马，灵台不稳！120秒内突破成功率-20%。", fx:()=>{ evt.breakPenalty=Date.now()+120000; }},
  {id:"thief", nm:"灵石盗匪", good:false, txt:"灵石盗匪夜袭，劫走部分下品灵石！", fx:()=>{ const l=Math.ceil((S.stoneL||0)*0.05); if(l>0){ S.stoneL-=l; logEvent("灵石被盗匪劫走 "+fmt(l)+" 下品灵石！",'warn'); } }},
  {id:"stampede", nm:"百兽奔逃", good:false, txt:"灵兽受惊奔逃，全体出战灵兽饱食度-5！", fx:()=>{ (S.pets||[]).forEach(it=>{ it.sat=Math.max(0,it.sat-5); }); logEvent("百兽奔逃，灵兽饱食度-5",'warn'); }},
];
const evt={breakBoost:0,breakBoostAmt:0.30,prodBoost:0,prodBoost3:0,prodPenalty:0,prodLow:0,craftBoost:0,breakPenalty:0,lastEvent:0,nextAt:Date.now()+180000+Math.random()*420000};

