import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { setActivePinia, createPinia } from 'pinia';
import { useWorkflowStore } from '../src/features/risk-management/stores/useWorkflowStore.ts';

describe('Workflow Store & RBAC Permission Engine', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test('initializes with Maker in DRAFT status with full edit permission', () => {
    const store = useWorkflowStore();
    assert.equal(store.workflowStatus, 'DRAFT');
    assert.equal(store.activePersonaId, 'maker');
    assert.equal(store.isFieldEditable, true);
    assert.equal(store.currentAssignedRole, 'maker');
  });

  test('submitting as maker moves status to PENDING_KABAG and makes form read-only for Kabag', () => {
    const store = useWorkflowStore();

    store.submitInitialAssessment();
    assert.equal(store.workflowStatus, 'PENDING_KABAG');
    assert.equal(store.currentAssignedRole, 'kabag');
    assert.equal(store.auditTrail.length, 1);
    assert.equal(store.auditTrail[0].action, 'SUBMIT');

    // Switch to Kabag
    store.activePersonaId = 'kabag';
    assert.equal(store.isCurrentReviewer, true);
    assert.equal(store.isFieldEditable, false); // Kabag CANNOT edit, only review!
  });

  test('progresses through approval chain and unlocks RCSA challenge mode', () => {
    const store = useWorkflowStore();
    store.submitInitialAssessment(); // -> PENDING_KABAG

    // 1. Kabag approves -> PENDING_KADIV
    store.activePersonaId = 'kabag';
    store.approveCurrentStage('Catatan Kabag: Disetujui');
    assert.equal(store.workflowStatus, 'PENDING_KADIV');
    assert.equal(store.currentAssignedRole, 'kadiv');

    // 2. Kadiv is read-only
    store.activePersonaId = 'kadiv';
    assert.equal(store.isFieldEditable, false);
    store.approveCurrentStage('Catatan Kadiv: Lanjutkan ke RCSA');
    assert.equal(store.workflowStatus, 'PENDING_RCSA');
    assert.equal(store.currentAssignedRole, 'rcsa');

    // 3. RCSA Officer CAN EDIT (Challenge Mode)
    store.activePersonaId = 'rcsa';
    assert.equal(store.isCurrentReviewer, true);
    assert.equal(store.isFieldEditable, true); // RCSA CAN EDIT!

    // 4. RCSA approves -> PENDING_KABAG_MRK
    store.approveCurrentStage('RCSA: Bobot telah dikalibrasi');
    assert.equal(store.workflowStatus, 'PENDING_KABAG_MRK');

    // 5. Kabag MRK CAN EDIT
    store.activePersonaId = 'kabag_mrk';
    assert.equal(store.isCurrentReviewer, true);
    assert.equal(store.isFieldEditable, true);

    // 6. Kabag MRK approves -> PENDING_KADIV_MRK
    store.approveCurrentStage('Kabag MRK: Protokol valid');
    assert.equal(store.workflowStatus, 'PENDING_KADIV_MRK');

    // 7. Kadiv MRK final sign-off
    store.activePersonaId = 'kadiv_mrk';
    assert.equal(store.isFieldEditable, false);
    store.approveCurrentStage('Kadiv MRK: Final Sign-off Otorisasi');
    assert.equal(store.workflowStatus, 'APPROVED_FINAL');
    assert.equal(store.currentAssignedRole, null);
  });

  test('request revision returns document to Maker for edits', () => {
    const store = useWorkflowStore();
    store.submitInitialAssessment(); // -> PENDING_KABAG

    store.activePersonaId = 'kabag';
    store.requestRevision('Data pendukung belum lengkap');

    assert.equal(store.workflowStatus, 'REJECTED_REVISION');
    assert.equal(store.currentAssignedRole, 'maker');

    // Switch to Maker
    store.activePersonaId = 'maker';
    assert.equal(store.isFieldEditable, true); // Maker can edit again!
  });

  test('end-to-end full simulation cycle: Maker submit -> Kabag review -> Kadiv review -> RCSA challenge edit -> Kabag MRK edit -> Kadiv MRK final approval', () => {
    const store = useWorkflowStore();

    // 1. Maker starts in DRAFT
    assert.equal(store.workflowStatus, 'DRAFT');
    assert.equal(store.activePersonaId, 'maker');
    assert.equal(store.isFieldEditable, true);

    // Maker submits
    store.submitInitialAssessment();
    assert.equal(store.workflowStatus, 'PENDING_KABAG');
    assert.equal(store.currentAssignedRole, 'kabag');

    // 2. Kabag opens form -> is read-only
    store.activePersonaId = 'kabag';
    assert.equal(store.isCurrentReviewer, true);
    assert.equal(store.isFieldEditable, false); // Locked
    store.approveCurrentStage('Reviewed by Kabag: All preliminary figures look sound.');
    assert.equal(store.workflowStatus, 'PENDING_KADIV');

    // 3. Kadiv opens form -> is read-only
    store.activePersonaId = 'kadiv';
    assert.equal(store.isCurrentReviewer, true);
    assert.equal(store.isFieldEditable, false); // Locked
    store.approveCurrentStage('Endorsed by Kadiv: Escalating to Risk Compliance team.');
    assert.equal(store.workflowStatus, 'PENDING_RCSA');

    // 4. RCSA Officer opens form -> Challenge mode unlocked!
    store.activePersonaId = 'rcsa';
    assert.equal(store.isCurrentReviewer, true);
    assert.equal(store.isFieldEditable, true); // EDITABLE for calibration
    store.approveCurrentStage('RCSA: Recalibrated likelihood metrics and stress-tested controls.');
    assert.equal(store.workflowStatus, 'PENDING_KABAG_MRK');

    // 5. Kabag MRK opens form -> Deep risk mitigation edit unlocked!
    store.activePersonaId = 'kabag_mrk';
    assert.equal(store.isCurrentReviewer, true);
    assert.equal(store.isFieldEditable, true); // EDITABLE for mitigation adjustments
    store.approveCurrentStage('Kabag MRK: Approved mitigation contingency plans and budget.');
    assert.equal(store.workflowStatus, 'PENDING_KADIV_MRK');

    // 6. Kadiv MRK opens form -> Final executive sign-off (read-only)
    store.activePersonaId = 'kadiv_mrk';
    assert.equal(store.isCurrentReviewer, true);
    assert.equal(store.isFieldEditable, false); // Locked
    store.approveCurrentStage('Kadiv MRK: Final executive authorization granted.');
    assert.equal(store.workflowStatus, 'APPROVED_FINAL');
    assert.equal(store.currentAssignedRole, null);

    // Verify complete audit trail integrity (newest first / unshifted)
    assert.equal(store.auditTrail.length, 6);
    assert.equal(store.auditTrail[0].action, 'APPROVE');
    assert.equal(store.auditTrail[0].personaId, 'kadiv_mrk');
    assert.equal(store.auditTrail[1].action, 'APPROVE');
    assert.equal(store.auditTrail[1].personaId, 'kabag_mrk');
    assert.equal(store.auditTrail[2].action, 'APPROVE');
    assert.equal(store.auditTrail[2].personaId, 'rcsa');
    assert.equal(store.auditTrail[3].action, 'APPROVE');
    assert.equal(store.auditTrail[3].personaId, 'kadiv');
    assert.equal(store.auditTrail[4].action, 'APPROVE');
    assert.equal(store.auditTrail[4].personaId, 'kabag');
    assert.equal(store.auditTrail[5].action, 'SUBMIT');
    assert.equal(store.auditTrail[5].personaId, 'maker');
  });

  test('rejectFinalAssessment transitions document to REJECTED_FINAL and locks review', () => {
    const store = useWorkflowStore();
    store.submitInitialAssessment(); // -> PENDING_KABAG

    store.activePersonaId = 'kabag';
    assert.equal(store.isCurrentReviewer, true);

    store.rejectFinalAssessment('Ditolak karena tidak sesuai rencana strategis tahunan');

    assert.equal(store.workflowStatus, 'REJECTED_FINAL');
    assert.equal(store.currentAssignedRole, null);
    assert.equal(store.isCurrentReviewer, false);
    assert.equal(store.isFieldEditable, false);

    assert.equal(store.auditTrail[0].action, 'REJECT_FINAL');
    assert.equal(store.auditTrail[0].personaId, 'kabag');
    assert.equal(store.auditTrail[0].toStatus, 'REJECTED_FINAL');
  });
});
