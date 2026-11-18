# Enterprise Risk Management & Fraud Investigation Multi-Step Form

A production-grade multi-step form architecture built with Vue 3, TypeScript, Tailwind CSS, Pinia, and Zod. The application demonstrates real-world enterprise patterns including dynamic multi-stage branching, live cross-stage calculations, decoupled asynchronous master data services, and dual-track risk governance.

---

## Architectural Highlights

### 1. Dual-Track Governance Workflow
The form provides a unified intake at Stage 1 that dynamically routes users into one of two dedicated governance tracks starting from Stage 2:
- **Non-Fraud Risk Track**: Focuses on operational risks, IT infrastructure failures, vendor SLA breaches, and corporate compliance.
- **Fraud & Financial Crime Track**: Focuses on internal fraud indicators, modus operandi detection, digital evidence containment, forensic auditing, and law enforcement escalation.

### 2. Threshold-Based Dynamic Branching
Rather than a rigid linear wizard, the workflow evaluates risk severity at an intermediate evaluation gate (Stage 5):
- **Stage 2 Calculation**: $\text{Factor A} + \text{Factor B} = \text{Sub-score C}$ (Threat / Modus Severity).
- **Stage 3 Calculation**: $\text{Factor D} + \text{Factor E} = \text{Sub-score F}$ (Financial & Regulatory Exposure).
- **Stage 5 Evaluation Gate**: The system computes $\text{Gate Score} = \text{Sub-score C} + \text{Sub-score F}$.
  - **Score < 15 Points**: Treated as acceptable risk or internal disciplinary resolution. The form completes and submits directly at Stage 5.
  - **Score >= 15 Points**: Automatically expands the workflow from 5 to 8 stages, requiring deep mitigation / forensic audit (Stage 6), board oversight / law enforcement disclosure (Stage 7), and executive sign-off with grand cumulative scoring (Stage 8).

### 3. Decoupled Master Data Layer
Dropdown choices are not hardcoded inside component templates. The application strictly decouples presentation from data fetching:
- `masterDataApi.ts`: Pure TypeScript service simulating asynchronous REST endpoints with network latency.
- `useMasterData.ts`: Composable managing reactive option state, request caching, and loading flags.
- UI components consume options via reactive streams and display placeholder loading states without blocking page interaction.

### 4. Focused Form Stages (2 to 4 Fields per Stage)
Every stage is designed around 2 to 4 high-impact fields. This prevents bloated single-file components, keeps template code under 100 lines per file, and maintains readability.

### 5. Strict Type Safety and Schema Validation
- All data models are backed by strict TypeScript interfaces.
- Client-side validation is powered by Zod schemas with localized validation messages and track-aware execution.

---

## Project Structure

```
src/
├── components/
│   └── ui/                          # Shared reusable UI primitives
│       ├── FormField.vue            # Label, error text, and hint wrapper
│       ├── TextInput.vue            # Text and number input field
│       ├── SelectInput.vue          # Dynamic dropdown with loading support
│       └── TextAreaInput.vue        # Multiline text field
└── features/
    └── risk-management/
        ├── api/
        │   ├── masterDataApi.ts     # Master data lookup service (Categories, Depts, Agencies)
        │   └── riskApi.ts           # Draft saving and final submission API
        ├── composables/
        │   ├── useMasterData.ts     # Composable for master data state and caching
        │   └── useRiskWizard.ts     # Core wizard navigation, step history, and error clearing
        ├── schemas/
        │   ├── riskValidation.ts    # Zod schemas for general and non-fraud stages
        │   └── fraudValidation.ts   # Zod schemas for fraud track stages
        ├── stores/
        │   └── useRiskFormStore.ts  # Pinia store managing track state and reactive score formulas
        ├── types/
        │   ├── risk.types.ts        # TypeScript contracts for non-fraud assessment
        │   └── fraud.types.ts       # TypeScript contracts for fraud investigation
        └── components/
            ├── RiskFormWizard.vue   # Wizard container, header, demo helpers, and dynamic step loader
            ├── RiskStepperNav.vue   # Progress bar and adaptive step indicator (5 vs 8 stages)
            ├── RiskWizardFooter.vue # Action buttons (Previous, Next, Save Draft, Submit)
            └── steps/
                ├── Step1GeneralInfo.vue     # Unified Stage 1 intake form
                ├── non-fraud/               # Stages 2 through 8 for operational risk
                │   ├── Step2RiskIdentification.vue
                │   ├── Step3RiskAssessment.vue
                │   ├── Step4MitigationPlan.vue
                │   ├── Step5ReviewSubmit.vue
                │   ├── Step6DeepMitigation.vue
                │   ├── Step7BoardOversight.vue
                │   └── Step8ExecutiveSignOff.vue
                └── fraud/                   # Stages 2 through 8 for fraud investigation
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

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## Interactive Demo Scenarios

The application includes four preset scenarios located in the top bar of the interface for immediate testing:

1. **Non-Fraud Low Risk**: Fills operational parameters yielding a Gate Score of 10 (< 15). The stepper displays 5 total stages, allowing completion and submission directly at Stage 5.
2. **Non-Fraud Critical Risk**: Fills high-severity infrastructure incident data yielding a Gate Score of 32 (>= 15). The stepper dynamically expands to 8 stages, unlocking deep mitigation and board oversight.
3. **Fraud Low Severity**: Fills an internal petty cash reimbursement dispute yielding a Gate Score of 9 (< 15), resolved via internal disciplinary review at Stage 5.
4. **Fraud Critical Incident**: Fills a multi-billion vendor collusion case yielding a Gate Score of 33 (>= 15), activating asset tracing, law enforcement reporting, and board termination decrees up to Stage 8.

---

## License

MIT
