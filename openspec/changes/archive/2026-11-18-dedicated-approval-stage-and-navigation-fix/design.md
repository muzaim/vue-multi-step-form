# Design

## Context

See `proposal.md` for motivation.
Currently, risk form wizards define 5 base steps for standard flows and 8 steps for escalated flows. Reviewer action buttons were provisionally placed at the bottom of every step component via `WorkflowDecisionBar.vue`. When Maker submits, a confirmation view appears with a switch button, but clicking it does not dismiss the confirmation screen nor route to Stage 1.

## Goals / Non-Goals

**Goals:**
- Provide a dedicated final stage (`StepApprovalGovernance.vue`) representing Stage 6 (for standard 5-stage flows) or Stage 9 (for escalated 8-stage flows).
- Route reviewers to Stage 1 when switching personas, allowing thorough preliminary review before advancing to the approval stage.
- Implement 3 distinct governance decisions on the approval stage:
  1. **Setujui & Teruskan** (`approveCurrentStage`)
  2. **Kembalikan untuk Revisi** (`requestRevision`)
  3. **Tolak Dokumen** (`rejectFinalAssessment`)
- Present assessment summaries, factor scores, and the complete audit trail directly on the approval stage.
- Remove redundant floating decision bars from stages 1 to 5 (or 1 to 8).

**Non-Goals:**
- Real server-side authentication or database persistence (pure simulated Vue 3 Pinia + LocalStorage).
- Modifying mathematical scoring algorithms or benchmark threshold categories.

## Decisions

### 1. Dedicated Step Component (`StepApprovalGovernance.vue`)
Rather than keeping a floating decision box across all steps, the review and approval desk is encapsulated in a dedicated final step:
- Shows document overview (Track, Category, Department, Reference No., Total Score & Risk Tier).
- Chronological timeline of audit log entries (Maker submission, prior reviewer signatures and notes).
- For the active reviewer: Review notes input, plus 3 action buttons (Approve, Request Revision, Reject).
- For observers / non-active personas: A notice explaining whose turn it is, with a one-click button to switch to that reviewer.

### 2. Dynamic 6-Step and 9-Step Configurations
Update `activeSteps` in `RiskFormWizard.vue`:
- Standard Non-Fraud / Fraud: 5 intake/analysis steps + 1 Approval Step = **6 Total Steps**.
- Escalated Non-Fraud / Fraud: 8 comprehensive steps + 1 Approval Step = **9 Total Steps**.
The stepper segment bar (`RiskStepperNav.vue`) and footer automatically scale and reflect 6 or 9 segments.

### 3. Reviewer Routing and Success Screen Fix
In `RiskFormWizard.vue`:
- Add a watcher or handler on persona switching: whenever switching from Maker to a reviewer, reset `currentStep.value = 1` and clear `store.submissionResult = null`.
- Update the submit confirmation screen to only display when `store.submissionResult` is present AND `workflowStore.activePersonaId === 'maker'`.

### 4. Workflow Store State Extensions
In `useWorkflowStore.ts`:
- Extend `WorkflowStatus` type with `'REJECTED_FINAL'`.
- Implement `rejectFinalAssessment(notes: string)`:
  - Transition status to `'REJECTED_FINAL'`.
  - Log audit event with action `'REJECT'`.
  - Set `currentAssignedRole = null` (document finalized as rejected).

## Risks / Trade-offs

- **[Risk] Test suites expecting 5 or 8 stages may fail** → Update test cases in `interactiveFlow.test.ts` and `workflowStore.test.ts` to assert 6 stages (standard) and 9 stages (escalated).
- **[Risk] Reviewer skipping stages directly to Stage 6/9** → The compact stepper allows free inspection, which matches real executive workflows where reviewers may jump between tabs before rendering their decision.
