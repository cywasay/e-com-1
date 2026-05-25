import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export async function fetchPublicSettings() {
  const response = await axios.get(`${baseURL}/settings/public`, {
    headers: { Accept: "application/json" },
  });
  return response.data?.data || {};
}

export const DEFAULT_PUBLIC_SETTINGS = {
  store_name: "uniforms.ae",
  store_email: "sales@uniforms.ae",
  store_phone: "+971 4 123 4567",
  store_whatsapp: "+971 50 987 6543",
  store_address: "Showroom 12, Al Quoz Industrial Area 3\nDubai, United Arab Emirates",
};

export function resolvePublicSettings(settings = {}) {
  const resolved = { ...DEFAULT_PUBLIC_SETTINGS };

  for (const [key, value] of Object.entries(settings)) {
    if (value != null && String(value).trim() !== "") {
      resolved[key] = value;
    }
  }

  return resolved;
}
