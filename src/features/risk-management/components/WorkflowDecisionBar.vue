<script setup lang="ts">
import { ref } from 'vue';
import { useWorkflowStore } from '../stores/useWorkflowStore.ts';

const store = useWorkflowStore();
const reviewNotes = ref('');
const isSubmittingAction = ref(false);

function handleApprove() {
  isSubmittingAction.value = true;
  try {
    store.approveCurrentStage(reviewNotes.value);
    reviewNotes.value = '';
  } finally {
    isSubmittingAction.value = false;
  }
}

function handleReject() {
  if (!reviewNotes.value.trim()) {
    alert('Harap masukkan catatan perbaikan sebelum meminta revisi.');
    return;
  }
  isSubmittingAction.value = true;
  try {
    store.requestRevision(reviewNotes.value);
    reviewNotes.value = '';
  } finally {
    isSubmittingAction.value = false;
  }
}

function switchToAssignedApprover() {
  if (store.currentAssignedRole) {
    store.activePersonaId = store.currentAssignedRole;
  }
}
</script>

<template>
  <div v-if="store.workflowStatus !== 'DRAFT'" class="mt-4">
    <!-- Active Reviewer Action Box -->
    <div
      v-if="store.isCurrentReviewer"
      class="p-4 bg-slate-900 text-white rounded-xl shadow-md border border-slate-800 space-y-3"
    >
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
          <span class="text-xs font-bold uppercase tracking-wider text-amber-300">
            Giliran Anda Mengambil Keputusan Evaluasi
          </span>
        </div>
        <div class="text-xs text-slate-400">
          Role: <strong class="text-white">{{ store.activePersona.roleTitle }}</strong>
        </div>
      </div>

      <div class="space-y-1.5">
        <label class="block text-xs font-medium text-slate-300">
          Catatan Review & Instruksi (Wajib jika meminta revisi):
        </label>
        <input
          type="text"
          v-model="reviewNotes"
          placeholder="e.g. Disetujui sesuai mitigasi risiko unit / Harap perjelas estimasi dampak di Stage 3"
          class="w-full px-3 py-2 text-xs text-slate-900 bg-white rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>

      <div class="flex items-center justify-end gap-2.5 pt-1">
        <button
          type="button"
          @click="handleReject"
          :disabled="isSubmittingAction"
          class="px-3.5 py-2 text-xs font-semibold text-rose-300 bg-rose-950/80 hover:bg-rose-900 border border-rose-800/80 rounded-lg transition disabled:opacity-50"
        >
          Kembalikan untuk Revisi
        </button>

        <button
          type="button"
          @click="handleApprove"
          :disabled="isSubmittingAction"
          class="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition shadow-sm disabled:opacity-50"
        >
          Setujui & Teruskan Dokumen
        </button>
      </div>
    </div>

    <!-- Read-Only Observer Notification Bar -->
    <div
      v-else-if="store.workflowStatus !== 'APPROVED_FINAL'"
      class="p-3.5 bg-slate-100 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-700"
    >
      <div class="flex items-center gap-2.5">
        <svg class="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <div>
          <span>Dokumen ini terkunci dalam status: <strong>{{ store.statusLabel.label }}</strong>.</span>
          <span class="block text-slate-500 text-[11px] mt-0.5">
            Anda sedang melihat sebagai <strong>{{ store.activePersona.name }}</strong> (Hanya Baca).
          </span>
        </div>
      </div>

      <button
        v-if="store.currentAssignedRole"
        type="button"
        @click="switchToAssignedApprover"
        class="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition whitespace-nowrap shadow-2xs"
      >
        Beralih ke Approver Bertugas &rarr;
      </button>
    </div>
  </div>
</template>
