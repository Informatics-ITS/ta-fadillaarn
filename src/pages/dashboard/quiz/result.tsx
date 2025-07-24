'use client';

import Layout from '@/components/layout/Layout';
import QuizResultCard from '@/components/quiz/QuizResultCard';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';

type ResultType = {
  score: number;
  category: string;
  recommendation: string;
};

export default function QuizResultPage() {
  const [result, setResult] = useState<ResultType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('/quiz/result', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResult(res.data?.data || null);
        
      } catch (err) {
        console.error('Gagal mengambil hasil kuis:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen p-6 md:p-10 bg-white text-gray-800">
        {loading ? (
          <div className="p-10">Memuat hasil...</div>
        ) : result ? (
          <QuizResultCard
            score={result.score}
            category={result.category}
            recommendation={result.recommendation}
          />
        ) : (
          <div className="p-10 text-red-600">Gagal memuat hasil kuis.</div>
        )}
      </div>
    </Layout>
  );
}
