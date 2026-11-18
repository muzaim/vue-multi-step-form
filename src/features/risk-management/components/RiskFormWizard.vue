<script setup lang="ts">
import { computed } from 'vue';
import { useRiskFormStore } from '../stores/useRiskFormStore';
import { useRiskWizard } from '../composables/useRiskWizard';
import { validateTrackStageData, validateTrackFullForm } from '../schemas/riskValidation';
import type { StepConfig } from '../types/risk.types';

import RiskStepperNav from './RiskStepperNav.vue';
import RiskWizardFooter from './RiskWizardFooter.vue';

// Step 1 Intake Component
import Step1GeneralInfo from './steps/Step1GeneralInfo.vue';

// Non-Fraud Step Components (2 - 8)
import Step2RiskIdentification from './steps/non-fraud/Step2RiskIdentification.vue';
import Step3RiskAssessment from './steps/non-fraud/Step3RiskAssessment.vue';
import Step4MitigationPlan from './steps/non-fraud/Step4MitigationPlan.vue';
import Step5ReviewSubmit from './steps/non-fraud/Step5ReviewSubmit.vue';
import Step6DeepMitigation from './steps/non-fraud/Step6DeepMitigation.vue';
import Step7BoardOversight from './steps/non-fraud/Step7BoardOversight.vue';
import Step8ExecutiveSignOff from './steps/non-fraud/Step8ExecutiveSignOff.vue';

// Fraud Step Components (2 - 8)
import FraudStep2Modus from './steps/fraud/FraudStep2Modus.vue';
import FraudStep3Loss from './steps/fraud/FraudStep3Loss.vue';
import FraudStep4Containment from './steps/fraud/FraudStep4Containment.vue';
import FraudStep5Gate from './steps/fraud/FraudStep5Gate.vue';
import FraudStep6Forensic from './steps/fraud/FraudStep6Forensic.vue';
import FraudStep7LawEnforcement from './steps/fraud/FraudStep7LawEnforcement.vue';
import FraudStep8BoardSanction from './steps/fraud/FraudStep8BoardSanction.vue';

const store = useRiskFormStore();

// --- Non-Fraud Step Configurations ---
const nonFraudBaseSteps: StepConfig[] = [
  { id: 1, key: 'general', title: 'Context & General', subtitle: 'Organisasi & cakupan' },
  { id: 2, key: 'identification', title: 'Risk Factors A & B', subtitle: 'Threat Sub-Score C' },
  { id: 3, key: 'analysis', title: 'Impact Factors D & E', subtitle: 'Impact Sub-Score F' },
  { id: 4, key: 'mitigation', title: 'Mitigation Plan', subtitle: 'Strategi penanganan' },
  { id: 5, key: 'review', title: 'Gate & Evaluation', subtitle: 'Threshold Check (15 pts)' },
];

const nonFraudEscalationSteps: StepConfig[] = [
  { id: 6, key: 'deepMitigation', title: 'Deep Mitigation', subtitle: 'Sub-score G', isEscalatedStep: true },
  { id: 7, key: 'boardOversight', title: 'Board Oversight', subtitle: 'Sub-score H', isEscalatedStep: true },
  { id: 8, key: 'executiveSignOff', title: 'Executive Sign-off', subtitle: 'Grand Total Score', isEscalatedStep: true },
];

// --- Fraud Step Configurations ---
const fraudBaseSteps: StepConfig[] = [
  { id: 1, key: 'general', title: 'Fraud Intake', subtitle: 'Tipe & Dugaan Kasus' },
  { id: 2, key: 'modus', title: 'Modus Operandi', subtitle: 'Indikator Sub-skor C' },
  { id: 3, key: 'loss', title: 'Loss & Exposure', subtitle: 'Dampak Sub-skor F' },
  { id: 4, key: 'containment', title: 'Asset Containment', subtitle: 'Penahanan & Bukti' },
  { id: 5, key: 'gate', title: 'Fraud Gate', subtitle: 'Threshold Check (15 pts)' },
];

const fraudEscalationSteps: StepConfig[] = [
  { id: 6, key: 'forensic', title: 'Forensic Audit', subtitle: 'Tracing Sub-skor G', isEscalatedStep: true },
  { id: 7, key: 'lawEnforcement', title: 'Law Enforcement', subtitle: 'Pidana Sub-skor H', isEscalatedStep: true },
  { id: 8, key: 'boardSanction', title: 'Board Sanction', subtitle: 'SK & Grand Total', isEscalatedStep: true },
];

// Dynamically compute active steps based on track and threshold
const activeSteps = computed<StepConfig[]>(() => {
  if (store.assessmentType === 'fraud') {
    return store.isEscalated ? [...fraudBaseSteps, ...fraudEscalationSteps] : fraudBaseSteps;
  }
  return store.isEscalated ? [...nonFraudBaseSteps, ...nonFraudEscalationSteps] : nonFraudBaseSteps;
});

const {
  currentStep,
  stepErrors,
  isFirstStep,
  isLastStep,
  progressPercentage,
  nextStep,
  prevStep,
  goToStep,
} = useRiskWizard(() => activeSteps.value.length);

const currentStepComponent = computed(() => {
  if (currentStep.value === 1) {
    return Step1GeneralInfo;
  }

  if (store.assessmentType === 'fraud') {
    switch (currentStep.value) {
      case 2:
        return FraudStep2Modus;
      case 3:
        return FraudStep3Loss;
      case 4:
        return FraudStep4Containment;
      case 5:
        return FraudStep5Gate;
      case 6:
        return FraudStep6Forensic;
      case 7:
        return FraudStep7LawEnforcement;
      case 8:
        return FraudStep8BoardSanction;
      default:
        return Step1GeneralInfo;
    }
  } else {
    switch (currentStep.value) {
      case 2:
        return Step2RiskIdentification;
      case 3:
        return Step3RiskAssessment;
      case 4:
        return Step4MitigationPlan;
      case 5:
        return Step5ReviewSubmit;
      case 6:
        return Step6DeepMitigation;
      case 7:
        return Step7BoardOversight;
      case 8:
        return Step8ExecutiveSignOff;
      default:
        return Step1GeneralInfo;
    }
  }
});

function handleNext() {
  const canAdvance = nextStep(() => {
    return validateTrackStageData(
      store.assessmentType,
      currentStep.value,
      store.formData,
      store.fraudData
    );
  });

  if (!canAdvance) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

async function handleSaveDraft() {
  await store.saveDraft();
}

async function handleSubmit() {
  // Validate current active stage first
  const currentValidation = validateTrackStageData(
    store.assessmentType,
    currentStep.value,
    store.formData,
    store.fraudData
  );

  if (!currentValidation.isValid) {
    stepErrors.value = currentValidation.errors;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  // Full form check based on escalation state and active track
  const isAllValid = validateTrackFullForm(
    store.assessmentType,
    store.formData,
    store.fraudData,
    store.isEscalated
  );

  if (!isAllValid) {
    store.submitError = 'Validasi formulir belum lengkap pada tahapan yang dipersyaratkan.';
    return;
  }

  await store.submitAssessment();
}

// ==================== 4 DEMO SCENARIO HELPERS ====================

/**
 * 1. Demo Non-Fraud Low Risk (< 15 pts) -> Selesai di Stage 5
 */
function fillNonFraudLowRiskSample() {
  store.assessmentType = 'non_fraud';
  store.formData.general = {
    riskTitle: 'Office Supply Vendor Delivery Latency',
    riskCategory: 'operational',
    department: 'People & Culture (HR)',
  };

  store.formData.identification = {
    threatDescription: 'Minor operational delays in restocking stationary and supplies due to local holiday traffic',
    factorA: 2,
    factorB: 3,
    subScoreC: 5,
  };

  store.formData.analysis = {
    operationalImpact: 'negligible',
    factorD: 3,
    factorE: 2,
    subScoreF: 5,
  };

  store.formData.mitigation = {
    actionPlanTitle: 'Dual-Vendor Sourcing Framework Implementation',
    treatmentStrategy: 'mitigate',
    allocatedBudget: 5000000,
  };

  store.formData.review = {
    monitoringMetricKRI: 'Order fulfillment lead time < 48 hours',
    complianceSignOff: 'Hendra Kusuma (Compliance Officer)',
    gateScore: 10,
    isEscalated: false,
  };
}

/**
 * 2. Demo Non-Fraud Critical Risk (>= 15 pts) -> Eskalasi ke Stage 8
 */
function fillNonFraudCriticalRiskSample() {
  store.assessmentType = 'non_fraud';
  store.formData.general = {
    riskTitle: 'Core Cloud Banking API Infrastructure Outage',
    riskCategory: 'cybersecurity',
    department: 'IT Infrastructure & Cloud',
  };

  store.formData.identification = {
    threatDescription: 'Prolonged service disruption of the core API gateway during peak hours caused by DNS hijacking',
    factorA: 8,
    factorB: 8,
    subScoreC: 16,
  };

  store.formData.analysis = {
    operationalImpact: 'severe',
    factorD: 8,
    factorE: 8,
    subScoreF: 16,
  };

  store.formData.mitigation = {
    actionPlanTitle: 'Multi-Region High Availability & Edge WAF Implementation',
    treatmentStrategy: 'mitigate',
    allocatedBudget: 350000000,
  };

  store.formData.review = {
    monitoringMetricKRI: 'API latency 99th percentile < 250ms & 99.99% gateway availability',
    complianceSignOff: 'Hendra Kusuma (Director of Compliance & Legal)',
    gateScore: 32,
    isEscalated: true,
  };

  store.formData.deepMitigation = {
    escalatedActionPlan: 'Contracting Tier-1 Global DDoS mitigation provider with 1 Tbps scrubbing capacity',
    factorG1: 7,
    factorG2: 8,
    subScoreG: 15,
    chiefRiskOfficerApproved: true,
  };

  store.formData.boardOversight = {
    boardCommitteeName: 'Audit & Risk Oversight Committee',
    factorH1: 8,
    factorH2: 8,
    subScoreH: 16,
  };

  store.formData.executiveSignOff = {
    boardResolutionNumber: 'SK-DEKOM-2026/XI/104-CRITICAL',
    ceoSignOff: 'Raden Arya (Chief Executive Officer)',
    grandCumulativeRiskScore: 63,
  };
}

/**
 * 3. Demo Fraud Internal / Low Severity (< 15 pts) -> Selesai di Stage 5
 */
function fillFraudLowRiskSample() {
  store.assessmentType = 'fraud';
  store.formData.general = {
    riskTitle: 'Penyalahgunaan Reimbursement Bahan Bakar Operasional Kantor',
    riskCategory: 'compliance',
    department: 'People & Culture (HR)',
  };

  store.fraudData.modus = {
    modusSummary: 'Klaim ganda nota bahan bakar kendaraan dinas menggunakan struk bekas periode sebelumnya',
    factorA: 3,
    factorB: 2,
    subScoreC: 5,
  };

  store.fraudData.loss = {
    lossCategory: 'asset_misappropriation',
    factorD: 2,
    factorE: 2,
    subScoreF: 4,
  };

  store.fraudData.containment = {
    immediateContainmentAction: 'Penangguhan hak reimbursement otomatis & audit internal struk fisik 3 bulan terakhir',
    digitalEvidenceStatus: 'secured_quarantine',
    allocatedForensicBudget: 10000000,
  };

  store.fraudData.gate = {
    internalInvestigationRecommendation: 'Surat Peringatan Kedua (SP-2) & pemotongan gaji untuk pemulihan kerugian petty cash',
    headOfAntiFraudSignOff: 'Bambang Wicaksono (Head of Anti-Fraud)',
    gateScore: 9,
    isEscalated: false,
  };
}

/**
 * 4. Demo Fraud Critical / Criminal Case (>= 15 pts) -> Eskalasi ke Stage 8
 */
function fillFraudCriticalRiskSample() {
  store.assessmentType = 'fraud';
  store.formData.general = {
    riskTitle: 'Dugaan Kolusi Pengadaan Server Cloud & Pembayaran Vendor Fiktif',
    riskCategory: 'financial',
    department: 'IT Infrastructure & Cloud',
  };

  store.fraudData.modus = {
    modusSummary: 'Pembuatan purchase order software fiktif senilai milyaran rupiah bekerja sama dengan approver IT internal',
    factorA: 8,
    factorB: 8,
    subScoreC: 16,
  };

  store.fraudData.loss = {
    lossCategory: 'procurement_kickback',
    factorD: 9,
    factorE: 8,
    subScoreF: 17,
  };

  store.fraudData.containment = {
    immediateContainmentAction: 'Pemblokiran rekening penampung pihak ketiga & penyitaan harddisk laptop kerja seluruh terlapor',
    digitalEvidenceStatus: 'forensic_image_verified',
    allocatedForensicBudget: 250000000,
  };

  store.fraudData.gate = {
    internalInvestigationRecommendation: 'Eskalasi pelaporan tindak pidana korupsi/penggelapan jabatan ke aparat penegak hukum',
    headOfAntiFraudSignOff: 'Kombes Pol (Purn) Bambang Wicaksono (Head of Internal Fraud)',
    gateScore: 33,
    isEscalated: true,
  };

  store.fraudData.forensic = {
    assetTracingPlan: 'Permintaan pemblokiran rekening bank melalui PPATK dan pelacakan aset properti pihak terkait',
    factorG1: 8,
    factorG2: 8,
    subScoreG: 16,
    chiefForensicAuditorApproved: true,
  };

  store.fraudData.lawEnforcement = {
    lawEnforcementAgency: 'Bareskrim Polri (Direktorat Tindak Pidana Korupsi/Siber)',
    factorH1: 9,
    factorH2: 8,
    subScoreH: 17,
  };

  store.fraudData.boardSanction = {
    terminationDecreeNumber: 'SK-DIR-2026/FRAUD/089-CRITICAL',
    legalDirectorSignOff: 'Dr. Hendra Kusuma, S.H., LL.M. (Director of Legal & Compliance)',
    grandCumulativeFraudScore: 66,
  };
}
</script>

<template>
  <div class="max-w-4xl mx-auto my-6">
    <!-- Quick Demo Helper Bar with 4 Scenarios -->
    <div class="bg-slate-900 text-slate-300 px-5 py-3 rounded-t-xl text-xs space-y-2">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
        <div class="flex items-center gap-2">
          <span
            class="inline-block w-2.5 h-2.5 rounded-full"
            :class="store.isEscalated ? 'bg-rose-500 animate-pulse' : 'bg-emerald-400'"
          ></span>
          <span class="font-medium">
            Track: <strong class="text-white uppercase">{{ store.assessmentType === 'fraud' ? 'Fraud & FinCrime' : 'Non-Fraud Risk' }}</strong>
            | Gate Score: <strong class="text-white">{{ store.gateScore }} Pts</strong> ({{ store.isEscalated ? 'Eskalasi / 8 Stages' : 'Normal / 5 Stages' }})
          </span>
        </div>
        <span class="text-slate-400 text-[11px]">Pilih simulasi cepat:</span>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <!-- Button 1: Non-Fraud Low -->
        <button
          type="button"
          @click="fillNonFraudLowRiskSample(); goToStep(1)"
          class="bg-emerald-800 hover:bg-emerald-700 text-white font-medium px-2 py-1 rounded transition text-xs flex items-center gap-1 shadow"
        >
          <span>🌱 Non-Fraud Low (10 pts &rarr; 5 Stg)</span>
        </button>

        <!-- Button 2: Non-Fraud Critical -->
        <button
          type="button"
          @click="fillNonFraudCriticalRiskSample(); goToStep(1)"
          class="bg-indigo-700 hover:bg-indigo-600 text-white font-medium px-2 py-1 rounded transition text-xs flex items-center gap-1 shadow"
        >
          <span>⚡ Non-Fraud Crit (32 pts &rarr; 8 Stg)</span>
        </button>

        <!-- Button 3: Fraud Low -->
        <button
          type="button"
          @click="fillFraudLowRiskSample(); goToStep(1)"
          class="bg-amber-700 hover:bg-amber-600 text-white font-medium px-2 py-1 rounded transition text-xs flex items-center gap-1 shadow"
        >
          <span>⚠️ Fraud Low (9 pts &rarr; 5 Stg)</span>
        </button>

        <!-- Button 4: Fraud Critical -->
        <button
          type="button"
          @click="fillFraudCriticalRiskSample(); goToStep(1)"
          class="bg-rose-700 hover:bg-rose-600 text-white font-medium px-2 py-1 rounded transition text-xs flex items-center gap-1 shadow"
        >
          <span>🔥 Fraud Crit (33 pts &rarr; 8 Stg)</span>
        </button>
      </div>
    </div>

    <!-- Main Wizard Card -->
    <div class="bg-white border-x border-b border-slate-200 rounded-b-xl shadow-lg overflow-hidden">
      <!-- Stepper Header Navigation (Adapts between Non-Fraud & Fraud, 5 & 8 stages) -->
      <RiskStepperNav
        :steps="activeSteps"
        :current-step="currentStep"
        :progress-percentage="progressPercentage"
        :is-escalated="store.isEscalated"
        @navigate="goToStep"
      />

      <!-- Success Screen Banner -->
      <div v-if="store.submissionResult" class="p-8 text-center bg-emerald-50 border-b border-emerald-200">
        <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-2xl font-black text-emerald-900">
          {{
            store.assessmentType === 'fraud'
              ? (store.isEscalated ? 'Escalated Fraud Criminal Investigation Submitted!' : 'Internal Fraud Disciplinary Assessment Submitted!')
              : (store.isEscalated ? 'Escalated Enterprise Risk Assessment Submitted!' : 'Standard Risk Assessment Successfully Submitted!')
          }}
        </h2>
        <p class="text-sm text-emerald-700 mt-2">
          Asesmen resmi telah tercatat dalam audit database kepatuhan risiko perusahaan.
        </p>
        <div class="mt-4 inline-flex items-center gap-4 bg-white px-5 py-2.5 rounded-xl border border-emerald-200 text-xs text-slate-700">
          <div>Ref: <strong class="font-mono text-emerald-800">{{ store.submissionResult.referenceNumber }}</strong></div>
          <div class="w-px h-4 bg-slate-200"></div>
          <div>Tanggal: <strong>{{ new Date(store.submissionResult.submittedAt).toLocaleDateString('id-ID') }}</strong></div>
        </div>
        <div class="mt-6">
          <button
            type="button"
            @click="store.resetForm(); goToStep(1)"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition"
          >
            Mulai Asesmen Baru
          </button>
        </div>
      </div>

      <!-- Error Global Banner -->
      <div v-if="store.submitError" class="p-4 mx-6 mt-6 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <span>{{ store.submitError }}</span>
        </div>
        <button type="button" @click="store.submitError = null" class="text-rose-500 hover:text-rose-700 font-bold">
          &times;
        </button>
      </div>

      <!-- Dynamic Step Content Form -->
      <div v-if="!store.submissionResult" class="p-6 md:p-8">
        <component
          :is="currentStepComponent"
          :errors="stepErrors"
        />
      </div>

      <!-- Wizard Navigation Footer -->
      <RiskWizardFooter
        v-if="!store.submissionResult"
        :current-step="currentStep"
        :total-steps="activeSteps.length"
        :is-first-step="isFirstStep"
        :is-last-step="isLastStep"
        :is-saving-draft="store.isSavingDraft"
        :is-submitting="store.isSubmitting"
        @prev="prevStep"
        @next="handleNext"
        @save-draft="handleSaveDraft"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>
