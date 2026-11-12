import { CampusZone } from '../types';

export const CAMPUS_ZONES: Record<string, CampusZone> = {
  'Main Gate': {
    id: 'Main Gate',
    name: 'Main Gate',
    cluster: 'Academic',
    adjacentZones: ['Library', 'Parking Area', 'Garden'],
  },
  Library: {
    id: 'Library',
    name: 'Library',
    cluster: 'Academic',
    adjacentZones: ['Main Gate', 'Classrooms', 'GCR'],
  },
  'Parking Area': {
    id: 'Parking Area',
    name: 'Parking Area',
    cluster: 'Transit',
    adjacentZones: ['Main Gate', 'Garden', 'College Office'],
  },
  Classrooms: {
    id: 'Classrooms',
    name: 'Classrooms',
    cluster: 'Academic',
    adjacentZones: ['Library', 'Computer Lab', 'Science Laboratories'],
  },
  'Computer Lab': {
    id: 'Computer Lab',
    name: 'Computer Lab',
    cluster: 'Academic',
    adjacentZones: ['Classrooms', 'Engineering Lab', 'GCR'],
  },
  'Pharmacy Lab': {
    id: 'Pharmacy Lab',
    name: 'Pharmacy Lab',
    cluster: 'Academic',
    adjacentZones: ['Science Laboratories', 'College Office', 'Corridors & Staircases'],
  },
  'Engineering Lab': {
    id: 'Engineering Lab',
    name: 'Engineering Lab',
    cluster: 'Academic',
    adjacentZones: ['Computer Lab', 'Science Laboratories', 'Auditorium'],
  },
  'Science Laboratories': {
    id: 'Science Laboratories',
    name: 'Science Laboratories',
    cluster: 'Academic',
    adjacentZones: ['Classrooms', 'Pharmacy Lab', 'Engineering Lab'],
  },
  Canteen: {
    id: 'Canteen',
    name: 'Canteen',
    cluster: 'Student Life',
    adjacentZones: ['Garden', 'GCR', 'Playground / Sports Area'],
  },
  Garden: {
    id: 'Garden',
    name: 'Garden',
    cluster: 'Recreation',
    adjacentZones: ['Main Gate', 'Parking Area', 'Canteen', 'GCR'],
  },
  GCR: {
    id: 'GCR',
    name: 'GCR',
    cluster: 'Student Life',
    adjacentZones: ['Library', 'Canteen', 'Computer Lab', 'Corridors & Staircases'],
  },
  Auditorium: {
    id: 'Auditorium',
    name: 'Auditorium',
    cluster: 'Academic',
    adjacentZones: ['Engineering Lab', 'College Office', 'Corridors & Staircases'],
  },
  Washrooms: {
    id: 'Washrooms',
    name: 'Washrooms',
    cluster: 'Student Life',
    adjacentZones: ['Corridors & Staircases', 'College Office', 'GCR'],
  },
  'College Office': {
    id: 'College Office',
    name: 'College Office',
    cluster: 'Academic',
    adjacentZones: ['Parking Area', 'Auditorium', 'Washrooms'],
  },
  'Corridors & Staircases': {
    id: 'Corridors & Staircases',
    name: 'Corridors & Staircases',
    cluster: 'Academic',
    adjacentZones: ['GCR', 'Washrooms', 'Auditorium', 'Pharmacy Lab'],
  },
  'Playground / Sports Area': {
    id: 'Playground / Sports Area',
    name: 'Playground / Sports Area',
    cluster: 'Recreation',
    adjacentZones: ['Canteen', 'Garden', 'Other Campus Area'],
  },
  'Other Campus Area': {
    id: 'Other Campus Area',
    name: 'Other Campus Area',
    cluster: 'Academic',
    adjacentZones: ['Main Gate', 'Garden', 'Playground / Sports Area', 'Corridors & Staircases'],
  },
};

export const CAMPUS_LOCATION_OPTIONS = [
  'Main Gate',
  'Library',
  'Parking Area',
  'Classrooms',
  'Computer Lab',
  'Pharmacy Lab',
  'Engineering Lab',
  'Science Laboratories',
  'Canteen',
  'Garden',
  'GCR',
  'Auditorium',
  'Washrooms',
  'College Office',
  'Corridors & Staircases',
  'Playground / Sports Area',
  'Other Campus Area',
];

export const LEGACY_LOCATION_ALIASES: Record<string, string> = {
  'Main Library': 'Library',
  'Main Library Entrance': 'Library',
  'Library Entrance': 'Library',
  'Reading Area': 'Library',
  'Book Issue/Return Counter': 'Library',
  'Library Study Area': 'Library',
  'Main Entry Gate': 'Main Gate',
  'Main Campus Walkway': 'Garden',
  'College Garden': 'Garden',
  'College Grounds': 'Garden',
  'Bicycle Parking': 'Parking Area',
  'General Parking Area': 'Parking Area',
  "Boys' Parking": 'Parking Area',
  "Girls' Parking": 'Parking Area',
  'Classroom Corridor': 'Classrooms',
  'Lecture Hall': 'Classrooms',
  'Common Classroom Area': 'Classrooms',
  'Computer Lab 1': 'Computer Lab',
  'Computer Lab 2': 'Computer Lab',
  'Computer Lab 3': 'Computer Lab',
  'Computer Lab 4': 'Computer Lab',
  'Computer Lab 5': 'Computer Lab',
  'Computer Lab 6': 'Computer Lab',
  'Computer Lab — Other/Unspecified': 'Computer Lab',
  'Pharmacy Lab 1': 'Pharmacy Lab',
  'Pharmacy Lab 2': 'Pharmacy Lab',
  'Pharmacy Lab 3': 'Pharmacy Lab',
  'Pharmacy Lab 4': 'Pharmacy Lab',
  'Pharmacy Lab 5': 'Pharmacy Lab',
  'Pharmacy Lab — Other/Unspecified': 'Pharmacy Lab',
  'Engineering Lab 1': 'Engineering Lab',
  'Engineering Lab 2': 'Engineering Lab',
  'Engineering Lab 3': 'Engineering Lab',
  'Engineering Lab 4': 'Engineering Lab',
  'Engineering Lab 5': 'Engineering Lab',
  'Engineering Lab — Other/Unspecified': 'Engineering Lab',
  'Chemistry Lab': 'Science Laboratories',
  'Physics Lab': 'Science Laboratories',
  'Botany Lab': 'Science Laboratories',
  'Zoology Lab': 'Science Laboratories',
  'Science Laboratory — Other/Unspecified': 'Science Laboratories',
  'Student Center': 'GCR',
  'Dining Commons': 'Canteen',
  'Campus Green / Quad': 'Garden',
  'Athletics Complex': 'Playground / Sports Area',
  'North Dormitories': 'Other Campus Area',
  'South Dormitories': 'Other Campus Area',
  'Transit Hub': 'Main Gate',
  'Reception': 'College Office',
  'Faculty Room / Staff Area': 'College Office',
  'Department Office': 'College Office',
  'Administrative Office': 'College Office',
  'College Office / Administrative Office': 'College Office',
  'Common Waiting Area': 'GCR',
  'Seminar Hall': 'Auditorium',
  'Staircase': 'Corridors & Staircases',
  'Corridor': 'Corridors & Staircases',
  'Lift / Elevator Area': 'Corridors & Staircases',
  'Ground Floor Common Area': 'Corridors & Staircases',
  'Upper Floor Common Area': 'Corridors & Staircases',
  "Boys' Washroom": 'Washrooms',
  "Girls' Washroom": 'Washrooms',
  'Common Washroom': 'Washrooms',
  'Drinking Water Point': 'Washrooms',
  'Water Cooler Area': 'Washrooms',
  'Sports Ground': 'Playground / Sports Area',
  'Indoor Activity Area': 'Playground / Sports Area',
  'College Event Area': 'Other Campus Area',
  'Near Notice Board': 'Other Campus Area',
  'Outside Classroom': 'Classrooms',
  'Outside Laboratory': 'Science Laboratories',
  'Near Department Entrance': 'Other Campus Area',
  'Other / Unspecified Location': 'Other Campus Area',
  'Other Campus Area': 'Other Campus Area',
};

export function normalizeCampusLocation(value: string): string {
  return value?.trim().replace(/\s+/g, ' ') || '';
}

export function getSuggestedCampusLocations(query: string): string[] {
  const clean = normalizeCampusLocation(query).toLowerCase();
  if (!clean) return CAMPUS_LOCATION_OPTIONS;

  return CAMPUS_LOCATION_OPTIONS.filter((location) =>
    location.toLowerCase().includes(clean)
  );
}

export function calculateLocationProximity(locA: string, locB: string): { score: number; relationText: string } {
  if (!locA || !locB) {
    return { score: 20, relationText: 'Unspecified location comparison' };
  }

  const normalizedA = normalizeCampusLocation(locA);
  const normalizedB = normalizeCampusLocation(locB);
  const canonA = LEGACY_LOCATION_ALIASES[normalizedA] || normalizedA;
  const canonB = LEGACY_LOCATION_ALIASES[normalizedB] || normalizedB;
  const normA = canonA.toLowerCase();
  const normB = canonB.toLowerCase();

  if (normA === normB) {
    return { score: 100, relationText: 'Exact same campus area' };
  }

  const zoneA = CAMPUS_ZONES[canonA] || Object.values(CAMPUS_ZONES).find((z) => z.name.toLowerCase() === normA || z.id.toLowerCase() === normA);
  const zoneB = CAMPUS_ZONES[canonB] || Object.values(CAMPUS_ZONES).find((z) => z.name.toLowerCase() === normB || z.id.toLowerCase() === normB);

  if (!zoneA || !zoneB) {
    return { score: 30, relationText: 'Custom or unmapped campus area' };
  }

  if (zoneA.id === zoneB.id) {
    return { score: 100, relationText: `Same campus area (${zoneA.name})` };
  }

  if (zoneA.adjacentZones.includes(zoneB.id) || zoneB.adjacentZones.includes(zoneA.id)) {
    return { score: 75, relationText: `Adjacent campus areas (${zoneA.id} ↔ ${zoneB.id})` };
  }

  if (zoneA.cluster === zoneB.cluster) {
    return { score: 55, relationText: `Same campus sector (${zoneA.cluster})` };
  }

  const isTwoHop = zoneA.adjacentZones.some((mid) => {
    const midZone = CAMPUS_ZONES[mid];
    return midZone && midZone.adjacentZones.includes(zoneB.id);
  });

  if (isTwoHop) {
    return { score: 35, relationText: 'Nearby campus area' };
  }

  return { score: 15, relationText: 'Distant campus area' };
}
