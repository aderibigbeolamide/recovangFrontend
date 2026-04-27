import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

const SUPPLY = [
  { id: "stk_pet", category: "PET Flake (washed)", grade: "A", kg: 18420, hubs: 22, pricePerKg: 280, lastUpdated: "Apr 24" },
  { id: "stk_alu", category: "Aluminium Cans (baled)", grade: "A", kg: 4280, hubs: 18, pricePerKg: 820, lastUpdated: "Apr 24" },
  { id: "stk_card", category: "OCC Cardboard (baled)", grade: "B", kg: 22640, hubs: 31, pricePerKg: 110, lastUpdated: "Apr 23" },
  { id: "stk_paper", category: "Mixed Paper (sorted)", grade: "B", kg: 11420, hubs: 24, pricePerKg: 80, lastUpdated: "Apr 22" },
  { id: "stk_hdpe", category: "HDPE (washed)", grade: "A", kg: 6240, hubs: 14, pricePerKg: 240, lastUpdated: "Apr 24" },
  { id: "stk_glass", category: "Glass Cullet (color-sorted)", grade: "B", kg: 9420, hubs: 19, pricePerKg: 45, lastUpdated: "Apr 22" },
  { id: "stk_ewaste", category: "E-Waste boards", grade: "A", kg: 1240, hubs: 9, pricePerKg: 1400, lastUpdated: "Apr 21" },
  { id: "stk_steel", category: "Steel Scrap", grade: "B", kg: 8420, hubs: 16, pricePerKg: 220, lastUpdated: "Apr 22" },
];

const ORDERS = [
  { id: "ord_4218", date: "Apr 23", category: "PET Flake (washed)", kg: 6000, total: 1680000, hub: "Lagos Aggregator", status: "in-transit", eta: "Apr 27" },
  { id: "ord_4217", date: "Apr 22", category: "Aluminium Cans", kg: 800, total: 656000, hub: "Wuse · Abuja", status: "delivered", eta: "Apr 24" },
  { id: "ord_4216", date: "Apr 21", category: "OCC Cardboard", kg: 12000, total: 1320000, hub: "Port Harcourt Hub", status: "processing", eta: "Apr 26" },
  { id: "ord_4215", date: "Apr 20", category: "HDPE", kg: 2200, total: 528000, hub: "Lagos Aggregator", status: "delivered", eta: "Apr 22" },
  { id: "ord_4214", date: "Apr 19", category: "Steel Scrap", kg: 4000, total: 880000, hub: "Kano Hub", status: "delivered", eta: "Apr 21" },
  { id: "ord_4213", date: "Apr 18", category: "Glass Cullet", kg: 5200, total: 234000, hub: "Ibadan Hub", status: "cancelled", eta: "—" },
  { id: "ord_4212", date: "Apr 17", category: "PET Flake (washed)", kg: 8200, total: 2296000, hub: "Lagos Aggregator", status: "delivered", eta: "Apr 19" },
  { id: "ord_4211", date: "Apr 15", category: "E-Waste boards", kg: 320, total: 448000, hub: "Lekki Hub", status: "delivered", eta: "Apr 17" },
  { id: "ord_4210", date: "Apr 14", category: "Mixed Paper", kg: 6800, total: 544000, hub: "Yaba Hub", status: "delivered", eta: "Apr 16" },
];

const SHIPMENTS = [
  { id: "shp_991", origin: "Lagos Aggregator", destination: "Indorama Onne Plant", carrier: "RCL Logistics", truck: "LSR-422-XB", kg: 18000, status: "in-transit", eta: "Apr 27, 14:00", progress: 64 },
  { id: "shp_990", origin: "Wuse · Abuja", destination: "Indorama Onne Plant", carrier: "Trace Africa", truck: "ABJ-118-PT", kg: 4200, status: "loading", eta: "Apr 27, 22:00", progress: 18 },
  { id: "shp_989", origin: "Port Harcourt Hub", destination: "Indorama Onne Plant", carrier: "RCL Logistics", truck: "PH-882-AB", kg: 12000, status: "delivered", eta: "Apr 24, 09:30", progress: 100 },
  { id: "shp_988", origin: "Kano Hub", destination: "Indorama Onne Plant", carrier: "Northern Haul", truck: "KN-217-XC", kg: 4000, status: "delivered", eta: "Apr 22, 18:20", progress: 100 },
  { id: "shp_987", origin: "Ibadan Hub", destination: "Indorama Onne Plant", carrier: "Trace Africa", truck: "IB-602-VB", kg: 5200, status: "cancelled", eta: "—", progress: 0 },
];

const RECEIPTS = [
  { id: "rcp_4218", orderId: "ord_4218", expectedKg: 6000, deliveredKg: 5980, variancePct: -0.33, qaScore: 96, status: "pending" },
  { id: "rcp_4217", orderId: "ord_4217", expectedKg: 800, deliveredKg: 802, variancePct: 0.25, qaScore: 98, status: "verified" },
  { id: "rcp_4216", orderId: "ord_4216", expectedKg: 12000, deliveredKg: 11820, variancePct: -1.5, qaScore: 91, status: "pending" },
  { id: "rcp_4215", orderId: "ord_4215", expectedKg: 2200, deliveredKg: 2210, variancePct: 0.45, qaScore: 94, status: "verified" },
  { id: "rcp_4214", orderId: "ord_4214", expectedKg: 4000, deliveredKg: 3960, variancePct: -1.0, qaScore: 92, status: "verified" },
];

export function useFactoryDashboard() {
  return useQuery({
    queryKey: ["factory", "dashboard"],
    queryFn: async () => {
      if (USE_MOCK) return { supply: SUPPLY, orders: ORDERS, shipments: SHIPMENTS, receipts: RECEIPTS };
      try {
        const { data } = await api.get("/factory/dashboard");
        return data;
      } catch {
        return { supply: SUPPLY, orders: ORDERS, shipments: SHIPMENTS, receipts: RECEIPTS };
      }
    },
    staleTime: 60_000,
  });
}

export const FACTORY_MOCK = { supply: SUPPLY, orders: ORDERS, shipments: SHIPMENTS, receipts: RECEIPTS };
