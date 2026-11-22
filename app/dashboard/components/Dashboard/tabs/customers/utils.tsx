import React from "react";
import { FileViewer } from "@capacitor/file-viewer";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { MerchantBadge } from "../../../common/merchantDashboardUI";
import { dashboardPalette } from "../../../../../layouts/dashboardLayout/dashboardPalette";
import {
  BuyerProfile,
  BuyerLedgerEntry,
  BuyerSaleRecord,
  SaleFormItem,
  BuyerFilterKey,
  LedgerDirection,
  LedgerEntryType,
  BuyerFormValues,
} from "./types";

export const isValidImportEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(email);
export const isValidImportPhone = (phone: string) => /^[0-9+\-\s()]{7,20}$/.test(phone);

export const getReadableErrorMessage = (error: any, fallback = "Please try again.") => {
  if (!error) {
    return fallback;
  }

  const responseMessage = error?.response?.data?.message || error?.response?.data?.error;
  if (typeof responseMessage === "string" && responseMessage.trim()) {
    return responseMessage.trim();
  }

  if (Array.isArray(responseMessage) && responseMessage.length > 0) {
    return responseMessage.join(", ");
  }

  if (typeof error?.message === "string" && error.message.trim()) {
    return error.message.trim();
  }

  return fallback;
};

export const isMissingImportEndpointError = (error: any) => {
  const message = String(error?.response?.data?.message || error?.message || "").toLowerCase();
  return (
    message.includes("cannot post /api/buyers/import") ||
    message.includes("cannot post /api/v1/buyers/import") ||
    error?.statusCode === 404 ||
    error?.response?.status === 404
  );
};

export const renderMerchantBadge = (
  label: React.ReactNode,
  tone: "accent" | "success" | "danger" | "soft" = "soft",
  props?: Record<string, any>,
) => {
  return (
    <MerchantBadge tone={tone} textTransform="capitalize" {...props}>
      {label}
    </MerchantBadge>
  );
};

export const formatCurrency = (amount: number) => `Rs ${Number(amount || 0).toFixed(2)}`;
export const formatDateTime = (value?: string) => (value ? new Date(value).toLocaleString() : "-");
export const formatShortId = (value?: string) => (value ? value.slice(-6) : "");
export const formatDateOnly = (value?: string) =>
  value ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-";

export const formatCompactCurrency = (amount: number) => {
  const numericAmount = Number(amount || 0);
  const hasDecimals = Math.abs(numericAmount % 1) > 0;
  return `Rs ${numericAmount.toLocaleString("en-IN", {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  })}`;
};

export const getSaleRecordItemCount = (record: BuyerSaleRecord) =>
  typeof record.itemCount === "number"
    ? record.itemCount
    : Array.isArray(record.items)
      ? record.items.length
      : 0;

export const getSaleRecordItemPreview = (record: BuyerSaleRecord) => {
  if (typeof record.itemPreview === "string" && record.itemPreview.trim()) {
    return record.itemPreview;
  }

  const itemCount = getSaleRecordItemCount(record);
  const previewText =
    itemCount > 0 && Array.isArray(record.items)
      ? record.items
        .slice(0, 2)
        .map((item) => `${item.itemName} x ${item.quantity}`)
        .join(", ")
      : "-";

  return itemCount > 2 ? `${previewText} +${itemCount - 2} more` : previewText;
};

export const formatRelativeTime = (value?: string) => {
  if (!value) {
    return "Recently added";
  }

  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) {
    return "Recently added";
  }

  const diffInSeconds = Math.round((timestamp - Date.now()) / 1000);
  const absoluteSeconds = Math.abs(diffInSeconds);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (absoluteSeconds < 60) {
    return formatter.format(diffInSeconds, "second");
  }
  if (absoluteSeconds < 3600) {
    return formatter.format(Math.round(diffInSeconds / 60), "minute");
  }
  if (absoluteSeconds < 86400) {
    return formatter.format(Math.round(diffInSeconds / 3600), "hour");
  }
  if (absoluteSeconds < 604800) {
    return formatter.format(Math.round(diffInSeconds / 86400), "day");
  }
  if (absoluteSeconds < 2629800) {
    return formatter.format(Math.round(diffInSeconds / 604800), "week");
  }
  if (absoluteSeconds < 31557600) {
    return formatter.format(Math.round(diffInSeconds / 2629800), "month");
  }

  return formatter.format(Math.round(diffInSeconds / 31557600), "year");
};

export const getBuyerDisplayName = (buyer: BuyerProfile) => {
  return buyer.displayName || buyer.buyerId?.fullName || "-";
};

export const getBuyerPartyType = (buyer?: BuyerProfile | null, fallback = "customer") =>
  (buyer?.partyType === "supplier" ? "supplier" : buyer?.partyType === "customer" ? "customer" : fallback) as
    | "customer"
    | "supplier";

export const getBuyerBalanceState = (
  buyer?: BuyerProfile | null,
  fallbackPartyType = "customer",
): Exclude<BuyerFilterKey, "all"> => {
  const outstanding = Number(buyer?.outstandingBalance || 0);
  if (!Number.isFinite(outstanding) || outstanding === 0) {
    return "settled";
  }

  const isSupplier = getBuyerPartyType(buyer, fallbackPartyType) === "supplier";
  const isReceivable = isSupplier ? outstanding < 0 : outstanding > 0;
  return isReceivable ? "receivable" : "payable";
};

export const getBuyerBalanceMeta = (
  buyer?: BuyerProfile | null,
  fallbackPartyType = "customer",
  colorTokens?: { textMuted?: string; success?: string; danger?: string },
) => {
  const state = getBuyerBalanceState(buyer, fallbackPartyType);
  const amount = Math.abs(Number(buyer?.outstandingBalance || 0));
  const isSupplier = getBuyerPartyType(buyer, fallbackPartyType) === "supplier";
  const cMuted = colorTokens?.textMuted || "gray.500";
  const cSuccess = colorTokens?.success || "green.500";
  const cDanger = colorTokens?.danger || "red.500";

  if (state === "settled") {
    return {
      state,
      amount: 0,
      color: cMuted,
      helper: "—",
      listLabel: "Settled",
      detailLabel: "Account settled",
    };
  }

  if (state === "receivable") {
    return {
      state,
      amount,
      color: cSuccess,
      helper: "to receive",
      listLabel: "To receive",
      detailLabel: isSupplier ? "Supplier owes you" : "Customer owes you",
    };
  }

  return {
    state,
    amount,
    color: cDanger,
    helper: "to pay",
    listLabel: "To pay",
    detailLabel: isSupplier ? "You owe supplier" : "You owe customer",
  };
};

export const getBuyerAvatarHue = (buyer: BuyerProfile) =>
  Array.from(`${buyer._id}-${getBuyerDisplayName(buyer)}`).reduce((total, char) => total + char.charCodeAt(0), 0) % 360;

export const getBuyerPrimaryContact = (buyer?: BuyerProfile | null) =>
  buyer?.buyerId?.phoneE164 || buyer?.buyerId?.emailNormalized || "No contact added";

export const getBuyerActionPhone = (buyer?: BuyerProfile | null) => String(buyer?.buyerId?.phoneE164 || "").trim();

export const getWhatsAppHref = (phone?: string) => {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "";
};

export const openExternalLink = (url: string) => {
  if (!url || typeof window === "undefined") {
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
};

export const getBuyerInitials = (buyer: BuyerProfile) => {
  const rawName = getBuyerDisplayName(buyer).trim();
  if (!rawName || rawName === "-") {
    return "C";
  }

  const parts = rawName.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 1).toUpperCase();
  }

  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
};

export const getBuyerSecondaryLabel = (buyer: BuyerProfile) => {
  const relativeLabel = formatRelativeTime(buyer.updatedAt || buyer.createdAt);
  const sourceLabel = buyer.source ? buyer.source.charAt(0).toUpperCase() + buyer.source.slice(1) : "Manual";
  return `${relativeLabel} - ${sourceLabel}`;
};

export const splitPhoneParts = (value?: string) => {
  const raw = String(value || "").trim();
  if (!raw) {
    return {
      phoneCountryCode: "+91",
      phoneNationalNumber: "",
      phone: "",
    };
  }

  const normalized = raw.replace(/[^0-9+]/g, "");
  const explicitMatch = normalized.match(/^(\+\d{1,4})(\d{4,})$/);
  if (explicitMatch) {
    return {
      phoneCountryCode: explicitMatch[1],
      phoneNationalNumber: explicitMatch[2],
      phone: `${explicitMatch[1]}${explicitMatch[2]}`,
    };
  }

  const digitsOnly = normalized.replace(/\D/g, "");
  if (!digitsOnly) {
    return {
      phoneCountryCode: "+91",
      phoneNationalNumber: "",
      phone: "",
    };
  }

  if (digitsOnly.length > 10) {
    const countryDigits = digitsOnly.slice(0, digitsOnly.length - 10);
    const localDigits = digitsOnly.slice(-10);
    return {
      phoneCountryCode: `+${countryDigits}`,
      phoneNationalNumber: localDigits,
      phone: `+${countryDigits}${localDigits}`,
    };
  }

  return {
    phoneCountryCode: "+91",
    phoneNationalNumber: digitsOnly,
    phone: `+91${digitsOnly}`,
  };
};

export const composePhoneFromForm = (formValues: BuyerFormValues) => {
  const localPhone = String(formValues.phoneNationalNumber || "").replace(/\D/g, "");
  const countryCode = String(formValues.phoneCountryCode || "")
    .replace(/[^\d+]/g, "")
    .trim();

  if (localPhone) {
    return `${countryCode || ""}${localPhone}`.trim();
  }

  return formValues.phone.trim();
};

export const formatLedgerReference = (entry: BuyerLedgerEntry) =>
  entry.referenceId
    ? `${entry.referenceType || "manual"}: ${formatShortId(entry.referenceId)}`
    : entry.referenceType || "manual";

export const formatSignedAmount = (entry: BuyerLedgerEntry) =>
  `${entry.direction === "credit" ? "-" : "+"}${formatCurrency(Number(entry.amount || 0))}`;

export const getLinkedSaleRecordIdFromEntry = (entry?: BuyerLedgerEntry | null) => {
  if (!entry) {
    return "";
  }

  return (
    entry.linkedSaleRecordId ||
    (entry.referenceType === "saleRecord" ? entry.referenceId || "" : "")
  );
};

export const getLinkedSaleRemainingDue = (entry?: BuyerLedgerEntry | null) => {
  const remainingDue = Number(entry?.linkedSaleSummary?.remainingDue);
  return Number.isFinite(remainingDue) ? remainingDue : null;
};

export const getEntryRemainingText = (entry?: BuyerLedgerEntry | null) => {
  const remainingDue = getLinkedSaleRemainingDue(entry);
  if (remainingDue === null) {
    return "-";
  }
  if (remainingDue < 0) {
    return `Overpaid ${formatCurrency(Math.abs(remainingDue))}`;
  }
  return formatCurrency(remainingDue);
};

export const getEntryPaidText = (entry?: BuyerLedgerEntry | null) => {
  const paidAmount = Number(entry?.linkedSaleSummary?.paidAmount);
  return Number.isFinite(paidAmount) ? formatCurrency(paidAmount) : "-";
};

export const canPayEntry = (entry?: BuyerLedgerEntry | null) => {
  if (!entry || entry.status === "reversed" || entry.direction !== "debit") {
    return false;
  }

  const remainingDue = getLinkedSaleRemainingDue(entry);
  return remainingDue === null || remainingDue > 0;
};

export const isEntryFullySettled = (entry?: BuyerLedgerEntry | null) => {
  const remainingDue = getLinkedSaleRemainingDue(entry);
  return remainingDue !== null && remainingDue <= 0;
};

export const canDownloadLedgerInvoice = (
  entry?: BuyerLedgerEntry | null,
  partyType: "customer" | "supplier" = "customer",
) =>
  Boolean(
    entry &&
    entry.status !== "reversed" &&
    partyType !== "supplier" &&
    (Boolean(getLinkedSaleRecordIdFromEntry(entry)) || entry.direction === "debit"),
  );

export const getBuyerLedgerDirectionLabel = (
  direction: LedgerDirection,
  entryType?: LedgerEntryType,
  partyType: "customer" | "supplier" = "customer",
) => {
  if (partyType === "supplier") {
    if (direction === "debit") {
      return "You will give";
    }
    if (entryType === "payment") {
      return "Payment sent";
    }
    return "Due reduced";
  }

  if (direction === "debit") {
    return "You will get";
  }
  if (entryType === "payment") {
    return "Payment received";
  }
  return "Due reduced";
};

export const getBuyerLedgerDirectionColorScheme = (
  direction: LedgerDirection,
  entryType?: LedgerEntryType,
  partyType: "customer" | "supplier" = "customer",
) => {
  if (partyType === "supplier") {
    if (direction === "debit") {
      return "red";
    }
    return "green";
  }

  if (direction === "debit") {
    return "green";
  }
  if (entryType === "payment") {
    return "green";
  }
  return "red";
};

export const getLedgerEffectLabel = (
  entry: BuyerLedgerEntry,
  partyType: "customer" | "supplier" = "customer",
) => {
  if (entry.direction === "debit" && isEntryFullySettled(entry)) {
    return partyType === "supplier" ? "Payment sent" : "Payment received";
  }
  return getBuyerLedgerDirectionLabel(entry.direction, entry.entryType, partyType);
};

export const getLedgerEffectColorScheme = (
  entry: BuyerLedgerEntry,
  partyType: "customer" | "supplier" = "customer",
) => {
  if (entry.direction === "debit" && isEntryFullySettled(entry)) {
    return "green";
  }
  return getBuyerLedgerDirectionColorScheme(entry.direction, entry.entryType, partyType);
};

export const getLedgerAmountColor = (
  entry: BuyerLedgerEntry,
  cAccentStrong: string,
) => {
  if (entry.direction === "debit" && isEntryFullySettled(entry)) {
    return dashboardPalette.success;
  }
  return entry.direction === "credit" ? dashboardPalette.success : cAccentStrong;
};

export const getBuyerLedgerDirectionTextColor = (
  direction: LedgerDirection,
  entryType?: LedgerEntryType,
  partyType: "customer" | "supplier" = "customer",
) => {
  if (partyType === "supplier") {
    if (direction === "debit") {
      return "red.700";
    }
    return "green.700";
  }

  if (direction === "debit") {
    return "green.700";
  }
  if (entryType === "payment") {
    return "green.700";
  }
  return "red.700";
};

export const getLedgerEntryTypeLabel = (
  entryType: LedgerEntryType,
  partyType: "customer" | "supplier" = "customer",
) => {
  if (entryType === "sale") {
    return partyType === "supplier" ? "Purchase" : "Sale";
  }
  if (entryType === "payment") {
    return "Payment";
  }
  return "Correction";
};

export const getTimelineTitle = (
  entry: BuyerLedgerEntry,
  isSelectedSupplier = false,
) => {
  if (entry.relationType === "reversal") {
    return "Reversal Correction";
  }
  if (entry.isPrimarySaleLedgerEntry) {
    return "Posted To Ledger";
  }
  if (entry.entryType === "payment") {
    return isSelectedSupplier ? "Payment Sent" : "Payment Received";
  }
  if (entry.entryType === "adjustment") {
    return "Balance Correction";
  }
  return isSelectedSupplier ? "Purchase Ledger Entry" : "Sale Ledger Entry";
};

export const calculateSaleLineTotal = (item: SaleFormItem) => {
  const quantity = Number(item.quantity || 0);
  const unitPrice = Number(item.unitPrice || 0);
  const discount = Number(item.discount || 0);
  const tax = Number(item.tax || 0);

  const safeQuantity = Number.isFinite(quantity) ? Math.max(quantity, 0) : 0;
  const safeUnitPrice = Number.isFinite(unitPrice) ? Math.max(unitPrice, 0) : 0;
  const safeDiscount = Number.isFinite(discount) ? Math.max(discount, 0) : 0;
  const safeTax = Number.isFinite(tax) ? Math.max(tax, 0) : 0;

  const baseTotal = safeQuantity * safeUnitPrice;
  const discountedTotal = Math.max(baseTotal - safeDiscount, 0);
  return discountedTotal + safeTax;
};

export const blobToBase64 = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Failed to read file data"));
        return;
      }
      const base64 = result.split(",")[1];
      if (!base64) {
        reject(new Error("Failed to encode file"));
        return;
      }
      resolve(base64);
    };
    reader.onerror = () => reject(reader.error || new Error("Failed to read file"));
    reader.readAsDataURL(blob);
  });

export const getFileNameFromContentDisposition = (contentDisposition?: string, fallback = "invoice.pdf") => {
  if (!contentDisposition) {
    return fallback;
  }

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]).replace(/["']/g, "");
  }

  const basicMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
  if (basicMatch?.[1]) {
    return basicMatch[1].trim();
  }

  return fallback;
};

export const readBlobErrorMessage = async (error: any, fallback = "Please try again.") => {
  const blobLike = error?.response?.data;
  if (blobLike instanceof Blob) {
    try {
      const rawText = await blobLike.text();
      if (!rawText) {
        return fallback;
      }

      try {
        const parsed = JSON.parse(rawText);
        if (typeof parsed?.message === "string" && parsed.message.trim()) {
          return parsed.message;
        }
      } catch {
        return rawText.trim() || fallback;
      }
    } catch {
      return fallback;
    }
  }

  return getReadableErrorMessage(error, fallback);
};

export const ensureNativeInvoiceStoragePermission = async () => {
  try {
    const permissionStatus = await Filesystem.checkPermissions();
    if (permissionStatus.publicStorage === "granted") {
      return;
    }

    const requested = await Filesystem.requestPermissions();
    if (requested.publicStorage !== "granted") {
      throw new Error("Storage permission was denied");
    }
  } catch (error: any) {
    const message = String(error?.message || "").toLowerCase();
    if (message.includes("not implemented") || message.includes("unavailable")) {
      return;
    }
    throw error;
  }
};

export const deliverPdfBlob = async (pdfBlob: Blob, fileName: string, isAndroidRuntime = false) => {
  if (typeof window === "undefined") {
    return "downloaded" as const;
  }

  const isNativeCapacitor = Boolean((window as any)?.Capacitor?.isNativePlatform?.()) || isAndroidRuntime;
  if (!isNativeCapacitor) {
    const blobUrl = URL.createObjectURL(pdfBlob);
    const anchor = document.createElement("a");
    anchor.href = blobUrl;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
    return "downloaded" as const;
  }

  const base64Data = await blobToBase64(pdfBlob);

  try {
    await ensureNativeInvoiceStoragePermission();

    const filePath = `BusinessSahayata/Invoices/${fileName}`;
    await Filesystem.writeFile({
      path: filePath,
      data: base64Data,
      directory: Directory.Documents,
      recursive: true,
    });

    try {
      const uriResult = await Filesystem.getUri({
        path: filePath,
        directory: Directory.Documents,
      });
      const localOpenPath = uriResult.uri.startsWith("file://")
        ? uriResult.uri.replace("file://", "")
        : uriResult.uri;

      try {
        await FileViewer.openDocumentFromLocalPath({
          path: localOpenPath,
        });
        return "savedPrompted" as const;
      } catch (viewerError: any) {
        console.warn("Saved invoice could not be opened directly, falling back to share", viewerError);
      }

      const shareAvailability = await Share.canShare();
      if (shareAvailability.value) {
        await Share.share({
          title: fileName,
          files: [uriResult.uri],
          dialogTitle: "Open invoice",
        });
        return "savedPrompted" as const;
      }
    } catch (openError: any) {
      const openMessage = String(openError?.message || "").toLowerCase();
      if (openMessage.includes("cancel") || openMessage.includes("abort")) {
        return "saved" as const;
      }
      console.warn("Invoice saved but open/share chooser for saved file was unavailable", openError);
    }

    return "saved" as const;
  } catch (saveError: any) {
    console.warn("Falling back from native file save for invoice delivery", saveError);

    try {
      const cachePath = `invoices/${fileName}`;
      await Filesystem.writeFile({
        path: cachePath,
        data: base64Data,
        directory: Directory.Cache,
        recursive: true,
      });

      const uriResult = await Filesystem.getUri({
        path: cachePath,
        directory: Directory.Cache,
      });

      const shareAvailability = await Share.canShare();
      if (shareAvailability.value) {
        await Share.share({
          title: fileName,
          files: [uriResult.uri],
          dialogTitle: "Share invoice",
        });
        return "shared" as const;
      }
    } catch (shareError: any) {
      const shareMessage = String(shareError?.message || "").toLowerCase();
      if (shareMessage.includes("cancel") || shareMessage.includes("abort")) {
        return "cancelled" as const;
      }
      console.warn("Falling back from native share for invoice delivery", shareError);
    }
  }

  const blobUrl = URL.createObjectURL(pdfBlob);
  const anchor = document.createElement("a");
  anchor.href = blobUrl;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
  return "downloaded" as const;
};

export const ensureDeviceContactsPermission = async (capacitorContacts: any) => {
  if (!capacitorContacts?.checkPermissions) {
    return;
  }

  const currentPermission = await capacitorContacts.checkPermissions();
  if (currentPermission?.contacts === "granted") {
    return;
  }

  if (!capacitorContacts.requestPermissions) {
    throw new Error("Contacts permission is not available on this device");
  }

  const requestedPermission = await capacitorContacts.requestPermissions();
  if (requestedPermission?.contacts !== "granted") {
    throw new Error("Contacts permission was denied");
  }
};
