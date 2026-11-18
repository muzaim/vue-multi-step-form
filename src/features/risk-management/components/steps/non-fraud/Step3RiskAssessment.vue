<script setup lang="ts">
import { useRiskFormStore } from '../../../stores/useRiskFormStore';
import { useMasterData } from '../../../composables/useMasterData';
import FormField from '../../../../../components/ui/FormField.vue';
import SelectInput from '../../../../../components/ui/SelectInput.vue';
import ScoreSelectInput from '../../../../../components/ui/ScoreSelectInput.vue';
import type { OperationalImpact } from '../../../types/risk.types';

defineProps<{
  errors?: Record<string, string>;
}>();

const store = useRiskFormStore();
const form = store.formData.analysis;
const { operationalImpacts, isLoading } = useMasterData();
</script>

<template>
  <div class="space-y-6">
    <div class="border-b border-slate-200 pb-3">
      <h2 class="text-xl font-bold text-slate-900">Stage 3: Risk Assessment & Impact Metrics</h2>
      <p class="text-sm text-slate-500 mt-0.5">
        Evaluasi level dampak operasional dan tentukan parameter D & E untuk menghasilkan Sub-skor F (3 fields).
      </p>
    </div>

    <!-- Live Reactive Sub-score Card: D + E = F -->
    <div class="p-4 rounded-xl border border-indigo-200/80 bg-indigo-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
      <div class="flex items-center gap-3.5">
        <div class="w-14 h-14 rounded-xl bg-white border border-indigo-200 flex flex-col items-center justify-center shadow-xs">
          <span class="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Sub F</span>
          <span class="text-2xl font-black text-indigo-700">{{ form.subScoreF }}</span>
        </div>
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <h4 class="font-bold text-slate-900 text-sm">Impact Severity Sub-Score (F)</h4>
            <span
              v-if="store.benchmarkSubScoreF"
              class="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-md border"
              :class="store.benchmarkSubScoreF.badgeClass"
            >
              API Benchmark: {{ store.benchmarkSubScoreF.label }}
            </span>
          </div>
          <p class="text-xs text-slate-600 mt-1">
            Formula: Factor D ({{ form.factorD }}) + Factor E ({{ form.factorE }}) = <strong>{{ form.subScoreF }}</strong> / 20 &bull; {{ store.benchmarkSubScoreF?.description }}
          </p>
        </div>
      </div>
      <div class="text-xs text-indigo-700/80 font-medium whitespace-nowrap bg-white/60 px-2.5 py-1 rounded-md border border-indigo-200/50">
        Gate Threshold Factor (Stage 5)
      </div>
    </div>

    <div class="space-y-5">
      <!-- 1. Operational Impact (from API) -->
      <div>
        <FormField label="Operational Impact Level (Master Data API)" required :error="errors?.operationalImpact">
          <SelectInput
            :model-value="form.operationalImpact"
            @update:model-value="form.operationalImpact = $event as OperationalImpact"
            :options="operationalImpacts"
            :placeholder="isLoading ? 'Memuat level dampak...' : 'Pilih Level Dampak Operasional'"
            :disabled="isLoading"
            :has-error="Boolean(errors?.operationalImpact)"
          />
        </FormField>
      </div>

      <!-- Factors D & E Calculation Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
        <!-- 2. Factor D (Combobox) -->
        <div>
          <ScoreSelectInput
            v-model="form.factorD"
            label="Factor D: Financial Loss Weight"
            hint="Bobot estimasi kerugian finansial langsung dan recovery cost"
            :has-error="Boolean(errors?.factorD)"
            :error-message="errors?.factorD"
          />
        </div>

        <!-- 3. Factor E (Combobox) -->
        <div>
          <ScoreSelectInput
            v-model="form.factorE"
            label="Factor E: Regulatory Penalty Severity"
            hint="Tingkat keparahan sanksi kepatuhan hukum atau denda regulator"
            :has-error="Boolean(errors?.factorE)"
            :error-message="errors?.factorE"
          />
        </div>
      </div>
    </div>
  </div>
</template>
