<script setup lang="ts">
import { useRiskFormStore } from '../../../stores/useRiskFormStore';
import FormField from '../../../../../components/ui/FormField.vue';
import TextInput from '../../../../../components/ui/TextInput.vue';

defineProps<{
  errors?: Record<string, string>;
}>();

const store = useRiskFormStore();
const form = store.formData.review;
const fullData = store.formData;
</script>

<template>
  <div class="space-y-6">
    <div class="border-b border-slate-200 pb-3">
      <h2 class="text-xl font-bold text-slate-900">Stage 5: Evaluation Gate & Governance</h2>
      <p class="text-sm text-slate-500 mt-0.5">
        Evaluasi akumulasi skor Sub C dan Sub F terhadap ambang batas eskalasi (Threshold: 15 Poin) (2 fields).
      </p>
    </div>

    <!-- Threshold Evaluation Gate Banner -->
    <div
      class="p-5 rounded-xl border transition-all duration-300 shadow-sm"
      :class="[
        store.isEscalated
          ? 'bg-rose-50 border-rose-300 text-rose-950'
          : 'bg-emerald-50 border-emerald-300 text-emerald-950'
      ]"
    >
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div
            class="w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-black shadow-sm"
            :class="store.isEscalated ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'"
          >
            <span class="text-[10px] uppercase font-bold tracking-wider opacity-85">Gate</span>
            <span class="text-2xl">{{ store.gateScore }}</span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-base">
                {{ store.isEscalated ? 'RISK THRESHOLD EXCEEDED (ESCALATION REQUIRED)' : 'RISK WITHIN ACCEPTABLE TOLERANCE' }}
              </h3>
            </div>
            <p class="text-xs mt-1" :class="store.isEscalated ? 'text-rose-700' : 'text-emerald-700'">
              Kalkulasi Gate: Sub C ({{ fullData.identification.subScoreC }}) + Sub F ({{ fullData.analysis.subScoreF }}) = <strong>{{ store.gateScore }} Poin</strong>
              (Ambang Batas: 15 Poin)
            </p>
          </div>
        </div>

        <div class="text-right">
          <span
            class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider inline-block"
            :class="store.isEscalated ? 'bg-rose-200 text-rose-900' : 'bg-emerald-200 text-emerald-900'"
          >
            {{ store.isEscalated ? 'Stage 6 - 8 Unlocked' : 'Form Berhenti di Stage 5' }}
          </span>
        </div>
      </div>

      <div class="mt-4 pt-3 border-t text-xs" :class="store.isEscalated ? 'border-rose-200 text-rose-800' : 'border-emerald-200 text-emerald-800'">
        <p v-if="store.isEscalated">
          ⚠️ Karena skor &ge; 15, asesmen risiko ini wajib melalui protokol eskalasi tingkat lanjut: <strong>Stage 6 (Deep Mitigation)</strong>, <strong>Stage 7 (Board Oversight)</strong>, dan <strong>Stage 8 (Executive Final Sign-off)</strong>.
        </p>
        <p v-else>
          ✅ Karena skor &lt; 15, risiko berada dalam batas toleransi. Anda dapat melengkapi 2 field di bawah dan langsung melakukan final submit di stage ini.
        </p>
      </div>
    </div>

    <!-- Governance Fields (2 fields) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 bg-white p-5 rounded-xl border border-slate-200">
      <!-- 1. Monitoring Metric KRI -->
      <div>
        <FormField
          label="Key Risk Indicator (KRI) Metric"
          required
          :error="errors?.monitoringMetricKRI"
          hint="Metrik pemantauan berkala (min 3 karakter)"
        >
          <TextInput
            v-model="form.monitoringMetricKRI"
            placeholder="e.g. Server Uptime SLA < 99.95% or Error Rate > 0.05%"
            :has-error="Boolean(errors?.monitoringMetricKRI)"
          />
        </FormField>
      </div>

      <!-- 2. Compliance Sign-Off -->
      <div>
        <FormField
          label="Compliance Officer Sign-off Name"
          required
          :error="errors?.complianceSignOff"
          hint="Pejabat penanggung jawab kepatuhan"
        >
          <TextInput
            v-model="form.complianceSignOff"
            placeholder="e.g. Siti Rahma (Head of Compliance)"
            :has-error="Boolean(errors?.complianceSignOff)"
          />
        </FormField>
      </div>
    </div>
  </div>
</template>
