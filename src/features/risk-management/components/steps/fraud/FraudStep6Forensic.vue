<script setup lang="ts">
import { useRiskFormStore } from '../../../stores/useRiskFormStore';
import FormField from '../../../../../components/ui/FormField.vue';
import TextInput from '../../../../../components/ui/TextInput.vue';
import ScoreSelectInput from '../../../../../components/ui/ScoreSelectInput.vue';

defineProps<{
  errors?: Record<string, string>;
}>();

const store = useRiskFormStore();
const form = store.fraudData.forensic;
</script>

<template>
  <div class="space-y-6">
    <div class="border-b border-slate-200 pb-3">
      <div class="flex items-center gap-2 mb-1">
        <span class="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-rose-700 text-white">
          Fraud Escalated Protocol
        </span>
        <span class="text-xs font-semibold text-slate-500">Stage 6 of 8</span>
      </div>
      <h2 class="text-xl font-bold text-slate-900">Stage 6: Forensic Audit & Asset Tracing</h2>
      <p class="text-sm text-slate-500 mt-0.5">
        Protokol audit forensik mendalam untuk risiko eskalasi pidana (Gate Score: {{ store.fraudData.gate.gateScore }}). Tentukan pelacakan aset dan bobot G1 & G2 (4 fields).
      </p>
    </div>

    <!-- Sub-score G Card: G1 + G2 = G -->
    <div class="p-4 rounded-xl border border-rose-200/80 bg-rose-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
      <div class="flex items-center gap-3.5">
        <div class="w-14 h-14 rounded-xl bg-white border border-rose-200 flex flex-col items-center justify-center shadow-xs">
          <span class="text-[10px] text-rose-600 font-bold uppercase tracking-wider">Sub G</span>
          <span class="text-2xl font-black text-rose-700">{{ form.subScoreG }}</span>
        </div>
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <h4 class="font-bold text-slate-900 text-sm">Forensic Complexity & Recovery (G)</h4>
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
      <div class="text-xs text-rose-700/80 font-medium whitespace-nowrap bg-white/60 px-2.5 py-1 rounded-md border border-rose-200/50">
        Escalation Track 1/3
      </div>
    </div>

    <div class="space-y-5">
      <!-- 1. Asset Tracing Plan -->
      <div>
        <FormField label="Rencana Pelacakan Aliran Dana & Aset (Asset Tracing)" required :error="errors?.assetTracingPlan" hint="Min 5 karakter">
          <TextInput
            v-model="form.assetTracingPlan"
            placeholder="e.g. Tracing rekening penampung pihak ketiga & permintaan data mutasi bank melalui instansi resmi"
            :has-error="Boolean(errors?.assetTracingPlan)"
          />
        </FormField>
      </div>

      <!-- Factors G1 & G2 Calculation Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
        <!-- 2. Factor G1 (Combobox) -->
        <div>
          <ScoreSelectInput
            v-model="form.factorG1"
            label="Factor G1: Tingkat Kesulitan Bukti Forensik"
            hint="Kompleksitas pemulihan log digital dan pembuktian hukum"
            :has-error="Boolean(errors?.factorG1)"
            :error-message="errors?.factorG1"
          />
        </div>

        <!-- 3. Factor G2 (Combobox) -->
        <div>
          <ScoreSelectInput
            v-model="form.factorG2"
            label="Factor G2: Probabilitas Pemulihan Aset (Recovery)"
            hint="Tingkat kemungkinan aset kerugian dapat ditarik kembali"
            :has-error="Boolean(errors?.factorG2)"
            :error-message="errors?.factorG2"
          />
        </div>
      </div>

      <!-- 4. Chief Forensic Auditor Approval -->
      <div class="p-4 bg-white border rounded-xl shadow-xs" :class="errors?.chiefForensicAuditorApproved ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'">
        <label class="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            v-model="form.chiefForensicAuditorApproved"
            class="mt-1 w-4 h-4 rounded text-rose-600 border-slate-300 focus:ring-rose-500"
          />
          <div>
            <span class="text-sm font-semibold text-slate-900">
              Chief Forensic Auditor Formal Approval
            </span>
            <p class="text-xs text-slate-500 mt-0.5">
              Saya memvalidasi bahwa bukti digital telah disegel sesuai kaidah chain-of-custody dan audit forensik resmi telah dibuka.
            </p>
            <p v-if="errors?.chiefForensicAuditorApproved" class="text-xs text-rose-600 mt-1">
              {{ errors.chiefForensicAuditorApproved }}
            </p>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>
