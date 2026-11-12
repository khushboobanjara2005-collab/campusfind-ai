import { describe, it, expect } from 'vitest';
import {
  compareReports,
  findRankedMatches,
  evaluateDateProximity,
  evaluateColourScore,
  evaluateCategoryScore,
  evaluateDescriptionScore,
  DEFAULT_MATCH_WEIGHTS,
} from './matcher';
import { ItemReport } from '../types';

describe('CampusFind AI Matching Engine Test Suite', () => {
  const baseLostReport: ItemReport = {
    id: 'lost-test-1',
    type: 'LOST',
    title: 'Matte Black Hydro Flask 32oz',
    category: 'Bottles & Tumblers',
    primaryColor: 'Black',
    location: 'Main Library',
    specificLocation: '2nd floor quiet study area',
    date: '2026-10-12',
    description: 'Matte black 32oz vacuum insulated Hydro Flask with wide mouth flex cap and national park sticker.',
    brandModel: 'Hydro Flask',
    distinctiveFeatures: 'Yosemite mountain sticker on side',
    status: 'ACTIVE',
    createdAt: '2026-10-12T10:00:00Z',
    updatedAt: '2026-10-12T10:00:00Z',
  };

  const matchingFoundReport: ItemReport = {
    id: 'found-test-1',
    type: 'FOUND',
    title: 'Black thermal flask with park decal sticker',
    category: 'Bottles & Tumblers',
    primaryColor: 'Black',
    location: 'Main Library',
    specificLocation: '2nd floor library circulation desk',
    date: '2026-10-12',
    description: 'Black water bottle flask turned in from 2nd floor study tables with decal sticker.',
    brandModel: 'Hydro Flask',
    distinctiveFeatures: 'Scenic park sticker, base dent',
    status: 'ACTIVE',
    createdAt: '2026-10-12T14:00:00Z',
    updatedAt: '2026-10-12T14:00:00Z',
  };

  // 1. Strong matches test
  it('identifies strong matches with high similarity scores and high confidence', () => {
    const result = compareReports(baseLostReport, matchingFoundReport, DEFAULT_MATCH_WEIGHTS);

    expect(result.finalScore).toBeGreaterThanOrEqual(75);
    expect(result.confidenceTier).toMatch(/EXCELLENT|HIGH/);
    expect(result.contradictions.length).toBe(0);
    expect(result.componentScores.categoryScore).toBe(100);
    expect(result.componentScores.colourScore).toBe(100);
    expect(result.componentScores.dateScore).toBe(100);
    expect(result.reasons.length).toBeGreaterThan(0);
  });

  // 2. Incompatible categories test
  it('penalizes incompatible categories drastically down to near zero or low score', () => {
    const notebookFoundReport: ItemReport = {
      ...matchingFoundReport,
      id: 'found-notebook',
      title: 'Black spiral paper notebook',
      category: 'Books & Notebooks', // Incompatible with Bottles & Tumblers
      description: 'Ruled lined paper notebook left in library.',
    };

    const catEval = evaluateCategoryScore(baseLostReport.category, notebookFoundReport.category);
    expect(catEval.score).toBe(0);
    expect(catEval.contradiction).toBe(true);

    const matchResult = compareReports(baseLostReport, notebookFoundReport);
    expect(matchResult.contradictions.length).toBeGreaterThanOrEqual(1);
    expect(matchResult.contradictions[0]).toContain('Incompatible');
    // Final score should be heavily penalized
    expect(matchResult.finalScore).toBeLessThan(35);
  });

  // 3. Colour and location contradictions test
  it('properly penalizes distinct colour and distant location contradictions', () => {
    const redDistantFound: ItemReport = {
      ...matchingFoundReport,
      id: 'found-red-distant',
      primaryColor: 'Red', // Direct contradiction with Black
      location: 'South Dormitories', // Distant from Main Library
      specificLocation: 'Lakeside path',
    };

    const colorEval = evaluateColourScore(baseLostReport.primaryColor, redDistantFound.primaryColor);
    expect(colorEval.contradiction).toBe(true);
    expect(colorEval.score).toBeLessThanOrEqual(10);

    const matchResult = compareReports(baseLostReport, redDistantFound);
    expect(matchResult.componentScores.colourScore).toBeLessThanOrEqual(10);
    expect(matchResult.componentScores.locationScore).toBeLessThanOrEqual(35);
    expect(matchResult.contradictions.some((c) => c.toLowerCase().includes('colour'))).toBe(true);
  });

  // 4. Missing information test
  it('handles missing fields without awarding full credit and displays appropriate warnings', () => {
    const missingInfoFound: ItemReport = {
      id: 'found-sparse',
      type: 'FOUND',
      title: 'Flask',
      category: 'Bottles & Tumblers',
      primaryColor: 'Black',
      location: '', // Missing location
      date: '2026-10-12',
      description: '', // Missing description
      status: 'ACTIVE',
      createdAt: '2026-10-12T15:00:00Z',
      updatedAt: '2026-10-12T15:00:00Z',
    };

    const descEval = evaluateDescriptionScore(baseLostReport, missingInfoFound);
    expect(descEval.warnings.length).toBeGreaterThan(0);
    expect(descEval.score).toBeLessThanOrEqual(25);

    const matchResult = compareReports(baseLostReport, missingInfoFound);
    expect(matchResult.warnings.length).toBeGreaterThan(0);
  });

  // 5. Returned-item exclusion test
  it('strictly excludes returned/resolved items from active candidate matching pool', () => {
    const resolvedItem: ItemReport = {
      ...matchingFoundReport,
      id: 'found-resolved',
      status: 'RESOLVED_RECOVERED',
      recoveredAt: '2026-10-12T16:00:00Z',
    };

    const activeItem: ItemReport = {
      ...matchingFoundReport,
      id: 'found-active',
      status: 'ACTIVE',
    };

    const results = findRankedMatches(baseLostReport, [resolvedItem, activeItem]);
    expect(results.some((r) => r.candidateId === 'found-resolved')).toBe(false);
    expect(results.some((r) => r.candidateId === 'found-active')).toBe(true);
  });

  // 6. Empty datasets test
  it('gracefully handles empty datasets without exceptions', () => {
    const results = findRankedMatches(baseLostReport, []);
    expect(results).toEqual([]);
  });

  // 7. Score bounds test
  it('guarantees all component and final scores remain strictly between 0 and 100', () => {
    const extremeVariants: ItemReport[] = [
      { ...matchingFoundReport, primaryColor: 'Red', location: 'Unknown Void', description: '???' },
      { ...matchingFoundReport, date: '1990-01-01' },
      { ...baseLostReport, type: 'FOUND' },
    ];

    extremeVariants.forEach((variant) => {
      const res = compareReports(baseLostReport, variant);
      expect(res.finalScore).toBeGreaterThanOrEqual(0);
      expect(res.finalScore).toBeLessThanOrEqual(100);
      expect(res.componentScores.descriptionScore).toBeGreaterThanOrEqual(0);
      expect(res.componentScores.descriptionScore).toBeLessThanOrEqual(100);
      expect(res.componentScores.categoryScore).toBeGreaterThanOrEqual(0);
      expect(res.componentScores.categoryScore).toBeLessThanOrEqual(100);
      expect(res.componentScores.locationScore).toBeGreaterThanOrEqual(0);
      expect(res.componentScores.locationScore).toBeLessThanOrEqual(100);
      expect(res.componentScores.colourScore).toBeGreaterThanOrEqual(0);
      expect(res.componentScores.colourScore).toBeLessThanOrEqual(100);
      expect(res.componentScores.dateScore).toBeGreaterThanOrEqual(0);
      expect(res.componentScores.dateScore).toBeLessThanOrEqual(100);
    });
  });

  // 8. Descending ranking test
  it('correctly ranks candidate matches in descending score order with deterministic tie-breaking', () => {
    const perfectCandidate: ItemReport = { ...matchingFoundReport, id: 'perfect-cand' };
    const mediocreCandidate: ItemReport = {
      ...matchingFoundReport,
      id: 'mediocre-cand',
      location: 'North Dormitories',
      primaryColor: 'Silver / Grey',
      title: 'Metal drinking container',
      description: 'Found metal bottle on grass.',
    };
    const poorCandidate: ItemReport = {
      ...matchingFoundReport,
      id: 'poor-cand',
      category: 'Jewelry & Accessories',
      primaryColor: 'Red',
      location: 'Transit Hub',
      title: 'Random red bracelet',
      description: 'Locker item.',
    };

    const results = findRankedMatches(baseLostReport, [mediocreCandidate, poorCandidate, perfectCandidate]);

    expect(results.length).toBe(3);
    expect(results[0].candidateId).toBe('perfect-cand');
    expect(results[1].candidateId).toBe('mediocre-cand');
    expect(results[2].candidateId).toBe('poor-cand');

    // Verify monotonic descending order
    for (let i = 0; i < results.length - 1; i++) {
      expect(results[i].finalScore).toBeGreaterThanOrEqual(results[i + 1].finalScore);
    }
  });

  // 9. Invalid dates test
  it('safely evaluates invalid or unparseable dates without throwing errors', () => {
    const invalidDateResult = evaluateDateProximity('invalid-date', '2026-10-12');
    expect(invalidDateResult.score).toBe(25);
    expect(invalidDateResult.warning).toBeDefined();

    const emptyDateResult = evaluateDateProximity('', '');
    expect(emptyDateResult.score).toBe(30);
    expect(emptyDateResult.warning).toBeDefined();
  });
});
