# Spec Delta: Compact Tracking Navigation

## Purpose
Provides a clean, streamlined horizontal segmented stepper tracker and single compact scenario preset select dropdown, optimizing vertical screen space.

## ADDED Requirements

### Requirement: Segmented Horizontal Stepper Tracker
The system SHALL present form stage progress using a concise horizontal segmented bar displaying current stage title, completion percentage, and clickable segment indicators.

#### Scenario: Navigating via segmented tracker
- **WHEN** the user views or clicks completed segments in the segmented stepper
- **THEN** the system navigates to the selected stage without consuming full-width multi-row button grids
- **THEN** the current active stage name and progress percentage are prominently visible

### Requirement: Compact Scenario Preset Picker
The system SHALL consolidate demo scenario pre-fills into a single compact select dropdown control in the control bar.

#### Scenario: Selecting a demo scenario
- **WHEN** the user selects a scenario preset from the compact dropdown (e.g. Non-Fraud Low Risk, Non-Fraud Critical, Fraud Low, Fraud Critical)
- **THEN** the form data is prefilled immediately and navigation resets to Stage 1
- **THEN** the active track and gate escalation status update reactively
