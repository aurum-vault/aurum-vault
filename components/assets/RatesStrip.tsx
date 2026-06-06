import { useApp } from "@/context/AppContext";

export function RatesStrip() {
  const { rates } = useApp();

  const items = [
    { name: "Gold (24K)", val: `₹${rates.gold.toLocaleString("en-IN")}/g`, chg: "▲ 0.8%", up: true },
    { name: "Silver",     val: `₹${rates.silver}/g`,                        chg: "▼ 0.3%", up: false },
    { name: "Platinum",   val: `₹${rates.platinum.toLocaleString("en-IN")}/g`, chg: "▲ 0.5%", up: true },
    { name: "Diamond",    val: `$${rates.diamondUSD.toLocaleString()}/ct`,   chg: "▲ 1.2%", up: true },
  ];

  return (
    <div className="flex bg-gradient-to-br from-[#1a1200] to-[#3d2c0e] rounded-xl overflow-hidden shadow-[var(--sh-m)] mb-6">
      {items.map((r, i) => (
        <div key={r.name} className={`flex-1 px-5 py-4 text-white ${i < items.length - 1 ? "border-r border-white/8" : ""}`}>
          <div className="text-[11px] tracking-[1px] uppercase text-[#D4AF37] font-semibold">{r.name}</div>
          <div className="font-serif text-[22px] font-semibold mt-0.5">{r.val}</div>
          <div className={`text-[11px] mt-0.5 ${r.up ? "text-[#6bcb77]" : "text-[#ff8a8a]"}`}>{r.chg}</div>
        </div>
      ))}
    </div>
  );
}