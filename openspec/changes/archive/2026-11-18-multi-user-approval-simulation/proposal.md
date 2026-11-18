# Proposal: Multi-User Approval Workflow Simulation & Compact Tracking Navigation

## Why
In enterprise governance and banking risk management, form submission is only the beginning: once submitted by the initiator (Maker), an assessment enters an organizational approval chain consisting of business unit heads and risk specialists. Each role possesses distinct permissions—supervisors (Kepala Bagian, Kepala Divisi) review and approve in read-only mode, whereas risk specialists (RCSA Officer, Kabag MRK) possess challenge/edit authority to adjust risk ratings and mitigation weights. Currently, the form lacks multi-user simulation and role-based permissions. Additionally, the existing 8-button stepper grid and 4-button preset toolbar consume substantial vertical viewport space; consolidating them into a compact segmented tracker and single scenario picker simplifies the user experience.

## What Changes
- **Persona / Role Switcher**: Provide an active persona selector in the header allowing simulation across 6 enterprise roles:
  1. `maker`: Staff Inisiator (Full create/edit permission prior to submit)
  2. `kabag`: Kepala Bagian Unit Pengusul (Read-only review + Approve/Reject notes)
  3. `kadiv`: Kepala Divisi Unit Pengusul (Read-only review + Approve/Reject notes)
  4. `rcsa`: RCSA Officer / Risk Specialist (Risk challenge mode: authorized to edit scoring/KRI + Approve)
  5. `kabag_mrk`: Kepala Bagian MRK (Deep mitigation review: authorized to edit Stages 6/7 + Approve)
  6. `kadiv_mrk`: Kepala Divisi MRK (Executive Sign-off: final authorization)
- **Role-Based Field Permissions (RBAC)**: Automatically lock inputs into read-only mode for view-only roles (`kabag`, `kadiv`, `kadiv_mrk`) while keeping fields interactive for editable roles (`maker`, `rcsa`, `kabag_mrk`).
- **Simulated Approval Action Bar & Audit Trail**: Add an approval decision banner at the bottom of the form for the reviewer whose turn it is, allowing them to Approve or Request Revision with notes, and display an audit timeline log.
- **LocalStorage Multi-Document Persistence**: Store assessments and workflow statuses in browser `localStorage`, allowing realistic handoffs when switching personas.
- **Compact Segmented Stepper & Preset Dropdown**: Replace the 8-button grid stepper with a sleek horizontal segmented progress bar and consolidate scenario presets into a single compact dropdown select in the header.

## Capabilities

### New Capabilities
- `role-approval-workflow`: Simulated enterprise multi-stage approval workflow with persona switching, role-based field permissions (view-only vs challenge/edit), approval actions (Approve/Reject with notes), audit trail logs, and LocalStorage persistence.
- `compact-tracking-navigation`: Streamlined horizontal segmented stepper tracker and single compact scenario preset dropdown.

### Modified Capabilities
<!-- None -->

## Impact
- **Stores**: `useRiskFormStore.ts` or new `useWorkflowStore.ts` tracking active persona, approval chain status, review notes, audit history, and document persistence.
- **Components**: `RiskStepperNav.vue`, `RiskFormWizard.vue`, `RiskWizardFooter.vue`, new `WorkflowActionBar.vue`, and new `RolePersonaSwitcher.vue`.
- **Form Fields**: Reactive `disabled` state binding across input components based on current persona edit permissions.
