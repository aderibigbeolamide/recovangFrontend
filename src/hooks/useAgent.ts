import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export function useAgentDashboard() {
  return useQuery({
    queryKey: ['agent-dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/agent/dashboard');
      return data.data;
    },
  });
}

export function usePendingSubmissions(hubId?: string) {
  return useQuery({
    queryKey: ['pending-submissions', hubId],
    queryFn: async () => {
      const { data } = await api.get('/agent/pending-submissions', {
        params: { hubId }
      });
      return data.data;
    },
    enabled: !!hubId
  });
}

export function useVerifySubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ submissionId, weight, photo }: { submissionId: string, weight: number, photo?: File }) => {
      const formData = new FormData();
      formData.append('actualWeight', weight.toString());
      if (photo) formData.append('scalePhoto', photo);
      
      const { data } = await api.post(`/agent/verify/${submissionId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['agent-dashboard'] });
    }
  });
}
