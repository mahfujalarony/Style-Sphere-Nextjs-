"use client";

import { useState } from "react";

type ProductDetailsGalleryProps = {
  images: string[];
  title: string;
};

export default function ProductDetailsGallery({ images, title }: ProductDetailsGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

  return (
    <div className="grid gap-3">
      <div className="overflow-hidden rounded-2xl bg-slate-100">
        {activeImage ? (
          <img
            src={activeImage}
            alt={title}
            className="h-auto max-h-[62vh] min-h-[320px] w-full object-contain sm:max-h-[68vh] lg:max-h-[calc(100vh-160px)]"
          />
        ) : (
          <div className="flex min-h-[320px] w-full items-center justify-center text-sm text-slate-400">
            No image available
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 sm:gap-3">
          {images.slice(0, 6).map((image, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`overflow-hidden rounded-xl border bg-slate-100 transition ${
                  isActive ? "border-slate-950 ring-2 ring-slate-950/10" : "border-slate-200 hover:border-slate-400"
                }`}
                aria-label={`View ${title} image ${index + 1}`}
              >
                <img src={image} alt={title} className="aspect-square w-full object-cover" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
