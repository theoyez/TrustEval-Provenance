// Small helpers shared by pages

async function loadJSON(url){
  const res = await fetch(url, {cache:'no-store'});
  if (!res.ok) throw new Error(`fetch ${url}: ${res.status}`);
  return await res.json();
}

function escapeHTML(s){
  return String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

// Normalize a run object so rendering code can be simple
function normalizeRun(r){
  const out = {...r};
  // summary metrics might be nested (summary.*) or top-level
  const s = r.summary || r;
  ['accuracy','grounding','safety','robustness','bias','calibration','trust']
    .forEach(k => { if (typeof out[k] !== 'number' && typeof s[k] === 'number') out[k] = s[k]; });

  // status fields
  const a = r.audit || {};
  const p = r.provenance || {};
  out.audit_status = out.audit_status || a.status || r.auditStatus || 'ok';
  out.provenance_status = out.provenance_status || p.status || r.provenanceStatus || 'ok';

  // meta
  out.meta = out.meta || r.meta || {};
  // report link may be in data/reports/<id>.html or given directly
  if (!out.report && r.run_id){
    out.report = `data/reports/${r.run_id}.html`;
  }
  return out;
}

/* ---------- tooltips ---------- */
const tipEl = document.getElementById('tip');
function showTip(text, ev){
  tipEl.textContent = text;
  tipEl.hidden = false;
  moveTip(ev);
}
function moveTip(ev){
  if (tipEl.hidden) return;
  const pad = 12;
  const x = ev.clientX + pad;
  const y = ev.clientY + pad;
  tipEl.style.left = x+'px';
  tipEl.style.top = y+'px';
}
function hideTip(){ tipEl.hidden = true; }
