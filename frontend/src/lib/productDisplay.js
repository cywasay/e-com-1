export function getPrimaryImage(product) {
  return product?.images?.find((img) => img.is_primary) || product?.images?.[0];
}

export function formatProductLabel(value) {
  if (!value) return "";
  return value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getPriceLabel(user, wholesaleLabel) {
  if (wholesaleLabel === "Wholesale") return "Wholesale";
  if (user) return "Your price";
  return "List price";
}
