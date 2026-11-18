<script setup lang="ts">
import { useRiskFormStore } from '../../../stores/useRiskFormStore';
import FormField from '../../../../../components/ui/FormField.vue';
import TextInput from '../../../../../components/ui/TextInput.vue';

defineProps<{
  errors?: Record<string, string>;
}>();

const store = useRiskFormStore();
const form = store.formData.deepMitigation;
</script>

<template>
  <div class="space-y-6">
    <div class="border-b border-rose-200 pb-3">
      <div class="flex items-center gap-2 mb-1">
        <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-600 text-white">
          Escalated Protocol
        </span>
        <span class="text-xs font-semibold text-rose-600">Stage 6 of 8</span>
      </div>
      <h2 class="text-xl font-bold text-slate-900">Stage 6: Deep Mitigation Action Plan</h2>
      <p class="text-sm text-slate-500 mt-0.5">
        Protokol mitigasi lanjutan untuk risiko eskalasi (Gate Score: {{ store.gateScore }}). Tentukan rencana aksi, bobot G1 & G2, dan persetujuan CRO (4 fields).
      </p>
    </div>

    <!-- Sub-score G Card: G1 + G2 = G -->
    <div class="p-4 rounded-xl border border-rose-200 bg-rose-50/70 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-white border border-rose-300 flex flex-col items-center justify-center shadow-sm">
          <span class="text-[10px] text-rose-500 font-bold uppercase tracking-wider">Sub G</span>
          <span class="text-xl font-black text-rose-700">{{ form.subScoreG }}</span>
        </div>
        <div>
          <h4 class="font-bold text-slate-800 text-sm">Deep Mitigation Cost & Complexity Index (G)</h4>
          <p class="text-xs text-slate-600">
            Formula Reaktif: Factor G1 ({{ form.factorG1 }}) + Factor G2 ({{ form.factorG2 }}) = <strong>{{ form.subScoreG }}</strong> / 20
          </p>
        </div>
      </div>
      <div class="text-right text-xs text-rose-700 font-semibold">
        Escalation Step 1/3
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
        <!-- 2. Factor G1 -->
        <div>
          <FormField label="Factor G1: Capital Expenditure & Budget Weight (1 - 10)" required :error="errors?.factorG1">
            <div class="flex items-center gap-4 mt-2">
              <input
                type="range"
                min="1"
                max="10"
                v-model.number="form.factorG1"
                class="w-full accent-rose-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <span class="w-10 text-center font-bold text-lg text-rose-700 bg-white border border-slate-200 rounded-md py-1">
                {{ form.factorG1 }}
              </span>
            </div>
          </FormField>
        </div>

        <!-- 3. Factor G2 -->
        <div>
          <FormField label="Factor G2: Engineering Implementation Complexity (1 - 10)" required :error="errors?.factorG2">
            <div class="flex items-center gap-4 mt-2">
              <input
                type="range"
                min="1"
                max="10"
                v-model.number="form.factorG2"
                class="w-full accent-rose-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <span class="w-10 text-center font-bold text-lg text-rose-700 bg-white border border-slate-200 rounded-md py-1">
                {{ form.factorG2 }}
              </span>
            </div>
          </FormField>
        </div>
      </div>

      <!-- 4. Chief Risk Officer Approval -->
      <div class="p-4 bg-white border rounded-xl" :class="errors?.chiefRiskOfficerApproved ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'">
        <label class="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            v-model="form.chiefRiskOfficerApproved"
            class="w-5 h-5 mt-0.5 rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
          />
          <div>
            <span class="text-sm font-bold text-slate-800">Chief Risk Officer (CRO) Formal Approval</span>
            <p class="text-xs text-slate-500 mt-0.5">
              Menyatakan rencana mitigasi mendalam telah ditinjau dan disetujui untuk dialokasikan anggaran khusus.
            </p>
            <p v-if="errors?.chiefRiskOfficerApproved" class="text-xs text-rose-600 mt-1 font-semibold">
              {{ errors.chiefRiskOfficerApproved }}
            </p>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>
