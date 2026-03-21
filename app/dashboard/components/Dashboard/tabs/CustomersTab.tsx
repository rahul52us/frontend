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
  Input,
  IconButton,
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
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Spinner,
  useBreakpointValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { AddIcon, ArrowBackIcon, CopyIcon } from "@chakra-ui/icons";
import stores from "../../../../store/stores";
import CustomTable from "../../../../component/config/component/CustomTable/CustomTable";
import ConfirmationModal from "../../../../component/common/ConfirmationModal/ConfirmationModal";
import CustomDrawer from "../../../../component/common/Drawer/CustomDrawer";

type BuyerProfile = {
  _id: string;
  displayName?: string;
  tags?: string[];
  outstandingBalance?: number;
  isBlocked?: boolean;
  source?: "manual" | "import" | "order";
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
  itemName: string;
  quantity: string;
  unitPrice: string;
  discount: string;
  tax: string;
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

const isMissingSaleDetailsEndpointError = (error: any) => {
  const text = getReadableErrorMessage(error, "").toLowerCase();
  return (
    text.includes("cannot get /api/buyer/") ||
    text.includes("cannot get /buyer/") ||
    text.includes("/sales/") ||
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
  itemName: "",
  quantity: "1",
  unitPrice: "",
  discount: "0",
  tax: "0",
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
    isOpen: isSaleDetailsOpen,
    onOpen: onSaleDetailsOpen,
    onClose: onSaleDetailsClose,
  } = useDisclosure();
  const { auth, buyerStore } = stores;

  const [buyers, setBuyers] = useState<BuyerProfile[]>([]);
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

  const [formValues, setFormValues] = useState({
    fullName: "",
    phone: "",
    email: "",
    displayName: "",
    tags: "",
  });

  const [ledgerFormValues, setLedgerFormValues] = useState({
    entryType: "sale" as LedgerEntryType,
    amount: "",
    direction: "debit" as LedgerDirection,
    referenceType: "manual" as LedgerReferenceType,
    referenceId: "",
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
  const isAndroidRuntime = useMemo(() => {
    if (typeof window === "undefined") return false;
    const platform = (window as any)?.Capacitor?.getPlatform?.();
    return platform === "android";
  }, []);
  const useCompactLedgerView = isMobileLedgerView || isAndroidRuntime;
  const useCompactBuyerView = isAndroidRuntime;
  const canUseDeviceContactImport = isAndroidRuntime;

  const getBuyerDisplayName = (buyer: BuyerProfile) => {
    return buyer.displayName || buyer.buyerId?.fullName || "-";
  };

  const formatCurrency = (amount: number) => `Rs ${Number(amount || 0).toFixed(2)}`;
  const formatDateTime = (value?: string) => (value ? new Date(value).toLocaleString() : "-");
  const formatShortId = (value?: string) => (value ? value.slice(-6) : "");
  const formatLedgerReference = (entry: BuyerLedgerEntry) =>
    entry.referenceId
      ? `${entry.referenceType || "manual"}: ${formatShortId(entry.referenceId)}`
      : entry.referenceType || "manual";
  const formatSignedAmount = (entry: BuyerLedgerEntry) =>
    `${entry.direction === "credit" ? "-" : "+"}${formatCurrency(Number(entry.amount || 0))}`;
  const getTimelineTitle = (entry: BuyerLedgerEntry) => {
    if (entry.relationType === "reversal") {
      return "Reversal Adjustment";
    }
    if (entry.isPrimarySaleLedgerEntry) {
      return "Posted To Ledger";
    }
    if (entry.entryType === "payment") {
      return "Payment Received";
    }
    if (entry.entryType === "adjustment") {
      return "Manual Adjustment";
    }
    return "Sale Ledger Entry";
  };

  const fetchBuyers = async (pageToLoad = 1, query = search) => {
    if (!companyId) {
      return;
    }

    setLoading(true);
    try {
      const response = await buyerStore.listBuyerProfiles({
        companyId,
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
        title: "Failed to load buyers",
        description: error?.message || "Unable to fetch buyer list",
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
        title: "Failed to load sale records",
        description: error?.message || "Unable to fetch buyer sale records",
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

  const buildLocalSaleRecordDetails = (record: BuyerSaleRecord): BuyerSaleRecordDetails => {
    const directEntries = ledgerEntries.filter(
      (entry) =>
        (entry.referenceType === "saleRecord" && entry.referenceId === record._id) ||
        (record.ledgerEntryId ? String(entry._id) === String(record.ledgerEntryId) : false)
    );
    const directEntryIds = directEntries.map((entry) => String(entry._id));
    const reversalEntries = ledgerEntries.filter(
      (entry) => entry.referenceId && directEntryIds.includes(String(entry.referenceId))
    );
    const timeline = [...directEntries, ...reversalEntries]
      .filter((entry, index, allEntries) => allEntries.findIndex((candidate) => candidate._id === entry._id) === index)
      .sort((a, b) => {
        const aTime = new Date(a.entryDate || a.createdAt || 0).getTime();
        const bTime = new Date(b.entryDate || b.createdAt || 0).getTime();
        return aTime - bTime;
      })
      .map((entry) => ({
        ...entry,
        relationType: directEntryIds.includes(String(entry._id))
          ? ("direct" as const)
          : ("reversal" as const),
        isPrimarySaleLedgerEntry:
          record.ledgerEntryId && String(entry._id) === String(record.ledgerEntryId),
      }));

    const activeTimelineEntries = timeline.filter((entry) => entry.status !== "reversed");
    const paidAmount = activeTimelineEntries.reduce((sum, entry) => {
      if (entry.entryType !== "payment" || entry.direction !== "credit") {
        return sum;
      }
      return sum + Number(entry.amount || 0);
    }, 0);
    const adjustmentDebitAmount = activeTimelineEntries.reduce((sum, entry) => {
      if (entry.entryType !== "adjustment" || entry.direction !== "debit") {
        return sum;
      }
      return sum + Number(entry.amount || 0);
    }, 0);
    const adjustmentCreditAmount = activeTimelineEntries.reduce((sum, entry) => {
      if (entry.entryType !== "adjustment" || entry.direction !== "credit") {
        return sum;
      }
      return sum + Number(entry.amount || 0);
    }, 0);

    return {
      saleRecord: record,
      timeline,
      summary: {
        saleAmount: Number(record.grandTotal || 0),
        paidAmount,
        adjustmentDebitAmount,
        adjustmentCreditAmount,
        remainingDue: Math.max(
          Number(record.grandTotal || 0) + adjustmentDebitAmount - paidAmount - adjustmentCreditAmount,
          0
        ),
        isPosted: Boolean(record.ledgerEntryId),
        eventCount: timeline.length,
      },
    };
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
      if (isMissingSaleDetailsEndpointError(error)) {
        const localDetails = buildLocalSaleRecordDetails(record);
        setSaleRecordDetails(localDetails);
        toast({
          title: "Showing local sale history",
          description: "Detailed sale history endpoint is not deployed yet, so this view is using available local data.",
          status: "info",
          duration: 3500,
          isClosable: true,
        });
        return;
      }

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
      fullName: "",
      phone: "",
      email: "",
      displayName: "",
      tags: "",
    });
  };

  const resetLedgerForm = () => {
    setLedgerFormValues({
      entryType: "sale",
      amount: "",
      direction: "debit",
      referenceType: "manual",
      referenceId: "",
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

  const closeSaleRecordModal = () => {
    onSaleRecordClose();
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
          "Grant contacts permission in app settings, or add the buyer manually.",
        ),
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsImportingContacts(false);
    }
  };

  const handlePickSingleContact = async () =>
    importContactsWith(pickSingleContactFromDevice, "Choose one contact to continue.");

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

    if (!formValues.phone.trim() && !formValues.email.trim()) {
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

      await buyerStore.upsertBuyer({
        companyId,
        fullName: formValues.fullName.trim() || undefined,
        phone: formValues.phone.trim() || undefined,
        email: formValues.email.trim() || undefined,
        displayName: formValues.displayName.trim() || undefined,
        tags: tagsArray.length ? tagsArray : undefined,
        source: "manual",
      });

      toast({
        title: "Buyer saved",
        description: "Buyer profile has been created/updated.",
        status: "success",
        duration: 2500,
        isClosable: true,
      });

      resetForm();
      onClose();
      fetchBuyers(1);
    } catch (error: any) {
      toast({
        title: "Failed to save buyer",
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
      items: prev.items.map((item, idx) => (idx === index ? { ...item, [key]: value } : item)),
    }));
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
        title: "Sale record saved",
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
        title: "Failed to save sale record",
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
        title: "Sale posted to ledger",
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
        title: "Failed to post sale",
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
    setLedgerFormValues({
      entryType: "payment",
      amount: String(entry.amount),
      direction: "credit",
      referenceType: entry.referenceType || "manual",
      referenceId: entry.referenceId || entry._id || "",
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
        title: "Buyer deleted",
        status: "success",
        duration: 2500,
        isClosable: true,
      });
      onDeleteClose();
      const nextPage = buyers.length === 1 && page > 1 ? page - 1 : page;
      fetchBuyers(nextPage, search);
    } catch (error: any) {
      toast({
        title: "Failed to delete buyer",
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
  }, [companyId, search, selectedLedgerBuyer]);

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
        title: "Delete Buyer",
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
    <VStack align="stretch" spacing={4}>
      <Box>
        <Text fontSize="sm" color="gray.500" mb={2}>
          Buyers ({total})
        </Text>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone or email"
          bg="white"
          borderRadius="xl"
        />
      </Box>

      {loading ? (
        <Text fontSize="sm" color="gray.500">
          Loading buyers...
        </Text>
      ) : buyers.length === 0 ? (
        <Text fontSize="sm" color="gray.500">
          No buyers found.
        </Text>
      ) : (
        buyers.map((buyer) => (
          <Box
            key={buyer._id}
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="xl"
            bg="white"
            shadow="sm"
            overflow="hidden"
          >
            <Box
              px={4}
              py={3}
              bg={buyer.isBlocked ? "red.50" : "blue.50"}
              borderBottomWidth="1px"
              borderBottomColor="gray.200"
            >
              <HStack justify="space-between" align="start" spacing={3}>
                <Box>
                  <Text fontSize="md" fontWeight="800" color="gray.900">
                    {getBuyerDisplayName(buyer)}
                  </Text>
                  <HStack spacing={2} mt={2} wrap="wrap">
                    <Badge colorScheme="purple" textTransform="capitalize">
                      {buyer.source || "manual"}
                    </Badge>
                    <Badge colorScheme={buyer.isBlocked ? "red" : "green"}>
                      {buyer.isBlocked ? "Blocked" : "Active"}
                    </Badge>
                  </HStack>
                </Box>
                <Text fontSize="sm" fontWeight="800" color="blue.700" textAlign="right">
                  {formatCurrency(Number(buyer.outstandingBalance || 0))}
                </Text>
              </HStack>
            </Box>

            <VStack align="stretch" spacing={3} p={4}>
              <SimpleGrid columns={2} spacing={3}>
                <Box>
                  <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="700">
                    Phone
                  </Text>
                  <Text fontSize="sm" color="gray.800">
                    {buyer.buyerId?.phoneE164 || "-"}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="700">
                    Email
                  </Text>
                  <Text fontSize="sm" color="gray.800" wordBreak="break-word">
                    {buyer.buyerId?.emailNormalized || "-"}
                  </Text>
                </Box>
              </SimpleGrid>

              <Box>
                <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="700" mb={2}>
                  Tags
                </Text>
                {buyer.tags && buyer.tags.length ? (
                  <HStack spacing={2} wrap="wrap">
                    {buyer.tags.slice(0, 4).map((tag, idx) => (
                      <Badge key={`${buyer._id}-${tag}-${idx}`} colorScheme="gray">
                        {tag}
                      </Badge>
                    ))}
                  </HStack>
                ) : (
                  <Text fontSize="sm" color="gray.500">
                    No tags
                  </Text>
                )}
              </Box>

              <HStack justify="space-between" pt={1}>
                <Button size="sm" colorScheme="blue" borderRadius="full" onClick={() => openLedgerView(buyer)}>
                  View Ledger
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="red"
                  borderRadius="full"
                  onClick={() => openDeleteModal(buyer)}
                >
                  Delete
                </Button>
              </HStack>
            </VStack>
          </Box>
        ))
      )}

      <HStack justify="space-between" pt={1}>
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
        <Text fontSize="sm" color="gray.600">
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
  );

  const ledgerTableData = ledgerEntries.map((entry) => ({
      ...entry,
      entryDate: entry.entryDate,
      typeBadge: (
        <Badge
          colorScheme={entry.entryType === "sale" ? "orange" : entry.entryType === "payment" ? "green" : "blue"}
          textTransform="capitalize"
        >
          {entry.entryType}
        </Badge>
      ),
      directionBadge: (
        <Badge colorScheme={entry.direction === "debit" ? "orange" : "green"} textTransform="capitalize">
          {entry.direction}
        </Badge>
      ),
      amountDisplay: (
        <Text color={entry.direction === "debit" ? "orange.600" : "green.600"} fontWeight="bold">
          {formatCurrency(entry.amount || 0)} {entry.direction === "debit" ? "(Dr)" : "(Cr)"}
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
      headerName: "Direction",
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
              Post to Ledger
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
        <Text fontSize="sm" color="gray.500">
          Loading ledger entries...
        </Text>
      ) : ledgerEntries.length === 0 ? (
        <Text fontSize="sm" color="gray.500">
          No ledger entries found.
        </Text>
      ) : (
        ledgerEntries.map((entry) => (
          <Box
            key={entry._id}
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="xl"
            bg="white"
            shadow="sm"
            overflow="hidden"
          >
            <Box
              px={4}
              py={3}
              bg={
                entry.entryType === "sale"
                  ? "orange.50"
                  : entry.entryType === "payment"
                    ? "green.50"
                    : "blue.50"
              }
              borderBottomWidth="1px"
              borderBottomColor="gray.200"
            >
              <HStack justify="space-between" align="center">
                <HStack spacing={2}>
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
                    px={2}
                  >
                    {entry.entryType}
                  </Badge>
                  <Badge
                    colorScheme={entry.direction === "debit" ? "orange" : "green"}
                    textTransform="capitalize"
                    borderRadius="full"
                    px={2}
                  >
                    {entry.direction}
                  </Badge>
                </HStack>
                <Text
                  fontWeight="800"
                  fontSize="sm"
                  color={entry.direction === "debit" ? "orange.700" : "green.700"}
                >
                  {formatCurrency(entry.amount || 0)} {entry.direction === "debit" ? "(Dr)" : "(Cr)"}
                </Text>
              </HStack>
            </Box>
            <VStack align="stretch" spacing={3} p={4}>
              <SimpleGrid columns={2} spacing={2}>
                <Box>
                  <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="700">
                    Date
                  </Text>
                  <Text fontSize="sm" color="gray.800">
                    {formatDateTime(entry.entryDate)}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="700">
                    Balance
                  </Text>
                  <Text fontSize="sm" color="gray.800" fontWeight="700">
                    {formatCurrency(entry.balanceAfter || 0)}
                  </Text>
                </Box>
              </SimpleGrid>
              <Box>
                <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="700">
                  Reference
                </Text>
                <Text fontSize="sm" color="gray.700">
                  {formatLedgerReference(entry)}
                </Text>
              </Box>
              {entry.notes ? (
                <Box>
                  <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="700">
                    Notes
                  </Text>
                  <Text fontSize="sm" color="gray.700">
                    {entry.notes}
                  </Text>
                </Box>
              ) : null}
              <HStack justify="space-between">
                <Badge
                  alignSelf="flex-start"
                  colorScheme={entry.status === "reversed" ? "red" : "green"}
                  textTransform="capitalize"
                  borderRadius="full"
                  px={2}
                >
                  {entry.status || "active"}
                </Badge>
                {entry.status !== "reversed" ? (
                  <HStack spacing={2}>
                    {entry.direction === "debit" && (
                      <Button
                        size="xs"
                        colorScheme="green"
                        variant="outline"
                        borderRadius="full"
                        onClick={() => openPayModal(entry)}
                      >
                        Pay
                      </Button>
                    )}
                    <Button
                      size="xs"
                      colorScheme="red"
                      variant="outline"
                      borderRadius="full"
                      onClick={() => openReverseModal(entry)}
                    >
                      Reverse
                    </Button>
                  </HStack>
                ) : null}
              </HStack>
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
          Loading sale records...
        </Text>
      ) : saleRecords.length === 0 ? (
        <Text fontSize="sm" color="gray.500">
          No sale records found.
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
                    Post to Ledger
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

  const renderSaleDetailsContent = () => {
    const activeSaleRecord = saleRecordDetails?.saleRecord || selectedSaleRecord;

    if (saleDetailsLoading) {
      return (
        <Flex minH="240px" align="center" justify="center" direction="column" gap={3}>
          <Spinner color="blue.500" thickness="3px" size="lg" />
          <Text fontSize="sm" color="gray.500">
            Loading sale history{activeSaleRecord? ` for ${formatShortId(activeSaleRecord._id)}` : ""}...
          </Text>
        </Flex>
      );
    }

    if (!saleRecordDetails) {
      return (
        <Flex minH="200px" align="center" justify="center">
          <Text fontSize="sm" color="gray.500">
            Sale details are not available{activeSaleRecord ? ` for ${formatShortId(activeSaleRecord._id)}` : ""}.
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
                Sale ID
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
            <IconButton
              aria-label="Copy sale ID"
              icon={<CopyIcon />}
              size="sm"
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(saleRecord._id || "");
                toast({ title: "Sale ID Copied", status: "success", duration: 1000, isClosable: true });
              }}
            />
          </HStack>
        </Box>

        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
          <Box p={3} borderWidth="1px" borderColor="gray.200" borderRadius="xl" bg="white">
            <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="700">
              Sale Total
            </Text>
            <Text fontSize="lg" fontWeight="800" color="gray.900">
              {formatCurrency(summary.saleAmount)}
            </Text>
          </Box>
          <Box p={3} borderWidth="1px" borderColor="green.200" borderRadius="xl" bg="green.50">
            <Text fontSize="xs" color="green.700" textTransform="uppercase" fontWeight="700">
              Paid
            </Text>
            <Text fontSize="lg" fontWeight="800" color="green.800">
              {formatCurrency(summary.paidAmount)}
            </Text>
          </Box>
          <Box p={3} borderWidth="1px" borderColor="orange.200" borderRadius="xl" bg="orange.50">
            <Text fontSize="xs" color="orange.700" textTransform="uppercase" fontWeight="700">
              Debit Adjustments
            </Text>
            <Text fontSize="lg" fontWeight="800" color="orange.800">
              {formatCurrency(summary.adjustmentDebitAmount)}
            </Text>
          </Box>
          <Box p={3} borderWidth="1px" borderColor="blue.200" borderRadius="xl" bg="blue.50">
            <Text fontSize="xs" color="blue.700" textTransform="uppercase" fontWeight="700">
              Remaining Due
            </Text>
            <Text fontSize="lg" fontWeight="800" color="blue.800">
              {formatCurrency(summary.remainingDue)}
            </Text>
          </Box>
        </SimpleGrid>

        <SimpleGrid columns={1} spacing={3}>
          <Box p={4} borderWidth="1px" borderColor="gray.200" borderRadius="xl" bg="white">
            <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="700">
              Sale Meta
            </Text>
            <VStack align="stretch" spacing={2} mt={3}>
              <Flex justify="space-between" align="flex-start" gap={3} wrap="wrap">
                <Text fontSize="sm" color="gray.600">
                  Sale Date
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
              Sale Totals
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
                    Sale Record Created
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
                No ledger activity linked to this sale yet.
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
                          {entry.entryType}
                        </Badge>
                        <Badge colorScheme={entry.direction === "debit" ? "orange" : "green"} textTransform="capitalize">
                          {entry.direction}
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
                        color={entry.direction === "debit" ? "orange.700" : "green.700"}
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

  return (
    <Box px={{ base: 2, md: 4 }} py={{ base: 2, md: 4 }}>
      <VStack align="stretch" spacing={4}>
        <Flex
          justify="space-between"
          align={{ base: "stretch", md: "center" }}
          direction={{ base: "column", md: "row" }}
          gap={3}
        >
          <Box>
            <Heading size="md">
              {selectedLedgerBuyer ? `Buyer Ledger - ${selectedBuyerName}` : "Buyer Management"}
            </Heading>
            <Text fontSize="sm" color="gray.500">
              {selectedLedgerBuyer
                ? "Track sale, payment and adjustment entries"
                : "Manage offline buyers for your company"}
            </Text>
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
                Back to Buyers
              </Button>
              <Button
                leftIcon={<AddIcon />}
                colorScheme="teal"
                onClick={onSaleRecordOpen}
                size={{ base: "sm", md: "md" }}
                w={{ base: "full", sm: "auto" }}
              >
                Add Sale Record
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
                onClick={onOpen}
                size={{ base: "sm", md: "md" }}
                w={{ base: "full", sm: "auto" }}
              >
                Add Buyer
              </Button>
            </Stack>
          )}
        </Flex>

        {!selectedLedgerBuyer ? (
          useCompactBuyerView ? (
            renderBuyerProfilesMobile()
          ) : (
            <CustomTable
              title={`Buyers (${total})`}
              columns={buyerColumns}
              data={buyerTableData}
              loading={loading}
              actions={buyerTableActions}
              serial={{ show: true, text: "S.No." }}
            />
          )
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
                    Total Sale (Debit)
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
                    Total Payment (Credit)
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
                    Outstanding
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
                  Sale Records ({saleTotal})
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
                      title={`Sale Records (${saleTotal})`}
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
      </VStack>

      {useCompactLedgerView ? (
        <Modal isOpen={isSaleDetailsOpen} onClose={closeSaleDetails} size="full" scrollBehavior="inside">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Sale Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>{renderSaleDetailsContent()}</ModalBody>
          </ModalContent>
        </Modal>
      ) : (
        <CustomDrawer
          open={isSaleDetailsOpen}
          close={closeSaleDetails}
          title="Sale Details"
          size="md"
          loading={saleDetailsLoading && !saleRecordDetails}
        >
          {renderSaleDetailsContent()}
        </CustomDrawer>
      )}

      <Modal isOpen={isImportOpen} onClose={closeImportModal} isCentered size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Import Buyers From Contacts</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color="gray.600">
                Import buyers directly from device contacts.
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

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Buyer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3}>
              <FormControl>
                <FormLabel>Full Name</FormLabel>
                <Input
                  value={formValues.fullName}
                  onChange={(e) => setFormValues((prev) => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Buyer full name"
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
                  placeholder="buyer@example.com"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Display Name (optional)</FormLabel>
                <Input
                  value={formValues.displayName}
                  onChange={(e) => setFormValues((prev) => ({ ...prev, displayName: e.target.value }))}
                  placeholder="How you want this buyer to appear"
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
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleCreateBuyer} isLoading={submitting}>
              Save Buyer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
                  <option value="sale">Sale</option>
                  <option value="payment">Payment</option>
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
                  <option value="debit">Debit (increase due)</option>
                  <option value="credit">Credit (decrease due)</option>
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
          <ModalHeader>Add Buyer Sale Record</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                <FormControl>
                  <FormLabel>Sale Date (optional)</FormLabel>
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
                    placeholder="Sale remarks"
                  />
                </FormControl>
              </SimpleGrid>

              <Checkbox
                isChecked={saleFormValues.postToLedger}
                onChange={(e) => setSaleFormValues((prev) => ({ ...prev, postToLedger: e.target.checked }))}
              >
                Post to ledger now
              </Checkbox>

              <Divider />

              <VStack align="stretch" spacing={4}>
                {saleFormValues.items.map((item, index) => (
                  <Box key={`sale-item-${index}`} borderWidth="1px" borderRadius="md" p={3}>
                    <SimpleGrid columns={{ base: 1, md: 5 }} spacing={3}>
                      <FormControl>
                        <FormLabel>Item Name</FormLabel>
                        <Input
                          value={item.itemName}
                          onChange={(e) => updateSaleItem(index, "itemName", e.target.value)}
                          placeholder="e.g. Cement Bag"
                        />
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
              Save Sale Record
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={confirmDelete}
        title="Delete Buyer"
        message={
          <Text>
            Are you sure you want to delete buyer{" "}
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
