"use client";

import React from "react";
import { Badge, Box, HStack, Tab, TabList, Tabs, Text } from "@chakra-ui/react";
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
        <Box p={6}>
            <Tabs
                variant="soft-rounded"
                colorScheme="blue"
                index={Math.max(reviewTabs.findIndex((tab) => tab.value === reviewStatus), 0)}
                onChange={(index) => setReviewStatus(reviewTabs[index]?.value || "pending")}
                mb={6}
            >
                <TabList gap={3} flexWrap="wrap">
                    {reviewTabs.map((tab) => (
                        <Tab key={tab.value}>
                            <HStack spacing={2}>
                                <Text>{tab.label}</Text>
                                {reviewStatus === tab.value ? (
                                    <Badge colorScheme="blue" borderRadius="full">
                                        {totalShops}
                                    </Badge>
                                ) : null}
                            </HStack>
                        </Tab>
                    ))}
                </TabList>
            </Tabs>

            <CustomTable
                title={`${reviewTabs.find((tab) => tab.value === reviewStatus)?.label || "Shops"} (${totalShops})`}
                columns={ShopColumns}
                data={shops}
                loading={loading}
                actions={tableActions}
                serial={{ show: true, text: "S.No." }}
            />

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
        </Box>
    );
});

export default ShopsPage;
