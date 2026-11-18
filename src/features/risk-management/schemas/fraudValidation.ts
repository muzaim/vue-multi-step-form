import { z } from 'zod';
import type { FraudFormData } from '../types/fraud.types';

export const fraudModusSchema = z.object({
  modusSummary: z.string().trim().min(5, 'Ringkasan modus operandi minimal 5 karakter'),
  factorA: z.number().min(1).max(10, 'Faktor A (Frekuensi Anomali) harus antara 1 dan 10'),
  factorB: z.number().min(1).max(10, 'Faktor B (Kompleksitas Celah) harus antara 1 dan 10'),
  subScoreC: z.number().min(2, 'Sub-skor C fraud belum terkalkulasi'),
});

export const fraudLossSchema = z.object({
  lossCategory: z.string().trim().min(2, 'Pilih kategori kerugian fraud'),
  factorD: z.number().min(1).max(10, 'Faktor D (Potensi Kerugian) harus antara 1 dan 10'),
  factorE: z.number().min(1).max(10, 'Faktor E (Keparahan Regulasi) harus antara 1 dan 10'),
  subScoreF: z.number().min(2, 'Sub-skor F fraud belum terkalkulasi'),
});

export const fraudContainmentSchema = z.object({
  immediateContainmentAction: z.string().trim().min(5, 'Tindakan pengamanan aset minimal 5 karakter'),
  digitalEvidenceStatus: z.string().trim().min(2, 'Pilih status bukti digital & forensik'),
  allocatedForensicBudget: z.number().min(0, 'Anggaran forensik tidak boleh negatif'),
});

export const fraudGateSchema = z.object({
  internalInvestigationRecommendation: z.string().trim().min(3, 'Rekomendasi investigasi minimal 3 karakter'),
  headOfAntiFraudSignOff: z.string().trim().min(2, 'Nama pejabat Kepala Unit Anti-Fraud wajib diisi'),
  gateScore: z.number().min(0),
  isEscalated: z.boolean(),
});

export const fraudForensicSchema = z.object({
  assetTracingPlan: z.string().trim().min(5, 'Rencana pelacakan aset minimal 5 karakter'),
  factorG1: z.number().min(1).max(10, 'Faktor G1 (Kesulitan Forensik) harus antara 1 dan 10'),
  factorG2: z.number().min(1).max(10, 'Faktor G2 (Probabilitas Recovery) harus antara 1 dan 10'),
  subScoreG: z.number().min(2, 'Sub-skor G fraud belum terkalkulasi'),
  chiefForensicAuditorApproved: z.literal(true, {
    errorMap: () => ({ message: 'Persetujuan Kepala Audit Forensik wajib dicentang' }),
  }),
});

export const fraudLawEnforcementSchema = z.object({
  lawEnforcementAgency: z.string().trim().min(2, 'Pilih instansi penegak hukum'),
  factorH1: z.number().min(1).max(10, 'Faktor H1 (Kerahasiaan Whistleblower) harus antara 1 dan 10'),
  factorH2: z.number().min(1).max(10, 'Faktor H2 (Risiko Tuntutan Balik) harus antara 1 dan 10'),
  subScoreH: z.number().min(2, 'Sub-skor H fraud belum terkalkulasi'),
});

export const fraudBoardSanctionSchema = z.object({
  terminationDecreeNumber: z.string().trim().min(3, 'Nomor SK Pemberhentian/Kuasa Hukum minimal 3 karakter'),
  legalDirectorSignOff: z.string().trim().min(2, 'Nama Direktur Legal & Kepatuhan wajib diisi'),
  grandCumulativeFraudScore: z.number().min(4, 'Grand cumulative fraud score belum terkalkulasi'),
});

export type ValidationErrors = Record<string, string>;

export function validateFraudStageData(stageIndex: number, fraudData: FraudFormData): {
  isValid: boolean;
  errors: ValidationErrors;
} {
  const schemas: Record<number, { schema: z.ZodTypeAny; data: any }> = {
    2: { schema: fraudModusSchema, data: fraudData.modus },
    3: { schema: fraudLossSchema, data: fraudData.loss },
    4: { schema: fraudContainmentSchema, data: fraudData.containment },
    5: { schema: fraudGateSchema, data: fraudData.gate },
    6: { schema: fraudForensicSchema, data: fraudData.forensic },
    7: { schema: fraudLawEnforcementSchema, data: fraudData.lawEnforcement },
    8: { schema: fraudBoardSanctionSchema, data: fraudData.boardSanction },
  };

  const target = schemas[stageIndex];
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

export function validateFullFraudForm(
  isGeneralValid: boolean,
  fraudData: FraudFormData,
  isEscalated: boolean
): boolean {
  const baseValid =
    isGeneralValid &&
    fraudModusSchema.safeParse(fraudData.modus).success &&
    fraudLossSchema.safeParse(fraudData.loss).success &&
    fraudContainmentSchema.safeParse(fraudData.containment).success &&
    fraudGateSchema.safeParse(fraudData.gate).success;

  if (!isEscalated) return baseValid;

  return (
    baseValid &&
    fraudForensicSchema.safeParse(fraudData.forensic).success &&
    fraudLawEnforcementSchema.safeParse(fraudData.lawEnforcement).success &&
    fraudBoardSanctionSchema.safeParse(fraudData.boardSanction).success
  );
}
