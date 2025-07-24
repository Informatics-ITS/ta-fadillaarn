import { createQuiz } from '@/pages/api/quizApi';
import { useState } from 'react';

export default function CreateQuizModal({ isOpen, onClose, onSuccess }: any) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await createQuiz(token!, {
        title,
        description,
        isPublic: true, // default public quiz
      });
      onSuccess();
      onClose();
      setTitle('');
      setDescription('');
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal membuat kuis');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[400px]">
        <h2 className="text-xl font-bold mb-4">Tambah Kuis</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block mb-1">Judul</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1">Deskripsi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-300">
              Batal
            </button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
