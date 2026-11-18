# Spec Delta

## Purpose

Enables decoupled asynchronous retrieval of master data options and standardizes streamlined form stages containing two to four focused fields each.

## ADDED Requirements

### Requirement: Asynchronous Master Data Options Retrieval
The system SHALL retrieve master data dropdown options via dedicated asynchronous services and provide loading states during data resolution.

#### Scenario: Fetching master data options asynchronously
- **WHEN** user opens a stage containing master data dropdowns
- **THEN** system fetches options from the master data service, displays a placeholder during loading, and populates options once resolved

#### Scenario: Handling master data fetch failure
- **WHEN** master data service encounters a network error
- **THEN** system sets an error state and allows manual reload without crashing the form component

### Requirement: Simplified 2-4 Fields per Form Stage
The system SHALL limit each form stage to between two and four concise, focused fields while preserving the cross-stage calculation and branching escalation flow.

#### Scenario: Rendering simplified stage fields
- **WHEN** user views any stage in the wizard
- **THEN** system displays no fewer than 2 and no more than 4 form fields relevant to that stage's objective

### Requirement: Decoupled Template Presentation
The system SHALL isolate component templates from data fetching logic and static option arrays, binding dropdowns exclusively to composable master data streams.

#### Scenario: Selecting dropdown option from asynchronous stream
- **WHEN** user selects an option in a master data dropdown
- **THEN** system updates the selected value in the centralized Pinia store without hardcoded option definitions in the template
