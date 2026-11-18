# Tasks

## 1. Type Contracts & Pinia Reactive Calculations

- [x] 1.1 Perbarui `risk.types.ts` dengan interface data untuk Stage 6, 7, 8 dan tipe sub-skor, lalu verifikasi `tsc --noEmit`
- [x] 1.2 Implementasikan kalkulasi reaktif di `useRiskFormStore.ts` (`a + b = c`, `d + e = f`, `gateScore = c + f`, `isEscalated`, dan `grandTotalScore`), lalu verifikasi reaktivitas state
- [x] 1.3 Perbarui skema Zod di `riskValidation.ts` agar mendukung validasi kondisional untuk Stage 6, 7, dan 8 saat eskalasi aktif

## 2. Stepper Composable & Dynamic Navigation

- [x] 2.1 Perbarui composable `useRiskWizard.ts` agar mendukung `totalSteps` yang dinamis dan reaktif serta proteksi batas langkah (*bounds guard*)
- [x] 2.2 Perbarui `RiskStepperNav.vue` dan `RiskWizardFooter.vue` agar menampilkan 5 atau 8 stage dan label tombol yang sesuai (Submit vs Proceed to Escalation)

## 3. Escalation Stage Components & Gate Integration

- [x] 3.1 Perbarui `Step2RiskIdentification.vue` (Input A & B) dan `Step3RiskAssessment.vue` (Input D & E) dengan tampilan real-time sub-skor C dan F
- [x] 3.2 Perbarui `Step5ReviewSubmit.vue` menjadi Evaluation Gate yang menampilkan visual skor gerbang dan status eskalasi threshold (15 poin)
- [x] 3.3 Buat komponen eskalasi `Step6DeepMitigation.vue` (sub-skor G), `Step7BoardOversight.vue` (sub-skor H), dan `Step8ExecutiveSignOff.vue` (Grand Total C+F+G+H)
- [x] 3.4 Hubungkan dynamic branching di `RiskFormWizard.vue`, lakukan pengujian simulasi alur <15 poin (berhenti di Stage 5) dan >=15 poin (bercabang hingga Stage 8), lalu verifikasi `npm run build` sukses
