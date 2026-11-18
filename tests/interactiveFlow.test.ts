import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { setActivePinia, createPinia } from 'pinia';
import { useRiskFormStore } from '../src/features/risk-management/stores/useRiskFormStore.ts';
import { validateTrackStageData, validateTrackFullForm } from '../src/features/risk-management/schemas/riskValidation.ts';

describe('End-to-End dynamic workflow tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test('Non-Fraud Low Risk (5-Stage workflow) flows and validates successfully', async () => {
    const store = useRiskFormStore();
    store.assessmentType = 'non_fraud';

    // Stage 1
    store.formData.general = {
      riskTitle: 'Office Supply Delivery Delay',
      riskCategory: 'operational',
      department: 'HR Operations',
    };
    assert.equal(validateTrackStageData('non_fraud', 1, store.formData, store.fraudData).isValid, true);

    // Stage 2
    store.formData.identification = {
      threatDescription: 'Minor operational delays in office supplies delivery',
      factorA: 2,
      factorB: 2,
      subScoreC: 4,
    };
    await new Promise((r) => setTimeout(r, 20));
    assert.equal(validateTrackStageData('non_fraud', 2, store.formData, store.fraudData).isValid, true);

    // Stage 3
    store.formData.analysis = {
      operationalImpact: 'negligible',
      factorD: 2,
      factorE: 2,
      subScoreF: 4,
    };
    await new Promise((r) => setTimeout(r, 20));
    assert.equal(validateTrackStageData('non_fraud', 3, store.formData, store.fraudData).isValid, true);

    // Stage 4
    store.formData.mitigation = {
      actionPlanTitle: 'Setup local fallback vendor agreement',
      treatmentStrategy: 'mitigate',
      allocatedBudget: 5000,
    };
    assert.equal(validateTrackStageData('non_fraud', 4, store.formData, store.fraudData).isValid, true);

    // Stage 5
    store.formData.review = {
      monitoringMetricKRI: 'Lead time SLA < 48 hrs',
      complianceSignOff: 'Budi Santoso',
      gateScore: 8,
      isEscalated: false,
    };
    await new Promise((r) => setTimeout(r, 20));
    assert.equal(validateTrackStageData('non_fraud', 5, store.formData, store.fraudData).isValid, true);
    assert.equal(store.isEscalated, false);
    assert.equal(validateTrackFullForm('non_fraud', store.formData, store.fraudData, store.isEscalated), true);
  });

  test('Fraud Critical Risk (8-Stage workflow) flows and escalates dynamically', async () => {
    const store = useRiskFormStore();
    store.assessmentType = 'fraud';

    // Stage 1
    store.formData.general = {
      riskTitle: 'Cloud Vendor Fraudulent PO Scheme',
      riskCategory: 'financial',
      department: 'IT Security',
    };

    // Stage 2
    store.fraudData.modus = {
      modusSummary: 'Internal collusion issuing fake cloud billing invoices',
      factorA: 8,
      factorB: 8,
      subScoreC: 16,
    };

    // Stage 3
    store.fraudData.loss = {
      lossCategory: 'procurement_kickback',
      factorD: 9,
      factorE: 8,
      subScoreF: 17,
    };

    // Stage 4
    store.fraudData.containment = {
      immediateContainmentAction: 'Immediate bank account freeze & forensic backup of emails',
      digitalEvidenceStatus: 'forensic_image_verified',
      allocatedForensicBudget: 150000000,
    };

    // Stage 5 Gate
    store.fraudData.gate = {
      internalInvestigationRecommendation: 'Escalate to police cyber division and freeze employee assets',
      headOfAntiFraudSignOff: 'Kombes Pol Bambang',
      gateScore: 33,
      isEscalated: true,
    };

    // Stage 6
    store.fraudData.forensic = {
      assetTracingPlan: 'Tracing third-party bank transactions through regulator channel',
      factorG1: 7,
      factorG2: 7,
      subScoreG: 14,
      chiefForensicAuditorApproved: true,
    };

    // Stage 7
    store.fraudData.lawEnforcement = {
      lawEnforcementAgency: 'Bareskrim Polri',
      factorH1: 8,
      factorH2: 7,
      subScoreH: 15,
    };

    // Stage 8
    store.fraudData.boardSanction = {
      terminationDecreeNumber: 'SK-DIR-2026/099-CRITICAL',
      legalDirectorSignOff: 'Dr. Hendra Kusuma',
      grandCumulativeFraudScore: 62,
    };

    await new Promise((r) => setTimeout(r, 20));

    assert.equal(store.isEscalated, true);
    assert.equal(validateTrackFullForm('fraud', store.formData, store.fraudData, store.isEscalated), true);
  });

  test('Stage 6 and Stage 9 dedicated approval stages pass validation without blocking navigation', () => {
    const store = useRiskFormStore();

    // Standard Non-Fraud: Stage 6 is the final approval step (isEscalated is false)
    const nonFraudApprovalValidation = validateTrackStageData('non_fraud', 6, store.formData, store.fraudData, false);
    assert.equal(nonFraudApprovalValidation.isValid, true);
    assert.deepEqual(nonFraudApprovalValidation.errors, {});

    // Escalated Fraud: Stage 9 is the final approval step (isEscalated is true)
    const fraudApprovalValidation = validateTrackStageData('fraud', 9, store.formData, store.fraudData, true);
    assert.equal(fraudApprovalValidation.isValid, true);
    assert.deepEqual(fraudApprovalValidation.errors, {});
  });

  test('unpopulated form starts non-escalated and blocks advancing when factors remain 0', () => {
    const store = useRiskFormStore();

    // Verify initial clean state
    assert.equal(store.isEscalated, false);
    assert.equal(store.gateScore, 0);
    assert.equal(store.formData.identification.factorA, 0);
    assert.equal(store.formData.identification.factorB, 0);

    // Stage 2 validation should fail because factors are 0 (schema requires min 1)
    const stage2Validation = validateTrackStageData('non_fraud', 2, store.formData, store.fraudData, store.isEscalated);
    assert.equal(stage2Validation.isValid, false);
    assert.ok(stage2Validation.errors.factorA);
    assert.ok(stage2Validation.errors.factorB);
  });
});
