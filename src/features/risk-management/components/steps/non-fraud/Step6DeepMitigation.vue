<script setup lang="ts">
import { useRiskFormStore } from '../../../stores/useRiskFormStore';
import FormField from '../../../../../components/ui/FormField.vue';
import TextInput from '../../../../../components/ui/TextInput.vue';
import ScoreSelectInput from '../../../../../components/ui/ScoreSelectInput.vue';

defineProps<{
  errors?: Record<string, string>;
}>();

const store = useRiskFormStore();
const form = store.formData.deepMitigation;
</script>

<template>
  <div class="space-y-6">
    <div class="border-b border-slate-200 pb-3">
      <div class="flex items-center gap-2 mb-1">
        <span class="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-900 text-white">
          Escalated Protocol
        </span>
        <span class="text-xs font-semibold text-slate-500">Stage 6 of 8</span>
      </div>
      <h2 class="text-xl font-bold text-slate-900">Stage 6: Deep Mitigation Action Plan</h2>
      <p class="text-sm text-slate-500 mt-0.5">
        Protokol mitigasi lanjutan untuk risiko eskalasi (Gate Score: {{ store.gateScore }}). Tentukan rencana aksi, bobot G1 & G2, dan persetujuan CRO (4 fields).
      </p>
    </div>

    <!-- Sub-score G Card: G1 + G2 = G -->
    <div class="p-4 rounded-xl border border-indigo-200/80 bg-indigo-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
      <div class="flex items-center gap-3.5">
        <div class="w-14 h-14 rounded-xl bg-white border border-indigo-200 flex flex-col items-center justify-center shadow-xs">
          <span class="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Sub G</span>
          <span class="text-2xl font-black text-indigo-700">{{ form.subScoreG }}</span>
        </div>
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <h4 class="font-bold text-slate-900 text-sm">Deep Mitigation Cost & Complexity (G)</h4>
            <span
              v-if="store.benchmarkSubScoreG"
              class="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-md border"
              :class="store.benchmarkSubScoreG.badgeClass"
            >
              API Benchmark: {{ store.benchmarkSubScoreG.label }}
            </span>
          </div>
          <p class="text-xs text-slate-600 mt-1">
            Formula: Factor G1 ({{ form.factorG1 }}) + Factor G2 ({{ form.factorG2 }}) = <strong>{{ form.subScoreG }}</strong> / 20 &bull; {{ store.benchmarkSubScoreG?.description }}
          </p>
        </div>
      </div>
      <div class="text-xs text-indigo-700/80 font-medium whitespace-nowrap bg-white/60 px-2.5 py-1 rounded-md border border-indigo-200/50">
        Escalation Track 1/3
      </div>
    </div>

    <div class="space-y-5">
      <!-- 1. Escalated Action Plan -->
      <div>
        <FormField label="Escalated Action Plan Summary" required :error="errors?.escalatedActionPlan" hint="Min 5 karakter">
          <TextInput
            v-model="form.escalatedActionPlan"
            placeholder="e.g. Implement real-time multi-cloud mirroring & 24/7 Red-Team SOC monitoring"
            :has-error="Boolean(errors?.escalatedActionPlan)"
          />
        </FormField>
      </div>

      <!-- Factors G1 & G2 Calculation Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
        <!-- 2. Factor G1 (Combobox) -->
        <div>
          <ScoreSelectInput
            v-model="form.factorG1"
            label="Factor G1: Capital Expenditure Weight"
            hint="Bobot alokasi capex dan anggaran darurat"
            :has-error="Boolean(errors?.factorG1)"
            :error-message="errors?.factorG1"
          />
        </div>

        <!-- 3. Factor G2 (Combobox) -->
        <div>
          <ScoreSelectInput
            v-model="form.factorG2"
            label="Factor G2: Engineering Complexity"
            hint="Tingkat kompleksitas implementasi teknis & arsitektur"
            :has-error="Boolean(errors?.factorG2)"
            :error-message="errors?.factorG2"
          />
        </div>
      </div>

      <!-- 4. Chief Risk Officer Approval -->
      <div class="p-4 bg-white border rounded-xl shadow-xs" :class="errors?.chiefRiskOfficerApproved ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'">
        <label class="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            v-model="form.chiefRiskOfficerApproved"
            class="mt-1 w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
          />
          <div>
            <span class="text-sm font-semibold text-slate-900">
              Chief Risk Officer (CRO) Formal Approval
            </span>
            <p class="text-xs text-slate-500 mt-0.5">
              Saya menyatakan telah memvalidasi estimasi anggaran mitigasi dan kompleksitas arsitektur di atas.
            </p>
            <p v-if="errors?.chiefRiskOfficerApproved" class="text-xs text-rose-600 mt-1">
              {{ errors.chiefRiskOfficerApproved }}
            </p>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>
