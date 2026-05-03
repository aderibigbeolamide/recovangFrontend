import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

export function useAgentDashboard() {
  return useQuery({
    queryKey: ["agent-dashboard"],
    queryFn: async () => {
      const { data } = await api.get("/agent/dashboard");
      return data.data;
    },
  });
}

export function useAgentHub() {
    return useQuery({
      queryKey: ["agent-hub"],
      queryFn: async () => {
        const { data } = await api.get("/agent/hub");
        return data.data;
      },
    });
}

export function usePendingSubmissions() {
    return useQuery({
      queryKey: ["agent-pending"],
      queryFn: async () => {
        const { data } = await api.get("/agent/submissions/pending");
        return data.data;
      },
    });
}

export function useVerifySubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: string; items: any[]; photos?: string[] }) => {
      const { data } = await api.post(`/agent/submissions/${id}/verify`, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["agent-pending"] });
    },
  });
}

export function useRejectSubmission() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
        const { data } = await api.post(`/agent/submissions/${id}/reject`, { reason });
        return data.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["agent-dashboard"] });
        queryClient.invalidateQueries({ queryKey: ["agent-pending"] });
      },
    });
}

export function useAgentReports(params?: any) {
  return useQuery({
    queryKey: ["agent-reports", params],
    queryFn: async () => {
      const { data } = await api.get("/agent/reports", { params });
      return data.data;
    },
  });
}

export function useAgentXp() {
  return useQuery({
    queryKey: ["agent-xp"],
    queryFn: async () => {
      const { data } = await api.get("/agent/xp");
      return data.data;
    },
  });
}
