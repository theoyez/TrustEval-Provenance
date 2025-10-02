async function loadJSON(path){ const r = await fetch(path); return await r.json(); }
function fmt(n){ return typeof n==='number'? n.toFixed(3): n; }
function newestFirst(a,b){ return a.date < b.date ? 1 : -1; }
function renderAudit(r){
  if(!window.TRUSTEVAL_HAS_PROV || !r.audit_quickpeek){ return ''; }
  const aq = r.audit_quickpeek;
  const sources = (aq.sources||[]).slice(0,3).join(', ');
  const ok = (aq.consistency||[]).includes('citations_present') && (aq.consistency||[]).includes('no_conflict');
  const badge = ok ? 'consistent✓' : 'check';
  return `<div class="audit"><span class="badge" title="retrieved@k">k=${aq.retrieved_k}</span><span class="badge" title="sources">${sources}</span><span class="badge" title="consistency">${badge}</span></div>`;
}
function renderBoard(rows){
  const tb = document.querySelector('#board tbody');
  tb.innerHTML = '';
  rows.forEach(r=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="pill" title="Internal id">${r.id}</span></td>
      <td title="Model label">${r.model}</td>
      <td class="small" title="Short model description">${r.model_desc||''}</td>
      <td title="Run date">${r.date}</td>
      <td title="Primary accuracy">${fmt(r.metrics.accuracy)}</td>
      ${window.TRUSTEVAL_HAS_PROV ? `<td>${renderAudit(r)}</td>` : ''}
      <td><a href="${r.report_path}" title="Open report">Open report</a></td>`;
    tb.appendChild(tr);
  });
}
async function boot(){
  const data = await loadJSON('data/leaderboard.json?v='+Date.now());
  let rows = data.runs.sort(newestFirst);
  const filterModel = document.getElementById('filterModel');
  const reset = document.getElementById('reset');
  function apply(){
    const q = (filterModel.value||'').trim().toLowerCase();
    let view = rows;
    if(q){ view = rows.filter(r=> r.model.toLowerCase().includes(q) || (r.model_desc||'').toLowerCase().includes(q)); }
    renderBoard(view);
  }
  filterModel?.addEventListener('input', apply);
  reset?.addEventListener('click', ()=>{ filterModel.value=''; apply(); });
  apply();
  // Compare page wiring
  const runA = document.getElementById('runA');
  const runB = document.getElementById('runB');
  if(runA && runB){
    rows.forEach(r=>{
      const o1 = document.createElement('option'); o1.value=r.id; o1.textContent=`${r.id} — ${r.model}`;
      const o2 = document.createElement('option'); o2.value=r.id; o2.textContent=`${r.id} — ${r.model}`;
      runA.appendChild(o1); runB.appendChild(o2);
    });
    if(rows.length>=2){ runA.value = rows[0].id; runB.value = rows[1].id; }
    document.getElementById('swap').addEventListener('click', ()=>{
      const tmp = runA.value; runA.value = runB.value; runB.value = tmp; renderCards();
    });
    function renderCards(){
      const a = rows.find(r=>r.id===runA.value);
      const b = rows.find(r=>r.id===runB.value);
      const cards = document.getElementById('cards');
      const dAcc = (a.metrics.accuracy - b.metrics.accuracy);
      const dPpl = (a.metrics.perplexity - b.metrics.perplexity);
      cards.innerHTML = '';
      [a,b].forEach((r,i)=>{
        const el = document.createElement('div');
        el.className='card';
        el.innerHTML = `
          <div class="row"><span class="pill" title="id">${r.id}</span><strong>${r.model}</strong><span class="small muted">${r.date}</span></div>
          <div class="small muted">${r.model_desc||''}</div>
          <div class="kpi"><span class="label">Accuracy</span><span class="value">${fmt(r.metrics.accuracy)}</span></div>
          <div class="kpi"><span class="label">Perplexity</span><span class="value">${fmt(r.metrics.perplexity)}</span></div>
          <p><a href="${r.report_path}" title="Open full report">Open report</a></p>
        `;
        cards.appendChild(el);
      });
      // Delta card
      const delta = document.createElement('div');
      delta.className='card';
      delta.innerHTML = `
        <div class="row"><strong>Delta (A - B)</strong></div>
        <div class="kpi"><span class="label">Δ Accuracy</span><span class="value">${fmt(dAcc)}</span></div>
        <div class="kpi"><span class="label">Δ Perplexity</span><span class="value">${fmt(dPpl)}</span></div>
      `;
      cards.appendChild(delta);
    }
    runA.addEventListener('change', renderCards);
    runB.addEventListener('change', renderCards);
    renderCards();
  }
}
document.addEventListener('DOMContentLoaded', boot);
