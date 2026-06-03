import type { AppDB, Rates } from "./types";

export const RATES: Rates = {
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

export const CREDS = {
  customer: { m: "9876543210", p: "vault123" },
  admin: { m: "9000000001", p: "admin123" },
  ticket_manager: { m: "9000000002", p: "ticket123" },
};

export const INITIAL_DB: AppDB = {
  customer: {
    customer_id: "CUST-0018",
    full_name: "Priya Mehta",
    mobile: "9876543210",
    email: "priya.mehta@email.com",
    address: "14 Hill Road, Bandra West, Mumbai, Maharashtra 400050",
    tfa: "sms",
    status: "active",
  },
  staff: [
    { staff_id: "STF-01", full_name: "Valli Kumar", email: "valli@aurumvault.in", role: "admin", status: "active", last_login: "Today 09:12" },
    { staff_id: "STF-02", full_name: "Dhanushraj P", email: "dhanush@aurumvault.in", role: "ticket_manager", status: "active", last_login: "Today 08:40" },
    { staff_id: "STF-03", full_name: "Ananya Rao", email: "ananya@aurumvault.in", role: "ticket_manager", status: "active", last_login: "Yesterday 18:22" },
    { staff_id: "STF-04", full_name: "Rohan Iyer", email: "rohan@aurumvault.in", role: "ticket_manager", status: "invited", last_login: "—" },
  ],
  assets: [
    {
      asset_id: "ORN-0047", name: "Grandmother's Choker", category: "Necklace/Haar",
      perspective: "heritage", metal: "Gold", purity: "22 Karat (916)", huid: "HUID-AZ4K9P",
      gross: 48.0, deduction: 2.8, net: 45.2, purchase_price: 180000, purchase_date: "1998-04-12",
      purchased_from: "Family Heirloom", invoice_ref: "—",
      provenance: "Worn by my grandmother Kamala Devi at her wedding in 1962. Passed down through three generations of women in our family. The kundan work was done by a master craftsman.",
      occasion: "Inheritance", gifted_by: "Grandmother Kamala Devi",
      location_type: "Bank Locker", location_detail: { bank: "HDFC Bank", branch: "Bandra West", locker: "A-241" },
      last_verified: "2025-03-15", status: "verified", images: [], created_at: "2025-01-10", appraised_value: 340000,
    },
    {
      asset_id: "ORN-0048", name: "Wedding Ring Set", category: "Ring",
      perspective: "customer", metal: "Gold", purity: "18 Karat (750)", huid: "HUID-7QM2XB",
      gross: 13.2, deduction: 0.4, net: 12.8, purchase_price: 62000, purchase_date: "2015-11-20",
      purchased_from: "Tanishq, Mumbai", invoice_ref: "TNQ-2015-8841",
      provenance: "", occasion: "Wedding", gifted_by: "",
      location_type: "With Me", location_detail: {},
      last_verified: "2025-05-01", status: "verified", images: [], created_at: "2025-01-12", appraised_value: null,
    },
    {
      asset_id: "ORN-0049", name: "Diamond Earrings Set", category: "Earrings",
      perspective: "customer", metal: "Gold + Diamond", purity: "18K Gold + VVS1",
      gross: 9.0, deduction: 0.6, net: 8.4, purchase_price: 195000, purchase_date: "2019-08-05",
      purchased_from: "Malabar Gold & Diamonds", invoice_ref: "MGD-2019-3320",
      provenance: "", occasion: "Anniversary", gifted_by: "Husband",
      location_type: "With Me", location_detail: {},
      last_verified: "2025-04-10", status: "in_review", images: [], created_at: "2025-02-01", appraised_value: null,
    },
    {
      asset_id: "ORN-0050", name: "Silver Payal Set", category: "Anklet/Payal",
      perspective: "customer", metal: "Silver", purity: "925 Sterling",
      gross: 124.0, deduction: 4.0, net: 120.0, purchase_price: 9500, purchase_date: "2021-02-14",
      purchased_from: "Local Jeweller, Andheri", invoice_ref: "—",
      provenance: "", occasion: "Gift", gifted_by: "Mother",
      location_type: "With Family Member", location_detail: { name: "Sunita Mehta", relationship: "Mother" },
      last_verified: "2025-02-20", status: "pending", images: [], created_at: "2025-02-15", appraised_value: null,
    },
    {
      asset_id: "ORN-0051", name: "Kundan Bangles ×6", category: "Bangles",
      perspective: "heritage", metal: "Gold", purity: "22 Karat (916)", huid: "HUID-LT8N3C",
      gross: 84.0, deduction: 3.6, net: 80.4, purchase_price: 310000, purchase_date: "2010-10-30",
      purchased_from: "Heritage Jewellers, Mumbai", invoice_ref: "HJ-2010-1102",
      provenance: "Commissioned for my wedding using gold from my mother-in-law's collection. Traditional handcrafted kundan craftsmanship.",
      occasion: "Wedding", gifted_by: "Mother-in-law",
      location_type: "Bank Locker", location_detail: { bank: "SBI", branch: "Andheri East", locker: "B-118" },
      last_verified: "2025-03-15", status: "verified", images: [], created_at: "2025-01-20", appraised_value: null,
    },
  ],
  tickets: [
    {
      ticket_id: "AV-2025-00847", customer_id: "CUST-0018", asset_id: "ORN-0047",
      service_type: "appraisal_purity", status: "report_ready", priority: "high",
      assigned_to: "STF-02", customer_notes: "Please handle with extra care, this is a family heirloom. Prefer morning appraisal slot.",
      preferred_date: "2025-05-28", time_slot: "10:00 – 12:00", visit_type: "Home Visit",
      dispatch_address: "14 Hill Road, Bandra West, Mumbai, Maharashtra 400050",
      extra: {}, created_at: "2025-05-20", updated_at: "2025-05-29",
    },
    {
      ticket_id: "AV-2025-00721", customer_id: "CUST-0018", asset_id: "ORN-0049",
      service_type: "refurbishment", status: "in_progress", priority: "medium",
      assigned_to: "STF-02", customer_notes: "One earring clasp is loose, please assess.",
      preferred_date: "2025-05-25", time_slot: "14:00 – 16:00", visit_type: "In-Store Visit",
      dispatch_address: "14 Hill Road, Bandra West, Mumbai, Maharashtra 400050",
      extra: { refurb: ["Polishing & Buffing", "Ultrasonic Cleaning"], rateTotal: 1000 },
      created_at: "2025-05-18", updated_at: "2025-05-26",
    },
    {
      ticket_id: "AV-2025-00612", customer_id: "CUST-0018", asset_id: "ORN-0050",
      service_type: "appraisal_purity", status: "closed", priority: "low",
      assigned_to: "STF-03", customer_notes: "Routine purity check.",
      preferred_date: "2025-04-15", time_slot: "12:00 – 14:00", visit_type: "Home Visit",
      dispatch_address: "14 Hill Road, Bandra West, Mumbai, Maharashtra 400050",
      extra: {}, created_at: "2025-04-10", updated_at: "2025-04-18",
    },
    {
      ticket_id: "AV-2025-00903", customer_id: "CUST-0018", asset_id: "ORN-0048",
      service_type: "repair", status: "quote_ready", priority: "medium",
      assigned_to: "STF-02", customer_notes: "The band has a small dent on the inner side.",
      preferred_date: "2025-06-02", time_slot: "16:00 – 18:00", visit_type: "In-Store Visit",
      dispatch_address: "14 Hill Road, Bandra West, Mumbai, Maharashtra 400050",
      extra: {
        issue: "Small dent on the inner band, ring still wearable.",
        repairability: "Repairable", repair_path: "store",
        quote_amount: 1800, quote_timeframe: "4–5 days",
        quote_notes: "Dent correction and re-polish. Confirm to proceed.",
        paid: false,
      },
      created_at: "2025-05-30", updated_at: "2025-05-31",
    },
  ],
  reports: [
    {
      report_id: "RPT-001", ticket_id: "AV-2025-00847", asset_id: "ORN-0047",
      appraised_value: 340000,
      notes: "Genuine 22K BIS hallmark confirmed. Kundan work is handcrafted with gold wire setting. Stone clarity is excellent. Recommended insurance valuation: ₹3,40,000.",
      images: [], certificate_ref: "BIS-AV-2025-0847", status: "certified",
      appraised_by: "STF-02", appraised_at: "2025-05-29",
    },
    {
      report_id: "RPT-002", ticket_id: "AV-2025-00612", asset_id: "ORN-0050",
      appraised_value: 8640,
      notes: "925 sterling silver confirmed via acid + XRF test. Minor surface tarnish, no structural concerns.",
      images: [], certificate_ref: "BIS-AV-2025-0612", status: "certified",
      appraised_by: "STF-03", appraised_at: "2025-04-18",
    },
  ],
  documents: [
    { document_id: "DOC-01", asset_id: "ORN-0048", type: "invoice", filename: "Tanishq_Invoice_2015.pdf", status: "verified", date: "2025-01-12" },
    { document_id: "DOC-02", asset_id: "ORN-0049", type: "invoice", filename: "Malabar_Invoice_2019.pdf", status: "verified", date: "2025-02-01" },
    { document_id: "DOC-03", asset_id: "ORN-0049", type: "hallmark", filename: "Diamond_Certificate_VVS1.pdf", status: "pending", date: "2025-02-01" },
    { document_id: "DOC-04", asset_id: "ORN-0047", type: "appraisal", filename: "Appraisal_Choker_2025.pdf", status: "verified", date: "2025-05-29" },
    { document_id: "DOC-05", asset_id: "ORN-0051", type: "invoice", filename: "Heritage_Jewellers_2010.pdf", status: "verified", date: "2025-01-20" },
  ],
  transactions: [
    { txn_id: "TXN-9001", customer: "Priya Mehta", service: "Appraisal & Purity", asset: "Grandmother's Choker", amount: 2500, date: "2025-05-20", status: "Paid" },
    { txn_id: "TXN-9002", customer: "Priya Mehta", service: "Refurbishment", asset: "Diamond Earrings Set", amount: 1800, date: "2025-05-18", status: "Pending" },
    { txn_id: "TXN-9003", customer: "Priya Mehta", service: "Appraisal & Purity", asset: "Silver Payal Set", amount: 1200, date: "2025-04-10", status: "Paid" },
  ],
  audit: [
    { ts: "2025-05-29 14:22", actor: "Dhanushraj P", action: "Published Appraisal", entity: "AV-2025-00847", detail: "Status → Report Ready, Value ₹3,40,000" },
    { ts: "2025-05-28 10:05", actor: "Valli Kumar", action: "Assigned Ticket", entity: "AV-2025-00847", detail: "Assigned to Dhanushraj P" },
    { ts: "2025-05-26 16:40", actor: "Dhanushraj P", action: "Status Update", entity: "AV-2025-00721", detail: "Status → In Progress" },
    { ts: "2025-05-20 09:15", actor: "System", action: "Ticket Created", entity: "AV-2025-00847", detail: "Appraisal & Purity request submitted" },
    { ts: "2025-04-18 11:30", actor: "Ananya Rao", action: "Closed Ticket", entity: "AV-2025-00612", detail: "Purity verification completed" },
  ],
};
