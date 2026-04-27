const DEALS = [
  {
    id: 1,
    date: "January 15, 2025",
    dateISO: "2025-01-15",
    type: "Investment Agreement",
    name: "Australia: NRFC backs Arafura Nolans rare earths project",
    minerals: ["Rare Earths"],
    countries: ["Australia"],
    summary: "The NRFC funded by the Australian Government committed AUD 200 million to Arafura Rare Earths Limited for the Nolans Project, supporting Australia's first ore-to-oxide rare earths operation and global supply chains.",
    link: "#"
  },
  {
    id: 2,
    date: "February 3, 2025",
    dateISO: "2025-02-03",
    type: "Trade Deal",
    name: "USA–Chile: Critical minerals tariff reduction agreement",
    minerals: ["Lithium", "Cobalt"],
    countries: ["USA", "Chile"],
    summary: "The United States and Chile signed a bilateral critical minerals trade agreement reducing tariffs on lithium and cobalt exports, aiming to strengthen North American battery supply chains ahead of EV production targets.",
    link: "#"
  },
  {
    id: 3,
    date: "March 22, 2025",
    dateISO: "2025-03-22",
    type: "Statement",
    name: "Canada–Japan: Critical minerals cooperation MOU",
    minerals: ["Graphite", "Rare Earths"],
    countries: ["Canada", "Japan"],
    summary: "Canada and Japan signed a Memorandum of Understanding on critical minerals cooperation, covering joint exploration, processing technology sharing, and supply chain diversification for graphite and rare earth elements.",
    link: "#"
  },
  {
    id: 4,
    date: "April 10, 2025",
    dateISO: "2025-04-10",
    type: "Investment Agreement",
    name: "POSCO–PT Vale: Sulawesi battery nickel joint venture",
    minerals: ["Nickel"],
    countries: ["Indonesia", "South Korea"],
    summary: "POSCO and PT Vale Indonesia finalized a USD 1.2 billion joint venture to develop nickel processing facilities in Sulawesi, targeting battery-grade nickel sulfate for the Korean EV supply chain.",
    link: "#"
  },
  {
    id: 5,
    date: "May 5, 2025",
    dateISO: "2025-05-05",
    type: "Statement",
    name: "G7 Kananaskis: Critical minerals supply chain commitment",
    minerals: ["Lithium", "Cobalt", "Nickel", "Graphite"],
    countries: ["G7"],
    summary: "G7 leaders issued a joint statement at the Kananaskis Summit reaffirming commitment to diversifying critical mineral supply chains away from single-source dependencies, calling for accelerated investment in allied-nation extraction and processing.",
    link: "#"
  },
  {
    id: 6,
    date: "June 11, 2025",
    dateISO: "2025-06-11",
    type: "Non-Investment Agreement",
    name: "USA–China: Rare earth trade framework and 90-day tariff truce",
    minerals: ["Rare Earths"],
    countries: ["USA", "China"],
    summary: "U.S. and Chinese officials reached a trade framework in London, restoring U.S. firms' access to rare earth supplies and initiating a 90-day tariff truce.",
    link: "#"
  },
  {
    id: 7,
    date: "July 18, 2025",
    dateISO: "2025-07-18",
    type: "Investment Agreement",
    name: "DFC: USD 500M loan for Kamoa-Kakula copper expansion",
    minerals: ["Copper"],
    countries: ["USA", "Democratic Republic of Congo"],
    summary: "A U.S. Development Finance Corporation loan of USD 500 million was approved to back Ivanhoe Mines' Kamoa-Kakula copper expansion, the world's second-largest copper mine, as part of the Lobito Corridor development strategy.",
    link: "#"
  },
  {
    id: 8,
    date: "August 20, 2025",
    dateISO: "2025-08-20",
    type: "Statement",
    name: "USA–EU: Joint statement on critical minerals agreement intent",
    minerals: ["Lithium", "Cobalt", "Rare Earths"],
    countries: ["USA", "EU"],
    summary: "The U.S. and EU issued a joint statement signaling intent to negotiate a critical minerals agreement to allow for cross-recognition in EV battery subsidies and align standards, but no formal deal was signed.",
    link: "#"
  },
  {
    id: 9,
    date: "April 22, 2026",
    dateISO: "2026-04-22",
    type: "Trade Deal",
    name: "Canada–UK: Civil nuclear cooperation and uranium trade deal",
    minerals: ["Uranium"],
    countries: ["Canada", "UK"],
    summary: "Canada and the United Kingdom finalized a civil nuclear cooperation agreement, streamlining uranium trade and enabling joint investment in small modular reactor fuel supply chains.",
    link: "#"
  },
  {
    id: 10,
    date: "April 25, 2026",
    dateISO: "2026-04-25",
    type: "Investment Agreement",
    name: "EU Battery Alliance: EUR 800M into Argentina lithium project",
    minerals: ["Lithium"],
    countries: ["Argentina", "EU"],
    summary: "European Battery Alliance partners committed EUR 800 million to Lithium Americas' Caucharí-Olaroz project in Argentina, part of a broader EU strategy to secure direct access to South American lithium triangle output.",
    link: "#"
  },
  {
    id: 11,
    date: "April 27, 2026",
    dateISO: "2026-04-27",
    type: "Statement",
    name: "USA–EU–Australia: Trilateral export licensing alignment statement",
    minerals: ["Rare Earths", "Cobalt"],
    countries: ["USA", "EU", "Australia"],
    summary: "The U.S., EU, and Australia issued a trilateral statement committing to align export licensing frameworks for rare earths and cobalt, a step toward a formal Minerals Security Partnership supply chain compact.",
    link: "#"
  }
];

const PROJECTS = [
  {
    id: 1,
    date: "January 28, 2025",
    dateISO: "2025-01-28",
    type: "Mine",
    mineral: "Lithium",
    country: "Canada",
    name: "Frontier Lithium:PAK Mine, Ontario",
    summary: "Frontier Lithium received provincial environmental approval for the PAK lithium mine in Ontario, Canada's first hard-rock spodumene mine expected to produce 160,000 tonnes of lithium mineral concentrate per year.",
    link: "#"
  },
  {
    id: 2,
    date: "March 11, 2025",
    dateISO: "2025-03-11",
    type: "Refinery",
    mineral: "Rare Earths",
    country: "USA",
    name: "MP Materials:Fort Worth Rare Earth Magnet Factory",
    summary: "MP Materials commenced operations at its Fort Worth, Texas rare earth magnet manufacturing facility, the first commercial-scale NdFeB magnet plant in the United States, with capacity for 1,000 tonnes per year.",
    link: "#"
  },
  {
    id: 3,
    date: "April 22, 2025",
    dateISO: "2025-04-22",
    type: "Mine",
    mineral: "Nickel",
    country: "Australia",
    name: "Wyloo Metals:Eagle's Nest, Western Australia",
    summary: "Wyloo Metals broke ground on the Eagle's Nest nickel sulfide project in Western Australia following a AUD 700 million financing close, targeting first production of battery-grade nickel in 2027.",
    link: "#"
  },
  {
    id: 4,
    date: "June 3, 2025",
    dateISO: "2025-06-03",
    type: "Refinery",
    mineral: "Lithium",
    country: "USA",
    name: "Albemarle:Kings Mountain Lithium Hub",
    summary: "Albemarle announced the restart of its Kings Mountain, North Carolina lithium hydroxide refinery, mothballed since 1988, with a USD 1.3 billion investment to process domestic spodumene concentrate.",
    link: "#"
  },
  {
    id: 5,
    date: "August 7, 2025",
    dateISO: "2025-08-07",
    type: "Mine",
    mineral: "Copper",
    country: "Zambia",
    name: "First Quantum:Enterprise Nickel-Copper Project, Zambia",
    summary: "First Quantum Minerals received Zambian government sign-off to expand the Enterprise mine into a combined nickel-copper operation, adding 40,000 tonnes of annual copper output to the Lobito Corridor export chain.",
    link: "#"
  },
  {
    id: 6,
    date: "April 23, 2026",
    dateISO: "2026-04-23",
    type: "Refinery",
    mineral: "Graphite",
    country: "USA",
    name: "Anovion:Vidalia Graphite Refinery, Louisiana",
    summary: "Anovion Technologies opened the first U.S. synthetic graphite anode material plant in Vidalia, Louisiana, backed by a USD 150 million DOE grant, with capacity to supply 45,000 tonnes of anode-grade graphite annually.",
    link: "#"
  },
  {
    id: 7,
    date: "April 26, 2026",
    dateISO: "2026-04-26",
    type: "Mine",
    mineral: "Copper",
    country: "USA",
    name: "Rio Tinto:Resolution Copper Mine, Arizona",
    summary: "Rio Tinto received final federal land-exchange approval for the Resolution Copper project in Arizona, the largest undeveloped copper deposit in North America, estimated to supply 25% of U.S. copper demand at peak production.",
    link: "#"
  }
];

const PRICES = [
  {
    id: 1,
    date: "January 20, 2025",
    dateISO: "2025-01-20",
    mineral: "Lithium",
    direction: "down",
    change: "-18%",
    period: "Q4 2024",
    summary: "Lithium carbonate prices fell 18% over Q4 2024, hitting a 3-year low of ~USD 10,500/tonne on the Chinese spot market, driven by persistent oversupply from expanded Australian and Chilean output outpacing EV demand growth.",
    link: "#"
  },
  {
    id: 2,
    date: "February 14, 2025",
    dateISO: "2025-02-14",
    mineral: "Cobalt",
    direction: "down",
    change: "-12%",
    period: "January 2025",
    summary: "Cobalt prices declined 12% in January 2025 as the DRC lifted its cobalt export ban after 3 months, flooding markets with accumulated stockpiles and pushing the metal to USD 24,000/tonne.",
    link: "#"
  },
  {
    id: 3,
    date: "March 5, 2025",
    dateISO: "2025-03-05",
    mineral: "Rare Earths",
    direction: "up",
    change: "+34%",
    period: "February 2025",
    summary: "Neodymium-praseodymium oxide prices surged 34% following China's tightened export controls on rare earth processing chemicals, raising concerns about near-term supply disruptions for magnet manufacturers outside China.",
    link: "#"
  },
  {
    id: 4,
    date: "April 17, 2025",
    dateISO: "2025-04-17",
    mineral: "Nickel",
    direction: "down",
    change: "-9%",
    period: "March 2025",
    summary: "LME nickel prices fell 9% in March amid continued Indonesian class-1 nickel output expansion. The metal settled at USD 15,800/tonne, its lowest since 2020, pressuring Western producers to pause expansion plans.",
    link: "#"
  },
  {
    id: 5,
    date: "June 25, 2025",
    dateISO: "2025-06-25",
    mineral: "Copper",
    direction: "up",
    change: "+11%",
    period: "May–June 2025",
    summary: "Copper prices rose 11% over May–June 2025 to USD 10,200/tonne on the LME, driven by a combination of labor strikes at Chilean mines, record low exchange inventories, and growing AI data center electricity infrastructure demand.",
    link: "#"
  },
  {
    id: 6,
    date: "August 12, 2025",
    dateISO: "2025-08-12",
    mineral: "Graphite",
    direction: "up",
    change: "+22%",
    period: "July 2025",
    summary: "Natural flake graphite prices rose 22% in July after China announced additional restrictions on graphite exports to the United States, citing national security concerns, pushing anode material costs higher for non-Chinese battery manufacturers.",
    link: "#"
  },
  {
    id: 7,
    date: "April 24, 2026",
    dateISO: "2026-04-24",
    mineral: "Uranium",
    direction: "up",
    change: "+16%",
    period: "April 2026",
    summary: "Uranium spot prices climbed 16% this month, reaching USD 88/lb U₃O₈, as utilities accelerated long-term contract signing ahead of anticipated supply tightness from Kazakh and Canadian mine project delays.",
    link: "#"
  },
  {
    id: 8,
    date: "April 27, 2026",
    dateISO: "2026-04-27",
    mineral: "Rare Earths",
    direction: "up",
    change: "+8%",
    period: "Past week",
    summary: "NdPr oxide prices jumped 8% this week following the trilateral U.S.-EU-Australia minerals statement, with traders pricing in tighter allied-nation export coordination and potential restrictions on Chinese processing chemicals.",
    link: "#"
  }
];

const DEAL_TYPES = ["Investment Agreement", "Non-Investment Agreement", "Trade Deal", "Statement"];
const MINERALS = ["Cobalt", "Copper", "Graphite", "Lithium", "Manganese", "Nickel", "Rare Earths", "Silicon", "Uranium"];
const PROJECT_TYPES = ["Mine", "Refinery"];

const MINERAL_GROUPS = [
  { label: "Battery", minerals: ["Lithium", "Cobalt", "Nickel", "Graphite", "Manganese", "Copper"] },
  { label: "Wind",    minerals: ["Rare Earths", "Copper"] },
  { label: "Solar",   minerals: ["Silicon", "Copper"] },
  { label: "Nuclear", minerals: ["Uranium"] },
];
