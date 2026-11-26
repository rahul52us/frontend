"use client";

import {
  Box,
  Text,
  useBreakpointValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo, useState } from "react";
import ConfirmationModal from "../../../../component/common/ConfirmationModal/ConfirmationModal";
import stores from "../../../../store/stores";
import { MerchantPageShell } from "../../common/merchantDashboardUI";
import {
  CustomerDetailView,
  CustomerFormModals,
  CustomerListView,
  PaymentModal,
  SaleDetailsModal,
  SaleRecordModal,
} from "./customers";
import { useCustomerTheme } from "./customers/theme";
import {
  BuyerFilterKey,
  BuyerFormErrors,
  BuyerImportContact,
  BuyerLedgerEntry,
  BuyerProfile,
  BuyerSaleRecord,
  BuyerSaleRecordDetails,
  defaultLedgerSummary,
  defaultSaleFormItem,
  getDefaultBuyerFormValues,
  getDefaultLedgerFormValues,
  InventoryProductSuggestion,
  LedgerFormValues,
  LedgerSummary,
  PendingSaleInvoiceDownload,
  SaleFormItem,
} from "./customers/types";
import {
  canDownloadLedgerInvoice,
  composePhoneFromForm,
  deliverPdfBlob,
  ensureDeviceContactsPermission,
  formatCurrency,
  formatShortId,
  getBuyerBalanceState,
  getBuyerDisplayName,
  getFileNameFromContentDisposition,
  getLinkedSaleRecordIdFromEntry,
  getLinkedSaleRemainingDue,
  getReadableErrorMessage,
  isMissingImportEndpointError,
  isValidImportEmail,
  isValidImportPhone,
  readBlobErrorMessage,
  splitPhoneParts,
} from "./customers/utils";

const CustomersTab: React.FC = observer(() => {
  const { auth, buyerStore, shopStore } = stores;
  const theme = useCustomerTheme();
  const { cPage, mobileLedgerPalette } = theme;
  const toast = useToast();

  // Disclosures
  const { isOpen, onOpen, onClose } = useDisclosure();
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
    isOpen: isLedgerEntryOpen,
    onOpen: onLedgerEntryOpen,
    onClose: onLedgerEntryClose,
  } = useDisclosure();
  const {
    isOpen: isSaleRecordOpen,
    onOpen: onSaleRecordOpen,
    onClose: onSaleRecordClose,
  } = useDisclosure();
  const {
    isOpen: isSaleDetailsOpen,
    onOpen: onSaleDetailsOpen,
    onClose: onSaleDetailsClose,
  } = useDisclosure();
  const {
    isOpen: isInvoiceOptionsOpen,
    onOpen: onInvoiceOptionsOpen,
    onClose: onInvoiceOptionsClose,
  } = useDisclosure();

  // State
  const [buyers, setBuyers] = useState<BuyerProfile[]>([]);
  const [activePartyType, setActivePartyType] = useState<"customer" | "supplier">("customer");
  const [selectedLedgerBuyer, setSelectedLedgerBuyer] = useState<BuyerProfile | null>(null);
  const [ledgerEntries, setLedgerEntries] = useState<BuyerLedgerEntry[]>([]);
  const [saleRecords, setSaleRecords] = useState<BuyerSaleRecord[]>([]);
  const [ledgerSummary, setLedgerSummary] = useState<LedgerSummary>(defaultLedgerSummary);

  const [search, setSearch] = useState("");
  const [balanceFilter, setBalanceFilter] = useState<BuyerFilterKey>("all");
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
  const [paymentContextEntry, setPaymentContextEntry] = useState<BuyerLedgerEntry | null>(null);
  const [selectedSaleRecord, setSelectedSaleRecord] = useState<BuyerSaleRecord | null>(null);
  const [saleRecordDetails, setSaleRecordDetails] = useState<BuyerSaleRecordDetails | null>(null);
  const [saleDetailsLoading, setSaleDetailsLoading] = useState(false);
  const [invoiceDownloadingSaleId, setInvoiceDownloadingSaleId] = useState("");
  const [invoiceDownloadingLedgerEntryId, setInvoiceDownloadingLedgerEntryId] = useState("");
  const [pendingSaleInvoiceDownload, setPendingSaleInvoiceDownload] = useState<PendingSaleInvoiceDownload | null>(null);
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

  const limit = 20;
  const ledgerLimit = 20;
  const saleLimit = 20;

  const [formValues, setFormValues] = useState(getDefaultBuyerFormValues);
  const [buyerFormErrors, setBuyerFormErrors] = useState<BuyerFormErrors>({});
  const [showContactExtraFields, setShowContactExtraFields] = useState(false);
  const [isPickedContactFlow, setIsPickedContactFlow] = useState(false);
  const [lastCreatedBuyer, setLastCreatedBuyer] = useState<BuyerProfile | null>(null);

  const [ledgerFormValues, setLedgerFormValues] = useState<LedgerFormValues>(getDefaultLedgerFormValues);

  const [saleFormValues, setSaleFormValues] = useState({
    saleDate: "",
    notes: "",
    postToLedger: true,
    items: [defaultSaleFormItem()],
  });

  const [importDefaultTags, setImportDefaultTags] = useState("");

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

  useEffect(() => {
    if (!selectedLedgerBuyer || typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedLedgerBuyer]);

  const companyId = useMemo(() => auth.company?._id || auth.company || "", [auth.company]);
  const isSuperAdmin = useMemo(() => {
    const user = auth.user;
    const normalizedRoles = Array.isArray(user?.role)
      ? user.role.filter(Boolean)
      : [user?.role].filter(Boolean);
    return (
      user?.type === "superAdmin" ||
      user?.role === "superAdmin" ||
      normalizedRoles.includes("superAdmin")
    );
  }, [auth.user]);

  const isAdmin = useMemo(() => {
    const user = auth.user;
    const normalizedRoles = Array.isArray(user?.role)
      ? user.role.filter(Boolean)
      : [user?.role].filter(Boolean);
    return (
      isSuperAdmin ||
      user?.type === "admin" ||
      user?.role === "admin" ||
      normalizedRoles.includes("admin")
    );
  }, [auth.user, isSuperAdmin]);

  const isShopApproved = useMemo(() => {
    if (isAdmin) return true;
    const company = auth.company || auth.user?.company;
    const reviewStatus = typeof company === "object" ? (company as any)?.reviewStatus : null;
    return reviewStatus === "approved";
  }, [isAdmin, auth.company, auth.user?.company]);

  const useCompactLedgerView = isMobileLedgerView || isAndroidRuntime || isMobileDevice;
  const useCompactBuyerView = !isDesktopBuyerView;
  const canUseDeviceContactImport = isAndroidRuntime;

  const normalizedActivePartyType = activePartyType === "supplier" ? "supplier" : "customer";
  const isSupplierTab = normalizedActivePartyType === "supplier";
  const partySingularLabel = isSupplierTab ? "Supplier" : "Customer";
  const partyPluralLabel = isSupplierTab ? "Suppliers" : "Customers";
  const selectedPartyType = (selectedLedgerBuyer?.partyType || normalizedActivePartyType) as "customer" | "supplier";
  const isSelectedSupplier = selectedPartyType === "supplier";
  const selectedTransactionSingularLabel = isSelectedSupplier ? "Purchase" : "Sale";

  const activeSaleItemQuery = useMemo(() => {
    if (activeSaleItemIndex === null) {
      return "";
    }
    return saleFormValues.items[activeSaleItemIndex]?.itemName?.trim() || "";
  }, [activeSaleItemIndex, saleFormValues.items]);

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

  const buyerFilterOptions = useMemo<{ key: BuyerFilterKey; label: string }[]>(() => {
    if (isSupplierTab) {
      return [
        { key: "all", label: "All" },
        { key: "payable", label: "To pay" },
        { key: "settled", label: "Settled" },
      ];
    }

    return [
      { key: "all", label: "All" },
      { key: "receivable", label: "To receive" },
      { key: "settled", label: "Settled" },
    ];
  }, [isSupplierTab]);

  const filteredBuyers = useMemo(() => {
    if (balanceFilter === "all") {
      return buyers;
    }
    return buyers.filter((buyer) => getBuyerBalanceState(buyer, normalizedActivePartyType) === balanceFilter);
  }, [balanceFilter, buyers, normalizedActivePartyType]);

  useEffect(() => {
    const isAllowedFilter = buyerFilterOptions.some((option) => option.key === balanceFilter);
    if (!isAllowedFilter) {
      setBalanceFilter("all");
    }
  }, [balanceFilter, buyerFilterOptions]);

  const clearBuyerFormErrors = (...fields: Array<"fullName" | "phone" | "email">) => {
    setBuyerFormErrors((prev) => {
      const next = { ...prev };
      fields.forEach((field) => {
        delete next[field];
      });
      return next;
    });
  };

  const validateBuyerForm = () => {
    const errors: BuyerFormErrors = {};
    const composedPhone = composePhoneFromForm(formValues);
    const fullName = formValues.fullName.trim();
    const displayName = formValues.displayName.trim();
    const email = formValues.email.trim();
    const draftPartyLabel = formValues.partyType === "supplier" ? "supplier" : "customer";

    if (!fullName && !displayName) {
      errors.fullName = `Add a ${draftPartyLabel} name.`;
    }

    if (!composedPhone.trim() && !email) {
      errors.phone = "Add a phone number or email.";
      errors.email = "Add a phone number or email.";
    }

    if (composedPhone.trim() && !isValidImportPhone(composedPhone.trim())) {
      errors.phone = "Enter a valid phone number.";
    }

    if (email && !isValidImportEmail(email)) {
      errors.email = "Enter a valid email address.";
    }

    setBuyerFormErrors(errors);

    return {
      isValid: Object.keys(errors).length === 0,
      composedPhone,
      firstError:
        errors.fullName ||
        errors.phone ||
        errors.email ||
        "Please review the highlighted fields.",
    };
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
        balanceFilter: balanceFilter === "all" ? undefined : balanceFilter,
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
      setSelectedLedgerBuyer((current) => {
        if (!current || current._id !== profileId) {
          return current;
        }

        return {
          ...current,
          outstandingBalance: Number(nextSummary.outstandingBalance || 0),
          creditLimit: Number(nextSummary.creditLimit || 0),
          isBlocked: Boolean(nextSummary.isBlocked),
        };
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
        title: `Failed to load ${selectedTransactionSingularLabel.toLowerCase()} records`,
        description: error?.message || `Unable to fetch ${selectedTransactionSingularLabel.toLowerCase()} records`,
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
    await fetchLedgerEntries(buyer._id, 1);
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
    setSelectedSaleRecord(null);
    setSaleRecordDetails(null);
    setPaymentContextEntry(null);
    onSaleDetailsClose();
    resetSaleForm();
  };

  const closeSaleDetails = () => {
    setSelectedSaleRecord(null);
    setSaleRecordDetails(null);
    onSaleDetailsClose();
  };

  const closeLedgerEntryModal = () => {
    setPaymentContextEntry(null);
    resetLedgerForm();
    onLedgerEntryClose();
  };

  const openSaleDetailsFromLedgerEntry = (entry: BuyerLedgerEntry) => {
    const saleRecordId = getLinkedSaleRecordIdFromEntry(entry);
    if (!saleRecordId) {
      return;
    }

    void openSaleDetails({
      _id: saleRecordId,
      grandTotal: Number(entry.amount || 0),
      status: "posted",
      saleDate: entry.entryDate,
    } as BuyerSaleRecord);
  };

  const openSaleInvoiceOptions = (download: PendingSaleInvoiceDownload) => {
    if (!selectedLedgerBuyer?._id || !download.saleId) {
      return;
    }

    setPendingSaleInvoiceDownload(download);
    onInvoiceOptionsOpen();
  };

  const closeInvoiceOptions = () => {
    setPendingSaleInvoiceDownload(null);
    onInvoiceOptionsClose();
  };

  const downloadSaleInvoiceById = async ({
    saleId,
    includeLedgerHistory,
    saleLoadingId,
    ledgerLoadingId,
  }: {
    saleId: string;
    includeLedgerHistory: boolean;
    saleLoadingId?: string;
    ledgerLoadingId?: string;
  }) => {
    if (!selectedLedgerBuyer?._id || !saleId) {
      return;
    }

    if (saleLoadingId) {
      setInvoiceDownloadingSaleId(saleLoadingId);
    }
    if (ledgerLoadingId) {
      setInvoiceDownloadingLedgerEntryId(ledgerLoadingId);
    }

    try {
      const response = await buyerStore.downloadBuyerSaleRecordInvoice(selectedLedgerBuyer._id, saleId, {
        includeLedgerHistory,
      });
      const fileName = getFileNameFromContentDisposition(
        response?.headers?.["content-disposition"],
        `INV-${formatShortId(saleId).toUpperCase() || saleId}.pdf`,
      );
      const deliveryResult = await deliverPdfBlob(response.data, fileName, isAndroidRuntime);
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
              : includeLedgerHistory
                ? "Invoice includes linked ledger history."
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
      if (saleLoadingId) {
        setInvoiceDownloadingSaleId("");
      }
      if (ledgerLoadingId) {
        setInvoiceDownloadingLedgerEntryId("");
      }
    }
  };

  const handleDownloadSaleInvoice = async (details: BuyerSaleRecordDetails) => {
    const saleRecord = details?.saleRecord;
    if (!selectedLedgerBuyer?._id || !saleRecord?._id) {
      return;
    }

    openSaleInvoiceOptions({
      saleId: saleRecord._id,
      saleRecord,
      source: "sale",
    });
  };

  const handleInvoiceOptionConfirm = async (includeLedgerHistory: boolean) => {
    const download = pendingSaleInvoiceDownload;
    if (!download) {
      return;
    }

    closeInvoiceOptions();
    await downloadSaleInvoiceById({
      saleId: download.saleId,
      includeLedgerHistory,
      saleLoadingId: download.source === "sale" ? download.saleId : undefined,
      ledgerLoadingId: download.source === "ledger" ? download.ledgerEntry?._id : undefined,
    });
  };

  const handleDownloadLedgerEntryInvoice = async (entry: BuyerLedgerEntry) => {
    if (!selectedLedgerBuyer?._id || !entry?._id || !canDownloadLedgerInvoice(entry, selectedPartyType)) {
      return;
    }

    const saleRecordId = getLinkedSaleRecordIdFromEntry(entry);
    if (saleRecordId) {
      openSaleInvoiceOptions({
        saleId: saleRecordId,
        ledgerEntry: entry,
        source: "ledger",
      });
      return;
    }

    setInvoiceDownloadingLedgerEntryId(entry._id);
    try {
      const response = await buyerStore.downloadBuyerLedgerEntryInvoice(selectedLedgerBuyer._id, entry._id);
      const fileName = getFileNameFromContentDisposition(
        response?.headers?.["content-disposition"],
        `INV-MANUAL-${formatShortId(entry._id).toUpperCase() || entry._id}.pdf`,
      );
      const deliveryResult = await deliverPdfBlob(response.data, fileName, isAndroidRuntime);
      if (deliveryResult !== "cancelled") {
        toast({
          title:
            deliveryResult === "shared"
              ? "Ledger invoice ready to share"
              : deliveryResult === "savedPrompted"
                ? "Ledger invoice saved and ready to open"
                : deliveryResult === "saved"
                  ? "Ledger invoice saved to device"
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
        title: "Failed to generate ledger invoice",
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
    setBuyerFormErrors({});
    setShowContactExtraFields(false);
    setIsPickedContactFlow(false);
  };

  const resetLedgerForm = () => {
    setLedgerFormValues(getDefaultLedgerFormValues());
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
    if (!isShopApproved) {
      toast({
        title: "Shop Under Review",
        description: `Your shop is waiting for admin approval. You can add ${partyPluralLabel.toLowerCase()} once your shop is approved.`,
        status: "warning",
        duration: 4500,
        isClosable: true,
      });
      return;
    }
    resetForm();
    onOpen();
  };

  const handleOpenImport = () => {
    if (!isShopApproved) {
      toast({
        title: "Shop Under Review",
        description: `Your shop is waiting for admin approval. You can import ${partyPluralLabel.toLowerCase()} once your shop is approved.`,
        status: "warning",
        duration: 4500,
        isClosable: true,
      });
      return;
    }
    onImportOpen();
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
    setBuyerFormErrors({});
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
      const emailRaw = String(contact.email || "").trim().toLowerCase();

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
    if (!isShopApproved) {
      toast({
        title: "Shop Under Review",
        description: `Your shop is waiting for admin approval. You can add ${partyPluralLabel.toLowerCase()} once your shop is approved.`,
        status: "warning",
        duration: 4500,
        isClosable: true,
      });
      return;
    }

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

    const validation = validateBuyerForm();
    if (!validation.isValid) {
      toast({
        title: "Validation failed",
        description: validation.firstError,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const composedPhone = validation.composedPhone;

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

    const contextRemainingDue = getLinkedSaleRemainingDue(paymentContextEntry);
    if (contextRemainingDue !== null && contextRemainingDue <= 0) {
      toast({
        title: "Nothing left to pay",
        description: `This ${selectedTransactionSingularLabel.toLowerCase()} is already fully settled.`,
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (contextRemainingDue !== null && parsedAmount > contextRemainingDue) {
      toast({
        title: "Payment is more than remaining due",
        description: `Remaining for this ${selectedTransactionSingularLabel.toLowerCase()} is ${formatCurrency(contextRemainingDue)}.`,
        status: "warning",
        duration: 3500,
        isClosable: true,
      });
      return;
    }

    setLedgerSubmitting(true);
    try {
      const payload: any = {
        entryType: "payment",
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

      await buyerStore.createBuyerLedgerEntry(selectedLedgerBuyer._id, payload);

      toast({
        title: isSelectedSupplier ? "Payment sent" : "Payment received",
        status: "success",
        duration: 2500,
        isClosable: true,
      });

      resetLedgerForm();
      setPaymentContextEntry(null);
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
              ...(key === "itemName" ? { productId: "", itemSource: "manual" as const } : {}),
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
              itemSource: "catalog",
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
        itemSource: item.itemSource || "manual",
        productId: item.itemSource === "catalog" ? item.productId : undefined,
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
        postToLedger: true,
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
      setLedgerPage(1);
      await fetchLedgerEntries(selectedLedgerBuyer._id, 1);
      await fetchBuyers(page, search);
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

  const openReverseModal = (entry: BuyerLedgerEntry) => {
    setSelectedLedgerEntry(entry);
    onReverseOpen();
  };

  const openPayModal = (entry: BuyerLedgerEntry) => {
    const linkedSaleRecordId =
      entry.linkedSaleRecordId ||
      (entry.referenceType === "saleRecord" ? entry.referenceId || "" : "");
    const remainingDue = getLinkedSaleRemainingDue(entry);
    const suggestedPaymentAmount =
      remainingDue !== null && remainingDue > 0
        ? remainingDue
        : Number(entry.amount || 0);

    setPaymentContextEntry(entry);
    setLedgerFormValues({
      entryType: "payment",
      amount: String(suggestedPaymentAmount),
      direction: "credit",
      referenceType: entry.referenceType || "manual",
      referenceId: entry.referenceId || entry._id || "",
      linkedLedgerEntryId: entry._id || "",
      linkedSaleRecordId,
      entryDate: new Date().toISOString().split("T")[0],
      notes: linkedSaleRecordId
        ? `${isSelectedSupplier ? "Payment sent for" : "Payment received for"} ${selectedTransactionSingularLabel.toLowerCase()} ${formatShortId(linkedSaleRecordId)}`
        : `${isSelectedSupplier ? "Payment sent for" : "Payment received for"} ledger entry ${formatShortId(entry._id)}`,
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
  }, [companyId, search, selectedLedgerBuyer, normalizedActivePartyType, balanceFilter]);

  useEffect(() => {
    setBalanceFilter("all");
  }, [normalizedActivePartyType]);

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

  const showMobileBuyerManagement = !selectedLedgerBuyer && useCompactBuyerView;

  const pendingInvoiceHistoryCount =
    pendingSaleInvoiceDownload?.source === "sale"
      ? saleRecordDetails?.summary?.eventCount
      : pendingSaleInvoiceDownload?.ledgerEntry?.linkedSaleSummary?.eventCount;

  return (
    <>
      <MerchantPageShell>
        {selectedLedgerBuyer ? (
          <CustomerDetailView
            selectedLedgerBuyer={selectedLedgerBuyer}
            ledgerEntries={ledgerEntries}
            ledgerSummary={ledgerSummary}
            ledgerLoading={ledgerLoading}
            ledgerTotal={ledgerTotal}
            ledgerPage={ledgerPage}
            ledgerTotalPages={ledgerTotalPages}
            isCompact={useCompactLedgerView}
            invoiceDownloadingLedgerEntryId={invoiceDownloadingLedgerEntryId}
            onBack={closeLedgerView}
            onDeleteBuyer={openDeleteModal}
            onRecordPayment={() => {
              resetLedgerForm();
              onLedgerEntryOpen();
            }}
            onAddSaleRecord={onSaleRecordOpen}
            onPayEntry={openPayModal}
            onOpenSaleDetailsFromEntry={openSaleDetailsFromLedgerEntry}
            onDownloadLedgerInvoice={handleDownloadLedgerEntryInvoice}
            onLedgerPageChange={(newPage) => {
              setLedgerPage(newPage);
              fetchLedgerEntries(selectedLedgerBuyer._id, newPage);
            }}
          />
        ) : (
          <CustomerListView
            buyers={buyers}
            filteredBuyers={filteredBuyers}
            total={total}
            page={page}
            totalPages={totalPages}
            loading={loading}
            search={search}
            setSearch={setSearch}
            activePartyType={activePartyType}
            setActivePartyType={setActivePartyType}
            balanceFilter={balanceFilter}
            setBalanceFilter={setBalanceFilter}
            buyerFilterOptions={buyerFilterOptions}
            buyerOverview={buyerOverview}
            isCompact={useCompactBuyerView}
            canUseDeviceContactImport={canUseDeviceContactImport}
            isShopApproved={isShopApproved}
            onOpenAddBuyer={openManualBuyerModal}
            onOpenImport={handleOpenImport}
            onSelectBuyer={openLedgerView}
            onPageChange={(newPage) => {
              setPage(newPage);
              fetchBuyers(newPage, search);
            }}
          />
        )}
      </MerchantPageShell>

      {/* Sale Details Modal / Drawer */}
      <SaleDetailsModal
        isOpen={isSaleDetailsOpen}
        onClose={closeSaleDetails}
        useCompact={useCompactLedgerView}
        saleRecordDetails={saleRecordDetails}
        selectedSaleRecord={selectedSaleRecord}
        loading={saleDetailsLoading}
        invoiceDownloadingSaleId={invoiceDownloadingSaleId}
        selectedPartyType={selectedPartyType}
        onDownloadInvoice={handleDownloadSaleInvoice}
        isInvoiceOptionsOpen={isInvoiceOptionsOpen}
        onCloseInvoiceOptions={closeInvoiceOptions}
        onConfirmInvoiceOption={handleInvoiceOptionConfirm}
        invoiceDownloadingLedgerEntryId={invoiceDownloadingLedgerEntryId}
        pendingInvoiceHistoryCount={pendingInvoiceHistoryCount}
      />

      {/* Customer Form & Import Modals */}
      {isOpen && (
        <CustomerFormModals
          isOpen={isOpen}
          onClose={closeBuyerModal}
          isImportOpen={isImportOpen}
          onCloseImport={closeImportModal}
          isContactReviewOpen={isContactReviewOpen}
          onCloseContactReview={closeContactReviewModal}
          isBuyerSuccessOpen={isBuyerSuccessOpen}
          onCloseBuyerSuccess={closeBuyerSuccessModal}
          lastCreatedBuyer={lastCreatedBuyer}
          formValues={formValues}
          setFormValues={setFormValues}
          buyerFormErrors={buyerFormErrors}
          clearBuyerFormErrors={clearBuyerFormErrors}
          showContactExtraFields={showContactExtraFields}
          setShowContactExtraFields={setShowContactExtraFields}
          submitting={submitting}
          isImportingContacts={isImportingContacts}
          importDefaultTags={importDefaultTags}
          setImportDefaultTags={setImportDefaultTags}
          canUseDeviceContactImport={canUseDeviceContactImport}
          useCompactBuyerView={useCompactBuyerView}
          activePartyType={activePartyType}
          onSubmitBuyer={handleCreateBuyer}
          onPickSingleContact={handlePickSingleContact}
          onImportFromDevice={handleImportFromDevice}
          onOpenLedgerFromSuccess={openLedgerView}
        />
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isLedgerEntryOpen}
        onClose={closeLedgerEntryModal}
        useCompact={useCompactBuyerView}
        paymentContextEntry={paymentContextEntry}
        ledgerFormValues={ledgerFormValues}
        setLedgerFormValues={setLedgerFormValues}
        submitting={ledgerSubmitting}
        onSubmit={handleCreateLedgerEntry}
        selectedPartyType={selectedPartyType}
        onOpenSaleDetailsFromEntry={openSaleDetailsFromLedgerEntry}
      />

      {/* Sale Record Modal */}
      <SaleRecordModal
        isOpen={isSaleRecordOpen}
        onClose={closeSaleRecordModal}
        useCompact={useCompactBuyerView}
        saleFormValues={saleFormValues}
        setSaleFormValues={setSaleFormValues}
        activeSaleItemIndex={activeSaleItemIndex}
        setActiveSaleItemIndex={setActiveSaleItemIndex}
        saleItemSuggestions={saleItemSuggestions}
        saleItemSuggestionsLoading={saleItemSuggestionsLoading}
        onApplySuggestedProduct={applySuggestedProductToSaleItem}
        onAddSaleItem={addSaleItem}
        onRemoveSaleItem={removeSaleItem}
        onUpdateSaleItem={updateSaleItem}
        submitting={saleSubmitting}
        onSubmit={handleCreateSaleRecord}
        selectedPartyType={selectedPartyType}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={confirmDelete}
        title={`Delete ${selectedBuyer?.partyType === "supplier" ? "Supplier" : "Customer"}`}
        message={
          <Text>
            Are you sure you want to delete {selectedBuyer?.partyType === "supplier" ? "supplier" : "customer"}{" "}
            <strong>{selectedBuyer ? getBuyerDisplayName(selectedBuyer) : "-"}</strong>?
            This action cannot be undone.
          </Text>
        }
        confirmText="Delete"
        confirmButtonProps={{ colorScheme: "red" }}
        isLoading={isDeleting}
      />

      {/* Reverse Confirmation Modal */}
      <ConfirmationModal
        isOpen={isReverseOpen}
        onClose={onReverseClose}
        onConfirm={confirmReverse}
        title="Reverse Ledger Entry"
        message={
          <Text>
            Reverse this entry of <strong>{formatCurrency(selectedLedgerEntry?.amount || 0)}</strong>? This will
            create a compensating correction entry.
          </Text>
        }
        confirmText="Reverse"
        confirmButtonProps={{ colorScheme: "red" }}
        isLoading={isReversing}
      />
    </>
  );
});

export default CustomersTab;
