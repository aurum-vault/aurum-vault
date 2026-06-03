"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen" style={{ background: "#fbf7f0" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-12 py-4 backdrop-blur-md border-b border-[var(--border-color)] max-md:px-6"
        style={{ background: "rgba(251,247,240,0.85)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-[10px] flex items-center justify-center font-serif text-white text-[22px] font-bold"
            style={{ background: "linear-gradient(135deg,#7a4e08,#b8860b)" }}>A</div>
          <span className="font-serif text-[24px] font-bold text-[var(--charcoal)]">Aurum Vault</span>
        </div>
        <div className="flex items-center gap-7">
          {["lp-features", "lp-how", "lp-services"].map((id, i) => (
            <button key={id} onClick={() => scrollTo(id)}
              className="hidden md:block text-[var(--sec)] font-medium text-[14px] hover:text-[var(--gold)] transition-colors bg-transparent cursor-pointer">
              {["Features", "How It Works", "Services"][i]}
            </button>
          ))}
          <Link href="/auth?role=staff" className="hidden md:block text-[var(--sec)] font-medium text-[14px] hover:text-[var(--gold)] transition-colors">
            Staff Login
          </Link>
          <Link href="/auth"><Button size="sm">Sign In</Button></Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-12 py-20 grid grid-cols-[1.1fr_0.9fr] gap-12 items-center max-w-[1280px] mx-auto max-md:grid-cols-1 max-md:px-6 max-md:py-12">
        <div className="absolute w-[520px] h-[520px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(184,134,11,0.16),transparent 70%)", top: -160, right: -120, zIndex: 0 }} />

        <div className="relative z-[1] animate-fadeUp">
          <span className="inline-flex items-center gap-2 bg-[var(--gold-light)] text-[var(--gold)] px-4 py-1.5 rounded-full text-[12px] font-semibold tracking-[1px] uppercase mb-5">
            💎 Heritage · Secured · Certified
          </span>
          <h1 className="font-serif text-[62px] leading-[1.05] mb-5 text-[var(--charcoal)] max-md:text-[44px]">
            Your family&apos;s <em className="italic" style={{ color: "var(--gold-accent)" }}>legacy</em>, vaulted for generations.
          </h1>
          <p className="text-[18px] text-[var(--sec)] max-w-[520px] mb-7 leading-relaxed">
            Aurum Vault is a premium digital vault for gold, silver, platinum and diamond heirlooms — with BIS-certified appraisals delivered right to your doorstep.
          </p>
          <div className="flex gap-3.5 flex-wrap mb-10">
            <Link href="/auth?screen=register"><Button size="lg">Create Your Vault →</Button></Link>
            <Link href="/auth"><Button variant="ghost" size="lg">Sign In</Button></Link>
          </div>
          <div className="flex gap-7 flex-wrap">
            {[{ n: "₹12.4 Cr+", l: "Assets Vaulted" }, { n: "BIS", l: "Accredited Hallmarking" }, { n: "100%", l: "Bank-Grade Security" }].map((t) => (
              <div key={t.l}>
                <div className="font-serif text-[32px] font-bold text-[var(--charcoal)]">{t.n}</div>
                <div className="text-[12px] text-[var(--muted)] uppercase tracking-[1px]">{t.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-[1] h-[440px] max-md:hidden">
          {[
            { style: { top: 0, left: 20 }, ico: "📿", title: "Grandmother's Choker", val: "₹3,40,000", sub: "22K Gold · Certified ✓" },
            { style: { top: 130, right: 0 }, ico: "💍", title: "Diamond Earrings", val: "₹2,14,000", sub: "18K + VVS1 · In Review" },
            { style: { bottom: 0, left: 50 }, ico: "🟡", title: "Kundan Bangles ×6", val: "₹5,73,200", sub: "22K Gold · Bank Locker" },
          ].map((c) => (
            <div key={c.title} className="absolute bg-white border border-[var(--border-color)] rounded-2xl shadow-[var(--sh-l)] p-5 w-[230px] animate-floaty" style={c.style}>
              <div className="text-[34px] mb-2.5">{c.ico}</div>
              <div className="font-bold text-[var(--charcoal)] text-[15px]">{c.title}</div>
              <div className="font-serif text-[22px] font-bold mt-1" style={{ color: "var(--gold-accent)" }}>{c.val}</div>
              <div className="text-[12px] text-[var(--muted)] mt-0.5">{c.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="lp-features" className="px-12 py-18 max-w-[1280px] mx-auto max-md:px-6">
        <h2 className="font-serif text-[42px] text-center mb-3 max-md:text-[32px]">A vault built for what matters</h2>
        <p className="text-center text-[var(--sec)] text-[16px] max-w-[560px] mx-auto mb-12">
          Every ornament catalogued, valued, and protected — with the craft and care your heritage deserves.
        </p>
        <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1">
          {[
            { i: "🏆", t: "Certified Appraisals", d: "Accredited gemologists assess your pieces and issue BIS hallmark-verified valuation certificates you can trust for insurance and resale." },
            { i: "🚪", t: "Doorstep Dispatch", d: "Don't move your gold. Our experts come to you — securely assessing, verifying and collecting ornaments from your saved address." },
            { i: "📜", t: "Heritage Provenance", d: "Record the story behind each piece — who owned it, when it was acquired, the family it belongs to — preserved alongside its value." },
            { i: "📸", t: "Visual Documentation", d: "Capture every angle with built-in camera support. Front, back, hallmark and clasp — clear images enable accurate appraisals." },
            { i: "🏦", t: "Custody Tracking", d: "Know exactly where each asset is — home safe, bank locker, with family, or pledged — with last-verified dates on record." },
            { i: "🔐", t: "Bank-Grade Security", d: "Two-factor authentication, encrypted storage, login alerts and an immutable audit trail protect your vault around the clock." },
          ].map((f) => (
            <div key={f.t} className="bg-white border border-[var(--border-color)] rounded-2xl p-7 transition-all hover:-translate-y-1.5 hover:shadow-[var(--sh-m)] hover:border-[var(--border-active)]">
              <div className="text-[38px] mb-4">{f.i}</div>
              <h4 className="font-serif text-[20px] mb-2">{f.t}</h4>
              <p className="text-[var(--sec)] text-[14px] leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <div id="lp-how" style={{ background: "linear-gradient(150deg,#1a1200,#3d2c0e 60%,#5a4210)" }}>
        <div className="max-w-[1280px] mx-auto px-12 py-16 max-md:px-6">
          <h2 className="font-serif text-[42px] text-white text-center mb-8 max-md:text-[32px]">How it works</h2>
          <div className="grid grid-cols-3 gap-8 max-md:grid-cols-1">
            {[
              { n: "01", t: "Catalogue your ornaments", d: "Add each piece through a guided wizard — identity & story, metal & purity, photos, location and purchase documents." },
              { n: "02", t: "Request doorstep appraisal", d: "Book a unified Appraisal & Purity visit. Confirm your address and schedule — an expert arrives to verify and assess." },
              { n: "03", t: "Receive your certificate", d: "Get a BIS-verified valuation report inside your vault, with inspection images and a downloadable certificate." },
            ].map((s) => (
              <div key={s.n}>
                <div className="font-serif text-[48px] font-bold leading-none" style={{ color: "#D4AF37", opacity: 0.5 }}>{s.n}</div>
                <h4 className="text-white text-[20px] my-2 font-serif">{s.t}</h4>
                <p className="text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services */}
      <section id="lp-services" className="px-12 py-18 max-w-[1280px] mx-auto max-md:px-6">
        <h2 className="font-serif text-[42px] text-center mb-3 max-md:text-[32px]">Services we provide</h2>
        <p className="text-center text-[var(--sec)] text-[16px] max-w-[560px] mx-auto mb-12">
          From certified valuation to liquidity against your gold — every service your heirlooms may need.
        </p>
        <div className="grid grid-cols-4 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {[
            { i: "🏆", t: "Appraisal & Purity", d: "Certified valuation and BIS hallmark / HUID verification — book a home or in-store visit and receive a digital certificate." },
            { i: "🔧", t: "Repair Assessment", d: "Share photos for assessment, get cost & timeframe, then choose at-home or in-store repair with online payment." },
            { i: "✨", t: "Refurbishment", d: "Upkeep & maintenance on a transparent rate card — polishing, ultrasonic cleaning, buffing and more." },
            { i: "💰", t: "Gold Loan", d: "Unlock collateral-based liquidity — up to 60% of your gold value (net weight × rate), backed by certified valuations." },
          ].map((r) => (
            <div key={r.t} className="border border-[var(--border-color)] rounded-2xl p-7 bg-white text-center transition-all hover:-translate-y-1.5 hover:shadow-[var(--sh-m)] hover:border-[var(--gold)]">
              <div className="text-[42px] mb-3.5">{r.i}</div>
              <h4 className="font-serif text-[20px] mb-2">{r.t}</h4>
              <p className="text-[var(--sec)] text-[14px] leading-relaxed">{r.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center px-12 py-20 max-md:px-6">
        <h2 className="font-serif text-[46px] mb-4 max-md:text-[32px]">Begin your vault today.</h2>
        <p className="text-[var(--sec)] text-[17px] mb-7">Join families across India securing their legacy with Aurum Vault.</p>
        <Link href="/auth?screen=register"><Button size="lg">Create Your Vault →</Button></Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] px-12 py-8 flex justify-between items-center flex-wrap gap-4 text-[var(--muted)] text-[13px] max-md:px-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[8px] flex items-center justify-center font-serif text-white text-[17px] font-bold"
            style={{ background: "linear-gradient(135deg,#7a4e08,#b8860b)" }}>A</div>
          <span className="font-serif text-[18px] font-bold text-[var(--charcoal)]">Aurum Vault</span>
        </div>
        <div>© 2025 Aurum Vault · Heritage secured, certified &amp; vaulted</div>
      </footer>
    </div>
  );
}
