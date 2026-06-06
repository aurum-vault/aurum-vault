import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { AppProvider } from "@/context/AppContext";
import { ToastContainer } from "@/components/ui/Toast";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aurum Vault — Precious Asset Management",
  description:
    "Your family's legacy, vaulted for generations. Premium digital vault for gold, silver, platinum and diamond heirlooms.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Aurum Vault",
  },
};

export const viewport: Viewport = {
  themeColor: "#8A5E0A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="aurum"
      className={`${cormorant.variable} ${dmSans.variable}`}
    >
      <body>
        <AuthProvider>
          <AppProvider>
            {children}
            <ToastContainer />
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
