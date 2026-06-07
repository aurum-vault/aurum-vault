"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const ROLE_HOME: Record<string, string> = {
  admin: "/admin",
  ticket_manager: "/appraiser",
  customer: "/customer",
};

interface Props {
  children: ReactNode;
  allowedRole: "admin" | "ticket_manager" | "customer";
}

export function AuthGuard({ children, allowedRole }: Props) {
  const { initialized, token, roles } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;
    if (!token) { router.replace("/auth"); return; }
    if (!roles.includes(allowedRole)) {
      const home = Object.entries(ROLE_HOME).find(([r]) => roles.includes(r))?.[1] ?? "/auth";
      router.replace(home);
    }
  }, [initialized, token, roles, allowedRole, router]);

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

  if (!token || !roles.includes(allowedRole)) return null;

  return <>{children}</>;
}