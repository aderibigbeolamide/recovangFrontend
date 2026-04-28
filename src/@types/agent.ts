export interface AgentDashboard {
  todayVerifications: number;
  todayWeight: number;
  earnings: number;
  xp: number;
  queueCount: number;
}

export interface HubDetails {
  id: string;
  name: string;
  address: string;
  capacity: number;
  currentLoad: number;
  status: "OPEN" | "CLOSED" | "FULL";
}

export interface VerificationRequest {
  id: string; // Submission ID
  weightKg: number;
  photos: string[]; // URLs or Base64
  notes?: string;
}
