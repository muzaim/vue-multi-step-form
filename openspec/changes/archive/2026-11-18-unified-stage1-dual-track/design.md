# Design

## Context

Sebelumnya, Stage 1 merender input field yang berbeda saat pengguna memilih track Fraud (menampilkan `caseTitle` dan `reportedDepartment`) dibanding Non-Fraud (`riskTitle`, `riskCategory`, `department`). Pengguna menginginkan isian Stage 1 tetap sama persis untuk kedua track, dan perbedaan form baru dimulai pada Stage 2 hingga Stage 8.

## Goals / Non-Goals

**Goals:**
- Menyeragamkan input fields di `Step1GeneralInfo.vue` sehingga menampilkan 4 kontrol identik: selector `assessmentType`, `riskTitle`, `riskCategory` (dropdown API), dan `department` (dropdown API).
- Menggunakan state `formData.general` sebagai single source of truth untuk informasi umum Stage 1 pada kedua track.
- Memastikan validasi Stage 1 menggunakan skema `generalSchema` yang terpadu.

**Non-Goals:**
- Mengubah alur kalkulasi dan komponen di Stage 2 hingga Stage 8 yang sudah berjalan dengan baik.

## Decisions

### 1. Unified General Form State
- **Keputusan**: Seluruh input Stage 1 langsung terikat (*two-way binding*) ke `store.formData.general`.
- **Rasional**: Tidak diperlukan duplikasi field di `store.fraudData.general`, menyederhanakan kode template dan logika state Pinia.

### 2. Single Stage 1 Validation Schema
- **Keputusan**: Validasi Stage 1 selalu mengevaluasi `store.formData.general` menggunakan `generalSchema`, terlepas dari track apa yang dipilih.
- **Rasional**: Menjamin konsistensi aturan validasi judul (min 5 karakter), kategori, dan departemen tanpa kode kondisional yang rumit.

## Risks / Trade-offs

- **[Risk] Data judul atau departemen tertinggal jika track diubah**  
  → *Mitigasi*: Karena field disimpan di tempat yang sama (`formData.general`), data tetap utuh saat pengguna berganti track di Stage 1 tanpa perlu mengetik ulang.
