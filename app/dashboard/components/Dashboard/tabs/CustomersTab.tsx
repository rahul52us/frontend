"use client";

import React, { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Radio,
  RadioGroup,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  Spinner,
  useBreakpointValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { AddIcon, ArrowBackIcon, CopyIcon, DownloadIcon } from "@chakra-ui/icons";
import { FileViewer } from "@capacitor/file-viewer";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { FiChevronRight, FiMail, FiPhone, FiSearch, FiTrash2, FiUserPlus, FiUsers } from "react-icons/fi";
import stores from "../../../../store/stores";
import CustomTable from "../../../../component/config/component/CustomTable/CustomTable";
import ConfirmationModal from "../../../../component/common/ConfirmationModal/ConfirmationModal";
import CustomDrawer from "../../../../component/common/Drawer/CustomDrawer";

type BuyerProfile = {
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

type LedgerEntryType = "sale" | "payment" | "adjustment";
type LedgerDirection = "debit" | "credit";
type LedgerReferenceType = "order" | "manual" | "refund" | "import" | "saleRecord";

type BuyerLedgerEntry = {
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
};

type BuyerSaleRecordStatus = "draft" | "posted" | "void";

type BuyerSaleItem = {
  itemName: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  tax?: number;
  lineTotal?: number;
};

type BuyerSaleRecord = {
  _id: string;
  saleDate?: string;
  items: BuyerSaleItem[];
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

type SaleFormItem = {
  productId?: string;
  itemName: string;
  quantity: string;
  unitPrice: string;
  discount: string;
  tax: string;
};

type InventoryProductSuggestion = {
  _id: string;
  name: string;
  price?: number;
  stock?: number;
  brand?: string;
  sku?: string;
};

type LedgerSummary = {
  totalDebit: number;
  totalCredit: number;
  outstandingBalance: number;
  creditLimit: number;
  isBlocked: boolean;
};

type BuyerImportContact = {
  fullName?: string;
  phone?: string;
  email?: string;
};

type SaleRecordDetailsSummary = {
  saleAmount: number;
  paidAmount: number;
  adjustmentDebitAmount: number;
  adjustmentCreditAmount: number;
  remainingDue: number;
  isPosted: boolean;
  eventCount: number;
};

type BuyerSaleRecordDetails = {
  saleRecord: BuyerSaleRecord;
  timeline: BuyerLedgerEntry[];
  summary: SaleRecordDetailsSummary;
};

const isValidImportEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(email);
const isValidImportPhone = (phone: string) => /^[0-9+\-\s()]{7,20}$/.test(phone);

const getReadableErrorMessage = (error: any, fallback = "Please try again.") => {
  if (!error) {
    return fallback;
  }

  if (typeof error === "string") {
    return error;
  }

  if (Array.isArray(error?.data) && error.data.length > 0) {
    return String(error.data[0]);
  }

  if (typeof error?.message === "string" && error.message.trim()) {
    return error.message;
  }

  if (typeof error?.response?.data === "string" && error.response.data.trim()) {
    return error.response.data;
  }

  if (typeof error?.response?.data?.message === "string" && error.response.data.message.trim()) {
    return error.response.data.message;
  }

  return fallback;
};

const isMissingImportEndpointError = (error: any) => {
  const text = getReadableErrorMessage(error, "").toLowerCase();
  return (
    text.includes("cannot post /api/buyer/import-contacts") ||
    text.includes("cannot post /buyer/import-contacts") ||
    text.includes("not found") ||
    error?.statusCode === 404 ||
    error?.response?.status === 404
  );
};

const defaultLedgerSummary: LedgerSummary = {
  totalDebit: 0,
  totalCredit: 0,
  outstandingBalance: 0,
  creditLimit: 0,
  isBlocked: false,
};

const defaultSaleFormItem = (): SaleFormItem => ({
  productId: "",
  itemName: "",
  quantity: "1",
  unitPrice: "",
  discount: "0",
  tax: "0",
});

const getDefaultBuyerFormValues = () => ({
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

const CustomersTab: React.FC = observer(() => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isLedgerEntryOpen,
    onOpen: onLedgerEntryOpen,
    onClose: onLedgerEntryClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isReverseOpen,
    onOpen: onReverseOpen,
    onClose: onReverseClose,
  } = useDisclosure();
  const {
    isOpen: isSaleRecordOpen,
    onOpen: onSaleRecordOpen,
    onClose: onSaleRecordClose,
  } = useDisclosure();
  const {
    isOpen: isImportOpen,
    onOpen: onImportOpen,
    onClose: onImportClose,
  } = useDisclosure();
  const {
    isOpen: isContactReviewOpen,
    onOpen: onContactReviewOpen,
    onClose: onContactReviewClose,
  } = useDisclosure();
  const {
    isOpen: isBuyerSuccessOpen,
    onOpen: onBuyerSuccessOpen,
    onClose: onBuyerSuccessClose,
  } = useDisclosure();
  const {
    isOpen: isSaleDetailsOpen,
    onOpen: onSaleDetailsOpen,
    onClose: onSaleDetailsClose,
  } = useDisclosure();
  const { auth, buyerStore, shopStore } = stores;

  const [buyers, setBuyers] = useState<BuyerProfile[]>([]);
  const [activePartyType, setActivePartyType] = useState<"customer" | "supplier">("customer");
  const [selectedLedgerBuyer, setSelectedLedgerBuyer] = useState<BuyerProfile | null>(null);
  const [ledgerEntries, setLedgerEntries] = useState<BuyerLedgerEntry[]>([]);
  const [saleRecords, setSaleRecords] = useState<BuyerSaleRecord[]>([]);
  const [ledgerSummary, setLedgerSummary] = useState<LedgerSummary>(defaultLedgerSummary);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [ledgerLoading, setLedgerLoading] = useState(false);
  const [saleLoading, setSaleLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [ledgerSubmitting, setLedgerSubmitting] = useState(false);
  const [saleSubmitting, setSaleSubmitting] = useState(false);
  const [isImportingContacts, setIsImportingContacts] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReversing, setIsReversing] = useState(false);
  const [postingSaleId, setPostingSaleId] = useState("");

  const [selectedBuyer, setSelectedBuyer] = useState<BuyerProfile | null>(null);
  const [selectedLedgerEntry, setSelectedLedgerEntry] = useState<BuyerLedgerEntry | null>(null);
  const [selectedSaleRecord, setSelectedSaleRecord] = useState<BuyerSaleRecord | null>(null);
  const [saleRecordDetails, setSaleRecordDetails] = useState<BuyerSaleRecordDetails | null>(null);
  const [saleDetailsLoading, setSaleDetailsLoading] = useState(false);
  const [invoiceDownloadingSaleId, setInvoiceDownloadingSaleId] = useState("");
  const [invoiceDownloadingLedgerEntryId, setInvoiceDownloadingLedgerEntryId] = useState("");
  const [activeSaleItemIndex, setActiveSaleItemIndex] = useState<number | null>(null);
  const [saleItemSuggestions, setSaleItemSuggestions] = useState<InventoryProductSuggestion[]>([]);
  const [saleItemSuggestionsLoading, setSaleItemSuggestionsLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [ledgerPage, setLedgerPage] = useState(1);
  const [ledgerTotalPages, setLedgerTotalPages] = useState(1);
  const [ledgerTotal, setLedgerTotal] = useState(0);
  const [salePage, setSalePage] = useState(1);
  const [saleTotalPages, setSaleTotalPages] = useState(1);
  const [saleTotal, setSaleTotal] = useState(0);
  const [ledgerTabIndex, setLedgerTabIndex] = useState(0);

  const limit = 10;
  const ledgerLimit = 10;
  const saleLimit = 10;

  const [formValues, setFormValues] = useState(getDefaultBuyerFormValues);
  const [showContactExtraFields, setShowContactExtraFields] = useState(false);
  const [isPickedContactFlow, setIsPickedContactFlow] = useState(false);
  const [lastCreatedBuyer, setLastCreatedBuyer] = useState<BuyerProfile | null>(null);

  const [ledgerFormValues, setLedgerFormValues] = useState({
    entryType: "sale" as LedgerEntryType,
    amount: "",
    direction: "debit" as LedgerDirection,
    referenceType: "manual" as LedgerReferenceType,
    referenceId: "",
    linkedLedgerEntryId: "",
    linkedSaleRecordId: "",
    entryDate: "",
    notes: "",
  });
  const [saleFormValues, setSaleFormValues] = useState({
    saleDate: "",
    notes: "",
    postToLedger: true,
    items: [defaultSaleFormItem()],
  });
  const [importDefaultTags, setImportDefaultTags] = useState("");

  const companyId = useMemo(() => auth.company?._id || auth.company || "", [auth.company]);
  const isMobileLedgerView = useBreakpointValue({ base: true, md: false }) ?? false;
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isDesktopBuyerView, setIsDesktopBuyerView] = useState(false);
  const isAndroidRuntime = useMemo(() => {
    if (typeof window === "undefined") return false;
    const platform = (window as any)?.Capacitor?.getPlatform?.();
    return platform === "android";
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateMobileDeviceState = () => {
      const platform = (window as any)?.Capacitor?.getPlatform?.();
      const userAgent = window.navigator?.userAgent || "";
      const isMobileUserAgent = /Android|iPhone|iPad|iPod|Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent,
      );
      const isCompactViewport = window.innerWidth < 1024;
      const nextIsMobileDevice = Boolean(
        isMobileUserAgent || platform === "android" || platform === "ios" || isCompactViewport,
      );
      setIsMobileDevice(nextIsMobileDevice);
      setIsDesktopBuyerView(!nextIsMobileDevice);
    };

    updateMobileDeviceState();
    window.addEventListener("resize", updateMobileDeviceState);

    return () => {
      window.removeEventListener("resize", updateMobileDeviceState);
    };
  }, []);

  const useCompactLedgerView = isMobileLedgerView || isAndroidRuntime || isMobileDevice;
  const useCompactBuyerView = !isDesktopBuyerView;
  const canUseDeviceContactImport = isAndroidRuntime;
  const activeSaleItemQuery = useMemo(() => {
    if (activeSaleItemIndex === null) {
      return "";
    }

    return saleFormValues.items[activeSaleItemIndex]?.itemName?.trim() || "";
  }, [activeSaleItemIndex, saleFormValues.items]);

  const getBuyerDisplayName = (buyer: BuyerProfile) => {
    return buyer.displayName || buyer.buyerId?.fullName || "-";
  };
  const normalizedActivePartyType = activePartyType === "supplier" ? "supplier" : "customer";
  const isSupplierTab = normalizedActivePartyType === "supplier";
  const partySingularLabel = isSupplierTab ? "Supplier" : "Customer";
  const partyPluralLabel = isSupplierTab ? "Suppliers" : "Customers";
  const selectedPartyType = (selectedLedgerBuyer?.partyType || normalizedActivePartyType) as "customer" | "supplier";
  const isSelectedSupplier = selectedPartyType === "supplier";
  const transactionSingularLabel = isSupplierTab ? "Purchase" : "Sale";
  const selectedTransactionSingularLabel = isSelectedSupplier ? "Purchase" : "Sale";
  const selectedTransactionPluralLabel = isSelectedSupplier ? "Purchases" : "Sales";
  const companyDisplayName =
    (typeof auth.company === "object" && auth.company?.companyName) ||
    (typeof auth.company === "object" && auth.company?.name) ||
    "My Business";
  const buyerOverview = useMemo(() => {
    return buyers.reduce(
      (summary, buyer) => {
        const outstanding = Number(buyer.outstandingBalance || 0);
        const partyType = (buyer.partyType || normalizedActivePartyType) === "supplier" ? "supplier" : "customer";
        if (outstanding >= 0) {
          if (partyType === "supplier") {
            summary.payable += outstanding;
          } else {
            summary.receivable += outstanding;
          }
        } else {
          if (partyType === "supplier") {
            summary.receivable += Math.abs(outstanding);
          } else {
            summary.payable += Math.abs(outstanding);
          }
        }

        if (!buyer.isBlocked) {
          summary.active += 1;
        }

        return summary;
      },
      { receivable: 0, payable: 0, active: 0 },
    );
  }, [buyers, normalizedActivePartyType]);
  const outstandingHeadlineLabel = isSupplierTab ? "You will give" : "You will get";
  const oppositeOutstandingLabel = isSupplierTab ? "You will get" : "You will give";
  const mobileLeftSummary = isSupplierTab
    ? {
        label: oppositeOutstandingLabel,
        value: buyerOverview.receivable,
        color: "green.500",
      }
    : {
        label: oppositeOutstandingLabel,
        value: buyerOverview.payable,
        color: "red.500",
      };
  const mobileRightSummary = isSupplierTab
    ? {
        label: outstandingHeadlineLabel,
        value: buyerOverview.payable,
        color: "red.500",
      }
    : {
        label: outstandingHeadlineLabel,
        value: buyerOverview.receivable,
        color: "green.500",
      };

  const formatCurrency = (amount: number) => `Rs ${Number(amount || 0).toFixed(2)}`;
  const formatDateTime = (value?: string) => (value ? new Date(value).toLocaleString() : "-");
  const formatShortId = (value?: string) => (value ? value.slice(-6) : "");
  const formatDateOnly = (value?: string) =>
    value ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-";
  const formatCompactCurrency = (amount: number) => {
    const numericAmount = Number(amount || 0);
    const hasDecimals = Math.abs(numericAmount % 1) > 0;
    return `Rs ${numericAmount.toLocaleString("en-IN", {
      minimumFractionDigits: hasDecimals ? 2 : 0,
      maximumFractionDigits: hasDecimals ? 2 : 0,
    })}`;
  };
  const formatRelativeTime = (value?: string) => {
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
  const getBuyerInitials = (buyer: BuyerProfile) => {
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
  const getBuyerSecondaryLabel = (buyer: BuyerProfile) => {
    const relativeLabel = formatRelativeTime(buyer.updatedAt || buyer.createdAt);
    const sourceLabel = buyer.source ? buyer.source.charAt(0).toUpperCase() + buyer.source.slice(1) : "Manual";
    return `${relativeLabel} - ${sourceLabel}`;
  };
  const splitPhoneParts = (value?: string) => {
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
  const composePhoneFromForm = () => {
    const localPhone = String(formValues.phoneNationalNumber || "").replace(/\D/g, "");
    const countryCode = String(formValues.phoneCountryCode || "")
      .replace(/[^\d+]/g, "")
      .trim();

    if (localPhone) {
      return `${countryCode || ""}${localPhone}`.trim();
    }

    return formValues.phone.trim();
  };
  const formatLedgerReference = (entry: BuyerLedgerEntry) =>
    entry.referenceId
      ? `${entry.referenceType || "manual"}: ${formatShortId(entry.referenceId)}`
      : entry.referenceType || "manual";
  const formatSignedAmount = (entry: BuyerLedgerEntry) =>
    `${entry.direction === "credit" ? "-" : "+"}${formatCurrency(Number(entry.amount || 0))}`;
  const getLinkedSaleRecordIdFromEntry = (entry?: BuyerLedgerEntry | null) => {
    if (!entry) {
      return "";
    }

    return (
      entry.linkedSaleRecordId ||
      (entry.referenceType === "saleRecord" ? entry.referenceId || "" : "")
    );
  };

  const canDownloadLedgerInvoice = (entry?: BuyerLedgerEntry | null) =>
    Boolean(
      entry &&
        entry.status !== "reversed" &&
        selectedPartyType !== "supplier" &&
        (Boolean(getLinkedSaleRecordIdFromEntry(entry)) || entry.direction === "debit"),
    );
  const getBuyerLedgerDirectionLabel = (
    direction: LedgerDirection,
    entryType?: LedgerEntryType,
    partyType: "customer" | "supplier" = selectedPartyType,
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
  const getBuyerLedgerDirectionColorScheme = (
    direction: LedgerDirection,
    entryType?: LedgerEntryType,
    partyType: "customer" | "supplier" = selectedPartyType,
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
  const getBuyerLedgerDirectionTextColor = (
    direction: LedgerDirection,
    entryType?: LedgerEntryType,
    partyType: "customer" | "supplier" = selectedPartyType,
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
  const getLedgerEntryTypeLabel = (
    entryType: LedgerEntryType,
    partyType: "customer" | "supplier" = selectedPartyType,
  ) => {
    if (entryType === "sale") {
      return partyType === "supplier" ? "Purchase" : "Sale";
    }
    if (entryType === "payment") {
      return "Payment";
    }
    return "Adjustment";
  };
  const getTimelineTitle = (entry: BuyerLedgerEntry) => {
    if (entry.relationType === "reversal") {
      return "Reversal Adjustment";
    }
    if (entry.isPrimarySaleLedgerEntry) {
      return "Posted To Ledger";
    }
    if (entry.entryType === "payment") {
      return isSelectedSupplier ? "Payment Sent" : "Payment Received";
    }
    if (entry.entryType === "adjustment") {
      return "Manual Adjustment";
    }
    return isSelectedSupplier ? "Purchase Ledger Entry" : "Sale Ledger Entry";
  };

  const fetchBuyers = async (pageToLoad = 1, query = search) => {
    if (!companyId) {
      return;
    }

    setLoading(true);
    try {
      const response = await buyerStore.listBuyerProfiles({
        companyId,
        partyType: normalizedActivePartyType,
        page: pageToLoad,
        limit,
        search: query?.trim() || undefined,
      });

      const list = response?.data?.buyers || [];
      const nextPage = response?.data?.page || pageToLoad;
      const nextTotalPages = response?.data?.totalPages || 1;
      const totalCount = response?.data?.total || 0;

      setBuyers(list);
      setPage(nextPage);
      setTotalPages(nextTotalPages);
      setTotal(totalCount);
    } catch (error: any) {
      toast({
        title: `Failed to load ${partyPluralLabel.toLowerCase()}`,
        description: error?.message || `Unable to fetch ${partyPluralLabel.toLowerCase()} list`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLedgerEntries = async (profileId: string, pageToLoad = 1) => {
    if (!profileId) {
      return;
    }

    setLedgerLoading(true);
    try {
      const response = await buyerStore.listBuyerLedgerEntries(profileId, {
        page: pageToLoad,
        limit: ledgerLimit,
      });

      const list = response?.data?.entries || [];
      const nextPage = response?.data?.page || pageToLoad;
      const nextTotalPages = response?.data?.totalPages || 1;
      const nextTotal = response?.data?.total || 0;
      const nextSummary = response?.data?.summary || defaultLedgerSummary;

      setLedgerEntries(list);
      setLedgerPage(nextPage);
      setLedgerTotalPages(nextTotalPages);
      setLedgerTotal(nextTotal);
      setLedgerSummary({
        totalDebit: Number(nextSummary.totalDebit || 0),
        totalCredit: Number(nextSummary.totalCredit || 0),
        outstandingBalance: Number(nextSummary.outstandingBalance || 0),
        creditLimit: Number(nextSummary.creditLimit || 0),
        isBlocked: Boolean(nextSummary.isBlocked),
      });
    } catch (error: any) {
      toast({
        title: "Failed to load ledger",
        description: error?.message || "Unable to fetch ledger entries",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLedgerLoading(false);
    }
  };

  const fetchSaleRecords = async (profileId: string, pageToLoad = 1) => {
    if (!profileId) {
      return;
    }

    setSaleLoading(true);
    try {
      const response = await buyerStore.listBuyerSaleRecords(profileId, {
        page: pageToLoad,
        limit: saleLimit,
      });

      const list = response?.data?.records || [];
      const nextPage = response?.data?.page || pageToLoad;
      const nextTotalPages = response?.data?.totalPages || 1;
      const nextTotal = response?.data?.total || 0;

      setSaleRecords(list);
      setSalePage(nextPage);
      setSaleTotalPages(nextTotalPages);
      setSaleTotal(nextTotal);
    } catch (error: any) {
      toast({
        title: `Failed to load ${transactionSingularLabel.toLowerCase()} records`,
        description: error?.message || `Unable to fetch ${transactionSingularLabel.toLowerCase()} records`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSaleLoading(false);
    }
  };

  const openLedgerView = async (buyer: BuyerProfile) => {
    setSelectedLedgerBuyer(buyer);
    setLedgerPage(1);
    setSalePage(1);
    setLedgerTabIndex(0);
    await Promise.all([fetchLedgerEntries(buyer._id, 1), fetchSaleRecords(buyer._id, 1)]);
  };

  const closeLedgerView = () => {
    setSelectedLedgerBuyer(null);
    setLedgerEntries([]);
    setSaleRecords([]);
    setLedgerSummary(defaultLedgerSummary);
    setLedgerPage(1);
    setLedgerTotalPages(1);
    setLedgerTotal(0);
    setSalePage(1);
    setSaleTotalPages(1);
    setSaleTotal(0);
    setLedgerTabIndex(0);
    setSelectedSaleRecord(null);
    setSaleRecordDetails(null);
    onSaleDetailsClose();
    resetSaleForm();
  };

  const closeSaleDetails = () => {
    setSelectedSaleRecord(null);
    setSaleRecordDetails(null);
    onSaleDetailsClose();
  };

  const blobToBase64 = (blob: Blob) =>
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

  const getFileNameFromContentDisposition = (contentDisposition?: string, fallback = "invoice.pdf") => {
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

  const readBlobErrorMessage = async (error: any, fallback = "Please try again.") => {
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

  const ensureNativeInvoiceStoragePermission = async () => {
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

  const deliverPdfBlob = async (pdfBlob: Blob, fileName: string) => {
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

  const handleDownloadSaleInvoice = async (details: BuyerSaleRecordDetails) => {
    const saleRecord = details?.saleRecord;
    if (!selectedLedgerBuyer?._id || !saleRecord?._id) {
      return;
    }

    setInvoiceDownloadingSaleId(saleRecord._id);
    try {
      const response = await buyerStore.downloadBuyerSaleRecordInvoice(selectedLedgerBuyer._id, saleRecord._id);
      const fileName = getFileNameFromContentDisposition(
        response?.headers?.["content-disposition"],
        `INV-${formatShortId(saleRecord._id).toUpperCase() || saleRecord._id}.pdf`,
      );
      const deliveryResult = await deliverPdfBlob(response.data, fileName);
      if (deliveryResult !== "cancelled") {
        toast({
          title:
            deliveryResult === "savedPrompted"
              ? "Invoice saved and ready to open"
              : deliveryResult === "saved"
              ? "Invoice saved to device"
              : deliveryResult === "shared"
                ? "Invoice ready to share"
                : "Invoice downloaded",
          description:
            deliveryResult === "savedPrompted" || deliveryResult === "saved"
              ? "Saved in Documents/BusinessSahayata/Invoices."
              : undefined,
          status: "success",
          duration: 2600,
          isClosable: true,
        });
      }
    } catch (error: any) {
      toast({
        title: "Failed to generate invoice",
        description: await readBlobErrorMessage(error),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setInvoiceDownloadingSaleId("");
    }
  };

  const handleDownloadLedgerEntryInvoice = async (entry: BuyerLedgerEntry) => {
    if (!selectedLedgerBuyer?._id || !entry?._id || !canDownloadLedgerInvoice(entry)) {
      return;
    }

    setInvoiceDownloadingLedgerEntryId(entry._id);
    try {
      const saleRecordId = getLinkedSaleRecordIdFromEntry(entry);
      const response = saleRecordId
        ? await buyerStore.downloadBuyerSaleRecordInvoice(selectedLedgerBuyer._id, saleRecordId)
        : await buyerStore.downloadBuyerLedgerEntryInvoice(selectedLedgerBuyer._id, entry._id);
      const fileName = getFileNameFromContentDisposition(
        response?.headers?.["content-disposition"],
        saleRecordId
          ? `INV-${formatShortId(saleRecordId).toUpperCase() || saleRecordId}.pdf`
          : `INV-MANUAL-${formatShortId(entry._id).toUpperCase() || entry._id}.pdf`,
      );
      const deliveryResult = await deliverPdfBlob(response.data, fileName);
      if (deliveryResult !== "cancelled") {
        toast({
          title:
            deliveryResult === "shared"
              ? saleRecordId
                ? "Invoice ready to share"
                : "Ledger invoice ready to share"
              : deliveryResult === "savedPrompted"
                ? saleRecordId
                  ? "Invoice saved and ready to open"
                  : "Ledger invoice saved and ready to open"
                : deliveryResult === "saved"
                ? saleRecordId
                  ? "Invoice saved to device"
                  : "Ledger invoice saved to device"
                : saleRecordId
                  ? "Invoice downloaded"
                  : "Ledger invoice downloaded",
          description:
            deliveryResult === "savedPrompted" || deliveryResult === "saved"
              ? "Saved in Documents/BusinessSahayata/Invoices."
              : undefined,
          status: "success",
          duration: 2600,
          isClosable: true,
        });
      }
    } catch (error: any) {
      toast({
        title: getLinkedSaleRecordIdFromEntry(entry) ? "Failed to generate invoice" : "Failed to generate ledger invoice",
        description: await readBlobErrorMessage(error),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setInvoiceDownloadingLedgerEntryId("");
    }
  };

  const openSaleDetails = async (record: BuyerSaleRecord) => {
    if (!selectedLedgerBuyer?._id) {
      return;
    }

    setSelectedSaleRecord(record);
    setSaleRecordDetails(null);
    setSaleDetailsLoading(true);
    onSaleDetailsOpen();

    try {
      const response = await buyerStore.getBuyerSaleRecordDetails(selectedLedgerBuyer._id, record._id);
      setSaleRecordDetails(response?.data || null);
    } catch (error: any) {
      toast({
        title: "Failed to load sale details",
        description: getReadableErrorMessage(error),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      closeSaleDetails();
    } finally {
      setSaleDetailsLoading(false);
    }
  };

  const openDeleteModal = (buyer: BuyerProfile) => {
    setSelectedBuyer(buyer);
    onDeleteOpen();
  };

  const resetForm = () => {
    setFormValues({
      ...getDefaultBuyerFormValues(),
      partyType: normalizedActivePartyType,
    });
    setShowContactExtraFields(false);
    setIsPickedContactFlow(false);
  };

  const resetLedgerForm = () => {
    setLedgerFormValues({
      entryType: "sale",
      amount: "",
      direction: "debit",
      referenceType: "manual",
      referenceId: "",
      linkedLedgerEntryId: "",
      linkedSaleRecordId: "",
      entryDate: "",
      notes: "",
    });
  };

  const resetSaleForm = () => {
    setSaleFormValues({
      saleDate: "",
      notes: "",
      postToLedger: true,
      items: [defaultSaleFormItem()],
    });
  };

  const closeImportModal = () => {
    onImportClose();
    setImportDefaultTags("");
  };

  const closeBuyerModal = () => {
    resetForm();
    onClose();
  };

  const closeContactReviewModal = () => {
    resetForm();
    onContactReviewClose();
  };

  const closeBuyerSuccessModal = () => {
    setLastCreatedBuyer(null);
    onBuyerSuccessClose();
  };

  const openManualBuyerModal = () => {
    resetForm();
    onOpen();
  };

  const openContactReviewForPickedContact = (contact: BuyerImportContact) => {
    const fullName = String(contact.fullName || "").trim();
    const email = String(contact.email || "").trim().toLowerCase();
    const phoneParts = splitPhoneParts(contact.phone);

    setFormValues({
      ...getDefaultBuyerFormValues(),
      fullName,
      displayName: fullName,
      email,
      phone: phoneParts.phone,
      phoneCountryCode: phoneParts.phoneCountryCode,
      phoneNationalNumber: phoneParts.phoneNationalNumber,
      partyType: normalizedActivePartyType,
    });
    setShowContactExtraFields(false);
    setIsPickedContactFlow(true);
    closeImportModal();
    onContactReviewOpen();
  };

  const closeSaleRecordModal = () => {
    onSaleRecordClose();
    setActiveSaleItemIndex(null);
    setSaleItemSuggestions([]);
    setSaleItemSuggestionsLoading(false);
    resetSaleForm();
  };

  const normalizeImportContacts = (contacts: BuyerImportContact[]): BuyerImportContact[] => {
    const unique = new Map<string, BuyerImportContact>();

    contacts.forEach((contact) => {
      const fullNameRaw = String(contact.fullName || "").trim();
      const phoneRaw = String(contact.phone || "").trim();
      const emailRaw = String(contact.email || "")
        .trim()
        .toLowerCase();

      const fullName = fullNameRaw ? fullNameRaw.slice(0, 120) : undefined;
      const phone = phoneRaw && isValidImportPhone(phoneRaw) ? phoneRaw : undefined;
      const email = emailRaw && isValidImportEmail(emailRaw) ? emailRaw : undefined;

      if (!phone && !email) {
        return;
      }

      const key = `${phone || ""}|${email || ""}`;
      if (!unique.has(key)) {
        unique.set(key, { fullName, phone, email });
      }
    });

    return Array.from(unique.values());
  };

  const mapDeviceContactToImportRow = (contact: any): BuyerImportContact => {
    const givenName = contact?.name?.given || contact?.givenName || "";
    const familyName = contact?.name?.family || contact?.familyName || "";
    const displayName =
      contact?.displayName ||
      contact?.name?.display ||
      [givenName, familyName].filter(Boolean).join(" ");
    const phone =
      contact?.phones?.[0]?.number ||
      contact?.phoneNumbers?.[0]?.number ||
      contact?.phone ||
      "";
    const email =
      contact?.emails?.[0]?.address ||
      contact?.emailAddresses?.[0]?.address ||
      contact?.email ||
      "";

    return {
      fullName: String(displayName || "").trim() || undefined,
      phone: String(phone || "").trim() || undefined,
      email: String(email || "").trim().toLowerCase() || undefined,
    };
  };

  const ensureDeviceContactsPermission = async (capacitorContacts: any) => {
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

  const submitImportedContacts = async (contacts: BuyerImportContact[]) => {
    if (!companyId) {
      toast({
        title: "Company not found",
        description: "Please create/select your shop first.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const normalizedContacts = normalizeImportContacts(contacts);
    if (!normalizedContacts.length) {
      toast({
        title: "No valid contacts",
        description: "At least one contact must contain phone or email.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const defaultTags = importDefaultTags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const batchSize = 200;
    const batches: BuyerImportContact[][] = [];
    for (let index = 0; index < normalizedContacts.length; index += batchSize) {
      batches.push(normalizedContacts.slice(index, index + batchSize));
    }

    setIsImportingContacts(true);
    try {
      const importViaUpsertFallback = async () => {
        const fallbackSummary = {
          totalReceived: normalizedContacts.length,
          processed: 0,
          created: 0,
          updated: 0,
          skipped: 0,
          failed: 0,
        };

        for (const contact of normalizedContacts) {
          try {
            await buyerStore.upsertBuyer({
              companyId,
              partyType: normalizedActivePartyType,
              fullName: contact.fullName || undefined,
              phone: contact.phone || undefined,
              email: contact.email || undefined,
              tags: defaultTags.length ? defaultTags : undefined,
              source: "import",
            });
            fallbackSummary.processed += 1;
            fallbackSummary.updated += 1;
          } catch (_upsertError: any) {
            fallbackSummary.failed += 1;
          }
        }

        return fallbackSummary;
      };

      const combinedSummary = {
        totalReceived: 0,
        processed: 0,
        created: 0,
        updated: 0,
        skipped: 0,
        failed: 0,
      };
      let lastBatchError: any = null;
      let usedUpsertFallback = false;

      for (const batch of batches) {
        try {
          const response = await buyerStore.importBuyerContacts({
            companyId,
            partyType: normalizedActivePartyType,
            contacts: batch,
            defaultTags: defaultTags.length ? defaultTags : undefined,
          });

          const summary = response?.data?.summary || {};
          combinedSummary.totalReceived += Number(summary.totalReceived || batch.length);
          combinedSummary.processed += Number(summary.processed || 0);
          combinedSummary.created += Number(summary.created || 0);
          combinedSummary.updated += Number(summary.updated || 0);
          combinedSummary.skipped += Number(summary.skipped || 0);
          combinedSummary.failed += Number(summary.failed || 0);
        } catch (batchError: any) {
          if (isMissingImportEndpointError(batchError)) {
            usedUpsertFallback = true;
            break;
          }
          lastBatchError = batchError;
          combinedSummary.totalReceived += batch.length;
          combinedSummary.failed += batch.length;
        }
      }

      if (usedUpsertFallback) {
        const fallbackSummary = await importViaUpsertFallback();
        combinedSummary.totalReceived = fallbackSummary.totalReceived;
        combinedSummary.processed = fallbackSummary.processed;
        combinedSummary.created = fallbackSummary.created;
        combinedSummary.updated = fallbackSummary.updated;
        combinedSummary.skipped = fallbackSummary.skipped;
        combinedSummary.failed = fallbackSummary.failed;
      }

      if (combinedSummary.processed === 0 && combinedSummary.created === 0 && combinedSummary.updated === 0) {
        throw lastBatchError || new Error("No contacts were imported");
      }

      toast({
        title: "Contacts import completed",
        description: `${combinedSummary.processed} processed (${combinedSummary.created} created, ${combinedSummary.updated} updated, ${combinedSummary.skipped} skipped, ${combinedSummary.failed} failed)${usedUpsertFallback ? " via legacy fallback" : ""}`,
        status: combinedSummary.failed > 0 ? "warning" : "success",
        duration: 4500,
        isClosable: true,
      });

      closeImportModal();
      await fetchBuyers(1, search);
    } catch (error: any) {
      toast({
        title: "Failed to import contacts",
        description: getReadableErrorMessage(error),
        status: "error",
        duration: 3500,
        isClosable: true,
      });
    } finally {
      setIsImportingContacts(false);
    }
  };

  const fetchContactsFromDevice = async (): Promise<BuyerImportContact[]> => {
    const windowObj: any = window as any;
    const capacitorContacts = windowObj?.Capacitor?.Plugins?.Contacts;

    if (capacitorContacts?.getContacts) {
      await ensureDeviceContactsPermission(capacitorContacts);

      const response = await capacitorContacts.getContacts({
        projection: {
          name: true,
          phones: true,
          emails: true,
        },
      });
      const contacts = Array.isArray(response?.contacts) ? response.contacts : [];

      return contacts
        .map((contact: any) => mapDeviceContactToImportRow(contact))
        .filter((item: BuyerImportContact) => item.phone || item.email);
    }

    throw new Error("Device contacts access is not available on this device/browser");
  };

  const pickSingleContactFromDevice = async (): Promise<BuyerImportContact[]> => {
    const windowObj: any = window as any;
    const capacitorContacts = windowObj?.Capacitor?.Plugins?.Contacts;

    if (!capacitorContacts?.pickContact) {
      throw new Error("Contact picker is not available on this device");
    }

    await ensureDeviceContactsPermission(capacitorContacts);

    const response = await capacitorContacts.pickContact({
      projection: {
        name: true,
        phones: true,
        emails: true,
      },
    });
    const selectedContact = response?.contact ? mapDeviceContactToImportRow(response.contact) : null;

    if (!selectedContact || (!selectedContact.phone && !selectedContact.email)) {
      throw new Error("Selected contact does not have a phone number or email");
    }

    return [selectedContact];
  };

  const importContactsWith = async (
    importFn: () => Promise<BuyerImportContact[]>,
    emptySelectionMessage: string,
  ) => {
    try {
      setIsImportingContacts(true);
      const contacts = await importFn();
      if (!contacts.length) {
        toast({
          title: "No contacts selected",
          description: emptySelectionMessage,
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      await submitImportedContacts(contacts);
    } catch (error: any) {
      toast({
        title: "Unable to read device contacts",
        description: getReadableErrorMessage(
          error,
          `Grant contacts permission in app settings, or add the ${partySingularLabel.toLowerCase()} manually.`,
        ),
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsImportingContacts(false);
    }
  };

  const handlePickSingleContact = async () => {
    try {
      setIsImportingContacts(true);
      const contacts = await pickSingleContactFromDevice();
      const pickedContact = contacts[0];

      if (!pickedContact) {
        toast({
          title: "No contacts selected",
          description: "Choose one contact to continue.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      openContactReviewForPickedContact(pickedContact);
    } catch (error: any) {
      toast({
        title: "Unable to read device contacts",
        description: getReadableErrorMessage(
          error,
          `Grant contacts permission in app settings, or add the ${partySingularLabel.toLowerCase()} manually.`,
        ),
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsImportingContacts(false);
    }
  };

  const handleImportFromDevice = async () =>
    importContactsWith(fetchContactsFromDevice, "No contacts were returned from the device.");

  const handleCreateBuyer = async () => {
    if (!companyId) {
      toast({
        title: "Company not found",
        description: "Please create/select your shop first.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const composedPhone = composePhoneFromForm();

    if (!composedPhone.trim() && !formValues.email.trim()) {
      toast({
        title: "Validation failed",
        description: "Provide at least phone or email.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setSubmitting(true);
    try {
      const tagsArray = formValues.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const addressEntry = {
        label: "Primary",
        addressLine1: formValues.addressLine1.trim(),
        addressLine2: formValues.addressLine2.trim(),
        city: formValues.city.trim(),
        state: formValues.state.trim(),
        postalCode: formValues.postalCode.trim(),
        country: formValues.country.trim(),
      };
      const hasAddressEntry = Object.values(addressEntry).some((value) => Boolean(String(value || "").trim()));

      const response = await buyerStore.upsertBuyer({
        companyId,
        partyType: formValues.partyType,
        fullName: formValues.fullName.trim() || undefined,
        phone: composedPhone.trim() || undefined,
        email: formValues.email.trim() || undefined,
        displayName: formValues.displayName.trim() || formValues.fullName.trim() || undefined,
        tags: tagsArray.length ? tagsArray : undefined,
        addressBook: hasAddressEntry ? [addressEntry] : undefined,
        notes: formValues.notes.trim() || undefined,
        source: isPickedContactFlow ? "import" : "manual",
      });

      const savedProfile = response?.data?.profile || null;
      setLastCreatedBuyer(savedProfile);

      if (isPickedContactFlow) {
        onContactReviewClose();
        onBuyerSuccessOpen();
      } else {
        toast({
          title: `${formValues.partyType === "supplier" ? "Supplier" : "Customer"} saved`,
          description: `${formValues.partyType === "supplier" ? "Supplier" : "Customer"} profile has been created/updated.`,
          status: "success",
          duration: 2500,
          isClosable: true,
        });
      }

      resetForm();
      if (!isPickedContactFlow) {
        onClose();
      }
      await fetchBuyers(1);
    } catch (error: any) {
      toast({
        title: `Failed to save ${formValues.partyType === "supplier" ? "supplier" : "customer"}`,
        description: error?.message || "Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateLedgerEntry = async () => {
    if (!selectedLedgerBuyer?._id) {
      return;
    }

    const parsedAmount = Number(ledgerFormValues.amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      toast({
        title: "Validation failed",
        description: "Amount must be greater than 0.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (ledgerFormValues.entryType === "adjustment" && !ledgerFormValues.direction) {
      toast({
        title: "Validation failed",
        description: "Direction is required for adjustment entries.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLedgerSubmitting(true);
    try {
      const payload: any = {
        entryType: ledgerFormValues.entryType,
        amount: parsedAmount,
        referenceType: ledgerFormValues.referenceType || undefined,
        referenceId: ledgerFormValues.referenceId.trim() || undefined,
        linkedLedgerEntryId: ledgerFormValues.linkedLedgerEntryId.trim() || undefined,
        linkedSaleRecordId: ledgerFormValues.linkedSaleRecordId.trim() || undefined,
        notes: ledgerFormValues.notes.trim() || undefined,
        entryDate: ledgerFormValues.entryDate
          ? new Date(ledgerFormValues.entryDate).toISOString()
          : undefined,
      };

      if (ledgerFormValues.entryType === "adjustment") {
        payload.direction = ledgerFormValues.direction;
      }

      await buyerStore.createBuyerLedgerEntry(selectedLedgerBuyer._id, payload);

      toast({
        title: "Ledger entry saved",
        status: "success",
        duration: 2500,
        isClosable: true,
      });

      resetLedgerForm();
      onLedgerEntryClose();
      setLedgerPage(1);
      await fetchLedgerEntries(selectedLedgerBuyer._id, 1);
      await fetchBuyers(page, search);
    } catch (error: any) {
      toast({
        title: "Failed to save ledger entry",
        description: error?.message || "Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLedgerSubmitting(false);
    }
  };

  const updateSaleItem = (index: number, key: keyof SaleFormItem, value: string) => {
    setSaleFormValues((prev) => ({
      ...prev,
      items: prev.items.map((item, idx) =>
        idx === index
          ? {
              ...item,
              [key]: value,
              ...(key === "itemName" ? { productId: "" } : {}),
            }
          : item,
      ),
    }));
  };

  const applySuggestedProductToSaleItem = (index: number, product: InventoryProductSuggestion) => {
    setSaleFormValues((prev) => ({
      ...prev,
      items: prev.items.map((item, idx) =>
        idx === index
          ? {
              ...item,
              productId: product._id,
              itemName: product.name,
              unitPrice:
                typeof product.price === "number" && Number.isFinite(product.price)
                  ? String(product.price)
                  : item.unitPrice,
            }
          : item,
      ),
    }));
    setActiveSaleItemIndex(null);
    setSaleItemSuggestions([]);
    setSaleItemSuggestionsLoading(false);
  };

  const addSaleItem = () => {
    setSaleFormValues((prev) => ({
      ...prev,
      items: [...prev.items, defaultSaleFormItem()],
    }));
  };

  const removeSaleItem = (index: number) => {
    setSaleFormValues((prev) => {
      if (prev.items.length <= 1) {
        return prev;
      }
      return {
        ...prev,
        items: prev.items.filter((_, idx) => idx !== index),
      };
    });
    setActiveSaleItemIndex((current) => {
      if (current === null) {
        return null;
      }
      if (current === index) {
        return null;
      }
      return current > index ? current - 1 : current;
    });
  };

  const calculateSaleLineTotal = (item: SaleFormItem) => {
    const quantity = Number(item.quantity || 0);
    const unitPrice = Number(item.unitPrice || 0);
    const discount = Math.max(Number(item.discount || 0), 0);
    const tax = Math.max(Number(item.tax || 0), 0);
    const subtotal = Math.max(quantity * unitPrice, 0);
    const cappedDiscount = Math.min(discount, subtotal);
    return Math.max(subtotal - cappedDiscount + tax, 0);
  };

  const handleCreateSaleRecord = async () => {
    if (!selectedLedgerBuyer?._id) {
      return;
    }

    const sanitizedItems: any[] = [];

    for (const item of saleFormValues.items) {
      const itemName = item.itemName.trim();
      const quantity = Number(item.quantity || 0);
      const unitPrice = Number(item.unitPrice || 0);
      const discount = Math.max(Number(item.discount || 0), 0);
      const tax = Math.max(Number(item.tax || 0), 0);

      if (!itemName) {
        toast({
          title: "Validation failed",
          description: "Item name is required for each row.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      if (!Number.isFinite(quantity) || quantity <= 0) {
        toast({
          title: "Validation failed",
          description: "Quantity must be greater than 0.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      if (!Number.isFinite(unitPrice) || unitPrice < 0) {
        toast({
          title: "Validation failed",
          description: "Unit price must be 0 or more.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      sanitizedItems.push({
        itemName,
        quantity,
        unitPrice,
        discount,
        tax,
      });
    }

    setSaleSubmitting(true);
    try {
      await buyerStore.createBuyerSaleRecord(selectedLedgerBuyer._id, {
        saleDate: saleFormValues.saleDate ? new Date(saleFormValues.saleDate).toISOString() : undefined,
        notes: saleFormValues.notes.trim() || undefined,
        postToLedger: Boolean(saleFormValues.postToLedger),
        source: "manual",
        items: sanitizedItems,
      });

      toast({
        title: `${selectedTransactionSingularLabel} record saved`,
        status: "success",
        duration: 2500,
        isClosable: true,
      });

      closeSaleRecordModal();
      setSalePage(1);
      await fetchSaleRecords(selectedLedgerBuyer._id, 1);

      if (saleFormValues.postToLedger) {
        setLedgerPage(1);
        await fetchLedgerEntries(selectedLedgerBuyer._id, 1);
        await fetchBuyers(page, search);
      }
    } catch (error: any) {
      toast({
        title: `Failed to save ${selectedTransactionSingularLabel.toLowerCase()} record`,
        description: error?.message || "Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSaleSubmitting(false);
    }
  };

  const handlePostSaleRecordToLedger = async (saleId: string) => {
    if (!selectedLedgerBuyer?._id || !saleId) {
      return;
    }

    setPostingSaleId(saleId);
    try {
      await buyerStore.postBuyerSaleRecordToLedger(selectedLedgerBuyer._id, saleId, {});
      toast({
        title: `${selectedTransactionSingularLabel} posted to ledger`,
        status: "success",
        duration: 2500,
        isClosable: true,
      });

      setLedgerPage(1);
      await Promise.all([
        fetchSaleRecords(selectedLedgerBuyer._id, salePage),
        fetchLedgerEntries(selectedLedgerBuyer._id, 1),
        fetchBuyers(page, search),
      ]);
    } catch (error: any) {
      toast({
        title: `Failed to post ${selectedTransactionSingularLabel.toLowerCase()}`,
        description: error?.message || "Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setPostingSaleId("");
    }
  };

  const openReverseModal = (entry: BuyerLedgerEntry) => {
    setSelectedLedgerEntry(entry);
    onReverseOpen();
  };

  const openPayModal = (entry: BuyerLedgerEntry) => {
    const linkedSaleRecordId =
      entry.linkedSaleRecordId ||
      (entry.referenceType === "saleRecord" ? entry.referenceId || "" : "");

    setLedgerFormValues({
      entryType: "payment",
      amount: String(entry.amount),
      direction: "credit",
      referenceType: entry.referenceType || "manual",
      referenceId: entry.referenceId || entry._id || "",
      linkedLedgerEntryId: entry._id || "",
      linkedSaleRecordId,
      entryDate: new Date().toISOString().split("T")[0],
      notes: `Payment for ${entry.referenceType || 'entry'} ${entry.referenceId || entry._id}`,
    });
    onLedgerEntryOpen();
  };

  const confirmReverse = async () => {
    if (!selectedLedgerBuyer?._id || !selectedLedgerEntry?._id) {
      return;
    }

    setIsReversing(true);
    try {
      await buyerStore.reverseBuyerLedgerEntry(selectedLedgerBuyer._id, selectedLedgerEntry._id, {});

      toast({
        title: "Ledger entry reversed",
        status: "success",
        duration: 2500,
        isClosable: true,
      });

      onReverseClose();
      const nextPage = ledgerEntries.length === 1 && ledgerPage > 1 ? ledgerPage - 1 : ledgerPage;
      await fetchLedgerEntries(selectedLedgerBuyer._id, nextPage);
      await fetchBuyers(page, search);
    } catch (error: any) {
      toast({
        title: "Failed to reverse entry",
        description: error?.message || "Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsReversing(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedBuyer?._id) {
      return;
    }

    setIsDeleting(true);
    try {
      await buyerStore.deleteBuyerProfile(selectedBuyer._id);
      toast({
        title: `${selectedBuyer.partyType === "supplier" ? "Supplier" : "Customer"} deleted`,
        status: "success",
        duration: 2500,
        isClosable: true,
      });
      onDeleteClose();
      const nextPage = buyers.length === 1 && page > 1 ? page - 1 : page;
      fetchBuyers(nextPage, search);
    } catch (error: any) {
      toast({
        title: `Failed to delete ${selectedBuyer?.partyType === "supplier" ? "supplier" : "customer"}`,
        description: error?.message || "Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (!companyId || selectedLedgerBuyer) return;
    const timer = setTimeout(() => fetchBuyers(1, search), 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, search, selectedLedgerBuyer, normalizedActivePartyType]);

  useEffect(() => {
    if (!isSaleRecordOpen || !companyId || activeSaleItemIndex === null) {
      setSaleItemSuggestions([]);
      setSaleItemSuggestionsLoading(false);
      return;
    }

    const query = activeSaleItemQuery.trim();
    if (!query) {
      setSaleItemSuggestions([]);
      setSaleItemSuggestionsLoading(false);
      return;
    }

    let isCancelled = false;
    const timeoutId = window.setTimeout(async () => {
      setSaleItemSuggestionsLoading(true);
      try {
        const response = await shopStore.getShopProducts(
          {
            company: companyId,
            page: 1,
            limit: 8,
            search: query,
          },
          true,
        );

        if (isCancelled) {
          return;
        }

        const suggestions: InventoryProductSuggestion[] = (response?.data?.products || []).map((product: any) => ({
          _id: String(product?._id || ""),
          name: String(product?.name || ""),
          price:
            typeof product?.price === "number" || typeof product?.price === "string"
              ? Number(product.price)
              : undefined,
          stock:
            typeof product?.stock === "number" || typeof product?.stock === "string"
              ? Number(product.stock)
              : undefined,
          brand: product?.brand ? String(product.brand) : undefined,
          sku: product?.sku ? String(product.sku) : undefined,
        }));

        const normalizedQuery = query.toLowerCase();
        const filteredSuggestions = suggestions
          .filter(
            (product) =>
              product._id &&
              product.name &&
              (product.name.toLowerCase().includes(normalizedQuery) ||
                product.brand?.toLowerCase().includes(normalizedQuery) ||
                product.sku?.toLowerCase().includes(normalizedQuery)),
          )
          .sort((first, second) => {
            const firstStartsWith = first.name.toLowerCase().startsWith(normalizedQuery) ? 1 : 0;
            const secondStartsWith = second.name.toLowerCase().startsWith(normalizedQuery) ? 1 : 0;
            if (firstStartsWith !== secondStartsWith) {
              return secondStartsWith - firstStartsWith;
            }
            return first.name.localeCompare(second.name);
          })
          .slice(0, 6);

        setSaleItemSuggestions(filteredSuggestions);
      } catch {
        if (!isCancelled) {
          setSaleItemSuggestions([]);
        }
      } finally {
        if (!isCancelled) {
          setSaleItemSuggestionsLoading(false);
        }
      }
    }, 250);

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [activeSaleItemIndex, activeSaleItemQuery, companyId, isSaleRecordOpen, shopStore]);

  const buyerTableData = useMemo(() => {
    return buyers.map((buyer) => ({
      ...buyer,
      name: getBuyerDisplayName(buyer),
      phone: buyer.buyerId?.phoneE164 || "-",
      email: buyer.buyerId?.emailNormalized || "-",
      sourceBadge: (
        <Badge colorScheme="purple" textTransform="capitalize">
          {buyer.source || "manual"}
        </Badge>
      ),
      outstandingText: formatCurrency(Number(buyer.outstandingBalance || 0)),
      statusBadge: (
        <Badge colorScheme={buyer.isBlocked ? "red" : "green"}>
          {buyer.isBlocked ? "Blocked" : "Active"}
        </Badge>
      ),
      tagsDisplay:
        buyer.tags && buyer.tags.length ? (
          <HStack spacing={1} wrap="wrap">
            {buyer.tags.slice(0, 3).map((tag, idx) => (
              <Badge key={`${buyer._id}-${tag}-${idx}`} colorScheme="gray">
                {tag}
              </Badge>
            ))}
          </HStack>
        ) : (
          "-"
        ),
    }));
  }, [buyers]);

  const buyerColumns = [
    { headerName: "Name", key: "name" },
    { headerName: "Phone", key: "phone" },
    { headerName: "Email", key: "email" },
    {
      headerName: "Source",
      key: "sourceBadge",
      type: "component",
      metaData: { component: (row: any) => row.sourceBadge },
    },
    { headerName: "Outstanding", key: "outstandingText" },
    {
      headerName: "Status",
      key: "statusBadge",
      type: "component",
      metaData: { component: (row: any) => row.statusBadge },
    },
    {
      headerName: "Tags",
      key: "tagsDisplay",
      type: "component",
      metaData: { component: (row: any) => row.tagsDisplay },
    },
    { headerName: "Action", key: "action", type: "table-actions", props: { isSticky: true } },
  ];

  const buyerTableActions = {
    actionBtn: {
      viewKey: {
        showViewButton: true,
        title: "View Ledger",
        function: (row: BuyerProfile) => openLedgerView(row),
      },
      deleteKey: {
        showDeleteButton: true,
        title: `Delete ${partySingularLabel}`,
        function: (row: BuyerProfile) => openDeleteModal(row),
      },
    },
    pagination: {
      show: true,
      currentPage: page,
      totalPages: totalPages || 1,
      limit,
      onClick: (nextPage: number) => {
        setPage(nextPage);
        fetchBuyers(nextPage, search);
      },
    },
    search: {
      show: true,
      placeholder: "Search by name, phone or email",
      searchValue: search,
      onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value),
    },
  };

  const renderBuyerProfilesMobile = () => (
    <Box
      bg="#F4F7FC"
      borderRadius={{ base: "none", md: "3xl" }}
      mx={{ base: -2, md: 0 }}
      mt={{ base: -2, md: 0 }}
      overflow="hidden"
      pb="120px"
    >
      <Box
        bgGradient="linear(160deg, #0A4E9D 0%, #1668C1 58%, #1E7AD7 100%)"
        px={{ base: 4, sm: 5 }}
        pt={{ base: 5, sm: 6 }}
        pb={{ base: 8, sm: 9 }}
      >
        <VStack align="stretch" spacing={5}>
          <Flex justify="space-between" align="start" gap={3}>
            <Box minW={0} flex="1">
              <Text fontSize="xs" fontWeight="800" letterSpacing="0.16em" textTransform="uppercase" color="whiteAlpha.700">
                {isSupplierTab ? "Supplier Ledger" : "Customer Ledger"}
              </Text>
              <Heading size="md" color="white" mt={1} noOfLines={2}>
                {companyDisplayName}
              </Heading>
              <Text fontSize="sm" color="whiteAlpha.800" mt={1} maxW="260px">
                {isSupplierTab
                  ? "Track suppliers, payables, and payment status from one place."
                  : "Track customers, dues, and collection status from one place."}
              </Text>
            </Box>
            <Button
              size="sm"
              leftIcon={<Icon as={FiUserPlus} boxSize={4} />}
              variant="outline"
              borderRadius="full"
              color="white"
              borderColor="whiteAlpha.500"
              _hover={{ bg: "whiteAlpha.200" }}
              _active={{ bg: "whiteAlpha.300" }}
              onClick={openManualBuyerModal}
              flexShrink={0}
            >
              Add {partySingularLabel}
            </Button>
          </Flex>

          <HStack spacing={6} align="end">
            <Box position="relative" pb={2} cursor="pointer" onClick={() => setActivePartyType("customer")}>
              <Text fontSize="lg" fontWeight="900" color="white">
                Customers
              </Text>
              {normalizedActivePartyType === "customer" ? (
                <Box position="absolute" left={0} bottom={0} h="3px" w="100%" bg="#FFB13B" borderRadius="full" />
              ) : null}
            </Box>
            <VStack
              align="start"
              spacing={0}
              pb={2}
              opacity={normalizedActivePartyType === "supplier" ? 1 : 0.72}
              cursor="pointer"
              onClick={() => setActivePartyType("supplier")}
            >
              <Text fontSize="lg" fontWeight="800" color="white">
                Suppliers
              </Text>
              {normalizedActivePartyType === "supplier" ? (
                <Box mt={1} h="3px" w="100%" bg="#FFB13B" borderRadius="full" />
              ) : null}
            </VStack>
          </HStack>

          <Box bg="white" borderRadius="24px" shadow="0 18px 40px rgba(5, 44, 92, 0.22)" overflow="hidden">
            <SimpleGrid columns={2}>
              <VStack spacing={1} px={4} py={4} align="center">
                <Text fontSize="sm" color="gray.500" fontWeight="600">
                  {mobileLeftSummary.label}
                </Text>
                <Text fontSize="2xl" fontWeight="900" color={mobileLeftSummary.color}>
                  {formatCompactCurrency(mobileLeftSummary.value)}
                </Text>
              </VStack>
              <VStack spacing={1} px={4} py={4} align="center" borderLeftWidth="1px" borderLeftColor="gray.100">
                <Text fontSize="sm" color="gray.500" fontWeight="600">
                  {mobileRightSummary.label}
                </Text>
                <Text fontSize="2xl" fontWeight="900" color={mobileRightSummary.color}>
                  {formatCompactCurrency(mobileRightSummary.value)}
                </Text>
              </VStack>
            </SimpleGrid>
            <HStack justify="space-between" px={4} py={3} bg="#F8FBFF" borderTopWidth="1px" borderTopColor="#E5EEF9">
              <HStack spacing={2} color="#215E9D">
                <Icon as={FiUsers} boxSize={4} />
                  <Text fontSize="sm" fontWeight="700">
                  {total} {partyPluralLabel.toLowerCase()}
                  </Text>
              </HStack>
              <Text fontSize="xs" fontWeight="700" color="gray.500">
                {buyerOverview.active} active
              </Text>
            </HStack>
          </Box>
        </VStack>
      </Box>

      <Box px={{ base: 3, sm: 4 }} mt="-20px">
        <Box
          bg="white"
          borderRadius="24px"
          px={{ base: 3, sm: 4 }}
          py={3}
          shadow="0 12px 28px rgba(15, 23, 42, 0.08)"
          borderWidth="1px"
          borderColor="#E6EEF8"
        >
          <HStack spacing={3} align="stretch">
            <InputGroup flex="1">
              <InputLeftElement pointerEvents="none" h="100%">
                <Icon as={FiSearch} color="#2B6CB0" boxSize={5} />
              </InputLeftElement>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${partySingularLabel.toLowerCase()}`}
                bg="#F8FAFD"
                borderRadius="18px"
                borderColor="transparent"
                h="52px"
                pl={12}
                _placeholder={{ color: "gray.400" }}
                _focus={{ borderColor: "blue.200", bg: "white", boxShadow: "0 0 0 1px #90CDF4" }}
              />
            </InputGroup>
            <IconButton
              aria-label={`Add ${partySingularLabel.toLowerCase()} manually`}
              icon={<Icon as={FiUserPlus} boxSize={5} />}
              onClick={openManualBuyerModal}
              h="52px"
              minW="52px"
              borderRadius="18px"
              bg="#EFF6FF"
              color="#1E63B6"
              _hover={{ bg: "#DBEAFE" }}
            />
          </HStack>
        </Box>
      </Box>

      <VStack align="stretch" spacing={3} px={{ base: 3, sm: 4 }} pt={4}>
        {loading ? (
          <Box
            bg="white"
            borderRadius="24px"
            px={5}
            py={8}
            borderWidth="1px"
            borderColor="#E6EEF8"
            shadow="sm"
          >
            <VStack spacing={3}>
              <Spinner color="blue.500" thickness="3px" />
              <Text fontSize="sm" color="gray.500">
                Loading {partyPluralLabel.toLowerCase()}...
              </Text>
            </VStack>
          </Box>
        ) : buyers.length === 0 ? (
          <Box
            bg="white"
            borderRadius="24px"
            px={5}
            py={8}
            borderWidth="1px"
            borderColor="#E6EEF8"
            shadow="sm"
          >
            <VStack spacing={2}>
              <Icon as={FiUsers} boxSize={8} color="blue.300" />
              <Text fontWeight="700" color="gray.700">
                No {partyPluralLabel.toLowerCase()} found
              </Text>
              <Text fontSize="sm" color="gray.500" textAlign="center">
                Try a different search or add a new {partySingularLabel.toLowerCase()} to start the ledger.
              </Text>
            </VStack>
          </Box>
        ) : (
          buyers.map((buyer) => (
            <Box
              key={buyer._id}
              bg="white"
              borderRadius="24px"
              px={4}
              py={4}
              borderWidth="1px"
              borderColor="#E6EEF8"
              shadow="0 10px 24px rgba(15, 23, 42, 0.05)"
            >
              <HStack align="start" spacing={3}>
                <Flex
                  h="50px"
                  w="50px"
                  borderRadius="full"
                  bg={buyer.isBlocked ? "red.50" : "blue.50"}
                  color={buyer.isBlocked ? "red.500" : "#1957A5"}
                  align="center"
                  justify="center"
                  fontWeight="900"
                  fontSize="md"
                  flexShrink={0}
                >
                  {getBuyerInitials(buyer)}
                </Flex>

                <Box flex="1" minW={0}>
                  <Flex justify="space-between" align="start" gap={3}>
                    <Box minW={0}>
                      <Text fontSize="lg" fontWeight="800" color="gray.900" noOfLines={1}>
                        {getBuyerDisplayName(buyer)}
                      </Text>
                      <Text fontSize="sm" color="gray.500" mt={0.5}>
                        {getBuyerSecondaryLabel(buyer)}
                      </Text>
                    </Box>

                    <VStack spacing={1} align="end" flexShrink={0}>
                      <Text
                        fontSize="xl"
                        fontWeight="900"
                        color={
                          Number(buyer.outstandingBalance || 0) >= 0
                            ? buyer.partyType === "supplier"
                              ? "red.500"
                              : "green.500"
                            : buyer.partyType === "supplier"
                              ? "green.500"
                              : "red.500"
                        }
                        lineHeight="1"
                      >
                        {formatCompactCurrency(Math.abs(Number(buyer.outstandingBalance || 0)))}
                      </Text>
                      <Badge
                        borderRadius="full"
                        px={2.5}
                        py={0.5}
                        colorScheme={buyer.isBlocked ? "red" : "green"}
                        textTransform="uppercase"
                        fontSize="0.65rem"
                      >
                        {buyer.isBlocked ? "Blocked" : "Active"}
                      </Badge>
                    </VStack>
                  </Flex>

                  <VStack align="stretch" spacing={2} mt={3}>
                    <HStack spacing={2} color="gray.600" align="start">
                      <Icon as={FiPhone} boxSize={4} mt={0.5} color="blue.500" flexShrink={0} />
                      <Text fontSize="sm" fontWeight="500">
                        {buyer.buyerId?.phoneE164 || "-"}
                      </Text>
                    </HStack>
                    {buyer.buyerId?.emailNormalized ? (
                      <HStack spacing={2} color="gray.600" align="start">
                        <Icon as={FiMail} boxSize={4} mt={0.5} color="blue.500" flexShrink={0} />
                        <Text fontSize="sm" fontWeight="500" wordBreak="break-word">
                          {buyer.buyerId.emailNormalized}
                        </Text>
                      </HStack>
                    ) : null}
                  </VStack>

                  {buyer.tags && buyer.tags.length ? (
                    <HStack spacing={2} mt={3} wrap="wrap">
                      {buyer.tags.slice(0, 3).map((tag, idx) => (
                        <Badge
                          key={`${buyer._id}-${tag}-${idx}`}
                          borderRadius="full"
                          px={2.5}
                          py={1}
                          bg="#EEF4FF"
                          color="#315D9C"
                          fontWeight="700"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </HStack>
                  ) : null}

                  <HStack mt={4} spacing={2}>
                    <Button
                      flex="1"
                      rightIcon={<Icon as={FiChevronRight} boxSize={4} />}
                      onClick={() => openLedgerView(buyer)}
                      bg="#0D63B8"
                      color="white"
                      borderRadius="16px"
                      h="44px"
                      fontWeight="800"
                      _hover={{ bg: "#0A56A4" }}
                      _active={{ bg: "#094A8D" }}
                    >
                      View Ledger
                    </Button>
                    <IconButton
                      aria-label={`Delete ${buyer.partyType === "supplier" ? "supplier" : "customer"}`}
                      icon={<Icon as={FiTrash2} boxSize={4} />}
                      onClick={() => openDeleteModal(buyer)}
                      variant="outline"
                      borderRadius="16px"
                      h="44px"
                      minW="44px"
                      colorScheme="red"
                    />
                  </HStack>
                </Box>
              </HStack>
            </Box>
          ))
        )}

        <HStack justify="space-between" align="center" pt={2}>
          <Button
            size="sm"
            variant="outline"
            borderRadius="full"
            isDisabled={page <= 1 || loading}
            onClick={() => {
              if (page <= 1) return;
              const nextPage = page - 1;
              setPage(nextPage);
              fetchBuyers(nextPage, search);
            }}
          >
            Previous
          </Button>
          <Text fontSize="sm" color="gray.600" fontWeight="600">
            Page {page} of {totalPages || 1}
          </Text>
          <Button
            size="sm"
            variant="outline"
            borderRadius="full"
            isDisabled={page >= (totalPages || 1) || loading}
            onClick={() => {
              if (page >= (totalPages || 1)) return;
              const nextPage = page + 1;
              setPage(nextPage);
              fetchBuyers(nextPage, search);
            }}
          >
            Next
          </Button>
        </HStack>
      </VStack>

      <Button
        position="fixed"
        left={{ base: "12px", sm: "16px" }}
        transform="none"
        bottom="calc(74px + env(safe-area-inset-bottom, 0px))"
        zIndex={20}
        leftIcon={<Icon as={FiUserPlus} boxSize={5} />}
        onClick={handlePickSingleContact}
        h="48px"
        minW="0"
        px={5}
        borderRadius="full"
        bgGradient="linear(135deg, #C51162 0%, #D81B60 100%)"
        color="white"
        fontSize="sm"
        fontWeight="900"
        letterSpacing="0.02em"
        shadow="0 18px 34px rgba(197, 17, 98, 0.35)"
        _hover={{ bgGradient: "linear(135deg, #B20E58 0%, #C2185B 100%)" }}
        _active={{ bgGradient: "linear(135deg, #9F0C4F 0%, #AD1457 100%)" }}
      >
        Add {partySingularLabel}
      </Button>
    </Box>
  );

  const ledgerTableData = ledgerEntries.map((entry) => ({
      ...entry,
      entryDate: entry.entryDate,
      typeBadge: (
        <Badge
          colorScheme={entry.entryType === "sale" ? "orange" : entry.entryType === "payment" ? "green" : "blue"}
          textTransform="capitalize"
        >
          {getLedgerEntryTypeLabel(entry.entryType)}
        </Badge>
      ),
      directionBadge: (
        <Badge
          colorScheme={getBuyerLedgerDirectionColorScheme(entry.direction, entry.entryType)}
          textTransform="none"
        >
          {getBuyerLedgerDirectionLabel(entry.direction, entry.entryType)}
        </Badge>
      ),
      amountDisplay: (
        <Text color={getBuyerLedgerDirectionTextColor(entry.direction, entry.entryType)} fontWeight="bold">
          {formatCurrency(entry.amount || 0)}
        </Text>
      ),
      balanceText: formatCurrency(entry.balanceAfter || 0),
      referenceText: entry.referenceId ? (
        <HStack spacing={1}>
          <Text>{entry.referenceType || "manual"}: </Text>
          <Text fontWeight="600" color="blue.600" cursor="pointer" onClick={() => {
              navigator.clipboard.writeText(entry.referenceId || '');
              toast({ title: 'ID Copied', status: 'success', duration: 1000, isClosable: true });
            }}>
            {formatShortId(entry.referenceId)}
          </Text>
        </HStack>
      ) : (
        <Text>{entry.referenceType || "manual"}</Text>
      ),
      statusBadge: (
        <Badge colorScheme={entry.status === "reversed" ? "red" : "green"} textTransform="capitalize">
          {entry.status || "active"}
        </Badge>
      ),
      reverseAction:
        entry.status === "reversed" ? (
          <Text color="gray.500">-</Text>
        ) : (
          <HStack spacing={2}>
            {canDownloadLedgerInvoice(entry) && (
              <Button
                size="xs"
                colorScheme="teal"
                variant="outline"
                isLoading={invoiceDownloadingLedgerEntryId === entry._id}
                onClick={() => void handleDownloadLedgerEntryInvoice(entry)}
              >
                Invoice
              </Button>
            )}
            {entry.direction === "debit" && (
              <Button size="xs" colorScheme="green" variant="outline" onClick={() => openPayModal(entry)}>
                Pay
              </Button>
            )}
            <Button size="xs" colorScheme="red" variant="outline" onClick={() => openReverseModal(entry)}>
              Reverse
            </Button>
          </HStack>
        ),
    }));

  const ledgerColumns = [
    { headerName: "Date", key: "entryDate", type: "date" },
    {
      headerName: "Type",
      key: "typeBadge",
      type: "component",
      metaData: { component: (row: any) => row.typeBadge },
    },
    {
      headerName: "Due Impact",
      key: "directionBadge",
      type: "component",
      metaData: { component: (row: any) => row.directionBadge },
    },
    {
      headerName: "Amount",
      key: "amountDisplay",
      type: "component",
      metaData: { component: (row: any) => row.amountDisplay },
    },
    { headerName: "Balance", key: "balanceText" },
    { headerName: "Reference", key: "referenceText" },
    { headerName: "Notes", key: "notes" },
    {
      headerName: "Status",
      key: "statusBadge",
      type: "component",
      metaData: { component: (row: any) => row.statusBadge },
    },
    {
      headerName: "Action",
      key: "reverseAction",
      type: "component",
      metaData: { component: (row: any) => row.reverseAction },
    },
  ];

  const ledgerTableActions = {
    pagination: {
      show: true,
      currentPage: ledgerPage,
      totalPages: ledgerTotalPages || 1,
      limit: ledgerLimit,
      onClick: (nextPage: number) => {
        if (!selectedLedgerBuyer?._id) {
          return;
        }
        setLedgerPage(nextPage);
        fetchLedgerEntries(selectedLedgerBuyer._id, nextPage);
      },
    },
  };

  const saleTableData = saleRecords.map((record) => {
      const itemsCount = Array.isArray(record.items) ? record.items.length : 0;
      const itemPreview =
        itemsCount > 0
          ? record.items
              .slice(0, 2)
              .map((item) => `${item.itemName} x ${item.quantity}`)
              .join(", ")
          : "-";

      return {
        ...record,
        saleDate: record.saleDate,
        itemsCount,
        idDisplay: (
          <Text
            fontWeight="600"
            color="blue.600"
            cursor="pointer"
            textDecoration="underline"
            onClick={() => openSaleDetails(record)}
          >
            {record._id.slice(-6)}
          </Text>
        ),
        itemPreview: itemsCount > 2 ? `${itemPreview} +${itemsCount - 2} more` : itemPreview,
        grandTotalText: formatCurrency(Number(record.grandTotal || 0)),
        statusBadge: (
          <Badge
            colorScheme={record.status === "posted" ? "green" : record.status === "void" ? "red" : "orange"}
            textTransform="capitalize"
          >
            {record.status}
          </Badge>
        ),
        postAction:
          record.status === "draft" && !record.ledgerEntryId ? (
            <Button
              size="xs"
              colorScheme="blue"
              variant="outline"
              isLoading={postingSaleId === record._id}
              onClick={() => handlePostSaleRecordToLedger(record._id)}
            >
              Post {isSelectedSupplier ? "purchase" : "sale"} to ledger
            </Button>
          ) : (
            <Text color="gray.500">-</Text>
          ),
      };
    });
  

  const saleColumns = [
    { headerName: "Date", key: "saleDate", type: "date" },
    {
      headerName: "ID",
      key: "idDisplay",
      type: "component",
      metaData: { component: (row: any) => row.idDisplay },
    },
    { headerName: "Items", key: "itemPreview" },
    { headerName: "Item Count", key: "itemsCount" },
    { headerName: "Total", key: "grandTotalText" },
    { headerName: "Notes", key: "notes" },
    {
      headerName: "Status",
      key: "statusBadge",
      type: "component",
      metaData: { component: (row: any) => row.statusBadge },
    },
    {
      headerName: "Action",
      key: "postAction",
      type: "component",
      metaData: { component: (row: any) => row.postAction },
    },
  ];

  const saleTableActions = {
    pagination: {
      show: true,
      currentPage: salePage,
      totalPages: saleTotalPages || 1,
      limit: saleLimit,
      onClick: (nextPage: number) => {
        if (!selectedLedgerBuyer?._id) {
          return;
        }
        setSalePage(nextPage);
        fetchSaleRecords(selectedLedgerBuyer._id, nextPage);
      },
    },
  };

  const renderLedgerMobile = () => (
    <VStack align="stretch" spacing={4}>
      {ledgerLoading ? (
        <VStack
          spacing={3}
          py={8}
          px={4}
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="xl"
          bg="white"
          shadow="sm"
        >
          <Spinner color="blue.500" thickness="3px" size="lg" />
          <Text fontSize="sm" color="gray.500">
            Loading ledger activity...
          </Text>
        </VStack>
      ) : ledgerEntries.length === 0 ? (
        <VStack
          spacing={2}
          py={8}
          px={5}
          borderRadius="2xl"
          borderWidth="1px"
          borderColor="#D7E5F4"
          bg="linear-gradient(180deg, #FFFFFF 0%, #F8FBFF 100%)"
          shadow="0 12px 30px rgba(15, 23, 42, 0.06)"
        >
          <Text fontSize="sm" fontWeight="800" color="#1E3A5F">
            No ledger entries yet
          </Text>
          <Text fontSize="sm" color="gray.500" textAlign="center">
            {isSelectedSupplier
              ? "Purchases, payments, and adjustments for this supplier will appear here."
              : "Sales, payments, and adjustments for this customer will appear here."}
          </Text>
        </VStack>
      ) : (
        ledgerEntries.map((entry) => (
          <Box
            key={entry._id}
            borderWidth="1px"
            borderColor="#D9E4F2"
            borderRadius="24px"
            bg="linear-gradient(180deg, #FFFFFF 0%, #F8FBFF 100%)"
            shadow="0 16px 38px rgba(15, 23, 42, 0.08)"
            overflow="hidden"
          >
            <Box
              px={4}
              py={3.5}
              bgGradient={
                entry.entryType === "sale"
                  ? "linear(135deg, #FFF4E5 0%, #FFE8CC 100%)"
                  : entry.entryType === "payment"
                    ? "linear(135deg, #E7FBF3 0%, #D3F7E8 100%)"
                    : "linear(135deg, #E8F3FF 0%, #DDEEFF 100%)"
              }
              borderBottomWidth="1px"
              borderBottomColor="#E5EDF6"
            >
              <Flex justify="space-between" align="flex-start" gap={3}>
                <VStack align="start" spacing={2} flex="1" minW={0}>
                  <HStack spacing={2} flexWrap="wrap">
                    <Badge
                      colorScheme={
                        entry.entryType === "sale"
                          ? "orange"
                          : entry.entryType === "payment"
                            ? "green"
                            : "blue"
                      }
                      textTransform="capitalize"
                      borderRadius="full"
                      px={2.5}
                      py={1}
                      fontSize="10px"
                      fontWeight="800"
                    >
                      {getLedgerEntryTypeLabel(entry.entryType)}
                    </Badge>
                    <Badge
                      colorScheme={getBuyerLedgerDirectionColorScheme(entry.direction, entry.entryType)}
                      textTransform="none"
                      borderRadius="full"
                      px={2.5}
                      py={1}
                      fontSize="10px"
                      fontWeight="800"
                    >
                      {getBuyerLedgerDirectionLabel(entry.direction, entry.entryType)}
                    </Badge>
                  </HStack>
                  <Text fontSize="11px" fontWeight="700" color="#52627A" letterSpacing="0.01em">
                    {entry.status === "reversed"
                      ? "This entry has been reversed"
                      : `Recorded in ${isSelectedSupplier ? "supplier" : "customer"} ledger`}
                  </Text>
                </VStack>

                <VStack align="end" spacing={0} minW="fit-content">
                  <Text
                    fontSize="10px"
                    color="#64748B"
                    fontWeight="700"
                    textTransform="uppercase"
                    letterSpacing="0.08em"
                  >
                    Amount
                  </Text>
                  <Text
                    fontWeight="900"
                    fontSize="md"
                    lineHeight="1.1"
                    color={getBuyerLedgerDirectionTextColor(entry.direction, entry.entryType)}
                  >
                    {formatCurrency(entry.amount || 0)}
                  </Text>
                </VStack>
              </Flex>
            </Box>
            <VStack align="stretch" spacing={3.5} p={4}>
              <SimpleGrid columns={2} spacing={3}>
                <Box>
                  <Box
                    borderRadius="18px"
                    bg="white"
                    borderWidth="1px"
                    borderColor="#E7EEF8"
                    px={3}
                    py={3}
                    minH="72px"
                  >
                    <Text fontSize="10px" color="#64748B" textTransform="uppercase" fontWeight="800" letterSpacing="0.08em">
                    Date
                    </Text>
                    <Text fontSize="13px" color="#1F2937" fontWeight="700" mt={1}>
                      {formatDateTime(entry.entryDate)}
                    </Text>
                  </Box>
                </Box>
                <Box>
                  <Box
                    borderRadius="18px"
                    bg="white"
                    borderWidth="1px"
                    borderColor="#E7EEF8"
                    px={3}
                    py={3}
                    minH="72px"
                  >
                    <Text fontSize="10px" color="#64748B" textTransform="uppercase" fontWeight="800" letterSpacing="0.08em">
                      Balance
                    </Text>
                    <Text fontSize="13px" color="#0F172A" fontWeight="900" mt={1}>
                      {formatCurrency(entry.balanceAfter || 0)}
                    </Text>
                  </Box>
                </Box>
              </SimpleGrid>
              <Box>
                <Text fontSize="10px" color="#64748B" textTransform="uppercase" fontWeight="800" letterSpacing="0.08em">
                  Reference
                </Text>
                <Box
                  mt={1.5}
                  borderRadius="16px"
                  bg="#F3F8FE"
                  borderWidth="1px"
                  borderColor="#D9E6F6"
                  px={3}
                  py={2.5}
                >
                  <Text fontSize="13px" color="#244261" fontWeight="700" fontFamily="mono" wordBreak="break-word">
                    {formatLedgerReference(entry)}
                  </Text>
                </Box>
              </Box>
              {entry.notes ? (
                <Box>
                  <Text fontSize="10px" color="#64748B" textTransform="uppercase" fontWeight="800" letterSpacing="0.08em">
                    Notes
                  </Text>
                  <Box
                    mt={1.5}
                    borderRadius="16px"
                    bg="#FFFDF7"
                    borderWidth="1px"
                    borderColor="#F4E8B2"
                    px={3}
                    py={2.5}
                  >
                    <Text fontSize="13px" color="#5B5340" lineHeight="1.5">
                      {entry.notes}
                    </Text>
                  </Box>
                </Box>
              ) : null}
              <Flex justify="space-between" align="center" gap={3} wrap="wrap">
                <Badge
                  alignSelf="flex-start"
                  colorScheme={entry.status === "reversed" ? "red" : "green"}
                  textTransform="capitalize"
                  borderRadius="full"
                  px={3}
                  py={1}
                  fontSize="10px"
                  fontWeight="800"
                >
                  {entry.status || "active"}
                </Badge>
                {entry.status !== "reversed" ? (
                  <Flex flex="1" justify="flex-end" gap={2} wrap="wrap">
                    {canDownloadLedgerInvoice(entry) && (
                      <Button
                        size="xs"
                        h="32px"
                        colorScheme="blue"
                        variant="subtle"
                        borderRadius="full"
                        fontWeight="800"
                        fontSize="12px"
                        isLoading={invoiceDownloadingLedgerEntryId === entry._id}
                        onClick={() => void handleDownloadLedgerEntryInvoice(entry)}
                      >
                        Invoice
                      </Button>
                    )}
                    {entry.direction === "debit" && (
                      <Button
                        size="xs"
                        h="32px"
                        colorScheme="green"
                        variant="solid"
                        borderRadius="full"
                        fontWeight="800"
                        fontSize="12px"
                        onClick={() => openPayModal(entry)}
                      >
                        Pay
                      </Button>
                    )}
                    <Button
                      size="xs"
                      h="32px"
                      colorScheme="red"
                      variant="outline"
                      borderRadius="full"
                      fontWeight="800"
                      fontSize="12px"
                      onClick={() => openReverseModal(entry)}
                    >
                      Reverse
                    </Button>
                  </Flex>
                ) : null}
              </Flex>
            </VStack>
          </Box>
        ))
      )}

      <HStack justify="space-between" pt={1}>
        <Button
          size="sm"
          variant="outline"
          borderRadius="full"
          isDisabled={ledgerPage <= 1 || ledgerLoading}
          onClick={() => {
            if (!selectedLedgerBuyer?._id || ledgerPage <= 1) return;
            const nextPage = ledgerPage - 1;
            setLedgerPage(nextPage);
            fetchLedgerEntries(selectedLedgerBuyer._id, nextPage);
          }}
        >
          Previous
        </Button>
        <Text fontSize="sm" color="gray.600">
          Page {ledgerPage} of {ledgerTotalPages || 1}
        </Text>
        <Button
          size="sm"
          variant="outline"
          borderRadius="full"
          isDisabled={ledgerPage >= (ledgerTotalPages || 1) || ledgerLoading}
          onClick={() => {
            if (!selectedLedgerBuyer?._id || ledgerPage >= (ledgerTotalPages || 1)) return;
            const nextPage = ledgerPage + 1;
            setLedgerPage(nextPage);
            fetchLedgerEntries(selectedLedgerBuyer._id, nextPage);
          }}
        >
          Next
        </Button>
      </HStack>
    </VStack>
  );

  const renderSaleRecordsMobile = () => (
    <VStack align="stretch" spacing={4}>
      {saleLoading ? (
        <Text fontSize="sm" color="gray.500">
          Loading {isSelectedSupplier ? "purchase" : "sale"} records...
        </Text>
      ) : saleRecords.length === 0 ? (
        <Text fontSize="sm" color="gray.500">
          No {isSelectedSupplier ? "purchase" : "sale"} records found.
        </Text>
      ) : (
        saleRecords.map((record) => {
          const itemsCount = Array.isArray(record.items) ? record.items.length : 0;
          const preview = itemsCount
            ? record.items
                .slice(0, 2)
                .map((item) => `${item.itemName} x ${item.quantity}`)
                .join(", ")
            : "-";

          return (
            <Box
              key={record._id}
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="xl"
              bg="white"
              shadow="sm"
              overflow="hidden"
            >
              <Box px={4} py={3} bg="blue.50" borderBottomWidth="1px" borderBottomColor="gray.200">
                <HStack justify="space-between" align="center">
                  <Badge
                    colorScheme={record.status === "posted" ? "green" : record.status === "void" ? "red" : "orange"}
                    textTransform="capitalize"
                    borderRadius="full"
                    px={2}
                  >
                    {record.status}
                  </Badge>
                  <Text fontWeight="800" color="blue.800" fontSize="sm">
                    {formatCurrency(Number(record.grandTotal || 0))}
                  </Text>
                </HStack>
              </Box>
              <VStack align="stretch" spacing={3} p={4}>
                <SimpleGrid columns={2} spacing={2}>
                  <Box>
                    <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="700">
                      ID
                    </Text>
                    <Text
                      fontSize="sm"
                      color="blue.600"
                      fontWeight="600"
                      cursor="pointer"
                      textDecoration="underline"
                      onClick={() => openSaleDetails(record)}
                    >
                      {record._id.slice(-6)}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="700">
                      Date
                    </Text>
                    <Text fontSize="sm" color="gray.800">
                      {formatDateTime(record.saleDate)}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="700">
                      Item Count
                    </Text>
                    <Text fontSize="sm" color="gray.800" fontWeight="700">
                      {itemsCount}
                    </Text>
                  </Box>
                </SimpleGrid>
                <Box>
                  <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="700">
                    Items
                  </Text>
                  <Text fontSize="sm" color="gray.700">
                    {itemsCount > 2 ? `${preview} +${itemsCount - 2} more` : preview}
                  </Text>
                </Box>
                {record.notes ? (
                  <Box>
                    <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="700">
                      Notes
                    </Text>
                    <Text fontSize="sm" color="gray.700">
                      {record.notes}
                    </Text>
                  </Box>
                ) : null}
                {record.status === "draft" && !record.ledgerEntryId ? (
                  <Button
                    size="xs"
                    colorScheme="blue"
                    variant="outline"
                    borderRadius="full"
                    isLoading={postingSaleId === record._id}
                    onClick={() => handlePostSaleRecordToLedger(record._id)}
                  >
                    Post {isSelectedSupplier ? "purchase" : "sale"} to ledger
                  </Button>
                ) : null}
              </VStack>
            </Box>
          );
        })
      )}

      <HStack justify="space-between" pt={1}>
        <Button
          size="sm"
          variant="outline"
          borderRadius="full"
          isDisabled={salePage <= 1 || saleLoading}
          onClick={() => {
            if (!selectedLedgerBuyer?._id || salePage <= 1) return;
            const nextPage = salePage - 1;
            setSalePage(nextPage);
            fetchSaleRecords(selectedLedgerBuyer._id, nextPage);
          }}
        >
          Previous
        </Button>
        <Text fontSize="sm" color="gray.600">
          Page {salePage} of {saleTotalPages || 1}
        </Text>
        <Button
          size="sm"
          variant="outline"
          borderRadius="full"
          isDisabled={salePage >= (saleTotalPages || 1) || saleLoading}
          onClick={() => {
            if (!selectedLedgerBuyer?._id || salePage >= (saleTotalPages || 1)) return;
            const nextPage = salePage + 1;
            setSalePage(nextPage);
            fetchSaleRecords(selectedLedgerBuyer._id, nextPage);
          }}
        >
          Next
        </Button>
      </HStack>
    </VStack>
  );

  const renderLedgerDetailMobile = () => {
    if (!selectedLedgerBuyer) {
      return null;
    }

    const outstandingBalance = Number(ledgerSummary.outstandingBalance || 0);
    const totalSales = Number(ledgerSummary.totalDebit || 0);
    const totalReceived = Number(ledgerSummary.totalCredit || 0);
    const creditLimit = Number(ledgerSummary.creditLimit || 0);
    const buyerPhone = selectedLedgerBuyer.buyerId?.phoneE164 || "-";
    const buyerEmail = selectedLedgerBuyer.buyerId?.emailNormalized || "";
    const lastUpdated = formatRelativeTime(selectedLedgerBuyer.updatedAt || selectedLedgerBuyer.createdAt);
    const hasOutstanding = outstandingBalance >= 0;
    const detailBalanceTone = isSelectedSupplier
      ? hasOutstanding
        ? {
            bg: "#FEF2F2",
            borderColor: "red.100",
            labelColor: "red.700",
            amountColor: "red.600",
            label: "You Will Give",
          }
        : {
            bg: "#ECFDF5",
            borderColor: "green.100",
            labelColor: "green.700",
            amountColor: "green.600",
            label: "Supplier Advance",
          }
      : hasOutstanding
        ? {
            bg: "#EFF6FF",
            borderColor: "blue.100",
            labelColor: "blue.700",
            amountColor: "blue.700",
            label: "You Will Get",
          }
        : {
            bg: "#FEF2F2",
            borderColor: "red.100",
            labelColor: "red.700",
            amountColor: "red.600",
            label: "Advance Balance",
          };

    return (
      <Box mx={-2} mt={-2} pb="132px" bg="#EEF5FF" minH="calc(100vh - 56px)">
        <Box
          bgGradient="linear(180deg, #0A57B0 0%, #0F6FD2 100%)"
          px={4}
          pt={4}
          pb={10}
          borderBottomRadius="30px"
          boxShadow="0 14px 36px rgba(10, 87, 176, 0.22)"
        >
          <HStack justify="space-between" align="center">
            <IconButton
              aria-label={`Back to ${selectedPartyType === "supplier" ? "suppliers" : "customers"}`}
              icon={<ArrowBackIcon />}
              onClick={closeLedgerView}
              borderRadius="full"
              bg="whiteAlpha.220"
              color="white"
              _hover={{ bg: "whiteAlpha.300" }}
              _active={{ bg: "whiteAlpha.400" }}
            />
            <Badge
              px={3}
              py={1.5}
              borderRadius="full"
              bg="whiteAlpha.220"
              color="white"
              textTransform="none"
              fontSize="0.72rem"
              fontWeight="800"
            >
              {isSelectedSupplier ? "Supplier Ledger" : "Customer Ledger"}
            </Badge>
          </HStack>

          <HStack mt={5} spacing={4} align="start">
            <Flex
              h="58px"
              w="58px"
              borderRadius="full"
              bg="whiteAlpha.250"
              color="white"
              align="center"
              justify="center"
              fontWeight="900"
              fontSize="xl"
              flexShrink={0}
            >
              {getBuyerInitials(selectedLedgerBuyer)}
            </Flex>

            <Box flex="1" minW={0}>
              <Text color="whiteAlpha.800" fontSize="xs" textTransform="uppercase" letterSpacing="0.12em">
                {selectedLedgerBuyer.source
                  ? `${selectedLedgerBuyer.source} ${isSelectedSupplier ? "supplier" : "contact"}`
                  : `${isSelectedSupplier ? "supplier" : "customer"} profile`}
              </Text>
              <Text color="white" fontSize="2xl" fontWeight="900" lineHeight="1.1" mt={1}>
                {selectedBuyerName}
              </Text>
              <HStack mt={2} spacing={2} wrap="wrap">
                <Badge
                  borderRadius="full"
                  px={2.5}
                  py={1}
                  bg="whiteAlpha.220"
                  color="white"
                  textTransform="none"
                  fontWeight="700"
                >
                  {selectedLedgerBuyer.isBlocked ? "Blocked" : "Active"}
                </Badge>
                <Badge
                  borderRadius="full"
                  px={2.5}
                  py={1}
                  bg="whiteAlpha.180"
                  color="whiteAlpha.900"
                  textTransform="none"
                  fontWeight="700"
                >
                  Updated {lastUpdated}
                </Badge>
              </HStack>

              <VStack align="stretch" spacing={1.5} mt={3}>
                <HStack spacing={2} color="whiteAlpha.900" align="start">
                  <Icon as={FiPhone} boxSize={4} mt={0.5} />
                  <Text fontSize="sm" fontWeight="600">
                    {buyerPhone}
                  </Text>
                </HStack>
                {buyerEmail ? (
                  <HStack spacing={2} color="whiteAlpha.900" align="start">
                    <Icon as={FiMail} boxSize={4} mt={0.5} />
                    <Text fontSize="sm" fontWeight="600" wordBreak="break-word">
                      {buyerEmail}
                    </Text>
                  </HStack>
                ) : null}
              </VStack>
            </Box>
          </HStack>
        </Box>

        <VStack align="stretch" spacing={4} px={3} mt="-26px">
          <Box
            bg="white"
            borderRadius="26px"
            p={4}
            shadow="0 16px 36px rgba(15, 23, 42, 0.08)"
            borderWidth="1px"
            borderColor="#E5EEF8"
          >
            <SimpleGrid columns={2} spacing={3}>
              <Box
                borderRadius="20px"
                px={3.5}
                py={3}
                bg="linear-gradient(135deg, rgba(236,253,245,1) 0%, rgba(209,250,229,1) 100%)"
                borderWidth="1px"
                borderColor="green.100"
              >
                <Text fontSize="xs" fontWeight="800" color="green.700" textTransform="uppercase" letterSpacing="0.08em">
                  Total Received
                </Text>
                <Text fontSize="xl" fontWeight="900" color="green.600" mt={1}>
                  {formatCompactCurrency(totalReceived)}
                </Text>
              </Box>
              <Box
                borderRadius="20px"
                px={3.5}
                py={3}
                bg={detailBalanceTone.bg}
                borderWidth="1px"
                borderColor={detailBalanceTone.borderColor}
              >
                <Text
                  fontSize="xs"
                  fontWeight="800"
                  color={detailBalanceTone.labelColor}
                  textTransform="uppercase"
                  letterSpacing="0.08em"
                >
                  {detailBalanceTone.label}
                </Text>
                <Text fontSize="xl" fontWeight="900" color={detailBalanceTone.amountColor} mt={1}>
                  {formatCompactCurrency(Math.abs(outstandingBalance))}
                </Text>
              </Box>
              <Box
                borderRadius="20px"
                px={3.5}
                py={3}
                bg="#FFF7ED"
                borderWidth="1px"
                borderColor="orange.100"
              >
                <Text fontSize="xs" fontWeight="800" color="orange.700" textTransform="uppercase" letterSpacing="0.08em">
                  {isSelectedSupplier ? "Total Purchase" : "Total Sale"}
                </Text>
                <Text fontSize="xl" fontWeight="900" color="orange.600" mt={1}>
                  {formatCompactCurrency(totalSales)}
                </Text>
              </Box>
              <Box
                borderRadius="20px"
                px={3.5}
                py={3}
                bg="#F5F3FF"
                borderWidth="1px"
                borderColor="purple.100"
              >
                <Text fontSize="xs" fontWeight="800" color="purple.700" textTransform="uppercase" letterSpacing="0.08em">
                  Credit Limit
                </Text>
                <Text fontSize="xl" fontWeight="900" color="purple.600" mt={1}>
                  {formatCompactCurrency(creditLimit)}
                </Text>
              </Box>
            </SimpleGrid>
          </Box>

          <Box
            bg="white"
            borderRadius="22px"
            p={1.5}
            shadow="0 14px 30px rgba(15, 23, 42, 0.06)"
            borderWidth="1px"
            borderColor="#E5EEF8"
          >
            <HStack spacing={2}>
              <Button
                flex="1"
                h="44px"
                borderRadius="16px"
                bg={ledgerTabIndex === 0 ? "#0A57B0" : "transparent"}
                color={ledgerTabIndex === 0 ? "white" : "#33506D"}
                fontWeight="800"
                onClick={() => setLedgerTabIndex(0)}
                _hover={{ bg: ledgerTabIndex === 0 ? "#0A57B0" : "#F8FBFF" }}
                _active={{ bg: ledgerTabIndex === 0 ? "#094894" : "#EEF5FF" }}
              >
                Entries ({ledgerTotal})
              </Button>
              <Button
                flex="1"
                h="44px"
                borderRadius="16px"
                bg={ledgerTabIndex === 1 ? "#0A57B0" : "transparent"}
                color={ledgerTabIndex === 1 ? "white" : "#33506D"}
                fontWeight="800"
                onClick={() => setLedgerTabIndex(1)}
                _hover={{ bg: ledgerTabIndex === 1 ? "#0A57B0" : "#F8FBFF" }}
                _active={{ bg: ledgerTabIndex === 1 ? "#094894" : "#EEF5FF" }}
              >
                {isSelectedSupplier ? "Purchases" : "Sales"} ({saleTotal})
              </Button>
            </HStack>
          </Box>

          {ledgerTabIndex === 0 ? renderLedgerMobile() : renderSaleRecordsMobile()}
        </VStack>

        <Box
          position="fixed"
          left="12px"
          right="12px"
          bottom="calc(76px + env(safe-area-inset-bottom, 0px))"
          zIndex={20}
        >
          <HStack
            spacing={3}
            bg="white"
            borderRadius="22px"
            p={3}
            shadow="0 18px 40px rgba(15, 23, 42, 0.16)"
            borderWidth="1px"
            borderColor="#E5EEF8"
          >
            <Button
              flex="1"
              h="52px"
              borderRadius="16px"
              bg="#0F766E"
              color="white"
              fontWeight="800"
              leftIcon={<AddIcon />}
              onClick={onSaleRecordOpen}
              _hover={{ bg: "#0B5E58" }}
              _active={{ bg: "#094C47" }}
            >
              Add {isSelectedSupplier ? "Purchase" : "Sale"}
            </Button>
            <Button
              flex="1"
              h="52px"
              borderRadius="16px"
              bg="#0A57B0"
              color="white"
              fontWeight="800"
              leftIcon={<AddIcon />}
              onClick={onLedgerEntryOpen}
              _hover={{ bg: "#094894" }}
              _active={{ bg: "#073A76" }}
            >
              Add Entry
            </Button>
          </HStack>
        </Box>
      </Box>
    );
  };

  const renderSaleDetailsContent = () => {
    const activeSaleRecord = saleRecordDetails?.saleRecord || selectedSaleRecord;

    if (saleDetailsLoading) {
      return (
        <Flex minH="240px" align="center" justify="center" direction="column" gap={3}>
          <Spinner color="blue.500" thickness="3px" size="lg" />
          <Text fontSize="sm" color="gray.500">
            Loading {isSelectedSupplier ? "purchase" : "sale"} history{activeSaleRecord ? ` for ${formatShortId(activeSaleRecord._id)}` : ""}...
          </Text>
        </Flex>
      );
    }

    if (!saleRecordDetails) {
      return (
        <Flex minH="200px" align="center" justify="center">
          <Text fontSize="sm" color="gray.500">
            {selectedTransactionSingularLabel} details are not available{activeSaleRecord ? ` for ${formatShortId(activeSaleRecord._id)}` : ""}.
          </Text>
        </Flex>
      );
    }

    const { saleRecord, summary, timeline } = saleRecordDetails;
    const totalItems = Array.isArray(saleRecord.items)
      ? saleRecord.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
      : 0;

    return (
      <VStack align="stretch" spacing={5}>
        <Box borderWidth="1px" borderColor="blue.100" bg="blue.50" borderRadius="xl" p={4}>
          <HStack justify="space-between" align="start" spacing={3}>
            <Box>
              <Text fontSize="xs" textTransform="uppercase" color="blue.700" fontWeight="700">
                {selectedTransactionSingularLabel} ID
              </Text>
              <Text fontSize="lg" fontWeight="800" color="blue.900" wordBreak="break-all">
                {saleRecord._id}
              </Text>
              <HStack spacing={2} mt={2} wrap="wrap">
                <Badge colorScheme={saleRecord.status === "posted" ? "green" : saleRecord.status === "void" ? "red" : "orange"} textTransform="capitalize">
                  {saleRecord.status}
                </Badge>
                <Badge colorScheme={summary.isPosted ? "blue" : "gray"}>
                  {summary.isPosted ? "Ledger Linked" : "Not Posted"}
                </Badge>
                {saleRecord.source ? (
                  <Badge colorScheme="purple" textTransform="capitalize">
                    {saleRecord.source}
                  </Badge>
                ) : null}
              </HStack>
            </Box>
              <VStack align="stretch" spacing={2} minW={{ base: "132px", sm: "172px" }}>
                {!isSelectedSupplier ? (
                  <Button
                    size="sm"
                    leftIcon={<DownloadIcon />}
                    colorScheme="teal"
                    variant="solid"
                    borderRadius="full"
                    isLoading={invoiceDownloadingSaleId === saleRecord._id}
                    onClick={() => void handleDownloadSaleInvoice(saleRecordDetails)}
                  >
                    Download Invoice
                  </Button>
                ) : null}
                <IconButton
                  aria-label={`Copy ${selectedTransactionSingularLabel.toLowerCase()} ID`}
                  icon={<CopyIcon />}
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(saleRecord._id || "");
                    toast({ title: `${selectedTransactionSingularLabel} ID Copied`, status: "success", duration: 1000, isClosable: true });
                  }}
                />
              </VStack>
          </HStack>
        </Box>

        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
          <Box p={3} borderWidth="1px" borderColor="gray.200" borderRadius="xl" bg="white">
            <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="700">
              {selectedTransactionSingularLabel} Total
            </Text>
            <Text fontSize="lg" fontWeight="800" color="gray.900">
              {formatCurrency(summary.saleAmount)}
            </Text>
          </Box>
          <Box p={3} borderWidth="1px" borderColor="green.200" borderRadius="xl" bg="green.50">
              <Text fontSize="xs" color="green.700" textTransform="uppercase" fontWeight="700">
                {isSelectedSupplier ? "Paid Out" : "Paid"}
              </Text>
            <Text fontSize="lg" fontWeight="800" color="green.800">
              {formatCurrency(summary.paidAmount)}
            </Text>
          </Box>
          <Box p={3} borderWidth="1px" borderColor="orange.200" borderRadius="xl" bg="orange.50">
            <Text fontSize="xs" color="orange.700" textTransform="uppercase" fontWeight="700">
              {isSelectedSupplier ? "Debit Adjustments" : "Debit Adjustments"}
            </Text>
            <Text fontSize="lg" fontWeight="800" color="orange.800">
              {formatCurrency(summary.adjustmentDebitAmount)}
            </Text>
          </Box>
          <Box p={3} borderWidth="1px" borderColor="blue.200" borderRadius="xl" bg="blue.50">
              <Text fontSize="xs" color="blue.700" textTransform="uppercase" fontWeight="700">
                {isSelectedSupplier ? "Remaining Payable" : "Remaining Due"}
              </Text>
            <Text fontSize="lg" fontWeight="800" color="blue.800">
              {formatCurrency(summary.remainingDue)}
            </Text>
          </Box>
        </SimpleGrid>

        <SimpleGrid columns={1} spacing={3}>
          <Box p={4} borderWidth="1px" borderColor="gray.200" borderRadius="xl" bg="white">
            <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="700">
              {selectedTransactionSingularLabel} Meta
            </Text>
            <VStack align="stretch" spacing={2} mt={3}>
              <Flex justify="space-between" align="flex-start" gap={3} wrap="wrap">
                <Text fontSize="sm" color="gray.600">
                  {selectedTransactionSingularLabel} Date
                </Text>
                <Text fontSize="sm" fontWeight="600" color="gray.800" textAlign="right" wordBreak="break-word" maxW="70%">
                  {formatDateTime(saleRecord.saleDate)}
                </Text>
              </Flex>
              <Flex justify="space-between" align="flex-start" gap={3} wrap="wrap">
                <Text fontSize="sm" color="gray.600">
                  Created
                </Text>
                <Text fontSize="sm" fontWeight="600" color="gray.800" textAlign="right" wordBreak="break-word" maxW="70%">
                  {formatDateTime(saleRecord.createdAt)}
                </Text>
              </Flex>
              <Flex justify="space-between" align="flex-start" gap={3} wrap="wrap">
                <Text fontSize="sm" color="gray.600">
                  Posted At
                </Text>
                <Text fontSize="sm" fontWeight="600" color="gray.800" textAlign="right" wordBreak="break-word" maxW="70%">
                  {formatDateTime(saleRecord.postedAt)}
                </Text>
              </Flex>
              <Flex justify="space-between" align="flex-start" gap={3} wrap="wrap">
                <Text fontSize="sm" color="gray.600">
                  Items
                </Text>
                <Text fontSize="sm" fontWeight="600" color="gray.800" textAlign="right" wordBreak="break-word" maxW="70%">
                  {saleRecord.items?.length || 0} lines / {totalItems} qty
                </Text>
              </Flex>
              <Flex justify="space-between" align="flex-start" gap={3} wrap="wrap">
                <Text fontSize="sm" color="gray.600">
                  Ledger Entry
                </Text>
                <Text fontSize="sm" fontWeight="600" color="gray.800" textAlign="right" wordBreak="break-word" maxW="70%">
                  {saleRecord.ledgerEntryId ? formatShortId(saleRecord.ledgerEntryId) : "-"}
                </Text>
              </Flex>
              {saleRecord.notes ? (
                <Box pt={1}>
                  <Text fontSize="sm" color="gray.600" mb={1}>
                    Notes
                  </Text>
                  <Text fontSize="sm" color="gray.800">
                    {saleRecord.notes}
                  </Text>
                </Box>
              ) : null}
            </VStack>
          </Box>

          <Box p={4} borderWidth="1px" borderColor="gray.200" borderRadius="xl" bg="white">
            <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="700">
              {selectedTransactionSingularLabel} Totals
            </Text>
            <VStack align="stretch" spacing={2} mt={3}>
              <Flex justify="space-between" align="flex-start" gap={3} wrap="wrap">
                <Text fontSize="sm" color="gray.600">
                  Subtotal
                </Text>
                <Text fontSize="sm" fontWeight="600" color="gray.800" textAlign="right" maxW="70%">
                  {formatCurrency(Number(saleRecord.subtotal || 0))}
                </Text>
              </Flex>
              <Flex justify="space-between" align="flex-start" gap={3} wrap="wrap">
                <Text fontSize="sm" color="gray.600">
                  Discount
                </Text>
                <Text fontSize="sm" fontWeight="600" color="gray.800" textAlign="right" maxW="70%">
                  {formatCurrency(Number(saleRecord.discountTotal || 0))}
                </Text>
              </Flex>
              <Flex justify="space-between" align="flex-start" gap={3} wrap="wrap">
                <Text fontSize="sm" color="gray.600">
                  Tax
                </Text>
                <Text fontSize="sm" fontWeight="600" color="gray.800" textAlign="right" maxW="70%">
                  {formatCurrency(Number(saleRecord.taxTotal || 0))}
                </Text>
              </Flex>
              <Flex justify="space-between" align="flex-start" gap={3} wrap="wrap">
                <Text fontSize="sm" color="gray.600">
                  Credit Adjustments
                </Text>
                <Text fontSize="sm" fontWeight="600" color="gray.800" textAlign="right" maxW="70%">
                  {formatCurrency(summary.adjustmentCreditAmount)}
                </Text>
              </Flex>
              <Flex justify="space-between" align="flex-start" gap={3} wrap="wrap">
                <Text fontSize="sm" color="gray.600">
                  History Events
                </Text>
                <Text fontSize="sm" fontWeight="600" color="gray.800" textAlign="right" maxW="70%">
                  {summary.eventCount}
                </Text>
              </Flex>
            </VStack>
          </Box>
        </SimpleGrid>

        <Box>
          <Text fontSize="sm" color="gray.500" textTransform="uppercase" fontWeight="700" mb={3}>
            Items
          </Text>
          <VStack align="stretch" spacing={3}>
            {saleRecord.items?.map((item, index) => (
              <Box key={`${saleRecord._id}-item-${index}`} p={4} borderWidth="1px" borderColor="gray.200" borderRadius="xl" bg="white">
                <HStack justify="space-between" align="start">
                  <Box>
                    <Text fontSize="sm" fontWeight="700" color="gray.900">
                      {item.itemName}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Qty {item.quantity} x {formatCurrency(Number(item.unitPrice || 0))}
                    </Text>
                  </Box>
                  <Text fontSize="sm" fontWeight="800" color="blue.700">
                    {formatCurrency(Number(item.lineTotal || 0))}
                  </Text>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>

        <Box>
          <Text fontSize="sm" color="gray.500" textTransform="uppercase" fontWeight="700" mb={3}>
            History
          </Text>
          <VStack align="stretch" spacing={3}>
            <Box p={4} borderWidth="1px" borderColor="gray.200" borderRadius="xl" bg="gray.50">
              <HStack justify="space-between" align="start">
                <Box>
                  <Text fontSize="sm" fontWeight="700" color="gray.900">
                    {selectedTransactionSingularLabel} Record Created
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {formatDateTime(saleRecord.createdAt || saleRecord.saleDate)}
                  </Text>
                </Box>
                <Text fontSize="sm" fontWeight="800" color="blue.700">
                  {formatCurrency(summary.saleAmount)}
                </Text>
              </HStack>
            </Box>

            {timeline.length === 0 ? (
              <Text fontSize="sm" color="gray.500">
                No ledger activity linked to this {selectedTransactionSingularLabel.toLowerCase()} yet.
              </Text>
            ) : (
              timeline.map((entry) => (
                <Box key={entry._id} p={4} borderWidth="1px" borderColor="gray.200" borderRadius="xl" bg="white">
                  <HStack justify="space-between" align="start" spacing={3}>
                    <Box>
                      <HStack spacing={2} wrap="wrap">
                        <Text fontSize="sm" fontWeight="700" color="gray.900">
                          {getTimelineTitle(entry)}
                        </Text>
                        <Badge colorScheme={entry.entryType === "sale" ? "orange" : entry.entryType === "payment" ? "green" : "blue"} textTransform="capitalize">
                          {getLedgerEntryTypeLabel(entry.entryType)}
                        </Badge>
                        <Badge
                          colorScheme={getBuyerLedgerDirectionColorScheme(entry.direction, entry.entryType)}
                          textTransform="none"
                        >
                          {getBuyerLedgerDirectionLabel(entry.direction, entry.entryType)}
                        </Badge>
                        {entry.status ? (
                          <Badge colorScheme={entry.status === "reversed" ? "red" : "green"} textTransform="capitalize">
                            {entry.status}
                          </Badge>
                        ) : null}
                        {entry.relationType === "reversal" ? <Badge colorScheme="purple">Linked Reversal</Badge> : null}
                      </HStack>
                      <Text fontSize="sm" color="gray.500" mt={1}>
                        {formatDateTime(entry.entryDate || entry.createdAt)}
                      </Text>
                      <Text fontSize="sm" color="gray.700" mt={2}>
                        {entry.notes || formatLedgerReference(entry)}
                      </Text>
                      {entry.referenceId ? (
                        <Text fontSize="xs" color="gray.500" mt={1}>
                          Ref: {formatLedgerReference(entry)}
                        </Text>
                      ) : null}
                    </Box>
                    <Box textAlign="right">
                      <Text
                        fontSize="sm"
                        fontWeight="800"
                        color={getBuyerLedgerDirectionTextColor(entry.direction, entry.entryType)}
                      >
                        {formatSignedAmount(entry)}
                      </Text>
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        Balance {formatCurrency(Number(entry.balanceAfter || 0))}
                      </Text>
                    </Box>
                  </HStack>
                </Box>
              ))
            )}
          </VStack>
        </Box>
      </VStack>
    );
  };

  const selectedBuyerName = selectedLedgerBuyer ? getBuyerDisplayName(selectedLedgerBuyer) : "";
  const showMobileBuyerManagement = !selectedLedgerBuyer && useCompactBuyerView;
  const showMobileLedgerDetail = Boolean(selectedLedgerBuyer && useCompactLedgerView);

  return (
    <Box px={{ base: 2, md: 4 }} py={{ base: 2, md: 4 }}>
      <VStack align="stretch" spacing={4}>
        {!showMobileBuyerManagement && !showMobileLedgerDetail ? (
          <Flex
            justify="space-between"
            align={{ base: "stretch", md: "center" }}
            direction={{ base: "column", md: "row" }}
            gap={3}
          >
            <Box>
              <Heading size="md">
                {selectedLedgerBuyer ? `${isSelectedSupplier ? "Supplier" : "Customer"} Ledger - ${selectedBuyerName}` : `${partySingularLabel} Management`}
              </Heading>
              <Text fontSize="sm" color="gray.500">
                {selectedLedgerBuyer
                  ? `Track ${isSelectedSupplier ? "purchase" : "sale"}, payment and adjustment entries`
                  : `Manage offline ${partyPluralLabel.toLowerCase()} for your company`}
              </Text>
              {!selectedLedgerBuyer ? (
                <HStack spacing={2} mt={3}>
                  <Button
                    size="sm"
                    borderRadius="full"
                    bg={normalizedActivePartyType === "customer" ? "blue.600" : "white"}
                    color={normalizedActivePartyType === "customer" ? "white" : "blue.700"}
                    borderWidth="1px"
                    borderColor="blue.100"
                    onClick={() => setActivePartyType("customer")}
                    _hover={{ bg: normalizedActivePartyType === "customer" ? "blue.700" : "blue.50" }}
                  >
                    Customers
                  </Button>
                  <Button
                    size="sm"
                    borderRadius="full"
                    bg={normalizedActivePartyType === "supplier" ? "blue.600" : "white"}
                    color={normalizedActivePartyType === "supplier" ? "white" : "blue.700"}
                    borderWidth="1px"
                    borderColor="blue.100"
                    onClick={() => setActivePartyType("supplier")}
                    _hover={{ bg: normalizedActivePartyType === "supplier" ? "blue.700" : "blue.50" }}
                  >
                    Suppliers
                  </Button>
                </HStack>
              ) : null}
            </Box>
            {selectedLedgerBuyer ? (
              <Stack
                direction={{ base: "column", sm: "row" }}
                spacing={2}
                w={{ base: "full", md: "auto" }}
                align={{ base: "stretch", sm: "center" }}
              >
                <Button
                  leftIcon={<ArrowBackIcon />}
                  variant="outline"
                  onClick={closeLedgerView}
                  size={{ base: "sm", md: "md" }}
                  w={{ base: "full", sm: "auto" }}
                >
                  Back to {partyPluralLabel}
                </Button>
                <Button
                  leftIcon={<AddIcon />}
                  colorScheme="teal"
                  onClick={onSaleRecordOpen}
                  size={{ base: "sm", md: "md" }}
                  w={{ base: "full", sm: "auto" }}
                >
                  Add {isSelectedSupplier ? "Purchase" : "Sale"} Record
                </Button>
                <Button
                  leftIcon={<AddIcon />}
                  colorScheme="blue"
                  onClick={onLedgerEntryOpen}
                  size={{ base: "sm", md: "md" }}
                  w={{ base: "full", sm: "auto" }}
                >
                  Add Ledger Entry
                </Button>
              </Stack>
            ) : (
              <Stack
                direction={{ base: "column", sm: "row" }}
                spacing={2}
                w={{ base: "full", md: "auto" }}
                align={{ base: "stretch", sm: "center" }}
              >
                {canUseDeviceContactImport ? (
                  <Button
                    variant="outline"
                    onClick={onImportOpen}
                    size={{ base: "sm", md: "md" }}
                    w={{ base: "full", sm: "auto" }}
                  >
                    Import Contacts
                  </Button>
                ) : null}
                <Button
                  leftIcon={<AddIcon />}
                  colorScheme="blue"
                  onClick={openManualBuyerModal}
                  size={{ base: "sm", md: "md" }}
                  w={{ base: "full", sm: "auto" }}
                >
                  Add {partySingularLabel}
                </Button>
              </Stack>
            )}
          </Flex>
        ) : null}

        {!selectedLedgerBuyer ? (
          <>
            {showMobileBuyerManagement ? (
              renderBuyerProfilesMobile()
            ) : (
              <Box>
                <CustomTable
                  title={`${partyPluralLabel} (${total})`}
                  columns={buyerColumns}
                  data={buyerTableData}
                  loading={loading}
                  actions={buyerTableActions}
                  serial={{ show: true, text: "S.No." }}
                />
              </Box>
            )}
          </>
        ) : (
          <>
            {showMobileLedgerDetail ? (
              renderLedgerDetailMobile()
            ) : (
              <VStack align="stretch" spacing={4}>
                <SimpleGrid columns={{ base: 1, md: 4 }} spacing={3}>
                  <Box
                    p={4}
                    borderWidth="1px"
                    borderColor="orange.200"
                    bg="orange.50"
                    borderRadius="xl"
                    shadow="sm"
                  >
                    <Stat>
                      <StatLabel color="orange.700" fontWeight="700">
                        Total {isSelectedSupplier ? "Purchase" : "Sale"} (Debit)
                      </StatLabel>
                      <StatNumber color="orange.800">{formatCurrency(ledgerSummary.totalDebit)}</StatNumber>
                    </Stat>
                  </Box>
                  <Box
                    p={4}
                    borderWidth="1px"
                    borderColor="green.200"
                    bg="green.50"
                    borderRadius="xl"
                    shadow="sm"
                  >
                    <Stat>
                      <StatLabel color="green.700" fontWeight="700">
                        Total {isSelectedSupplier ? "Payment Sent" : "Payment"} (Credit)
                      </StatLabel>
                      <StatNumber color="green.800">{formatCurrency(ledgerSummary.totalCredit)}</StatNumber>
                    </Stat>
                  </Box>
                  <Box
                    p={4}
                    borderWidth="1px"
                    borderColor="blue.200"
                    bg="blue.50"
                    borderRadius="xl"
                    shadow="sm"
                  >
                    <Stat>
                      <StatLabel color="blue.700" fontWeight="700">
                        {isSelectedSupplier ? "Payable Outstanding" : "Outstanding"}
                      </StatLabel>
                      <StatNumber color="blue.800">{formatCurrency(ledgerSummary.outstandingBalance)}</StatNumber>
                    </Stat>
                  </Box>
                  <Box
                    p={4}
                    borderWidth="1px"
                    borderColor="purple.200"
                    bg="purple.50"
                    borderRadius="xl"
                    shadow="sm"
                  >
                    <Stat>
                      <StatLabel color="purple.700" fontWeight="700">
                        Credit Limit
                      </StatLabel>
                      <StatNumber color="purple.800">{formatCurrency(ledgerSummary.creditLimit)}</StatNumber>
                    </Stat>
                  </Box>
                </SimpleGrid>

                <Tabs
                  index={ledgerTabIndex}
                  onChange={(index) => setLedgerTabIndex(index)}
                  variant="unstyled"
                  colorScheme="blue"
                >
                  <TabList
                    overflowX="auto"
                    bg="gray.100"
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="xl"
                    p={1}
                    gap={1}
                  >
                    <Tab
                      whiteSpace="nowrap"
                      borderRadius="lg"
                      fontWeight="700"
                      color="gray.600"
                      _selected={{
                        bg: "white",
                        color: "blue.700",
                        shadow: "sm",
                        borderWidth: "1px",
                        borderColor: "blue.200",
                      }}
                    >
                      Ledger Entries ({ledgerTotal})
                    </Tab>
                    <Tab
                      whiteSpace="nowrap"
                      borderRadius="lg"
                      fontWeight="700"
                      color="gray.600"
                      _selected={{
                        bg: "white",
                        color: "blue.700",
                        shadow: "sm",
                        borderWidth: "1px",
                        borderColor: "blue.200",
                      }}
                    >
                      {selectedTransactionPluralLabel} ({saleTotal})
                    </Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel px={0} pt={4}>
                      {useCompactLedgerView ? (
                        renderLedgerMobile()
                      ) : (
                        <CustomTable
                          title={`Ledger Entries (${ledgerTotal})`}
                          columns={ledgerColumns}
                          data={ledgerTableData}
                          loading={ledgerLoading}
                          actions={ledgerTableActions}
                          serial={{ show: true, text: "S.No." }}
                        />
                      )}
                    </TabPanel>
                    <TabPanel px={0} pt={4}>
                      {useCompactLedgerView ? (
                        renderSaleRecordsMobile()
                      ) : (
                        <CustomTable
                          title={`${selectedTransactionPluralLabel} (${saleTotal})`}
                          columns={saleColumns}
                          data={saleTableData}
                          loading={saleLoading}
                          actions={saleTableActions}
                          serial={{ show: true, text: "S.No." }}
                        />
                      )}
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </VStack>
            )}
          </>
        )}
      </VStack>

      {useCompactLedgerView ? (
        <Modal isOpen={isSaleDetailsOpen} onClose={closeSaleDetails} size="full" scrollBehavior="inside">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedTransactionSingularLabel} Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>{renderSaleDetailsContent()}</ModalBody>
          </ModalContent>
        </Modal>
      ) : (
        <CustomDrawer
          open={isSaleDetailsOpen}
          close={closeSaleDetails}
          title={`${selectedTransactionSingularLabel} Details`}
          size="md"
          loading={saleDetailsLoading && !saleRecordDetails}
        >
          {renderSaleDetailsContent()}
        </CustomDrawer>
      )}

      <Modal isOpen={isImportOpen} onClose={closeImportModal} isCentered size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Import {partyPluralLabel} From Contacts</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color="gray.600">
                Import {partyPluralLabel.toLowerCase()} directly from device contacts.
              </Text>

              <FormControl>
                <FormLabel>Default Tags (comma-separated)</FormLabel>
                <Input
                  value={importDefaultTags}
                  onChange={(e) => setImportDefaultTags(e.target.value)}
                  placeholder="retail, repeat"
                />
              </FormControl>

              {canUseDeviceContactImport ? (
                <>
                  <Stack direction={{ base: "column", sm: "row" }} spacing={3} align="stretch">
                    <Button
                      colorScheme="blue"
                      variant="solid"
                      onClick={handlePickSingleContact}
                      isLoading={isImportingContacts}
                      flex={1}
                      size="lg"
                      minH={{ base: "60px", sm: "64px" }}
                      borderRadius="xl"
                      fontWeight="semibold"
                      fontSize="md"
                      whiteSpace="normal"
                      textAlign="center"
                      px={6}
                      boxShadow="sm"
                      _hover={{ transform: "translateY(-1px)", boxShadow: "md" }}
                      _active={{ transform: "translateY(0)" }}
                    >
                      Pick Contact
                    </Button>
                    <Button
                      colorScheme="blue"
                      variant="outline"
                      onClick={handleImportFromDevice}
                      isLoading={isImportingContacts}
                      flex={1}
                      size="lg"
                      minH={{ base: "60px", sm: "64px" }}
                      borderRadius="xl"
                      fontWeight="semibold"
                      fontSize="md"
                      whiteSpace="normal"
                      textAlign="center"
                      px={6}
                      borderWidth="1.5px"
                      bg="blue.50"
                      _hover={{ bg: "blue.100", transform: "translateY(-1px)" }}
                      _active={{ transform: "translateY(0)" }}
                    >
                      Import All Contacts
                    </Button>
                  </Stack>

                  <Divider />
                </>
              ) : null}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={closeImportModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isContactReviewOpen} onClose={closeContactReviewModal} size="full" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent bg="#F7FAFC">
          <Box bg="#0A57B0" px={4} py={4} color="white">
            <HStack spacing={3}>
              <IconButton
                aria-label="Back"
                icon={<ArrowBackIcon />}
                onClick={closeContactReviewModal}
                variant="ghost"
                color="white"
                _hover={{ bg: "whiteAlpha.200" }}
                _active={{ bg: "whiteAlpha.300" }}
              />
              <Text fontSize="2xl" fontWeight="700">
                Add Party
              </Text>
            </HStack>
          </Box>

          <ModalBody px={4} py={5}>
            <VStack align="stretch" spacing={5}>
              <FormControl>
                <Input
                  value={formValues.fullName}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                      displayName: prev.displayName === prev.fullName ? e.target.value : prev.displayName,
                    }))
                  }
                  placeholder="Full name"
                  h="74px"
                  borderRadius="20px"
                  borderWidth="2px"
                  borderColor="#1C5FB0"
                  bg="white"
                  fontSize="2xl"
                  fontWeight="500"
                  px={6}
                />
              </FormControl>

              <HStack align="stretch" spacing={3}>
                <FormControl maxW="112px">
                  <Input
                    value={formValues.phoneCountryCode}
                    onChange={(e) =>
                      setFormValues((prev) => ({
                        ...prev,
                        phoneCountryCode: e.target.value,
                        phone: `${e.target.value}${prev.phoneNationalNumber}`.trim(),
                      }))
                    }
                    placeholder="+91"
                    h="74px"
                    borderRadius="18px"
                    borderWidth="2px"
                    borderColor="gray.300"
                    bg="white"
                    fontSize="2xl"
                    textAlign="center"
                    px={3}
                  />
                </FormControl>
                <FormControl flex="1">
                  <Input
                    value={formValues.phoneNationalNumber}
                    onChange={(e) =>
                      setFormValues((prev) => {
                        const localPhone = e.target.value.replace(/\D/g, "");
                        return {
                          ...prev,
                          phoneNationalNumber: localPhone,
                          phone: `${prev.phoneCountryCode}${localPhone}`.trim(),
                        };
                      })
                    }
                    placeholder="Phone number"
                    h="74px"
                    borderRadius="18px"
                    borderWidth="2px"
                    borderColor="gray.300"
                    bg="white"
                    fontSize="2xl"
                    px={6}
                    inputMode="tel"
                  />
                </FormControl>
              </HStack>

              <Box>
                <Text fontSize="2xl" color="gray.500" mb={3}>
                  Who are they?
                </Text>
                <RadioGroup
                  value={formValues.partyType}
                  onChange={(value) =>
                    setFormValues((prev) => ({ ...prev, partyType: value as "customer" | "supplier" }))
                  }
                >
                  <HStack spacing={8}>
                    <Radio value="customer" colorScheme="blue" size="lg">
                      <Text fontSize="xl" fontWeight="500">
                        Customer
                      </Text>
                    </Radio>
                    <Radio value="supplier" colorScheme="blue" size="lg">
                      <Text fontSize="xl" fontWeight="500">
                        Supplier
                      </Text>
                    </Radio>
                  </HStack>
                </RadioGroup>
              </Box>

              <Button
                variant="ghost"
                justifyContent="flex-start"
                px={0}
                color="#0A57B0"
                fontSize="lg"
                fontWeight="700"
                onClick={() => setShowContactExtraFields((prev) => !prev)}
                _hover={{ bg: "transparent", color: "#084A97" }}
                _active={{ bg: "transparent" }}
              >
                {showContactExtraFields ? "- Hide extra details" : "+ Add address & notes (optional)"}
              </Button>

              {showContactExtraFields ? (
                <VStack align="stretch" spacing={3}>
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                      value={formValues.email}
                      onChange={(e) => setFormValues((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="name@example.com"
                      bg="white"
                      borderRadius="16px"
                      h="54px"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Address line 1</FormLabel>
                    <Input
                      value={formValues.addressLine1}
                      onChange={(e) => setFormValues((prev) => ({ ...prev, addressLine1: e.target.value }))}
                      placeholder="Shop or street address"
                      bg="white"
                      borderRadius="16px"
                      h="54px"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Address line 2</FormLabel>
                    <Input
                      value={formValues.addressLine2}
                      onChange={(e) => setFormValues((prev) => ({ ...prev, addressLine2: e.target.value }))}
                      placeholder="Area, landmark"
                      bg="white"
                      borderRadius="16px"
                      h="54px"
                    />
                  </FormControl>
                  <SimpleGrid columns={2} spacing={3}>
                    <FormControl>
                      <FormLabel>City</FormLabel>
                      <Input
                        value={formValues.city}
                        onChange={(e) => setFormValues((prev) => ({ ...prev, city: e.target.value }))}
                        bg="white"
                        borderRadius="16px"
                        h="54px"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>State</FormLabel>
                      <Input
                        value={formValues.state}
                        onChange={(e) => setFormValues((prev) => ({ ...prev, state: e.target.value }))}
                        bg="white"
                        borderRadius="16px"
                        h="54px"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Postal code</FormLabel>
                      <Input
                        value={formValues.postalCode}
                        onChange={(e) => setFormValues((prev) => ({ ...prev, postalCode: e.target.value }))}
                        bg="white"
                        borderRadius="16px"
                        h="54px"
                        inputMode="numeric"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Country</FormLabel>
                      <Input
                        value={formValues.country}
                        onChange={(e) => setFormValues((prev) => ({ ...prev, country: e.target.value }))}
                        bg="white"
                        borderRadius="16px"
                        h="54px"
                      />
                    </FormControl>
                  </SimpleGrid>
                  <FormControl>
                    <FormLabel>Notes</FormLabel>
                    <Textarea
                      value={formValues.notes}
                      onChange={(e) => setFormValues((prev) => ({ ...prev, notes: e.target.value }))}
                      placeholder={`Anything useful to remember about this ${formValues.partyType}`}
                      bg="white"
                      borderRadius="16px"
                      minH="120px"
                      resize="vertical"
                    />
                  </FormControl>
                </VStack>
              ) : null}
            </VStack>
          </ModalBody>

          <ModalFooter px={4} py={4} borderTopWidth="1px" borderTopColor="gray.200" bg="white">
            <Button
              w="full"
              h="58px"
              colorScheme="blue"
              borderRadius="16px"
              fontSize="lg"
              onClick={handleCreateBuyer}
              isLoading={submitting}
            >
              Add {formValues.partyType === "supplier" ? "Supplier" : "Customer"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isBuyerSuccessOpen} onClose={closeBuyerSuccessModal} isCentered size="sm">
        <ModalOverlay bg="blackAlpha.500" />
        <ModalContent borderRadius="24px" overflow="hidden">
          <Box bgGradient="linear(180deg, #0E7A44 0%, #0A6538 100%)" color="white" px={6} py={7}>
            <VStack spacing={3}>
              <Flex
                h="64px"
                w="64px"
                borderRadius="full"
                bg="whiteAlpha.250"
                align="center"
                justify="center"
                fontSize="3xl"
                fontWeight="900"
              >
                OK
              </Flex>
              <Text fontSize="2xl" fontWeight="800">
                {lastCreatedBuyer?.partyType === "supplier" ? "Supplier saved" : "Customer saved"}
              </Text>
              <Text fontSize="sm" color="whiteAlpha.900" textAlign="center">
                {lastCreatedBuyer
                  ? `${getBuyerDisplayName(lastCreatedBuyer)} is ready for ledger entries.`
                  : `The contact has been added to your ${normalizedActivePartyType === "supplier" ? "supplier" : "customer"} list.`}
              </Text>
            </VStack>
          </Box>
          <ModalBody px={6} py={5}>
            <VStack spacing={3} align="stretch">
              <Button
                colorScheme="blue"
                h="52px"
                borderRadius="16px"
                onClick={async () => {
                  closeBuyerSuccessModal();
                  if (lastCreatedBuyer?._id) {
                    await openLedgerView(lastCreatedBuyer);
                  }
                }}
              >
                Open Ledger
              </Button>
              <Button
                variant="outline"
                h="52px"
                borderRadius="16px"
                onClick={closeBuyerSuccessModal}
              >
                Done
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {useCompactBuyerView ? (
        <Drawer isOpen={isOpen} placement="bottom" onClose={closeBuyerModal} size="xl">
          <DrawerOverlay bg="blackAlpha.500" />
          <DrawerContent borderTopRadius="24px" overflow="hidden">
            <DrawerHeader borderBottomWidth="1px" borderBottomColor="gray.100" fontWeight="800">
              Add {partySingularLabel}
            </DrawerHeader>
            <DrawerCloseButton top={4} right={4} />
            <DrawerBody py={4}>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    value={formValues.fullName}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, fullName: e.target.value }))}
                    placeholder={`${partySingularLabel} full name`}
                    h="52px"
                    borderRadius="16px"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Phone</FormLabel>
                  <Input
                    value={formValues.phone}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="10-digit or +country code"
                    h="52px"
                    borderRadius="16px"
                    inputMode="tel"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    value={formValues.email}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder={`${partySingularLabel.toLowerCase()}@example.com`}
                    h="52px"
                    borderRadius="16px"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Display Name (optional)</FormLabel>
                  <Input
                    value={formValues.displayName}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, displayName: e.target.value }))}
                    placeholder={`How this ${partySingularLabel.toLowerCase()} should appear`}
                    h="52px"
                    borderRadius="16px"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Tags (comma-separated)</FormLabel>
                  <Input
                    value={formValues.tags}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, tags: e.target.value }))}
                    placeholder="wholesale, repeat, priority"
                    h="52px"
                    borderRadius="16px"
                  />
                </FormControl>
              </VStack>
            </DrawerBody>
            <DrawerFooter borderTopWidth="1px" borderTopColor="gray.100" gap={3}>
              <Button variant="ghost" onClick={closeBuyerModal}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleCreateBuyer} isLoading={submitting} flex="1" h="52px">
                Save {partySingularLabel}
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Modal isOpen={isOpen} onClose={closeBuyerModal} isCentered size="lg">
          <ModalOverlay />
            <ModalContent>
            <ModalHeader>Add {partySingularLabel}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={3}>
                <FormControl>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    value={formValues.fullName}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, fullName: e.target.value }))}
                    placeholder={`${partySingularLabel} full name`}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Phone</FormLabel>
                  <Input
                    value={formValues.phone}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="10-digit or +country code"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    value={formValues.email}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder={`${partySingularLabel.toLowerCase()}@example.com`}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Display Name (optional)</FormLabel>
                  <Input
                    value={formValues.displayName}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, displayName: e.target.value }))}
                    placeholder={`How you want this ${partySingularLabel.toLowerCase()} to appear`}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Tags (comma-separated)</FormLabel>
                  <Input
                    value={formValues.tags}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, tags: e.target.value }))}
                    placeholder="wholesale, repeat, priority"
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={closeBuyerModal}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleCreateBuyer} isLoading={submitting}>
                Save {partySingularLabel}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      <Modal isOpen={isLedgerEntryOpen} onClose={onLedgerEntryClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Ledger Entry</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3}>
              <FormControl>
                <FormLabel>Entry Type</FormLabel>
                <Select
                  value={ledgerFormValues.entryType}
                  onChange={(e) => {
                    const nextType = e.target.value as LedgerEntryType;
                    setLedgerFormValues((prev) => ({
                      ...prev,
                      entryType: nextType,
                      direction: nextType === "payment" ? "credit" : nextType === "sale" ? "debit" : prev.direction,
                    }));
                  }}
                >
                  <option value="sale">{isSelectedSupplier ? "Purchase" : "Sale"}</option>
                  <option value="payment">{isSelectedSupplier ? "Payment Sent" : "Payment"}</option>
                  <option value="adjustment">Adjustment</option>
                </Select>
              </FormControl>

              <FormControl isDisabled={ledgerFormValues.entryType !== "adjustment"}>
                <FormLabel>Direction</FormLabel>
                <Select
                  value={
                    ledgerFormValues.entryType === "adjustment"
                      ? ledgerFormValues.direction
                      : ledgerFormValues.entryType === "payment"
                        ? "credit"
                        : "debit"
                  }
                  onChange={(e) =>
                    setLedgerFormValues((prev) => ({
                      ...prev,
                      direction: e.target.value as LedgerDirection,
                    }))
                  }
                >
                  <option value="debit">{isSelectedSupplier ? "You will give more" : "You will get more"}</option>
                  <option value="credit">{isSelectedSupplier ? "You will pay / reduce due" : "You will give credit / reduce due"}</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Amount</FormLabel>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={ledgerFormValues.amount}
                  onChange={(e) => setLedgerFormValues((prev) => ({ ...prev, amount: e.target.value }))}
                  placeholder="Enter amount"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Reference Type</FormLabel>
                <Select
                  value={ledgerFormValues.referenceType}
                  onChange={(e) =>
                    setLedgerFormValues((prev) => ({
                      ...prev,
                      referenceType: e.target.value as LedgerReferenceType,
                    }))
                  }
                >
                  <option value="manual">Manual</option>
                  <option value="order">Order</option>
                  <option value="refund">Refund</option>
                  <option value="import">Import</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Reference ID (optional)</FormLabel>
                <Input
                  value={ledgerFormValues.referenceId}
                  onChange={(e) => setLedgerFormValues((prev) => ({ ...prev, referenceId: e.target.value }))}
                  placeholder="orderId / refundId / rowId"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Entry Date (optional)</FormLabel>
                <Input
                  type="datetime-local"
                  value={ledgerFormValues.entryDate}
                  onChange={(e) => setLedgerFormValues((prev) => ({ ...prev, entryDate: e.target.value }))}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Notes (optional)</FormLabel>
                <Input
                  value={ledgerFormValues.notes}
                  onChange={(e) => setLedgerFormValues((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Optional remarks"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onLedgerEntryClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleCreateLedgerEntry} isLoading={ledgerSubmitting}>
              Save Entry
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isSaleRecordOpen} onClose={closeSaleRecordModal} isCentered size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add {isSelectedSupplier ? "Supplier Purchase" : "Customer Sale"} Record</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                <FormControl>
                  <FormLabel>{isSelectedSupplier ? "Purchase" : "Sale"} Date (optional)</FormLabel>
                  <Input
                    type="datetime-local"
                    value={saleFormValues.saleDate}
                    onChange={(e) => setSaleFormValues((prev) => ({ ...prev, saleDate: e.target.value }))}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Notes (optional)</FormLabel>
                  <Input
                    value={saleFormValues.notes}
                    onChange={(e) => setSaleFormValues((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder={isSelectedSupplier ? "Purchase remarks" : "Sale remarks"}
                  />
                </FormControl>
              </SimpleGrid>

              <Checkbox
                isChecked={saleFormValues.postToLedger}
                onChange={(e) => setSaleFormValues((prev) => ({ ...prev, postToLedger: e.target.checked }))}
              >
                Post {isSelectedSupplier ? "purchase" : "sale"} to ledger now
              </Checkbox>

              <Divider />

              <VStack align="stretch" spacing={4}>
                {saleFormValues.items.map((item, index) => (
                  <Box key={`sale-item-${index}`} borderWidth="1px" borderRadius="md" p={3}>
                    <SimpleGrid columns={{ base: 1, md: 2, xl: 6 }} spacing={3}>
                      <FormControl position="relative" gridColumn={{ base: "auto", md: "span 2 / span 2" }}>
                        <FormLabel>Item Name</FormLabel>
                        <Input
                          value={item.itemName}
                          onChange={(e) => updateSaleItem(index, "itemName", e.target.value)}
                          onFocus={() => setActiveSaleItemIndex(index)}
                          onBlur={() => {
                            window.setTimeout(() => {
                              setActiveSaleItemIndex((current) => (current === index ? null : current));
                            }, 120);
                          }}
                          placeholder="e.g. Cement Bag"
                          autoComplete="off"
                        />
                        {activeSaleItemIndex === index && item.itemName.trim() ? (
                          <Box
                            position="absolute"
                            top="calc(100% + 8px)"
                            left={0}
                            right={0}
                            bg="white"
                            borderWidth="1px"
                            borderColor="gray.200"
                            borderRadius="lg"
                            boxShadow="xl"
                            zIndex={20}
                            overflow="hidden"
                            maxH="320px"
                            overflowY="auto"
                          >
                            {saleItemSuggestionsLoading ? (
                              <Flex align="center" justify="center" py={4} gap={2}>
                                <Spinner size="sm" color="teal.500" />
                                <Text fontSize="sm" color="gray.600">
                                  Searching your inventory...
                                </Text>
                              </Flex>
                            ) : saleItemSuggestions.length > 0 ? (
                              <VStack align="stretch" spacing={0}>
                                {saleItemSuggestions.map((product, suggestionIndex) => (
                                  <Box
                                    key={product._id}
                                    px={3}
                                    py={3}
                                    cursor="pointer"
                                    bg="white"
                                    borderTopWidth={suggestionIndex === 0 ? "0" : "1px"}
                                    borderColor="gray.100"
                                    _hover={{ bg: "gray.50" }}
                                    onMouseDown={(event) => {
                                      event.preventDefault();
                                      applySuggestedProductToSaleItem(index, product);
                                    }}
                                  >
                                    <Flex justify="space-between" align="flex-start" gap={3}>
                                      <Box minW={0}>
                                        <Text
                                          fontSize="sm"
                                          fontWeight="semibold"
                                          color="gray.800"
                                          whiteSpace="normal"
                                          lineHeight="short"
                                        >
                                          {product.name}
                                        </Text>
                                        <Text
                                          fontSize="xs"
                                          color="gray.500"
                                          whiteSpace="normal"
                                          lineHeight="short"
                                          mt={1}
                                        >
                                          {[product.brand, product.sku ? `SKU: ${product.sku}` : ""]
                                            .filter(Boolean)
                                            .join(" | ") || "Inventory product"}
                                        </Text>
                                      </Box>
                                      <Box textAlign="right" flexShrink={0}>
                                        <Text fontSize="sm" fontWeight="semibold" color="teal.600">
                                          {formatCurrency(Number(product.price || 0))}
                                        </Text>
                                        {typeof product.stock === "number" && Number.isFinite(product.stock) ? (
                                          <Text fontSize="xs" color="gray.500">
                                            Stock {product.stock}
                                          </Text>
                                        ) : null}
                                      </Box>
                                    </Flex>
                                  </Box>
                                ))}
                              </VStack>
                            ) : (
                              <Box px={3} py={3}>
                                <Text fontSize="sm" color="gray.600">
                                  No matching inventory items found.
                                </Text>
                              </Box>
                            )}
                          </Box>
                        ) : null}
                        {item.productId ? (
                          <Text mt={2} fontSize="xs" color="teal.600" fontWeight="medium">
                            Price auto-filled from your inventory. You can still edit this row.
                          </Text>
                        ) : null}
                      </FormControl>

                      <FormControl>
                        <FormLabel>Quantity</FormLabel>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.quantity}
                          onChange={(e) => updateSaleItem(index, "quantity", e.target.value)}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Unit Price</FormLabel>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateSaleItem(index, "unitPrice", e.target.value)}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Discount</FormLabel>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.discount}
                          onChange={(e) => updateSaleItem(index, "discount", e.target.value)}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Tax</FormLabel>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.tax}
                          onChange={(e) => updateSaleItem(index, "tax", e.target.value)}
                        />
                      </FormControl>
                    </SimpleGrid>

                    <Flex mt={3} justify="space-between" align="center">
                      <Text fontSize="sm" color="gray.600">
                        Line Total: {formatCurrency(calculateSaleLineTotal(item))}
                      </Text>
                      <Button
                        size="xs"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => removeSaleItem(index)}
                        isDisabled={saleFormValues.items.length <= 1}
                      >
                        Remove
                      </Button>
                    </Flex>
                  </Box>
                ))}
              </VStack>

              <Button size="sm" variant="outline" leftIcon={<AddIcon />} alignSelf="flex-start" onClick={addSaleItem}>
                Add Item Row
              </Button>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={closeSaleRecordModal}>
              Cancel
            </Button>
            <Button colorScheme="teal" onClick={handleCreateSaleRecord} isLoading={saleSubmitting}>
              Save {selectedTransactionSingularLabel} Record
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={confirmDelete}
        title={`Delete ${selectedBuyer?.partyType === "supplier" ? "Supplier" : "Customer"}`}
        message={
          <Text>
            Are you sure you want to delete {selectedBuyer?.partyType === "supplier" ? "supplier" : "customer"}{" "}
            <strong>{selectedBuyer?.displayName || selectedBuyer?.buyerId?.fullName || "-"}</strong>?
            This action cannot be undone.
          </Text>
        }
        confirmText="Delete"
        confirmButtonProps={{ colorScheme: "red" }}
        isLoading={isDeleting}
      />

      <ConfirmationModal
        isOpen={isReverseOpen}
        onClose={onReverseClose}
        onConfirm={confirmReverse}
        title="Reverse Ledger Entry"
        message={
          <Text>
            Reverse this entry of <strong>{formatCurrency(selectedLedgerEntry?.amount || 0)}</strong>? This will
            create a compensating adjustment entry.
          </Text>
        }
        confirmText="Reverse"
        confirmButtonProps={{ colorScheme: "red" }}
        isLoading={isReversing}
      />
    </Box>
  );
});

export default CustomersTab;


