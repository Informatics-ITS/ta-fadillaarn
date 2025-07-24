'use client';

type Props = {
  onSubmit: () => void;
  onCancel?: () => void;
};

export default function ActionButtons({ onSubmit, onCancel }: Props) {
  return (
    <div className="flex justify-end gap-3 pt-4">
      {onCancel && (
        <button
          onClick={onCancel}
          type="button"
          className="px-5 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
        >
          Batal
        </button>
      )}
      <button
        onClick={onSubmit}
        type="submit"
        className="px-5 py-2 rounded-md text-sm text-white bg-gradient-to-r from-cyan-600 to-teal-500 hover:brightness-110"
      >
        Simpan
      </button>
    </div>
  );
}
