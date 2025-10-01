
async function loadJSON(p){ const r=await fetch(p); return r.json(); }
function $(q,r=document){ return r.querySelector(q) }
function $all(q,r=document){ return Array.from(r.querySelectorAll(q)) }
function fmt(x){ return (x*100).toFixed(1)+'%'; }
function sortTable(tbody, idx){
  const rows=[...tbody.children];
  const dir = (tbody.dataset.col==idx && tbody.dataset.dir=='asc')?'desc':'asc';
  rows.sort((a,b)=> {
    const ax = a.children[idx].dataset.sort ?? a.children[idx].textContent.trim();
    const bx = b.children[idx].dataset.sort ?? b.children[idx].textContent.trim();
    return (parseFloat(ax)-parseFloat(bx)) * (dir==='asc'?1:-1);
  });
  tbody.replaceChildren(...rows); tbody.dataset.col = idx; tbody.dataset.dir = dir;
}
function tooltips(){ $all('th[data-tip]').forEach(th=>{ th.classList.add('tooltip'); }); }
