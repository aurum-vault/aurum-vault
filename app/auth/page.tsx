"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { CREDS } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { FormField, Input, Select, Textarea, PhoneRow } from "@/components/ui/FormField";
import { OTPInput } from "@/components/ui/OTPInput";
import { RadioCardGroup } from "@/components/ui/RadioCard";
import { StepIndicator } from "@/components/ui/StepIndicator";
import type { UserRole } from "@/lib/types";

type Screen = "login" | "staff" | "register" | "forgot";

function AuthContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { setRole, toast } = useApp();

  const initialScreen = (params.get("screen") || "login") as Screen;
  const initialStaffRole = (params.get("role") === "staff" ? "admin" : null);

  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [staffRole, setStaffRole] = useState<"admin" | "ticket_manager">("admin");

  // Login state
  const [loginMobile, setLoginMobile] = useState(CREDS.customer.m);
  const [loginPw, setLoginPw] = useState(CREDS.customer.p);
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});

  // Staff state
  const [staffMobile, setStaffMobile] = useState(CREDS.admin.m);
  const [staffPw, setStaffPw] = useState(CREDS.admin.p);
  const [staffErrors, setStaffErrors] = useState<Record<string, string>>({});

  // OTP modal for login
  const [showOtpLogin, setShowOtpLogin] = useState(false);
  const [otpLogin, setOtpLogin] = useState(["", "", "", "", "", ""]);

  // Register state
  const [regStep, setRegStep] = useState(1);
  const [regData, setRegData] = useState({
    name: "", mobile: "", email: "", address: "", pw: "", tfa: "sms",
  });
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});
  const [regOtp, setRegOtp] = useState(["", "", "", "", "", ""]);
  const [pwStrength, setPwStrength] = useState(0);

  // Forgot state
  const [forgotMobile, setForgotMobile] = useState("");

  const enterPortal = (role: UserRole) => {
    setRole(role);
    toast("Signed in successfully", "success");
    if (role === "customer") router.push("/customer");
    else if (role === "admin") router.push("/admin");
    else router.push("/appraiser");
  };

  const doLogin = () => {
    const errors: Record<string, string> = {};
    if (!loginMobile) errors.mobile = "Mobile number is required";
    if (!loginPw) errors.pw = "Password is required";
    if (!errors.mobile && !errors.pw) {
      if (loginMobile !== CREDS.customer.m || loginPw !== CREDS.customer.p) {
        errors.pw = "Invalid customer credentials";
      }
    }
    setLoginErrors(errors);
    if (!Object.keys(errors).length) enterPortal("customer");
  };

  const doStaffLogin = () => {
    const cred = CREDS[staffRole];
    const errors: Record<string, string> = {};
    if (!staffMobile) errors.mobile = "Mobile number is required";
    if (!staffPw) errors.pw = "Password is required";
    if (!errors.mobile && !errors.pw) {
      if (staffMobile !== cred.m || staffPw !== cred.p) {
        errors.pw = "Invalid staff credentials for selected role";
      }
    }
    setStaffErrors(errors);
    if (!Object.keys(errors).length) enterPortal(staffRole as UserRole);
  };

  const checkPwStrength = (v: string) => {
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/\d/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    setPwStrength(score);
  };

  const regNext = () => {
    const errors: Record<string, string> = {};
    if (regStep === 1) {
      if (!regData.name.trim()) errors.name = "Full name required";
      if (!/^\d{10}$/.test(regData.mobile)) errors.mobile = "Valid 10-digit mobile required";
      if (!/\S+@\S+\.\S+/.test(regData.email)) errors.email = "Valid email required";
      if (!regData.address.trim()) errors.address = "Dispatch address required";
      if (regData.pw.length < 6) errors.pw = "Passcode too short";
    } else if (regStep === 2) {
      const code = regOtp.join("");
      if (code !== "123456") errors.otp = "Invalid OTP — demo code is 123456";
    }
    setRegErrors(errors);
    if (!Object.keys(errors).length) setRegStep((s) => s + 1);
  };

  const strengthColors = ["", "#9b2020", "#8a5500", "#b8860b", "#1a6b3a"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

  const switchStaffRole = (r: "admin" | "ticket_manager") => {
    setStaffRole(r);
    setStaffMobile(CREDS[r].m);
    setStaffPw(CREDS[r].p);
  };

  return (
    <div className="flex min-h-screen">
      {/* Brand panel */}
      <div className="flex-1 relative overflow-hidden flex flex-col justify-center px-16 py-12 text-white max-md:flex-none max-md:px-8 max-md:py-8"
        style={{ background: "linear-gradient(150deg,#1a1200,#3d2c0e 60%,#5a4210)" }}>
        <div className="absolute w-[400px] h-[400px] rounded-full pointer-events-none animate-floaty"
          style={{ background: "radial-gradient(circle,rgba(184,134,11,0.4),transparent 70%)", top: -100, right: -100 }} />
        <div className="absolute w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(212,175,55,0.3),transparent 70%)", bottom: -80, left: -80, animation: "floaty 10s ease-in-out infinite reverse" }} />
        <div className="text-[64px] mb-6 relative z-[1] animate-gemPulse">💎</div>
        <h1 className="font-serif text-[54px] text-white relative z-[1] mb-3 max-md:text-[36px]">Aurum Vault</h1>
        <p className="font-serif italic text-[18px] relative z-[1] max-w-[380px] max-md:hidden" style={{ color: "#E8D098" }}>
          Where heritage is measured in carats, and legacy is kept for generations.
        </p>
        <div className="mt-9 relative z-[1] max-md:hidden">
          {["🏆 Certified BIS hallmark appraisals", "🔐 Bank-grade secure asset vault", "🚪 Doorstep appraiser dispatch at your convenience", "📜 Heritage provenance tracking"].map((f) => (
            <div key={f} className="mb-3 text-[14px] flex gap-2.5 items-center" style={{ color: "rgba(255,255,255,0.85)" }}>{f}</div>
          ))}
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-10 overflow-y-auto max-md:p-6">
        <div className="w-full max-w-[400px]">

          {/* LOGIN */}
          {screen === "login" && (
            <>
              <Link href="/" className="inline-flex items-center gap-2 text-[var(--gold)] font-semibold text-[14px] mb-6 cursor-pointer">← Back to home</Link>
              <h2 className="font-serif text-[32px] mb-1">Welcome Back</h2>
              <p className="text-[var(--sec)] text-[14px] mb-6">Sign in to access your vault</p>

              <FormField label="Mobile Number" error={loginErrors.mobile}>
                <PhoneRow inputProps={{ value: loginMobile, onChange: (e) => setLoginMobile(e.target.value), placeholder: "Mobile number" }} error={loginErrors.mobile} />
              </FormField>
              <FormField label="Password" error={loginErrors.pw}>
                <PasswordInput value={loginPw} onChange={setLoginPw} />
              </FormField>
              <Button block onClick={doLogin}>Sign In</Button>
              <div className="text-center my-5 text-[var(--muted)] text-[12px] relative before:content-[''] before:absolute before:left-0 before:top-1/2 before:w-[42%] before:h-px before:bg-[var(--border-color)] after:content-[''] after:absolute after:right-0 after:top-1/2 after:w-[42%] after:h-px after:bg-[var(--border-color)]">
                or
              </div>
              <Button block variant="ghost" onClick={() => setShowOtpLogin(true)}>📱 Sign in with OTP</Button>
              <div className="flex justify-between mt-4 text-[13px]">
                <button onClick={() => setScreen("forgot")} className="text-[var(--gold)] bg-transparent cursor-pointer hover:underline">Forgot Password?</button>
                <button onClick={() => setScreen("register")} className="text-[var(--gold)] bg-transparent cursor-pointer hover:underline">Create Account</button>
              </div>
              <div className="mt-4 text-center">
                <button onClick={() => { setScreen("staff"); switchStaffRole("admin"); }} className="text-[12px] text-[var(--sec)] bg-transparent cursor-pointer hover:text-[var(--gold)]">
                  🛡️ Staff member? Sign in here
                </button>
              </div>
              <div className="mt-4 p-3 rounded-lg text-[11px] text-[var(--sec)] leading-relaxed" style={{ background: "var(--gold-light)" }}>
                <strong>Demo:</strong> Customer 9876543210 / vault123
              </div>
            </>
          )}

          {/* STAFF */}
          {screen === "staff" && (
            <>
              <Link href="/" className="inline-flex items-center gap-2 text-[var(--gold)] font-semibold text-[14px] mb-6 cursor-pointer">← Back to home</Link>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-[1px] uppercase mb-3.5"
                style={{ background: "var(--charcoal)", color: "#D4AF37" }}>🛡️ Secure Operations Hub</span>
              <h2 className="font-serif text-[32px] mb-1">Staff Sign In</h2>
              <p className="text-[var(--sec)] text-[14px] mb-2">Restricted access for administrators and appraisers.</p>
              <p className="text-[var(--muted)] text-[12px] mb-5">🔒 aurumvault.in/staff</p>

              {/* Role toggle */}
              <div className="flex bg-[var(--gold-light)] rounded-xl p-1 mb-6">
                {(["admin", "ticket_manager"] as const).map((r) => (
                  <button key={r} onClick={() => switchStaffRole(r)}
                    className={`flex-1 py-2.5 rounded-[7px] text-[12px] font-semibold transition-all ${staffRole === r ? "bg-white text-[var(--gold)] shadow-[var(--sh-s)]" : "text-[var(--sec)]"}`}>
                    {r === "admin" ? "Administrator" : "Appraiser"}
                  </button>
                ))}
              </div>

              <FormField label="Mobile Number" error={staffErrors.mobile}>
                <PhoneRow inputProps={{ value: staffMobile, onChange: (e) => setStaffMobile(e.target.value) }} error={staffErrors.mobile} />
              </FormField>
              <FormField label="Password" error={staffErrors.pw}>
                <PasswordInput value={staffPw} onChange={setStaffPw} />
              </FormField>
              <Button block onClick={doStaffLogin}>Sign In to Hub</Button>
              <div className="mt-4 text-center">
                <button onClick={() => setScreen("login")} className="text-[12px] text-[var(--sec)] bg-transparent cursor-pointer hover:text-[var(--gold)]">← Customer sign in</button>
              </div>
              <div className="mt-4 p-3 rounded-lg text-[11px] text-[var(--sec)] leading-relaxed" style={{ background: "var(--gold-light)" }}>
                <strong>Demo:</strong> Admin 9000000001 / admin123 · Appraiser 9000000002 / ticket123
              </div>
            </>
          )}

          {/* REGISTER */}
          {screen === "register" && (
            <>
              <button onClick={() => setScreen("login")} className="inline-flex items-center gap-2 text-[var(--gold)] font-semibold text-[14px] mb-6 cursor-pointer bg-transparent">← Back to sign in</button>
              <h2 className="font-serif text-[32px] mb-1">Create Your Vault</h2>
              <StepIndicator className="mt-4 mb-6"
                steps={[{ label: "Details" }, { label: "Verify" }, { label: "2FA" }, { label: "Done" }]}
                current={regStep} />

              {regStep === 1 && (
                <>
                  <h4 className="font-serif text-[18px] mb-4">Personal Details</h4>
                  <FormField label="Full Name" required error={regErrors.name}>
                    <Input value={regData.name} onChange={(e) => setRegData((d) => ({ ...d, name: e.target.value }))} placeholder="e.g. Priya Mehta" error={!!regErrors.name} />
                  </FormField>
                  <FormField label="Mobile Number" required error={regErrors.mobile}>
                    <PhoneRow inputProps={{ value: regData.mobile, onChange: (e) => setRegData((d) => ({ ...d, mobile: e.target.value })), placeholder: "10-digit mobile" }} error={regErrors.mobile} />
                  </FormField>
                  <FormField label="Email" required error={regErrors.email}>
                    <Input type="email" value={regData.email} onChange={(e) => setRegData((d) => ({ ...d, email: e.target.value }))} placeholder="you@email.com" error={!!regErrors.email} />
                  </FormField>
                  <FormField label="Residential Address" required error={regErrors.address}
                    hint="🚪 This address becomes your default point for doorstep appraisal & purity collection.">
                    <Textarea value={regData.address} onChange={(e) => setRegData((d) => ({ ...d, address: e.target.value }))} placeholder="Full address — used as your default dispatch coordinate" error={!!regErrors.address} />
                  </FormField>
                  <FormField label="Master Vault Passcode" required error={regErrors.pw}>
                    <PasswordInput value={regData.pw} onChange={(v) => { setRegData((d) => ({ ...d, pw: v })); checkPwStrength(v); }} />
                    <div className="h-1.5 rounded-sm mt-1.5 overflow-hidden" style={{ background: "var(--border-color)" }}>
                      <div className="h-full transition-all" style={{ width: `${pwStrength * 25}%`, background: strengthColors[pwStrength] }} />
                    </div>
                    <span className="text-[11px] text-[var(--muted)]">{pwStrength ? strengthLabels[pwStrength] + " passcode" : "Use 8+ chars with letters, numbers & symbols"}</span>
                  </FormField>
                  <Button block onClick={regNext}>Continue →</Button>
                </>
              )}

              {regStep === 2 && (
                <>
                  <h4 className="font-serif text-[18px] mb-2">Verify Your Mobile</h4>
                  <p className="text-[var(--sec)] text-[13px] mb-5">Enter the 6-digit code sent to your number. <em>(Demo code: 123456)</em></p>
                  <OTPInput value={regOtp} onChange={setRegOtp} />
                  {regErrors.otp && <p className="text-[var(--red)] text-[12px] text-center mt-2">{regErrors.otp}</p>}
                  <Button block className="mt-5" onClick={regNext}>Verify →</Button>
                  <p className="text-center mt-3.5 text-[13px] text-[var(--muted)]">
                    Didn&apos;t receive it?{" "}
                    <button className="text-[var(--gold)] bg-transparent cursor-pointer" onClick={() => toast("OTP resent", "success")}>Resend</button>
                  </p>
                </>
              )}

              {regStep === 3 && (
                <>
                  <h4 className="font-serif text-[18px] mb-2">Set Up Two-Factor Auth</h4>
                  <p className="text-[var(--sec)] text-[13px] mb-5">Choose how you&apos;d like to secure your vault.</p>
                  <RadioCardGroup cols={1} value={regData.tfa}
                    onChange={(v) => setRegData((d) => ({ ...d, tfa: v }))}
                    options={[
                      { value: "sms", icon: "💬", title: "SMS OTP", desc: "Receive codes via text message" },
                      { value: "email", icon: "📧", title: "Email OTP", desc: "Receive codes via email" },
                      { value: "auth", icon: "🔑", title: "Authenticator App", desc: "Use Google/Microsoft Authenticator" },
                    ]} />
                  <Button block className="mt-5" onClick={regNext}>Continue →</Button>
                </>
              )}

              {regStep === 4 && (
                <div className="text-center py-2">
                  <div className="text-[60px]">🎉</div>
                  <h3 className="font-serif text-[24px] my-2.5">Welcome to Aurum Vault!</h3>
                  <p className="text-[var(--sec)] text-[14px] mb-5">Your secure vault is ready.</p>
                  <div className="text-left p-4 rounded-xl mb-5" style={{ background: "var(--gold-light)" }}>
                    {["Account created & verified", "Two-factor authentication enabled", "Dispatch address saved", "Vault encryption active"].map((l) => (
                      <div key={l} className="mb-2 text-[14px]">✅ {l}</div>
                    ))}
                  </div>
                  <Button block onClick={() => enterPortal("customer")}>Enter Vault →</Button>
                </div>
              )}
            </>
          )}

          {/* FORGOT */}
          {screen === "forgot" && (
            <>
              <button onClick={() => setScreen("login")} className="inline-flex items-center gap-2 text-[var(--gold)] font-semibold text-[14px] mb-6 cursor-pointer bg-transparent">← Back to sign in</button>
              <h2 className="font-serif text-[32px] mb-2">Reset Password</h2>
              <p className="text-[var(--sec)] text-[14px] mb-5">Enter your registered mobile number and we&apos;ll send a reset link valid for 15 minutes.</p>
              <FormField label="Registered Mobile">
                <PhoneRow inputProps={{ value: forgotMobile, onChange: (e) => setForgotMobile(e.target.value), placeholder: "Mobile number" }} />
              </FormField>
              <Button block onClick={() => {
                if (!/^\d{10}$/.test(forgotMobile)) { toast("Enter a valid 10-digit mobile", "error"); return; }
                toast("Reset link sent — valid 15 minutes", "success");
                setTimeout(() => setScreen("login"), 1200);
              }}>Send Reset Link</Button>
            </>
          )}
        </div>
      </div>

      {/* OTP Login Modal */}
      {showOtpLogin && (
        <div className="fixed inset-0 bg-[rgba(26,18,0,0.55)] backdrop-blur-sm z-[1000] flex items-center justify-center p-5" onClick={() => setShowOtpLogin(false)}>
          <div className="bg-white rounded-2xl shadow-[var(--sh-l)] w-full max-w-[400px] p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-[22px] mb-4">Sign in with OTP</h3>
            <p className="text-[var(--sec)] text-[13px] mb-5">A 6-digit code was sent to your mobile. <em>(Demo: 123456)</em></p>
            <OTPInput value={otpLogin} onChange={setOtpLogin} />
            <div className="flex gap-3 justify-end mt-6">
              <Button variant="ghost" size="sm" onClick={() => setShowOtpLogin(false)}>Cancel</Button>
              <Button size="sm" onClick={() => {
                if (otpLogin.join("") === "123456") { setShowOtpLogin(false); enterPortal("customer"); }
                else toast("Incorrect OTP. Try 123456", "error");
              }}>Verify & Sign In</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PasswordInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} placeholder="Enter password" />
      <button type="button" onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] text-[18px] bg-transparent cursor-pointer">
        {show ? "🙈" : "👁"}
      </button>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthContent />
    </Suspense>
  );
}
