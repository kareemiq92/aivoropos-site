> **ملخص بالعربي: شنو هذا الملف وشلون تستخدمه**
>
> هذا الملف هو "البرومت الرئيسي" لبناء البرنامج كامل من الصفر بواسطة وكيل برمجة ذكي (AI coding agent).
> مكتوب بالإنكليزي لأن وكلاء البرمجة يفهمونه بدقة أعلى، ومبني على تقرير البحث `research-desktop-ux-tax-engineering.txt` والبحث السابق `market-research-report.txt`.
> الطريقة: احفظ هذا الملف داخل مستودع المشروع باسم `docs/MASTER_BUILD_PROMPT.md`، وخلي الوكيل يقرأ الأقسام من 0 إلى 26 كمرجع ثابت (المواصفات).
> بعدها الصق له برومت مرحلة وحدة فقط من القسم 27 (Phase 0، ثم Phase 1، وهكذا)، مرحلة بكل جلسة.
> لا تنتقل للمرحلة الجاية إلا بعد ما تتحقق كل "شروط القبول" (Acceptance criteria) وتجرب البرنامج بيدك على ويندوز.
> أي شي مكتوب جنبه **ASSUMPTION** قرار مؤقت لأن البحث ما غطاه؛ راجعه أو غيّره قبل المرحلة اللي تحتاجه.
> كل ما يخص الضرائب والقوانين هنا مو استشارة قانونية؛ تأكد منه مع محاسب قانوني لكل بلد قبل ما تبيع فيه (وخصوصاً العراق، لأن ضرائبه ما انبحثت بعد).
> اسم المنتج "Aivoro Desk" اسم عمل مؤقت، غيّره براحتك.

---

# Aivoro Desk — Master Build Prompt

**Document type:** End-to-end build specification and phased work orders for an AI coding agent.
**Product:** A very lightweight ("light" is defined in §3.2), offline-first desktop business-management app for small businesses worldwide.
**Working name:** Aivoro Desk (ASSUMPTION: rename freely; identifiers below use `aivoro-desk`).
**Spec date:** 2026-11-06. **Spec version:** 1.1 (completeness review applied: report builder, task reminders, screen & task registry, ledger cards, Excel at scale, tax corrections, print data contract, license signer, requirements traceability).

---

## 0. How to use this document

### 0.1 For the human
1. Commit this file to the repository as `docs/MASTER_BUILD_PROMPT.md`.
2. Start every agent session with: *"Read docs/MASTER_BUILD_PROMPT.md sections 0–26, 28 and Appendices A–K. Then execute ONLY Phase N from section 27."*
3. Run phases in order. After each phase, verify the acceptance criteria yourself on a Windows 10 machine before continuing.

### 0.2 Rules of engagement for the AI coding agent
1. Sections 1–26 are the **specification**. Section 27 contains the **work orders** (one phase per session). Section 28 is the **Definition of Done**. Appendices are normative unless marked "example".
2. Execute **one phase only**. Do not start work belonging to a later phase, except stubs/interfaces explicitly requested.
3. Keywords: **MUST** = required; **SHOULD** = default unless a recorded reason exists; **MAY** = optional.
4. When something is unspecified, pick the simplest option consistent with Section 3 (principles), implement it, and record it in `docs/DECISIONS.md` (short ADR: context, decision, consequences). If it is a product/legal/business choice, also add it to `docs/ASSUMPTIONS.md` with the prefix `ASSUMPTION:`.
5. Never add a dependency without: (a) checking its license against Appendix G, (b) recording name/version/license/size impact in `docs/DEPENDENCIES.md`, (c) confirming the bundle/installer budget still holds.
6. Never add a network call to a core feature. Allowed network use is listed in §3.1.
7. All money/tax math lives in the Rust core. The UI never computes authoritative totals.
8. Every phase ends with: all tests green, performance budgets measured (§20), `CHANGELOG.md` updated, a short demo script in `docs/demos/phase-N.md`, and new/changed help-hint copy in both Arabic and English.
9. If a requirement here conflicts with a legal requirement you know of, stop and write the conflict into `docs/ASSUMPTIONS.md` under "Open questions" instead of guessing.
10. Do not invent tax rates, legal thresholds or government document formats. Use data from the country packs (§11.2); unknown values stay empty and are flagged in the UI.
11. Acceptance criteria labelled **HUMAN GATE** need a person (usability tests, timed testers). The agent writes the test script into `docs/demos/phase-N.md`, implements and passes the agent-checkable proxies listed next to the gate, and marks the gate "pending human" — never "passed".
12. Every founder request and every user wish is traced in Appendix K (requirement → spec section → phase → acceptance test id). A phase that touches a traced item updates its row; CI fails if a row has no test id or a test id has no tagged test.
13. Every screen, dialog and task is registered in Appendix H (machine copy: `src/help/registry/{screens,tasks}.json`). A router route without a registry row, banner copy in ar and en, a complete feature list and an F1 page fails CI.

### 0.3 Table of contents
0. How to use · 1. Product vision · 2. Target users · 3. Non-negotiable principles & budgets · 4. Editions & feature flags · 5. Tech stack · 6. Architecture · 7. Folder structure · 8. Data conventions · 9. SQLite data model · 10. Domain engines · 11. Tax engine & compliance · 12. Excel mirroring · 13. Invoice Hub · 14. Payments, accounts & reconciliation · 15. Engineering & contractor module · 16. Official documents & letters · 17. Template designer & theming · 18. Onboarding & help system · 19. Usability rules · 20. Performance budgets & testing · 21. Security, licensing & activation · 22. Backups & data safety · 23. Import & export · 24. Testing strategy · 25. Packaging, signing & updates · 26. Assumptions & open questions · 27. Phased roadmap (sub-prompts) · 28. Definition of Done · Appendices A–K (A keyboard map · B hint copy · C country packs · D events → Excel targets · E posting rules · F glossary · G dependency licenses · H screen & task registry · I print data contract · J license signer · K requirements traceability)

---

## 1. Product vision

**One sentence:** A pay-once, offline desktop app that lets a small business run customers, suppliers, materials, real costing, sales documents, payments, taxes, official letters and contractor billing — and keeps a clean, per-customer Excel copy of everything automatically.

**Why it wins (grounded in research):**
- Users hate subscriptions and forced cloud (QuickBooks Desktop, inFlow migrations). → One-time license, local data.
- Cheap tools compute COGS wrong (no dated cost layers, no landed cost, no FX). → Correct dated, landed, multi-currency costing.
- Xero lacks BOM/bundles; Odoo is expensive and complex; setup is the biggest barrier; Excel import is key. → BOM/recipes, focused modules, 4-step setup, excellent Excel import/paste.
- Big vendors force template redesigns (QuickBooks "modernized" template cannot be edited or reverted since May 2024; Xero refuses to "restore an old experience"). → Templates are never force-migrated.
- Users ask for Excel statements, running balances, configurable aging, per-customer files. → Excel mirror per customer with statement + aging.
- Arabic/bilingual invoicing is weak in mainstream tools. → RTL-first, bilingual documents, amount in words, Hijri dates.
- Keyboard-first entry, paste-from-Excel, compact view and dark mode are recurring unmet requests. → Built in from day one.

**Product promises (use in UI copy and marketing only once implemented):**
1. "Pay once. Your data stays on your computer."
2. "Every invoice, price and payment is also saved to Excel, per customer."
3. "Know your real profit: dated costs, landed costs, currencies."
4. "Your invoice, your design. We never change it without asking."
5. "Core features work offline. Some countries legally require online submission of invoices (optional add-on)."

**Marketing rule (MUST):** a promise or capability may appear in marketing, on the website, at checkout or in the in-app Upgrade screen only after its "Available in" milestone (§4) has shipped.

**"Very light" means** small download, fast start, near-zero idle CPU and no background disk churn — not the smallest possible RAM: the WebView2 runtime sets an idle memory floor of roughly 150–200 MB for any app built on it (§3.2, A31).

---

## 2. Target users & jobs-to-be-done

| Persona | Typical business | Primary jobs | Modules |
|---|---|---|---|
| P1 Shop owner / trader | retail shop, wholesaler, distributor | quote, invoice, cash sale, receive payment, customer statement, stock | Hub, Parties, Items, Prices, Payments, Excel |
| P2 Importer / distributor | imports in USD/EUR, sells in local currency | landed cost, FX, dated purchase prices, margin per customer | Costing, Purchasing, Comparisons |
| P3 Small manufacturer / workshop / kitchen | furniture, food, print shop, metal works | BOM/recipes, assembly, real unit cost | BOM, Costing |
| P4 Service business / freelancer | agency, consultant, maintenance | quotes, recurring invoices, deposits, reminders | Hub, Payments |
| P5 Contractor / engineer / QS | building, MEP, fit-out, civil subcontractor | BoQ, rate build-up, quotation from BoQ, variations, progress billing, retention | Projects (Pro) |
| P6 Office manager | any of the above | official letters, certificates, letter register (العدد/التاريخ) | Letters |
| Secondary: external accountant | — | general ledger, trial balance, VAT summary, AR/AP aging in Excel | Accountant export |

**Markets:** global. Launch languages: Arabic and English (full RTL/LTR). The i18n layer MUST allow adding French, Turkish, Kurdish (Sorani/Kurmanji), Urdu, Spanish later without code changes (ASSUMPTION: next languages chosen by sales data).

**Not targeted (v1):** multi-user over LAN/network, payroll, full POS hardware suite (cash drawer kick and thermal print are supported), large-enterprise ERP, real-time e-invoicing clearance outside the optional add-on. The binding list is §2.1.

### 2.1 Explicit non-goals (do not build; changing this list needs an ADR and founder approval)
- Multi-user over LAN/network, shared company files on network drives, client/server mode.
- Mobile app (phone/tablet), web or cloud version.
- Payroll (salary runs, payslip calculation, social-security filings). `people` exists only for HR certificates and letters.
- Online bank feeds (Open Banking, aggregators, screen scraping). Bank statements are imported from files (§14.7).
- CRM (leads, pipelines, campaigns, marketing email).
- Fiscal/certified POS or cash-register certification in regulated countries (FR, DE, AT, PT, ES, IT, PL, HU, GR, HR, EFD/eTIMS countries — §11.8).
- User-written SQL, a pivot-table engine or a report scripting language (the report builder, §17.10, is column/filter/group based).
- Cell references inside BoQ, takeoff or line-grid cells (arithmetic and safe functions only, §13.5, §15.16).
- **v2 candidates — validate with users before they enter any phase:** serial/batch/expiry tracking; item variants (size/colour matrix).

---

## 3. Non-negotiable principles (with numeric budgets)

### 3.1 Offline-first
- Every core feature MUST work with networking disabled, forever.
- Stated honestly: where a country's law requires online clearance/reporting or certified devices (KSA businesses in a ZATCA Phase-2 integration wave, Jordan, Egypt, Turkey, Malaysia, India above the e-invoice threshold — verify each; §11.7), issuing legally titled tax invoices for those businesses needs the online add-on. The setup wizard and the per-country coverage statement say so; the app never claims "fully offline" for those countries.
- Allowed network uses (all opt-in or user-triggered, all failing gracefully): update check/download; online license activation (offline activation MUST also exist); optional FX-rate fetch; optional VIES/HMRC VAT-ID check; SMTP email sending; optional e-invoicing add-on connectors; opening external links.
- No telemetry. No analytics. No remote fonts, scripts or images. Strict CSP: `default-src 'self'`.

### 3.2 Very lightweight — budgets (MUST be measured every phase, see §20)

| Budget | Target | Hard limit |
|---|---|---|
| Windows NSIS installer, `embedBootstrapper` | ≤ 15 MB | 25 MB (ASSUMPTION: Typst + bundled fonts may push above 15 MB; measure in Phase 0) |
| Offline installer variant (WebView2 offline installer) | ≤ 145 MB | 160 MB |
| Installed size on disk (excl. user data) | ≤ 40 MB | 60 MB |
| Cold start → interactive dashboard (Win10 22H2, 4 GB RAM, SSD) | ≤ 1.5 s | 2.5 s |
| Warm start | ≤ 0.8 s | 1.2 s |
| Idle memory, private bytes summed over app + all `msedgewebview2.exe` children | ≤ 200 MB | 250 MB |
| Peak memory while exporting a 5,000-invoice statement to Excel | ≤ 350 MB | 450 MB |
| Idle CPU | < 1 % | 2 % |
| Keypress → paint in invoice grid (p95) | ≤ 50 ms | 80 ms |
| Item typeahead over 50,000 items (p95) | ≤ 50 ms | 100 ms |
| Save draft / issue invoice DB commit (p95) | ≤ 100 ms | 200 ms |
| Invoice PDF render, 3 pages / 40 lines, warm | ≤ 150 ms | 400 ms |
| Template designer preview refresh after last edit | ≤ 300 ms | 600 ms |
| Per-customer Excel rebuild, ~50k cells | ≤ 1 s | 2 s |
| Master report rebuild: one month of the `large` fixture (`constant_memory`) | ≤ 5 s | 10 s, within the peak-memory hard limit |
| Initial Excel mirror build, `large` fixture (20k parties), idle-priority background | ≤ 20 min, keypress p95 unchanged ±10 % | 45 min (ASSUMPTION; measure in Phase 7) |
| Excel folder size on disk, `large` fixture | ≤ 1× company file size | 2× (ASSUMPTION; measure) |
| Company file size per 100k documents (avg 8 lines, incl. audit) | ≤ 350 MB | 500 MB (ASSUMPTION; measure) |
| Backup on close (blocks exit) | ≤ 3 s, otherwise deferred (§22) | never > 3 s |
| Background backup of the `large` fixture (SSD) | ≤ 60 s, no UI stutter | 120 s |
| Total backup disk use | ≤ 5 GB or 10 % of free space, whichever is smaller (configurable) | — |
| Memory with 10 tabs open (`large` fixture) | ≤ 280 MB | 350 MB |
| Memory while minimized ≥ 60 s (WebView2 `MemoryUsageTargetLevel = Low`) | ≤ 150 MB | 200 MB (ASSUMPTION; measure in Phase 0) |
| Initial JS (shell + dashboard) / each screen chunk | ≤ 150 KB gz / ≤ 60 KB gz | 200 KB / 90 KB gz (ASSUMPTION; measure) |
| Cold start on Ref-HDD (4 GB RAM, HDD, Core i3 ~2015; §20.1) | ≤ 3 s | 4 s (gated) |
| Scrolling a 100,000-row list | ≥ 50 fps, no blank rows > 100 ms | — |
| Data scale with all budgets intact (ASSUMPTION) | 250k documents, 2M lines, 50k items, 20k parties | — |

Design rules that protect the budgets: one main window with in-app tabs (each extra OS window adds WebView renderer processes); virtualize every list > 500 rows; paginate in SQL; no polling loops (scheduler wakes at most once per minute); pre-create the main window hidden and show it when the UI signals ready (no white flash).

**What "very lightweight" means (A31).** Light = small download (installer ≤ 15 MB), fast cold start (also on HDD machines), near-zero idle CPU, no background disk churn (Excel and backups are debounced and capped), and small per-screen code. It does **not** mean the smallest possible RAM: every WebView2 app (like every Electron app) has an idle memory floor of roughly 150–200 MB (the research measured ~142 MB for a minimal app). The founder accepts this floor (A31); if not, the Avalonia + NativeAOT fallback (§5.4) stays open and is decided at the Phase 0 go/no-go.

### 3.3 One-time license
- Starter ≈ $49, Pro ≈ $99–129 (founder pricing; ASSUMPTION for exact numbers). Sold via a Merchant of Record (Lemon Squeezy preferred; Paddle alternative).
- The installed version works forever. Updates within the purchased major version are included; the next major version is a paid upgrade after 12 months (ASSUMPTION from prior research).
- 14-day full-feature trial (ASSUMPTION from prior research).
- The app MUST NEVER block viewing, exporting or backing up the user's own data, whatever the license state.

### 3.4 Data ownership
- One SQLite file per company is the source of truth. The schema is documented in `docs/SCHEMA.md`.
- Every record can be exported (CSV/XLSX/JSON). Excel mirror is always on (configurable folder).
- Issued legal documents are immutable and hash-chained; nothing is silently deleted.

### 3.5 Keyboard-first
- Every action reachable by keyboard; every frequent action has a shortcut shown in menus, tooltips and the command palette (Appendix A).
- Line grids behave like a spreadsheet (arrows, Enter, Tab, paste multi-row from Excel).
- Shortcuts are bound by **physical key** (`KeyboardEvent.code`, e.g. `KeyC`, `BracketRight`), never by the produced character (`event.key`), so Ctrl/Alt shortcuts keep working with Arabic, Kurdish, Persian or French layouts (on an Arabic layout Ctrl+] / Ctrl+[ would otherwise produce Arabic letters). Menus and tooltips show the key label of the active layout. E2E test with the Arabic keyboard layout active (Phase 1).
- In RTL grids, arrow keys move **visually** (← goes to the cell on the screen's left, in RTL and LTR alike); Tab/Shift+Tab follow **logical** order (start → end). Acceptance test in both directions.

### 3.6 RTL + LTR, i18n
- Full mirroring with `dir="rtl"` and CSS logical properties (no `left/right` in CSS except where deliberately physical).
- Numbers, amounts, IBANs, codes, emails and invoice numbers are LTR-isolated (`<bdi>` / `unicode-bidi: isolate`).
- Numerals setting: Latin (default) or Arabic-Indic, per user for UI and per template for print.
- All UI strings come from message catalogs (`ar.json`, `en.json`); no hard-coded strings. The `ar` catalog is plain **Modern Standard Arabic** (it works in every Arabic market and on official printouts); an optional regional overlay (e.g. `ar-IQ.json`) may override UI strings with dialect, never printed labels (A30).
- Message format ("ICU-lite") = an in-house formatter of about 150 lines (`src/lib/i18n/format.ts`), no ICU library: `{name}` interpolation; plurals `{n, plural, zero{…} one{…} two{…} few{…} many{…} other{…}}` resolved with `Intl.PluralRules` (Arabic uses all six forms); `{amount, money}` (display decimals supplied by the core per currency); `{date, date}` / `{date, date, long}` via `Intl.DateTimeFormat` with the user's calendar and date-format settings. An unknown placeholder renders as `{name}` in dev builds and fails the i18n test.
- Every user-facing label that can appear on a printed document is stored with translations (`{ "ar": "...", "en": "..." }`).

### 3.7 Never force changes on the user
- Templates, saved views, numbering series and settings are never migrated in a way that changes their output. New designs ship as new gallery entries.
- UI layout changes between versions MUST keep shortcuts stable; any removed shortcut is a breaking change requiring an ADR.

### 3.8 Correctness over cleverness
- Money: integer minor units; decimals via `rust_decimal`; never binary floats.
- Every posting is balanced (enforced in code and checked nightly).
- Every aging table sums exactly to the closing balance (assert; refuse export on mismatch).

### 3.9 Accessibility
- WCAG 2.2 AA: visible focus ring ≥ 2 px (2.4.7), focused element never hidden under sticky headers (2.4.11), targets ≥ 24×24 CSS px (2.5.8), contrast ≥ 4.5:1 text / 3:1 large text & UI borders.
- Status is never conveyed by colour alone (1.4.1): every status chip, badge and warning carries an icon and text.

### 3.10 Permissive dependencies only
- Allowed: MIT, Apache-2.0, BSD-2/3, ISC, Zlib, MPL-2.0 (file-level, unmodified), OFL-1.1 (fonts), Unicode-3.0. Forbidden: GPL, AGPL, LGPL (static), SSPL, "non-commercial" licenses, Polyform Noncommercial. See Appendix G for the explicit deny list (Handsontable, Intro.js, Shepherd.js ≥ 14, EPPlus, ofxtools, ofxstatement, beancount library, AG Grid Enterprise, QuestPDF).

---

## 4. Editions & feature flags

Feature gating is implemented with `feature_enabled(code)` in the core (license tier + module toggle). The UI hides disabled modules entirely (no greyed-out clutter), except a single "Upgrade" entry in Settings → License.

| Capability | Trial | Starter | Pro | Add-on | Available in |
|---|---|---|---|---|---|
| Customers, suppliers, items, units, categories | ✓ | ✓ | ✓ | | MVP (P2) |
| Dated & scoped prices (party / price list / all) | ✓ | ✓ | ✓ | | MVP (P3) |
| Quotes, invoices, cash sales, credit notes, receipts | ✓ | ✓ | ✓ | | MVP (P4, P6) |
| Payment accounts (cash/bank/card/e-wallet), allocations, statements, AR aging | ✓ | ✓ | ✓ | | MVP (P6) |
| Cards (بطاقات): account card, item card, party card (§14.10) | ✓ | ✓ | ✓ | | MVP (P6) |
| Report builder: built-in reports, column chooser, sort, filter, saved layouts, PDF/XLSX (§17.10) | ✓ | ✓ | ✓ | | MVP (P6) |
| Plain-language Profit & Loss, Balance sheet, cash-flow summary | ✓ | ✓ | ✓ | | MVP (P6) |
| Excel mirror: folder per customer (invoices, prices, statements, PDFs) + monthly master reports + activity log | ✓ | ✓ | ✓ | | MVP (P7) |
| Gallery templates, brand colors, logo, bilingual, dual-currency total line, pay-to account | ✓ | ✓ | ✓ | | MVP (P5) |
| Appearance: 8 preset themes, accent / brand colour, advanced colour overrides, density, text scale (§17.9) | ✓ | ✓ | ✓ | | MVP (P1) |
| Single tax regime (one country pack), tax-inclusive/exclusive; countries sold at MVP per A34 | ✓ | ✓ | ✓ | | MVP (P4) |
| Import wizard (Excel/CSV), paste from Excel | ✓ | ✓ | ✓ | | MVP (P3) |
| Simple stock (quantities, average cost) | ✓ | ✓ | ✓ | | MVP (P6) |
| Purchasing: basic bills, expenses, supplier payments | ✓ | ✓ | ✓ | | MVP (P6) |
| Letters-lite: outgoing/incoming registers + 8 templates (§16.5) | ✓ | ✓ | ✓ | | MVP (P8b) |
| Base currency + one extra currency (documents, accounts, FX gain/loss) (ASSUMPTION, A3) | ✓ | ✓ | ✓ | | v1 (P10) |
| Unlimited currencies, period-end revaluation | ✓ | — | ✓ | | v1 (P10) |
| Purchasing: PO, goods receipt, partial/merged bills, supplier advances | ✓ | — | ✓ | | v1 (P10) |
| FIFO dated cost layers, landed cost | ✓ | — | ✓ | | v1 (P10) |
| Engineering tables & calculators (§15.16) | ✓ | ✓ | ✓ | | v1 (P10b) |
| BoQ-lite: 1–2-level BoQ → quotation → invoice, percent progress invoices (§15.17) | ✓ | ✓ | ✓ | | v1 (P10b) |
| BOM / recipes / assembly, cost roll-up | ✓ | — | ✓ | | v1 (P11) |
| Comparisons & analytics | ✓ | basic | ✓ | | v1 (P11) |
| Sales orders, delivery notes, proformas, deposits, partial conversion | ✓ | — | ✓ | | v1 (P12) |
| Recurring invoices, reminders, scheduled monthly statements | ✓ | ✓ | ✓ | | v1 (P12) |
| Installment / credit selling schedules (A32) | ✓ | ✓ | ✓ | | v1 (P12) |
| Quick sale (F12), cash sessions (X/Z), thermal receipt printing (ESC/POS) | ✓ | ✓ | ✓ | | v1 (P12) |
| Barcode labels (Code128 / EAN-13) | ✓ | ✓ | ✓ | | v1 (P12) |
| Branches & multiple numbering series per branch | ✓ | — | ✓ | | v1 (P12) |
| Report builder: grouping, charts, branded report headers | ✓ | — | ✓ | | v1 (P13) |
| Full template designer: free placement, any colour, pre-printed paper & cheques, custom fonts, custom fields | ✓ | — | ✓ | | v1 (P13) |
| Country-pack set, VAT return, e-invoice export (UBL/Peppol BIS, CII, Factur-X, XRechnung) | ✓ | VAT return only | ✓ | | v1 (P14) |
| Bank statement import & reconciliation | ✓ | — | ✓ | | v1 (P15) |
| Accountant export pack (GL, TB, Xero/QB formats) | ✓ | GL+TB only | ✓ | | v1 (P15) |
| Official letters full catalog (~40), signers, stamp permission | ✓ | ✓ | ✓ | | v1 (P16) |
| Projects & contracting (BoQ, progress billing, retention) | ✓ | — | ✓ | | v1 (P17) |
| E-invoicing online connectors (ZATCA Phase 2, Peppol AP) — separate signed download | — | — | — | paid add-on | v2 (P20) |

ASSUMPTION: the exact Starter/Pro split above is a proposal; the founder may move items. Keep gating data-driven (`assets/editions.json`, which also carries `available_in` per capability).
**Marketing rule (MUST):** the website, checkout page, EULA feature list and in-app Upgrade screen list only capabilities whose "Available in" milestone has shipped; the Upgrade screen hides unreleased rows. The Starter (MVP) release therefore does not advertise recurring invoices, reminders, Quick sale/thermal printing, the full letters catalog, comparisons or the accountant export.

---

## 5. Tech stack

### 5.1 Chosen stack
| Layer | Choice | Why (research) |
|---|---|---|
| Desktop shell | **Tauri 2.x** (latest stable at start), NSIS installer | Installers 10–100× smaller than Electron (1.05 MB vs 106.1 MB; 2.5 vs 85 MB; 8.6 vs 244 MiB). WebView2 ships with Windows 10 (1803+) and 11. Several offline POS/invoicing apps for Arabic markets already ship this way. |
| Core | **Rust** (stable) | In-process SQLite, Excel, PDF; no runtime to ship. |
| UI | **Svelte 5 + TypeScript + Vite** (SolidJS acceptable alternative; ASSUMPTION: Svelte chosen) | Small bundles, fast, no heavy UI kit. Chromium-grade Arabic shaping/bidi via WebView2 makes RTL and theming cheap. |
| IPC typing | `tauri-specta` / `specta` (generate TS bindings from Rust) (ASSUMPTION) | One source of truth for command/DTO types. |
| Database | **SQLite via `rusqlite`** (`bundled`, `backup`), WAL, `foreign_keys=ON`, STRICT tables, migrations via `rusqlite_migration` (ASSUMPTION) | Native, synchronous, microsecond queries; never WASM SQLite in the webview (WebKit CPU spin). |
| Decimal math | `rust_decimal`, `iso_currency` | Exact money, ISO 4217 exponents. |
| Excel write | `rust_xlsxwriter` (MIT/Apache); `zip` + `quick-xml` for the zip-level cell patch of client files (§15.12) | 3.8× faster than Python XlsxWriter; Tables, autofilter, total rows, protection, custom properties, `constant_memory` mode. |
| Excel/ODS read | `calamine` (MIT) | Reads xls/xlsx/xlsb/ods; ~9× faster than openpyxl. |
| PDF | **Typst embedded** via `typst-as-lib` (Apache-2.0), `typst-pdf`; preview via `typst-render` (PNG) **only** — one preview path, no `typst-svg`. Package download (the `ureq`-based package fetcher) and Typst's embedded default fonts are **disabled**; the Typst World serves only virtual files plus bundled fonts/assets (§17.1) | Same output on all OSes, offline, RTL via `lang: "ar"`, ~22 ms warm for a 3-page/40-line invoice (independent benchmark). Tauri has no official print API and `window.print()` silently does nothing on macOS. |
| QR | `qrcode` crate | ZATCA TLV, EPC/SEPA, Swiss QR-bill, URL QR. |
| Thermal | own ESC/POS module (raster `GS v 0`), `image` crate (minimal features) | Most thermal printers have no Arabic font; render 576/384-dot 1-bit raster. |
| Email | `lettre` on the shared TLS stack below + OS keychain via `keyring` | SMTP with PDF attachments; secrets never in SQLite. |
| HTTP / TLS | **One** stack shared by updater, activation, FX fetch, VIES/HMRC checks and SMTP: `rustls` with the `ring` provider (or Windows schannel via `native-tls`); never `aws-lc-rs`; one HTTP client crate (ASSUMPTION: chosen by ADR in Phase 0) | Two TLS stacks would add MBs to the installer. |
| Windows APIs | `windows` crate: `ReplaceFileW`, `MoveFileExW`, Restart Manager (`RmGetList`), Simple MAPI | Atomic Excel replace, name the process locking a file, "open in mail app". |
| File watching | `notify` | Detect Excel `~$` owner file disappearing. |
| Hashing / signing | `sha2`, `ed25519-dalek`; canonical JSON = RFC 8785 (JCS), in-house (~100 lines) or a permissive crate (verify) | Hash chain, signed license tokens, country packs and numbering sidecars. |
| Coach-mark highlight | **Driver.js** (MIT, ~5 kB gz), lazy-loaded | Tiny, zero deps. Banners/hints are in-house components. |
| Charts | **uPlot** (MIT), lazy-loaded | Very small; S-curves, sales trends, report charts. |
| Barcodes | a permissive crate for Code128 / EAN-13 (e.g. `barcoders` — verify license and size) | Item labels (§17.11), rendered to PNG for Typst and to raster for ESC/POS. |
| Rich text (letters) | in-house minimal editor over a JSON AST (§16.5), ≤ 30 KB gz; no editor library above 30 KB gz | Safe and small. |
| Grid | **custom virtualized grid** (in-house, ~1.5k LoC) | Full control of keyboard map, RTL, paste; fallback: RevoGrid or Tabulator (MIT). Never Handsontable/AG Grid. |
| Command palette | in-house (~200 LoC) | Ctrl+K and Ctrl+Shift+P. |
| Tauri plugins | updater, dialog, fs (scoped), opener, notification, single-instance, window-state, process | Minimal capability set. |
| Fonts | **UI:** system Segoe UI (Windows 10/11 ship Arabic glyphs; Segoe UI Variable where present) — no bundled UI font unless the Phase 0 spike shows Arabic rendering problems. **Print (bundled, subset, OFL):** exactly one Arabic family (Noto Naskh Arabic or Amiri) and one Latin family (Noto Sans or Inter), regular + bold only (ASSUMPTION) | Never depend on system fonts for documents; never ship unused weights. |

### 5.2 Rust release profile (MUST)
```toml
[profile.release]
codegen-units = 1
lto = true          # "thin" if CI runs out of memory
opt-level = "s"     # try "z" and measure
panic = "abort"
strip = true
```
Disable unused default features on `tauri` and every plugin. Use Tauri ≥ 2.4 unused-command removal. Measure the size cost of Typst + fonts in Phase 0.

**Size ledger (MUST).** `docs/SIZE.md` lists every Rust crate's and every asset's contribution to the installer, measured with `cargo bloat --release --crates` plus the installer delta of each asset folder, and is updated whenever a dependency or asset changes. CI fails a pull request that grows the installer by more than 300 KB unless the PR adds an ADR justifying it. Required cuts:
- (a) Typst without package download and without embedded default fonts; one preview path (PNG).
- (b) One HTTP/TLS stack (above).
- (c) System UI font; only the print fonts are bundled (one Arabic + one Latin family, regular + bold).
- (d) ZATCA Phase-2 crypto (XAdES, ECDSA) and Peppol connectors ship as a **separate, signed, downloadable add-on**, never in the base installer.
- (e) F1 help pre-rendered to HTML with its search index built at build time (no Markdown parser or indexer at runtime).
- (f) uPlot, Driver.js, the template designer, the report chart view and the BoQ editor are lazy-loaded chunks.

### 5.3 Platforms
- **Windows 10 1803+ / Windows 11, x64**: primary (MVP).
- **macOS 11+ universal**: second (v2). Expect WKWebView CSS differences; PDFs are unaffected (Typst).
- **Linux AppImage/.deb**: "beta" only (WebKitGTK performance reports).
- **Windows 7/8.1: not supported** (WebView2 stopped at 109).
- WebView2 delivery: `webviewInstallMode = embedBootstrapper` by default; publish an "Offline installer" variant with `offlineInstaller` for air-gapped/LTSC machines. Detect missing WebView2 and show a native message box, never a blank window.

### 5.4 Fallbacks
- **Fallback 1 — Electron** (trigger: macOS rendering differences or printing gaps become blocking, e.g. customers demand silent printing to a named printer on all OSes). The whole Svelte UI carries over; expose the Rust core via `napi-rs`. Accept 85–110 MB installers and similar Windows RAM.
- **Fallback 2 — Avalonia 12 + NativeAOT** (if the team switches to C#, or if the founder rejects the WebView2 RAM floor, A31): ~13–25 MB installer, ~0.6 s cold start (blog figures); ClosedXML (MIT) for Excel, Microsoft.Data.Sqlite. Never EPPlus; check any .NET PDF library license (QuestPDF is not free above $1M revenue).
- **Rejected:** egui/Slint (unverified Arabic shaping/bidi; Slint free tier requires attribution), Flutter desktop (documented text-selection and Windows screen-reader gaps), PySide6+Nuitka (60–100 MB, LGPL onefile doubts), WinUI 3 (Windows-only), Wails v3 (beta), Neutralino (thin ecosystem).

---

## 6. Architecture

```
┌──────────────────────── UI (Svelte 5 in WebView2) ─────────────────────────┐
│ AppShell: top-centered nav bar · Universal Search (hero) · tabs · chips    │
│ Screens (per module) · DataGrid · DocumentEditor · TemplateDesigner        │
│ Help layer: ScreenBanner · TaskHint · EmptyState · Checklist · Driver.js   │
└──────────────── invoke(command, dto) ▲ listen(event) ──────────────────────┘
                                       │ Tauri IPC (typed via specta)
┌──────────────────────────── Rust core (one process) ───────────────────────┐
│ api/       command handlers: auth/permission check → validate → service    │
│ services/  Company, Party, Item, Price, Document, Payment, Tax, Inventory,  │
│            Project, Letter, Template, Import, Export, Help, License        │
│ engines/   money, pricing, tax, costing, bom, numbering, posting,          │
│            allocation, statement, aging, conversion, progress_billing      │
│ db/        DbActor (single writer thread, BEGIN IMMEDIATE) + 2 read conns   │
│ workers/   ExcelMirror · Renderer(Typst) · Scheduler · Backup · Mailer ·   │
│            EInvoiceOutbox · IntegrityCheck                                 │
│ events/    domain events → UI events (e.g. doc.issued, excel.locked)       │
└────────────────────────────────────────────────────────────────────────────┘
Files (local):
  %LOCALAPPDATA%\AivoroDesk\app.db            (per Windows user: profiles, prefs, hint_state, numbering high-water marks)
  %ProgramData%\AivoroDesk\machine.db         (machine-wide: license, shared-company registry, printer calibration)
  <data root>\companies\<slug>.adb             (SQLite company file; brand assets and fonts stored inside as BLOBs)
  <data root>\companies\<slug>.hwm             (signed numbering high-water-mark sidecar, §10.5)
  <data root>\attachments\<sha256>             (content-addressed attachments)
  %LOCALAPPDATA%\AivoroDesk\logs\             (rolling, local only)
  <data root> = %LOCALAPPDATA%\AivoroDesk      ("only this Windows user", default)
             or %ProgramData%\AivoroDesk       ("all Windows users of this PC"; folder ACL grants local Users Modify)
User-visible (configurable). <user root> = Documents\Aivoro Desk, or %USERPROFILE%\Aivoro Desk
when Documents is redirected into OneDrive/Dropbox/Google Drive (§12.6):
  <user root>\Excel\<Company>\...             (Excel mirror)
  <user root>\Backups\<Company>\...           (backups, §22)
  <user root>\PDF\<Company>\...               (exported PDFs)
```

**Write path (MUST):** command → permission check → validation (returns field-level i18n errors) → `BEGIN IMMEDIATE` → domain rows + `audit_log` + `export_outbox` (+ `jobs` if needed) → `COMMIT` → emit domain event → workers react. No business operation waits for Excel, PDF or email.

**Read path:** read connections (WAL) for lists/reports; paginated (`LIMIT/OFFSET` or keyset) queries; heavy reports run in a worker and stream results.

**Error model:** `AppError { code: "DOC_PERIOD_LOCKED", message_key, params, field_path? }`. The UI maps `message_key` to localized text. Never show raw SQL or Rust errors to users; log them.

**Company files:** one company open per window session; "Switch company" closes and reopens. Opening a company file located on a network share or inside a cloud-sync folder MUST show a warning (SQLite + network/sync = corruption risk) and offer "Move to a safe local folder".

**Users on one PC:** local profiles in `app.db`; per-company membership with role and optional PIN (argon2id). Roles: owner, manager, accountant, sales, cashier, viewer. Owner-only data (cost, margin) is filtered in the core, not just hidden in the UI. Multi-user over LAN is out of scope (§2.1).
- **Profile picker:** when the opened company has more than one active member, a profile picker (names, initials, PIN pad if set) appears before the dashboard; with one member the company opens directly. "Switch user" sits in the title-bar menu; auto-lock after N idle minutes returns to the picker.
- **Owner recovery:** creating a company generates a one-time **recovery code** (Base32, 20 characters), shown once and printed as a "Keep this sheet safe" PDF; only its argon2id hash is stored (`company.owner_recovery_hash`). Entering it resets the owner PIN and is audited. Without it a forgotten owner PIN cannot be bypassed.
- **Several Windows users:** the setup wizard asks "Who uses this company on this PC?" → *Only me* (data root under `%LOCALAPPDATA%`) or *Everyone with a Windows account on this PC* (data root under `%ProgramData%\AivoroDesk`, ACL set on creation). Settings → Data → "Share with other Windows users" moves an existing company. The license lives in machine-wide `machine.db`, so a second Windows user does not use up an activation. If `%ProgramData%` is not writable (locked-down PC), machine data falls back to `app.db` and the license then counts per Windows user.

**Background workers** run on their own threads with bounded queues; at most one Excel write and one PDF render at a time to keep memory flat.

**WebView2 runtime settings (MUST; applied at window creation through the WebView2 settings Tauri exposes):**
- `AreBrowserAcceleratorKeysEnabled = false` — disables browser handling of F5 / Ctrl+R reload, Ctrl+P (Chromium print), Ctrl+F (find), Ctrl+N / Ctrl+Shift+N (new window), Ctrl+± / Ctrl+0 (zoom) and Ctrl+Shift+I; the keys still reach the app's own shortcut registry.
- `IsGeneralAutofillEnabled = false`, `IsPasswordAutosaveEnabled = false`, `AreDefaultContextMenusEnabled = false` (the app draws its own context menus), `AreDevToolsEnabled = false` in release builds, `IsPinchZoomEnabled = false`, `IsZoomControlEnabled = false`, `IsStatusBarEnabled = false`, `IsSwipeNavigationEnabled = false`.
- `MemoryUsageTargetLevel = Low` when the window is minimized or the user has been idle for more than 5 minutes; back to `Normal` on restore or input.
- In-app tabs are capped at about 12 (opening a 13th offers to close the oldest unpinned tab); a tab inactive for more than 5 minutes unmounts its view (state stays in stores and restores instantly).
- Acceptance: F5 and Ctrl+R never reload the app; Ctrl+P never opens the Chromium print dialog (it runs the app's Print command); right-click shows only the app's menu.

---

## 7. Repository & folder structure

```
aivoro-desk/
├─ apps/desktop/
│  ├─ src-tauri/
│  │  ├─ Cargo.toml · tauri.conf.json · capabilities/*.json · build.rs
│  │  └─ src/
│  │     ├─ main.rs · lib.rs
│  │     ├─ api/            # one file per module: parties.rs, documents.rs, ...
│  │     ├─ services/
│  │     ├─ engines/        # money.rs, pricing.rs, tax/, costing/, posting.rs, ...
│  │     ├─ db/
│  │     │  ├─ actor.rs · read_pool.rs · repo/*.rs
│  │     │  └─ migrations/  # 0001_init.sql, 0002_..., never edited after release
│  │     ├─ commands/       # command registry: permission, Excel targets or #[no_excel(reason)]
│  │     ├─ excel/          # outbox.rs, worker.rs, atomic_win.rs, lockcheck_win.rs, sync_detect_win.rs,
│  │     │                  # xlsx_patch.rs (zip-level cell patch, §15.12), books/*.rs
│  │     ├─ reports/        # catalog runner, layouts, report queries (§17.10)
│  │     ├─ render/         # typst_world.rs, compiler.rs (fixed template + JSON data), print_contract.rs,
│  │     │                  # hitboxes.rs, fonts.rs, qr.rs, barcode.rs, richtext.rs, tafqeet.rs, hijri.rs,
│  │     │                  # thermal_escpos.rs
│  │     ├─ import/         # csv.rs, xlsx.rs, ofx.rs, camt053.rs, mt940.rs, qif.rs, mapping.rs
│  │     ├─ einvoice/       # ubl.rs, cii.rs, facturx.rs, zatca_qr.rs, validators.rs
│  │     ├─ jobs/           # scheduler.rs, recurring.rs, reminders.rs, backup.rs, integrity.rs
│  │     ├─ license/        # token.rs (ed25519 verify), activation.rs, trial.rs
│  │     └─ util/
│  ├─ src/                  # Svelte UI
│  │  ├─ app/               # AppShell, router, tabs, palette, shortcuts registry
│  │  ├─ lib/components/    # DataGrid, ScreenBanner, TaskHint, EmptyState, Checklist,
│  │  │                     # StatusChip, MoneyInput, DateInput, PartyPicker, ItemPicker, ...
│  │  ├─ lib/ipc/           # generated bindings (do not edit)
│  │  ├─ lib/i18n/          # loader, formatters (Intl), numerals
│  │  ├─ lib/theme/         # tokens.css, palette.ts (OKLCH), density.css
│  │  ├─ screens/           # dashboard/, hub/, parties/, items/, prices/, payments/,
│  │  │                     # inventory/, bom/, projects/, letters/, reports/, settings/
│  │  ├─ help/hints.catalog.json · help/conditions.ts · help/registry/{screens,tasks}.json (Appendix H)
│  │  └─ locales/ar.json (Modern Standard Arabic) · en.json · ar-IQ.json (optional UI overlay)
├─ assets/
│  ├─ fonts/                # subset OFL fonts + LICENSE files
│  ├─ templates/gallery/    # *.json template schemas (Classic, Modern, ...)
│  ├─ country-packs/        # *.json (signed in release) + index.json (sale status per country, A34)
│  ├─ reports/catalog.json  # built-in report definitions (§17.10)
│  ├─ eng-tables/*.json     # built-in engineering tables (§15.16)
│  ├─ print-contract/*.schema.json   # print data contract (Appendix I)
│  ├─ letters/lite/*.json   # the 8 Letters-lite templates with fields_json (§16.5)
│  ├─ editions.json         # gating + available_in per capability
│  └─ sample/demo.adb       # generated by scripts/gen-demo
├─ docs/  MASTER_BUILD_PROMPT.md · DECISIONS.md · ASSUMPTIONS.md · DEPENDENCIES.md · SIZE.md ·
│         SCHEMA.md · PERF.md · APPENDIX_D.md (generated) · TRACEABILITY.md · LICENSE_SIGNER.md ·
│         help/{ar,en}/*.md · demos/
├─ services/license-signer/   # serverless signer + offline activation page (Appendix J), deployed separately
├─ tests/ golden/{tax,pdf,excel}/ · e2e/ · perf/ · fixtures/ · injection/
├─ scripts/ gen-fixtures.rs · gen-demo.rs · gen-appendix-d.rs · check-registry.ts · check-traceability.ts ·
│           measure-perf.ps1 · check-size.ps1 · license-audit.sh
└─ .github/workflows/ ci.yml · release.yml
```

---

## 8. Data conventions (MUST)

| Concern | Rule |
|---|---|
| Primary keys | `id INTEGER PRIMARY KEY` + `uid TEXT NOT NULL UNIQUE` (UUIDv7) on every business table. `uid` is used in Excel hidden `_id`, exports and imports. |
| Money | `*_minor INTEGER` in the row's currency minor units. Exponent from `currencies.minor_unit`. Base-currency copies are `*_base_minor`. |
| Non-money decimals | `TEXT` canonical decimal strings parsed by `rust_decimal`: qty (scale ≤ 4; engineering ≤ 6), unit price (≤ 6), FX rate (≤ 10), percentages (≤ 4). |
| Display & calc decimals | Storage stays in ISO minor units (`currencies.minor_unit`). `currencies.calc_decimals` (pack-set; e.g. IQD = 0 although its ISO exponent is 3) is the precision of **document math**: line nets, tax, totals and allocations are rounded at `calc_decimals`, so every stored amount is a multiple of 10^(minor_unit − calc_decimals) minor units and printed lines always add up to the printed total. `display_decimals` (normally = `calc_decimals`) only formats. |
| Dates | `TEXT 'YYYY-MM-DD'` for business dates; timestamps `TEXT` ISO-8601 UTC with ms. Display in local time zone. Optional Hijri display (Umm al-Qura). |
| Audit columns | `created_at, created_by, updated_at, updated_by, row_version INTEGER NOT NULL DEFAULT 1` (incremented on update; used for optimistic concurrency and Excel `_rowver`). |
| Deletion | Master data: `archived_at` (soft). Issued documents: never deleted; `void`. Drafts: hard delete allowed (audited). |
| Enums | `TEXT` + `CHECK(... IN (...))`. |
| Booleans | `INTEGER` 0/1 + `CHECK`. |
| Tables | `STRICT`; `foreign_keys=ON`; every FK indexed. |
| Translatable labels | `name` (primary language) + `name_secondary` for business data; JSON `*_i18n` (`{"ar":"…","en":"…"}`) for system labels (accounts, tax names, template labels). |
| Custom fields | definitions in `custom_fields`; values in a `custom_json` column on the owner row. |
| Canonical JSON | RFC 8785 (JCS) for every hashed or signed payload (document hashes, license tokens, numbering sidecars). |
| Personal data | Columns holding personal data are tagged `pii` in `docs/SCHEMA.md`; they are exported per party on request and anonymized after retention (§21.3). Full card numbers are never stored. |
| Pragmas | `journal_mode=WAL`, `synchronous=FULL`, `foreign_keys=ON`, `busy_timeout=5000`, `temp_store=MEMORY`. If the company file is in a synced folder by user choice: `journal_mode=TRUNCATE` (never WAL). |

---

## 9. SQLite data model

Notation: compact DDL. Every business table also has the audit columns from §8 unless marked `(no audit)`. `→ table` means a foreign key. Write the real migrations in `db/migrations/` and document them in `docs/SCHEMA.md`. Indexes listed are the minimum.

### 9.1 App database (`app.db`) — per Windows user, independent of companies
```sql
app_meta(key TEXT PRIMARY KEY, value TEXT)                              -- (no audit)
profiles(uid TEXT PRIMARY KEY, display_name TEXT NOT NULL, created_at TEXT)
user_ui_prefs(
  profile_uid TEXT PRIMARY KEY → profiles,
  help_level TEXT CHECK(help_level IN ('guided','standard','expert')) DEFAULT 'guided',
  show_screen_banners INTEGER DEFAULT 1, show_task_hints INTEGER DEFAULT 1,
  density TEXT CHECK(density IN ('comfortable','compact')) DEFAULT 'comfortable',
  theme_mode TEXT CHECK(theme_mode IN ('system','light','dark','black','high_contrast')) DEFAULT 'system',
  accent_hex TEXT, use_brand_accent INTEGER DEFAULT 0,
  theme_json TEXT,                                          -- preset id + advanced colour overrides (§17.9)
  font_scale INTEGER DEFAULT 100 CHECK(font_scale BETWEEN 90 AND 150),
  ui_font TEXT DEFAULT 'system',                            -- 'system' (Segoe UI) or a bundled family
  bold_text INTEGER DEFAULT 0, reduced_motion INTEGER DEFAULT 0,
  task_reminder_mode TEXT CHECK(task_reminder_mode IN ('always','smart','off')) DEFAULT 'always',  -- A28, §18.4
  date_format TEXT, first_day_of_week INTEGER CHECK(first_day_of_week BETWEEN 0 AND 6),
  ui_lang TEXT, numerals TEXT CHECK(numerals IN ('latn','arab')) DEFAULT 'latn',
  enter_key_moves TEXT CHECK(enter_key_moves IN ('next_field','down')) DEFAULT 'next_field',
  hints_reset_at TEXT, last_seen_app_version TEXT)
hint_state(
  profile_uid TEXT NOT NULL, hint_id TEXT NOT NULL,
  seen_count INTEGER NOT NULL DEFAULT 0, first_seen_at TEXT, last_seen_at TEXT,
  collapsed INTEGER NOT NULL DEFAULT 0,
  dismissed_forever INTEGER NOT NULL DEFAULT 0, dismissed_version INTEGER, dismissed_at TEXT,
  snoozed_until TEXT, task_completed_count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(profile_uid, hint_id))
recent_companies(path TEXT PRIMARY KEY, display_name TEXT, last_opened_at TEXT, is_demo INTEGER DEFAULT 0)
series_hwm(company_uid TEXT, series_key TEXT,  -- 'doc:<series_id>' | 'pay:<series_id>' | 'letter:<register_id>' | 'zatca_icv:<egs>'
  last_value INTEGER NOT NULL, last_number TEXT, last_hash TEXT, updated_at TEXT,
  PRIMARY KEY(company_uid, series_key))       -- numbering high-water marks (§10.5)
```
Hint state lives here (not in the company file) so restoring a backup or switching company never resets tips, and several people on one PC keep their own state.

**Machine database (`%ProgramData%\AivoroDesk\machine.db`) — shared by all Windows users of the PC (§6):**
```sql
license(id INTEGER PRIMARY KEY CHECK(id=1), key_hash TEXT, tier TEXT, licensee TEXT,
        instance_id TEXT, token TEXT, token_sig TEXT, token_kid TEXT, activated_at TEXT,
        updates_until TEXT, trial_started_at TEXT, last_checked_at TEXT)
shared_companies(path TEXT PRIMARY KEY, display_name TEXT, created_by_sid TEXT, created_at TEXT)
printer_calibrations(printer_name TEXT, template_uid TEXT NOT NULL DEFAULT '*',  -- '*' = all templates
  dx_mm TEXT DEFAULT '0', dy_mm TEXT DEFAULT '0',
  PRIMARY KEY(printer_name, template_uid))     -- pre-printed paper / cheque offsets (§17.4)
```

### 9.2 Company database (`<slug>.adb`)

**A. Company, settings, users**
```sql
company(id INTEGER PRIMARY KEY CHECK(id=1), legal_name, legal_name_secondary, trade_name,
  country_code, region_code, base_currency → currencies, primary_lang, secondary_lang,
  fiscal_year_start_month INTEGER DEFAULT 1, country_pack_id, country_pack_version,
  lock_date TEXT, time_zone TEXT,                          -- IANA, e.g. 'Asia/Baghdad'
  default_paper TEXT CHECK(default_paper IN ('A4','Letter','A5')),
  owner_recovery_hash TEXT,                                -- argon2id of the printed recovery code (§6)
  phone, email, website, logo_asset_id → asset_blobs, custom_json)
company_tax_ids(id, scheme, value, is_primary)           -- VAT, TRN, TIN, CR, ...
company_tax_registrations(id, scheme TEXT,               -- 'vat','gst','sales_tax','excise', ...
  registered INTEGER NOT NULL CHECK(registered IN (0,1)), number TEXT,
  effective_from TEXT, effective_to TEXT NULL)           -- §11.4: not registered → no VAT, no "Tax Invoice"
company_addresses(id, kind, building_no, street, additional_no, district, city, region,
  postal_code, country_code, line_free)
settings(key TEXT PRIMARY KEY, value_json TEXT, updated_at, updated_by)
modules(code TEXT PRIMARY KEY, enabled INTEGER, enabled_at)  -- inventory,costing,bom,projects,
                                                             -- bank_rec,einvoice,letters,multi_currency,branches
branches(id, uid, code UNIQUE, name, name_secondary, address_json, is_default)
members(profile_uid TEXT PRIMARY KEY, role TEXT CHECK(role IN
  ('owner','manager','accountant','sales','cashier','viewer')), pin_hash TEXT,
  permissions_json TEXT, disabled_at)
people(id, uid, name, name_secondary, national_id, job_title, department, hire_date, end_date,
  salary_minor, currency, nationality, custom_json,
  anonymized_at TEXT)                                     -- HR certificates only; no payroll; owner/manager
                                                          -- roles only; never mirrored to Excel (§21.3)
```

**B. Currencies & FX**
```sql
currencies(code TEXT PRIMARY KEY, minor_unit INTEGER, calc_decimals INTEGER, display_decimals INTEGER,
  symbol, name_i18n TEXT, active INTEGER)                  -- (no audit); calc_decimals per §8
fx_rates(currency → currencies, rate_date TEXT, kind TEXT CHECK(kind IN ('commercial','tax')) DEFAULT 'commercial',
  rate_to_base TEXT, source TEXT CHECK(source IN
  ('manual','import','online','central_bank','ecb','hmrc_period')),
  PRIMARY KEY(currency, rate_date, kind))                 -- 'tax' rates feed tax_fx_rate (§11.3 step 8)
```

**C. Parties (customers & suppliers in one table)**
```sql
parties(id, uid, code TEXT UNIQUE, kind CHECK(kind IN ('person','company')),
  is_customer INTEGER, is_supplier INTEGER, name, name_secondary, lang,
  default_currency, payment_terms_days INTEGER, credit_limit_minor INTEGER,
  price_list_id → price_lists, sale_template_id → doc_templates,
  default_tax_treatment CHECK(default_tax_treatment IN
    ('domestic','reverse_charge','export','exempt','intra_eu','out_of_scope')),
  wht_rate_id → tax_rates, peppol_id, parent_party_id → parties,   -- consolidated statements
  excel_mirror INTEGER NOT NULL DEFAULT 1,               -- 0 for the auto-created "Walk-in customer" (§12.7)
  notes, custom_json, archived_at, anonymized_at)
  INDEX(name), INDEX(is_customer, archived_at), INDEX(is_supplier, archived_at)
party_tax_ids(id, party_id → parties, scheme, value, is_primary, verified_at, verification_source)
addresses(id, party_id → parties, kind CHECK(kind IN ('billing','shipping','site')),
  building_no, street, additional_no, district, city, region, postal_code, country_code, line_free)
contacts(id, party_id → parties, name, role, phone, whatsapp_e164, email, is_primary)
party_exemption_certs(id, party_id, cert_no, jurisdiction, valid_from, valid_to, asset_id)
```

**D. Units, items, warehouses**
```sql
uoms(code TEXT PRIMARY KEY, name_i18n, decimals INTEGER,  -- UN/ECE Rec 20: C62,H87,KGM,MTR,MTK,MTQ,LTR,HUR,DAY,SET...
  export_code TEXT)            -- code used in e-invoices; packaging units use UN/ECE Rec 21 X-prefixed codes
                               -- (e.g. XBX box, XPK pack) — verify whether a plain 'BX' is accepted by Peppol
uom_conversions(id, item_id → items NULL, from_uom, to_uom, factor TEXT)  -- NULL item = global
item_categories(id, parent_id → item_categories, name, name_secondary)
items(id, uid, code TEXT UNIQUE, barcode, kind CHECK(kind IN
  ('stock','non_stock','service','kit','manufactured','labour','plant')),
  name, name_secondary, description, category_id, base_uom, sales_uom, purchase_uom,
  tax_class CHECK(tax_class IN ('standard','reduced','zero','exempt','out_of_scope')),
  costing_method CHECK(costing_method IN ('fifo','average')), track_stock INTEGER,
  allow_negative INTEGER DEFAULT 1, reorder_level TEXT, weight_kg TEXT, volume_m3 TEXT,
  income_account_code → accounts NULL, cogs_account_code → accounts NULL,
  expense_account_code → accounts NULL, inventory_account_code → accounts NULL,  -- NULL = default rule (§10.6)
  custom_json, archived_at)
  INDEX(barcode), INDEX(name)
item_codes(item_id, scheme CHECK(scheme IN ('HS','HSN','SAC','UNSPSC','SAT','GTIN','CUSTOM')), code)
item_aliases(item_id, alias)                              -- search synonyms, Arabic spellings
item_search(fts5 virtual table over code, barcode, name, name_secondary, aliases)
warehouses(id, uid, code, name, branch_id, is_default)
```

**E. Dated & scoped prices**
```sql
price_lists(id, uid, name, kind CHECK(kind IN ('sale','purchase')), currency,
  price_mode CHECK(price_mode IN ('excl','incl')), is_default)
prices(id, uid, item_id → items, uom, direction CHECK(direction IN ('sale','purchase')),
  scope CHECK(scope IN ('all','price_list','party')),
  price_list_id → price_lists NULL, party_id → parties NULL,
  min_qty TEXT DEFAULT '0', price TEXT NOT NULL, currency,
  price_mode TEXT NOT NULL CHECK(price_mode IN ('excl','incl')),   -- is tax included in this price? (§10.2)
  valid_from TEXT NOT NULL, valid_to TEXT NULL, note,
  CHECK((scope='party') = (party_id IS NOT NULL)),
  CHECK((scope='price_list') = (price_list_id IS NOT NULL)))
  INDEX(item_id, direction, scope, party_id, price_list_id, valid_from DESC)
```

**F. Inventory & costing**
```sql
stock_moves(id, uid, item_id, warehouse_id, move_date, qty TEXT,        -- signed, base uom
  kind CHECK(kind IN ('receipt','issue','transfer_in','transfer_out','adjust',
                      'production_in','production_out','opening')),
  document_id → documents, document_line_id, project_id NULL,
  unit_cost_base TEXT NULL, created_at)
  INDEX(item_id, warehouse_id, move_date)
cost_layers(id, item_id, warehouse_id, source_move_id → stock_moves, layer_date,
  qty_in TEXT, qty_remaining TEXT, unit_cost_doc TEXT, doc_currency, fx_rate TEXT,
  unit_cost_base TEXT, landed_added_base TEXT DEFAULT '0')
  INDEX(item_id, warehouse_id, layer_date)
cost_consumptions(id, issue_move_id → stock_moves, layer_id → cost_layers, qty TEXT, unit_cost_base TEXT)
item_avg_cost(item_id, warehouse_id, qty_on_hand TEXT, avg_cost_base TEXT, updated_at,
  PRIMARY KEY(item_id, warehouse_id))
landed_cost_vouchers(id, uid, bill_document_id → documents, basis CHECK(basis IN
  ('value','qty','weight','volume','manual')), status CHECK(status IN ('draft','applied','reversed')))
landed_cost_allocations(id, voucher_id, receipt_move_id, layer_id, amount_base_minor)
cost_adjustments(id, item_id, adj_date, amount_base_minor, reason, journal_id)  -- recost results
```

**G. BOM / recipes**
```sql
boms(id, uid, output_item_id → items, version INTEGER, name, output_qty TEXT, output_uom,
  labour_cost_base TEXT DEFAULT '0', overhead_pct TEXT DEFAULT '0',
  valid_from, valid_to, is_default, status CHECK(status IN ('draft','active','archived')))
bom_lines(id, bom_id → boms, component_item_id → items, qty TEXT, uom, waste_pct TEXT, sort)
```
Assembly is a document (`doc_type='ASSEMBLY'`) that issues components and receives the output.

**H. Documents (one table for all sales, purchase and stock documents)**
```sql
number_series(id, doc_type, branch_id NULL, prefix, pattern TEXT,   -- '{PREFIX}-{YYYY}-{SEQ:5}'
  next_value INTEGER, reset CHECK(reset IN ('never','yearly')), current_period TEXT, is_default)
documents(id, uid,
  doc_type TEXT CHECK(doc_type IN ('QUOTE','PROFORMA','SALES_ORDER','DELIVERY_NOTE','INVOICE',
    'CASH_SALE','DEPOSIT_INVOICE','PROGRESS_INVOICE','RETENTION_INVOICE','CREDIT_NOTE','DEBIT_NOTE',
    'PURCHASE_ORDER','GOODS_RECEIPT','BILL','SUPPLIER_CREDIT','EXPENSE',
    'STOCK_ADJUSTMENT','STOCK_TRANSFER','ASSEMBLY','OPENING_BALANCE')),
  direction CHECK(direction IN ('sale','purchase','internal')),
  series_id → number_series, number TEXT NULL,             -- NULL until issued
  state CHECK(state IN ('draft','issued','void')),
  payment_state CHECK(payment_state IN ('na','unpaid','partial','paid','overpaid')),
  fulfilment_state CHECK(fulfilment_state IN ('na','open','partial','complete')),
  credit_state CHECK(credit_state IN ('none','partial','full')),
  party_id → parties, branch_id, warehouse_id, project_id → projects NULL,
  doc_date, supply_date, due_date, expires_on,
  tax_point_date TEXT,                                     -- VAT period assignment (§11.6); pack `tax_point_rule`
  currency, fx_rate TEXT, price_list_id, price_mode CHECK(price_mode IN ('excl','incl')),
  tax_fx_rate TEXT, tax_fx_source TEXT CHECK(tax_fx_source IN
    ('doc','central_bank','ecb','hmrc_period','manual')),  -- rate behind tax_local_minor (§11.3 step 8)
  dual_currency TEXT NULL, dual_fx_rate TEXT NULL,          -- optional "total in a second currency" line (§17.2)
  pay_to_account_code → accounts NULL,                      -- account the customer pays into; printed (§14.3)
  salesperson_profile_uid TEXT NULL,
  sent_at TEXT, sent_channel TEXT CHECK(sent_channel IN ('email','whatsapp','print','other')),
  rounding_mode CHECK(rounding_mode IN ('line','category')),
  rounding_method CHECK(rounding_method IN ('half_up','half_even')),
  tax_treatment, place_of_supply, emirate_code,           -- pack-driven extra fields
  lang_primary, lang_secondary, reference, subject, notes, terms, internal_notes,
  doc_discount_pct TEXT, doc_discount_minor INTEGER,
  subtotal_minor, discount_minor, charges_minor, tax_minor, wht_minor, rounding_minor,
  total_minor, payable_minor, total_base_minor, tax_local_minor,
  paid_minor, balance_minor,                               -- caches, verified nightly
  retention_minor, advance_recovery_minor,
  original_doc_id → documents NULL, reason_code, reason_text,   -- credit/debit notes
  party_snapshot_json TEXT, seller_snapshot_json TEXT,       -- frozen at issue; Excel, exports, PDFs and hashes use these
  template_id, template_version, pdf_sha256, pdf_asset_id,
  issued_at, issued_by, voided_at, voided_by, void_reason,  -- void/credit never change hashed content
  content_hash TEXT,                                         -- §11.5; chained via document_events
  country_pack_version, einvoice_status, custom_json,
  UNIQUE(series_id, number))
  INDEX(doc_type, state, doc_date), INDEX(party_id, doc_date), INDEX(project_id)
document_lines(id, uid, document_id → documents, line_no,
  line_kind CHECK(line_kind IN ('item','text','section','subtotal','deposit_deduction',
                                'retention','advance_recovery','progress')),
  item_id NULL, description, description_secondary, qty TEXT, uom, unit_price TEXT,
  discount_pct TEXT, discount_minor, net_minor, tax_minor, total_minor,
  tax_code TEXT,                                          -- tax_rate code or tax_group code
  account_code → accounts NULL,                           -- required on non-stock BILL/EXPENSE lines (§10.6)
  input_tax_recoverable_pct TEXT DEFAULT '100',           -- purchases: recoverable share of input tax (§14.6)
  progress_pct_to_date TEXT NULL,                         -- BoQ-lite percent progress invoices (§15.17)
  cost_base TEXT,                                         -- owner-only snapshot at issue
  price_source TEXT,                                      -- e.g. 'party:12@2026-03-01'
  source_line_id → document_lines NULL,                   -- conversion lineage
  boq_node_id NULL, sov_line_id NULL, warehouse_id, custom_json, sort)
  INDEX(document_id), INDEX(source_line_id), INDEX(item_id)
document_charges(id, document_id, kind CHECK(kind IN ('allowance','charge')), reason,
  reason_code, amount_minor, tax_category, tax_rate TEXT)    -- EN 16931 BG-20/BG-21
document_line_taxes(line_id, tax_rate_id, rate_snapshot TEXT, category_code, compound_seq,
  base_minor, amount_minor, is_withholding INTEGER)
document_tax_summary(document_id, category_code, rate TEXT, base_minor, amount_minor,
  amount_local_minor, exemption_code, exemption_text)       -- EN 16931 BG-23
document_links(from_doc_id, to_doc_id, link_type CHECK(link_type IN ('converted',
  'applies_deposit','credits','debits','progress_of','retention_release_of','landed_cost_of')),
  created_at, PRIMARY KEY(from_doc_id, to_doc_id, link_type))
document_installments(document_id → documents, seq INTEGER, due_date TEXT, amount_minor INTEGER,
  paid_minor INTEGER DEFAULT 0, PRIMARY KEY(document_id, seq))   -- instalment/credit selling (A32, §13.13)
document_events(id INTEGER PRIMARY KEY, seq INTEGER UNIQUE NOT NULL,   -- ONE global integrity chain per company file
  entity_type TEXT CHECK(entity_type IN ('document','letter')), entity_uid TEXT,
  kind TEXT CHECK(kind IN ('issue','void','credit','debit','letter_issue','letter_void')),
  at TEXT, by_profile TEXT, reason TEXT, number TEXT, content_hash TEXT,
  prev_hash TEXT, hash TEXT)                                  -- (no audit; append-only triggers) §11.5
editor_autosave(document_uid TEXT PRIMARY KEY, payload_json, saved_at)   -- crash recovery
recurring_profiles(id, uid, template_document_id, rule CHECK(rule IN
  ('weekly','monthly','quarterly','yearly')), interval INTEGER, day_of_period INTEGER,
  next_run_date, end_date, auto_issue INTEGER DEFAULT 0, active INTEGER)
recurring_runs(profile_id, occurrence_date, document_id, PRIMARY KEY(profile_id, occurrence_date))
reminders_log(id, document_id, level INTEGER, channel, sent_at)
```

**I. Tax**
```sql
tax_categories(code TEXT PRIMARY KEY,   -- S,Z,E,AE,K,G,O,L,M (UNCL5305)
  name_i18n, recoverable INTEGER, needs_exemption_reason INTEGER)
tax_rates(id, code TEXT UNIQUE, country, region NULL, name_i18n, category_code → tax_categories,
  rate TEXT, kind CHECK(kind IN ('vat','gst','sales','excise','levy','withholding')),
  compound INTEGER, applies_to CHECK(applies_to IN ('sale','purchase','both')),
  valid_from, valid_to NULL, return_box_sale, return_box_purchase,
  account_code → accounts, source CHECK(source IN ('pack','user')),
  source_url TEXT, verified_by TEXT, verified_at TEXT)   -- mandatory for pack rates in verified packs (App. C.2)
tax_groups(id, code TEXT UNIQUE, name_i18n)
tax_group_members(group_id, tax_rate_id, seq, compound_on_previous INTEGER)
exemption_reasons(code TEXT PRIMARY KEY, text_i18n, legal_ref, vatex_code)
tax_periods(id, period_start, period_end, basis CHECK(basis IN ('invoice','cash')),
  status CHECK(status IN ('open','filed','locked')), filed_at, return_snapshot_json)  -- invoice basis: by tax_point_date
country_packs(id, country, version, sha256, signature_ok INTEGER, installed_at, json)
```

**J. Accounts, payments, allocations, journal**
```sql
accounts(code TEXT PRIMARY KEY, parent_code, name_i18n, kind CHECK(kind IN
  ('asset','liability','equity','income','expense')),
  subtype CHECK(subtype IN ('cash','petty_cash','bank','processor','ewallet','ar','ap','tax_in',
    'tax_out','deposits','retention_recv','retention_pay','advances_supplier','inventory','fx',
    'fees','equity','retained_earnings','income','expense','cogs','rounding','opening','other')),
  currency NULL, is_payment_account INTEGER, fee_pct TEXT, fee_fixed_minor INTEGER,
  payment_means_code TEXT,                                  -- UNCL4461: 10,30,42,48,58,59...
  bank_name, iban, account_no, fixed INTEGER, archived INTEGER, sort INTEGER)
journal(id, uid, entry_date, memo, source_type, source_id, ref,   -- ref e.g. 'invoice:42'
  reversed_by_id → journal NULL, posted_at, posted_by)
journal_lines(id, journal_id → journal, account_code → accounts, party_id NULL, project_id NULL, branch_id NULL,
  debit_minor INTEGER NOT NULL DEFAULT 0, credit_minor INTEGER NOT NULL DEFAULT 0,
  currency, amount_fx_minor, fx_rate TEXT, line_memo,
  CHECK(debit_minor >= 0 AND credit_minor >= 0 AND (debit_minor = 0 OR credit_minor = 0)))
  INDEX(account_code, journal_id), INDEX(party_id)
payments(id, uid, series_id → number_series, number TEXT NULL,  -- receipt / payment voucher no., gapless, assigned on post
  direction CHECK(direction IN ('in','out')),
  kind CHECK(kind IN ('normal','deposit','refund','transfer')),
  party_id NULL, pay_date, account_code → accounts, to_account_code NULL,   -- transfers
  method CHECK(method IN ('cash','bank_transfer','card','cheque','ewallet','other')),
  currency, amount_minor, fx_rate TEXT, base_amount_minor,
  fee_minor DEFAULT 0, fee_account DEFAULT '6100',
  to_amount_minor NULL,                                      -- cross-currency transfer
  reference, cheque_no, cheque_bank, cheque_due_date,
  cheque_direction CHECK(cheque_direction IN ('in','out')) NULL,
  cheque_status CHECK(cheque_status IN ('received','deposited','cleared','bounced',   -- incoming
                                        'issued','presented','cancelled')) NULL,      -- outgoing (+ cleared, bounced)
  card_last4 TEXT CHECK(card_last4 IS NULL OR length(card_last4)=4), card_auth_code TEXT,
  terminal_ref TEXT,                                           -- never a full card number (§21.3)
  memo, cash_session_id → cash_sessions NULL,
  state CHECK(state IN ('posted','void')), journal_id, unallocated_minor)
allocations(id, source_type CHECK(source_type IN ('payment','credit_note','deposit','withholding_cert')),
  source_id, document_id → documents, amount_minor, base_at_doc_rate_minor,
  base_at_pay_rate_minor, fx_diff_base_minor, alloc_date, journal_id)
  INDEX(document_id), INDEX(source_type, source_id)
withholding_certs(id, party_id, cert_no, cert_date, amount_minor, currency, asset_id)
cash_sessions(id, uid, register TEXT, opened_by, opened_at, opening_float_minor INTEGER,
  closed_by NULL, closed_at NULL, expected_minor NULL, counted_minor NULL, difference_minor NULL,
  journal_id NULL)                                             -- Quick sale X/Z reports and day close (§13.11)
```

**K. Bank reconciliation**
```sql
bank_import_profiles(id, account_code, name, format CHECK(format IN ('csv','ofx','qfx','qif','camt053','mt940')),
  mapping_json, date_format, decimal_sep, encoding, sign_mode)
bank_imports(id, account_code, file_name, file_sha256 UNIQUE, format, imported_at,
  stmt_from, stmt_to, stmt_open_minor, stmt_close_minor, profile_id)
bank_lines(id, import_id, account_code, txn_date, value_date, amount_minor, description, payee,
  ext_id, dedupe_key TEXT UNIQUE, status CHECK(status IN ('new','matched','created','ignored')),
  payment_id NULL, journal_id NULL, matched_at)
bank_rules(id, account_code NULL, match_field, match_type CHECK(match_type IN
  ('contains','equals','starts','regex')), match_text, set_account_code, set_party_id,
  set_tax_code, priority, active)
reconciliations(id, account_code, statement_date, statement_balance_minor, app_balance_minor,
  difference_minor, status CHECK(status IN ('in_progress','finished')), finished_at)
```

**L. Engineering tables (all editions, no module flag) and projects (module `projects`)**
```sql
eng_tables(id, uid, name_i18n, columns_json, rows_json, source_note TEXT NOT NULL,
  is_builtin INTEGER)                                          -- §15.16; built-ins are read-only, copy to edit
projects(id, uid, code UNIQUE, name, customer_id → parties, site_address, currency,
  contract_type CHECK(contract_type IN ('lump_sum','remeasure','cost_plus','time_and_materials')),
  classification CHECK(classification IN ('NRM2','POMI','CESMM4','MasterFormat','UniFormat','custom')),
  billing_mode CHECK(billing_mode IN ('percent','quantity')),
  tax_profile TEXT CHECK(tax_profile IN ('standard','reverse_charge_construction','exempt','zero_export')),  -- §11.9
  retention_pct_work TEXT, retention_pct_materials TEXT, retention_cap_pct TEXT,
  retention_release_1_pct TEXT, advance_amount_minor, advance_recovery_pct TEXT,
  payment_terms_days, certification_days, rounding_policy CHECK(rounding_policy IN
  ('round_line_then_sum','sum_then_round')), start_date, end_date,
  status CHECK(status IN ('tender','active','completed','closed','lost')))
boq_versions(id, project_id, label, kind CHECK(kind IN ('tender','contract','revision')),
  parent_version_id NULL, locked_at NULL)
boq_nodes(id, uid, version_id → boq_versions, parent_id → boq_nodes NULL, sort_key TEXT,
  node_type CHECK(node_type IN ('section','item','text_note','subtotal')),
  item_kind CHECK(item_kind IN ('measured','prelim','provisional_defined','provisional_undefined',
    'pc_sum','daywork','contingency','lump')) NULL,
  ref, class_code, description, description_secondary, unit, qty TEXT, rate TEXT,
  amount_minor, rate_buildup_id NULL, tax_code, origin_vo_id NULL, client_row_ref TEXT)
  INDEX(version_id, parent_id, sort_key)
takeoff_lines(id, boq_node_id, location, drawing_ref, description, times TEXT, dim1 TEXT,
  dim2 TEXT, dim3 TEXT, formula_text, sign INTEGER CHECK(sign IN (-1,1)), waste_pct TEXT, qty_result TEXT)
rate_buildups(id, uid, name, unit, output_per_unit TEXT, overhead_pct TEXT, profit_pct TEXT, risk_pct TEXT)
rate_buildup_lines(id, buildup_id, kind CHECK(kind IN ('material','labour','plant','subcontract','other')),
  item_id NULL, description, qty_per_unit TEXT, waste_pct TEXT, unit_cost TEXT,
  cost_source CHECK(cost_source IN ('live_layer','snapshot')), snapshot_date)
variations(id, uid, project_id, vo_no, title, instruction_ref, raised_on,
  status CHECK(status IN ('proposed','submitted','approved','rejected','disputed')),
  claimed_minor, approved_minor, time_ext_days)
variation_lines(id, vo_id, boq_node_id NULL, description, unit, qty_delta TEXT, rate TEXT, amount_minor)
sov_lines(id, project_id, boq_node_id NULL, vo_line_id NULL, ref, description, unit,
  contract_qty TEXT, rate TEXT, scheduled_value_minor, sort)          -- created at contract lock
subcontract_packages(id, project_id, supplier_id → parties, name, value_minor,
  retention_pct TEXT, insurance_expiry, licence_expiry)
pay_apps(id, uid, project_id, direction CHECK(direction IN ('outbound_to_client','inbound_from_sub')),
  package_id NULL, app_no INTEGER, period_to,
  status CHECK(status IN ('draft','submitted','certified','invoiced','paid')),
  applied_gross_to_date_minor, certified_gross_to_date_minor, stored_materials_to_date_minor,
  retention_to_date_minor, advance_recovered_to_date_minor, previous_certified_net_minor,
  this_net_minor, tax_minor, invoice_document_id NULL, locked_at)
pay_app_lines(app_id, sov_line_id, scheduled_value_minor, to_date_qty TEXT NULL, to_date_pct TEXT NULL,
  to_date_value_minor, stored_materials_to_date_minor, certified_to_date_value_minor,
  PRIMARY KEY(app_id, sov_line_id))
deduction_types(id, code, name_i18n, basis CHECK(basis IN ('gross_work','stored_materials','net')),
  pct TEXT, cap_pct TEXT, tax_treatment CHECK(tax_treatment IN ('before_tax','after_tax')), account_code)
pay_app_deductions(app_id, deduction_type_id, to_date_minor, this_period_minor)
retention_ledger(id, project_id, pay_app_id NULL, direction CHECK(direction IN ('held','released')),
  amount_minor, entry_date, document_id NULL)
advance_ledger(id, project_id, kind CHECK(kind IN ('advance_received','recovered')),
  amount_minor, entry_date, document_id NULL, pay_app_id NULL)
project_budget_lines(id, project_id, cost_code, description, original_minor, approved_changes_minor)
cashflow_profiles(project_id PRIMARY KEY, profile CHECK(profile IN ('linear','front','back','s_curve')),
  periods_json)
```

**M. Letters & official documents**
```sql
letter_registers(id, kind CHECK(kind IN ('outgoing','incoming')), year INTEGER, prefix,
  pattern TEXT DEFAULT '{PREFIX}/{YYYY}/{SEQ:4}',              -- same tokens as number_series (§10.5)
  next_no INTEGER)
signers(id, uid, person_id → people NULL, name, title_i18n, signature_asset_id → asset_blobs NULL,
  stamp_asset_id → asset_blobs NULL, active INTEGER)
letters(id, uid, register_id, direction CHECK(direction IN ('outgoing','incoming')),
  number TEXT, letter_date, show_hijri INTEGER, subject,
  recipient_party_id NULL, recipient_text, person_id → people NULL,
  sender_party_id NULL, sender_text, external_ref_no, external_ref_date, received_at,    -- incoming letters
  scan_asset_id → attachments NULL, reply_to_letter_id → letters NULL,
  cc_json, attachments_list_json, signer_id → signers NULL, with_stamp INTEGER DEFAULT 0,
  template_id, template_version, body_ast_json, fields_json,                           -- §16.5
  status CHECK(status IN ('draft','issued','sent','received','archived','void')),
  issued_at, issued_by, pdf_asset_id, content_hash)              -- chained in document_events (§11.5)
```

**N. Templates, brand, custom fields**
```sql
brand(id INTEGER PRIMARY KEY CHECK(id=1), logo_light_asset, logo_dark_asset, primary_hex,
  secondary_hex, font_latin, font_arabic, stamp_asset, signature_asset, letterhead_json)
                                                     -- every *_asset → asset_blobs (inside the company file, §22)
fonts(id, family, style, weight, asset_id → asset_blobs, license_note, bundled INTEGER)
doc_templates(id, uid, doc_type TEXT NOT NULL,       -- every printable kind: any documents.doc_type,
                                                     -- PAYMENT_RECEIPT (سند قبض), PAYMENT_VOUCHER (سند صرف),
                                                     -- JOURNAL_VOUCHER, STATEMENT, 'LETTER:<template_key>', REPORT,
                                                     -- BOQ, PAY_APP, VARIATION, LABEL, CHEQUE, THERMAL_RECEIPT
                                                     -- CHECK(doc_type IN (...) OR doc_type LIKE 'LETTER:%')
  name, gallery_id, current_version, locked INTEGER)
doc_template_versions(template_id, version, schema_json, created_at, created_by,
  PRIMARY KEY(template_id, version))                        -- immutable rows
template_assignments(id, doc_type, party_id NULL, branch_id NULL, template_id, is_default)
custom_fields(id, scope CHECK(scope IN ('document','line','party','item','project')), key,
  label_i18n, type CHECK(type IN ('text','number','date','bool','select')), options_json,
  show_on_print INTEGER, sort)
saved_views(id, profile_uid, screen_id, name, filter_json, columns_json, sort_json, is_default)
message_templates(id, channel CHECK(channel IN ('email','whatsapp')), doc_type, lang,
  subject NULL, body)                                      -- placeholders per §13.10
report_layouts(id, uid, report_id TEXT NOT NULL,           -- id from assets/reports/catalog.json (§17.10)
  name, profile_uid NULL,                                  -- NULL = shared with all members
  columns_json,                                            -- [{field, label_i18n, width_pct, visible, align, format}]
  filters_json, group_by_json,                             -- grouping ≤ 2 levels
  sort_json, totals_json, chart_json,                      -- chart: none | bar | line
  page_json,                                               -- {paper, orientation, margins, repeat_header}
  brand_json,                                              -- {use_brand, title_i18n, header, footer}
  is_default INTEGER)
```

**O. Excel mirror**
```sql
export_outbox(id INTEGER PRIMARY KEY, target TEXT NOT NULL,     -- 'customer:<uid>' | 'supplier:<uid>' | 'project:<uid>'
                                                                -- | 'report:sales:2026-11' | 'report:sales_summary:2026'
                                                                -- | 'report:activity:2026-11' | 'report:vat:2026-Q3'
                                                                -- | 'report:customers' | … (full list: Appendix D)
  reason TEXT, priority INTEGER DEFAULT 0,                      -- 1 user-requested, 0 normal, -1 idle (stale rebuilds)
  enqueued_at INTEGER, status TEXT CHECK(status IN
  ('pending','running','locked','failed','done')), attempts INTEGER DEFAULT 0,
  next_attempt_at INTEGER, last_error TEXT, lock_holder TEXT)   -- (no audit)
  INDEX(status, next_attempt_at), INDEX(target)
export_files(target TEXT PRIMARY KEY, path TEXT, last_export_id INTEGER, bytes_sha256 TEXT,
  content_hash TEXT, size INTEGER, mtime TEXT, schema_version INTEGER, exported_at TEXT,
  stale INTEGER DEFAULT 0, stale_reason TEXT)                   -- lazy rebuilds (§12.3)
statement_runs(id, uid, party_id, type CHECK(type IN ('activity','outstanding')), period_from,
  period_to, as_of, currency, opening_minor, closing_minor, current_minor, b1_minor, b2_minor,
  b3_minor, b4_minor, bucket_edges TEXT, generated_at, pdf_path, xlsx_path, sha256)
```

**P. Audit & integrity (append-only)**
```sql
audit_log(id INTEGER PRIMARY KEY, ts, profile_uid, entity, entity_uid, action CHECK(action IN
  ('create','update','issue','void','delete','archive','restore','import','export','setting','login')),
  before_json, after_json, prev_hash, hash)
-- triggers: BEFORE UPDATE/DELETE ON audit_log → RAISE(ABORT)
integrity_checks(id, ran_at, result_json)
```

**Q. Jobs, mail, e-invoice, attachments, imports**
```sql
jobs(id, kind, payload_json, run_after, status CHECK(status IN ('pending','running','done','failed')),
  attempts, last_error)
email_outbox(id, to_addr, cc, subject, body, attachments_json, status, attempts, last_error, sent_at)
einvoice_submissions(id, document_id, authority, payload_ref, status CHECK(status IN
  ('pending','sent','accepted','rejected')), attempts, last_error, deadline_at, response_json)
attachments(id, uid, owner_type, owner_id, file_name, mime, size, sha256, stored_path)
asset_blobs(id, uid, kind CHECK(kind IN ('logo','stamp','signature','font','letterhead','other')),
  file_name, mime, size, sha256, data BLOB)                -- brand assets and fonts live INSIDE the company file (§22)
import_runs(id, kind, file_name, file_sha256, mapping_json, rows_total, rows_ok, rows_error,
  report_json, created_ids_json, undo_until, undone_at)
```

---

## 10. Domain engines

### 10.1 Money
- `Money { minor: i64, currency: CurrencyCode }`; conversions only via `Fx { rate: Decimal, date }`.
- Rounding helpers: `round_minor(value: Decimal, exp, method)`; methods `half_up` (default), `half_even` (pack-configurable).
- Allocation helper `allocate_largest_remainder(total_minor, weights)` used for discounts, landed cost and inclusive-price display spreads.

### 10.2 Pricing resolution (dated & scoped)
Input: `(item, uom, qty, party?, price_list?, doc_date, direction, doc_currency)`.
1. Candidate prices where `valid_from ≤ doc_date AND (valid_to IS NULL OR doc_date ≤ valid_to)` and `min_qty ≤ qty`.
2. Priority: **party** scope → **price_list** scope (party's list, else the document's list) → **all** scope.
3. Within the winning scope: highest `min_qty` ≤ qty; then latest `valid_from`; then latest `created_at`.
4. UoM conversion via `uom_conversions` (item-specific before global). If no conversion path exists → no price + warning.
5. Currency: if price currency ≠ document currency, convert at the document-date FX rate and mark the source "converted". Tax mode: if `prices.price_mode` ≠ the document's `price_mode`, convert with the item's tax rate on `doc_date` (rounded at `calc_decimals`) and mark the source "converted (incl→excl)" or "(excl→incl)".
6. Return `{ price, source: 'party:12@2026-03-01', valid_from, scope, converted }` plus separately `last_sold_to_party { price, date, doc_no }` and, for owners, `last_cost`.
7. Price changes never touch issued documents. A back-dated price change shows an impact preview ("affects 14 items, 3 drafts") and offers to re-price **drafts only**.

### 10.3 Costing (dated cost layers, landed cost, FX)
- **Receipt** (goods receipt or bill for stock items): creates a `cost_layer` dated `layer_date` (receipt date) with `unit_cost_base = unit_cost_doc × fx_rate(receipt_date)` (setting: receipt date vs bill date; default receipt date).
- **Issue** (invoice/cash sale/delivery note, assembly consumption): FIFO consumes layers in `(layer_date, id)` order and writes `cost_consumptions`; average method uses `item_avg_cost`. The issue's cost goes to COGS via the posting engine and is snapshotted on the sales line (`cost_base`, owner-only).
- **Landed cost voucher:** allocates freight/customs/insurance/clearance from one or more bills to receipt moves by value/qty/weight/volume/manual (largest-remainder). Adds to `landed_added_base` of the layers. For quantities already consumed, posts a COGS adjustment (`cost_adjustments`) dated on the voucher date.
- **Back-dated receipts/adjustments:** schedule a `recost(item, from_date)` job that replays consumptions from that date; differences post as cost adjustments on the job date; issued documents are unchanged (their snapshot is informational). (ASSUMPTION: replay-and-adjust approach.)
- **Negative stock:** allowed with a warning (item setting); cost uses the latest known layer cost and is trued-up by adjustment when the receipt arrives.
- **FX on payables/receivables** (payment rate ≠ document rate) is realized FX gain/loss (account 4950), never inventory cost.

### 10.4 BOM / recipes
- `bom_cost(item, date, mode)` with modes: `fifo_next` (cost of next layers), `average`, `latest_purchase`, `replacement` (purchase price list at date). Recursive for sub-assemblies (cycle detection MUST reject loops). Includes `waste_pct`, labour and overhead.
- Assembly document: issues components (FIFO/avg), receives output with `unit_cost = (Σ consumed + labour + overhead) / output_qty`.
- "What-if" view: BOM cost at two dates side by side (feeds Comparisons).

### 10.5 Numbering
- Pattern tokens: `{PREFIX} {YYYY} {YY} {MM} {BR} {SEQ:n}`. Yearly reset uses `doc_date` year. The same engine numbers documents, receipt and payment vouchers (`payments.series_id`, assigned on post) and letter registers (`letter_registers.pattern`).
- The number is assigned **only** inside the issue/post transaction (`BEGIN IMMEDIATE`; read and increment `number_series.next_value`). Drafts never consume numbers. Void keeps the number. No gaps by construction.
- **High-water mark (MUST):** after every issue/post the core updates, idempotently, `app.db.series_hwm` and a signed sidecar `<slug>.hwm` next to the company file (JCS payload `{company_uid, series_key, last_value, last_number, last_hash}`, HMAC-SHA-256 under a per-company key kept in the OS keychain). When a company file is opened or restored and a series' `next_value` ≤ its mark, issuing in that series is **blocked** until `next_value` is at least mark + 1 (one click: "Continue numbering after INV-2026-00412"), and an audit event `numbering.hwm_restore` is written. The same applies to letter registers, payment series and the ZATCA invoice counter (ICV). If no mark is available (new PC, no keychain key), the integrity check shows the last issued number per series and the owner confirms it before issuing.

### 10.6 Posting (hidden double-entry)
- Every issued financial document and payment calls `post(doc) -> journal_id` using the templates in Appendix E. Invariants: Σdebit = Σcredit per entry; entry date ≥ `company.lock_date + 1`; every line references the source (`ref = 'invoice:<id>'`).
- Void = reversing entry (`reversed_by_id`), never deletion.
- `party_id` on AR/AP lines makes statements and aging one query each.
- **Account resolution (MUST):** sale lines post to `items.income_account_code` if set, else **4100 Services** for `kind IN ('service','labour')` and **4000 Sales** for everything else; COGS to `items.cogs_account_code` else 5000; stock to `items.inventory_account_code` else 1200; non-stock BILL and EXPENSE lines post to `document_lines.account_code` (required; defaulted from `items.expense_account_code`, otherwise the user picks a category). `journal_lines.branch_id` copies the document's branch.
- **Year-end (derived retained earnings):** no closing entries are posted. Reports compute **3200 Retained earnings** = Σ(income − expense) of all fiscal years before the current one and show the current year's profit as its own line; locking the period (`lock_date`) is the only year-end action. The accountant export may include a generated (not posted) closing entry on request.

### 10.7 Allocation
- `balance_due(doc) = payable_minor − Σ allocations(doc)`; `unallocated(payment) = amount − Σ allocations(payment)`. Cached columns updated in the same transaction; nightly integrity job re-verifies.
- Auto-allocation: oldest due date first (FIFO), editable preview.
- Realized FX per allocation: `fx_diff = base_at_pay_rate − base_at_doc_rate` → 4950.

### 10.8 Statement & aging
- Activity (balance-forward) and Outstanding (open-item) statements, per currency, optional consolidation via `parent_party_id`.
- `closing = opening + debits − credits`; aging buckets (configurable edges, basis due date by default) MUST sum to `closing` exactly or the export is refused with an error.

### 10.9 Document conversion
- Allowed graph in §13.3. Conversion copies header and selected lines, setting `source_line_id`. `remaining(line) = source.qty − Σ child.qty (children not void)`.

### 10.10 Comparisons & analytics (from prior research)
- Price history per item per supplier (purchase) and per customer (sale) over time.
- Margin by customer / item / category / period, using issued cost snapshots.
- Cost drift alert: latest landed cost vs current sale price below target margin.
- Supplier price comparison table for an item at a date.
- BOM cost over time.
- All analytics are SQL queries over issued data, paginated, exportable to Excel; charts via uPlot. Every analytic is a report definition in `assets/reports/catalog.json` and runs through the report builder (§17.10).

---

## 11. Tax engine & compliance

> **Disclaimer (MUST appear in Settings → Tax and in the EULA):** "Aivoro Desk helps you prepare tax documents but is not tax or legal advice. Rates, thresholds and rules change. Check your country's current requirements with a qualified accountant."
>
> **Evidence note:** the tax research for this spec could not run live searches; all legal details below come from prior knowledge (to mid-2026) and are marked "verify". Iraqi tax rules were not researched at all. Nothing in this section may be presented to users as verified compliance until checked.

### 11.1 Principles
1. **Data, not code:** all rates, categories, thresholds, legal phrases, numbering rules, retention periods and return-box mappings come from versioned **country packs**.
2. **Categories, not just rates:** zero-rated (Z), exempt (E), out-of-scope (O), reverse charge (AE), intra-EU (K) and export (G) are legally different even at 0 %. Use UNCL5305 codes.
3. **Snapshot everything on issue:** rate, category, exemption text, legal phrases, pack version. Never recompute an issued document.
4. **Issued documents are immutable;** corrections only via credit/debit notes referencing the original (with reason) or void-with-reason.
5. **Decimal math only.**

### 11.2 Country pack format (`assets/country-packs/<CC>.json`, Ed25519-signed in releases)
**EXAMPLE — illustrative values, not verified, never ship as-is.** Unknown values are `null`; every rate, threshold and return box needs `source_url`, `verified_by` and `verified_at` before the pack may be marked `verified: true` (§0.2 rule 10, Appendix C.2).
```json
{
  "country": "SA", "version": "2026.11.1-example", "valid_from": "2026-01-01",
  "currency": { "code": "SAR", "calc_decimals": 2, "display_decimals": 2, "cash_rounding_increment": null },
  "default_price_mode": { "b2c": "incl", "b2b": "excl" },
  "rounding": { "mode": "category", "method": "half_up" },
  "categories_used": ["S","Z","E","O"],
  "rates": [ { "code": "SA-S-15", "category": "S", "rate": "15", "kind": "vat",
               "valid_from": "2020-07-01", "box_sale": null, "box_purchase": null,
               "source_url": null, "verified_by": null, "verified_at": null } ],
  "exemption_reasons": [ { "code": "VATEX-SA-29", "text": { "ar": "...", "en": "..." } } ],
  "document_titles": { "INVOICE": { "ar": "فاتورة ضريبية", "en": "Tax Invoice" },
                       "CASH_SALE": { "ar": "فاتورة ضريبية مبسطة", "en": "Simplified Tax Invoice" } },
  "required_fields": { "INVOICE": ["seller.tax_id","buyer.tax_id_if_registered","number","doc_date",
                        "supply_date","lines.tax_rate","totals.tax_local","buyer.national_address"] },
  "thresholds": [ { "id": "simplified_max", "amount": null, "note": "verify",
                    "source_url": null, "verified_by": null, "verified_at": null } ],
  "registration": { "threshold": null, "currency": "SAR", "source_url": null },
  "numbering": { "gapless": true, "reset": "never" },
  "retention_years": null,
  "tax_point_rule": "supply_date_else_doc_date",
  "tax_fx_rule": { "basis": null, "allowed_sources": ["central_bank", "manual"], "source_url": null },
  "tax_on_advances": null,
  "pos_fiscalization": "none",
  "language_rules": { "required": ["ar"], "optional": ["en"] },
  "qr": { "type": "zatca_tlv_phase1" },
  "extra_fields": [],
  "einvoicing": { "status": "ctc_online_required", "ask_integration_date": true,
                  "notes": { "en": "B2B standard invoices require online clearance (Phase 2 add-on). Simplified invoices can be issued offline and reported within 24h. Verify your wave." } },
  "return_boxes": [ { "box": null, "label": { "en": "Standard rated sales", "ar": "..." },
                      "source_url": null, "verified_by": null, "verified_at": null } ],
  "verified": false
}
```
- Pack fields added in v1.1: `currency.calc_decimals` (§8); `currency.cash_rounding_increment` (configurable; any value in an example is illustrative only); `registration.threshold` (optional warning, §11.4); `tax_point_rule`; `tax_fx_rule` (§11.3 step 8); `tax_on_advances` (explicit boolean, `null` = unknown → the UI asks the user and warns); `pos_fiscalization ∈ { none, certified_required, device_required }` (§11.8); `einvoicing.ask_integration_date` (KSA, §11.4).
- **Tax-invoice titles** ("Tax Invoice" / "فاتورة ضريبية") print only when (a) the pack is `verified: true`, (b) the company is registered for that tax on the document date (§11.4) and (c) `einvoicing.status` allows this business to issue offline. Otherwise the title falls back to "Invoice" / "فاتورة".
- `einvoicing.status ∈ { none, receive_required, structured_offline, ctc_online_required, certified_software_required }`. The setup wizard shows a plain-language warning for anything except `none`.
- `verified:false` packs show a yellow "Rules not yet verified for this country" badge in Settings → Tax.
- **Launch set (ASSUMPTION, 20–25 packs, v1/Phase 14):** IQ, SA, AE, KW, QA, BH, OM, JO, EG, LB, TR, GB, IE, DE, FR, NL, BE, US (user-defined sales tax), CA, AU, NZ, IN, MY, plus `GENERIC`.
  - KW and QA have no VAT as of last knowledge (verify): their packs contain **no VAT rates**.
  - EG, TR, MY, JO and IN (above the e-invoice threshold) ship with `einvoicing.status: "ctc_online_required"`: issuing titled tax invoices is **blocked** for them (quotes, proformas, non-tax documents and CSV/JSON export for manual portal entry stay available) until a connector exists.
- **MVP country scope (A34):** the MVP ships the pack loader with real signature verification, `GENERIC` (never prints "Tax Invoice"), the IQ placeholder and the 2–3 packs verified by Phase 9. `assets/country-packs/index.json` holds `sale_status ∈ { supported, limited, not_supported }` per country; checkout copy, the EULA coverage statement and the setup wizard show this list, and unsupported countries see a clear notice before purchase.
- **IQ pack (ASSUMPTION):** ships with tax disabled by default, user-defined rates, `calc_decimals: 0` and `display_decimals: 0` for IQD, `einvoicing.status: none`, `verified:false`, `retention_years: null` (unknown → the app never anonymizes or prunes, the safest default). Must be replaced after dedicated Iraqi research.
- **US pack:** no VAT; user defines jurisdictions and rates; tracks customer resale/exemption certificates with expiry. The app MUST NOT claim automated US sales-tax compliance.
- Packs update by importing a signed JSON file (no reinstall); the old version stays for documents already issued.

### 11.3 Calculation order (MUST)
1. `line_net = round(qty × unit_price − line_discount, calc_decimals)`; unit price ≤ 6 decimals, qty ≤ 4 (engineering ≤ 6).
2. Allocate document-level discounts/charges to VAT categories (EN 16931 BG-20/BG-21 carry their own category), pro-rata by net with largest remainder.
3. Per category & rate: `base = Σ line nets ± allowances/charges`. `tax = round(base × rate)` in **category** mode (EN 16931 BR-CO-17; default for EU/Peppol packs) or `Σ round(line_net × rate)` in **line** mode. Category mode is **forced** when the pack enables e-invoice export for the document or the party has a `peppol_id`; the validator warns if a line-mode document is later exported.
4. **Tax-inclusive** mode, per rate group: `tax = round(gross × r / (1 + r))`, `net = gross − tax`; customer pays exactly the displayed price; display spread of any 0.01 across lines via largest remainder.
5. **Compound taxes** (tax groups) apply in `seq` order on base plus previous taxes where `compound_on_previous=1` (e.g. a levy or excise that is itself included in the VAT base). Note: Canadian GST and QST are **not** compounded — QST has been charged on the price excluding GST since 2013, and PEI moved to HST in 2013 (verify); a golden test asserts GST + QST use the same base.
6. **Withholding** computed on base (or on VAT where the rule says) and shown **below** the total: `Total incl. tax → less withholding → Amount payable`. It reduces `payable_minor`, not `total_minor` or the VAT base.
7. **Cash rounding** to the pack's `cash_rounding_increment` (configurable; e.g. 0.05 is only an example) goes to `rounding_minor` (EN 16931 BT-114), never into tax.
8. If document currency ≠ local currency: `tax_local_minor` uses `tax_fx_rate`, chosen by the pack's `tax_fx_rule` — **not automatically the commercial document rate**. EU (VAT Directive Art. 91): latest selling rate at the chargeable event, or the ECB rate where the member state allows it; UK: market rate or the HMRC period rate; GCC: verify per country. The document stores `tax_point_date`, `tax_fx_rate` and `tax_fx_source ∈ { doc, central_bank, ecb, hmrc_period, manual }`; the VAT return assigns documents to periods by `tax_point_date`.
9. Purchase bills: allow overriding the computed tax amount (± small tolerance, logged) to match the supplier's document.
10. All rounding uses `currencies.calc_decimals` of the document currency (§8).

**Golden tests required:** Canadian GST + QST on the same base; IQD at `calc_decimals = 0` prints lines that add up to the printed total; tax FX by pack rule (EU, UK); "less advance" lines with `tax_on_advances = true` and `false` (§13.7); a non-registered company prints no VAT.

### 11.4 Pre-issue validator (runs on Issue; fixable messages with "Go to field")
Examples (pack-driven): reverse charge/intra-EU without buyer VAT ID; exempt line without exemption reason; KSA standard invoice without buyer VAT number or national address; Australia tax invoice ≥ A$1,000 without the buyer's identity **or** ABN (rule `buyer.name_or_abn`; verify); foreign currency without FX rate for the date; supply date inside a filed/locked tax period or before `lock_date`; customer exemption certificate expired; missing mandatory language for title/labels; tax ID format invalid (regex per scheme). Optional online checks (VIES, HMRC) only on user action; cache result + timestamp as evidence.
- **Tax registration (MUST):** `company_tax_registrations` decides whether VAT/GST may be charged. Not registered for the scheme → no VAT lines, no tax summary and the title "Invoice" / "فاتورة" (never "Tax Invoice"). VAT on a document dated before `effective_from` (or after `effective_to`) is blocked: "You were not registered for VAT on this date." Optional pack warning when rolling 12-month sales approach `registration.threshold` (verify per country).
- **Titled tax invoices** are blocked when the pack is unverified, the company is not registered, or `einvoicing.status = ctc_online_required` without an installed connector. Quotes, proformas and non-tax documents stay allowed.
- **KSA integration waves:** the setup wizard asks "Has ZATCA notified you of your integration (Phase 2) date?" If that date has passed and the add-on is not installed, issuing tax invoices is blocked (quotes and proformas allowed). Starter marketing excludes these businesses.
- **E-invoice export of a line-mode document** → warning (BR-CO-17 risk); category mode is forced when export is enabled (§11.3).
- **POS fiscalization:** when the pack's `pos_fiscalization ≠ none`, Quick sale (F12) and the cash-drawer kick are disabled with an explanation (§11.8).

### 11.5 Numbering, immutability and integrity
- Statuses: `draft → issued → (partially credited | credited)`; payment state separate.
- Issue = one transaction: assign number, freeze `party_snapshot_json` and `seller_snapshot_json`, snapshot taxes/legal phrases/template version, compute `content_hash`, append a `document_events` row, write the audit row, enqueue Excel/PDF; then update the numbering high-water mark (§10.5).
- **Hash chain (MUST):**
  - Canonical JSON = **RFC 8785 (JCS)**; hash = SHA-256, lowercase hex.
  - `content_hash = SHA-256(JCS(H))`, where H is exactly: `{doc_uid, doc_type, number, doc_date, supply_date, tax_point_date, due_date, currency, fx_rate, tax_fx_rate, price_mode, rounding_mode, party_snapshot, seller_snapshot, lines: [{line_no, line_kind, item_code, description, description_secondary, qty, uom, unit_price, discount_pct, discount_minor, net_minor, tax_code, tax_minor, total_minor}], charges: [{kind, reason_code, amount_minor, tax_category, tax_rate}], tax_summary: [{category_code, rate, base_minor, amount_minor, amount_local_minor, exemption_code}], totals: {subtotal_minor, discount_minor, charges_minor, tax_minor, wht_minor, rounding_minor, total_minor, payable_minor, total_base_minor, tax_local_minor}, original_doc_uid, reason_code, country_pack_version, template_id, template_version, pdf_sha256}`. Caches (`paid_minor`, `balance_minor`, payment/fulfilment/credit states, `sent_at`) are excluded.
  - **One global chain per company file:** `document_events.hash = SHA-256(prev_hash ‖ JCS({seq, entity_type, entity_uid, kind, number, at, content_hash, reason}))`; documents and letters share the chain; `seq` is gapless.
  - Void, credit and debit are **separate chained events**; voiding never changes the hashed content of the original.
  - Acceptance: the integrity check recomputes every `content_hash` from stored rows (snapshots, lines, charges, tax summary, totals) and every chain link, and reports the first break.
- Proformas/quotes use their own series and print "PROFORMA – not a tax invoice" / "عرض سعر – ليست فاتورة ضريبية".
- Settings → Data → **Integrity check** verifies both hash chains (`document_events`, `audit_log`), every `content_hash`, and the numbering high-water marks, and reports breaks.

### 11.6 Tax reports
- **Return builder:** sums `document_tax_summary` (net of credit/debit notes) into the pack's boxes for a period, invoice basis (documents assigned by `tax_point_date`) or cash basis (tax point = payment date). UAE: sales split by emirate (`emirate_code`). Every box drills down to documents.
- **The app never files returns** with any authority. **UK:** VAT returns must be filed through MTD-compatible software with digital links (verify); Aivoro Desk's VAT export is input for the user's bridging/MTD software or accountant, and the app and its marketing must never claim "MTD compatible".
- **Excel export per period:** sheets `Summary` (boxes), `Sales`, `Purchases` (one row per document: net, tax, withholding per rate), `Adjustments`.
- Filing a period sets `tax_periods.status='filed'` and snapshots the return; later edits into that period are blocked (credit notes go into the current period).

### 11.7 E-invoicing tiers
| Tier | Edition | Content | Network |
|---|---|---|---|
| 0 | all | Professional PDF + QR block (pack-driven). Used only for packs **verified** as `einvoicing.status: "none"`. Many MENA/African countries already mandate e-invoicing or fiscal devices — e.g. Egypt (ETA e-invoice and e-receipt), Jordan (JoFotara), Turkey, Kenya (eTIMS), Tanzania (EFD/VFD), Uganda (EFRIS), Rwanda (EBM), Zambia, Ghana — verify each; their packs carry the correct status and are blocked or limited accordingly. | none |
| 1 | Pro | Export **UBL 2.1 Peppol BIS Billing 3.0**, **CII**, **Factur-X/ZUGFeRD (EN16931 profile, PDF/A-3 hybrid)**, **XRechnung**; import incoming XRechnung/ZUGFeRD (Germany requires receiving since 2025 — verify). | none |
| 2 | Add-on (separate signed download, §5.2) | Online connectors behind `einvoice_submissions` outbox with deadline alerts: **ZATCA Phase 2** first (B2C simplified: sign locally, print offline, report within 24 h; B2B standard: clearance before sharing), then a Peppol access-point partner (Belgium 2026, UAE ~2027, France approved platforms — verify dates), then KSeF/MyInvois on demand. | occasional |
| 3 | Unsupported at launch | Mexico CFDI, Italy SdI, Portugal (certified software), Spain Veri*factu (2027 — verify), Hungary, Greece, Turkey, Egypt ETA, Jordan JoFotara, Malaysia MyInvois, India IRN above threshold, Kenya, Tanzania, Uganda, Rwanda, Zambia, Ghana (verify each). Setup wizard warns/blocks; offer CSV/JSON export for manual portal entry. | — |

- **ZATCA Phase 1 QR (Tier 0, KSA pack):** Base64 of TLV bytes, each field `[tag:1 byte][length:1 byte][UTF-8 value]`: tag 1 seller name, 2 VAT number, 3 timestamp (ISO-8601), 4 invoice total incl. VAT, 5 VAT total. Phase 2 adds tags 6–9 (hash, ECDSA signature, public key, ZATCA stamp signature) — add-on only. Validate with ZATCA's official SDK in CI before claiming support. The Phase-1 QR alone is **not** sufficient for businesses already in a Phase-2 integration wave (§11.4).
- **Factur-X/PDF/A-3:** ASSUMPTION: verify Typst's PDF/A support; if PDF/A-3 attachments are not supported, post-process the Typst PDF with a permissive Rust PDF library to embed `factur-x.xml` and set PDF/A-3 metadata. Validate with veraPDF.
- Validation in CI: KoSIT validator (XRechnung), Peppol BIS 3 schematrons, ZATCA SDK, veraPDF.

### 11.8 Legal guardrails for selling worldwide
- Collect buyer country at checkout (MoR provides it); preselect the pack.
- EULA + setup wizard list per country what is and isn't covered. Never market "compliant" for Portugal, Spain (Veri*factu), French B2C cash/POS (NF525), German cash registers (TSE/KassenSichV), Austria (RKSV) or Hungary unless implemented. Add a clause: "not for use as a certified cash register in FR/DE/AT/PT/ES" (ASSUMPTION — legal review required).
- Quick sale mode (F12) with a cash-drawer kick **is** a cash register in legal terms. Pack field `pos_fiscalization ∈ { none, certified_required, device_required }` is set for FR, DE, AT, PT, ES, IT, PL, HU, GR, HR and the EFD/eTIMS countries (verify each). When it is not `none`, F12 Quick sale and the drawer kick are disabled with a plain explanation; normal invoices remain available.
- The MVP sells only in the countries listed under A34 (§11.2); checkout shows the list.

### 11.9 Fields required now so no later migration is needed
- Parties: multiple typed tax IDs; structured address (building no, street, additional no, district, city, region/emirate, postal code, ISO country); `peppol_id`.
- Items: classification codes (HS, HSN/SAC, UNSPSC, SAT); UoM as UN/ECE Rec 20 codes; `tax_class`.
- Payment accounts: UNCL4461 payment-means code (10 cash, 30 credit transfer, 42 payment to bank account, 48 bank card, 58 SEPA credit transfer, 59 SEPA direct debit).
- UoMs: `uoms.export_code` (UN/ECE Rec 21 X-prefixed packaging codes such as `XBX` in e-invoices — verify).
- Projects: `projects.tax_profile ∈ { standard, reverse_charge_construction (UK domestic reverse charge for construction services since 2021 — verify), exempt, zero_export }`.
- Company: `company_tax_registrations`; documents: `tax_point_date`, `tax_fx_rate`, `tax_fx_source`, party/seller snapshots.

### 11.10 Tax-screen hint copy (ships in the hint catalog)
- "Issued invoices are locked. To correct one, create a credit note." / "الفواتير الصادرة مقفلة. لتصحيح فاتورة أنشئ إشعاراً دائناً."
- "Zero-rated ≠ Exempt. Choose Exempt only if the law exempts this item." / "الخاضع بنسبة صفر ≠ المعفى. اختر «معفى» فقط إذا كان القانون يعفي هذا الصنف."
- "Prices include tax? Switch to inclusive so customers pay the shelf price." / "هل تشمل أسعارك الضريبة؟ فعّل وضع الأسعار الشاملة ليدفع الزبون السعر المعروض."
- "Withholding reduces what the customer pays you, not your sales." / "الاستقطاع يُنقص المبلغ الذي يدفعه لك الزبون، لا مبيعاتك."
- KSA B2B: "Internet needed to clear this invoice with ZATCA before sending." / "يلزم الاتصال بالإنترنت لاعتماد الفاتورة لدى ZATCA قبل إرسالها."

---

## 12. Excel mirroring subsystem

### 12.1 Principles (MUST)
- SQLite is the only source of truth. Excel files are a **derived, regenerable mirror**; the app never edits a workbook in place.
- No business operation waits for Excel. "File open in Excel" is a normal state, not an error.
- Never kill `EXCEL.EXE`; never delete `~$` owner files; never silently overwrite a user-edited file.
- The mirror **bypasses app roles**: anyone who can open the folder sees every customer. Cost, margin, salary and national ID are **never** mirrored; owner-only reports go to an `_Owner` subfolder that is **off by default** (§21.1).

### 12.2 Transactional outbox
- Every **mutating command** declares its Excel targets in the command registry (`src-tauri/src/commands/`); the command's transaction inserts the matching `export_outbox` rows **in the same transaction**. A command with no Excel effect carries `#[no_excel(reason)]`. CI test: every mutating command either queues ≥ 1 target or carries `#[no_excel]`. Appendix D is **generated** from this registry (`scripts/gen-appendix-d.rs` → `docs/APPENDIX_D.md`), so it cannot drift.
- **Drafts never queue Excel jobs** (draft autosave runs every 3–5 s). Quotes, like invoices, reach Excel only once issued (and again when voided or expired).
- Targets include `customer:<uid>`, `report:sales:2026-11`, `report:activity:2026-11`, `report:vat:2026-Q3`, `report:customers` (full list: Appendix D).
- Startup: `running → pending`; delete `done` rows older than 7 days; delete orphan `.*.tmp` files in export folders.
- After 10 non-lock errors a job becomes `failed` (dead letter) and appears in Settings → Excel → Problems with "Retry" and "Show error". Lock waits never count as failures.

### 12.3 Worker
- One background thread at the lowest OS thread priority. Groups pending jobs by `target` and debounces **per target class**: party and project workbooks 1.5–3 s; **master reports ≥ 60 s** (or when the user has been idle ≥ 30 s, or at close); when the Excel root is inside a sync-client folder (OneDrive/Dropbox/Google Drive), every class ≥ 60 s. Rebuilds the whole workbook from SQLite (for monthly reports, only the current month's file).
- Priority bump when the user clicks "Open in Excel" for that target.
- At most one workbook written at a time.
- Library: `rust_xlsxwriter` (enable the `zlib` feature if the toolchain allows). Normal mode with Excel Tables below 50,000 data rows per workbook; **`constant_memory` mode without Tables** (autofilter + frozen header only) at or above 50,000 rows. Never write more than **1,000,000 rows** to one sheet (Excel's limit is 1,048,576): roll over to `Lines_2`, `Lines_3`, …
- **Master reports are split by month** (`Reports\Sales\Sales 2026-11.xlsx`, …) plus a yearly summary workbook holding aggregates only (month × customer, month × item, month × tax rate). A new issued invoice rebuilds only the current month's file; the summary follows on idle.
- **Stale + lazy rebuilds:** events that would touch many workbooks (`brand.changed`, price-list or `all`-scope price changes, `settings.excel_root_changed`, `excel.layout` change, workbook schema upgrade) do **not** enqueue thousands of jobs. They set `export_files.stale = 1`, and a low-priority idle worker rebuilds stale files when that party next changes, on "Open in Excel", or in the background at ≤ 30 files per minute (ASSUMPTION; setting), pausing while the user is typing (input in the last 10 s) or the PC runs on battery. Settings → Excel shows progress ("1,240 of 20,000 files updated").
- The initial mirror build of an imported or restored company uses the same idle worker, with visible progress.

### 12.4 Atomic write on Windows
1. Build the workbook in memory; save to `<folder>\.<name>.<pid>.tmp` in the **same folder**.
2. Flush (`File::sync_all`).
3. If target exists → `ReplaceFileW(target, tmp)`; else `MoveFileExW(tmp, target, MOVEFILE_REPLACE_EXISTING | MOVEFILE_WRITE_THROUGH)`.
4. On error 5 (`ERROR_ACCESS_DENIED`) or 32 (`ERROR_SHARING_VIOLATION`): retry after 50, 100, 250, 500 ms (antivirus, indexer, sync clients).
5. Still failing → treat as "open in Excel": delete tmp, set job `locked`, `next_attempt_at = now + 30 s` doubling to max 5 min, store `lock_holder` from Restart Manager (`RmStartSession`/`RmRegisterResources`/`RmGetList`).
6. Before replacing, compare `export_files` (`mtime`, `size`, `bytes_sha256`) to the file on disk. If it changed outside the app → move the user's file to `_conflicts\<name> (edited YYYY-MM-DD HHMM).xlsx` first, then write, then show a banner: "You edited ACME.xlsx in Excel. Import changes or keep the app's version?"

### 12.5 Locked-file UX
- Non-blocking status chip: "2 Excel files waiting · ACME.xlsx is open in Microsoft Excel".
- Retry triggers: app regains focus; `notify` watcher sees the `~$` file disappear; backoff timer.
- "Open latest copy" writes a timestamped read-only copy to a temp folder and opens it.
- Copy: "Nothing is lost — your data is safe in Aivoro Desk. The Excel file will update when you close it." / "لم يُفقد شيء — بياناتك محفوظة في البرنامج. سيُحدَّث ملف إكسل فور إغلاقه."

### 12.6 Folder layout
**Root (configurable).** Default `Documents\Aivoro Desk\Excel\<Company>`, **except** when the resolved `FOLDERID_Documents` (`SHGetKnownFolderPath`) lies inside a OneDrive, Dropbox or Google Drive root (detected from the OneDrive `UserFolder` registry values and `%OneDrive%`/`%OneDriveCommercial%`, Dropbox `info.json`, Google Drive for desktop settings): then the default is `%USERPROFILE%\Aivoro Desk\Excel\<Company>`, and the setup wizard explains why ("Your Documents folder syncs to OneDrive; constantly updated Excel files would upload all day"). The user may still choose a synced folder; then every debounce is ≥ 60 s (§12.3). The same rule sets the default backup and PDF roots (§6, §22).

**Layout setting `excel.layout ∈ { folder_per_customer (default), file_per_customer }` (A33):**
```
Customers\C0042 - <name>\C0042 - <name>.xlsx               (customer workbook, §12.7)
Customers\C0042 - <name>\Invoices\INV-2026-00042.pdf       (hard link to, or copy of, the stored issued PDF)
Customers\C0042 - <name>\Statements\2026-11-30.pdf | .xlsx  (from statement_runs)
Customers\C0042 - <name>\Projects\P0003 - <name>.xlsx      (projects module)
Suppliers\S0007 - <name>\S0007 - <name>.xlsx  (+ Bills\, Statements\)
Reports\Customers.xlsx                         (master list + AR aging)
Reports\Suppliers.xlsx                         (master list + AP aging)
Reports\Sales\Sales 2026-11.xlsx · Reports\Sales\Sales 2026 summary.xlsx
Reports\Purchases\Purchases 2026-11.xlsx · Reports\Payments\Payments 2026-11.xlsx
Reports\Cash sales\Cash sales 2026-11.xlsx     (walk-in customer / Quick sale)
Reports\Activity\Activity 2026-11.xlsx         (every operation, from audit_log)
Reports\Expenses 2026.xlsx · Reports\Cash & Bank 2026.xlsx
Reports\Stock moves\Stock moves 2026-11.xlsx · Reports\Letters 2026.xlsx
Reports\VAT 2026-Q3.xlsx · Reports\Ledger\Ledger 2026-11.xlsx · Reports\Items & Prices.xlsx
_Owner\                                         (off by default: margin, cost and other owner-only reports)
_conflicts\ · _archive\
```
- `file_per_customer` keeps the flat layout (`Customers\C0042 - <name>.xlsx`, `Projects\P0003 - <name>.xlsx`); PDFs then stay under `PDF\<Company>\`.
- Sanitize names: replace `<>:"/\|?*` and control chars, trim trailing dots/spaces, keep the party code prefix for uniqueness; Arabic/Unicode allowed. Renaming a party renames its folder/file (path tracked in `export_files`).
- Hard links are used when the PDF store and the Excel root are on the same NTFS volume; otherwise copies (counted in the Excel-folder size budget, §3.2).
- The Excel root MAY be in OneDrive/Dropbox (it is regenerable). The live database MUST NOT.

### 12.7 Per-customer workbook (sheet names fixed ASCII ≤ 31 chars; localized titles inside)
| Sheet | Excel Table | Columns |
|---|---|---|
| `Summary` | — | customer card (code, name, tax IDs, address, currency, terms, credit limit), current balance, aging buckets, last invoice & payment, line "Generated <ts> by Aivoro Desk. Edits here are not saved unless you use Import." |
| `Statement_<CCY>` (one per currency, e.g. `Statement_IQD`, `Statement_USD`) | `tblStatement_<CCY>` | Date · Type · Doc No · Reference/PO · Due date · Days overdue · Debit · Credit · Balance; footer closing balance + aging table |
| `Invoices` | `tblInvoices` | InvoiceNo, Date, DueDate, Type, Status, Currency, FXRate, Subtotal, Discount, Tax, Total, Withholding, Payable, Paid, Balance, BaseTotal, Reference, PaymentAccount, `_id`, `_rowver`, `_hash` (hidden) |
| `Lines` | `tblLines` | InvoiceNo, LineNo, ItemCode, Description, Qty, Unit, UnitPrice, Discount%, TaxCode, TaxRate, Tax, LineTotal, hidden keys |
| `Payments` | `tblPayments` | ReceiptNo, Date, Method, Account, Currency, Amount, Fee, AllocatedTo, Unallocated, hidden keys |
| `Credits` | `tblCredits` | CreditNo, Date, Original, Reason, Total, Applied, Remaining |
| `Prices` | `tblPrices` (A), `tblListPrices` (B), `tblEffective` (C) | A/B: ItemCode, Item, Unit, Price, Incl/Excl, Currency, ValidFrom, ValidTo, Status (active/expired/future), MinQty, ChangedBy, ChangedAt, hidden keys · C: ItemCode, Item, Unit, EffectivePrice, Currency, Source, Since — rules below |
| `Quotes` | `tblQuotes` | optional |
| `_meta` | — | very hidden: schema_version, export_id, generated_at, app_version, row counts, content_hash (also in custom document properties) |

Supplier and project workbooks follow the same pattern (project: BoQ, Takeoff, RateAnalysis, Variations, PA-01…PA-n in G703-style columns, Retention, CostVsBudget, Cashflow — **real formulas** there so QS reviewers can audit).

- **Statement period & currencies:** one `Statement_<CCY>` sheet per currency the customer has documents in; default period = from the first transaction to today, with the opening balance taken from `OPENING_BALANCE` documents (never fake payments). `Summary` shows one balance/aging block per currency.
- **Prices sheet** holds three Tables: (A) `tblPrices` — the customer's own price rows (party scope), full history including expired rows; (B) `tblListPrices` — rows of the customer's assigned price list; (C) `tblEffective` — "effective price today" resolved with §10.2 for every item that has a customer or list price or was sold to this customer in the last 12 months, with a `Source` column (Customer / List "Wholesale" / Everyone / Last sale) and the heading "as of <generated_at>". Changes to `all`-scope prices do **not** re-queue every customer workbook: Table C refreshes at that workbook's next rebuild or in a nightly low-priority stale pass (§12.3).
- **Issued rows use the frozen snapshots** (`party_snapshot_json`, `seller_snapshot_json`): editing a customer later changes only `Summary`, never issued rows.
- **Never mirrored:** cost, margin, `cost_base`, salary, national ID, PINs, card data beyond the last 4 digits.
- **Walk-in and cash customers:** `parties.excel_mirror = 0` (default for the auto-created "Walk-in customer") → no per-party workbook; those sales go to `Reports\Cash sales\Cash sales YYYY-MM.xlsx`.
- **Large customers:** when a customer workbook would exceed 50,000 `Lines` rows (ASSUMPTION), it splits by year (`C0042 - <name> 2026.xlsx` plus a small all-years summary workbook).

**Master reports** (rebuilt per §12.3):
| Workbook | Content |
|---|---|
| `Activity YYYY-MM` | every operation of the month, from `audit_log`: Time · User · Operation · Entity · Number · Party · Amount · Currency · Change summary — the literal "every operation in an Excel table"; only the current month is rebuilt |
| `Sales YYYY-MM` / `Purchases YYYY-MM` / `Payments YYYY-MM` / `Cash sales YYYY-MM` | one row per document or payment, plus a `Lines` sheet |
| `Sales YYYY summary` | aggregates only: month × customer, month × item, month × tax rate |
| `Expenses YYYY` | quick expenses, expense bills and petty-cash spending by category |
| `Cash & Bank YYYY` | one sheet per payment account = its account card (§14.10): Date · Ref · Description · In · Out · Running balance; includes transfers, owner drawings/capital, cheque status changes, card settlements, plus a `Reconciliations` sheet |
| `Stock moves YYYY-MM` | every stock move (receipts, issues, adjustments, transfers, assemblies, landed-cost revaluations) with running quantity per item and warehouse |
| `Letters YYYY` | outgoing and incoming letter registers |
| `Ledger YYYY-MM` | general journal lines (fed by `journal.posted`) |
| `VAT YYYY-Qn`, `Customers`, `Suppliers`, `Items & Prices` | as before; `Items & Prices` also has `BOMs` and `FX rates` sheets |
Settings, users and permissions are not mirrored as data; their changes appear only in `Activity`.

### 12.8 Formatting
- Every range is a named Excel Table (ASCII names starting with a letter/underscore, no spaces), autofilter, banded style, frozen header, autofit, number format `#,##0.00;[Red]-#,##0.00` (decimals from currency), ISO or locale dates, conditional red for `Days overdue > 0`.
- Header fill/font from the company Brand tokens (same as PDFs).
- **Do not protect data sheets:** Excel refuses to sort a range that contains locked cells on a protected sheet, even when "Sort" is allowed. Only `Summary` is protected (no password). Acceptance: `tblInvoices` can be sorted and filtered in Excel.
- Right-to-left sheets when the **company's** `primary_lang` is RTL — not the viewer's UI language, because the files are shared with the accountant — via `Worksheet::set_right_to_left()`. A8 is a version check of the pinned `rust_xlsxwriter` (the method appears to exist), not a spike.
- **Values, not formulas** for data cells and running balance (formula balances break under sorting). Formulas only in Table total rows (`SUBTOTAL`) and aging summaries, and ALWAYS set the cached result (`set_formula_result`) so LibreOffice/phone viewers don't show 0.

### 12.9 Statement of account spec
- Header: logo, company name, tax ID, bank details; customer name, code, tax ID, address; statement type (Activity / Outstanding); period or "as at"; currency.
- Row types: Opening balance, Invoice, Payment, Credit note, Debit note, Refund, Adjustment, Withholding certificate.
- Footer: Closing = Opening + Debits − Credits; aging `Current | 1–30 | 31–60 | 61–90 | 90+ | Total` (edges configurable, e.g. 7/14/21/30) — **assert Total = Closing**; unallocated credits/prepayments on their own line; payment instructions.
- Options: aging basis (due date default / invoice date); payment as one line with optional allocation detail; one statement per currency + optional converted view "at rate X on date"; consolidated parent statement.
- Outputs: PDF (Typst) and XLSX; bulk "one file per customer".
- Snapshots: every sent/exported statement saved in `statement_runs` with file paths and SHA-256; reopening shows exactly what was sent.
- Opening balances come from real documents or `OPENING_BALANCE` documents that can be expanded — never fake payments.

### 12.10 Re-import of Excel edits (v2, explicit action only)
- "Import changes from Excel" reads with `calamine`; recomputes canonical per-row hash (values normalized, fixed column order, SHA-256 truncated to 16 hex) and compares with hidden `_hash` → edited rows; compares `_rowver` with current `row_version` → conflict if DB changed after export (Dynamics 365 pattern).
- Allowed only on editable sheets (`Prices`, customer details). Posted invoices are read-only (correct them with credit notes).
- Validate every row, show a diff preview, apply in one transaction with audit rows.
- Never detect edits by whole-file hash alone (Office rewrites metadata on open).

### 12.11 Tests (MUST pass before release)
1. Workbook open in Excel (or locked by a helper process with exclusive share mode on CI) while posting invoices → job queues, chip appears, update applies after unlock.
2. Kill the app mid-export → old file intact; orphan tmp cleaned at next start.
3. Excel folder inside OneDrive/Dropbox with the file open on two PCs → no data loss; conflicts in `_conflicts`.
4. Output opened in LibreOffice and a phone previewer → no zero totals.
5. Arabic names, 40-char names, names containing `/` and `:` → valid file, sheet and table names.
6. Property test: aging total = closing balance for 1,000 random customers.
7. Performance: heavy customer (500 invoices, 2,500 lines, 1,000 statement rows ≈ 50k cells) rebuild ≤ 1 s.
8. Registry: every mutating command maps to ≥ 1 Excel target or `#[no_excel(reason)]`; `docs/APPENDIX_D.md` regenerates without a diff.
9. Ten minutes of draft autosave enqueue 0 jobs.
10. `large` fixture (2M lines): no sheet exceeds 1,000,000 rows; the monthly master report rebuild stays within the §3.2 time and peak-memory budgets.
11. 1,000 Quick sales to the walk-in customer never rebuild a per-party workbook; `Cash sales YYYY-MM` grows instead.
12. `brand.changed` with 20,000 customers marks files stale and rebuilds them lazily with keypress p95 unchanged ±10 %, showing progress.
13. A Documents folder redirected into OneDrive is detected and the default root moves to `%USERPROFILE%\Aivoro Desk`.
14. `tblInvoices` can be sorted and filtered in Excel; sheets are RTL when the company's primary language is Arabic.
15. Editing a customer after issue changes no issued row in Excel; a scan of the whole Excel folder finds no cost, margin, salary or national ID.

---

## 13. Invoice Hub

### 13.1 Document types
Sales: `QUOTE, PROFORMA, SALES_ORDER, DELIVERY_NOTE, INVOICE, CASH_SALE, DEPOSIT_INVOICE, PROGRESS_INVOICE, RETENTION_INVOICE, CREDIT_NOTE, DEBIT_NOTE` + receipts (payments). Purchase: `PURCHASE_ORDER, GOODS_RECEIPT, BILL, SUPPLIER_CREDIT, EXPENSE` + supplier payments. Starter: QUOTE (incl. BoQ-lite mode, §15.17), INVOICE, CASH_SALE, CREDIT_NOTE, receipts and payment vouchers, BILL (basic), EXPENSE, percent-based PROGRESS_INVOICE from a BoQ-lite quote. Pro: all.

### 13.2 Hub layout
- **Left rail:** type filters with live counts — Drafts · Quotes open · Orders to deliver · To invoice · Unpaid · Overdue · Recently issued; saved views.
- **Center:** virtualized list (number, date, party, total, balance, status chips), multi-select bulk actions: print, export PDF/XLSX, send, convert, mark paid.
- **Right:** live preview of the selected document (rendered page image).
- **Sales / Purchases switch** at the top of the left rail (remembers the last choice); counts, filters and the list follow the switch.
- **Primary split button "New" (Ctrl+N)** — the single place to create anything: every enabled document type plus Receipt (سند قبض), Payment voucher (سند صرف), Quick expense, Letter and Pay application (projects module); entries appear only when their module is on. "Create similar" on any document.
- One shared **Document Editor** for all types; header fields shown/hidden per type and per pack.
- Screen banner + empty state per §18.

### 13.3 Conversion graph (allow-list enforced in core)
```
QUOTE          → PROFORMA | SALES_ORDER | INVOICE | DEPOSIT_INVOICE
SALES_ORDER    → DELIVERY_NOTE (partial, many) | INVOICE (partial, many) | DEPOSIT_INVOICE
DELIVERY_NOTE+ → INVOICE (merge several DNs of the same customer)
PROFORMA       → INVOICE
BoQ/contract   → PROGRESS_INVOICE (via pay application) → RETENTION_INVOICE (release)
QUOTE (BoQ-lite) → PROGRESS_INVOICE (percent to date per line, §15.17)
INVOICE        → CREDIT_NOTE (full or selected lines/qty) | DEBIT_NOTE | receipt
INVOICE        → CREDIT_NOTE (full) + new linked draft  ("Correct this invoice", §13.6)
PURCHASE_ORDER → GOODS_RECEIPT (partial) | BILL (partial)
GOODS_RECEIPT+ → BILL (merge)
BILL           → SUPPLIER_CREDIT | supplier payment
```
Conversion dialog: one row per source line with *ordered / already converted / remaining / convert now* (default = remaining). Lines link via `source_line_id`. Source `fulfilment_state` updates automatically.

### 13.4 Editor layout
- **Header:** party picker (typeahead; shows balance, overdue amount, credit-limit badge, price list in force on the document date), doc date / supply date / due date, currency + FX rate (auto from `fx_rates`, warning chip if missing), series/branch, reference/PO, project (if module on), **pay-to account** (whose bank details print on the invoice; default from Settings → How customers can pay you), optional salesperson, optional second-currency total (currency + rate).
- **Middle:** line grid (Appendix A keyboard map). Columns: #, Item, Description, Qty, Unit, Price, Disc %, Tax, Net, (owner) Cost/Margin, custom line fields.
- **Footer:** subtotal, document discount (% or amount), charges, tax-by-rate table, withholding, total, payable, paid, balance due, amount in words (bilingual).
- **Right panel (collapsible):** last prices for the focused item for this party (price, date, doc no.), stock on hand per warehouse, owner-only margin, attachments, internal notes, price source chip ("Price from list 'Wholesale' since 2026-03-01").
- **Action bar:** Save draft (Ctrl+S) · **Issue (F10)** — always through the §19.7 confirmation · Issue & print (Ctrl+Shift+F10, same confirmation) · Print / preview (Ctrl+P: prints the current state; drafts carry a DRAFT watermark; Ctrl+P **never** issues) · Issue & send · Convert to… (Ctrl+Shift+C) · More (duplicate, void, credit note, Correct this invoice, installments). Ctrl+Enter never issues (in the grid it inserts a line).
- **Status chip:** "Draft · saved 10:42" / "Issued #INV-2026-00042" / "Part-paid 40 %".
- Advanced fields (landed cost link, FX override, price-scope details, retention, place of supply) behind an "Advanced" expander that remembers its state per user.

### 13.5 Line entry behaviour
- Item cell typeahead over code/name/barcode/alias (FTS5 + prefix), top 8 with stock and resolved price; last option "+ Create item 'xyz'" opens a 3-field inline form (name, unit, price) without leaving the editor (Alt+C also works).
- Numeric cells accept arithmetic (`3*12.5`, `=2*(3.5+4.2)`), parsed by a safe parser (no eval). Grammar: optional leading `=`; numbers in Latin, Arabic-Indic (٠–٩) or Persian digits; decimal separator `.` or the locale's decimal comma (`,` / `٫`), thousands separators accepted only when unambiguous; operators `+ - * / ( )`, unary minus; postfix `%` (÷ 100, so `200*15%` = 30); in BoQ, takeoff and BoQ-lite cells also the safe functions of §15.16; at most 100 characters; result rounded to the column's scale. Errors show inline under the cell ("Unclosed bracket") and keep the typed text. No cell references.
- Multi-row paste (Ctrl+V) of tab-separated data from Excel: columns mapped by a small preview dialog the first time (item code/name, qty, price, optional description/discount), remembered per user.
- Totals recalculated by the core on each change (debounced ~50 ms); UI never computes authoritative totals.
- Warnings (not blockers): price below cost, discount above configured max, quantity above stock (if negative stock allowed), credit limit exceeded.

### 13.6 Numbering, locking, corrections
- Drafts: no number, "DRAFT" watermark on preview/PDF.
- Issue: number + snapshots + hash in one transaction (§11.5).
- Issued: read-only except notes, attachments, payment fields.
- Corrections: **Void** (keeps number, reverses ledger and stock, reason required, allowed only if no allocations and period open) or **Credit note** (pre-filled from the original, full or partial, references original number/date, reason code). **Debit note** for additional charges.
- **Correct this invoice** (users want to "just edit"; available only while the period is open and the invoice is not in a filed tax period): one click creates a full credit note referencing the original **and** a linked, pre-filled new draft (copy of the original), with one sentence: "We cancelled INV-2026-00042 with credit note CN-2026-00007 and opened a corrected copy. Fix it and press Issue." Both are linked in `document_links`; payments allocated to the original move to the new invoice when it is issued (preview first).

### 13.7 Deposits & progress billing in the hub
- `DEPOSIT_INVOICE`: single line "Advance for SO-xxx", with tax only when the pack's explicit flag `tax_on_advances = true` (verify per country; `null` → the user is asked and warned). The final invoice auto-suggests "Less advance" lines (with their tax when the flag is true) for unapplied deposits of the same order/project. Golden tests cover both flag values.
- `PROGRESS_INVOICE` is only created from a certified pay application (§15).

### 13.8 Payments from the hub
- "Mark paid" split button on unpaid rows (§14.4). "Receive payment" from the editor opens the allocation dialog pre-filled with this invoice.

### 13.9 Offline scheduler ("Today" panel)
- On app start and every 15 min while open: generate missed recurring occurrences as **drafts** (catch-up loop with `recurring_runs` uniqueness, never duplicates); mark quotes expired; compute overdue list; refresh Excel queue; run due backups.
- Dashboard "Today" panel: X overdue invoices (total), Y quotes expiring this week, Z recurring drafts to review, Excel files waiting, last backup age, **low stock** (items at or below `reorder_level`), **cheques due** (incoming and outgoing, next 7 days), **installments due or overdue** (§13.13), **cash session left open** (§13.11).
- **Scheduled monthly statements** (optional rule, e.g. "on the 1st of each month"): prepares statement drafts for every customer with a balance → review list → bulk send (email/WhatsApp/print) → snapshots in `statement_runs`. Nothing is sent without review.
- OS notifications via the Tauri notification plugin only while the app runs.

### 13.10 Sending
- **Email:** built-in SMTP (host, port, TLS, user, app password stored in the OS keychain via `keyring`), PDF attached (+ optional XLSX statement), subject/body from `message_templates` (per channel, doc type and language) with placeholders (`{doc_no}`, `{total}`, `{due_date}`, `{company}`); `email_outbox` with retry. Fallback "Open in mail app" via Simple MAPI on Windows.
- **WhatsApp:** generate the PDF into `<user root>\PDF\...`, copy the file to the clipboard (CF_HDROP), open `https://wa.me/<E.164>?text=<urlencoded message from message_templates>`; UI explicitly says "WhatsApp cannot attach files automatically — press Ctrl+V in the chat to attach the PDF." / "لا يرفق واتساب الملف تلقائياً — اضغط Ctrl+V في المحادثة لإرفاق ملف PDF."
- Sending (or printing) sets `documents.sent_at` and `sent_channel`, which drive the "Sent" chip.
- Reminders: 3 levels (friendly / firm / final) with templates; log in `reminders_log`.

### 13.11 Quick sale mode (F12)
- Full-screen editor variant; default party "Walk-in customer" (`excel_mirror = 0`; its sales go to `Reports\Cash sales\Cash sales YYYY-MM.xlsx`, §12.7); scanner input always focused (HID keyboard wedge: code + Enter adds or increments a line); big totals; tender dialog (cash given → change; split cash/card; card stores last 4 digits only); prints 80 mm/58 mm thermal (§17.8) or A4/A5; `CASH_SALE` has its own series; feeds the same ledger, stock and Excel mirror. Optional cash-drawer kick (ESC/POS).
- **Cash sessions:** opening a Quick sale register asks for the opening float (`cash_sessions`); the **X report** (mid-day, no close) and the **Z report / day close** (expected vs counted cash, difference posted to 6900, journal linked) print on thermal or A4 — the same idea as the shift receipt in the existing Aivoro POS. The Today panel flags a session left open longer than 16 h.
- Disabled, with an explanation, when the pack's `pos_fiscalization ≠ none` (§11.8).

### 13.12 Notes, terms, attachments
- Default notes/terms per doc type and language; overridable per party.
- Attachments copied into the content-addressed store; optional "append PDF attachments when sending".

### 13.13 Installments / credit selling (A32)
- Optional per invoice: "Split into installments" → n installments (equal, or custom amounts and dates) stored in `document_installments`; Σ amounts = payable (asserted).
- Allocations fill installments oldest-first; `paid_minor` per installment is updated in the same transaction.
- Aging, reminders and the Today panel use installment due dates when present; statements show the schedule.
- Printing: optional "Installment schedule" section in the template (§17.2).

---

## 14. Payments, accounts & reconciliation

### 14.1 Accounting model
- Hidden double-entry (proven in the founder's existing Aivoro POS demo: 1,736 journal entries netting to exactly 0, integer money, `ref` back-links, a plain-language clearing account "Cash with cashiers" emptied on shift receipt). Keep that model; never show debit/credit in normal screens.
- Immutable journal; void = reversing entry; `lock_date` blocks posting on/before it.

### 14.2 Default chart of accounts (auto-created, `fixed=1`, bilingual)
Users add sub-accounts under **1000/1010** cash drawers and petty-cash boxes (one per box), **1020** banks (one per bank and currency), **1030** card/processor clearing (one per processor), **1040** e-wallets (one per wallet), **4xxx** income and **6xxx** expenses. All other accounts are fixed.
```
1000 Cash drawer / صندوق النقد             1010 Petty cash (one per box: 1011, 1012 …) / صندوق النثرية
1020 Bank (one sub-account per bank: 1021, 1022 …) / البنك
1030 Card & processor settlements (one per processor: 1031 …) / تسويات البطاقات (بانتظار البنك)
1040 E-wallets (one per wallet: 1041 …) / المحافظ الإلكترونية
1100 Customers owe you (AR) / مستحقات على الزبائن
1110 Retention receivable / محتجزات مدينة    1150 Advances to suppliers / دفعات مقدمة للموردين
1200 Inventory / المخزون                    1300 Tax paid on purchases / ضريبة المشتريات
2000 You owe suppliers (AP) / مستحقات للموردين
2100 Tax collected / ضريبة المبيعات المحصلة 2150 Withholding payable / استقطاعات مستحقة
2200 Customer deposits & credits / دفعات وأرصدة الزبائن
2300 Retention payable / محتجزات دائنة      3000 Owner capital / رأس المال
3100 Owner drawings / مسحوبات المالك        3200 Retained earnings (derived, §10.6) / الأرباح المحتجزة
3900 Opening balances / أرصدة افتتاحية
4000 Sales / المبيعات   4100 Services / الخدمات   4900 Other income / إيرادات أخرى
4950 Exchange gain/loss / أرباح وخسائر الصرف
5000 Cost of goods sold / كلفة البضاعة المباعة  5100 Cost adjustments / تسويات الكلفة
6000 Expenses (Rent, Utilities, Salaries, Fuel, …) / المصاريف
6100 Bank & card fees / عمولات البنك والبطاقات
6900 Rounding & cash differences / التقريب وفروقات النقد
```
ASSUMPTION: 1160 Withholding receivable (tax withheld by customers) is added when a pack enables withholding on sales.

### 14.3 Payment accounts
- Any account with `is_payment_account=1`: cash drawers, petty cash, banks (one per bank and currency), card/processor clearing accounts (with `fee_pct`, `fee_fixed_minor`), e-wallets. Each has one currency.
- Each maps to a UNCL4461 payment-means code so linking an invoice to an account fills e-invoice payment blocks automatically.
- **Linking an invoice to an account:** `documents.pay_to_account_code` names the bank or currency account the customer should pay into; its bank name, IBAN/account number and currency print in the payment block, and recording the payment pre-selects that account.
- **Plain-language renames in UI:** AR = "Customers owe you"; AP = "You owe suppliers"; clearing = "Waiting to go to bank".

### 14.4 Record-payment UX (1–2 clicks)
1. **"Mark paid"** split button on every unpaid invoice row and invoice view: one click posts the full balance dated today to the default account (last account used for this party, else method default), followed by a 10-second **Undo** toast. Dropdown: "Part payment…", "Paid with fee…".
2. **Party screen → "Receive money" panel:** amount autofocused; payment accounts as large chips (Cash | Bank-X | Card | Wallet) instead of a dropdown; auto-allocation oldest-first with an editable checklist; leftover shown as "Kept as credit for next invoice" with a toggle "Refund instead".
3. Fee field appears only for processor/card accounts, prefilled from the account's fee settings.
4. Foreign currency: one plain sentence, e.g. "Paid 100 USD × 1,310 = 131,000 IQD. Invoice was booked at 1,300, so a gain of 1,000 IQD is recorded automatically."
5. Status chips: Draft / Sent / Part-paid (progress bar) / Paid / Overdue / Has credit.
6. Suppliers mirror this: Pay bill, Pay several bills, Advance to supplier.
7. Deposits: "Receive deposit" on a quote/order/project; when the invoice is created, a banner asks "Apply 500 deposit to this invoice?" with one [Apply] button.
8. Cheques (ASSUMPTION: common in Iraq/GCC): method `cheque` with number, bank, due date and `cheque_direction`. Incoming: received → deposited → cleared / bounced. Outgoing (paying suppliers): issued → presented → cleared, or cancelled / bounced. Post-dated cheques show in "Cheques due" (incoming) and "Cheques to pay" (outgoing); a bounced incoming cheque reverses the allocation and re-opens the invoice.
9. Card payments store only `card_last4`, `card_auth_code` and `terminal_ref`; a validator rejects anything that looks like a full card number (§21.3).
10. Receipt vouchers (سند قبض) and payment vouchers (سند صرف) get gapless numbers from their own series on post (`payments.series_id`) and print from their own templates.

### 14.5 Posting rules
See Appendix E. Card sale example: `Dr 1030 Processor (net) + Dr 6100 Fee / Cr 1100 AR (gross)`; payout: `Dr 1020 Bank / Cr 1030 Processor`.

### 14.6 Transfers, petty cash, expenses, owner
- Transfers between payment accounts (incl. cross-currency with two amounts; difference → 4950).
- "Quick expense": amount, category (expense accounts with icons and plain names), "Paid from" chips, "Tax included" toggle + rate, optional supplier, receipt photo.
- **Non-recoverable input tax** (e.g. tax the law does not let the business reclaim, or the non-deductible share of a partly exempt business — `document_lines.input_tax_recoverable_pct`, defaulted per category or pack) posts to the expense or asset account, not to 1300 (Appendix E).
- Petty cash: "Top up" (transfer) and "Count cash" (difference → 6900).
- Owner drawings/capital via simple forms.
- Every quick expense, transfer, petty-cash movement, owner drawing/capital and cheque status change is mirrored to Excel (`Expenses YYYY`, `Cash & Bank YYYY`, `Activity YYYY-MM`; Appendix D).

### 14.7 Offline bank reconciliation (Pro)
- **Import formats:** CSV (column-mapping wizard saved per bank: date format, decimal separator, signed amount vs debit/credit columns, header row, encoding incl. Windows-1256 and UTF-8 BOM, Arabic-Indic digits normalized), OFX/QFX, QIF, CAMT.053 (001.02–001.12), MT940.
- **Dedup:** `dedupe_key = ext_id` (OFX FITID; CAMT AcctSvcrRef/EndToEndId) when present, else `sha256(account|date|amount|normalized description|occurrence index in file)`; refuse a re-imported file by `file_sha256`.
- **Matching suggestions:** (a) exact amount, date ±3 days (strong) or ±10 (weak), invoice number regex in description → one-click "Match"; (b) no payment yet but an open invoice's balance equals the amount → "Create payment & match"; (c) lump sum equals the sum of several pending clearing-account receipts → subset-sum over ≤ 30 candidates in the window → "Move to bank (payout)"; (d) fuzzy payee→party (token-set ratio ≥ ~85, tune); (e) user rules ("contains SHELL" → Fuel). ASSUMPTION: windows and thresholds are design proposals; tune with real data.
- Footer: "Statement closing balance vs app balance: difference 0.00". **Finish** enabled only at zero.
- **Parsers (permissive only):** Rust `csv`, `quick-xml` (own ~150-line CAMT.053 mapper: Ntry, Amt, CdtDbtInd, BookgDt, ValDt, AcctSvcrRef, RmtInf), own small OFX SGML/XML reader (evaluate `ofx-rs`), own QIF and MT940 readers. Never bundle ofxtools, ofxstatement or beancount (GPL).

### 14.8 Payment info on invoices
- Settings → "How customers can pay you": bank details (IBAN validated), optional static card/PayPal link, local e-wallet numbers.
- Template payment block prints the `pay_to_account_code` account if set (else the default list), the invoice number as payment reference, plus a QR: EPC/SEPA QR for EUR (EPC is EUR-only), Swiss QR-bill for CH, plain URL QR for a card link. Dynamic per-invoice payment links are an optional online add-on, never required.

### 14.9 Accountant export ("Send to accountant", by date range)
1. One XLSX pack: Chart of Accounts, General Journal (Date, Entry no, Doc ref, Account code, Account name, Party, Description, Debit, Credit, Currency, FX amount, Rate), Trial Balance, AR aging, AP aging (0–30/31–60/61–90/90+), Tax summary, Payments register.
2. Same journal as CSV, UTF-8 **with BOM** (Arabic opens correctly in Excel).
3. Xero manual-journal CSV; 4. QuickBooks Online journal import CSV; 5. QuickBooks Desktop IIF — **ASSUMPTION: verify column templates against the vendors' current documentation before shipping 3–5.**
6. Account-mapping screen (our codes → accountant's codes), saved per accountant.
7. After export, offer "Lock this period" (sets `lock_date`).

### 14.10 Cards (بطاقات): account, item and party cards (A27)
"ربط الفواتير بحسابات وبطاقات" is ambiguous: in Arabic accounting "بطاقة" usually means a **ledger card** (بطاقة حساب، بطاقة صنف، بطاقة زبون), not only a payment card. Build both meanings (payment cards are §14.3–14.5); the cards are cheap queries.
- **(a) Account card** (بطاقة حساب): running ledger of any account — cash drawer (cash book), bank (bank book), card clearing, expense, tax — with Date · Ref · Description · Party · In (debit) · Out (credit) · Running balance, the opening balance for the period, filters, and drill-down from every row to its source document. Guided level labels the columns "In" / "Out".
- **(b) Item card** (بطاقة صنف): per item and warehouse, every movement with running quantity, unit cost and value (receipts, issues, adjustments, transfers, assemblies, landed-cost revaluations) and drill-down; cost columns are owner-only.
- **(c) Party card** (بطاقة زبون / مورد) = the statement (§12.9) with drill-down.
- A **"Card"** button (Ctrl+L) on every account, item and party screen and list row. Cards are report-catalog entries (§17.10), so they get saved layouts and PDF/XLSX export; Cash & Bank account cards are mirrored to `Reports\Cash & Bank YYYY.xlsx` (one sheet per account).

---

## 15. Engineering & contractor module (`projects`, Pro, OFF by default)

> **Evidence note:** no external evidence was gathered for this module; it is built on established QS/contracting practice. Validate workflows with 10–15 contractors/QS users before Phase 17 (see §26). All percentages are editable settings, never hard-coded norms.

### 15.1 Enablement
- Setup wizard question: "Do you work on projects or contracts?" or Settings → Modules → Projects. When off, all menus, tables and Excel sheets of the module are hidden.
- The engineering tables library (§15.16) and BoQ-lite (§15.17) work **without** this module, in every edition, so engineers get useful tables before Pro.

### 15.2 One linked chain (the core design)
`Takeoff → BoQ (rate build-up) → Quotation/Tender → locked Contract BoQ = Schedule of Values → Variations → Payment Applications → Progress Invoices → Retention release`. Every project screen shows this chain as a breadcrumb with counts.

### 15.3 BoQ editor
- Hierarchical tree grid: Bill/Section → Sub-section/Trade → Item; node types section/item/text_note/subtotal; item kinds measured, prelim, provisional (defined/undefined), PC sum (+ attendance/profit), daywork, contingency, lump.
- Columns: Ref · Class code · Description · Qty · Unit · Rate · Amount (+ secondary-language description).
- Keyboard: Enter down, Tab right, **Ctrl+] / Ctrl+[** indent/outdent, Ins new item, Ctrl+Shift+Ins new section, auto-numbered refs per section (editable), F2 edit, Ctrl+D duplicate.
- Quantity cells accept safe arithmetic (`=2*(3.5+4.2)*3`) and the safe engineering functions of §15.16 (e.g. `=rebar_kg(12)*6*24` for 24 bars of 12 mm × 6 m). **Non-goal:** no references to other cells (`=A1*B2` is rejected) — arithmetic only; a BoQ is not a spreadsheet.
- Classification pick-lists: NRM2, POMI, CESMM4, MasterFormat, UniFormat, custom. ASSUMPTION: ship only user-extendable *structures* and short sample lists; full MasterFormat/UniFormat code lists are CSI-copyrighted and need licensing.
- Page totals → collection → bill summary → grand summary in print.

### 15.4 Takeoff (side panel for the selected item)
- Dimension-paper rows: Times · L · W · D · Formula · Sign (±) · Waste % · Qty result; location and drawing ref. Group sum feeds exactly one BoQ item quantity. Deductions are negative rows.
- No on-screen PDF/CAD takeoff (too heavy); import quantities from takeoff tools via CSV/XLSX.

### 15.5 Rate build-up (rate analysis) & rate library
`Unit rate = [Σ materials (qty/unit × unit cost × (1 + waste%)) + Σ labour (hours/unit × gang rate, or gang cost ÷ daily output) + Σ plant + subcontract] × (1 + overhead%) × (1 + profit%) [× (1 + risk%)]`.
- Material lines reference inventory items → reuse dated cost layers, landed cost and FX (`cost_source = live_layer` or frozen `snapshot` with date).
- Personal library of build-ups and labour constants; "Refresh costs to date" shows old vs new rate per item.

### 15.6 Versions & diff
- `boq_versions` kinds: tender, contract, revision; locked versions are immutable.
- "Compare versions" report: added / removed / qty changed / rate changed / Δ amount per line and section (reuses Comparisons). Audit rows on every rate/qty change.

### 15.7 Quotation → Contract
- Tender version prints through the template engine as a Quotation (cover letter, summary, priced bill, terms, tax).
- Marking the quotation **Accepted** clones it to a locked Contract version and materializes `sov_lines` (Schedule of Values).

### 15.8 Variations register
- VO no., date, title, instruction ref (site instruction / RFI / engineer's instruction), status (proposed, submitted, approved, rejected, disputed), claimed, approved, time extension, lines (qty deltas to existing items or new star-rated items). Only **approved** VOs change the contract sum and append SoV lines.

### 15.9 Payment applications (core rule)
- **Store only cumulative to-date values per line.** `this period = to-date − previous CERTIFIED to-date`. Certified apps lock; corrections go into the next app. Certified may differ from applied; the next app uses certified figures as "previous".
- **Two billing modes on one screen:** *percent* (lump-sum SoV: % or value to date) and *quantity* (remeasure: measured qty to date × contract rate). Over 100 %/over-measure shows a yellow warning, not an error.
- Bulk actions: "Set section to X %", "Copy previous", "Fill from takeoff".
- Header (G702-style): original contract sum, net change by approved VOs, contract sum to date, total completed & stored to date, retention (work / stored materials), total earned less retention, less previous certificates, current payment due, balance to finish incl. retention.
- Line grid (G703-style): Item · Description · Scheduled value · From previous · This period · Materials stored · Total to date · % · Balance to finish · Retention.

### 15.10 Deductions engine
- `deduction_types`: Retention (work and stored materials, cap %, two-stage release: practical completion then end of defects period), Advance recovery (% per certificate until recovered), Withholding tax (e.g. UK CIS on labour — verify per pack), Back-charges/penalties.
- Presets (editable): "US AIA-style", "FIDIC-style", "UK JCT-style", "Simple". VAT treatment of retention/advances is configurable (charged when certified vs when released) — **a tax adviser must verify each preset before release.**
- `projects.tax_profile`: `standard` (normal VAT), `reverse_charge_construction` (UK domestic reverse charge for construction services since 2021 — verify; invoice shows "Reverse charge: customer to account for VAT" and no VAT amount), `exempt`, `zero_export`. The profile sets the default tax treatment of the project's quotations and progress invoices.

### 15.11 Accounting & invoicing links
- Certifying an application creates a `PROGRESS_INVOICE` in the hub with lines: Work to date · Less previous · Less retention · Less advance recovery · Tax.
- Postings: `Dr 1100 AR (net due + tax) · Dr 1110 Retention receivable (this period) · Dr 2200 Customer advances (recovery) / Cr 4000/4100 Contract revenue (gross this period) · Cr 2100 Tax`.
- "Release retention" → `RETENTION_INVOICE` (or reclass to AR) later. Receipts allocate against these invoices so the customer statement stays correct.
- Subcontractors reuse the same engine with `direction='inbound_from_sub'`; their retention, applications and back-charges appear on the supplier statement and supplier workbook.

### 15.12 Excel workflows (likely the killer feature — validate)
1. **Price the client's BoQ and return it in the client's exact layout:** import wizard (choose sheet, header row, map Ref/Description/Unit/Qty/Rate/Amount, detect section rows = rows without qty), lock client refs/descriptions (store `client_row_ref`), price in the app, then **export back into a copy of the original file** by writing rates (and amounts if mapped) into the mapped columns of the original rows. Do not reformat the client's file.
   - Mechanism = **zip-level patch** (`rust_xlsxwriter` is write-only and `calamine` reads values only, so neither can round-trip styles): open the `.xlsx` as a zip (`zip` crate); stream-edit only the target `<c>` cells of `xl/worksheets/sheetN.xml` with `quick-xml` (numbers as `<v>`; a formula in a target cell is replaced only if the user chose "replace formulas"; shared strings untouched); delete `xl/calcChain.xml` together with its relationship and content-type entries; set `<calcPr fullCalcOnLoad="1"/>` in `xl/workbook.xml`; copy every other part **byte-identical**.
   - `.xls` and `.ods` client files are refused for this round trip: "Please save the file as .xlsx in Excel and import it again."
2. Clipboard paste of tab-separated rows into the BoQ grid; leading spaces/indent levels become hierarchy.
3. Per-project workbook with real formulas (Amount = Qty*Rate, G703 H = C−G) and a "Generated — edit in app" note, stored at `Customers\<code - name>\Projects\P0003 - <name>.xlsx` with `folder_per_customer`, else `Projects\P0003 - <name>.xlsx` (§12.6).

### 15.13 Other v2 features
- **Material schedule:** Σ(item qty × qty/unit × (1+waste)) grouped by inventory item vs stock and open POs → purchase requisitions. Issuing stock "to project" posts actual cost to the project.
- **Subcontract packages:** value, VOs, applications, retention held, back-charges, insurance/licence expiry alerts.
- **Cost vs budget:** Original · Approved changes · Revised · Committed (POs, subcontracts) · Actual to date · Estimate to complete · Forecast at completion · Variance.
- **Cash flow & S-curves (uPlot):** planned value (SoV spread: linear/front/back/S), certified value (apps), actual cost; cash-in shifted by certification + payment days minus retention; cash-out by PO/subcontract terms; net cash line showing the funding gap.
- Optional later: bar-bending schedule (BS 8666 shape codes — verify edition), door/room-finish schedules as typed tables.

### 15.14 Print templates (Typst gallery)
Priced BoQ (page totals carried to collection & summary) · Quotation/Tender summary · Progress application "G702/G703 format" (no AIA logos or form text — AIA documents are copyrighted) · Interim Payment Certificate (FIDIC style) · Simple progress invoice · Variation order form · Retention release invoice.

### 15.15 Numeric rules
- Money as minor units; quantities up to 3–4 decimals (6 max). Rounding policy per project: `round_line_then_sum` or `sum_then_round`; the same rule is used on screen, PDF and Excel.

### 15.16 Engineering tables & calculators (all editions; light)
- Table `eng_tables(id, uid, name_i18n, columns_json, rows_json, source_note, is_builtin)`; built-in tables ship as small JSON files in `assets/eng-tables/` (a few KB): rebar mass (kg/m = d²/162, d in mm), a small subset of common steel sections (mass per metre; ASSUMPTION: subset chosen with users), material densities, unit conversions, concrete/mortar mix ratios (by volume), block/brick/tile/paint coverage per m². **Every built-in value is marked "verify" and shows its source** (`source_note`: a standard and edition, or "common practice — verify locally"). Users copy a built-in table to edit it, or add their own.
- UI: Engineering tables screen (view, search, copy a value, add or import/export a table as XLSX) and a small calculator side panel usable from any numeric cell.
- Safe functions in BoQ, takeoff, BoQ-lite and line-grid arithmetic (§13.5): `rebar_kg(d_mm)`, `lookup("<table>", "<row key>"[, "<column>"])` (e.g. `=lookup("Densities","Steel")*0.2`), `area_circle(d)`, `vol_cyl(d, h)`, `conv(value, "<from>", "<to>")`. Pure functions over the tables, decimal math; no cell references, no user scripts.

### 15.17 BoQ-lite (Starter; early v1)
- A QUOTE in "BoQ mode": one or two levels (section → item) using the `section` and `subtotal` line kinds; columns Ref · Description · Unit · Qty (arithmetic + §15.16 functions) · Rate · Amount; section subtotals and a summary page in print.
- Accept → INVOICE (in full) or **percent-based progress invoices**: each `PROGRESS_INVOICE` line stores `progress_pct_to_date` against its source quote line (`source_line_id`); this invoice = to-date − previously invoiced (the §15.9 cumulative rule), with optional retention % and "less advance" lines; over 100 % warns.
- Upgrade path: a BoQ-lite quote converts into a full project (Pro) without retyping.

---

## 16. Official documents & letters ("الكتابات الرسمية والحكومية")

### 16.1 Template catalog (≈40 built-in Typst templates in 5 groups; all bilingual-capable, RTL-mirrored)
| Group | Templates |
|---|---|
| **Commercial** | Quotation · Proforma ("not a tax invoice") · Sales order · Delivery note (with/without prices) · Tax invoice · Simplified tax invoice / cash receipt · Export commercial invoice (HS codes, Incoterms, origin) · Packing list · Credit note · Debit note · Purchase order · Goods received note · Supplier bill voucher |
| **Vouchers & statements** | Receipt voucher (سند قبض) · Payment voucher (سند صرف) · Journal voucher (سند قيد) · Statement of account (كشف حساب) · Balance confirmation letter (مصادقة رصيد) · Payment reminder ×3 levels · Cheque handover receipt (ASSUMPTION) |
| **HR certificates** | Salary certificate (شهادة راتب) · Experience certificate (شهادة خبرة) · To whom it may concern (إلى من يهمه الأمر) · No-objection certificate (عدم ممانعة) · Offer letter · Warning letter (إنذار) · End-of-service settlement (تسوية نهاية خدمة) · Payslip (simple, no payroll engine) |
| **Authorities & banks** | Letter to tax authority (registration change, clarification, objection, tax clearance request) · Bank letter (guarantee / LC request) · Authorization letter (تفويض) · Power of attorney cover (توكيل) · Undertaking (تعهد) · Customs clearance authorization |
| **Contracting & tenders** | Tender cover letter · Technical & financial offer cover · Priced BoQ · Bid-bond / performance-bond request · Award acceptance · Interim payment certificate (مستخلص) · Variation order · Site instruction · Handover certificate · Completion certificate · Retention release request |

ASSUMPTION: Iraqi-government-specific letter formats (e.g. letters to the General Commission for Taxes) were not researched; ship generic formal-letter structure and let users save their own variants.

**Letters-lite (MVP, Phase 8b)** — letters are a founder priority, so the first release ships: outgoing and incoming registers plus 8 templates — formal letter, to whom it may concern (إلى من يهمه الأمر), salary certificate (شهادة راتب), experience certificate (شهادة خبرة), authorization letter (تفويض), receipt voucher (سند قبض), payment voucher (سند صرف), balance confirmation (مصادقة رصيد). The rest of the catalog follows in Phase 16.

### 16.2 Letter structure (Arab official convention)
Letterhead (brand) · **العدد / No.** (from the register) · **التاريخ / Date** (Gregorian + optional Hijri, Umm al-Qura) · **الموضوع / Subject** · recipient block · salutation · body (structured fields + free text) · closing · signature block (name, title) · stamp image · cc list · attachments list. English layout mirrors the same fields LTR.

### 16.3 Letter register (سجل الصادر والوارد)
- Outgoing and incoming registers per year with prefix and automatic numbering on **Issue**, using `letter_registers.pattern` (same tokens as §10.5) and the numbering high-water mark (§10.5).
- Incoming letters record the sender (`sender_party_id` or `sender_text`), their reference number and date (`external_ref_no`, `external_ref_date`), `received_at`, the scan (`scan_asset_id`) and, for an outgoing reply, `reply_to_letter_id`. The cc list (`cc_json`) and the attachments list (`attachments_list_json`) print on the letter.
- Issued letters are immutable and chained in the global `document_events` chain (§11.5); PDF archived.
- Search by number, date range, subject, recipient.

### 16.4 Template fields & helpers
- Placeholders from data: company, party, person (`people`), document, project; e.g. `{person.name}`, `{person.job_title}`, `{person.hire_date}`, `{person.salary | money | words}`.
- **Amount in words** (tafqeet): own Rust module; Arabic with correct gender agreement (3–10), dual forms and currency names/subunits ("دينار عراقي" / "فلس", "ريال سعودي" / "هللة", "درهم إماراتي" / "فلس", "دولار أمريكي" / "سنت"); English words. Clean-room implementation (port logic ideas, not code, unless the source license is verified permissive). Golden tests for 0, 1, 2, 3–10, 11–99, hundreds, thousands, millions, decimals.
- **Hijri dates:** Umm al-Qura conversion table (clean-room or vetted permissive crate; verify).
- **Signers** (`signers`): name and title per language, signature and stamp images (PNG with transparency, stored as BLOBs inside the company file); "print without stamp" option.
- Issuing a letter **with** stamp and signature requires the permission `letters.issue_with_stamp` (owner and manager by default) and writes a dedicated audit event `letter.issued_with_stamp` (who, which signer, letter number).

### 16.5 Letter editor ("rich-but-safe" text)
- Allowed formatting only: paragraphs, bold, italic, underline, bulleted and numbered lists, alignment (start / center / end / justify), one simple table (no merged cells), and placeholders (`{person.name}` chips inserted from a field picker). No fonts, colours, images or HTML: pasted content becomes plain text.
- Stored as a JSON AST in `letters.body_ast_json`, e.g. `{"type":"doc","children":[{"type":"p","align":"start","children":[{"type":"text","text":"…","marks":["bold"]},{"type":"field","path":"person.name"}]},{"type":"list","ordered":false,"items":[…]},{"type":"table","rows":[[…]]}]}`. The generator passes the AST as data (§17.1) and the fixed Typst template renders it, so text is never concatenated into markup.
- Editor: in-house, ≤ 30 KB gz, `contenteditable` constrained to the AST; no editor library larger than 30 KB gz.
- Each letter template declares `fields_json`: `[{key, label_i18n, type ∈ text | multiline | date | number | money | party | person | select, required, default, options?}]`; the form shows these fields above the body. Example (salary certificate): `person` (person, required), `addressee` (text, default "To whom it may concern"), `purpose` (text), `show_salary` (select yes/no), `salary_in_words` (derived).
- Letters-lite ships the 8 templates of §16.1 with their `fields_json` in `assets/letters/lite/`.

---

## 17. Report/template designer & theming

### 17.1 Architecture
- One template model and one renderer: **JSON layout schema (stored in SQLite) → small Rust code generator → Typst markup → Typst engine → PDF** (and PNG/SVG for preview). The user never sees a template language. Optional "Advanced: edit generated Typst" mode (Pro, power users), stored as an override with a warning.
- **Injection-safe generation (MUST):** the generator emits a **fixed** Typst template per (template version, printable kind); all data — names, descriptions, notes, letter bodies, custom fields — goes in as a virtual JSON file (`/data.json`, read with `json("/data.json")`, or via `sys.inputs`) that conforms to the print data contract (Appendix I). User strings are **never** concatenated into Typst markup. The Typst World serves only virtual files (template, data, images by id) plus bundled fonts and assets: no filesystem access, no packages, no network. Fuzz acceptance: party names and notes containing `# $ * _ @ < ] \` or `#read("/etc/passwd")` render literally and never break the layout.
- Same output on every OS; ~20–100 ms per document; the preview IS the PDF.
- Fallback if the team switches to web rendering: compile the same JSON to HTML/CSS (MiniJinja), preview in webview, print via platform PrintToPdf (WebView2 `PrintToPdfAsync`; enable backgrounds, set `@page` size). Expect per-OS differences.

### 17.2 Template schema (sketch; normative fields)
```json
{
  "doc_type": "INVOICE", "name": "Bilingual Classic", "gallery_id": "bilingual-classic", "version": 3,
  "paper": { "size": "A4", "w_mm": 210, "h_mm": 297, "orientation": "portrait",
             "margins_mm": { "top": 14, "bottom": 16, "start": 14, "end": 14 } },
  "locale": { "primary": "ar", "secondary": "en", "layout": "side_by_side",
              "digits": "latn", "amount_in_words": true, "hijri_date": false },
  "theme": { "use_brand": true, "accent": "brand.primary",
             "brand_override": { "primary_hex": null, "secondary_hex": null },
             "font_body": "brand.font_arabic",
             "font_size_pt": 9.5, "zebra": true, "header_style": "band" },
  "sections": [
    { "kind": "header", "visible": true, "props": { "logo": "start", "logo_max_h_mm": 22, "show_tax_ids": true } },
    { "kind": "title", "props": { "size_pt": 16 } },
    { "kind": "parties" }, { "kind": "meta" },
    { "kind": "lines" }, { "kind": "totals", "props": { "amount_due_size_pt": 13, "amount_due_weight": "bold" } },
    { "kind": "tax_summary", "visible_if": { "all": [ { "field": "totals.tax_minor", "op": ">", "value": 0 } ] } },
    { "kind": "amount_words" }, { "kind": "qr", "props": { "source": "pack" } },
    { "kind": "dual_currency_total", "visible_if": { "all": [ { "field": "document.dual_currency", "op": "not_empty" } ] } },
    { "kind": "installment_schedule", "visible": false },
    { "kind": "payment_block" }, { "kind": "notes" }, { "kind": "terms" },
    { "kind": "signature_stamp" }, { "kind": "footer", "props": { "page_x_of_y": true } }
  ],
  "table": {
    "columns": [
      { "field": "line_no", "label": { "ar": "#", "en": "#" }, "width_pct": 5, "align": "center", "visible": true },
      { "field": "description", "label": { "ar": "الوصف", "en": "Description" }, "width_pct": 43 },
      { "field": "qty", "label": { "ar": "الكمية", "en": "Qty" }, "width_pct": 10, "align": "end", "format": "qty" },
      { "field": "unit_price", "label": { "ar": "السعر", "en": "Unit price" }, "width_pct": 14, "format": "money" },
      { "field": "tax_rate", "label": { "ar": "الضريبة", "en": "VAT" }, "width_pct": 8 },
      { "field": "net", "label": { "ar": "المبلغ", "en": "Amount" }, "width_pct": 20, "format": "money" }
    ],
    "repeat_header": true, "carry_forward_subtotal": true, "continued_label": true,
    "summary_only": false, "show_line_numbers": true
  },
  "header_footer": { "first_page": { "show_full_header": true }, "other_pages": { "compact_header": true } },
  "free_elements": [
    { "id": "el-free-1", "kind": "free", "page": "first", "x_mm": 150, "y_mm": 40, "w_mm": 45, "h_mm": 8,
      "content": { "type": "field", "path": "document.reference" }, "font_size_pt": 10, "color": "#1F4E79",
      "visible_if": { "all": [ { "field": "document.reference", "op": "not_empty" } ] } }
  ],
  "preprinted": { "enabled": false },
  "custom_fields": ["document.site_ref", "line.vehicle_reg"]
}
```
- **Colours:** any element's `color` / `fill` accepts a design token (`brand.primary`, `text.muted`, …) **or any hex colour** (`#RRGGBB`); the designer warns when text contrast on white paper is below 4.5:1 or a colour is likely to vanish in grayscale printing. `theme.brand_override` replaces the company brand colours for this template only.
- **Visibility rules** (`visible_if`): JSON AST `{ "all" | "any": [ rule | group, … ] }`, rule = `{ "field": <print-contract path>, "op": "=" | "≠" | ">" | "≥" | "<" | "≤" | "empty" | "not_empty", "value"?: … }` (ASCII aliases `!=`, `>=`, `<=` accepted). Fields come only from the print data contract (Appendix I); rules are evaluated in Rust before generation, never as Typst code.
- **Free elements** (`kind: "free"`): absolutely placed boxes `{x_mm, y_mm, w_mm, h_mm, page: first | all | last, content: field | text | image | line | box}` anywhere on the page, in addition to the structured sections.
- **Pre-printed paper mode** (`preprinted.enabled`): prints only field values (no rules, logos, labels or backgrounds) at their positions, shifted by the per-printer x/y calibration offset (`printer_calibrations` in machine.db). A calibration page prints a millimetre grid.
- **Portable templates:** export/import as `.adtemplate` (zip of `template.json` + referenced images and fonts with their license notes); import always creates a new template, never overwrites.
- `TemplateAssignment { doc_type, party_id?, branch_id?, template_id, is_default }` — default per type, overridable per customer/branch.
- **Versioning:** templates are copy-on-write; editing a used template creates version N+1. Every issued document stores `template_id + template_version + pdf_sha256` (and the PDF asset), so later edits never change issued tax documents.
- **Never auto-migrate** user templates on upgrade; new designs arrive as new gallery entries.

### 17.3 Gallery (ships with MVP: 4; v1: 8)
Classic · Modern · Minimal · Bold header · Bilingual Arabic/English · Contractor/BoQ · Thermal receipt 80/58 · Formal letter · Cheque (v1, custom paper, pre-printed mode) · Report (one generic table template with brand header, used by every report, §17.10). One-click **"Apply my brand"** (logo + colors + fonts) and **"Reset to gallery default"**.

### 17.4 Designer UX (structured editor, not a blank canvas)
- **Left panel:** sections list (toggle, drag to reorder) and table columns (toggle, drag, width % slider, label per language, alignment, format).
- **Center:** true rendered preview (150 ms debounce), white paper even in dark mode; page navigator; zoom.
- **Right inspector:** selected element: font family, size, weight, colour (token or any hex, with contrast warning), alignment, padding, visibility rules (visual rule builder over the `visible_if` AST: field picker from Appendix I · operator · value; e.g. "show only if discount > 0").
- Click an element in the preview → selects it in the inspector. Mechanism (Phase 0 spike, A26): the generator wraps every element in a labelled box (`<el-ID>`); after compilation the renderer queries Typst's introspector (`query` / `locate` on each label) for page, position and size, converts them to pixel **hit boxes** at the preview DPI, and returns them alongside the preview PNG. The UI hit-tests clicks against these boxes (topmost wins). Free elements can be dragged; a drag updates `x_mm` / `y_mm` (1 mm snap) and re-renders.
- **Pre-printed paper & cheques:** "Print on pre-printed paper" toggle; a calibration wizard per printer (print grid → enter measured offset); a cheque template with custom paper size, payee, date, amount in figures and in words (tafqeet) and optional crossing lines.
- **Export / import template** (`.adtemplate`) for sharing designs between companies or PCs.
- Buttons: "Test with sample data", **"Test with 60 lines"** (see multi-page behaviour), "Preview in English/Arabic", "Duplicate template", "Set as default for…".
- Fixes for top complaints: per-element font size/weight; custom TTF/OTF upload (stored as attachment, subset at embed time; license reminder); logo with free aspect ratio, max-height slider, position start/center/end (mirrors in RTL), 2× DPI upload guidance; A4 default outside US/Canada (Letter there); repeated table header, "continued" and carried-forward subtotal; different first/other page header/footer; optional line numbers; "hide line details / show summary only" per document.

### 17.5 Bilingual & Arabic rules
- Bundle subset fonts: Noto Naskh Arabic or Amiri + Noto Sans/Inter (OFL). Never rely on system fonts.
- `#set text(lang: "ar")` (or `"en"`) per document/block; wrap numbers, IBANs, invoice IDs, emails as LTR runs.
- Primary Arabic → automatic mirroring of layout (logo side, alignment, table column order).
- Bilingual layouts: `single`, `stacked` ("فاتورة ضريبية / Tax Invoice" on two lines), `side_by_side` (two-column labels).
- Every printable label stored as `{ar, en, ...}`; missing translation falls back to primary with a designer warning.
- ASSUMPTION/verify in Phase 0: Typst handling of kashida justification and complex RTL tables; if poor, disable justification for Arabic paragraphs.

### 17.6 Paper sizes
| Size | Dimensions | Notes |
|---|---|---|
| A4 | 210 × 297 mm | default outside US/CA |
| Letter | 215.9 × 279.4 mm | default in US/CA |
| A5 | 148 × 210 mm | receipts/vouchers |
| Thermal 80 | 80 mm wide, auto height | printable ≈ 72 mm = 576 dots @ 203 dpi |
| Thermal 58 | 58 mm wide, auto height | printable ≈ 48 mm = 384 dots @ 203 dpi |
| Custom | w × h mm | letterhead paper, pre-printed forms, cheques (size per bank; per-printer calibration offset) |

### 17.7 Printing
- "Print" opens the generated PDF in the OS default viewer (works everywhere). Windows direct print to a named printer: Phase 13 (community plugin or own small plugin); never rely on `window.print()` (no-op on macOS Tauri).
- Optional "ink saver / grayscale" print toggle.
- Ctrl+P = print/preview the current state (DRAFT watermark on drafts); it never issues a document (Appendix A).

### 17.8 Thermal receipts
- Template type `receipt` with width 80/58 mm and `height: auto` (Typst `set page(width: 80mm, height: auto)`), render PNG at 576/384 px, dither to 1-bit, send ESC/POS `GS v 0` raster in bands, then feed and cut; optional cash-drawer kick. Transport: USB (Windows spooler RAW), serial, or network (port 9100). Never depend on printer code pages for Arabic. Test with an ESC/POS emulator (e.g. escpresso).

### 17.9 App theming & the Appearance screen (design tokens)
- Semantic CSS custom properties: `--bg, --surface, --surface-2, --text, --text-muted, --border, --focus, --accent-1 … --accent-12, --danger, --warning, --success, --info, --zebra, --selection, --grid-line, --row-h, --radius, --font-ui, --font-num`.
- **Palette generator:** from one picked colour, generate 12-step light and dark scales in OKLCH (Radix-style roles: 1–3 backgrounds, 4–5 interactive bg, 6–8 borders, 9–10 solid fills, 11–12 text). Auto-check WCAG contrast (4.5:1 text, 3:1 large text/UI borders); if a pair fails, nudge lightness and show a small "adjusted" badge.
- **Appearance screen (Settings → Appearance; MVP, all editions):**
  - **8 preset themes:** Light, Dark, True-black (OLED), High contrast light, High contrast dark, Low vision (bold text, 125 % text, stronger borders and focus ring), Warm paper (soft sepia), Calm blue — plus *System* (`prefers-color-scheme`). ASSUMPTION: preset names and colours.
  - **Accent colour** picker (swatches + hex) and a **"Use my brand colour"** toggle that takes the accent from the company Brand (the research recommended linking app and brand colours; the user may unlink).
  - **Advanced overrides** (expander): success, warning, danger, info, zebra rows, selection and grid lines — each with a live contrast check against its background and **auto-adjust** (lightness nudge, badge when adjusted).
  - **Density** (Comfortable 44 px / Compact 32 px rows; app-wide, never mixed on one screen), **text scale 90–150 %**, **UI font** (system Segoe UI or a bundled family), **bold text**, **reduce motion**.
  - **Live preview panel**: a mini grid (zebra, selection, negative amount), primary/secondary buttons, every status chip, a screen banner and a small dialog — updates instantly.
  - **Reset to default**, **Export theme** / **Import theme** (JSON: preset id + overrides; validated and contrast-checked on import).
  - Changes apply **instantly without restart** and persist per profile (`user_ui_prefs.theme_json`, `accent_hex`, `use_brand_accent`, `font_scale`, `ui_font`, `bold_text`, `reduced_motion`, `density`).
- **Status is never shown by colour alone** (WCAG 1.4.1): every chip and badge has an icon and text (e.g. "⚠ Overdue", "✓ Paid").
- Per-user UI theme (app.db) is separate from per-company **Brand** (logo light/dark, primary, secondary, fonts, stamp, signature). Printed documents always use Brand (or the template's brand override) on white paper; the app's dark theme never reaches PDFs.
- Brand colors also style Excel headers (§12.8) so mirror and PDFs match.
- **Acceptance:** random-colour contrast tests pass for every token pair in light and dark; status chips stay distinguishable in a grayscale screenshot; at 150 % text on a 1366×768 screen every MVP screen has no clipped text and no horizontal page scroll in forms, and the line grid still shows # · Item · Qty · Price · Net without horizontal scrolling at comfortable density (or collapses lower-priority columns as documented).

### 17.10 Report builder (customizable reports — "تخصيص لشكل التقارير")
- **Catalog:** `assets/reports/catalog.json` defines every built-in report: `{ id, title_i18n, query_id (a Rust query function — never user SQL), params, columns: [{ field, type: text | number | money | qty | date | percent | bool, label_i18n, default_visible, owner_only }], filters: [{ field, kind: date_range | party | item | category | account | warehouse | branch | project | currency | status | text }], groupable: [fields], totals: [fields], default_sort, default_layout }`. `owner_only` columns are removed in the core for other roles.
- **Built-in reports:** Sales by customer / item / period · Profit & margin (owner) · **Profit & Loss — "How much did I make"** · **Balance sheet — "What I own and owe"** (plain language; retained earnings derived, §10.6) · Cash-flow summary (money in/out by category and account) · AR aging · AP aging · Statement (party card) · Item movement card · Stock valuation at a date · Account card / Cash book / Bank book · Expenses by category · VAT summary · Price list · Customer list · Letter register · Project cost vs budget · Pay-application summary · Low stock · Cheques due · Installments due.
- **Layouts:** `report_layouts` (§9.2 N) store columns (visible, order, width %, label override per language, alignment, format), filters, grouping (≤ 2 levels), sort, totals, chart (none | bar | line), page (paper, orientation, margins, repeat header) and branding (use brand, title per language, header/footer text). A layout is personal (`profile_uid`) or shared (NULL); one layout per report may be the default.
- **UX:** filter bar + virtualized grid (screen output) + a "Layout" side panel: column chooser (checkboxes, drag to reorder, width), sort by clicking headers, filters, "Group by" (Pro), "Chart" (Pro), "Save as…" ("My layout"), "Reset to default". Every row drills down to its source document or card.
- **Outputs:** screen grid; **PDF** through **one** generic Typst table template (`REPORT` kind) with the brand header, repeated table header, group subtotals and grand totals; **XLSX** via `rust_xlsxwriter` (Table, frozen header, totals row with cached results). Screen, PDF and XLSX totals come from the same core totals (asserted equal).
- **Keep it light:** no user-written SQL, no pivot engine, no formula language; queries are paginated (keyset) and run on read connections or in the worker.
- **Editions:** Starter = column chooser, sort, filter, saved layouts, PDF/XLSX. Pro adds grouping, charts and branded report headers.
- **Acceptance:** change columns, grouping and sort, save as "My layout", restart, reopen → identical; print A4 landscape with the logo; PDF totals = XLSX totals = screen totals; with the `large` fixture every report opens paginated with p95 ≤ 1 s.

### 17.11 Barcode labels (v1)
- Item labels with Code128 or EAN-13 (check digit validated), name and optional price (from a chosen price scope and date), on A4 label sheets (rows × columns, margins, gaps; presets for common sheets — ASSUMPTION) and on thermal printers (raster ESC/POS, §17.8). Printable kind `LABEL`; permissive barcode crate only (verify license, §5.1).

---

## 18. Onboarding & in-app help system

### 18.1 Principles (from NN/g, Microsoft, Fluent, GOV.UK guidance)
- No forced up-front tour. Contextual "pull" help first; proactive "push" help must be easy to dismiss.
- One banner per screen and one proactive popover at a time (others wait in a queue). In `smart` reminder mode at most 3 proactive hints per session; in the default `always` mode task hints are exempt from that cap (§18.4).
- **Founder rule (A28, overrides the research default):** a task alert keeps appearing **every time** the task starts until the user presses "Don't show again" — at the start of the task or after finishing it (§18.6).
- Tip copy: users read ~3–5 words before deciding → title ≤ 5 words + one sentence.
- Tips never contain information required to finish a task; tips are not for errors.
- "Don't show again" is reversible (global "Reset all tips", like Photoshop's "Reset All Warning Dialogs").
- Setup warnings dismissed without fixing come back next session (Fluent rule).

### 18.2 Hint catalog (`src/help/hints.catalog.json`, versioned, shipped in the bundle)
```json
{
  "catalog_version": 7,
  "hints": [
    {
      "hint_id": "screen.hub.banner",
      "kind": "screen_banner",
      "screen_id": "hub",
      "trigger": "on_screen_open",
      "version": 2, "reshow_on_major_update": false,
      "priority": 10, "max_shows": 9999, "cooldown_hours": 0,
      "audience": "all", "severity": "info",
      "title_key": "hint.hub.banner.title", "body_key": "hint.hub.banner.body",
      "learn_more_doc": "hub#overview", "shortcut_hint": "Ctrl+N",
      "features": [
        { "id": "hub.new", "title_key": "feat.hub.new.title", "body_key": "feat.hub.new.body",
          "shortcut": "Ctrl+N", "show_me_anchor": "[data-hint=new-split]", "edition": "all", "module": null },
        { "id": "hub.convert", "title_key": "feat.hub.convert.title", "body_key": "feat.hub.convert.body",
          "shortcut": "Ctrl+Shift+C", "show_me_anchor": "[data-hint=convert]", "edition": "all", "module": null },
        { "id": "hub.mark_paid", "title_key": "feat.hub.markpaid.title", "body_key": "feat.hub.markpaid.body",
          "shortcut": "Ctrl+M", "show_me_anchor": "[data-hint=mark-paid]", "edition": "all", "module": null }
      ]
    },
    {
      "hint_id": "task.invoice.create.paste",
      "kind": "task_hint", "screen_id": "editor", "task_id": "invoice.create",
      "trigger": "on_task_start", "anchor": "[data-hint=lines-grid]",
      "version": 1, "reshow_on_major_update": false,
      "priority": 50, "max_shows": 3, "cooldown_hours": 24,
      "audience": "all", "severity": "info",
      "title_key": "hint.paste.title", "body_key": "hint.paste.body",
      "show_me_tour": ["[data-hint=lines-grid]", "[data-hint=paste-mapping]"],
      "shortcut_hint": "Ctrl+V"
    },
    {
      "hint_id": "setup.tax.missing_rate",
      "kind": "setup_warning", "screen_id": "*", "trigger": "on_condition",
      "condition": "tax.no_default_rate", "severity": "warning",
      "title_key": "hint.tax.missing.title", "body_key": "hint.tax.missing.body",
      "action": { "label_key": "action.open_tax_settings", "route": "/settings/tax" }
    }
  ]
}
```
`kind ∈ { screen_banner, task_hint, coachmark, empty_state, whats_new, setup_warning }`; `trigger ∈ { on_screen_open, on_task_start, on_first_field_focus, on_repeated_error, on_condition }`; `audience ∈ { guided, standard, all }`.
- Task hints use `audience: "all"`, so Standard-level users see them too. `max_shows`, `cooldown_hours` and auto-retirement apply to task hints only in `smart` mode (§18.4).
- `features` (banner hints only) is the **complete** list of the screen's features and the single source for the banner's "All features on this screen (N)" expander and for the screen's F1 page; it is filtered at runtime by edition and enabled modules.
- `condition` names must exist in the condition registry (§18.13).

### 18.3 State model
Tables `hint_state` and `user_ui_prefs` in `app.db` (§9.1), keyed by `profile_uid` (so backups/company switches don't reset tips; multiple people on one PC keep their own state).

### 18.4 Eligibility rule (`HintManager.shouldShow(hint)`) — MUST
Show only if ALL hold:
1. banners: enabled for the user's `help_level` and `show_screen_banners`; task hints: `show_task_hints = 1` and `task_reminder_mode ≠ 'off'` (help level does not suppress task hints);
2. NOT (`dismissed_forever=1` AND (`dismissed_version ≥ hint.version` OR NOT `reshow_on_major_update`));
3. `seen_count < max_shows`;
4. `task_completed_count < 2` (auto-retire after the task succeeded twice) — task hints only;
5. `now > snoozed_until` and cooldown elapsed;
6. no other proactive popover is visible — otherwise the hint is **queued** and shown when the visible one closes, if still relevant;
7. fewer than 3 proactive hints shown this session.

**`task_reminder_mode = 'always'` (default, A28):** for `kind = task_hint`, rules 3, 4, 5 and 7 do **not** apply — the hint appears on every start of its task until "Don't show again" (rule 2). Rules 1, 2 and 6 still apply.
**`task_reminder_mode = 'smart'`:** all seven rules apply (the research-based behaviour). **`off`:** no task hints.
Pick the eligible hint with the highest `priority`.
**Exception:** `kind = setup_warning` can never be dismissed forever; it can be snoozed for the session and reappears until its `condition` is false.
**Acceptance:** in `always` mode the task hint appears on the 10th start of the same task (also after two completions and within 24 h), two popovers are never visible at once, and the hint never appears again after "Don't show again" (pressed at the start or in the completion toast).

### 18.5 Per-screen description banner (the "شرح فوق كل قائمة")
- Exactly one per screen, under the toolbar, above content; never modal; never stacked.
- Layout: (i) icon · **bold title (2–5 words)** · 1–2 lines (≤ ~25 words) describing what the screen does and its 2–3 key features · "Learn more (F1)" · "Don't show again" · ✕.
- ✕ collapses to a one-line strip "(i) About this screen" for the session. "Don't show again" sets `dismissed_forever=1, dismissed_version=hint.version`.
- **"All features on this screen (N)"** expander inside the banner (collapsed by default; state remembered per screen): one line per entry of the hint's `features` list — title, one-sentence description, shortcut chip and an optional "Show me" (2–3-step Driver.js highlight of `show_me_anchor`). The list is filtered by edition and enabled modules, so N is always accurate.
- A permanent (i) "About this screen" button in the screen header reopens the banner with the expander open (pull help).
- The screen's F1 page is **generated** from the same `features` list plus hand-written task steps, so banner and help never disagree.
- CI test: every command registered for a screen (command registry and palette entries scoped to that `screen_id`) appears in that screen's `features` list, with `title_key` and `body_key` present in both `ar` and `en`.
- **Dialogs and wizards** get no banner; they get a one-line subtitle under their title that cannot be dismissed (Appendix H).
- Help level: *Guided* = full banner; *Standard* = auto-collapses to the strip after 3 views; *Expert* = only the (i) button.
- Must use a visual style distinct from interactive controls (tinted surface, info icon, different weight), and an ARIA `role="note"`; only one banner so screen readers don't read several.

### 18.6 Task-start hint (the "ينبهه عليها من يريد يسوي شغل")
- Fired via the UI event bus, e.g. clicking "New invoice" emits `ui.emit('task:start', { task: 'invoice.create' })`; completing it emits `task:complete` → `task_completed_count++`.
- One anchored, **non-modal** popover (Teaching-Tip style) that never steals focus from the first input; Esc closes.
- Copy: title ≤ 5 words + one sentence + related shortcut.
- Buttons: **Got it** (`seen_count+1`) · **Don't show again** · optional **Show me** (2–3 step Driver.js mini-tour, never more).
- **Completion toast (MUST):** on `task:complete`, if that task's hint was shown in this session, show a non-modal success toast for 6–8 s (pauses on hover or focus; `role="status"`): "Done — INV-2026-00042 issued · [Don't show this tip again]" / "تم — صدرت الفاتورة INV-2026-00042 · [لا تُظهر هذه النصيحة مرة أخرى]". The link sets `dismissed_forever = 1` on **every** hint with that `task_id`. Test: complete a task after its hint → toast → click → the hint never appears again for that task, and "Reset all tips" restores it.
- Every task in Appendix H has exactly one start emitter (UI event) and one completion emitter (the domain event that proves success, e.g. `document.issued` for the same draft uid).

### 18.7 Empty states (best onboarding surface)
Each empty list shows: one line on what the list holds and why it matters · primary action with shortcut ("New customer · Ctrl+N") · secondary "Import from Excel" · tertiary "Add sample records". While loading show a skeleton — never "No customers" before the query finishes.

### 18.8 First run
1. **Welcome:** "Create my company" · "Explore with a sample company" · "Restore a backup".
2. **Setup wizard (max 4 steps):** (1) language, country (loads pack) and numerals; (2) company name, logo, tax ID; (3) base currency and tax regime preset (VAT/GST/sales tax/none) with plain-language e-invoicing note from the pack; (4) invoice numbering pattern and theme color (live preview of an invoice). "Skip for now" allowed on steps 3–4 (creates a `setup_warning`).
3. **Dashboard "Get started" checklist (6 items, collapsible, hideable, never gates features):** ☑ Company created (pre-ticked; endowed progress) · Add your first customer · Add or import items from Excel · Set prices (customer-specific, from a date) · Create your first invoice · Customize your invoice look · Choose backup & Excel folders. Expect low completion (vendor benchmark avg ~19 %); that is fine.
4. **Sample company:** separate `demo.adb` with a permanent "DEMO — sample data" banner and watermark on PDFs, one-click "Switch to my company", never mixed with real data. Contains ~40 customers, 15 suppliers, 120 items (incl. one BOM, landed-cost shipment in USD), 300 documents across 12 months, one project with BoQ and 3 payment applications (if Pro/trial).

### 18.9 Global controls
Settings → **Help & tips**: Help level (Guided / Standard / Expert) · Show screen descriptions · Show task hints · **Reset all tips** (`UPDATE hint_state SET dismissed_forever=0, seen_count=0, collapsed=0, snoozed_until=NULL, task_completed_count=0 WHERE profile_uid=?`; set `hints_reset_at`) · "Reset tips for this screen" from the (i) menu · Help menu "Show all tips for this screen". After an update: one "What's new" banner, re-showing only hints flagged `reshow_on_major_update`.

### 18.10 F1 help
- Help pages are authored in Markdown (`docs/help/{ar,en}/<screen_id>.md`) plus the generated feature lists (§18.5), **pre-rendered to HTML at build time** with a **prebuilt search index** (no Markdown parser or indexer at runtime), shown in a side panel; task-focused, step-by-step, short. Each banner's "Learn more" deep-links to its anchor. Arabic search normalizes alef/hamza forms, taa marbuta/haa and yaa/alef maqsura, and ignores diacritics.

### 18.11 Copy guidelines (MUST for every hint/banner)
- Plain words; no accounting jargon in Guided level (say "Customers owe you", not "Accounts receivable").
- Title ≤ 5 words; body one sentence (task hint) or ≤ 25 words (banner body, naming ≤ 3 key features). The complete feature list lives in the banner's expander (§18.5), one line per feature.
- Start with a verb or the benefit; include the shortcut where relevant.
- Never critical info, never errors, never marketing.
- Write Arabic natively (not word-for-word translation) in plain **Modern Standard Arabic** — no dialect in the `ar` catalog or on anything printed; dialect is allowed only in an optional `ar-IQ` (or other regional) overlay for UI strings (A30). Keep numbers/shortcuts LTR.
- Review: every new screen ships with banner copy in both languages in the same PR.

### 18.12 Required screen banners (initial copy; refine in implementation)
This is the initial subset; **every** screen in Appendix H needs a banner, a complete `features` list and an F1 page. All Arabic copy is Modern Standard Arabic.

| Screen | Title (EN / AR) | Body (EN / AR) |
|---|---|---|
| Dashboard | Your business today / عملك اليوم | See overdue invoices, expiring quotes, Excel status and backups at a glance. / اطّلع على الفواتير المتأخرة وعروض الأسعار القريبة من الانتهاء وحالة إكسل والنسخ الاحتياطي بنظرة واحدة. |
| Invoice Hub | All your sales documents / جميع مستندات البيع | Create quotes, orders, delivery notes and invoices, then convert each to the next with one click. / أنشئ عروض الأسعار والطلبات وسندات التسليم والفواتير، ثم حوّل كل مستند إلى التالي بنقرة واحدة. |
| Document editor | Fast invoice entry / إدخال سريع للفاتورة | Type to find items, paste lines from Excel, and Issue when ready. Drafts save automatically. / اكتب للبحث عن الأصناف، والصق الأسطر من إكسل، ثم اضغط «إصدار». تُحفظ المسودة تلقائياً. |
| Customers | Customers & balances / الزبائن وأرصدتهم | Each customer has their own prices, statement and Excel folder. / لكل زبون أسعاره وكشف حسابه ومجلد إكسل خاص به. |
| Suppliers | Suppliers & bills / الموردون وفواتيرهم | Track what you buy, what you owe and supplier prices over time. / تابع مشترياتك والمبالغ المستحقة عليك وأسعار الموردين عبر الزمن. |
| Items | Materials & products / المواد والمنتجات | Stock, units and real costs for every item. / المخزون والوحدات والكلفة الحقيقية لكل صنف. |
| Prices | Prices by date / الأسعار حسب التاريخ | Set a price for everyone, a price list, or one customer — starting from any date. / حدّد سعراً للجميع أو لقائمة أسعار أو لزبون واحد، ابتداءً من أي تاريخ. |
| Payments | Money in and out / المقبوضات والمدفوعات | Every payment is linked to invoices, so balances and statements stay correct. / كل دفعة مرتبطة بفواتيرها، فتبقى الأرصدة والكشوفات صحيحة. |
| Card settlements | Waiting for the bank / بانتظار البنك | Card money waits here until the payout arrives; fees are recorded automatically. / تبقى مبالغ البطاقات هنا حتى تصل إلى البنك، وتُسجَّل العمولة تلقائياً. |
| Bank reconciliation | Match your bank statement / طابِق كشف البنك | Import your bank file and match each line in one click. Finish when the difference is zero. / استورد ملف البنك وطابِق كل سطر بنقرة واحدة، وأنهِ المطابقة عندما يصبح الفرق صفراً. |
| Statements | Customer statements / كشوفات الحساب | Running balance and aging per customer, as PDF or Excel. / رصيد جارٍ وأعمار ديون لكل زبون، بصيغة PDF أو إكسل. |
| Inventory & costing | Real costs / الكلفة الحقيقية | Costs follow purchase dates, shipping and exchange rates, so profit is real. / تتبع الكلفة تاريخ الشراء والشحن وسعر الصرف، فيكون الربح حقيقياً. |
| BOM / recipes | Recipes & assemblies / الوصفات والتجميع | Build products from materials and see their cost on any date. / ركّب المنتج من مواده واعرف كلفته في أي تاريخ. |
| Templates | Your document design / تصميم مستنداتك | Pick a design, add your logo and colors, and preview the real PDF. / اختر تصميماً، وأضف شعارك وألوانك، وعاين ملف PDF الحقيقي. |
| Tax settings | Taxes / الضرائب | Rates and rules for your country. Issued invoices keep the rules they were issued with. / النسب والقواعد الخاصة ببلدك. تحتفظ كل فاتورة صادرة بالقواعد التي صدرت بها. |
| Letters | Official letters / الكتب الرسمية | Certificates and formal letters with number, date, stamp and signature. / شهادات وكتب رسمية بالعدد والتاريخ والختم والتوقيع. |
| Projects | Projects & contracts / المشاريع والعقود | BoQ, variations, progress claims and retention in one linked chain. / جداول الكميات وأوامر التغيير والمستخلصات والمحتجزات في سلسلة واحدة مترابطة. |
| Excel folder | Your Excel copy / نسختك في إكسل | Every operation is copied to Excel, with a folder per customer. Close a file in Excel to let it update. / تُنسخ كل عملية إلى إكسل، مع مجلد لكل زبون. أغلق الملف في إكسل ليُحدَّث. |
| Settings → Backup | Keep your data safe / حافظ على بياناتك | Automatic daily backups; copy them to a USB drive or cloud folder. / نسخ احتياطي يومي تلقائي؛ انسخه إلى ذاكرة USB أو مجلد سحابي. |

### 18.13 Hint condition registry (`src/help/conditions.ts` + core queries)
Every `condition` used by a `setup_warning` or conditional hint MUST be registered with its evaluation trigger; an unknown name fails the catalog test. Parameterized conditions use `name:<param>`; the registry declares the parameter type and default. Conditions are evaluated only at the listed triggers (no polling faster than the scheduler's 1/min).

| Condition | True when | Evaluated |
|---|---|---|
| `tax.no_default_rate` | the company is tax-registered (§11.4) but has no default sales rate | company open; tax settings saved |
| `tax.registration_missing` | the pack has VAT but `company_tax_registrations` is empty | company open; end of setup wizard |
| `pack.unverified` | the active pack has `verified: false` | company open; pack import |
| `fx.missing:<ccy>` | an open draft or today's work uses `<ccy>` with no rate for its date | draft currency/date change; first start of the day |
| `backup.age_gt_days:<n>` | the last verified backup is older than n days (default 7) | start; scheduler tick |
| `backup.last_verify_failed` | the last backup failed `integrity_check` | after each backup |
| `excel.root_unreachable` | the Excel root is missing or not writable (USB removed, permissions) | start; on write error |
| `excel.root_synced` | the Excel root is inside a sync-client folder | start; root change |
| `excel.failed_jobs` | dead-letter Excel jobs exist | after each job failure |
| `company.no_logo` | the brand has no logo | template screen open; first issue |
| `company.recovery_code_unconfirmed` | the owner never confirmed saving the recovery code (§6) | start (owner only) |
| `einvoice.deadline_lt_hours:<n>` | a submission's reporting deadline is within n hours | scheduler tick |
| `cash_session.open_gt_hours:<n>` | a cash session has been open longer than n hours (default 16) | start; scheduler tick |
| `numbering.behind_hwm` | a series is behind its high-water mark (§10.5) | company open; restore |
| `license.trial_days_left_lt:<n>` | the trial ends within n days | start |
| `stock.below_reorder` | at least one item is at or below `reorder_level` | after stock moves (debounced); start |

---

## 19. Usability rules (MUST unless an ADR says otherwise)

1. The three most frequent actions of each screen are one click (or one shortcut) away; "New invoice" is reachable from anywhere (Ctrl+N in hub, Ctrl+Shift+N globally).
2. Every action has a keyboard path; shortcuts are shown in menus, tooltips and the command palette.
3. Line grids: arrows move between cells **visually** (in RTL, ← goes to the cell on the screen's left), Tab/Shift+Tab follow logical order, Enter moves next (or down per setting), multi-row paste from Excel works everywhere a grid exists. Acceptance test in LTR and RTL.
4. Create masters inline (Alt+C or "+ Create …" in pickers) without leaving the document.
5. Universal Search (§19A) is the primary way to go anywhere: Ctrl+K, Ctrl+Shift+P, `/` outside inputs, or the prominent search button in the top bar (Ctrl+K inside rich text inserts a link instead). It finds sections, actions, records, settings and help, not only data.
6. One save model per form: drafts autosave (3–5 s and on blur) with visible status; financial documents need explicit Issue/Post.
7. Undo instead of "Are you sure?" for reversible actions (toast 8–10 s); confirmation dialogs only for irreversible actions (issue, close period, delete company); bulk destructive actions require typing the name. Issue (F10, Ctrl+Shift+F10 or the button) always confirms: "Issue this invoice? Its number becomes final." — Enter = Issue, Esc = back.
8. Issued documents: void or credit note with mandatory reason; never delete.
9. Validate on blur; live checks only for duplicates, tax-ID format and negative stock; error summary at top on failed Issue with links to fields.
10. Never show an error before the user typed; confirm fixes immediately.
11. Smart defaults: effective-dated price auto-filled with its source shown; last tax code carried over; FX rate for the document date with a warning chip if missing; last payment account per party.
12. Progressive disclosure: core fields first; advanced behind an expander that remembers state; whole modules hidden until enabled.
13. Empty states teach (one line + primary action + import).
14. No information needed to finish a task inside tooltips or banners.
15. Density app-wide (comfortable/compact), never mixed on one screen.
16. Appearance per §17.9: 8 presets incl. high-contrast and low-vision, accent or brand colour, advanced colour overrides with contrast check; text scale 90–150 %, verified on 1366×768.
17. Full RTL mirroring with logical CSS; numbers/codes LTR-isolated; numerals setting.
18. Focus ring ≥ 2 px, never hidden; targets ≥ 24×24 px; contrast AA.
19. One main window with tabs (cap ≈ 12; views of tabs inactive > 5 min unmount, state kept in stores — §6); restore open tabs and scroll positions on restart (ASSUMPTION).
20. Lists remember filters/sorting per user (saved views); "Reset view" available.
21. Status always visible: Excel queue chip, backup age, license state, offline indicator not needed (always offline-capable).
22. Long operations (>300 ms) show progress and are cancellable; the UI never freezes.
23. Messages say what happened and what to do next, in plain language, in the user's language.
24. Numbers right-aligned (end-aligned) in grids with consistent decimals per currency; negative amounts in red with a minus sign.
25. Dates displayed in the user's locale; date inputs accept typed shortcuts (`t` today, `+7`, `-1m`) (ASSUMPTION).
26. Never change layout or shortcuts between versions without an ADR and a "What's new" note.
27. Print preview = the PDF; printed documents always white.
28. Every list exportable to Excel/CSV with the current filter.
29. Owner-only information (cost, margin, other users' activity) never leaks into prints, exports to customers, non-owner roles — or the Excel mirror, which bypasses roles (§12.1, §21.1).
30. Every screen ships with a row in the screen registry (Appendix H): banner copy and a complete `features` list (ar/en), empty state, F1 page, `task_ids` with start and completion emitters, keyboard paths tested, RTL screenshot reviewed. Dialogs and wizards ship with a one-line subtitle. CI enforces the registry.
31. Shortcuts bind by physical key (`KeyboardEvent.code`) and work under Arabic and Kurdish keyboard layouts.

---

## 19A. App shell layout & Universal Search (founder decision, MUST)

### 19A.1 Top-centered navigation (no sidebar by default)
- One top bar, height 52 px (44 px in Compact density). Layout, mirrored automatically in RTL via logical properties:
  `[logo + company name]  ·  [centered pill-shaped segmented nav: Home | Invoices | Customers | Suppliers | Materials | Costing | Reports | More ▾]  ·  [🔍 Search Ctrl+K]  [🔔]  [⚙️]  [👤]`
- Max 7 primary sections + "More ▾"; everything else is reached via Universal Search. Edition/module flags hide sections that are off.
- Active section: filled soft-accent pill + accessible `aria-current="page"`. Sections with sub-areas open a dropdown on click and show secondary tabs under the bar inside the section (e.g. Invoices: Quotations · Orders · Delivery notes · Invoices · Credit notes · Receipts).
- Responsive: below 1280 px width labels collapse to icons with tooltips; below 1024 px "More ▾" absorbs the trailing sections.
- Settings option `nav_position: top | side` (default `top`) for users who prefer a sidebar; both render from the same section registry.
- Rationale: business screens are wide grids; a top bar costs ~52 px of height instead of ~220 px (≈16 %) of width on a 1366×768 laptop, and a centered bar needs no left/right flip between Arabic and English.

### 19A.2 Use the full screen
- **Focus Mode** (F11 or ⛶ button): hides the top bar; it slides back when the pointer touches the top edge or on Alt. Remembered per screen type (e.g. Invoice editor, BoQ).
- Top bar shrinks to 40 px while scrolling down long grids, restores on scroll up.
- Detail/preview panels are slide-over drawers (close with Esc), never permanent columns.
- Grids show extra columns (margin, stock left) automatically on wide screens and hide secondary columns on narrow ones; Compact density setting.
- Any document can be popped out to its own OS window (multi-monitor), e.g. invoice on one screen, customer statement on the other.

### 19A.3 Universal Search: make it the hero element
Visual prominence (MUST):
- The search button is the most visible control in the top bar: wider than any nav item (min 220 px on ≥1280 px screens), rounded, filled with the accent-tinted surface, magnifier icon, placeholder "Search anything…" / "ابحث عن أي شي…", and a `Ctrl K` keycap chip. On narrow widths it collapses to a round accent icon button, never hidden.
- Home screen additionally shows a large centered search field ("What do you want to do?") above the KPIs.
- First-run hint (§18) points at it: "Type anything — a section, a customer, or an action like ‘new invoice’."
- Opening: Ctrl+K, Ctrl+Shift+P, `/` when focus is not in an input, or click. Opens a centered overlay (Spotlight-style, 640 px wide, max 60 % viewport height) with backdrop dim, 120 ms fade/scale animation (respects reduced-motion). Esc closes and restores focus.

What it searches (grouped results, in this order, max 5 per group with "Show all"):
1. **Sections & screens** (from the Appendix H screen registry): typing `suppliers`, `موردين`, `الموردون`, `مجهز` → Suppliers screen.
2. **Actions/commands** (from the shortcut/command registry): `new invoice`, `فاتورة جديدة`, `record payment`, `قبض` → runs the action; shortcut shown at the right.
3. **Records**: customers, suppliers, items, documents by number/name/phone/tax ID, projects, letters. Each result shows a secondary line (balance, status, date).
4. **Settings** (every setting has a registry entry with keywords): `tax`, `ضريبة`, `dark mode`, `الوضع الليلي`.
5. **Help**: hint/banner/F1 topics; `how to return an invoice` → explains credit note + button "Create credit note".

Parameterized commands: `invoice Ahmed` / `فاتورة أحمد` → new invoice with customer preselected; `statement Ahmed` / `كشف أحمد` → opens that customer's statement; `item 12mm` → item card. Selecting a record and pressing Tab opens its action menu (New invoice, Statement, Call/WhatsApp, Edit).

Matching rules (MUST, implemented in Rust, shared normalizer for index and query):
- Arabic normalization: strip tashkeel and tatweel; أ إ آ ٱ → ا; ة → ه; ى → ي; ؤ → و; ئ → ي; Arabic-Indic and Persian digits → ASCII; case-fold Latin.
- Synonym dictionary `src/search/synonyms.{ar,en}.json` per section/action/setting (e.g. Suppliers: مورد، موردين، الموردون، مجهز، مجهزين، بائع، vendor, supplier). Mixed-language queries allowed.
- Typo tolerance: prefix match + trigram/Damerau-Levenshtein ≤ 1 for tokens ≥ 4 chars (`فاتوره`, `فتورة` → فاتورة).
- Ranking = text score × type weight + recency/frequency boost (per-user `search_usage(target_id, count, last_used_at)` in app.db) + exact-prefix bonus. Owner-only data and records the user lacks permission for are never returned.
- Empty query shows: Recent (last 8 opened), Pinned/Favorites, and the 5 most-used actions.

Implementation & performance budgets:
- Records indexed with SQLite FTS5 (`unicode61 remove_diacritics 2` + the normalizer applied before indexing) in the company DB; sections/actions/settings/help indexed in memory from the registries at startup.
- Index updates in the same transaction as the record change.
- Budgets: overlay visible ≤ 50 ms after shortcut; results ≤ 50 ms p95 per keystroke with the `large` fixture (100k documents, 20k customers); no network ever.
- Fully keyboard-driven: ↑/↓ move, Enter open, Ctrl+Enter open in new tab, Tab action menu, Alt+1..5 jump to group. Screen-reader: combobox + listbox roles, result count announced.

### 19A.4 Acceptance criteria
1. Top bar renders centered nav in both AR (RTL) and EN (LTR) with no layout flip of the nav order logic; active state visible; works at 1024, 1366, 1920 px widths.
2. Search button is visibly the most prominent top-bar control (design review checklist) and is never hidden at any width.
3. Typing `الموردون`, `موردين`, `مجهز`, `supplier` each returns the Suppliers screen as the first result.
4. `فاتوره جديده` (ه instead of ة, typo-normalized) runs New invoice; `كشف أحمد` opens Ahmed's statement.
5. `ضريبه` returns the Tax settings entry; `how to return an invoice` returns the credit-note help item with its action button.
6. p95 per-keystroke latency ≤ 50 ms on the `large` fixture on the reference 4 GB Windows 10 machine.
7. Focus Mode hides the bar and restores it; setting `nav_position: side` switches to a sidebar without restart.

---

## 20. Performance budgets & how to test them

Budgets are in §3.2. Measurement is part of every phase; results go to `docs/PERF.md` (table per phase, machine spec, date).

### 20.1 Reference machines
- **Ref-Low:** Windows 10 22H2 x64, 4 GB RAM, SSD, 4-core CPU ≥ 2016, 1366×768 — the budget machine (VM acceptable: 2 vCPU, 4 GB).
- **Ref-HDD (gated):** Windows 10 22H2 x64, 4 GB RAM, 5400/7200-rpm HDD, Intel Core i3 of about 2015 (2 cores / 4 threads), 1366×768 — typical hardware in the target markets. Gate: cold start ≤ 4 s (target 3 s), warm start ≤ 1.5 s, backup on close never blocks exit > 3 s; other budgets recorded.
- **Ref-Mac (v2):** macOS 12+, 8 GB.

### 20.2 Fixtures
- `scripts/gen-fixtures` creates deterministic company files: `small` (500 docs), `medium` (20k docs), `large` (250k documents, 2M lines, 50k items, 20k parties, 5k customers with statements). Includes Arabic and English names, mixed currencies, BOMs, projects. `large` also concentrates one year's 2M lines (to test sheet roll-over and monthly splits), has a walk-in customer with 100k cash sales, and is used for the initial mirror build of 20k parties.

### 20.3 How to measure
| Metric | Method |
|---|---|
| Installer / installed size | CI step `scripts/check-size.ps1` fails the build above hard limits; prints delta vs previous release. |
| Cold/warm start | App records `t0` (process start from OS) and emits `app:interactive` when the dashboard is usable; `measure-perf.ps1` launches 10× after reboot/cache flush (cold) and 10× warm, reports median and p90. |
| Idle memory | After 60 s idle on dashboard with `large` fixture: sum `PrivateMemorySize64` of the app process and all `msedgewebview2.exe` children of it (PowerShell `Get-CimInstance Win32_Process` parent-tree). Median of 5. |
| Peak memory | Sample every 250 ms during: 5,000-invoice statement export, 60-line PDF render, bank import of 10k lines. |
| Idle CPU | 5-minute sample average with app idle. |
| UI latency | In-app instrumentation (`performance.now()` from keydown to next animation frame) logged in a dev build; p95 over scripted 500-keystroke session. |
| Engine timings | Rust `criterion` benches: pricing resolution, tax calc (100-line doc), FIFO issue, posting, statement (5k rows), aging, Excel build (50k cells), Typst render (3 pages). |
| Scroll | Dev overlay FPS meter while scrolling 100k-row list; record min fps. |
| Tabs / minimized memory | Open 10 typical tabs on `large`, wait 60 s, sum private bytes; minimize for 60 s and sum again. |
| Excel mirror | Initial build of `large` (wall time, files/min, keypress p95 during the build); one monthly master rebuild (time, peak memory); Excel folder size on disk. |
| DB & backups | Company file size per 100k documents; backup duration on close and in the background on Ref-Low and Ref-HDD; backup folder size after 30 simulated days. |
| Bundle | Vite build report: gz size of the initial chunk (shell + dashboard) and of each route chunk. |

### 20.4 Gates
- CI (Windows runner): size check (hard), engine benches (regression > 20 % fails), unit/integration tests.
- CI also fails on bundle-size hard limits and on installer growth > 300 KB without an ADR (§5.2).
- Release candidate: run on Ref-Low **and Ref-HDD** with the `large` fixture; any hard-limit breach blocks release.

### 20.5 Techniques to stay within budget
- Keyset pagination; covering indexes; FTS5 for search; `ANALYZE` after imports.
- Virtualized lists and grids; no layout thrash; CSS containment.
- Lazy-load screens (route-level code splitting): initial JS (shell + dashboard) ≤ 150 KB gz and each screen chunk ≤ 60 KB gz (ASSUMPTION; measure); uPlot, Driver.js, the template designer, the report chart view and the BoQ editor load on first use.
- WebView2 `MemoryUsageTargetLevel = Low` when minimized or idle; tab cap and view unmounting (§6).
- Master Excel reports split by month and rebuilt with a ≥ 60 s debounce or on idle; `constant_memory` above 50k rows; stale files rebuilt lazily (§12.3).
- Typst world cached (fonts loaded once, templates compiled once per version).
- One renderer and one Excel writer at a time; bounded queues.
- No timers faster than 1/min when idle; event-driven workers.

---

## 21. Security, licensing & activation

### 21.1 Local security
- Tauri capabilities: minimal; fs plugin scoped to app data, export folders and user-chosen files; no shell plugin; strict CSP; no remote content; `dangerousRemoteDomainIpcAccess` never used.
- Roles & permissions enforced in the core (each command checks `member.role` / `permissions_json`). Owner-only fields filtered server-side.
- Optional PIN per member (argon2id); auto-lock after N minutes idle (setting).
- Audit log append-only (triggers) with hash chain; integrity check tool.
- Secrets (SMTP password, connector keys) in the OS keychain (`keyring`), never in SQLite or logs.
- Signed artifacts: updates (Tauri updater signature, mandatory), country packs (Ed25519), license tokens (Ed25519).
- Optional company-file encryption at rest (SQLCipher) — v2, ASSUMPTION (size/licensing to evaluate).
- Logs local only, rotating, no customer data beyond IDs; "Export diagnostics" creates a zip the user can choose to send.
- **The Excel mirror bypasses roles:** anyone with access to the Excel folder — including a cashier using the same Windows account — can read every customer's workbook. Settings → Excel says so in plain words and suggests a folder only the owner's Windows account can read. Cost, margin, salary and national ID are never mirrored; the owner-only `_Owner` reports subfolder is off by default (§12.6).
- Permission `letters.issue_with_stamp` (owner/manager by default) guards issuing letters with stamp and signature; each such issue is audited (§16.4).

### 21.2 Licensing model (ASSUMPTION: research did not cover activation; validate MoR APIs before Phase 9)
- **Purchase:** Lemon Squeezy (Merchant of Record) issues a license key; checkout collects country (preselects pack) and edition. (Paddle alternative requires our own key issuance.)
- **Merchant of record check (A29, possible blocker):** before Phase 9, verify that the merchant of record accepts an Iraq-based seller and can pay out to Iraq (Stripe/PayPal coverage); if not, a company or bank account in another jurisdiction is needed.
- **Online activation:** app sends the key to the MoR license API (activate instance) and then to a tiny vendor "license signer" function (serverless, stateless; full specification in Appendix J) that re-validates the key and returns an **Ed25519-signed token** (canonical JCS form, Appendix J):
  `{ v:1, kid, key_hash, edition:"pro", major:1, licensee_hash, instance_id, machine_hint, issued_at, updates_until, addons:[] }`.
  The app verifies the token offline with the embedded public key on every start. No further network needed, ever.
- **Offline activation:** app shows an **Activation Request Code** (Base32 of `{key_hash, machine_hint, nonce}`) + QR. The user opens the activation page on any device, pastes the code, receives a **Response Code** (the signed token, Base32/QR), pastes it back.
- **Machine binding (soft):** `machine_hint` = hash of OS machine GUID + install salt; up to 3 activations per key (ASSUMPTION); self-service deactivate on the activation page; tolerant to hardware changes (token stays valid; re-activation only on OS reinstall). The license is stored machine-wide (`machine.db`, §9.1), so every Windows user of the PC shares one activation.
- **Trial:** 14 days full Pro features, stored in app.db plus a hidden marker; after expiry: drafts allowed; issuing new legal documents blocked until activation (ASSUMPTION — founder decision); **viewing, printing existing documents, exporting, Excel mirror and backups always work.**
- **Updates entitlement:** `updates_until` (12 months for the major version). After it, the app keeps working; the updater shows "New major version available (paid upgrade)".
- **No phone-home** after activation, no kill switch, no telemetry.

### 21.3 Privacy & personal data
- Data-protection laws (EU GDPR, UK GDPR, KSA PDPL and others — verify per market) apply to the user's customer, supplier and staff data. Everything is local, so the user is the controller; the app must make compliance easy:
  - **Per-party personal-data export:** JSON + PDF summary of everything stored about one party or person (master data, documents list, letters, attachments).
  - **Anonymization** of archived persons and parties after the legal retention period (pack `retention_years`; `null` → never): names, contacts, addresses and national IDs become "Anonymized #id"; frozen document snapshots are kept while the law requires the issued document to be retained, then redacted. Every anonymization is audited.
  - **Privacy notice** (Help → Privacy): what is stored locally, that nothing leaves the PC except the network uses in §3.1, and how to export or delete data.
- The `people` table (salary, national ID, HR data) is readable only by **owner and manager** roles (core-enforced) and is excluded from the Excel mirror.
- **Payment cards:** never store full card numbers. Only `card_last4`, `card_auth_code` and `terminal_ref`. A validator rejects any payment, document or note text containing a Luhn-valid 13–19-digit card number: "Do not type full card numbers; keep only the last 4 digits."
- Logs and diagnostics contain no personal data beyond IDs (§21.1).

---

## 22. Backups & data safety

- **Live DB location:** local app data only. Warn and offer "Move to safe folder" if the company file sits in OneDrive/Dropbox/iCloud/Google Drive or a network share; if the user insists, switch to `journal_mode=TRUNCATE`.
- **Automatic backups:** `VACUUM INTO` (small files) or the `sqlite3_backup` **step API** in the background (large files) into `Backups\<Company>\<slug>-YYYYMMDD-HHMM.adb`: daily (first start of the day, in the background), before every schema migration and before restore/import operations.
- **On close:** back up only if the company changed since the last backup **and** the estimated duration (file size ÷ measured throughput) is under 3 s; otherwise mark "backup due" and run the step-API backup in the background at the next start. Closing never blocks for a backup longer than 3 s (§3.2; a ~1 GB file on an HDD would take 30–60 s).
- **Bundle contents:** each backup is the `.adb` (brand assets and fonts live inside it as BLOBs, §9.2 Q) plus a manifest of attachment hashes; attachments are **always** included, copied once into `Backups\<Company>\attachments\<sha256>` (content-addressed and shared by all backups). Warn when attachments exceed 2 GB (ASSUMPTION) and show their size.
- **Compression & cap:** compress backups with zstd (ASSUMPTION; measure the installer-size cost in Phase 0 — if > 300 KB, skip compression and rely on the cap). Total backup disk use is capped (default 5 GB or 10 % of free space, whichever is smaller; configurable): when exceeded, prune the oldest backups first (always keeping the newest daily, weekly and monthly), then unreferenced attachments.
- **Rotation:** keep 7 daily, 4 weekly, 12 monthly (configurable), always subject to the cap.
- **Verification:** run `PRAGMA integrity_check` on each new backup; mark failures loudly.
- **Backup folder** may be in a synced folder or USB (each backup is a closed file). Its default root follows the OneDrive rule in §12.6.
- **Restore:** pick a backup → preview (company name, date, document counts) → restore into a new file (never overwrite the current one silently) → numbering high-water-mark check (§10.5) → "Rebuild Excel files" (lazy, with progress, §12.3).
- **Status:** dashboard shows last backup age; warning chip if > 7 days or last verification failed.
- **Crash safety:** WAL + `synchronous=FULL`; editor autosave table for unsaved drafts; on restart offer "Recover unsaved draft".
- **Disaster recovery doc:** `docs/help/*/backup.md` explains restore and moving to a new PC (copy the backup folder, or use "Export company bundle" = `.adb` + attachments + the `.hwm` sidecar).

---

## 23. Import wizard & exports

### 23.1 Import wizard (Excel `xlsx/xls/ods` via calamine, CSV)
Steps: **(1) Choose what to import** (customers, suppliers, items, prices, opening balances (AR/AP/stock), BoQ, bank statement) → **(2) File & sheet** → **(3) Header row** (auto-detect) → **(4) Column mapping** (auto-match English/Arabic header synonyms, e.g. "Name/الاسم", "Price/السعر", "Qty/الكمية"; saved as reusable profile) → **(5) Preview & validation** per row (type errors, duplicates, unknown units/categories with "create" option, negative numbers, date formats) → **(6) Dry run summary** ("312 new, 14 updated, 3 errors") → **(7) Import** in one transaction → **(8) Report** (downloadable XLSX with row-level errors) + **Undo import** for 7 days if records are untouched.
- Encoding detection: UTF-8 (with/without BOM), UTF-16, Windows-1256 (Arabic), Windows-1252.
- Number parsing: decimal separator detection, thousands separators, Arabic-Indic digits (٠١٢٣٤٥٦٧٨٩) and Persian digits normalized, currency symbols stripped.
- Dates: detect common formats; ambiguous `dd/mm` vs `mm/dd` asks once.
- Matching existing records by code first, then exact name (configurable).
- Prices import supports scope (all / price list / party code) and `valid_from/valid_to`.
- Paste-from-Excel into grids uses the same parsing rules.
- Client BoQ files that must be returned "in the same layout" must be `.xlsx` (§15.12).
- Migration helpers (v1, ASSUMPTION): presets for exports from QuickBooks, Xero, Zoho, Daftra, Wave (customer/item lists).

### 23.2 Exports
- Any list → XLSX/CSV (current filter/columns). CSV = UTF-8 with BOM.
- Documents → PDF (single/bulk), UBL/CII/Factur-X (Pro).
- Statements → PDF/XLSX (single/bulk per customer).
- Accountant pack (§14.9).
- **Full data export** (data portability): ZIP of JSON per table + schema description + attachments; plus the raw `.adb` file.
- Per-party personal-data export (§21.3).
- Excel mirror (§12) is continuous and separate from on-demand exports.

---

## 24. Testing strategy

| Layer | What | Tools |
|---|---|---|
| Unit (Rust) | money, rounding, pricing, tax (all modes), FIFO/avg, landed cost, BOM, numbering, posting templates, allocation, aging, tafqeet, Hijri, TLV QR, sanitizers | `cargo test` |
| Property-based | every journal entry balances; Σ allocations ≤ payable; aging total = closing; inclusive tax payable = displayed gross; FIFO qty conservation; category-mode tax = Σ parts within 0 minor units | `proptest` |
| Golden | tax vectors per country pack (incl./excl., mixed rates, doc discounts, charges, withholding, credit notes); PDFs rendered to PNG and compared (perceptual diff tolerance); Excel workbooks read back with calamine and asserted cell-by-cell; ESC/POS raster bytes | `tests/golden/` |
| Integration | commands via the API layer against temp company files; migrations from every released schema version (fixtures kept forever) | `cargo test --features it` |
| UI unit | components (grid keyboard map, banner/hint eligibility, palette), i18n completeness (no missing keys in ar/en), RTL snapshot | Vitest + Testing Library |
| E2E | critical flows on Windows: first run → invoice → payment → statement → Excel file exists; quote→order→delivery→invoice partial; import 1k customers; lock file during export; backup/restore | WebdriverIO + `tauri-driver` |
| Visual regression | key screens LTR/RTL, light/dark, comfortable/compact | screenshots in E2E |
| Excel lock matrix | §12.11 items; on CI use a helper process that opens the file with no share flags to simulate Excel | Windows runner |
| Validators | KoSIT (XRechnung), Peppol BIS 3 schematrons, ZATCA SDK, veraPDF (PDF/A-3) | optional CI job (Java) |
| Fuzz | CSV/XLSX import parser, OFX/CAMT/MT940/QIF parsers, arithmetic cell parser, Typst data JSON, letter AST, visibility-rule AST, xlsx zip patcher | `cargo-fuzz` |
| Injection | Typst data passing: names/notes containing `# $ * _ @ < ] \` and Typst code render literally | `tests/injection/` + golden PDFs |
| Registry & traceability | every route has an Appendix H row (ar/en banner, `features`, F1 page); every task has start and completion emitters; every screen command is in its `features`; every mutating command has Excel targets or `#[no_excel]`; every Appendix K row has a tagged test | `check-registry.ts`, `check-traceability.ts`, Rust registry test |
| Keyboard layouts | shortcuts under Arabic (101) and Kurdish layouts; visual arrow movement in RTL grids | E2E with the layout switched |
| WebView2 | F5 / Ctrl+R never reload; Ctrl+P never opens Chromium print; no browser context menu, autofill or zoom | E2E |
| Performance | §20 | criterion + scripts |
| Accessibility | axe-core on screens; manual NVDA pass per release | axe, NVDA |
| License audit | every dependency against Appendix G | `cargo-deny`, `license-checker` |

Coverage targets: engines ≥ 90 % lines; services ≥ 75 %; UI critical components ≥ 70 % (ASSUMPTION).

---

## 25. Packaging, signing & auto-update

### 25.1 Windows packaging
- NSIS installer, **per-user install (no admin)** — verify the Tauri NSIS `installMode: "currentUser"` option in Phase 0. Start-menu shortcut, file association for `.adb` (open company) (ASSUMPTION).
- `webviewInstallMode: embedBootstrapper` (default build) + "Offline installer" build with `offlineInstaller`.
- Missing-WebView2 detection with a clear native message and link to the offline installer.
- Uninstaller never deletes user data (company files, backups, Excel folders); offers "Open data folder".
- The license is stored machine-wide in `%ProgramData%\AivoroDesk\machine.db`, writable without admin.
- The e-invoicing add-on (ZATCA Phase 2, Peppol) is a separate signed download installed into the app's add-on folder; the base installer never contains its crypto (§5.2).

### 25.2 Code signing
- Windows: OV code-signing certificate on a hardware token or cloud HSM (Sectigo, DigiCert KeyLocker, SSL.com eSigner; ≈ $219–420/yr + token). Sign the app exe, the NSIS installer and NSIS plugin DLLs (tauri-bundler ≥ 2.9.3 fixed unsigned plugin DLLs). Keep one publisher identity so SmartScreen reputation accumulates (no option gives instant trust).
- Azure Artifact Signing (~$9.99/mo) only if the entity is eligible (individuals: USA/Canada only). ASSUMPTION/open question: CA identity validation for an Iraq-based individual/company — may require a company in another jurisdiction.
- macOS (v2): Apple Developer Program + notarization; universal `.dmg`.

### 25.3 Auto-update
- `tauri-plugin-updater` with its **mandatory** signature (minisign keypair kept offline, backed up twice); static `latest.json` on GitHub Releases generated by `tauri-action`.
- Offline-first behaviour: manual "Check for updates" + optional automatic check (default: check at most daily when online, **never download without consent**). Channels: stable, beta.
- Update flow: download → verify signature → install on next restart → pre-migration backup → run migrations → "What's new" banner (one).
- Never auto-migrate templates, saved views or settings in ways that change output.
- Rollback: keep previous installer link in release notes; DB migrations are forward-only, so restore from the automatic pre-migration backup if needed.

### 25.4 Release process
- Semantic versioning; `CHANGELOG.md`; release notes in ar/en.
- Release checklist = Definition of Done (§28) + perf run on Ref-Low + clean-VM install test + upgrade test from previous version with `large` fixture.

---

## 26. ASSUMPTIONS register & open questions

| ID | Assumption / open question | Owner | Resolve before |
|---|---|---|---|
| A1 | Working name "Aivoro Desk" | Founder | Phase 9 |
| A2 | Pricing $49 / $99–129, 14-day trial, paid major upgrade after 12 months | Founder | Phase 9 |
| A3 | Edition split in §4 | Founder | Phase 9 |
| A4 | Svelte 5 over SolidJS; specta for IPC types; `rusqlite_migration` | Agent (ADR) | Phase 0 |
| A5 | Installer hard limit 25 MB if Typst + fonts exceed 15 MB | Agent (measure) | Phase 0 |
| A6 | Typst PDF/A-3 + embedded XML support for Factur-X (else post-process) | Agent (spike) | Phase 14 |
| A7 | Typst Arabic kashida/complex RTL tables quality | Agent (spike) | Phase 0 |
| A8 | `Worksheet::set_right_to_left()` present in the pinned `rust_xlsxwriter` version (version check, not a spike) | Agent | Phase 0 |
| A9 | Iraqi tax rules (VAT/sales tax, withholding on contractors, e-invoicing, official letter format, retention period) — **not researched** | Founder + Iraqi accountant | Phase 14 (IQ pack) |
| A10 | All country-pack legal values (dates, thresholds, boxes) — from unverified knowledge | Tax adviser per country | Before selling in that country |
| A11 | Licensing via Lemon Squeezy API + vendor signer; offline response codes; 3 activations; trial behaviour after expiry | Founder | Phase 9 |
| A12 | Code-signing identity for an Iraq-based seller | Founder | Phase 9 |
| A13 | Cheque handling (post-dated) needed in target markets | Founder interviews | Phase 6 |
| A14 | Costing: replay-and-adjust for back-dated receipts; FX at receipt date | Agent (ADR) + accountant review | Phase 10 |
| A15 | Contractor workflows (price client BoQ and return in same layout; two billing modes; deduction presets) — no external evidence | 10–15 contractor interviews | Phase 17 |
| A16 | MasterFormat/UniFormat code lists licensing; AIA form replicas | Founder (legal) | Phase 17 |
| A17 | Xero/QuickBooks import file column templates | Agent (verify with vendor docs) | Phase 15 |
| A18 | Matching windows/thresholds in reconciliation | Tune with real bank files | Phase 15 |
| A19 | Local e-wallets/payment rails for Iraq/GCC (QR standards, deep links) | Founder | Phase 14 |
| A20 | Multi-user over LAN: out of scope; SQLite on network shares refused | Founder | v2 research |
| A21 | Next UI languages after ar/en | Founder (sales data) | v2 |
| A22 | Date-input shortcuts, tab restore, initial JS ≤ 150 KB gz and screen chunks ≤ 60 KB gz, coverage targets | Agent | Phase 1 |
| A23 | Tafqeet and Hijri implementations clean-room (source licenses unverified) | Agent | Phase 5 / 16 |
| A24 | Legal clause excluding use as a certified cash register in FR/DE/AT/PT/ES | Lawyer | Phase 9 |
| A25 | Research gap: no Reddit/user-forum evidence for tax, payments, hub and contractor wishes | Founder (re-run research) | v1 planning |
| A26 | Typst click-to-select: labels `<el-ID>` + introspector positions → hit boxes returned with the preview PNG | Agent (spike) | Phase 0 |
| A27 | "بطاقات" in "ربط الفواتير بحسابات وبطاقات" means ledger cards (account / item / party) **and** payment cards — both are built (§14.10) | Founder (confirm) | Phase 6 |
| A28 | Task reminders default to `always` until "Don't show again" (founder overrides the research's max-3 / cooldown / auto-retire defaults; `smart` stays an option) | Founder (decided) | Phase 1 |
| A29 | Merchant of record accepts an Iraq-based seller and pays out to Iraq (Stripe/PayPal coverage) — possible blocker | Founder | Before Phase 9 |
| A30 | `ar` catalog and all printed Arabic in Modern Standard Arabic; dialect only in an optional `ar-IQ` UI overlay | Founder (confirm) | Phase 1 |
| A31 | "Light" = small download, fast start, low CPU and disk churn; WebView2 idle RAM floor ≈ 150–200 MB accepted, else the Avalonia fallback | Founder | Phase 0 go/no-go |
| A32 | Installment / credit selling is needed (`document_installments`) | Founder interviews | Phase 12 |
| A33 | Per-customer **folder** layout as the Excel default (`folder_per_customer`) | Founder (confirm) | Phase 7 |
| A34 | Countries sold at the MVP stage: GENERIC + IQ placeholder + 2–3 verified packs; supported list shown at checkout and in the wizard | Founder + tax advisers | Phase 9 |

Non-goals are listed in §2.1. The v2 candidates there (serial/batch/expiry tracking, item variants) need user validation before they enter any phase. The Starter extra currency (§4) is part of A3.

---

## 27. Phased roadmap — self-contained sub-prompts

**Milestones.** **MVP (Starter release)** = Phases 0–9 incl. 8b · **v1 (Pro release)** = Phases 10–17 incl. 10b · **v2** = Phases 18–21.
Paste one block per agent session. Each block assumes the agent has read §§0–26, §28 and Appendices A–K.
Common to every phase (implicit acceptance criteria): CI green; no new forbidden licenses; perf budgets measured and recorded in `docs/PERF.md`; `docs/SIZE.md` updated (installer growth ≤ 300 KB or an ADR); every new screen has its Appendix H registry row (ar/en banner copy, complete `features` list, empty state, F1 page, task emitters) and keyboard paths; Appendix K rows touched by the phase carry test ids; HUMAN GATE criteria are left "pending human" with their proxies passed; `CHANGELOG.md`, `docs/DECISIONS.md`, `docs/ASSUMPTIONS.md` updated; demo script `docs/demos/phase-N.md`. Acceptance criteria are referenced as `P<phase>.AC<n>` (e.g. `P7.AC3`) in tests and in Appendix K.

---

### Phase 0 — Spikes & skeleton (go/no-go) · MVP
```text
You are starting Aivoro Desk. Read docs/MASTER_BUILD_PROMPT.md §§0–8, §17, §20, §25 first.
GOAL: Prove the stack meets the budgets before any feature work, and create the repo skeleton.
BUILD:
1. Monorepo per §7 with Tauri 2 + Rust core + Svelte 5/TS/Vite; release profile per §5.2; CI on a Windows runner
   (build, test, size check script). specta/tauri-specta typed IPC with one sample command.
2. Spike A (PDF): embed Typst via typst-as-lib with bundled subset fonts (Arabic + Latin). Render a bilingual
   Arabic/English invoice: logo, mixed LTR numbers inside Arabic text, IBAN, 40 lines over 3 pages with repeated
   table header, VAT summary table, amount in words placeholder. Also render page 1 to PNG for preview.
   Measure render time (cold/warm) and binary size delta.
3. Spike B (Excel): with rust_xlsxwriter build a 5,000-invoice customer statement workbook (Tables, frozen header,
   number formats, RTL if available). Implement the atomic write + retry on Windows (§12.4) and prove behaviour
   while the file is held open (helper process with exclusive share mode, and real Excel if available).
4. Spike C (installer): signed-or-unsigned NSIS build with embedBootstrapper and with offlineInstaller; verify
   per-user install mode; install on a clean Windows 10 22H2 VM (4 GB RAM); detect missing WebView2 gracefully.
5. Spike D (memory/start): measure idle private bytes (app + msedgewebview2 children) and cold/warm start per §20.3.
6. Spike E (macOS, optional if a Mac is available): run the same build to note WKWebView CSS differences.
7. Spike F (Typst hardening): build Typst with package download and embedded default fonts disabled and record the
   size delta; pass all data through a virtual JSON file (§17.1) and prove that names containing `# $ * _ @ < ] \`
   and `#read(...)` render literally; prove click-to-select: label elements `<el-ID>`, query the introspector for
   page/position/size, return hit boxes with the PNG preview (A26).
8. Spike G (WebView2): apply the §6 runtime settings; prove F5, Ctrl+R, Ctrl+P and Ctrl+F reach the app instead of
   the browser; measure memory idle, with 10 tabs, and minimized with MemoryUsageTargetLevel=Low.
9. Spike H (fonts): render Arabic UI text with system Segoe UI (shaping, digits, bold) at 100 % and 150 %; ADR on
   whether a bundled UI font is needed.
10. Spike I (Excel extras): xlsx zip-level patch round trip on a client-style file (merged cells, styles, Arabic,
   formulas) — only target cells differ (cell-level diff) and Excel opens it without repair; confirm
   `set_right_to_left()` in the pinned rust_xlsxwriter (A8); detect a Documents folder redirected into OneDrive.
11. Spike J (Ref-HDD): cold start on the Ref-HDD machine (§20.1); zstd size cost for backups (§22).
12. Write docs/PERF.md (baseline), docs/SIZE.md (size ledger), docs/DECISIONS.md (ADRs: Svelte vs Solid, specta,
   migrations crate, Typst crate choice, HTTP/TLS stack, font choice), docs/DEPENDENCIES.md with licenses.
DO NOT BUILD: any business feature or real schema.
ACCEPTANCE CRITERIA:
1. Repo builds on CI (Windows) and produces an installer; size reported; size ≤ 25 MB hard limit (target 15 MB).
2. Bilingual PDF renders identically on two runs (byte-stable or visually identical); Arabic shaping correct;
   numbers/IBAN LTR inside RTL text; table header repeats on pages 2–3; warm render ≤ 150 ms (record actual).
3. Excel spike: file builds in ≤ 2 s; while the file is locked, the write is retried, reports "locked" with the
   locking process name (Restart Manager), never corrupts the existing file, and succeeds after unlock.
4. Clean-VM install works without admin; missing WebView2 shows a clear message (not a blank window).
5. Idle memory and cold start measured and recorded; if any hard limit is breached, an ADR proposes the fix or
   the fallback (§5.4) and the phase is marked NO-GO for human review.
6. Spikes F–J pass or have an ADR with the fallback; Ref-HDD cold start ≤ 4 s; the go/no-go summary asks the
   founder to record A31 (WebView2 RAM floor).
DELIVERABLES: skeleton repo, spikes under /spikes (kept), PERF.md, SIZE.md, ADRs, a go/no-go summary in
docs/demos/phase-0.md.
```

### Phase 1 — App shell, i18n/RTL, theming, help framework · MVP
```text
Read §§3, 5–8, 17.9, 18, 19, Appendices A and H. Phase 0 must be GO.
GOAL: The empty but polished application frame every later screen plugs into.
BUILD:
1. app.db (profiles, user_ui_prefs incl. task_reminder_mode and theme columns, hint_state, recent_companies,
   series_hwm) and machine.db (license, shared_companies, printer_calibrations) per §9.1 + migrations.
2. AppShell: single main window, in-app tabs (open/close/reorder, restore on restart, cap ≈ 12, unmount after
   5 min), WebView2 runtime settings (§6), top-centered navigation bar and the prominent Universal Search button + overlay per §19A (sections, actions,
   settings and help indexed from day one; records added as modules land), Focus Mode, global shortcut registry bound by KeyboardEvent.code (Appendix A),
   status-chip area, Settings screen skeleton.
3. i18n: ar (Modern Standard Arabic) / en catalogs + optional overlay loader (ar-IQ); the in-house ICU-lite
   formatter (§3.6) with Intl.PluralRules/NumberFormat/DateTimeFormat; dir switching; CSS logical properties
   only; numerals setting (latn/arab); LTR isolation helpers for numbers/codes.
4. Theming and the Appearance screen per §17.9: tokens.css, OKLCH palette generator with WCAG contrast check and
   auto-nudge, 8 presets + System, accent + "Use my brand colour", advanced overrides, density, text scale
   90–150 %, UI font, bold text, reduced motion, live preview, reset, export/import JSON.
5. Help framework: hint catalog loader, HintManager with the exact eligibility rule (§18.4) incl.
   task_reminder_mode (always/smart/off) and the popover queue, ScreenBanner (§18.5) with the "All features on
   this screen (N)" expander, TaskHint popover (§18.6) with Driver.js mini-tour and the completion toast,
   EmptyState component, condition registry (§18.13), screen & task registries (Appendix H) with CI checks,
   Settings → Help & tips (help level, toggles, reminder mode, Reset all tips, reset per screen), F1 side panel
   showing build-time pre-rendered help with a prebuilt search index.
6. Core DataGrid component (virtualized, keyboard map Appendix A, RTL, multi-row paste parser returning a
   matrix, end-aligned numbers) with a demo screen using 100k fake rows.
7. Error model (AppError → localized message), logging (local rotating), main window shown only when UI ready.
DO NOT BUILD: company data, business screens.
ACCEPTANCE CRITERIA:
1. Switching ar↔en flips the whole UI direction without reload artifacts; no hard-coded strings (lint check).
2. Picking any accent color yields AA-contrast text/background pairs (automated test over 50 random colors).
3. HintManager unit tests cover every clause of §18.4 incl. setup_warning never dismissed forever; banner
   collapse/strip/(i) reopen works; "Reset all tips" restores banners; state survives app restart.
4. DataGrid: 100k rows scroll ≥ 50 fps on Ref-Low; arrows/Enter/Tab/F2/Esc/Ctrl+D work in LTR and RTL; pasting
   a 20×4 block from Excel produces the expected matrix (test with real clipboard text incl. Arabic).
5. Command palette finds actions in both languages; shortcuts shown match the registry.
6. Cold start still ≤ 1.5 s; idle memory ≤ 200 MB; initial JS ≤ 150 KB gz.
7. Task reminders: in `always` mode the task hint appears on the 10th start of the same task (also after two
   completions and within 24 h); "Don't show again" at the start or in the completion toast stops it for good;
   never two popovers at once (queue); `smart` mode reproduces the research rules of §18.4.
8. Banner "All features on this screen (N)" lists every registered command of the demo screens in ar and en (CI);
   the registry check fails when a route lacks a row, banner copy, feature list or F1 page.
9. Appearance: 8 presets, accent + "Use my brand colour", advanced overrides with live contrast check and
   auto-adjust, density, text scale 90–150 %, UI font, bold text, reduced motion, live preview, reset,
   export/import JSON; changes apply without restart and persist per profile; random-colour contrast tests pass in
   light and dark; chips distinguishable in a grayscale screenshot; at 150 % on 1366×768 no clipped text.
10. WebView2: F5 and Ctrl+R never reload; Ctrl+P never opens the Chromium print dialog; no browser context menu,
   autofill or zoom; DevTools off in release builds.
11. With the Arabic keyboard layout active, Ctrl+K, Ctrl+S, Ctrl+], Ctrl+[ and Alt+C work (E2E); in RTL grids the
   arrow keys move visually and Tab moves logically.
```

### Phase 2 — Company file, audit, parties, items, units · MVP
```text
Read §§8, 9.2 (A–D, P, Q), 10.1, 19, 22, 23.
GOAL: Create/open company files and manage customers, suppliers and items with excellent keyboard UX.
BUILD:
1. Company file lifecycle: create (wizard stub: name, country, currency, language), open, recent list, switch,
   network/synced-folder warning, pragmas per §8, DbActor single writer + read pool, migrations, audit_log with
   hash chain and append-only triggers, integrity check command.
2. Tables & screens: company, settings, modules, members (owner auto-created), currencies (ISO seed incl.
   display_decimals), parties (+ tax IDs, addresses, contacts), uoms (Rec 20 seed), uom_conversions, item
   categories, items (+ codes, aliases, FTS5 search), warehouses.
3. List screens with saved views, filters, export to XLSX/CSV; detail forms with validation on blur; inline
   creation (Alt+C) API reusable by later pickers; soft delete (archive) with undo toast.
4. Backups per §22: on close only if changed and estimated < 3 s (else background step-API backup at next start),
   daily, attachments manifest, disk cap, rotation, integrity_check; "Backup now"; restore into a new file.
5. Banners, feature lists, empty states and F1 pages for Customers, Suppliers, Items (registry rows).
6. Data roots (§6): "Only me" / "All Windows users of this PC" (ProgramData + ACL); profile picker when a company
   has more than one member; owner recovery code (printed PDF, hash stored); brand assets and fonts stored as
   BLOBs (asset_blobs); `people` restricted to owner/manager; parties.excel_mirror; Walk-in customer created.
ACCEPTANCE CRITERIA:
1. Creating 1,000 parties and 50,000 items via fixtures keeps typeahead p95 ≤ 50 ms and list scroll smooth.
2. Every create/update writes an audit row; tampering with an audit row is detected by the integrity check.
3. Opening a company file from a OneDrive folder or UNC path shows the warning and offers move.
4. Backup files are created, rotated (7/4/12) and verified; restore produces an identical document count.
5. Arabic and English names searchable (incl. aliases); archived records hidden by default and restorable.
6. A second Windows user on the same PC opens a shared company without consuming another activation; a
   forgotten owner PIN is reset only with the recovery code (audited).
7. Closing the app with a 1 GB company file on Ref-HDD never blocks > 3 s; the deferred backup runs at the next
   start; total backup size respects the cap.
```

### Phase 3 — Dated & scoped prices, import wizard, paste · MVP
```text
Read §§9.2 E, 10.2, 23, 12.7 (Prices sheet columns).
GOAL: The price engine and the Excel import experience — two of the strongest selling points.
BUILD:
1. price_lists and prices tables (incl. prices.price_mode); pricing resolution engine exactly as §10.2 with unit
   tests for every priority/tie rule, UoM conversion, currency conversion (FX table stub with manual rates) and
   incl/excl conversion.
2. Prices screen: per item timeline (all / price list / party scopes, min qty, valid from/to), bulk price
   update by % or amount from a date with impact preview ("affects N items, M drafts"), never touching issued
   documents.
3. Import wizard (§23.1) for customers, suppliers, items, prices, opening balances (stub posting until Phase 6):
   header detection, mapping with Arabic/English synonyms, saved profiles, validation preview, dry run,
   single-transaction commit, error report XLSX, undo import.
4. Parsing rules: encodings incl. Windows-1256, Arabic-Indic digits, decimal/thousand separators, date formats.
ACCEPTANCE CRITERIA:
1. Golden tests: 40+ pricing scenarios (party vs list vs all, overlapping dates, min_qty breaks, same-day ties,
   valid_to boundaries inclusive, UoM carton→piece, USD price on IQD document, tax-inclusive price on a
   tax-exclusive document).
2. Importing a 10,000-row Arabic customer sheet (Windows-1256 CSV and XLSX) completes ≤ 10 s with correct text.
3. Undo import removes only untouched imported records and is audited.
4. Back-dated price change preview lists affected drafts and changes no issued data (test asserts hashes).
```

### Phase 4 — Tax engine core, numbering, Invoice Hub core · MVP
```text
Read §§8, 9.2 A–B and H–I, 10.5, 10.6 (interfaces only), 10.9, 11.1–11.5, 13.1–13.6, 19, Appendices A and C.
GOAL: Create, issue, void and credit quotes, invoices and cash sales with correct tax and gapless numbers.
BUILD:
1. Tax tables; signed country-pack loader with real Ed25519 verification and Appendix C.2 validation; GENERIC +
   IQ placeholder + the 2–3 packs targeted for MVP sale (A34; "Tax Invoice" titles only from verified packs);
   company_tax_registrations; tax calculation per §11.3 (category & line modes, inclusive/exclusive, compound
   groups, document discounts/charges allocation, withholding below total, cash rounding increment,
   calc_decimals, tax_point_date, tax_fx_rate/source per the pack's tax_fx_rule), document_tax_summary.
2. number_series with patterns and yearly reset; issue transaction per §11.5 (number + party/seller snapshots +
   content_hash + document_events chain in JCS) and the numbering high-water mark (§10.5).
3. Invoice Hub screen (§13.2) and Document Editor (§13.4–13.5) for QUOTE, INVOICE, CASH_SALE, CREDIT_NOTE:
   party picker with balance badge, item typeahead, inline create, price source chip, last-price panel,
   arithmetic cells, multi-row paste with column mapping, live totals from core, autosave drafts
   (editor_autosave + crash recovery), Issue/Void/Credit note flows, conversion QUOTE→INVOICE with
   source_line_id, pre-issue validator framework (§11.4) with generic rules incl. tax registration; Issue = F10
   with the §19.7 confirmation, Ctrl+P = print/preview only, Ctrl+Enter = insert line; "Correct this invoice".
4. Status chips, error summary with jump-to-field, owner-only margin column (F9, PIN) hidden from others.
DO NOT BUILD: PDF (Phase 5), payments (Phase 6), Excel (Phase 7).
ACCEPTANCE CRITERIA:
1. Tax golden vectors (≥ 60 cases) pass: inclusive pays exactly displayed gross; category vs line mode
   differences reproduced; mixed rates with document discount allocate correctly; withholding reduces payable only.
2. Concurrency test: 1,000 issues in random order never produce duplicates or gaps; drafts never consume numbers.
3. Issued documents cannot be edited through any API (tests); void requires reason and keeps the number;
   credit note references the original and can be partial.
4. HUMAN GATE: keyboard-only creation of a 20-line invoice incl. a new inline customer and item takes ≤ 90 s for
   a scripted tester. Agent-checkable proxies: the E2E script creates the same invoice keyboard-only, its
   keystroke count is recorded and stays ≤ 260 (ASSUMPTION), every control on the path is keyboard-reachable,
   and keypress→paint p95 ≤ 50 ms.
5. Killing the app mid-edit and restarting offers recovery of the unsaved draft.
6. A company not registered for VAT never prints VAT lines or "Tax Invoice"; VAT on a document dated before the
   registration date is blocked; unverified packs never print "Tax Invoice".
7. Editing a customer after issue changes nothing in the issued document's snapshot, content_hash or exports; the
   integrity check recomputes every content_hash and chain link from stored rows and finds a tampered row.
8. Restoring an older backup cannot produce a duplicate number: issuing is blocked until the series continues
   after the high-water mark (audited).
9. Ctrl+Enter and Ctrl+P never issue a document (E2E); F10 always shows the confirmation.
10. Golden tests: Canadian GST+QST on the same base; IQD at calc_decimals 0 prints lines that sum to the total;
   tax FX by pack rule; "Correct this invoice" yields a full credit note + linked draft.
11. Owner-only margin never reaches non-owner roles, prints, customer exports or Excel (test).
```

### Phase 5 — PDF rendering, gallery templates, brand · MVP
```text
Read §§16.4 (tafqeet, Hijri), 17 (all), 11.7 (QR block only), 14.3 and 14.8 (pay-to account), Appendix I.
GOAL: Beautiful, correct bilingual PDFs for every Phase-4 document and the statement.
BUILD:
1. Template JSON schema (§17.2) + Rust generator that emits a fixed Typst template and passes all data as a
   virtual JSON file conforming to the print data contract (Appendix I) — never concatenating user strings
   (§17.1); template versions (copy-on-write); assignments.
2. Gallery v1: Classic, Modern, Bilingual Arabic/English, Minimal (A4/Letter/A5); Brand settings (logos,
   colors, fonts, stamp, signature); "Apply my brand"; "Reset to gallery default".
3. Basic template settings UI (Starter level): toggle sections/columns, labels per language, logo size/position,
   paper size, margins, numerals, amount in words, bilingual layout mode. (Full designer is Phase 13.)
4. Preview pane rendering PNG of the real PDF (≤ 300 ms after edit); white paper in dark mode.
5. Tafqeet module (Arabic + English, currency names incl. IQD/SAR/AED/USD/EUR) with golden tests; Hijri display.
6. Generic QR block (URL/text) and the pack-driven QR interface (implementation of ZATCA TLV in Phase 14).
7. On Issue: render and store PDF + sha256 + template version on the document; DRAFT watermark for drafts.
8. "Print" opens the PDF in the default viewer; bulk PDF export; Ctrl+P = print/preview the current state.
9. Dual-currency total line, pay-to account payment block, receipt/payment voucher templates.
ACCEPTANCE CRITERIA:
1. PDF golden images (Arabic-primary, English-primary, bilingual side-by-side) match within tolerance.
2. A 60-line invoice paginates with repeated headers, carried-forward subtotal and totals on the last page.
3. Editing a template after issuing does not change the stored PDF of issued documents (hash test).
4. Amount-in-words golden tests pass (≥ 100 numbers incl. 3–10 gender agreement and decimals).
5. Logo of any aspect ratio prints at the configured max height without square-ratio shrinking.
6. Injection fuzz: party names, descriptions and notes containing `# $ * _ @ < ] \` or Typst code render
   literally (golden PDFs + 10 min cargo-fuzz without escape or crash).
7. Every field used by the gallery templates exists in the Appendix I schema (schema validation test).
8. The dual-currency line prints the second-currency total at the stated rate and date; the pay-to account's
   bank name, IBAN/account number and currency print in the payment block.
```

### Phase 6 — Payments, accounts, posting, statements, simple stock · MVP
```text
Read §§9.2 J and N, 10.6–10.8, 12.9 (statement spec), 14.1–14.10, 17.10, 21.3 (cards), Appendix E.
GOAL: Money in/out linked to invoices, correct balances, statements and aging; Starter-level bills/expenses/stock.
BUILD:
1. Default chart of accounts (§14.2), payment accounts UI (cash, bank per currency, card/processor with fees,
   e-wallets, petty cash), posting engine with Appendix E templates for INVOICE, CASH_SALE, CREDIT_NOTE, receipts,
   refunds, deposits, transfers, quick expenses, basic BILL and supplier payments, OPENING_BALANCE documents.
2. Payments and allocations (§10.7) with "Mark paid" (1 click + undo), Receive-money panel with chips and FIFO
   auto-allocation, overpayments as credit, fee field, cheques (A13) with status lifecycle.
3. Simple stock: stock_moves and moving-average cost (item_avg_cost), COGS posting, negative stock warning.
4. Statements: activity + outstanding, configurable aging edges/basis, per currency, PDF via Phase-5 engine,
   statement_runs snapshots; AR/AP aging reports; lock_date.
5. Nightly/at-start integrity job: balances of every journal entry, cached balance_due vs allocations.
6. Account resolution (§10.6: item accounts, 4100 for services/labour, document_lines.account_code on non-stock
   bills/expenses), journal_lines.branch_id, derived 3200 retained earnings, stock-gain posting, non-recoverable
   input tax, sub-accounts under 1010/1020/1030/1040/4xxx/6xxx, receipt/payment voucher series (gapless on
   post), outgoing cheques, card last-4 only, pay_to_account_code.
7. Cards (§14.10): account card, item card, party card, with a "Card" button (Ctrl+L) on every account, item and
   party.
8. Report runner (§17.10): assets/reports/catalog.json, report_layouts, Starter features (column chooser, sort,
   filter, saved layouts, PDF via one generic Typst table template, XLSX) for: sales by customer/item/period,
   P&L ("How much did I make"), Balance sheet ("What I own and owe"), cash-flow summary, AR/AP aging, statement,
   item movement card, stock valuation, cash/bank book, expenses by category, price list, customer list.
9. document_installments schema (UI in Phase 12).
ACCEPTANCE CRITERIA:
1. Property tests: every entry balances; Σ allocations ≤ payable; aging total = closing (refuse export otherwise).
2. Scenario tests: partial payments; one payment over 3 invoices; overpayment then auto-apply to next invoice;
   card payment with fee then payout to bank; cheque bounced re-opens the invoice; void payment reverses cleanly.
3. Re-opening a saved statement shows exactly what was generated (hash match) after new transactions.
4. Posting before lock_date is rejected with a clear message.
5. Starter user never sees debit/credit wording in Guided help level (UI copy review).
6. Report layouts: change columns and sort, save "My layout", restart, reopen identical; A4 landscape PDF with
   logo; PDF totals = XLSX totals = screen totals; `large` fixture reports paginated with p95 ≤ 1 s.
7. The balance sheet balances (assets = liabilities + equity incl. derived retained earnings) on every fixture
   (property test); P&L of all years equals the change in retained earnings.
8. A full card number typed into any payment or notes field is rejected; only last 4 digits are stored.
9. Cards: the account card's running balance equals the account balance at every row; the item card's running
   quantity equals stock on hand; the party card equals the statement; every row drills down to its source.
```

### Phase 7 — Excel mirror · MVP
```text
Read §12 entirely, §9.2 O, §21.1, §22, Appendix D.
GOAL: Every operation is mirrored to per-customer folders and master reports, safely, invisibly and lightly.
BUILD:
1. Command registry with Excel targets; export_outbox written in the same transaction by every mutating command
   (or #[no_excel(reason)]); drafts never queue; docs/APPENDIX_D.md generated; worker with per-class debounce
   (party 1.5–3 s, master ≥ 60 s or idle, synced root ≥ 60 s), grouping, priority bump, stale/lazy rebuilds with
   a files-per-minute cap that pauses while typing or on battery, progress, one write at a time.
2. Atomic Windows write with retries, Restart Manager lock holder, conflict move to _conflicts, startup cleanup.
3. Workbooks: folder per customer (§12.6, A33) with the workbook (all sheets §12.7 incl. Prices A/B/C and
   Statement_<CCY>), Invoices\ PDFs (hard links/copies) and Statements\; per supplier; file_per_customer option;
   master reports split by month + yearly summaries (Sales, Purchases, Payments, Cash sales, Activity from
   audit_log, Expenses, Cash & Bank, Stock moves, Ledger, Letters, VAT, Customers, Suppliers, Items & Prices);
   constant_memory without Tables above 50k rows; roll-over at 1,000,000 rows; walk-in excluded; yearly split of
   large customers. Formatting per §12.8 with brand colors; values not formulas; cached formula results; RTL by
   company primary_lang; only Summary protected.
4. Locked-file UX: status chip, retry triggers (focus, ~$ watcher, backoff), "Open latest copy", Settings → Excel
   (folder choice, layout, Rebuild all, Problems list with retry, role warning, _Owner folder off by default).
5. Filename/sheet/table sanitization; rename-follows-party; OneDrive/Dropbox/Google Drive detection and the
   %USERPROFILE%\Aivoro Desk default root.
ACCEPTANCE CRITERIA (all items of §12.11, 1–15, pass, plus):
1. Issuing an invoice never takes longer because of Excel (commit p95 unchanged ±10 %).
2. "Rebuild all" for `medium` and the initial build of `large` stay within the §3.2 time, peak-memory and
   folder-size budgets, with progress shown and keypress p95 unchanged ±10 %.
3. Every mutating command maps to an Excel target or #[no_excel(reason)]; Appendix D regenerates without a diff.
4. Draft autosave never queues; with 2M lines no sheet exceeds 1,000,000 rows and the monthly master rebuild
   stays within budget.
5. 1,000 walk-in Quick sales never rebuild one giant per-party file.
6. A brand change marks 20k workbooks stale and rebuilds them lazily without UI stutter.
7. A Documents folder redirected into OneDrive is detected; the default root moves to %USERPROFILE%\Aivoro Desk.
8. tblInvoices sorts and filters in Excel; no cost, margin, salary or national ID in any mirrored file (scan).
```

### Phase 8 — Onboarding complete, sample company, F1 help · MVP
```text
Read §18 entirely, §19, §2, Appendices B and H.
GOAL: A first-time user gets productive in minutes without a forced tour.
BUILD:
1. Welcome screen; setup wizard (≤ 4 steps) with live invoice preview; setup_warnings for skipped steps.
2. Dashboard with "Today" panel (overdue, expiring quotes, Excel queue, backup age) and the 6-item
   "Get started" checklist (pre-ticked first item, collapsible, hideable, no gating).
3. Sample company generator (scripts/gen-demo) and DEMO banner/watermark; "Switch to my company".
4. Banners, complete `features` lists and registry rows for every screen built so far (Appendix H; ar in Modern
   Standard Arabic, en), task hints for: invoice create (paste), issue (numbers are final), void vs credit note,
   owner margin, receive payment, statement, Excel locked; completion toasts; dialog subtitles; empty states
   everywhere.
5. F1 Markdown help pages ar/en for every screen built so far; "What's new" banner mechanism.
6. Copy review against §18.11 (both languages written natively).
ACCEPTANCE CRITERIA:
1. HUMAN GATE: usability test (5 people, scripted): from install to first issued invoice with logo in ≤ 10
   minutes for 4/5. Agent-checkable proxies: the E2E first-run script reaches an issued invoice with logo in
   ≤ 40 UI actions (ASSUMPTION; record the count), every step is keyboard-reachable, and every screen on the path
   shows its banner.
2. Never more than one proactive popover at a time (queue test); in `smart` mode ≤ 3 per session; in `always`
   mode task hints repeat on every start until dismissed (automated UI tests).
3. "Don't show again" (at start or from the completion toast) persists across restarts and company switches;
   "Reset all tips" restores everything.
4. Demo data never appears in the real company file (test); DEMO watermark on all demo PDFs.
5. Registry CI: every route has an Appendix H row with ar/en banner text, a complete feature list and an F1 page;
   every task_id has a start and a completion emitter; the ar catalog contains no dialect markers (lint list).
```

### Phase 8b — Letters-lite · MVP
```text
Read §16 (16.2–16.5), §9.2 M, §10.5, §17.1, §21.1, Appendix I (letter fields).
GOAL: Official letters — a founder priority — in the first release.
BUILD: people (minimal, owner/manager only), signers, letter registers (outgoing/incoming, pattern numbering,
high-water mark), incoming-letter form (sender, external ref/date, received_at, scan, reply link), letter editor
with the rich-but-safe JSON AST (§16.5), the 8 Letters-lite templates with their fields_json (formal letter, to
whom it may concern, salary certificate, experience certificate, authorization, receipt voucher, payment voucher,
balance confirmation), issue → immutable + chained in document_events, stamp/signature behind the
letters.issue_with_stamp permission (audited), Hijri date, amount in words, Letters Excel register, banners,
feature lists, F1 pages and registry rows.
ACCEPTANCE CRITERIA:
1. Register numbers are gapless per year and follow the pattern; restoring an old backup cannot reuse a number.
2. Each of the 8 templates renders in ar and en without overflow; letter bodies containing Typst-like text render
   literally.
3. Issuing with stamp requires the permission and writes an audit event; issued letters cannot be edited.
4. Incoming letters are searchable by sender, external reference and date; a reply links to its incoming letter.
```

### Phase 9 — Licensing, packaging, signing, updater → MVP release · MVP
```text
Read §§3.3, 4 (marketing rule), 11.2 (MVP country scope), 21, 22, 25, 26 (A1–A3, A11, A12, A24, A29, A34),
Appendix J.
GOAL: Ship the Starter edition.
BUILD:
1. Edition/feature gating from assets/editions.json (incl. available_in); trial (14 days); activation online (MoR
   API + signer function per Appendix J — verify A29 first) and offline (request/response codes with QR);
   Ed25519 token verification with kid; machine-wide license in machine.db; deactivate flow; Settings → License
   screen; post-trial behaviour per A11 (never block view/export/backup).
2. Updater: tauri-plugin-updater, signed latest.json via tauri-action, manual check + optional daily check,
   download only with consent, pre-migration backup, "What's new".
3. Installers: embedBootstrapper and offline variants, per-user install, signing of exe/installer/plugins.
4. EULA + tax disclaimer + per-country coverage statement (from packs).
5. Release checklist run (§28) on Ref-Low and Ref-HDD with `large` fixture; clean VM install and upgrade test.
6. Supported-country list (A34) in checkout copy, EULA and setup wizard; privacy notice and per-party
   personal-data export (§21.3); Upgrade screen lists only shipped capabilities (§4 marketing rule).
ACCEPTANCE CRITERIA:
1. Fresh install → trial → activate online; and on an air-gapped VM → activate offline via codes.
2. Tampered token or pack signature is rejected; app still opens existing data read-only-for-issuing.
3. Update from previous build migrates data, keeps templates byte-identical in output, shows one What's new.
4. All MVP budgets met; Definition of Done checklist fully ticked.
5. A second Windows user on the same PC does not consume an activation.
6. The Upgrade screen, EULA and checkout copy mention no capability whose "Available in" milestone is after MVP
   and list only A34 countries as supported.
```

---

### Phase 10 — Multi-currency, purchasing, inventory & dated costing, landed cost · v1
```text
Read §§9.2 B, F, H (purchase types), 10.3, 10.7 (FX), 14.6, Appendix E.
GOAL: Correct profit for importers and traders.
BUILD: fx_rates UI (manual, CSV import, optional online fetch with consent); multi-currency documents and
payment accounts; realized FX gain/loss per allocation; optional period-end revaluation (reversing). Purchasing:
PURCHASE_ORDER, GOODS_RECEIPT (partial), BILL (partial, merge GRNs), SUPPLIER_CREDIT, supplier payments and
advances. FIFO cost layers per §10.3 with dated layers, consumption records, landed cost vouchers (value/qty/
weight/volume/manual) incl. adjustment for consumed qty, recost job for back-dated receipts (A14), stock
transfer and adjustment documents, warehouses, stock valuation report at any date.
ACCEPTANCE CRITERIA:
1. Golden costing scenarios: USD purchase + freight in IQD landed by weight; sale before landed cost posted then
   adjusted; back-dated receipt recost; negative stock true-up; average vs FIFO results documented.
2. Stock valuation at date D equals Σ remaining layers at D (property test).
3. FX example from §14.4 produces exactly the stated gain; revaluation reverses on day 1 of next period.
```

### Phase 10b — Engineering tables, calculators & BoQ-lite · v1 (early; Starter)
```text
Read §§13.5 (arithmetic grammar), 15.9 (cumulative rule), 15.16–15.17, 9.2 L (eng_tables), 17.10.
GOAL: Engineers and small contractors get useful tables and simple BoQ billing without the Pro projects module.
BUILD: eng_tables with built-in JSON tables (rebar kg/m = d²/162, a steel-sections subset, densities, unit
conversions, mix ratios, block/tile/paint coverage), every value marked "verify" with its source; Engineering
tables screen and calculator side panel; safe functions (rebar_kg, lookup, area_circle, vol_cyl, conv) in the
arithmetic parser; BoQ-lite quotes (1–2 levels, section subtotals, summary print); Accept → invoice, or
percent-based PROGRESS_INVOICE with progress_pct_to_date per line (cumulative rule), optional retention %;
banners, feature lists, F1 pages and registry rows.
ACCEPTANCE CRITERIA:
1. `=rebar_kg(12)*6*24` returns exactly 128 (12²/162 × 144, decimal math); lookup of an unknown row shows an
   inline error; every built-in table shows its source and "verify".
2. Three percent progress invoices against one BoQ-lite quote sum to the quote total at 100 %; over 100 % warns.
3. Cell references are rejected (`=A1*2` → inline error); the parser survives 10 min of fuzzing without panics.
```

### Phase 11 — BOM/recipes, assembly, comparisons & analytics · v1
```text
Read §§9.2 G, 10.4, 10.10.
BUILD: BOM editor (versions, waste, labour, overhead, sub-assemblies, cycle detection), cost roll-up in 4 modes
at any date, ASSEMBLY document, "what-if" cost at two dates; Comparisons: price history (supplier/customer),
margin by customer/item/category/period, cost drift alerts, supplier price comparison, BOM cost over time — each
as a report-catalog entry (§17.10); dashboards with uPlot (lazy-loaded); all exportable to Excel.
ACCEPTANCE CRITERIA: cost roll-up golden tests (3-level BOM); assembly posts correct inventory/COGS; analytics
queries on `large` fixture return ≤ 1 s (p95) with pagination.
```

### Phase 12 — Full Invoice Hub · v1
```text
Read §§11.8, 13 (all), 17.8, 17.11, Appendix A.
BUILD: PROFORMA, SALES_ORDER, DELIVERY_NOTE (with/without prices), DEPOSIT_INVOICE and "less advance" lines,
DEBIT_NOTE; complete conversion graph incl. partial/merge with remaining quantities and fulfilment states;
branches and per-branch series; recurring profiles with catch-up drafts; reminders (3 levels); email via SMTP
(keychain secrets, outbox, templates per type/language); WhatsApp flow (PDF to clipboard + wa.me text);
Quick sale mode (F12) with barcode wedge, tender/change, split payment; cash sessions with X/Z reports and day
close; F12 and drawer kick disabled when the pack's pos_fiscalization ≠ none; thermal ESC/POS raster printing
(80/58 mm) with drawer kick; attachments; default notes/terms per type/party; message_templates; sent_at and
sent_channel; installments UI (§13.13); Today panel items (low stock, cheques due in/out, installments due, open
cash session); scheduled monthly statements (drafts → review → bulk send); barcode labels (§17.11); the hub's
Sales/Purchases switch and universal New menu (§13.2).
ACCEPTANCE CRITERIA:
1. SO of 10 lines → 3 partial DNs → 1 merged invoice: remaining quantities correct at every step; voiding a DN
   restores remaining.
2. Recurring: app closed for 40 days → on start, exactly the missed occurrences exist as drafts, no duplicates.
3. Thermal receipt in Arabic prints correctly on an ESC/POS emulator (raster), width 576/384 dots.
4. Email with PDF attachment sends through a test SMTP server; failures retry and surface in the outbox.
5. A Z report's expected cash equals Σ cash movements of the session; the difference posts to 6900; a session left
   open > 16 h shows in the Today panel.
6. Installment balances sum to the invoice balance; aging by installment equals aging by invoice in total.
7. EAN-13 and Code128 labels decode correctly (check-digit test) on A4 sheets and thermal raster.
8. The New menu offers receipts, payment vouchers, expenses, letters and pay applications when their modules are
   on; scheduled statements are never sent without review.
```

### Phase 13 — Full template designer, custom fields & fonts, direct print · v1
```text
Read §17 (all), §16.4, Appendix I.
BUILD: Designer UX per §17.4 (left structure panel, center live preview with click-to-select via hit boxes, right
inspector, visibility-rule builder over the visible_if AST), all fixes listed (per-element font size, custom
TTF/OTF with subsetting, logo controls, first/other page headers, carried-forward subtotals, summary-only mode,
line numbers), any hex colour per element with print-contrast warning, per-template brand override, free
elements, pre-printed paper mode with per-printer calibration, cheque template, .adtemplate export/import, custom
fields (document/line/party/item/project) that print, gallery to 10 templates, per-party/branch assignments,
"Test with 60 lines", Advanced Typst override (Pro), Windows direct print to a named printer; report builder Pro
features (grouping ≤ 2 levels, bar/line charts, branded report headers) and the remaining catalog reports.
ACCEPTANCE CRITERIA:
1. HUMAN GATE: a non-technical tester reproduces a given sample invoice layout in ≤ 15 minutes. Agent-checkable
   proxy: an E2E script reproduces it through the designer UI only, and every designer control is
   keyboard-reachable.
2. A custom line field appears in PDF and Excel; template versions are immutable; preview ≤ 300 ms after edit.
3. A free element dragged to a new position prints there (PDF coordinates ±0.5 mm); pre-printed mode prints only
   field values, shifted by the printer's calibration offset.
4. Any hex colour can be set per element and low contrast warns; a per-template brand override does not change
   other templates.
5. The cheque template prints amount in figures and words that match (golden tests).
6. Exporting a template to .adtemplate and importing it creates a new template that renders an identical PDF.
7. Report layouts with grouping and charts persist across restarts; branded report PDFs; PDF totals = XLSX totals.
8. A custom TTF/OTF upload is subset and embedded, and a license reminder is shown.
```

### Phase 14 — Country packs, VAT return, validator, e-invoice export, ZATCA QR · v1
```text
Read §11 entirely, §26 A9–A10, A19, A34, Appendix C.
BUILD: signed country packs (launch set §11.2, all `verified:false` until reviewed — with source_url/verified_by/
verified_at enforced for verified packs; IQ placeholder; KW/QA without VAT; EG/TR/MY/JO/IN-above-threshold as
ctc_online_required), pack fields (calc_decimals, cash_rounding_increment, tax_point_rule, tax_fx_rule,
tax_on_advances, registration threshold, pos_fiscalization), pack import/update UI, per-country setup warnings,
KSA integration-date question and block, pre-issue validator rules from packs (incl. Australia buyer.name_or_abn,
line-mode export warning, forced category mode for export/peppol_id), withholding certificates and statement
clearing, tax periods (open/filed/locked), VAT return builder (invoice basis by tax_point_date & cash basis, UAE
emirate split, drill-down, Excel export; never files, no "MTD compatible" claim), purchase-bill tax override,
non-recoverable input tax, optional VIES/HMRC checks on demand, e-invoice export (UBL Peppol BIS 3.0, CII,
Factur-X/ZUGFeRD EN16931 PDF/A-3, XRechnung) with uoms.export_code + import of incoming XRechnung/ZUGFeRD, ZATCA
Phase-1 TLV QR on KSA documents.
ACCEPTANCE CRITERIA:
1. KoSIT and Peppol schematron validation pass on 20 sample invoices incl. credit notes, allowances and mixed
   rates, with valid unit export codes.
2. veraPDF passes PDF/A-3.
3. ZATCA QR decodes to the 5 fields (and passes the ZATCA SDK check where available); a KSA business past its
   integration date without the add-on cannot issue tax invoices.
4. VAT return totals equal Σ document summaries assigned by tax_point_date (property test); unverified packs show
   the yellow badge.
5. A pack claiming verified:true without source_url/verified_by/verified_at is rejected; KW/QA packs contain no
   VAT rates; EG/TR/MY/JO/IN (above threshold) block titled tax invoices.
6. The Australian rule accepts buyer name or ABN; exporting a line-mode document warns; category mode is forced
   for parties with a peppol_id.
7. Non-recoverable input tax posts to the expense/asset account; "less advance" golden tests pass with
   tax_on_advances true and false.
8. pos_fiscalization ≠ none disables F12 and the drawer kick with an explanation.
9. No UI text, document or EULA claims "MTD compatible" or automatic filing (copy scan test).
```

### Phase 15 — Bank reconciliation, accountant export, period lock · v1
```text
Read §§9.2 K, 14.7, 14.9.
BUILD: import profiles and parsers (CSV wizard, OFX/QFX, QIF, CAMT.053, MT940; permissive implementations),
dedupe, matching suggestions (a)–(e), rules, reconciliation sessions with Finish-at-zero, accountant export pack
(XLSX + CSV BOM + Xero/QBO/IIF after verifying templates, A17), account mapping per accountant, lock period;
anonymization of archived persons/parties after retention (§21.3).
ACCEPTANCE CRITERIA:
1. Re-importing the same file yields 0 new lines.
2. A 1,000-line statement reconciles with ≥ 80 % one-click suggestions on the demo dataset.
3. Fuzzers run 10 min without panics.
4. GL export ties to the trial balance.
5. Anonymization replaces personal data after the retention period, keeps legally required document snapshots,
   never runs when retention_years is null, and is audited.
```

### Phase 16 — Official letters & documents catalog · v1
```text
Read §16 entirely, §21.3.
BUILD: extends Letters-lite (Phase 8b): HR data screen for people (owner/manager only); signers management; the
remaining ~32 templates of §16.1 (bilingual, RTL) with their fields_json; placeholders, stamp/signature behind
letters.issue_with_stamp, Hijri dates, amount in words; cc and attachments lists; full search; PDF archive.
ACCEPTANCE CRITERIA:
1. Each template renders in ar and en without overflow.
2. Register numbers are gapless per year.
3. Issued letters cannot be edited; issuing with stamp needs the permission and is audited.
4. The salary certificate pulls person data and prints the salary in words correctly; people data is invisible to
   roles other than owner and manager.
```

### Phase 17 — Projects & contracting core · v1
```text
Read §15 (15.1–15.12, 15.14–15.17), §9.2 L, Appendix E (progress billing). Resolve A15–A16 first (interviews).
BUILD: Projects module toggle; projects list/dashboard with chain breadcrumb; projects.tax_profile values (§15.10);
BoQ editor building on BoQ-lite (tree grid, keyboard, safe arithmetic + engineering functions, no cell references,
classification pick-lists), BoQ-lite quote → project conversion, rate build-up library linked to inventory costs, versions + diff,
quotation from tender BoQ, Accept → contract lock → SoV, variations register, payment applications (percent and
quantity modes, cumulative rule, certification, lock), deductions engine with presets, PROGRESS_INVOICE and
RETENTION_INVOICE generation and postings, client-BoQ import & "return in the same layout" via the zip-level
patch (§15.12; .xls/.ods refused), project workbook in the customer folder, print templates (§15.14).
ACCEPTANCE CRITERIA:
1. Cumulative rule tests: corrections only in the next app; "this period" always = to-date − previous certified.
2. Five consecutive apps with retention (cap reached in app 4), advance recovery and one approved VO reconcile
   to the customer statement and AR exactly.
3. A client BoQ xlsx (merged cells, section rows, Arabic text) is imported, priced and exported back with only
   the rate/amount cells changed (cell-level diff test against the original; every other zip part byte-identical;
   calcChain removed; Excel opens it without a repair prompt).
4. Module off → no projects UI, tables untouched, no project sheets in Excel.
```

---

### Phase 18 — Projects advanced · v2
```text
Read §15.4, §15.13.
BUILD: takeoff side panel (dimension rows, deductions, waste, §15.16 functions in formulas, CSV/XLSX quantity
import), subcontract packages with
inbound applications/retention/back-charges/expiry alerts, cost vs budget, cash-flow forecast and S-curves
(planned/certified/actual, cash-in lag, funding gap), material schedules → purchase requisitions, stock issue to
project.
ACCEPTANCE CRITERIA: S-curve values equal underlying sums (tests); subcontractor statement ties to supplier AP;
takeoff totals equal BoQ quantities.
```

### Phase 19 — Excel round-trip import & migration presets · v2
```text
Read §12.10, §23.1.
BUILD: "Import changes from Excel" for Prices and party details using hidden _id/_rowver/_hash, conflict
detection, diff preview, single-transaction apply with audit; _conflicts handling UI; migration presets for
QuickBooks/Xero/Zoho/Daftra/Wave list exports (verify formats).
ACCEPTANCE CRITERIA: edited rows detected exactly (no false positives from Office metadata changes); conflicts
flagged when DB changed after export; posted documents can never be changed via import.
```

### Phase 20 — E-invoicing connectors add-on (ZATCA Phase 2 first) · v2
```text
Read §11.7, §5.2 (d). Requires a separate paid add-on license flag; ships as a separate, signed, downloadable
add-on (never in the base installer).
BUILD: einvoice_submissions outbox with deadlines; ZATCA onboarding (CSR, OTP, compliance CSID, production CSID)
per EGS unit; UBL 2.1 with ICV/PIH, canonicalization + SHA-256, XAdES ECDSA secp256k1 signing, TLV QR tags 1–9;
B2C simplified: sign locally, print offline, report ≤ 24 h with alerts; B2B standard: block Issue until clearance
with clear "internet needed" UX; CI validation with the official ZATCA SDK. Then design the Peppol access-point
partner integration (ADR only).
ACCEPTANCE CRITERIA: ZATCA SDK compliance checks pass for standard, simplified, credit and debit notes; offline
simplified invoices queue and report automatically when online; ICV never resets or repeats (high-water mark,
§10.5; test across restore).
```

### Phase 21 — macOS release, accessibility & hardening · v2
```text
Read §5.3, §3.9, §21, §25.2.
BUILD: macOS universal build, notarization, WKWebView CSS fixes, Typst output parity check; full accessibility
audit (axe + NVDA/VoiceOver), keyboard-only audit of every screen; optional company-file encryption (SQLCipher
ADR first); security review of capabilities/CSP; performance re-baseline on all reference machines.
ACCEPTANCE CRITERIA: WCAG 2.2 AA checklist passes on all screens; macOS app meets equivalent budgets (recorded);
no high/critical findings open.
```

---

## 28. Definition of Done

### 28.1 Per feature / per phase
- [ ] Acceptance criteria of the phase all demonstrably pass (automated where possible; manual steps in `docs/demos/phase-N.md`).
- [ ] Unit, property, golden and integration tests added; CI green on Windows.
- [ ] Core features work offline (tested with network disabled); only the legally required online flows of the e-invoicing add-on need a network.
- [ ] Performance budgets (§3.2) measured and recorded in `docs/PERF.md`; no hard limit breached.
- [ ] Installer size checked; dependency licenses checked (Appendix G); `docs/DEPENDENCIES.md` updated.
- [ ] Every new screen has its Appendix H registry row: ar/en banner copy, complete `features` list, empty state, F1 help page, task hints with start and completion emitters (if a task starts there), keyboard paths, command-palette entries. Dialogs/wizards have their one-line subtitle.
- [ ] Appendix K traceability rows touched by the phase carry acceptance-test ids; `check-traceability` passes.
- [ ] HUMAN GATE criteria are marked "pending human" and their agent-checkable proxies pass.
- [ ] `docs/SIZE.md` updated; installer growth ≤ 300 KB or an ADR.
- [ ] RTL and LTR screenshots reviewed; light/dark/black and comfortable/compact checked.
- [ ] WCAG 2.2 AA basics: focus visible and not obscured, targets ≥ 24 px, contrast AA, labels for inputs.
- [ ] All user-facing strings in catalogs (no hard-coded text); Arabic written natively in Modern Standard Arabic (dialect only in the optional overlay).
- [ ] Money math only in Rust core with integer minor units/decimals; no floats in financial paths.
- [ ] Every mutation writes audit rows in the same transaction, and the CI registry test proves that every mutating command queues ≥ 1 `export_outbox` target in the same transaction or carries `#[no_excel(reason)]`; drafts never queue.
- [ ] Issued documents immutable; corrections via void/credit/debit notes only.
- [ ] Owner-only data never reaches prints, customer exports, non-owner roles or the Excel mirror (test).
- [ ] Errors are localized, actionable, and logged locally without sensitive data.
- [ ] Migrations forward-only, tested from every previous released schema; pre-migration backup verified.
- [ ] No forced change to existing templates, saved views, shortcuts or numbering output.
- [ ] `CHANGELOG.md`, `docs/DECISIONS.md`, `docs/ASSUMPTIONS.md`, `docs/SCHEMA.md` updated.

### 28.2 Per release (additionally)
- [ ] Clean-VM install (Windows 10 22H2, 4 GB, no admin) and upgrade from the previous release with the `large` fixture.
- [ ] Cold start, idle memory, peak memory, installer size within budgets on Ref-Low; cold start gate met on Ref-HDD.
- [ ] Backup → restore round trip verified; Excel "Rebuild all" verified; integrity check passes on fixtures.
- [ ] Excel lock matrix (§12.11) passes.
- [ ] Signed installer, signed update manifest, signed country packs; signatures verified on a clean machine.
- [ ] License activation online and offline verified; trial expiry behaviour verified; data always viewable/exportable.
- [ ] Release notes ar/en; "What's new" banner content; per-country coverage statement and tax disclaimer present.
- [ ] No open critical/high bugs; known issues listed.

---

## Appendix A — Keyboard map (normative; shown in menus, tooltips and palette)

| Context | Shortcut | Action |
|---|---|---|
| Global | Ctrl+K / Ctrl+Shift+P | Command palette (Ctrl+K inserts a link inside rich-text fields) |
| Global | Ctrl+Shift+N | New invoice from anywhere |
| Global | Ctrl+Tab / Ctrl+Shift+Tab | Next / previous tab |
| Global | Ctrl+W | Close tab |
| Global | F1 | Context help for the current screen |
| Global | Ctrl+F | Search in current list |
| Global | Ctrl+, | Settings |
| Lists | Ctrl+N | New record of the list's type |
| Lists | Enter | Open selected |
| Lists | Ctrl+E | Export current view |
| Forms | Tab / Shift+Tab | Next / previous field |
| Forms | Ctrl+S | Save draft |
| Forms | Esc | Cancel / close popover |
| Pickers | Alt+C | Create new customer/item/etc. inline from the field |
| Pickers | Ctrl+Space | Open search popup |
| Document editor | F10 | Issue / post (always through the confirmation dialog, §19.7) |
| Document editor | Ctrl+Shift+F10 | Issue & print (same confirmation) |
| Document editor | Ctrl+P | Print / preview the current state (DRAFT watermark on drafts; never issues) |
| Document editor | Ctrl+Shift+C | Convert to… |
| Document editor | F9 | Toggle owner margin column (PIN) |
| Document editor | F12 | Quick sale mode |
| Line grid | Arrow keys | Move between cells |
| Line grid | Enter | Next cell (or down, per user setting); wraps to a new line after last column |
| Line grid | F2 | Edit cell |
| Line grid | Ins or Ctrl+Enter | Insert line (Ctrl+Enter never issues) |
| Line grid | Ctrl+D | Duplicate line |
| Line grid | Ctrl+Delete | Delete line |
| Line grid | Alt+↑ / Alt+↓ | Move line up/down |
| Line grid | Ctrl+V | Paste multiple rows from Excel (mapping preview first time) |
| Line grid | Ctrl+Z / Ctrl+Y | Undo / redo (drafts) |
| BoQ editor | Ctrl+] / Ctrl+[ | Indent / outdent node |
| BoQ editor | Ctrl+Shift+Ins | New section |
| Hub | Ctrl+N | New document (type menu) |
| Hub | Ctrl+M | Mark selected as paid (opens confirm with undo) |
| Accounts, items, parties (lists and detail) | Ctrl+L | Open the Card (account / item / party ledger card, §14.10) |
| Help | (i) button / Shift+F1 | Reopen this screen's banner with "All features on this screen" expanded |

Notes:
1. Shortcuts are bound by physical key (`KeyboardEvent.code`); the labels above are for a US layout, and menus/tooltips show the label of the active layout (§3.5).
2. Issuing is irreversible, so it has no Ctrl+Enter or Ctrl+P binding. Ctrl+Shift+P stays the command palette, which is why "Issue & print" is Ctrl+Shift+F10.
3. Browser accelerators (F5, Ctrl+R, Chromium Ctrl+P / Ctrl+F, zoom) are disabled in WebView2 (§6); the app's own bindings above apply.

---

## Appendix B — Hint copy examples (EN / AR)

All Arabic copy is Modern Standard Arabic (A30). Regional dialect, if ever wanted, goes only into an optional UI overlay such as `ar-IQ.json`, never into `ar.json` or printed documents.

| hint_id | Title | Body |
|---|---|---|
| task.invoice.create.paste | Paste lines from Excel / الصق الأسطر من إكسل | Copy rows (item, qty, price) in Excel and press Ctrl+V in the lines grid. / انسخ الصفوف (الصنف، الكمية، السعر) من إكسل، ثم اضغط Ctrl+V في جدول الأسطر. |
| task.invoice.issue | Numbers are final / الرقم نهائي | After Issue the invoice gets its number and can only be corrected by a credit note. / بعد الإصدار تأخذ الفاتورة رقمها النهائي، ولا تُصحَّح إلا بإشعار دائن. |
| task.invoice.correct | Credit + corrected copy / إشعار دائن ونسخة مصححة | We cancel the invoice with a credit note and open a corrected copy for you to issue. / نلغي الفاتورة بإشعار دائن ونفتح لك نسخة مصححة لتصدرها. |
| task.invoice.newitem | Create items inline / أنشئ صنفاً من هنا | Type a new name and press Alt+C to add it without leaving the invoice. / اكتب اسماً جديداً واضغط Alt+C لإضافته دون مغادرة الفاتورة. |
| task.payment.receive | One payment, many invoices / دفعة واحدة لعدة فواتير | Enter the amount; we fill the oldest invoices first. Extra money stays as credit. / أدخل المبلغ؛ نسدّد الفواتير الأقدم أولاً، ويبقى الفائض رصيداً للزبون. |
| task.void_vs_credit | Void or credit note? / إلغاء أم إشعار دائن؟ | Void only unpaid mistakes in an open period; otherwise create a credit note. / الإلغاء فقط لخطأ غير مدفوع في فترة مفتوحة؛ وفي غير ذلك أنشئ إشعاراً دائناً. |
| task.price.dated | Prices from a date / سعر ابتداءً من تاريخ | New prices apply from the date you choose; old invoices never change. / يسري السعر الجديد من التاريخ الذي تختاره، ولا تتغير الفواتير السابقة. |
| task.excel.locked | Excel file is open / ملف إكسل مفتوح | Close it in Excel and it updates automatically. Nothing is lost. / أغلق الملف في إكسل وسيُحدَّث تلقائياً. لم يُفقد شيء. |
| task.template.edit | See the real PDF / عاين ملف PDF الحقيقي | The preview is the final PDF. Try "Test with 60 lines" before printing. / المعاينة هي ملف PDF النهائي. جرّب «اختبار بـ60 سطراً» قبل الطباعة. |
| task.report.layout | Save your layout / احفظ تخطيطك | Pick columns, sort and filter, then save it as your layout. / اختر الأعمدة والفرز والتصفية، ثم احفظها تخطيطاً خاصاً بك. |
| task.boq.paste | Paste your BoQ / الصق جدول الكميات | Paste rows from Excel; indented rows become sections. / الصق الصفوف من إكسل؛ تتحول الصفوف المُزاحة إلى أقسام. |
| task.payapp.cumulative | Enter totals to date / أدخل المنجز حتى الآن | Type the quantity or % done to date; this period is calculated for you. / أدخل الكمية أو النسبة المنجزة حتى الآن، وتُحسب قيمة هذه الفترة تلقائياً. |
| task.letter.issue | Numbered on issue / يُرقَّم الكتاب عند الإصدار | The letter gets its number and date from the register when you issue it. / يأخذ الكتاب عدده وتاريخه من السجل عند إصداره. |
| setup.fx.missing | Exchange rate missing / سعر الصرف غير موجود | Add today's USD rate so totals in IQD are correct. / أضف سعر الدولار لهذا اليوم لتكون المجاميع بالدينار صحيحة. |
| setup.backup.old | Backup is old / النسخة الاحتياطية قديمة | Last backup was 9 days ago. Back up now. / آخر نسخة احتياطية قبل 9 أيام. أنشئ نسخة الآن. |
| toast.task.complete | Done / تم | Done — INV-2026-00042 issued · Don't show this tip again / تم — صدرت الفاتورة INV-2026-00042 · لا تُظهر هذه النصيحة مرة أخرى |
| feature line (banner expander) | Convert to the next step / التحويل إلى الخطوة التالية | Turn a quote into an order or invoice, copying only what is left. Ctrl+Shift+C / حوّل عرض السعر إلى طلب أو فاتورة بنسخ الكميات المتبقية فقط. Ctrl+Shift+C |

---

## Appendix C — Country pack examples

**C.1 IQ placeholder (ships with MVP; replace after research — A9):**
```json
{
  "country": "IQ", "version": "2026.11.0-placeholder", "valid_from": "2026-01-01",
  "currency": { "code": "IQD", "calc_decimals": 0, "display_decimals": 0, "cash_rounding_increment": null },
  "default_price_mode": { "b2c": "incl", "b2b": "excl" },
  "rounding": { "mode": "category", "method": "half_up" },
  "categories_used": ["S","Z","E","O"],
  "rates": [],
  "user_defined_rates_allowed": true,
  "document_titles": { "INVOICE": { "ar": "فاتورة", "en": "Invoice" },
                       "CASH_SALE": { "ar": "وصل بيع", "en": "Sales receipt" } },
  "required_fields": { "INVOICE": ["number","doc_date","seller.name","buyer.name","lines","totals"] },
  "numbering": { "gapless": true, "reset": "yearly" },
  "retention_years": null,
  "registration": { "threshold": null, "currency": "IQD", "source_url": null },
  "tax_point_rule": "supply_date_else_doc_date",
  "tax_fx_rule": { "basis": null, "allowed_sources": ["central_bank", "manual"], "source_url": null },
  "tax_on_advances": null,
  "pos_fiscalization": "none",
  "language_rules": { "required": [], "optional": ["ar","en"] },
  "qr": { "type": "none" },
  "einvoicing": { "status": "none", "notes": { "en": "Not researched. Verify current Iraqi requirements with an accountant.", "ar": "لم يُبحث بعد. تأكد من المتطلبات العراقية الحالية مع محاسب." } },
  "return_boxes": [],
  "verified": false
}
```

**C.2 Pack validation rules (core MUST enforce on import):** valid signature (release builds); semantic version; no rate without `valid_from`; category codes ∈ UNCL5305 set; every `required_fields` path known to the validator; titles present for all enabled document types in at least one language; `calc_decimals ≤` the ISO exponent; `tax_fx_rule`, `tax_point_rule`, `pos_fiscalization` and `einvoicing.status` present; a pack with `verified: true` is rejected unless **every** rate, threshold and return box carries `source_url`, `verified_by` and `verified_at`; packs for countries without VAT (e.g. KW, QA — verify) contain no `vat` rates.

**C.3 Sale-status index (`assets/country-packs/index.json`, A34):** `[{ "country": "IQ", "pack_version": "…", "sale_status": "supported" | "limited" | "not_supported", "note": { "ar": "…", "en": "…" } }]` — drives checkout copy, the EULA coverage statement and the setup wizard.

---

## Appendix D — Domain events → outbox targets

**Generated, not hand-written:** `scripts/gen-appendix-d.rs` renders this table from the command registry (§12.2) into `docs/APPENDIX_D.md`; the copy below is the initial design. CI fails if the generated table differs from the committed one, or if a mutating command has neither targets nor `#[no_excel(reason)]`. "activity" = `report:activity:<yyyy-mm>`, enqueued by every row below except the `#[no_excel]` rows.

| Event (mutating command) | Excel targets enqueued | Other reactions |
|---|---|---|
| `party.created/updated/archived` | `customer:<uid>` or `supplier:<uid>` (skipped when `excel_mirror = 0`), `report:customers` / `report:suppliers`, activity | folder/file rename if name changed (issued rows keep snapshots) |
| `price.changed` (party scope) | `customer:<uid>`, `report:items`, activity | impact preview cache invalidated |
| `price.changed` (price-list or `all` scope) | `report:items`, activity; affected customer workbooks marked **stale** (lazy, §12.3) | — |
| `document.issued` (sale invoice, cash sale, notes, progress/retention invoices) | `customer:<uid>` (or `report:cashsales:<yyyy-mm>` when `excel_mirror = 0`), `report:sales:<yyyy-mm>`, `report:sales_summary:<yyyy>` (idle), `report:vat:<period by tax_point_date>`, `report:customers`, activity | PDF render; PDF linked/copied into the customer's `Invoices\` folder; email/WhatsApp if requested |
| `document.issued` (quote, proforma, order, delivery note) | `customer:<uid>` (Quotes/Orders sheets), activity | — |
| `document.issued` (PO, goods receipt, bill, supplier credit) | `supplier:<uid>`, `report:purchases:<yyyy-mm>`, `report:vat:<period>`, `report:suppliers`, activity | stock/cost updates |
| `document.issued` (EXPENSE) / `expense.quick_posted` | `report:expenses:<yyyy>`, `report:cashbank:<yyyy>`, activity (+ supplier workbook if a supplier is set) | — |
| `document.voided` / `credit_note.issued` / `debit_note.issued` | same targets as the original's issue, for the void/note month | reversing journal |
| `document.sent` | party workbook (Sent column), activity | — |
| `payment.posted/voided`, `allocation.changed` | party workbook, `report:payments:<yyyy-mm>`, `report:cashbank:<yyyy>`, `report:customers` / `report:suppliers`, activity | balance caches |
| `transfer.posted`, `pettycash.topped_up/counted`, `owner.drawing_posted/capital_posted` | `report:cashbank:<yyyy>`, activity | — |
| `cheque.status_changed` | party workbook, `report:cashbank:<yyyy>`, activity | allocation reversed on a bounced incoming cheque |
| `bank_rec.finished` | `report:cashbank:<yyyy>` (Reconciliations sheet), activity | — |
| `cash_session.opened/closed` | `report:cashsales:<yyyy-mm>`, `report:cashbank:<yyyy>`, activity | X/Z report |
| `stock.moved` (receipt, issue, adjustment, transfer, assembly) | `report:stockmoves:<yyyy-mm>` (debounced ≥ 60 s), `report:items`, activity | recost job if back-dated |
| `landed_cost.applied/reversed` | `report:stockmoves:<yyyy-mm>`, `supplier:<uid>`, activity | cost adjustments |
| `bom.saved` | `report:items` (BOMs sheet), activity | — |
| `fx_rate.saved` | `report:items` (FX rates sheet), activity | — |
| `journal.posted` (any source) | `report:ledger:<yyyy-mm>` | — |
| `letter.issued/received/voided` | `report:letters:<yyyy>`, activity | PDF archive |
| `statement.generated` | party `Statements\` folder copy, activity | `statement_runs` snapshot |
| `project.*` (pay apps, VOs, BoQ lock) | `project:<uid>`, `customer:<uid>`, activity | progress invoice creation |
| `tax_period.filed` | `report:vat:<period>`, activity | lock period edits |
| `settings.changed`, `member.*`, `template.saved`, `numbering.hwm_restore` | activity only (settings and users are not mirrored as data) | — |
| `brand.changed` | **all** workbooks marked stale (idle worker, progress) | — |
| `settings.excel_root_changed` / `excel.layout_changed` | all workbooks marked stale; user-confirmed lazy rebuild with progress | the old root is left untouched |
| `document.draft_saved` (autosave) | `#[no_excel("draft")]` | `editor_autosave` |
| `report_layout.saved`, `ui_prefs.changed`, `hint_state.changed` | `#[no_excel("view preference")]` | — |

---

## Appendix E — Posting rules (templates; account codes from §14.2)

| Source | Debit | Credit |
|---|---|---|
| Invoice (sale) | 1100 AR (payable − retention) · 1110 Retention (if any) · 1160 WHT receivable (if withheld by customer, ASSUMPTION) | income account per §10.6 (item account, else 4100 for services/labour, else 4000) (net) · 2100 Tax |
| Cash sale | Payment account (− fee) · 6100 Fee | 4000 Sales · 2100 Tax |
| COGS on issue (stock items) | 5000 COGS | 1200 Inventory |
| Credit note (sale) | 4000 Sales · 2100 Tax | 1100 AR (or 2200 if already paid → credit) |
| Debit note (sale) | 1100 AR | 4000/4900 · 2100 Tax |
| Receipt allocated to invoice | Payment account (amount − fee) · 6100 Fee · 4950 (FX loss) | 1100 AR (at invoice rate) · 4950 (FX gain) |
| Receipt unallocated / deposit | Payment account | 2200 Customer deposits & credits |
| Apply credit/deposit later | 2200 | 1100 |
| Refund to customer | 2200 (or 1100) | Payment account |
| Deposit invoice (if tax due on advances) | 1100 | 2200 · 2100 Tax |
| Final invoice "less advance" line | 2200 (advance net) · 2100 (advance tax reversal) | 1100 |
| Supplier bill (stock) | 1200 Inventory (incl. the non-recoverable share of tax) · 1300 Input tax (recoverable share) | 2000 AP |
| Supplier bill (expense) | 6xxx Expense from the line's `account_code` (incl. the non-recoverable share of tax) · 1300 Input tax (recoverable share) | 2000 AP |
| Pay supplier bill | 2000 AP · 6100 Fee · 4950 (FX loss) | Payment account · 4950 (FX gain) |
| Advance to supplier | 1150 | Payment account |
| Quick expense | 6xxx (incl. non-recoverable tax) · 1300 (recoverable tax) | Payment account |
| Landed cost voucher | 1200 Inventory (remaining qty share) · 5100 Cost adjustments (consumed share) | 2000 AP (freight/customs bill) |
| Processor payout / cash deposit (transfer) | 1020 Bank | 1030 Processor / 1000 Cash drawer |
| Cross-currency transfer | Destination account (to amount) · 4950 (loss) | Source account (from amount) · 4950 (gain) |
| Petty cash top-up | 1010 | 1020 |
| Cash count difference | 6900 (shortage) / cash account (surplus) | cash account / 6900 |
| Owner drawing | 3100 | Payment account |
| Opening customer balance | 1100 (per party) | 3900 |
| Opening supplier balance | 3900 | 2000 (per party) |
| Opening stock | 1200 | 3900 |
| Stock adjustment (loss) | 5100 Cost adjustments | 1200 |
| Stock adjustment (gain) | 1200 | 5100 Cost adjustments |
| Cash session close (Z) difference | 6900 (shortage) / drawer account (surplus) | drawer account / 6900 |
| Receipt / payment voucher (سند قبض / سند صرف) | as "Receipt allocated" / "Pay supplier bill" or the chosen account | — |
| Assembly | 1200 (output) | 1200 (components) · labour/overhead absorption account (ASSUMPTION: 5100) |
| Progress invoice | 1100 (net due + tax) · 1110 (retention this period) · 2200 (advance recovery) | 4000/4100 (gross this period) · 2100 Tax |
| Retention release invoice | 1100 | 1110 (· 2100 if tax due at release — pack setting) |
| Bounced cheque | 1100 AR | Payment account (bank) — and allocation reversed |
| Realized FX on allocation | see receipt / bill payment rows | |
| Period-end revaluation (Pro, optional) | 1100/2000 or 4950 | 4950 or 1100/2000 — reversed on day 1 of next period |
| Year-end | nothing posted: 3200 Retained earnings is derived in reports (§10.6) | |

Withholding on purchases (company withholds from supplier): `Dr 2000 AP (gross) / Cr Payment account (net) · Cr 2150 Withholding payable`.

---

## Appendix F — Plain-language glossary (UI labels in Guided help level)

| Accounting term | EN UI label | AR UI label |
|---|---|---|
| Accounts receivable | Customers owe you | مستحقات على الزبائن |
| Accounts payable | You owe suppliers | مستحقات للموردين |
| Undeposited funds / clearing | Waiting to go to bank | بانتظار الإيداع في البنك |
| Customer deposits / unapplied credit | Customer credit | رصيد الزبون |
| Post / issue | Issue (number becomes final) | إصدار (يصبح الرقم نهائياً) |
| Void | Cancel this document | إلغاء المستند |
| Credit note | Credit note (refund/correction) | إشعار دائن (تصحيح/إرجاع) |
| Debit note | Extra charge note | إشعار مدين (مبلغ إضافي) |
| COGS | Cost of what you sold | كلفة البضاعة المباعة |
| Landed cost | Shipping & customs added to cost | الشحن والجمارك المضافة للكلفة |
| FX gain/loss | Exchange-rate difference | فرق سعر الصرف |
| Aging | How old the debt is | عمر الدين |
| Statement of account | Statement | كشف حساب |
| Retention | Amount held until handover | المبلغ المحتجز لحين الاستلام |
| Schedule of values | Contract items & values | بنود وقيم العقد |
| Payment application / IPC | Progress claim | مستخلص |
| Variation order | Change order | أمر تغيير |
| Withholding tax | Tax deducted by customer | ضريبة مستقطعة من الزبون |
| Reverse charge | Buyer pays the tax | الضريبة على المشتري |
| Zero-rated / Exempt / Out of scope | 0 % taxable / Exempt / Not taxable | خاضع بنسبة صفر / معفى / خارج نطاق الضريبة |
| Lock date | Closed until | مقفل لغاية |
| Trial balance | Balances check | ميزان المراجعة |
| Account ledger card | Account card (cash book / bank book) | بطاقة حساب (دفتر الصندوق / دفتر البنك) |
| Item ledger / stock card | Item card | بطاقة صنف |
| Customer / supplier ledger | Party card (statement) | بطاقة الزبون / المورد (كشف حساب) |
| Profit & loss | How much did I make | كم ربحت |
| Balance sheet | What I own and owe | ما أملكه وما عليّ |
| Retained earnings | Profit kept from past years | الأرباح المحتجزة من السنوات السابقة |
| Receipt voucher / payment voucher | Receipt / Payment voucher | سند قبض / سند صرف |
| Cash session (X/Z report) | Cash drawer session / day close | جلسة الصندوق / إغلاق اليوم |
| Installments | Pay in parts | الدفع بالأقساط |

---

## Appendix G — Dependency license policy

**Allowed:** MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC, Zlib, Unicode-3.0, MPL-2.0 (unmodified, file-level), OFL-1.1 (fonts), CC0.
**Forbidden in shipped binary:** GPL (any), AGPL, LGPL (static linking), SSPL, BUSL, Polyform Noncommercial, "free for non-commercial use", revenue-capped licenses.
**Explicit deny list (from research):**
| Package | Reason |
|---|---|
| Handsontable (≥ 7) | free license is non-commercial only |
| Intro.js | AGPL / paid commercial license |
| Shepherd.js ≥ 14 | AGPL / paid commercial license from v14 |
| EPPlus ≥ 5 | Polyform Noncommercial or paid per developer |
| ofxtools | GPL-3.0-only |
| ofxstatement | GPL-3 |
| beancount (library) | GPL-2.0-only (writing the text format is fine) |
| AG Grid Enterprise | commercial; Community also too heavy for budget |
| QuestPDF | not free above $1M revenue |
| Slint (royalty-free tier) | requires in-app attribution (not chosen anyway) |
| wkhtmltopdf | outdated engine (quality, not license) |
**Preferred building blocks:** tauri + plugins, rusqlite, rust_decimal, iso_currency, rust_xlsxwriter, calamine, zip, typst / typst-as-lib (package download and embedded fonts disabled), qrcode, csv, quick-xml, serde, sha2, ed25519-dalek, rustls (ring provider), notify, windows, lettre (verify), keyring (verify), zstd (verify size), a barcode crate such as barcoders (verify), driver.js, uPlot, Noto/Amiri/Inter print fonts (OFL).
CI enforces this with `cargo-deny` (Rust) and a license checker for npm; any exception needs an ADR approved by the human.

---

## Appendix H — Screen & task registry (normative)

Machine copy: `src/help/registry/screens.json` and `tasks.json`; this appendix is the initial content. Conventions: banner `hint_id` = `screen.<screen_id>.banner`; F1 page = `docs/help/{ar,en}/<screen_id>.md`; the "Feature-list seeds" column seeds the banner's `features` list (§18.5), which must end up listing **every** command registered for the screen. Banner bodies follow §18.11 (bodies for the core screens are in §18.12). Editions: "all" = Trial/Starter/Pro; milestone in brackets when later than MVP.

**CI tests (MUST):** every router route has a row here with ar and en banner title/body, a non-empty `features` list and an F1 page in both languages; every command registered for a screen appears in its `features`; every `task_id` has exactly one start emitter and one completion emitter in code; every dialog/wizard has its subtitle.

**H.1 Screens**
| `screen_id` | Route | Edition · module | Banner title (EN / AR) | Feature-list seeds | `task_ids` | Empty state (primary action) |
|---|---|---|---|---|---|---|
| `dashboard` | `/` | all | Your business today / عملك اليوم | Today panel, Get-started checklist, status chips, global New | — | n/a |
| `hub` | `/hub` | all | All your sales documents / جميع مستندات البيع | Sales/Purchases switch, New menu, live counts, saved views, bulk print/send/convert/mark paid, preview | `invoice.create`, `quote.create`, `doc.convert`, `payment.mark_paid` | New invoice · Ctrl+N; Import |
| `editor` | `/doc/:uid` | all | Fast invoice entry / إدخال سريع للفاتورة | typeahead, inline create, paste from Excel, arithmetic, price source, last prices, Issue (F10), Print (Ctrl+P), Correct this invoice, installments, BoQ mode, pay-to account, second currency | `invoice.create`, `invoice.issue`, `invoice.correct`, `item.inline_create`, `doc.void_or_credit`, `boq_lite.create` | n/a |
| `quick_sale` | `/pos` | all [v1]; off when `pos_fiscalization ≠ none` | Quick sale / بيع سريع | scanner input, tender & change, split payment, thermal print, drawer kick, X/Z reports | `cash_sale.create`, `cash_session.close` | n/a |
| `cash_sessions` | `/pos/sessions` | all [v1] | Cash drawer sessions / جلسات الصندوق | open/close, X report, Z report, differences | `cash_session.close` | Open a session |
| `purchases` | `/hub?side=purchases` | basic bills all; PO/GRN Pro | Purchases & bills / المشتريات وفواتير الموردين | PO, goods receipt, bills, supplier credits, pay several bills, advances | `bill.create`, `po.create`, `bill.pay` | New bill · Ctrl+N |
| `customers` | `/customers` | all | Customers & balances / الزبائن وأرصدتهم | card (Ctrl+L), statement, receive money, own prices, open Excel folder, consolidated parent | `customer.create`, `payment.receive` | New customer · Ctrl+N; Import |
| `suppliers` | `/suppliers` | all | Suppliers & bills / الموردون وفواتيرهم | card, statement, pay bills, supplier prices | `supplier.create`, `bill.pay` | New supplier · Ctrl+N; Import |
| `items` | `/items` | all | Materials & products / المواد والمنتجات | item card, stock, units, codes, barcodes, accounts, labels | `item.create` | New item · Ctrl+N; Import |
| `prices` | `/prices` | all | Prices by date / الأسعار حسب التاريخ | scopes, valid from/to, incl/excl, bulk % change with preview | `price.set_dated` | New price; Import prices |
| `price_lists` | `/prices/lists` | all | Price lists / قوائم الأسعار | lists per customer group, incl/excl, assign to customers | `price_list.create` | New price list |
| `payments` | `/payments` | all | Money in and out / المقبوضات والمدفوعات | receipt and payment vouchers, allocation, refunds, deposits | `payment.receive`, `payment.pay` | Receive money |
| `quick_expense` | `/expenses/new` | all | Quick expense / مصروف سريع | category chips, paid from, tax included, receipt photo | `expense.quick` | n/a |
| `expenses` | `/expenses` | all | Expenses / المصاريف | by category, receipts, Excel copy | `expense.quick` | New expense |
| `petty_cash` | `/petty-cash` | all | Petty cash / صندوق النثرية | top up, count cash, account card | `pettycash.count` | Top up petty cash |
| `transfers` | `/transfers` | all | Move money between accounts / تحويل الأموال بين الحسابات | transfers, cross-currency amounts, deposits to bank | `transfer.create` | New transfer |
| `card_settlements` | `/settlements` | all | Waiting for the bank / بانتظار البنك | payouts, fees, multi-receipt match | `settlement.payout` | n/a |
| `cheques` | `/cheques` | all | Cheques due / الشيكات المستحقة | incoming and outgoing, status changes, due dates | `cheque.record` | n/a ("No cheques yet") |
| `accounts` | `/accounts` | all | Chart of accounts / دليل الحسابات | plain names, sub-accounts, account card | `account.create_sub` | n/a |
| `account_card` | `/cards/account/:code` | all | Account card / بطاقة حساب | running balance, period, drill-down, PDF/XLSX | — | "No movements in this period" |
| `item_card` | `/cards/item/:uid` | all | Item card / بطاقة صنف | running quantity, cost, value, warehouse filter | — | "No movements in this period" |
| `statements` | `/statements` | all | Customer statements / كشوفات الحساب | activity/outstanding, aging edges, per currency, bulk, scheduled [v1] | `statement.create` | n/a |
| `fx_rates` | `/fx` | Starter: one extra currency [v1]; Pro | Exchange rates / أسعار الصرف | manual, CSV, optional online fetch, tax rates | `fx.add_rate` | Add today's rate |
| `inventory` | `/inventory` | all | Real costs / الكلفة الحقيقية | on hand, valuation at a date, layers (Pro) | — | n/a |
| `stock_ops` | `/inventory/ops` | adjustments all; warehouses/transfers Pro [v1] | Warehouses & stock moves / المخازن وحركات المخزون | warehouses, transfers, adjustments | `stock.adjust` | New adjustment |
| `landed_cost` | `/inventory/landed` | Pro [v1] | Shipping & customs / الشحن والجمارك | vouchers, allocation basis, consumed-qty adjustment | `landed_cost.apply` | New landed-cost voucher |
| `bom` | `/bom` | Pro [v1] | Recipes & assemblies / الوصفات والتجميع | versions, waste, labour, cost at a date | `bom.create`, `assembly.create` | New recipe |
| `comparisons` | `/analytics` | basic all; full Pro [v1] | Compare prices & margins / مقارنة الأسعار والهوامش | price history, margins, cost drift | — | n/a |
| `reports` | `/reports` | all | Reports / التقارير | catalog, search, favourites, layouts | — | n/a |
| `report_view` | `/reports/:id` | all; grouping/charts Pro [v1] | Your report, your layout / تقريرك بتخطيطك | column chooser, sort, filter, group, chart, save layout, PDF/XLSX | `report.customize` | "No data for these filters" |
| `vat_return` | `/tax/return` | all [v1] | VAT return / الإقرار الضريبي | boxes, drill-down, Excel export, mark filed | `vat_return.prepare` | n/a |
| `tax_periods` | `/tax/periods` | all [v1] | Tax periods / الفترات الضريبية | open/filed/locked periods | — | n/a |
| `tax_settings` | `/settings/tax` | all | Taxes / الضرائب | registrations, rates, inclusive mode, disclaimer | — | n/a |
| `country_packs` | `/settings/tax/packs` | all | Country rules / قواعد الدولة | import signed pack, versions, verified badge | `pack.import` | n/a |
| `accountant_export` | `/export/accountant` | GL+TB all; full Pro [v1] | Send to your accountant / إرسال إلى المحاسب | pack, mappings, lock period | `accountant.export` | n/a |
| `bank_rec` | `/bank-rec` | Pro [v1] | Match your bank statement / طابِق كشف البنك | import, suggestions, rules, finish at zero | `bank_rec.run` | Import a bank file |
| `users_roles` | `/settings/users` | all | Users & roles / المستخدمون والصلاحيات | members, roles, PIN, stamp permission, recovery code | `member.add` | n/a |
| `license` | `/settings/license` | all | Your license / ترخيصك | activate online/offline, deactivate, edition | `license.activate` | n/a |
| `appearance` | `/settings/appearance` | all | Look & colours / المظهر والألوان | presets, accent, brand colour, overrides, density, text size, UI font, export theme | `appearance.customize` | n/a |
| `help_tips` | `/settings/help` | all | Help & tips / المساعدة والنصائح | help level, task reminder mode, reset tips | — | n/a |
| `email_settings` | `/settings/email` | all [v1] | Email sending / إرسال البريد الإلكتروني | SMTP, message templates, test send | — | n/a |
| `recurring` | `/recurring` | all [v1] | Recurring invoices / الفواتير المتكررة | schedules, catch-up drafts | `recurring.create` | New recurring invoice |
| `reminders` | `/reminders` | all [v1] | Payment reminders / تذكيرات الدفع | 3 levels, templates, log | — | n/a |
| `branches_series` | `/settings/numbering` | series all; branches Pro [v1] | Numbering & branches / الترقيم والفروع | patterns, yearly reset, high-water marks | — | n/a |
| `backup` | `/settings/backup` | all | Keep your data safe / حافظ على بياناتك | backup now, restore, folder, cap, verification | `backup.restore` | n/a |
| `excel_settings` | `/settings/excel` | all | Your Excel copy / نسختك في إكسل | folder, layout, rebuild, problems, role warning, `_Owner` folder | `excel.open_locked` | n/a |
| `templates` | `/templates` | all | Your document design / تصميم مستنداتك | gallery, apply my brand, basic settings, assignments | `template.edit` | n/a |
| `template_designer` | `/templates/:uid/design` | Pro [v1] | Design freely / صمّم بحرية | click-to-select, any colour, free placement, visibility rules, pre-printed, calibration, `.adtemplate` | `template.edit` | n/a |
| `labels` | `/items/labels` | all [v1] | Barcode labels / ملصقات الباركود | Code128/EAN-13, sheets, thermal | `labels.print` | n/a |
| `letters` | `/letters` | all | Official letters / الكتب الرسمية | templates, fields, rich-but-safe body, stamp, Hijri | `letter.issue` | New letter |
| `letter_register` | `/letters/register` | all | Letter register / سجل الصادر والوارد | outgoing/incoming, search, replies, Excel register | `letter.receive` | Record an incoming letter |
| `people` | `/people` | all; owner/manager only | People for certificates / بيانات الموظفين للشهادات | HR fields, certificates, anonymize | `person.create` | New person |
| `signers` | `/settings/signers` | all | Signers & stamps / المخوَّلون بالتوقيع والأختام | signature/stamp images, titles | — | Add a signer |
| `eng_tables` | `/eng-tables` | all [v1] | Engineering tables / الجداول الهندسية | built-in tables with sources, own tables, calculator | `eng.add_table` | n/a |
| `projects` | `/projects` | Pro [v1] | Projects & contracts / المشاريع والعقود | chain breadcrumb, tax profile, dashboard | `project.create` | New project |
| `boq_editor` | `/projects/:uid/boq` | Pro [v1] | Bill of quantities / جدول الكميات | tree grid, paste, functions, versions, return client file | `boq.paste` | Paste or import a BoQ |
| `rate_library` | `/projects/rates` | Pro [v1] | Rate build-ups / تحليل الأسعار | materials, labour, plant, refresh costs | — | New build-up |
| `variations` | `/projects/:uid/variations` | Pro [v1] | Change orders / أوامر التغيير | register, statuses, SoV lines | `variation.create` | New change order |
| `pay_apps` | `/projects/:uid/payapps` | Pro [v1] | Progress claims / المستخلصات | cumulative entry, certification, deductions, invoice | `payapp.create` | New progress claim |
| `takeoff` | panel in `boq_editor` | Pro [v2] | Quantity takeoff / حصر الكميات | dimension rows, deductions, functions, import | — | n/a |
| `subcontracts` | `/projects/:uid/subcontracts` | Pro [v2] | Subcontracts / عقود الباطن | packages, applications, retention, expiry alerts | — | New package |
| `cost_budget` | `/projects/:uid/cost` | Pro [v2] | Cost vs budget / الكلفة مقابل الميزانية | committed, actual, forecast, variance | — | n/a |
| `cash_flow` | `/projects/:uid/cashflow` | Pro [v2] | Cash flow & S-curve / التدفق النقدي ومنحنى S | planned, certified, actual, funding gap | — | n/a |

**H.2 Tasks**
| `task_id` | Start (UI event `task:start`) | Completion (exact domain event) | Hint `hint_id` · title EN / AR |
|---|---|---|---|
| `invoice.create` | New → Invoice, Ctrl+N in hub, Ctrl+Shift+N | `document.issued` (INVOICE, same draft uid) | `task.invoice.create.paste` · Paste lines from Excel / الصق الأسطر من إكسل |
| `invoice.issue` | first F10 / Issue click on a draft | `document.issued` (same uid) | `task.invoice.issue` · Numbers are final / الرقم نهائي |
| `invoice.correct` | More → Correct this invoice | `document.issued` of the linked replacement draft | `task.invoice.correct` · Credit + corrected copy / إشعار دائن ونسخة مصححة |
| `item.inline_create` | typeahead with no match / Alt+C | `item.created` (origin = editor) | `task.invoice.newitem` · Create items inline / أنشئ صنفاً من هنا |
| `doc.void_or_credit` | More → Void or Credit note | `document.voided` or `credit_note.issued` | `task.void_vs_credit` · Void or credit note? / إلغاء أم إشعار دائن؟ |
| `quote.create` | New → Quote | `document.issued` (QUOTE) | `task.quote.create` · Quotes are not sales / عرض السعر ليس مبيعاً |
| `doc.convert` | Convert to… / Ctrl+Shift+C | `document.converted` | `task.doc.convert` · Convert what's left / حوّل المتبقي فقط |
| `payment.receive` | Receive money panel opened | `payment.posted` (direction in) | `task.payment.receive` · One payment, many invoices / دفعة واحدة لعدة فواتير |
| `payment.mark_paid` | Mark paid click / Ctrl+M | `payment.posted` not undone within 10 s | `task.payment.markpaid` · Undo for 10 seconds / يمكنك التراجع خلال 10 ثوانٍ |
| `payment.pay` / `bill.pay` | Pay bill / New payment voucher | `payment.posted` (direction out) | `task.payment.pay` · Pay several bills at once / سدّد عدة فواتير معاً |
| `price.set_dated` | New price | `price.changed` | `task.price.dated` · Prices from a date / سعر ابتداءً من تاريخ |
| `statement.create` | Statement button | `statement.generated` | `task.statement` · Saved exactly as sent / يُحفظ الكشف كما أُرسل |
| `excel.open_locked` | Open in Excel on a locked file | `excel.file_rebuilt` (same target) | `task.excel.locked` · Excel file is open / ملف إكسل مفتوح |
| `template.edit` | open template settings/designer | `template.saved` | `task.template.edit` · See the real PDF / عاين ملف PDF الحقيقي |
| `report.customize` | open the Layout panel | `report_layout.saved` | `task.report.layout` · Save your layout / احفظ تخطيطك |
| `import.run` | start the import wizard | `import.committed` | `task.import` · Dry run first / جرّب أولاً دون حفظ |
| `expense.quick` | New → Quick expense | `expense.quick_posted` | `task.expense.quick` · Attach the receipt photo / أرفق صورة الإيصال |
| `transfer.create` | New transfer | `transfer.posted` | `task.transfer` · Moving money is not income / التحويل ليس دخلاً |
| `cheque.record` | payment method = cheque | `payment.posted` with a cheque | `task.cheque` · Track the due date / تابع تاريخ الاستحقاق |
| `bank_rec.run` | start a reconciliation | `bank_rec.finished` | `task.bankrec` · Finish at zero / أنهِ عندما يصبح الفرق صفراً |
| `vat_return.prepare` | open a return for a period | `tax_period.filed` | `task.vat.file` · Filing locks the period / وضع الإقرار كمقدَّم يقفل الفترة |
| `letter.issue` | New letter | `letter.issued` | `task.letter.issue` · Numbered on issue / يُرقَّم الكتاب عند الإصدار |
| `letter.receive` | Record incoming letter | `letter.received` | `task.letter.receive` · Record their reference / سجّل عددهم وتاريخهم |
| `boq_lite.create` | New quote in BoQ mode | `document.issued` (QUOTE, BoQ mode) | `task.boqlite` · Use engineering tables / استخدم الجداول الهندسية |
| `boq.paste` | paste into the BoQ grid | `boq.saved` | `task.boq.paste` · Paste your BoQ / الصق جدول الكميات |
| `payapp.create` | New progress claim | `pay_app.certified` | `task.payapp.cumulative` · Enter totals to date / أدخل المنجز حتى الآن |
| `cash_session.close` | Close day / Z report | `cash_session.closed` | `task.cash.close` · Count the cash first / عُدّ النقد أولاً |
| `backup.restore` | Restore backup | `backup.restored` | `task.restore` · Restores into a new file / الاستعادة إلى ملف جديد |
| `owner.margin` | F9 | `ui.margin_shown` (PIN accepted; UI-only event, flagged) | `task.owner.margin` · Only you see margins / الهوامش تظهر لك فقط |
| `appearance.customize` | open Appearance | `ui_prefs.changed` (theme) | `task.appearance` · Try a preset first / جرّب نمطاً جاهزاً أولاً |

Tasks not listed for a screen in H.1 (`customer.create`, `item.create`, `stock.adjust`, …) are simple forms: they register start/completion events but ship without a task hint unless one is added to the catalog.

**H.3 Dialogs and wizards (one-line subtitle, not dismissible)**
| Dialog / wizard | Subtitle (EN / AR) |
|---|---|
| Setup wizard | Four short steps; you can change everything later. / أربع خطوات قصيرة، ويمكنك تغيير كل شيء لاحقاً. |
| Import wizard | Nothing is saved until the last step, and you can undo for 7 days. / لا يُحفظ شيء قبل الخطوة الأخيرة، ويمكنك التراجع خلال 7 أيام. |
| Issue confirmation | The number becomes final; corrections need a credit note. / يصبح الرقم نهائياً، ويكون التصحيح بإشعار دائن. |
| Convert dialog | Only the remaining quantities are copied by default. / تُنسخ الكميات المتبقية فقط افتراضياً. |
| Allocation dialog | Oldest invoices are paid first; you can change it. / تُسدَّد الفواتير الأقدم أولاً، ويمكنك التعديل. |
| Correct this invoice | A credit note cancels the original and a corrected copy opens. / يُلغى الأصل بإشعار دائن وتُفتح نسخة مصححة. |
| Paste mapping | Tell us once which column is which; we remember it. / حدّد مرة واحدة ما يمثله كل عمود، وسنتذكر ذلك. |
| Printer calibration | Print the grid, measure the shift, enter it once per printer. / اطبع الشبكة، وقِس الإزاحة، وأدخلها مرة واحدة لكل طابعة. |
| Restore backup | Restores into a new file; your current file is not touched. / تتم الاستعادة إلى ملف جديد دون المساس بملفك الحالي. |
| Integrity check | Recomputes every hash and number; nothing is changed. / يعيد حساب كل بصمة ورقم دون تغيير أي شيء. |
| Activation | Online, or offline with a code; your data always stays available. / عبر الإنترنت أو دونه برمز، وتبقى بياناتك متاحة دائماً. |
| Recovery code | Print or write this code; it is the only way to reset the owner PIN. / اطبع هذا الرمز أو دوّنه؛ فهو الطريقة الوحيدة لإعادة تعيين رمز المالك. |

---

## Appendix I — Print data contract (normative)

Every printable kind (§9.2 N `doc_templates.doc_type`) receives exactly one JSON object, built in Rust and passed to Typst as the virtual file `/data.json` (§17.1). The template generator, the designer's field pickers, `visible_if` rules (§17.2), letter placeholders (§16.4) and the report builder (§17.10) all use these paths. Schemas: `assets/print-contract/<kind>.schema.json` (JSON Schema 2020-12), versioned by `contract_version`.

**Rules**
- Rust formats every number, amount, quantity, date and digit style (Latin / Arabic-Indic, per template) into `text` fields; Typst never formats numbers. Money appears as `{ "minor": <int>, "text": "<formatted>" }`; `minor` exists for visibility rules and checks only.
- Dates appear as `{ "iso": "YYYY-MM-DD", "text": "<formatted>", "hijri_text": "<optional>" }`.
- Strings are raw (no escaping, no markup); Typst reads them through `json()`, so they can never become code.
- Issued documents use the frozen snapshots (`party_snapshot_json`, `seller_snapshot_json`); drafts use live data and set `flags.draft = true`.
- Owner-only fields (cost, margin) never appear in the contract. `person.national_id` and `person.salary` appear only when the template's `fields_json` requests them and the issuing user is owner or manager.
- Additions are backwards compatible. A rename or removal bumps `contract_version`; the generator keeps an adapter for older versions so user templates are never force-migrated (§3.7).
- CI: data generated for every fixture document validates against its schema; every template field reference and every `visible_if` path resolves against the schema.

| Path | Type | Content |
|---|---|---|
| `contract_version` | int | version the data conforms to |
| `kind` | string | printable kind, e.g. `INVOICE`, `PAYMENT_RECEIPT`, `STATEMENT`, `LETTER:salary_certificate`, `REPORT`, `CHEQUE`, `LABEL` |
| `lang` | object | `primary`, `secondary`, `digits` (`latn` / `arab`), `layout` (`single` / `stacked` / `side_by_side`) |
| `flags` | object | `draft`, `void`, `demo`, `copy_no`, `preprinted` (watermarks, copy labels, pre-printed mode) |
| `labels.<key>` | `{ar, en, …}` | every printable label resolved for this template; a missing translation falls back to the primary language |
| `seller` | object | `legal_name`, `legal_name_secondary`, `trade_name`, `tax_ids[{scheme, value}]`, `registered` (bool per scheme), `address{building_no, street, additional_no, district, city, region, postal_code, country_code, line_free}`, `phone`, `email`, `website`, `logo`, `stamp`, `signature` (image ids) |
| `party` | object | `code`, `name`, `name_secondary`, `kind`, `tax_ids[]`, `billing_address{…}`, `shipping_address{…}`, `site_address{…}`, `contact{name, phone, email}`, `peppol_id` |
| `document` | object | `uid`, `type`, `title{ar, en}` (from pack and registration rules, §11.2), `number`, `doc_date`, `supply_date`, `tax_point_date`, `due_date`, `expires_on` (dates), `currency`, `fx_rate_text`, `dual_currency`, `dual_fx_rate_text`, `reference`, `subject`, `notes`, `terms`, `price_mode`, `tax_treatment`, `place_of_supply`, `original{number, date}` (notes), `reason`, `salesperson`, `branch{code, name}`, `project_code`, `custom{<key>: value}` |
| `lines[]` | array | `line_no`, `kind` (item / text / section / subtotal / deposit_deduction / retention / advance_recovery / progress), `item_code`, `barcode`, `description`, `description_secondary`, `qty{value, text}`, `uom{code, name}`, `unit_price{text}`, `discount_pct_text`, `discount`, `net`, `tax_code`, `tax_rate_text`, `tax`, `total` (money), `progress_pct_to_date_text`, `custom{}` |
| `charges[]` | array | `kind`, `reason`, `amount` (money), `tax_category`, `tax_rate_text` |
| `tax_summary[]` | array | `category_code`, `category_label{ar, en}`, `rate_text`, `base`, `amount`, `amount_local` (money), `exemption_text{ar, en}` |
| `totals` | object of money | `subtotal`, `discount`, `charges`, `tax`, `wht`, `rounding`, `total`, `payable`, `paid`, `balance`, `total_base`, `tax_local`, `dual_total` |
| `amount_in_words` | `{ar, en}` | tafqeet of `totals.payable` (or the letter/cheque amount) with currency and subunit names |
| `payment` | object | `pay_to{account_name, bank_name, iban, account_no, currency, payment_means_code}`, `reference`, `methods[]`, `qr{type, payload}` (EPC / Swiss / URL) |
| `qr` | object | pack QR `{type, payload}` (e.g. `zatca_tlv_phase1`, base64 computed in Rust) |
| `installments[]` | array | `seq`, `due_date`, `amount`, `paid` |
| `statement` | object (`STATEMENT`) | `type`, `period{from, to}`, `as_of`, `currency`, `opening`, `rows[{date, type, doc_no, reference, due_date, days_overdue, debit, credit, balance}]`, `closing`, `aging{edges[], buckets[]}`, `unallocated` |
| `voucher` | object (`PAYMENT_RECEIPT`, `PAYMENT_VOUCHER`, `JOURNAL_VOUCHER`) | `number`, `date`, `party`, `method`, `account`, `amount`, `cheque{no, bank, due_date}`, `card_last4`, `allocations[{doc_no, amount}]`, `memo`, journal `lines[]` for journal vouchers |
| `cheque` | object (`CHEQUE`) | `payee`, `date`, `amount`, `amount_in_words`, `crossed` |
| `label` | object (`LABEL`) | `item_code`, `name`, `price`, `barcode{symbology, value, image}` |
| `project` | object | `code`, `name`, `site_address`, `contract_type`, `tax_profile`, `retention_pct_text` |
| `pay_app` | object (`PAY_APP`) | G702-style header values (money) and G703-style `lines[]` |
| `boq` | object (`BOQ`, BoQ-lite quotes) | `sections[{ref, title, items[{ref, description, unit, qty, rate, amount}], subtotal}]`, `summary[]`, `grand_total` |
| `letter` | object (`LETTER:*`) | `register_no`, `date`, `direction`, `subject`, `recipient{name, title, address}`, `salutation`, `body_ast` (§16.5), `fields{<key>: value}` per the template's `fields_json`, `closing`, `signer{name, title, signature, stamp}`, `cc[]`, `attachments[]`, `external_ref{no, date}` |
| `person` | object (HR letters) | `name`, `name_secondary`, `job_title`, `department`, `hire_date`, `end_date`, `nationality`, `salary{text, words{ar, en}}`, `national_id` (restricted, see rules) |
| `report` | object (`REPORT`) | `title{ar, en}`, `filters_text[]`, `columns[{field, label, align, width_pct}]`, `groups[]`, `rows[][]` (pre-formatted text), `totals[]`, `generated_at` |
| `images.<id>` | virtual file | logos, stamps, signatures, barcodes and QR PNGs served by the Typst World |

---

## Appendix J — License signer service (normative; build in Phase 9)

**Purpose.** A tiny, stateless service that turns a merchant-of-record (MoR) license key into an Ed25519-signed offline token (§21.2). The MoR keeps customer and activation records; the signer stores nothing except rate-limit counters. Code lives in `services/license-signer/`.

**Before building (A29):** confirm that the chosen MoR (Lemon Squeezy preferred, Paddle alternative) accepts an Iraq-based seller and can pay out to Iraq or to an account the founder controls (Stripe/PayPal coverage). If not, decide the selling entity first — this can block Phase 9.

**Hosting (ASSUMPTION):** one serverless function on a provider with a free/low tier and a secret store (e.g. Cloudflare Workers or similar), plus a static offline-activation page on the same domain. HTTPS only; no database; logs keep only `key_hash` prefixes and error codes (no keys, no IPs beyond platform defaults); no telemetry.

**Endpoints (JSON over HTTPS):**
| Method & path | Request | Response | Notes |
|---|---|---|---|
| `POST /v1/activate` | `{license_key, instance_name, machine_hint, app_version, nonce}` | `{token}` | calls MoR *activate*, then *validate*; signs the token |
| `POST /v1/refresh` | `{license_key, instance_id, machine_hint, nonce}` | `{token}` | re-issues a token (e.g. after an edition upgrade); MoR *validate* |
| `POST /v1/deactivate` | `{license_key, instance_id}` | `{ok: true}` | MoR *deactivate*; frees an activation slot |
| `POST /v1/offline` | `{request_code}` (Base32 of JCS `{key_hash, license_key_enc, machine_hint, nonce}`) | `{response_code, qr_png}` | used by the offline activation page; same checks as activate |
| `GET /v1/keys` | — | `{keys: [{kid, public_key_b64, status}]}` | informational; the app embeds its keys |

**MoR calls (Lemon Squeezy License API; verify current docs before building):** `POST /v1/licenses/activate` (`license_key`, `instance_name`) → `instance.id`; `POST /v1/licenses/validate` (`license_key`, `instance_id`) → status, product/variant (edition), customer; `POST /v1/licenses/deactivate` (`license_key`, `instance_id`). The activation limit (3, A11) is configured on the MoR product, not in the signer.

**Token (canonical form):** payload = JCS (RFC 8785) of `{v:1, kid, key_hash, edition, major, licensee_hash, instance_id, machine_hint, issued_at, updates_until, addons:[]}`; signature = Ed25519 over the JCS bytes; transport = `base64url(payload) + "." + base64url(signature)`; offline response code = Base32 of the same bytes in groups of 5 plus a QR. `key_hash` = SHA-256 of the normalized key; `licensee_hash` = SHA-256 of the lower-cased customer email + per-product salt.

**Key custody & rotation:** the Ed25519 private key lives only in the host's secret store, with two encrypted offline backups held by the founder. Every token carries `kid`. The app embeds the current public key and the next one; rotation = switch the signer to the next key and ship an app update that embeds the one after. Old tokens stay valid unless their `kid` appears in a signed revocation list shipped with app updates (never fetched at runtime).

**Offline activation page:** static HTML/JS on the signer domain, works on a phone: paste or scan the Activation Request Code → shows the Response Code and its QR. It sends only the request code to `/v1/offline`.

**Error codes** (each maps to a localized message with a next step): `LIC_INVALID_KEY`, `LIC_LIMIT_REACHED` (link to self-service deactivation), `LIC_REFUNDED_OR_DISABLED`, `LIC_EDITION_MISMATCH`, `LIC_BAD_REQUEST_CODE`, `LIC_MOR_UNAVAILABLE` (retry later; offline use continues), `LIC_CLOCK_SKEW`, `LIC_RATE_LIMITED`, `LIC_INTERNAL`.

**Limits & tests:** rate limits per `key_hash` and per IP; contract tests against a MoR sandbox; a tampered token, wrong `kid` or wrong `machine_hint` is rejected by the app (Phase 9 AC2).

---

## Appendix K — Requirements traceability (normative)

Machine copy: `docs/TRACEABILITY.md`. Test ids: `P<phase>.AC<n>` = acceptance criterion n of that phase (§27); `X12.11.<n>` = item n of §12.11. Tests carry a `trace:` tag (e.g. `// trace: P7.AC3`); `scripts/check-traceability.ts` fails CI when a row has no test id or a test id has no tagged test.

**K.1 Founder request**
| ID | Founder request | Spec | Phase | Acceptance tests |
|---|---|---|---|---|
| F1 | Very, very light program | §1, §3.2, §5.2 size ledger, §6 WebView2 settings, §12.3, §20, §22 | P0, P1, P7, every phase | P0.AC1, P0.AC5, P0.AC6, P1.AC6, P1.AC10, P2.AC7, P7.AC2 |
| F2 | Easy-to-use desktop app | §3.5, §13, §18, §19 | P1, P4, P8 | P1.AC4, P4.AC4 (HUMAN GATE + proxy), P8.AC1 (HUMAN GATE + proxy) |
| F3 | Per-customer Excel with invoices, prices and statements | §12.6 (folder per customer), §12.7 | P7 | X12.11.1–7, X12.11.15, P7.AC2 |
| F4 | Every operation saved in an Excel table | §12.2 registry, §12.7 master reports (Activity), Appendix D | P7 | P7.AC3, P7.AC4, X12.11.8, X12.11.9 |
| F5 | Taxes handled correctly | §11, Appendix C | P4, P14 | P4.AC1, P4.AC6, P4.AC10, P14.AC1–9 |
| F6 | Government and official letters | §16 | P8b, P16 | P8b.AC1–4, P16.AC1–4 |
| F7 | Link invoices to accounts and cards | §14.3 (`pay_to_account_code`), §14.4, §14.10 cards, Appendix F | P5, P6 | P6.AC2, P6.AC9, P5.AC8 |
| F8 | One comprehensive place to create invoices | §13.2 hub + universal New menu, §13 | P4, P12 | P4.AC3, P12.AC1, P12.AC8 |
| F9 | Tables for engineers | §15.16, §15.17, §15 | P10b, P17, P18 | P10b.AC1–3, P17.AC1–3 |
| F10 | Customizable report layouts | §17.10 | P6, P13 | P6.AC6, P13.AC7 |
| F11 | Editable colours and look | §17.9 Appearance, §17.2 colours | P1, P13 | P1.AC9, P13.AC4 |
| F12 | A short description of all features above every screen | §18.5 expander, §18.12, Appendix H | P1, P8 | P1.AC8, P8.AC5 |
| F13 | Task alert shown every time until "Don't show again", also offered after finishing | §18.4 (`always`), §18.6 completion toast, A28 | P1, P8 | P1.AC7, P8.AC2, P8.AC3 |
| F14 | Research what users wish for, and build it completely | research §10 → K.2 | all | K.2 |

**K.2 User wishes (research report, section 10)**
| ID | Wish | Spec | Phase | Acceptance tests |
|---|---|---|---|---|
| W1 | No subscription, no forced cloud, pay once | §3.3, §21.2 | P9 | P9.AC1, P9.AC2 |
| W2 | Never force a redesign of screens or templates | §3.7, §17.2 versioning | P5, P9 | P5.AC3, P9.AC3 |
| W3 | Free invoice design: move fields, add columns and custom fields | §17.2, §17.4 | P13 | P13.AC2, P13.AC3 |
| W4 | Paste rows from Excel into invoice lines | §13.5 | P1, P4 | P1.AC4 |
| W5 | Arrow-key navigation in lines | §3.5, §19.3 | P1 | P1.AC4, P1.AC11 |
| W6 | Fast responses (no seconds per click) | §3.2 | P1, P4 | P1.AC6, P4.AC4 (proxy: keypress p95) |
| W7 | Frequent actions close at hand | §19.1, §13.2 | P4, P8 | P8.AC1 (proxy: action count) |
| W8 | Dark mode, control of colours and fonts | §17.9 | P1 | P1.AC9 |
| W9 | Compact view | §17.9 density | P1 | P1.AC9 |
| W10 | Statement in Excel, a file per customer | §12.7, §12.9 | P6, P7 | X12.11.6, P7.AC2 |
| W11 | Running balance, configurable aging, statement per currency | §10.8, §12.7, §12.9 | P6 | P6.AC1 |
| W12 | Old statements are never recomputed | §12.9 snapshots | P6 | P6.AC3 |
| W13 | Real Arabic, bilingual invoices, ZATCA QR | §17.5, §11.7 | P5, P14 | P5.AC1, P14.AC3 |
| W14 | Logo at the right size, A4 default | §17.4 | P5 | P5.AC5 |
| W15 | Multi-page invoices that do not break | §17.2 | P5 | P5.AC2 |
| W16 | Upload custom fonts | §17.4 | P13 | P13.AC8 |
| W17 | More contextual help, simpler menus | §18 | P1, P8 | P1.AC8, P8.AC5 |
| W18 | Tips that don't interrupt and are easy to turn off | §18.4–18.6 | P1, P8 | P1.AC3, P1.AC7, P8.AC2 |
| W19 | One payment for several invoices; extra becomes credit | §14.4 | P6 | P6.AC2 |
| W20 | Card fee in the same payment; bank matching without double entry | §14.4, §14.7 | P6, P15 | P6.AC2, P15.AC1, P15.AC2 |
| W21 | Partial conversion of documents with remaining quantities | §13.3 | P12 | P12.AC1 |
| W22 | Automatic deposits, progress claims and retention | §13.7, §15.9–15.11, §15.17 | P12, P10b, P17 | P10b.AC2, P17.AC1, P17.AC2 |
| W23 | Chosen tax rounding; inclusive prices without a fils difference | §11.3, §8 calc_decimals | P4 | P4.AC1, P4.AC10 |
| W24 | Several taxes per line; withholding settled correctly in the statement | §11.3, §14 | P4, P14 | P4.AC1, P14.AC4 |
| W25 | E-invoicing without a subscription | §11.7 | P14, P20 | P14.AC1, P14.AC2 |
| W26 | Ready official letter and certificate templates with stamp and signature | §16 | P8b, P16 | P8b.AC2, P8b.AC3, P16.AC1 |
| W27 | Price the client's BoQ and return it in the same layout | §15.12 | P17 | P17.AC3 |
| W28 | Send by email and WhatsApp from the app | §13.10 | P12 | P12.AC4 |
| W29 | Line profit hidden from customers and staff | §6, §19.29 | P4 | P4.AC11 |
| W30 | Barcode and fast cash sale | §13.11, §17.11 | P12 | P12.AC3, P12.AC5, P12.AC7 |

---

*End of master build prompt.*
