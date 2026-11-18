# Tasks

## 1. Pinia Store Initial State Refactor

- [x] 1.1 In `useRiskFormStore.ts`, set all factor scores (`factorA`, `factorB`, `factorD`, `factorE`, `factorG1`, `factorG2`, `factorH1`, `factorH2`), sub-scores, and `gateScore` to 0, and `isEscalated` to `false` in `getInitialFormData()` and `getInitialFraudData()`.
- [x] 1.2 Update `tests/storeCalculations.test.ts` to verify 0 initial calculations and reactive summation upon value update.

## 2. Combobox Placeholder & Neutral Badge Component

- [x] 2.1 In `ScoreSelectInput.vue`, update default `modelValue` prop to 0, add disabled placeholder option `-- Pilih Skor Faktor (1 - 10) --`, and render neutral badge `Factor: Belum dipilih` when `modelValue === 0`.
- [x] 2.2 Verify select change handlers correctly emit numeric values from 1 to 10 when user selects an option.

## 3. Validation & Integration Verification

- [x] 3.1 Update integration tests in `tests/interactiveFlow.test.ts` to assert that unpopulated forms start with 6 stages and block advancing when required factor scores remain 0.
- [x] 3.2 Run `npm run test:unit` and verify all test suites pass.
- [x] 3.3 Run `vue-tsc -b && vite build` and verify zero TypeScript or bundling errors.

## Workflow follow-up

- Archive change after validation and user review.
