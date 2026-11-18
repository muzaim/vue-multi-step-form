# Proposal

## Why

Sebelumnya, pemilihan tipe asesmen di Stage 1 memicu percabangan tampilan field input di dalam Stage 1 itu sendiri. Pengguna menginginkan agar seluruh field input di Stage 1 berstatus seragam (*identik*) baik untuk jalur Fraud maupun Non-Fraud (yaitu: Track Selector, Risk Title, Risk Category, dan Department), sedangkan percabangan konten formulir dimulai murni dari Stage 2 hingga Stage 8.

## What Changes

- **Penyatuan Field Stage 1**: Komponen `Step1GeneralInfo.vue` menampilkan field seragam untuk kedua track tanpa kondisi `v-if`:
  1. `assessmentType` (Radio button / pill selector: Non-Fraud vs Fraud)
  2. `riskTitle` (Judul Risiko / Inisiatif Asesmen)
  3. `riskCategory` (Kategori dari Master Data API)
  4. `department` (Departemen dari Master Data API)
- **Shared General Context**: Data umum di Stage 1 tersimpan secara terpusat di `store.formData.general` dan berlaku sebagai konteks bersama untuk jalur Non-Fraud maupun Fraud.
- **Konsistensi Validasi Stage 1**: Validasi Stage 1 menggunakan skema `generalSchema` tunggal untuk kedua track, memastikan syarat judul, kategori, dan departemen terpenuhi sebelum melangkah ke Stage 2.
- **Percabangan Murni Mulai Stage 2**: Seluruh perbedaan struktur form, indikator modus, kerugian, pembekuan aset, audit forensik, dan eskalasi dewan murni aktif mulai Stage 2 hingga Stage 8.

## Capabilities

### New Capabilities
- `unified-stage1-intake`: Penyatuan field intake asesmen di Stage 1 menjadi seragam dan konsisten untuk semua track risiko sebelum percabangan di Stage 2.

### Modified Capabilities
<!-- None -->

## Impact

- Pembersihan template `Step1GeneralInfo.vue` dari conditional `v-if="store.assessmentType === 'fraud'"`.
- Penyelarasan `fraudValidation.ts` dan `riskValidation.ts` untuk menggunakan `generalSchema` yang sama pada Stage 1.
- Penyederhanaan model state umum di `useRiskFormStore.ts`.
