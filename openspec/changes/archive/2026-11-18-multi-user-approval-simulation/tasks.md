# Tasks

## 1. Workflow Store & RBAC Permission Engine

- [x] 1.1 Implement `useWorkflowStore.ts` defining 6 enterprise personas (`maker`, `kabag`, `kadiv`, `rcsa`, `kabag_mrk`, `kadiv_mrk`), status states (`DRAFT` through `APPROVED_FINAL`), and audit trail event logger.
- [x] 1.2 Implement reactive permission computeds (`isFieldEditable`, `canApprove`, `isCurrentReviewer`) enforcing read-only vs editable mode per role.
- [x] 1.3 Add LocalStorage persistence sync so switching personas preserves form data, status, and audit log.
- [x] 1.4 Add unit tests verifying workflow stage transitions, permission checks, and audit logging.

## 2. Persona Switcher & Approval Action Bar Components

- [x] 2.1 Implement `RolePersonaSwitcher.vue` allowing instant switching between the 6 governance personas with clear badge indicators.
- [x] 2.2 Implement `WorkflowDecisionBar.vue` displaying current document status, review note input, and decision buttons (Approve / Request Revision) for active approver.
- [x] 2.3 Implement expandable audit trail drawer/timeline displaying timestamped approval logs with reviewer names and notes.
- [x] 2.4 Wire `disabled` property across all form step components to respect `!isFieldEditable`.

## 3. Compact Segmented Stepper & Preset Dropdown Navigation

- [x] 3.1 Refactor `RiskStepperNav.vue` into a sleek horizontal segmented stepper with stage counter, progress percentage, and slim segment pills.
- [x] 3.2 Consolidate the 4 demo preset buttons in `RiskFormWizard.vue` into a single compact select dropdown (`[ Preset Skenario ▾ ]`).
- [x] 3.3 Verify responsive behavior on both desktop and mobile viewports.

## 4. Verification & Testing

- [x] 4.1 Run type-check (`vue-tsc -b`) and verify zero TypeScript errors.
- [x] 4.2 Run unit and integration tests (`npm run test:unit`) ensuring all test suites pass.
- [x] 4.3 Verify full end-to-end simulation cycle: Maker submit -> Kabag review (read-only) -> Kadiv review -> RCSA challenge edit -> Kabag MRK edit -> Kadiv MRK final approval.

## Workflow follow-up

- Archive change after validation and user review.
