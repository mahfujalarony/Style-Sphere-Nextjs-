'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button, Menu, MenuItem } from '@mui/material';

type CategoryItem = {
  name: string;
  href: string;
  group: 'inStore' | 'luxury' | 'nav';
  hasArrow?: boolean;
};

type CategoryResponse = {
  inStore: CategoryItem[];
  luxury: CategoryItem[];
  nav: CategoryItem[];
};

const emptyCategories: CategoryResponse = {
  inStore: [],
  luxury: [],
  nav: [],
};

export default function DownNav() {
  const [categories, setCategories] = useState<CategoryResponse>(emptyCategories);
  const [inStoreAnchor, setInStoreAnchor] = useState<null | HTMLElement>(null);
  const [luxuryAnchor, setLuxuryAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/client/categories');
        if (!response.ok) {
          throw new Error('Failed to load categories');
        }
        const data = (await response.json()) as { categories?: CategoryResponse };
        if (data.categories) {
          setCategories(data.categories);
        }
      } catch (error) {
        setCategories(emptyCategories);
      }
    };

    loadCategories();
  }, []);

  const openInStore = (event: React.MouseEvent<HTMLElement>) => {
    setInStoreAnchor(event.currentTarget);
  };

  const openLuxury = (event: React.MouseEvent<HTMLElement>) => {
    setLuxuryAnchor(event.currentTarget);
  };

  const closeInStore = () => setInStoreAnchor(null);
  const closeLuxury = () => setLuxuryAnchor(null);

  return (
    <header className="w-full  bg-transparent font-sans relative z-[100]">
      <div className="max-w-7xl mx-auto px-4 relative">
        
        {/* Navigation Bar */}
        <nav className="flex items-center justify-center space-x-8 md:space-x-10 py-6 overflow-x-auto md:overflow-visible flex-nowrap scrollbar-hide">
          
          {/* IN STORE PRODUCTS */}
          {categories.inStore.length > 0 && (
            <Button
              onClick={openInStore}
              endIcon={<ChevronDown size={14} />}
              className="shrink-0"
              variant="text"
              sx={{
                px: 1,
                minWidth: 0,
                color: inStoreAnchor ? '#2563eb' : '#1f2937',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.08em',
              }}
            >
              In Store Products
            </Button>
          )}

          {/* LUXURY AUTHENTIC */}
          {categories.luxury.length > 0 && (
            <Button
              onClick={openLuxury}
              endIcon={<ChevronDown size={14} />}
              className="shrink-0"
              variant="text"
              sx={{
                px: 1,
                minWidth: 0,
                color: luxuryAnchor ? '#2563eb' : '#1f2937',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.08em',
              }}
            >
              Luxury Authentic
            </Button>
          )}

          {/* Regular Links */}
          {categories.nav.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-[12px] md:text-[13px] font-semibold text-gray-800 uppercase tracking-wide hover:text-black shrink-0 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>


        <Menu
          anchorEl={inStoreAnchor}
          open={Boolean(inStoreAnchor)}
          onClose={closeInStore}
          slotProps={{
            paper: {
              sx: {
                mt: 2,
                minWidth: 260,
                borderRadius: '20px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                border: '1px solid #f1f5f9',
                px: 1.5,
                py: 1.5,
              },
            },
            list: {
              onMouseLeave: closeInStore,
              sx: { py: 0 },
            },
          }}
        >
          <div className="px-3 pt-2 pb-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Store Categories</p>
          </div>
          {categories.inStore.map((item) => (
            <MenuItem
              key={item.name}
              onClick={closeInStore}
              component={Link}
              href={item.href}
              sx={{
                fontSize: '14px',
                fontWeight: 500,
                color: '#334155',
                borderRadius: '12px',
              }}
            >
              {item.name}
            </MenuItem>
          ))}
        </Menu>

        <Menu
          anchorEl={luxuryAnchor}
          open={Boolean(luxuryAnchor)}
          onClose={closeLuxury}
          slotProps={{
            paper: {
              sx: {
                mt: 2,
                minWidth: 260,
                borderRadius: '20px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                border: '1px solid #f1f5f9',
                px: 1.5,
                py: 1.5,
              },
            },
            list: {
              onMouseLeave: closeLuxury,
              sx: { py: 0 },
            },
          }}
        >
          <div className="px-3 pt-2 pb-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Luxury Authentic</p>
          </div>
          {categories.luxury.map((item) => (
            <MenuItem
              key={item.name}
              onClick={closeLuxury}
              component={Link}
              href={item.href}
              sx={{
                fontSize: '14px',
                fontWeight: 500,
                color: '#334155',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                gap: 1,
              }}
            >
              {item.name}
              {item.hasArrow && <ChevronRight size={16} className="text-slate-300" />}
            </MenuItem>
          ))}
        </Menu>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </header>
  );
}