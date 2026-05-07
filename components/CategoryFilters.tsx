"use client";

import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Slider,
  Select,
  MenuItem,
  FormControl,
  Divider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

const COLOR_OPTIONS = [
  { label: "Sea green", value: "sea green", hex: "#4caf50" },
  { label: "Black", value: "black", hex: "#222222" },
  { label: "Nude", value: "nude", hex: "#e8c9a0" },
  { label: "Pink", value: "pink", hex: "#f48fb1" },
  { label: "Green", value: "green", hex: "#388e3c" },
  { label: "Brown", value: "brown", hex: "#795548" },
  { label: "Beige", value: "beige", hex: "#d7ccc8" },
  { label: "Golden", value: "golden", hex: "#ffd54f" },
  { label: "White", value: "white", hex: "#ffffff" },
  { label: "Silver", value: "silver", hex: "#90a4ae" },
  { label: "Maroon", value: "maroon", hex: "#880e4f" },
  { label: "Magenta", value: "magenta", hex: "#e040fb" },
  { label: "Yellow", value: "yellow", hex: "#fff176" },
  { label: "Olive", value: "olive", hex: "#80cbc4" },
  { label: "Sky blue", value: "sky blue", hex: "#64b5f6" },
  { label: "Metallic Gold", value: "metallic gold", hex: "#d4a017" },
  { label: "Metallic Iron Gold", value: "metallic iron gold", hex: "#b87333" },
];

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

interface CategoryFiltersProps {
  slug: string;
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

export default function CategoryFilters({
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
}: CategoryFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  const updateParams = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams();

      if (sortValue && sortValue !== "newest") params.set("sort", sortValue);
      if (minValue > 0) params.set("min", String(minValue));
      if (maxValue > 0 && maxValue < maxPrice) params.set("max", String(maxValue));
      selectedColors.forEach((c) => params.append("color", c));
      selectedSizes.forEach((s) => params.append("size", s));

      Object.entries(updates).forEach(([key, val]) => {
        params.delete(key);
        if (val === null) return;
        if (Array.isArray(val)) val.forEach((v) => params.append(key, v));
        else params.set(key, val);
      });

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, sortValue, minValue, maxValue, maxPrice, selectedColors, selectedSizes]
  );

  const handleSort = (val: string) => updateParams({ sort: val });

  const handleColor = (color: string, checked: boolean) => {
    const next = checked
      ? [...selectedColors, color]
      : selectedColors.filter((c) => c !== color);
    updateParams({ color: next.length ? next : null });
  };

  const handleSize = (_: React.MouseEvent, val: string[]) => {
    updateParams({ size: val.length ? val : null });
  };

  const handlePriceChange = (_: Event, val: number | number[]) => {
    const [lo, hi] = val as number[];
    updateParams({ min: String(lo), max: String(hi) });
  };

  const effectiveMin = minValue > 0 ? minValue : minPrice;
  const effectiveMax = maxValue > 0 ? maxValue : maxPrice;

  const sectionTitle = (text: string) => (
    <Typography
      variant="overline"
      sx={{
        fontWeight: 700,
        fontSize: "11px",
        letterSpacing: "0.15em",
        color: "text.secondary",
        display: "block",
        mb: 1,
      }}
    >
      {text}
    </Typography>
  );

  return (
    <Stack divider={<Divider />} spacing={2.5}>
      {/* Sort */}
      <Box>
        {sectionTitle("Sort By")}
        <FormControl size="small" fullWidth>
          <Select
            value={sortValue}
            onChange={(e) => handleSort(e.target.value)}
            sx={{ fontSize: 13, borderRadius: 1 }}
          >
            {SORT_OPTIONS.map((o) => (
              <MenuItem key={o.value} value={o.value} sx={{ fontSize: 13 }}>
                {o.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Price Range */}
      {maxPrice > 0 && (
        <Box>
          {sectionTitle("Price Range")}
          <Slider
            size="small"
            value={[effectiveMin, effectiveMax]}
            min={minPrice}
            max={maxPrice}
            step={100}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `Tk ${v.toLocaleString()}`}
            sx={{ color: "text.primary", mt: 1 }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Tk {effectiveMin.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Tk {effectiveMax.toLocaleString()}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Colors */}
      {colors.length > 0 && (
        <Box>
          {sectionTitle("Color")}
          <Stack spacing={0.3}>
            {COLOR_OPTIONS.filter((c) => colors.includes(c.value)).map((c) => (
              <FormControlLabel
                key={c.value}
                control={
                  <Checkbox
                    size="small"
                    checked={selectedColors.includes(c.value)}
                    onChange={(e) => handleColor(c.value, e.target.checked)}
                    sx={{ p: 0.5, color: "text.secondary", "&.Mui-checked": { color: "text.primary" } }}
                  />
                }
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 13,
                        height: 13,
                        borderRadius: "50%",
                        background: c.hex,
                        border: "1px solid",
                        borderColor: "divider",
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="body2" sx={{ fontSize: 12 }}>
                      {c.label}
                    </Typography>
                  </Box>
                }
                sx={{ m: 0 }}
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* Sizes */}
      {sizes.length > 0 && (
        <Box>
          {sectionTitle("Size")}
          <ToggleButtonGroup
            value={selectedSizes}
            onChange={handleSize}
            size="small"
            sx={{ flexWrap: "wrap", gap: 0.7, "& .MuiToggleButtonGroup-grouped": { border: "1px solid", borderColor: "divider", borderRadius: "4px !important", m: 0 } }}
          >
            {sizes.map((s) => (
              <ToggleButton
                key={s}
                value={s}
                sx={{
                  px: 1.2,
                  py: 0.4,
                  fontSize: 12,
                  fontWeight: 500,
                  lineHeight: 1.5,
                  color: "text.primary",
                  "&.Mui-selected": {
                    background: "text.primary",
                    bgcolor: "#1a1a1a",
                    color: "#fff",
                    "&:hover": { bgcolor: "#333" },
                  },
                }}
              >
                {s}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      )}
    </Stack>
  );
}