# Tasks

## 1. Master Data API & Composable Layer

- [x] 1.1 Buat `src/features/risk-management/api/masterDataApi.ts` dengan fungsi asynchronous untuk opsi kategori, departemen, dampak, strategi mitigasi, dan komite dewan, lalu verifikasi `tsc --noEmit`
- [x] 1.2 Buat composable `src/features/risk-management/composables/useMasterData.ts` yang mengelola fetching, reaktivitas opsi dropdown, dan status loading

## 2. Type Contracts, Store & Validation Refactoring

- [x] 2.1 Perbarui `risk.types.ts` dan Pinia store `useRiskFormStore.ts` dengan model data yang disederhanakan (2–4 field per stage)
- [x] 2.2 Perbarui Zod schema di `riskValidation.ts` agar memvalidasi data 2–4 field per stage

## 3. Component Presentation Refactoring & Integration

- [x] 3.1 Refactor `Step1GeneralInfo.vue`, `Step2RiskIdentification.vue`, `Step3RiskAssessment.vue`, dan `Step4MitigationPlan.vue` menjadi 2–4 field dan gunakan opsi dari `useMasterData`
- [x] 3.2 Refactor `Step5ReviewSubmit.vue`, `Step6DeepMitigation.vue`, `Step7BoardOversight.vue`, dan `Step8ExecutiveSignOff.vue` menjadi 2–4 field dan gunakan opsi dari `useMasterData`
- [x] 3.3 Perbarui data helper demo di `RiskFormWizard.vue`, lalu verifikasi `npm run build` dan alur aplikasi berhasil tanpa error
