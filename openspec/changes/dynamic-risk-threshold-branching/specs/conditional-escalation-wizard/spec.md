# Spec Delta

## Purpose

Provides adaptive branching logic and cross-stage reactive score calculations that escalate a standard five-stage wizard into an eight-stage enterprise governance workflow when risk thresholds are exceeded.

## ADDED Requirements

### Requirement: Cross-Stage Sub-score Calculations
The system SHALL compute sub-scores reactively across form stages based on user inputs in prior stages.

#### Scenario: Computing Stage 2 sub-score
- **WHEN** user inputs factor A and factor B in Stage 2
- **THEN** system reactively computes sub-score C as the sum of factor A and factor B

#### Scenario: Computing Stage 3 sub-score
- **WHEN** user inputs factor D and factor E in Stage 3
- **THEN** system reactively computes sub-score F as the sum of factor D and factor E

### Requirement: Threshold Evaluation Gate at Stage 5
The system SHALL evaluate the aggregated gate score at Stage 5 against a defined threshold of 15 points to determine the completion boundary.

#### Scenario: Score below threshold completes at Stage 5
- **WHEN** user reaches Stage 5 and the aggregated gate score is less than 15
- **THEN** system displays Stage 5 as the final stage and enables final submission without additional stages

#### Scenario: Score meeting or exceeding threshold triggers escalation
- **WHEN** user reaches Stage 5 and the aggregated gate score is 15 or greater
- **THEN** system marks the assessment as escalated, expands the stepper to 8 total stages, and requires advancement to Stage 6

### Requirement: Dynamic Stepper Escalation
The system SHALL dynamically adjust the stepper navigation and progress indicators according to whether escalation is active.

#### Scenario: Stepper UI reflects 8 stages upon escalation
- **WHEN** escalation is active
- **THEN** system displays 8 stages in the navigation breadcrumbs and calculates progress percentage based on 8 total stages

### Requirement: Cumulative Risk Grand Total Calculation
The system SHALL calculate a cumulative grand total score in Stage 8 aggregating sub-scores from all stages prior to final submission.

#### Scenario: Calculating grand cumulative score in Stage 8
- **WHEN** user completes stages 6 and 7 and arrives at Stage 8
- **THEN** system presents the grand total score summing sub-scores from Stage 2, Stage 3, Stage 6, and Stage 7
