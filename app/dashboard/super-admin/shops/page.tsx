"use client";

import React from "react";
import { Badge, Box, HStack, SimpleGrid, Tab, TabList, Tabs, Text } from "@chakra-ui/react";
import { FiCheckCircle, FiClock, FiShield, FiShoppingBag } from "react-icons/fi";
import { observer } from "mobx-react-lite";
import CustomTable from "../../../component/config/component/CustomTable/CustomTable";
import ConfirmationModal from "../../../component/common/ConfirmationModal/ConfirmationModal";
import { useShopList } from "./hooks/useShopList";
import { useShopDelete } from "./hooks/useShopDelete";
import { ShopColumns } from "./components/ShopColumns";
import ShopView from "./components/ShopView";
import ReviewShopDrawer from "./components/ReviewShopDrawer";
import stores from "../../../store/stores";
import { useDisclosure, useToast } from "@chakra-ui/react";
import { dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";
import {
    getMerchantTableProps,
    MerchantBadge,
    MerchantHeroSection,
    MerchantPageShell,
    MerchantPanel,
    MerchantStatCard,
} from "../../components/common/merchantDashboardUI";

const reviewTabs = [
    { label: "Pending Review", value: "pending" },
    { label: "Changes Requested", value: "changes_requested" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
    { label: "All", value: "all" },
];

const ShopsPage = observer(() => {
    const {
        shops,
        loading,
        currentPage,
        totalPages,
        totalShops,
        reviewStatus,
        setReviewStatus,
        setCurrentPage,
        fetchShops
    } = useShopList();

    const {
        isOpen,
        onClose,
        selectedShop,
        isDeleting,
        handleDeleteClick,
        confirmDelete
    } = useShopDelete(() => fetchShops(currentPage));

    const {
        isOpen: isReviewOpen,
        onOpen: onReviewOpen,
        onClose: onReviewClose
    } = useDisclosure();

    const {
        isOpen: isViewOpen,
        onOpen: onViewOpen,
        onClose: onViewClose
    } = useDisclosure();

    const [reviewingShop, setReviewingShop] = React.useState<any>(null);
    const [viewingShop, setViewingShop] = React.useState<any>(null);
    const [isReviewing, setIsReviewing] = React.useState(false);
    const toast = useToast();
    const { companyStore } = stores;
    const currentTabLabel = reviewTabs.find((tab) => tab.value === reviewStatus)?.label || "Shops";
    const pendingCount = shops.filter((shop: any) => shop.reviewStatus === "pending").length;
    const approvedCount = shops.filter((shop: any) => shop.reviewStatus === "approved").length;

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
                }
            },
            editKey: {
                showEditButton: true,
                function: (row: any) => {
                    handleReviewClick(row);
                }
            },
            deleteKey: {
                showDeleteButton: true,
                function: (row: any) => {
                    handleDeleteClick(row);
                }
            }
        },
        pagination: {
            show: true,
            currentPage: currentPage,
            totalPages: totalPages,
            onClick: (page: number) => setCurrentPage(page)
        },
        search: {
            show: false // Can enable later
        }
    }

    return (
        <MerchantPageShell>
            <MerchantHeroSection
                icon={FiShield}
                primaryBadge="Review Workflow"
                title="Shop Oversight"
                description="Review storefront submissions, track moderation state, and manage visibility decisions without leaving the super-admin workspace."
                rightContent={
                    <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3} minW={{ xl: "320px" }}>
                        <MerchantStatCard label="Current Results" value={totalShops} icon={FiShoppingBag} />
                        <MerchantStatCard label="Pending In View" value={pendingCount} valueColor={dashboardPalette.warning} icon={FiClock} iconColor={dashboardPalette.warning} />
                    </SimpleGrid>
                }
            />

            <MerchantPanel p={{ base: 4, md: 6 }}>
                <HStack spacing={2} mb={5} flexWrap="wrap">
                    <MerchantBadge tone="accent">{currentTabLabel}</MerchantBadge>
                    <MerchantBadge tone={approvedCount > 0 ? "success" : "soft"}>
                        {approvedCount} Approved In View
                    </MerchantBadge>
                </HStack>

            <Tabs
                variant="unstyled"
                index={Math.max(reviewTabs.findIndex((tab) => tab.value === reviewStatus), 0)}
                onChange={(index) => setReviewStatus(reviewTabs[index]?.value || "pending")}
                mb={6}
            >
                <TabList
                    gap={2}
                    flexWrap="wrap"
                    bg={dashboardPalette.surfaceAlt}
                    borderWidth="1px"
                    borderColor={dashboardPalette.border}
                    borderRadius="20px"
                    p={1}
                >
                    {reviewTabs.map((tab) => (
                        <Tab
                            key={tab.value}
                            borderRadius="16px"
                            color={dashboardPalette.textMuted}
                            fontWeight="700"
                            _selected={{
                                bg: dashboardPalette.accentSoft,
                                color: dashboardPalette.accentStrong,
                                borderWidth: "1px",
                                borderColor: dashboardPalette.border,
                            }}
                            _hover={{ color: dashboardPalette.text }}
                        >
                            <HStack spacing={2}>
                                <Text>{tab.label}</Text>
                                {reviewStatus === tab.value ? (
                                    <Badge bg={dashboardPalette.surface} color={dashboardPalette.textMuted} borderRadius="full">
                                        {totalShops}
                                    </Badge>
                                ) : null}
                            </HStack>
                        </Tab>
                    ))}
                </TabList>
            </Tabs>

            <CustomTable
                title={`${currentTabLabel} (${totalShops})`}
                columns={ShopColumns}
                data={shops}
                loading={loading}
                actions={tableActions}
                serial={{ show: true, text: "S.No." }}
                {...getMerchantTableProps("62vh")}
            />
            </MerchantPanel>

            <ReviewShopDrawer
                isOpen={isReviewOpen}
                onClose={onReviewClose}
                shop={reviewingShop}
                onSubmit={handleReviewShop}
                onVisibilitySubmit={handleVisibilityChange}
                isSubmitting={isReviewing}
            />

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
