# Design QA

**Source visual truth**

- URL: https://liumengyuanthu-source.github.io/moxademo/moxa-project-control-studio/
- State: workspace / Project Overview.
- Evidence: live Codex in-app browser capture at 922 × 910 CSS px, device scale factor 1.
- Mobile evidence: live capture at 390 × 844 CSS px, device scale factor 1.

**Implementation evidence**

- URL: http://localhost:4173/
- State: Chinese Project Overview, with supporting checks on English mode, NEO Journey and AI & Token Control.
- Evidence: live Codex in-app browser capture at 922 × 910 CSS px, device scale factor 1.
- Mobile evidence: live capture at 390 × 844 CSS px, device scale factor 1.
- Console: no warnings or errors after navigation and interaction checks.

## Full-view comparison

The source and implementation were rendered in the same browser session at the same 922 × 910 viewport. The implementation preserves MOXA's project-control density and presentation rhythm, then deliberately moves the visual system to an NTT-inspired blue, black and yellow palette. It uses a fixed navigation rail, pale grey workspace, black control header, blue-selected states, bordered white KPI cards and yellow decision highlights.

## Focused comparison

- **Sidebar:** numbering, active-state fill, blue left rule, black brand block, yellow keyline, footer baseline and vertical rhythm match the source pattern.
- **Header:** compact uppercase module label, bilingual switch, simple selects and yellow snapshot action follow the source control treatment.
- **KPI region:** thin blue/yellow top rules, white panels, large values and low-contrast explanatory copy match the reference hierarchy.
- **Worklist:** bordered evidence panel, compact rows, owner/status columns and exception colours match the source control language.
- **Responsive state:** at 390 × 844 the sidebar becomes a numbered rail, controls stack, and KPI cards become a single column, matching the source's mobile behaviour.

## Required fidelity surfaces

- **Fonts and typography:** matched to the source system stack: Microsoft YaHei, PingFang SC, Noto Sans CJK SC, Segoe UI and Arial. Display headings use tight tracking and compact line-height; labels use small uppercase letter spacing.
- **Spacing and layout rhythm:** matched through the 240 px desktop sidebar, 86 px control header, 30 px workspace gutters, 12–18 px card gaps and square-cornered panels.
- **Colors and tokens:** the source layout was retained while the requested NTT-inspired palette was applied: blue `#0067B1`, deep blue `#004B87`, black `#0B0D0F`, and yellow `#FFD400`. Contrast remains legible across normal, attention and blocked states.
- **Image quality and asset fidelity:** the source workspace contains no meaningful raster imagery required by the control view. No hotlinked or placeholder imagery is used; the adaptation relies on typography, borders and data components as the source does.
- **Copy and content:** all visible content is Appian-programme-specific and grounded in the supplied project materials; Chinese and English modes are available from the global header.

## Interaction checks

- All eleven navigation modules render and reset to the top of the page.
- Chinese and English switch in place across navigation, control labels, core NEO journey content and the complete Token / AI-responsibility module.
- Portfolio domain and disposition filters work; selecting an application updates the detail pane.
- NEO Before / After and all eight journey stages update the experience, owner, controls and systems.
- Architecture layers and migration-plan views switch state.
- Risk filters update the visible decision cards.
- Report-pack selection updates the report heading and thesis.
- Token assumptions are editable and recalculate input/output tokens, forecast cost and budget consumption immediately. Reducing the budget cap from ¥100,000 to ¥50,000 correctly changes the status from Controlled to Blocked / Freeze non-essential experiments.
- Local snapshot prepares a JSON programme snapshot; Print / PDF invokes the browser print path.

## Comparison history

### Pass 1

- **[P2] Desktop breakpoint collapsed the navigation too early at 922 px.**
  - Fix: moved navigation-rail collapse to 840 px.
- **[P2] Four KPI cards became too narrow at the 922 px comparison viewport.**
  - Fix: introduced an independent 1080 px content breakpoint with a two-column KPI grid while retaining the full desktop sidebar.
- **[P2] Module navigation preserved the previous page's scroll position.**
  - Fix: added automatic scroll-to-top on module changes.

### Pass 2

- Re-captured the 922 × 910 overview and the 390 × 844 responsive state.
- Earlier layout and navigation findings are resolved.
- No actionable P0, P1 or P2 issue remains.

### Pass 3

- Re-themed the complete interface from teal to the requested NTT-inspired blue / black / yellow system.
- Added a persistent global Chinese / English control and verified switching in both directions.
- Added AI & Token Control with editable assumptions, three planning presets, transparent formula, budget thresholds, activity allocation and six-stage AI / human accountability matrix.
- Re-tested at the default desktop viewport and 390 × 844 mobile viewport; the new header controls, inputs and responsibility matrix remain usable without horizontal overflow.
- Console remains free of warnings and errors.

### Pass 4 — NEO journey reconstruction

- Replaced the previous eight-step summary with a four-chapter / eight-step teachable journey grounded in the supplied NEO work instructions and the end-to-end process map.
- Added stage-level entry trigger, accountable roles, control evidence, system touchpoints, Appian experience, Flowable target, business gates, exception paths and migration implications.
- Added explicit explanations of Risk vs Opportunity, Mandate vs Settlement, transaction-type implementation routing, Implemented vs Closed and the seven end-state milestones.
- Verified interactive step selection using Quantify & Negotiate and Implement Transaction, and confirmed all content switches cleanly between Chinese and English.
- Re-tested at 390 × 844: header controls stack, journey stages remain horizontally navigable, comparison content stacks, and the revised title remains readable.

## Follow-up polish

- [P3] A future branded pass could replace the text-only JLR lockup with an approved JLR brand asset if one is supplied.
- [P3] A later content-governance pass can translate retained enterprise acronyms and role names such as FBP, MCA, DoA and Clearing House if JLR provides approved Chinese terminology.

final result: passed
