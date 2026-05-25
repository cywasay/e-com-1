/**
 * Normalize default_address from API/auth storage (object or JSON string).
 */
export function parseDefaultAddress(address) {
  if (!address) return null;

  if (typeof address === "string") {
    try {
      const parsed = JSON.parse(address);
      return typeof parsed === "object" && parsed !== null ? parsed : null;
    } catch {
      return null;
    }
  }

  return typeof address === "object" ? address : null;
}

export function normalizeUserAddress(user) {
  if (!user) return user;

  const default_address = parseDefaultAddress(user.default_address);
  if (default_address === user.default_address) return user;

  return { ...user, default_address };
}
