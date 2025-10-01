const LB='./data/leaderboard.json';
function $(q,root=document){return root.querySelector(q)} function $all(q,root=document){return [...root.querySelectorAll(q)]}
function pct(x){return ((x||0)*100).toFixed(1)+'%'}
function metaHTML(m){ if(!m) return '—'; return Object.entries(m).map(([k,v])=>`<code>${k}</code>: ${String(v)}`).join('<br>') }
function auditHTML(d){ if(!d) return '—'; const r=(d.retrieved||[]).map(x=>`<li>${x}</li>`).join(''); const c=(d.cited||[]).map(x=>`<li>${x}</li>`).join(''); return `<strong>Retrieved</strong><ul>${r}</ul><strong>Cited</strong><ul>${c}</ul>` }
function provHTML(r){ if(r.prov_root) return `Merkle root: <code>${r.prov_root}</code> · <a href="./data/proofs/${r.run_id}.json" download>download proof</a>`; return r.provenance||'—'; }
async function load(){ const res=await fetch(LB,{cache:'no-store'}); const data=await res.json(); render(data.runs||[]) }
function render(rows){
  const tbody=$('tbody'); tbody.innerHTML='';
  rows.forEach((r,idx)=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`
      <td>${r.run_id}</td>
      <td><button class="pill model" aria-expanded="false" data-for="row${idx}"><span>${r.model||'—'}</span><span class="chev">▸</span></button></td>
      <td>${pct(r.accuracy)}</td>
      <td>${pct(r.grounding)}</td>
      <td>${pct(r.safety)}</td>
      ${('robustness' in r)?`<td>${pct(r.robustness)}</td>`:''}
      ${('bias' in r)?`<td>${pct(r.bias)}</td>`:''}
      ${('calibration' in r)?`<td>${pct(r.calibration)}</td>`:''}
      <td><strong>${pct(r.trust_score||r.trust||0)}</strong></td>
      ${('prov_root' in r)?`<td><button class="pill prov" aria-expanded="false" data-for="row${idx}"><span>${r.provenance||'ok'}</span><span class="chev">▸</span></button></td>`:`<td>—</td>`}
      <td><button class="pill audit" aria-expanded="false" data-for="row${idx}"><span>${r.audit||'ok'}</span><span class="chev">▸</span></button></td>
      <td><a href="./data/reports/${encodeURIComponent(r.run_id)}.html">Report</a></td>`;
    tbody.appendChild(tr);
    const dr=document.createElement('tr'); dr.className='drawer-row'; dr.id=`row${idx}`;
    dr.innerHTML=`<td colspan="${tr.children.length}"><div class="drawer">
        <div class="card"><h4>Model meta</h4><div>${metaHTML(r.meta)}</div></div>
        <div class="card"><h4>Audit trail</h4><div>${auditHTML(r.audit_details)}</div></div>
        <div class="card"><h4>Provenance</h4><div>${provHTML(r)}</div></div>
      </div></td>`;
    tbody.appendChild(dr);
  });
  $all('.model,.audit,.prov').forEach(btn=>btn.addEventListener('click',()=>{
    const id=btn.getAttribute('data-for'); const row=document.getElementById(id);
    const exp=btn.getAttribute('aria-expanded')==='true'; btn.setAttribute('aria-expanded',(!exp).toString()); row.style.display=exp?'none':'table-row';
  },{passive:true}));
  const q=$('.search'); if(q && !q.dataset.hooked){ q.dataset.hooked=1; q.addEventListener('input',()=>{
    const s=q.value.toLowerCase(); render(rows.filter(r=>JSON.stringify(r).toLowerCase().includes(s)));
  });}
}
document.addEventListener('DOMContentLoaded', load);