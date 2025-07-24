'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import axios from '@/lib/axios';

type TrendData = {
  name: string; // nama bulan
  pengguna: number;
  evaluasi: number;
};

export default function TrendChart() {
  const [data, setData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/super-admin/trend', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const raw = response.data?.data || [];

        const formatted: TrendData[] = raw.map((item: any) => ({
          name: item.month ?? 'Unknown',
          pengguna: typeof item.pengguna === 'number' ? item.pengguna : 0,
          evaluasi: typeof item.evaluasi === 'number' ? item.evaluasi : 0,
        }));

        setData(formatted);
      } catch (error) {
        console.error('❌ Gagal memuat data tren:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold text-slate-700 mb-4">
        Pertumbuhan Pengguna & Evaluasi
      </h2>

      {loading ? (
        <div className="text-center text-gray-400 py-20">Memuat data...</div>
      ) : data.length === 0 ? (
        <div className="text-center text-gray-400 py-20">Tidak ada data tren.</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="pengguna"
              stroke="#0ea5e9"
              strokeWidth={2}
              name="Pengguna"
            />
            <Line
              type="monotone"
              dataKey="evaluasi"
              stroke="#14b8a6"
              strokeWidth={2}
              name="Evaluasi"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
