<script setup lang="ts">
import { useRiskFormStore } from '../../../stores/useRiskFormStore';
import FormField from '../../../../../components/ui/FormField.vue';
import TextInput from '../../../../../components/ui/TextInput.vue';
import ScoreSelectInput from '../../../../../components/ui/ScoreSelectInput.vue';

defineProps<{
  errors?: Record<string, string>;
}>();

const store = useRiskFormStore();
const form = store.formData.identification;
</script>

<template>
  <div class="space-y-6">
    <div class="border-b border-slate-200 pb-3">
      <h2 class="text-xl font-bold text-slate-900">Stage 2: Risk Identification & Threat Metrics</h2>
      <p class="text-sm text-slate-500 mt-0.5">
        Identifikasi skenario ancaman dan tentukan nilai parameter ancaman A & B untuk menghasilkan Sub-skor C (3 fields).
      </p>
    </div>

    <!-- Live Reactive Sub-score Card: A + B = C -->
    <div class="p-4 rounded-xl border border-indigo-200/80 bg-indigo-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
      <div class="flex items-center gap-3.5">
        <div class="w-14 h-14 rounded-xl bg-white border border-indigo-200 flex flex-col items-center justify-center shadow-xs">
          <span class="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Sub C</span>
          <span class="text-2xl font-black text-indigo-700">{{ form.subScoreC }}</span>
        </div>
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <h4 class="font-bold text-slate-900 text-sm">Threat & Vulnerability Sub-Score (C)</h4>
            <span
              v-if="store.benchmarkSubScoreC"
              class="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-md border"
              :class="store.benchmarkSubScoreC.badgeClass"
            >
              API Benchmark: {{ store.benchmarkSubScoreC.label }}
            </span>
          </div>
          <p class="text-xs text-slate-600 mt-1">
            Formula: Factor A ({{ form.factorA }}) + Factor B ({{ form.factorB }}) = <strong>{{ form.subScoreC }}</strong> / 20 &bull; {{ store.benchmarkSubScoreC?.description }}
          </p>
        </div>
      </div>
      <div class="text-xs text-indigo-700/80 font-medium whitespace-nowrap bg-white/60 px-2.5 py-1 rounded-md border border-indigo-200/50">
        Gate Threshold Factor (Stage 5)
      </div>
    </div>

    <div class="space-y-5">
      <!-- 1. Threat Description -->
      <div>
        <FormField label="Threat Scenario Description" required :error="errors?.threatDescription" hint="Min 5 karakter">
          <TextInput
            v-model="form.threatDescription"
            placeholder="e.g. Ransomware attack targeting unpatched database clusters via VPN gateway"
            :has-error="Boolean(errors?.threatDescription)"
          />
        </FormField>
      </div>

      <!-- Factors A & B Calculation Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
        <!-- 2. Factor A (Combobox) -->
        <div>
          <ScoreSelectInput
            v-model="form.factorA"
            label="Factor A: Threat Frequency Index"
            hint="Estimasi frekuensi serangan atau pemicu ancaman"
            :has-error="Boolean(errors?.factorA)"
            :error-message="errors?.factorA"
          />
        </div>

        <!-- 3. Factor B (Combobox) -->
        <div>
          <ScoreSelectInput
            v-model="form.factorB"
            label="Factor B: Vulnerability Exploitation Ease"
            hint="Tingkat kemudahan celah dieksploitasi oleh pelaku ancaman"
            :has-error="Boolean(errors?.factorB)"
            :error-message="errors?.factorB"
          />
        </div>
      </div>
    </div>
  </div>
</template>
