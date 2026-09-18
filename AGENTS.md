# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Durable product requirements

- The control studio must support a real Chinese / English language switch across navigation, page headings, controls, project explanations and decision content.
- AI usage must have a dedicated token-estimation control surface with editable planning assumptions, a transparent formula, budget thresholds and application-specific uplift.
- Every AI-enabled delivery activity must show what AI may do, what a named human must do, and which decisions AI is prohibited from making.
- The visual system uses NTT-inspired enterprise blue and black as primary colours; yellow is reserved for decision highlights, warnings and attention states.
- The NEO module must teach the complete end-to-end business journey to a newcomer, including risk versus opportunity branching, claim maturity, FTO and part-data dependencies, Guidance / Review / Mandate, settlement locking and re-request, transaction-type-specific implementation, RPA/manual exception handling, PO-payment and reserve processing, WD-6 to WD1 month-end controls, state semantics, and the specific Flowable redesign implications.
