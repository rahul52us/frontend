"use client";

import {
    Avatar,
    Badge,
    Box,
    Button,
    Flex,
    HStack,
    Icon,
    IconButton,
    Select,
    SimpleGrid,
    Skeleton,
    Tab,
    TabList,
    Tabs,
    Text,
    useDisclosure,
    useToast,
    VStack,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import React from "react";
import {
    FiCheckCircle,
    FiChevronLeft,
    FiChevronRight,
    FiClock,
    FiEdit3,
    FiEye,
    FiFilter,
    FiMapPin,
    FiRefreshCw,
    FiShield,
    FiShoppingBag,
    FiCalendar,
    FiDownload,
    FiX,
} from "react-icons/fi";
import axios from "axios";
import ConfirmationModal from "../../../component/common/ConfirmationModal/ConfirmationModal";
import CustomTable from "../../../component/config/component/CustomTable/CustomTable";
import { dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";
import stores from "../../../store/stores";
import {
    getMerchantTableProps,
    MerchantBadge,
    merchantGhostButtonProps,
    MerchantPageHeader,
    MerchantPageShell,
    MerchantPanel,
    merchantSpin,
    MerchantStatCard,
} from "../../components/common/merchantDashboardUI";
import ReviewShopDrawer from "./components/ReviewShopDrawer";
import { ShopColumns } from "./components/ShopColumns";
import ShopView from "./components/ShopView";
import { useShopDelete } from "./hooks/useShopDelete";
import { useShopList } from "./hooks/useShopList";
import { useShopStats } from "./hooks/useShopStats";

const reviewTabs = [
    { label: "Pending Review", value: "pending" },
    { label: "Changes Requested", value: "changes_requested" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
    { label: "All", value: "all" },
];

const AttentionChip = ({
    icon,
    label,
    count,
    color,
    bg,
    loading,
    onClick,
}: {
    icon: any;
    label: string;
    count: number;
    color: string;
    bg: string;
    loading: boolean;
    onClick: () => void;
}) => (
    <Flex
        as="button"
        type="button"
        onClick={onClick}
        align="center"
        gap={2}
        px={3}
        py={1.5}
        bg="var(--merchant-surface)"
        border="1px solid"
        borderColor="var(--merchant-border)"
        borderRadius="full"
        transition="all 0.2s ease"
        _hover={{ borderColor: color, transform: "translateY(-1px)" }}
        _active={{ transform: "scale(0.97)" }}
    >
        <Flex align="center" justify="center" w="22px" h="22px" borderRadius="full" bg={bg}>
            <Icon as={icon} color={color} boxSize={3} />
        </Flex>
        <Text fontSize="xs" fontWeight="600" color="var(--merchant-text-muted)">
            {label}
        </Text>
        <Badge
            bg={bg}
            color={color}
            borderRadius="full"
            px={1.5}
            py={0.2}
            fontSize="10px"
            fontWeight="700"
        >
            {loading ? "…" : count}
        </Badge>
    </Flex>
);

const ShopsPage = observer(() => {
    const {
        shops,
        loading,
        currentPage,
        totalPages,
        totalShops,
        reviewStatus,
        startDate,
        endDate,
        setStartDate,
        setEndDate,
        setReviewStatus,
        setCurrentPage,
        fetchShops,
    } = useShopList();

    const [exporting, setExporting] = React.useState(false);
    const toast = useToast();

    const exportShopsToExcel = async () => {
        setExporting(true);
        try {
            const params: any = {};
            if (reviewStatus !== "all") params.reviewStatus = reviewStatus;
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const response = await axios.get("/company/export", {
                params,
                responseType: "blob",
            });

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `shops_export_${new Date().toISOString().slice(0, 10)}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            toast({
                title: "Excel export successful",
                description: "Shops spreadsheet downloaded successfully",
                status: "success",
                duration: 3000,
            });
        } catch (err: any) {
            toast({
                title: "Export failed",
                description: err?.response?.data?.message || err?.message || "Failed to export",
                status: "error",
                duration: 3000,
            });
        } finally {
            setExporting(false);
        }
    };

    const { stats, loadingStats, fetchStats } = useShopStats();

    const {
        isOpen,
        onClose,
        selectedShop,
        isDeleting,
        handleDeleteClick,
        confirmDelete,
    } = useShopDelete(() => {
        fetchShops(currentPage);
        fetchStats();
    });

    const {
        isOpen: isReviewOpen,
        onOpen: onReviewOpen,
        onClose: onReviewClose,
    } = useDisclosure();

    const {
        isOpen: isViewOpen,
        onOpen: onViewOpen,
        onClose: onViewClose,
    } = useDisclosure();

    const [reviewingShop, setReviewingShop] = React.useState<any>(null);
    const [viewingShop, setViewingShop] = React.useState<any>(null);
    const [isReviewing, setIsReviewing] = React.useState(false);
    const { companyStore } = stores;

    const currentTabLabel = reviewTabs.find((tab) => tab.value === reviewStatus)?.label || "Shops";
    const pendingCount = stats.pendingReviewShops;
    const approvedCount = stats.approvedShops;
    const changesRequestedCount = stats.changesRequestedShops;
    const overallTotalShops = stats.totalShops;

    const handleRefreshAll = () => {
        fetchShops(currentPage, reviewStatus);
        fetchStats();
    };

    const handleReviewClick = (shop: any) => {
        setReviewingShop(shop);
        onReviewOpen();
    };

    const handleViewClick = (shop: any) => {
        setViewingShop(shop);
        onViewOpen();
    };

    const handleReviewShop = async (action: "approve" | "request_changes" | "reject", remarks: string) => {
        if (!reviewingShop?._id) return;
        setIsReviewing(true);
        try {
            await companyStore.reviewShop(reviewingShop._id, { action, remarks });
            toast({
                title:
                    action === "approve"
                        ? "Shop approved"
                        : action === "request_changes"
                            ? "Changes requested"
                            : "Shop rejected",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            onReviewClose();
            fetchShops(currentPage, reviewStatus);
            fetchStats();
        } catch (error: any) {
            toast({
                title: "Review action failed",
                description: error.message || "Something went wrong",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsReviewing(false);
        }
    };

    const handleVisibilityChange = async (shopStatus: "active" | "inactive" | "suspended", remarks: string) => {
        if (!reviewingShop?._id) return;
        setIsReviewing(true);
        try {
            await companyStore.updateShop(reviewingShop._id, { shopStatus, remarks });
            toast({
                title:
                    shopStatus === "active"
                        ? "Shop activated"
                        : shopStatus === "inactive"
                            ? "Shop marked inactive"
                            : "Shop suspended",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            onReviewClose();
            fetchShops(currentPage, reviewStatus);
            fetchStats();
        } catch (error: any) {
            toast({
                title: "Status update failed",
                description: error.message || "Something went wrong",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsReviewing(false);
        }
    };

    const tableActions = {
        actionBtn: {
            viewKey: {
                showViewButton: true,
                function: (row: any) => {
                    handleViewClick(row);
                },
            },
            editKey: {
                showEditButton: true,
                function: (row: any) => {
                    handleReviewClick(row);
                },
            },
            deleteKey: {
                showDeleteButton: true,
                function: (row: any) => {
                    handleDeleteClick(row);
                },
            },
        },
        pagination: {
            show: true,
            currentPage: currentPage,
            totalPages: totalPages,
            onClick: (page: number) => setCurrentPage(page),
        },
        search: {
            show: false,
        },
    };

    return (
        <MerchantPageShell>
            {/* Header: matched to superadmin dashboard style */}
            <MerchantPageHeader
                icon={FiShoppingBag}
                title="Shop Oversight"
                description="Review storefront submissions, track moderation state, and manage visibility decisions across the platform"
                mobileActions={
                    <IconButton
                        aria-label="Refresh shops"
                        icon={
                            <Icon
                                as={FiRefreshCw}
                                animation={loading ? `${merchantSpin} 1s linear infinite` : undefined}
                            />
                        }
                        size="sm"
                        w="36px"
                        h="36px"
                        onClick={handleRefreshAll}
                        isDisabled={loading}
                        {...merchantGhostButtonProps}
                    />
                }
                badges={
                    <>
                        <AttentionChip
                            icon={FiClock}
                            label="Pending Review"
                            count={pendingCount}
                            color={dashboardPalette.warning}
                            bg="rgba(224, 179, 91, 0.14)"
                            loading={loading}
                            onClick={() => setReviewStatus("pending")}
                        />
                        <AttentionChip
                            icon={FiCheckCircle}
                            label="Approved"
                            count={approvedCount}
                            color={dashboardPalette.success}
                            bg="rgba(70, 201, 139, 0.14)"
                            loading={loading}
                            onClick={() => setReviewStatus("approved")}
                        />
                    </>
                }
                actions={
                    <Button
                        size="sm"
                        onClick={handleRefreshAll}
                        isDisabled={loading}
                        leftIcon={
                            <Icon
                                as={FiRefreshCw}
                                animation={loading ? `${merchantSpin} 1s linear infinite` : undefined}
                            />
                        }
                        {...merchantGhostButtonProps}
                    >
                        Refresh
                    </Button>
                }
            />

            {/* Top Stats Grid */}
            <SimpleGrid columns={{ base: 2, lg: 4 }} spacing={{ base: 3, md: 4 }} mb={{ base: 4, md: 6 }}>
                <MerchantStatCard
                    label="Total Shops"
                    value={loadingStats ? "…" : overallTotalShops}
                    variant="panel"
                    icon={FiShoppingBag}
                    iconColor={dashboardPalette.accentStrong}
                    iconBg="rgba(59, 130, 246, 0.12)"
                />
                <MerchantStatCard
                    label="Pending Review"
                    value={loadingStats ? "…" : pendingCount}
                    icon={FiClock}
                    variant="panel"
                    iconColor={dashboardPalette.warning}
                    iconBg="rgba(224, 179, 91, 0.14)"
                    valueColor={dashboardPalette.warning}
                />
                <MerchantStatCard
                    label="Approved"
                    value={loadingStats ? "…" : approvedCount}
                    variant="panel"
                    icon={FiCheckCircle}
                    iconColor={dashboardPalette.success}
                    iconBg="rgba(70, 201, 139, 0.14)"
                />
                <MerchantStatCard
                    label="Changes Requested"
                    value={loadingStats ? "…" : changesRequestedCount}
                    icon={FiShield}
                    variant="panel"
                    iconColor={dashboardPalette.info}
                    iconBg="rgba(139, 92, 246, 0.14)"
                />
            </SimpleGrid>

            {/* ---------------- Clean Filter Tabs & Status Row ---------------- */}
            <Flex
                justify="space-between"
                align="center"
                mb={4}
                flexWrap="wrap"
                gap={2}
            >
                <Tabs
                    variant="unstyled"
                    index={Math.max(reviewTabs.findIndex((tab) => tab.value === reviewStatus), 0)}
                    onChange={(index) => setReviewStatus(reviewTabs[index]?.value || "pending")}
                >
                    <TabList
                        gap={2}
                        flexWrap="wrap"
                        display="flex"
                        alignItems="center"
                    >
                        {reviewTabs.map((tab) => {
                            const isSelected = reviewStatus === tab.value;
                            return (
                                <Tab
                                    key={tab.value}
                                    px={3.5}
                                    py={1.5}
                                    borderRadius="10px"
                                    fontSize="xs"
                                    fontWeight="700"
                                    letterSpacing="0.02em"
                                    color="var(--merchant-text-muted)"
                                    bg="transparent"
                                    transition="all 0.2s ease"
                                    _hover={{
                                        color: "var(--merchant-text)",
                                        bg: "var(--merchant-surface-alt)",
                                    }}
                                    _selected={{
                                        color: "white",
                                        bg: "var(--color-primary, #065F68)",
                                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
                                    }}
                                >
                                    <HStack spacing={1.5}>
                                        <Text>{tab.label}</Text>
                                        {isSelected ? (
                                            <Badge
                                                bg="whiteAlpha.300"
                                                color="white"
                                                borderRadius="full"
                                                px={1.5}
                                                fontSize="10px"
                                            >
                                                {totalShops}
                                            </Badge>
                                        ) : null}
                                    </HStack>
                                </Tab>
                            );
                        })}
                    </TabList>
                </Tabs>

                <HStack spacing={2.5} flexWrap="wrap" align="center">
                    {/* Compact Date Range Filter */}
                    <HStack
                        spacing={1.5}
                        bg="var(--merchant-surface-alt)"
                        px={2.5}
                        py={1}
                        borderRadius="12px"
                        border="1px solid"
                        borderColor="var(--merchant-border)"
                        align="center"
                        h="36px"
                    >
                        <Icon as={FiCalendar} color="var(--color-primary, #065F68)" boxSize={3.5} />
                        <Box as="input"
                            type="date"
                            h="24px"
                            w="115px"
                            border="none"
                            bg="transparent"
                            outline="none"
                            fontSize="11px"
                            color="var(--merchant-text)"
                            value={startDate}
                            onChange={(e: any) => setStartDate(e.target.value)}
                        />
                        <Text fontSize="10px" color="gray.400" fontWeight={700}>
                            TO
                        </Text>
                        <Box as="input"
                            type="date"
                            h="24px"
                            w="115px"
                            border="none"
                            bg="transparent"
                            outline="none"
                            fontSize="11px"
                            color="var(--merchant-text)"
                            value={endDate}
                            onChange={(e: any) => setEndDate(e.target.value)}
                        />
                        {(startDate || endDate) && (
                            <IconButton
                                aria-label="Clear dates"
                                icon={<Icon as={FiX} />}
                                size="xs"
                                h="18px"
                                w="18px"
                                minW="18px"
                                variant="ghost"
                                colorScheme="red"
                                onClick={() => {
                                    setStartDate("");
                                    setEndDate("");
                                }}
                            />
                        )}
                    </HStack>

                    {/* Export Excel Button with Theme Colors */}
                    <Button
                        size="sm"
                        h="36px"
                        px={3.5}
                        bg="var(--color-primary, #065F68)"
                        _hover={{
                            bg: "var(--color-primary-hover, #044249)",
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 12px rgba(6, 95, 104, 0.3)",
                        }}
                        _active={{ bg: "var(--color-primary-dark, #032b30)" }}
                        color="white"
                        borderRadius="12px"
                        fontSize="xs"
                        fontWeight={600}
                        leftIcon={<Icon as={FiDownload} boxSize={3.5} />}
                        isLoading={exporting}
                        loadingText="Exporting..."
                        boxShadow="0 2px 6px rgba(6, 95, 104, 0.2)"
                        transition="all 0.15s ease"
                        onClick={exportShopsToExcel}
                    >
                        Export Excel
                    </Button>

                    <MerchantBadge tone={shops.length > 0 ? "soft" : "soft"}>
                        {shops.length} In View
                    </MerchantBadge>
                    <Text fontSize="xs" color="var(--merchant-text-muted)" fontWeight="600">
                        {loadingStats ? "…" : overallTotalShops} total shops recorded
                    </Text>
                </HStack>
            </Flex>

                {/* Mobile Filter: Segmented Dropdown + Horizontal Chips */}
                <Box display={{ base: "block", md: "none" }} mb={4}>
                    <Flex
                        align="center"
                        gap={2}
                        p={1.5}
                        bg={dashboardPalette.surfaceAlt}
                        border="1px solid"
                        borderColor={dashboardPalette.border}
                        borderRadius="18px"
                    >
                        <Flex
                            align="center"
                            justify="center"
                            w="32px"
                            h="32px"
                            borderRadius="12px"
                            bg={dashboardPalette.accentSoft}
                            color={dashboardPalette.accentStrong}
                            flexShrink={0}
                            ml={1}
                        >
                            <Icon as={FiFilter} boxSize={3.5} />
                        </Flex>
                        <Select
                            value={reviewStatus}
                            onChange={(e) => setReviewStatus(e.target.value)}
                            size="sm"
                            variant="unstyled"
                            fontWeight="700"
                            fontSize="sm"
                            color={dashboardPalette.text}
                            cursor="pointer"
                        >
                            {reviewTabs.map((tab) => (
                                <option
                                    key={tab.value}
                                    value={tab.value}
                                    style={{
                                        background: "var(--color-surface, #0B1120)",
                                        color: "var(--color-text, #F8FAFC)",
                                        padding: "8px",
                                    }}
                                >
                                    {tab.label} ({tab.value === reviewStatus ? totalShops : "filter"})
                                </option>
                            ))}
                        </Select>
                        <Badge
                            colorScheme="purple"
                            borderRadius="full"
                            px={2}
                            py={0.5}
                            fontSize="11px"
                            fontWeight="800"
                            mr={2}
                            flexShrink={0}
                        >
                            {totalShops}
                        </Badge>
                    </Flex>
                </Box>

                {/* Desktop View: Custom Table with clean outer container */}
                <Box
                    display={{ base: "none", md: "block" }}
                    dir="ltr"
                    w="100%"
                    sx={{
                        "& > div": {
                            bg: "transparent !important",
                            boxShadow: "none !important",
                            borderRadius: "0 !important",
                            "& > div": {
                                px: "0 !important",
                                py: "0 !important",
                                bg: "transparent !important",
                                "& > div": {
                                    borderRadius: "16px !important",
                                },
                            },
                        },
                    }}
                >
                    <CustomTable
                        columns={ShopColumns}
                        data={shops}
                        loading={loading}
                        actions={tableActions}
                        {...getMerchantTableProps("62vh")}
                    />
                </Box>

                {/* Mobile View: Superadmin Dashboard Activity Cards */}
                <VStack spacing={2.5} align="stretch" display={{ base: "flex", md: "none" }}>
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <Box
                                key={i}
                                p={3.5}
                                borderRadius="20px"
                                borderWidth="1px"
                                borderColor="var(--merchant-border)"
                                bg="var(--merchant-surface)"
                            >
                                <HStack spacing={3} align="center">
                                    <Skeleton boxSize="46px" borderRadius="14px" flexShrink={0} />
                                    <VStack align="start" flex={1} spacing={2}>
                                        <Skeleton h="15px" w="65%" borderRadius="md" />
                                        <Skeleton h="12px" w="45%" borderRadius="md" />
                                    </VStack>
                                    <Skeleton h="24px" w="60px" borderRadius="full" />
                                </HStack>
                            </Box>
                        ))
                    ) : shops.length === 0 ? (
                        <Box
                            textAlign="center"
                            py={10}
                            px={4}
                            bg="var(--merchant-surface-alt)"
                            borderRadius="20px"
                            borderWidth="1px"
                            borderColor="var(--merchant-border)"
                        >
                            <Flex
                                align="center"
                                justify="center"
                                w="48px"
                                h="48px"
                                borderRadius="full"
                                bg="var(--merchant-surface)"
                                mx="auto"
                                mb={3}
                            >
                                <Icon as={FiShoppingBag} boxSize={5} color="var(--merchant-text-muted)" />
                            </Flex>
                            <Text fontWeight="700" fontSize="sm" color="var(--merchant-text)">
                                No shops found
                            </Text>
                            <Text fontSize="xs" color="var(--merchant-text-muted)" mt={1}>
                                No shops currently match the &quot;{currentTabLabel}&quot; filter.
                            </Text>
                        </Box>
                    ) : (
                        shops.map((shop: any) => {
                            const reviewTone =
                                shop.reviewStatus === "approved"
                                    ? "success"
                                    : shop.reviewStatus === "rejected"
                                    ? "danger"
                                    : shop.reviewStatus === "changes_requested"
                                    ? "warning"
                                    : "accent";

                            const reviewLabel =
                                shop.reviewStatus === "changes_requested"
                                    ? "Changes Req."
                                    : shop.reviewStatus || "Pending";

                            const statusColor =
                                shop.shopStatus === "active"
                                    ? "green.500"
                                    : shop.shopStatus === "suspended"
                                    ? "red.500"
                                    : "gray.500";

                            const locationText =
                                [shop.location?.city, shop.location?.state].filter(Boolean).join(", ") ||
                                shop.location?.address ||
                                "No location specified";

                            return (
                                <Box
                                    key={shop._id}
                                    p={3.5}
                                    border="1px solid"
                                    borderColor="var(--merchant-border)"
                                    borderRadius="20px"
                                    bg="var(--merchant-surface)"
                                    transition="all 0.2s ease"
                                    _hover={{ bg: "var(--merchant-surface-alt)" }}
                                    _active={{ transform: "scale(0.99)" }}
                                    cursor="pointer"
                                    onClick={() => handleViewClick(shop)}
                                >
                                    {/* Top Row: Shop Avatar + Name + Subtitle + Review Badge */}
                                    <Flex align="start" gap={3} w="full">
                                        <Avatar
                                            name={shop.name}
                                            src={shop.logo?.url}
                                            boxSize="46px"
                                            borderRadius="14px"
                                            border="1.5px solid var(--merchant-border)"
                                            bg="var(--merchant-surface-alt)"
                                            flexShrink={0}
                                        />

                                        <Box flex="1" minW={0}>
                                            <Flex align="center" justify="space-between" gap={2}>
                                                <Text
                                                    fontSize="sm"
                                                    fontWeight="700"
                                                    color="var(--merchant-text)"
                                                    noOfLines={1}
                                                    lineHeight="1.2"
                                                >
                                                    {shop.name}
                                                </Text>
                                                <MerchantBadge
                                                    tone={reviewTone}
                                                    fontSize="10px"
                                                    px={2.5}
                                                    py={0.5}
                                                    flexShrink={0}
                                                    textTransform="capitalize"
                                                >
                                                    {reviewLabel}
                                                </MerchantBadge>
                                            </Flex>

                                            <HStack spacing={1.5} mt={1} color="var(--merchant-text-muted)" fontSize="xs" minW={0}>
                                                <Box w="6px" h="6px" borderRadius="full" bg={statusColor} flexShrink={0} />
                                                <Text textTransform="capitalize" fontWeight="600" flexShrink={0}>
                                                    {shop.shopStatus || "pending"}
                                                </Text>
                                                <Text opacity={0.6}>•</Text>
                                                <Icon as={FiMapPin} boxSize={3} flexShrink={0} />
                                                <Text noOfLines={1} fontSize="xs">
                                                    {locationText}
                                                </Text>
                                            </HStack>
                                        </Box>
                                    </Flex>

                                    {/* Remarks if any */}
                                    {shop.reviewRemarks ? (
                                        <Box
                                            mt={2.5}
                                            px={3}
                                            py={1.5}
                                            bg="var(--merchant-surface-alt)"
                                            borderRadius="12px"
                                            border="1px dashed var(--merchant-border)"
                                        >
                                            <Text fontSize="11px" color="var(--merchant-text-muted)" noOfLines={2}>
                                                <Text as="span" fontWeight="700" color="var(--merchant-text)">
                                                    Note:{" "}
                                                </Text>
                                                {shop.reviewRemarks}
                                            </Text>
                                        </Box>
                                    ) : null}

                                    {/* Bottom Action Row: View & Review Buttons */}
                                    <Flex align="center" justify="space-between" mt={3} pt={2.5} borderTop="1px solid var(--merchant-border)">
                                        <Text fontSize="11px" color="var(--merchant-text-muted)" fontWeight="600">
                                            {shop.createdAt ? new Date(shop.createdAt).toLocaleDateString() : ""}
                                        </Text>

                                        <HStack spacing={2}>
                                            <Button
                                                size="xs"
                                                variant="outline"
                                                leftIcon={<FiEye size={12} />}
                                                borderRadius="10px"
                                                px={2.5}
                                                h="28px"
                                                fontSize="11px"
                                                fontWeight="700"
                                                borderColor="var(--merchant-border)"
                                                color="var(--merchant-text)"
                                                _hover={{ bg: "var(--merchant-surface-alt)" }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleViewClick(shop);
                                                }}
                                            >
                                                View
                                            </Button>

                                            <Button
                                                size="xs"
                                                bgGradient="linear(135deg, var(--color-primary, #5B6CFF) 0%, var(--color-secondary, #C44AE8) 100%)"
                                                color="white"
                                                leftIcon={<FiEdit3 size={12} />}
                                                borderRadius="10px"
                                                px={3}
                                                h="28px"
                                                fontSize="11px"
                                                fontWeight="700"
                                                boxShadow="0 4px 10px rgba(91, 108, 255, 0.24)"
                                                _hover={{ opacity: 0.9 }}
                                                _active={{ transform: "scale(0.96)" }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleReviewClick(shop);
                                                }}
                                            >
                                                Review
                                            </Button>
                                        </HStack>
                                    </Flex>
                                </Box>
                            );
                        })
                    )}

                    {/* Mobile Pagination */}
                    {totalPages > 1 && (
                        <HStack justify="space-between" align="center" pt={3} pb={1} px={1}>
                            <Button
                                size="xs"
                                variant="outline"
                                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                                isDisabled={currentPage <= 1 || loading}
                                leftIcon={<FiChevronLeft />}
                                borderRadius="lg"
                                fontWeight="700"
                            >
                                Previous
                            </Button>
                            <Text fontSize="xs" fontWeight="700" color={dashboardPalette.textMuted}>
                                Page {currentPage} of {totalPages}
                            </Text>
                            <Button
                                size="xs"
                                variant="outline"
                                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                                isDisabled={currentPage >= totalPages || loading}
                                rightIcon={<FiChevronRight />}
                                borderRadius="lg"
                                fontWeight="700"
                            >
                                Next
                            </Button>
                        </HStack>
                    )}
                </VStack>


            {/* Review Drawer (renders as BottomSheetDrawer on mobile, CustomDrawer on desktop) */}
            <ReviewShopDrawer
                isOpen={isReviewOpen}
                onClose={onReviewClose}
                shop={reviewingShop}
                onSubmit={handleReviewShop}
                onVisibilitySubmit={handleVisibilityChange}
                isSubmitting={isReviewing}
            />

            {/* Shop Details View Drawer (renders as BottomSheetDrawer on mobile, CustomDrawer on desktop) */}
            <ShopView
                isOpen={isViewOpen}
                onClose={onViewClose}
                shop={viewingShop}
            />

            <ConfirmationModal
                isOpen={isOpen}
                onClose={onClose}
                onConfirm={confirmDelete}
                title="Confirm Delete"
                message={
                    <Text>
                        Are you sure you want to delete the shop <strong>{selectedShop?.name}</strong>? This action cannot be undone.
                    </Text>
                }
                confirmText="Delete"
                confirmButtonProps={{ colorScheme: "red" }}
                isLoading={isDeleting}
                image={selectedShop?.logo?.url}
            />
        </MerchantPageShell>
    );
});

export default ShopsPage;
