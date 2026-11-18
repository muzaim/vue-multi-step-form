# Design

## Context

Lihat `proposal.md` untuk motivasi dan latar belakang kebutuhan dual-track ini. Saat ini, sistem formulir memiliki alur risiko operasional yang sudah disederhanakan menjadi 2–4 field per stage dengan master data terisolasi. Desain ini merancang bagaimana alur fraud ditambahkan berdampingan secara modular tanpa merusak kode non-fraud yang telah berjalan.

## Goals / Non-Goals

**Goals:**
- Menyediakan selektor tipe asesmen (`assessmentType`: `'non_fraud' | 'fraud'`) di Stage 1 yang mengontrol rute dan tampilan form secara dinamis.
- Mengimplementasikan 7 komponen form khusus Fraud (Stages 2 hingga 8), masing-masing tetap ringkas (2–4 field).
- Menerapkan kalkulasi live reaktif untuk jalur Fraud:
  - Stage 2: $\text{Factor A} + \text{Factor B} = \text{Sub-skor C}$
  - Stage 3: $\text{Factor D} + \text{Factor E} = \text{Sub-skor F}$
  - Stage 5 Gate: $\text{Sub C} + \text{Sub F} = \text{Gate Score Fraud}$ (Ambang batas 15: $<15$ selesai di Stage 5, $\ge 15$ lanjut ke Stage 6–8)
  - Stage 6: $\text{Factor G1} + \text{Factor G2} = \text{Sub-skor G}$
  - Stage 7: $\text{Factor H1} + \text{Factor H2} = \text{Sub-skor H}$
  - Stage 8: $\text{Sub C} + \text{Sub F} + \text{Sub G} + \text{Sub H} = \text{Grand Total Fraud Score}$
- Memisahkan direktori komponen menjadi `steps/non-fraud/` dan `steps/fraud/` untuk arsitektur yang bersih (*clean code*).
- Menambah master data khusus fraud di `masterDataApi.ts` dan `useMasterData.ts`.
- Menyediakan 4 tombol demo helper di bagian atas layar untuk menguji kedua skenario pada masing-masing jalur.

**Non-Goals:**
- Mengubah database backend nyata (tetap menggunakan simulated in-memory API latency).
- Mengizinkan percampuran field antar-jalur dalam satu submission yang sama.

## Decisions

### 1. Folder Restructuring for Step Components
- **Keputusan**: Memisahkan komponen stage menjadi:
  - `src/features/risk-management/components/steps/non-fraud/` (Step 1 hingga Step 8)
  - `src/features/risk-management/components/steps/fraud/` (FraudStep2 hingga FraudStep8)
- **Alternatif**: Menggunakan satu komponen per stage dengan banyak conditional `v-if="assessmentType === 'fraud'"`.
- **Rasional**: Pendekatan per-file menjaga ukuran komponen tetap sangat kecil (< 80 baris), mudah dipelajari, dan sama sekali tidak menimbulkan polusi kode (*spaghetti template*).

### 2. State Modeling di Pinia Store
- **Keputusan**: Menambahkan properti `assessmentType: 'non_fraud' | 'fraud'` di level root store. Store memelihara `formData` untuk non-fraud dan `fraudData` untuk fraud secara terpisah.
- **Alternatif**: Me-reset dan menimpa state `formData` yang sama saat user berganti pilihan.
- **Rasional**: Mempertahankan state terpisah memungkinkan pengguna berpindah-pindah tipe di Stage 1 untuk melihat perbedaan tanpa kehilangan isian yang sudah mereka ketik sebelumnya.

### 3. StepConfig & Stepper Navigation Dynamism
- **Keputusan**: Wizard mendefinisikan dua set metadata step (`nonFraudSteps` dan `fraudSteps`). Stepper header, subtitle, dan indikator progres otomatis menggunakan label domain Fraud saat mode Fraud aktif (misalnya *Modus Operandi*, *Loss Exposure*, *Asset Containment*, *Forensic Audit*).
- **Rasional**: Pengguna mendapatkan pengalaman yang sepenuhnya disesuaikan dengan konteks investigasi fraud.

## Risks / Trade-offs

- **[Risk] Validasi cross-stage salah memicu skema track yang tidak aktif**  
  → *Mitigasi*: Fungsi `validateStageData` dan `validateFullForm` menerima parameter `assessmentType` dan hanya menjalankan validasi Zod dari skema jalur yang sedang aktif.
