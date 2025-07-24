'use client';

import { Search } from "lucide-react";

type Props = {
  search: string;
  setSearch: (val: string) => void;
};

export default function QuizFilterBar({ search, setSearch }: Props) {
  return (
    <div className="bg-white p-4 border rounded-xl flex flex-wrap gap-2 items-center">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Cari judul kuis..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
        />
      </div>
    </div>
  );
}
