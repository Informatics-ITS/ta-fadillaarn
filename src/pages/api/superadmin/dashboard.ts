import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const useSuperadminDashboard = () => {
  return useQuery({
    queryKey: ['superadmin-dashboard'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [spvRes, empRes, userRes] = await Promise.all([
        axios.get(`${BASE_URL}/super-admin/get-all-supervisors`, { headers }),
        axios.get(`${BASE_URL}/super-admin/get-all-employees`, { headers }),
        axios.get(`${BASE_URL}/super-admin/get-all-users`, { headers }),
      ]);

      return {
        supervisors: spvRes.data.data,
        employees: empRes.data.data,
        personals: userRes.data.data,
      };
    },
  });
};
