<script setup lang="ts">
import { useRiskFormStore } from '../../../stores/useRiskFormStore';
import FormField from '../../../../../components/ui/FormField.vue';
import TextInput from '../../../../../components/ui/TextInput.vue';

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
    <div class="p-4 rounded-xl border border-indigo-200 bg-indigo-50/70 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-white border border-indigo-300 flex flex-col items-center justify-center shadow-sm">
          <span class="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">Sub C</span>
          <span class="text-xl font-black text-indigo-700">{{ form.subScoreC }}</span>
        </div>
        <div>
          <h4 class="font-bold text-slate-800 text-sm">Threat & Vulnerability Sub-Score (C)</h4>
          <p class="text-xs text-slate-600">
            Formula Reaktif: Factor A ({{ form.factorA }}) + Factor B ({{ form.factorB }}) = <strong>{{ form.subScoreC }}</strong> / 20
          </p>
        </div>
      </div>
      <div class="hidden sm:block text-right text-xs text-indigo-700 font-medium">
        Diakumulasikan di Stage 5
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
        <!-- 2. Factor A -->
        <div>
          <FormField
            label="Factor A: Threat Frequency Index (1 - 10)"
            required
            :error="errors?.factorA"
            hint="Estimasi frekuensi serangan atau pemicu ancaman"
          >
            <div class="flex items-center gap-4 mt-2">
              <input
                type="range"
                min="1"
                max="10"
                v-model.number="form.factorA"
                class="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <span class="w-10 text-center font-bold text-lg text-indigo-700 bg-white border border-slate-200 rounded-md py-1">
                {{ form.factorA }}
              </span>
            </div>
          </FormField>
        </div>

        <!-- 3. Factor B -->
        <div>
          <FormField
            label="Factor B: Vulnerability Exploitation Ease (1 - 10)"
            required
            :error="errors?.factorB"
            hint="Tingkat kemudahan celah dieksploitasi oleh pelaku ancaman"
          >
            <div class="flex items-center gap-4 mt-2">
              <input
                type="range"
                min="1"
                max="10"
                v-model.number="form.factorB"
                class="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <span class="w-10 text-center font-bold text-lg text-indigo-700 bg-white border border-slate-200 rounded-md py-1">
                {{ form.factorB }}
              </span>
            </div>
          </FormField>
        </div>
      </div>
    </div>
  </div>
</template>
