/* ================================================================
   数据库（四库：后台数据）
   ================================================================ */

/* 强化设施（原功法迁入强化，统一产灵气）：cost 为下品灵石，out 为灵气/秒。
   v26.4 数值修正：全设施统一 10 秒回本（out=cost/10，单位灵石产出恒定 10%）；
   outM 与 costM 对齐（每级成本×M、产出×M，升级边际性价比恒定），消除"同灵石投入产出倒挂"。 */
const FAC = [
  {id:"array",  name:"聚灵阵",   ic:"🌀", cost:20,    out:2,     costM:1.13, outM:1.13, unlock:0, ds:"吸纳四方灵气，每秒凝聚灵气。"},
  {id:"beast",  name:"驭兽台",   ic:"🐉", cost:150,   out:15,    costM:1.13, outM:1.13, unlock:1, ds:"驭兽台上百兽驯服，灵气自聚。"},
  {id:"cave",   name:"洞府",     ic:"🏔️", cost:1800,  out:180,   costM:1.13, outM:1.13, unlock:2, ds:"洞天福地，汇聚灵气。"},
  {id:"pill",   name:"丹药炉",   ic:"⚗️", cost:20000, out:2000,  costM:1.13, outM:1.13, unlock:3, ds:"丹火不息，炼化灵气。"},
  {id:"field",  name:"仙田",     ic:"🌾", cost:280000,out:28000, costM:1.13, outM:1.13, unlock:4, ds:"种植仙草，萌发灵气。"},
  {id:"sword",  name:"剑冢",     ic:"🗡️", cost:4e6,   out:400000,costM:1.13, outM:1.13, unlock:5, ds:"万剑归宗，剑气化灵。"},
  {id:"disciple",name:"炼丹童子",ic:"🧒", cost:7e7,   out:7e6,   costM:1.13, outM:1.13, unlock:6, ds:"童子服侍，吐纳灵气。"},
  {id:"vein",   name:"灵脉",     ic:"⛰️", cost:1.2e9, out:1.2e8, costM:1.13, outM:1.13, unlock:7, ds:"地脉灵髓，涌出灵气。"},
  {id:"guard",  name:"护山大阵", ic:"🛡️", cost:2e10,  out:2e9,   costM:1.13, outM:1.13, unlock:8, ds:"大阵运转，聚拢灵气。"},
  {id:"thunder",name:"天雷淬体", ic:"⚡", cost:3.5e11,out:3.5e10,costM:1.13, outM:1.13, unlock:9, ds:"引天雷淬体，灵气温养。"},
];

/* 修行升级（灵石购买，无限等级） */
const UPS = [
  {id:"click",  name:"运功效率", ic:"⏳", cost:50,  costM:1.40, unlock:0, desc:"每级 +10% 运功灵气产出", fx:l=>l*0.10},
  {id:"prod",   name:"修炼加速", ic:"✨", cost:100, costM:1.35, unlock:0, desc:"每级 +10% 修炼速度", fx:l=>l*0.10},
  {id:"crit",   name:"会心一击", ic:"🎯", cost:300, costM:1.50, unlock:1, desc:"每级 +1% 会心概率（上限 50%）", fx:l=>Math.min(l*0.01,0.50)},
  {id:"break",  name:"突破机缘", ic:"🧘", cost:200, costM:1.50, unlock:2, desc:"每级 +2% 突破成功率（灵根基础上叠加）", fx:l=>l*0.02},
  {id:"offline",name:"闭关收益", ic:"🌙", cost:500, costM:1.50, unlock:3, desc:"每级 +10% 离线收益效率", fx:l=>l*0.10},
];

/* 功法库（只产灵气、非神通的功法数据） */
/* 功法库（只产灵气、非神通的功法数据；激活制，同一时间仅激活一本）。
   战斗字段：pool=灵力池上限，regain=每回合回灵率，passive=战斗被动。
   灵气倍率 ess 按阶递增（×1→×512），前 8 本 id 与数值保留以保证存档兼容，后 12 本为新增补全。 */
const GONGFAS = [
  {id:"yj",  name:"黄庭经",   ic:"📖", tier:"入门", ess:1.0,  rarity:2, value:20000,   pool:50,  regain:0.10, passive:"无",                                     ds:"筑基心法，温养丹田，基础灵气产出。"},
  {id:"lz",  name:"炼气真经", ic:"📜", tier:"入门", ess:2.0,  rarity:2, value:26000,   pool:60,  regain:0.10, passive:"法术灵力消耗-10%",                          ds:"凝炼天地灵气，炼气期修行根基。"},
  {id:"xp",  name:"玄牝功",   ic:"🍃", tier:"入门", ess:3.0,  rarity:2, value:40000,   pool:66,  regain:0.10, passive:"木系法术威力+10%",                          ds:"玄牝之门，吐纳如泉，木灵亲和。"},
  {id:"qq",  name:"青莲剑歌", ic:"🌿", tier:"下品", ess:4.0,  rarity:3, value:80000,   pool:72,  regain:0.11, passive:"金系法术威力+15%",                          ds:"剑意化莲，灵气如歌。"},
  {id:"zf",  name:"紫府真章", ic:"📘", tier:"下品", ess:6.0,  rarity:3, value:90000,   pool:78,  regain:0.11, passive:"水系法术威力+10%",                          ds:"紫府藏真，灵水自润。"},
  {id:"tz",  name:"太乙玄功", ic:"☯️", tier:"下品", ess:8.0,  rarity:3, value:100000,  pool:84,  regain:0.11, passive:"暴击率+5%",                                 ds:"阴阳流转，吐纳不息。"},
  {id:"xt",  name:"玄天经",   ic:"🔥", tier:"下品", ess:12.0, rarity:3, value:180000,  pool:90,  regain:0.12, passive:"火系法术威力+15%",                          ds:"玄天之道，火灵奔腾。"},
  {id:"cs",  name:"长春不老功",ic:"🌸", tier:"中品", ess:16.0, rarity:4, value:250000,  pool:96,  regain:0.12, passive:"每回合恢复2%气血上限",                        ds:"生生不息，灵气绵长。"},
  {id:"dz",  name:"大周天诀", ic:"🌐", tier:"中品", ess:24.0, rarity:4, value:280000,  pool:102, regain:0.12, passive:"身法先手值+8%",                              ds:"周天流转，先机在握。"},
  {id:"hd",  name:"混元一气", ic:"🌀", tier:"中品", ess:32.0, rarity:4, value:320000,  pool:108, regain:0.12, passive:"减伤+8%",                                    ds:"抱元守一，灵气暴涨。"},
  {id:"jw",  name:"金乌诀",   ic:"🌞", tier:"中品", ess:48.0, rarity:4, value:480000,  pool:114, regain:0.13, passive:"土系法术威力+15%",                          ds:"金乌浴火，土德厚载。"},
  {id:"wf",  name:"万物生息诀",ic:"🌳", tier:"上品", ess:64.0, rarity:5, value:800000,  pool:120, regain:0.13, passive:"身法冷却-1回合",                             ds:"与万物共鸣，灵气不绝。"},
  {id:"xx",  name:"星宿真经", ic:"✨", tier:"上品", ess:80.0, rarity:5, value:900000,  pool:126, regain:0.13, passive:"五行相克威力+10%",                          ds:"星宿垂辉，克敌有道。"},
  {id:"ql",  name:"青龙九章", ic:"🐉", tier:"上品", ess:96.0, rarity:5, value:1100000, pool:132, regain:0.14, passive:"暴击伤害+15%",                             ds:"青龙九章，雷火交鸣。"},
  {id:"jh",  name:"九转玄功", ic:"🌟", tier:"上品", ess:128.0,rarity:5, value:1000000, pool:138, regain:0.14, passive:"全法术威力+12%",                           ds:"九转归一，吞吐如海。"},
  {id:"ts",  name:"天地同寿诀",ic:"🌄", tier:"极品", ess:160.0,rarity:6, value:1500000, pool:144, regain:0.14, passive:"每回合恢复3%气血上限、减伤+5%",              ds:"天地同寿，愈战愈强。"},
  {id:"ht",  name:"混沌诀",   ic:"🌑", tier:"极品", ess:192.0,rarity:6, value:1800000, pool:150, regain:0.15, passive:"身法冷却-2回合",                            ds:"混沌初开，动若惊雷。"},
  {id:"tx",  name:"太虚神录", ic:"🌌", tier:"极品", ess:256.0,rarity:6, value:2400000, pool:156, regain:0.15, passive:"全法术威力+18%",                           ds:"太虚神藏，法力无涯。"},
  {id:"wl",  name:"无量真经", ic:"♾️", tier:"绝品", ess:384.0,rarity:6, value:3200000, pool:162, regain:0.16, passive:"每回合回灵率额外+2%",                       ds:"无量真法，灵海无量。"},
  {id:"hm",  name:"鸿蒙大道经",ic:"🌠", tier:"绝品", ess:512.0,rarity:6, value:4200000, pool:168, regain:0.16, passive:"全属性增幅+10%（伤害/减伤/回灵/速度）",       ds:"鸿蒙大道，万物归一。"},
];

/* 材料库（妖兽材料 / 矿石 / 草药，各 10 种） */
const MATS = [
  {id:"skin", name:"妖狼皮",  cat:"妖兽材料", ic:"🐺", rarity:1, value:5,  ds:"妖狼之皮，可制甲。"},
  {id:"bone", name:"玄兽骨",  cat:"妖兽材料", ic:"🦴", rarity:1, value:8,  ds:"妖兽骨骼，坚固温润。"},
  {id:"core", name:"妖兽内丹", cat:"妖兽材料", ic:"💠", rarity:2, value:120,ds:"妖兽精华，价值不菲。"},
  {id:"tort", name:"玄龟甲",  cat:"妖兽材料", ic:"🐢", rarity:2, value:35, ds:"玄龟甲壳，坚硬异常。"},
  {id:"fea",  name:"赤羽",    cat:"妖兽材料", ic:"🪶", rarity:1, value:12, ds:"赤羽火鸟之羽，轻灵。"},
  {id:"jiao", name:"蛟龙鳞",  cat:"妖兽材料", ic:"🐍", rarity:3, value:150,ds:"蛟龙逆鳞，蕴藏龙气。"},
  {id:"tiger",name:"白虎牙",  cat:"妖兽材料", ic:"🦷", rarity:4, value:280,ds:"白虎利齿，煞气逼人。"},
  {id:"zhu",  name:"朱雀翎",  cat:"妖兽材料", ic:"🔥", rarity:4, value:320,ds:"朱雀尾翎，火精所凝。"},
  {id:"xie",  name:"玄冰蝎尾",cat:"妖兽材料", ic:"🦂", rarity:3, value:90, ds:"玄冰毒蝎尾针，寒毒。"},
  {id:"peng", name:"金鹏羽",  cat:"妖兽材料", ic:"🦅", rarity:5, value:500,ds:"金翅大鹏神羽，至宝。"},
  {id:"hwl", name:"妖狐尾", cat:"妖兽材料", ic:"🦊", rarity:6, value:700, ds:"千年妖狐之尾，灵动蕴魅。"},
  {id:"xlangz", name:"玄狼爪", cat:"妖兽材料", ic:"🐺", rarity:6, value:750, ds:"玄狼利爪，破甲如纸。"},
  {id:"qilinj", name:"麒麟角", cat:"妖兽材料", ic:"🦄", rarity:7, value:1600, ds:"麒麟圣角，瑞气千条。"},
  {id:"zhulongm", name:"烛龙目", cat:"妖兽材料", ic:"👁️", rarity:7, value:1800, ds:"烛龙神目，日月之光。"},
  {id:"fenghuangy", name:"凤凰羽", cat:"妖兽材料", ic:"🌈", rarity:8, value:400000, ds:"凤凰涅槃之羽，浴火重生。"},
  {id:"xuanwubei", name:"玄武背甲", cat:"妖兽材料", ic:"🐚", rarity:8, value:420000, ds:"玄武神甲，坚不可摧。"},
  {id:"yinglongl", name:"应龙鳞", cat:"妖兽材料", ic:"🐉", rarity:9, value:900000, ds:"应龙逆鳞，龙威浩荡。"},
  {id:"taotieg", name:"饕餮骨", cat:"妖兽材料", ic:"🦴", rarity:9, value:950000, ds:"饕餮神骨，贪噬万物。"},
  {id:"hundun", name:"混沌兽丹", cat:"妖兽材料", ic:"🌀", rarity:10, value:2000000, ds:"混沌神兽内丹，鸿蒙之气。"},
  {id:"zulongy", name:"祖龙牙", cat:"妖兽材料", ic:"🦷", rarity:10, value:2200000, ds:"祖龙之牙，开天辟地。"},
  {id:"iron", name:"玄铁矿",  cat:"矿石",    ic:"⛏️", rarity:1, value:6,  ds:"地底玄铁，坚韧剔透。"},
  {id:"gold", name:"精金矿",  cat:"矿石",    ic:"🪙", rarity:2, value:30, ds:"稀有精金，璀璨夺目。"},
  {id:"myst", name:"星辰银",  cat:"矿石",    ic:"⭐", rarity:4, value:300,ds:"天外陨银，内含星辉。"},
  {id:"tong", name:"赤铜矿",  cat:"矿石",    ic:"🟠", rarity:1, value:10, ds:"赤色铜矿，性质活跃。"},
  {id:"qing", name:"青金石",  cat:"矿石",    ic:"🔷", rarity:3, value:160,ds:"青金宝石，灵气内蕴。"},
  {id:"han",  name:"寒铁",    cat:"矿石",    ic:"❄️", rarity:2, value:45, ds:"极寒铁矿，触手生霜。"},
  {id:"huoshi",name:"火灵石", cat:"矿石",    ic:"🌋", rarity:3, value:200,ds:"火属性灵石，温热灼人。"},
  {id:"bing", name:"冰晶石",  cat:"矿石",    ic:"🧊", rarity:3, value:180,ds:"万年冰晶，寒光流转。"},
  {id:"lei",  name:"雷纹石",  cat:"矿石",    ic:"⚡", rarity:4, value:350,ds:"雷纹矿脉，隐隐蕴雷。"},
  {id:"xuanhuang",name:"玄黄母矿",cat:"矿石",ic:"🏵️", rarity:5, value:600,ds:"玄黄母矿，天地灵粹。"},
  {id:"liuli", name:"琉璃晶", cat:"矿石", ic:"🔮", rarity:6, value:650, ds:"七彩琉璃晶，光彩夺目。"},
  {id:"chiyan", name:"赤炎石", cat:"矿石", ic:"🌋", rarity:6, value:720, ds:"赤炎地火所凝，灼热难当。"},
  {id:"xinghui", name:"星辉矿", cat:"矿石", ic:"✨", rarity:7, value:1500, ds:"坠星残矿，内含星辉。"},
  {id:"zijinm", name:"紫金母矿", cat:"矿石", ic:"🟪", rarity:7, value:1700, ds:"紫金母矿，天地至坚。"},
  {id:"tianwai", name:"天外陨铁", cat:"矿石", ic:"☄️", rarity:8, value:380000, ds:"天外陨铁，锋锐无匹。"},
  {id:"biluoy", name:"碧落玉", cat:"矿石", ic:"💎", rarity:8, value:360000, ds:"碧落神玉，温润生辉。"},
  {id:"hunyuan", name:"混元石", cat:"矿石", ic:"🪨", rarity:9, value:850000, ds:"混元一气石，孕育大道。"},
  {id:"hongmengj", name:"鸿蒙晶", cat:"矿石", ic:"🌌", rarity:9, value:880000, ds:"鸿蒙初判之晶。"},
  {id:"hunjing", name:"混沌玄铁", cat:"矿石", ic:"⚫", rarity:10, value:1900000, ds:"混沌玄铁，重逾万钧。"},
  {id:"chuangshij", name:"创世晶核", cat:"矿石", ic:"💠", rarity:10, value:2100000, ds:"创世遗晶，蕴含造化。"},
  {id:"herb", name:"灵草",    cat:"草药",    ic:"🌿", rarity:1, value:4,  ds:"普通灵草，药性温和。"},
  {id:"lingzhi",name:"灵芝",  cat:"草药",    ic:"🍄", rarity:2, value:25, ds:"千年灵芝，益气补灵。"},
  {id:"xuanyang",name:"玄阳花",cat:"草药",   ic:"🌺", rarity:4, value:260,ds:"玄阳之精，烈火蕴藏。"},
  {id:"longxian",name:"龙涎草",cat:"草药",   ic:"🐉", rarity:2, value:40, ds:"龙涎浇灌，清香沁人。"},
  {id:"zishen",name:"紫丹参", cat:"草药",    ic:"🟣", rarity:3, value:140,ds:"紫色丹参，药力醇厚。"},
  {id:"heshouwu",name:"千年何首乌",cat:"草药",ic:"🥔", rarity:3, value:220,ds:"千年何首乌，乌发延寿。"},
  {id:"dihuo", name:"地火参", cat:"草药",    ic:"🔥", rarity:4, value:300,ds:"地火所孕，热性大补。"},
  {id:"hansui",name:"寒髓花", cat:"草药",    ic:"💠", rarity:4, value:280,ds:"寒髓凝华，冷冽彻骨。"},
  {id:"niepan",name:"涅槃花", cat:"草药",    ic:"🦢", rarity:5, value:700,ds:"涅槃重生之花，神物。"},
  {id:"jiuye", name:"九叶莲", cat:"草药",    ic:"🪷", rarity:5, value:800,ds:"九叶仙莲，万年一开。"},
  {id:"longxue", name:"龙血草", cat:"草药", ic:"🩸", rarity:6, value:680, ds:"龙血浇灌之草，血气冲天。"},
  {id:"xianhe", name:"仙鹤草", cat:"草药", ic:"🕊️", rarity:6, value:700, ds:"仙鹤衔来之草，脱胎换骨。"},
  {id:"zixiaot", name:"紫霄藤", cat:"草药", ic:"🪺", rarity:7, value:1500, ds:"紫霄神藤，缠绕九霄。"},
  {id:"wanfuf", name:"万载茯苓", cat:"草药", ic:"🥥", rarity:7, value:1550, ds:"万载茯苓，延年益寿。"},
  {id:"yinyangh", name:"阴阳花", cat:"草药", ic:"☯️", rarity:8, value:380000, ds:"阴阳并蒂之花，太极之妙。"},
  {id:"jiuyang", name:"九阳参", cat:"草药", ic:"☀️", rarity:8, value:390000, ds:"九阳之参，至阳至热。"},
  {id:"taichu", name:"太初神药", cat:"草药", ic:"🌾", rarity:9, value:860000, ds:"太初神药，逆天改命。"},
  {id:"hundung", name:"混沌果", cat:"草药", ic:"🍈", rarity:9, value:890000, ds:"混沌神果，开天辟地。"},
  {id:"chuangshil", name:"创世莲子", cat:"草药", ic:"🪷", rarity:10, value:1950000, ds:"创世遗莲之实。"},
  {id:"changsheng", name:"长生不老药", cat:"草药", ic:"🍵", rarity:10, value:2150000, ds:"传说仙药，长生不老。"},
];

/* 奇珍库（预留空库：旧版奇珍数据已清空，待后续版本填充启用） */
const TRES = [];
const MATS_BY_ID={}; MATS.forEach(m=>MATS_BY_ID[m.id]=m);
const TRES_BY_ID={}; TRES.forEach(t=>TRES_BY_ID[t.id]=t);
const BEAS=[
  {id:"qingniao", name:"青鸟",   ic:"🐦", rarity:1,  atk:0,  ess:2,  crit:0, brk:0, dmgR:0,  ds:"青羽灵禽，纳灵养气。"},
  {id:"linghu",   name:"灵狐",   ic:"🦊", rarity:2,  atk:0,  ess:0,  crit:3, brk:0, dmgR:0,  ds:"灵性通幽，会心偶至。"},
  {id:"xuang",    name:"玄龟",   ic:"🐢", rarity:3,  atk:0,  ess:0,  crit:0, brk:0, dmgR:4,  ds:"玄甲厚重，卸力化劫。"},
  {id:"chiyanshi",name:"赤焰狮", ic:"🦁", rarity:4,  atk:5,  ess:0,  crit:0, brk:0, dmgR:0,  ds:"赤焰焚天，攻伐之兽。"},
  {id:"bishuijiao",name:"碧水蛟",ic:"🐉", rarity:5,  atk:0,  ess:6,  crit:0, brk:0, dmgR:0,  ds:"碧水化蛟，灵气自涌。"},
  {id:"leiying",  name:"雷鹰",   ic:"🦅", rarity:6,  atk:8,  ess:0,  crit:2, brk:0, dmgR:0,  ds:"雷翼展空，迅捷暴烈。"},
  {id:"jinyipeng",name:"金翅鹏", ic:"🪶", rarity:7,  atk:10, ess:0,  crit:0, brk:0, dmgR:0,  ds:"金翅垂天，翱翔万里。"},
  {id:"jiuweihu", name:"九尾狐", ic:"🦊", rarity:8,  atk:0,  ess:8,  crit:5, brk:0, dmgR:0,  ds:"九尾通灵，魅惑众生。"},
  {id:"qilin",    name:"麒麟",   ic:"🦌", rarity:9,  atk:0,  ess:12, crit:0, brk:0, dmgR:6,  ds:"瑞兽麒麟，祥瑞加身。"},
  {id:"zhenlong", name:"真龙",   ic:"🐲", rarity:10, atk:15, ess:10, crit:0, brk:0, dmgR:8,  ds:"五爪真龙，傲视九天。"},
];
const BEAS_BY_ID={}; BEAS.forEach(x=>BEAS_BY_ID[x.id]=x);

