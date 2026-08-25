"use client";

import { type ReactNode } from "react";
import { IconX } from "@/components/ui";

export function Spinner({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`animate-spin ${className}`}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function AdminModal({
  title,
  onClose,
  children,
  maxW = "max-w-2xl",
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  maxW?: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-ink/60 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`animate-rise mx-auto my-6 w-full ${maxW} rounded-xl bg-paper shadow-2xl`}>
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
          <h3 className="text-lg font-extrabold">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="grid h-8.5 w-8.5 place-items-center rounded-lg text-ink/50 transition hover:bg-ink/5 hover:text-ink"
          >
            <IconX className="h-4.5 w-4.5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function Toggle({
  on,
  onChange,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
        on ? "bg-mint-600" : "bg-ink/20"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-200 ${
          on ? "right-0.5" : "right-[22px]"
        }`}
      />
    </button>
  );
}

export function SaveNote({ msg }: { msg: string }) {
  if (!msg) return null;
  return (
    <p className="animate-rise mt-2.5 text-xs font-extrabold text-mint-600">{msg}</p>
  );
}
