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
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { AddIcon, ArrowBackIcon } from "@chakra-ui/icons";
import stores from "../../../../store/stores";
import CustomTable from "../../../../component/config/component/CustomTable/CustomTable";
import ConfirmationModal from "../../../../component/common/ConfirmationModal/ConfirmationModal";

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
  grandTotal: number;
  notes?: string;
  status: BuyerSaleRecordStatus;
  ledgerEntryId?: string;
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReversing, setIsReversing] = useState(false);
  const [postingSaleId, setPostingSaleId] = useState("");

  const [selectedBuyer, setSelectedBuyer] = useState<BuyerProfile | null>(null);
  const [selectedLedgerEntry, setSelectedLedgerEntry] = useState<BuyerLedgerEntry | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [ledgerPage, setLedgerPage] = useState(1);
  const [ledgerTotalPages, setLedgerTotalPages] = useState(1);
  const [ledgerTotal, setLedgerTotal] = useState(0);
  const [salePage, setSalePage] = useState(1);
  const [saleTotalPages, setSaleTotalPages] = useState(1);
  const [saleTotal, setSaleTotal] = useState(0);

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

  const companyId = useMemo(() => auth.company?._id || auth.company || "", [auth.company]);

  const getBuyerDisplayName = (buyer: BuyerProfile) => {
    return buyer.displayName || buyer.buyerId?.fullName || "-";
  };

  const formatCurrency = (amount: number) => `Rs ${Number(amount || 0).toFixed(2)}`;

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
    resetSaleForm();
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

  const closeSaleRecordModal = () => {
    onSaleRecordClose();
    resetSaleForm();
  };

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
      amountText: `${entry.direction === "debit" ? "+" : "-"} ${formatCurrency(entry.amount || 0)}`,
      balanceText: formatCurrency(entry.balanceAfter || 0),
      referenceText: entry.referenceId
        ? `${entry.referenceType || "manual"}: ${entry.referenceId}`
        : entry.referenceType || "manual",
      statusBadge: (
        <Badge colorScheme={entry.status === "reversed" ? "red" : "green"} textTransform="capitalize">
          {entry.status || "active"}
        </Badge>
      ),
      reverseAction:
        entry.status === "reversed" ? (
          <Text color="gray.500">-</Text>
        ) : (
          <Button size="xs" colorScheme="red" variant="outline" onClick={() => openReverseModal(entry)}>
            Reverse
          </Button>
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
    { headerName: "Amount", key: "amountText" },
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
            <HStack>
              <Button leftIcon={<ArrowBackIcon />} variant="outline" onClick={closeLedgerView}>
                Back to Buyers
              </Button>
              <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={onSaleRecordOpen}>
                Add Sale Record
              </Button>
              <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onLedgerEntryOpen}>
                Add Ledger Entry
              </Button>
            </HStack>
          ) : (
            <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onOpen}>
              Add Buyer
            </Button>
          )}
        </Flex>

        {!selectedLedgerBuyer ? (
          <CustomTable
            title={`Buyers (${total})`}
            columns={buyerColumns}
            data={buyerTableData}
            loading={loading}
            actions={buyerTableActions}
            serial={{ show: true, text: "S.No." }}
          />
        ) : (
          <VStack align="stretch" spacing={4}>
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={3}>
              <Box p={3} borderWidth="1px" borderRadius="md">
                <Stat>
                  <StatLabel>Total Sale (Debit)</StatLabel>
                  <StatNumber>{formatCurrency(ledgerSummary.totalDebit)}</StatNumber>
                </Stat>
              </Box>
              <Box p={3} borderWidth="1px" borderRadius="md">
                <Stat>
                  <StatLabel>Total Payment (Credit)</StatLabel>
                  <StatNumber>{formatCurrency(ledgerSummary.totalCredit)}</StatNumber>
                </Stat>
              </Box>
              <Box p={3} borderWidth="1px" borderRadius="md">
                <Stat>
                  <StatLabel>Outstanding</StatLabel>
                  <StatNumber>{formatCurrency(ledgerSummary.outstandingBalance)}</StatNumber>
                </Stat>
              </Box>
              <Box p={3} borderWidth="1px" borderRadius="md">
                <Stat>
                  <StatLabel>Credit Limit</StatLabel>
                  <StatNumber>{formatCurrency(ledgerSummary.creditLimit)}</StatNumber>
                </Stat>
              </Box>
            </SimpleGrid>

            <CustomTable
              title={`Ledger Entries (${ledgerTotal})`}
              columns={ledgerColumns}
              data={ledgerTableData}
              loading={ledgerLoading}
              actions={ledgerTableActions}
              serial={{ show: true, text: "S.No." }}
            />

            <Divider />

            <CustomTable
              title={`Sale Records (${saleTotal})`}
              columns={saleColumns}
              data={saleTableData}
              loading={saleLoading}
              actions={saleTableActions}
              serial={{ show: true, text: "S.No." }}
            />
          </VStack>
        )}
      </VStack>

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
