<script setup lang="ts">
import { computed, watch } from "vue";
import { useRiskFormStore } from "../stores/useRiskFormStore";
import { useWorkflowStore } from "../stores/useWorkflowStore";
import { useRiskWizard } from "../composables/useRiskWizard";
import {
	validateTrackStageData,
	validateTrackFullForm,
} from "../schemas/riskValidation";
import type { StepConfig } from "../types/risk.types";

import RiskStepperNav from "./RiskStepperNav.vue";
import RiskWizardFooter from "./RiskWizardFooter.vue";
import RolePersonaSwitcher from "./RolePersonaSwitcher.vue";
import StepApprovalGovernance from "./steps/StepApprovalGovernance.vue";

// Step 1 Intake Component
import Step1GeneralInfo from "./steps/Step1GeneralInfo.vue";

// Non-Fraud Step Components (2 - 8)
import Step2RiskIdentification from "./steps/non-fraud/Step2RiskIdentification.vue";
import Step3RiskAssessment from "./steps/non-fraud/Step3RiskAssessment.vue";
import Step4MitigationPlan from "./steps/non-fraud/Step4MitigationPlan.vue";
import Step5ReviewSubmit from "./steps/non-fraud/Step5ReviewSubmit.vue";
import Step6DeepMitigation from "./steps/non-fraud/Step6DeepMitigation.vue";
import Step7BoardOversight from "./steps/non-fraud/Step7BoardOversight.vue";
import Step8ExecutiveSignOff from "./steps/non-fraud/Step8ExecutiveSignOff.vue";

// Fraud Step Components (2 - 8)
import FraudStep2Modus from "./steps/fraud/FraudStep2Modus.vue";
import FraudStep3Loss from "./steps/fraud/FraudStep3Loss.vue";
import FraudStep4Containment from "./steps/fraud/FraudStep4Containment.vue";
import FraudStep5Gate from "./steps/fraud/FraudStep5Gate.vue";
import FraudStep6Forensic from "./steps/fraud/FraudStep6Forensic.vue";
import FraudStep7LawEnforcement from "./steps/fraud/FraudStep7LawEnforcement.vue";
import FraudStep8BoardSanction from "./steps/fraud/FraudStep8BoardSanction.vue";

const store = useRiskFormStore();
const workflowStore = useWorkflowStore();

// --- Non-Fraud Step Configurations ---
const nonFraudBaseSteps: StepConfig[] = [
	{
		id: 1,
		key: "general",
		title: "General Intake",
		subtitle: "Organisasi & cakupan",
	},
	{
		id: 2,
		key: "identification",
		title: "Threat Identification",
		subtitle: "Threat Sub-Score C",
	},
	{
		id: 3,
		key: "analysis",
		title: "Impact Assessment",
		subtitle: "Impact Sub-Score F",
	},
	{
		id: 4,
		key: "mitigation",
		title: "Mitigation Plan",
		subtitle: "Strategi penanganan",
	},
	{
		id: 5,
		key: "review",
		title: "Gate & Evaluation",
		subtitle: "Threshold Check (15 pts)",
	},
];

const nonFraudEscalationSteps: StepConfig[] = [
	{
		id: 6,
		key: "deepMitigation",
		title: "Deep Mitigation",
		subtitle: "Sub-score G",
		isEscalatedStep: true,
	},
	{
		id: 7,
		key: "boardOversight",
		title: "Board Oversight",
		subtitle: "Sub-score H",
		isEscalatedStep: true,
	},
	{
		id: 8,
		key: "executiveSignOff",
		title: "Executive Sign-off",
		subtitle: "Grand Total Score",
		isEscalatedStep: true,
	},
];

// --- Fraud Step Configurations ---
const fraudBaseSteps: StepConfig[] = [
	{
		id: 1,
		key: "general",
		title: "Fraud Intake",
		subtitle: "Tipe & Dugaan Kasus",
	},
	{
		id: 2,
		key: "modus",
		title: "Modus Operandi",
		subtitle: "Indikator Sub-skor C",
	},
	{
		id: 3,
		key: "loss",
		title: "Loss Exposure",
		subtitle: "Dampak Sub-skor F",
	},
	{
		id: 4,
		key: "containment",
		title: "Asset Containment",
		subtitle: "Penahanan & Bukti",
	},
	{
		id: 5,
		key: "gate",
		title: "Fraud Gate",
		subtitle: "Threshold Check (15 pts)",
	},
];

const fraudEscalationSteps: StepConfig[] = [
	{
		id: 6,
		key: "forensic",
		title: "Forensic Audit",
		subtitle: "Tracing Sub-skor G",
		isEscalatedStep: true,
	},
	{
		id: 7,
		key: "lawEnforcement",
		title: "Law Enforcement",
		subtitle: "Pidana Sub-skor H",
		isEscalatedStep: true,
	},
	{
		id: 8,
		key: "boardSanction",
		title: "Board Sanction",
		subtitle: "SK & Grand Total",
		isEscalatedStep: true,
	},
];

const activeSteps = computed<StepConfig[]>(() => {
	const approvalStep: StepConfig = {
		id: store.isEscalated ? 9 : 6,
		key: "approval",
		title: "Evaluasi & Approval",
		subtitle: "Lembar Persetujuan Governance",
	};

	if (store.assessmentType === "fraud") {
		const steps = store.isEscalated
			? [...fraudBaseSteps, ...fraudEscalationSteps]
			: fraudBaseSteps;
		return [...steps, approvalStep];
	}
	const steps = store.isEscalated
		? [...nonFraudBaseSteps, ...nonFraudEscalationSteps]
		: nonFraudBaseSteps;
	return [...steps, approvalStep];
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
	// Approval is always the last stage (Stage 6 for standard, Stage 9 for escalated)
	if (
		(!store.isEscalated && currentStep.value === 6) ||
		(store.isEscalated && currentStep.value === 9)
	) {
		return StepApprovalGovernance;
	}

	if (currentStep.value === 1) {
		return Step1GeneralInfo;
	}

	if (store.assessmentType === "fraud") {
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
				return StepApprovalGovernance;
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
				return StepApprovalGovernance;
		}
	}
});

function handleNext() {
	const canAdvance = nextStep(() => {
		return validateTrackStageData(
			store.assessmentType,
			currentStep.value,
			store.formData,
			store.fraudData,
			store.isEscalated
		);
	});

	if (!canAdvance) {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}
}

async function handleSaveDraft() {
	await store.saveDraft();
}

async function handleSubmit() {
	const currentValidation = validateTrackStageData(
		store.assessmentType,
		currentStep.value,
		store.formData,
		store.fraudData,
		store.isEscalated
	);

	if (!currentValidation.isValid) {
		stepErrors.value = currentValidation.errors;
		window.scrollTo({ top: 0, behavior: "smooth" });
		return;
	}

	const isAllValid = validateTrackFullForm(
		store.assessmentType,
		store.formData,
		store.fraudData,
		store.isEscalated
	);

	if (!isAllValid) {
		store.submitError =
			"Validasi formulir belum lengkap pada tahapan yang dipersyaratkan.";
		return;
	}

	// Trigger API submit
	await store.submitAssessment();

	// Advance workflow from DRAFT/REVISED to PENDING_KABAG
	workflowStore.submitInitialAssessment();
}

watch(
	() => workflowStore.activePersonaId,
	(newPersona?: string, oldPersona?: string) => {
		if (newPersona !== oldPersona) {
			store.submissionResult = null;
			goToStep(1);
		}
	}
);

function handleSwitchToApproverAfterSubmit() {
	store.submissionResult = null;
	if (workflowStore.currentAssignedRole) {
		workflowStore.activePersonaId = workflowStore.currentAssignedRole;
	} else {
		workflowStore.activePersonaId = "kabag";
	}
	goToStep(1);
}

// 4 Quick Sample Scenarios
function onPresetSelected(event: Event) {
	const target = event.target as HTMLSelectElement;
	const val = target.value;
	if (!val) return;

	if (val === 'non_fraud_low') fillNonFraudLowRiskSample();
	if (val === 'non_fraud_crit') fillNonFraudCriticalRiskSample();
	if (val === 'fraud_low') fillFraudLowRiskSample();
	if (val === 'fraud_crit') fillFraudCriticalRiskSample();

	goToStep(1);
	target.value = '';
}

function fillNonFraudLowRiskSample() {
	store.assessmentType = "non_fraud";
	store.formData.general = {
		riskTitle: "Office Supply Vendor Delivery Latency",
		riskCategory: "operational",
		department: "People & Culture (HR)",
	};

	store.formData.identification = {
		threatDescription:
			"Minor operational delays in restocking stationary and supplies due to local holiday traffic",
		factorA: 2,
		factorB: 3,
		subScoreC: 5,
	};

	store.formData.analysis = {
		operationalImpact: "negligible",
		factorD: 3,
		factorE: 2,
		subScoreF: 5,
	};

	store.formData.mitigation = {
		actionPlanTitle: "Dual-Vendor Sourcing Framework Implementation",
		treatmentStrategy: "mitigate",
		allocatedBudget: 5000000,
	};

	store.formData.review = {
		monitoringMetricKRI: "Order fulfillment lead time < 48 hours",
		complianceSignOff: "Hendra Kusuma (Compliance Officer)",
		gateScore: 10,
		isEscalated: false,
	};
}

function fillNonFraudCriticalRiskSample() {
	store.assessmentType = "non_fraud";
	store.formData.general = {
		riskTitle: "Core Cloud Banking API Infrastructure Outage",
		riskCategory: "cybersecurity",
		department: "IT Infrastructure & Cloud",
	};

	store.formData.identification = {
		threatDescription:
			"Prolonged service disruption of the core API gateway during peak hours caused by DNS hijacking",
		factorA: 8,
		factorB: 8,
		subScoreC: 16,
	};

	store.formData.analysis = {
		operationalImpact: "severe",
		factorD: 8,
		factorE: 8,
		subScoreF: 16,
	};

	store.formData.mitigation = {
		actionPlanTitle:
			"Multi-Region High Availability & Edge WAF Implementation",
		treatmentStrategy: "mitigate",
		allocatedBudget: 350000000,
	};

	store.formData.review = {
		monitoringMetricKRI:
			"API latency 99th percentile < 250ms & 99.99% gateway availability",
		complianceSignOff: "Hendra Kusuma (Director of Compliance & Legal)",
		gateScore: 32,
		isEscalated: true,
	};

	store.formData.deepMitigation = {
		escalatedActionPlan:
			"Contracting Tier-1 Global DDoS mitigation provider with 1 Tbps scrubbing capacity",
		factorG1: 7,
		factorG2: 8,
		subScoreG: 15,
		chiefRiskOfficerApproved: true,
	};

	store.formData.boardOversight = {
		boardCommitteeName: "Audit & Risk Oversight Committee",
		factorH1: 8,
		factorH2: 8,
		subScoreH: 16,
	};

	store.formData.executiveSignOff = {
		boardResolutionNumber: "SK-DEKOM-2026/XI/104-CRITICAL",
		ceoSignOff: "Raden Arya (Chief Executive Officer)",
		grandCumulativeRiskScore: 63,
	};
}

function fillFraudLowRiskSample() {
	store.assessmentType = "fraud";
	store.formData.general = {
		riskTitle:
			"Penyalahgunaan Reimbursement Bahan Bakar Operasional Kantor",
		riskCategory: "compliance",
		department: "People & Culture (HR)",
	};

	store.fraudData.modus = {
		modusSummary:
			"Klaim ganda nota bahan bakar kendaraan dinas menggunakan struk bekas periode sebelumnya",
		factorA: 3,
		factorB: 2,
		subScoreC: 5,
	};

	store.fraudData.loss = {
		lossCategory: "asset_misappropriation",
		factorD: 2,
		factorE: 2,
		subScoreF: 4,
	};

	store.fraudData.containment = {
		immediateContainmentAction:
			"Penangguhan hak reimbursement otomatis & audit internal struk fisik 3 bulan terakhir",
		digitalEvidenceStatus: "secured_quarantine",
		allocatedForensicBudget: 10000000,
	};

	store.fraudData.gate = {
		internalInvestigationRecommendation:
			"Surat Peringatan Kedua (SP-2) & pemotongan gaji untuk pemulihan kerugian petty cash",
		headOfAntiFraudSignOff: "Bambang Wicaksono (Head of Anti-Fraud)",
		gateScore: 9,
		isEscalated: false,
	};
}

function fillFraudCriticalRiskSample() {
	store.assessmentType = "fraud";
	store.formData.general = {
		riskTitle:
			"Dugaan Kolusi Pengadaan Server Cloud & Pembayaran Vendor Fiktif",
		riskCategory: "financial",
		department: "IT Infrastructure & Cloud",
	};

	store.fraudData.modus = {
		modusSummary:
			"Pembuatan purchase order software fiktif senilai milyaran rupiah bekerja sama dengan approver IT internal",
		factorA: 8,
		factorB: 8,
		subScoreC: 16,
	};

	store.fraudData.loss = {
		lossCategory: "procurement_kickback",
		factorD: 9,
		factorE: 8,
		subScoreF: 17,
	};

	store.fraudData.containment = {
		immediateContainmentAction:
			"Pemblokiran rekening penampung pihak ketiga & penyitaan harddisk laptop kerja seluruh terlapor",
		digitalEvidenceStatus: "forensic_image_verified",
		allocatedForensicBudget: 250000000,
	};

	store.fraudData.gate = {
		internalInvestigationRecommendation:
			"Eskalasi pelaporan tindak pidana korupsi/penggelapan jabatan ke aparat penegak hukum",
		headOfAntiFraudSignOff:
			"Kombes Pol (Purn) Bambang Wicaksono (Head of Internal Fraud)",
		gateScore: 33,
		isEscalated: true,
	};

	store.fraudData.forensic = {
		assetTracingPlan:
			"Permintaan pemblokiran rekening bank melalui PPATK dan pelacakan aset properti pihak terkait",
		factorG1: 8,
		factorG2: 8,
		subScoreG: 16,
		chiefForensicAuditorApproved: true,
	};

	store.fraudData.lawEnforcement = {
		lawEnforcementAgency:
			"Bareskrim Polri (Direktorat Tindak Pidana Korupsi/Siber)",
		factorH1: 9,
		factorH2: 8,
		subScoreH: 17,
	};

	store.fraudData.boardSanction = {
		terminationDecreeNumber: "SK-DIR-2026/FRAUD/089-CRITICAL",
		legalDirectorSignOff:
			"Dr. Hendra Kusuma, S.H., LL.M. (Director of Legal & Compliance)",
		grandCumulativeFraudScore: 66,
	};
}
</script>

<template>
	<div class="max-w-4xl mx-auto my-4 space-y-3.5">
		<!-- Role Persona Switcher Header -->
		<RolePersonaSwitcher />

		<!-- Compact Control Bar: Status Info + Single Dropdown Preset -->
		<div
			class="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shadow-2xs"
		>
			<div class="flex items-center gap-2">
				<span class="font-bold text-slate-700">Track:</span>
				<span class="font-mono text-slate-900 uppercase font-semibold">
					{{ store.assessmentType === "fraud" ? "Fraud & FinCrime" : "Non-Fraud Risk" }}
				</span>
				<span class="text-slate-300">|</span>
				<span class="font-bold text-slate-700">Gate:</span>
				<span class="font-mono font-bold text-slate-900">{{ store.gateScore }} Pts</span>
				<span
					class="px-1.5 py-0.5 rounded text-[10px] font-bold border"
					:class="
						store.isEscalated
							? 'bg-rose-50 text-rose-700 border-rose-200'
							: 'bg-emerald-50 text-emerald-700 border-emerald-200'
					"
				>
					{{ store.isEscalated ? "8 Stages (Escalated)" : "5 Stages (Standard)" }}
				</span>
			</div>

			<!-- Compact Single Preset Dropdown -->
			<div class="flex items-center gap-2 self-end sm:self-center">
				<label class="text-[11px] text-slate-500 whitespace-nowrap">Autofill Skenario:</label>
				<select
					@change="onPresetSelected"
					class="text-xs bg-slate-50 border border-slate-300 rounded-md py-1 px-2.5 text-slate-700 hover:bg-slate-100 cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-400"
				>
					<option value="" selected disabled>Pilih Skenario Demo...</option>
					<option value="non_fraud_low">Non-Fraud Low (10 pts &rarr; 5 Stages)</option>
					<option value="non_fraud_crit">Non-Fraud Critical (32 pts &rarr; 8 Stages)</option>
					<option value="fraud_low">Fraud Disciplinary (9 pts &rarr; 5 Stages)</option>
					<option value="fraud_crit">Fraud Criminal (33 pts &rarr; 8 Stages)</option>
				</select>
			</div>
		</div>

		<!-- Main Wizard Container -->
		<div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
			<!-- Stepper Navigation (Compact Segmented) -->
			<RiskStepperNav
				:steps="activeSteps"
				:current-step="currentStep"
				:progress-percentage="progressPercentage"
				:is-escalated="store.isEscalated"
				@navigate="goToStep"
			/>

			<!-- Submission Success Screen (for Maker) -->
			<div
				v-if="store.submissionResult && workflowStore.activePersonaId === 'maker' && workflowStore.workflowStatus === 'PENDING_KABAG'"
				class="p-8 text-center bg-white"
			>
				<div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200 flex items-center justify-center mx-auto mb-3">
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
					</svg>
				</div>
				<h2 class="text-xl font-bold text-slate-900">
					Asesmen Berhasil Diajukan ke Kepala Bagian
				</h2>
				<p class="text-xs text-slate-500 mt-1 max-w-md mx-auto">
					Formulir telah masuk ke tahap review bertingkat. Klik tombol di bawah untuk langsung beralih login sebagai <strong>Kepala Bagian</strong> dan meninjau formulir mulai dari Tahap 1.
				</p>
				<div class="mt-4 inline-flex items-center gap-3 bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-700">
					<div>Ref No: <strong class="font-mono text-slate-900">{{ store.submissionResult.referenceNumber }}</strong></div>
					<div class="w-px h-3 bg-slate-300"></div>
					<div>Status: <strong class="text-sky-700">Menunggu Review Kepala Bagian</strong></div>
				</div>
				<div class="mt-5">
					<button
						type="button"
						@click="handleSwitchToApproverAfterSubmit"
						class="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg shadow-sm hover:bg-slate-800 cursor-pointer"
					>
						Beralih Login sebagai Kepala Bagian (Mulai Review dari Tahap 1) &rarr;
					</button>
				</div>
			</div>

			<!-- Dynamic Active Step Content -->
			<div v-else class="p-6 sm:p-8">
				<!-- If on Approval stage, render it outside the disabled fieldset -->
				<template v-if="currentStepComponent === StepApprovalGovernance">
					<component :is="currentStepComponent" />
				</template>
				<!-- Form fields wrapped in fieldset to enforce RBAC read-only mode -->
				<fieldset v-else :disabled="!workflowStore.isFieldEditable" class="contents">
					<KeepAlive>
						<component
							:is="currentStepComponent"
							:errors="stepErrors"
						/>
					</KeepAlive>
				</fieldset>
			</div>

			<!-- Stepper Wizard Actions Footer -->
			<RiskWizardFooter
				:current-step="currentStep"
				:is-first-step="isFirstStep"
				:is-last-step="isLastStep"
				:is-saving-draft="store.isSavingDraft"
				:is-submitting="store.isSubmitting"
				:is-escalated="store.isEscalated"
				:draft-id="store.draftId"
				:last-saved-at="store.lastSavedAt"
				:submit-error="store.submitError"
				@prev="prevStep"
				@next="handleNext"
				@save-draft="handleSaveDraft"
				@submit="handleSubmit"
			/>
		</div>
	</div>
</template>
