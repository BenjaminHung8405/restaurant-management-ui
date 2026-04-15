"use client";

import React, { useState } from "react";
import Button from "@/components/common/Button";
import DishFormModal, { Dish, DishFormValues } from "@/components/admin/menu/DishFormModal";
import { MOCK_DISHES } from "@/lib/mockData";

export default function AdminMenuPage() {
  const [dishes, setDishes] = useState<Dish[]>(MOCK_DISHES as unknown as Dish[]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | undefined>(undefined);

  const openAdd = () => {
    setSelectedDish(undefined);
    setIsModalOpen(true);
  };

  const openEdit = (dish: Dish) => {
    setSelectedDish(dish);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDish(undefined);
  };

  const handleSubmit = (data: DishFormValues) => {
    if (selectedDish) {
      setDishes((prev) => prev.map((d) => (d.id === selectedDish.id ? { ...d, ...data } : d)));
    } else {
      const newDish: Dish = { id: Date.now().toString(), ...data } as Dish;
      setDishes((prev) => [newDish, ...prev]);
    }

    closeModal();
  };

  const formatVND = (value: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quản lý Thực đơn</h1>
          <p className="text-slate-600">Quản lý các món ăn và danh mục</p>
        </div>
        <Button variant="primary" onClick={openAdd}>Thêm món mới</Button>
      </div>

      <div className="rounded-lg bg-white shadow-sm border border-slate-200 overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tên</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Danh mục</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Giá</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {dishes.map((dish) => (
              <tr key={dish.id} className="border-t">
                <td className="px-4 py-3">{dish.name}</td>
                <td className="px-4 py-3">{dish.category}</td>
                <td className="px-4 py-3 text-right">{formatVND(dish.price)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" onClick={() => openEdit(dish)}>Chỉnh sửa</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DishFormModal isOpen={isModalOpen} onClose={closeModal} initialData={selectedDish} onSubmit={handleSubmit} />
    </div>
  );
}
