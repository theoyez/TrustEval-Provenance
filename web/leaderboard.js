
function ROW_HTML(r){
  return `
    <tr>
      <td>${r.run_id}</td>
      <td>${r.model||'—'}</td>
      <td class="right">${(r.accuracy*100).toFixed(1)}%</td>
      <td class="right">${(r.grounding*100).toFixed(1)}%</td>
      <td class="right">${(r.safety*100).toFixed(1)}%</td>
      <td class='right'>${r.robustness!==undefined?(r.robustness*100).toFixed(1)+'%':'—'}</td><td class='right'>${r.bias!==undefined?(r.bias*100).toFixed(1)+'%':'—'}</td><td class='right'>${r.calibration!==undefined?(r.calibration*100).toFixed(1)+'%':'—'}</td><td class='right'>${r.provenance!==undefined?(r.provenance*100).toFixed(1)+'%':'—'}</td>
      <td class="right"><b>${(r.trust_score*100).toFixed(1)}%</b></td>
      <td><a href="${r.report}">Report</a></td>
    </tr>`;
}
window.addEventListener('DOMContentLoaded', ()=>load(MAP, ROW_HTML));
