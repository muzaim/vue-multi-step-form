# Proposal

## Why

Banyaknya field input (10 field per stage) membuat kode template menjadi bising dan menyamarkan arsitektur inti. Selain itu, mendefinisikan array pilihan (*options*) dropdown secara *hardcoded* di dalam berkas komponen Vue mencampuradukkan data master dengan tampilan presentasi. Diperlukan refactor arsitektur untuk menyederhanakan form menjadi 2–4 field terfokus per stage dan memisahkan pengambilan master data ke dalam layer service API murni serta composable dedicated, sehingga berkas Vue SFC murni hanya berisi presentasi HTML dan Tailwind CSS.

## What Changes

- Penyederhanaan seluruh komponen stage (Stage 1 hingga 8) menjadi 2–4 field terfokus per stage tanpa menghilangkan esensi alur kalkulasi threshold (A+B=C, D+E=F, Gate 15, G, H, Grand Total).
- Pembuatan layer API service murni `src/features/risk-management/api/masterDataApi.ts` untuk mensimulasikan pemanggilan HTTP master data dropdown (Kategori, Departemen, Dampak, Strategi, dan Komite).
- Pembuatan composable `src/features/risk-management/composables/useMasterData.ts` untuk mengelola state asynchronous (`data`, `isLoading`, `error`) dan caching opsi.
- Refactor komponen form stage agar opsi `<select>` diisi secara reaktif dari composable master data tanpa ada array statis di dalam komponen template.

## Capabilities

### New Capabilities
- `master-data-dropdown-api`: Layanan pengambilan dan pengelolaan data master pilihan dropdown asynchronous yang terisolasi dari komponen presentasi Vue.

### Modified Capabilities
<!-- None -->

## Impact

- Penambahan berkas `masterDataApi.ts` dan `useMasterData.ts`.
- Pembaruan berkas tipe data `risk.types.ts` dan Zod schema `riskValidation.ts` yang disesuaikan dengan 2–4 field per stage.
- Pembersihan template komponen di `src/features/risk-management/components/steps/`.
