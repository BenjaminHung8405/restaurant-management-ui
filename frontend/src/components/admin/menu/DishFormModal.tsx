"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "../../common/Modal";
import Input from "../../common/Input";
import Button from "../../common/Button";
import { useEffect } from "react";

// Strict Dish interface
export interface Dish {
  id?: string;
  name: string;
  price: number;
  category: string;
}

// Form schema
const dishSchema = z.object({
  name: z.string().min(1, { message: "Tên món không được để trống" }),
  price: z
    .number({ invalid_type_error: "Giá phải là số" })
    .min(0, { message: "Giá không được âm" }),
  category: z.string().min(1, { message: "Danh mục không được để trống" }),
});

export type DishFormValues = z.infer<typeof dishSchema>;

interface DishFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Dish;
  onSubmit: (data: DishFormValues) => void;
}

export default function DishFormModal({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}: DishFormModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<DishFormValues>({
    resolver: zodResolver(dishSchema),
    defaultValues: {
      name: initialData?.name || "",
      price: initialData?.price || 0,
      category: initialData?.category || "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        price: initialData.price,
        category: initialData.category,
      });
    } else {
      reset({ name: "", price: 0, category: "" });
    }
  }, [initialData, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Chỉnh sửa món ăn" : "Thêm món ăn mới"}>
      <form
        className="flex flex-col gap-4 pt-2"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <Input
          label="Tên món ăn"
          {...register("name")}
          error={errors.name?.message}
          required
        />
        <Input
          label="Giá"
          type="number"
          step="0.01"
          min={0}
          {...register("price", { valueAsNumber: true })}
          error={errors.price?.message}
          required
        />
        <Input
          label="Danh mục"
          {...register("category")}
          error={errors.category?.message}
          required
        />
        <div className="flex gap-2 justify-end mt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" variant="primary">
            {initialData ? "Lưu thay đổi" : "Thêm món"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
