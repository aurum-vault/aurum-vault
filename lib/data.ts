// RATES is kept as a fallback for calcMarketValue when API rates aren't loaded yet
export const RATES = {
  gold: 7140,
  silver: 87.2,
  platinum: 3200,
  diamondUSD: 5800,
};

export const CAT_ICON: Record<string, string> = {
  "Necklace": "📿",
  "Necklace/Haar": "📿",
  "Ring": "💍",
  "Earrings": "👂",
  "Bangles": "🟡",
  "Bracelet": "⛓️",
  "Anklet/Payal": "🦶",
  "Pendant": "🔻",
  "Maang Tikka": "👑",
  "Brooch": "🌸",
  "Cufflinks": "🔗",
  "Watch": "⌚",
  "Coin/Bar": "🪙",
  "Other": "💎",
};

export const PURITY_MAP: Record<string, string[]> = {
  Gold: ["24 Karat (999.9)", "22 Karat (916)", "20 Karat (833)", "18 Karat (750)", "14 Karat (585)", "10 Karat (417)"],
  Silver: ["999 Fine Silver", "925 Sterling", "916", "800", "500"],
  Platinum: ["950", "900", "850"],
  Diamond: ["IF (Flawless)", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"],
  "Gold + Diamond": ["22K Gold + IF Diamond", "18K Gold + VVS1", "18K Gold + VS1", "14K Gold + SI1"],
  "Gold + Gemstone": ["22K + Ruby", "22K + Emerald", "22K + Sapphire", "18K + Ruby", "18K + Emerald"],
  "Silver + Pearl": ["925 + Freshwater Pearl", "925 + Akoya Pearl"],
  Other: ["Custom"],
};

export const SVC_TYPES = {
  appraisal_purity: {
    name: "Appraisal & Purity",
    ico: "🏆",
    desc: "Certified valuation + BIS hallmark / HUID purity verification via home or in-store visit",
    tat: "5–7 days",
    mode: "visit",
    scheduleLabel: "Appointment",
    notesLabel: "Notes for the Valuer",
    notesPh: "e.g. Call before arrival, gate code, preferred time slot…",
  },
  repair: {
    name: "Repair Assessment",
    ico: "🔧",
    desc: "Two-stage: repairability assessment, then home or in-store repair",
    tat: "3–4 days",
    mode: "repair",
    scheduleLabel: "Appointment",
    notesLabel: "Notes",
    notesPh: "Any other context for the service team",
  },
  refurbishment: {
    name: "Refurbishment",
    ico: "✨",
    desc: "Maintenance & upkeep — polish, ultrasonic cleaning, buffing & more",
    tat: "7–10 days",
    mode: "visit",
    scheduleLabel: "Appointment",
    notesLabel: "Refurbishment Notes",
    notesPh: "Anything specific you want addressed",
  },
  gold_loan: {
    name: "Gold Loan",
    ico: "💰",
    desc: "Collateral-based liquidity — up to 60% of gold value",
    tat: "2–3 days",
    mode: "loan",
    scheduleLabel: "Preferred Disbursal Date",
    notesLabel: "Additional Notes",
    notesPh: "Any additional information for the loan team",
  },
} as const;

export const REFURB_RATECARD = [
  { name: "Polishing & Buffing", price: 600 },
  { name: "Ultrasonic Cleaning", price: 400 },
  { name: "Re-plating (Rhodium/Gold)", price: 1500 },
  { name: "Stone Re-setting", price: 1200 },
  { name: "Re-stringing", price: 800 },
  { name: "Dent / Shape Correction", price: 1000 },
  { name: "Engraving Restoration", price: 900 },
];

export const LOAN_TENURES = ["3 months", "6 months", "12 months", "24 months", "36 months"];
export const LOAN_LTV = 0.6;
export const VISIT_TYPES = ["Home Visit", "In-Store Visit"];
export const TIME_SLOTS = ["10:00 – 12:00", "12:00 – 14:00", "14:00 – 16:00", "16:00 – 18:00"];

export const STATUS_LABELS: Record<string, string> = {
  submitted: "Submitted",
  assigned: "Assigned",
  in_progress: "In Progress",
  awaiting_info: "Awaiting Info",
  quote_ready: "Quote Ready",
  awaiting_payment: "Awaiting Payment",
  report_ready: "Report Ready",
  closed: "Closed",
  cancelled: "Cancelled",
};

export const STATUS_FLOW = ["submitted", "assigned", "in_progress", "awaiting_info", "report_ready", "closed"];
export const REPAIR_FLOW = ["submitted", "assigned", "quote_ready", "awaiting_payment", "in_progress", "report_ready", "closed"];

export const ASSET_CATEGORIES = [
  "Necklace/Haar", "Ring", "Earrings", "Bangles", "Bracelet",
  "Anklet/Payal", "Pendant", "Maang Tikka", "Brooch", "Cufflinks",
  "Watch", "Coin/Bar", "Other",
];

export const LOCATION_TYPES = [
  { value: "With Me", icon: "🏠", desc: "Currently in my possession at home" },
  { value: "Bank Locker", icon: "🏦", desc: "Stored in a bank safe deposit locker" },
  { value: "Pledged / Hypothecated", icon: "🤝", desc: "Given as collateral to a lender" },
  { value: "With Family Member", icon: "👨‍👩‍👧", desc: "Given to a family member for safekeeping" },
  { value: "Professional Storage", icon: "🏛️", desc: "Stored with a professional vault service" },
  { value: "Travelling With Me", icon: "✈️", desc: "Currently with me while travelling" },
  { value: "Other", icon: "📦", desc: "Something else" },
];