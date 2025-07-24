import { useEffect, useState } from 'react';
import axios from '@/lib/axios';

export default function useFetchBadges(refreshTrigger: number) {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    axios
      .get('/badges/get-all-badges')
      .then((res) => setBadges(res.data))
      .catch((err) =>
        setError(err?.response?.data?.message || 'Gagal memuat data badge')
      )
      .finally(() => setLoading(false));
  }, [refreshTrigger]);

  return { badges, loading, error };
}
