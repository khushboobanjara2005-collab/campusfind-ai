import { ItemReport, MatchWeightConfig } from '../types';
import { INITIAL_DEMO_REPORTS } from './demoData';
import { DEFAULT_MATCH_WEIGHTS } from './matcher';

const STORAGE_KEY_REPORTS = 'campusfind_ai_reports_v1';
const STORAGE_KEY_WEIGHTS = 'campusfind_ai_weights_v1';

/**
 * Loads reports from local storage.
 * If first time running or empty, seeds with INITIAL_DEMO_REPORTS.
 */
export function getStoredReports(): ItemReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REPORTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(INITIAL_DEMO_REPORTS));
      return INITIAL_DEMO_REPORTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(INITIAL_DEMO_REPORTS));
      return INITIAL_DEMO_REPORTS;
    }
    return parsed;
  } catch (err) {
    console.error('Failed reading reports from localStorage:', err);
    return INITIAL_DEMO_REPORTS;
  }
}

/**
 * Persists reports to localStorage.
 */
export function saveStoredReports(reports: ItemReport[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
  } catch (err) {
    console.error('Failed saving reports to localStorage:', err);
  }
}

/**
 * Creates and stores a new user report.
 */
export function addReport(newReport: Omit<ItemReport, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'isDemoItem'>): ItemReport {
  const current = getStoredReports();
  const now = new Date().toISOString();
  const created: ItemReport = {
    ...newReport,
    id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    status: 'ACTIVE',
    isDemoItem: false,
    createdAt: now,
    updatedAt: now,
  };

  const updated = [created, ...current];
  saveStoredReports(updated);
  return created;
}

/**
 * Updates an existing report by ID.
 */
export function updateReport(id: string, patch: Partial<ItemReport>): ItemReport | null {
  const current = getStoredReports();
  const idx = current.findIndex((r) => r.id === id);
  if (idx === -1) return null;

  const updatedItem: ItemReport = {
    ...current[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  current[idx] = updatedItem;
  saveStoredReports(current);
  return updatedItem;
}

/**
 * Deletes a report by ID.
 */
export function deleteReport(id: string): boolean {
  const current = getStoredReports();
  const filtered = current.filter((r) => r.id !== id);
  if (filtered.length === current.length) return false;
  saveStoredReports(filtered);
  return true;
}

/**
 * Verified recovery workflow:
 * Marks both the target report and the counterpart report as RESOLVED_RECOVERED,
 * linking them to each other and updating recovery timestamp.
 */
export function markAsRecovered(
  targetId: string,
  counterpartId?: string
): { success: boolean; target?: ItemReport; counterpart?: ItemReport } {
  const current = getStoredReports();
  const now = new Date().toISOString();

  const targetIdx = current.findIndex((r) => r.id === targetId);
  if (targetIdx === -1) return { success: false };

  current[targetIdx] = {
    ...current[targetIdx],
    status: 'RESOLVED_RECOVERED',
    recoveredAt: now,
    recoveredWithId: counterpartId,
    updatedAt: now,
  };

  let counterpart: ItemReport | undefined;
  if (counterpartId) {
    const cpIdx = current.findIndex((r) => r.id === counterpartId);
    if (cpIdx !== -1) {
      current[cpIdx] = {
        ...current[cpIdx],
        status: 'RESOLVED_RECOVERED',
        recoveredAt: now,
        recoveredWithId: targetId,
        updatedAt: now,
      };
      counterpart = current[cpIdx];
    }
  }

  saveStoredReports(current);
  return { success: true, target: current[targetIdx], counterpart };
}

/**
 * SAFE DEMO RESET:
 * Restores initial demo records to their pristine state,
 * but PRESERVES all non-demo user items so user input is never silently erased!
 */
export function resetDemoDataSafely(): { demoRestoredCount: number; userItemsPreservedCount: number } {
  const current = getStoredReports();
  // Filter out any demo items
  const userItems = current.filter((r) => !r.isDemoItem);
  // Re-combine pristine demo items with preserved user records
  const merged = [...INITIAL_DEMO_REPORTS, ...userItems];
  saveStoredReports(merged);

  return {
    demoRestoredCount: INITIAL_DEMO_REPORTS.length,
    userItemsPreservedCount: userItems.length,
  };
}

/**
 * Full factory reset (wipes all localStorage and re-seeds clean demo data).
 */
export function factoryResetAll(): void {
  localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(INITIAL_DEMO_REPORTS));
  localStorage.setItem(STORAGE_KEY_WEIGHTS, JSON.stringify(DEFAULT_MATCH_WEIGHTS));
}

/**
 * Configurable weights storage
 */
export function getStoredWeights(): MatchWeightConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WEIGHTS);
    if (!raw) return DEFAULT_MATCH_WEIGHTS;
    const parsed = JSON.parse(raw);
    return {
      description: Number(parsed.description) || DEFAULT_MATCH_WEIGHTS.description,
      category: Number(parsed.category) || DEFAULT_MATCH_WEIGHTS.category,
      location: Number(parsed.location) || DEFAULT_MATCH_WEIGHTS.location,
      colour: Number(parsed.colour) || DEFAULT_MATCH_WEIGHTS.colour,
      date: Number(parsed.date) || DEFAULT_MATCH_WEIGHTS.date,
    };
  } catch {
    return DEFAULT_MATCH_WEIGHTS;
  }
}

export function saveStoredWeights(weights: MatchWeightConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_WEIGHTS, JSON.stringify(weights));
  } catch (err) {
    console.error('Failed saving weights:', err);
  }
}
