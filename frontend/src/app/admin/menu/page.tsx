"use client";

import MenuItemFormModal from "@/components/admin/MenuItemFormModal";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import axiosClient from "@/lib/axiosClient";
import { AlertCircle, Edit3, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Category, MenuItem } from "./types";

const formatVND = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

// Helper: Map API response to UI format
const mapApiItemToUI = (apiItem: any, categoryNameById: Map<string, string>): MenuItem => ({
  id: apiItem.id,
  name: apiItem.name,
  category: categoryNameById.get(apiItem.category_id) || "Unknown",
  category_id: apiItem.category_id,
  price: apiItem.price,
  status: apiItem.is_available ? "active" : "inactive",
  image_url: apiItem.image_url || "https://via.placeholder.com/80",
  description: apiItem.description,
});

// Helper: Map UI format to API format
const mapUIItemToApi = (uiItem: MenuItem, categoryNameToId: Map<string, string>) => ({
  category_id: categoryNameToId.get(uiItem.category) || "",
  name: uiItem.name,
  description: uiItem.description || "",
  price: uiItem.price,
  image_url: uiItem.image_url,
  is_available: uiItem.status === "active",
});

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories and menu items on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch categories
        const categoriesResponse = await axiosClient.get("/categories");
        const categoriesData = categoriesResponse.data || [];
        setCategories(categoriesData);

        // Fetch menu items
        const itemsResponse = await axiosClient.get("/menu-items");
        const itemsData = itemsResponse.data || [];

        // Create mapping for category names
        const categoryNameById = new Map(
          categoriesData.map((cat: Category) => [cat.id, cat.name])
        );

        // Transform API items to UI format
        const transformedItems = itemsData.map((item: any) =>
          mapApiItemToUI(item, categoryNameById)
        );

        setItems(transformedItems);
      } catch (err) {
        console.error("[API Error] Failed to fetch data:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Không thể tải dữ liệu. Vui lòng thử lại."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const openAddModal = () => {
    console.log("[DEBUG] Opening Add Modal");
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    console.log("[DEBUG] Opening Edit Modal for item:", item.id);
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log("[DEBUG] Closing Modal");
    setIsModalOpen(false);
  };

  // Create map for category name to ID conversion
  const categoryNameToId = useMemo(() => {
    const map = new Map();
    categories.forEach((cat) => map.set(cat.name, cat.id));
    return map;
  }, [categories]);

  const handleSubmit = async (formItem: MenuItem) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const apiData = mapUIItemToApi(formItem, categoryNameToId);

      if (editingItem) {
        // Update existing item
        console.log("[API] Updating menu item:", editingItem.id);
        await axiosClient.put(`/menu-items/${editingItem.id}`, apiData);
        console.log("[API] Menu item updated successfully");

        // Update local state
        setItems((prev) =>
          prev.map((item) =>
            item.id === editingItem.id ? formItem : item
          )
        );
      } else {
        // Create new item
        console.log("[API] Creating new menu item");
        const response = await axiosClient.post("/menu-items", apiData);
        const newItem = mapApiItemToUI(response.data, new Map(categories.map((c) => [c.id, c.name])));
        console.log("[API] Menu item created successfully:", newItem.id);

        // Prepend to local state
        setItems((prev) => [newItem, ...prev]);
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("[API Error] Submit failed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Không thể lưu dữ liệu. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm("Bạn có chắc muốn xóa món này?")) return;

    try {
      setIsSubmitting(true);
      setError(null);

      console.log("[API] Deleting menu item:", id);
      await axiosClient.delete(`/menu-items/${id}`);
      console.log("[API] Menu item deleted successfully");

      // Remove from local state
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("[API Error] Delete failed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Không thể xóa dữ liệu. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusBadge = (status: MenuItem["status"]) =>
    status === "active"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-amber-100 text-amber-700";

  const tableRows = useMemo(() => {
    return items.map((item) => (
      <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors duration-150">
        <td className="px-6 py-4 align-middle">
          <img
            src={item.image_url}
            alt={item.name}
            className="h-14 w-14 rounded-lg object-cover border border-slate-200 shadow-sm"
          />
        </td>
        <td className="px-6 py-4 align-middle">
          <div className="max-w-xs">
            <p
              className="text-sm font-medium text-slate-900 line-clamp-2 break-words"
              title={item.name}
            >
              {item.name}
            </p>
          </div>
        </td>
        <td className="px-6 py-4 align-middle text-sm text-slate-600">{item.category}</td>
        <td className="px-6 py-4 align-middle text-right">
          <span className="text-sm font-semibold text-slate-900">{formatVND(item.price)}</span>
        </td>
        <td className="px-6 py-4 align-middle">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusBadge(item.status)}`}>
            {item.status === "active" ? "Đang bán" : "Hết hàng"}
          </span>
        </td>
        <td className="px-6 py-4 align-middle">
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => openEditModal(item)}
              className="rounded-lg border border-slate-300 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-700 hover:border-slate-400 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
              aria-label={`Chỉnh sửa ${item.name}`}
            >
              <Edit3 size={16} />
            </button>
            <button
              type="button"
              onClick={() => handleDelete(item.id)}
              className="rounded-lg border border-rose-300 p-2 text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-400 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("[DEBUG] Button clicked - isModalOpen before:", isModalOpen);
              openAddModal();
              console.log("[DEBUG] Button clicked - isModalOpen after:", isModalOpen);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 whitespace-nowrap active:bg-blue-800"
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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <LoadingSpinner size="lg" colorClass="text-blue-600" className="mb-3" />
              <p className="text-slate-600 text-sm">Đang tải dữ liệu...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-slate-500 text-sm">Không có món ăn nào. Hãy tạo một cái mới.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">Hình ảnh</th>
                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">Tên món</th>
                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">Danh mục</th>
                    <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Giá bán</th>
                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">Trạng thái</th>
                    <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Hành động</th>
                  </tr>
                </thead>
                <tbody>{tableRows}</tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <MenuItemFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        initialData={editingItem}
        onSubmit={handleSubmit}
        categories={categories}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
