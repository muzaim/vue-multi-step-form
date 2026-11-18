export type AssessmentType = 'non_fraud' | 'fraud';

// Stage 1: Intake & Classification (Khusus Fraud)
export interface FraudGeneralInfoStage {
  caseTitle: string;
  reportedDepartment: string;
}

// Stage 2: Modus Operandi & Red Flags (3 fields + computed C)
export interface FraudModusStage {
  modusSummary: string;
  factorA: number; // Anomaly Frequency (1 - 10)
  factorB: number; // Collusion / Vulnerability Ease (1 - 10)
  subScoreC: number; // computed: factorA + factorB
}

// Stage 3: Loss Exposure & Impact (3 fields + computed F)
export interface FraudLossStage {
  lossCategory: string; // from Master Data API
  factorD: number; // Direct Financial Loss Weight (1 - 10)
  factorE: number; // Reputational & Regulatory Severity (1 - 10)
  subScoreF: number; // computed: factorD + factorE
}

// Stage 4: Immediate Containment (3 fields)
export interface FraudContainmentStage {
  immediateContainmentAction: string;
  digitalEvidenceStatus: string; // from Master Data API
  allocatedForensicBudget: number;
}

// Stage 5: Fraud Evaluation Gate (2 fields + computed Gate Score)
export interface FraudGateStage {
  internalInvestigationRecommendation: string;
  headOfAntiFraudSignOff: string;
  gateScore: number; // computed: subScoreC + subScoreF
  isEscalated: boolean; // computed: gateScore >= 15
}

// Stage 6: Forensic Audit & Asset Tracing (Escalated - 4 fields + computed G)
export interface FraudForensicStage {
  assetTracingPlan: string;
  factorG1: number; // Forensic Evidence Difficulty (1 - 10)
  factorG2: number; // Asset Recovery Probability (1 - 10)
  subScoreG: number; // computed: factorG1 + factorG2
  chiefForensicAuditorApproved: boolean;
}

// Stage 7: Law Enforcement & Whistleblower (Escalated - 3 fields + computed H)
export interface FraudLawEnforcementStage {
  lawEnforcementAgency: string; // from Master Data API
  factorH1: number; // Whistleblower Protection Rigor (1 - 10)
  factorH2: number; // Counter-Litigation Legal Risk (1 - 10)
  subScoreH: number; // computed: factorH1 + factorH2
}

// Stage 8: Board Sanction & Grand Total (Escalated Final - 2 fields + Grand Total)
export interface FraudBoardSanctionStage {
  terminationDecreeNumber: string;
  legalDirectorSignOff: string;
  grandCumulativeFraudScore: number; // computed: c + f + g + h
}

export interface FraudFormData {
  general: FraudGeneralInfoStage;
  modus: FraudModusStage;
  loss: FraudLossStage;
  containment: FraudContainmentStage;
  gate: FraudGateStage;
  forensic: FraudForensicStage;
  lawEnforcement: FraudLawEnforcementStage;
  boardSanction: FraudBoardSanctionStage;
}
