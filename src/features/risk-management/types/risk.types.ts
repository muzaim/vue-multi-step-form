export type RiskCategory = 'operational' | 'financial' | 'cybersecurity' | 'compliance' | 'reputational' | '';
export type OperationalImpact = 'negligible' | 'moderate' | 'severe' | 'catastrophic' | '';
export type TreatmentStrategy = 'avoid' | 'mitigate' | 'transfer' | 'accept' | '';

// Stage 1: General Information (3 fields)
export interface GeneralInfoStage {
  riskTitle: string;
  riskCategory: RiskCategory;
  department: string;
}

// Stage 2: Risk Identification & Threats (3 fields + computed C)
export interface RiskIdentificationStage {
  threatDescription: string;
  factorA: number; // Threat Frequency (1 - 10)
  factorB: number; // Vulnerability Ease (1 - 10)
  subScoreC: number; // computed: factorA + factorB
}

// Stage 3: Risk Assessment & Impacts (3 fields + computed F)
export interface RiskAnalysisStage {
  operationalImpact: OperationalImpact;
  factorD: number; // Financial Loss Weight (1 - 10)
  factorE: number; // Regulatory Penalty Severity (1 - 10)
  subScoreF: number; // computed: factorD + factorE
}

// Stage 4: Mitigation Strategy (3 fields)
export interface MitigationPlanStage {
  actionPlanTitle: string;
  treatmentStrategy: TreatmentStrategy;
  allocatedBudget: number;
}

// Stage 5: Review & Gate Evaluation (2 fields + computed Gate Score)
export interface ReviewSignOffStage {
  monitoringMetricKRI: string;
  complianceSignOff: string;
  gateScore: number; // computed: subScoreC + subScoreF
  isEscalated: boolean; // computed: gateScore >= 15
}

// Stage 6: Deep Mitigation Action Plan (Escalated - 4 fields + computed G)
export interface DeepMitigationStage {
  escalatedActionPlan: string;
  factorG1: number; // Mitigation Cost Weight (1 - 10)
  factorG2: number; // Execution Complexity (1 - 10)
  subScoreG: number; // computed: factorG1 + factorG2
  chiefRiskOfficerApproved: boolean;
}

// Stage 7: Board Oversight & Governance (Escalated - 3 fields + computed H)
export interface BoardOversightStage {
  boardCommitteeName: string;
  factorH1: number; // Board Oversight Rigor (1 - 10)
  factorH2: number; // Audit Scrutiny Level (1 - 10)
  subScoreH: number; // computed: factorH1 + factorH2
}

// Stage 8: Executive Enterprise Sign-off (Escalated Final - 2 fields + Grand Total)
export interface ExecutiveSignOffStage {
  boardResolutionNumber: string;
  ceoSignOff: string;
  grandCumulativeRiskScore: number; // computed: c + f + g + h
}

export interface RiskFormData {
  general: GeneralInfoStage;
  identification: RiskIdentificationStage;
  analysis: RiskAnalysisStage;
  mitigation: MitigationPlanStage;
  review: ReviewSignOffStage;
  deepMitigation: DeepMitigationStage;
  boardOversight: BoardOversightStage;
  executiveSignOff: ExecutiveSignOffStage;
}

export interface StepConfig {
  id: number;
  key: string;
  title: string;
  subtitle: string;
  isEscalatedStep?: boolean;
}
