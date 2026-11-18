<script setup lang="ts">
import { useRiskFormStore } from '../../../stores/useRiskFormStore';
import FormField from '../../../../../components/ui/FormField.vue';
import TextInput from '../../../../../components/ui/TextInput.vue';

defineProps<{
  errors?: Record<string, string>;
}>();

const store = useRiskFormStore();
const form = store.fraudData.modus;
</script>

<template>
  <div class="space-y-6">
    <div class="border-b border-rose-200 pb-3">
      <div class="flex items-center gap-2 mb-1">
        <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-600 text-white">
          Fraud Track
        </span>
        <span class="text-xs font-semibold text-rose-600">Stage 2 of 5/8</span>
      </div>
      <h2 class="text-xl font-bold text-slate-900">Stage 2: Modus Operandi & Indicator Detection</h2>
      <p class="text-sm text-slate-500 mt-0.5">
        Identifikasi skenario kecurangan, frekuensi indikator anomali, dan tingkat eksploitasi celah (3 fields).
      </p>
    </div>

    <!-- Live Reactive Sub-score Card: A + B = C -->
    <div class="p-4 rounded-xl border border-rose-200 bg-rose-50/70 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-white border border-rose-300 flex flex-col items-center justify-center shadow-sm">
          <span class="text-[10px] text-rose-500 font-bold uppercase tracking-wider">Sub C</span>
          <span class="text-xl font-black text-rose-700">{{ form.subScoreC }}</span>
        </div>
        <div>
          <h4 class="font-bold text-slate-800 text-sm">Modus & Opportunity Sub-Score (C)</h4>
          <p class="text-xs text-slate-600">
            Formula Reaktif: Factor A ({{ form.factorA }}) + Factor B ({{ form.factorB }}) = <strong>{{ form.subScoreC }}</strong> / 20
          </p>
        </div>
      </div>
      <div class="hidden sm:block text-right text-xs text-rose-700 font-semibold">
        Diakumulasikan di Stage 5
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
        <!-- 2. Factor A -->
        <div>
          <FormField
            label="Factor A: Frekuensi Transaksi Anomali (1 - 10)"
            required
            :error="errors?.factorA"
            hint="Intensitas atau pengulangan transaksi mencurigakan"
          >
            <div class="flex items-center gap-4 mt-2">
              <input
                type="range"
                min="1"
                max="10"
                v-model.number="form.factorA"
                class="w-full accent-rose-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <span class="w-10 text-center font-bold text-lg text-rose-700 bg-white border border-slate-200 rounded-md py-1">
                {{ form.factorA }}
              </span>
            </div>
          </FormField>
        </div>

        <!-- 3. Factor B -->
        <div>
          <FormField
            label="Factor B: Kompleksitas Celah / Tingkat Kolusi (1 - 10)"
            required
            :error="errors?.factorB"
            hint="Tingkat keterlibatan pihak luar atau penyalahgunaan kewenangan"
          >
            <div class="flex items-center gap-4 mt-2">
              <input
                type="range"
                min="1"
                max="10"
                v-model.number="form.factorB"
                class="w-full accent-rose-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <span class="w-10 text-center font-bold text-lg text-rose-700 bg-white border border-slate-200 rounded-md py-1">
                {{ form.factorB }}
              </span>
            </div>
          </FormField>
        </div>
      </div>
    </div>
  </div>
</template>
