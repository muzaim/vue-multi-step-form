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

    <!-- Threshold Evaluation Gate Card -->
    <div
      class="p-5 rounded-xl border transition-all duration-200 shadow-sm"
      :class="[
        store.isEscalated
          ? 'bg-amber-50/60 border-amber-200 text-amber-950'
          : 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
      ]"
    >
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div
            class="w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-bold shadow-xs border"
            :class="
              store.isEscalated
                ? 'bg-white border-amber-300 text-amber-900'
                : 'bg-white border-emerald-300 text-emerald-900'
            "
          >
            <span class="text-[10px] uppercase font-bold tracking-wider text-slate-500">Gate</span>
            <span class="text-2xl font-black">{{ store.gateScore }}</span>
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="font-bold text-base text-slate-900">
                {{ store.isEscalated ? 'Risk Threshold Exceeded (Escalation Required)' : 'Risk Within Standard Tolerance' }}
              </h3>
              <span
                v-if="store.benchmarkGate"
                class="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-md border"
                :class="store.benchmarkGate.badgeClass"
              >
                API Benchmark: {{ store.benchmarkGate.label }}
              </span>
            </div>
            <p class="text-xs text-slate-600 mt-1">
              Kalkulasi Gate: Sub C ({{ fullData.identification.subScoreC }}) + Sub F ({{ fullData.analysis.subScoreF }}) = <strong>{{ store.gateScore }} Poin</strong> (Ambang Batas: 15 Poin) &bull; {{ store.benchmarkGate?.description }}
            </p>
          </div>
        </div>

        <div class="text-right">
          <span
            class="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider inline-block border"
            :class="
              store.isEscalated
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-emerald-100 text-emerald-900 border-emerald-300'
            "
          >
            {{ store.isEscalated ? 'Stage 6 - 8 Aktif' : 'Penyelesaian di Stage 5' }}
          </span>
        </div>
      </div>

      <!-- Sub-Score Breakdown Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-200/80">
        <div class="p-3 bg-white rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div class="text-[11px] font-medium text-slate-500">Stage 2: Threat Sub-Score (C)</div>
            <div class="text-xs font-semibold text-slate-800 mt-0.5">Factor A ({{ fullData.identification.factorA }}) + Factor B ({{ fullData.identification.factorB }})</div>
          </div>
          <div class="text-right">
            <span class="text-base font-bold text-slate-900">{{ fullData.identification.subScoreC }}</span>
            <span class="text-xs text-slate-400">/20</span>
          </div>
        </div>

        <div class="p-3 bg-white rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div class="text-[11px] font-medium text-slate-500">Stage 3: Impact Sub-Score (F)</div>
            <div class="text-xs font-semibold text-slate-800 mt-0.5">Factor D ({{ fullData.analysis.factorD }}) + Factor E ({{ fullData.analysis.factorE }})</div>
          </div>
          <div class="text-right">
            <span class="text-base font-bold text-slate-900">{{ fullData.analysis.subScoreF }}</span>
            <span class="text-xs text-slate-400">/20</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Governance Fields (2 fields) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
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
            placeholder="e.g. Hendra Kusuma (Compliance Director)"
            :has-error="Boolean(errors?.complianceSignOff)"
          />
        </FormField>
      </div>
    </div>
  </div>
</template>
