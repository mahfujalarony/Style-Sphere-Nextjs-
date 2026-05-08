"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import { ShoppingCartIcon } from "lucide-react";

type ProductOrderPanelProps = {
  productId: string;
  colors: string[];
  sizes: string[];
  sizeGuide?: string;
};

const buildOrderUrl = (productId: string, color: string | null, size: string | null, quantity: number) => {
  const params = new URLSearchParams();
  params.set("productId", productId);
  if (color) params.set("color", color);
  if (size) params.set("size", size);
  params.set("qty", String(quantity));
  return `/order?${params.toString()}`;
};

export default function ProductOrderPanel({ productId, colors, sizes, sizeGuide }: ProductOrderPanelProps) {
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const requiresColor = colors.length > 0;
  const requiresSize = sizes.length > 0;

  const isSelectionValid = useMemo(() => {
    if (requiresColor && !selectedColor) return false;
    if (requiresSize && !selectedSize) return false;
    return quantity >= 1;
  }, [requiresColor, requiresSize, selectedColor, selectedSize, quantity]);

  const handleBuyNow = () => {
    if (!isSelectionValid) return;
    const url = buildOrderUrl(productId, selectedColor, selectedSize, quantity);
    router.push(url);
  };

  return (
    <div className="mt-6 grid gap-5">
      {(requiresColor || requiresSize) && (
        <div className="grid gap-4 border-y border-slate-200 py-5">
          {requiresColor && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Colors</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {colors.map((color) => {
                  const isActive = selectedColor === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      aria-pressed={isActive}
                      className={`rounded-full border px-3 py-1 text-sm transition ${
                        isActive
                          ? "border-slate-950 bg-slate-950 text-white"
                          : "border-slate-200 text-slate-700 hover:border-slate-400"
                      }`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {requiresSize && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Sizes</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const isActive = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      aria-pressed={isActive}
                      className={`min-w-10 rounded-md border px-3 py-1 text-center text-sm transition ${
                        isActive
                          ? "border-slate-950 bg-slate-950 text-white"
                          : "border-slate-200 text-slate-700 hover:border-slate-400"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              {sizeGuide ? (
                <p className="mt-3 text-xs text-slate-500">{sizeGuide}</p>
              ) : null}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500" htmlFor="qty">
          Qty
        </label>
        <input
          id="qty"
          type="number"
          min={1}
          value={quantity}
          onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
          className="w-20 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none"
        />
      </div>



      <Button
        startIcon={<ShoppingCartIcon />}
        variant="contained"
        className="w-full sm:w-auto"
        disabled={!isSelectionValid}
        onClick={handleBuyNow}
      >
        Buy Now
      </Button>
    </div>
  );
}
