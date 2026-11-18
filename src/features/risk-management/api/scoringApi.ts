export type BenchmarkBand = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';

export type BenchmarkScoreContext = 'subscore' | 'gate' | 'grand_total';

export interface BenchmarkResult {
  score: number;
  band: BenchmarkBand;
  label: string;
  description: string;
  badgeClass: string;
}

export function calculateBenchmarkBand(
  score: number,
  context: BenchmarkScoreContext = 'subscore'
): { band: BenchmarkBand; label: string; description: string; badgeClass: string } {
  const numericScore = Number(score) || 0;

  if (context === 'grand_total') {
    if (numericScore < 14) {
      return {
        band: 'LOW',
        label: 'Low Aggregate Risk',
        description: 'Manageable overall enterprise exposure within risk appetite thresholds.',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      };
    }
    if (numericScore <= 22) {
      return {
        band: 'NORMAL',
        label: 'Moderate Aggregate Risk',
        description: 'Standard enterprise exposure requiring regular operational oversight.',
        badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
      };
    }
    if (numericScore <= 30) {
      return {
        band: 'HIGH',
        label: 'High Aggregate Risk',
        description: 'Elevated aggregate exposure requiring active mitigation and committee tracking.',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      };
    }
    return {
      band: 'CRITICAL',
      label: 'Critical Aggregate Risk',
      description: 'Severe cumulative exposure requiring emergency board intervention.',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    };
  }

  if (context === 'gate') {
    if (numericScore < 8) {
      return {
        band: 'LOW',
        label: 'Low Gate Exposure',
        description: 'Below baseline threshold; qualifies for standard 5-stage closure.',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      };
    }
    if (numericScore < 15) {
      return {
        band: 'NORMAL',
        label: 'Standard Gate Exposure',
        description: 'Within acceptable boundaries; qualifies for standard 5-stage sign-off.',
        badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
      };
    }
    if (numericScore <= 18) {
      return {
        band: 'HIGH',
        label: 'High Gate Risk (Escalated)',
        description: 'Breaches threshold (≥15); automatically escalates to 8-stage deep governance.',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      };
    }
    return {
      band: 'CRITICAL',
      label: 'Critical Gate Risk (Escalated)',
      description: 'Substantial breach requiring comprehensive executive and board oversight.',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    };
  }

  // Default context: 'subscore' (sum of two factors 1-10, range 2-20)
  if (numericScore < 6) {
    return {
      band: 'LOW',
      label: 'Low Risk',
      description: 'Score index is well within baseline toleration limits.',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };
  }
  if (numericScore <= 10) {
    return {
      band: 'NORMAL',
      label: 'Normal Risk',
      description: 'Score index indicates standard operational risk parameters.',
      badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
    };
  }
  if (numericScore <= 15) {
    return {
      band: 'HIGH',
      label: 'High Risk',
      description: 'Score index demonstrates elevated risk factors requiring mitigative attention.',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    };
  }
  return {
    band: 'CRITICAL',
    label: 'Critical Risk',
    description: 'Score index demonstrates critical vulnerability requiring immediate response.',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
  };
}

export const scoringApi = {
  async evaluateScore(
    score: number,
    context: BenchmarkScoreContext = 'subscore'
  ): Promise<BenchmarkResult> {
    // Simulate API network latency
    await new Promise((resolve) => setTimeout(resolve, 150));
    const result = calculateBenchmarkBand(score, context);
    return {
      score,
      ...result,
    };
  },
};
