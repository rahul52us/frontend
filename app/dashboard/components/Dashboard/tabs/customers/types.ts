import React from "react";

export type BuyerProfile = {
  _id: string;
  partyType?: "customer" | "supplier";
  displayName?: string;
  tags?: string[];
  outstandingBalance?: number;
  isBlocked?: boolean;
  source?: "manual" | "import" | "order";
  createdAt?: string;
  updatedAt?: string;
  buyerId?: {
    fullName?: string;
    phoneE164?: string;
    emailNormalized?: string;
  };
};

export type LedgerEntryType = "sale" | "payment" | "adjustment";
export type LedgerDirection = "debit" | "credit";
export type LedgerReferenceType = "order" | "manual" | "refund" | "import" | "saleRecord";

export type BuyerSaleRecordStatus = "draft" | "posted" | "void";

export type SaleRecordDetailsSummary = {
  saleAmount: number;
  paidAmount: number;
  adjustmentDebitAmount: number;
  adjustmentCreditAmount: number;
  remainingDue: number;
  isPosted: boolean;
  eventCount: number;
};

export type BuyerLedgerEntry = {
  _id: string;
  entryType: LedgerEntryType;
  amount: number;
  direction: LedgerDirection;
  referenceType?: LedgerReferenceType;
  referenceId?: string;
  linkedLedgerEntryId?: string;
  linkedSaleRecordId?: string;
  notes?: string;
  entryDate?: string;
  balanceAfter?: number;
  status?: "active" | "reversed";
  createdAt?: string;
  reversedAt?: string;
  relationType?: "direct" | "reversal";
  isPrimarySaleLedgerEntry?: boolean;
  linkedSaleSummary?: SaleRecordDetailsSummary;
};

export type BuyerSaleItem = {
  itemName: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  tax?: number;
  lineTotal?: number;
};

export type BuyerSaleRecord = {
  _id: string;
  saleDate?: string;
  items?: BuyerSaleItem[];
  itemCount?: number;
  itemPreview?: string;
  subtotal?: number;
  discountTotal?: number;
  taxTotal?: number;
  grandTotal: number;
  notes?: string;
  status: BuyerSaleRecordStatus;
  source?: "manual" | "import" | "order";
  ledgerEntryId?: string;
  postedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SaleFormItem = {
  itemSource: "catalog" | "manual";
  productId?: string;
  itemName: string;
  quantity: string;
  unitPrice: string;
  discount: string;
  tax: string;
};

export type InventoryProductSuggestion = {
  _id: string;
  name: string;
  price?: number;
  stock?: number;
  brand?: string;
  sku?: string;
};

export type LedgerSummary = {
  totalDebit: number;
  totalCredit: number;
  outstandingBalance: number;
  creditLimit: number;
  isBlocked: boolean;
};

export type BuyerImportContact = {
  fullName?: string;
  phone?: string;
  email?: string;
};

export type BuyerSaleRecordDetails = {
  saleRecord: BuyerSaleRecord;
  timeline: BuyerLedgerEntry[];
  summary: SaleRecordDetailsSummary;
};

export type PendingSaleInvoiceDownload = {
  saleId: string;
  source: "sale" | "ledger";
  saleRecord?: BuyerSaleRecord;
  ledgerEntry?: BuyerLedgerEntry;
};

export type BuyerFilterKey = "all" | "receivable" | "payable" | "settled";

export type BuyerFormErrors = Partial<Record<"fullName" | "phone" | "email", string>>;

export const defaultLedgerSummary: LedgerSummary = {
  totalDebit: 0,
  totalCredit: 0,
  outstandingBalance: 0,
  creditLimit: 0,
  isBlocked: false,
};

export const defaultSaleFormItem = (): SaleFormItem => ({
  itemSource: "manual",
  productId: "",
  itemName: "",
  quantity: "1",
  unitPrice: "",
  discount: "0",
  tax: "0",
});

export const getDefaultBuyerFormValues = () => ({
  fullName: "",
  phone: "",
  phoneCountryCode: "+91",
  phoneNationalNumber: "",
  email: "",
  displayName: "",
  tags: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  notes: "",
  partyType: "customer" as "customer" | "supplier",
});

export type BuyerFormValues = ReturnType<typeof getDefaultBuyerFormValues>;

export const getDefaultLedgerFormValues = () => ({
  entryType: "payment" as LedgerEntryType,
  amount: "",
  direction: "credit" as LedgerDirection,
  referenceType: "manual" as LedgerReferenceType,
  referenceId: "",
  linkedLedgerEntryId: "",
  linkedSaleRecordId: "",
  entryDate: "",
  notes: "",
});

export type LedgerFormValues = ReturnType<typeof getDefaultLedgerFormValues>;

export const getDefaultSaleFormValues = () => ({
  saleDate: "",
  notes: "",
  postToLedger: true,
  items: [defaultSaleFormItem()],
});

export type SaleFormValues = {
  saleDate: string;
  notes: string;
  postToLedger: boolean;
  items: SaleFormItem[];
};
