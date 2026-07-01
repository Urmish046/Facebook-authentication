const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10,15}$/;

export function normalizeEmailOrMobile(value) {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return emailRegex.test(trimmed) ? trimmed.toLowerCase() : trimmed;
}

export function normalizeEmail(value) {
  const decoded = typeof value === "string" ? decodeURIComponent(value) : "";
  return decoded.trim().toLowerCase();
}

export function isValidEmailOrMobile(value) {
  return emailRegex.test(value) || phoneRegex.test(value);
}

export { emailRegex };