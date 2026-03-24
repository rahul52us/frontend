export const GSTIN_REGEX = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

export const normalizeGstNumber = (value?: string) =>
  (value || "")
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, "")
    .slice(0, 15);

export const isValidGstNumber = (value?: string) => {
  const normalized = normalizeGstNumber(value);
  if (!normalized) return true;
  return GSTIN_REGEX.test(normalized);
};

export const getOptionalGstError = (value?: string) => {
  if (!normalizeGstNumber(value)) return undefined;
  return isValidGstNumber(value) ? undefined : "Enter a valid GST number.";
};
