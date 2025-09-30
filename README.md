# TrustEval-Provenance

**TrustEval-Provenance** is a static, client-side benchmark site. Upload this folder to a GitHub repo and enable **GitHub Pages** (main/root). No server code is required.

- **Leaderboard**: sortable by clicking headers; expand **Model / Audit + Provenance** pills for details.
- **Compare**: pick any two runs and see deltas; open both reports.
- **Reports**: dark-mode, PDF export, and a **Radar ↔ Bars toggle**.

### Structure
```
/
  .nojekyll
  index.html
  compare.html
  leaderboard.json
  config/
    metrics.json
    ui.json
    synonyms.json
  web/
    styles.css
    common.js
    radar.js
  data/
    reports/<run>.html
    proofs/<run>.json
```
