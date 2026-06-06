"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useApp } from "@/context/AppContext";

export default function AuthPage() {
  const { initialized, token, login, register } = useAuth();
  const { role } = useApp();
  const router = useRouter();

  // Redirect already-authenticated users to their portal
  useEffect(() => {
    if (!initialized || !token) return;
    if (role === "customer") router.replace("/customer");
    else if (role === "admin" || role === "ticket_manager") router.replace("/admin");
  }, [initialized, token, role, router]);

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "linear-gradient(150deg,#1a1200,#3d2c0e 60%,#5a4210)" }}>
        <div className="text-white text-center">
          <div className="text-[64px] mb-4 animate-pulse">💎</div>
          <p className="font-serif text-[20px]" style={{ color: "#E8D098" }}>Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Brand panel */}
      <div
        className="flex-1 relative overflow-hidden flex flex-col justify-center px-16 py-12 text-white max-md:flex-none max-md:px-8 max-md:py-8"
        style={{ background: "linear-gradient(150deg,#1a1200,#3d2c0e 60%,#5a4210)" }}
      >
        <div
          className="absolute w-[400px] h-[400px] rounded-full pointer-events-none animate-floaty"
          style={{ background: "radial-gradient(circle,rgba(184,134,11,0.4),transparent 70%)", top: -100, right: -100 }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(212,175,55,0.3),transparent 70%)", bottom: -80, left: -80, animation: "floaty 10s ease-in-out infinite reverse" }}
        />
        <div className="text-[64px] mb-6 relative z-[1] animate-gemPulse">💎</div>
        <h1 className="font-serif text-[54px] text-white relative z-[1] mb-3 max-md:text-[36px]">Aurum Vault</h1>
        <p className="font-serif italic text-[18px] relative z-[1] max-w-[380px] max-md:hidden" style={{ color: "#E8D098" }}>
          Where heritage is measured in carats, and legacy is kept for generations.
        </p>
        <div className="mt-9 relative z-[1] max-md:hidden">
          {[
            "🏆 Certified BIS hallmark appraisals",
            "🔐 Bank-grade secure asset vault",
            "🚪 Doorstep appraiser dispatch at your convenience",
            "📜 Heritage provenance tracking",
          ].map((f) => (
            <div key={f} className="mb-3 text-[14px] flex gap-2.5 items-center" style={{ color: "rgba(255,255,255,0.85)" }}>
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Auth panel */}
      <div className="flex-1 flex items-center justify-center p-10 overflow-y-auto max-md:p-6">
        <div className="w-full max-w-[400px]">
          <div className="text-center mb-8">
            <div className="text-[54px] mb-4">🔐</div>
            <h2 className="font-serif text-[32px] mb-2">Welcome Back</h2>
            <p className="text-[var(--sec)] text-[14px]">Sign in to access your secure vault</p>
          </div>

          <button
            onClick={login}
            className="w-full py-3.5 px-6 rounded-xl font-semibold text-white transition-all mb-3 cursor-pointer"
            style={{ background: "linear-gradient(135deg,#8A5E0A,#B8860B)" }}
          >
            Sign In
          </button>

          <button
            onClick={register}
            className="w-full py-3.5 px-6 rounded-xl font-semibold transition-all cursor-pointer border-[1.5px]"
            style={{ borderColor: "var(--gold)", color: "var(--gold)", background: "transparent" }}
          >
            Create Account
          </button>

          <div className="mt-6 p-4 rounded-xl text-[12px] text-[var(--sec)] leading-relaxed" style={{ background: "var(--gold-light)" }}>
            <strong>Note:</strong> You will be redirected to a secure Keycloak login page. Your credentials are never handled by this application directly.
          </div>
        </div>
      </div>
    </div>
  );
}