"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { PRODUCT_COLOR_OPTIONS, toTitleCase } from "@/lib/productOptions";

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
  const initialRange: [number, number] = [
    minValue > 0 ? minValue : minPrice,
    maxValue > 0 ? maxValue : maxPrice,
  ];
  const [priceRange, setPriceRange] = useState<[number, number]>(initialRange);

  useEffect(() => {
    setPriceRange(initialRange);
  }, [initialRange[0], initialRange[1]]);

  const colorOptions = useMemo(() => {
    const knownColors = PRODUCT_COLOR_OPTIONS.filter((color) => colors.includes(color.value));
    const knownValues = new Set<string>(knownColors.map((color) => color.value));
    const unknownColors = colors
      .filter((color) => !knownValues.has(color))
      .map((color) => ({ label: toTitleCase(color), value: color, hex: "#f8fafc" }));

    return [...knownColors, ...unknownColors];
  }, [colors]);

  const updateParams = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams();

      if (sortValue && sortValue !== "newest") params.set("sort", sortValue);
      if (minValue > minPrice) params.set("min", String(minValue));
      if (maxValue > 0 && maxValue < maxPrice) params.set("max", String(maxValue));
      selectedColors.forEach((c) => params.append("color", c));
      selectedSizes.forEach((s) => params.append("size", s));

      Object.entries(updates).forEach(([key, val]) => {
        params.delete(key);
        if (val === null) return;
        if (Array.isArray(val)) val.forEach((v) => params.append(key, v));
        else params.set(key, val);
      });

      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [router, pathname, sortValue, minValue, maxValue, minPrice, maxPrice, selectedColors, selectedSizes]
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
    setPriceRange(val as [number, number]);
  };

  const handlePriceCommit = (_: Event | React.SyntheticEvent, val: number | number[]) => {
    const [lo, hi] = val as number[];
    updateParams({
      min: lo > minPrice ? String(lo) : null,
      max: hi < maxPrice ? String(hi) : null,
    });
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
          {maxPrice > minPrice ? (
            <Slider
              size="small"
              value={priceRange}
              min={minPrice}
              max={maxPrice}
              step={Math.max(1, Math.round((maxPrice - minPrice) / 50))}
              onChange={handlePriceChange}
              onChangeCommitted={handlePriceCommit}
              valueLabelDisplay="auto"
              valueLabelFormat={(v) => `Tk ${v.toLocaleString()}`}
              sx={{ color: "text.primary", mt: 1 }}
            />
          ) : null}
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
            {colorOptions.map((c) => (
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
