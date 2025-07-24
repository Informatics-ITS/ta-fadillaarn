import { QuizForm } from './EditQuizModal';

type DeleteQuizDialogProps = {
  quiz: QuizForm;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteQuizDialog({ quiz, onCancel, onConfirm }: DeleteQuizDialogProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-md shadow-md max-w-sm w-full">
        <h2 className="text-lg font-bold mb-2">Hapus Kuis</h2>
        <p className="text-sm text-gray-600">Apakah Anda yakin ingin menghapus kuis <strong>{quiz.title}</strong>?</p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-1 border rounded text-sm">Batal</button>
          <button onClick={onConfirm} className="px-4 py-1 bg-red-500 text-white rounded text-sm">Hapus</button>
        </div>
      </div>
    </div>
  );
}
