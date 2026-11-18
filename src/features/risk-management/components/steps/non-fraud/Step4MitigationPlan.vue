<script setup lang="ts">
import { useRiskFormStore } from '../../../stores/useRiskFormStore';
import { useMasterData } from '../../../composables/useMasterData';
import FormField from '../../../../../components/ui/FormField.vue';
import TextInput from '../../../../../components/ui/TextInput.vue';
import SelectInput from '../../../../../components/ui/SelectInput.vue';
import type { TreatmentStrategy } from '../../../types/risk.types';

defineProps<{
  errors?: Record<string, string>;
}>();

const store = useRiskFormStore();
const form = store.formData.mitigation;
const { treatmentStrategies, isLoading } = useMasterData();
</script>

<template>
  <div class="space-y-6">
    <div class="border-b border-slate-200 pb-3">
      <h2 class="text-xl font-bold text-slate-900">Stage 4: Mitigation Strategy & Action Plan</h2>
      <p class="text-sm text-slate-500 mt-0.5">
        Tentukan rencana aksi perbaikan, strategi penanganan risiko, dan alokasi anggaran (3 fields).
      </p>
    </div>

    <div class="space-y-5">
      <!-- 1. Action Plan Title -->
      <div>
        <FormField label="Mitigation Action Plan Title" required :error="errors?.actionPlanTitle" hint="Min 5 karakter">
          <TextInput
            v-model="form.actionPlanTitle"
            placeholder="e.g. Deploy Zero-Trust Network Architecture & Multi-AZ Auto-Failover"
            :has-error="Boolean(errors?.actionPlanTitle)"
          />
        </FormField>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <!-- 2. Treatment Strategy (from API) -->
        <div>
          <FormField label="Treatment Strategy (Master Data API)" required :error="errors?.treatmentStrategy">
            <SelectInput
              :model-value="form.treatmentStrategy"
              @update:model-value="form.treatmentStrategy = $event as TreatmentStrategy"
              :options="treatmentStrategies"
              :placeholder="isLoading ? 'Memuat strategi...' : 'Pilih Strategi Mitigasi'"
              :disabled="isLoading"
              :has-error="Boolean(errors?.treatmentStrategy)"
            />
          </FormField>
        </div>

        <!-- 3. Allocated Budget -->
        <div>
          <FormField label="Allocated Budget (USD)" required :error="errors?.allocatedBudget" hint="Estimasi biaya implementasi">
            <TextInput
              type="number"
              v-model.number="form.allocatedBudget"
              placeholder="e.g. 50000"
              :has-error="Boolean(errors?.allocatedBudget)"
            />
          </FormField>
        </div>
      </div>
    </div>
  </div>
</template>
