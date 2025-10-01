function initReport(){
  const data=window.metrics||{};
  document.querySelectorAll('.kpi .bar span').forEach(el=>{ const k=el.dataset.key; const v=Math.max(0,Math.min(1,data[k]||0)); el.style.width=(v*100).toFixed(1)+'%'; });
  const barsBtn=document.getElementById('barsBtn'), radarBtn=document.getElementById('radarBtn');
  const barsPane=document.getElementById('barsPane'), radarPane=document.getElementById('radarPane');
  function setMode(m){ const R=m==='radar'; radarPane.style.display=R?'block':'none'; barsPane.style.display=R?'none':'block';
    barsBtn.classList.toggle('active', !R); radarBtn.classList.toggle('active', R); }
  barsBtn.addEventListener('click',()=>setMode('bars')); radarBtn.addEventListener('click',()=>setMode('radar')); setMode('bars');
  // draw radar
  const c=document.getElementById('radar'); if(!c) return; const ctx=c.getContext('2d'); const keys=Object.keys(data);
  function draw(){
    const cx=c.width/2, cy=c.height/2, R=Math.min(cx,cy)-20;
    ctx.clearRect(0,0,c.width,c.height); ctx.strokeStyle='#232736'; ctx.lineWidth=1;
    for(let r=0.2;r<=1;r+=0.2){ ctx.beginPath(); for(let i=0;i<keys.length;i++){ const a=(Math.PI*2*i/keys.length)-Math.PI/2; const x=cx+Math.cos(a)*R*r, y=cy+Math.sin(a)*R*r; i?ctx.lineTo(x,y):ctx.moveTo(x,y);} ctx.closePath(); ctx.stroke(); }
    ctx.beginPath(); ctx.strokeStyle='#8b7dff'; ctx.fillStyle='rgba(139,125,255,.12)'; ctx.lineWidth=2;
    for(let i=0;i<keys.length;i++){ const v=Math.max(0,Math.min(1,data[keys[i]]||0)); const a=(Math.PI*2*i/keys.length)-Math.PI/2; const x=cx+Math.cos(a)*R*v, y=cy+Math.sin(a)*R*v; i?ctx.lineTo(x,y):ctx.moveTo(x,y);} ctx.closePath(); ctx.stroke(); ctx.fill();
  }
  draw();
}
document.addEventListener('DOMContentLoaded', initReport);