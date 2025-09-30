
async function loadBoard(){
  const res = await fetch('leaderboard.json'); const data = await res.json();
  const runs = data.runs, cols = data.metrics;
  const tbody = document.querySelector('#tbody');
  const thead = document.querySelector('#theadRow');

  function th(label, key){ return `<th class="tooltip sort" data-key="${key}" data-tip="${label} definition">${label} <span class="arrow">↕</span></th>`; }

  thead.innerHTML = `
    <th class="tooltip" data-tip="Run identifier (unique)">Run</th>
    <th class="tooltip" data-tip="Model / system info. Click pill to see metadata.">Model</th>
    ${cols.map(k=> th(k[0].toUpperCase()+k.slice(1), k)).join('')}
    ${data.with_provenance? '<th class="tooltip" data-tip="Provenance checks">Provenance</th>': ''}
    <th class="tooltip" data-tip="Per-run RAG checks">Audit</th>
    <th>Report</th>`;

  function row(r){
    const mcols = cols.map(k=>`<td>${(r[k]*100).toFixed(1)}%</td>`).join('');
    const prov = data.with_provenance ? `<td data-prov>
      <button class="pill ${r.provenance_status}"><span class="nowrap">${r.provenance_status}</span> <span class="chev">▸</span></button>
      <div class="drawer" hidden>
        <div class="kvs">
          <span class="kv"><b class="mono">root</b> ${r.proof_root||'—'}</span>
          ${r.proof_url? `<a class="kv" href="${r.proof_url}">download proof</a>` : '<span class="kv small">no file</span>'}
        </div>
      </div>
    </td>` : '';
    const audit = `<td data-audit>
      <button class="pill ${r.audit_status}"><span class="nowrap">${r.audit_status}</span> <span class="chev">▸</span></button>
      <div class="drawer" hidden>
        <div class="grid2">
          <div><b>Retrieval candidates</b><div class="small mono">${(r.audit?.candidates||[]).join('<br>')}</div></div>
          <div><b>Citations used</b><div class="small mono">${(r.audit?.citations||[]).join('<br>')}</div></div>
        </div>
      </div>
    </td>`;
    return `<tr>
      <td><span class="mono">${r.run_id}</span></td>
      <td data-model>
        <button class="pill"><span class="nowrap">${r.model}</span> <span class="chev">▸</span></button>
        <div class="drawer" hidden>
          <div class="kvs">
            ${Object.entries(r.meta||{}).map(([k,v])=>`<span class="kv"><b>${k}</b> ${v}</span>`).join('')}
          </div>
        </div>
      </td>
      ${mcols}
      ${prov}
      ${audit}
      <td><a class="btn" href="${r.report}">Report</a></td>
    </tr>`;
  }
  function render(arr){ tbody.innerHTML = arr.map(row).join(''); }
  render(runs);

  // drawer toggles
  tbody.addEventListener('click', e=>{
    const btn = e.target.closest('button.pill'); if(!btn) return;
    const drawer = btn.parentElement.nextElementSibling; const chev = btn.querySelector('.chev');
    drawer.hidden = !drawer.hidden; chev.style.transform = drawer.hidden ? 'rotate(0deg)' : 'rotate(90deg)';
  });

  // search
  const q = document.querySelector('#search');
  q.addEventListener('input', ()=>{
    const v = q.value.toLowerCase();
    for(const tr of tbody.querySelectorAll('tr')){
      tr.style.display = tr.textContent.toLowerCase().includes(v)?'':'none';
    }
  });

  // sort
  let sortKey = null, sortAsc = true;
  thead.addEventListener('click', e=>{
    const th = e.target.closest('.sort'); if(!th) return;
    const key = th.dataset.key;
    sortAsc = sortKey===key ? !sortAsc : true;
    sortKey = key;
    const sorted = runs.slice().sort((a,b)=> (a[key]-b[key])*(sortAsc?1:-1));
    render(sorted);
  });

  // compare wiring
  const leftSel = document.getElementById('leftSel');
  const rightSel = document.getElementById('rightSel');
  if(leftSel && rightSel){
    runs.forEach(r=>{ leftSel.add(new Option(r.run_id, r.run_id)); rightSel.add(new Option(r.run_id, r.run_id)); });
    document.getElementById('openReports').onclick = ()=>{
      const l = leftSel.value, r = rightSel.value;
      window.open(runs.find(x=>x.run_id===l).report,'_blank');
      window.open(runs.find(x=>x.run_id===r).report,'_blank');
    };
    function fmt(x){return (x*100).toFixed(1)+'%';}
    function renderCompare(){
      const L = runs.find(x=>x.run_id===leftSel.value) || runs[0];
      const R = runs.find(x=>x.run_id===rightSel.value) || runs[1] || runs[0];
      const tbodyC = document.getElementById('compareBody');
      tbodyC.innerHTML = cols.map(k=>{
        const d = (R[k]-L[k])*100; const sign = d>0?'+':'';
        const color = d>=0?'#93f0cf':'#ffd7a3';
        return `<tr><td>${k[0].toUpperCase()+k.slice(1)}</td><td>${fmt(L[k])}</td><td>${fmt(R[k])}</td><td style="color:${color}">${sign}${d.toFixed(1)}%</td></tr>`;
      }).join('');
    }
    leftSel.onchange = rightSel.onchange = renderCompare;
    if(runs.length>=2){ leftSel.value=runs[0].run_id; rightSel.value=runs[1].run_id; renderCompare(); }
  }
}
document.addEventListener('DOMContentLoaded', loadBoard);
