import { describe, expect, it } from 'vitest';
import { SETS } from '../src/data';

describe('roadmap data', () => {
  it.each([
    ['blind75', 75],
    ['neetcode150', 150],
    ['neetcode250', 250],
  ])('contains the expected number of problems in %s', (setKey, expectedSize) => {
    expect(SETS[setKey].problems).toHaveLength(expectedSize);
  });

  it('keeps each roadmap problem key unique and well formed', () => {
    Object.values(SETS).forEach(({ problems }) => {
      expect(new Set(problems.map((problem) => problem[3])).size).toBe(problems.length);
      problems.forEach((problem) => {
        expect(problem.length).toBeGreaterThanOrEqual(4);
        expect(problem[0]).toEqual(expect.any(String));
        expect(problem[1]).toEqual(expect.any(String));
        expect(['E', 'M', 'H']).toContain(problem[2]);
      });
    });
  });

  it('shares matching problem keys between practice sets', () => {
    const blindKeys = new Set(SETS.blind75.problems.map((problem) => problem[3]));
    const neetcodeKeys = new Set(SETS.neetcode150.problems.map((problem) => problem[3]));

    expect([...blindKeys].filter((key) => neetcodeKeys.has(key))).not.toHaveLength(0);
  });

  it('stores canonical NeetCode slugs for renamed routes', () => {
    expect(SETS.neetcode150.problems.find((problem) => problem[3] === 'contains-duplicate')[4]).toBe(
      'duplicate-integer',
    );
    expect(SETS.neetcode150.problems.find((problem) => problem[3] === 'valid-anagram')[4]).toBe(
      'is-anagram',
    );
  });
});
