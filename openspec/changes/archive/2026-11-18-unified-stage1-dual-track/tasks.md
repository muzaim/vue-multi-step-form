# Tasks

## 1. Stage 1 Simplification & Unified Validation

- [x] 1.1 Refactor `Step1GeneralInfo.vue` agar menampilkan 4 kontrol identik untuk kedua track (Track Selector, Risk Title, Category, Department) tanpa kondisional `v-if`
- [x] 1.2 Perbarui `fraudValidation.ts` dan `riskValidation.ts` agar validasi Stage 1 selalu merujuk ke `generalSchema`
- [x] 1.3 Perbarui fungsi quick-fill demo di `RiskFormWizard.vue` dan verifikasi `npm run build` sukses 100%
