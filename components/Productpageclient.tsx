"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Box,
  Container,
  Drawer,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  Tooltip,
} from "@mui/material";
import { SlidersHorizontal, X } from "lucide-react";
import CategoryFilters from "@/components/CategoryFilters";
import ProductCard2 from "@/components/ProductCard2";

interface Product {
  _id: string;
  title: string;
  images: string[];
  originalPrice: number;
  discountPrice: number;
  discountTag?: string | null;
}

interface Props {
  slug: string;
  categoryName: string;
  products: Product[];
  colors: string[];
  sizes: string[];
  selectedColors: string[];
  selectedSizes: string[];
  sortValue: string;
  minValue: number;
  maxValue: number;
  minPrice: number;
  maxPrice: number;
}

const SIDEBAR_WIDTH = 240;

export default function ProductPageClient({
  slug,
  categoryName,
  products,
  colors,
  sizes,
  selectedColors,
  selectedSizes,
  sortValue,
  minValue,
  maxValue,
  minPrice,
  maxPrice,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filterProps = {
    slug,
    colors,
    sizes,
    selectedColors,
    selectedSizes,
    sortValue,
    minValue,
    maxValue,
    minPrice,
    maxPrice,
  };

  const filterContent = (
    <Box sx={{ p: 2.5 }}>
      <CategoryFilters {...filterProps} />
    </Box>
  );

  return (
    <main style={{ minHeight: "100vh", background: "#fafafa" }}>
      <Container maxWidth="xl" sx={{ pt: { xs: 2, lg: 4 }, pb: 6, px: { xs: 2, sm: 3 } }}>

        {/* ── Header row ─────────────────────────────────────────────── */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="overline"
              sx={{ fontSize: "11px", letterSpacing: "0.18em", color: "text.secondary" }}
            >
              Category
            </Typography>
            <Typography variant="h5" color="text.primary" sx={{ mt: 0.3, lineHeight: 1.2, fontWeight: 700 }}>
              {categoryName}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography variant="body2" color="text.secondary">
              {products.length} items
            </Typography>

            {/* Filter button — visible on mobile only */}
            {isMobile && (
              <Tooltip title="Filters">
                <IconButton
                  onClick={() => setDrawerOpen(true)}
                  size="small"
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1.5,
                    px: 1.2,
                    py: 0.6,
                    gap: 0.5,
                    bgcolor: "background.paper",
                    "&:hover": { bgcolor: "background.default" },
                  }}
                >
                  <SlidersHorizontal size={18} />
                  <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 600 }}>
                    Filter
                  </Typography>
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        {/* ── Layout ──────────────────────────────────────────────────── */}
        <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>

          {/* Desktop sidebar */}
          {!isMobile && (
            <Box
              sx={{
                width: SIDEBAR_WIDTH,
                flexShrink: 0,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                position: "sticky",
                top: 88,
              }}
            >
              {filterContent}
            </Box>
          )}

          {/* Mobile drawer */}
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            slotProps={{
              paper: {
                sx: {
                  width: 280,
                  pt: 1,
                },
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2.5,
                py: 1.5,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: 15 }}>
                Filters
              </Typography>
              <IconButton size="small" onClick={() => setDrawerOpen(false)}>
                <X size={18} />
              </IconButton>
            </Box>
            {filterContent}
          </Drawer>

          {/* Product grid */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {products.length === 0 ? (
              <Box
                sx={{
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  p: 4,
                  textAlign: "center",
                  color: "text.secondary",
                  fontSize: 14,
                }}
              >
                No products found. Try removing some filters.
              </Box>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2, minmax(0, 1fr))",
                    sm: "repeat(3, minmax(0, 1fr))",
                    lg: "repeat(4, minmax(0, 1fr))",
                  },
                  gap: 1.5,
                }}
              >
                {products.map((product) => (
                  <Box key={product._id} sx={{ minWidth: 0 }}>
                    <Link href={`/products/${product._id}`} style={{ display: "block", textDecoration: "none" }}>
                      <ProductCard2
                        image={product.images?.[0] ?? ""}
                        title={product.title}
                        originalPrice={product.originalPrice}
                        discountPrice={product.discountPrice}
                        discountTag={product.discountTag ?? undefined}
                      />
                    </Link>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </main>
  );
}
