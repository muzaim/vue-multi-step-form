import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type {
  PersonaId,
  PersonaProfile,
  WorkflowStatus,
  AuditLogEntry,
} from '../types/workflow.types.ts';

export const PERSONA_LIST: PersonaProfile[] = [
  {
    id: 'maker',
    name: 'Budi Santoso',
    roleTitle: 'Staff Inisiator (Maker)',
    department: 'Unit Bisnis / Pengusul',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    canEditWhenCurrent: true,
  },
  {
    id: 'kabag',
    name: 'Hendra Kusuma, M.M.',
    roleTitle: 'Kepala Bagian (Reviewer 1)',
    department: 'Unit Bisnis / Pengusul',
    badgeClass: 'bg-sky-100 text-sky-800 border-sky-200',
    canEditWhenCurrent: false,
  },
  {
    id: 'kadiv',
    name: 'Ir. Agus Wijaya',
    roleTitle: 'Kepala Divisi (Reviewer 2)',
    department: 'Divisi Bisnis & Operasional',
    badgeClass: 'bg-teal-100 text-teal-800 border-teal-200',
    canEditWhenCurrent: false,
  },
  {
    id: 'rcsa',
    name: 'Siti Rahmawati, ERM',
    roleTitle: 'RCSA Officer (Risk Specialist)',
    department: 'Spesialis Manajemen Risiko',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    canEditWhenCurrent: true,
  },
  {
    id: 'kabag_mrk',
    name: 'Drs. Bambang Sudrajat',
    roleTitle: 'Kepala Bagian MRK (Risk Reviewer)',
    department: 'Manajemen Risiko Korporasi',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
    canEditWhenCurrent: true,
  },
  {
    id: 'kadiv_mrk',
    name: 'Dr. Raden Arya, S.E., MBA',
    roleTitle: 'Kepala Divisi MRK (Executive Sign-Off)',
    department: 'Direktorat Manajemen Risiko',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
    canEditWhenCurrent: false,
  },
];

const STORAGE_KEY = 'vue_risk_workflow_state_v1';

export const useWorkflowStore = defineStore('workflowStore', () => {
  const activePersonaId = ref<PersonaId>('maker');
  const workflowStatus = ref<WorkflowStatus>('DRAFT');
  const documentId = ref<string>('RCSA-2026-0042');
  const auditTrail = ref<AuditLogEntry[]>([]);

  // Active persona object
  const activePersona = computed(() => {
    return (
      PERSONA_LIST.find((p) => p.id === activePersonaId.value) ||
      PERSONA_LIST[0]
    );
  });

  // Determines who is the expected approver for the current status
  const currentAssignedRole = computed<PersonaId | null>(() => {
    switch (workflowStatus.value) {
      case 'DRAFT':
      case 'REJECTED_REVISION':
        return 'maker';
      case 'PENDING_KABAG':
        return 'kabag';
      case 'PENDING_KADIV':
        return 'kadiv';
      case 'PENDING_RCSA':
        return 'rcsa';
      case 'PENDING_KABAG_MRK':
        return 'kabag_mrk';
      case 'PENDING_KADIV_MRK':
        return 'kadiv_mrk';
      case 'APPROVED_FINAL':
      case 'REJECTED_FINAL':
        return null;
    }
  });

  // Is it the active persona's turn to take action?
  const isCurrentReviewer = computed(() => {
    if (workflowStatus.value === 'APPROVED_FINAL' || workflowStatus.value === 'REJECTED_FINAL') return false;
    return currentAssignedRole.value === activePersonaId.value;
  });

  // RBAC Permission: Can the active persona edit form fields right now?
  const isFieldEditable = computed(() => {
    // 1. Maker can edit when Draft or Revised
    if (
      activePersonaId.value === 'maker' &&
      (workflowStatus.value === 'DRAFT' ||
        workflowStatus.value === 'REJECTED_REVISION')
    ) {
      return true;
    }

    // 2. RCSA Specialist can edit/challenge scoring & metrics when it's their turn
    if (
      activePersonaId.value === 'rcsa' &&
      workflowStatus.value === 'PENDING_RCSA'
    ) {
      return true;
    }

    // 3. Kabag MRK can edit deep mitigation & governance parameters when it's their turn
    if (
      activePersonaId.value === 'kabag_mrk' &&
      workflowStatus.value === 'PENDING_KABAG_MRK'
    ) {
      return true;
    }

    // All other roles (Kabag, Kadiv, Kadiv MRK, or non-assigned turn) are read-only
    return false;
  });

  // Helper status label
  const statusLabel = computed(() => {
    switch (workflowStatus.value) {
      case 'DRAFT':
        return { label: 'Draft Inisiasi (Maker)', color: 'slate' };
      case 'PENDING_KABAG':
        return { label: 'Menunggu Review Kepala Bagian', color: 'sky' };
      case 'PENDING_KADIV':
        return { label: 'Menunggu Persetujuan Kepala Divisi', color: 'teal' };
      case 'PENDING_RCSA':
        return { label: 'Review & Challenge RCSA Risk Specialist', color: 'amber' };
      case 'PENDING_KABAG_MRK':
        return { label: 'Validasi Protokol Kabag MRK', color: 'purple' };
      case 'PENDING_KADIV_MRK':
        return { label: 'Final Otorisasi Kadiv MRK', color: 'rose' };
      case 'APPROVED_FINAL':
        return { label: 'Disetujui Penuh (Final Approved)', color: 'emerald' };
      case 'REJECTED_REVISION':
        return { label: 'Dikembalikan untuk Revisi', color: 'red' };
      case 'REJECTED_FINAL':
        return { label: 'Ditolak Permanen (Rejected)', color: 'rose' };
    }
  });

  // --- Workflow Actions ---

  function logAuditEvent(
    action: AuditLogEntry['action'],
    fromStatus: WorkflowStatus,
    toStatus: WorkflowStatus,
    notes?: string
  ) {
    const entry: AuditLogEntry = {
      id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      personaId: activePersona.value.id,
      personaName: activePersona.value.name,
      roleTitle: activePersona.value.roleTitle,
      action,
      fromStatus,
      toStatus,
      notes,
    };
    auditTrail.value.unshift(entry);
    saveToStorage();
  }

  function submitInitialAssessment() {
    const prev = workflowStatus.value;
    workflowStatus.value = 'PENDING_KABAG';
    logAuditEvent('SUBMIT', prev, 'PENDING_KABAG', 'Dokumen resmi diajukan untuk review bertingkat.');
  }

  function approveCurrentStage(notes?: string) {
    const prev = workflowStatus.value;
    let next: WorkflowStatus = 'APPROVED_FINAL';

    switch (prev) {
      case 'PENDING_KABAG':
        next = 'PENDING_KADIV';
        break;
      case 'PENDING_KADIV':
        next = 'PENDING_RCSA';
        break;
      case 'PENDING_RCSA':
        next = 'PENDING_KABAG_MRK';
        break;
      case 'PENDING_KABAG_MRK':
        next = 'PENDING_KADIV_MRK';
        break;
      case 'PENDING_KADIV_MRK':
        next = 'APPROVED_FINAL';
        break;
    }

    workflowStatus.value = next;
    logAuditEvent(
      'APPROVE',
      prev,
      next,
      notes || 'Disetujui sesuai hasil evaluasi dan kepatuhan.'
    );
  }

  function requestRevision(notes: string) {
    const prev = workflowStatus.value;
    workflowStatus.value = 'REJECTED_REVISION';
    logAuditEvent(
      'REJECT_REVISION',
      prev,
      'REJECTED_REVISION',
      notes || 'Perlu perbaikan data dukung atau mitigasi.'
    );
  }

  function rejectFinalAssessment(notes: string) {
    const prev = workflowStatus.value;
    workflowStatus.value = 'REJECTED_FINAL';
    logAuditEvent(
      'REJECT_FINAL',
      prev,
      'REJECTED_FINAL',
      notes || 'Pengajuan asesmen risiko ditolak permanen.'
    );
  }

  function resetWorkflow() {
    workflowStatus.value = 'DRAFT';
    activePersonaId.value = 'maker';
    auditTrail.value = [];
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }

  // --- LocalStorage Sync ---
  function saveToStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const payload = {
          workflowStatus: workflowStatus.value,
          documentId: documentId.value,
          auditTrail: auditTrail.value,
          activePersonaId: activePersonaId.value,
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {
        // Ignore storage quotas or restrictions
      }
    }
  }

  function loadFromStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.workflowStatus) workflowStatus.value = parsed.workflowStatus;
          if (parsed.documentId) documentId.value = parsed.documentId;
          if (Array.isArray(parsed.auditTrail)) auditTrail.value = parsed.auditTrail;
          if (parsed.activePersonaId) activePersonaId.value = parsed.activePersonaId;
        }
      } catch {
        // Fallback to initial defaults
      }
    }
  }

  // Auto-load on instantiation
  loadFromStorage();

  watch([activePersonaId, workflowStatus], () => {
    saveToStorage();
  });

  return {
    personas: PERSONA_LIST,
    activePersonaId,
    activePersona,
    workflowStatus,
    documentId,
    auditTrail,
    currentAssignedRole,
    isCurrentReviewer,
    isFieldEditable,
    statusLabel,
    submitInitialAssessment,
    approveCurrentStage,
    requestRevision,
    rejectFinalAssessment,
    resetWorkflow,
    saveToStorage,
  };
});
