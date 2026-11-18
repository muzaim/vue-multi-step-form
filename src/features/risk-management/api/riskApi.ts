import type { RiskFormData } from '../types/risk.types';

// In-memory mock storage simulating remote database
let mockDraftDatabase: Record<string, Partial<RiskFormData>> = {};
let mockSubmittedDatabase: Record<string, RiskFormData> = {};

function simulateDelay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const riskApi = {
  /**
   * Simulates saving draft assessment to server
   */
  async saveDraft(data: Partial<RiskFormData>): Promise<{ draftId: string; savedAt: string }> {
    await simulateDelay(600); // simulate network latency
    const draftId = `DRAFT-${Date.now().toString(36).toUpperCase()}`;
    mockDraftDatabase[draftId] = JSON.parse(JSON.stringify(data));
    return {
      draftId,
      savedAt: new Date().toISOString(),
    };
  },

  /**
   * Simulates fetching draft assessment from server
   */
  async getDraft(draftId: string): Promise<Partial<RiskFormData>> {
    await simulateDelay(500);
    const draft = mockDraftDatabase[draftId];
    if (!draft) {
      throw new Error(`Draft with ID ${draftId} not found.`);
    }
    return JSON.parse(JSON.stringify(draft));
  },

  /**
   * Simulates final submission of complete 50-field risk assessment
   */
  async submitAssessment(data: RiskFormData): Promise<{
    success: boolean;
    assessmentId: string;
    referenceNumber: string;
    submittedAt: string;
  }> {
    await simulateDelay(1000);
    const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
    const referenceNumber = `RSK-${new Date().getFullYear()}-${randomHex}`;
    const assessmentId = `ASM-${Date.now()}`;
    mockSubmittedDatabase[assessmentId] = JSON.parse(JSON.stringify(data));

    return {
      success: true,
      assessmentId,
      referenceNumber,
      submittedAt: new Date().toISOString(),
    };
  },
};
