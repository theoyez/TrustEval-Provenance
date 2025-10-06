// v5.2 CSP-safe: tooltips + chevrons + per-report radar from embedded #radarData
(function(){
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  function ensureTooltipsAndChevrons(root){
    try{
      (root||document).querySelectorAll('thead th').forEach(th=>{
        if(!th.getAttribute('title')){
          const txt=(th.textContent||'').trim();
          th.setAttribute('title', txt||'column');
        }
      });
      (root||document).querySelectorAll('td, .audit').forEach(cell=>{
        const aud = cell.matches('.audit') ? cell : cell.querySelector('.audit');
        if(!aud) return;
        const kids = aud.querySelectorAll('*');
        for (let i=0;i<kids.length;i++){
          const el = kids[i];
          if(!el.getAttribute('title')) el.setAttribute('title', i===0?'retrieved@k':(i===1?'top sources':'consistency'));
          el.style.whiteSpace = 'nowrap';
          if(i<2 && !/\bchev\b/.test(el.className)) el.className += ' chev';
        }
      });
    }catch(e){}
  }
  function drawRadar(){
    try{
      let mount=document.getElementById('radarTop');
      if(!mount){
        const cont=document.querySelector('.container') || document.body;
        mount=document.createElement('div');
        mount.id='radarTop';
        cont.insertBefore(mount, cont.firstChild);
      }
      const dataNode=document.getElementById('radarData');
      if(!dataNode){ return; }
      const labels=["Accuracy","Grounding","Safety","Robustness","Bias","Calibration","Trust"];
      const vals=[
        parseFloat(dataNode.getAttribute('data-acc')||'0.6'),
        parseFloat(dataNode.getAttribute('data-grounding')||'0.6'),
        parseFloat(dataNode.getAttribute('data-safety')||'0.6'),
        parseFloat(dataNode.getAttribute('data-robustness')||'0.6'),
        parseFloat(dataNode.getAttribute('data-bias')||'0.6'),
        parseFloat(dataNode.getAttribute('data-calibration')||'0.6'),
        parseFloat(dataNode.getAttribute('data-trust')||'0.6'),
      ];
      var w=560,h=300,cx=w/2,cy=h/2+10,rad=95;
      function pt(r,a){ return [cx+r*Math.cos(a), cy+r*Math.sin(a)]; }
      var step=2*Math.PI/labels.length, pts=[], grid='', texts='';
      for(var i=0;i<labels.length;i++){
        var ang=-Math.PI/2 + i*step;
        var rr=rad*Math.max(0,Math.min(1, vals[i]||0)); var p=pt(rr,ang); pts.push(p[0]+','+p[1]);
        var lp=pt(rad+18,ang); texts+='<text x="'+lp[0]+'" y="'+lp[1]+'" text-anchor="middle">'+labels[i]+'</text>';
      }
      [0.33,0.66,1.0].forEach(function(k){ var r=rad*k; grid+='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="#2a3440" stroke-width="1"/>'; });
      var svg='<svg width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'">'+
        '<g>'+grid+'</g>'+
        '<polygon points="'+pts.join(' ')+'" fill="rgba(180,208,255,0.20)" stroke="#b4d0ff" stroke-width="2"/>'+
        pts.map(function(p){ var xy=p.split(','); return '<circle cx="'+xy[0]+'" cy="'+xy[1]+'" r="3" fill="#b4d0ff"/>'; }).join('')+
        '<g>'+texts+'</g>'+
      '</svg>';
      mount.innerHTML=svg;
    }catch(e){}
  }
  function kick(){
    ensureTooltipsAndChevrons();
    drawRadar();
    const tgt=document.querySelector('table') || document.body;
    new MutationObserver(()=>ensureTooltipsAndChevrons()).observe(tgt,{childList:true,subtree:true});
  }
  ready(kick);
})();