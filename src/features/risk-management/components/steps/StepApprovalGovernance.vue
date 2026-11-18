<script setup lang="ts">
import { ref } from 'vue';
import { useRiskFormStore } from '../../stores/useRiskFormStore.ts';
import { useWorkflowStore } from '../../stores/useWorkflowStore.ts';

const riskStore = useRiskFormStore();
const workflowStore = useWorkflowStore();

const reviewNotes = ref('');
const isSubmittingAction = ref(false);
const actionError = ref('');

function handleApprove() {
  actionError.value = '';
  isSubmittingAction.value = true;
  try {
    workflowStore.approveCurrentStage(reviewNotes.value);
    reviewNotes.value = '';
  } catch (err: any) {
    actionError.value = err?.message || 'Gagal memproses persetujuan.';
  } finally {
    isSubmittingAction.value = false;
  }
}

function handleRequestRevision() {
  if (!reviewNotes.value.trim()) {
    actionError.value = 'Wajib mengisi catatan perbaikan saat mengembalikan dokumen untuk revisi.';
    return;
  }
  actionError.value = '';
  isSubmittingAction.value = true;
  try {
    workflowStore.requestRevision(reviewNotes.value);
    reviewNotes.value = '';
  } catch (err: any) {
    actionError.value = err?.message || 'Gagal meminta revisi.';
  } finally {
    isSubmittingAction.value = false;
  }
}

function handleRejectFinal() {
  if (!reviewNotes.value.trim()) {
    actionError.value = 'Wajib mengisi alasan penolakan saat menolak dokumen secara permanen.';
    return;
  }
  if (!confirm('Apakah Anda yakin ingin MENOLAK permanen dokumen asesmen ini? Status tidak dapat diubah kembali.')) {
    return;
  }
  actionError.value = '';
  isSubmittingAction.value = true;
  try {
    workflowStore.rejectFinalAssessment(reviewNotes.value);
    reviewNotes.value = '';
  } catch (err: any) {
    actionError.value = err?.message || 'Gagal menolak dokumen.';
  } finally {
    isSubmittingAction.value = false;
  }
}

function switchToAssignedApprover() {
  if (workflowStore.currentAssignedRole) {
    workflowStore.activePersonaId = workflowStore.currentAssignedRole;
  }
}

async function handleMakerSubmit() {
  actionError.value = '';
  isSubmittingAction.value = true;
  try {
    await riskStore.submitAssessment();
    workflowStore.submitInitialAssessment();
  } catch (err: any) {
    actionError.value = err?.message || 'Gagal mengajukan formulir.';
  } finally {
    isSubmittingAction.value = false;
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header Stage -->
    <div class="border-b border-slate-200 pb-3">
      <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
        <span>Lembar Evaluasi & Persetujuan Governance</span>
        <span
          class="text-xs px-2 py-0.5 rounded-full font-semibold border"
          :class="
            workflowStore.workflowStatus === 'APPROVED_FINAL'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : workflowStore.workflowStatus === 'REJECTED_FINAL'
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : workflowStore.workflowStatus === 'REJECTED_REVISION'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-sky-50 text-sky-700 border-sky-200'
          "
        >
          {{ workflowStore.statusLabel.label }}
        </span>
      </h2>
      <p class="text-xs text-slate-500 mt-0.5">
        Tahap akhir peninjauan tata kelola risiko, riwayat evaluasi berjenjang, dan pengambilan keputusan otorisasi.
      </p>
    </div>

    <!-- Executive Summary Card -->
    <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
      <div>
        <span class="text-slate-400 block text-[11px]">Judul Asesmen:</span>
        <strong class="text-slate-800 font-semibold truncate block">
          {{ riskStore.formData.general.riskTitle || riskStore.fraudData.modus.modusSummary || 'Belum diisi' }}
        </strong>
      </div>

      <div>
        <span class="text-slate-400 block text-[11px]">Track / Departemen:</span>
        <strong class="text-slate-800 font-semibold block">
          {{ riskStore.assessmentType === 'fraud' ? 'Fraud & FinCrime' : 'Non-Fraud Risk' }}
          <span class="text-slate-400 font-normal">({{ riskStore.formData.general.department || 'N/A' }})</span>
        </strong>
      </div>

      <div>
        <span class="text-slate-400 block text-[11px]">Skor Gate & Grand Total:</span>
        <strong class="text-slate-900 font-mono font-bold block">
          Gate: {{ riskStore.gateScore }} pts | Total: {{ riskStore.grandTotalScore }} pts
        </strong>
      </div>

      <div>
        <span class="text-slate-400 block text-[11px]">Benchmark Tier:</span>
        <span
          class="inline-block mt-0.5 px-2 py-0.5 rounded font-bold text-[11px] border"
          :class="(riskStore.isEscalated ? riskStore.benchmarkGrandTotal?.badgeClass : riskStore.benchmarkGate?.badgeClass) || 'bg-slate-100 text-slate-800 border-slate-200'"
        >
          {{ (riskStore.isEscalated ? riskStore.benchmarkGrandTotal?.label : riskStore.benchmarkGate?.label) || 'Dalam Evaluasi' }}
        </span>
      </div>
    </div>

    <!-- Maker Initial Submission Box -->
    <div
      v-if="workflowStore.activePersonaId === 'maker' && (workflowStore.workflowStatus === 'DRAFT' || workflowStore.workflowStatus === 'REJECTED_REVISION')"
      class="p-4 bg-slate-900 text-white rounded-xl shadow-sm border border-slate-800 space-y-3"
    >
      <div class="flex items-center justify-between border-b border-slate-800 pb-2">
        <span class="text-xs font-bold uppercase tracking-wider text-indigo-300">
          Pengajuan Resmi Asesmen Risiko (Maker)
        </span>
        <span class="text-xs text-slate-400">
          Inisiator: <strong class="text-white">{{ workflowStore.activePersona.name }}</strong>
        </span>
      </div>
      <p class="text-xs text-slate-300">
        Pastikan seluruh data risiko, skor indikator, dan rencana penanganan pada tahapan sebelumnya telah lengkap dan akurat sebelum diteruskan ke Kepala Bagian.
      </p>
      <div v-if="actionError" class="p-2.5 bg-rose-950/80 border border-rose-800 rounded-md text-xs text-rose-200">
        {{ actionError }}
      </div>
      <div class="flex items-center justify-end pt-1">
        <button
          type="button"
          @click="handleMakerSubmit"
          :disabled="isSubmittingAction"
          class="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition shadow-sm disabled:opacity-50 cursor-pointer"
        >
          {{ isSubmittingAction ? 'Memproses Pengajuan...' : 'Ajukan Asesmen Resmi ke Kepala Bagian →' }}
        </button>
      </div>
    </div>

    <!-- Status Banner / Assigned Reviewer Notice -->
    <div
      v-else-if="workflowStore.isCurrentReviewer"
      class="p-4 bg-slate-900 text-white rounded-xl shadow-sm border border-slate-800 space-y-4"
    >
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-300">
            Giliran Anda Mengambil Keputusan Evaluasi
          </span>
        </div>
        <div class="text-xs text-slate-300">
          Login Sebagai: <strong class="text-white">{{ workflowStore.activePersona.name }}</strong>
          <span class="text-slate-400 text-[11px] block sm:inline sm:ml-1">({{ workflowStore.activePersona.roleTitle }})</span>
        </div>
      </div>

      <!-- Action Note Textarea -->
      <div class="space-y-1.5">
        <label class="block text-xs font-medium text-slate-200">
          Catatan / Komentar Review:
          <span class="text-slate-400 font-normal ml-1">(Wajib diisi jika Meminta Revisi atau Menolak Dokumen)</span>
        </label>
        <textarea
          v-model="reviewNotes"
          rows="3"
          placeholder="Tuliskan catatan evaluasi, rekomendasi perbaikan, atau dasar pertimbangan persetujuan..."
          class="w-full px-3 py-2 text-xs text-slate-900 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400"
        ></textarea>
      </div>

      <!-- Error alert if validation fails -->
      <div v-if="actionError" class="p-2.5 bg-rose-950/80 border border-rose-800 rounded-md text-xs text-rose-200">
        {{ actionError }}
      </div>

      <!-- 3 Decision Buttons -->
      <div class="flex flex-wrap items-center justify-end gap-2.5 pt-1">
        <!-- Reject Permanently -->
        <button
          type="button"
          @click="handleRejectFinal"
          :disabled="isSubmittingAction"
          class="px-3.5 py-2 text-xs font-semibold text-rose-200 bg-rose-900/80 hover:bg-rose-900 border border-rose-700 rounded-lg transition disabled:opacity-50 cursor-pointer"
        >
          ✕ Tolak Dokumen (Batal)
        </button>

        <!-- Request Revision -->
        <button
          type="button"
          @click="handleRequestRevision"
          :disabled="isSubmittingAction"
          class="px-3.5 py-2 text-xs font-semibold text-amber-200 bg-amber-950/80 hover:bg-amber-900 border border-amber-700 rounded-lg transition disabled:opacity-50 cursor-pointer"
        >
          ↺ Kembalikan untuk Revisi
        </button>

        <!-- Approve and Advance -->
        <button
          type="button"
          @click="handleApprove"
          :disabled="isSubmittingAction"
          class="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition shadow-sm disabled:opacity-50 cursor-pointer"
        >
          ✓ Setujui & Lanjutkan Tahap
        </button>
      </div>
    </div>

    <!-- Observer / Completed Notice -->
    <div
      v-else
      class="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
    >
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <div class="font-bold text-slate-800">
            {{
              workflowStore.workflowStatus === 'APPROVED_FINAL'
                ? 'Dokumen Ini Telah Disetujui Penuh (Final Sign-Off Selesai)'
                : workflowStore.workflowStatus === 'REJECTED_FINAL'
                ? 'Dokumen Ini Telah Ditolak Permanen'
                : workflowStore.workflowStatus === 'REJECTED_REVISION'
                ? 'Dokumen Dikembalikan ke Inisiator (Maker) untuk Perbaikan'
                : 'Menunggu Otorisasi dari Reviewer Bertugas'
            }}
          </div>
          <div class="text-slate-500 text-[11px] mt-0.5">
            Anda sedang melihat sebagai <strong>{{ workflowStore.activePersona.name }}</strong> ({{ workflowStore.activePersona.roleTitle }}).
            <span v-if="workflowStore.currentAssignedRole">
              Tindakan persetujuan saat ini menjadi wewenang: <strong class="text-slate-800">{{ workflowStore.currentAssignedRole.toUpperCase() }}</strong>.
            </span>
          </div>
        </div>
      </div>

      <button
        v-if="workflowStore.currentAssignedRole"
        type="button"
        @click="switchToAssignedApprover"
        class="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-md hover:bg-slate-100 transition whitespace-nowrap shadow-2xs cursor-pointer self-start sm:self-auto"
      >
        Beralih ke Approver Bertugas &rarr;
      </button>
    </div>

    <!-- Audit Trail Timeline Section -->
    <div class="space-y-3">
      <div class="flex items-center justify-between border-b border-slate-200 pb-2">
        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700">
          Riwayat Jejak Audit & Keputusan Evaluasi
        </h3>
        <span class="text-[11px] text-slate-400">
          {{ workflowStore.auditTrail.length }} Catatan Aktivitas
        </span>
      </div>

      <div v-if="workflowStore.auditTrail.length === 0" class="text-center py-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400">
        Belum ada riwayat aktivitas audit pada dokumen ini.
      </div>

      <div v-else class="space-y-2.5">
        <div
          v-for="entry in workflowStore.auditTrail"
          :key="entry.id"
          class="p-3 bg-white border border-slate-200 rounded-xl text-xs flex flex-col sm:flex-row sm:items-start justify-between gap-2 shadow-2xs"
        >
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span
                class="px-2 py-0.5 rounded text-[10px] font-bold uppercase border"
                :class="
                  entry.action === 'APPROVE'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : entry.action === 'SUBMIT'
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    : entry.action === 'REJECT_FINAL'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : entry.action === 'REJECT_REVISION'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                "
              >
                {{ entry.action }}
              </span>
              <strong class="text-slate-800">{{ entry.personaName }}</strong>
              <span class="text-slate-400 text-[11px]">({{ entry.roleTitle }})</span>
            </div>

            <div v-if="entry.notes" class="text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 text-[11px] italic">
              "{{ entry.notes }}"
            </div>
          </div>

          <div class="text-slate-400 text-[10px] sm:text-right whitespace-nowrap">
            {{ entry.timestamp }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
