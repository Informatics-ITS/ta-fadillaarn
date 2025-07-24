'use client';

type Props = {
  search: string;
  setSearch: (val: string) => void;
};

export default function QuizFilterBar({
  search,
  setSearch,
}: Props) {
  return (
    <div className="bg-white p-4 border rounded-xl flex flex-wrap gap-2 items-center">
      <input
        type="text"
        placeholder="Cari judul kuis..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded-md text-sm flex-1 min-w-[200px]"
      />
    </div>
  );
}
