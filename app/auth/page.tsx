"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { RegisterData } from "@/context/AuthContext";
import { useApp } from "@/context/AppContext";
import { OTPInput } from "@/components/ui/OTPInput";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { FormField, Input, Textarea } from "@/components/ui/FormField";

type Screen = "login" | "staff" | "register" | "forgot";
type StaffRole = "admin" | "ticket_manager";

const REG_STEPS = [
  { label: "Details" },
  { label: "Verify" },
  { label: "2FA" },
  { label: "Done" },
];

const TFA_OPTIONS = [
  { key: "sms",   icon: "💬", title: "SMS OTP",           desc: "Receive codes via text message" },
  { key: "email", icon: "📧", title: "Email OTP",          desc: "Receive codes via email" },
  { key: "auth",  icon: "🔑", title: "Authenticator App", desc: "Use Google/Microsoft Authenticator" },
];

function strengthScore(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/\d/.test(pw)) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}
const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = ["", "#9b2020", "#a06020", "#8a6500", "#1a6b3a"];

// ─── Brand panel (shared) ─────────────────────────────────────────────────────
function BrandPanel() {
  return (
    <div
      className="flex-1 relative overflow-hidden flex flex-col justify-center px-[60px] py-[60px] text-white max-[880px]:flex-none max-[880px]:px-8 max-[880px]:py-8"
      style={{ background: "linear-gradient(150deg,#1A1200,#3D2C0E 60%,#5A4210)" }}
    >
      <div
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none animate-floaty"
        style={{ background: "radial-gradient(circle,rgba(184,134,11,0.4),transparent 70%)", top: -100, right: -100 }}
      />
      <div
        className="absolute w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(212,175,55,0.3),transparent 70%)", bottom: -80, left: -80, animation: "floaty 10s ease-in-out infinite reverse" }}
      />
      <div className="text-[64px] mb-6 relative z-[1] animate-gemPulse max-[880px]:text-[44px] max-[880px]:mb-3">💎</div>
      <h1 className="font-serif text-[54px] text-white relative z-[1] mb-3 max-[880px]:text-[36px]">Aurum Vault</h1>
      <p className="font-serif italic text-[18px] relative z-[1] max-w-[380px] max-[880px]:hidden" style={{ color: "#E8D098" }}>
        Where heritage is measured in carats, and legacy is kept for generations.
      </p>
      <div className="mt-9 relative z-[1] max-[880px]:hidden">
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
  );
}

// ─── Gold button ──────────────────────────────────────────────────────────────
function GoldBtn({ children, loading, type = "submit", onClick, disabled }: {
  children: React.ReactNode;
  loading?: boolean;
  type?: "submit" | "button";
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className="w-full py-3.5 px-6 rounded-xl font-semibold text-white transition-all disabled:opacity-60 cursor-pointer"
      style={{ background: "linear-gradient(135deg,#8A5E0A,#B8860B)" }}
    >
      {children}
    </button>
  );
}

// ─── Show/hide password input ─────────────────────────────────────────────────
function PwInput({ value, onChange, placeholder, autoComplete }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Enter password"}
        autoComplete={autoComplete}
        className="pr-11"
      />
      <button
        type="button"
        tabIndex={-1}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] text-lg leading-none bg-transparent cursor-pointer"
        onClick={() => setShow((s) => !s)}
      >
        {show ? "🙈" : "👁"}
      </button>
    </div>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
function Divider() {
  return (
    <div className="flex items-center gap-3 my-5 text-[var(--muted)] text-[12px]">
      <div className="flex-1 h-px bg-[var(--border-color)]" />
      <span>or</span>
      <div className="flex-1 h-px bg-[var(--border-color)]" />
    </div>
  );
}

// ─── Error message ────────────────────────────────────────────────────────────
function ErrMsg({ msg }: { msg: string }) {
  if (!msg) return null;
  return <p className="text-[var(--red)] text-[13px] mb-3">{msg}</p>;
}

// ─── Back link ────────────────────────────────────────────────────────────────
function BackLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <a
      className="text-[13px] cursor-pointer mb-6 block"
      style={{ color: "var(--gold)" }}
      onClick={onClick}
    >
      {label}
    </a>
  );
}

// ─── Auth inner component (uses useSearchParams) ──────────────────────────────
function AuthInner() {
  const { initialized, token, login, register } = useAuth();
  const { role } = useApp();
  const router = useRouter();
  const params = useSearchParams();

  const initialScreen = (): Screen => {
    if (params.get("role") === "staff") return "staff";
    if (params.get("screen") === "register") return "register";
    return "login";
  };

  const [screen, setScreen] = useState<Screen>(initialScreen);

  // Redirect authenticated users — not while in middle of registration flow
  useEffect(() => {
    if (!initialized || !token || screen === "register") return;
    if (role === "customer") router.replace("/customer");
    else if (role === "admin" || role === "ticket_manager") router.replace("/admin");
  }, [initialized, token, role, router, screen]);

  // ─── Login ───────────────────────────────────────────────────────────────
  const [loginUser, setLoginUser] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginErr, setLoginErr] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!loginUser.trim() || !loginPw) { setLoginErr("All fields are required"); return; }
    setLoginLoading(true); setLoginErr("");
    try { await login(loginUser.trim(), loginPw); }
    catch (err: unknown) { setLoginErr((err as Error).message || "Sign in failed"); }
    finally { setLoginLoading(false); }
  }

  // ─── Staff ───────────────────────────────────────────────────────────────
  const [staffRole, setStaffRole] = useState<StaffRole>("admin");
  const [staffUser, setStaffUser] = useState("");
  const [staffPw, setStaffPw] = useState("");
  const [staffLoading, setStaffLoading] = useState(false);
  const [staffErr, setStaffErr] = useState("");

  async function handleStaffLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!staffUser.trim() || !staffPw) { setStaffErr("All fields are required"); return; }
    setStaffLoading(true); setStaffErr("");
    try { await login(staffUser.trim(), staffPw); }
    catch (err: unknown) { setStaffErr((err as Error).message || "Sign in failed"); }
    finally { setStaffLoading(false); }
  }

  // ─── Register ────────────────────────────────────────────────────────────
  const [regStep, setRegStep] = useState(1);
  const [regName, setRegName] = useState("");
  const [regMobile, setRegMobile] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regAddress, setRegAddress] = useState("");
  const [regPw, setRegPw] = useState("");
  const [regOtp, setRegOtp] = useState<string[]>(Array(6).fill(""));
  const [regTfa, setRegTfa] = useState("sms");
  const [regLoading, setRegLoading] = useState(false);
  const [regErr, setRegErr] = useState("");

  const pwStrength = strengthScore(regPw);

  function handleRegStep1(e: React.FormEvent) {
    e.preventDefault();
    setRegErr("");
    if (!regName.trim()) { setRegErr("Full name is required"); return; }
    if (!regMobile.trim() || !/^\d{10}$/.test(regMobile.trim())) { setRegErr("Enter a valid 10-digit mobile number"); return; }
    if (!regEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.trim())) { setRegErr("Enter a valid email address"); return; }
    if (!regPw || regPw.length < 8) { setRegErr("Password must be at least 8 characters"); return; }
    setRegStep(2);
  }

  function handleRegOtp(e: React.FormEvent) {
    e.preventDefault();
    if (regOtp.join("").length !== 6) { setRegErr("Enter the 6-digit code"); return; }
    setRegErr("");
    setRegStep(3);
  }

  async function handleRegFinish(e: React.FormEvent) {
    e.preventDefault();
    setRegLoading(true); setRegErr("");
    const data: RegisterData = {
      full_name: regName.trim(),
      mobile: regMobile.trim(),
      email: regEmail.trim(),
      password: regPw,
      address: regAddress.trim() || undefined,
      tfa: regTfa,
    };
    try {
      await register(data);
      setRegStep(4);
    } catch (err: unknown) {
      setRegErr((err as Error).message || "Registration failed");
    } finally {
      setRegLoading(false);
    }
  }

  // ─── Forgot ───────────────────────────────────────────────────────────────
  const [forgotMobile, setForgotMobile] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  // ─── Loading screen ───────────────────────────────────────────────────────
  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center"
        style={{ background: "linear-gradient(150deg,#1a1200,#3d2c0e 60%,#5a4210)" }}>
        <div className="text-white text-center">
          <div className="text-[64px] mb-4 animate-pulse">💎</div>
          <p className="font-serif text-[20px]" style={{ color: "#E8D098" }}>Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen max-[880px]:flex-col">
      <BrandPanel />

      {/* ─── Form panel ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-start justify-center p-10 overflow-y-auto max-[880px]:p-6">
        <div className="w-full max-w-[400px] py-4">

          {/* ═══════════════════ LOGIN ═══════════════════ */}
          {screen === "login" && (
            <form onSubmit={handleLogin} className="animate-fadeUp">
              <BackLink label="← Back to home" onClick={() => router.push("/")} />
              <h2 className="font-serif text-[32px] mb-1.5">Welcome Back</h2>
              <p className="text-[14px] mb-6" style={{ color: "var(--sec)" }}>Sign in to access your vault</p>

              <FormField label="Username">
                <Input
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  placeholder="Enter your username"
                  autoComplete="username"
                />
              </FormField>

              <FormField label="Password">
                <PwInput value={loginPw} onChange={setLoginPw} autoComplete="current-password" />
              </FormField>

              <ErrMsg msg={loginErr} />

              <GoldBtn loading={loginLoading}>
                {loginLoading ? "Signing In…" : "Sign In"}
              </GoldBtn>

              <Divider />

              <div className="flex justify-between text-[13px] mb-5">
                <a className="cursor-pointer" style={{ color: "var(--gold)" }} onClick={() => setScreen("forgot")}>
                  Forgot Password?
                </a>
                <a className="cursor-pointer" style={{ color: "var(--gold)" }} onClick={() => { setScreen("register"); setRegStep(1); }}>
                  Create Account
                </a>
              </div>

              <div className="text-center">
                <a className="text-[12px] cursor-pointer" style={{ color: "var(--sec)" }} onClick={() => setScreen("staff")}>
                  🛡️ Staff member? Sign in here
                </a>
              </div>
            </form>
          )}

          {/* ═══════════════════ STAFF LOGIN ═══════════════════ */}
          {screen === "staff" && (
            <form onSubmit={handleStaffLogin} className="animate-fadeUp">
              <BackLink label="← Back to home" onClick={() => router.push("/")} />

              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[1px] mb-4"
                style={{ background: "var(--charcoal)", color: "#D4AF37" }}
              >
                🛡️ Secure Operations Hub
              </div>

              <h2 className="font-serif text-[32px] mb-1.5">Staff Sign In</h2>
              <p className="text-[14px] mb-1" style={{ color: "var(--sec)" }}>Restricted access for administrators and appraisers.</p>
              <p className="text-[12px] mb-5" style={{ color: "var(--muted)" }}>🔒 aurumvault.in/staff</p>

              <div className="flex rounded-[10px] p-1 mb-6" style={{ background: "var(--gold-light)" }}>
                {(["admin", "ticket_manager"] as StaffRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setStaffRole(r)}
                    className="flex-1 py-2.5 rounded-[7px] text-[12px] font-semibold transition-all cursor-pointer"
                    style={{
                      background: staffRole === r ? "white" : "transparent",
                      color: staffRole === r ? "var(--gold)" : "var(--sec)",
                      boxShadow: staffRole === r ? "var(--sh-s)" : "none",
                    }}
                  >
                    {r === "admin" ? "Administrator" : "Appraiser"}
                  </button>
                ))}
              </div>

              <FormField label="Username">
                <Input
                  value={staffUser}
                  onChange={(e) => setStaffUser(e.target.value)}
                  placeholder="Staff username"
                  autoComplete="username"
                />
              </FormField>

              <FormField label="Password">
                <PwInput value={staffPw} onChange={setStaffPw} autoComplete="current-password" />
              </FormField>

              <ErrMsg msg={staffErr} />

              <GoldBtn loading={staffLoading}>
                {staffLoading ? "Signing In…" : "Sign In to Hub"}
              </GoldBtn>

              <div className="mt-4 text-center">
                <a className="text-[12px] cursor-pointer" style={{ color: "var(--sec)" }} onClick={() => setScreen("login")}>
                  ← Customer sign in
                </a>
              </div>
            </form>
          )}

          {/* ═══════════════════ REGISTER ═══════════════════ */}
          {screen === "register" && (
            <div className="animate-fadeUp">
              <BackLink label="← Back to sign in" onClick={() => { setScreen("login"); setRegStep(1); setRegErr(""); }} />
              <h2 className="font-serif text-[32px] mb-4">Create Your Vault</h2>

              <StepIndicator steps={REG_STEPS} current={regStep} className="mb-6" />

              {/* Step 1 — Details */}
              {regStep === 1 && (
                <form onSubmit={handleRegStep1}>
                  <h4 className="font-semibold mb-4 text-[15px]">Personal Details</h4>

                  <FormField label="Full Name" required>
                    <Input value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="e.g. Priya Mehta" />
                  </FormField>

                  <FormField label="Mobile Number" required>
                    <Input
                      value={regMobile}
                      onChange={(e) => setRegMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="10-digit mobile"
                      inputMode="numeric"
                    />
                  </FormField>

                  <FormField label="Email" required>
                    <Input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="you@email.com" />
                  </FormField>

                  <FormField
                    label="Residential Address"
                    hint="🚪 This becomes your default point for doorstep appraisal & purity collection."
                  >
                    <Textarea
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                      placeholder="Full address — used as your default dispatch coordinate for doorstep appraiser visits"
                      rows={3}
                    />
                  </FormField>

                  <FormField label="Master Vault Passcode" required>
                    <PwInput value={regPw} onChange={setRegPw} placeholder="Create a strong passcode" autoComplete="new-password" />
                    <div className="h-[5px] rounded-[3px] mt-2 overflow-hidden" style={{ background: "var(--border-color)" }}>
                      <div
                        className="h-full transition-all duration-300"
                        style={{ width: `${(pwStrength / 4) * 100}%`, background: STRENGTH_COLORS[pwStrength] || "transparent" }}
                      />
                    </div>
                    <p className="text-[11px] mt-1" style={{ color: pwStrength > 0 ? STRENGTH_COLORS[pwStrength] : "var(--muted)" }}>
                      {pwStrength > 0 ? STRENGTH_LABELS[pwStrength] : "Use 8+ chars with letters, numbers & symbols"}
                    </p>
                  </FormField>

                  <ErrMsg msg={regErr} />
                  <GoldBtn>Continue →</GoldBtn>
                </form>
              )}

              {/* Step 2 — OTP */}
              {regStep === 2 && (
                <form onSubmit={handleRegOtp}>
                  <h4 className="font-semibold mb-1.5 text-[15px]">Verify Your Mobile</h4>
                  <p className="text-[13px] mb-5" style={{ color: "var(--sec)" }}>
                    Enter the 6-digit code sent to {regMobile}. <em>(Demo code: 123456)</em>
                  </p>
                  <OTPInput value={regOtp} onChange={setRegOtp} />
                  {regErr && <p className="text-[var(--red)] text-[13px] mt-2.5 text-center">{regErr}</p>}
                  <div className="mt-5">
                    <GoldBtn>Verify →</GoldBtn>
                  </div>
                  <p className="text-center mt-3.5 text-[13px]" style={{ color: "var(--muted)" }}>
                    Didn&apos;t receive it?{" "}
                    <a className="cursor-pointer" style={{ color: "var(--gold)" }} onClick={() => setRegOtp(Array(6).fill(""))}>
                      Resend
                    </a>
                  </p>
                </form>
              )}

              {/* Step 3 — 2FA */}
              {regStep === 3 && (
                <form onSubmit={handleRegFinish}>
                  <h4 className="font-semibold mb-1.5 text-[15px]">Set Up Two-Factor Auth</h4>
                  <p className="text-[13px] mb-5" style={{ color: "var(--sec)" }}>
                    Choose how you&apos;d like to secure your vault.
                  </p>
                  <div className="flex flex-col gap-2.5 mb-5">
                    {TFA_OPTIONS.map(({ key, icon, title, desc }) => (
                      <div
                        key={key}
                        onClick={() => setRegTfa(key)}
                        className="flex items-center gap-3 p-3.5 rounded-xl border-[1.5px] cursor-pointer transition-all"
                        style={{
                          borderColor: regTfa === key ? "var(--gold)" : "var(--border-color)",
                          background: regTfa === key ? "var(--gold-light)" : "transparent",
                          boxShadow: regTfa === key ? "0 0 0 1px var(--gold)" : "none",
                        }}
                      >
                        <div className="text-[28px] shrink-0">{icon}</div>
                        <div>
                          <div className="font-semibold text-[14px]">{title}</div>
                          <div className="text-[12px]" style={{ color: "var(--sec)" }}>{desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <ErrMsg msg={regErr} />
                  <GoldBtn loading={regLoading}>{regLoading ? "Creating Vault…" : "Continue →"}</GoldBtn>
                </form>
              )}

              {/* Step 4 — Done */}
              {regStep === 4 && (
                <div className="text-center py-2 animate-fadeUp">
                  <div className="text-[60px] mb-2">🎉</div>
                  <h3 className="font-serif text-[26px] mb-2">Welcome to Aurum Vault!</h3>
                  <p className="text-[14px] mb-5" style={{ color: "var(--sec)" }}>Your secure vault is ready.</p>
                  <div className="text-left rounded-xl p-4 mb-5" style={{ background: "var(--gold-light)" }}>
                    {[
                      "✅ Account created & verified",
                      "✅ Two-factor authentication enabled",
                      "✅ Dispatch address saved",
                      "✅ Vault encryption active",
                    ].map((item) => (
                      <div key={item} className="mb-2 text-[14px]">{item}</div>
                    ))}
                  </div>
                  <GoldBtn type="button" onClick={() => router.replace("/customer")}>Enter Vault →</GoldBtn>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════ FORGOT ═══════════════════ */}
          {screen === "forgot" && (
            <div className="animate-fadeUp">
              <BackLink label="← Back to sign in" onClick={() => setScreen("login")} />
              <h2 className="font-serif text-[32px] mb-1.5">Reset Password</h2>
              <p className="text-[14px] mb-6" style={{ color: "var(--sec)" }}>
                Enter your registered mobile number and we&apos;ll send a reset link valid for 15 minutes.
              </p>

              {!forgotSent ? (
                <>
                  <FormField label="Registered Mobile">
                    <Input
                      value={forgotMobile}
                      onChange={(e) => setForgotMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="Mobile number"
                      inputMode="numeric"
                    />
                  </FormField>
                  <GoldBtn type="button" onClick={() => { if (forgotMobile.length >= 10) setForgotSent(true); }} disabled={forgotMobile.length < 10}>
                    Send Reset Link
                  </GoldBtn>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="text-[48px] mb-3">📧</div>
                  <h3 className="font-semibold text-[18px] mb-2">Check your messages</h3>
                  <p className="text-[14px] mb-5" style={{ color: "var(--sec)" }}>
                    A reset link has been sent to {forgotMobile}.
                  </p>
                  <a
                    className="text-[13px] cursor-pointer"
                    style={{ color: "var(--gold)" }}
                    onClick={() => { setForgotSent(false); setScreen("login"); }}
                  >
                    ← Back to sign in
                  </a>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── Page wrapper with Suspense for useSearchParams ───────────────────────────
export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center"
          style={{ background: "linear-gradient(150deg,#1a1200,#3d2c0e 60%,#5a4210)" }}>
          <div className="text-white text-center">
            <div className="text-[64px] mb-4 animate-pulse">💎</div>
            <p className="font-serif text-[20px]" style={{ color: "#E8D098" }}>Loading…</p>
          </div>
        </div>
      }
    >
      <AuthInner />
    </Suspense>
  );
}