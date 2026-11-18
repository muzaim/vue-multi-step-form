# Spec Delta

## Purpose

Enables dynamic switching between Non-Fraud and Fraud assessment tracks at Stage 1, dynamically altering the step configuration, schemas, and UI components for stages 2 through 8.

## ADDED Requirements

### Requirement: Assessment Track Selection at Stage 1
The system SHALL provide an explicit option at Stage 1 to select between Non-Fraud Risk Assessment and Fraud Risk Assessment.

#### Scenario: Selecting fraud assessment track
- **WHEN** user selects the Fraud track in Stage 1
- **THEN** system switches subsequent steps (Stage 2 through 8) to use fraud-specific labels, fields, and calculations

#### Scenario: Selecting non-fraud assessment track
- **WHEN** user selects the Non-Fraud track in Stage 1
- **THEN** system switches subsequent steps (Stage 2 through 8) to use operational risk labels, fields, and calculations

### Requirement: Independent State and Field Isolation
The system SHALL maintain isolated state and validation rules for each track while strictly enforcing two to four fields per stage across both tracks.

#### Scenario: Validating active track fields
- **WHEN** user navigates or submits a stage
- **THEN** system applies validation rules corresponding to the active assessment track without cross-track interference
