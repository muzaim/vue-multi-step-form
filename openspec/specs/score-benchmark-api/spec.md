# score-benchmark-api Specification

## Purpose
Simulates asynchronous evaluation of calculated sub-scores and aggregate risk metrics against criteria benchmark datasets, classifying numeric scores into standardized risk bands.

## Requirements

### Requirement: Benchmark Evaluation for Calculated Scores
The system SHALL evaluate calculated sub-scores and aggregate scores asynchronously against a simulated benchmark API and return qualitative classification bands (`LOW`, `NORMAL`, `HIGH`, `CRITICAL`).

#### Scenario: Sub-score benchmark evaluation
- **WHEN** factor inputs in Stage 2 or Stage 3 are selected or modified
- **THEN** the system calculates the sub-score ($A + B = C$ or $D + E = F$) and asynchronously queries the scoring benchmark service
- **THEN** the system displays the benchmark status band (`LOW`, `NORMAL`, `HIGH`, `CRITICAL`) with its associated descriptive indicator next to the score

#### Scenario: Aggregate gate score benchmark evaluation
- **WHEN** Stage 4 evaluates the gate score ($C + F$)
- **THEN** the system asynchronously evaluates the combined score against the benchmark service
- **THEN** the system surfaces the benchmark tier and confirms whether the risk score warrants 5-stage standard closure or 8-stage extended escalation

#### Scenario: Fallback and simulated delay handling
- **WHEN** the benchmark evaluation query is in-flight
- **THEN** the UI displays a subtle non-blocking status indicator (e.g. evaluating status) without freezing user interaction
- **THEN** the evaluation resolves within standard simulated latency (e.g. 150ms-300ms) with deterministic rating bands
