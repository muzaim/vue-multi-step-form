<script setup lang="ts">
import { useRiskFormStore } from '../../../stores/useRiskFormStore';
import { useMasterData } from '../../../composables/useMasterData';
import FormField from '../../../../../components/ui/FormField.vue';
import SelectInput from '../../../../../components/ui/SelectInput.vue';

defineProps<{
  errors?: Record<string, string>;
}>();

const store = useRiskFormStore();
const form = store.formData.boardOversight;
const { boardCommittees, isLoading } = useMasterData();
</script>

<template>
  <div class="space-y-6">
    <div class="border-b border-rose-200 pb-3">
      <div class="flex items-center gap-2 mb-1">
        <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-600 text-white">
          Escalated Protocol
        </span>
        <span class="text-xs font-semibold text-rose-600">Stage 7 of 8</span>
      </div>
      <h2 class="text-xl font-bold text-slate-900">Stage 7: Board Oversight & Governance</h2>
      <p class="text-sm text-slate-500 mt-0.5">
        Keterlibatan komite dewan dan kalkulasi parameter pengawasan tata kelola H1 & H2 (3 fields).
      </p>
    </div>

    <!-- Sub-score H Card: H1 + H2 = H -->
    <div class="p-4 rounded-xl border border-rose-200 bg-rose-50/70 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-white border border-rose-300 flex flex-col items-center justify-center shadow-sm">
          <span class="text-[10px] text-rose-500 font-bold uppercase tracking-wider">Sub H</span>
          <span class="text-xl font-black text-rose-700">{{ form.subScoreH }}</span>
        </div>
        <div>
          <h4 class="font-bold text-slate-800 text-sm">Board Governance & Audit Scrutiny Index (H)</h4>
          <p class="text-xs text-slate-600">
            Formula Reaktif: Factor H1 ({{ form.factorH1 }}) + Factor H2 ({{ form.factorH2 }}) = <strong>{{ form.subScoreH }}</strong> / 20
          </p>
        </div>
      </div>
      <div class="text-right text-xs text-rose-700 font-semibold">
        Escalation Step 2/3
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
        <!-- 2. Factor H1 -->
        <div>
          <FormField label="Factor H1: Board Oversight & Committee Scrutiny (1 - 10)" required :error="errors?.factorH1">
            <div class="flex items-center gap-4 mt-2">
              <input
                type="range"
                min="1"
                max="10"
                v-model.number="form.factorH1"
                class="w-full accent-rose-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <span class="w-10 text-center font-bold text-lg text-rose-700 bg-white border border-slate-200 rounded-md py-1">
                {{ form.factorH1 }}
              </span>
            </div>
          </FormField>
        </div>

        <!-- 3. Factor H2 -->
        <div>
          <FormField label="Factor H2: Regulatory Reporting & External Audit Rigor (1 - 10)" required :error="errors?.factorH2">
            <div class="flex items-center gap-4 mt-2">
              <input
                type="range"
                min="1"
                max="10"
                v-model.number="form.factorH2"
                class="w-full accent-rose-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <span class="w-10 text-center font-bold text-lg text-rose-700 bg-white border border-slate-200 rounded-md py-1">
                {{ form.factorH2 }}
              </span>
            </div>
          </FormField>
        </div>
      </div>
    </div>
  </div>
</template>
