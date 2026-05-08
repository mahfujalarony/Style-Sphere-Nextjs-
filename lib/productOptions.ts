export const PRODUCT_COLOR_OPTIONS = [
  { label: "Black", value: "black", hex: "#222222" },
  { label: "White", value: "white", hex: "#ffffff" },
  { label: "Beige", value: "beige", hex: "#d7ccc8" },
  { label: "Nude", value: "nude", hex: "#e8c9a0" },
  { label: "Brown", value: "brown", hex: "#795548" },
  { label: "Gold", value: "gold", hex: "#d4a017" },
  { label: "Silver", value: "silver", hex: "#90a4ae" },
  { label: "Red", value: "red", hex: "#d32f2f" },
  { label: "Blue", value: "blue", hex: "#1976d2" },
  { label: "Green", value: "green", hex: "#388e3c" },
  { label: "Pink", value: "pink", hex: "#f48fb1" },
  { label: "Sea green", value: "sea green", hex: "#4caf50" },
  { label: "Golden", value: "golden", hex: "#ffd54f" },
  { label: "Maroon", value: "maroon", hex: "#880e4f" },
  { label: "Magenta", value: "magenta", hex: "#e040fb" },
  { label: "Yellow", value: "yellow", hex: "#fff176" },
  { label: "Olive", value: "olive", hex: "#808000" },
  { label: "Sky blue", value: "sky blue", hex: "#64b5f6" },
  { label: "Metallic Gold", value: "metallic gold", hex: "#c8a951" },
  { label: "Metallic Iron Gold", value: "metallic iron gold", hex: "#b87333" },
] as const;

export const PRODUCT_COLOR_VALUES = PRODUCT_COLOR_OPTIONS.map((color) => color.value);

export const toTitleCase = (value: string) =>
  value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
