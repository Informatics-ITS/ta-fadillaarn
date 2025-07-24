'use client';

import { QuizForm } from './EditQuizModal';

type DeleteQuizDialogProps = {
  quiz: QuizForm;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteQuizDialog({ quiz, onCancel, onConfirm }: DeleteQuizDialogProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
        <h2 className="text-lg font-bold mb-2">Hapus Kuis</h2>
        <p className="text-sm text-gray-700">
          Apakah Anda yakin ingin menghapus kuis <strong>{quiz.title}</strong>?
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
