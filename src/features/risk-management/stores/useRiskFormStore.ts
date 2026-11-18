import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import type { RiskFormData } from "../types/risk.types";
import type { FraudFormData, AssessmentType } from "../types/fraud.types";
import { riskApi } from "../api/riskApi.ts";
import {
	scoringApi,
	calculateBenchmarkBand,
	type BenchmarkResult,
} from "../api/scoringApi.ts";

function getInitialFormData(): RiskFormData {
	return {
		general: {
			riskTitle: "",
			riskCategory: "",
			department: "",
		},
		identification: {
			threatDescription: "",
			factorA: 0, // Threat Frequency (1 - 10)
			factorB: 0, // Vulnerability Ease (1 - 10)
			subScoreC: 0,
		},
		analysis: {
			operationalImpact: "",
			factorD: 0, // Financial Loss Weight (1 - 10)
			factorE: 0, // Regulatory Penalty Severity (1 - 10)
			subScoreF: 0,
		},
		mitigation: {
			actionPlanTitle: "",
			treatmentStrategy: "",
			allocatedBudget: 0,
		},
		review: {
			monitoringMetricKRI: "",
			complianceSignOff: "",
			gateScore: 0,
			isEscalated: false,
		},
		deepMitigation: {
			escalatedActionPlan: "",
			factorG1: 0, // Mitigation Cost Weight (1 - 10)
			factorG2: 0, // Implementation Complexity (1 - 10)
			subScoreG: 0,
			chiefRiskOfficerApproved: false,
		},
		boardOversight: {
			boardCommitteeName: "",
			factorH1: 0, // Board Oversight Rigor (1 - 10)
			factorH2: 0, // Audit Scrutiny (1 - 10)
			subScoreH: 0,
		},
		executiveSignOff: {
			boardResolutionNumber: "",
			ceoSignOff: "",
			grandCumulativeRiskScore: 0,
		},
	};
}

function getInitialFraudData(): FraudFormData {
	return {
		general: {
			caseTitle: "",
			reportedDepartment: "",
		},
		modus: {
			modusSummary: "",
			factorA: 0, // Anomaly Frequency (1 - 10)
			factorB: 0, // Collusion Ease (1 - 10)
			subScoreC: 0,
		},
		loss: {
			lossCategory: "",
			factorD: 0, // Direct Loss Weight (1 - 10)
			factorE: 0, // Reputational Severity (1 - 10)
			subScoreF: 0,
		},
		containment: {
			immediateContainmentAction: "",
			digitalEvidenceStatus: "",
			allocatedForensicBudget: 0,
		},
		gate: {
			internalInvestigationRecommendation: "",
			headOfAntiFraudSignOff: "",
			gateScore: 0,
			isEscalated: false,
		},
		forensic: {
			assetTracingPlan: "",
			factorG1: 0, // Evidence Complexity (1 - 10)
			factorG2: 0, // Recovery Probability (1 - 10)
			subScoreG: 0,
			chiefForensicAuditorApproved: false,
		},
		lawEnforcement: {
			lawEnforcementAgency: "",
			factorH1: 0, // Whistleblower Rigor (1 - 10)
			factorH2: 0, // Counter-Litigation Risk (1 - 10)
			subScoreH: 0,
		},
		boardSanction: {
			terminationDecreeNumber: "",
			legalDirectorSignOff: "",
			grandCumulativeFraudScore: 0,
		},
	};
}

export const useRiskFormStore = defineStore("riskForm", () => {
	const assessmentType = ref<AssessmentType>("non_fraud");
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
		() => [
			formData.value.identification.factorA,
			formData.value.identification.factorB,
		],
		([a, b]) => {
			formData.value.identification.subScoreC =
				(Number(a) || 0) + (Number(b) || 0);
		},
		{ immediate: true }
	);

	// 2. Stage 3: subScoreF = factorD + factorE
	watch(
		() => [
			formData.value.analysis.factorD,
			formData.value.analysis.factorE,
		],
		([d, e]) => {
			formData.value.analysis.subScoreF =
				(Number(d) || 0) + (Number(e) || 0);
		},
		{ immediate: true }
	);

	// 3. Stage 5 Gate: gateScore = subScoreC + subScoreF
	watch(
		() => [
			formData.value.identification.subScoreC,
			formData.value.analysis.subScoreF,
		],
		([c, f]) => {
			const total = (Number(c) || 0) + (Number(f) || 0);
			formData.value.review.gateScore = total;
			formData.value.review.isEscalated = total >= 15;
		},
		{ immediate: true }
	);

	// 4. Stage 6: subScoreG = factorG1 + factorG2
	watch(
		() => [
			formData.value.deepMitigation.factorG1,
			formData.value.deepMitigation.factorG2,
		],
		([g1, g2]) => {
			formData.value.deepMitigation.subScoreG =
				(Number(g1) || 0) + (Number(g2) || 0);
		},
		{ immediate: true }
	);

	// 5. Stage 7: subScoreH = factorH1 + factorH2
	watch(
		() => [
			formData.value.boardOversight.factorH1,
			formData.value.boardOversight.factorH2,
		],
		([h1, h2]) => {
			formData.value.boardOversight.subScoreH =
				(Number(h1) || 0) + (Number(h2) || 0);
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
				(Number(c) || 0) +
				(Number(f) || 0) +
				(Number(g) || 0) +
				(Number(h) || 0);
		},
		{ immediate: true }
	);

	// --- Fraud Reactive Calculations ---
	// 1. Stage 2 Fraud: subScoreC = factorA + factorB
	watch(
		() => [fraudData.value.modus.factorA, fraudData.value.modus.factorB],
		([a, b]) => {
			fraudData.value.modus.subScoreC =
				(Number(a) || 0) + (Number(b) || 0);
		},
		{ immediate: true }
	);

	// 2. Stage 3 Fraud: subScoreF = factorD + factorE
	watch(
		() => [fraudData.value.loss.factorD, fraudData.value.loss.factorE],
		([d, e]) => {
			fraudData.value.loss.subScoreF =
				(Number(d) || 0) + (Number(e) || 0);
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
		() => [
			fraudData.value.forensic.factorG1,
			fraudData.value.forensic.factorG2,
		],
		([g1, g2]) => {
			fraudData.value.forensic.subScoreG =
				(Number(g1) || 0) + (Number(g2) || 0);
		},
		{ immediate: true }
	);

	// 5. Stage 7 Fraud: subScoreH = factorH1 + factorH2
	watch(
		() => [
			fraudData.value.lawEnforcement.factorH1,
			fraudData.value.lawEnforcement.factorH2,
		],
		([h1, h2]) => {
			fraudData.value.lawEnforcement.subScoreH =
				(Number(h1) || 0) + (Number(h2) || 0);
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
				(Number(c) || 0) +
				(Number(f) || 0) +
				(Number(g) || 0) +
				(Number(h) || 0);
		},
		{ immediate: true }
	);

	// Track-aware dynamic computeds
	const isEscalated = computed(() => {
		return assessmentType.value === "fraud"
			? fraudData.value.gate.isEscalated
			: formData.value.review.isEscalated;
	});

	const currentSubScoreC = computed(() => {
		return assessmentType.value === "fraud"
			? fraudData.value.modus.subScoreC
			: formData.value.identification.subScoreC;
	});

	const currentSubScoreF = computed(() => {
		return assessmentType.value === "fraud"
			? fraudData.value.loss.subScoreF
			: formData.value.analysis.subScoreF;
	});

	const currentSubScoreG = computed(() => {
		return assessmentType.value === "fraud"
			? fraudData.value.forensic.subScoreG
			: formData.value.deepMitigation.subScoreG;
	});

	const currentSubScoreH = computed(() => {
		return assessmentType.value === "fraud"
			? fraudData.value.lawEnforcement.subScoreH
			: formData.value.boardOversight.subScoreH;
	});

	const gateScore = computed(() => {
		return assessmentType.value === "fraud"
			? fraudData.value.gate.gateScore
			: formData.value.review.gateScore;
	});

	const grandTotalScore = computed(() => {
		return assessmentType.value === "fraud"
			? fraudData.value.boardSanction.grandCumulativeFraudScore
			: formData.value.executiveSignOff.grandCumulativeRiskScore;
	});

	// --- Reactive Benchmark Evaluation via simulated Scoring API ---
	const benchmarkSubScoreC = ref<BenchmarkResult>({
		score: 0,
		...calculateBenchmarkBand(0, "subscore"),
	});
	const benchmarkSubScoreF = ref<BenchmarkResult>({
		score: 0,
		...calculateBenchmarkBand(0, "subscore"),
	});
	const benchmarkGate = ref<BenchmarkResult>({
		score: 0,
		...calculateBenchmarkBand(0, "gate"),
	});
	const benchmarkSubScoreG = ref<BenchmarkResult>({
		score: 0,
		...calculateBenchmarkBand(0, "subscore"),
	});
	const benchmarkSubScoreH = ref<BenchmarkResult>({
		score: 0,
		...calculateBenchmarkBand(0, "subscore"),
	});
	const benchmarkGrandTotal = ref<BenchmarkResult>({
		score: 0,
		...calculateBenchmarkBand(0, "grand_total"),
	});

	const isEvaluatingBenchmark = ref(false);

	watch(
		currentSubScoreC,
		async (score) => {
			isEvaluatingBenchmark.value = true;
			try {
				benchmarkSubScoreC.value = await scoringApi.evaluateScore(
					score,
					"subscore"
				);
			} finally {
				isEvaluatingBenchmark.value = false;
			}
		},
		{ immediate: true }
	);

	watch(
		currentSubScoreF,
		async (score) => {
			isEvaluatingBenchmark.value = true;
			try {
				benchmarkSubScoreF.value = await scoringApi.evaluateScore(
					score,
					"subscore"
				);
			} finally {
				isEvaluatingBenchmark.value = false;
			}
		},
		{ immediate: true }
	);

	watch(
		gateScore,
		async (score) => {
			isEvaluatingBenchmark.value = true;
			try {
				benchmarkGate.value = await scoringApi.evaluateScore(
					score,
					"gate"
				);
			} finally {
				isEvaluatingBenchmark.value = false;
			}
		},
		{ immediate: true }
	);

	watch(
		currentSubScoreG,
		async (score) => {
			isEvaluatingBenchmark.value = true;
			try {
				benchmarkSubScoreG.value = await scoringApi.evaluateScore(
					score,
					"subscore"
				);
			} finally {
				isEvaluatingBenchmark.value = false;
			}
		},
		{ immediate: true }
	);

	watch(
		currentSubScoreH,
		async (score) => {
			isEvaluatingBenchmark.value = true;
			try {
				benchmarkSubScoreH.value = await scoringApi.evaluateScore(
					score,
					"subscore"
				);
			} finally {
				isEvaluatingBenchmark.value = false;
			}
		},
		{ immediate: true }
	);

	watch(
		grandTotalScore,
		async (score) => {
			isEvaluatingBenchmark.value = true;
			try {
				benchmarkGrandTotal.value = await scoringApi.evaluateScore(
					score,
					"grand_total"
				);
			} finally {
				isEvaluatingBenchmark.value = false;
			}
		},
		{ immediate: true }
	);

	function resetForm() {
		assessmentType.value = "non_fraud";
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
			const payload =
				assessmentType.value === "fraud"
					? fraudData.value
					: formData.value;
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
			const payload =
				assessmentType.value === "fraud"
					? fraudData.value
					: formData.value;
			const res = await riskApi.submitAssessment(payload as any);
			submissionResult.value = {
				success: res.success,
				referenceNumber: res.referenceNumber,
				submittedAt: res.submittedAt,
			};
			return res;
		} catch (err: unknown) {
			submitError.value =
				err instanceof Error ? err.message : "Submission failed";
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
		currentSubScoreC,
		currentSubScoreF,
		currentSubScoreG,
		currentSubScoreH,
		benchmarkSubScoreC,
		benchmarkSubScoreF,
		benchmarkGate,
		benchmarkSubScoreG,
		benchmarkSubScoreH,
		benchmarkGrandTotal,
		isEvaluatingBenchmark,
		resetForm,
		saveDraft,
		submitAssessment,
	};
});
