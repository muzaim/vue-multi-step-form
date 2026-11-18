# Spec Delta

## Purpose

Standardizes Stage 1 intake fields to be identical across both Non-Fraud and Fraud assessment tracks, postponing all structural workflow differences to Stage 2 onward.

## ADDED Requirements

### Requirement: Uniform Stage 1 Intake Presentation
The system SHALL present the same set of general input fields (Track Selector, Risk Title, Risk Category, and Department) regardless of whether the user selects the Non-Fraud or Fraud track.

#### Scenario: Rendering uniform Stage 1 fields
- **WHEN** user views Stage 1 under either the Non-Fraud or Fraud track
- **THEN** system displays identical input fields for risk title, risk category, and department alongside the track selection control

### Requirement: Stage 2 Divergence Activation
The system SHALL activate track-specific components and validation schemas beginning strictly at Stage 2.

#### Scenario: Navigating from Stage 1 to Stage 2 on Fraud track
- **WHEN** user completes Stage 1 with Fraud track selected and clicks Next
- **THEN** system navigates to Stage 2 displaying the fraud modus operandi detection interface

#### Scenario: Navigating from Stage 1 to Stage 2 on Non-Fraud track
- **WHEN** user completes Stage 1 with Non-Fraud track selected and clicks Next
- **THEN** system navigates to Stage 2 displaying the operational risk identification interface
