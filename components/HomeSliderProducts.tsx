'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import ProductCard from './ProductCard';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const productData = [
  {
    id: 1,
    title: "Tory Burch Mellow T-Strep sandal",
    image: "/products/products_1.jpg", 
    originalPrice: 21000,
    discountPrice: 12000,
    discountTag: "৳9000 OFF"
  },
  {
    id: 2,
    title: "Tory Burch Lnes Slide",
    image: "/products/products_2.jpg",
    originalPrice: 21700,
    discountPrice: 13700,
    discountTag: "৳8000 OFF"
  },
  {
    id: 3,
    title: "Tory Burch Ines Sport Slide",
    image: "/products/products_3.jpg",
    originalPrice: 22700,
    discountPrice: 13700,
    discountTag: "৳9000 OFF"
  },
  {
    id: 4,
    title: "Tory Burch Elwanor Slide",
    image: "/products/products_4.jpg",
    originalPrice: 20000,
    discountPrice: 13000,
    discountTag: "৳7000 OFF"
  },
  {
    id: 5,
    title: "Premium Luxury Slide",
    image: "/products/products_5.jpg",
    originalPrice: 25000,
    discountPrice: 15000,
    discountTag: "৳10000 OFF"
  },
  {
    id: 6,
    title: "Elegant Designer Slide",
    image: "/products/products_6.jpg",
    originalPrice: 23000,
    discountPrice: 14000,
    discountTag: "৳9000 OFF"
  },
  {
    id: 7,
    title: "Stylish Fashion Slide",
    image: "/products/products_7.jpg",
    originalPrice: 22000,
    discountPrice: 13000,
    discountTag: "৳9000 OFF"
  },
  {
    id: 8,
    title: "Chic Luxury Slide",
    image: "/products/products_8.jpg",
    originalPrice: 24000,
    discountPrice: 16000,
    discountTag: "৳8000 OFF"
  },
  {
    id: 9,
    title: "Trendy Luxury Slide",
    image: "/products/products_9.jpg",
    originalPrice: 26000,
    discountPrice: 17000,
    discountTag: "৳9000 OFF"
  },
];

const HomeSliderProducts = () => {
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
        {productData.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard 
              image={product.image}
              title={product.title}
              originalPrice={product.originalPrice}
              discountPrice={product.discountPrice}
              discountTag={product.discountTag}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeSliderProducts;