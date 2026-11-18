# Design

## Context

Arsitektur multi-step form yang ada saat ini menggunakan 5 stage linier statis. Perubahan ini memperkenalkan kapabilitas *Dynamic Conditional Workflow* di mana akumulasi skor dari Stage 2 dan Stage 3 dievaluasi pada Stage 5 (*Evaluation Gate*). Jika skor $\ge 15$, alur form secara reaktif bertambah menjadi 8 stage. Lihat `proposal.md` untuk motivasi bisnis.

## Goals / Non-Goals

**Goals:**
- Menerapkan reactive cross-stage calculation di Pinia Store (`a + b = c`, `d + e = f`, `gateScore = c + f`, `g`, `h`, and `grandTotal = c + f + g + h`).
- Mengubah stepper navigation agar dinamis: menampilkan 5 stage saat `gateScore < 15` dan otomatis bertambah menjadi 8 stage saat `gateScore >= 15`.
- Menyediakan UI indikator visual yang jelas di Stage 5 mengenai status eskalasi (Terkendali vs Di-eskalasi).
- Menerapkan skema validasi bertahap untuk Stage 6, 7, dan 8 saat eskalasi aktif.

**Non-Goals:**
- Mengubah alur navigasi dasar backward (kembali ke stage sebelumnya tetap bebas tanpa hambatan validasi).
- Menyimpan histori perubahan branching ke database remote.

## Decisions

### 1. Pinia Store Computed Getters for Mathematical Derivations
- **Keputusan**: Semua skor sub-tahap dan status `isEscalated` dihitung melalui `computed()` / getters di `useRiskFormStore`.
- **Alternatif**: Menghitung di dalam template Vue atau watcher lokal.
- **Rasional**: Mencegah redundansi, memastikan kalkulasi bersifat murni (*pure function*), dan dapat diakses instan oleh komponen mana pun (Stage 2, Stage 3, Stage 5, Stage 8, StepperNav, maupun Footer).

### 2. Dynamic Steps Array in Parent Orchestrator
- **Keputusan**: `stepConfigs` di `RiskFormWizard.vue` menggunakan `computed(() => store.isEscalated ? [...baseSteps, ...escalationSteps] : baseSteps)`.
- **Alternatif**: Menyembunyikan step 6, 7, 8 menggunakan `v-if` di dalam satu file raksasa.
- **Rasional**: Dynamic component configuration menjaga komponen tetap terisolasi dan modular, serta otomatis mengupdate indikator progress bar stepper tanpa manipulasi DOM manual.

### 3. Threshold Evaluation in Stage 5
- **Keputusan**: Stage 5 berfungsi sebagai *Evaluation Gate* yang menampilkan kartu evaluasi skor `gateScore = c + f`. Jika $< 15$, tombol aksi menjadi "Submit Assessment (Low/Medium Risk)". Jika $\ge 15$, tombol aksi menjadi "Proceed to Escalated Mitigation (Stage 6)".
- **Alternatif**: Membuat halaman popup modal terpisah untuk konfirmasi eskalasi.
- **Rasional**: Menjaga flow tetap terpadu di dalam alur stepper tanpa disrupsi modal yang mengganggu pengalaman pengguna.

## Risks / Trade-offs

- **[Risk] User bolak-balik mengubah nilai di Stage 2/3 sehingga status eskalasi di Stage 5 berkedip (flapping)**  
  → *Mitigasi*: Reaktivitas Pinia secara elegan memperbarui status `isEscalated` seketika. Jika user sedang berada di Stage 6 lalu mundur ke Stage 2 dan menurunkan nilai di bawah 15, wizard otomatis memindahkan `currentStep` kembali ke batas aman (Stage 5) agar tidak terjadi *out-of-bounds index*.
