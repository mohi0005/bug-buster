export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type CaseStatus = 'Pending' | 'In Progress' | 'Resolved';

export interface AIAnalysisResult {
  category: string;
  issue: string;
  severity: number;
  priority: number;
  priorityLevel: PriorityLevel;
  department: string;
  location: string;
  summary: string;
  recommendedAction: string;
  reasoning: string;
}

export interface Complaint extends AIAnalysisResult {
  id: string;
  rawDescription: string;
  status: CaseStatus;
  createdAt: string;
  assignedOfficer?: string;
}

export type FilterOption = 'All' | 'High Priority' | 'Medium' | 'Low' | 'Resolved' | 'Pending';
