import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const token = localStorage.getItem('token');
const headers = { Authorization: `Bearer ${token}` };

export const usePostureHistory = (role: 'employee' | 'personal') => {
  return useQuery({
    queryKey: ['posture-history', role],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/ergonomic/ergonomic-history`, { headers });
      return res.data.data;
    },
  });
};

export const usePostureUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await axios.post(`${BASE_URL}/ergonomic/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posture-history'] });
    },
  });
};
