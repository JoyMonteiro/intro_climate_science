// App shell: view tabs driven by the URL hash (#view=1..5), the About panel, and the shared data handle.
// Theme: light/dark follow the system setting through CSS (prefers-color-scheme); a data-theme attribute on
// <html> overrides it (used by tests/render.mjs). Nothing on the page depends on JS for the theme.
import { openData } from './data.js';
import explore from './views/explore.js';
import toa from './views/toa.js';
import clouds from './views/clouds.js';
import column from './views/column.js';
import enso from './views/enso.js';

export const VIEWS = [
  { ...toa, short: 'TOA' },
  { ...clouds, short: 'Clouds' },
  { ...column, short: 'Column' },
  { ...enso, short: 'ENSO' },
  { ...explore, short: 'Explore' },
];
const DEFAULT_VIEW = 1;

const viewEl = document.getElementById('view');
const tabs = document.querySelector('.tabs');
tabs.innerHTML = VIEWS.map(v => `<a href="#view=${v.id}" data-view="${v.id}"><span class="num">${v.id}</span>` +
  `<span class="long">${v.title}</span><span class="short">${v.short}</span></a>`).join('');

const dataP = openData(new URL('assets/data/', location.href).href);
let current = null, seq = 0;

function viewFromHash() {
  const m = /view=(\d+)/.exec(location.hash);
  const id = m ? +m[1] : DEFAULT_VIEW;
  return VIEWS.find(v => v.id === id) || VIEWS.find(v => v.id === DEFAULT_VIEW);
}

async function show() {
  const v = viewFromHash(), my = ++seq;
  for (const a of tabs.querySelectorAll('a')) {
    if (+a.dataset.view === v.id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  }
  if (current) { current.unmount(); current = null; }
  for (const k of ['ready', 'busy', 'renders']) delete viewEl.dataset[k];
  viewEl.dataset.view = String(v.id);
  viewEl.innerHTML = '<p class="loading">Loading the data…</p>';
  let data;
  try { data = await dataP; } catch (e) {
    viewEl.innerHTML = '<p class="loading">The data could not be loaded. Serve this folder over HTTP (for example <code>python -m http.server</code>) and reload.</p>';
    console.error('openData failed', e);
    return;
  }
  if (my !== seq) return;              // the student switched tabs while the data loaded
  viewEl.innerHTML = '';
  document.title = `${v.title} · CERES energy budget explorer`;
  current = v.mount(viewEl, data);
}

window.addEventListener('hashchange', show);
show();

const about = document.getElementById('about');
document.getElementById('aboutBtn').addEventListener('click', () => about.showModal());
about.addEventListener('click', e => { if (e.target === about) about.close(); });   // click on the backdrop
