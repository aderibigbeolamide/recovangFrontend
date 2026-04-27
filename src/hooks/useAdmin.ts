import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/admin/dashboard');
      return data.data;
    },
  });
}

export function useAdminAnalytics() {
  return useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const { data } = await api.get('/admin/analytics-overview');
      return data.data;
    },
  });
}

export function useWasteByCategory() {
  return useQuery({
    queryKey: ['waste-by-category'],
    queryFn: async () => {
      const { data } = await api.get('/admin/waste-by-category');
      return data.data;
    },
  });
}

export function useRevenueAnalytics() {
  return useQuery({
    queryKey: ['revenue-analytics'],
    queryFn: async () => {
      const { data } = await api.get('/admin/revenue-analytics');
      return data.data;
    },
  });
}
