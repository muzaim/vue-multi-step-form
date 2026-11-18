<script setup lang="ts">
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
</script>

<template>
  <div class="bg-slate-50 border-t border-slate-200 px-6 py-4">
    <!-- Feedback info row -->
    <div v-if="draftId || submitError" class="mb-3 flex items-center justify-between text-xs">
      <div v-if="draftId" class="text-emerald-700 flex items-center gap-1.5 font-medium">
        <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        Draft saved: <span class="font-mono font-bold">{{ draftId }}</span>
      </div>
      <div v-if="submitError" class="text-rose-600 font-semibold flex items-center gap-1.5">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        {{ submitError }}
      </div>
    </div>

    <!-- Actions row -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
      <!-- Save Draft Button -->
      <button
        type="button"
        @click="$emit('save-draft')"
        :disabled="isSavingDraft || isSubmitting"
        class="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 hover:text-slate-900 transition flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <svg v-if="isSavingDraft" class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <svg v-else class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
        {{ isSavingDraft ? 'Saving Draft...' : 'Save Draft' }}
      </button>

      <!-- Stepper Controls -->
      <div class="w-full sm:w-auto flex items-center gap-3">
        <button
          v-if="!isFirstStep"
          type="button"
          @click="$emit('prev')"
          :disabled="isSubmitting"
          class="flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        <!-- If NOT last step, show Next button -->
        <button
          v-if="!isLastStep"
          type="button"
          @click="$emit('next')"
          class="flex-1 sm:flex-initial px-5 py-2 text-xs font-bold text-white rounded-lg shadow transition flex items-center justify-center gap-1.5"
          :class="currentStep === 5 && isEscalated ? 'bg-rose-600 hover:bg-rose-700' : 'bg-indigo-600 hover:bg-indigo-700'"
        >
          <span>
            {{ currentStep === 5 && isEscalated ? 'Proceed to Escalation (Stage 6)' : 'Next Stage' }}
          </span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- If LAST step (either step 5 when not escalated OR step 8 when escalated) -->
        <button
          v-else
          type="button"
          @click="$emit('submit')"
          :disabled="isSubmitting"
          class="flex-1 sm:flex-initial px-6 py-2 text-xs font-bold text-white rounded-lg shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
          :class="isEscalated ? 'bg-rose-700 hover:bg-rose-800' : 'bg-emerald-600 hover:bg-emerald-700'"
        >
          <svg v-if="isSubmitting" class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          {{
            isSubmitting
              ? 'Submitting Assessment...'
              : isEscalated
              ? 'Submit Escalated Assessment (Stage 8 Final)'
              : 'Submit Standard Assessment (Stage 5 Final)'
          }}
        </button>
      </div>
    </div>
  </div>
</template>
