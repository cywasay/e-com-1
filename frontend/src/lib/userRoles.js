/**
 * Role helpers for Phase 3 storefront behavior.
 */

export function isApprovedB2b(user) {
  return (
    user?.role === "b2b_buyer" &&
    user?.b2b_status === "approved"
  );
}

export function isB2bBuyer(user) {
  return user?.role === "b2b_buyer";
}

export function isB2cCustomer(user) {
  return !user || user.role === "b2c_customer";
}

/** Guests and B2C can use cart; B2B buyers use quote flow only. */
export function canUseCart(user) {
  if (!user) return true;
  if (isB2bBuyer(user)) return false;
  return user.role === "b2c_customer";
}

export function shouldUseQuotePrimary(user) {
  if (!user) return true;
  return isB2bBuyer(user);
}

export function shouldShowAddToCart(user) {
  return canUseCart(user);
}

export function shouldShowAddToQuote(user) {
  return true;
}

export function getProductMoq(product) {
  const moq = Number(product?.moq);
  return Number.isFinite(moq) && moq > 1 ? moq : null;
}
