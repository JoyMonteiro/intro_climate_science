// View 2, Clouds: cloud radiative effects at TOA and surface, cloud fraction and cloud-top temperature, and TOA
// OLR/ASR with an all-sky/clear-sky toggle; 2010–2024 climatology (annual or one average month).
import { PROMPTS } from '../prompts.js';
import { mountClimView } from './climview.js';
import { ALL_MONTHS } from './clim.js';
import { fieldById } from '../fields.js';

export const id = 2;
export const title = 'Clouds';
export const prompt = PROMPTS[2];
export const fields = ['toa_cre_net', 'toa_cre_sw', 'toa_cre_lw', 'sfc_cre_net', 'sfc_cre_sw', 'sfc_cre_lw', 'cld_frac', 'cld_temp', 'olr', 'asr'];
export const clearSky = { olr: 'olr_clr', asr: 'asr_clr' };
export const defaults = { field: 'toa_cre_net', period: { clim: ALL_MONTHS.slice() }, sky: 'all' };

export function mount(el, data) {
  return mountClimView(el, data, { key: 'clouds', prompt, defaults, fields, clearSky,
    zonalLines: fid => [[fid, fieldById(data.fields, fid).label]] });
}

export default { id, title, prompt, defaults, fields, clearSky, mount };
