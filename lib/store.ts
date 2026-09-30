import { Complaint } from './types';

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'CA-1001',
    rawDescription: 'There is a huge pothole near MJCET and two accidents happened there this week.',
    category: 'Road Infrastructure',
    issue: 'Pothole',
    severity: 92,
    priority: 92,
    priorityLevel: 'HIGH',
    department: 'Roads & Infrastructure',
    location: 'Hyderabad',
    summary: 'Dangerous pothole near MJCET campus causing multiple accidents and structural road hazard.',
    recommendedAction: 'Inspect and repair the road section immediately with high-durability asphalt mixture.',
    reasoning: 'High severity due to reported accidents and potential risk to commuters in high-traffic zone.',
    status: 'Pending',
    createdAt: '2026-09-30 08:30',
    assignedOfficer: 'Er. Rajesh V. (Zone 4)'
  },
  {
    id: 'CA-1002',
    rawDescription: 'There has been a water leakage near Mehdipatnam for three days.',
    category: 'Water & Sanitation',
    issue: 'Water Leakage',
    severity: 87,
    priority: 87,
    priorityLevel: 'HIGH',
    department: 'Water & Sanitation',
    location: 'Hyderabad',
    summary: 'Continuous clean water pipeline leakage in Mehdipatnam causing road damage and water loss.',
    recommendedAction: 'Isolate supply valve and dispatch pipeline repair team to fix damaged main line.',
    reasoning: 'High priority due to 3-day continuous water wastage and erosion of road foundation.',
    status: 'Pending',
    createdAt: '2026-09-29 14:15',
    assignedOfficer: 'S. K. Rao (Water Board)'
  },
  {
    id: 'CA-1003',
    rawDescription: 'The streetlight near the college road has not been working for several nights.',
    category: 'Electricity',
    issue: 'Streetlight',
    severity: 61,
    priority: 61,
    priorityLevel: 'MEDIUM',
    department: 'Electricity',
    location: 'Hyderabad',
    summary: 'Streetlight blackout along college main road creating unsafe night-time commuting conditions.',
    recommendedAction: 'Inspect feeder box and replace burned-out LED fixtures along 200m strip.',
    reasoning: 'Medium priority based on night security risk for students and pedestrians.',
    status: 'In Progress',
    createdAt: '2026-09-29 19:40',
    assignedOfficer: 'V. Naresh (Power Grid)'
  },
  {
    id: 'CA-1004',
    rawDescription: 'Garbage has not been collected from our street for four days.',
    category: 'Waste Management',
    issue: 'Garbage',
    severity: 38,
    priority: 38,
    priorityLevel: 'LOW',
    department: 'Sanitation',
    location: 'Hyderabad',
    summary: 'Uncollected residential waste accumulated over 4 days along street residential bins.',
    recommendedAction: 'Dispatch compacting garbage truck for complete site clearance and sanitization spray.',
    reasoning: 'Low priority relative to life safety, though requires routine municipal clearance.',
    status: 'Resolved',
    createdAt: '2026-09-27 10:00',
    assignedOfficer: 'M. Ali (Sanitation Squad)'
  },
  {
    id: 'CA-1005',
    rawDescription: 'The road near the bus stop is badly damaged.',
    category: 'Road Infrastructure',
    issue: 'Road Damage',
    severity: 81,
    priority: 81,
    priorityLevel: 'HIGH',
    department: 'Roads & Infrastructure',
    location: 'Hyderabad',
    summary: 'Severe surface asphalt breakdown near high-frequency public bus transit stop.',
    recommendedAction: 'Level uneven surface and execute emergency cold-mix re-surfacing.',
    reasoning: 'High priority due to risk of bus axle damage and passenger boarding hazards.',
    status: 'Pending',
    createdAt: '2026-09-30 06:45',
    assignedOfficer: 'Er. Rajesh V. (Zone 4)'
  },
  {
    id: 'CA-1006',
    rawDescription: 'Open manhole cover missing on main thoroughfare near Ameerpet metro station.',
    category: 'Public Safety',
    issue: 'Open Manhole',
    severity: 95,
    priority: 95,
    priorityLevel: 'HIGH',
    department: 'Public Safety',
    location: 'Hyderabad',
    summary: 'Uncovered sewer manhole on heavy pedestrian walkway near metro entry.',
    recommendedAction: 'Install temporary safety cone barricade and fit heavy-duty replacement steel lid.',
    reasoning: 'Critical high severity due to extreme fall and fatality hazard for pedestrians.',
    status: 'Pending',
    createdAt: '2026-09-30 09:10',
    assignedOfficer: 'P. Srinivas (Civic Safety)'
  },
  {
    id: 'CA-1007',
    rawDescription: 'Low voltage issues and frequent power tripping in Hitec City sector 3.',
    category: 'Electricity',
    issue: 'Power Tripping',
    severity: 65,
    priority: 65,
    priorityLevel: 'MEDIUM',
    department: 'Electricity',
    location: 'Hyderabad',
    summary: 'Fluctuating grid voltage causing industrial transformer overload and blackout risk.',
    recommendedAction: 'Balance phase loads at local sub-station transformer unit.',
    reasoning: 'Medium priority due to impact on commercial office infrastructure.',
    status: 'Pending',
    createdAt: '2026-09-28 11:30',
    assignedOfficer: 'V. Naresh (Power Grid)'
  },
  {
    id: 'CA-1008',
    rawDescription: 'Storm drain overflow flooding sidewalk near Lakdikapul crossroad.',
    category: 'Water & Sanitation',
    issue: 'Drainage Overflow',
    severity: 78,
    priority: 78,
    priorityLevel: 'MEDIUM',
    department: 'Water & Sanitation',
    location: 'Hyderabad',
    summary: 'Clogged storm drain causing localized waterlogging on primary pedestrian walkway.',
    recommendedAction: 'Deploy high-pressure suction vehicle to clear debris blockages in drain.',
    reasoning: 'Medium-high severity due to localized flooding and mosquito breeding risk.',
    status: 'Pending',
    createdAt: '2026-09-29 16:20',
    assignedOfficer: 'S. K. Rao (Water Board)'
  },
  {
    id: 'CA-1009',
    rawDescription: 'Traffic signal light broken at major junction near Gachibowli flyover.',
    category: 'Public Safety',
    issue: 'Signal Malfunction',
    severity: 89,
    priority: 89,
    priorityLevel: 'HIGH',
    department: 'Public Safety',
    location: 'Hyderabad',
    summary: 'All-red traffic signal failure leading to vehicle deadlock and collision risks.',
    recommendedAction: 'Deploy traffic police constable and reset master controller circuit board.',
    reasoning: 'High severity given major arterial junction and risk of multi-vehicle collisions.',
    status: 'Pending',
    createdAt: '2026-09-30 07:15',
    assignedOfficer: 'P. Srinivas (Civic Safety)'
  },
  {
    id: 'CA-1010',
    rawDescription: 'Damaged pavement tiles near Koti commercial market area causing trip hazards.',
    category: 'Road Infrastructure',
    issue: 'Broken Footpath',
    severity: 45,
    priority: 45,
    priorityLevel: 'LOW',
    department: 'Roads & Infrastructure',
    location: 'Hyderabad',
    summary: 'Uprooted paver blocks on sidewalk requiring minor masonry restoration.',
    recommendedAction: 'Re-lay paver blocks with sand bedding.',
    reasoning: 'Low severity minor cosmetic damage without immediate structural hazard.',
    status: 'Resolved',
    createdAt: '2026-09-26 12:00',
    assignedOfficer: 'Er. Rajesh V. (Zone 4)'
  },
  {
    id: 'CA-1011',
    rawDescription: 'Construction debris dumped illegally on public park boundary in Jubilee Hills.',
    category: 'Waste Management',
    issue: 'Debris Dumping',
    severity: 42,
    priority: 42,
    priorityLevel: 'LOW',
    department: 'Sanitation',
    location: 'Hyderabad',
    summary: 'Unauthorized concrete rubble pile encroaching on public park perimeter.',
    recommendedAction: 'Issue notice to developer and clear debris using front-end loader.',
    reasoning: 'Low severity environmental infringement with no life safety risk.',
    status: 'Resolved',
    createdAt: '2026-09-25 15:30',
    assignedOfficer: 'M. Ali (Sanitation Squad)'
  },
  {
    id: 'CA-1012',
    rawDescription: 'Bus shelter roof leaking during rain at Secunderabad station stop.',
    category: 'Public Transport',
    issue: 'Shelter Damage',
    severity: 35,
    priority: 35,
    priorityLevel: 'LOW',
    department: 'Public Transport',
    location: 'Hyderabad',
    summary: 'Corroded tin roofing sheet leaking water on passenger waiting bench.',
    recommendedAction: 'Replace damaged corrugated roof sheet and seal joints.',
    reasoning: 'Low priority maintenance request.',
    status: 'Resolved',
    createdAt: '2026-09-24 09:00',
    assignedOfficer: 'K. Reddy (RTC Infra)'
  }
];

export function getStoredComplaints(): Complaint[] {
  if (typeof window === 'undefined') return INITIAL_COMPLAINTS;
  const saved = localStorage.getItem('civic_ai_complaints');
  if (!saved) {
    localStorage.setItem('civic_ai_complaints', JSON.stringify(INITIAL_COMPLAINTS));
    return INITIAL_COMPLAINTS;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return INITIAL_COMPLAINTS;
  }
}

export function saveComplaintsToStorage(complaints: Complaint[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('civic_ai_complaints', JSON.stringify(complaints));
  }
}
