"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "style-sphere-orders";
const LAST_PHONE_KEY = "style-sphere-last-phone";

type StoredOrder = {
  id: string;
  phone: string;
  productTitle?: string;
  productImage?: string;
  quantity?: number;
  color?: string | null;
  size?: string | null;
  total?: number;
  createdAt?: string;
};

type TrackedOrder = {
  id: string;
  productTitle: string;
  productImage: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
  total: number;
  status: string;
  phone: string;
  customerName: string;
  address: string;
  createdAt: string;
  updatedAt: string;
};

type MyOrderClientProps = {
  initialOrderId?: string | null;
  initialPhone?: string | null;
};

const statusTone: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-100",
  confirmed: "bg-blue-50 text-blue-700 ring-blue-100",
  shipped: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  delivered: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  cancelled: "bg-rose-50 text-rose-700 ring-rose-100",
};

const statusSteps = ["pending", "confirmed", "shipped", "delivered"];

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

const readStoredOrders = () => {
  const read = (storage: Storage) => {
    try {
      return JSON.parse(storage.getItem(STORAGE_KEY) || "[]") as StoredOrder[];
    } catch {
      return [];
    }
  };

  return [...read(window.localStorage), ...read(window.sessionStorage)];
};

const unique = (values: string[]) => Array.from(new Set(values.filter(Boolean)));

export default function MyOrderClient({ initialOrderId = null, initialPhone = null }: MyOrderClientProps) {
  const router = useRouter();
  const [storedOrders, setStoredOrders] = useState<StoredOrder[]>([]);
  const [phone, setPhone] = useState(initialPhone ?? "");
  const [orders, setOrders] = useState<TrackedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const trackedIds = useMemo(
    () => unique([initialOrderId ?? "", ...storedOrders.map((order) => order.id)]),
    [initialOrderId, storedOrders]
  );

  const loadOrders = useCallback(
    async (showLoading = false) => {
      if (trackedIds.length === 0 && !phone.trim()) {
        setOrders([]);
        setIsLoading(false);
        return;
      }

      if (showLoading) setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (trackedIds.length > 0) params.set("ids", trackedIds.join(","));
      if (initialOrderId) params.set("orderId", initialOrderId);
      if (phone.trim()) params.set("phone", phone.trim());

      try {
        const response = await fetch(`/api/client/orders?${params.toString()}`, { cache: "no-store" });
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.message || "Failed to load orders.");
        }

        const payload = (await response.json()) as { orders?: TrackedOrder[] };
        setOrders(payload.orders ?? []);
        setLastUpdated(new Date().toISOString());
      } catch (loadError) {
        const message = loadError instanceof Error ? loadError.message : "Failed to load orders.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [initialOrderId, phone, trackedIds]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedOrders = readStoredOrders();
      const savedPhone = window.localStorage.getItem(LAST_PHONE_KEY) || window.sessionStorage.getItem(LAST_PHONE_KEY);
      setStoredOrders(savedOrders);
      if (!initialPhone && savedPhone) setPhone(savedPhone);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [initialPhone]);

  useEffect(() => {
    const firstLoad = window.setTimeout(() => loadOrders(true), 0);
    const poller = window.setInterval(() => loadOrders(false), 10000);

    return () => {
      window.clearTimeout(firstLoad);
      window.clearInterval(poller);
    };
  }, [loadOrders]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextPhone = phone.trim();
    try {
      if (nextPhone) window.localStorage.setItem(LAST_PHONE_KEY, nextPhone);
    } catch {
      // Ignore storage failures; URL query is enough for this lookup.
    }
    router.replace(nextPhone ? `/my-order?phone=${encodeURIComponent(nextPhone)}` : "/my-order");
    loadOrders(true);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-28 sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Order Tracking</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">Track your orders</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Recent orders from this browser show automatically. You can also search by phone number.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex w-full flex-col gap-2 sm:flex-row lg:max-w-md">
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="min-h-11 flex-1 rounded-xl border border-slate-200 px-4 text-sm text-slate-700 focus:border-slate-400 focus:outline-none"
              placeholder="01XXXXXXXXX"
              autoComplete="tel"
            />
            <button
              type="submit"
              className="min-h-11 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Find
            </button>
          </form>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1">{orders.length} orders</span>
          {lastUpdated ? <span>Updated {formatDate(lastUpdated)}</span> : null}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">Loading orders...</div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-6 text-sm text-rose-700">{error}</div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
            No order found yet. Place an order or search with the phone number used at checkout.
          </div>
        ) : (
          orders.map((order) => {
            const normalizedStatus = order.status.toLowerCase();
            const activeStep = statusSteps.indexOf(normalizedStatus);

            return (
              <article key={order.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="grid gap-4 md:grid-cols-[1fr_0.9fr] lg:grid-cols-[1.3fr_1fr]">
                  <div className="flex gap-4">
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-28 sm:w-24">
                      {order.productImage ? (
                        <Image src={order.productImage} alt={order.productTitle} fill sizes="96px" className="object-cover" />
                      ) : (
                        <div className="h-full w-full bg-slate-100" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Order #{order.id.slice(-6)}</p>
                      <h2 className="mt-1 text-base font-semibold text-slate-950 sm:text-lg">{order.productTitle}</h2>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
                        <span className="rounded-full bg-slate-100 px-3 py-1">Qty: {order.quantity}</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1">Size: {order.size || "Not selected"}</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1">Color: {order.color || "Not selected"}</span>
                      </div>
                      <p className="mt-3 text-sm font-semibold text-slate-900">Tk {order.total.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ${
                          statusTone[normalizedStatus] ?? "bg-slate-100 text-slate-600 ring-slate-200"
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="text-xs text-slate-500">{formatDate(order.createdAt)}</span>
                    </div>

                    {normalizedStatus === "cancelled" ? (
                      <p className="mt-4 text-sm font-semibold text-rose-700">This order has been cancelled.</p>
                    ) : (
                      <div className="mt-4 grid grid-cols-4 gap-2">
                        {statusSteps.map((step, index) => {
                          const isDone = activeStep >= index;
                          return (
                            <div key={step} className="min-w-0">
                              <div className={`h-2 rounded-full ${isDone ? "bg-slate-900" : "bg-slate-200"}`} />
                              <p className={`mt-2 truncate text-[11px] font-semibold capitalize ${isDone ? "text-slate-900" : "text-slate-400"}`}>
                                {step}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="mt-4 text-xs leading-5 text-slate-500">
                      <p>{order.customerName}</p>
                      <p>{order.phone}</p>
                      <p className="line-clamp-2">{order.address}</p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
