Implement the following feature in the Aurum Vault Next.js project: $ARGUMENTS

## Codebase map (read this before touching a file)

**Stack:** Next.js 16, App Router, TypeScript, Tailwind v4, DaisyUI v5, `clsx`

**State:** `context/AppContext.tsx` — single React Context holds the mock DB (`AppDB`), `role`, `toasts`, and helpers (`assetById`, `reportByTicket`, `reportByAsset`, `staffName`). All DB mutations go through `setDb((prev) => ({ ...prev, ... }))`.

**Data & types:**
- `lib/types.ts` — all TypeScript interfaces and union types
- `lib/data.ts` — `INITIAL_DB`, constants (`RATES`, `SVC_TYPES`, `REFURB_RATECARD`, `CREDS`, etc.)
- `lib/utils.ts` — pure helpers: `fmtINR`, `calcMarketValue`, `locIcon`, `catIcon`, `metalIcon`, `statusLabel`, `ticketStatusLabel`, `flowFor`, `nowTs`, `initials`, `generateTicketId`, `generateAssetId`

**Design tokens** (use these CSS vars, never hardcode hex):
- Colors: `--gold`, `--gold-accent`, `--gold-light`, `--charcoal`, `--body-color`, `--sec`, `--muted`, `--green`, `--amber`, `--red`, `--platinum`, `--diamond`
- Borders: `--border-color`, `--border-active`
- Shadows: `--sh-s`, `--sh-m`, `--sh-l`
- Fonts: `font-serif` (Cormorant Garamond), default sans (DM Sans)
- Gold gradient: `bg-gradient-to-br from-[#7a4e08] to-[#b8860b]` or `style={{ background: "linear-gradient(135deg,#7a4e08,#b8860b)" }}`

**Reusable UI components** in `components/ui/` — check these before building new:
- `Button` — variants: `primary` (gold gradient), `ghost` (outlined gold), `danger` (red); sizes: `sm`, `md`, `lg`; props: `block`, `loading`
- `FormField` + `Input`, `Select`, `Textarea`, `PhoneRow`
- `Badge` — variants: `green`, `amber`, `grey`, `red`, `blue`, `gold`; also `AssetStatusBadge`, `TicketStatusBadge`, `PriorityBadge`
- `Card` — base container; `MetricCard` for dashboard KPIs
- `Modal` — `open`, `onClose`, `title`, `footer` props
- `Tabs` — `tabs[]`, `active`, `onChange`
- `Chips` — single-select; `MultiChips` — multi-select
- `StepIndicator` — `steps[]`, `current` (1-indexed)
- `Timeline` — `steps[]` with `state: "done" | "active" | "pending"`
- `RadioCardGroup` — `options[]`, `value`, `onChange`, `cols`
- `OTPInput` — 6-digit with auto-focus
- `UploadZone` + `ImageThumbs`

**Domain components:**
- `components/assets/AssetCard.tsx` — full asset card with image, value, status badge, CTA
- `components/assets/RatesStrip.tsx` — live rates banner
- `components/tickets/TicketWorkPanel.tsx` — appraiser/admin action panel (appraisal entry, repair quote, refurb, loan)

**Layout components:** `Sidebar`, `TopBar`, `MobileNav`, `AppFooter` in `components/layout/`

**Portal routes:**
- `/customer/*` — customer layout in `app/customer/layout.tsx`
- `/admin/*` — admin layout in `app/admin/layout.tsx`
- `/appraiser/*` and `/appraiser/[id]` — appraiser layout in `app/appraiser/layout.tsx`

## Implementation checklist

Before writing any code:
1. Read the relevant existing page/component files to understand the current pattern
2. Check `lib/types.ts` — add new types there, not inline
3. Check `lib/data.ts` — add new constants/mock data there
4. Check `components/ui/` — reuse existing components, don't duplicate

While implementing:
- Every page/component that calls hooks or uses browser APIs needs `"use client"` at the top
- Mutations: `setDb((prev) => ({ ...prev, tickets: [...prev.tickets, newTicket] }))`
- Audit entries: push to `prev.audit` with `nowTs()` for the timestamp
- Toast notifications: call `toast(msg, "success" | "error" | "warn" | "default")` from `useApp()`
- For `params` in dynamic routes, use `const { id } = use(params)` (React 19 `use()`)
- `ex = ticket.extra as Record<string, string | number | boolean | string[]>` for safe extra access

After implementing:
- Run `npm run build` to catch TypeScript errors before reporting done
- Fix any type errors — common ones: `unknown` not assignable to `ReactNode` (cast the `extra` object), unused imports
