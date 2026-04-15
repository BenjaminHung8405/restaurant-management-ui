"use client";

import axiosClient from "@/lib/axiosClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OPENING_HOUR = 10;
const CLOSING_HOUR = 22;
const TIME_STEP_MINUTES = 30;
const DATE_DISPLAY_FORMATTER = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const toTimeString = (minutes: number): string => {
  const safeMinutes = Math.max(0, minutes);
  const hours = Math.floor(safeMinutes / 60);
  const mins = safeMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

const toMinutes = (time: string): number => {
  const [hours = "0", minutes = "0"] = time.split(":");
  return Number(hours) * 60 + Number(minutes);
};

const roundUpToStep = (value: number, step: number): number => {
  return Math.ceil(value / step) * step;
};

const isValidISODate = (value: string): boolean => {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
};

const formatISODateToDisplay = (value: string): string => {
  if (!isValidISODate(value)) {
    return "";
  }

  const [yearText, monthText, dayText] = value.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day));

  return DATE_DISPLAY_FORMATTER.format(date);
};

const parseDisplayDateToISO = (value: string): string | null => {
  const normalizedValue = value.trim();
  const match = normalizedValue.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (!match) {
    return null;
  }

  const [, dayText, monthText, yearText] = match;
  const day = Number(dayText);
  const month = Number(monthText);
  const year = Number(yearText);
  const date = new Date(Date.UTC(year, month - 1, day));

  const isRealDate =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() + 1 === month &&
    date.getUTCDate() === day;

  if (!isRealDate) {
    return null;
  }

  return `${yearText}-${monthText}-${dayText}`;
};

const generateTimeSlots = (startMinutes: number, endMinutes: number): string[] => {
  const result: string[] = [];
  for (let value = startMinutes; value <= endMinutes; value += TIME_STEP_MINUTES) {
    result.push(toTimeString(value));
  }
  return result;
};

const createReservationSchema = (today: string) =>
  z.object({
    guest_name: z.string().trim().min(2, "Vui lòng nhập tối thiểu 2 ký tự."),
    guest_phone: z
      .string()
      .trim()
      .regex(/^(0\d{9,10}|84\d{9,10})$/, "Số điện thoại chưa hợp lệ."),
    reservation_date: z
      .string()
      .min(1, "Vui lòng chọn ngày đặt bàn.")
      .refine((value) => value >= today, "Ngày đặt bàn không hợp lệ."),
    reservation_time: z.string().min(1, "Vui lòng chọn giờ đặt bàn."),
    party_size: z
      .number()
      .refine((value) => Number.isFinite(value), "Số lượng khách không hợp lệ.")
      .int("Số lượng khách phải là số nguyên.")
      .min(1, "Số lượng khách tối thiểu là 1."),
    notes: z.string().max(300, "Ghi chú tối đa 300 ký tự.").optional(),
  });

type ReservationFormValues = z.infer<ReturnType<typeof createReservationSchema>>;

const defaultFormValues = (today: string): ReservationFormValues => ({
  guest_name: "",
  guest_phone: "",
  reservation_date: today,
  reservation_time: "",
  party_size: 2,
  notes: "",
});

const extractErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object") {
    const errorObject = error as {
      message?: string;
      data?: {
        message?: string;
        error?: string;
      };
    };

    if (errorObject.data?.message) {
      return errorObject.data.message;
    }

    if (errorObject.data?.error) {
      return errorObject.data.error;
    }

    if (errorObject.message) {
      return errorObject.message;
    }
  }

  return "Không thể đặt bàn lúc này. Vui lòng thử lại sau ít phút.";
};

export default function ReservationModal({
  isOpen,
  onClose,
}: ReservationModalProps) {
  const today = useMemo(() => getTodayDate(), []);
  const reservationSchema = useMemo(() => createReservationSchema(today), [today]);

  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [reservationDateDisplay, setReservationDateDisplay] = useState<string>(
    formatISODateToDisplay(today),
  );

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    mode: "onChange",
    defaultValues: defaultFormValues(today),
  });

  const notesValue = watch("notes") ?? "";
  const selectedDate = watch("reservation_date");
  const selectedTime = watch("reservation_time");

  const isTodaySelected = selectedDate === today;
  const openMinutes = OPENING_HOUR * 60;
  const closeMinutes = CLOSING_HOUR * 60;

  const minTime = useMemo(() => {
    if (!isTodaySelected) {
      return toTimeString(openMinutes);
    }

    const now = new Date();
    const roundedNow = roundUpToStep(now.getHours() * 60 + now.getMinutes(), TIME_STEP_MINUTES);
    return toTimeString(Math.max(openMinutes, roundedNow));
  }, [isTodaySelected, openMinutes]);

  const quickTimeSlots = useMemo(() => {
    const start = isTodaySelected ? Math.max(openMinutes, toMinutes(minTime)) : openMinutes;
    if (start > closeMinutes) {
      return [];
    }
    return generateTimeSlots(start, closeMinutes);
  }, [closeMinutes, isTodaySelected, minTime, openMinutes]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    reset(defaultFormValues(today));
    setIsSuccess(false);
    setSubmitError("");
    setReservationDateDisplay(formatISODateToDisplay(today));

    const timeoutId = window.setTimeout(() => {
      setFocus("guest_name");
    }, 30);

    return () => window.clearTimeout(timeoutId);
  }, [isOpen, reset, setFocus, today]);

  useEffect(() => {
    if (!isOpen || !selectedDate) {
      return;
    }

    setReservationDateDisplay(formatISODateToDisplay(selectedDate));
  }, [isOpen, selectedDate]);

  useEffect(() => {
    if (quickTimeSlots.length === 0) {
      setValue("reservation_time", "", {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      return;
    }

    if (selectedTime && !quickTimeSlots.includes(selectedTime)) {
      setValue("reservation_time", "", {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [quickTimeSlots, selectedTime, setValue]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, isSubmitting, onClose]);

  const handleClose = (): void => {
    if (isSubmitting) {
      return;
    }
    onClose();
  };

  const handleReservationDateBlur = (): void => {
    const parsedDate = parseDisplayDateToISO(reservationDateDisplay);

    if (parsedDate) {
      setValue("reservation_date", parsedDate, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setReservationDateDisplay(formatISODateToDisplay(parsedDate));
      return;
    }

    setValue("reservation_date", "", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onSubmit = async (values: ReservationFormValues): Promise<void> => {
    try {
      setSubmitError("");

      await axiosClient.post("/storefront/reservations", {
        ...values,
        guest_phone: values.guest_phone.replace(/\D/g, ""),
        notes: values.notes ?? "",
      });

      setIsSuccess(true);
    } catch (error) {
      const message = extractErrorMessage(error);
      setSubmitError(message);
      console.error("Failed to create reservation:", {
        rawError: error,
        message,
      });
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Đặt bàn nhanh"
    >
      <div
        className="relative max-h-[92dvh] w-full max-w-[800px] overflow-y-auto rounded-xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          disabled={isSubmitting}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors duration-200 hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          aria-label="Đóng"
        >
          <X size={18} />
        </button>

        {isSuccess ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center gap-4 px-6 py-10 text-center sm:px-10">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600"
              aria-hidden="true"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="h-8 w-8"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="text-2xl font-semibold text-neutral-900">Đặt bàn thành công!</h3>
            <p className="max-w-md text-sm leading-6 text-neutral-600">
              Cảm ơn bạn đã đặt bàn. Chúng tôi sẽ liên hệ để xác nhận trong thời gian sớm nhất.
            </p>

            <button
              type="button"
              onClick={handleClose}
              className="mt-2 rounded-lg bg-green-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 cursor-pointer"
            >
              Đóng
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-8 sm:px-10" noValidate>
            <div className="mb-7 text-center">
              <h2 className="text-2xl font-semibold text-neutral-900">Đặt bàn nhanh</h2>
              <p className="mt-2 text-sm text-neutral-600">
                Điền thông tin để giữ chỗ ngay tại nhà hàng.
              </p>
            </div>

            <div className="grid gap-4">
              <div>
                <label htmlFor="guest_name" className="mb-1 block text-sm font-medium text-neutral-700">
                  Họ và tên
                </label>
                <input
                  id="guest_name"
                  type="text"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.guest_name)}
                  aria-describedby={errors.guest_name ? "guest_name_error" : undefined}
                  {...register("guest_name")}
                  placeholder="Tên của bạn"
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                />
                {errors.guest_name ? (
                  <p id="guest_name_error" className="mt-1 text-xs text-red-600">
                    {errors.guest_name.message}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="guest_phone" className="mb-1 block text-sm font-medium text-neutral-700">
                  Số điện thoại
                </label>
                <input
                  id="guest_phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  aria-invalid={Boolean(errors.guest_phone)}
                  aria-describedby={errors.guest_phone ? "guest_phone_error" : "guest_phone_hint"}
                  {...register("guest_phone", {
                    setValueAs: (value: unknown) => String(value ?? "").replace(/\D/g, ""),
                  })}
                  placeholder="Ví dụ: 0901234567"
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                />
                {errors.guest_phone ? (
                  <p id="guest_phone_error" className="mt-1 text-xs text-red-600">
                    {errors.guest_phone.message}
                  </p>
                ) : (
                  <p id="guest_phone_hint" className="mt-1 text-xs text-neutral-500">
                    Hỗ trợ định dạng 0xxxxxxxxx hoặc 84xxxxxxxxx.
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="reservation_date_display" className="mb-1 block text-sm font-medium text-neutral-700">
                    Ngày đặt bàn
                  </label>
                  <input
                    id="reservation_date_display"
                    type="text"
                    inputMode="numeric"
                    placeholder="dd/MM/yyyy"
                    value={reservationDateDisplay}
                    onChange={(event) => setReservationDateDisplay(event.target.value)}
                    onBlur={handleReservationDateBlur}
                    aria-invalid={Boolean(errors.reservation_date)}
                    aria-describedby={errors.reservation_date ? "reservation_date_error" : "reservation_date_hint"}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  />
                  <input type="hidden" {...register("reservation_date")} />
                  {errors.reservation_date ? (
                    <p id="reservation_date_error" className="mt-1 text-xs text-red-600">
                      {errors.reservation_date.message}
                    </p>
                  ) : (
                    <p id="reservation_date_hint" className="mt-1 text-xs text-neutral-500">
                      Nhập theo định dạng dd/MM/yyyy (ví dụ: 09/04/2026).
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="reservation_time" className="mb-1 block text-sm font-medium text-neutral-700">
                    Giờ đặt bàn
                  </label>

                  {quickTimeSlots.length === 0 ? (
                    <p className="mb-2 text-xs text-amber-700">
                      Hôm nay đã hết khung giờ khả dụng. Vui lòng chọn ngày khác.
                    </p>
                  ) : (
                    <p className="mb-2 text-xs text-neutral-500">
                      Chọn khung giờ theo bước 30 phút.
                    </p>
                  )}

                  <select
                    id="reservation_time"
                    disabled={quickTimeSlots.length === 0}
                    aria-invalid={Boolean(errors.reservation_time)}
                    aria-describedby={errors.reservation_time ? "reservation_time_error" : undefined}
                    {...register("reservation_time")}
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:cursor-not-allowed disabled:bg-neutral-100"
                  >
                    <option value="">Chọn giờ đặt bàn</option>
                    {quickTimeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  {errors.reservation_time ? (
                    <p id="reservation_time_error" className="mt-1 text-xs text-red-600">
                      {errors.reservation_time.message}
                    </p>
                  ) : null}
                </div>
              </div>

              <div>
                <label htmlFor="party_size" className="mb-1 block text-sm font-medium text-neutral-700">
                  Số lượng khách
                </label>
                <input
                  id="party_size"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  aria-invalid={Boolean(errors.party_size)}
                  aria-describedby={errors.party_size ? "party_size_error" : undefined}
                  {...register("party_size", {
                    valueAsNumber: true,
                  })}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                />
                {errors.party_size ? (
                  <p id="party_size_error" className="mt-1 text-xs text-red-600">
                    {errors.party_size.message}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="notes" className="mb-1 block text-sm font-medium text-neutral-700">
                  Ghi chú
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  maxLength={300}
                  aria-invalid={Boolean(errors.notes)}
                  aria-describedby={errors.notes ? "notes_error" : undefined}
                  {...register("notes")}
                  placeholder="Yêu cầu thêm (nếu có)"
                  className="w-full resize-none rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                />
                {errors.notes ? (
                  <p id="notes_error" className="mt-1 text-xs text-red-600">
                    {errors.notes.message}
                  </p>
                ) : null}
                <p className="mt-1 text-right text-xs text-neutral-500">{notesValue.length}/300</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white"
                    aria-hidden="true"
                  />
                  Đang gửi...
                </>
              ) : (
                "Xác nhận đặt bàn"
              )}
            </button>

            {submitError ? (
              <p
                className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                role="alert"
                aria-live="polite"
              >
                {submitError}
              </p>
            ) : null}

            <p className="mt-3 text-center text-xs text-neutral-500">
              Mẹo: Nhấn <span className="font-medium">Esc</span> để đóng popup.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

/*
Integration guide:
1. Import: import ReservationModal from "@/components/customer/ReservationModal";
2. Manage state in Navbar/Hero: const [isReservationOpen, setIsReservationOpen] = useState(false);
3. Open from CTA button: onClick={() => setIsReservationOpen(true)}
4. Render modal once: <ReservationModal isOpen={isReservationOpen} onClose={() => setIsReservationOpen(false)} />
*/