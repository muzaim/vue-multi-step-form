# Proposal

## Why

Currently, risk assessment factor scores and gate scores are pre-populated with arbitrary default values (e.g. Factor A = 4, Factor B = 4, Gate Score = 16) in Pinia stores. This causes new forms to immediately display an inflated gate score and automatically open 8/9 escalated stages before the user enters any actual data. Initializing all factor scores and calculated sub-scores to 0 (a clean slate / blank state) ensures the form begins with standard 5 stages (+ 1 approval stage = 6 stages), presents clear unselected placeholder options in comboboxes, and dynamically escalates only when high scores are explicitly entered by the user.

## What Changes

- **Zero-Value Initial State in Store**:
  - Update `getInitialFormData()` and `getInitialFraudData()` in `useRiskFormStore.ts` so all factors (`factorA`, `factorB`, `factorD`, `factorE`, `factorG1`, `factorG2`, `factorH1`, `factorH2`) default to `0`.
  - Calculated subscores (`subScoreC`, `subScoreF`, `subScoreG`, `subScoreH`), `gateScore`, and cumulative grand totals default to `0`.
  - `isEscalated` defaults to `false`, ensuring new forms begin with the standard 6 stages (5 data intake + 1 approval).
- **Combobox Unselected State & Placeholder in UI**:
  - In `ScoreSelectInput.vue`, add a disabled placeholder option: `<option value="0" disabled>-- Pilih Skor Faktor (1 - 10) --</option>`.
  - When `modelValue === 0`, display a neutral badge (`Factor: Belum dipilih`) instead of prematurely classifying it as 'Low'.
- **Enforce Mandatory Selection via Zod Validation**:
  - Ensure existing Zod schemas (`.min(1).max(10)`) catch unselected zero values when user attempts to proceed to the next step without choosing a factor rating.
- **Preserve Preset Demo Scenarios**:
  - Maintain the demo preset dropdown for users who wish to autofill sample data instantly.

## Capabilities

### Modified Capabilities
- `combobox-factor-inputs`: Update default and empty state specifications to mandate a zero/unselected initial state with placeholder option and neutral badge representation.

## Impact

- **Affected Code**:
  - `src/features/risk-management/stores/useRiskFormStore.ts`: Update `getInitialFormData()` and `getInitialFraudData()`.
  - `src/components/ui/ScoreSelectInput.vue`: Add placeholder option and neutral badge handling for 0 value.
  - `tests/`: Update unit tests in `tests/storeCalculations.test.ts` and `tests/interactiveFlow.test.ts` to reflect 0 initial state.
