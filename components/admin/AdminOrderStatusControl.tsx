"use client";

import { useMemo, useState } from "react";

const STATUS_OPTIONS = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;

type StatusValue = (typeof STATUS_OPTIONS)[number];

type AdminOrderStatusControlProps = {
  orderId: string;
  initialStatus: string;
};

const isStatusValue = (value: string): value is StatusValue =>
  STATUS_OPTIONS.includes(value as StatusValue);

const statusTone: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-rose-100 text-rose-700",
};

export default function AdminOrderStatusControl({ orderId, initialStatus }: AdminOrderStatusControlProps) {
  const normalized = initialStatus.toLowerCase();
  const [status, setStatus] = useState<StatusValue>(isStatusValue(normalized) ? normalized : "pending");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const badgeClass = useMemo(() => statusTone[status] || "bg-slate-100 text-slate-600", [status]);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || "Failed to update order status.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update order status.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>{status}</span>
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as StatusValue)}
          className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-md bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:bg-slate-300"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
    </div>
  );
}
