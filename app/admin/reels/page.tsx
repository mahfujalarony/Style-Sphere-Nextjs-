"use client";

import React, { useEffect, useState } from "react";

type ProductOption = {
  _id: string;
  title: string;
  images?: string[];
  discountPrice?: number;
};

const Page = () => {
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
  const [progressMode, setProgressMode] = useState<"determinate" | "indeterminate">("determinate");
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Ready to upload");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch("/api/admin/products");
        if (!response.ok) {
          throw new Error("Failed to load products");
        }
        const data = (await response.json()) as { products?: ProductOption[] };
        setProducts(data.products ?? []);
      } catch (error) {
        setProducts([]);
      }
    };

    loadProducts();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setMessageType("info");
    setProgressMode("determinate");
    setProgress(0);
    setStatusText("Preparing upload...");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      await uploadReel(formData, {
        onProgress: (percent) => {
          setProgressMode("determinate");
          setProgress(percent);
          setStatusText(`Uploading video ${percent}%`);
        },
        onWaiting: () => {
          setProgressMode("indeterminate");
          setStatusText("Still uploading. Large videos can take a little longer...");
        },
        onProcessing: () => {
          setProgressMode("indeterminate");
          setProgress(100);
          setStatusText("Processing video and saving reel...");
        },
      });

      form.reset();
      setProgressMode("determinate");
      setProgress(100);
      setStatusText("Upload complete");
      setMessageType("success");
      setMessage("Reel created successfully.");
    } catch (error) {
      const messageText = error instanceof Error ? error.message : "Something went wrong";
      setMessageType("error");
      setStatusText("Upload failed");
      setMessage(messageText);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ecfeff,#ffffff_55%,#fef3c7_100%)]">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Admin / Reels</p>
            <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Create Reel</h1>
            <p className="mt-2 text-sm text-slate-600">Upload a reel and attach it to a product.</p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5">
            <label className="text-sm font-medium text-slate-700">
              Product
              <select
                name="productRef"
                required
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-slate-400"
                defaultValue=""
              >
                <option value="" disabled>
                  Select product
                </option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.title}
                    {typeof product.discountPrice === "number" ? ` - Tk ${product.discountPrice}` : ""}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-slate-700">
              Reel Video
              <input
                name="video"
                type="file"
                accept="video/*"
                required
                className="mt-2 w-full rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Uploading..." : "Create Reel"}
            </button>

            {(isSubmitting || progress > 0) && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
                  <span>{statusText}</span>
                  <span>{progressMode === "determinate" ? `${progress}%` : "Working"}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  {progressMode === "indeterminate" ? (
                    <div className="h-full w-full animate-pulse rounded-full bg-slate-950/70" />
                  ) : (
                    <div
                      className="h-full rounded-full bg-slate-950 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </div>
              </div>
            )}

            {message && (
              <div
                className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                  messageType === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : messageType === "error"
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-slate-200 bg-slate-50 text-slate-700"
                }`}
              >
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Page;

function uploadReel(
  formData: FormData,
  callbacks: {
    onProgress: (percent: number) => void;
    onWaiting: () => void;
    onProcessing: () => void;
  }
) {
  return new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest();
    let lastProgressAt = Date.now();
    let waitingShown = false;
    const waitingTimer = window.setInterval(() => {
      if (request.readyState === XMLHttpRequest.DONE) {
        window.clearInterval(waitingTimer);
        return;
      }

      if (!waitingShown && Date.now() - lastProgressAt > 3500) {
        waitingShown = true;
        callbacks.onWaiting();
      }
    }, 1000);

    request.open("POST", "/api/admin/reels");
    request.timeout = 5 * 60 * 1000;

    request.upload.onprogress = (event) => {
      if (!event.lengthComputable) {
        return;
      }

      lastProgressAt = Date.now();
      waitingShown = false;
      const percent = Math.min(100, Math.round((event.loaded / event.total) * 100));
      callbacks.onProgress(percent);
    };

    request.upload.onload = () => {
      callbacks.onProcessing();
    };

    request.onload = () => {
      window.clearInterval(waitingTimer);
      let data: { message?: string } = {};

      try {
        data = JSON.parse(request.responseText || "{}") as { message?: string };
      } catch (error) {
        data = {};
      }

      if (request.status >= 200 && request.status < 300) {
        resolve();
        return;
      }

      reject(new Error(data.message || "Failed to create reel"));
    };

    request.onerror = () => {
      window.clearInterval(waitingTimer);
      reject(new Error("Network error while uploading reel"));
    };
    request.ontimeout = () => {
      window.clearInterval(waitingTimer);
      reject(new Error("Upload timed out. Please try a smaller video or check your internet."));
    };

    request.send(formData);
  });
}
