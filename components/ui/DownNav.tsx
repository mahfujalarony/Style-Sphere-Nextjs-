'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, ChevronUp } from 'lucide-react';

const luxuryItems = [
  { name: 'Bag', href: '#' },
  { name: 'Shoe', href: '#' },
  { name: 'Watch', href: '#' },
  { name: 'JEWELLRY', href: '#', hasArrow: true },
];

const inStoreItems = [
  { name: 'New Arrivals', href: '#' },
  { name: 'Best Sellers', href: '#' },
  { name: 'Exclusive Collection', href: '#' },
  { name: 'Discounted Items', href: '#' },
];

export default function DownNav() {
  const [activeMenu, setActiveMenu] = useState(null); 
  const navRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !(navRef.current as any).contains(event.target)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (menuName: string)  => {
    setActiveMenu(activeMenu === menuName ? null : menuName as any);
  };

  return (
    <header className="w-full bg-transparent font-sans relative z-[100]" ref={navRef}>
      <div className="max-w-7xl mx-auto px-4 relative">
        
        {/* Navigation Bar */}
        <nav className="flex items-center space-x-8 md:space-x-10 py-6 overflow-x-auto md:overflow-visible flex-nowrap scrollbar-hide">
          
          {/* IN STORE PRODUCTS */}
          <button 
            onClick={() => toggleMenu('inStore')}
            className="flex items-center space-x-1 shrink-0 outline-none"
          >
            <span className={`text-[12px] md:text-[13px] font-semibold uppercase tracking-wide transition-colors ${activeMenu === 'inStore' ? 'text-blue-600' : 'text-gray-800'}`}>
              In Store Products
            </span>
            {activeMenu === 'inStore' ? <ChevronUp size={14} className="text-blue-600" /> : <ChevronDown size={14} className="text-gray-800" />}
          </button>

          {/* LUXURY AUTHENTIC */}
          <button 
            onClick={() => toggleMenu('luxury')}
            className="flex items-center space-x-1 shrink-0 outline-none"
          >
            <span className={`text-[12px] md:text-[13px] font-bold uppercase tracking-wide transition-colors ${activeMenu === 'luxury' ? 'text-red-600' : 'text-gray-800'}`}>
              LUXURY AUTHENTIC
            </span>
            {activeMenu === 'luxury' ? <ChevronUp size={14} className="text-red-600" /> : <ChevronDown size={14} className="text-gray-800" />}
          </button>

          {/* Regular Links */}
          {['Handbag', 'Footwears', 'Watches', 'Jewelry'].map((item) => (
            <Link 
              key={item}
              href="#" 
              className="text-[12px] md:text-[13px] font-semibold text-gray-800 uppercase tracking-wide hover:text-black shrink-0 transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>


        <div className="absolute left-4 right-4 md:left-auto md:right-auto z-[999]">
          
          {/* In Store Dropdown */}
          {activeMenu === 'inStore' && (
            <div className="mt-2 w-full md:w-72 bg-white rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-50 p-6 md:p-8 animate-in fade-in slide-in-from-top-2">
              <h3 className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 md:mb-6">Store Categories</h3>
              <div className="flex flex-col space-y-4 md:space-y-5">
                {inStoreItems.map((item) => (
                  <Link key={item.name} href={item.href} className="text-[14px] md:text-[15px] font-medium text-slate-700 hover:text-black transition-colors">
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Luxury Dropdown */}
          {activeMenu === 'luxury' && (
            <div className="mt-2 w-full md:w-72 bg-white rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-50 p-6 md:p-8 animate-in fade-in slide-in-from-top-2">
              <h3 className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 md:mb-6">LUXURY AUTHENTIC</h3>
              <div className="flex flex-col space-y-4 md:space-y-5">
                {luxuryItems.map((item) => (
                  <Link key={item.name} href={item.href} className="flex items-center justify-between text-[14px] md:text-[15px] font-medium text-slate-700 hover:text-black transition-colors group/item">
                    {item.name}
                    {item.hasArrow && <ChevronRight size={16} className="text-slate-300 group-hover/item:text-black" />}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </header>
  );
}