# Spec Delta

## Purpose

Provides a structured multi-stage wizard interface for entering, validating, and submitting comprehensive enterprise risk management assessments.

## ADDED Requirements

### Requirement: Linear Stage Progression
The system SHALL enforce a strict linear progression across all form stages, requiring successful validation of the current stage before allowing the user to navigate to the subsequent stage.

#### Scenario: Advancing to next stage with valid data
- **WHEN** user clicks "Next Stage" and all required fields in the current stage satisfy validation rules
- **THEN** system advances the wizard to the next stage and updates progress indicator

#### Scenario: Attempting to advance with invalid data
- **WHEN** user clicks "Next Stage" and one or more fields in the current stage are invalid or empty
- **THEN** system prevents stage progression and displays inline validation error messages on invalid fields

### Requirement: Backward Navigation Freedom
The system SHALL permit the user to navigate back to previous stages at any time without triggering validation barriers.

#### Scenario: Navigating back to previous stage
- **WHEN** user clicks "Previous" button from any stage beyond stage 1
- **THEN** system navigates back to the immediately preceding stage preserving previously entered data

### Requirement: Centralized State Management
The system SHALL maintain all risk assessment input fields across all stages in a unified reactive global state.

#### Scenario: Preserving field inputs across stage switching
- **WHEN** user inputs data in Stage 1, navigates to Stage 2, and returns to Stage 1
- **THEN** system retains and displays all previously entered Stage 1 inputs

### Requirement: Review Summary and Final Submission
The system SHALL provide a final review stage summarizing all entered data and validate the entire dataset upon submission.

#### Scenario: Successful final assessment submission
- **WHEN** user reaches the review stage and clicks "Submit Assessment" with valid complete data
- **THEN** system submits the complete risk assessment payload to the API and displays submission confirmation

#### Scenario: Submission error handling
- **WHEN** API submission fails due to network or server error
- **THEN** system notifies the user of failure and allows retry without resetting filled data
