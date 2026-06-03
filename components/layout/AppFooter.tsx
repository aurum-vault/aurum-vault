import React from "react";

interface AppFooterLink {
  label: string;
  onClick: () => void;
}

interface AppFooterProps {
  links?: {
    vault?: AppFooterLink[];
    services?: AppFooterLink[];
    account?: AppFooterLink[];
  };
}

export function AppFooter({ links }: AppFooterProps) {
  return (
    <footer className="mt-9 border-t border-[var(--border-color)] pt-7">
      <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] gap-7 mb-6 max-sm:grid-cols-2">
        <div className="max-sm:col-span-2">
          <div className="font-serif text-[22px] font-bold text-[var(--charcoal)]">💎 Aurum Vault</div>
          <p className="text-[var(--sec)] text-[13px] mt-2 max-w-[280px] leading-relaxed">
            A private digital vault for your gold, silver, platinum and diamond heirlooms — catalogued, valued and certified, with services delivered to your doorstep.
          </p>
        </div>
        <div>
          <h5 className="text-[11px] tracking-[1.5px] uppercase text-[var(--muted)] font-bold mb-3">Vault</h5>
          {links?.vault?.map((l) => (
            <button key={l.label} onClick={l.onClick} className="block text-[var(--sec)] text-[13px] mb-2 hover:text-[var(--gold)] cursor-pointer bg-transparent text-left">
              {l.label}
            </button>
          ))}
        </div>
        <div>
          <h5 className="text-[11px] tracking-[1.5px] uppercase text-[var(--muted)] font-bold mb-3">Services</h5>
          {links?.services?.map((l) => (
            <button key={l.label} onClick={l.onClick} className="block text-[var(--sec)] text-[13px] mb-2 hover:text-[var(--gold)] cursor-pointer bg-transparent text-left">
              {l.label}
            </button>
          ))}
        </div>
        <div>
          <h5 className="text-[11px] tracking-[1.5px] uppercase text-[var(--muted)] font-bold mb-3">Account</h5>
          {links?.account?.map((l) => (
            <button key={l.label} onClick={l.onClick} className="block text-[var(--sec)] text-[13px] mb-2 hover:text-[var(--gold)] cursor-pointer bg-transparent text-left">
              {l.label}
            </button>
          ))}
        </div>
      </div>
      <div className="border-t border-[var(--border-color)] pt-4 flex justify-between items-center flex-wrap gap-3 text-[var(--muted)] text-[12px]">
        <div>© 2025 Aurum Vault · Heritage secured, certified &amp; vaulted</div>
        <div className="flex gap-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1 bg-[var(--gold-light)] text-[var(--gold)] px-3 py-1 rounded-full text-[11px] font-semibold">
            🔐 AES-256 Encrypted
          </span>
          <span className="inline-flex items-center gap-1 bg-[var(--gold-light)] text-[var(--gold)] px-3 py-1 rounded-full text-[11px] font-semibold">
            🏅 BIS Accredited
          </span>
        </div>
      </div>
    </footer>
  );
}
