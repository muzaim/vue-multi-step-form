# Proposal

## Why

When an initial risk assessment is submitted by the Maker, the UI currently gets stuck on the submission success banner because switching persona does not clear the submission confirmation state nor route the reviewer to the beginning of the form. Furthermore, placing approval decision controls inside individual intermediate stages disrupts the sequential review experience. In real enterprise risk governance, supervisory reviewers need to review the entire assessment from Stage 1 through to the end, with a dedicated final Approval Stage (Stage 6 for standard 5-step workflows, or Stage 9 for 8-step escalated workflows) providing complete audit history, feedback input, and definitive decision actions (Approve, Request Revision, Reject).

## What Changes

- **Fix Submission Transition & Reviewer Routing**:
  - Fix the submission confirmation screen condition so switching to a reviewer persona dismisses the confirmation and automatically routes navigation to Stage 1.
  - Ensure reviewers start at the beginning of the assessment in read-only mode to inspect preliminary data before rendering their decision.
- **Dedicated Final Approval Stage**:
  - Add a dedicated final stage: **Stage 6 (Lembar Evaluasi & Persetujuan)** for standard 5-stage workflows.
  - Add a dedicated final stage: **Stage 9 (Lembar Evaluasi & Persetujuan)** for escalated 8-stage workflows.
  - Update stepper navigation and total stage count to 6 and 9 stages respectively.
- **Enhanced Reviewer Actions & Decisions**:
  - In the dedicated approval stage, provide three explicit governance decisions:
    1. **Setujui & Teruskan (Approve)**: Advances the workflow status to the next reviewer in the hierarchy (or `APPROVED_FINAL`).
    2. **Kembalikan untuk Revisi (Request Revision)**: Sends document back to `maker` with mandatory notes, unlocking edit permissions.
    3. **Tolak Dokumen (Reject)**: Permanently rejects the document (`REJECTED_FINAL`) with mandatory reason notes.
  - Display audit trail history, reviewer notes, and previous reviewer signatures directly on the final approval sheet.

## Capabilities

### Modified Capabilities
- `role-approval-workflow`: Modify approval decision requirements to place governance actions on a dedicated final stage (Stage 6 or 9), route incoming reviewers to Stage 1, and support three explicit decision actions (Approve, Request Revision, Reject).
- `compact-tracking-navigation`: Update stage count and step configurations to dynamically include the final Approval stage (6 stages for standard, 9 stages for escalated).

## Impact

- **Affected Components**:
  - `src/features/risk-management/components/RiskFormWizard.vue`
  - `src/features/risk-management/components/RiskStepperNav.vue`
  - `src/features/risk-management/components/steps/StepApprovalGovernance.vue` (new step component for Stage 6/9)
  - `src/features/risk-management/stores/useWorkflowStore.ts`
  - `src/features/risk-management/types/workflow.types.ts`
- **Tests**: Update and expand `tests/workflowStore.test.ts` and `tests/interactiveFlow.test.ts` to assert 6-stage and 9-stage navigation, rejection transitions, and routing behavior.
