<script setup lang="ts">
import { ref } from 'vue';
import { useWorkflowStore } from '../stores/useWorkflowStore.ts';
import type { PersonaId } from '../types/workflow.types.ts';

const store = useWorkflowStore();
const showAuditModal = ref(false);

function onPersonaChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  store.activePersonaId = target.value as PersonaId;
}
</script>

<template>
  <div class="bg-white border border-slate-200 rounded-xl p-3 shadow-xs space-y-2.5">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <!-- Persona Switcher Dropdown -->
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs">
          {{ store.activePersona.name.charAt(0) }}
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Simulasi Persona Login:</span>
            <span
              class="px-2 py-0.5 rounded text-[10px] font-bold border"
              :class="store.isFieldEditable ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'"
            >
              {{ store.isFieldEditable ? '✏️ Mode Edit / Challenge' : '🔒 Read-Only (Hanya Baca)' }}
            </span>
          </div>

          <div class="relative mt-1">
            <select
              :value="store.activePersonaId"
              @change="onPersonaChange"
              class="text-xs font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-md py-1.5 pl-2.5 pr-8 hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
            >
              <option v-for="p in store.personas" :key="p.id" :value="p.id">
                {{ p.name }} &mdash; {{ p.roleTitle }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Document Workflow Status & Actions -->
      <div class="flex flex-wrap items-center gap-2 self-start sm:self-center">
        <!-- Status Badge -->
        <div class="text-right">
          <div class="text-[10px] font-medium text-slate-400">Status Dokumen:</div>
          <span
            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border"
            :class="[
              store.workflowStatus === 'APPROVED_FINAL' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
              store.workflowStatus === 'REJECTED_REVISION' ? 'bg-rose-50 text-rose-800 border-rose-300' :
              'bg-sky-50 text-sky-800 border-sky-300'
            ]"
          >
            {{ store.statusLabel.label }}
          </span>
        </div>

        <div class="flex items-center gap-1.5 ml-2">
          <!-- Audit Log Button -->
          <button
            type="button"
            @click="showAuditModal = true"
            class="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition flex items-center gap-1 shadow-xs"
          >
            <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Riwayat ({{ store.auditTrail.length }})</span>
          </button>

          <!-- Reset Button -->
          <button
            type="button"
            @click="store.resetWorkflow()"
            title="Reset simulasi ke kondisi awal Draft"
            class="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition"
          >
            Reset
          </button>
        </div>
      </div>
    </div>

    <!-- Audit Trail Modal / Drawer -->
    <div
      v-if="showAuditModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
    >
      <div class="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-5 space-y-4 max-h-[85vh] flex flex-col">
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h3 class="font-bold text-slate-900 text-sm">Riwayat Audit & Persetujuan (Audit Trail)</h3>
            <p class="text-xs text-slate-500">Ref No: {{ store.documentId }}</p>
          </div>
          <button
            type="button"
            @click="showAuditModal = false"
            class="text-slate-400 hover:text-slate-700 text-lg leading-none p-1"
          >
            &times;
          </button>
        </div>

        <div class="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
          <div v-if="store.auditTrail.length === 0" class="text-center py-6 text-slate-400">
            Belum ada riwayat persetujuan. Formulir masih dalam status awal.
          </div>

          <div
            v-for="log in store.auditTrail"
            :key="log.id"
            class="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1"
          >
            <div class="flex items-center justify-between text-[11px]">
              <span class="font-bold text-slate-900">{{ log.personaName }}</span>
              <span class="text-slate-400 font-mono">{{ log.timestamp }}</span>
            </div>
            <div class="text-[11px] text-slate-500">{{ log.roleTitle }}</div>
            <div class="flex items-center gap-2 pt-1">
              <span
                class="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase"
                :class="[
                  log.action === 'APPROVE' ? 'bg-emerald-100 text-emerald-800' :
                  log.action === 'SUBMIT' ? 'bg-sky-100 text-sky-800' :
                  log.action === 'REJECT_REVISION' ? 'bg-rose-100 text-rose-800' :
                  'bg-slate-200 text-slate-800'
                ]"
              >
                {{ log.action }}
              </span>
              <span class="text-[11px] text-slate-700 italic">"{{ log.notes || '-' }}"</span>
            </div>
          </div>
        </div>

        <div class="border-t border-slate-200 pt-3 text-right">
          <button
            type="button"
            @click="showAuditModal = false"
            class="px-4 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-md hover:bg-slate-800"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
