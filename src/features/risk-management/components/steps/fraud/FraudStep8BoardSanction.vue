<script setup lang="ts">
import { useRiskFormStore } from '../../../stores/useRiskFormStore';
import FormField from '../../../../../components/ui/FormField.vue';
import TextInput from '../../../../../components/ui/TextInput.vue';

defineProps<{
  errors?: Record<string, string>;
}>();

const store = useRiskFormStore();
const form = store.fraudData.boardSanction;
const fraudData = store.fraudData;
</script>

<template>
  <div class="space-y-6">
    <div class="border-b border-slate-200 pb-3">
      <div class="flex items-center gap-2 mb-1">
        <span class="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-rose-700 text-white">
          Fraud Final Stage
        </span>
        <span class="text-xs font-semibold text-slate-500">Stage 8 of 8</span>
      </div>
      <h2 class="text-xl font-bold text-slate-900">Stage 8: Board Sanction & Grand Total Fraud Score</h2>
      <p class="text-sm text-slate-500 mt-0.5">
        Rekapitulasi total skor investigasi fraud (C + F + G + H), penerbitan SK pemberhentian, dan kuasa hukum (2 fields).
      </p>
    </div>

    <!-- Executive Grand Cumulative Summary Card (Professional Dark Slate) -->
    <div class="p-6 rounded-2xl bg-slate-900 text-white shadow-sm border border-slate-800 space-y-5">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-xl bg-white/10 border border-white/20 flex flex-col items-center justify-center shadow-xs">
            <span class="text-[9px] font-bold text-slate-300 uppercase tracking-wider">Grand Total</span>
            <span class="text-2xl font-black text-white">{{ form.grandCumulativeFraudScore }}</span>
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="text-base font-bold text-white tracking-tight">Enterprise Cumulative Fraud Severity</h3>
              <span
                v-if="store.benchmarkGrandTotal"
                class="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-md border"
                :class="store.benchmarkGrandTotal.badgeClass"
              >
                API Benchmark: {{ store.benchmarkGrandTotal.label }}
              </span>
            </div>
            <p class="text-xs text-slate-300 mt-1">
              Akumulasi formula: Sub C + Sub F + Sub G + Sub H = <strong>{{ form.grandCumulativeFraudScore }} / 40 Poin</strong> &bull; {{ store.benchmarkGrandTotal?.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- 4 Factor Breakdown Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-800 text-xs">
        <div class="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80">
          <div class="text-[11px] text-slate-400">Stage 2 (Modus C)</div>
          <div class="font-bold text-white text-base mt-0.5">{{ fraudData.modus.subScoreC }} <span class="text-xs font-normal text-slate-400">/ 20</span></div>
          <div class="text-[10px] text-slate-400 mt-1 truncate">{{ store.benchmarkSubScoreC?.label }}</div>
        </div>

        <div class="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80">
          <div class="text-[11px] text-slate-400">Stage 3 (Loss F)</div>
          <div class="font-bold text-white text-base mt-0.5">{{ fraudData.loss.subScoreF }} <span class="text-xs font-normal text-slate-400">/ 20</span></div>
          <div class="text-[10px] text-slate-400 mt-1 truncate">{{ store.benchmarkSubScoreF?.label }}</div>
        </div>

        <div class="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80">
          <div class="text-[11px] text-slate-400">Stage 6 (Forensic G)</div>
          <div class="font-bold text-white text-base mt-0.5">{{ fraudData.forensic.subScoreG }} <span class="text-xs font-normal text-slate-400">/ 20</span></div>
          <div class="text-[10px] text-slate-400 mt-1 truncate">{{ store.benchmarkSubScoreG?.label }}</div>
        </div>

        <div class="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80">
          <div class="text-[11px] text-slate-400">Stage 7 (Law Enforce H)</div>
          <div class="font-bold text-white text-base mt-0.5">{{ fraudData.lawEnforcement.subScoreH }} <span class="text-xs font-normal text-slate-400">/ 20</span></div>
          <div class="text-[10px] text-slate-400 mt-1 truncate">{{ store.benchmarkSubScoreH?.label }}</div>
        </div>
      </div>
    </div>

    <!-- Formal Board Decree & Sign-Off Fields (2 fields) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
      <!-- 1. Termination Decree Number -->
      <div>
        <FormField label="Nomor SK Pemecatan / Surat Kuasa Penuntutan Hukum" required :error="errors?.terminationDecreeNumber" hint="Min 3 karakter">
          <TextInput
            v-model="form.terminationDecreeNumber"
            placeholder="e.g. SK-DIR-2026/FRAUD/042-LEGAL"
            :has-error="Boolean(errors?.terminationDecreeNumber)"
          />
        </FormField>
      </div>

      <!-- 2. Legal Director Sign-Off -->
      <div>
        <FormField label="Nama Direktur Kepatuhan & Legal / Kuasa Hukum" required :error="errors?.legalDirectorSignOff" hint="Pejabat penandatangan penuntutan pidana">
          <TextInput
            v-model="form.legalDirectorSignOff"
            placeholder="e.g. Dr. Hendra Kusuma, S.H., LL.M."
            :has-error="Boolean(errors?.legalDirectorSignOff)"
          />
        </FormField>
      </div>
    </div>
  </div>
</template>
