export type PersonaId =
  | 'maker'
  | 'kabag'
  | 'kadiv'
  | 'rcsa'
  | 'kabag_mrk'
  | 'kadiv_mrk';

export interface PersonaProfile {
  id: PersonaId;
  name: string;
  roleTitle: string;
  department: string;
  badgeClass: string;
  canEditWhenCurrent: boolean;
}

export type WorkflowStatus =
  | 'DRAFT'
  | 'PENDING_KABAG'
  | 'PENDING_KADIV'
  | 'PENDING_RCSA'
  | 'PENDING_KABAG_MRK'
  | 'PENDING_KADIV_MRK'
  | 'APPROVED_FINAL'
  | 'REJECTED_REVISION'
  | 'REJECTED_FINAL';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  personaId: PersonaId;
  personaName: string;
  roleTitle: string;
  action: 'SUBMIT' | 'APPROVE' | 'REJECT_REVISION' | 'REJECT_FINAL' | 'CHALLENGE_EDIT' | 'RESET';
  fromStatus: WorkflowStatus;
  toStatus: WorkflowStatus;
  notes?: string;
}
