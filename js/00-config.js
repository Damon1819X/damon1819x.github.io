/* ================================================================
   修仙挂机 · 问道长生  v31.24（飞升碎片下调 / 神通涨价）
   ruleset: xiuxian-idle-v5
   ================================================================ */
const RULESET_ID = "xiuxian-idle-v5";
const VERSION = "v31.24";
const CFG = {
  saveKey: "xiuxianIdle_save_v5", // 存档键保持 v5 以兼容历史存档（版本演进见 GDD）
  huangBase: 10.0,
  freeRerolls: 10,
  rerollBaseCost: 100,
  rerollCostM: 1.5,
  yunBaseMs: 4000,
  offlineCapHours: 12,
  breakFailLoss: 0.40,
};

const $ = id => document.getElementById(id);
function fmt(n){
  if(n>=1e15) return (n/1e15).toFixed(2)+" 兆";
  if(n>=1e12) return (n/1e12).toFixed(2)+"T";
  if(n>=1e9) return (n/1e9).toFixed(2)+"B";
  if(n>=1e6) return (n/1e6).toFixed(2)+"M";
  if(n>=1e4) return (n/1e3).toFixed(1)+"K";
  if(n<100) return (Math.floor(n*10)/10).toString();
  return Math.floor(n).toString();
}
let _AC=null;
function _ac(){ if(_AC) return _AC; try{ const C=(typeof AudioContext!=="undefined")?AudioContext:(typeof webkitAudioContext!=="undefined"?webkitAudioContext:null); if(!C) return null; _AC=new C(); }catch(e){ _AC=null; } return _AC; }
function sound(f,dur,vol,delay){ try{ /* v31.22 音效分层：共享 AudioContext，可调时长/音量/延迟；单参调用与旧版等价 */
    const a=_ac(); if(!a) return; if(a.state==="suspended"&&a.resume) a.resume();
    const t0=a.currentTime+(delay||0), d=Math.max(0.03,dur||0.15), v=(vol==null?0.12:Math.max(0.001,vol));
    const o=a.createOscillator(), g=a.createGain();
    o.type="sine"; o.frequency.value=f; o.connect(g); g.connect(a.destination);
    g.gain.setValueAtTime(0.0001,t0); g.gain.linearRampToValueAtTime(v,t0+Math.min(0.02,d/3)); g.gain.exponentialRampToValueAtTime(0.0001,t0+d);
    o.start(t0); o.stop(t0+d+0.03);
  }catch(e){} }
function soundSeq(list){ (list||[]).forEach(n=>{ if(n&&n.length) sound(n[0],n[1],n[2],n[3]); }); }
function sfxLevelUp(){ soundSeq([[523,0.12,0.11,0],[659,0.12,0.11,0.11],[784,0.22,0.12,0.22]]); } /* 突破成功：三连升调 */
function sfxFail(){ soundSeq([[330,0.14,0.10,0],[247,0.26,0.09,0.14]]); } /* 失败：低沉下降 */
function sfxRare(){ soundSeq([[880,0.07,0.10,0],[1175,0.10,0.10,0.055]]); } /* 稀有掉落：短促双音 */
function sfxCoin(){ soundSeq([[988,0.06,0.10,0],[1319,0.06,0.10,0.05],[1568,0.14,0.11,0.10]]); } /* 拍卖成交：金币三响 */
function blip(){ sound(520); }
function banner(msg){ const b=$("banner"); b.textContent=msg; b.classList.add("show"); clearTimeout(b._t); b._t=setTimeout(()=>b.classList.remove("show"),2600); }
function showModal(t,body,cb){ $("mTitle").textContent=t; $("mBody").textContent=body; if(cb) $("mBtn").onclick=()=>{ $("overlay").classList.remove("show"); cb(); }; $("overlay").classList.add("show"); }

