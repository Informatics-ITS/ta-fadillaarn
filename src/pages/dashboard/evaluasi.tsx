'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EvaluasiPage() {
  const [imageUrl, setImageUrl] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);
  const quizId = '1'; // ganti dengan ID dari backend
  const router = useRouter();

  useEffect(() => {
    router.replace('/evaluasi'); // arahkan ke halaman metode evaluasi
  }, [router]);

  return null;
}
