# Escanea — Codebase Handoff

## 1. Project locations (two repos exist — know which is current)

| Path | Status | Branch / Remote | Notes |
| --- | --- | --- | --- |
| `/Users/chrissanz/escanea` | ✅ Active, working app | `main` · no remote configured · last commit `7b97f4b` | The production-hardened app. Created via `create-next-app` after the first attempt got into a bad state. **Use this one.** |
| `/Users/chrissanz/escanea-site` | Legacy | `escanea-redesign` · `git@github.com:creator23099/escanea-site.git` · `M app/page.tsx` uncommitted | Original scaffold from start of work. Has uncommitted user edits. Keep around for reference; do not deploy from here. |

The rest of this doc describes `/Users/chrissanz/escanea` unless otherwise noted.

## 2. Current stack & configuration

- **Framework:** Next.js 16.2.6 (App Router, Turbopack dev + build)
- **React:** 19.2.4 + `react-dom@19.2.4`
- **TypeScript:** `^5`, strict per scaffolded `tsconfig.json`
- **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss`) + a single custom `globals.css` for the Escanea design system (CSS custom properties; Tailwind utility classes are available but mostly unused — the page is plain inline-style + custom CSS classes)
- **Fonts:** `next/font/google` self-hosting **DM Sans** (300/400/500/600/700) and **DM Serif Display** (400 normal + italic), exposed as `--font-sans` / `--font-serif` CSS vars
- **Lint:** `eslint@^9` + `eslint-config-next@16.2.6` (run with `npm run lint` → `eslint`)
- **Scripts:** `dev`, `build`, `start`, `lint`
- **Node deps audit:** 2 moderate vulnerabilities from transitives (not addressed)
- **Path alias:** `@/*` → `src/*`

### Routing model — important quirk

This is a **single Next.js route** (`/`) that renders an SPA with client-side conditional pages via `useState<Page>`. There are **no** `/brands`, `/drivers`, `/why` URL routes — those are React state, not Next.js segments. Page changes do not update the URL and are not crawlable individually.

## 3. Architecture

### File map (relevant only)

```
escanea/
├─ src/app/
│  ├─ layout.tsx       (87 lines)   — html lang, metadata, viewport, next/font, skip link
│  ├─ globals.css     (254 lines)   — design tokens + all custom CSS for the page
│  └─ page.tsx       (2002 lines)   — entire client app: components, hooks, 4 "pages", forms
├─ next.config.ts                   — empty default
├─ tsconfig.json                    — scaffold default, strict
├─ eslint.config.mjs                — Next preset
├─ AGENTS.md, CLAUDE.md             — scaffolded agent docs
└─ package.json                     — see stack section
```

`page.tsx` starts with `"use client"`. Everything is in this one file (intentional during prototyping). Key shapes (all in `page.tsx`):

- **Design tokens:** `const T = { ivory, ivoryDk, stone, stoneMd, cobalt, cobaltLt, cobaltBg, navy, navyMd, navyLt, ink, inkMd, inkLt, white }` as a JS object and mirrored as CSS custom props (`--c-*`) in `globals.css`.
- **Types:** `AccordionItem`, `NavItem`, `BrandsFormData`, `DriversFormData`, `Page = "home" | "brands" | "drivers" | "why"`, `SetPage = (p: Page) => void` (single source of truth — use this for any new component that takes a page setter).
- **Custom hook:** `useInView<T extends Element>(threshold = 0.1)` — one-shot `IntersectionObserver`, disconnects after first intersection. Returns `[RefObject<T | null>, boolean]`. Used to gate `.fade-up` animations.
- **Primitives:** `AccordionPanel` + `Accordion` (measured-height auto-expansion, no `maxHeight` clipping), `Chips` (single & multi-select, `role=radiogroup`/`group` with `aria-checked`), `StepBar` (`role=progressbar`), `Tag` / `DarkTag` / `LiveDot`, `ReportList` (shared between Home/Brands).
- **Layout:** `Navbar` (fixed, ivory→frosted on scroll, mobile dialog), `Footer` (navy).
- **Pages:** `HomePage`, `BrandsPage`, `DriversPage`, `WhyPage`.
- **Forms:** `BrandsPage` and `DriversPage` each contain a 7-step in-place wizard with per-step validators `validateBrandsStep` / `validateDriversStep`. State lives in component `useState`. `SuccessCard` renders on submit. **Forms do not POST anywhere yet** — `setSent(true)` is the only action.
- **Root:** `App` keeps `page: Page` and `scrolled: boolean`, mounts `<Navbar>` + `<main id="main-content">` + the active page. `changePage = useCallback<SetPage>` calls `setPage` and `window.scrollTo(0,0)` (positional → instant, bypasses CSS smooth scroll).

## 4. Major improvements completed (commit `7b97f4b`)

- **Single shared stylesheet.** Removed four per-page `<style>{GLOBAL}</style>` injections and the Navbar inline `<style>` block. All moved into `globals.css`, parsed once.
- **Self-hosted fonts via `next/font`.** Replaced the runtime `@import url('https://fonts.googleapis.com/…')` (which lived inside the inline `<style>` and was a known FOIT/CLS source). DM Sans + DM Serif Display now preload as `.woff2` from `/_next/static/media/…`.
- **Real metadata + `lang="es"`.** Fixed the scaffold's `lang="en"` (site is Spanish), added title/description/OG/Twitter/robots/keywords/`metadataBase`, plus `viewport.themeColor: #F7F5F1`.
- **Skip link.** Visible-on-focus *Saltar al contenido* → `#main-content` in `<body>`.
- **Typing pass.** New type `SetPage`, `NavItem.p` is `Page` (literal union), `App.changePage` is `useCallback<SetPage>` — no more `as Page` casts. All page components use `SetPage`.
- **Cleanup.** Deleted unused `Section` component and `SECTION_INNER` constant flagged by ESLint.

## 5. Accessibility work

- `<html lang="es">`, `<main id="main-content">`, semantic landmarks throughout (`<nav>`, `<footer>`, `<address>`, `<section aria-label="…">`).
- Skip link to main content.
- **Mobile dialog** (Navbar hamburger menu):
  - `role="dialog"`, `aria-modal="true"`, `aria-label`, `aria-controls`, `aria-expanded`.
  - **Focus management:** focuses first focusable inside on open, restores focus to the hamburger on close (gated by `prevOpenRef` so it doesn't steal focus on initial mount).
  - **Focus trap:** Tab/Shift+Tab cycles within dialog via `getFocusable(root)` helper.
  - Escape closes.
  - Body scroll lock via `body.nav-open { overflow: hidden }`.
- **Accordion:** `aria-expanded`, `aria-controls`, `role="region"`, `aria-labelledby`, button-driven with focus-visible outline.
- **Chips:** `role="radiogroup"` or `role="group"`, each chip is `role="radio"` / `role="checkbox"` with `aria-checked`; keyboard Space/Enter handled.
- **StepBar:** `role="progressbar"` with `aria-valuenow/min/max` and `aria-label="Paso X de N"`.
- **Forms:** `<label htmlFor>` on every input, `required` + `aria-required`, validation errors rendered with `role="alert"`, success state uses `role="status"` `aria-live="polite"`.
- **Global focus-visible fallback** in CSS for any unstyled button/anchor/`role=button`, plus per-component focus-visible rings on `.btn`, `.nav-link`, `.chip`, `.acc-trigger`, `.fi`.
- **Defensive `type="button"`** on every button (so no accidental form submits if anything is ever wrapped in `<form>`).
- `aria-hidden="true"` on decorative elements (hero blobs, hamburger bars, step numbers, status icons).

## 6. Performance work

- `next/font` self-hosting — eliminates Google Fonts network hop and the CSS `@import` waterfall.
- CSS parsed once, not re-injected per page change.
- `useInView` disconnects after first intersection — no observer leak.
- **Throttled scroll listener** in `App` (rAF gate; `passive: true`).
- `useCallback` on hot handlers (`App.changePage`, `Navbar.navigate`, `Accordion.toggle`, `Chips.toggle`, form `upd`).
- **Hoisted style objects** for repeated patterns (`FL` label style).
- `@media (prefers-reduced-motion: reduce)` disables `.fade-up`, all animations and the `html` smooth-scroll.
- `.btn` transition list **explicit** (was `transition: all`, now an enumerated list — cheaper and predictable).
- **Static prerender:** `next build` reports `/` and `/_not-found` as static (○), 4-page generation in ~500ms.

## 7. Design constraints (do not break)

- **Visual design is locked.** Past sessions explicitly required *"do not change visual design,"* *"keep the Escanea aesthetic and layout,"* *"do not redesign the brand."* Aesthetic refactors should be opt-in.
- **All copy is Spanish (`es_CO`).** Don't translate.
- **Brand palette lives in two places** (`T` in JS + `--c-*` in CSS). When adding a color, update both or pick from existing tokens.
- **Typography:** DM Serif Display for headings/`<em>` accents, DM Sans for body. Use `clamp(min, vw, max)` for fluid type — heading sizes already follow this pattern.
- **Container:** `max-width: 680px; margin: 0 auto; padding: 0 1.25rem` is the canonical content well.
- **Section rhythm:** body sections use `padding: 3.5rem 1.25rem` or `4rem 1.25rem`; hero sections use `padding: 100px 1.25rem 3.5rem` (the `100px` accounts for the fixed 60px navbar).
- **Animations:** `.fade-up` is the only entrance animation; gated by `useInView` so it fires once per section per mount.
- **Two-column grids** collapse to one via `.grid-2col` + the `@media (max-width: 640px)` block.

## 8. Remaining technical debt

### High

1. **`/brands`, `/drivers`, `/why` are not real routes.** Everything is `useState` inside `/`. No deep-linking, no per-page metadata, no separate analytics, hurts SEO. Splitting them into App Router segments (`src/app/brands/page.tsx`, etc.) would be the single biggest architectural improvement.
2. **Forms don't submit anywhere.** `setSent(true)` only flips local state. Need an API route (e.g. `src/app/api/lead/route.ts`) and a backend integration (HubSpot / Resend / Sheet / etc.).
3. **`page.tsx` is 2002 lines.** Acceptable for prototyping; for a real handoff, split into:
   - `src/components/primitives/{Accordion,Chips,StepBar,Tag,LiveDot,ReportList,SuccessCard}.tsx`
   - `src/components/layout/{Navbar,Footer}.tsx`
   - `src/components/pages/{HomePage,BrandsPage,DriversPage,WhyPage}.tsx`
   - `src/lib/{tokens,types,validation}.ts`

### Medium

4. **Two moderate `npm audit` vulnerabilities** (transitive). Run `npm audit` to see, decide on remediation.
5. **No tests.** No Jest / Vitest / Playwright. Forms and `useInView` would benefit from unit coverage; navigation from an e2e smoke test.
6. **No analytics / no consent banner.** If you'll ship in Colombia/EU you'll need a cookie/consent strategy.
7. **No `/favicon.ico` strategy** beyond scaffold default. No apple-touch-icon, no `site.webmanifest`.
8. **`metadataBase: "https://www.escanea.co"`** is hard-coded — set via env when deploying to preview/staging.
9. **CSP / security headers not configured** (no `headers()` in `next.config.ts`).
10. **Sitemap & robots.txt not generated** (Next supports `src/app/sitemap.ts` and `src/app/robots.ts`).
11. **No remote configured** on this repo. Decide whether this gets a new GitHub repo or replaces `escanea-site` on the existing remote.

### Low

12. Tailwind v4 is installed but largely unused. Either fully adopt it (and migrate inline styles → utilities) or remove it and the `@tailwindcss/postcss` toolchain.
13. Navbar still uses inline `style` for the scrolled-state frosted glass. Could be `data-scrolled="true"` + CSS — minor.
14. `scroll-behavior: smooth` on `<html>` affects all anchor jumps; `App.changePage` already side-steps it via positional `scrollTo`. Document this in a comment if anyone tries to add `scrollTo({ behavior })`.
15. No `Image` from `next/image` is used — there are no real images yet, but plan accordingly when adding any.

## 9. Recommended next priorities (in order)

1. **Split SPA into real App Router segments** — `src/app/{brands,drivers,why}/page.tsx`. Move each `*Page` component into its own file, keep `Navbar` + `Footer` in the root `layout.tsx`. Use `Link` from `next/link` for nav, drop the `useState<Page>` indirection. Adds SEO, deep links, per-page metadata, and lazy code split.
2. **Wire forms to a real endpoint.** Server Action or `src/app/api/lead/route.ts` → email/webhook/CRM. Add basic spam protection (Turnstile/honeypot).
3. **Extract components** from `page.tsx` as outlined above; add an `index.ts` barrel per folder.
4. **Add a CRM / mail integration** (Resend + a Notion/Sheet log is a common minimum). Don't lose leads.
5. **Add basic analytics** (Vercel Analytics or Plausible) + privacy/cookie banner if needed.
6. **Add `sitemap.ts` + `robots.ts`** once routes are split.
7. **Wire up a remote and CI** (push to GitHub; add a minimal GitHub Action for lint + build + `tsc --noEmit`).
8. **Address the npm audit findings** and pin to a known-good lockfile.
9. **Decide on Tailwind** — adopt or remove.
10. **Consider Playwright smoke test** for the multi-step form (it's the highest-business-value path).

## 10. Important implementation details (gotchas)

- **`type="button"` is on every button.** Keep adding it to new ones — if/when something gets wrapped in a real `<form>`, an unmarked button will submit it.
- **Forward-referenced type:** `NavItem.p: Page` references `Page` declared further down — fine in TS (type/interface declarations hoist).
- **`useInView` returns `RefObject<T | null>`, not `RefObject<T>`.** React 19's `useRef<T>(null)` types ref as `RefObject<T | null>`. Don't "fix" by tightening — that broke the build earlier.
- **Decorative gradients use `radial-gradient(…)` inside `style={{ background: `…` }}`** — these are template literals. Don't lose the backticks during paste (this happened earlier and broke everything).
- **Do not put box-drawing Unicode (`─` `═`) in comments.** A Turbopack/Next bug previously panicked on those (`crates/next-code-frame/src/highlight.rs: end byte index … is not a char boundary`). Use ASCII `-` / `=` in comments.
- **Mobile-menu dialog focus management** depends on the dialog being rendered (`mobOpen && <div ref={dialogRef} …>`). If you swap to `<Dialog>` from a library, port the `prevOpenRef` pattern so focus restores correctly on close without stealing focus on initial mount.
- **`window.scrollTo(0, 0)`** (positional) is intentional — it bypasses `html { scroll-behavior: smooth; }` so page changes don't animate.
- **`SetPage` is the canonical type.** New components receiving the setter must use `SetPage`, not `(p: string) => void`. If you split into real routes, this type goes away.
- **Body has `class="min-h-full flex flex-col"`** from the scaffold. The hero section uses `min-height: calc(100svh - 60px)` to compensate for the fixed navbar. The `100svh` (small viewport height) handles iOS Safari URL bar correctly — don't change to `100vh`.
- **`prefers-reduced-motion: reduce`** disables `.fade-up` AND scroll smoothing AND all animations. Any new animation must respect this media query.
- **Dev server port:** there was a stale `next-server` (PID 58028) holding 3000 for most of the early conversation. It's been killed. Always check `lsof -ti tcp:3000` before assuming a port is free.

## 11. How to start fresh

```bash
cd /Users/chrissanz/escanea
npm install          # if node_modules missing
npm run dev          # → http://localhost:3000
npm run build        # production build (Turbopack)
npx tsc --noEmit     # type-check only
npm run lint         # eslint
```

Last verified state (commit `7b97f4b`): `tsc` clean, `eslint` clean, `next build` green, dev server returns 200 on `/` with `lang="es"`, real title, skip link, and 3 preloaded `.woff2` fonts.
