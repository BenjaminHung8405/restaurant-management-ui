"use client";

import { X } from "lucide-react";
import { useState } from "react";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * ReservationModal — Table reservation form component
 * Allows users to book a table with date, time, party size, and special notes.
 */
export default function ReservationModal({
  isOpen,
  onClose,
}: ReservationModalProps) {
  // ── Get today's date in YYYY-MM-DD format ────────────────────────────────
  const getTodayDate = (): string => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // ── Local state ──────────────────────────────────────────────────────────
  const [date, setDate] = useState<string>(getTodayDate());
  const [time, setTime] = useState<string>("18:00");
  const [partySize, setPartySize] = useState<number>(4);
  const [notes, setNotes] = useState<string>("");

  // ── Generate time options (30-minute intervals from 10:00 to 22:00) ──────
  const generateTimeOptions = (): string[] => {
    const options: string[] = [];
    for (let hour = 10; hour <= 22; hour++) {
      for (let minute of [0, 30]) {
        const timeStr = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
        options.push(timeStr);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  // ── Handle party size increment/decrement ───────────────────────────────
  const handlePartySizeIncrement = (): void => {
    setPartySize((prev) => prev + 1);
  };

  const handlePartySizeDecrement = (): void => {
    if (partySize > 1) {
      setPartySize((prev) => prev - 1);
    }
  };

  // ── Handle confirm ──────────────────────────────────────────────────────
  const handleConfirm = (): void => {
    console.log({
      date,
      time,
      partySize,
      notes,
    });
    onClose();
  };

  // ── Return null if modal is not open ────────────────────────────────────
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal Box */}
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Đặt bàn trước</h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex flex-col gap-5 p-6">
          {/* Date & Time Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Date Input */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Ngày
              </label>
              <input
                type="date"
                min={getTodayDate()}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Time Select */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Giờ
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              >
                {timeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Party Size */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-3">
              Số lượng khách
            </label>
            <div className="bg-gray-100 rounded-full w-fit px-2 py-1.5 flex items-center gap-3">
              <button
                onClick={handlePartySizeDecrement}
                className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
              >
                −
              </button>
              <span className="w-8 text-center font-semibold text-gray-900">
                {partySize}
              </span>
              <button
                onClick={handlePartySizeIncrement}
                className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
              >
                +
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Yêu cầu đặc biệt
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ghế trẻ em, sinh nhật, dị ứng..."
              className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            style={{
              backgroundColor: "#f97316",
              color: "#ffffff",
            }}
            className="px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-sm"
          >
            Xác nhận đặt bàn
          </button>
        </div>
      </div>
    </div>
  );
}
