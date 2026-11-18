<script setup lang="ts">
import { useWorkflowStore } from '../stores/useWorkflowStore.ts';

defineProps<{
  currentStep: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  isSavingDraft: boolean;
  isSubmitting: boolean;
  isEscalated?: boolean;
  draftId?: string | null;
  lastSavedAt?: string | null;
  submitError?: string | null;
}>();

defineEmits<{
  (e: 'prev'): void;
  (e: 'next'): void;
  (e: 'save-draft'): void;
  (e: 'submit'): void;
}>();

const workflowStore = useWorkflowStore();
</script>

<template>
  <div class="bg-slate-50 border-t border-slate-200 px-6 py-3.5">
    <!-- Feedback info row -->
    <div v-if="draftId || submitError" class="mb-3 flex items-center justify-between text-xs">
      <div v-if="draftId" class="text-emerald-700 flex items-center gap-1.5 font-medium">
        Draft saved: <span class="font-mono font-bold">{{ draftId }}</span>
      </div>
      <div v-if="submitError" class="text-rose-600 font-semibold flex items-center gap-1.5">
        {{ submitError }}
      </div>
    </div>

    <!-- Actions row -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
      <!-- Save Draft Button (Only available when form is editable) -->
      <button
        v-if="workflowStore.isFieldEditable"
        type="button"
        @click="$emit('save-draft')"
        :disabled="isSavingDraft || isSubmitting"
        class="w-full sm:w-auto px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition disabled:opacity-50"
      >
        {{ isSavingDraft ? 'Menyimpan...' : 'Simpan Draft' }}
      </button>
      <div v-else class="text-xs text-slate-400 font-medium">
        Mode Review: Navigasi bebas antar tahap
      </div>

      <!-- Stepper Controls -->
      <div class="w-full sm:w-auto flex items-center gap-2">
        <button
          v-if="!isFirstStep"
          type="button"
          @click="$emit('prev')"
          :disabled="isSubmitting"
          class="flex-1 sm:flex-initial px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition disabled:opacity-50"
        >
          Kembali
        </button>

        <!-- If NOT last step, show Next button -->
        <button
          v-if="!isLastStep"
          type="button"
          @click="$emit('next')"
          class="flex-1 sm:flex-initial px-5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition cursor-pointer"
        >
          {{ currentStep === 5 && isEscalated ? 'Lanjut ke Tahap Eskalasi (Stage 6)' : (currentStep === (isEscalated ? 8 : 5) ? 'Lanjut ke Lembar Approval' : 'Tahap Selanjutnya') }}
        </button>

        <!-- If LAST step & maker in Draft/Revision: show Submit button -->
        <button
          v-else-if="workflowStore.isFieldEditable && (workflowStore.workflowStatus === 'DRAFT' || workflowStore.workflowStatus === 'REJECTED_REVISION')"
          type="button"
          @click="$emit('submit')"
          :disabled="isSubmitting"
          class="flex-1 sm:flex-initial px-5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded transition disabled:opacity-50 cursor-pointer"
        >
          {{ isSubmitting ? 'Mengirim...' : 'Ajukan Asesmen ke Approval' }}
        </button>
      </div>
    </div>
  </div>
</template>
