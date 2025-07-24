'use client';

import Layout from '@/components/layout/Layout';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { formatDate } from '@/lib/utils';
import { BarChart3 } from 'lucide-react';

type QuizHistory = {
  id: string;
  score: number;
  status: string;
  created_at: string;
  note?: string;
};

export default function QuizHistoryPage() {
  const [history, setHistory] = useState<QuizHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role') || 'personal';

      try {
        const res = await axios.get(`/quiz/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHistory(res.data?.data || []);
      } catch (err) {
        console.error('Gagal memuat riwayat kuis:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <Layout>
      <div className='min-h-screen p-6 md:p-10 bg-white'>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-2xl font-bold mb-4 text-cyan-700 flex items-center gap-2'>
            <BarChart3 className="w-5 h-5" /> Riwayat Kuis
          </h1>

          {loading ? (
            <p className='text-gray-500'>Memuat data...</p>
          ) : history.length === 0 ? (
            <p className='text-gray-500'>Belum ada riwayat kuis.</p>
          ) : (
            <div className='space-y-4'>
              {history.map((item) => (
                <div key={item.id} className='border rounded-lg p-4 shadow-sm'>
                  <div className='flex justify-between items-center mb-1'>
                    <p className='text-sm text-gray-600'>
                      Tanggal: {formatDate(item.created_at)}
                    </p>
                    <p className='text-sm text-cyan-600 font-medium'>
                      Skor: {item.score} - {item.status}
                    </p>
                  </div>
                  {item.note && (
                    <p className='text-xs text-gray-500 italic'>
                      Catatan: {item.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
