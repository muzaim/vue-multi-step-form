<script setup lang="ts">
import { useRiskFormStore } from '../../../stores/useRiskFormStore';
import FormField from '../../../../../components/ui/FormField.vue';
import TextInput from '../../../../../components/ui/TextInput.vue';
import ScoreSelectInput from '../../../../../components/ui/ScoreSelectInput.vue';

defineProps<{
  errors?: Record<string, string>;
}>();

const store = useRiskFormStore();
const form = store.fraudData.modus;
</script>

<template>
  <div class="space-y-6">
    <div class="border-b border-slate-200 pb-3">
      <div class="flex items-center gap-2 mb-1">
        <span class="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-rose-700 text-white">
          Fraud Track
        </span>
        <span class="text-xs font-semibold text-slate-500">Stage 2 of 5/8</span>
      </div>
      <h2 class="text-xl font-bold text-slate-900">Stage 2: Modus Operandi & Indicator Detection</h2>
      <p class="text-sm text-slate-500 mt-0.5">
        Identifikasi skenario kecurangan, frekuensi indikator anomali, dan tingkat eksploitasi celah (3 fields).
      </p>
    </div>

    <!-- Live Reactive Sub-score Card: A + B = C -->
    <div class="p-4 rounded-xl border border-rose-200/80 bg-rose-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
      <div class="flex items-center gap-3.5">
        <div class="w-14 h-14 rounded-xl bg-white border border-rose-200 flex flex-col items-center justify-center shadow-xs">
          <span class="text-[10px] text-rose-600 font-bold uppercase tracking-wider">Sub C</span>
          <span class="text-2xl font-black text-rose-700">{{ form.subScoreC }}</span>
        </div>
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <h4 class="font-bold text-slate-900 text-sm">Modus & Opportunity Sub-Score (C)</h4>
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
      <div class="text-xs text-rose-700/80 font-medium whitespace-nowrap bg-white/60 px-2.5 py-1 rounded-md border border-rose-200/50">
        Gate Threshold Factor (Stage 5)
      </div>
    </div>

    <div class="space-y-5">
      <!-- 1. Modus Summary -->
      <div>
        <FormField label="Ringkasan Modus Operandi & Indikasi Pelanggaran" required :error="errors?.modusSummary" hint="Min 5 karakter">
          <TextInput
            v-model="form.modusSummary"
            placeholder="e.g. Pembelian lisensi software fiktif menggunakan akun vendor bodong dengan approver internal"
            :has-error="Boolean(errors?.modusSummary)"
          />
        </FormField>
      </div>

      <!-- Factors A & B Calculation Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
        <!-- 2. Factor A (Combobox) -->
        <div>
          <ScoreSelectInput
            v-model="form.factorA"
            label="Factor A: Frekuensi Transaksi Anomali"
            hint="Intensitas atau pengulangan transaksi mencurigakan"
            :has-error="Boolean(errors?.factorA)"
            :error-message="errors?.factorA"
          />
        </div>

        <!-- 3. Factor B (Combobox) -->
        <div>
          <ScoreSelectInput
            v-model="form.factorB"
            label="Factor B: Kompleksitas Celah & Kolusi"
            hint="Tingkat keterlibatan pihak luar atau penyalahgunaan kewenangan"
            :has-error="Boolean(errors?.factorB)"
            :error-message="errors?.factorB"
          />
        </div>
      </div>
    </div>
  </div>
</template>
