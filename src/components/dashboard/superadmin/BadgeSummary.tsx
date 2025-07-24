'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { Award } from 'lucide-react';

export default function BadgeSummary() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/badge/get-all', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const badges = res.data?.data || [];
        setCount(badges.length);
      } catch (err) {
        console.error('Gagal mengambil badge:', err);
      }
    };

    fetchBadges();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-700">Total Badge</h2>
        <Award className="h-6 w-6 text-yellow-500" />
      </div>
      <div>
        <p className="text-4xl font-bold text-cyan-600">{count}</p>
        <p className="text-sm text-gray-500 mt-1">Penghargaan ergonomi yang tersedia</p>
      </div>
    </div>
  );
}
