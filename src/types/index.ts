export type ReportType = 'LOST' | 'FOUND';

export type ItemStatus = 'ACTIVE' | 'PENDING_VERIFICATION' | 'RESOLVED_RECOVERED';

export type ItemCategory =
  | 'Bottles & Tumblers'
  | 'Electronics & Gadgets'
  | 'Bags & Backpacks'
  | 'Wallets & Identification'
  | 'Keys & Access Badges'
  | 'Books & Notebooks'
  | 'Clothing & Wearables'
  | 'Eyewear'
  | 'Jewelry & Accessories'
  | 'Other';

export type ItemColor =
  | 'Black'
  | 'Blue'
  | 'Silver / Grey'
  | 'White'
  | 'Red'
  | 'Green'
  | 'Gold / Yellow'
  | 'Brown'
  | 'Pink / Purple'
  | 'Multi-color / Pattern';

export interface CampusZone {
  id: string;
  name: string;
  cluster: 'Academic' | 'Student Life' | 'Residential' | 'Recreation' | 'Transit';
  adjacentZones: string[];
}

export interface ItemReport {
  id: string;
  type: ReportType;
  title: string;
  category: ItemCategory;
  primaryColor: ItemColor;
  secondaryColor?: string;
  location: string;
  specificLocation?: string;
  date: string; // YYYY-MM-DD
  timeEstimate?: string;
  description: string;
  brandModel?: string;
  distinctiveFeatures?: string;
  // Contact details
  reporterName?: string;
  contactEmail?: string;
  contactPhone?: string;
  // Security / Privacy: private verification question & answer for safe recovery
  privateVerificationQuestion?: string;
  privateVerificationAnswer?: string;
  // Lifecycle
  status: ItemStatus;
  recoveredAt?: string;
  recoveredWithId?: string;
  isDemoItem?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MatchWeightConfig {
  description: number; // default: 0.35
  category: number;    // default: 0.20
  location: number;    // default: 0.20
  colour: number;      // default: 0.15
  date: number;        // default: 0.10
}

export interface ComponentScores {
  descriptionScore: number;
  categoryScore: number;
  locationScore: number;
  colourScore: number;
  dateScore: number;
}

export type ConfidenceTier = 'EXCELLENT' | 'HIGH' | 'MODERATE' | 'LOW' | 'NEGLIGIBLE';

export interface MatchResult {
  candidateId: string;
  candidateItem: ItemReport;
  targetItem: ItemReport;
  finalScore: number; // 0 - 100
  rawWeightedScore: number;
  componentScores: ComponentScores;
  normalizedWeightsUsed: MatchWeightConfig;
  reasons: string[];
  warnings: string[];
  contradictions: string[];
  confidenceTier: ConfidenceTier;
  evaluatedAt: string;
}

export interface FilterSortOptions {
  searchQuery: string;
  typeFilter: 'ALL' | 'LOST' | 'FOUND';
  categoryFilter: string;
  colorFilter: string;
  locationFilter: string;
  statusFilter: 'ALL' | 'ACTIVE' | 'RESOLVED_RECOVERED';
  sortBy: 'date_desc' | 'date_asc' | 'title_asc' | 'recent_created';
}
