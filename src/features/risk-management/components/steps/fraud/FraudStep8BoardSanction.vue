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
    <div class="border-b border-rose-200 pb-3">
      <div class="flex items-center gap-2 mb-1">
        <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-600 text-white">
          Fraud Final Stage
        </span>
        <span class="text-xs font-semibold text-rose-600">Stage 8 of 8</span>
      </div>
      <h2 class="text-xl font-bold text-slate-900">Stage 8: Board Sanction & Grand Total Fraud Score</h2>
      <p class="text-sm text-slate-500 mt-0.5">
        Rekapitulasi total skor investigasi fraud (C + F + G + H), penerbitan SK pemberhentian, dan kuasa hukum (2 fields).
      </p>
    </div>

    <!-- Grand Cumulative Fraud Score Banner -->
    <div class="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-rose-950 text-white shadow-md">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-5">
          <div class="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex flex-col items-center justify-center">
            <span class="text-[10px] font-bold text-rose-300 uppercase tracking-wider">Grand Total</span>
            <span class="text-3xl font-black text-white">{{ form.grandCumulativeFraudScore }}</span>
          </div>
          <div>
            <h3 class="text-lg font-extrabold text-white">Enterprise Cumulative Fraud Severity</h3>
            <p class="text-xs text-slate-300 mt-1">
              Sub C ({{ fraudData.modus.subScoreC }}) + Sub F ({{ fraudData.loss.subScoreF }}) + Sub G ({{ fraudData.forensic.subScoreG }}) + Sub H ({{ fraudData.lawEnforcement.subScoreH }}) = <strong class="text-rose-400 font-mono text-sm">{{ form.grandCumulativeFraudScore }} Poin</strong>
            </p>
          </div>
        </div>

        <div class="flex flex-wrap gap-2 text-xs">
          <span class="px-2.5 py-1 bg-white/10 rounded-lg border border-white/10">Stage 2 (C): {{ fraudData.modus.subScoreC }}</span>
          <span class="px-2.5 py-1 bg-white/10 rounded-lg border border-white/10">Stage 3 (F): {{ fraudData.loss.subScoreF }}</span>
          <span class="px-2.5 py-1 bg-white/10 rounded-lg border border-white/10">Stage 6 (G): {{ fraudData.forensic.subScoreG }}</span>
          <span class="px-2.5 py-1 bg-white/10 rounded-lg border border-white/10">Stage 7 (H): {{ fraudData.lawEnforcement.subScoreH }}</span>
        </div>
      </div>
    </div>

    <!-- Formal Board Decree & Sign-Off Fields (2 fields) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-white rounded-xl border border-slate-200">
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
