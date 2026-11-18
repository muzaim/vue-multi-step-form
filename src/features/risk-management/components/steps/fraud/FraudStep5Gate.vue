<script setup lang="ts">
import { useRiskFormStore } from '../../../stores/useRiskFormStore';
import FormField from '../../../../../components/ui/FormField.vue';
import TextInput from '../../../../../components/ui/TextInput.vue';

defineProps<{
  errors?: Record<string, string>;
}>();

const store = useRiskFormStore();
const form = store.fraudData.gate;
const fraudData = store.fraudData;
</script>

<template>
  <div class="space-y-6">
    <div class="border-b border-rose-200 pb-3">
      <div class="flex items-center gap-2 mb-1">
        <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-600 text-white">
          Fraud Track
        </span>
        <span class="text-xs font-semibold text-rose-600">Stage 5 of 5/8</span>
      </div>
      <h2 class="text-xl font-bold text-slate-900">Stage 5: Fraud Evaluation Gate & Threshold</h2>
      <p class="text-sm text-slate-500 mt-0.5">
        Evaluasi akumulasi skor Sub C (Modus) dan Sub F (Kerugian) terhadap ambang batas eskalasi pidana (Ambang Batas: 15 Poin) (2 fields).
      </p>
    </div>

    <!-- Threshold Evaluation Gate Banner -->
    <div
      class="p-5 rounded-xl border transition-all duration-300 shadow-sm"
      :class="[
        form.isEscalated
          ? 'bg-rose-50 border-rose-300 text-rose-950'
          : 'bg-emerald-50 border-emerald-300 text-emerald-950'
      ]"
    >
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div
            class="w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-black shadow-sm"
            :class="form.isEscalated ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'"
          >
            <span class="text-[10px] uppercase font-bold tracking-wider opacity-85">Gate</span>
            <span class="text-2xl">{{ form.gateScore }}</span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-base">
                {{ form.isEscalated ? 'CRITICAL FRAUD THRESHOLD EXCEEDED (CRIMINAL ESCALATION)' : 'INTERNAL DISCIPLINARY RESOLUTION' }}
              </h3>
            </div>
            <p class="text-xs mt-1" :class="form.isEscalated ? 'text-rose-700' : 'text-emerald-700'">
              Kalkulasi Gate Fraud: Sub C ({{ fraudData.modus.subScoreC }}) + Sub F ({{ fraudData.loss.subScoreF }}) = <strong>{{ form.gateScore }} Poin</strong>
              (Ambang Batas: 15 Poin)
            </p>
          </div>
        </div>

        <div class="text-right">
          <span
            class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider inline-block"
            :class="form.isEscalated ? 'bg-rose-200 text-rose-900' : 'bg-emerald-200 text-emerald-900'"
          >
            {{ form.isEscalated ? 'Stage 6 - 8 Terbuka (Audit & Pidana)' : 'Form Berhenti di Stage 5' }}
          </span>
        </div>
      </div>

      <div class="mt-4 pt-3 border-t text-xs" :class="form.isEscalated ? 'border-rose-200 text-rose-800' : 'border-emerald-200 text-emerald-800'">
        <p v-if="form.isEscalated">
          ⚠️ Karena skor kecurangan &ge; 15 poin, kasus ini wajib melalui eskalasi tingkat lanjut: <strong>Stage 6 (Audit Forensik & Asset Tracing)</strong>, <strong>Stage 7 (Penegak Hukum & Whistleblower)</strong>, dan <strong>Stage 8 (Sanksi Direksi & Kuasa Hukum)</strong>.
        </p>
        <p v-else>
          ✅ Karena skor kecurangan &lt; 15 poin, kasus ini dapat diselesaikan melalui mekanisme sanksi disiplin internal. Anda dapat melengkapi 2 field di bawah dan langsung mengirimkan asesmen (*Final Submit* di Stage 5).
        </p>
      </div>
    </div>

    <!-- Governance Fields (2 fields) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 bg-white p-5 rounded-xl border border-slate-200">
      <!-- 1. Internal Investigation Recommendation -->
      <div>
        <FormField
          label="Rekomendasi Investigasi / Tindakan Disiplin"
          required
          :error="errors?.internalInvestigationRecommendation"
          hint="Rekomendasi tindak lanjut penanganan (min 3 karakter)"
        >
          <TextInput
            v-model="form.internalInvestigationRecommendation"
            placeholder="e.g. Surat Peringatan Keras (SP-3) dan ganti rugi pemotongan hak pesangon"
            :has-error="Boolean(errors?.internalInvestigationRecommendation)"
          />
        </FormField>
      </div>

      <!-- 2. Head of Anti-Fraud Sign-Off -->
      <div>
        <FormField
          label="Pejabat Kepala Unit Anti-Fraud / Investigasi"
          required
          :error="errors?.headOfAntiFraudSignOff"
          hint="Nama pejabat penanggung jawab investigasi"
        >
          <TextInput
            v-model="form.headOfAntiFraudSignOff"
            placeholder="e.g. Kombes Pol (Purn) Bambang Wicaksono (Head of Internal Fraud)"
            :has-error="Boolean(errors?.headOfAntiFraudSignOff)"
          />
        </FormField>
      </div>
    </div>
  </div>
</template>
