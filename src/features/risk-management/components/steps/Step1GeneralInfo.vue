<script setup lang="ts">
import { useRiskFormStore } from '../../stores/useRiskFormStore';
import { useWorkflowStore } from '../../stores/useWorkflowStore.ts';
import { useMasterData } from '../../composables/useMasterData';
import FormField from '../../../../components/ui/FormField.vue';
import TextInput from '../../../../components/ui/TextInput.vue';
import SelectInput from '../../../../components/ui/SelectInput.vue';
import type { RiskCategory } from '../../types/risk.types';
import type { AssessmentType } from '../../types/fraud.types';

defineProps<{
  errors?: Record<string, string>;
}>();

const store = useRiskFormStore();
const workflowStore = useWorkflowStore();
const { riskCategories, departments, isLoading } = useMasterData();

function selectTrack(type: AssessmentType) {
  if (!workflowStore.isFieldEditable) return;
  store.assessmentType = type;
}
</script>

<template>
  <div class="space-y-6">
    <div class="border-b border-slate-200 pb-3">
      <h2 class="text-xl font-bold text-slate-900">Stage 1: Assessment Intake & Classification</h2>
      <p class="text-sm text-slate-500 mt-0.5">
        Definisikan jenis tata kelola risiko, judul inisiatif, kategori, dan departemen penanggung jawab (4 fields).
      </p>
    </div>

    <!-- 1. Dual-Track Selection Cards -->
    <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
      <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider">
        Pilih Jalur Tata Kelola Risiko (Assessment Track)
      </label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <!-- Option 1: Non-Fraud -->
        <button
          type="button"
          :disabled="!workflowStore.isFieldEditable"
          @click="selectTrack('non_fraud')"
          class="p-4 rounded-xl border text-left transition flex items-start gap-3.5 disabled:opacity-75 disabled:cursor-not-allowed"
          :class="[
            store.assessmentType === 'non_fraud'
              ? 'border-indigo-600 bg-white ring-2 ring-indigo-500/20 shadow-sm'
              : 'border-slate-200 bg-white hover:border-slate-300'
          ]"
        >
          <div
            class="w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0"
            :class="store.assessmentType === 'non_fraud' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'"
          >
            <div v-if="store.assessmentType === 'non_fraud'" class="w-2 h-2 rounded-full bg-white"></div>
          </div>
          <div>
            <div class="font-bold text-sm text-slate-900">Non-Fraud Risk Assessment</div>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">
              Risiko operasional, infrastruktur TI, kegagalan SLA vendor, dan kepatuhan umum.
            </p>
          </div>
        </button>

        <!-- Option 2: Fraud -->
        <button
          type="button"
          :disabled="!workflowStore.isFieldEditable"
          @click="selectTrack('fraud')"
          class="p-4 rounded-xl border text-left transition flex items-start gap-3.5 disabled:opacity-75 disabled:cursor-not-allowed"
          :class="[
            store.assessmentType === 'fraud'
              ? 'border-rose-600 bg-white ring-2 ring-rose-500/20 shadow-sm'
              : 'border-slate-200 bg-white hover:border-slate-300'
          ]"
        >
          <div
            class="w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0"
            :class="store.assessmentType === 'fraud' ? 'border-rose-600 bg-rose-600' : 'border-slate-300'"
          >
            <div v-if="store.assessmentType === 'fraud'" class="w-2 h-2 rounded-full bg-white"></div>
          </div>
          <div>
            <div class="font-bold text-sm text-slate-900">Fraud & Financial Crime</div>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">
              Indikasi kecurangan internal, penggelapan dana, audit forensik, dan eskalasi pidana.
            </p>
          </div>
        </button>
      </div>
    </div>

    <!-- Info message for async master data -->
    <div v-if="isLoading" class="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-center gap-2">
      <svg class="w-3.5 h-3.5 animate-spin text-slate-600" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      <span>Mengambil master data kategori & departemen dari server API...</span>
    </div>

    <!-- Unified Form Fields -->
    <div class="space-y-4">
      <!-- 2. Risk Title -->
      <div>
        <FormField
          :label="store.assessmentType === 'fraud' ? 'Judul Kasus / Indikasi Dugaan Fraud' : 'Initiative / Risk Title'"
          required
          :error="errors?.riskTitle"
          hint="Minimal 5 karakter"
        >
          <TextInput
            :model-value="store.formData.general.riskTitle"
            @update:model-value="store.formData.general.riskTitle = $event"
            :placeholder="store.assessmentType === 'fraud' ? 'e.g. Dugaan Penggelembungan Pengadaan Hardware IT' : 'e.g. Core Database Replication Latency Across Availability Zones'"
            :has-error="Boolean(errors?.riskTitle)"
          />
        </FormField>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 3. Risk Category (from API) -->
        <div>
          <FormField label="Kategori Risiko Utama (Master Data API)" required :error="errors?.riskCategory">
            <SelectInput
              :model-value="store.formData.general.riskCategory"
              @update:model-value="store.formData.general.riskCategory = $event as RiskCategory"
              :options="riskCategories"
              :placeholder="isLoading ? 'Memuat kategori...' : 'Pilih Kategori Risiko'"
              :disabled="isLoading"
              :has-error="Boolean(errors?.riskCategory)"
            />
          </FormField>
        </div>

        <!-- 4. Department (from API) -->
        <div>
          <FormField label="Departemen Penanggung Jawab (Master Data API)" required :error="errors?.department">
            <SelectInput
              :model-value="store.formData.general.department"
              @update:model-value="store.formData.general.department = $event as string"
              :options="departments"
              :placeholder="isLoading ? 'Memuat departemen...' : 'Pilih Departemen'"
              :disabled="isLoading"
              :has-error="Boolean(errors?.department)"
            />
          </FormField>
        </div>
      </div>
    </div>
  </div>
</template>
