"use client";

import React from "react";
import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import { FiBox, FiCheckCircle, FiLayers } from "react-icons/fi";
import { observer } from "mobx-react-lite";
import CustomTable from "../../../component/config/component/CustomTable/CustomTable";
import ConfirmationModal from "../../../component/common/ConfirmationModal/ConfirmationModal";
import ProductForm from "../../products/components/ProductForm";

import { useProductList } from "./hooks/useProductList";
import { useProductDelete } from "./hooks/useProductDelete";
import { useProductEdit } from "./hooks/useProductEdit";
import { ProductColumns } from "./components/ProductColumns";
import stores from "../../../store/stores";
import { dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";
import {
    getMerchantTableProps,
    MerchantHeroSection,
    MerchantPageShell,
    MerchantPanel,
    MerchantStatCard,
} from "../../components/common/merchantDashboardUI";

const SuperAdminProductsPage = observer(() => {
    const { offerStore } = stores;
    const {
        products,
        loading,
        currentPage,
        totalPages,
        totalProducts,
        setCurrentPage,
        fetchProducts
    } = useProductList();

    const {
        isOpen: isDeleteOpen,
        onClose: onDeleteClose,
        selectedProduct,
        isDeleting,
        handleDeleteClick,
        confirmDelete
    } = useProductDelete(() => fetchProducts(currentPage));

    const {
        isEditOpen,
        onEditClose,
        editProduct, // logic determines if editing based on this or just flag
        handleEditClick,
        handleSubmit,
        initialValues,
        ProductSchema,
        activeCategories
    } = useProductEdit(() => fetchProducts(currentPage));

    React.useEffect(() => {
        offerStore.getAllOffers({ isActive: true });
    }, [offerStore]);

    const populatedCategoryCount = products.filter((product: any) => Boolean(product.category?.name)).length;

    const tableActions = {
        actionBtn: {
            viewKey: {
                showViewButton: true,
                function: () => {
                    // View functionality
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
    }

    return (
        <MerchantPageShell>
            <MerchantHeroSection
                icon={FiBox}
                primaryBadge="Catalog Audit"
                title="Product Oversight"
                description="Review marketplace inventory, edit product metadata across shops, and keep catalog quality under control from one admin view."
                rightContent={
                    <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3} minW={{ xl: "320px" }}>
                        <MerchantStatCard label="Total Products" value={totalProducts} icon={FiBox} />
                        <MerchantStatCard label="With Category" value={populatedCategoryCount} icon={FiLayers} iconColor={dashboardPalette.success} valueColor={dashboardPalette.success} iconBg="rgba(70, 201, 139, 0.10)" />
                    </SimpleGrid>
                }
            />

            <MerchantPanel p={{ base: 4, md: 6 }}>
            <CustomTable
                title={`All Products (${totalProducts})`}
                columns={ProductColumns}
                data={products}
                loading={loading}
                actions={tableActions}
                serial={{ show: true, text: "S.No." }}
                {...getMerchantTableProps("62vh")}
            />
            </MerchantPanel>

            <ConfirmationModal
                isOpen={isDeleteOpen}
                onClose={onDeleteClose}
                onConfirm={confirmDelete}
                title="Confirm Delete"
                message={
                    <Text>
                        Are you sure you want to delete the product <strong>{selectedProduct?.name}</strong>? This action cannot be undone.
                    </Text>
                }
                confirmText="Delete"
                confirmButtonProps={{ colorScheme: "red" }}
                isLoading={isDeleting}
                image={selectedProduct?.images?.[0]}
            />

            <ProductForm
                isOpen={isEditOpen}
                onClose={onEditClose}
                initialValues={initialValues}
                validationSchema={ProductSchema}
                onSubmit={handleSubmit}
                categories={activeCategories.filter(c => c !== "")}
                offersList={offerStore.offers}
                isEdit={!!editProduct}
            />
        </MerchantPageShell>
    );
});

export default SuperAdminProductsPage;
