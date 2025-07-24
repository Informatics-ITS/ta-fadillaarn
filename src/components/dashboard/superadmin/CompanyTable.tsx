'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import axios from '@/lib/axios';
import CompanyFormModal from './CompanyFormModal';
import CompanyConfirmModal from './CompanyConfirmModal';

type Company = {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
};

type Props = {
  search: string;
  refresh: boolean;
  setRefresh: (val: boolean | ((prev: boolean) => boolean)) => void;
  onCompaniesUpdate: (companies: Company[]) => void;
};

export default function CompanyTable({ search, refresh, setRefresh, onCompaniesUpdate }: Props) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [showFormModal, setShowFormModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios
      .get('/company/get-all-company', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const result = res.data?.data || [];
        setCompanies(result);
        onCompaniesUpdate(result);
      })
      .catch((err) => {
        console.error('Gagal mengambil data perusahaan:', err);
        setCompanies([]);
      });
  }, [refresh]);

  useEffect(() => {
    setCurrentPage(1); // reset halaman ke 1 saat search berubah
  }, [search]);

  const filtered = companies.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setShowFormModal(true);
  };

  const handleDelete = (company: Company) => {
    setSelectedCompany(company);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!selectedCompany) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/company/${selectedCompany.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRefresh((prev: boolean) => !prev);
    } catch (err) {
      console.error('Gagal menghapus perusahaan:', err);
    } finally {
      setShowConfirmModal(false);
    }
  };

  return (
    <>
    <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-gray-50 text-gray-500 text-xs uppercase border-b">
          <tr>
            <th className="px-6 py-3 text-center">No.</th>
            <th className="px-6 py-3 text-left">Nama Perusahaan</th>
            <th className="px-6 py-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center px-4 py-6 text-gray-500 italic">
                Tidak ada perusahaan ditemukan.
              </td>
            </tr>
          ) : (
            paginatedData.map((company, index) => (
              <tr key={company.id} className="border-t hover:bg-gray-50 transition-colors duration-150">
                <td className="px-4 py-3 text-center">{startIndex + index + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{company.name}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <button
                      aria-label="Edit perusahaan"
                      onClick={() => handleEdit(company)}
                      className="p-1 rounded hover:bg-blue-100 text-gray-500 transition"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      aria-label="Hapus perusahaan"
                      onClick={() => handleDelete(company)}
                      className="p-1 rounded hover:bg-red-100 text-gray-500 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center px-6 py-4 text-sm text-gray-600">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          >
            Sebelumnya
          </button>
          <span>
            Halaman {currentPage} dari {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          >
            Selanjutnya
          </button>
        </div>
      )}
    </div>

      {/* Modal Edit */}
      <CompanyFormModal
        visible={showFormModal}
        mode="edit"
        data={selectedCompany}
        onClose={() => setShowFormModal(false)}
        onSuccess={() => {
          setShowFormModal(false);
          setRefresh((prev: boolean) => !prev);
        }}
      />

      {/* Modal Konfirmasi Hapus */}
      <CompanyConfirmModal
        visible={showConfirmModal}
        companyName={selectedCompany?.name || ''}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleDeleteConfirmed}
      />
    </>
  );
}
