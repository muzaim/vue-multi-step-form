# Tasks

## 1. Workflow Store & Rejection Support

- [x] 1.1 Update `WorkflowStatus` type in `workflow.types.ts` to include `'REJECTED_FINAL'`, and add corresponding label/color in `useWorkflowStore.ts`.
- [x] 1.2 Implement `rejectFinalAssessment(notes: string)` in `useWorkflowStore.ts` to record rejection in the audit trail and mark document closed.
- [x] 1.3 Add unit tests in `tests/workflowStore.test.ts` verifying rejection transitions and audit trail entries.

## 2. Dedicated Approval Stage Component

- [x] 2.1 Create `StepApprovalGovernance.vue` with document overview, risk ratings, audit log timeline, review notes textarea, and 3 action buttons (Setujui / Lanjutkan, Kembalikan untuk Revisi, Tolak Dokumen).
- [x] 2.2 Include active approver vs observer banner in `StepApprovalGovernance.vue` with a 1-click button to switch to the assigned approver.
- [x] 2.3 Remove redundant floating `WorkflowDecisionBar.vue` from intermediate step views in `RiskFormWizard.vue`.

## 3. Dynamic Stepper Expansion & Navigation Routing Fix

- [x] 3.1 Update step arrays in `RiskFormWizard.vue` to add the dedicated Approval step: Stage 6 for 5-stage flows and Stage 9 for 8-stage escalated flows.
- [x] 3.2 Fix the submission confirmation screen and switch button in `RiskFormWizard.vue` so switching persona routes navigation to Stage 1 and clears the confirmation view.
- [x] 3.3 Verify `RiskStepperNav.vue` and `RiskWizardFooter.vue` dynamically display and paginate across 6 and 9 stages.

## 4. Verification & Testing

- [x] 4.1 Update integration tests in `tests/interactiveFlow.test.ts` and `tests/workflowStore.test.ts` to assert 6-stage and 9-stage navigation.
- [x] 4.2 Run `npm run test:unit` and verify all tests pass.
- [x] 4.3 Run `vue-tsc -b && vite build` to verify zero TypeScript and bundling errors.

## Workflow follow-up

- Archive change after validation and user review.
