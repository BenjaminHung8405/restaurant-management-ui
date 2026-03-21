"use client";

import MenuItemFormModal from "@/components/admin/MenuItemFormModal";
import { AlertCircle, Edit3, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Category, MenuItem } from "./types";

const initialMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Phở bò tái",
    category: "Món chính",
    price: 75000,
    status: "active",
    image_url: "https://images.unsplash.com/photo-1604908177522-41f8941990df?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: 2,
    name: "Gỏi cuốn tôm",
    category: "Khai vị",
    price: 42000,
    status: "active",
    image_url: "https://images.unsplash.com/photo-1606635211017-d44f9a566402?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: 3,
    name: "Chè ba màu",
    category: "Tráng miệng",
    price: 35000,
    status: "inactive",
    image_url: "https://images.unsplash.com/photo-1611175690144-82b3357df2f1?auto=format&fit=crop&w=80&q=80",
  },
];

const formatVND = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>(initialMenuItems);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch mock categories
  const mockCategories: Category[] = [
    { id: "cat-001", name: "Khai vị" },
    { id: "cat-002", name: "Món chính" },
    { id: "cat-003", name: "Tráng miệng" },
    { id: "cat-004", name: "Đồ uống" },
  ];

  useEffect(() => {
    setCategories(mockCategories);
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (formItem: MenuItem) => {
    setItems((previous) => {
      const exists = previous.some((item) => item.id === formItem.id);
      if (exists) {
        return previous.map((item) => (item.id === formItem.id ? formItem : item));
      }
      return [formItem, ...previous];
    });
    setIsModalOpen(false);
  };

  const handleDelete = (id: string | number) => {
    if (!window.confirm("Bạn có chắc muốn xóa món này?")) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const statusBadge = (status: MenuItem["status"]) =>
    status === "active"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-amber-100 text-amber-700";

  const tableRows = useMemo(() => {
    return items.map((item) => (
      <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
        <td className="px-3 py-3.5">
          <img
            src={item.image_url}
            alt={item.name}
            className="h-12 w-12 rounded-md object-cover border border-slate-200"
          />
        </td>
        <td className="px-3 py-3.5 text-sm text-slate-800">{item.name}</td>
        <td className="px-3 py-3.5 text-sm text-slate-600">{item.category}</td>
        <td className="px-3 py-3.5 text-sm font-medium text-slate-800">{formatVND(item.price)}</td>
        <td className="px-3 py-3.5">
          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusBadge(item.status)}`}>
            {item.status === "active" ? "Đang bán" : "Hết hàng"}
          </span>
        </td>
        <td className="px-3 py-3.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openEditModal(item)}
              className="rounded-lg border border-slate-300 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
              aria-label={`Chỉnh sửa ${item.name}`}
            >
              <Edit3 size={16} />
            </button>
            <button
              type="button"
              onClick={() => handleDelete(item.id)}
              className="rounded-lg border border-rose-300 p-2 text-rose-600 hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200"
              aria-label={`Xóa ${item.name}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>
    ));
  }, [items]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Quản lý Thực đơn</h1>
            <p className="text-slate-600 mt-1">Cập nhật và quản lý các món ăn của nhà hàng</p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 whitespace-nowrap"
          >
            <Plus size={18} /> Thêm món ăn
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-red-900 font-medium">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-red-700 text-sm mt-1 hover:underline"
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Hình ảnh</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Tên món</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Danh mục</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Giá bán</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Trạng thái</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Hành động</th>
                </tr>
              </thead>
              <tbody>{tableRows}</tbody>
            </table>
          </div>
        </div>
      </div>

      <MenuItemFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        initialData={editingItem}
        onSubmit={handleSubmit}
        categories={categories}
      />
    </div>
  );
}
