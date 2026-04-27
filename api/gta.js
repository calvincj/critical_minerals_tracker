const Groq = require('groq-sdk');
const HS_CODES = require('../data/hs_codes.json');

// Build flat list of all HS codes across all tracked minerals
const ALL_HS_CODES = Object.values(HS_CODES).flatMap(m => m.codes);

// Reverse map: HS code → mineral name (first match wins)
const CODE_TO_MINERAL = {};
for (const [mineral, meta] of Object.entries(HS_CODES)) {
  for (const code of meta.codes) {
    if (!CODE_TO_MINERAL[code]) CODE_TO_MINERAL[code] = mineral;
  }
}

// Map GTA evaluation + intervention type name → our deal type labels
function toDealType(evaluation, interventionTypes) {
  const names = (interventionTypes || []).map(t => (t.name || '').toLowerCase()).join(' ');
  if (names.includes('subsid') || names.includes('investment') || names.includes('loan') || names.includes('grant')) {
    return 'Investment Agreement';
  }
  if (evaluation === 'liberalising') return 'Trade Deal';
  if (evaluation === 'harmful') return 'Export Restriction';
  return 'Statement';
}

// Six months ago ISO date string
function sixMonthsAgo() {
  const d = new Date();
  d.setMonth(d.getMonth() - 6);
  return d.toISOString().slice(0, 10);
}

module.exports = async function handler(req, res) {
  // Cache 6 hours on Vercel CDN — ~4 GTA calls/day well within 1000/day limit
  res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=3600');

  try {
    const body = {
      limit: 100,
      offset: 0,
      sorting: '-date_implemented',
      request_data: {
        affected_products: ALL_HS_CODES,
        announcement_period: { from: sixMonthsAgo(), to: null },
        gta_evaluation: ['harmful', 'liberalising', 'murky'],
      },
    };

    const r = await fetch('https://api.globaltradealert.org/api/v1/data/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `APIKey ${process.env.GLOBALTRADEALERT_API_KEY}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });

    if (!r.ok) {
      const text = await r.text().catch(() => '');
      throw new Error(`GTA ${r.status}: ${text.slice(0, 200)}`);
    }

    const json = await r.json();
    const raw = json.data || [];

    // Map HS codes on each intervention → mineral names
    const interventions = raw.map(item => {
      const minerals = [...new Set(
        (item.affected_products || [])
          .map(p => CODE_TO_MINERAL[String(p.hs_code || p)])
          .filter(Boolean)
      )];

      const implementers = (item.implementing_jurisdictions || [])
        .map(j => j.name || j.iso_code).filter(Boolean);

      const affected = (item.affected_jurisdictions || [])
        .map(j => j.name || j.iso_code).filter(Boolean);

      const date = item.date_implemented || item.date_announced || '';
      const dateISO = date ? date.slice(0, 10) : '';

      return {
        id: item.intervention_id,
        title: (item.title || '').trim(),
        evaluation: item.gta_evaluation || 'murky',
        dealType: toDealType(item.gta_evaluation, item.intervention_types),
        interventionTypes: (item.intervention_types || []).map(t => t.name).join(', '),
        minerals,
        implementers,
        affected,
        date: dateISO ? new Date(dateISO).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '',
        dateISO,
        link: item.source_url || `https://www.globaltradealert.org/intervention/${item.intervention_id}`,
        source: 'GTA',
      };
    }).filter(i => i.minerals.length > 0); // only keep interventions we can map to a mineral

    res.json({ interventions, count: interventions.length, fetchedAt: new Date().toISOString() });
  } catch (err) {
    console.error('[gta]', err.message);
    res.status(500).json({ interventions: [], error: err.message });
  }
};
