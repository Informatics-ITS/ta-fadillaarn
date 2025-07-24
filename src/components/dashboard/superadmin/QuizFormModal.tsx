import React, { useState, useEffect } from "react";
import { createQuiz, updateQuiz } from "@/pages/api/quizApi";
import { toast } from "react-hot-toast";

export default function QuizFormModal({ isOpen, onClose, onSuccess, editData, role, token }: any) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (editData) {
      setTitle(editData.title);
      setCategory(editData.category);
    } else {
      setTitle("");
      setCategory("");
    }
  }, [editData]);

  const handleSubmit = async () => {
    try {
      if (editData) {
        // You may need to replace 'token' with the actual token variable from your context or props
        await updateQuiz(role, editData.id, { title, category });
        toast.success("Berhasil update kuis");
      } else {
        // You may need to replace 'token' with the actual token variable from your context or props
        await createQuiz(token, { title, category, role });
        toast.success("Berhasil menambahkan kuis");
      }
      onSuccess();
    } catch {
      toast.error("Gagal menyimpan kuis");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-[400px]">
        <h2 className="text-xl font-bold mb-4">{editData ? "Edit Kuis" : "Tambah Kuis"}</h2>
        <input
          className="border p-2 w-full mb-3"
          placeholder="Judul"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-3"
          placeholder="Kategori"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Batal</button>
          <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">Simpan</button>
        </div>
      </div>
    </div>
  );
}
