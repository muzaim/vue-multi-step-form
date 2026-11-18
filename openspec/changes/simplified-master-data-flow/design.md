# Design

## Context

Sebelumnya, setiap stage form memiliki hingga 10 field input yang membuat template Vue SFC menjadi panjang dan bising. Selain itu, pilihan dropdown (*options*) didefinisikan secara statis di dalam komponen Vue. Perubahan ini merancang arsitektur pemisahan penuh di mana master data diambil secara asynchronous dari layer API murni dan dikelola oleh composable, serta setiap stage disederhanakan menjadi 2–4 field terfokus.

## Goals / Non-Goals

**Goals:**
- Memisahkan data fetching master data dropdown dari template Vue ke dalam `masterDataApi.ts` (Pure TS) dan `useMasterData.ts` (Composable).
- Menyederhanakan seluruh stage form (Stage 1 hingga 8) menjadi 2–4 field per stage sehingga kode presentasi sangat bersih dan mudah dibaca.
- Mempertahankan integritas alur kalkulasi matematis (A+B=C di Stage 2, D+E=F di Stage 3, Gate Threshold 15 di Stage 5, Sub G di Stage 6, Sub H di Stage 7, dan Grand Total di Stage 8).
- Menyediakan status loading indikator pada elemen `<select>` saat master data sedang di-fetch.

**Non-Goals:**
- Menghubungkan ke database SQL backend nyata (tetap menggunakan asynchronous Promise mock service).
- Mengubah alur navigasi dasar (linear progression dengan backward freedom).

## Decisions

### 1. Dedicated Master Data Layer (`masterDataApi.ts` + `useMasterData.ts`)
- **Keputusan**: Membuat layer API terpisah khusus master data opsi dropdown. Composable `useMasterData` bertindak sebagai penyedia opsi reaktif terpadu dengan status loading.
- **Alternatif**: Memasukkan fetch master data ke dalam Pinia store utama atau memanggilnya di dalam `onMounted` tiap komponen stage.
- **Rasional**: Memisahkan master data dari form state store menjaga Pinia store murni sebagai penampung inputan pengguna. Composable mandiri juga mempermudah *caching* dan penggunaan ulang (*reusability*) di berbagai komponen.

### 2. Streamlining Stages to 2–4 High-Impact Fields
- **Keputusan**: Tiap stage hanya menampung 2–4 field kunci:
  - **Stage 1 (General)**: Risk Title, Category (API), Department (API) [3 fields]
  - **Stage 2 (Threats)**: Threat Description, Factor A, Factor B $\rightarrow$ Sub C [3 fields]
  - **Stage 3 (Impacts)**: Operational Impact (API), Factor D, Factor E $\rightarrow$ Sub F [3 fields]
  - **Stage 4 (Mitigation)**: Action Plan Title, Treatment Strategy (API), Allocated Budget [3 fields]
  - **Stage 5 (Gate)**: Monitoring KRI, Compliance Sign-Off, Gate Threshold Card [2 fields]
  - **Stage 6 (Deep Mitigation)**: Escalated Plan, Factor G1, Factor G2, CRO Approval [4 fields]
  - **Stage 7 (Board Oversight)**: Board Committee (API), Factor H1, Factor H2 [3 fields]
  - **Stage 8 (Executive Final)**: Resolution Number, CEO Sign-off, Grand Total Summary [2 fields]
- **Rasional**: Struktur ini sangat ideal untuk dipelajari (*clean architecture blueprint*), tidak melelahkan saat didemokan, dan secara teknis tetap membuktikan kapabilitas *dynamic branching* dan *cross-stage calculations*.

## Risks / Trade-offs

- **[Risk] Dropdown kosong jika API master data gagal merespons**  
  → *Mitigasi*: Composable `useMasterData` menyediakan fallback default dan penanganan error sehingga form tidak crash, serta input select dinonaktifkan sementara (*disabled state*) dengan label placeholder "Memuat opsi...".
