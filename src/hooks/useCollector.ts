import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

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

export function useNearbyHubs(lat?: number, lng?: number) {
  return useQuery({
    queryKey: ['hubs', lat, lng],
    queryFn: async () => {
      const { data } = await api.get('/collector/nearby-hubs', {
        params: { lat, lng }
      });
      return data.data;
    },
    enabled: !!lat && !!lng
  });
}
