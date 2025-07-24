import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Ambil data dari backend profile berdasarkan role
export const useUserDashboard = (role: 'employee' | 'personal') => {
  return useQuery({
    queryKey: ['user-dashboard', role],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // 1. Get profile data
      const profileRes = await axios.get(
        `${BASE_URL}/${role}/profile`,
        { headers }
      );
      const profile = profileRes.data.data;

      const userId = profile.id;

      // 2. Get ergonomic history
      const ergoRes = await axios.get(
        `${BASE_URL}/ergonomic/ergonomic-history`,
        { headers }
      );
      const evaluation = ergoRes.data?.data?.[0];

      // 3. Get badges
      const badgeRes = await axios.get(
        `${BASE_URL}/employee-badges/employee/${userId}`,
        { headers }
      );
      const badges = badgeRes.data.data;

      // 4. Simulasi tips & task static sementara
      const tips = [
        {
          title: 'Atur Ketinggian Kursi',
          desc: 'Pastikan ketinggian kursi diatur agar kaki menapak lantai.',
        },
        {
          title: 'Jarak Pandang Monitor',
          desc: 'Monitor idealnya berjarak 50–70 cm dari mata.',
        },
      ];

      const tasks = [
        { title: 'Evaluasi Postur Mingguan', date: '24 Apr 2025' },
        { title: 'Kuis Ergonomi Dasar', date: '26 Apr 2025' },
      ];

      return {
        name: profile.name,
        score: evaluation?.score || 0,
        status: evaluation?.status || 'Cukup',
        lastEvaluationDate: evaluation?.created_at || '-',
        nextScheduleDate: '24 Apr 2025', // sementara static
        totalSchedule: 3,
        tasks,
        badges,
        tips,
        alertMessage: evaluation?.note || 'Postur Anda perlu perhatian.',
      };
    },
  });
};
