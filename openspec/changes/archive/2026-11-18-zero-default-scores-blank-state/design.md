# Design

## Context

See `proposal.md` for background and motivation.
Currently, `getInitialFormData()` and `getInitialFraudData()` in `useRiskFormStore.ts` initialize factor scores to 4, which aggregates to a gate score of 16 (exceeding the 15-point threshold) and forces `isEscalated = true`. Consequently, a freshly loaded wizard presents 9 stages instead of a clean, standard 6-stage view.

## Goals / Non-Goals

**Goals:**
- Provide a clean, unpopulated form state upon initial load where all factor inputs and aggregated scores start at 0.
- Ensure the stepper opens with standard 6 stages (5 data steps + 1 approval step).
- Render `ScoreSelectInput.vue` with an unselected placeholder (`-- Pilih Skor Faktor (1 - 10) --`) and neutral indicator badge when `modelValue` is 0.
- Enforce mandatory user selection via existing Zod schema rules (`.min(1).max(10)`).
- Update unit tests expecting initial non-zero factors to test both zero-initial state and populated states.

**Non-Goals:**
- Altering the mathematical formulas (addition of factors for subscores and gate scores).
- Removing the demo preset options (`Preset Skenario ▾`).

## Decisions

### 1. Zero Initial State in `useRiskFormStore.ts`
All factor fields in `getInitialFormData()` and `getInitialFraudData()` are assigned `0`:
- Non-Fraud: `factorA: 0`, `factorB: 0`, `subScoreC: 0`, `factorD: 0`, `factorE: 0`, `subScoreF: 0`, `gateScore: 0`, `isEscalated: false`, `factorG1: 0`, `factorG2: 0`, `subScoreG: 0`, `factorH1: 0`, `factorH2: 0`, `subScoreH: 0`, `grandCumulativeRiskScore: 0`.
- Fraud: Same 0-value mapping across `modus`, `loss`, `gate`, `forensic`, `lawEnforcement`, and `boardSanction`.

### 2. Placeholder and Rating Badge in `ScoreSelectInput.vue`
- Update `defineProps` default for `modelValue` from `4` to `0`.
- When `modelValue === 0`:
  - Display `<option value="0" disabled>-- Pilih Skor Faktor (1 - 10) --</option>`.
  - Rating badge shows: `Factor: Belum dipilih` with neutral styling `bg-slate-100 text-slate-500 border-slate-200`.
- When `modelValue > 0`:
  - Display existing ratings (`Low`, `Medium`, `High`, `Critical`) with respective color badges.

### 3. Zod Validation Safeguard
No schema changes required. Existing schemas enforce `.min(1).max(10)`. When a factor remains `0`, navigation past that stage is rejected with standard validation error messages.

## Risks / Trade-offs

- **[Risk] Existing unit tests expecting 8 or 16 initial scores may fail** → Update test assertions in `tests/storeCalculations.test.ts` to expect 0 initial state before user input.
