"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

type ReelProduct = {
  _id: string;
  title: string;
  images?: string[];
  discountPrice?: number;
};

type ReelItem = {
  _id: string;
  video: string;
  productRef?: ReelProduct | string;
};

const Reels = () => {
  const [reels, setReels] = useState<ReelItem[]>([]);
  const [activeReelId, setActiveReelId] = useState<string | null>(null);
  const videoRefs = useRef(new Map<string, HTMLVideoElement | null>());

  useEffect(() => {
    const loadReels = async () => {
      try {
        const response = await fetch("/api/client/reels");
        if (!response.ok) {
          throw new Error("Failed to load reels");
        }
        const data = (await response.json()) as { reels?: ReelItem[] };
        setReels(data.reels ?? []);
      } catch (error) {
        setReels([]);
      }
    };

    loadReels();
  }, []);

  if (reels.length === 0) {
    return null;
  }

  const getPosterUrl = (videoUrl: string) => {
    if (videoUrl.includes("/video/upload/") && videoUrl.includes("res.cloudinary.com")) {
      return videoUrl.replace("/video/upload/", "/video/upload/so_0,fl_thumbnail/");
    }
    return undefined;
  };

  const playReel = async (reelId: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    videoRefs.current.forEach((video, id) => {
      if (id !== reelId && video && !video.paused) {
        video.pause();
      }
    });

    const video = videoRefs.current.get(reelId);
    if (video) {
      try {
        await video.play();
        setActiveReelId(reelId);
      } catch (error) {
        // Ignore autoplay restrictions; user can retry.
      }
    }
  };

  const handleCardClick = (reelId: string, event: React.MouseEvent) => {
    const video = videoRefs.current.get(reelId);
    if (!video || !video.paused || activeReelId === reelId) {
      return;
    }

    playReel(reelId, event);
  };

  const renderCard = (reel: ReelItem) => {
    const product = typeof reel.productRef === "object" ? reel.productRef : null;
    const href = product?._id ? `/products/${product._id}` : "#";

    return (
      <Link
        href={href}
        scroll={false}
        onClick={(event) => handleCardClick(reel._id, event)}
        className="group block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
      >
        <div className="relative aspect-[9/16] overflow-hidden bg-slate-100">
          <video
            src={reel.video}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            poster={getPosterUrl(reel.video)}
            ref={(element) => {
              videoRefs.current.set(reel._id, element);
            }}
            onPlay={() => setActiveReelId(reel._id)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          {activeReelId !== reel._id && (
            <button
              type="button"
              onClick={(event) => playReel(reel._id, event)}
              className="absolute left-1/2 top-1/2 inline-flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/40 text-white transition hover:bg-black/55"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                <path d="M8 5.5v13l11-6.5-11-6.5z" />
              </svg>
            </button>
          )}
        </div>
        {product && (
          <div className="p-3">
            <p className="line-clamp-1 text-sm font-medium text-slate-900">{product.title}</p>
            {typeof product.discountPrice === "number" && (
              <p className="mt-1 text-sm font-semibold text-slate-950">Tk {product.discountPrice}</p>
            )}
          </div>
        )}
      </Link>
    );
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Shop Reels</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950">Watch and shop</h2>
        </div>
      </div>

      <Swiper
        modules={[Autoplay, EffectCoverflow, Pagination]}
        effect="coverflow"
        grabCursor
        centeredSlides
        loop={reels.length > 2}
        slidesPerView={1.25}
        spaceBetween={18}
        autoplay={
          reels.length > 2
            ? {
                delay: 5000,
                disableOnInteraction: false,
              }
            : undefined
        }
        pagination={{ clickable: true }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 180,
          modifier: 1,
          slideShadows: false,
        }}
        breakpoints={{
          640: { slidesPerView: 1.8, spaceBetween: 22 },
          900: { slidesPerView: 2.6, spaceBetween: 24 },
          1200: { slidesPerView: 3.2, spaceBetween: 28 },
        }}
        className="pb-10"
      >
        {reels.map((reel) => (
          <SwiperSlide key={reel._id}>{renderCard(reel)}</SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Reels;
