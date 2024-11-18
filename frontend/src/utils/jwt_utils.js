export const isJwtValid = (token, del_invalid = false) => {
  try {
    if (!token) return false;

    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error("Invalid JWT structure");
    }

    const base64UrlHeader = parts[0];
    const base64Header = base64UrlHeader.replace(/-/g, '+').replace(/_/g, '/');
    const header = JSON.parse(atob(base64Header));  // eslint-disable-line no-undef

    if (!header.alg || header.alg !== 'HS256') {
      throw new Error("Invalid or unsupported algorithm in header");
    }

    const base64UrlPayload = parts[1];
    const base64Payload = base64UrlPayload.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64Payload));  // eslint-disable-line no-undef

    const currentTime = Math.floor(Date.now() / 1000);
    if (!payload.exp) {
      throw new Error("Missing expiration (exp) field in payload");
    }
    if (payload.exp <= currentTime) {
      throw new Error("Token has expired");
    }

    return true;
  } catch (e) {
    console.error("JWT validation failed:", e.message);

    if (del_invalid) {
      console.warn("Invalid or expired token. Clearing from localStorage.");
      localStorage.removeItem("access_token"); // eslint-disable-line no-undef
    }
    return false;
  }
};
