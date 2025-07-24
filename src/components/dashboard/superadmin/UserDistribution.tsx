'use client';

import { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import axios from '@/lib/axios';

const COLORS = ['#0ea5e9', '#14b8a6', '#38bdf8']; // cyan, teal, sky-blue

export default function UserDistribution() {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        const token = localStorage.getItem('token');

        // Ambil semua role terpisah
        const [spvRes, empRes, personalRes] = await Promise.all([
          axios.get('/super-admin/get-all-supervisors', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('/super-admin/get-all-employees', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('/super-admin/get-all-users', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const supervisors = spvRes.data?.data || [];
        const employees = empRes.data?.data?.data || [];
        const personals = personalRes.data?.data || [];

        const roleCount = [
          { name: 'Supervisor', value: supervisors.length },
          { name: 'Employee', value: employees.length },
          { name: 'Personal', value: personals.length },
        ];

        setData(roleCount);
        setTotal(supervisors.length + employees.length + personals.length);
      } catch (error) {
        console.error('❌ Gagal mengambil distribusi user:', error);
        setData([]);
        setTotal(0);
      }
    };

    fetchUserRoles();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-700">
          Distribusi Role Pengguna
        </h2>
        <span className="text-sm text-gray-500">Total: {total}</span>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            innerRadius={60}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            labelLine={false}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value} pengguna`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
