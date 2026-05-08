"use client";

import { Box, Typography, Chip, IconButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Image from "next/image";

interface ProductCardProps {
  image: string;
  title: string;
  originalPrice: number;
  discountPrice: number;
  discountTag?: string;
}

export default function ProductCard2({
  image,
  title,
  originalPrice,
  discountPrice,
  discountTag,
}: ProductCardProps) {
  return (
    <Box
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        cursor: "pointer",
        transition: "box-shadow 0.18s",
        "&:hover": { boxShadow: "0 4px 18px rgba(0,0,0,0.10)" },
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image */}
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: "4/4.5",
            bgcolor: "#f5f5f5",
          }}
        >
          {image   ? (
            <Image
              src={image}
              alt={title}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width:600px) 50vw, (max-width:900px) 33vw, 25vw"
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#bbb",
                fontSize: 40,
              }}
            >
              👟
            </Box>
          )}
        </Box>

        {/* Discount Tag */}
        {discountTag && (
          <Chip
            label={discountTag}
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              bgcolor: "#111",
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              height: 20,
              borderRadius: "3px",
              letterSpacing: "0.05em",
              "& .MuiChip-label": { px: 0.8 },
            }}
          />
        )}

        {/* Wishlist */}
        <IconButton
          size="small"
          sx={{
            position: "absolute",
            top: 5,
            right: 5,
            bgcolor: "rgba(255,255,255,0.85)",
            width: 28,
            height: 28,
            "&:hover": { bgcolor: "rgba(255,255,255,1)" },
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <FavoriteBorderIcon sx={{ fontSize: 15, color: "#e53935" }} />
        </IconButton>
      </Box>

      {/* Info */}
      <Box sx={{ p: "10px 10px 12px" }}>
        <Typography
          variant="body2"
          sx={{
            fontSize: 12,
            fontWeight: 500,
            color: "text.primary",
            lineHeight: 1.4,
            mb: 0.8,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: "text.primary" }}>
            Tk {discountPrice.toLocaleString()}
          </Typography>
          <Typography
            sx={{
              fontSize: 12,
              color: "text.secondary",
              textDecoration: "line-through",
            }}
          >
            Tk {originalPrice.toLocaleString()}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
