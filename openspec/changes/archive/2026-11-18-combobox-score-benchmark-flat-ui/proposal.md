# Proposal: Combobox Factor Inputs, Score Benchmark API & Flat Minimalist UI

## Why
Slider inputs (`<input type="range">`) can be imprecise and less enterprise-grade for operational risk assessment. Users require structured combobox/dropdown selections with clear numerical values and descriptive qualitative labels. Furthermore, raw numerical sub-scores (such as $A + B = C$, $D + E = F$, and Grand Totals) lack business meaning unless compared against benchmark criteria; an asynchronous benchmark API simulation is needed to classify scores into standard risk bands (`LOW`, `NORMAL`, `HIGH`, `CRITICAL`). Finally, the current UI is cluttered with heavy card borders, decorative icons, and gradient hero blocks, which distracts from data density; simplifying the design to a flat, clean, and professional layout improves clarity and data input speed.

## What Changes
- **Replace Sliders with Comboboxes**: Convert all range sliders across both Non-Fraud and Fraud tracks into discrete select dropdowns (values 1–10 with descriptive labels like "1 - Minimal", "3 - Low", "5 - Moderate", "7 - High", "10 - Critical").
- **Simulated Score Benchmark API**: Introduce `scoringApi.ts` simulating asynchronous network calls that evaluate calculated sub-scores and overall scores against dummy criteria, returning qualitative status bands (`LOW`, `NORMAL`, `HIGH`, `CRITICAL`) along with concise badge metadata.
- **Async Score Evaluation Integration**: Display benchmark ratings alongside reactive score computations in Stages 2, 3, 6, 7, and 8, with responsive loading/status indicators.
- **Flat Minimalist Form UI**: Remove decorative gradient banners, oversized icons, and heavy border cards. Adopt a clean, modern, flat enterprise layout with high legibility, clean borders, and clear typographic hierarchy.

## Capabilities

### New Capabilities
- `combobox-factor-inputs`: Discrete combobox/select inputs for risk factor scoring (replacing slider range inputs) across both Non-Fraud and Fraud tracks.
- `score-benchmark-api`: Asynchronous benchmark service simulating score evaluation against dummy benchmark thresholds, returning risk bands (`LOW`, `NORMAL`, `HIGH`, `CRITICAL`).
- `flat-minimalist-form-ui`: Clean, flat, uncluttered enterprise form interface removing unnecessary icons and heavy card aesthetics.

### Modified Capabilities
<!-- None: unified-stage1-intake remains unaffected -->

## Impact
- **Form Components**: `Step2RiskIdentification.vue`, `Step3RiskAssessment.vue`, `Step6DeepMitigation.vue`, `Step7BoardOversight.vue`, and their fraud counterparts (`FraudStep2Modus.vue`, `FraudStep3Loss.vue`, `FraudStep6Forensic.vue`, `FraudStep7LawEnforcement.vue`), as well as summary views (`Step5RiskSummary.vue`, `Step8ExecutiveApproval.vue`, and Fraud equivalents).
- **Services/API**: Add `src/features/risk-management/api/scoringApi.ts`.
- **Composables/Store**: Pinia store `riskFormStore.ts` and composables will support score benchmark evaluations.
- **Styling/UI**: Global form styles, input components, card containers, and stage wrappers simplified to flat presentation.
