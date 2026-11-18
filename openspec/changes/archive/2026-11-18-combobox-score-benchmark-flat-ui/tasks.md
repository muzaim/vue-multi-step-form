# Tasks

## 1. Scoring Benchmark API & Store Integration

- [x] 1.1 Implement `scoringApi.ts` simulating asynchronous score benchmarking (`evaluateScore`) with delay and test return data bands (`LOW`, `NORMAL`, `HIGH`, `CRITICAL`).
- [x] 1.2 Update Pinia store / risk composable to store benchmark results reactively for sub-scores ($C$, $F$), gate threshold ($C+F$), and grand total scores.
- [x] 1.3 Add unit test or verification script verifying benchmark evaluation correctly classifies scores into expected bands.

## 2. Combobox Factor Inputs Implementation

- [x] 2.1 Create or standardize `ScoreSelectInput.vue` / combobox component with discrete numeric values (1 to 10) and qualitative descriptors.
- [x] 2.2 Replace range sliders in Non-Fraud stages (`Step2RiskIdentification.vue`, `Step3RiskAssessment.vue`, `Step6DeepMitigation.vue`, `Step7BoardOversight.vue`) with combobox select inputs.
- [x] 2.3 Replace range sliders in Fraud stages (`FraudStep2Modus.vue`, `FraudStep3Loss.vue`, `FraudStep6Forensic.vue`, `FraudStep7LawEnforcement.vue`) with combobox select inputs.
- [x] 2.4 Verify factor changes trigger reactive calculations and numeric types are preserved without string concatenation.

## 3. Flat Minimalist Form UI Refactoring

- [x] 3.1 Strip heavy gradient banners, oversized cards, and decorative icons from form headers, step navigation, and summary views.
- [x] 3.2 Refactor layout and card containers to use clean flat styling (`border-slate-200`, subtle neutral backgrounds, crisp typography, and compact status pills).
- [x] 3.3 Integrate benchmark status indicators alongside sub-scores and gate thresholds with clean minimalist badges.
- [x] 3.4 Refactor summary views (`Step5RiskSummary.vue`, `Step8ExecutiveApproval.vue`, and Fraud equivalents) into clean flat tables/key-value summaries.

## 4. Verification & Integration Testing

- [x] 4.1 Run type-check (`npm run type-check` or `vue-tsc`) and verify zero TypeScript errors.
- [x] 4.2 Run unit tests (`npm run test:unit`) and verify all test suites pass.
- [x] 4.3 Verify end-to-end interactive flow in both Non-Fraud and Fraud tracks (5-stage vs 8-stage dynamic branches).

## Workflow follow-up

- Archive change after validation and user review.
