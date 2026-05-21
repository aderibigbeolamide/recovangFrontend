import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export function useSubmitWaste() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/collector/submissions', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    }
  });
}

export function useWithdraw() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { type: string, data: any }) => {
      const endpoint = payload.type === 'bank' ? '/withdrawals/bank' : 
                       payload.type === 'airtime' ? '/withdrawals/airtime' : 
                       payload.type === 'data' ? '/withdrawals/data' : 
                       `/withdrawals/bills/${payload.data.billType}`;
      const res = await api.post(endpoint, payload.data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    }
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await api.get('/collector/profile');
      return data.data;
    },
  });
}

export function useBanks() {
  return useQuery({
    queryKey: ['banks'],
    queryFn: async () => {
      const { data } = await api.get('/collector/banks');
      return data.data;
    },
    staleTime: 1000 * 60 * 60 * 24, // cache for 24 hours
  });
}

export function useVerifyBankAccount() {
  return useMutation({
    mutationFn: async (payload: { accountNumber: string; bankCode: string }) => {
      const res = await api.post('/collector/bank-account/verify', payload);
      return res.data.data; // this returns { status, accountName, accountNumber }
    }
  });
}

export function useAddBankAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { bankName: string; accountNumber: string; accountName: string }) => {
      const res = await api.post('/collector/bank-account', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
  });
}

export function useRemoveBankAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    // We can simulate removal by updating the profile and sending empty bank details
    mutationFn: async () => {
      const res = await api.put('/collector/profile', { bankName: null, accountNumber: null, accountName: null, bankCode: null });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
  });
}

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/collector/dashboard');
      return data.data;
    },
  });
}

export function useSubmissions() {
  return useQuery({
    queryKey: ['submissions'],
    queryFn: async () => {
      const { data } = await api.get('/collector/submissions');
      return data.data;
    },
  });
}

export function useBalance() {
  return useQuery({
    queryKey: ['balance'],
    queryFn: async () => {
      const { data } = await api.get('/collector/balance');
      return data.data;
    },
  });
}

export function usePricing() {
  return useQuery({
    queryKey: ['pricing'],
    queryFn: async () => {
      const { data } = await api.get('/pricing');
      return data.data;
    },
  });
}

export function useWallet() {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const { data } = await api.get('/collector/wallet');
      return data.data;
    },
  });
}

export function useNearbyHubs(lat?: number, lng?: number) {
  return useQuery({
    queryKey: ['hubs', lat, lng],
    queryFn: async () => {
      const { data } = await api.get('/collector/hubs/nearby', {
        params: { lat, lng }
      });
      return data.data;
    }
  });
}

export function useLeaderboard() {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data } = await api.get('/collector/leaderboard');
      return data.data;
    },
  });
}

export function useBadges() {
  return useQuery({
    queryKey: ['badges'],
    queryFn: async () => {
      const { data } = await api.get('/collector/badges');
      return data.data;
    },
  });
}

export function useStreak() {
  return useQuery({
    queryKey: ['streak'],
    queryFn: async () => {
      const { data } = await api.get('/collector/streak');
      return data.data;
    },
  });
}

export function useDisputes() {
  return useQuery({
    queryKey: ['disputes'],
    queryFn: async () => {
      const { data } = await api.get('/collector/submissions');
      // Filter for disputed submissions
      return data.data.filter((s: any) => s.disputeStatus !== 'NONE');
    },
  });
}

export function useDisputeSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ submissionId, reason }: { submissionId: string, reason: string }) => {
      const res = await api.post(`/collector/submissions/${submissionId}/dispute`, { reason });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disputes'] });
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    }
  });
}

export function useReferrals() {
  return useQuery({
    queryKey: ['referrals'],
    queryFn: async () => {
      const { data } = await api.get('/collector/referral-data');
      return data.data;
    },
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await api.get('/collector/notifications');
      return data.data;
    },
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post(`/collector/notifications/${id}/read`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await api.post('/collector/notifications/read-all');
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });
}

export function useWithdrawalHistory() {
  return useQuery({
    queryKey: ['withdrawals'],
    queryFn: async () => {
      const { data } = await api.get('/withdrawals');
      return data.data;
    },
  });
}

export function useDeleteWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/withdrawals/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
    }
  });
}
