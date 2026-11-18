# Design

## Context

Proyek ini dibangun dari repositori baru (greenfield) untuk mendemonstrasikan best practice arsitektur multi-step form pada aplikasi enterprise (Risk Management) dengan ~50 field input. Lihat `proposal.md` untuk latar belakang dan motivasi.

## Goals / Non-Goals

**Goals:**
- Mengimplementasikan Feature-Driven Folder Structure yang memisahkan secara tegas antara Presentation (Vue/Tailwind), Orchestration/Logic (Composables), State Management (Pinia), dan Data Access (Pure TypeScript API).
- Menerapkan alur navigasi **Strict Linear** dengan per-stage guard: pengguna hanya dapat maju ke stage berikutnya jika stage aktif memenuhi validasi schema.
- Menyediakan dynamic component renderer dengan `<keep-alive>` untuk menjaga kondisi DOM saat berpindah antar stage.
- Menyediakan Mock API asynchronous dengan simulasi network delay untuk operasi simpan draft dan submit final.

**Non-Goals:**
- Pembuatan backend server nyata atau database persisten (menggunakan mock service berbasis Promise).
- Fitur auto-save otomatis ke `localStorage` (fokus saat ini adalah in-memory global state melalui Pinia).
- Fitur ekspor PDF/Excel atau otentikasi login pengguna.

## Decisions

### 1. Feature-Driven Architecture Layout
- **Keputusan**: Semua berkas yang terkait modul Risk Management diletakkan dalam `src/features/risk-management/` (termasuk `components/`, `composables/`, `stores/`, `api/`, dan `types/`).
- **Alternatif yang Dipertimbangkan**: Struktur datar/generic (`src/components/`, `src/stores/`, `src/services/`).
- **Rasional**: Struktur feature-driven mengisolasi modul, mencegah pencemaran namespace global, dan mempermudah pemeliharaan saat aplikasi berkembang.

### 2. Centralized State Management via Pinia
- **Keputusan**: Seluruh data 50 field disimpan dalam sebuah Pinia store tunggal (`useRiskFormStore`) yang dibagi menjadi sub-objek per stage (`general`, `identification`, `assessment`, `mitigation`).
- **Alternatif yang Dipertimbangkan**: Prop drilling dan emit berantai antara parent dan 5 child stage.
- **Rasional**: Prop drilling untuk 50 field sangat rentan bug, sulit di-refactor, dan membebani parent component dengan detail spesifik setiap field.

### 3. Dynamic Step Rendering with `<keep-alive>`
- **Keputusan**: Parent component `RiskFormWizard.vue` menggunakan `<keep-alive><component :is="currentStepComponent" /></keep-alive>`.
- **Alternatif yang Dipertimbangkan**: Merender seluruh komponen stage sekaligus menggunakan `v-show`.
- **Rasional**: `v-show` merender seluruh 50 field ke DOM sejak awal, sedangkan dynamic component + `<keep-alive>` hanya merender stage aktif namun tetap mempertahankan state DOM ketika user menekan tombol "Previous".

### 4. Per-Stage Schema Validation using Zod
- **Keputusan**: Membagi aturan validasi menjadi 5 schema independen (`generalSchema`, `identificationSchema`, dll.) yang divalidasi saat transisi "Next Stage", serta dikombinasikan menjadi `fullRiskSchema` saat "Submit Assessment".
- **Alternatif yang Dipertimbangkan**: Validasi manual dengan `if-else` dalam method Vue.
- **Rasional**: Zod memberikan type safety otomatis, pesan error terstandarisasi, dan pemisahan logika validasi dari template UI.

### 5. Decoupled Pure TypeScript API Service
- **Keputusan**: Modul `riskApi.ts` ditulis murni TypeScript tanpa dependensi ke Vue runtime maupun Pinia.
- **Alternatif yang Dipertimbangkan**: Memanggil `fetch` langsung di dalam event handler komponen atau store.
- **Rasional**: Memastikan layer network dapat diuji secara independen (unit test) dan mudah diganti dengan HTTP client riil (Axios) tanpa mengubah komponen UI.

## Risks / Trade-offs

- **[Risk] Kehilangan data jika browser tab ditutup secara tidak sengaja**  
  → *Mitigasi*: Karena state saat ini disimpan secara in-memory di Pinia, disediakan tombol manual "Save Draft" dan konfirmasi peringatan `beforeunload` saat form berstatus *dirty*.
- **[Risk] Overhead performa jika 50 field reaktif memicu re-render menyeluruh**  
  → *Mitigasi*: Pemisahan sub-objek per stage pada store memastikan hanya komponen stage aktif yang bereaksi terhadap perubahan input miliknya.
