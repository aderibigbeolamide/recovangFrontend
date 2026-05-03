import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

export function useLogisticsDashboard() {
  return useQuery({
    queryKey: ["logistics", "dashboard"],
    queryFn: async () => {
      const res = await api.get("/logistics/dashboard");
      return res.data.data;
    },
  });
}

export function useAcceptPickup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post(`/logistics/pickups/${id}/accept`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logistics", "dashboard"] });
    },
  });
}

export function useUpdateTripStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await api.put(`/logistics/pickups/${id}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logistics", "dashboard"] });
    },
  });
}
