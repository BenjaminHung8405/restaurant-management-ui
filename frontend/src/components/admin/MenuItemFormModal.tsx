"use client";

import { Category, MenuItem, MenuItemStatus } from "@/app/admin/menu/types";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface MenuItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: MenuItem | null;
  onSubmit: (item: MenuItem) => Promise<void>;
  categories?: Category[];
  isSubmitting?: boolean;
}

export default function MenuItemFormModal({ 
  isOpen, 
  onClose, 
  initialData, 
  onSubmit,
  categories = [],
  isSubmitting = false
}: MenuItemFormModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState<MenuItemStatus>("active");
  const [touched, setTouched] = useState({ name: false, price: false });

  // Set default category when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !category) {
      setCategory(categories[0].name);
    }
  }, [categories, category]);

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setName(initialData.name);
      setCategory(initialData.category);
      setPrice(initialData.price);
      setDescription(initialData.description || "");
      setImageUrl(initialData.image_url);
      setStatus(initialData.status);
    } else {
      setName("");
      setCategory(categories.length > 0 ? categories[0].name : "");
      setPrice(0);
      setDescription("");
      setImageUrl("");
      setStatus("active");
    }
    setTouched({ name: false, price: false });
  }, [isOpen, initialData, categories]);

  const errors = useMemo(() => {
    return {
      name: name.trim() === "" ? "Tên món ăn không được để trống." : "",
      price: price < 0 ? "Giá phải lớn hơn hoặc bằng 0." : "",
    };
  }, [name, price]);

  const hasError = Boolean(errors.name || errors.price);

  const handleSave = () => {
    setTouched({ name: true, price: true });
    if (hasError) return;

    const item: MenuItem = {
      id: initialData ? initialData.id : Date.now(),
      name: name.trim(),
      category,
      price: Number(price),
      description: description.trim(),
      status,
      image_url: imageUrl.trim() || "https://via.placeholder.com/80",
    };

    onSubmit(item);
    onClose();
  };

  if (!isOpen) {
    console.log("[DEBUG] Modal isOpen is false, returning null");
    return null;
  }

  console.log("[DEBUG] Modal rendering with isOpen=true");

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-8" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 id="modal-title" className="text-lg font-semibold text-slate-800">
            {initialData ? "Chỉnh sửa món ăn" : "Thêm món ăn mới"}
          </h2>
          <button
            type="button"
            aria-label="Đóng"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("[DEBUG] Close button clicked");
              onClose();
            }}
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Tên món ăn */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Tên món ăn <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
              placeholder="VD: Phở bò tái"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            {touched.name && errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Danh mục */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Danh mục <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Chọn danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Giá bán */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Giá bán (VND) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={0}
              step={1000}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              onBlur={() => setTouched((prev) => ({ ...prev, price: true }))}
              placeholder="VD: 75000"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            {touched.price && errors.price && (
              <p className="mt-1 text-xs text-red-500">{errors.price}</p>
            )}
          </div>

          {/* Mô tả */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Mô tả
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="VD: Phở bò ngon, nước súp đậm đà..."
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
            />
          </div>

          {/* Hình ảnh */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Hình ảnh (URL)
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Trạng thái */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Trạng thái
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as MenuItemStatus)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="active">Đang bán</option>
              <option value="inactive">Hết hàng</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("[DEBUG] Cancel button clicked");
              onClose();
            }}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("[DEBUG] Save button clicked, hasError:", hasError, "name:", name.trim());
              handleSave();
            }}
            disabled={hasError || name.trim() === "" || isSubmitting}
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
              hasError || name.trim() === "" || isSubmitting
                ? "cursor-not-allowed bg-slate-300"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Đang lưu..." : (initialData ? "Cập nhật" : "Tạo mới")}
          </button>
        </div>
      </div>
    </div>
  );
}
