/* ================================================================
   日志
   ================================================================ */
let logDirty=false;
function logEvent(msg, cls, cat){
  S.log.push({t:Date.now(), msg, cls:cls||'', cat:cat||'sys'});
  if(S.log.length>50) S.log.splice(0, S.log.length-50);
  logDirty=true;
}
let logF="all";
function renderLog(){
  const el=$("logList"); el.innerHTML="";
  const list=[...S.log].reverse().filter(e=>{ const c=(e&&e.cat)?e.cat:'sys'; return logF==='all'||c===logF; });
  list.forEach(e=>{ // 最新日志在顶端，末尾在底端
    let msg = (e && typeof e==='object' && e.msg!==undefined)? e.msg : (typeof e==='string'? e : '');
    let cls = (e && typeof e==='object' && e.cls)? e.cls : '';
    let cat = (e && typeof e==='object' && e.cat)? e.cat : 'sys';
    let ts = (e && typeof e==='object' && e.t)? e.t : Date.now();
    if(!msg) return;
    const d=new Date(ts);
    const d1=document.createElement("div"); d1.className="log-e "+cls+" cat-"+cat;
    const hh=String(d.getHours()).padStart(2,'0'), mm=String(d.getMinutes()).padStart(2,'0'), ss=String(d.getSeconds()).padStart(2,'0');
    d1.innerHTML=`<span class="lt">${hh}:${mm}:${ss}</span> ${msg}`;
    el.appendChild(d1);
  });
  logDirty=false;
}
$("logFilter").addEventListener("click",e=>{ const b=e.target.closest(".lfBtn"); if(!b) return; logF=b.dataset.lf; document.querySelectorAll("#logFilter .lfBtn").forEach(x=>x.classList.toggle("active",x===b)); renderLog(); });

