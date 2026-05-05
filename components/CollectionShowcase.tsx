'use client';

import React from 'react';
import Link from 'next/link';

const collections = [
  {
    id: 1,
    title: 'EXPLORE TORY BURCH',
    buttonText: 'See more',
    image: '/assets/kids.jpg', // Replace with your image
    href: '#',
  },
  {
    id: 2,
    title: 'WOMAN TRENDING',
    buttonText: 'See more',
    image: '/assets/woman.jpg', // Replace with your image
    href: '#',
  },
  {
    id: 3,
    title: 'LUXARY WATCH',
    buttonText: 'Discover',
    image: '/assets/watch.jpg', // Replace with your image
    href: '#',
  },
];

const CollectionShowcase = () => {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3">
        {collections.map((item) => (
          <div 
            key={item.id} 
            className="relative group h-[500px] md:h-[600px] overflow-hidden cursor-pointer"
          >
            {/* Background Image */}
            <img
              src={item.image}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Dark Overlay for Text Visibility */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />

            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 text-center">
              
              {/* Title */}
              <h2 className="text-white text-[14px] md:text-[16px] font-bold uppercase tracking-[0.2em] mb-6 drop-shadow-md">
                {item.title}
              </h2>

              {/* Action Button */}
              <Link
                href={item.href}
                className="bg-white text-black px-10 py-3 rounded-full text-[14px] font-bold hover:bg-black hover:text-white transition-all duration-300 shadow-lg transform group-hover:-translate-y-1"
              >
                {item.buttonText}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CollectionShowcase;