<script setup lang="ts">
import { useRiskFormStore } from '../../../stores/useRiskFormStore';
import { useMasterData } from '../../../composables/useMasterData';
import FormField from '../../../../../components/ui/FormField.vue';
import SelectInput from '../../../../../components/ui/SelectInput.vue';
import ScoreSelectInput from '../../../../../components/ui/ScoreSelectInput.vue';

defineProps<{
  errors?: Record<string, string>;
}>();

const store = useRiskFormStore();
const form = store.formData.boardOversight;
const { boardCommittees, isLoading } = useMasterData();
</script>

<template>
  <div class="space-y-6">
    <div class="border-b border-slate-200 pb-3">
      <div class="flex items-center gap-2 mb-1">
        <span class="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-900 text-white">
          Escalated Protocol
        </span>
        <span class="text-xs font-semibold text-slate-500">Stage 7 of 8</span>
      </div>
      <h2 class="text-xl font-bold text-slate-900">Stage 7: Board Oversight & Governance</h2>
      <p class="text-sm text-slate-500 mt-0.5">
        Keterlibatan komite dewan dan kalkulasi parameter pengawasan tata kelola H1 & H2 (3 fields).
      </p>
    </div>

    <!-- Sub-score H Card: H1 + H2 = H -->
    <div class="p-4 rounded-xl border border-indigo-200/80 bg-indigo-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
      <div class="flex items-center gap-3.5">
        <div class="w-14 h-14 rounded-xl bg-white border border-indigo-200 flex flex-col items-center justify-center shadow-xs">
          <span class="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Sub H</span>
          <span class="text-2xl font-black text-indigo-700">{{ form.subScoreH }}</span>
        </div>
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <h4 class="font-bold text-slate-900 text-sm">Board Governance Index (H)</h4>
            <span
              v-if="store.benchmarkSubScoreH"
              class="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-md border"
              :class="store.benchmarkSubScoreH.badgeClass"
            >
              API Benchmark: {{ store.benchmarkSubScoreH.label }}
            </span>
          </div>
          <p class="text-xs text-slate-600 mt-1">
            Formula: Factor H1 ({{ form.factorH1 }}) + Factor H2 ({{ form.factorH2 }}) = <strong>{{ form.subScoreH }}</strong> / 20 &bull; {{ store.benchmarkSubScoreH?.description }}
          </p>
        </div>
      </div>
      <div class="text-xs text-indigo-700/80 font-medium whitespace-nowrap bg-white/60 px-2.5 py-1 rounded-md border border-indigo-200/50">
        Escalation Track 2/3
      </div>
    </div>

    <div class="space-y-5">
      <!-- 1. Board Committee Name (from API) -->
      <div>
        <FormField label="Board Committee Responsible (Master Data API)" required :error="errors?.boardCommitteeName">
          <SelectInput
            :model-value="form.boardCommitteeName"
            @update:model-value="form.boardCommitteeName = $event as string"
            :options="boardCommittees"
            :placeholder="isLoading ? 'Memuat komite dewan...' : 'Pilih Komite Dewan Pengawas'"
            :disabled="isLoading"
            :has-error="Boolean(errors?.boardCommitteeName)"
          />
        </FormField>
      </div>

      <!-- Factors H1 & H2 Calculation Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
        <!-- 2. Factor H1 (Combobox) -->
        <div>
          <ScoreSelectInput
            v-model="form.factorH1"
            label="Factor H1: Board Oversight Scrutiny"
            hint="Tingkat ketelitian dan kedalaman pengawasan komite"
            :has-error="Boolean(errors?.factorH1)"
            :error-message="errors?.factorH1"
          />
        </div>

        <!-- 3. Factor H2 (Combobox) -->
        <div>
          <ScoreSelectInput
            v-model="form.factorH2"
            label="Factor H2: External Audit Rigor"
            hint="Kedalaman audit kepatuhan dan pelaporan eksternal"
            :has-error="Boolean(errors?.factorH2)"
            :error-message="errors?.factorH2"
          />
        </div>
      </div>
    </div>
  </div>
</template>
