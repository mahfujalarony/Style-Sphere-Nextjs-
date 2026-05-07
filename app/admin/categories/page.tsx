"use client";

import React, { useEffect, useState } from "react";

type CategoryItem = {
  _id: string;
  name: string;
  slug: string;
  group: "inStore" | "luxury" | "nav";
  order?: number;
};

const CategoriesPage = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    name: "",
    group: "nav" as CategoryItem["group"],
    order: 0,
  });

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      if (!response.ok) {
        throw new Error("Failed to load categories");
      }
      const data = (await response.json()) as { categories?: CategoryItem[] };
      setCategories(data.categories ?? []);
    } catch (error) {
      setCategories([]);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const payload = {
      name: formState.name,
      group: formState.group,
      order: formState.order,
    };

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create category");
      }

      setFormState({
        name: "",
        group: "nav",
        order: 0,
      });
      setMessage("Category created successfully.");
      await loadCategories();
    } catch (error) {
      const messageText = error instanceof Error ? error.message : "Something went wrong";
      setMessage(messageText);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete category");
      }
      await loadCategories();
    } catch (error) {
      const messageText = error instanceof Error ? error.message : "Something went wrong";
      setMessage(messageText);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ecfeff,#ffffff_55%,#fef3c7_100%)]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Admin / Categories</p>
            <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Manage Categories</h1>
            <p className="mt-2 text-sm text-slate-600">Add and organize navigation categories.</p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5">
            <label className="text-sm font-medium text-slate-700">
              Name
              <input
                name="name"
                required
                value={formState.name}
                onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Category name"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-slate-400"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                Group
                <select
                  name="group"
                  value={formState.group}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, group: event.target.value as CategoryItem["group"] }))
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-slate-400"
                >
                  <option value="nav">Nav</option>
                  <option value="inStore">In Store</option>
                  <option value="luxury">Luxury</option>
                </select>
              </label>

              <label className="text-sm font-medium text-slate-700">
                Order
                <input
                  name="order"
                  type="number"
                  value={formState.order}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, order: Number(event.target.value) }))
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-slate-400"
                />
              </label>
            </div>


            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Add Category"}
            </button>

            {message && <p className="text-sm font-medium text-slate-600">{message}</p>}
          </form>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Existing Categories</h2>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{categories.length} items</span>
          </div>

          <div className="grid gap-3">
            {categories.map((item) => (
              <div
                key={item._id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">/{item.slug} • {item.group}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Order: {item.order ?? 0}</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(item._id)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
