# Proposal

## Why

Dalam tata kelola risiko korporasi dan perbankan modern, penanganan risiko operasional biasa (*non-fraud risk*) memiliki karakteristik dan prosedur yang berbeda secara fundamental dari penanganan dugaan kecurangan / kejahatan keuangan (*fraud risk*). Memaksa kedua domain menggunakan satu alur form yang sama membatasi fleksibilitas analisis dan menurunkan akurasi tata kelola. Pengguna membutuhkan kapabilitas *dual-track* di mana pemilihan tipe asesmen di Stage 1 menentukan secara dinamis seluruh alur tahapan 2 hingga 8, lengkap dengan parameter investigasi kecurangan, perhitungan matematis ambang batas (5 vs 8 stage), serta batasan 2–4 field per stage.

## What Changes

- **Stage 1 Assessment Type Selector**: Menambahkan pilihan eksplisit di Stage 1 (`Fraud` vs `Non-Fraud`) yang menjadi dasar percabangan alur berikutnya.
- **Dedicated Fraud Track (Stages 2–8)**:
  - **Stage 2 (Modus Operandi)**: Deskripsi modus, *Factor A* (Frekuensi Anomali), *Factor B* (Kompleksitas Celah/Kolusi) $\rightarrow$ Sub-skor C.
  - **Stage 3 (Loss & Exposure)**: Kategori Kerugian (Master Data API), *Factor D* (Potensi Kerugian Finansial), *Factor E* (Dampak Reputasi/Regulasi) $\rightarrow$ Sub-skor F.
  - **Stage 4 (Immediate Containment)**: Tindakan Pengamanan Cepat, Status Bukti Digital (Master Data API), Alokasi Biaya Investigasi Forensik.
  - **Stage 5 (Fraud Evaluation Gate)**: Rekomendasi Investigasi Internal, Tanda Tangan Kepala Unit Anti-Fraud. Threshold Gate $\text{Sub C} + \text{Sub F}$: jika $< 15$ selesai di Stage 5 (Sanksi Disiplin), jika $\ge 15$ membuka Stage 6–8 (Eskalasi Pidana).
  - **Stage 6 (Forensic Audit & Asset Tracing)**: Rencana Pelacakan Aset, *Factor G1* (Tingkat Kesulitan Forensik), *Factor G2* (Probabilitas Asset Recovery) $\rightarrow$ Sub-skor G, Persetujuan Audit Forensik.
  - **Stage 7 (Law Enforcement & Whistleblower)**: Lembaga Penegak Hukum (Master Data API), *Factor H1* (Kerahasiaan Whistleblower), *Factor H2* (Risiko Tuntutan Balik) $\rightarrow$ Sub-skor H.
  - **Stage 8 (Board Sanction & Grand Total)**: SK Pemberhentian/Kuasa Hukum, Tanda Tangan Direktur Legal & Kepatuhan, Akumulasi Grand Total Fraud Index ($C + F + G + H$).
- **Preserved Non-Fraud Track**: Mempertahankan seluruh implementasi formulir non-fraud yang sudah ada (2–4 field per stage) sebagai jalur standar.
- **Architectural Modularity**: Memisahkan komponen UI Vue ke dalam subfolder `steps/non-fraud/` dan `steps/fraud/` sehingga kode template tetap ringkas, bersih, dan mudah dirawat.
- **Demo Quick-Fill Scenarios**: Menyediakan tombol simulasi cepat untuk 4 skenario: Non-Fraud Normal (<15), Non-Fraud Escalated (>=15), Fraud Ringan (<15), dan Fraud Berat / Tipikor (>=15).

## Capabilities

### New Capabilities
- `fraud-risk-workflow`: Alur asesmen risiko fraud multi-step khusus dengan indikator modus, keterpaparan finansial, tindakan isolasi aset, audit forensik, pelaporan penegak hukum, dan kalkulasi ambang batas eskalasi (5 vs 8 stage).
- `dual-track-form-switcher`: Sistem pemilihan dan percabangan dinamis antara jalur Non-Fraud dan Fraud di Stage 1 yang mengontrol navigasi stepper, skema validasi, serta komponen per stage.

### Modified Capabilities
<!-- None -->

## Impact

- Penambahan berkas tipe data khusus `fraud.types.ts` dan schema validasi Zod `fraudValidation.ts`.
- Penambahan endpoint master data fraud di `masterDataApi.ts` (Kategori Kerugian Fraud, Status Bukti Digital, Lembaga Penegak Hukum) dan composable `useMasterData.ts`.
- Restrukturisasi subfolder komponen `steps/` menjadi `steps/non-fraud/` dan `steps/fraud/`.
- Penyesuaian `RiskFormWizard.vue` dan `useRiskFormStore.ts` untuk mendukung state `assessmentType` dan percabangan komponen form dinamis.
