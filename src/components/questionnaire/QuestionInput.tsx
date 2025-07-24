'use client';

type Props = {
  value: string;
  onChange: (val: string) => void;
};

export default function QuestionInput({ value, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Pertanyaan
      </label>
      <input
        type="text"
        placeholder="Masukkan pertanyaan kuisioner"
        className="w-full border px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
}
