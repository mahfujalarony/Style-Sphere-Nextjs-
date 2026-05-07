"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
type ExploreProduct = {
  _id: string;
  title: string;
  image: string;
  originalPrice: number;
  discountPrice: number;
  discountTag?: string;
};

const PAGE_SIZE = 12;
const FEATURE_INTERVAL = 5;

const ExploreMore = () => {
  const [products, setProducts] = useState<ExploreProduct[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch("/api/client/products");
        if (!response.ok) {
          throw new Error("Failed to load products");
        }
        const data = (await response.json()) as { products?: ExploreProduct[] };
        setProducts(data.products ?? []);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Something went wrong";
        setError(message);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) {
          return;
        }
        if (visibleCount >= products.length || isLoadingMore) {
          return;
        }

        setIsLoadingMore(true);
        window.setTimeout(() => {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, products.length));
          setIsLoadingMore(false);
        }, 400);
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [isLoadingMore, products.length, visibleCount]);

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-12">
        <p className="text-sm font-medium text-red-600">{error}</p>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  const visibleProducts = products.slice(0, visibleCount);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Explore More</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950">More to love</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {visibleProducts.map((product, index) => {
          const isFeatured = (index + 1) % FEATURE_INTERVAL === 0;
          const wrapperClass = isFeatured
            ? "block sm:col-span-2 lg:col-span-2"
            : "block";

          return (
            <Link key={product._id} href={`/products/${product._id}`} className={wrapperClass}>
              <ProductCard
                image={product.image}
                title={product.title}
                originalPrice={product.originalPrice}
                discountPrice={product.discountPrice}
                discountTag={product.discountTag}
              />
            </Link>
          );
        })}
      </div>

      <div ref={sentinelRef} className="flex justify-center py-8">
        {visibleCount < products.length ? (
          <span className="text-sm font-medium text-slate-500">
            {isLoadingMore ? "Loading more..." : "Scroll to load more"}
          </span>
        ) : (
          <span className="text-sm font-medium text-slate-400">You are all caught up</span>
        )}
      </div>
    </section>
  );
};

export default ExploreMore;
