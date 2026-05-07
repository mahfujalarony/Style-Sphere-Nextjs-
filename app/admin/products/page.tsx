"use client";

import React, { useEffect, useMemo, useState } from "react";

type CategoryOption = {
  _id: string;
  name: string;
};

const page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const colorOptions = useMemo(
    () => ["black", "white", "beige", "nude", "brown", "gold", "silver", "red", "blue", "green", "pink"],
    []
  );

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch("/api/admin/categories");
        if (!response.ok) {
          throw new Error("Failed to load categories");
        }
        const data = (await response.json()) as { categories?: CategoryOption[] };
        setCategories(data.categories ?? []);
      } catch (error) {
        setCategories([]);
      }
    };

    loadCategories();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create product");
      }

      form.reset();
      setSelectedColors([]);
      setMessage("Product created successfully.");
    } catch (error) {
      const messageText = error instanceof Error ? error.message : "Something went wrong";
      setMessage(messageText);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fff7ed,#ffffff_55%,#e0f2fe_100%)]">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Admin / Products</p>
            <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Create Product</h1>
            <p className="mt-2 text-sm text-slate-600">Upload images to Cloudinary and save the product.</p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                Title
                <input
                  name="title"
                  required
                  placeholder="Product title"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-slate-400"
                />
              </label>

              <label className="text-sm font-medium text-slate-700">
                Discount Tag
                <input
                  name="discountTag"
                  placeholder="Optional discount tag"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-slate-400"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                Category
                <select
                  name="categoryId"
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-slate-400"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="text-sm font-medium text-slate-700">
                Colors
                <input type="hidden" name="colors" value={selectedColors.join(", ")} />
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {colorOptions.map((color) => (
                    <label
                      key={color}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600"
                    >
                      <input
                        type="checkbox"
                        checked={selectedColors.includes(color)}
                        onChange={() =>
                          setSelectedColors((prev) =>
                            prev.includes(color) ? prev.filter((item) => item !== color) : [...prev, color]
                          )
                        }
                        className="h-4 w-4 rounded border-slate-300"
                      />
                      {color}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <label className="text-sm font-medium text-slate-700">
              Sizes
              <input
                name="sizes"
                placeholder="e.g. 35, 36, 37"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-slate-400"
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Description
              <textarea
                name="description"
                required
                rows={4}
                placeholder="Product description"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-slate-400"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                Original Price
                <input
                  name="originalPrice"
                  type="number"
                  required
                  min={0}
                  placeholder="21000"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-slate-400"
                />
              </label>

              <label className="text-sm font-medium text-slate-700">
                Discount Price
                <input
                  name="discountPrice"
                  type="number"
                  required
                  min={0}
                  placeholder="12000"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-slate-400"
                />
              </label>
            </div>

            <label className="text-sm font-medium text-slate-700">
              Product Images
              <input
                name="images"
                type="file"
                accept="image/*"
                multiple
                required
                className="mt-2 w-full rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Create Product"}
            </button>

            {message && (
              <p className="text-sm font-medium text-slate-600">{message}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default page;
