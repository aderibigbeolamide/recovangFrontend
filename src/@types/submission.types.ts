export type SubmissionStatus =
  | "PENDING" | "VERIFIED" | "PAID" | "REJECTED" | "FLAGGED";

export interface SubmissionItem {
  wasteCategoryId: string;
  wasteCategoryName: string;
  quantity: number;
  unit: "kg" | "piece";
  pricePerUnit: number;
  subtotal: number;
}

export interface Submission {
  id: string;
  referenceCode: string;
  collectorId: string;
  hubId: string;
  hubName: string;
  items: SubmissionItem[];
  totalWeightKg: number;
  totalAmount: number;
  status: SubmissionStatus;
  beforePhotoUrl?: string;
  isFlagged: boolean;
  isOfflineSubmission: boolean;
  submittedAt: string;
  verifiedAt?: string;
  paidAt?: string;
}
