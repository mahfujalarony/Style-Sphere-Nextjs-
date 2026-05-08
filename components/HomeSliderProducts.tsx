"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import ProductCard from "./ProductCard";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";

type SliderProduct = {
  _id?: string;
  title: string;
  image: string;
  originalPrice: number;
  discountPrice?: number;
  discountTag?: string;
};



const HomeSliderProducts = () => {
  const [products, setProducts] = useState<SliderProduct[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch("/api/client/products");
        if (!response.ok) {
          throw new Error("Failed to load products");
        }
        const data = (await response.json()) as { products?: SliderProduct[] };
        setProducts(data.products ?? []);
      } catch (error) {
        setProducts([]);
      }
    };

    loadProducts();
  }, []);

  const sliderProducts = products;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={20}
        slidesPerView={1.5} 
        loop={true}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          // responsive breakpoints
          640: { slidesPerView: 2.5 },
          1024: { slidesPerView: 4 },
        }}
        className="pb-12"
      >
        {sliderProducts.map((product, index) => (
          <SwiperSlide key={product._id ?? index}>
            {product._id ? (
              <Link href={`/products/${product._id}`} className="block">
                <ProductCard
                  image={product.image}
                  title={product.title}
                  originalPrice={product.originalPrice}
                  discountPrice={product.discountPrice || 0}
                  discountTag={product.discountTag || ""}
                />
              </Link>
            ) : (
              <ProductCard
                image={product.image}
                title={product.title}
                originalPrice={product.originalPrice}
                discountPrice={product.discountPrice || 0}
                discountTag={product.discountTag || ""}
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeSliderProducts;
