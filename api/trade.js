const HS_CODES = require('../data/hs_codes.json');

// Split into 3 query groups to avoid URL-length issues (~5 codes × 3 minerals each)
const QUERY_GROUPS = [
  ['Cobalt', 'Copper', 'Graphite'],
  ['Lithium', 'Manganese', 'Nickel'],
  ['Rare Earths', 'Silicon', 'Uranium'],
];

async function fetchComtrade(codes, year) {
  const url = new URL('https://comtradeplus.un.org/TradeData/Yearly');
  url.searchParams.set('typeCode', 'C');
  url.searchParams.set('freqCode', 'A');
  url.searchParams.set('clCode', 'HS');
  url.searchParams.set('period', String(year));
  url.searchParams.set('cmdCode', codes.join(','));
  url.searchParams.set('flowCode', 'X');       // exports
  url.searchParams.set('partnerCode', '0');    // World (total exports)
  url.searchParams.set('partner2Code', '0');
  url.searchParams.set('customsCode', 'C00');
  url.searchParams.set('motCode', '0');
  url.searchParams.set('maxRecords', '5000');
  url.searchParams.set('format', 'JSON');
  url.searchParams.set('includeDesc', 'True');

  const r = await fetch(url.toString(), {
    headers: { 'Ocp-Apim-Subscription-Key': process.env.COMTRADE_API_KEY },
    signal: AbortSignal.timeout(20000),
  });

  if (!r.ok) {
    const body = await r.text().catch(() => '');
    throw new Error(`Comtrade ${r.status}: ${body.slice(0, 200)}`);
  }
  return r.json();
}

module.exports = async function handler(req, res) {
  // Trade data is annual; cache for 24 hours on Vercel CDN
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');

  // Build reverse map: HS code → mineral name
  const codeToMineral = {};
  for (const [mineral, meta] of Object.entries(HS_CODES)) {
    for (const code of meta.codes) {
      codeToMineral[code] = mineral;
    }
  }

  const results = {};
  const YEAR = 2023; // most recent complete annual data

  for (const group of QUERY_GROUPS) {
    const allCodes = group.flatMap(m => HS_CODES[m]?.codes || []);
    if (!allCodes.length) continue;

    try {
      const data = await fetchComtrade(allCodes, YEAR);
      const records = data.data || [];

      // Aggregate export value per mineral per reporting country
      const byMineral = {};
      for (const rec of records) {
        const mineral = codeToMineral[String(rec.cmdCode)];
        if (!mineral) continue;
        const country = rec.reporterDesc || rec.reporterISO || String(rec.reporterCode);
        // Skip world-aggregate rows Comtrade sometimes includes
        if (!country || country.toLowerCase() === 'world' || country === '0') continue;
        if (!byMineral[mineral]) byMineral[mineral] = {};
        byMineral[mineral][country] = (byMineral[mineral][country] || 0) + (rec.primaryValue || 0);
      }

      for (const mineral of group) {
        const exportMap = byMineral[mineral] || {};
        const topExporters = Object.entries(exportMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([country, usd]) => ({ country, usd }));
        const totalUSD = Object.values(exportMap).reduce((s, v) => s + v, 0);
        results[mineral] = { topExporters, totalUSD, year: YEAR };
      }
    } catch (err) {
      console.error('[trade] group', group, err.message);
      // Leave these minerals absent from results rather than failing whole request
    }
  }

  res.json({ trade: results, year: YEAR, fetchedAt: new Date().toISOString() });
};
