'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';

export default function RecentCompanies() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/company/get-all-company', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const all = res.data?.data || [];
        const sorted = all.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setCompanies(sorted.slice(0, 5));
      } catch (err) {
        console.error('Gagal mengambil perusahaan:', err);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-slate-700">
        Perusahaan Terbaru
      </h2>
      {companies.length > 0 ? (
        <div className="space-y-3 text-sm">
          {companies.map((company: any, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-1 border-b"
            >
              <span className="text-slate-800 font-medium">{company.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-sm text-gray-400 italic">
          Belum ada perusahaan ditambahkan.
        </div>
      )}
    </div>
  );
}
