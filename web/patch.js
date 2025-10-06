// patch v4.9 per-report radar (CSP-safe)
(function(){
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  function ensureTooltips(){
    const map = {run:'Unique run identifier.', model:'System/model label.', accuracy:'Primary accuracy metric.', grounding:'Evidence linkage quality.', safety:'Safety policy conformance.', robustness:'Robustness to perturbations.', bias:'Distributional fairness proxy.', calibration:'Confidence calibration.', trust:'Composite trust score.', audit:'Quick audit trail preview.', provenance:'Provenance proof bundle.', report:'Open the full report.'};
    document.querySelectorAll('thead th').forEach(th=>{
      if(!th.getAttribute('title')){
        const key=(th.textContent||'').toLowerCase().replace(/\s+↓?$/,'').trim();
        if(map[key]) th.setAttribute('title', map[key]);
      }
    });
    document.querySelectorAll('.audit').forEach(aud=>{
      const nodes = aud.querySelectorAll('.badge, .pill, span');
      nodes.forEach((n,i)=>{
        if(!n.getAttribute('title')) n.setAttribute('title', i===0?'retrieved@k':(i===1?'top sources':'consistency'));
        if(i<2 && !/\bchev\b/.test(n.className)) n.className += ' chev';
      });
    });
  }
  
function drawRadarTop(){
  var mount=document.getElementById('radarTop'); if(!mount) return;
  var IS_REPORT = /\/data\/reports\/.+\.html$/.test(location.pathname) || document.querySelector('meta[name="report-id"]');
  var labels=["Accuracy","Grounding","Safety","Robustness","Bias","Calibration","Trust"];

  function draw(vals){
    try{
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
      mount.innerHTML = svg;
    }catch(e){ console.error(e); }
  }

  if(!IS_REPORT){ draw([0.6,0.6,0.6,0.6,0.6,0.6,0.6]); return; }

  var pathParts = location.pathname.split('/');
  var fileName = pathParts[pathParts.length-1];

  function fetchJSON(url){
    return new Promise(function(res,rej){
      var x=new XMLHttpRequest();
      x.open('GET',url,true);
      x.onreadystatechange=function(){
        if(x.readyState===4){
          if(x.status>=200&&x.status<300){
            try{ res(JSON.parse(x.responseText)); }catch(e){ rej(e); }
          } else { rej(new Error('HTTP '+x.status)); }
        }
      };
      x.send();
    });
  }

  fetchJSON('../../data/leaderboard.json').then(function(data){
    var runs = (data && data.runs) || [];
    var run = runs.find(function(r){ return (r.report_path||'').split('/').pop() === fileName; });
    var acc = run && run.metrics ? parseFloat(run.metrics.accuracy) : NaN;
    if(isNaN(acc)) acc = 0.6;

    var ppl = run && run.metrics ? parseFloat(run.metrics.perplexity) : NaN;
    var calibration = isNaN(ppl) ? 0.6 : Math.max(0, Math.min(1, 1 - Math.max(0, ppl-1)/2));

    var grounding = 0.6, trust = 0.6;
    if(run && run.audit_quickpeek){
      var k = run.audit_quickpeek.retrieved_k || 0;
      var cons = (run.audit_quickpeek.consistency||[]);
      var ok = cons.indexOf('citations_present')>-1 && cons.indexOf('no_conflict')>-1;
      grounding = Math.max(0.4, Math.min(1, 0.5 + (k>=3?0.2:0) + (ok?0.2:0)));
      trust = Math.max(0.4, Math.min(1, (acc*0.5) + (grounding*0.3) + (calibration*0.2)));
    }

    var safety=0.6, robustness=0.6, bias=0.6;
    var vals=[acc, grounding, safety, robustness, bias, calibration, trust];
    draw(vals);
  }).catch(function(){
    var txt=(document.body.innerText||''); var m=txt.match(/Accuracy\s*([0-9]+(?:\.[0-9]+)?)%/i); var acc = m?parseFloat(m[1])/100:0.6;
    draw([acc,0.6,0.6,0.6,0.6,0.6,0.6]);
  });
}
ready(function(){ ensureTooltips(); drawRadarTop(); });
(function(){ ensureTooltips(); drawRadarTop(); });
})();
// v4.8c: robust tooltips + chevrons on one line
(function(){
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  function addTooltips(){
    try{
      document.querySelectorAll('thead th').forEach(th=>{
        if(!th.getAttribute('title')){
          const txt=(th.textContent||'').trim();
          th.setAttribute('title', txt || 'column');
        }
      });
      document.querySelectorAll('td, .audit').forEach(cell=>{
        const aud = cell.matches('.audit') ? cell : cell.querySelector('.audit');
        if(!aud) return;
        const kids = aud.querySelectorAll('*');
        for (let i=0;i<kids.length;i++){
          const el = kids[i];
          // Assign tooltip if missing
          if(!el.getAttribute('title')){
            el.setAttribute('title', i===0 ? 'retrieved@k' : (i===1 ? 'top sources' : 'consistency'));
          }
          // Force single line in case CSS loses
          el.style.whiteSpace = 'nowrap';
          // Add chevron to first two elements
          if(i < 2 && !/\bchev\b/.test(el.className)){ el.className += ' chev'; }
        }
      });
    }catch(e){/* noop */}
  }
  ready(addTooltips);
})();