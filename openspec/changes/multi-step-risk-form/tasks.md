# Tasks

## 1. Project Setup & Dependencies

- [x] 1.1 Inisialisasi project Vue 3 + TypeScript menggunakan Vite dan verifikasi script dev berjalan tanpa error
- [x] 1.2 Konfigurasi Tailwind CSS dan verifikasi class utilitas Tailwind aktif di styling aplikasi
- [x] 1.3 Install dan pasang Pinia serta Zod di `main.ts` dan verifikasi bundle build berhasil

## 2. Type Contracts, Zod Schemas & Mock API Service

- [x] 2.1 Buat TypeScript interfaces untuk 50 field yang dikelompokkan ke dalam 5 stage di `src/features/risk-management/types/risk.types.ts` dan verifikasi `tsc --noEmit` lolos
- [x] 2.2 Buat Zod validation schema per stage (`generalSchema`, `identificationSchema`, `assessmentSchema`, `mitigationSchema`) di `src/features/risk-management/schemas/riskValidation.ts` dan verifikasi validasi unit test/script
- [x] 2.3 Buat pure TypeScript async mock API service di `src/features/risk-management/api/riskApi.ts` untuk simpan draft dan submit dengan simulasi delay dan verifikasi fungsi me-return data yang sesuai

## 3. Pinia State Management & Wizard Composable

- [x] 3.1 Implementasikan Pinia store `useRiskFormStore` di `src/features/risk-management/stores/useRiskFormStore.ts` untuk menampung reactive state form 50 field, loading status, dan draft ID, lalu verifikasi state reactivity
- [x] 3.2 Implementasikan composable `useRiskWizard` di `src/features/risk-management/composables/useRiskWizard.ts` yang mengelola strict linear navigation, step guards, dan progress calculation, lalu verifikasi alur next/prev

## 4. Stage Components Implementation

- [x] 4.1 Buat komponen UI atom dasar (Input, Select, Textarea dengan error display Tailwind) di `src/components/ui/` dan verifikasi render visualnya
- [x] 4.2 Buat `Step1GeneralInfo.vue` (General Information fields) yang terikat ke Pinia store dan verifikasi input data tersimpan di store
- [x] 4.3 Buat `Step2RiskIdentification.vue` (Risk Identification fields) dan verifikasi input data tersimpan di store
- [x] 4.4 Buat `Step3RiskAssessment.vue` (Risk Analysis/Matrix Likelihood x Impact fields) dan verifikasi perhitungan score otomatis
- [x] 4.5 Buat `Step4MitigationPlan.vue` (Action Plan & PIC fields) dan verifikasi input data tersimpan di store
- [x] 4.6 Buat `Step5ReviewSubmit.vue` (Summary 50 field yang telah diisi beserta tombol final submit) dan verifikasi ringkasan data tampil akurat

## 5. Parent Orchestrator & Integration

- [x] 5.1 Buat komponen `RiskStepperNav.vue` dan `RiskWizardFooter.vue` untuk kontrol stepper dan verifikasi sinkronisasi step aktif
- [x] 5.2 Buat parent orchestrator `RiskFormWizard.vue` dengan `<keep-alive><component :is="..." /></keep-alive>` dan hubungkan dengan `useRiskWizard` serta `useRiskFormStore`
- [x] 5.3 Pasang `RiskFormWizard.vue` ke `App.vue`, jalankan end-to-end user flow dari Stage 1 hingga 5, dan verifikasi bahwa validasi strict linear mencegah pindah stage jika form tidak valid serta submit akhir berhasil memanggil mock API
