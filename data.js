const DEALS = [];
const PROJECTS = [];
const PRICES = [];

const DEAL_TYPES = ["Investment Agreement", "Non-Investment Agreement", "Trade Deal", "Statement"];
const MINERALS = ["Cobalt", "Copper", "Graphite", "Lithium", "Manganese", "Nickel", "Rare Earths", "Silicon", "Uranium"];
const PROJECT_TYPES = ["Mine", "Refinery"];

const MINERAL_GROUPS = [
  { label: "Battery", minerals: ["Lithium", "Cobalt", "Nickel", "Graphite", "Manganese", "Copper"] },
  { label: "Wind",    minerals: ["Rare Earths", "Copper"] },
  { label: "Solar",   minerals: ["Silicon", "Copper"] },
  { label: "Nuclear", minerals: ["Uranium"] },
];
