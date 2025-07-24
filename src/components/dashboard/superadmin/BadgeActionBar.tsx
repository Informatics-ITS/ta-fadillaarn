'use client';

type Props = {
  onOpen: () => void;
};

export default function BadgeActionBar({ onOpen }: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Badge</h1>
        <p className="text-sm text-gray-500">Kelola penghargaan yang diberikan kepada pengguna.</p>
      </div>

      <button
        onClick={onOpen}
        className="px-5 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow hover:from-cyan-600 hover:to-teal-600 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
      >
        + Tambah Badge
      </button>
    </div>
  );
}
