"use client";

import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import CustomTable from "../../component/config/component/CustomTable/CustomTable";
import ConfirmationModal from "../../component/common/ConfirmationModal/ConfirmationModal";
import { useShopList } from "./hooks/useShopList";
import { useShopDelete } from "./hooks/useShopDelete";
import { ShopColumns } from "./components/ShopColumns";

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
                function: () => {
                    // Handle edit logic
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
