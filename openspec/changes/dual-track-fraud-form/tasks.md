# Tasks

## 1. Type Models, Master Data API & Store Extension

- [x] 1.1 Buat tipe data `src/features/risk-management/types/fraud.types.ts` dan tambahkan opsi master data fraud di `masterDataApi.ts` serta `useMasterData.ts`, lalu verifikasi dengan `npx tsc --noEmit`
- [x] 1.2 Perbarui Pinia store `useRiskFormStore.ts` untuk mendukung properti `assessmentType` ('non_fraud' | 'fraud'), state `fraudData`, kalkulasi reaktif live fraud (Sub C, Sub F, Gate, Sub G, Sub H, Grand Total), dan verifikasi `npx tsc --noEmit`

## 2. Validation Schemas & Directory Reorganization

- [x] 2.1 Buat skema validasi Zod `fraudValidation.ts` dan gabungkan ke dalam `riskValidation.ts` agar mendukung validasi kondisional per track
- [x] 2.2 Reorganisasi folder komponen dengan memindahkan berkas step lama ke `src/features/risk-management/components/steps/non-fraud/`

## 3. Fraud Track Components & Wizard Integration

- [x] 3.1 Perbarui `Step1GeneralInfo.vue` untuk menyertakan selektor pemilihan tipe asesmen (Fraud vs Non-Fraud)
- [x] 3.2 Buat komponen dasar jalur Fraud: `FraudStep2Modus.vue`, `FraudStep3Loss.vue`, `FraudStep4Containment.vue`, dan `FraudStep5Gate.vue` (masing-masing 2–4 field)
- [x] 3.3 Buat komponen eskalasi Fraud: `FraudStep6Forensic.vue`, `FraudStep7LawEnforcement.vue`, dan `FraudStep8BoardSanction.vue` (masing-masing 2–4 field)
- [x] 3.4 Hubungkan dynamic step rendering dan 4 tombol demo helper di `RiskFormWizard.vue`, lalu verifikasi `npm run build` berhasil tanpa error
