# Technical Design: Multi-User Approval Workflow & Compact Navigation

## Context
See `proposal.md` for background and motivation. The system currently functions as a single-user data entry form. To simulate real enterprise three-lines-of-defense risk management without a backend database or OAuth server, we introduce a stateful client-side Persona Engine, Role-Based Access Control (RBAC) permission evaluation, and a LocalStorage-backed audit workflow.

## Goals / Non-Goals

### Goals
- Simulate an authentic 6-role organizational workflow:
  1. `maker` (Staff Inisiator - Maker)
  2. `kabag` (Kepala Bagian - Reviewer 1)
  3. `kadiv` (Kepala Divisi - Reviewer 2)
  4. `rcsa` (RCSA Officer / Risk Specialist - Challenge & Edit Scoring)
  5. `kabag_mrk` (Kabag Manajemen Risiko Korporasi - Review & Edit Mitigasi)
  6. `kadiv_mrk` (Kadiv Manajemen Risiko Korporasi - Final Sign-off)
- Enforce strict role-based field permissions: `kabag` & `kadiv` operate in read-only mode, whereas `rcsa` and `kabag_mrk` can challenge/edit scores before approving.
- Persist document state, review comments, and an immutable audit trail in `localStorage`.
- Streamline UI navigation: replace large multi-row step buttons with a sleek horizontal segmented stepper and consolidate presets into a single compact select dropdown.

### Non-Goals
- Real backend API or multi-browser WebSockets (all personas are simulated within the same client session).
- Arbitrary custom dynamic workflow builders (fixed realistic enterprise chain).

## Decisions

### 1. Dedicated Workflow Store (`useWorkflowStore.ts`)
- **Decision**: Create a dedicated Pinia store `useWorkflowStore` managing:
  - `activePersona`: Currently selected role
  - `workflowStatus`: `DRAFT` | `PENDING_KABAG` | `PENDING_KADIV` | `PENDING_RCSA` | `PENDING_KABAG_MRK` | `PENDING_KADIV_MRK` | `APPROVED_FINAL` | `REJECTED_REVISION`
  - `auditTrail`: Array of `{ timestamp, personaName, role, action, notes }`
  - `documentId`: Unique simulated document reference number (e.g. `RCSA-2026-0881`)
- **Rationale**: Isolates workflow state and approval lifecycle from raw form field data in `useRiskFormStore`, maintaining clean separation of concerns.

### 2. Reactive Permission Matrix (`isFieldEditable`)
- **Decision**: Expose a global reactive computed `isFieldEditable`:
  - `true` if document is `DRAFT` and persona is `maker`.
  - `true` if document is `PENDING_RCSA` and persona is `rcsa` (allows editing score factors & KRI).
  - `true` if document is `PENDING_KABAG_MRK` and persona is `kabag_mrk` (allows editing deep mitigation).
  - `false` for `kabag`, `kadiv`, `kadiv_mrk` or when viewing an already approved document.
- **Rationale**: Form fields inject or read `isFieldEditable` without needing custom prop drilling in each step component.

### 3. LocalStorage Persistence Engine
- **Decision**: Save complete snapshot (`formData`, `fraudData`, `workflowStatus`, `auditTrail`) under `localStorage` key `vue_risk_workflow_v1`. On page load, initialize from storage if present, with a "Reset Document" button to start fresh.
- **Rationale**: Provides instant realism: user submits as Maker, switches persona to Kabag, and Kabag immediately sees the exact submitted document in read-only mode.

### 4. Compact Segmented Stepper & Compact Preset Picker
- **Decision**:
  - Stepper: Replace 8 button cards with a horizontal segmented progress bar (`Stage X of Y &bull; Title`) and slim clickable step indicators.
  - Presets: Move 4 scenario buttons into a clean `<select>` control in the top bar (`[ Preset Skenario: Pilih Skenario ▾ ]`).
- **Rationale**: Frees up vertical real estate and focuses user attention on the form fields.

## Risks / Trade-offs

- **[Field Disabling Completeness]** → Mitigation: Ensure all form field inputs (`TextInput`, `SelectInput`, `ScoreSelectInput`, `TextAreaInput`) properly respect the global disabled/readonly flag when `!isFieldEditable`.
- **[Accidental State Lockout]** → Mitigation: Always provide a "Reset Document / Mulai Baru" button in the persona bar so the user can easily reset to clean state at any time.
