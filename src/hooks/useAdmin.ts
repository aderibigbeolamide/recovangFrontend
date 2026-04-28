import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin";
import toast from "react-hot-toast";

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const { data } = await adminService.getDashboard();
      return data.data ?? data;
    },
    staleTime: 60_000,
  });
}

export function useAdminAnalytics() {
  return useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: async () => {
      const [overview, ecosystem, waste] = await Promise.all([
        adminService.getAnalyticsOverview(),
        adminService.getEcosystemHealth(),
        adminService.getWasteByCategory(),
      ]);
      return {
        overview: overview.data.data ?? overview.data,
        ecosystem: ecosystem.data.data ?? ecosystem.data,
        waste: waste.data.data ?? waste.data,
      };
    },
  });
}

export function useAdminCollectors(params?: any) {
  return useQuery({
    queryKey: ["admin", "collectors", params],
    queryFn: async () => {
      const { data } = await adminService.getCollectors(params);
      return data.data ?? data;
    },
  });
}

export function useAdminPricing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.updatePricing,
    onSuccess: () => {
      toast.success("Pricing updated successfully!");
      qc.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update pricing");
    },
  });
}

export function useAdminPayouts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.bulkApprovePayouts,
    onSuccess: () => {
      toast.success("Payouts approved successfully!");
      qc.invalidateQueries({ queryKey: ["admin", "withdrawals"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to approve payouts");
    },
  });
}

export function useFlaggedSubmissions() {
  return useQuery({
    queryKey: ["admin", "flagged"],
    queryFn: async () => {
      const { data } = await adminService.getFlaggedSubmissions();
      return data.data ?? data;
    },
  });
}

export function useAdmins() {
  return useQuery({
    queryKey: ["super_admin", "admins"],
    queryFn: async () => {
      const { data } = await adminService.getAdmins();
      return data.data ?? data;
    },
  });
}

export function useHubs() {
  return useQuery({
    queryKey: ["admin", "hubs"],
    queryFn: async () => {
      const { data } = await adminService.getHubs();
      return data.data ?? data;
    },
  });
}

export function useLogistics() {
  return useQuery({
    queryKey: ["admin", "logistics"],
    queryFn: async () => {
      const { data } = await adminService.getLogistics();
      return data.data ?? data;
    },
  });
}

export function useAgents(params?: any) {
  return useQuery({
    queryKey: ["admin", "agents", params],
    queryFn: async () => {
      const { data } = await adminService.getAgents(params);
      return data.data ?? data;
    },
  });
}

export function useUpdateAdminPermissions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, permissions }: { id: string; permissions: string[] }) =>
      adminService.setAdminPermissions(id, permissions),
    onSuccess: () => {
      toast.success("Permissions updated successfully!");
      qc.invalidateQueries({ queryKey: ["super_admin", "admins"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update permissions");
    },
  });
}

export function useWithdrawals(status = "pending") {
  return useQuery({
    queryKey: ["admin", "withdrawals", status],
    queryFn: async () => {
      const { data } = await adminService.getWithdrawals(status);
      return data.data ?? data;
    },
  });
}
