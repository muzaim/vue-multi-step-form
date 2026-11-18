import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { setActivePinia, createPinia } from 'pinia';
import { useRiskFormStore } from '../src/features/risk-management/stores/useRiskFormStore.ts';

describe('store reactive calculations and type preservation', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test('preserves numeric calculation for non-fraud factors (no string concatenation)', async () => {
    const store = useRiskFormStore();

    store.formData.identification.factorA = 7;
    store.formData.identification.factorB = 8;
    // Wait for Vue watch tick
    await new Promise((r) => setTimeout(r, 10));

    assert.equal(store.formData.identification.subScoreC, 15);
    assert.equal(typeof store.formData.identification.subScoreC, 'number');

    store.formData.analysis.factorD = 6;
    store.formData.analysis.factorE = 5;
    await new Promise((r) => setTimeout(r, 10));

    assert.equal(store.formData.analysis.subScoreF, 11);
    assert.equal(store.formData.review.gateScore, 26);
    assert.equal(store.isEscalated, true);
  });

  test('preserves numeric calculation for fraud factors', async () => {
    const store = useRiskFormStore();
    store.assessmentType = 'fraud';

    store.fraudData.modus.factorA = 2;
    store.fraudData.modus.factorB = 3;
    await new Promise((r) => setTimeout(r, 10));

    assert.equal(store.fraudData.modus.subScoreC, 5);

    store.fraudData.loss.factorD = 2;
    store.fraudData.loss.factorE = 2;
    await new Promise((r) => setTimeout(r, 10));

    assert.equal(store.fraudData.loss.subScoreF, 4);
    assert.equal(store.fraudData.gate.gateScore, 9);
    assert.equal(store.isEscalated, false);
  });
});
