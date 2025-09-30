
// Simple radar drawing (no external libs)
function drawRadar(canvas, labels, values, maxValue){
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0,0,w,h);
  const cx = w/2, cy = h/2, r = Math.min(w,h)/2 - 18;
  const N = labels.length;
  // grid
  ctx.strokeStyle = '#2a3244'; ctx.lineWidth = 1;
  for(let g=1; g<=4; g++){
    const rg = r*g/4;
    ctx.beginPath();
    for(let i=0;i<N;i++){
      const ang = -Math.PI/2 + 2*Math.PI*i/N;
      const x = cx + rg*Math.cos(ang);
      const y = cy + rg*Math.sin(ang);
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.closePath(); ctx.stroke();
  }
  // axes + labels
  ctx.fillStyle = '#cfd4da'; ctx.font = '12px Inter, sans-serif';
  for(let i=0;i<N;i++){
    const ang = -Math.PI/2 + 2*Math.PI*i/N;
    const x = cx + (r+10)*Math.cos(ang);
    const y = cy + (r+10)*Math.sin(ang);
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+r*Math.cos(ang), cy+r*Math.sin(ang)); ctx.stroke();
    ctx.textAlign = (Math.cos(ang)>0.1)?'left':(Math.cos(ang)<-0.1?'right':'center');
    ctx.textBaseline = (Math.sin(ang)>0.1)?'top':(Math.sin(ang)<-0.1?'bottom':'middle');
    ctx.fillText(labels[i], x, y);
  }
  // data
  ctx.beginPath();
  for(let i=0;i<N;i++){
    const v = values[i] / maxValue;
    const ang = -Math.PI/2 + 2*Math.PI*i/N;
    const x = cx + r*v*Math.cos(ang);
    const y = cy + r*v*Math.sin(ang);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(171, 129, 255, 0.20)';
  ctx.strokeStyle = '#ab81ff'; ctx.lineWidth = 2;
  ctx.fill(); ctx.stroke();
}
