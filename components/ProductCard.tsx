'use client';

import React from 'react';
import { Heart } from 'lucide-react';

interface ProductProps {
  image: string;
  title: string;
  originalPrice: number;
  discountPrice: number;
  discountTag?: string;
}

const ProductCard = ({ image, title, originalPrice, discountPrice, discountTag }: ProductProps) => {
  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden group h-full">
      {/* Image Section */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Discount Badge */}
        {discountTag && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md">
            {discountTag}
          </div>
        )}

        {/* Wishlist Icon */}
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          className="absolute top-3 right-3 p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm"
        >
          <Heart size={18} />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col gap-1">
        <h3 className="text-[14px] font-medium text-gray-800 line-clamp-1">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-gray-400 line-through">
            ৳{originalPrice}
          </span>
          <span className="text-[15px] font-bold text-black">
            ৳{discountPrice}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
