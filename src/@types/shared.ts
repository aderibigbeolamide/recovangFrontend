// Logistics
export interface PickupRequest {
  id: string;
  hubName: string;
  category: string;
  weight: number;
  status: "PENDING" | "ACCEPTED" | "IN_TRANSIT" | "DELIVERED";
}

// Factory
export interface FactoryDashboard {
  supplySummary: any[];
  orderHistory: any[];
}

export interface WasteSupply {
  category: string;
  totalAvailable: number;
  pricePerKg: number;
}

// Public / Shared
export interface WasteCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
}

export interface Hub {
  id: string;
  name: string;
  address: string;
  state: string;
  lga: string;
  lat: number;
  lng: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  coverImage: string;
  readTime: string;
  publishedAt: string;
  content?: string;
}

// Admin
export interface AdminDashboard {
  stats: {
    users: number;
    weight: number;
    payouts: number;
    hubs: number;
  };
  growth: any[];
}
