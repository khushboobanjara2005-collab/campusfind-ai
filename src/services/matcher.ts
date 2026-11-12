import {
  ItemReport,
  ItemCategory,
  ItemColor,
  MatchWeightConfig,
  ComponentScores,
  MatchResult,
  ConfidenceTier,
} from '../types';
import { calculateLocationProximity } from './campusLocations';

/**
 * Default weights specified in requirements:
 * Description similarity: 35%
 * Category compatibility: 20%
 * Location similarity: 20%
 * Colour similarity: 15%
 * Date proximity: 10%
 */
export const DEFAULT_MATCH_WEIGHTS: MatchWeightConfig = {
  description: 0.35,
  category: 0.20,
  location: 0.20,
  colour: 0.15,
  date: 0.10,
};

/**
 * Campus & everyday lost item synonym vocabulary for token normalization.
 */
const SYNONYM_GROUPS: string[][] = [
  ['bottle', 'waterbottle', 'flask', 'hydroflask', 'tumbler', 'thermos', 'canteen', 'sipper'],
  ['laptop', 'macbook', 'thinkpad', 'dell', 'chromebook', 'notebookpc', 'computer'],
  ['notebook', 'journal', 'notepad', 'spiral', 'binder', 'diary', 'pad', 'sketchbook'],
  ['wallet', 'purse', 'billfold', 'moneyclip', 'cardholder', 'pouch'],
  ['phone', 'iphone', 'smartphone', 'galaxy', 'android', 'cellphone', 'mobile'],
  ['headphone', 'headphones', 'earphones', 'airpods', 'earbuds', 'buds', 'headset', 'airpod'],
  ['keys', 'keychain', 'fob', 'keyring', 'lanyard', 'carabiner', 'badge'],
  ['glasses', 'spectacles', 'eyewear', 'sunglasses', 'shades', 'frames', 'specs'],
  ['backpack', 'bag', 'rucksack', 'knapsack', 'tote', 'satchel', 'duffel'],
  ['jacket', 'hoodie', 'sweater', 'coat', 'sweatshirt', 'fleece', 'cardigan', 'outerwear'],
  ['watch', 'smartwatch', 'applewatch', 'timepiece', 'fitbit', 'band'],
  ['umbrella', 'brolly', 'parasol'],
  ['charger', 'adapter', 'cable', 'cord', 'powerbank', 'magsafe', 'lightning'],
  ['calculator', 'ti84', 'casio', 'graphingcalculator'],
];

// Map each word to its canonical group index
const SYNONYM_MAP: Map<string, string> = new Map();
SYNONYM_GROUPS.forEach((group) => {
  const canonical = group[0];
  group.forEach((word) => {
    SYNONYM_MAP.set(word, canonical);
  });
});

/**
 * Normalizes text: trims, lowercases, strips special characters, collapses whitespace.
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Tokenizes text and canonicalizes synonyms.
 */
export function tokenizeAndNormalize(text: string): string[] {
  const cleaned = normalizeText(text);
  if (!cleaned) return [];
  const rawTokens = cleaned.split(' ').filter((t) => t.length > 1);

  return rawTokens.map((token) => SYNONYM_MAP.get(token) || token);
}

/**
 * Character-level bigram Dice coefficient for fuzzy spelling tolerance.
 */
export function calculateDiceFuzzySimilarity(strA: string, strB: string): number {
  const a = normalizeText(strA).replace(/\s/g, '');
  const b = normalizeText(strB).replace(/\s/g, '');

  if (!a && !b) return 100;
  if (!a || !b) return 0;
  if (a === b) return 100;
  if (a.length < 2 || b.length < 2) return a === b ? 100 : 0;

  const getBigrams = (s: string): Map<string, number> => {
    const bigrams = new Map<string, number>();
    for (let i = 0; i < s.length - 1; i++) {
      const bg = s.substring(i, i + 2);
      bigrams.set(bg, (bigrams.get(bg) || 0) + 1);
    }
    return bigrams;
  };

  const bigramsA = getBigrams(a);
  const bigramsB = getBigrams(b);

  let intersection = 0;
  for (const [bg, countA] of bigramsA.entries()) {
    const countB = bigramsB.get(bg) || 0;
    intersection += Math.min(countA, countB);
  }

  const total = (a.length - 1) + (b.length - 1);
  const coeff = (2 * intersection) / total;
  return Math.round(coeff * 100);
}

/**
 * Token overlap calculation (Jaccard similarity with token length weighting).
 */
export function calculateTokenSimilarity(tokensA: string[], tokensB: string[]): number {
  if (tokensA.length === 0 && tokensB.length === 0) return 0;
  if (tokensA.length === 0 || tokensB.length === 0) return 0;

  const setA = new Set(tokensA);
  const setB = new Set(tokensB);

  let matchWeight = 0;
  let totalWeight = 0;

  const allTokens = new Set([...tokensA, ...tokensB]);
  for (const token of allTokens) {
    const weight = Math.max(1, Math.min(3, Math.floor(token.length / 3)));
    totalWeight += weight;
    if (setA.has(token) && setB.has(token)) {
      matchWeight += weight;
    }
  }

  if (totalWeight === 0) return 0;
  return Math.round((matchWeight / totalWeight) * 100);
}

/**
 * Evaluates comprehensive description similarity.
 * Combines title, main description, brand/model, and distinctive features.
 */
export function evaluateDescriptionScore(
  itemA: ItemReport,
  itemB: ItemReport
): { score: number; reasons: string[]; warnings: string[]; matchedTokens: string[] } {
  const reasons: string[] = [];
  const warnings: string[] = [];

  const textA = [
    itemA.title,
    itemA.description,
    itemA.brandModel || '',
    itemA.distinctiveFeatures || '',
  ].join(' ');

  const textB = [
    itemB.title,
    itemB.description,
    itemB.brandModel || '',
    itemB.distinctiveFeatures || '',
  ].join(' ');

  const descA = itemA.description?.trim() || '';
  const descB = itemB.description?.trim() || '';

  if (!descA || !descB) {
    warnings.push('One of the reports lacks a detailed descriptive narrative');
  }

  if (!normalizeText(textA) || !normalizeText(textB)) {
    warnings.push('Insufficient text information in one of the reports');
    return { score: 10, reasons, warnings, matchedTokens: [] };
  }

  const tokensA = tokenizeAndNormalize(textA);
  const tokensB = tokenizeAndNormalize(textB);

  const matchedTokens = tokensA.filter((t) => tokensB.includes(t));
  const tokenScore = calculateTokenSimilarity(tokensA, tokensB);
  const fuzzyTitleScore = calculateDiceFuzzySimilarity(itemA.title, itemB.title);
  const fuzzyOverallScore = calculateDiceFuzzySimilarity(textA, textB);

  // Brand model explicit check
  let brandBonus = 0;
  if (itemA.brandModel && itemB.brandModel) {
    const normBrandA = normalizeText(itemA.brandModel);
    const normBrandB = normalizeText(itemB.brandModel);
    if (normBrandA && normBrandB) {
      if (normBrandA === normBrandB || normBrandA.includes(normBrandB) || normBrandB.includes(normBrandA)) {
        brandBonus = 20;
        reasons.push(`Matching manufacturer or brand specification: "${itemA.brandModel}"`);
      } else {
        // Different explicit brands is a conflict
        brandBonus = -20;
        warnings.push(`Divergent brand models: "${itemA.brandModel}" vs "${itemB.brandModel}"`);
      }
    }
  } else if (!itemA.brandModel && !itemB.brandModel) {
    // Both missing brand
  } else {
    // One provided brand, check if other description mentions it
    const providedBrand = itemA.brandModel || itemB.brandModel || '';
    const otherText = itemA.brandModel ? textB : textA;
    if (providedBrand && normalizeText(otherText).includes(normalizeText(providedBrand))) {
      brandBonus = 12;
      reasons.push(`Brand "${providedBrand}" referenced in counter-party notes`);
    }
  }

  // Blended description score (60% token semantic overlap, 25% title fuzzy match, 15% text fuzzy match)
  let rawScore = Math.round(0.60 * tokenScore + 0.25 * fuzzyTitleScore + 0.15 * fuzzyOverallScore) + brandBonus;
  if (!descA || !descB) {
    // Missing description narrative cannot be awarded full or unverified credit
    rawScore = Math.min(rawScore, 20);
  }
  rawScore = Math.max(0, Math.min(100, rawScore));

  if (matchedTokens.length >= 3) {
    const displayTokens = Array.from(new Set(matchedTokens)).slice(0, 5).join(', ');
    reasons.push(`Substantial keyword overlap: [${displayTokens}]`);
  } else if (matchedTokens.length > 0) {
    reasons.push(`Shared descriptive cues: [${matchedTokens.join(', ')}]`);
  } else {
    warnings.push('Low textual vocabulary overlap between reports');
  }

  return { score: rawScore, reasons, warnings, matchedTokens };
}

/**
 * Category Compatibility Matrix.
 * Returns score (0 - 100) and whether there is an absolute contradiction.
 */
export function evaluateCategoryScore(
  catA: ItemCategory,
  catB: ItemCategory
): { score: number; contradiction: boolean; reason: string } {
  if (!catA || !catB) {
    return { score: 25, contradiction: false, reason: 'Unspecified category' };
  }

  if (catA === catB) {
    return { score: 100, contradiction: false, reason: `Exact category match: ${catA}` };
  }

  // Cross-category compatibility definitions
  const compatiblePairs: [ItemCategory, ItemCategory, number][] = [
    ['Electronics & Gadgets', 'Jewelry & Accessories', 40], // e.g. smartwatch, fitness band
    ['Clothing & Wearables', 'Jewelry & Accessories', 50],  // scarves, hats, belts
    ['Bags & Backpacks', 'Wallets & Identification', 45],  // pouches, coin bags
    ['Books & Notebooks', 'Other', 35],
    ['Bottles & Tumblers', 'Other', 35],
    ['Eyewear', 'Jewelry & Accessories', 30],
  ];

  for (const [c1, c2, score] of compatiblePairs) {
    if ((catA === c1 && catB === c2) || (catA === c2 && catB === c1)) {
      return {
        score,
        contradiction: false,
        reason: `Borderline overlapping category: ${catA} ↔ ${catB}`,
      };
    }
  }

  // Hard contradiction between clearly distinct physical categories
  return {
    score: 0,
    contradiction: true,
    reason: `Incompatible item categories: "${catA}" vs "${catB}"`,
  };
}

/**
 * Colour Compatibility & Contradiction Evaluation.
 */
export function evaluateColourScore(
  colorA: ItemColor,
  colorB: ItemColor,
  secA?: string,
  secB?: string
): { score: number; contradiction: boolean; reason: string; warning?: string } {
  if (!colorA || !colorB) {
    return {
      score: 30,
      contradiction: false,
      reason: 'Missing primary color specification',
      warning: 'Color was left unstated in one of the reports',
    };
  }

  if (colorA === colorB) {
    return { score: 100, contradiction: false, reason: `Primary colour identical (${colorA})` };
  }

  // Multi-color is flexible
  if (colorA === 'Multi-color / Pattern' || colorB === 'Multi-color / Pattern') {
    return {
      score: 65,
      contradiction: false,
      reason: 'One item has multi-color or patterned finish',
    };
  }

  // Closely related colors
  const relatedColorMap: Record<ItemColor, ItemColor[]> = {
    'Black': ['Silver / Grey'],
    'Silver / Grey': ['Black', 'White'],
    'White': ['Silver / Grey'],
    'Gold / Yellow': ['Brown'],
    'Brown': ['Gold / Yellow'],
    'Blue': [],
    'Red': ['Pink / Purple'],
    'Pink / Purple': ['Red'],
    'Green': [],
    'Multi-color / Pattern': [],
  };

  if (relatedColorMap[colorA]?.includes(colorB)) {
    return {
      score: 55,
      contradiction: false,
      reason: `Adjacent or metallic tone: ${colorA} ↔ ${colorB}`,
    };
  }

  // Secondary color check if present
  if (secA && secB) {
    const normSecA = normalizeText(secA);
    const normSecB = normalizeText(secB);
    if (normSecA === normSecB) {
      return {
        score: 40,
        contradiction: false,
        reason: `Secondary accent match: ${secA}`,
      };
    }
  }

  // Definite color contradiction
  return {
    score: 5,
    contradiction: true,
    reason: `Distinctly contradictory colours: ${colorA} vs ${colorB}`,
  };
}

/**
 * Documented Date Proximity function.
 * Evaluates temporal feasibility between lost date and found date.
 * - Same date = 100%
 * - Found date shortly after lost date (0 to 3 days) = 90-98%
 * - Found date within 2 weeks = linear decay to ~40%
 * - Found date prior to lost date penalized according to gap (reporting lag allowance of 1 day = 75%, >5 days before = 5%)
 */
export function evaluateDateProximity(
  lostDateStr: string,
  foundDateStr: string
): { score: number; reason: string; warning?: string } {
  if (!lostDateStr || !foundDateStr) {
    return {
      score: 30,
      reason: 'Date unverified',
      warning: 'One or both reports lack an accurate date',
    };
  }

  const lostDate = new Date(lostDateStr + 'T00:00:00');
  const foundDate = new Date(foundDateStr + 'T00:00:00');

  if (isNaN(lostDate.getTime()) || isNaN(foundDate.getTime())) {
    return {
      score: 25,
      reason: 'Invalid calendar date format',
      warning: 'Date could not be parsed deterministically',
    };
  }

  const diffMs = foundDate.getTime() - lostDate.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { score: 100, reason: 'Identical date: reported lost and found on the exact same day' };
  }

  if (diffDays > 0) {
    // Found after lost (normal sequence)
    if (diffDays === 1) {
      return { score: 98, reason: 'Found within 24 hours of reported loss' };
    }
    if (diffDays <= 3) {
      return { score: 90, reason: `Found ${diffDays} days after reported loss` };
    }
    if (diffDays <= 7) {
      return { score: 75, reason: `Found within same week (${diffDays} days after)` };
    }
    if (diffDays <= 14) {
      return { score: 55, reason: `Found ${diffDays} days after loss` };
    }
    if (diffDays <= 30) {
      return { score: 35, reason: `Found approximately 1 month after loss (${diffDays} days)` };
    }
    const decayed = Math.max(10, Math.round(35 - (diffDays - 30) * 0.5));
    return { score: decayed, reason: `Extended timeframe: found ${diffDays} days after loss` };
  } else {
    // Found date earlier than lost date (diffDays is negative)
    const gap = Math.abs(diffDays);
    if (gap === 1) {
      return {
        score: 75,
        reason: 'Found 1 day prior to stated loss (likely minor reporting recall error)',
        warning: 'Found timestamp is 1 day before reported loss date',
      };
    }
    if (gap <= 3) {
      return {
        score: 45,
        reason: `Found ${gap} days before stated loss date`,
        warning: `Anomaly: Item was found ${gap} days before owner noticed it missing`,
      };
    }
    return {
      score: 10,
      reason: `Unlikely temporal sequence: item reported found ${gap} days before stated loss`,
      warning: `Severe date contradiction: Found ${gap} days prior to loss date`,
    };
  }
}

/**
 * Assigns qualitative confidence tier based on normalized final score.
 */
export function determineConfidenceTier(score: number): ConfidenceTier {
  if (score >= 82) return 'EXCELLENT';
  if (score >= 68) return 'HIGH';
  if (score >= 48) return 'MODERATE';
  if (score >= 25) return 'LOW';
  return 'NEGLIGIBLE';
}

/**
 * Main Deterministic Matching Algorithm for a pair of reports.
 */
export function compareReports(
  targetItem: ItemReport,
  candidateItem: ItemReport,
  customWeights: MatchWeightConfig = DEFAULT_MATCH_WEIGHTS
): MatchResult {
  const reasons: string[] = [];
  const warnings: string[] = [];
  const contradictions: string[] = [];

  // 1. Description Evaluation (35% weight default)
  const descResult = evaluateDescriptionScore(targetItem, candidateItem);
  reasons.push(...descResult.reasons);
  warnings.push(...descResult.warnings);

  // 2. Category Evaluation (20% weight default)
  const catResult = evaluateCategoryScore(targetItem.category, candidateItem.category);
  if (catResult.contradiction) {
    contradictions.push(catResult.reason);
  } else {
    reasons.push(catResult.reason);
  }

  // 3. Location Evaluation (20% weight default)
  if (!targetItem.location?.trim() || !candidateItem.location?.trim()) {
    warnings.push('Incomplete location data: one report lacks a campus location');
  }
  const locResult = calculateLocationProximity(targetItem.location, candidateItem.location);
  reasons.push(locResult.relationText);
  if (targetItem.specificLocation && candidateItem.specificLocation) {
    const normSpecA = normalizeText(targetItem.specificLocation);
    const normSpecB = normalizeText(candidateItem.specificLocation);
    if (normSpecA && normSpecB && (normSpecA.includes(normSpecB) || normSpecB.includes(normSpecA))) {
      reasons.push(`Specific room/sub-location correspondence: "${targetItem.specificLocation}"`);
    }
  }

  // 4. Colour Evaluation (15% weight default)
  const colourResult = evaluateColourScore(
    targetItem.primaryColor,
    candidateItem.primaryColor,
    targetItem.secondaryColor,
    candidateItem.secondaryColor
  );
  if (colourResult.contradiction) {
    contradictions.push(colourResult.reason);
  } else {
    reasons.push(colourResult.reason);
  }
  if (colourResult.warning) {
    warnings.push(colourResult.warning);
  }

  // 5. Date Proximity (10% weight default)
  // Ensure lost item is lostDate, found item is foundDate regardless of target direction
  const lostDate = targetItem.type === 'LOST' ? targetItem.date : candidateItem.date;
  const foundDate = targetItem.type === 'FOUND' ? targetItem.date : candidateItem.date;
  const dateResult = evaluateDateProximity(lostDate, foundDate);
  reasons.push(dateResult.reason);
  if (dateResult.warning) {
    warnings.push(dateResult.warning);
  }

  const componentScores: ComponentScores = {
    descriptionScore: descResult.score,
    categoryScore: catResult.score,
    locationScore: locResult.score,
    colourScore: colourResult.score,
    dateScore: dateResult.score,
  };

  // Raw weighted score calculation
  const totalWeight =
    customWeights.description +
    customWeights.category +
    customWeights.location +
    customWeights.colour +
    customWeights.date;

  const rawWeighted =
    (componentScores.descriptionScore * customWeights.description +
      componentScores.categoryScore * customWeights.category +
      componentScores.locationScore * customWeights.location +
      componentScores.colourScore * customWeights.colour +
      componentScores.dateScore * customWeights.date) /
    (totalWeight || 1);

  // Apply appropriate penalties for fatal contradictions (e.g. completely incompatible category or distinct clashing colours)
  let penaltyMultiplier = 1.0;
  if (catResult.contradiction) {
    // If category is incompatible, cap overall candidate similarity drastically
    penaltyMultiplier *= 0.35;
  }
  if (colourResult.contradiction && !descResult.matchedTokens.includes(normalizeText(targetItem.primaryColor))) {
    penaltyMultiplier *= 0.75;
  }

  const penalizedScore = rawWeighted * penaltyMultiplier;
  const finalScore = Math.max(0, Math.min(100, Math.round(penalizedScore)));

  const confidenceTier = determineConfidenceTier(finalScore);

  return {
    candidateId: candidateItem.id,
    candidateItem,
    targetItem,
    finalScore,
    rawWeightedScore: Math.round(rawWeighted),
    componentScores,
    normalizedWeightsUsed: customWeights,
    reasons,
    warnings,
    contradictions,
    confidenceTier,
    evaluatedAt: new Date().toISOString(),
  };
}

/**
 * Compares a target report against an array of candidate reports.
 * - Excludes returned items from active matching.
 * - Only compares opposite types (LOST against FOUND, FOUND against LOST).
 * - Sorts results descending with deterministic tie-breaking.
 */
export function findRankedMatches(
  targetItem: ItemReport,
  allReports: ItemReport[],
  weights: MatchWeightConfig = DEFAULT_MATCH_WEIGHTS
): MatchResult[] {
  const oppositeType = targetItem.type === 'LOST' ? 'FOUND' : 'LOST';

  // Filter valid candidate pool
  const eligibleCandidates = allReports.filter((item) => {
    // Must be opposite type
    if (item.type !== oppositeType) return false;
    // Cannot be same report
    if (item.id === targetItem.id) return false;
    // Exclude already recovered / returned items from active matching
    if (item.status === 'RESOLVED_RECOVERED') return false;
    return true;
  });

  const results: MatchResult[] = eligibleCandidates.map((candidate) =>
    compareReports(targetItem, candidate, weights)
  );

  // Deterministic tie-breaking sort:
  // 1. finalScore DESC
  // 2. dateScore DESC
  // 3. candidate createdAt DESC
  // 4. candidate id ASC
  results.sort((a, b) => {
    if (b.finalScore !== a.finalScore) {
      return b.finalScore - a.finalScore;
    }
    if (b.componentScores.dateScore !== a.componentScores.dateScore) {
      return b.componentScores.dateScore - a.componentScores.dateScore;
    }
    const createdDiff = new Date(b.candidateItem.createdAt).getTime() - new Date(a.candidateItem.createdAt).getTime();
    if (createdDiff !== 0) return createdDiff;
    return a.candidateId.localeCompare(b.candidateId);
  });

  return results;
}
