/* ================================================================
   回合制战斗系统（按《战斗机制设计》v1.0 首期范围实现）
   五行生克 / 法术库40 / 功法被动 / 神通大招 / 技能槽 / 敌方AI / 状态效果
   ================================================================ */
/* 五行生克：金克木、木克土、土克水、水克火、火克金 */
const WX_SHENG={金:"木",木:"土",土:"水",水:"火",火:"金"};
function kezhiMult(myElem, enemyElems){
  if(!myElem) return 1.0;
  let ke=0,be=0;
  (enemyElems||[]).forEach(e=>{ if(WX_SHENG[myElem]===e)ke=1; if(WX_SHENG[e]===myElem)be=1; });
  if(ke)return 1.35; if(be)return 0.8; return 1.0;
}
/* 法术库：10 属性 × 4（伤害/身法各 2）共 40 种。字段：cost耗灵、cd冷却、mult倍率、hits段数、eff特效 */
const SPELLS=[
  // 金
  {id:"s-jin1",name:"金锋斩",elem:"金",type:"dmg",target:"enemy",cost:10,cd:0,mult:1.2,eff:[{k:"pierce",ch:0.40,v:20,t:2}]},
  {id:"s-jin2",name:"万剑穿心",elem:"金",type:"dmg",target:"enemy",cost:30,cd:2,mult:1.8,hitB:0.10},
  {id:"s-jin3",name:"金身不破",elem:"金",type:"shen",target:"self",cost:15,cd:3,eff:[{k:"shield",v:25,t:3},{k:"dmgRed",v:15,t:3}]},
  {id:"s-jin4",name:"锋锐入体",elem:"金",type:"shen",target:"self",cost:10,cd:2,eff:[{k:"nextPower",v:40}]},
  // 木
  {id:"s-mu1",name:"藤蔓缠身",elem:"木",type:"dmg",target:"enemy",cost:10,cd:0,mult:0.9,eff:[{k:"bind",ch:0.70,v:40,t:2}]},
  {id:"s-mu2",name:"荆棘反噬",elem:"木",type:"shen",target:"self",cost:14,cd:1,eff:[{k:"reflectHit",v:20,t:2}]},
  {id:"s-mu3",name:"枯木逢春",elem:"木",type:"fa",target:"self",cost:12,cd:5,eff:[{k:"regen",v:15,t:3}]},
  {id:"s-mu4",name:"木灵遁隐",elem:"木",type:"shen",target:"self",cost:10,cd:2,eff:[{k:"dodge",v:30,t:2}]},
  // 水
  {id:"s-shui1",name:"玄水冲击",elem:"水",type:"dmg",target:"enemy",cost:10,cd:0,mult:1.2,eff:[{k:"slow",ch:0.50,v:30,t:2}]},
  {id:"s-shui2",name:"寒水禁锢",elem:"水",type:"dmg",target:"enemy",cost:18,cd:3,mult:0.8,eff:[{k:"freeze",ch:0.30}]},
  {id:"s-shui3",name:"水幕护体",elem:"水",type:"shen",target:"self",cost:12,cd:3,eff:[{k:"dmgRed",v:25,t:2}]},
  {id:"s-shui4",name:"寒水流裳",elem:"水",type:"shen",target:"self",cost:8,cd:1,eff:[{k:"immune"}]},
  // 火
  {id:"s-huo1",name:"烈焰焚身",elem:"火",type:"dmg",target:"enemy",cost:15,cd:0,mult:1.5,eff:[{k:"burn",ch:0.60,v:0.4,t:2}]},
  {id:"s-huo2",name:"火海倾天",elem:"火",type:"dmg",target:"all",cost:25,cd:2,mult:0.9},
  {id:"s-huo3",name:"火灵加持",elem:"火",type:"shen",target:"self",cost:12,cd:2,eff:[{k:"atkUp",v:25,t:2}]},
  {id:"s-huo4",name:"焚身化火",elem:"火",type:"shen",target:"self",cost:15,cd:4,eff:[{k:"sacrifice",v:2},{k:"nextDmg",v:80}]},
  // 土
  {id:"s-tu1",name:"地裂崩山",elem:"土",type:"dmg",target:"enemy",cost:15,cd:2,mult:1.4,eff:[{k:"stun",ch:0.70}]},
  {id:"s-tu2",name:"巨石轰顶",elem:"土",type:"dmg",target:"all",cost:20,cd:2,mult:1.0},
  {id:"s-tu3",name:"厚土护体",elem:"土",type:"shen",target:"self",cost:12,cd:3,eff:[{k:"dmgRed",v:30,t:2}]},
  {id:"s-tu4",name:"大地引力",elem:"土",type:"shen",target:"enemy",cost:10,cd:2,eff:[{k:"slow",v:50,t:2}]},
  // 冰
  {id:"s-ice1",name:"玄冰刺",elem:"冰",type:"dmg",target:"enemy",cost:12,cd:0,mult:1.1,eff:[{k:"slow",ch:0.70,v:30,t:2}]},
  {id:"s-ice2",name:"冰封千里",elem:"冰",type:"dmg",target:"all",cost:25,cd:3,mult:0.8,eff:[{k:"freeze",ch:0.30}]},
  {id:"s-ice3",name:"冰甲",elem:"冰",type:"shen",target:"self",cost:12,cd:3,eff:[{k:"dmgRed",v:30,t:2},{k:"reflect",v:15,t:2}]},
  {id:"s-ice4",name:"寒冰遁",elem:"冰",type:"shen",target:"self",cost:10,cd:2,eff:[{k:"dodge",v:30,t:2}]},
  // 雷
  {id:"s-lei1",name:"天雷破",elem:"雷",type:"dmg",target:"enemy",cost:18,cd:2,mult:1.6,eff:[{k:"pierce",ch:1.0,v:30,t:2}]},
  {id:"s-lei2",name:"雷亟连击",elem:"雷",type:"dmg",target:"enemy",cost:20,cd:2,mult:0.7,hits:2},
  {id:"s-lei3",name:"雷遁",elem:"雷",type:"shen",target:"self",cost:10,cd:2,eff:[{k:"nextFirst"},{k:"spdUp",v:30,t:1}]},
  {id:"s-lei4",name:"雷衣",elem:"雷",type:"shen",target:"self",cost:12,cd:3,eff:[{k:"dmgRed",v:20,t:2},{k:"reflect",v:20,t:2}]},
  // 风
  {id:"s-feng1",name:"风刃乱舞",elem:"风",type:"dmg",target:"enemy",cost:18,cd:2,mult:0.6,hits:3},
  {id:"s-feng2",name:"风暴之眼",elem:"风",type:"dmg",target:"all",cost:22,cd:2,mult:0.85,eff:[{k:"slow",ch:0.50,v:20,t:2}]},
  {id:"s-feng3",name:"御风而行",elem:"风",type:"shen",target:"self",cost:8,cd:2,eff:[{k:"dodge",v:40,t:2}]},
  {id:"s-feng4",name:"风遁无踪",elem:"风",type:"shen",target:"self",cost:10,cd:3,eff:[{k:"dodge",v:40,t:2},{k:"immune"}]},
  // 毒
  {id:"s-du1",name:"剧毒蚀骨",elem:"毒",type:"dmg",target:"enemy",cost:12,cd:0,mult:0.8,guaranteed:true,eff:[{k:"poison",v:5,t:3}]},
  {id:"s-du2",name:"万毒侵体",elem:"毒",type:"dmg",target:"all",cost:22,cd:3,mult:0.7,eff:[{k:"poison",v:4,t:2},{k:"atkDown",v:15,t:2}]},
  {id:"s-du3",name:"毒体反噬",elem:"毒",type:"shen",target:"self",cost:12,cd:3,eff:[{k:"reflect",v:20,t:3}]},
  {id:"s-du4",name:"毒瘴护身",elem:"毒",type:"shen",target:"self",cost:10,cd:2,eff:[{k:"dmgRed",v:40,t:3},{k:"reflect",v:15,t:3}]},
  // 阴阳
  {id:"s-yiny1",name:"阴阳逆转",elem:"阴阳",type:"dmg",target:"enemy",cost:18,cd:2,mult:1.3,lifesteal:0.1},
  {id:"s-yiny2",name:"混沌归一",elem:"阴阳",type:"dmg",target:"all",cost:26,cd:3,mult:0.95},
  {id:"s-yiny3",name:"阴阳护体",elem:"阴阳",type:"shen",target:"self",cost:14,cd:3,eff:[{k:"allUp",v:20,t:2}]},
  {id:"s-yiny4",name:"两仪遁",elem:"阴阳",type:"shen",target:"self",cost:10,cd:2,eff:[{k:"dodge",v:30,t:2},{k:"nextDmg",v:20}]},
];
const SPELLS_BY_ID={}; SPELLS.forEach(s=>SPELLS_BY_ID[s.id]=s);
/* 技能书（坊市购买学习）：灵石价值 + 稀有度 1~6，随技能强度递增 */
const skillBookVal=s=>Math.max(400,Math.round(s.cost*40*(s.type==="shen"?1.2:1)));
const skillBookRarity=s=>Math.min(6,Math.max(1,Math.round(s.cost/5)));
SPELLS.forEach(s=>{ s.value=skillBookVal(s); s.rarity=skillBookRarity(s); });
/* 功法战斗被动（结构化；key 为 GONGFAS id） */
const GONG_BP={
  yj:{}, lz:{costRed:0.10}, xp:{elemPow:{木:0.10}}, qq:{elemPow:{金:0.15}}, zf:{elemPow:{水:0.10}},
  tz:{crit:0.05}, xt:{elemPow:{火:0.15}}, cs:{hpRegen:0.02}, dz:{first:0.08}, hd:{dmgRed:0.08},
  jw:{elemPow:{土:0.15}}, wf:{shenCd:1}, xx:{kezhiPow:0.10}, ql:{critDmg:0.15}, jh:{allPow:0.12},
  ts:{hpRegen:0.03,dmgRed:0.05}, ht:{shenCd:2}, tx:{allPow:0.18}, wl:{regainExtra:0.02}, hm:{allUp:0.10}
};
/* 神通战斗大招（key 为 SHEN id；bs 描述战斗主动效果） */
const SHEN_BS={
  j1:{cost:50,cd:5,kind:"dmg",elem:"金",target:"enemy",mult:2.5,ds:"单体×2.5剑气伤害"},
  x1:{cost:40,cd:5,kind:"heal",v:30,ds:"恢复气血上限30%"},
  s1:{cost:45,cd:4,kind:"dmg",elem:"火",target:"enemy",mult:2.2,eff:[{k:"burn",ch:1.0,v:0.4,t:2}],ds:"单体火系×2.2且灼烧"},
  z1:{cost:60,cd:5,kind:"dmg",target:"all",mult:1.6,eff:[{k:"atkDown",v:15,t:2}],ds:"全体×1.6且敌攻-15%"},
  x2:{cost:50,cd:5,kind:"buff",eff:[{k:"allUp",v:30,t:3}],ds:"全属性+30%（3回合）"},
  s3:{cost:55,cd:5,kind:"dmg",target:"all",mult:1.5,eff:[{k:"slow",ch:1.0,v:30,t:2}],ds:"全体×1.5且减速30%"},
  m1:{cost:70,cd:6,kind:"buff",eff:[{k:"dodge",v:40,t:3},{k:"guaranteed",v:1,t:3}],ds:"3回合内闪避+40%且必中"},
  j2:{cost:75,cd:6,kind:"dmg",target:"all",mult:2.0,ds:"全体×2.0剑气"},
  s2:{cost:80,cd:6,kind:"dmg",elem:"雷",target:"all",mult:2.2,eff:[{k:"pierce",ch:1.0,v:30,t:2}],ds:"全体×2.2雷系且破甲"},
  z2:{cost:100,cd:8,kind:"dmg",target:"all",mult:2.6,eff:[{k:"pierce",ch:1.0,v:30,t:2}],ds:"全体×2.6且必定破甲"},
  m2:{cost:60,cd:6,kind:"buff",eff:[{k:"sacrifice",v:15},{k:"atkUp",v:150,t:3},{k:"lifesteal",v:50,t:3}],ds:"自身-15%气血，3回合攻击×2.5且吸血50%"},
  p1:{cost:120,cd:10,kind:"buff",eff:[{k:"allUp",v:50,t:3},{k:"invuln",v:1,t:1}],ds:"3回合全属性+50%，自身无敌1回合"}
};
/* 技能槽容量（按灵根类型，表 5-3）：{法术槽, 身法槽, 神通槽} */
const SLOT_CAP={single:{dmg:2,shen:1,shenSh:1},double:{dmg:3,shen:1,shenSh:1},triple:{dmg:3,shen:2,shenSh:1},quad:{dmg:4,shen:2,shenSh:1},quint:{dmg:4,shen:2,shenSh:2},mut:{dmg:2,shen:2,shenSh:1}};
function rootSpellElems(root){ if(!root) return ["金"]; if(root.type==="mut") return root.id==="mut-yin"?["阴阳"]:[root.name.slice(0,1)]; return root.elems.slice(); }
function starterSkillsFor(root){ const es=rootSpellElems(root); const seen={}, out=[]; SPELLS.forEach(s=>{ if(es.includes(s.elem)&&s.type==="dmg"&&!seen[s.elem]){ seen[s.elem]=1; out.push(s.id); } }); return out; }
function spellPoolFor(root){ const es=rootSpellElems(root); const learned=S.skills||[]; return SPELLS.filter(s=>es.includes(s.elem)&&learned.includes(s.id)); }
function slotCapOf(root){ const t=root?root.type:"single"; return SLOT_CAP[t]||SLOT_CAP.single; }
/* 战前技能槽解析：从存档已配置（S.slots）取值，缺省按灵根池自动补齐 */
function resolveSlots(root){
  const cap=slotCapOf(root);
  const pool=spellPoolFor(root);
  const dmgPool=pool.filter(s=>s.type==="dmg"||s.type==="fa"), shenPool=pool.filter(s=>s.type==="shen");
  const learned=SHEN.filter(x=>S.shen.includes(x.id));
  const st=S.slots||{};
  const dmg=(st.dmg||[]).filter(id=>dmgPool.some(s=>s.id===id)).slice(0,cap.dmg);
  const shen=(st.shen||[]).filter(id=>shenPool.some(s=>s.id===id)).slice(0,cap.shen);
  const shenSh=(st.shenSh||[]).filter(id=>learned.some(x=>x.id===id)).slice(0,cap.shenSh);
  while(dmg.length<cap.dmg){ const s=dmgPool.find(x=>!dmg.includes(x.id)); if(!s)break; dmg.push(s.id); }
  while(shen.length<cap.shen){ const s=shenPool.find(x=>!shen.includes(x.id)); if(!s)break; shen.push(s.id); }
  while(shenSh.length<cap.shenSh){ const x=learned.find(x=>!shenSh.includes(x.id)); if(!x)break; shenSh.push(x.id); }
  return {dmg,shen,shenSh,cap};
}
/* 玩家战斗属性（3.1/3.2/3.3 派生；4 章五行抗性；7 章装备词条接入）
   六维：血气/攻击/防御(减伤)/法力(灵力池)/速度；次级：命中/闪避/暴击率/暴击伤害/五行抗性 */
function battleAttrs(){
  const g=GONGFAS.find(x=>x.id===S.activeGong)||GONGFAS[0];
  const root=S.root||null;
  const power=playerPower();
  const atk=Math.floor(power/4);
  const hpMax=S.hpMax, hp=Math.min(S.hp||hpMax,hpMax);
  const bp=GONG_BP[g.id]||{};
  const mutE=root&&root.type==="mut"?root.id:null;
  const allUp=bp.allUp||0;
  // 速度 = 100 + 境界×15 + 装备速度词条；鸿蒙全属性 ×1.10；变异风 ×(1+extra.bs)（v30.3 数据驱动）
  let speed=Math.floor((100+(S.realm||0)*15+eqSubSum("spd"))*(1+allUp));
  if(mutE==="mut-wind") speed=Math.floor(speed*(1+(root.extra&&root.extra.bs?root.extra.bs:0.15)));
  // 命中：基础 95% + 装备命中词条，上限 100%
  const hit=Math.min(1,0.95+eqSubSum("hit")/100);
  // 闪避：基础 0% + 变异风 10% + 装备闪避词条，上限 60%
  const dodge=Math.min(0.60,(mutE==="mut-wind"?0.10:0)+eqSubSum("dodge")/100);
  // 暴击率：基础 5% + 会心（升级/符箓/装备/灵兽）+ 功法 + 变异雷，上限 75%（3.3）
  const crit=Math.min(0.75,0.05+critChance()+(bp.crit||0)+(mutE==="mut-thun"?0.20:0));
  // 暴击伤害：基础 ×1.5 + 功法 + 暴伤词条 + 变异雷（×1.7）
  const critDmg=1.5+(bp.critDmg||0)+eqSubSum("critDmg")/100+(mutE==="mut-thun"?0.20:0);
  // 法力（灵力池）= 功法池 × 装备灵力池词条 × 鸿蒙全属性；每回合回灵 = ⌊池 × 回灵率⌋
  let pool=Math.floor((g.pool||50)*(1+eqSubSum("pool")/100)*(1+allUp));
  let regain=g.regain||0.10;
  if(bp.regainExtra) regain+=bp.regainExtra;
  regain+=allUp;
  // 防御力（减伤）：总减伤 = 1 − ∏(1−单项)，上限 70%（3.3 乘法叠加）
  let dmgRed=1;
  dmgRed*=1-eqSum("dmgR")/100;
  dmgRed*=1-petSum("dmgR")/100;
  dmgRed*=1-(bp.dmgRed||0);
  dmgRed*=1-allUp;
  if(mutE==="mut-yin") dmgRed*=1-0.10;
  dmgRed=Math.min(0.70,1-dmgRed);
  // 五行抗性（4 章）：装备副属性五行抗性词条汇总，被克伤害 ×0.8×(1−对应抗性)
  const res={}; RES_ELMS.forEach(e=>res[e]=Math.min(0.50,eqResSum(e)/100));
  let allPow=1+(bp.allPow||0); let kezhiPow=1+(bp.kezhiPow||0);
  if(mutE==="mut-yin") allPow+=0.20;
  if(mutE==="mut-ven"){ /* 毒系持续伤害强化 */ }
  const elemPow={}; Object.keys(bp.elemPow||{}).forEach(k=>elemPow[k]=bp.elemPow[k]);
  return {atk,hp,hpMax,speed,hit,dodge,crit,pool,regain,dmgRed,allPow,kezhiPow,critDmg,elemPow,res,shenCd:(bp.shenCd||0),costRed:1-(bp.costRed||0),first:(bp.first||0),hpRegen:(bp.hpRegen||0),mutE,g,rootElems:rootSpellElems(root),elems:rootSpellElems(root),poisonPow:(mutE==="mut-ven"?1.10:1),ccPow:(mutE==="mut-ice"?1.10:1)};
}
/* 敌方模板（8.1）：强度复用 enemyPower，气血=强度×0.8，敌攻=强度/9，减伤按层段
   平衡验收：同战力玩家（筑基·三灵根 战力174）打洞天普通怪，20 种子全胜且回合结束保留 ≥60% 气血 */
/* 敌方技能元素池（按区域）：敌人从池中抽取 2-3 个元素法术复用 SPELLS 施放，
   使玩家的减伤 / 五行抗性 / 闪避 / 控制（冰冻·眩晕·束缚）对敌方技能同样生效 */
const ENEMY_POOL={dt:["金","木","水","火","土"],yl:["木","水","火","土","冰"],sg:["火","土","冰","雷","风"],kj:["冰","雷","风","毒","阴阳"]};
const ENEMY_CONTROL=["pierce","freeze","stun","slow","bind","burn","poison","atkDown"];
const ENEMY_SELF=["shield","dmgRed","immune","reflect","allUp","atkUp","invuln","dodge"];
function enemySpells(area,kind){
  const pool=ENEMY_POOL[area]||ENEMY_POOL.dt;
  const cands=SPELLS.filter(s=>pool.includes(s.elem));
  const rnd=a=>a[Math.floor(Math.random()*a.length)];
  const out=[];
  // 1 个带控制/破甲特效的伤害法术（打玩家）
  const dmgC=cands.filter(s=>s.type==="dmg");
  const ctl=dmgC.filter(s=>(s.eff||[]).some(e=>ENEMY_CONTROL.includes(e.k)));
  if(ctl.length) out.push(rnd(ctl));
  // 1 个自保身法（护盾/免伤/反伤/强化/闪避）
  const selfS=cands.filter(s=>s.type==="shen"&&(s.eff||[]).some(e=>ENEMY_SELF.includes(e.k)));
  if(selfS.length) out.push(rnd(selfS));
  // BOSS 额外补 1 个伤害法术
  if(kind==="boss"){
    const rest=dmgC.filter(s=>!out.includes(s));
    if(rest.length) out.push(rnd(rest));
  }
  return out;
}
function enemyElement(area,kind){
  const BASE={dt:["木","水"],yl:["火","土"],sg:["金","雷"],kj:["金","木","水","火","土"]};
  const pool=BASE[area]||["金"];
  let elems=[pool[Math.floor(Math.random()*pool.length)]];
  if(area==="kj"){ const o=WX.filter(w=>w!==elems[0]); elems.push(o[Math.floor(Math.random()*o.length)]); }
  if(kind!=="fight"&&Math.random()<0.5){ const o=WX.filter(w=>!elems.includes(w)); if(o.length) elems.push(o[Math.floor(Math.random()*o.length)]); }
  return elems;
}
function enemyTemplate(floor,area,kind){
  const power=enemyPower(floor,area,kind==="boss");
  const hp=Math.max(1,Math.floor(power*0.8));
  const atk=Math.max(1,Math.floor(power/9));
  const dmgRed=kind==="fight"?0.05:kind==="elite"?0.12:0.20;
  const speed=Math.floor(80+power/90);
  const skillChance=kind==="boss"?0.55:kind==="elite"?0.45:0.35;
  return {power,hp,hpMax:hp,atk,dmgRed,speed,elems:enemyElement(area,kind),kind,skills:enemySpells(area,kind),skillChance};
}
/* ---------- 战斗引擎 ---------- */
let BATTLE=null;
function bLog(m){ if(BATTLE) BATTLE.roundLog.push(m); }
function buffAdd(u,k,v,t,srcAtk){
  if(!u.buffs) u.buffs={};
  if(u.buffs[k]){
    const b=u.buffs[k];
    // v31.19：护盾/反伤为"取较高值并刷新时长"，此前直接累加会被反复施放堆到吸不完的程度
    if(k==="shield"||k==="reflect"){ b.v=Math.max(b.v,v); b.t=Math.max(b.t,(t||1)); }
    else { b.v+=v; b.t=Math.max(b.t,(t||1)); }
    if(srcAtk!==undefined) b.srcAtk=srcAtk;
  }
  else u.buffs[k]={v:v,t:(t||1),srcAtk:srcAtk};
}
function bEffDmgRed(u){
  const defending=u.defending?0.5:0;
  const selfRed=u.buffs&&u.buffs.dmgRed?u.buffs.dmgRed.v/100:0;
  const allUp=u.buffs&&u.buffs.allUp?u.buffs.allUp.v/100:0;
  const pierce=u.buffs&&u.buffs.pierce?u.buffs.pierce.v/100:0;
  const base=Math.max(0,Math.min(0.70,u.baseDmgRed||0));
  let r=1-(1-base)*(1-selfRed)*(1-allUp)*(1-defending);
  return Math.max(0,Math.min(0.70, r-pierce));
}
function bEffSpeed(u){
  let sp=u.speed||100;
  if(u.buffs&&u.buffs.slow&&u.buffs.slow.t>0) sp*=1-(u.buffs.slow.v/100);
  if(u.buffs&&u.buffs.bind&&u.buffs.bind.t>0) sp*=1-(u.buffs.bind.v/100);
  if(u.buffs&&u.buffs.allUp) sp*=1+(u.buffs.allUp.v/100);
  return Math.max(10,Math.floor(sp));
}
function bEffAtk(u){
  let a=u.atk||1;
  if(u.buffs&&u.buffs.atkUp) a*=1+(u.buffs.atkUp.v/100);
  if(u.buffs&&u.buffs.atkDown) a*=1-(u.buffs.atkDown.v/100);
  return Math.max(1,Math.floor(a));
}
/* 攻击修正倍率（仅供伤害结算，含强化/削弱） */
function bAtkMult(u){
  let m=1;
  if(u.buffs&&u.buffs.atkUp) m*=1+(u.buffs.atkUp.v/100);
  if(u.buffs&&u.buffs.atkDown) m*=1-(u.buffs.atkDown.v/100);
  return m;
}
/* 伤害结算（4.5/6.2）：命中 → 功法威力/克制/五行抗性/暴击/减伤 */
function battleDamage(att,def,opts){
  opts=opts||{};
  const hits=opts.hits||1; let total=0,landed=0,crits=0;
  for(let i=0;i<hits;i++){
    // 闪避叠加身法类增益后仍受上限 60% 约束（4.2）
    const dodgeEff=Math.min(0.60,(def.dodge||0)+((def.buffs&&def.buffs.dodge)?def.buffs.dodge.v/100:0));
    const hr=Math.max(0.05,Math.min(1, (att.hit||0.95)-dodgeEff+(opts.hitB||0)));
    const guaranteed=opts.guaranteed||(att.buffs&&att.buffs.guaranteed&&att.buffs.guaranteed.t>0);
    if(guaranteed||Math.random()<hr){
      landed++;
      let d=(att.atk||1)*(opts.mult||1);
      let pow=(att.allPow||1);
      if(opts.elem&&att.elemPow&&att.elemPow[opts.elem]) pow*=1+att.elemPow[opts.elem];
      if(opts.elem&&att.kezhiPow>1&&kezhiMult(opts.elem,def.elems)>=1.35) pow*=att.kezhiPow;
      d*=pow;
      if(opts.elem){
        const k=kezhiMult(opts.elem,def.elems);
        d*=k;
        if(k===0.8&&def.res&&def.res[opts.elem]) d*=1-def.res[opts.elem]; // 五行抗性：受被克伤害再减免（4 章）
      }
      d*=bAtkMult(att);
      if(opts.isSpell&&att.nextPower>0) d*=1+(att.nextPower/100);
      if(att.nextDmg>0) d*=1+(att.nextDmg/100);
      if(Math.random()<(att.crit||0)){ crits++; d*=att.critDmg||1.5; }
      d*=(1-bEffDmgRed(def));
      total+=d;
    }
  }
  return {total:Math.floor(total),landed,crits};
}
/* 直接伤害（持续伤害/反伤/反弹） */
function dealDirect(u,dmg,src){
  if(dmg<=0)return 0;
  let d=dmg;
  if(u.invuln>0||(u.buffs&&u.buffs.invuln&&u.buffs.invuln.t>0)) return 0;
  if(u.immune>0){ u.immune--; return 0; }
  if(u.buffs&&u.buffs.shield&&u.buffs.shield.t>0&&u.buffs.shield.v>0){ const ab=Math.min(u.buffs.shield.v,d); u.buffs.shield.v-=ab; d-=ab; }
  if(u.buffs&&u.buffs.reflect&&u.buffs.reflect.t>0&&src){ const rr=Math.floor(dmg*u.buffs.reflect.v/100); if(rr>0) dealDirect(src,rr,null); }
  const f=Math.max(0,Math.ceil(d)); u.hp=Math.max(0,u.hp-f); return f;
}
function applySpellEffects(caster,targets,spell,opts){
  targets.forEach(t=>{
    spell.eff.forEach(e=>{
      const ch=e.ch===undefined?1:e.ch;
      if(Math.random()<ch){
        switch(e.k){
          case "pierce": buffAdd(t,"pierce",e.v,e.t); break;
          case "slow": buffAdd(t,"slow",e.v,e.t); break;
          case "bind": buffAdd(t,"bind",e.v,e.t); break;
          case "freeze": buffAdd(t,"freeze",0,1); break;
          case "stun": buffAdd(t,"stun",0,1); break;
          case "burn": buffAdd(t,"burn",e.v,e.t, caster.atk); break;
          case "poison": buffAdd(t,"poison",e.v,e.t); break;
          case "atkDown": buffAdd(t,"atkDown",e.v,e.t); break;
          case "reflectHit": buffAdd(t,"reflect",e.v,e.t); break;
          case "reflect": buffAdd(t,"reflect",e.v,e.t); break;
          case "shield": buffAdd(t,"shield",Math.floor(caster.hpMax*(e.v/100)),e.t); break;
          case "dmgRed": buffAdd(t,"dmgRed",e.v,e.t); break;
          case "dodge": buffAdd(t,"dodge",e.v,e.t); break;
          case "atkUp": buffAdd(t,"atkUp",e.v,e.t); break;
          case "allUp": buffAdd(t,"allUp",e.v,e.t); break;
          case "guaranteed": buffAdd(t,"guaranteed",e.v,e.t); break;
          case "invuln": buffAdd(t,"invuln",e.v,e.t); break;
          case "lifesteal": buffAdd(t,"lifesteal",e.v,e.t); break;
          case "immune": t.immune=(t.immune||0)+1; break;
          case "nextFirst": t.nextFirst=(t.nextFirst||0)+1; break;
          case "spdUp": buffAdd(t,"spdUp",e.v,e.t); break;
          case "nextPower": caster.nextPower=(caster.nextPower||0)+e.v; break;
          case "nextDmg": caster.nextDmg=(caster.nextDmg||0)+e.v; break;
          case "heal":{ const h=Math.floor(caster.hpMax*(e.v/100)); caster.hp=Math.min(caster.hpMax,caster.hp+h); bLog("恢复气血 "+h); break; }
          case "regen":{ // 持续缓慢回血：总量为施放者气血上限 v%，分 t 回合发放，受上限封顶
            const total=Math.floor(t.hpMax*(e.v/100)); const per=Math.max(1,Math.ceil(total/(e.t||1)));
            buffAdd(t,"regen",per,e.t); t.buffs.regen.left=total; break; }
          case "sacrifice":{ const s=Math.ceil(caster.hp*(e.v/100)); caster.hp=Math.max(1,caster.hp-s); break; }
        }
      }
    });
  });
}
/* 单次行动：施加伤害并附带特效 */
function battleStrike(att,def,opts){
  const r=battleDamage(att,def,opts);
  let absorbedTotal=r.total;
  if(r.total>0) absorbedTotal=dealDirect(def,r.total,att);
  // 吸血
  const ls=(att.buffs&&att.buffs.lifesteal&&att.buffs.lifesteal.t>0)?att.buffs.lifesteal.v/100:(opts.lifesteal||0);
  if(ls>0&&absorbedTotal>0){ att.hp=Math.min(att.hpMax,att.hp+Math.floor(absorbedTotal*ls)); }
  if(opts.eff){
    // 反击/反噬类特效施加给施法者自身（荆棘反噬等）；其余（减速/灼烧/束缚…）施加给被打目标
    const selfEff=opts.eff.filter(e=>e.k==="reflectHit"||e.k==="reflect");
    const tgtEff=opts.eff.filter(e=>e.k!=="reflectHit"&&e.k!=="reflect");
    if(selfEff.length) applySpellEffects(att,[att],{eff:selfEff},opts);
    if(tgtEff.length) applySpellEffects(att,[def],{eff:tgtEff},opts);
  }
  if(opts.isSpell&&att.nextPower>0) att.nextPower=0; // 下次法术威力：施放后消耗
  if(att.nextDmg>0) att.nextDmg=0;                    // 下回合伤害增幅：本次命中后消耗
  if(r.total>0) bLog((opts.label||"攻击")+"命中，造成 "+r.total+" 伤害"+(r.crits?"（暴击）":""));
  else if(opts.missLabel) bLog(opts.missLabel);
  // 战斗动画：交火光束 / 受击闪光 / 伤害飘字 / 暴击 / 五行克光（纯视觉）
  if(r.total>0){
    try{
      const fromSel=(BATTLE&&att===BATTLE.player)?"battlePlayer":"battleEnemy";
      const ts=(BATTLE&&def===BATTLE.enemy)?"battleEnemy":"battlePlayer";
      const isCrit=r.crits>0;
      fxBeam(fromSel,ts,opts.elem?ELEM_COLOR[opts.elem]:"#ffd95e");
      fxHit(ts,isCrit);
      fxDmg(ts,r.total,isCrit);
      if(opts.elem&&def.elems) fxKezhi(ts,opts.elem,def.elems);
    }catch(e){}
  }
  return r;
}
/* 每回合初：状态回合数递减 */
function buffTick(u){
  if(!u.buffs)return;
  // v31.19 修复"打不死"：过期 buff 必须清除。此前 shield/reflect/poison/burn/slow/bind 被豁免，
  // 导致 ①过期护盾剩余值在下次施放时被 buffAdd 累加，护盾越叠越厚；②slow/bind 过期后仍被 bEffSpeed 读取，永久减速。
  Object.keys(u.buffs).forEach(k=>{ const b=u.buffs[k]; if(b.t>0){ b.t--; if(b.t<=0) delete u.buffs[k]; } });
  if(u.nextFirst>0) u.nextFirst--;
  u.defending=false;
}
/* 回合逻辑统一在 bEndRound 内处理（回灵/状态递减/冷却/回合计数），无独立 bTurnStart */
function decCd(u){ if(u.cd){ Object.keys(u.cd).forEach(k=>{ u.cd[k]--; if(u.cd[k]<=0)delete u.cd[k]; }); } }
function cdLeft(u,id){ return u.cd&&u.cd[id]?u.cd[id]:0; }
function setCd(u,id,n){ u.cd=u.cd||{}; u.cd[id]=n; }
function nextOrder(){
  const b=BATTLE;
  const ps=b.player.nextFirst>0?9999:bEffSpeed(b.player);
  const es=bEffSpeed(b.enemy);
  return ps>=es?"player":"enemy";
}
function bEndCheck(){
  const b=BATTLE;
  // v31.19 兜底：hp 若被异常数值污染（NaN/Infinity），`hp<=0` 恒为 false 会导致战斗永不结束
  if(!Number.isFinite(b.enemy.hp)) b.enemy.hp=0;
  if(!Number.isFinite(b.player.hp)) b.player.hp=0;
  if(b.enemy.hp<=0){ finishBattle("win"); return true; }
  if(b.player.hp<=0){ finishBattle("lose"); return true; }
  return false;
}
/* 玩家行动 */
function battleUse(kind,id){
  const b=BATTLE; if(!b||b.over||b.phase!=="play") return;
  b.phase="resolving";
  // 逃跑
  if(kind==="flee"){
    const rate=Math.max(0.05,Math.min(0.90,0.50+(b.player.speed-b.enemy.speed)*0.001));
    if(Math.random()<rate){ finishBattle("flee"); return; }
    bLog("逃跑失败！敌方追加一次行动");
    battleEnemyAct();
    if(b.over) return;
    bEndRound(); renderBattleUI(); return;
  }
  // 防御
  if(kind==="def"){ b.player.defending=true; const half=Math.floor((b.player.pool*b.player.regain)/2); b.player.spirit=Math.min(b.player.pool,b.player.spirit+half); bLog("玩家防御（本回合减伤50%且回灵加半 +"+half+"）"); }
  // 普攻
  else if(kind==="atk"){ battleStrike(b.player,b.enemy,{mult:1,label:"普攻"}); }
  // 法术 / 身法
  else if(kind==="spell"||kind==="shen"){
    const s=(kind==="spell"?b.spells:b.shens).find(x=>x.id===id); if(!s) return;
    const cost=Math.ceil(s.cost*b.player.costRed);
    if(b.player.spirit<cost){ bLog("灵力不足，无法施放"); b.phase="play"; renderBattleUI(); return; }
    if(cdLeft(b.player,s.id)>0){ bLog("技能冷却中"); b.phase="play"; renderBattleUI(); return; }
    b.player.spirit-=cost;
    if(s.cd>0) setCd(b.player,s.id,Math.max(0,s.cd-b.player.shenCd));
    bcast("player",s.name,s.elem,SPELL_IMG[s.id]);
    if(s.type==="shen"){ // 身法：按 target 分派（大地引力→敌方，其余→自身）
      const tg=(s.target==="enemy")?[b.enemy]:[b.player];
      applySpellEffects(b.player,tg,s,{});
      bLog("施展身法「"+s.name+"」");
    } else if(s.target==="self"){ // 法术（自施型）：如持续回血，作用于自身
      applySpellEffects(b.player,[b.player],s,{});
      bLog("施展法术「"+s.name+"」");
    } else { // 伤害法术：命中并附加特效
      battleStrike(b.player,b.enemy,{mult:s.mult,hits:s.hits,elem:s.elem,hitB:s.hitB,guaranteed:s.guaranteed,eff:s.eff,isSpell:true,lifesteal:s.lifesteal,label:"「"+s.name+"」"});
    }
  }
  // 神通
  else if(kind==="shensh"){
    const bs=SHEN_BS[id]; const sh=SHEN.find(x=>x.id===id); if(!bs||!sh) return;
    if(b.player.spirit<bs.cost){ bLog("灵力不足"); b.phase="play"; renderBattleUI(); return; }
    if(cdLeft(b.player,id)>0){ bLog("神通冷却中"); b.phase="play"; renderBattleUI(); return; }
    b.player.spirit-=bs.cost; setCd(b.player,id,bs.cd);
    bcast("player",sh.name,bs.elem,SPELL_IMG[sh.id]);
    if(bs.kind==="dmg"){ const tgt=bs.target==="all"?[b.enemy]:[b.enemy]; battleStrike(b.player,b.enemy,{mult:bs.mult,elem:bs.elem,eff:bs.eff,label:"神通「"+sh.name+"」"}); }
    else if(bs.kind==="heal"){ const h=Math.floor(b.player.hpMax*(bs.v/100)); b.player.hp=Math.min(b.player.hpMax,b.player.hp+h); bLog("神通「"+sh.name+"」恢复气血 "+h); }
    else if(bs.kind==="buff"){ applySpellEffects(b.player,[b.player],{eff:bs.eff},{}); bLog("施放神通「"+sh.name+"」"); }
  }
  bEndCheck();
  if(b.over) return;
  battleEnemyAct();
  if(b.over) return;
  bEndRound();
  renderBattleUI();
}
/* 敌方 AI（3.4）：优先伤害；气血<40%概率强化/回血；被克制明显且多属性换属性；
   v30.7 敌人按区域元素池持有 2-3 个元素法术，概率出手（复用 battleStrike/applySpellEffects，
   使玩家减伤 / 五行抗性 / 闪避 / 控制对敌方技能生效） */
function battleEnemyAct(){
  const b=BATTLE; if(b.over) return;
  if(b.enemy.buffs&&b.enemy.buffs.freeze&&b.enemy.buffs.freeze.t>0){ bLog("敌方被冰冻，跳过行动"); return; }
  if(b.enemy.buffs&&b.enemy.buffs.stun&&b.enemy.buffs.stun.t>0){ bLog("敌方被眩晕，跳过行动"); return; }
  const e=b.enemy,p=b.player;
  const r=Math.random();
  if(b.turn<=15&&e.hp<e.hpMax*0.4){
    if(r<0.25){ const h=Math.floor(e.hpMax*0.20); e.hp=Math.min(e.hpMax,e.hp+h); bLog("敌方施展回气，恢复气血 "+h); }
    else if(r<0.45){ buffAdd(e,"atkUp",30,2); bLog("敌方运功蓄势，攻击提升30%"); }
  }
  // 技能出手：非冷却技能中随机施放（概率 skillChance）
  const usable=(e.skills||[]).filter(s=>cdLeft(e,s.id)===0);
  let cast=false;
  if(usable.length&&Math.random()<e.skillChance){
    const s=usable[Math.floor(Math.random()*usable.length)];
    if(s.type==="shen"){
      const tg=(s.target==="enemy")?[p]:[e]; // 敌方身法：target enemy→对玩家，self→加自身
      applySpellEffects(e,tg,s,{});
      bLog("敌方施展身法「"+s.name+"」");
    } else { // 伤害法术：打玩家，控制/破甲特效命中后附加
      bcast("enemy",s.name,s.elem,SPELL_IMG[s.id]);
      battleStrike(e,p,{mult:s.mult,hits:s.hits,elem:s.elem,hitB:s.hitB,guaranteed:s.guaranteed,eff:s.eff,isSpell:true,label:"敌方「"+s.name+"」"});
    }
    if(s.cd>0) setCd(e,s.id,s.cd);
    cast=true;
  }
  if(!cast) battleStrike(e,p,{mult:1.0,label:"敌方攻击",elem:e.elems[0]}); // 敌方普攻（以主属性元素结算，使五行克制/抗性生效）
  bEndCheck();
}
/* 回合末：持续伤害结算 + 进入下一回合（回灵/状态递减/冷却） */
function bEndRound(){
  const b=BATTLE; if(b.over) return;
  // 灼烧 / 中毒（对双方）
  [["player",b.player],["enemy",b.enemy]].forEach(([k,u])=>{
    if(u.buffs&&u.buffs.burn&&u.buffs.burn.t>0){ const d=Math.floor((u.buffs.burn.srcAtk||b.player.atk)*u.buffs.burn.v); const dd=dealDirect(u,d,null); if(dd>0)bLog((k==="player"?"玩家":"敌方")+"受灼烧伤害 "+dd); }
    if(u.buffs&&u.buffs.poison&&u.buffs.poison.t>0){ const d=Math.floor(u.hpMax*(u.buffs.poison.v/100)); const dd=dealDirect(u,d,null); if(dd>0)bLog((k==="player"?"玩家":"敌方")+"受中毒伤害 "+dd); }
    if(u.buffs&&u.buffs.regen&&u.buffs.regen.t>0){ const amt=Math.min(u.buffs.regen.v,(u.buffs.regen.left||u.buffs.regen.v)); if(amt>0){ u.hp=Math.min(u.hpMax,u.hp+amt); u.buffs.regen.left=(u.buffs.regen.left||u.buffs.regen.v)-amt; bLog((k==="player"?"玩家":"敌方")+"气血缓缓恢复 "+amt); } }
  });
  // v31.19 久战力竭：第 16 回合起敌方气血每回合流失 4% 上限（不受护盾/减伤影响），
  // 避免高护盾 + 低血回气叠加成"永远打不死"的无限战斗；正常 5-10 回合的战斗不受影响。
  if(b.turn>=16&&b.enemy.hp>0){
    const drain=Math.max(1,Math.floor(b.enemy.hpMax*0.04));
    b.enemy.hp=Math.max(0,b.enemy.hp-drain);
    bLog("久战力竭：敌方气血流失 "+drain);
  }
  bEndCheck();
  if(b.over) return;
  // 下一回合开始
  b.turn++;
  const regain=Math.floor(b.player.pool*b.player.regain);
  b.player.spirit=Math.min(b.player.pool,b.player.spirit+regain);
  if(b.player.hpRegen>0){ const h=Math.floor(b.player.hpMax*b.player.hpRegen); b.player.hp=Math.min(b.player.hpMax,b.player.hp+h); }
  buffTick(b.player); buffTick(b.enemy);
  decCd(b.player); decCd(b.enemy);
  b.phase="play";
}
/* 战前进入：接管探索格战斗 */
/* ============ 战斗返回入口（v32.2）：战斗弹窗收起后可从探索页 / 秘境地图重新进入 ============ */
function battleActive(){ return !!(typeof BATTLE!=="undefined" && BATTLE && !BATTLE.over); }
function battleEntryLabel(){
  if(!battleActive()) return "";
  const b=BATTLE;
  const nm=b.kind==="boss"?"秘境BOSS":b.kind==="elite"?"精英守卫":"妖兽";
  const ar=(typeof EXP_AREAS!=="undefined"&&S.exp&&EXP_AREAS[S.exp.area])?EXP_AREAS[S.exp.area].nm:"秘境";
  return "⚔ 战斗进行中：第 "+b.turn+" 回合 · "+nm+" · "+ar+" 第 "+((S.exp&&S.exp.floor)||1)+" 层";
}
function reopenBattle(){
  if(!battleActive()){ syncBattleEntry(); banner("当前没有进行中的战斗"); return false; }
  $("battleOverlay").classList.add("show");
  try{ renderBattleUI(); }catch(e){}
  syncBattleEntry();
  return true;
}
function syncBattleEntry(){
  const on=battleActive();
  const eb=$("expBattleBtn");
  if(eb){ eb.style.display=on?"":"none"; if(on) eb.textContent="⚔ 返回战斗（第 "+BATTLE.turn+" 回合）"; }
  const card=$("battleEntryCard");
  if(card){
    if(on){ card.style.display=""; const t=$("battleEntryTxt"); if(t) t.textContent=battleEntryLabel(); }
    else card.style.display="none";
  }
  const cb=$("battleCloseBtn");
  if(cb) cb.textContent=(typeof BATTLE!=="undefined"&&BATTLE&&BATTLE.over)?"关闭":"收起战斗（可随时返回）";
  return on;
}
function enterBattle(kind,q,r,cell,prev){
  save(); // 进战斗即存档：把本格 used=true 入档，战斗中刷新后可据此判负恢复
  const root=S.root; if(!root){ banner("先定灵根才能战斗"); return; }
  const pA=battleAttrs();
  const ene=enemyTemplate(S.exp.floor,S.exp.area,kind);
  const slots=resolveSlots(root);
  const spells=slots.dmg.map(id=>SPELLS_BY_ID[id]).filter(Boolean);
  const shens=slots.shen.map(id=>SPELLS_BY_ID[id]).filter(Boolean);
  const shenSh=slots.shenSh.map(id=>SHEN.find(x=>x.id===id)).filter(Boolean);
  BATTLE={
    kind,q,r,cell,prev,over:false,result:null,phase:"play",turn:1,roundLog:[],
    player:{...pA,hp:pA.hp,spirit:Math.floor(pA.pool),baseDmgRed:pA.dmgRed,cd:{},buffs:{},immune:0,nextDmg:0,nextPower:0,nextFirst:0,defending:false},
    enemy:{...ene,baseDmgRed:ene.dmgRed,cd:{},buffs:{},immune:0,defending:false},
    spells,shens,shenSh
  };
  if(root.type==="mut"&&pA.mutE==="mut-thun") BATTLE.first="player"; // 雷灵根先手
  else BATTLE.first=(pA.speed*(1+(pA.first||0))>=ene.speed)?"player":"enemy"; // 大周天诀身法先手加成
  bLog("⚔️ 遭遇"+(kind==="fight"?"妖兽":kind==="elite"?"精英守卫":"秘境BOSS")+"（强度 "+ene.power+"）");
  bLog((BATTLE.first==="player"?"玩家":"敌方")+"先手");
  $("battleOverlay").classList.add("show");
  renderBattleUI();
  syncBattleEntry();
}
function finishBattle(result){
  const b=BATTLE; if(!b||b.over)return; b.over=true; b.result=result;
  $("battleOverlay").classList.remove("show");
  if(result==="win"){ logEvent("战斗胜利（"+b.kind+"）",'sys'); resolveCell(true); }
  else if(result==="lose"){ resolveCell(false); }
  else { logEvent("成功逃跑",'sys'); resolveCell(null,"flee"); }
  BATTLE=null;
  syncBattleEntry();
  if(activeTab==="battle") renderTab();
}
/* 战斗结算接入探索：胜利/失败/逃跑，并按战斗后气血回写 S.hp
   战败 → 气血归零 → 收1血 → 探索失败损50%收获（设计 9.3） */
function resolveCell(win,fleeMode){
  const b=BATTLE; if(!b)return;
  const exp=S.exp; if(!exp) return;
  // 战败：收1血并探索失败
  if(!fleeMode&&!win){ S.hp=1; logEvent("不敌"+(b.kind==="fight"?"妖兽":b.kind==="elite"?"精英守卫":"BOSS")+"，气血耗尽，被迫撤离",'warn'); expFail(); return; }
  // 胜利 / 逃跑：回写战斗后气血
  S.hp=Math.max(1,BATTLE.player.hp);
  const c=exp.map.cells[b.q+","+b.r];
  if(!c){ return; }
  if(win){ c.finished=true; }
  else if(fleeMode==="flee"){
    // 入口/终点格逃跑后解除占用并退回战前位置，允许再次挑战；普通妖兽格保留已探索状态
    if(c.t==="down"||c.t==="boss"){ c.used=false; c.finished=false; if(b.prev) exp.pos={q:b.prev.q,r:b.prev.r}; }
    else { c.finished=true; }
  }
  const st=areaStone(exp.area,exp.floor);
  if(fleeMode==="flee"){ logEvent("成功逃跑，返回地图",'dim'); }
  else if(win){
    const mult=areaDifficulty(exp.area).mult;
    const typeM={fight:1.0,elite:2.5,boss:6.0}[b.kind]||1.0;
    const gain=Math.max(1,Math.floor(realmNeed()*0.001*typeM*mult));
    S.essence+=gain; if(S.lifetime===undefined)S.lifetime=0; S.lifetime+=gain;
    logEvent("战斗胜利，灵力 +"+fmt(gain)+"（难度×"+mult+"）",'sys');
    if(b.kind==="fight"){
      exp.loot.push({kind:"stone",tier:st.tier,qty:st.qty});
      if(Math.random()<0.5){ const m=areaMat(exp.area,exp.floor); exp.loot.push({kind:"mat",id:m.id,name:m.name,qty:1}); logEvent("击败妖兽，缴获灵石与"+m.name,'sys'); } else logEvent("击败妖兽，缴获灵石",'sys');
    } else if(b.kind==="elite"){
      maybeDropEgg(exp.area, exp.floor); // v31 仅精英守卫/秘境BOSS胜利判定出蛋（普通妖兽不掉）
      exp.floor++;
      if(exp.floor>=10){ exp.map=genExpMap(exp.floor,exp.area); exp.pos={q:0,r:0}; const hasBoss=Object.keys(exp.map.cells).some(k=>exp.map.cells[k].t==="boss"); logEvent("击败精英守卫！踏入第 10 层·最终层"+(hasBoss?"（BOSS 潜伏其中）":"（发现出口传送）"),'sys'); }
      else { exp.map=genExpMap(exp.floor,exp.area); exp.pos={q:0,r:0}; logEvent("击败精英守卫！深入第 "+exp.floor+" 层",'sys'); }
    } else if(b.kind==="boss"){ maybeDropEgg(exp.area, exp.floor); maybeDropPu(exp.area); maybeDropBook(exp.area, exp.floor); logEvent("击败秘境 BOSS！",'sys'); expFinish(); return; }
  }
  expRevealNearby();
  save(); renderExpPanel(); renderStats();
}
/* ---------- 战斗动画（第一批：飘字 / 受击 / 暴击 / 五行克光） ---------- */
let BATTLE_FX={on:true};          // 纯视觉层，可在设置中关闭；on=false 时全部动画跳过
const ELEM_COLOR={金:"#e8d98a",木:"#45d0a0",水:"#4aa8ff",火:"#ff7a4d",土:"#c9a86a",冰:"#7ad6ff",雷:"#b58cff",风:"#7fe8c8",毒:"#8fd06a",阴阳:"#cfc7ff"};
let _fxLayer=null;
function battleFxLayer(){
  if(_fxLayer) return _fxLayer;
  const top=$("battleTop"); if(!top) return null;
  try{ top.style.position="relative"; }catch(e){}
  const f=document.createElement("div"); f.id="battleFx"; f.className="battleFx";
  top.appendChild(f); _fxLayer=f; return f;
}
function fxPos(sel){ // 目标块中心 → 相对 #battleFx 的坐标
  const f=battleFxLayer(), t=$(sel); if(!f||!t) return null;
  try{ const fr=f.getBoundingClientRect(), tr=t.getBoundingClientRect();
    return {x:tr.left+tr.width/2-fr.left, y:tr.top+tr.height/2-fr.top}; }catch(e){ return null; }
}
function fxSpawn(x,y,o){ // o:{cls,text,color,size}
  if(!BATTLE_FX.on) return;
  const f=battleFxLayer(); if(!f) return;
  if(f.children&&f.children.length>26) return; // 自动战斗连发时防堆积
  try{
    const el=document.createElement("div"); el.className="battleFxEl "+(o.cls||"fxFloat");
    el.style.left=x+"px"; el.style.top=y+"px";
    if(o.color) el.style.setProperty("--fc",o.color);
    if(o.text!=null) el.textContent=o.text;
    if(o.size) el.style.fontSize=o.size+"px";
    f.appendChild(el);
    setTimeout(()=>{ try{ if(el.parentNode) el.remove(); }catch(e){} }, 900);
  }catch(e){}
}
function fxHit(sel,crit){ // 受击：命中闪光；暴击附带面板微震
  if(!BATTLE_FX.on) return;
  const p=fxPos(sel); if(!p) return;
  fxSpawn(p.x,p.y,{cls:"fxFlash",size:crit?80:56});
  if(crit){ const f=battleFxLayer(); if(f){ f.classList.remove("fxShake"); void f.offsetWidth; f.classList.add("fxShake"); } }
}
function fxDmg(sel,dmg,crit){ // 伤害飘字；暴击放大变红 + "暴击!"标签
  if(!BATTLE_FX.on) return;
  const p=fxPos(sel); if(!p) return;
  fxSpawn(p.x,p.y,{cls:"fxFloat",text:dmg>0?"-"+dmg:"",color:crit?"#ff5a5a":"#ffd27a",size:crit?28:20});
  if(crit) fxSpawn(p.x-4,p.y-34,{cls:"fxCrit",text:"暴击!",color:"#ff3b3b",size:15});
}
function fxKezhi(sel,elem,defElems){ // 五行克光：克→元素色大光环；被克→灰暗小光环
  if(!BATTLE_FX.on) return;
  const p=fxPos(sel); if(!p) return;
  const m=kezhiMult(elem,defElems);
  const col=ELEM_COLOR[elem]||"#fff";
  fxSpawn(p.x,p.y,{cls:m>=1.35?"fxKezhi":"fxKezhiWeak",color:col,size:m>=1.35?120:70});
}
function fxBeam(fromSel,toSel,color){ // 交火光束：施放方 → 目标 的五行色光线
  if(!BATTLE_FX.on) return;
  const f=battleFxLayer(); if(!f) return;
  const p1=fxPos(fromSel), p2=fxPos(toSel); if(!p1||!p2) return;
  const dx=p2.x-p1.x, dy=p2.y-p1.y;
  const len=Math.sqrt(dx*dx+dy*dy); if(len<4) return;
  const ang=Math.atan2(dy,dx)*180/Math.PI;
  try{
    const w=document.createElement("div"); w.className="fxBeam";
    w.style.left=p1.x+"px"; w.style.top=p1.y+"px";
    w.style.width=len+"px";
    w.style.transform="translate(-50%,-50%) rotate("+ang+"deg)";
    const core=document.createElement("div"); core.className="fxBeamCore";
    if(color) core.style.setProperty("--bc",color);
    w.appendChild(core);
    f.appendChild(w);
    setTimeout(()=>{ try{ if(w.parentNode) w.remove(); }catch(e){} }, 380);
  }catch(e){}
}

/* ---------- 战斗 UI：人物对峙 HUD ---------- */
const BUFF_CN={pierce:"破甲",slow:"减速",bind:"束缚",freeze:"冰冻",stun:"眩晕",burn:"灼烧",poison:"中毒",atkDown:"攻减",reflect:"反伤",shield:"护盾",dmgRed:"减伤",dodge:"闪避",atkUp:"攻增",allUp:"全属性",guaranteed:"必中",invuln:"无敌",lifesteal:"吸血",spdUp:"速增"};
function buffCn(k,v){ const n=BUFF_CN[k]||k; return n+(v?(" "+v+"%"):""); }
function buffChips(u){
  const out=[];
  Object.keys(u.buffs||{}).forEach(k=>{ const x=u.buffs[k]; if(!x||!x.t||x.t<=0)return; out.push(buffCn(k,x.v)+(x.t?("·"+x.t):"")); });
  if(u.immune>0) out.push("免伤×"+u.immune);
  return out;
}
function enemyLabel(kind){ return kind==="boss"?"秘境BOSS":kind==="elite"?"精英守卫":"妖兽"; }
function resRow(label,v,max,cls){
  const pct=max>0?Math.max(0,Math.min(100,v/max*100)):0;
  return '<div class="resRow"><span>'+label+'</span><div class="resBar '+cls+'"><i style="width:'+pct.toFixed(1)+'%"></i></div><b>'+fmt(v)+'/'+fmt(max)+'</b></div>';
}
let _castT=null;
function bcast(who,name,elem,icon){
  const el=$("castBanner"); if(!el) return;
  const col=(typeof ELEM_COLOR!=="undefined"&&ELEM_COLOR[elem])||"#e0b95e";
  el.innerHTML=(icon?('<img src="'+icon+'" alt="">'):"")+"<span>"+name+"</span><span class=\"cbWho\">"+(who==="enemy"?"敌方施展":"我方施展")+"</span>";
  el.style.borderColor=col;
  el.style.boxShadow="0 0 28px "+col+"66, inset 0 0 18px "+col+"22";
  el.style.color=(who==="enemy")?"#ffb3a2":"#ffe6b0";
  el.classList.remove("show"); void el.offsetWidth; el.classList.add("show");
  clearTimeout(_castT); _castT=setTimeout(()=>{ try{ el.classList.remove("show"); }catch(e){} },1300);
}
function renderTargetCard(){
  const b=BATTLE; const box=$("battleTargetCard"); if(!box||!b) return;
  const e=b.enemy;
  const shield=(e.buffs&&e.buffs.shield&&e.buffs.shield.t>0)?Math.max(0,Math.round(e.buffs.shield.v)):0;
  const red=Math.round(bEffDmgRed(e)*100);
  const effs=buffChips(e);
  box.innerHTML='<div class="th">'+enemyLabel(b.kind)+'<span>'+(e.elems||[]).join(" · ")+'</span></div>'
    +resRow("气血",e.hp,e.hpMax,"hp")
    +'<div class="resRow"><span>护盾</span><div class="resBar sh"><i style="width:'+(shield>0?Math.min(100,shield/e.hpMax*100):0).toFixed(1)+'%"></i></div><b>'+(shield>0?fmt(shield):"—")+'</b></div>'
    +'<div class="resRow"><span>护甲</span><div class="resBar sh"><i style="width:'+red+'%"></i></div><b>'+red+'%</b></div>'
    +'<div class="tgtStats">攻 <b>'+bEffAtk(e)+'</b> · 速 <b>'+bEffSpeed(e)+'</b><br>强度 <b>'+e.power+'</b> · 第 '+(S.exp?(S.exp.floor||1):1)+' 层</div>'
    +'<div class="tgtStats" style="margin-top:2px;border:0;padding-top:0">招式：'+((e.skills||[]).map(function(s){return s.name;}).join(" / ")||"普通攻击")+'</div>'
    +'<div class="tgtStats" style="margin-top:2px;border:0;padding-top:0">状态</div>'
    +(effs.length?'<div class="effChips">'+effs.map(x=>'<span class="effChip">'+x+'</span>').join("")+'</div>':'<div style="font-size:10px;color:var(--ink-dim)">无异常</div>');
}
function renderBattleUI(){
  const b=BATTLE; if(!b)return;
  const p=b.player,e=b.enemy;
  $("battleTitle").textContent="回合 "+b.turn;
  const ct=$("battleChipTarget"); if(ct) ct.innerHTML="🔒 锁定：<b>"+enemyLabel(b.kind)+"</b> "+(e.elems||[]).join("/");
  const cp=$("battleChipPlace"); if(cp&&S.exp&&EXP_AREAS[S.exp.area]) cp.textContent=EXP_AREAS[S.exp.area].nm+" · 第 "+(S.exp.floor||1)+" 层";
  const cs=$("battleChipSpirit"); if(cs) cs.innerHTML="灵力 <b>"+Math.floor(p.spirit)+"/"+p.pool+"</b> · 回灵 "+Math.floor(p.pool*p.regain)+"/回合";
  let km=1; (p.rootElems||[]).forEach(my=>{ const k=kezhiMult(my,e.elems); if(k>km) km=k; });
  const cth=$("battleChipThreat"); if(cth){ cth.className="bhChip"+(km>=1.35?" gold":""); cth.innerHTML=km>=1.35?"克制 <b>×1.35</b> 可用":"无克制 <b>×1.0</b>"; }
  const effs=buffChips(p);
  const ce=$("battleChipEffs"); if(ce){ ce.className="bhChip"+(effs.length?" mystic":""); ce.innerHTML=effs.length?("我方状态："+effs.slice(0,3).join(" · ")+(effs.length>3?" +"+(effs.length-3):"")):"我方无状态"; }
  const cap=$("battleSlotCap"); if(cap) cap.textContent="法"+(b.spells||[]).length+" · 身"+(b.shens||[]).length+" · 神"+(b.shenSh||[]).length;
  renderBattleUnit("battlePlayer",p,"player");
  renderBattleUnit("battleEnemy",e,"enemy");
  renderTargetCard();
  const rg=$("battleRange"); if(rg) rg.textContent="敌强度 "+e.power+" ｜ 我方战力 "+playerPower();
  const bi=$("battleInfo"); if(bi) bi.textContent="五行相克：金克木 · 木克土 · 土克水 · 水克火 · 火克金（克制 ×1.35 / 被克 ×0.8）· "+(b.first==="player"?"我方先手":"敌方先手");
  const cb=$("battleCloseBtn"); if(cb){ cb.style.display=""; cb.textContent=b.over?"关闭":"收起战斗（可随时返回）"; }
  renderBattleActions();
  renderBattleLog();
}
function renderBattleUnit(id,u,side){
  const box=$(id); if(!box)return;
  const isP=side==="player";
  const pct=Math.max(0,Math.round(u.hp/u.hpMax*100));
  const prev=(typeof u._shownPct==="number")?u._shownPct:null;
  const hurt=(prev!==null&&pct<prev);
  u._shownPct=pct;
  const ghostPct=hurt?prev:pct;
  const name=isP?(S.name||"无名散修"):enemyLabel(BATTLE?BATTLE.kind:"fight");
  const sub=isP?("修为 · "+(realm()?realm().full:"炼气")):((u.elems||[]).join("/")+" · 强度 "+u.power);
  const shake=hurt?" figShake":"";
  let html="";
  if(isP){
    const av=avatarObj();
    html='<div class="figBox'+shake+'"><div class="pLock"></div><img class="figImg" src="'+av.src+'" alt="'+av.name+'"></div>'
      +'<div class="uName">'+name+'</div><div class="uSub">'+sub+'</div>'
      +'<div class="uBar p"><span class="ghostBar" style="width:'+ghostPct+'%"></span><i style="width:'+pct+'%"></i></div>'
      +'<div class="uSub">气血 '+Math.floor(u.hp)+'/'+u.hpMax+'</div>'
      +'<div class="uBar s"><i style="width:'+(u.pool?Math.min(100,Math.floor(u.spirit)/u.pool*100):0)+'%"></i></div>'
      +'<div class="uSub">灵力 '+Math.floor(u.spirit)+'/'+u.pool+'</div>';
  } else {
    html='<div class="figBox'+shake+'"><div class="eLock"><div class="r1"></div><div class="r2"></div></div><div class="eGlyph">'+((u.elems&&u.elems[0])||"妖")+'</div></div>'
      +'<div class="uName">'+name+'</div><div class="uSub">'+sub+'</div>'
      +'<div class="uBar e"><span class="ghostBar" style="width:'+ghostPct+'%"></span><i style="width:'+pct+'%"></i></div>'
      +'<div class="uSub">气血 '+Math.floor(u.hp)+'/'+u.hpMax+'</div>';
  }
  box.className="unit";
  box.innerHTML=html;
  if(hurt){
    try{ const g=box.querySelector(".ghostBar"); if(g) setTimeout(function(){ try{ g.style.width=pct+"%"; }catch(e){} },30); }catch(e){}
  }
}

/* 技能效果描述：状态特效 → 中文 */
const EF_TXT={
  pierce:(v)=>"破甲"+v+"%", bind:(v)=>"束缚"+v+"%", reflectHit:(v)=>"反伤"+v+"%", heal:(v)=>"回血"+v+"%", regen:(v)=>"持续回血"+v+"%",
  dodge:(v)=>"闪避+"+v+"%", slow:(v)=>"减速"+v+"%", freeze:()=>"冰冻", dmgRed:(v)=>"减伤"+v+"%",
  immune:()=>"免负面", burn:(v)=>"灼烧"+Math.round(v*100)+"%攻", atkUp:(v)=>"攻+"+v+"%",
  sacrifice:(v)=>"自损"+v+"%", nextDmg:(v)=>"下次伤害+"+v+"%", stun:()=>"眩晕", reflect:(v)=>"反伤"+v+"%",
  spdUp:(v)=>"速+"+v+"%", nextFirst:()=>"先手", atkDown:(v)=>"敌攻-"+v+"%", poison:(v)=>"中毒"+v,
  allUp:(v)=>"全属性+"+v+"%", nextPower:(v)=>"下次威力+"+v+"%", guaranteed:()=>"必中", invuln:()=>"无敌",
  shield:(v)=>"护盾"+v+"%"
};
function fmtEff(es){
  return (es||[]).map(e=>{
    const fn=EF_TXT[e.k]; if(!fn) return e.k;
    let r=""; if(e.ch&&e.ch<1) r+=Math.round(e.ch*100)+"%";
    r+=fn(e.v);
    if(e.t) r+="("+e.t+"回合)";
    return r;
  }).join("，");
}
function battleSkillDesc(kind,s){
  if(kind==="shensh") return (SHEN_BS[s.id]&&SHEN_BS[s.id].ds)||"";
  let r="";
  if(s.type==="dmg"){ r=(s.elem||"无属性")+"·"+(s.target==="all"?"全体":"单体")+"×"+s.mult; if(s.hits>1) r+="（连击"+s.hits+"段）"; }
  else if(s.elem) r=s.elem+"·";
  if(s.eff&&s.eff.length){ const e=fmtEff(s.eff); if(e) r+=(r?" · ":"")+e; }
  if(s.lifesteal) r+=(r?" · ":"")+"吸血"+Math.round(s.lifesteal*100)+"%";
  if(s.guaranteed) r+=" · 必中";
  if(s.hitB) r+=" · 会心+"+Math.round(s.hitB*100)+"%";
  return r.replace(/·\s*$/,"");
}
function renderBattleActions(){
  const b=BATTLE; const box=$("battleActions"); if(!box||b.over)return;
  box.innerHTML="";
  const add=(label,fn,disable,desc,tag,icon)=>{ const btn=document.createElement("button"); btn.disabled=!!disable;
    if(icon){ const im=document.createElement("img"); im.className="btIcon"; im.src=icon; im.alt=""; btn.appendChild(im); }
    const m=document.createElement("span"); m.className="btMain"; m.textContent=label; btn.appendChild(m);
    if(tag){ const t=document.createElement("span"); t.className="btTag"; t.textContent=tag; btn.appendChild(t); }
    if(desc){ const d=document.createElement("span"); d.className="btDesc"; d.textContent=desc; btn.appendChild(d); }
    btn.addEventListener("click",fn); box.appendChild(btn); };
  const flee=Math.round(Math.max(0.05,Math.min(0.90,0.50+(b.player.speed-b.enemy.speed)*0.001))*100);
  add("普攻",()=>battleUse("atk"),false,"无消耗 · 伤害 = 攻击值","无消耗");
  add("防御",()=>battleUse("def"),false,"本回合受伤减半","无消耗");
  add("逃跑",()=>battleUse("flee"),false,"失败则敌方追加一次行动","成功率 "+flee+"%");
  b.spells.forEach(s=>{ const cost=Math.ceil(s.cost*b.player.costRed); const cd=cdLeft(b.player,s.id);
    add("法术 · "+s.name,()=>battleUse("spell",s.id), b.player.spirit<cost||cd>0||b.over, battleSkillDesc("spell",s), cd>0?("冷却 "+cd):(cost+" 灵力"), SPELL_IMG[s.id]); });
  b.shens.forEach(s=>{ const cost=Math.ceil(s.cost*b.player.costRed); const cd=cdLeft(b.player,s.id);
    add("身法 · "+s.name,()=>battleUse("shen",s.id), b.player.spirit<cost||cd>0||b.over, battleSkillDesc("shen",s), cd>0?("冷却 "+cd):(cost+" 灵力"), SPELL_IMG[s.id]); });
  b.shenSh.forEach(sh=>{ const bs=SHEN_BS[sh.id]; if(!bs)return; const cd=cdLeft(b.player,sh.id);
    add("神通 · "+sh.name,()=>battleUse("shensh",sh.id), b.player.spirit<bs.cost||cd>0||b.over, battleSkillDesc("shensh",sh), cd>0?("冷却 "+cd):(bs.cost+" 灵力"), SPELL_IMG[sh.id]); });
}
function renderBattleLog(){
  const b=BATTLE; const box=$("battleLog"); if(!box)return;
  box.innerHTML=b.roundLog.slice(-40).map(m=>'<div>'+m+'</div>').join("")+(b.over?('<div style="color:var(--jade)">战斗结束：'+({win:"胜利",lose:"失败",flee:"逃跑"}[b.result])+'</div>'):"");
}
/* 战斗背包：战斗中可使用的道具（回血丹药 / 战力·减伤·会心符箓丹药阵图），直接作用于当前战斗 */
function battleItems(){
  const out=[];
  for(const id in S.tres){
    if((S.tres[id]||0)<1) continue;
    const r=REC_BY_ID[id]; if(!r) continue;
    if(r.slot||GONGFAS.some(g=>g.id===id)) continue; // 装备 / 功法不可在战斗中使用
    if(r.heal||r.eff==="combat"||r.eff==="dmg_reduce"||r.eff==="crit") out.push(r);
  }
  return out;
}
function renderBattleBag(){
  const box=$("battleBagList"); if(!box) return;
  const items=battleItems();
  if(!items.length){ box.innerHTML='<div style="color:var(--ink-dim)">背包中没有可在战斗中使用的道具（回血丹药 / 战力·减伤·会心符箓丹药阵图）。</div>'; return; }
  box.innerHTML="";
  items.forEach(r=>{
    const row=document.createElement("div"); row.style.cssText="display:flex;align-items:center;gap:8px;padding:6px 4px;border-bottom:1px solid rgba(255,255,255,.06)";
    const ic=document.createElement("span"); ic.innerHTML=icOf(r,26);
    const info=document.createElement("span"); info.style.flex="1"; info.innerHTML="<b>"+r.name+"</b> ×"+S.tres[r.id]+' <span style="color:var(--ink-dim);font-size:12px">'+effText(r)+'</span>';
    const btn=document.createElement("button"); btn.textContent="使用"; btn.addEventListener("click",()=>useBattleItem(r));
    row.appendChild(ic); row.appendChild(info); row.appendChild(btn);
    box.appendChild(row);
  });
}
function openBattleBag(){
  if(!BATTLE||BATTLE.over){ banner("当前没有进行中的战斗"); return; }
  $("battleBagOverlay").classList.add("show");
  renderBattleBag();
}
function useBattleItem(r){
  const b=BATTLE; if(!b||b.over) return;
  if((S.tres[r.id]||0)<1){ renderBattleBag(); return; }
  if(b.phase!=="play"){ banner("等待你的回合再使用道具"); return; }
  S.tres[r.id]--; b.phase="resolving";
  let used=false;
  if(r.heal){ const h=Math.floor(b.player.hpMax*(r.heal/100)); b.player.hp=Math.min(b.player.hpMax,b.player.hp+h); bLog("使用「"+r.name+"」恢复气血 "+h); used=true; }
  if(r.eff==="combat"){ buffAdd(b.player,"atkUp",r.val,3); bLog("使用「"+r.name+"」，攻击 +"+r.val+"%（3回合）"); used=true; }
  if(r.eff==="dmg_reduce"){ buffAdd(b.player,"dmgRed",r.val,3); bLog("使用「"+r.name+"」，减伤 +"+r.val+"%（3回合）"); used=true; }
  if(r.eff==="crit"){ b.player.crit=Math.min(0.75,b.player.crit+r.val/100); bLog("使用「"+r.name+"」，会心 +"+r.val+"%"); used=true; }
  if(!used){ S.tres[r.id]++; b.phase="play"; banner("该物品战斗中不可使用"); return; }
  save(); renderBattleBag();
  bEndCheck(); if(b.over) return;
  battleEnemyAct(); if(b.over) return;
  bEndRound();
  renderBattleUI();
}
/* 自动战斗（供测试与便捷）：低血优先开护盾/回血/减伤身法，否则用最低耗可用法术/身法 */
function autoBattle(){
  const b=BATTLE; if(!b||b.over)return;
  b.roundLog.push("【自动战斗开启】");
  let guard=0;
  while(!b.over&&guard<200){
    guard++;
    if(b.phase==="play"){
      const costable=[...b.spells,...b.shens].filter(s=>b.player.spirit>=Math.ceil(s.cost*b.player.costRed)&&cdLeft(b.player,s.id)<=0);
      const low=b.player.hp<b.player.hpMax*0.7;
      const heal=low&&b.shens.find(s=>costable.includes(s)&&s.eff&&s.eff.some(e=>e.k==="heal"||e.k==="shield"||e.k==="dmgRed"));
      if(heal){ battleUse("shen",heal.id); }
      else if(costable.length){ costable.sort((a,c)=>a.cost-c.cost); battleUse(costable[0].type==="dmg"?"spell":"shen",costable[0].id); }
      else battleUse("atk");
    } else break;
  }
  renderBattleUI();
}
/* 战斗覆盖层按钮监听 */
if($("battleBagBtn"))$("battleBagBtn").addEventListener("click",openBattleBag);
if($("battleBagClose"))$("battleBagClose").addEventListener("click",()=>{ $("battleBagOverlay").classList.remove("show"); });
if($("battleAutoBtn"))$("battleAutoBtn").addEventListener("click",autoBattle);
window.addEventListener("resize",()=>placeBattleBar());
if($("battleCloseBtn"))$("battleCloseBtn").addEventListener("click",()=>{ $("battleOverlay").classList.remove("show"); syncBattleEntry(); if(battleActive()){ if(activeTab==="battle") renderTab(); banner("战斗已收起，点「进入战斗」可返回"); } });
if($("expBattleBtn"))$("expBattleBtn").addEventListener("click",()=>{ reopenBattle(); });
if($("slotsClose"))$("slotsClose").addEventListener("click",()=>{ $("slotsOverlay").classList.remove("show"); if(activeTab==="battle")renderBattle($("tabBody")); });
