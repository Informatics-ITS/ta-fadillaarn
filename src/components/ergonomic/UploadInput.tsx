'use client';

import { useRef } from 'react';

type UploadInputProps = {
  onChange: (file: File) => void;
};

export default function UploadInput({ onChange }: UploadInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mb-4">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onChange(file);
        }}
        className="border p-2 rounded-md"
      />
    </div>
  );
}
