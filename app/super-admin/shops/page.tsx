"use client";

import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import CustomTable from "../../component/config/component/CustomTable/CustomTable";
import ConfirmationModal from "../../component/common/ConfirmationModal/ConfirmationModal";
import { useShopList } from "./hooks/useShopList";
import { useShopDelete } from "./hooks/useShopDelete";
import { ShopColumns } from "./components/ShopColumns";
import ShopForm from "./components/ShopForm";
import stores from "../../store/stores";
import { useDisclosure, useToast } from "@chakra-ui/react";

const ShopsPage = observer(() => {
    const {
        shops,
        loading,
        currentPage,
        totalPages,
        totalShops,
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
        isOpen: isEditOpen,
        onOpen: onEditOpen,
        onClose: onEditClose
    } = useDisclosure();
    const [editingShop, setEditingShop] = React.useState<any>(null);
    const [isUpdating, setIsUpdating] = React.useState(false);
    const toast = useToast();
    const { companyStore } = stores;

    const handleEditClick = (shop: any) => {
        setEditingShop(shop);
        onEditOpen();
    };

    const handleUpdateShop = async (values: any) => {
        if (!editingShop?._id) return;
        values._id = editingShop._id;
        setIsUpdating(true);
        try {
            await companyStore.updateShop(editingShop._id, values);
            toast({
                title: "Shop updated successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            onEditClose();
            fetchShops(currentPage);
        } catch (error: any) {
            toast({
                title: "Error updating shop",
                description: error.message || "Something went wrong",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const tableActions = {
        actionBtn: {
            viewKey: {
                showViewButton: true,
                function: () => {
                    // Handle view logic
                }
            },
            editKey: {
                showEditButton: true,
                function: (row: any) => {
                    handleEditClick(row);
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
            <CustomTable
                title={`All Shops (${totalShops})`}
                columns={ShopColumns}
                data={shops}
                loading={loading}
                actions={tableActions}
                serial={{ show: true, text: "S.No." }}
            />

            <ShopForm
                isOpen={isEditOpen}
                onClose={onEditClose}
                initialValues={{
                    name: editingShop?.name || "",
                    description: editingShop?.description || "",
                    shopStatus: editingShop?.shopStatus || "active",
                }}
                onSubmit={handleUpdateShop}
                isEdit={true}
                isLoading={isUpdating}
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
