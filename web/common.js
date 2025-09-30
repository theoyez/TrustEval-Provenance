
async function loadJSON(p){ try{const r=await fetch(p); if(!r.ok) throw new Error(p+':'+r.status); return await r.json(); }catch(e){ if(p==='leaderboard.json') return await loadJSON('data/leaderboard.json'); throw e; } }
function pct(x){ if(typeof x==='string' && x.endsWith('%')) return x; return (x*100).toFixed(1)+'%'; }
function byId(id){ return document.getElementById(id); }
function toggleDrawer(id){ const el=byId(id); if(!el) return; el.classList.toggle('show'); }
function fmtRow(run, cols, withProv){
  const id = run.run || run.run_id || run.id;
  const model = run.model || '—';
  let tds = '';
  for(const c of cols){
    if(c==='run') tds += `<td>${id}</td>`;
    else if(c==='model') tds += `<td><button class="pill" onclick="toggleDrawer('m_${id}')"><span>${model}</span> <span class="chev">▸</span></button></td>`;
    else if(['accuracy','grounding','safety','robustness','bias','calibration','trust'].includes(c)) tds += `<td>${pct(run[c]||0)}</td>`;
    else if(c==='provenance') tds += `<td><button class="pill ${run.prov_status||'ok'}" onclick="toggleDrawer('p_${id}')">ok <span class="chev">▸</span></button></td>`;
    else if(c==='audit') tds += `<td><button class="pill ${run.audit_status||'ok'}" onclick="toggleDrawer('a_${id}')">ok <span class="chev">▸</span></button></td>`;
    else if(c==='report') tds += `<td><a class="btn" href="${run.report||('data/reports/'+id+'.html')}">Report</a></td>`;
  }
  let drawers = '';
  drawers += `<tr class="drawer" id="m_${id}"><td colspan="${cols.length}">
    <span class="tag">model: ${model}</span>
    <span class="tag">dataset: ${run.dataset||'—'}</span>
    <span class="tag">retriever: ${run.retriever||'—'}</span>
    <span class="tag">prompt: ${run.prompt_cfg||'—'}</span>
    <span class="tag">date: ${run.date||'—'}</span>
  </td></tr>`;
  drawers += `<tr class="drawer" id="a_${id}"><td colspan="${cols.length}">
    <div class="small">${run.audit||'Audit OK.'}</div></td></tr>`;
  if(withProv){
    drawers += `<tr class="drawer" id="p_${id}"><td colspan="${cols.length}">
      <span class="tag">Merkle root: ${run.merkle_root||'—'}</span>
      ${run.proof?(`<span class="tag"><a href="${run.proof}">download proof</a></span>`):''}
    </td></tr>`;
  }
  return `<tr class="row">${tds}</tr>${drawers}`;
}
function renderTable(rows, cols, withProv){
  const body = byId('tbody'); body.innerHTML = rows.map(r => fmtRow(r, cols, withProv)).join('');
}
function sortBy(rows, key, dir){
  const k = key; const d = dir;
  const parse = v => {
    if(v==null) return -Infinity;
    if(typeof v==='string' && v.endsWith('%')) return parseFloat(v);
    if(typeof v==='number') return v*100;
    return 0;
  };
  rows.sort((a,b)=> (parse(a[k]) - parse(b[k])) * (d==='asc'?1:-1));
}
