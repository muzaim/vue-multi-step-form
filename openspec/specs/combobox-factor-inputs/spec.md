# combobox-factor-inputs Specification

## Purpose
Provides discrete combobox and dropdown select controls for inputting risk factor scores across all evaluation stages, replacing slider controls with clear numerical values and descriptive qualitative ratings.

## Requirements

### Requirement: Discrete Selection for Factor Scoring
The system SHALL provide select dropdown controls for all risk scoring factor inputs across both Non-Fraud and Fraud workflows instead of slider range controls.

#### Scenario: Selecting a factor score
- **WHEN** the user interacts with any score factor input in Stages 2, 3, 6, or 7
- **THEN** the system displays a dropdown list of discrete numerical options (1 to 10) with descriptive labels (e.g., "1 - Minimal", "3 - Low", "5 - Moderate", "7 - High", "10 - Critical")
- **THEN** selecting an option updates the underlying numeric score reactively

#### Scenario: Default and empty state validation
- **WHEN** a stage with required scoring factors is initialized
- **THEN** the combobox displays a placeholder or default score value
- **THEN** the user cannot advance past the stage if any required factor select remains unselected
