<script setup lang="ts">
import { useRiskFormStore } from '../../../stores/useRiskFormStore';
import { useMasterData } from '../../../composables/useMasterData';
import FormField from '../../../../../components/ui/FormField.vue';
import TextInput from '../../../../../components/ui/TextInput.vue';
import SelectInput from '../../../../../components/ui/SelectInput.vue';

defineProps<{
  errors?: Record<string, string>;
}>();

const store = useRiskFormStore();
const form = store.fraudData.containment;
const { digitalEvidenceStatuses, isLoading } = useMasterData();
</script>

<template>
  <div class="space-y-6">
    <div class="border-b border-slate-200 pb-3">
      <div class="flex items-center gap-2 mb-1">
        <span class="px-2 py-0.5 rounded text-xs font-semibold bg-rose-700 text-white">
          Fraud Track
        </span>
        <span class="text-xs font-semibold text-slate-500">Stage 4 of 5/8</span>
      </div>
      <h2 class="text-xl font-bold text-slate-900">Stage 4: Immediate Containment & Evidence Securing</h2>
      <p class="text-sm text-slate-500 mt-0.5">
        Langkah penghentian kebocoran dana seketika, pengamanan bukti forensik digital, dan alokasi anggaran investigasi (3 fields).
      </p>
    </div>

    <div class="space-y-4">
      <!-- 1. Immediate Containment Action -->
      <div>
        <FormField label="Tindakan Pengamanan / Penahanan Aset Seketika" required :error="errors?.immediateContainmentAction" hint="Min 5 karakter">
          <TextInput
            v-model="form.immediateContainmentAction"
            placeholder="e.g. Pembekuan rekening escrow vendor X & pencabutan hak akses sistem ERP seluruh terlapor"
            :has-error="Boolean(errors?.immediateContainmentAction)"
          />
        </FormField>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 2. Digital Evidence Status (from API) -->
        <div>
          <FormField label="Status Bukti Digital & Forensik (Master Data API)" required :error="errors?.digitalEvidenceStatus">
            <SelectInput
              :model-value="form.digitalEvidenceStatus"
              @update:model-value="form.digitalEvidenceStatus = $event as string"
              :options="digitalEvidenceStatuses"
              :placeholder="isLoading ? 'Memuat status bukti...' : 'Pilih Status Pengamanan Bukti'"
              :disabled="isLoading"
              :has-error="Boolean(errors?.digitalEvidenceStatus)"
            />
          </FormField>
        </div>

        <!-- 3. Allocated Forensic Budget -->
        <div>
          <FormField label="Alokasi Biaya Investigasi Forensik (IDR)" required :error="errors?.allocatedForensicBudget" hint="Honorarium audit forensik independen">
            <TextInput
              type="number"
              v-model.number="form.allocatedForensicBudget"
              placeholder="e.g. 75000000"
              :has-error="Boolean(errors?.allocatedForensicBudget)"
            />
          </FormField>
        </div>
      </div>
    </div>
  </div>
</template>
