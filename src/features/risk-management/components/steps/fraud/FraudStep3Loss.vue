<script setup lang="ts">
import { useRiskFormStore } from '../../../stores/useRiskFormStore';
import { useMasterData } from '../../../composables/useMasterData';
import FormField from '../../../../../components/ui/FormField.vue';
import SelectInput from '../../../../../components/ui/SelectInput.vue';

defineProps<{
  errors?: Record<string, string>;
}>();

const store = useRiskFormStore();
const form = store.fraudData.loss;
const { fraudLossCategories, isLoading } = useMasterData();
</script>

<template>
  <div class="space-y-6">
    <div class="border-b border-rose-200 pb-3">
      <div class="flex items-center gap-2 mb-1">
        <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-600 text-white">
          Fraud Track
        </span>
        <span class="text-xs font-semibold text-rose-600">Stage 3 of 5/8</span>
      </div>
      <h2 class="text-xl font-bold text-slate-900">Stage 3: Loss Exposure & Financial Impact</h2>
      <p class="text-sm text-slate-500 mt-0.5">
        Klasifikasi kerugian fraud serta bobot potensi kerugian finansial langsung dan risiko regulasi (3 fields).
      </p>
    </div>

    <!-- Live Reactive Sub-score Card: D + E = F -->
    <div class="p-4 rounded-xl border border-rose-200 bg-rose-50/70 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-white border border-rose-300 flex flex-col items-center justify-center shadow-sm">
          <span class="text-[10px] text-rose-500 font-bold uppercase tracking-wider">Sub F</span>
          <span class="text-xl font-black text-rose-700">{{ form.subScoreF }}</span>
        </div>
        <div>
          <h4 class="font-bold text-slate-800 text-sm">Financial Exposure & Severity Index (F)</h4>
          <p class="text-xs text-slate-600">
            Formula Reaktif: Factor D ({{ form.factorD }}) + Factor E ({{ form.factorE }}) = <strong>{{ form.subScoreF }}</strong> / 20
          </p>
        </div>
      </div>
      <div class="hidden sm:block text-right text-xs text-rose-700 font-semibold">
        Diakumulasikan di Stage 5
      </div>
    </div>

    <div class="space-y-5">
      <!-- 1. Loss Category (from API) -->
      <div>
        <FormField label="Kategori Tipologi Kerugian Fraud (Master Data API)" required :error="errors?.lossCategory">
          <SelectInput
            :model-value="form.lossCategory"
            @update:model-value="form.lossCategory = $event as string"
            :options="fraudLossCategories"
            :placeholder="isLoading ? 'Memuat kategori kerugian...' : 'Pilih Tipologi Fraud'"
            :disabled="isLoading"
            :has-error="Boolean(errors?.lossCategory)"
          />
        </FormField>
      </div>

      <!-- Factors D & E Calculation Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
        <!-- 2. Factor D -->
        <div>
          <FormField
            label="Factor D: Bobot Kerugian Finansial Langsung (1 - 10)"
            required
            :error="errors?.factorD"
            hint="Estimasi nominal dana atau aset perusahaan yang terancam"
          >
            <div class="flex items-center gap-4 mt-2">
              <input
                type="range"
                min="1"
                max="10"
                v-model.number="form.factorD"
                class="w-full accent-rose-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <span class="w-10 text-center font-bold text-lg text-rose-700 bg-white border border-slate-200 rounded-md py-1">
                {{ form.factorD }}
              </span>
            </div>
          </FormField>
        </div>

        <!-- 3. Factor E -->
        <div>
          <FormField
            label="Factor E: Keparahan Reputasi & Sanksi Regulator (1 - 10)"
            required
            :error="errors?.factorE"
            hint="Potensi investigasi eksternal, pencabutan izin, atau pemberitaan media"
          >
            <div class="flex items-center gap-4 mt-2">
              <input
                type="range"
                min="1"
                max="10"
                v-model.number="form.factorE"
                class="w-full accent-rose-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <span class="w-10 text-center font-bold text-lg text-rose-700 bg-white border border-slate-200 rounded-md py-1">
                {{ form.factorE }}
              </span>
            </div>
          </FormField>
        </div>
      </div>
    </div>
  </div>
</template>
