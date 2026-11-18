import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateBenchmarkBand, scoringApi } from '../src/features/risk-management/api/scoringApi.ts';

describe('scoringApi benchmark classification', () => {
  test('classifies subscores correctly', () => {
    assert.equal(calculateBenchmarkBand(4, 'subscore').band, 'LOW');
    assert.equal(calculateBenchmarkBand(8, 'subscore').band, 'NORMAL');
    assert.equal(calculateBenchmarkBand(14, 'subscore').band, 'HIGH');
    assert.equal(calculateBenchmarkBand(18, 'subscore').band, 'CRITICAL');
  });

  test('classifies gate scores correctly', () => {
    assert.equal(calculateBenchmarkBand(6, 'gate').band, 'LOW');
    assert.equal(calculateBenchmarkBand(12, 'gate').band, 'NORMAL');
    assert.equal(calculateBenchmarkBand(16, 'gate').band, 'HIGH');
    assert.equal(calculateBenchmarkBand(20, 'gate').band, 'CRITICAL');
  });

  test('classifies grand total scores correctly', () => {
    assert.equal(calculateBenchmarkBand(10, 'grand_total').band, 'LOW');
    assert.equal(calculateBenchmarkBand(20, 'grand_total').band, 'NORMAL');
    assert.equal(calculateBenchmarkBand(28, 'grand_total').band, 'HIGH');
    assert.equal(calculateBenchmarkBand(36, 'grand_total').band, 'CRITICAL');
  });

  test('asynchronously evaluates scores via evaluateScore', async () => {
    const res = await scoringApi.evaluateScore(16, 'gate');
    assert.equal(res.score, 16);
    assert.equal(res.band, 'HIGH');
    assert.match(res.label, /High Gate Risk/);
    assert.ok(res.badgeClass.includes('amber'));
  });
});
