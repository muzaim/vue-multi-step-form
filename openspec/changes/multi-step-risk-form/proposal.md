# Proposal

## Why

Pengisian data risk management enterprise melibatkan sekitar 50 field input yang kompleks. Menyajikan seluruh field dalam satu form panjang yang di-scroll akan menurunkan user experience, meningkatkan tingkat error, dan menyulitkan proses validasi bertahap. Diperlukan arsitektur multi-step form (wizard) berbasis alur linier yang memisahkan tanggung jawab antara tampilan (UI), logika navigasi/validasi, state terpusat (Pinia), dan layer API service.

## What Changes

- Inisialisasi arsitektur project frontend Vue 3 + TypeScript + Tailwind CSS.
- Pembuatan komponen induk orchestrator (`RiskFormWizard`) dengan kontrol navigasi linier (Next, Previous, Submit).
- Pembuatan 5 sub-komponen form per stage (General Info, Risk Identification, Risk Analysis, Mitigation Plan, Review & Submit) dengan total sekitar 50 field terdistribusi.
- Integrasi Pinia store (`useRiskFormStore`) sebagai Single Source of Truth penampung data 50 field.
- Pembuatan modul validasi per stage (Zod schema / step guards) yang mencegah pengguna berpindah ke stage berikutnya sebelum stage aktif valid.
- Pemisahan total layer API service (`riskApi.ts`) dari template/komponen menggunakan async mock service.

## Capabilities

### New Capabilities
- `risk-assessment-wizard`: Alur wizard multi-step form untuk pengisian, validasi bertahap, dan pengiriman asesmen risiko.

### Modified Capabilities
<!-- None -->

## Impact

- Penambahan struktur folder fitur baru di bawah `src/features/risk-management/`.
- Penambahan dependencies inti: Vue 3, TypeScript, Vite, Pinia, Tailwind CSS, dan Zod.
- Menjadi standar arsitektur form berskala besar untuk modul-modul lain di aplikasi.
