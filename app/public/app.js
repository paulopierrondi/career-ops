const state = { loading: false };

function toast(message) {
  const el = document.getElementById('toast');
  el.textContent = message;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3600);
}

async function api(path, options = {}) {
  const res = await fetch(path, options);
  if (!res.ok) throw new Error(`${path} returned ${res.status}`);
  return await res.json();
}

function setText(id, value) {
  document.getElementById(id).textContent = value;
}

function opportunityItem(opp) {
  const signals = (opp.signals || []).slice(0, 4).map(signal => `<span class="pill">${signal}</span>`).join('');
  return `
    <article class="item">
      <div class="score ${opp.priority}">${opp.fitScore}</div>
      <div>
        <div class="title"><a href="${opp.url}" target="_blank" rel="noreferrer">${opp.role || 'Unknown role'}</a></div>
        <div class="meta">${opp.company || 'Unknown company'} · ${opp.priority}</div>
      </div>
      <div class="signals">${signals}</div>
    </article>
  `;
}

function applicationItem(app) {
  const action = app.needsHumanAction ? 'human gate' : app.recommendedAction;
  const report = app.reportPath ? `<a href="/${app.reportPath}" target="_blank" rel="noreferrer">report</a>` : 'no report';
  return `
    <article class="item">
      <div class="score ${app.recommendedAction}">${app.score ?? '-'}</div>
      <div>
        <div class="title">${app.company} · ${app.role}</div>
        <div class="meta">#${String(app.number).padStart(3, '0')} · ${app.status} · ${action} · ${report}</div>
      </div>
    </article>
  `;
}

function scanRow(row) {
  return `
    <div class="scan-row">
      <span>${row.firstSeen || ''}</span>
      <span>${row.company || ''}</span>
      <span>${row.title || ''}</span>
      <span>${row.status || ''}</span>
    </div>
  `;
}

function render(model) {
  setText('metric-apps', model.metrics.totalApplications);
  setText('metric-opps', model.metrics.pendingOpportunities);
  setText('metric-human', model.metrics.humanActions);
  setText('metric-top', model.metrics.topScore);
  setText('opportunity-count', `top ${model.opportunities.length} of ${model.metrics.pendingOpportunities}`);
  setText('application-count', `${model.applications.length} rows`);
  setText('scan-count', `${model.scanHistory.length} events`);

  document.getElementById('opportunities').innerHTML =
    model.opportunities.length ? model.opportunities.map(opportunityItem).join('') : '<article class="item"><div class="title">No pending opportunities</div></article>';
  document.getElementById('applications').innerHTML =
    model.applications.length ? model.applications.slice(0, 12).map(applicationItem).join('') : '<article class="item"><div class="title">No applications yet</div></article>';
  document.getElementById('scan-history').innerHTML =
    model.scanHistory.length ? model.scanHistory.slice(0, 12).map(scanRow).join('') : '<div class="scan-row"><span>No scan history</span></div>';
}

async function load() {
  const model = await api('/api/summary');
  render(model);
}

async function runAction(buttonId, path, message) {
  const button = document.getElementById(buttonId);
  button.disabled = true;
  try {
    toast(message);
    await api(path, { method: 'POST' });
    await load();
    toast('Finished');
  } catch (err) {
    toast(err.message);
  } finally {
    button.disabled = false;
  }
}

document.getElementById('run-scan').addEventListener('click', () => runAction('run-scan', '/api/scan', 'Running scan'));
document.getElementById('run-daily').addEventListener('click', () => runAction('run-daily', '/api/daily', 'Running daily monitor'));

load().catch(err => toast(err.message));
