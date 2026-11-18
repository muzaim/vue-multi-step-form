<script setup lang="ts">
import { useRiskFormStore } from '../../../stores/useRiskFormStore';
import { useMasterData } from '../../../composables/useMasterData';
import FormField from '../../../../../components/ui/FormField.vue';
import SelectInput from '../../../../../components/ui/SelectInput.vue';
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
    <div class="p-4 rounded-xl border border-indigo-200 bg-indigo-50/70 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-white border border-indigo-300 flex flex-col items-center justify-center shadow-sm">
          <span class="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">Sub F</span>
          <span class="text-xl font-black text-indigo-700">{{ form.subScoreF }}</span>
        </div>
        <div>
          <h4 class="font-bold text-slate-800 text-sm">Impact Severity Sub-Score (F)</h4>
          <p class="text-xs text-slate-600">
            Formula Reaktif: Factor D ({{ form.factorD }}) + Factor E ({{ form.factorE }}) = <strong>{{ form.subScoreF }}</strong> / 20
          </p>
        </div>
      </div>
      <div class="hidden sm:block text-right text-xs text-indigo-700 font-medium">
        Diakumulasikan di Stage 5
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
        <!-- 2. Factor D -->
        <div>
          <FormField
            label="Factor D: Financial Loss Weight (1 - 10)"
            required
            :error="errors?.factorD"
            hint="Bobot estimasi kerugian finansial langsung dan recovery cost"
          >
            <div class="flex items-center gap-4 mt-2">
              <input
                type="range"
                min="1"
                max="10"
                v-model.number="form.factorD"
                class="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <span class="w-10 text-center font-bold text-lg text-indigo-700 bg-white border border-slate-200 rounded-md py-1">
                {{ form.factorD }}
              </span>
            </div>
          </FormField>
        </div>

        <!-- 3. Factor E -->
        <div>
          <FormField
            label="Factor E: Regulatory Penalty Severity (1 - 10)"
            required
            :error="errors?.factorE"
            hint="Tingkat keparahan sanksi kepatuhan hukum atau denda regulator"
          >
            <div class="flex items-center gap-4 mt-2">
              <input
                type="range"
                min="1"
                max="10"
                v-model.number="form.factorE"
                class="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <span class="w-10 text-center font-bold text-lg text-indigo-700 bg-white border border-slate-200 rounded-md py-1">
                {{ form.factorE }}
              </span>
            </div>
          </FormField>
        </div>
      </div>
    </div>
  </div>
</template>
