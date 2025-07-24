'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import axios from '@/lib/axios';

type Props = {
  visible: boolean;
  mode: 'add' | 'edit';
  data: { id: string; name: string } | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function DivisionFormModal({ visible, mode, data, onClose, onSuccess }: Props) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && data) {
      setName(data.name);
    } else {
      setName('');
    }
  }, [mode, data, visible]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Nama divisi tidak boleh kosong.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'add') {
        console.log('Mengirim request POST /division/registerdengan:', { name });
        await axios.post('/division/register', { name });
      } else if (data?.id) {
        console.log(`Mengirim request PUT /division/${data.id} dengan:`, { name });
        await axios.put(`/division/${data.id}`, { name });
      }

      setName('');
      onSuccess();
    } catch (err: any) {
      console.error('Gagal menyimpan divisi:', err?.response?.data || err?.message || err);
      alert(err?.response?.data?.message || 'Terjadi kesalahan saat menyimpan divisi.');
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold mb-4">
          {mode === 'add' ? 'Tambah Divisi' : 'Edit Divisi'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Nama Divisi</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
              placeholder="Contoh: Produksi, Marketing"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md text-sm"
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
