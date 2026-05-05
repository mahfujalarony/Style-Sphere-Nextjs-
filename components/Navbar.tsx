"use client";

import React, { useState, useEffect } from 'react'
import { Heart, Menu, ShoppingCart } from 'lucide-react'
import Search from './ui/Search'
import DownNav from './ui/DownNav';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if scrolled past the video section (100vh)
      if (window.scrollY > window.innerHeight - 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      {/* Top section with icons */}
      <div className={`flex items-center justify-between py-4 px-6 transition-colors duration-300 ${isScrolled ? 'text-black' : 'text-white md:text-black'}`}>
        <Menu />
        <Search />
        <div className='flex items-center space-x-2.5'>
            <Heart />
            <ShoppingCart />
        </div>
      </div>

      {/* categorys */}
      <div className="w-full">
        <DownNav />
      </div>
    </div>
  )
}

export default Navbar
