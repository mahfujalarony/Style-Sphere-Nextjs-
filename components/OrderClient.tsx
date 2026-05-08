"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";

type OrderClientProps = {
  productId: string;
  productTitle: string;
  productImage: string;
  unitPrice: number;
  originalPrice: number;
  quantity: number;
  color: string | null;
  size: string | null;
  phonePrefill?: string | null;
};

type OrderStatus = "idle" | "submitting" | "success" | "error";

const STORAGE_KEY = "style-sphere-orders";

type StoredOrder = {
  id: string;
  phone: string;
  productTitle: string;
  productImage: string;
  quantity: number;
  color: string | null;
  size: string | null;
  total: number;
  createdAt: string;
};

const rememberOrder = (order: StoredOrder) => {
  const save = (storage: Storage) => {
    const existing = JSON.parse(storage.getItem(STORAGE_KEY) || "[]") as StoredOrder[];
    const next = [order, ...existing.filter((item) => item.id !== order.id)].slice(0, 20);
    storage.setItem(STORAGE_KEY, JSON.stringify(next));
    storage.setItem("style-sphere-last-phone", order.phone);
  };

  try {
    save(window.localStorage);
    save(window.sessionStorage);
  } catch {
    // Storage can be blocked in private mode; the redirect still carries the order id.
  }
};

export default function OrderClient({
  productId,
  productTitle,
  productImage,
  unitPrice,
  originalPrice,
  quantity,
  color,
  size,
  phonePrefill = null,
}: OrderClientProps) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    name: "",
    phone: phonePrefill ?? "",
    address: "",
    note: "",
  });

  const total = unitPrice * quantity;

  const handleChange = (field: keyof typeof formState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.name || !formState.phone || !formState.address) {
      setStatus("error");
      setMessage("Name, phone, and address are required.");
      return;
    }

    setStatus("submitting");
    setMessage(null);

    try {
      const response = await fetch("/api/client/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          color,
          size,
          quantity,
          customerName: formState.name,
          phone: formState.phone,
          address: formState.address,
          note: formState.note,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || "Failed to place order.");
      }

      const payload = (await response.json()) as { orderId: string };
      rememberOrder({
        id: payload.orderId,
        phone: formState.phone,
        productTitle,
        productImage,
        quantity,
        color,
        size,
        total,
        createdAt: new Date().toISOString(),
      });

      setStatus("success");
      setMessage("Order placed successfully. Redirecting to tracking...");
      router.replace(`/my-order?orderId=${encodeURIComponent(payload.orderId)}&phone=${encodeURIComponent(formState.phone)}`);
    } catch (error) {
      const fallback = error instanceof Error ? error.message : "Failed to place order.";
      setStatus("error");
      setMessage(fallback);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-slate-100 sm:h-32 sm:w-28">
            {productImage ? (
              <Image src={productImage} alt={productTitle} fill sizes="(max-width: 640px) 100vw, 112px" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">No image</div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Order Summary</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">{productTitle}</h2>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
              <span className="rounded-full bg-slate-100 px-3 py-1">Qty: {quantity}</span>
              {color ? <span className="rounded-full bg-slate-100 px-3 py-1">Color: {color}</span> : null}
              {size ? <span className="rounded-full bg-slate-100 px-3 py-1">Size: {size}</span> : null}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="text-lg font-semibold text-slate-900">Tk {unitPrice.toLocaleString()}</span>
              {originalPrice > unitPrice && (
                <span className="text-sm text-slate-400 line-through">Tk {originalPrice.toLocaleString()}</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span>Tk {total.toLocaleString()}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-slate-500">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Shipping Details</p>
        <h3 className="mt-2 text-xl font-semibold text-slate-900">Confirm your order</h3>

        <div className="mt-5 grid gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              value={formState.name}
              onChange={handleChange("name")}
              autoComplete="name"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              value={formState.phone}
              onChange={handleChange("phone")}
              disabled={Boolean(phonePrefill)}
              autoComplete="tel"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none disabled:bg-slate-100 disabled:text-slate-500"
              placeholder="01XXXXXXXXX"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="address">
              Address
            </label>
            <textarea
              id="address"
              value={formState.address}
              onChange={handleChange("address")}
              rows={3}
              autoComplete="street-address"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none"
              placeholder="House, road, area"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="note">
              Note (optional)
            </label>
            <textarea
              id="note"
              value={formState.note}
              onChange={handleChange("note")}
              rows={2}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none"
              placeholder="Delivery instructions"
            />
          </div>
        </div>

        {message && (
          <div
            className={`mt-4 rounded-xl px-4 py-3 text-sm ${
              status === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
            }`}
          >
            {message}
          </div>
        )}

        <Button
          type="submit"
          variant="contained"
          className="mt-6 w-full"
          disabled={status === "submitting" || status === "success"}
        >
          {status === "submitting" || status === "success" ? "Processing..." : "Place Order"}
        </Button>
      </form>
    </div>
  );
}
