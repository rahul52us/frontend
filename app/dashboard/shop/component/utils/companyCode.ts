const normalizeDigits = (value: string) => value.replace(/\D/g, "");

export const createCompanyCode = (name: string, phone: string, attempt = 0) => {
  const alpha = name.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6) || "SHOP";
  const phoneSuffix = normalizeDigits(phone).slice(-4) || "0000";
  const attemptSuffix = attempt > 0 ? String(attempt).padStart(2, "0") : "";
  return `${alpha}${phoneSuffix}${attemptSuffix}`.slice(0, 10);
};
