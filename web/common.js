
let runs=[], sortKey=null, sortAsc=true;
const pct=x=> (x*100).toFixed(1)+'%';
function setSortIndicator(map, key){
  document.querySelectorAll('.sortable').forEach(th=>{ th.setAttribute('aria-sort','none'); th.querySelector('.arrow').textContent='↕'; });
  const th = document.getElementById(map[key]); if (!th) return;
  th.setAttribute('aria-sort', sortAsc ? 'ascending' : 'descending');
  th.querySelector('.arrow').textContent = sortAsc ? '▲' : '▼';
}
function renderRows(ROW_HTML){
  const q=(document.getElementById('filter')?.value||'').toLowerCase();
  const view=runs.filter(r=> !q || JSON.stringify(r).toLowerCase().includes(q));
  const tbody=document.querySelector('tbody');
  tbody.innerHTML=view.map(r=>ROW_HTML(r)).join('');
}
function applySort(key, ROW_HTML){
  if (sortKey===key) sortAsc=!sortAsc; else { sortKey=key; sortAsc=true; }
  runs.sort((a,b)=>{
    const av=a[key], bv=b[key];
    if (typeof av==='number' && typeof bv==='number') return sortAsc? av-bv : bv-av;
    return sortAsc? String(av||'').localeCompare(String(bv||'')) : String(bv||'').localeCompare(String(av||''));
  });
  setSortIndicator(MAP, key); renderRows(ROW_HTML);
}
async function load(MAP, ROW_HTML){
  const res=await fetch('leaderboard.json'); const data=await res.json();
  runs=(data.runs||[]).slice();
  document.getElementById('lastUpdated').textContent=data.updated_at||'—';
  renderRows(ROW_HTML);
  Object.entries(MAP).forEach(([key,id])=>{
    const th=document.getElementById(id);
    th.addEventListener('click',()=>applySort(key, ROW_HTML));
    th.tabIndex=0; th.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); applySort(key, ROW_HTML); } });
  });
  const f=document.getElementById('filter'); if (f) f.addEventListener('input', ()=>renderRows(ROW_HTML));
}
