const HS_CODES = require('../data/hs_codes.json');

const MINERALS = Object.keys(HS_CODES);

// ITA Market Intelligence: searchable market research reports from US embassies / commercial officers
// Endpoint: https://api.trade.gov/market_intelligence/search
// ITA Tariff Rates: MFN tariff rates by HTS code
// Endpoint: https://api.trade.gov/tariff_rates/v1/

async function fetchMarketIntelligence(apiKey) {
  // Search for market intelligence reports about critical minerals.
  // One broad search keeps us well within rate limits.
  const url = new URL('https://api.trade.gov/market_intelligence/search');
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('q', 'critical minerals mining lithium cobalt rare earth');
  url.searchParams.set('size', '20');
  url.searchParams.set('offset', '0');

  const r = await fetch(url.toString(), { signal: AbortSignal.timeout(10000) });
  if (!r.ok) throw new Error(`ITA market_intelligence ${r.status}`);
  return r.json();
}

async function fetchTariffRates(apiKey) {
  // Query tariff rates for a representative set of mineral HS codes.
  // Using US (840) as reporter — most relevant for policy context.
  // HTS codes need 8 digits; HS6 codes are padded to 8 with trailing 00.
  const sampleCodes = [
    '26050000', // Cobalt ores
    '26030000', // Copper ores
    '26040000', // Nickel ores
    '25041000', // Natural graphite, crystalline flake
    '28053000', // Rare-earth metals
    '28046100', // Silicon >=99.99%
    '28369100', // Lithium carbonate
  ];

  const results = [];
  // Fetch in parallel — each call is lightweight
  await Promise.all(sampleCodes.map(async (hts) => {
    try {
      const url = new URL('https://api.trade.gov/tariff_rates/v1/');
      url.searchParams.set('api_key', apiKey);
      url.searchParams.set('hs_code', hts);
      url.searchParams.set('reporter', '840'); // United States
      const r = await fetch(url.toString(), { signal: AbortSignal.timeout(8000) });
      if (!r.ok) return;
      const json = await r.json();
      const items = json.results || json.data || (Array.isArray(json) ? json : []);
      results.push(...items.slice(0, 3).map(t => ({ ...t, queried_hts: hts })));
    } catch (_) {}
  }));

  return results;
}

module.exports = async function handler(req, res) {
  // Market intelligence cached 24h; tariffs change rarely so also 24h
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');

  const apiKey = process.env.ITA_API_KEY;
  const output = { reports: [], tariffs: [], fetchedAt: new Date().toISOString() };

  // Market Intelligence
  try {
    const data = await fetchMarketIntelligence(apiKey);
    const items = data.results || data.data || (Array.isArray(data) ? data : []);
    output.reports = items.slice(0, 15).map(r => ({
      title: r.title || r.name || '',
      summary: (r.summary || r.teaser || r.body || '').replace(/<[^>]+>/g, '').slice(0, 300),
      country: r.country || r.countries?.join(', ') || '',
      date: r.published_date || r.pub_date || r.updated_at || '',
      link: r.url || r.web_url || '#',
      source: 'ITA',
    })).filter(r => r.title);
  } catch (err) {
    console.error('[ita] market_intelligence:', err.message);
    output.marketIntelligenceError = err.message;
  }

  // Tariff Rates
  try {
    const items = await fetchTariffRates(apiKey);
    output.tariffs = items.map(t => ({
      hts: t.hts_code || t.hs_code || t.queried_hts || '',
      description: t.description || t.commodity_description || '',
      reporter: t.reporter || t.reporter_country || 'USA',
      partner: t.partner || t.partner_country || '',
      rate: t.duty_rate || t.mfn_rate || t.rate || '',
      year: t.year || t.tariff_year || '',
    }));
  } catch (err) {
    console.error('[ita] tariff_rates:', err.message);
    output.tariffError = err.message;
  }

  res.json(output);
};
