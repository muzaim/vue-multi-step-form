import { z } from 'zod';
import type { RiskFormData } from '../types/risk.types';
import type { FraudFormData, AssessmentType } from '../types/fraud.types';
import { validateFraudStageData, validateFullFraudForm } from './fraudValidation.ts';

export const generalSchema = z.object({
  riskTitle: z.string().trim().min(5, 'Judul risiko minimal 5 karakter'),
  riskCategory: z.enum(['operational', 'financial', 'cybersecurity', 'compliance', 'reputational'], {
    errorMap: () => ({ message: 'Pilih kategori risiko yang valid' }),
  }),
  department: z.string().trim().min(2, 'Pilih departemen terkait'),
});

export const identificationSchema = z.object({
  threatDescription: z.string().trim().min(5, 'Deskripsi ancaman minimal 5 karakter'),
  factorA: z.number().min(1).max(10, 'Faktor A (Threat Frequency) harus antara 1 dan 10'),
  factorB: z.number().min(1).max(10, 'Faktor B (Vulnerability Ease) harus antara 1 dan 10'),
  subScoreC: z.number().min(2, 'Sub-skor C belum terkalkulasi'),
});

export const analysisSchema = z.object({
  operationalImpact: z.enum(['negligible', 'moderate', 'severe', 'catastrophic'], {
    errorMap: () => ({ message: 'Pilih level dampak operasional' }),
  }),
  factorD: z.number().min(1).max(10, 'Faktor D (Loss Weight) harus antara 1 dan 10'),
  factorE: z.number().min(1).max(10, 'Faktor E (Regulatory Severity) harus antara 1 dan 10'),
  subScoreF: z.number().min(2, 'Sub-skor F belum terkalkulasi'),
});

export const mitigationSchema = z.object({
  actionPlanTitle: z.string().trim().min(5, 'Judul rencana aksi mitigasi minimal 5 karakter'),
  treatmentStrategy: z.enum(['avoid', 'mitigate', 'transfer', 'accept'], {
    errorMap: () => ({ message: 'Pilih strategi mitigasi risiko' }),
  }),
  allocatedBudget: z.number().min(0, 'Alokasi anggaran tidak boleh negatif'),
});

export const reviewSchema = z.object({
  monitoringMetricKRI: z.string().trim().min(3, 'Metrik KRI pemantauan minimal 3 karakter'),
  complianceSignOff: z.string().trim().min(2, 'Nama pejabat compliance officer wajib diisi'),
  gateScore: z.number().min(0),
  isEscalated: z.boolean(),
});

export const deepMitigationSchema = z.object({
  escalatedActionPlan: z.string().trim().min(5, 'Rencana aksi eskalasi minimal 5 karakter'),
  factorG1: z.number().min(1).max(10, 'Faktor G1 (Cost Weight) harus antara 1 dan 10'),
  factorG2: z.number().min(1).max(10, 'Faktor G2 (Complexity) harus antara 1 dan 10'),
  subScoreG: z.number().min(2, 'Sub-skor G belum terkalkulasi'),
  chiefRiskOfficerApproved: z.literal(true, {
    errorMap: () => ({ message: 'Persetujuan CRO wajib dicentang untuk risiko eskalasi' }),
  }),
});

export const boardOversightSchema = z.object({
  boardCommitteeName: z.string().trim().min(3, 'Pilih komite dewan pengawas'),
  factorH1: z.number().min(1).max(10, 'Faktor H1 (Board Rigor) harus antara 1 dan 10'),
  factorH2: z.number().min(1).max(10, 'Faktor H2 (Audit Scrutiny) harus antara 1 dan 10'),
  subScoreH: z.number().min(2, 'Sub-skor H belum terkalkulasi'),
});

export const executiveSignOffSchema = z.object({
  boardResolutionNumber: z.string().trim().min(3, 'Nomor resolusi dewan minimal 3 karakter'),
  ceoSignOff: z.string().trim().min(2, 'Tanda tangan / nama CEO wajib diisi'),
  grandCumulativeRiskScore: z.number().min(4, 'Grand cumulative score belum terkalkulasi'),
});

export type ValidationErrors = Record<string, string>;

export function validateStageData(stageIndex: number, formData: RiskFormData): {
  isValid: boolean;
  errors: ValidationErrors;
} {
  const schemas = [
    { schema: generalSchema, data: formData.general },
    { schema: identificationSchema, data: formData.identification },
    { schema: analysisSchema, data: formData.analysis },
    { schema: mitigationSchema, data: formData.mitigation },
    { schema: reviewSchema, data: formData.review },
    { schema: deepMitigationSchema, data: formData.deepMitigation },
    { schema: boardOversightSchema, data: formData.boardOversight },
    { schema: executiveSignOffSchema, data: formData.executiveSignOff },
  ];

  const target = schemas[stageIndex - 1];
  if (!target) return { isValid: true, errors: {} };

  const result = target.schema.safeParse(target.data);
  if (result.success) {
    return { isValid: true, errors: {} };
  }

  const errors: ValidationErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (field && typeof field === 'string') {
      errors[field] = issue.message;
    }
  }

  return { isValid: false, errors };
}

export function validateFullForm(formData: RiskFormData, isEscalated: boolean): boolean {
  const baseValid =
    generalSchema.safeParse(formData.general).success &&
    identificationSchema.safeParse(formData.identification).success &&
    analysisSchema.safeParse(formData.analysis).success &&
    mitigationSchema.safeParse(formData.mitigation).success &&
    reviewSchema.safeParse(formData.review).success;

  if (!isEscalated) return baseValid;

  return (
    baseValid &&
    deepMitigationSchema.safeParse(formData.deepMitigation).success &&
    boardOversightSchema.safeParse(formData.boardOversight).success &&
    executiveSignOffSchema.safeParse(formData.executiveSignOff).success
  );
}

/**
 * Unified track-aware stage validator:
 * Stage 1 always validates generalSchema on formData.general for both tracks.
 */
export function validateTrackStageData(
  track: AssessmentType,
  stageIndex: number,
  formData: RiskFormData,
  fraudData: FraudFormData,
  isEscalated: boolean = false
): { isValid: boolean; errors: ValidationErrors } {
  // Stage 6 (standard) and Stage 9 (escalated) are the Approval stage which needs no form field input validation
  if ((!isEscalated && stageIndex === 6) || (isEscalated && stageIndex === 9)) {
    return { isValid: true, errors: {} };
  }

  if (stageIndex === 1) {
    const res = generalSchema.safeParse(formData.general);
    if (res.success) return { isValid: true, errors: {} };
    const errors: ValidationErrors = {};
    for (const issue of res.error.issues) {
      const field = issue.path[0];
      if (field && typeof field === 'string') {
        errors[field] = issue.message;
      }
    }
    return { isValid: false, errors };
  }

  if (track === 'fraud') {
    return validateFraudStageData(stageIndex, fraudData);
  }
  return validateStageData(stageIndex, formData);
}

/**
 * Unified track-aware full form validator
 */
export function validateTrackFullForm(
  track: AssessmentType,
  formData: RiskFormData,
  fraudData: FraudFormData,
  isEscalated: boolean
): boolean {
  const isGeneralValid = generalSchema.safeParse(formData.general).success;
  if (!isGeneralValid) return false;

  if (track === 'fraud') {
    return validateFullFraudForm(isGeneralValid, fraudData, isEscalated);
  }
  return validateFullForm(formData, isEscalated);
}

export { validateFraudStageData, validateFullFraudForm };
