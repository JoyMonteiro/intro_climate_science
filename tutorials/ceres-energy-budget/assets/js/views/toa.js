// View 1, Top of atmosphere: TOA net, ASR, OLR, albedo, incoming sunlight as 2010–2024 climatology (annual or one
// average month, with a play button). Zonal panel: ASR and OLR together. Below: the global TOA net series.
import { PROMPTS } from '../prompts.js';
import { timeSeries } from '../charts.js';
import { mountClimView } from './climview.js';
import { ALL_MONTHS, toaReadout } from './clim.js';

export const id = 1;
export const title = 'Top of atmosphere';
export const prompt = PROMPTS[1];
export const fields = ['toa_net', 'asr', 'olr', 'albedo', 'solar'];
export const zonalFields = ['asr', 'olr'];
export const defaults = { field: 'toa_net', period: { clim: ALL_MONTHS.slice() } };

const below = {
  html: `<div class="ex-series one">
      <div class="chartbox wide"><h3 class="charttitle">Net energy into Earth at the top of the atmosphere, global mean, 2010–2024 (W m⁻²)</h3>
        <svg class="chart ts gl" role="img" aria-label="Global-mean TOA net"></svg>
        <p class="readout toa-readout"></p></div>
    </div>`,
  async draw($, data) {
    // 2010-01..2024-12 only, so the chart's trend is the same number as the readout.
    const s = data.globalSeries('toa_net').slice(0, 180);
    timeSeries($('.gl'), { times: data.meta.times.slice(0, 180), series: [{ values: s, label: 'Monthly', style: 's0' }],
      runningMean: true, trend: true, units: 'W m-2' });
    $('.toa-readout').textContent = toaReadout(s);
  },
};

export function mount(el, data) {
  return mountClimView(el, data, { key: 'toa', prompt, defaults, fields, play: true, below,
    zonalLines: () => [['asr', 'Absorbed sunlight (ASR)'], ['olr', 'Outgoing longwave (OLR)']] });
}

export default { id, title, prompt, defaults, fields, zonalFields, mount };
