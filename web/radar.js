
function drawRadar(canvas, labels, values){
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.clientWidth;
  const H = canvas.height = 420;
  ctx.clearRect(0,0,W,H);
  const cx=W/2, cy=H/2+10, R=Math.min(W,H)/2-40, n=labels.length;
  ctx.strokeStyle='#27313a'; ctx.lineWidth=1;
  for(let r=0.2;r<=1.0;r+=0.2){
    ctx.beginPath();
    for(let i=0;i<n;i++){ const t=(Math.PI*2*i/n)-Math.PI/2; const x=cx+Math.cos(t)*R*r, y=cy+Math.sin(t)*R*r; if(i==0)ctx.moveTo(x,y); else ctx.lineTo(x,y); }
    ctx.closePath(); ctx.stroke();
  }
  ctx.fillStyle='#cfd5df'; ctx.font='12px system-ui';
  for(let i=0;i<n;i++){ const t=(Math.PI*2*i/n)-Math.PI/2, x=cx+Math.cos(t)*(R+14), y=cy+Math.sin(t)*(R+14); ctx.textAlign='center'; ctx.fillText(labels[i],x,y); }
  ctx.beginPath();
  for(let i=0;i<n;i++){ const t=(Math.PI*2*i/n)-Math.PI/2, rr=R*values[i], x=cx+Math.cos(t)*rr, y=cy+Math.sin(t)*rr; if(i==0)ctx.moveTo(x,y); else ctx.lineTo(x,y); }
  ctx.closePath(); ctx.fillStyle='rgba(183,157,253,0.22)'; ctx.strokeStyle='rgba(183,157,253,0.85)'; ctx.lineWidth=2; ctx.fill(); ctx.stroke();
}
