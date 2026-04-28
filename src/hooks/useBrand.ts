import { useQuery } from "@tanstack/react-query";
import { brandService } from "@/services/brand";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

const MOCK_DASHBOARD = {
  fyTarget: 200000,
  recovered: 142800,
  quarter: "Q2 2026",
  outstandingFee: 4820000,
  certIssued: 3,
  rangeStart: "Apr 2026",
  brand: "Coca-Cola Africa",
  byCategory: [
    { name: "PET Plastic", target: 80000, recovered: 64200, color: "#1A6B3C" },
    { name: "Aluminium", target: 30000, recovered: 18400, color: "#D4A017" },
    { name: "Cardboard", target: 50000, recovered: 38200, color: "#3F9264" },
    { name: "Glass", target: 25000, recovered: 14200, color: "#1C1C2E" },
    { name: "Mixed Paper", target: 15000, recovered: 7800, color: "#A0A4AB" },
  ],
  monthly: [
    { label: "Jan", value: 18420 }, { label: "Feb", value: 22100 },
    { label: "Mar", value: 26840 }, { label: "Apr", value: 31200 },
    { label: "May", value: 28940 }, { label: "Jun", value: 35300 },
  ],
  recentRecoveries: [
    { id: "rec_2419", date: "Apr 24", hub: "Surulere Hub · Lagos", category: "PET", kg: 484, value: 96800 },
    { id: "rec_2418", date: "Apr 23", hub: "Wuse Hub · Abuja", category: "Aluminium", kg: 122, value: 73200 },
    { id: "rec_2417", date: "Apr 22", hub: "GRA Hub · Port Harcourt", category: "Cardboard", kg: 698, value: 55840 },
    { id: "rec_2416", date: "Apr 21", hub: "Bodija Hub · Ibadan", category: "PET", kg: 312, value: 62400 },
    { id: "rec_2415", date: "Apr 20", hub: "Sabo Hub · Kano", category: "Glass", kg: 184, value: 11040 },
    { id: "rec_2414", date: "Apr 19", hub: "Yaba Hub · Lagos", category: "Mixed Paper", kg: 422, value: 25320 },
    { id: "rec_2413", date: "Apr 18", hub: "Lekki Hub · Lagos", category: "PET", kg: 280, value: 56000 },
    { id: "rec_2412", date: "Apr 17", hub: "Garki Hub · Abuja", category: "Aluminium", kg: 96, value: 57600 },
    { id: "rec_2411", date: "Apr 16", hub: "Ikoyi Hub · Lagos", category: "Cardboard", kg: 542, value: 43360 },
    { id: "rec_2410", date: "Apr 15", hub: "Sangotedo Hub · Lagos", category: "PET", kg: 396, value: 79200 },
  ],
  payments: [
    { id: "pay_201", date: "Apr 10, 2026", ref: "TX-CCN-0419", amount: 4800000, status: "paid", quarter: "Q1 2026" },
    { id: "pay_200", date: "Jan 12, 2026", ref: "TX-CCN-0312", amount: 3950000, status: "paid", quarter: "Q4 2025" },
    { id: "pay_199", date: "Oct 09, 2025", ref: "TX-CCN-0204", amount: 3620000, status: "paid", quarter: "Q3 2025" },
    { id: "pay_198", date: "Jul 14, 2025", ref: "TX-CCN-0118", amount: 3120000, status: "paid", quarter: "Q2 2025" },
  ],
  certificates: [
    { id: "cert-q1-26", quarter: "Q1 2026", issued: "Apr 03, 2026", kg: 124800, status: "issued" },
    { id: "cert-q4-25", quarter: "Q4 2025", issued: "Jan 02, 2026", kg: 109240, status: "issued" },
    { id: "cert-q3-25", quarter: "Q3 2025", issued: "Oct 02, 2025", kg: 98420, status: "issued" },
  ],
};

export function useBrandDashboard() {
  return useQuery({
    queryKey: ["brand", "dashboard"],
    queryFn: async () => {
      if (USE_MOCK) return MOCK_DASHBOARD;
      try {
        const res = await brandService.getDashboard();
        return res.data;
      } catch {
        return MOCK_DASHBOARD;
      }
    },
    staleTime: 60_000,
  });
}
