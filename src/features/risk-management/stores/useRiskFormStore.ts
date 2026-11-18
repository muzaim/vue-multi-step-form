import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { RiskFormData } from '../types/risk.types';
import type { FraudFormData, AssessmentType } from '../types/fraud.types';
import { riskApi } from '../api/riskApi';

function getInitialFormData(): RiskFormData {
  return {
    general: {
      riskTitle: '',
      riskCategory: '',
      department: '',
    },
    identification: {
      threatDescription: '',
      factorA: 4, // Threat Frequency (1 - 10)
      factorB: 4, // Vulnerability Ease (1 - 10)
      subScoreC: 8,
    },
    analysis: {
      operationalImpact: '',
      factorD: 4, // Financial Loss Weight (1 - 10)
      factorE: 4, // Regulatory Penalty Severity (1 - 10)
      subScoreF: 8,
    },
    mitigation: {
      actionPlanTitle: '',
      treatmentStrategy: '',
      allocatedBudget: 0,
    },
    review: {
      monitoringMetricKRI: '',
      complianceSignOff: '',
      gateScore: 16,
      isEscalated: true,
    },
    deepMitigation: {
      escalatedActionPlan: '',
      factorG1: 3, // Mitigation Cost Weight (1 - 10)
      factorG2: 4, // Implementation Complexity (1 - 10)
      subScoreG: 7,
      chiefRiskOfficerApproved: false,
    },
    boardOversight: {
      boardCommitteeName: '',
      factorH1: 3, // Board Oversight Rigor (1 - 10)
      factorH2: 4, // Audit Scrutiny (1 - 10)
      subScoreH: 7,
    },
    executiveSignOff: {
      boardResolutionNumber: '',
      ceoSignOff: '',
      grandCumulativeRiskScore: 30,
    },
  };
}

function getInitialFraudData(): FraudFormData {
  return {
    general: {
      caseTitle: '',
      reportedDepartment: '',
    },
    modus: {
      modusSummary: '',
      factorA: 4, // Anomaly Frequency (1 - 10)
      factorB: 4, // Collusion Ease (1 - 10)
      subScoreC: 8,
    },
    loss: {
      lossCategory: '',
      factorD: 4, // Direct Loss Weight (1 - 10)
      factorE: 4, // Reputational Severity (1 - 10)
      subScoreF: 8,
    },
    containment: {
      immediateContainmentAction: '',
      digitalEvidenceStatus: '',
      allocatedForensicBudget: 0,
    },
    gate: {
      internalInvestigationRecommendation: '',
      headOfAntiFraudSignOff: '',
      gateScore: 16,
      isEscalated: true,
    },
    forensic: {
      assetTracingPlan: '',
      factorG1: 3, // Evidence Complexity (1 - 10)
      factorG2: 4, // Recovery Probability (1 - 10)
      subScoreG: 7,
      chiefForensicAuditorApproved: false,
    },
    lawEnforcement: {
      lawEnforcementAgency: '',
      factorH1: 3, // Whistleblower Rigor (1 - 10)
      factorH2: 4, // Counter-Litigation Risk (1 - 10)
      subScoreH: 7,
    },
    boardSanction: {
      terminationDecreeNumber: '',
      legalDirectorSignOff: '',
      grandCumulativeFraudScore: 30,
    },
  };
}

export const useRiskFormStore = defineStore('riskForm', () => {
  const assessmentType = ref<AssessmentType>('non_fraud');
  const formData = ref<RiskFormData>(getInitialFormData());
  const fraudData = ref<FraudFormData>(getInitialFraudData());

  const isSavingDraft = ref(false);
  const isSubmitting = ref(false);
  const draftId = ref<string | null>(null);
  const lastSavedAt = ref<string | null>(null);
  const submissionResult = ref<{
    success: boolean;
    referenceNumber: string;
    submittedAt: string;
  } | null>(null);
  const submitError = ref<string | null>(null);

  // --- Non-Fraud Reactive Calculations ---
  // 1. Stage 2: subScoreC = factorA + factorB
  watch(
    () => [formData.value.identification.factorA, formData.value.identification.factorB],
    ([a, b]) => {
      formData.value.identification.subScoreC = (Number(a) || 0) + (Number(b) || 0);
    },
    { immediate: true }
  );

  // 2. Stage 3: subScoreF = factorD + factorE
  watch(
    () => [formData.value.analysis.factorD, formData.value.analysis.factorE],
    ([d, e]) => {
      formData.value.analysis.subScoreF = (Number(d) || 0) + (Number(e) || 0);
    },
    { immediate: true }
  );

  // 3. Stage 5 Gate: gateScore = subScoreC + subScoreF
  watch(
    () => [formData.value.identification.subScoreC, formData.value.analysis.subScoreF],
    ([c, f]) => {
      const total = (Number(c) || 0) + (Number(f) || 0);
      formData.value.review.gateScore = total;
      formData.value.review.isEscalated = total >= 15;
    },
    { immediate: true }
  );

  // 4. Stage 6: subScoreG = factorG1 + factorG2
  watch(
    () => [formData.value.deepMitigation.factorG1, formData.value.deepMitigation.factorG2],
    ([g1, g2]) => {
      formData.value.deepMitigation.subScoreG = (Number(g1) || 0) + (Number(g2) || 0);
    },
    { immediate: true }
  );

  // 5. Stage 7: subScoreH = factorH1 + factorH2
  watch(
    () => [formData.value.boardOversight.factorH1, formData.value.boardOversight.factorH2],
    ([h1, h2]) => {
      formData.value.boardOversight.subScoreH = (Number(h1) || 0) + (Number(h2) || 0);
    },
    { immediate: true }
  );

  // 6. Stage 8 Grand Cumulative Score: c + f + g + h
  watch(
    () => [
      formData.value.identification.subScoreC,
      formData.value.analysis.subScoreF,
      formData.value.deepMitigation.subScoreG,
      formData.value.boardOversight.subScoreH,
    ],
    ([c, f, g, h]) => {
      formData.value.executiveSignOff.grandCumulativeRiskScore =
        (Number(c) || 0) + (Number(f) || 0) + (Number(g) || 0) + (Number(h) || 0);
    },
    { immediate: true }
  );

  // --- Fraud Reactive Calculations ---
  // 1. Stage 2 Fraud: subScoreC = factorA + factorB
  watch(
    () => [fraudData.value.modus.factorA, fraudData.value.modus.factorB],
    ([a, b]) => {
      fraudData.value.modus.subScoreC = (Number(a) || 0) + (Number(b) || 0);
    },
    { immediate: true }
  );

  // 2. Stage 3 Fraud: subScoreF = factorD + factorE
  watch(
    () => [fraudData.value.loss.factorD, fraudData.value.loss.factorE],
    ([d, e]) => {
      fraudData.value.loss.subScoreF = (Number(d) || 0) + (Number(e) || 0);
    },
    { immediate: true }
  );

  // 3. Stage 5 Fraud Gate: gateScore = subScoreC + subScoreF
  watch(
    () => [fraudData.value.modus.subScoreC, fraudData.value.loss.subScoreF],
    ([c, f]) => {
      const total = (Number(c) || 0) + (Number(f) || 0);
      fraudData.value.gate.gateScore = total;
      fraudData.value.gate.isEscalated = total >= 15;
    },
    { immediate: true }
  );

  // 4. Stage 6 Fraud: subScoreG = factorG1 + factorG2
  watch(
    () => [fraudData.value.forensic.factorG1, fraudData.value.forensic.factorG2],
    ([g1, g2]) => {
      fraudData.value.forensic.subScoreG = (Number(g1) || 0) + (Number(g2) || 0);
    },
    { immediate: true }
  );

  // 5. Stage 7 Fraud: subScoreH = factorH1 + factorH2
  watch(
    () => [fraudData.value.lawEnforcement.factorH1, fraudData.value.lawEnforcement.factorH2],
    ([h1, h2]) => {
      fraudData.value.lawEnforcement.subScoreH = (Number(h1) || 0) + (Number(h2) || 0);
    },
    { immediate: true }
  );

  // 6. Stage 8 Fraud Grand Total Score: c + f + g + h
  watch(
    () => [
      fraudData.value.modus.subScoreC,
      fraudData.value.loss.subScoreF,
      fraudData.value.forensic.subScoreG,
      fraudData.value.lawEnforcement.subScoreH,
    ],
    ([c, f, g, h]) => {
      fraudData.value.boardSanction.grandCumulativeFraudScore =
        (Number(c) || 0) + (Number(f) || 0) + (Number(g) || 0) + (Number(h) || 0);
    },
    { immediate: true }
  );

  // Track-aware dynamic computeds
  const isEscalated = computed(() => {
    return assessmentType.value === 'fraud'
      ? fraudData.value.gate.isEscalated
      : formData.value.review.isEscalated;
  });

  const gateScore = computed(() => {
    return assessmentType.value === 'fraud'
      ? fraudData.value.gate.gateScore
      : formData.value.review.gateScore;
  });

  const grandTotalScore = computed(() => {
    return assessmentType.value === 'fraud'
      ? fraudData.value.boardSanction.grandCumulativeFraudScore
      : formData.value.executiveSignOff.grandCumulativeRiskScore;
  });

  function resetForm() {
    assessmentType.value = 'non_fraud';
    formData.value = getInitialFormData();
    fraudData.value = getInitialFraudData();
    draftId.value = null;
    lastSavedAt.value = null;
    submissionResult.value = null;
    submitError.value = null;
  }

  async function saveDraft() {
    try {
      isSavingDraft.value = true;
      const payload = assessmentType.value === 'fraud' ? fraudData.value : formData.value;
      const res = await riskApi.saveDraft(payload as any);
      draftId.value = res.draftId;
      lastSavedAt.value = res.savedAt;
      return res;
    } finally {
      isSavingDraft.value = false;
    }
  }

  async function submitAssessment() {
    try {
      isSubmitting.value = true;
      submitError.value = null;
      const payload = assessmentType.value === 'fraud' ? fraudData.value : formData.value;
      const res = await riskApi.submitAssessment(payload as any);
      submissionResult.value = {
        success: res.success,
        referenceNumber: res.referenceNumber,
        submittedAt: res.submittedAt,
      };
      return res;
    } catch (err: unknown) {
      submitError.value = err instanceof Error ? err.message : 'Submission failed';
      throw err;
    } finally {
      isSubmitting.value = false;
    }
  }

  return {
    assessmentType,
    formData,
    fraudData,
    isSavingDraft,
    isSubmitting,
    draftId,
    lastSavedAt,
    submissionResult,
    submitError,
    isEscalated,
    gateScore,
    grandTotalScore,
    resetForm,
    saveDraft,
    submitAssessment,
  };
});
