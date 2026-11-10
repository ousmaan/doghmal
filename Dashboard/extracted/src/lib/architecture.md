# Doghmal Tier 3 — Telemetry Architecture

## Non-invasive integration layer

```
Legacy ERP / DMS (on-prem, Najran)
  ├─ ZATCA Phase-2 stamping + clearance  ← exclusive authority
  ├─ Invoicing / job cards / stock ledger ← system of record
  └─ CDC change log (read-only views)
            │  async events, 2–5 s
            ▼
KSA cloud mirror (Riyadh primary · Al Jubail DR)
  ├─ pseudonymised analytics (k ≥ 5)
  ├─ 18-month retention policy
  └─ SELECT-only identity for the dashboard
            │  read API
            ▼
Doghmal Tier 3 dashboard (this SPA)
  navigate · filter · inspect · export
  no mutation route exists
```

**Invariants**

1. The dashboard cloud identity has `SELECT` on 11 CDC views only.
2. No UI control, form, or API route emits a legacy write.
3. ZATCA stamping, clearance, void/resend remain inside the audited legacy system.
4. All data stays in-Kingdom (PDPL): Riyadh + Al Jubail, no cross-border egress.
5. If the mirror pauses, the UI shows **data delayed** with the last verified timestamp.
   It never estimates or interpolates operational values.

## The seven critical metrics → critique pain points

| Metric | Screen | Pain point it exposes |
| --- | --- | --- |
| Bay utilization 62% (target 75%) | 02, 01 | Idle labour hours and uneven bay allocation |
| Parts turnover 4.2×/yr (target 6.0×) | 03, 01 | Working capital trapped in slow stock |
| Advisor throughput 3.8/day (target 5.0) | 04 | Capacity without an operating cadence |
| CSI 84/100 rolling 7-day | 06, 01 | Silent customer attrition |
| Sales-to-service conversion 42% (target 55%) | 05 | Buyers never returning after delivery |
| Avg wait 52 min (target <45) | 06 | Arrival-to-bay queues and Friday spikes |
| Cross-branch transfers 23/week (target <15) | 07 | Inventory visibility gap and hidden logistics cost |

## Personas

- **C-Suite** — executive summary, conversion, network health, governance dividend.
- **Branch manager** — bay floor, parts velocity, CSI/wait traffic lights.
- **Service advisor** — advisor throughput, WhatsApp response, idle hours, wait impact.

The persona switcher in the side navigation marks the most relevant sections for the
active role. Visibility changes the decision lens; data access is identical and read-only.

## Language and direction

Arabic is the default locale (Saudi automotive vernacular), English is a full mirror.
The toggle writes `lang` + `dir` on `<html>`, persists to `localStorage`, and every
layout uses logical `start`/`end` spacing so the shell, tables, drawers and menus mirror.
Arabic-Indic numerals are used in Arabic mode. Product identifiers (part numbers, IDs,
ZATCA UUIDs) intentionally stay in Latin script for cross-system traceability.

## Deliberate exclusions

No GMV/CAC/LTV, no notification dispatch, no dispatch/reorder/reserve actions, no
customer contact tools. Those are operational actions owned by the legacy system or CRM;
Tier 3 exists to observe, explain and compare.
