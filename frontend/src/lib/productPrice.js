/**
 * List/retail price shown to guests (Phase 0: retail visible without login).
 */
export function getListPrice(product) {
  if (!product) return "0.00";
  const value = product.base_retail_price ?? product.price;
  return value != null ? Number(value).toFixed(2) : "0.00";
}

/**
 * Display price for catalog cards and home, based on role.
 */
export function getDisplayPrice(product, user) {
  const listPrice = getListPrice(product);

  if (!user) {
    return { amount: listPrice, compareAt: null, label: null };
  }

  const resolved = product.resolved_price ?? product.price;
  const resolvedFormatted =
    resolved != null ? Number(resolved).toFixed(2) : listPrice;

  if (
    user.role === "b2b_buyer" &&
    user.b2b_status === "approved" &&
    resolved != null
  ) {
    return {
      amount: resolvedFormatted,
      compareAt: resolvedFormatted !== listPrice ? listPrice : null,
      label: "Wholesale",
    };
  }

  return {
    amount: resolvedFormatted,
    compareAt:
      resolvedFormatted !== listPrice ? listPrice : null,
    label: null,
  };
}
