// ── Cache helpers (localStorage with TTL) ──
function cacheGet(key, ttlMs) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > ttlMs) return null;
    return data;
  } catch (_) { return null; }
}
function cacheSet(key, data) {
  try { localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() })); } catch (_) {}
}

// ── Helpers ──
function isNew(dateISO) {
  const msPerDay = 86400000;
  return (Date.now() - new Date(dateISO).getTime()) <= 7 * msPerDay;
}
function isNewDate(dateStr) {
  // handles RFC 2822 strings from RSS (e.g. "Mon, 28 Apr 2026 10:00:00 GMT")
  return isNew(dateStr);
}
function newBadge() {
  return `<span class="new-badge">NEW</span>`;
}
function fmtUSD(n) {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n.toLocaleString()}`;
}

// ── State ──
let activeTab = "deals";
let filters = {
  dealTypes: new Set(DEAL_TYPES),
  minerals: new Set(MINERALS),
  projectTypes: new Set(PROJECT_TYPES),
  priceDirection: new Set(["up", "down"])
};
let newsData = null;
let tradeData = null;

// ── Tab switching ──
function switchTab(tab) {
  activeTab = tab;
  document.querySelectorAll("nav button").forEach(b => b.classList.remove("active"));
  document.getElementById(`nav-${tab}`).classList.add("active");
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.getElementById(`section-${tab}`).classList.add("active");
  renderSidebar();
  renderContent();
}

// ── Sidebar rendering ──
function renderSidebar() {
  const aside = document.querySelector("aside");

  const actionRow = `
    <div class="filter-actions">
      <button class="btn-action" onclick="selectAll()">Select all</button>
      <button class="btn-action" onclick="clearFilters()">Clear all</button>
    </div>`;

  if (activeTab === "deals") {
    aside.innerHTML =
      actionRow +
      buildCheckboxGroup("Deal Type", "dealTypes", DEAL_TYPES) +
      buildMineralFilter();
  } else if (activeTab === "projects") {
    aside.innerHTML =
      actionRow +
      buildCheckboxGroup("Project Type", "projectTypes", PROJECT_TYPES) +
      buildMineralFilter();
  } else if (activeTab === "prices") {
    aside.innerHTML =
      actionRow +
      buildCheckboxGroup("Direction", "priceDirection", ["up", "down"], v => v === "up" ? "Price Increase" : "Price Decrease") +
      buildMineralFilter();
  } else if (activeTab === "news") {
    aside.innerHTML =
      actionRow +
      buildMineralFilter();
  }
}

function buildCheckboxGroup(title, filterKey, options, labelFn = v => v) {
  const items = options.map(opt => {
    const checked = filters[filterKey].has(opt) ? "checked" : "";
    return `<label>
      <input type="checkbox" ${checked} onchange="toggleFilter('${filterKey}', '${opt}', this.checked)">
      ${labelFn(opt)}
    </label>`;
  }).join("");
  return `<div class="filter-group"><h3>${title}</h3>${items}</div>`;
}

function buildMineralFilter() {
  const groupButtons = MINERAL_GROUPS.map((g, i) => {
    const exactMatch = g.minerals.length === filters.minerals.size &&
      g.minerals.every(m => filters.minerals.has(m));
    return `<button class="group-btn${exactMatch ? " active" : ""}" onclick="selectMineralGroup(${i})">${g.label}</button>`;
  }).join("");

  const checkboxes = MINERALS.map(m => {
    const checked = filters.minerals.has(m) ? "checked" : "";
    return `<label>
      <input type="checkbox" ${checked} onchange="toggleFilter('minerals', '${m}', this.checked)">
      ${m}
    </label>`;
  }).join("");

  return `<div class="filter-group">
    <h3>Mineral</h3>
    <div class="group-btns">${groupButtons}</div>
    <div class="mineral-checks">${checkboxes}</div>
  </div>`;
}

function selectMineralGroup(i) {
  filters.minerals = new Set(MINERAL_GROUPS[i].minerals);
  renderSidebar();
  renderContent();
}

function toggleFilter(key, value, checked) {
  if (checked) filters[key].add(value);
  else filters[key].delete(value);
  renderSidebar();
  renderContent();
}

function selectAll() {
  filters.dealTypes = new Set(DEAL_TYPES);
  filters.minerals = new Set(MINERALS);
  filters.projectTypes = new Set(PROJECT_TYPES);
  filters.priceDirection = new Set(["up", "down"]);
  renderSidebar();
  renderContent();
}

function clearFilters() {
  filters.dealTypes = new Set();
  filters.minerals = new Set();
  filters.projectTypes = new Set();
  filters.priceDirection = new Set();
  renderSidebar();
  renderContent();
}

// ── Content routing ──
function renderContent() {
  if (activeTab === "deals") renderDeals();
  else if (activeTab === "projects") renderProjects();
  else if (activeTab === "prices") renderPrices();
  else if (activeTab === "news") renderNews();
}

// ── Static section renders ──
function renderDeals() {
  const filtered = DEALS.filter(d =>
    filters.dealTypes.has(d.type) &&
    d.minerals.some(m => filters.minerals.has(m))
  ).sort((a, b) => b.dateISO.localeCompare(a.dateISO));

  const container = document.getElementById("deals-list");
  document.getElementById("deals-count").textContent = filtered.length;

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty"><p>No deals match the selected filters.</p></div>`;
    return;
  }

  container.innerHTML = filtered.map(d => `
    <div class="deal-card${isNew(d.dateISO) ? " is-new" : ""}">
      <div class="deal-meta">
        ${isNew(d.dateISO) ? newBadge() : ""}
        <span class="deal-date">${d.date}</span>
        <span class="deal-type ${typeClass(d.type)}">${d.type}</span>
        ${d.minerals.map(m => `<span class="mineral-tag">${m}</span>`).join("")}
      </div>
      <div class="project-name">${d.name}</div>
      <p class="deal-summary">${d.summary}</p>
      <div class="deal-footer">
        <a href="${d.link}" class="deal-link">Source →</a>
      </div>
    </div>
  `).join("");
}

function renderProjects() {
  const filtered = PROJECTS.filter(p =>
    filters.projectTypes.has(p.type) &&
    filters.minerals.has(p.mineral)
  ).sort((a, b) => b.dateISO.localeCompare(a.dateISO));

  const container = document.getElementById("projects-list");
  document.getElementById("projects-count").textContent = filtered.length;

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty"><p>No projects match the selected filters.</p></div>`;
    return;
  }

  container.innerHTML = filtered.map(p => `
    <div class="project-card${isNew(p.dateISO) ? " is-new" : ""}">
      <div class="project-meta">
        ${isNew(p.dateISO) ? newBadge() : ""}
        <span class="deal-date">${p.date}</span>
        <span class="project-type type-${p.type.toLowerCase()}">${p.type}</span>
        <span class="mineral-tag">${p.mineral}</span>
      </div>
      <div class="project-name">${p.name}</div>
      <p class="deal-summary">${p.summary}</p>
      <a href="${p.link}" class="deal-link">Source →</a>
    </div>
  `).join("");
}

function renderPrices() {
  const filtered = PRICES.filter(p =>
    filters.priceDirection.has(p.direction) &&
    filters.minerals.has(p.mineral)
  ).sort((a, b) => b.dateISO.localeCompare(a.dateISO));

  const container = document.getElementById("prices-grid");
  document.getElementById("prices-count").textContent = filtered.length;

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty"><p>No price events match the selected filters.</p></div>`;
  } else {
    container.innerHTML = filtered.map(p => `
      <div class="price-card ${p.direction}${isNew(p.dateISO) ? " is-new" : ""}">
        <div class="price-header">
          <span class="price-mineral">${p.mineral}</span>
          <div style="display:flex;align-items:center;gap:8px">
            ${isNew(p.dateISO) ? newBadge() : ""}
            <span class="price-change ${p.direction}">${p.change}</span>
          </div>
        </div>
        <div class="price-period">${p.period}</div>
        <p class="price-summary">${p.summary}</p>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span class="price-date">${p.date}</span>
          <a href="${p.link}" class="deal-link">Source →</a>
        </div>
      </div>
    `).join("");
  }

  renderTradeFlows();
}

// ── Trade Flows (Comtrade) ──
async function renderTradeFlows() {
  const container = document.getElementById("trade-grid");
  const status = document.getElementById("trade-status");

  if (tradeData) {
    displayTradeFlows(tradeData);
    return;
  }

  const cached = cacheGet("comtrade_trade", 86400000); // 24h
  if (cached) {
    tradeData = cached;
    displayTradeFlows(tradeData);
    return;
  }

  try {
    const r = await fetch("/api/trade");
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const json = await r.json();
    tradeData = json.trade || {};
    cacheSet("comtrade_trade", tradeData);
    displayTradeFlows(tradeData);
  } catch (err) {
    container.innerHTML = `<div class="empty"><p>Trade data unavailable (${err.message}).</p></div>`;
    if (status) status.textContent = "unavailable";
  }
}

function displayTradeFlows(trade) {
  const container = document.getElementById("trade-grid");
  const status = document.getElementById("trade-status");
  const minerals = Object.keys(trade).filter(m => filters.minerals.has(m));

  if (minerals.length === 0) {
    container.innerHTML = `<div class="empty"><p>No trade data for the selected minerals.</p></div>`;
    if (status) status.textContent = "0";
    return;
  }

  if (status) status.textContent = minerals.length;

  container.innerHTML = minerals.map(mineral => {
    const { topExporters = [], totalUSD = 0, year } = trade[mineral] || {};
    const rows = topExporters.map((e, i) => `
      <div class="trade-row">
        <span class="trade-rank">${i + 1}</span>
        <span class="trade-country">${e.country}</span>
        <span class="trade-value">${fmtUSD(e.usd)}</span>
      </div>`).join("");
    return `
      <div class="trade-card">
        <div class="trade-card-header">
          <span class="trade-mineral">${mineral}</span>
          <span class="trade-total">${fmtUSD(totalUSD)} total · ${year}</span>
        </div>
        ${rows || '<div class="trade-row"><span style="color:var(--text-muted);font-size:12px">No data</span></div>'}
      </div>`;
  }).join("");
}

// ── News (SCMP + Groq) ──
async function renderNews() {
  const container = document.getElementById("news-list");
  const count = document.getElementById("news-count");

  if (newsData) {
    displayNews(newsData);
    return;
  }

  const cached = cacheGet("scmp_news", 21600000); // 6h
  if (cached) {
    newsData = cached;
    displayNews(newsData);
    return;
  }

  container.innerHTML = `<div class="loading-row"><span class="spinner"></span> Fetching latest articles…</div>`;

  try {
    const r = await fetch("/api/news");
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const json = await r.json();
    newsData = json.articles || [];
    cacheSet("scmp_news", newsData);
    displayNews(newsData);
  } catch (err) {
    container.innerHTML = `<div class="empty"><p>News feed unavailable (${err.message}).</p></div>`;
    if (count) count.textContent = "0";
  }
}

function displayNews(articles) {
  const container = document.getElementById("news-list");
  const count = document.getElementById("news-count");

  const filtered = articles.filter(a =>
    a.minerals.length === 0 || a.minerals.some(m => filters.minerals.has(m))
  );

  if (count) count.textContent = filtered.length;

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty"><p>No relevant articles found. Check back later or adjust mineral filters.</p></div>`;
    return;
  }

  container.innerHTML = filtered.map(a => {
    const dateStr = a.date ? new Date(a.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "";
    const fresh = isNewDate(a.date);
    return `
      <div class="deal-card${fresh ? " is-new" : ""}">
        <div class="deal-meta">
          ${fresh ? newBadge() : ""}
          ${dateStr ? `<span class="deal-date">${dateStr}</span>` : ""}
          <span class="deal-type ${typeClass(a.dealType)}">${a.dealType}</span>
          ${a.minerals.map(m => `<span class="mineral-tag">${m}</span>`).join("")}
          <span class="source-badge">SCMP</span>
        </div>
        <div class="project-name">${a.title}</div>
        <p class="deal-summary">${a.summary}</p>
        <div class="deal-footer">
          <a href="${a.link}" target="_blank" rel="noopener" class="deal-link">Read article →</a>
        </div>
      </div>`;
  }).join("");
}

function typeClass(type) {
  if (type === "Trade Deal") return "type-trade";
  if (type === "Statement") return "type-statement";
  if (type === "Non-Investment Agreement") return "type-non";
  return "";
}

// ── API pre-fetch on load ──
// Kick off background fetches so data is ready when user navigates to those tabs
async function prefetchInBackground() {
  // Fetch news if not cached
  if (!cacheGet("scmp_news", 21600000)) {
    try {
      const r = await fetch("/api/news");
      if (r.ok) {
        const json = await r.json();
        newsData = json.articles || [];
        cacheSet("scmp_news", newsData);
      }
    } catch (_) {}
  } else {
    newsData = cacheGet("scmp_news", 21600000);
  }

  // Fetch trade if not cached
  if (!cacheGet("comtrade_trade", 86400000)) {
    try {
      const r = await fetch("/api/trade");
      if (r.ok) {
        const json = await r.json();
        tradeData = json.trade || {};
        cacheSet("comtrade_trade", tradeData);
      }
    } catch (_) {}
  } else {
    tradeData = cacheGet("comtrade_trade", 86400000);
  }
}

// ── Init ──
document.addEventListener("DOMContentLoaded", () => {
  renderSidebar();
  renderContent();
  // Pre-fetch in background after initial render so it doesn't block
  prefetchInBackground();
});
