# Spec Delta: Role Approval Workflow

## MODIFIED Requirements

### Requirement: Role Persona Switching
The system SHALL provide a persona switcher allowing the user to simulate actions from 6 distinct governance roles (`maker`, `kabag`, `kadiv`, `rcsa`, `kabag_mrk`, `kadiv_mrk`), routing the user to Stage 1 upon switching to a reviewer persona to inspect the assessment from the beginning.

#### Scenario: Switching persona
- **WHEN** the user selects a different persona from the role switcher dropdown
- **THEN** the system updates the active role state reactively
- **THEN** field edit permissions, available approval actions, and workflow banners update immediately
- **THEN** if switching from a submission confirmation screen or to a supervisory reviewer, navigation is reset to Stage 1

### Requirement: Approval Decision and Audit Trail
The system SHALL provide a dedicated final stage (Stage 6 for standard 5-stage workflows, or Stage 9 for 8-stage escalated workflows) hosting governance decision actions (Approve, Request Revision, and Reject), recording each decision into an immutable audit trail.

#### Scenario: Approving an assessment
- **WHEN** the active persona whose turn it is navigates to the final approval stage and submits an approval decision with notes
- **THEN** the system advances the document status to the next stage in the approval chain
- **THEN** an audit event timestamped with persona name, role, decision, and notes is appended to the audit trail
- **THEN** the updated assessment and audit history are persisted to LocalStorage

#### Scenario: Requesting revision from reviewer
- **WHEN** the active reviewer on the approval stage submits a revision request with mandatory notes
- **THEN** the document status reverts to `REJECTED_REVISION` and is reassigned to the maker
- **THEN** when maker logs in, form editing is unlocked and the revision reason is displayed

#### Scenario: Rejecting an assessment permanently
- **WHEN** an active reviewer submits a rejection decision with mandatory reason notes
- **THEN** the document status transitions to `REJECTED_FINAL`
- **THEN** all subsequent editing and approvals are locked permanently and recorded in audit log
