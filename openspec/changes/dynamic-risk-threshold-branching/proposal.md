# Proposal

## Why

Dalam evaluasi risiko tingkat lanjut, alur asesmen tidak selalu memiliki panjang tahap yang seragam. Ketika tingkat risiko melebihi ambang batas toleransi (threshold), sistem tata kelola risiko enterprise mewajibkan eskalasi formal dengan tahapan mitigasi mendalam dan persetujuan dewan pengawas. Diperlukan kapabilitas dynamic branching stepper dan cross-stage score calculation di mana akumulasi poin di Stage 2 dan Stage 3 dievaluasi pada Stage 5 untuk menentukan apakah form selesai di Stage 5 (poin < 15) atau diekspansi hingga Stage 8 (poin >= 15).

## What Changes

- Penambahan kalkulasi reaktif cross-stage di Pinia Store:
  - Stage 2: sub-skor Ancaman `c = a + b`
  - Stage 3: sub-skor Dampak `f = d + e`
  - Stage 5: akumulasi poin gate `gateScore = c + f`
- Penambahan dynamic stepper branch logic pada wizard:
  - Jika `gateScore < 15`, stepper tetap 5 stage dan form disubmit di Stage 5.
  - Jika `gateScore >= 15`, stepper dinamis melebar menjadi 8 stage.
- Penambahan 3 stage eskalasi lanjutan:
  - Stage 6: Deep Mitigation Action Plan (menghasilkan sub-skor `g`)
  - Stage 7: Board Oversight & Audit Review (menghasilkan sub-skor `h`)
  - Stage 8: Executive Enterprise Sign-off & Grand Cumulative Score (`c + f + g + h`)
- Pembaruan UI Stepper Nav dan Footer agar otomatis mendeteksi perubahan jumlah stage aktif dan mengubah label aksi (Next vs Submit).

## Capabilities

### New Capabilities
- `conditional-escalation-wizard`: Alur stepper adaptif dengan threshold evaluation gate dan kalkulasi skor bertahap (5 hingga 8 stage).

### Modified Capabilities
<!-- None -->

## Impact

- Penambahan tipe data baru dan pembaruan Pinia store (`src/features/risk-management/stores/useRiskFormStore.ts`).
- Penambahan 3 komponen stage baru (`Step6DeepMitigation.vue`, `Step7BoardOversight.vue`, `Step8ExecutiveSignOff.vue`).
- Pembaruan `useRiskWizard.ts`, `RiskStepperNav.vue`, `RiskWizardFooter.vue`, dan `RiskFormWizard.vue`.
