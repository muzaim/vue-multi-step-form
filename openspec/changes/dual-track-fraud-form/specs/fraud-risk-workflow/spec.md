# Spec Delta

## Purpose

Enables a specialized enterprise fraud risk assessment workflow covering modus operandi detection, loss exposure, immediate containment, and threshold-based escalation to criminal investigation.

## ADDED Requirements

### Requirement: Modus Operandi and Red Flag Detection
The system SHALL capture fraud modus operandi descriptions and compute Sub-score C based on anomaly frequency and opportunity exploitation complexity.

#### Scenario: Computing fraud threat sub-score C
- **WHEN** user inputs Factor A (Frequency) and Factor B (Exploitation Ease) in Stage 2
- **THEN** system calculates Sub-score C as the sum of Factor A and Factor B

### Requirement: Fraud Loss Exposure and Categorization
The system SHALL categorize fraud exposure using master data categories and compute Sub-score F based on financial loss weight and regulatory penalty severity.

#### Scenario: Computing fraud loss sub-score F
- **WHEN** user inputs Factor D (Direct Loss) and Factor E (Regulatory Exposure) in Stage 3
- **THEN** system calculates Sub-score F as the sum of Factor D and Factor E

### Requirement: Immediate Asset Containment
The system SHALL record immediate containment actions, digital evidence status from master data, and allocated forensic investigation budget.

#### Scenario: Recording asset containment action
- **WHEN** user submits containment parameters in Stage 4
- **THEN** system validates that containment action, evidence status, and budget are non-empty and non-negative

### Requirement: Fraud Evaluation Gate Threshold
The system SHALL evaluate the cumulative gate score (Sub-score C + Sub-score F) against an escalation threshold of 15 points.

#### Scenario: Gate score under threshold completes at Stage 5
- **WHEN** cumulative gate score is strictly less than 15 in Stage 5
- **THEN** system marks the assessment as internal disciplinary resolution and enables final submission at Stage 5

#### Scenario: Gate score reaching or exceeding threshold unlocks Stage 6 to 8
- **WHEN** cumulative gate score is 15 or greater in Stage 5
- **THEN** system escalates the assessment to criminal investigation and unlocks Stage 6, 7, and 8

### Requirement: Deep Forensic Audit and Asset Tracing
The system SHALL require an asset tracing plan, calculate Sub-score G from forensic difficulty and recovery probability, and require mandatory approval from Chief Forensic Auditor.

#### Scenario: Validating Stage 6 forensic escalation
- **WHEN** user completes Stage 6 inputs with Chief Forensic Auditor approval
- **THEN** system calculates Sub-score G and allows progression to Stage 7

### Requirement: Law Enforcement Disclosure and Board Sanction
The system SHALL capture law enforcement agency reporting, compute Sub-score H, and calculate the Grand Total Fraud Cumulative Score in Stage 8 before final executive sign-off.

#### Scenario: Computing Grand Total Fraud Score in Stage 8
- **WHEN** user reaches Stage 8 of the escalated fraud track
- **THEN** system displays the grand cumulative total score (C + F + G + H) and validates decree number and legal director sign-off
