import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin";
import { useAuth } from "@/store/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function useAdminDashboard() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const { data } = await adminService.getDashboard();
      return data.data ?? data;
    },
    staleTime: 60_000,
    enabled: !!user,
  });
}

export function useAdminAnalytics() {
  const { user } = useAuth();

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
    enabled: !!user,
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

export function usePricing() {
  return useQuery({
    queryKey: ["admin", "pricing"],
    queryFn: async () => {
      const { data } = await adminService.getPricing();
      return data.data ?? data;
    }
  });
}

export function usePricingHistory() {
  return useQuery({
    queryKey: ["admin", "pricing-history"],
    queryFn: async () => {
      const { data } = await adminService.getPricingHistory();
      return data.data ?? data;
    }
  });
}

export function useAdminPricing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.updatePricing,
    onSuccess: () => {
      toast.success("Pricing updated successfully!");
      qc.invalidateQueries({ queryKey: ["admin", "pricing"] });
      qc.invalidateQueries({ queryKey: ["admin", "pricing-history"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update pricing");
    },
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => adminService.createCategory(data),
    onSuccess: () => {
      toast.success("Waste category created!");
      qc.invalidateQueries({ queryKey: ["admin", "pricing"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create category");
    },
  });
}

export function useAdminPayouts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: string[] | { id: string; status: string; reason?: string }) => {
      if (Array.isArray(data)) {
        return adminService.bulkApprovePayouts(data);
      }
      return adminService.updateWithdrawalStatus(data.id, data.status, data.reason);
    },
    onSuccess: () => {
      toast.success("Action completed successfully!");
      qc.invalidateQueries({ queryKey: ["admin", "withdrawals"] });
      qc.invalidateQueries({ queryKey: ["admin", "finance", "treasury"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Action failed");
    },
  });
}

export function useFlaggedSubmissions() {
  return useQuery({
    queryKey: ["admin", "fraud", "alerts"],
    queryFn: async () => {
      const { data } = await adminService.getFraudAlerts();
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

export function useHubDetails(id: string | null) {
  return useQuery({
    queryKey: ["admin", "hubs", id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await adminService.getHubDetails(id);
      return data.data ?? data;
    },
    enabled: !!id,
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

export function useTodayLogisticsStats() {
  return useQuery({
    queryKey: ["admin", "logistics", "today-stats"],
    queryFn: async () => {
      const { data } = await adminService.getTodayLogisticsStats();
      return data.data ?? data;
    },
  });
}

export function useUserDetails(id: string | null) {
  return useQuery({
    queryKey: ["admin", "users", id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await adminService.getUserDetails(id);
      return data.data ?? data;
    },
    enabled: !!id,
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

export function useCreateAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.createAdmin,
    onSuccess: () => {
      toast.success("Admin invitation sent successfully!");
      qc.invalidateQueries({ queryKey: ["super_admin", "admins"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to invite admin");
    },
  });
}

export function useWithdrawals(status = "pending") {
  return useQuery({
    queryKey: ["admin", "withdrawals", status],
    queryFn: () => adminService.getWithdrawals(status),
    select: (res) => res.data.data
  });
}

export function useSettings(enabled = true) {
  return useQuery({
    queryKey: ["admin", "settings"],
    queryFn: adminService.getSettings,
    select: (res) => res.data.data,
    enabled,
  });
}

export function useUpdateSetting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) => 
      adminService.updateSetting(key, value),
    onSuccess: () => {
      toast.success("Setting updated successfully!");
      qc.invalidateQueries({ queryKey: ["admin", "settings"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update setting");
    },
  });
}

export function useImpersonate() {
  const impersonate = useAuth(s => s.impersonate);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (id: string) => adminService.impersonateUser(id),
    onSuccess: (res) => {
      const { token, user } = res.data.data;
      // Convert backend user to AuthUser format
      const authUser = {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phoneNumber || "",
        role: user.role.toLowerCase(),
      };
      
      impersonate(authUser as any, token);
      toast.success(`Now impersonating ${authUser.name}`);
      
      // Redirect based on role
      const role = authUser.role;
      if (role === "collector") navigate("/collector/dashboard");
      else if (role === "agent") navigate("/agent/dashboard");
      else navigate("/admin/dashboard");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Impersonation failed");
    }
  });
}

export function useSystemHealth() {
  const { user } = useAuth();
  const isSuper = user?.role?.toLowerCase() === "super_admin";

  return useQuery({
    queryKey: ["admin", "system", "health"],
    queryFn: adminService.getSystemHealth,
    select: (res) => res.data.data,
    refetchInterval: 30000, // Refresh every 30 seconds
    enabled: !!user && isSuper,
  });
}

export function useTreasury() {
  return useQuery({
    queryKey: ["admin", "finance", "treasury"],
    queryFn: async () => {
      const res = await adminService.getTreasuryReport();
      return res.data?.data || res.data;
    },
  });
}

export function useSetup2FA() {
  return useMutation({
    mutationFn: async () => {
      const res = await adminService.setup2FA();
      return res.data.data;
    },
  });
}

export function useVerify2FA() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.verify2FA,
    onSuccess: () => {
      toast.success("Two-Factor Authentication enabled!");
      qc.invalidateQueries({ queryKey: ["admin", "profile"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Verification failed");
    }
  });
}

export function useExport() {
  return useMutation({
    mutationFn: (resource: string) => adminService.exportData(resource),
    onSuccess: (res, resource) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `recovang-${resource}-${new Date().getTime()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`${resource} exported successfully!`);
    },
    onError: (err: any) => {
      toast.error("Export failed. Please try again.");
    }
  });
}

export function useSuspendUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.suspendUser,
    onSuccess: () => {
      toast.success("User suspended successfully");
      qc.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to suspend user");
    },
  });
}

export function useUnsuspendUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.unsuspendUser,
    onSuccess: () => {
      toast.success("User reactivated successfully");
      qc.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to reactivate user");
    },
  });
}

export function useBulkUserAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.bulkUserAction,
    onSuccess: (res: any) => {
      toast.success(res.data?.message || "Bulk action completed");
      qc.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Bulk action failed");
    },
  });
}

export function useVerifyKYC() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => adminService.verifyKYC(userId),
    onSuccess: () => {
      toast.success("KYC verified successfully");
      qc.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}

export function useRejectKYC() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) => adminService.rejectKYC(userId, reason),
    onSuccess: () => {
      toast.success("KYC rejected");
      qc.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}

export function useUserNotes(userId: string | null) {
  return useQuery({
    queryKey: ["admin", "users", userId, "notes"],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await adminService.getUserNotes(userId);
      return data.data;
    },
    enabled: !!userId,
  });
}

export function useAddUserNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, content }: { userId: string; content: string }) => adminService.addUserNote(userId, content),
    onSuccess: (_, { userId }) => {
      qc.invalidateQueries({ queryKey: ["admin", "users", userId, "notes"] });
    },
  });
}

export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, title, message }: { userId: string; title: string; message: string }) => 
      adminService.sendMessage(userId, { title, message }),
    onSuccess: (_, { userId }) => {
      toast.success("Message sent successfully");
      qc.invalidateQueries({ queryKey: ["admin", "users", userId, "messages"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to send message");
    }
  });
}

export function useUserMessages(userId: string | null) {
  return useQuery({
    queryKey: ["admin", "users", userId, "messages"],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await adminService.getUserMessages(userId);
      return data.data;
    },
    enabled: !!userId,
  });
}

export function useActiveRoutes() {
  return useQuery({
    queryKey: ["admin", "logistics", "routes"],
    queryFn: async () => {
      const { data } = await adminService.getActiveRoutes();
      return data.data;
    },
    refetchInterval: 30000, // Refresh every 30s for live map
  });
}

export function useManualDispatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => adminService.manualDispatch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "logistics"] });
    },
  });
}

export function useWasteCategories() {
  return useQuery({
    queryKey: ["admin", "waste-categories"],
    queryFn: async () => {
      const { data } = await adminService.getWasteCategories();
      return data.data;
    },
  });
}
export function useVerifyDelivery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminService.verifyDelivery(id, data),
    onSuccess: () => {
      toast.success("Delivery verified!");
      queryClient.invalidateQueries({ queryKey: ["admin", "logistics"] });
    },
  });
}

export function useTogglePartnerAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.togglePartnerAvailability(id),
    onSuccess: () => {
      toast.success("Partner availability updated!");
      queryClient.invalidateQueries({ queryKey: ["admin", "logistics"] });
    },
  });
}

export function useToggleSurge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive, multiplier }: { id: string; isActive: boolean; multiplier: number }) => 
      adminService.toggleSurge(id, { isActive, multiplier }),
    onSuccess: () => {
      toast.success("Surge pricing updated");
      qc.invalidateQueries({ queryKey: ["admin", "pricing"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update surge");
    }
  });
}
export function useAdminBrands() {
  return useQuery({
    queryKey: ["admin", "brands"],
    queryFn: async () => {
      const { data } = await adminService.getBrands();
      return data.data ?? data;
    },
  });
}

export function useBrandSustainability(brandId: string | null) {
  return useQuery({
    queryKey: ["admin", "brands", brandId, "sustainability"],
    queryFn: async () => {
      if (!brandId) return null;
      const { data } = await adminService.getBrandSustainability(brandId);
      return data.data ?? data;
    },
    enabled: !!brandId,
  });
}
export function useReviewFraudAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action, reason }: { id: string; action: string; reason?: string }) => 
      adminService.reviewFraudAlert(id, { action, reason }),
    onSuccess: () => {
      toast.success("Fraud alert reviewed successfully");
      qc.invalidateQueries({ queryKey: ["admin", "fraud"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to review alert");
    }
  });
}
export function useAuditLogs(params?: any, enabled = true) {
  return useQuery({
    queryKey: ["admin", "audit-logs", params],
    queryFn: async () => {
      const { data } = await adminService.getAuditLogs(params);
      return data.data ?? data;
    },
    enabled,
  });
}
export function useAgentInviteRequests() {
  return useQuery({
    queryKey: ["admin", "agent-invites"],
    queryFn: async () => {
      const { data } = await adminService.getAgentInviteRequests();
      return data.data;
    },
  });
}

export function useManageAgentInvite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action, reason }: { id: string; action: "approve" | "reject"; reason?: string }) => {
      if (action === "approve") return adminService.approveAgentInvite(id);
      return adminService.rejectAgentInvite(id, reason || "");
    },
    onSuccess: (res: any) => {
      toast.success(res.data?.message || "Action completed");
      qc.invalidateQueries({ queryKey: ["admin", "agent-invites"] });
      qc.invalidateQueries({ queryKey: ["admin", "agents"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Action failed");
    },
  });
}
