# Enterprise Risk Management & Fraud Investigation Multi-Step Form

A production-grade, enterprise multi-step form architecture built with **Vue 3**, **Vite**, **TypeScript**, **Tailwind CSS**, **Pinia**, and **Zod**.

This application demonstrates modern enterprise frontend patterns including dual-track governance routing, dynamic risk threshold branching (5 vs 8 intake stages + dedicated approval stage), 5-tier role-based access control (RBAC) with HTML5 declarative fieldset cascade, discrete scoring comboboxes with blank-state placeholders, and asynchronous scoring benchmark evaluation.

---

## Architectural Highlights

### 1. Dual-Track Governance Workflow
The form provides a unified intake at **Stage 1** that dynamically routes users into one of two dedicated governance tracks starting from Stage 2:
- **Non-Fraud Operational Risk Track**: Focuses on operational disruptions, cloud/IT infrastructure outages, vendor SLA breaches, and corporate compliance.
- **Fraud & Financial Crime Track**: Focuses on internal fraud indicators, modus operandi detection, digital evidence containment, forensic auditing, and law enforcement escalation.

### 2. Threshold-Based Dynamic Branching
Rather than a rigid linear wizard, the workflow evaluates risk severity at an intermediate evaluation gate (**Stage 5**):
- **Stage 2 Calculation**: $\text{Factor A} + \text{Factor B} = \text{Sub-score C}$ (Threat / Modus Severity).
- **Stage 3 Calculation**: $\text{Factor D} + \text{Factor E} = \text{Sub-score F}$ (Financial & Regulatory Exposure).
- **Stage 5 Evaluation Gate**: The system computes $\text{Gate Score} = \text{Sub-score C} + \text{Sub-score F}$.
  - **Score < 15 Points (Standard)**: Treated as acceptable risk or internal disciplinary resolution. The intake completes at Stage 5, followed by the dedicated Stage 6 Approval.
  - **Score $\ge$ 15 Points (Escalated)**: Automatically expands the workflow from 5 to 8 intake stages, requiring deep mitigation / forensic audit (Stage 6), board oversight / law enforcement disclosure (Stage 7), and executive sign-off with grand cumulative scoring (Stage 8), followed by the dedicated Stage 9 Approval.

### 3. Dedicated Approval Stage & 5-Tier RBAC State Machine
Approval and review are decoupled from data entry into a **dedicated terminal stage** ([StepApprovalGovernance.vue](file:///Users/syafrisurya/project/belajar/vue-multi-step-form/src/features/risk-management/components/steps/StepApprovalGovernance.vue)):
- **Stage 6**: Approval stage for the Standard (5-stage) intake flow.
- **Stage 9**: Approval stage for the Escalated (8-stage) intake flow.

#### Multi-Persona Switcher & RBAC Roles:
The application features a top persona switcher bar simulating 6 real-world corporate personas:
1. **Maker (Staff Inisiator)**: Full edit rights when status is `DRAFT` or `REJECTED_REVISION`.
2. **Kepala Bagian (Reviewer 1)**: Reviews submission; can approve or request revision.
3. **Kepala Divisi (Reviewer 2)**: Secondary management sign-off.
4. **RCSA Specialist (Risk Challenger)**: Enterprise Risk Officer with permission to challenge and adjust scoring metrics during `PENDING_RCSA`.
5. **Kabag MRK (Risk Reviewer)**: Corporate Risk Management head with edit permissions on mitigation parameters.
6. **Kadiv MRK (Executive Sign-Off)**: Final executive approver.

#### Declarative Global Fieldset Cascade:
Forms enforce read-only state without prop drilling. The wizard container wraps active step components inside:
```html
<fieldset :disabled="!workflowStore.isFieldEditable" class="contents">
  <component :is="currentStepComponent" :errors="stepErrors" />
</fieldset>
```
Standard HTML5 fieldset inheritance automatically disables all nested `<input>`, `<select>`, and `<textarea>` elements across all stages when a reviewer is logged in.

### 4. Discrete Combobox Factor Scoring & Clean Blank State
Slider controls are replaced with discrete `<select>` comboboxes ([ScoreSelectInput.vue](file:///Users/syafrisurya/project/belajar/vue-multi-step-form/src/components/ui/ScoreSelectInput.vue)):
- Values range discretely from `1` to `10` with descriptive qualitative labels (e.g. *1 - Minimal*, *5 - Moderate*, *10 - Critical*).
- **Clean Initial State**: Forms initialize with factors defaulting to `0`, displaying a disabled placeholder `-- Pilih Skor Faktor (1 - 10) --` and a neutral badge `Factor: Belum dipilih`.
- **Validation Guard**: Zod schemas enforce `.min(1).max(10)`, preventing advancing until the user explicitly selects a valid factor score.

### 5. Decoupled Asynchronous Master Data & Scoring Benchmark API
- `masterDataApi.ts`: Simulates asynchronous REST lookups for departments, risk categories, and law enforcement agencies with reactive caching in `useMasterData.ts`.
- `scoringApi.ts`: Asynchronously evaluates sub-scores, gate scores, and grand total scores against risk benchmark matrices to return qualitative badges (Low, Medium, High, Critical) and regulatory recommendations.

### 6. Strict Type Safety & Automated Unit Testing
- 100% typed with TypeScript interfaces for forms, steps, and RBAC states.
- Client-side validation via track-aware Zod schemas.
- 16 unit and integration test suites executed with Node.js native test runner (`tests/interactiveFlow.test.ts`, `tests/storeCalculations.test.ts`, `tests/workflowStore.test.ts`, `tests/scoringApi.test.ts`).

---

## Project Structure

```
src/
├── components/
│   └── ui/                               # Shared reusable UI primitives
│       ├── FormField.vue                 # Label, error text, and hint wrapper
│       ├── TextInput.vue                 # Text and number input field
│       ├── SelectInput.vue               # Dynamic dropdown with loading support
│       ├── ScoreSelectInput.vue          # Discrete factor score combobox (1-10)
│       └── TextAreaInput.vue             # Multiline text field
└── features/
    └── risk-management/
        ├── api/
        │   ├── masterDataApi.ts          # Master data lookup service (Categories, Depts, Agencies)
        │   ├── scoringApi.ts             # Scoring benchmark rating API
        │   └── riskApi.ts                # Draft saving and final submission API
        ├── composables/
        │   ├── useMasterData.ts          # Master data state and caching
        │   └── useRiskWizard.ts          # Core wizard navigation, step history, and error clearing
        ├── schemas/
        │   ├── riskValidation.ts         # Zod schemas for general and non-fraud stages
        │   └── fraudValidation.ts        # Zod schemas for fraud track stages
        ├── stores/
        │   ├── useRiskFormStore.ts       # Pinia store managing form data, zero defaults, and score formulas
        │   └── useWorkflowStore.ts       # Pinia store managing RBAC personas, status transitions, and audit trails
        ├── types/
        │   ├── risk.types.ts             # TypeScript contracts for non-fraud assessment
        │   ├── fraud.types.ts            # TypeScript contracts for fraud investigation
        │   └── workflow.types.ts         # TypeScript contracts for RBAC personas and audit logs
        └── components/
            ├── RiskFormWizard.vue        # Wizard orchestrator, fieldset cascade, and dynamic step loader
            ├── RiskStepperNav.vue        # Adaptive segmented progress stepper (6 vs 9 stages)
            ├── RiskWizardFooter.vue      # Action buttons (Previous, Next, Save Draft, Submit)
            ├── RolePersonaSwitcher.vue   # Top interactive persona selector bar
            ├── WorkflowDecisionBar.vue   # Action bar for reviewers (Approve, Revision, Reject)
            └── steps/
                ├── Step1GeneralInfo.vue          # Unified Stage 1 intake form
                ├── StepApprovalGovernance.vue    # Dedicated terminal Approval & Audit stage
                ├── non-fraud/                    # Stages 2 through 8 for operational risk
                │   ├── Step2RiskIdentification.vue
                │   ├── Step3RiskAssessment.vue
                │   ├── Step4MitigationPlan.vue
                │   ├── Step5ReviewSubmit.vue
                │   ├── Step6DeepMitigation.vue
                │   ├── Step7BoardOversight.vue
                │   └── Step8ExecutiveSignOff.vue
                └── fraud/                        # Stages 2 through 8 for fraud investigation
                    ├── FraudStep2Modus.vue
                    ├── FraudStep3Loss.vue
                    ├── FraudStep4Containment.vue
                    ├── FraudStep5Gate.vue
                    ├── FraudStep6Forensic.vue
                    ├── FraudStep7LawEnforcement.vue
                    └── FraudStep8BoardSanction.vue
```

---

## Getting Started

### Prerequisites
- Node.js (v18.0 or higher recommended)
- npm, pnpm, or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/muzaim/vue-multi-step-form.git
   cd vue-multi-step-form
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Run unit and integration tests:
   ```bash
   npm run test:unit
   ```

5. Typecheck and build for production:
   ```bash
   npm run build
   ```

---

## Interactive Demo Scenarios

The application includes four preset scenarios located in the top bar (`Autofill Skenario:`) for rapid testing:

1. **Non-Fraud Low Risk**: Fills operational parameters yielding a Gate Score of 10 (< 15). The stepper displays 6 stages (5 data intake + 1 approval).
2. **Non-Fraud Critical Risk**: Fills high-severity infrastructure incident data yielding a Gate Score of 32 ($\ge$ 15). The stepper dynamically expands to 9 stages (8 data intake + 1 approval).
3. **Fraud Low Severity**: Fills an internal petty cash reimbursement dispute yielding a Gate Score of 9 (< 15), completing with internal disciplinary review.
4. **Fraud Critical Incident**: Fills a multi-billion vendor collusion case yielding a Gate Score of 33 ($\ge$ 15), activating asset tracing, law enforcement reporting, and board termination decrees.

---

## License

MIT
