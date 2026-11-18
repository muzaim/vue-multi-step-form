<script setup lang="ts">
import { useRiskFormStore } from '../../../stores/useRiskFormStore';
import FormField from '../../../../../components/ui/FormField.vue';
import TextInput from '../../../../../components/ui/TextInput.vue';

defineProps<{
  errors?: Record<string, string>;
}>();

const store = useRiskFormStore();
const form = store.formData.executiveSignOff;
const fullData = store.formData;
</script>

<template>
  <div class="space-y-6">
    <div class="border-b border-rose-200 pb-3">
      <div class="flex items-center gap-2 mb-1">
        <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-600 text-white">
          Final Escalated Stage
        </span>
        <span class="text-xs font-semibold text-rose-600">Stage 8 of 8</span>
      </div>
      <h2 class="text-xl font-bold text-slate-900">Stage 8: Executive Authorization & Grand Cumulative Index</h2>
      <p class="text-sm text-slate-500 mt-0.5">
        Rekapitulasi akhir seluruh kalkulasi sub-skor (C + F + G + H) dan otorisasi formal Direksi & Dewan Komisaris (2 fields).
      </p>
    </div>

    <!-- Grand Cumulative Risk Index Banner -->
    <div class="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-rose-950 text-white shadow-md">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-5">
          <div class="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex flex-col items-center justify-center">
            <span class="text-[10px] font-bold text-rose-300 uppercase tracking-wider">Grand Total</span>
            <span class="text-3xl font-black text-white">{{ store.grandTotalScore }}</span>
          </div>
          <div>
            <h3 class="text-lg font-extrabold text-white">Enterprise Cumulative Risk Index</h3>
            <p class="text-xs text-slate-300 mt-1">
              Sub C ({{ fullData.identification.subScoreC }}) + Sub F ({{ fullData.analysis.subScoreF }}) + Sub G ({{ fullData.deepMitigation.subScoreG }}) + Sub H ({{ fullData.boardOversight.subScoreH }}) = <strong class="text-rose-400 font-mono text-sm">{{ store.grandTotalScore }} Poin</strong>
            </p>
          </div>
        </div>

        <div class="flex flex-wrap gap-2 text-xs">
          <span class="px-2.5 py-1 bg-white/10 rounded-lg border border-white/10">Stage 2 (C): {{ fullData.identification.subScoreC }}</span>
          <span class="px-2.5 py-1 bg-white/10 rounded-lg border border-white/10">Stage 3 (F): {{ fullData.analysis.subScoreF }}</span>
          <span class="px-2.5 py-1 bg-white/10 rounded-lg border border-white/10">Stage 6 (G): {{ fullData.deepMitigation.subScoreG }}</span>
          <span class="px-2.5 py-1 bg-white/10 rounded-lg border border-white/10">Stage 7 (H): {{ fullData.boardOversight.subScoreH }}</span>
        </div>
      </div>
    </div>

    <!-- Formal Executive Sign-Off Fields (2 fields) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-white rounded-xl border border-slate-200">
      <!-- 1. Board Resolution Number -->
      <div>
        <FormField label="Board Resolution / Decree Number" required :error="errors?.boardResolutionNumber" hint="Min 3 karakter">
          <TextInput
            v-model="form.boardResolutionNumber"
            placeholder="e.g. SK-DEKOM-2026/XI/089"
            :has-error="Boolean(errors?.boardResolutionNumber)"
          />
        </FormField>
      </div>

      <!-- 2. CEO Sign-Off -->
      <div>
        <FormField label="President Director / CEO Sign-off Name" required :error="errors?.ceoSignOff" hint="Pejabat penandatangan pengesahan">
          <TextInput
            v-model="form.ceoSignOff"
            placeholder="e.g. Raden Arya (Chief Executive Officer)"
            :has-error="Boolean(errors?.ceoSignOff)"
          />
        </FormField>
      </div>
    </div>
  </div>
</template>
