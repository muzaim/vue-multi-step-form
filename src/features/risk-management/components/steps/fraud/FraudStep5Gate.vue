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
    <div class="border-b border-slate-200 pb-3">
      <div class="flex items-center gap-2 mb-1">
        <span class="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-rose-700 text-white">
          Fraud Track
        </span>
        <span class="text-xs font-semibold text-slate-500">Stage 5 of 5/8</span>
      </div>
      <h2 class="text-xl font-bold text-slate-900">Stage 5: Fraud Evaluation Gate & Threshold</h2>
      <p class="text-sm text-slate-500 mt-0.5">
        Evaluasi akumulasi skor Sub C (Modus) dan Sub F (Kerugian) terhadap ambang batas eskalasi pidana (Ambang Batas: 15 Poin) (2 fields).
      </p>
    </div>

    <!-- Threshold Evaluation Gate Card -->
    <div
      class="p-5 rounded-xl border transition-all duration-200 shadow-sm"
      :class="[
        form.isEscalated
          ? 'bg-amber-50/60 border-amber-200 text-amber-950'
          : 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
      ]"
    >
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div
            class="w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-bold shadow-xs border"
            :class="
              form.isEscalated
                ? 'bg-white border-amber-300 text-amber-900'
                : 'bg-white border-emerald-300 text-emerald-900'
            "
          >
            <span class="text-[10px] uppercase font-bold tracking-wider text-slate-500">Gate</span>
            <span class="text-2xl font-black">{{ form.gateScore }}</span>
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="font-bold text-base text-slate-900">
                {{ form.isEscalated ? 'Fraud Threshold Exceeded (Criminal Escalation Required)' : 'Internal Disciplinary Resolution' }}
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
              Sub C ({{ fraudData.modus.subScoreC }}) + Sub F ({{ fraudData.loss.subScoreF }}) = <strong>{{ form.gateScore }} Poin</strong> (Ambang Batas: 15 Poin) &bull; {{ store.benchmarkGate?.description }}
            </p>
          </div>
        </div>

        <div class="text-right">
          <span
            class="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider inline-block border"
            :class="
              form.isEscalated
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-emerald-100 text-emerald-900 border-emerald-300'
            "
          >
            {{ form.isEscalated ? 'Stage 6 - 8 Terbuka (Audit & Pidana)' : 'Penyelesaian di Stage 5' }}
          </span>
        </div>
      </div>

      <!-- Sub-Score Breakdown Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-200/80">
        <div class="p-3 bg-white rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div class="text-[11px] font-medium text-slate-500">Stage 2: Modus Sub-Score (C)</div>
            <div class="text-xs font-semibold text-slate-800 mt-0.5">Factor A ({{ fraudData.modus.factorA }}) + Factor B ({{ fraudData.modus.factorB }})</div>
          </div>
          <div class="text-right">
            <span class="text-base font-bold text-slate-900">{{ fraudData.modus.subScoreC }}</span>
            <span class="text-xs text-slate-400">/20</span>
          </div>
        </div>

        <div class="p-3 bg-white rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div class="text-[11px] font-medium text-slate-500">Stage 3: Loss Sub-Score (F)</div>
            <div class="text-xs font-semibold text-slate-800 mt-0.5">Factor D ({{ fraudData.loss.factorD }}) + Factor E ({{ fraudData.loss.factorE }})</div>
          </div>
          <div class="text-right">
            <span class="text-base font-bold text-slate-900">{{ fraudData.loss.subScoreF }}</span>
            <span class="text-xs text-slate-400">/20</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Governance Fields (2 fields) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
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
          label="Pejabat Pemeriksa Anti-Fraud Sign-Off"
          required
          :error="errors?.headOfAntiFraudSignOff"
          hint="Pejabat penanggung jawab audit internal"
        >
          <TextInput
            v-model="form.headOfAntiFraudSignOff"
            placeholder="e.g. Bambang Wicaksono (Head of Internal Anti-Fraud)"
            :has-error="Boolean(errors?.headOfAntiFraudSignOff)"
          />
        </FormField>
      </div>
    </div>
  </div>
</template>
