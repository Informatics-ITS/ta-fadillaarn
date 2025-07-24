'use client';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useRef, useState } from 'react';

type Props = {
  initialImage?: string;
  onChange: (file: File) => void;
};

export default function AvatarUpload({ initialImage, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(initialImage || '');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onChange(file);
    }
  };

  return (
    <div className="relative w-fit group">
      <Avatar
        onClick={() => fileInputRef.current?.click()}
        className="w-20 h-20 cursor-pointer ring-2 ring-sky-200 group-hover:ring-sky-500 transition"
      >
        <Avatar
        onClick={() => fileInputRef.current?.click()}
        className="w-20 h-20 cursor-pointer ring-2 ring-sky-200 group-hover:ring-sky-500 transition"
        >
        <AvatarImage src={preview} className="object-cover" />
        <AvatarFallback>👤</AvatarFallback>
        </Avatar>

        <AvatarFallback>👤</AvatarFallback>
      </Avatar>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <p className="text-xs text-center text-sky-600 mt-1 group-hover:underline cursor-pointer">
        Ganti Foto
      </p>
    </div>
  );
}
