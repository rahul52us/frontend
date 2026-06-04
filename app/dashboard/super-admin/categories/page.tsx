"use client";
import React, { useEffect, useState } from "react";
import {
    Button,
    Flex,
    useDisclosure,
    useToast,
    Text,
    Box,
    HStack,
    SimpleGrid,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    VStack,
} from "@chakra-ui/react";
import { FiFolderPlus, FiLayers, FiSliders } from "react-icons/fi";
import { observer } from "mobx-react-lite";
import stores from "../../../store/stores";
import CategoryForm from "./components/CategoryForm";
import CategoryFilterConfigDrawer from "./components/CategoryFilterConfigDrawer";
// import CustomTable from "../../../component/common/Table/CustomTable";
import CustomTable from "../../../component/config/component/CustomTable/CustomTable";
import ConfirmationModal from "../../../component/common/ConfirmationModal/ConfirmationModal";
import { dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";
import {
    getMerchantTableProps,
    MerchantBadge,
    merchantPrimaryButtonProps,
    MerchantHeroSection,
    MerchantPageShell,
    MerchantPanel,
    MerchantStatCard,
} from "../../components/common/merchantDashboardUI";

const CategoryPage = () => {
    const { categoryStore } = stores;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isDeleteOpen,
        onOpen: onDeleteOpen,
        onClose: onDeleteClose
    } = useDisclosure();
    const {
        isOpen: isFilterOpen,
        onOpen: onFilterOpen,
        onClose: onFilterClose,
    } = useDisclosure();

    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [selectedFilterCategory, setSelectedFilterCategory] = useState<any>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<any>(null);
    const toast = useToast();

    useEffect(() => {
        categoryStore.getAllCategories();
    }, [categoryStore]);

    const handleAddClick = () => {
        setSelectedCategory(null);
        onOpen();
    };

    const handleEditClick = (category: any) => {
        setSelectedCategory(category);
        onOpen();
    };

    const handleConfigureFilters = (category: any) => {
        setSelectedFilterCategory(category);
        onFilterOpen();
    };

    const handleDeleteClick = (category: any) => {
        setCategoryToDelete(category);
        onDeleteOpen();
    }

    const handleConfirmDelete = async () => {
        if (categoryToDelete) {
            const res = await categoryStore.deleteCategory(categoryToDelete._id);
            if (res.status === "success") {
                toast({
                    title: "Success",
                    description: "Category deleted successfully",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                onDeleteClose();
            } else {
                toast({
                    title: "Error",
                    description: res.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    }

    const columns = [
        {
            headerName: "Image",
            key: "image",
            type: "component",
            props: {
                column: { width: "100px" },
            },
            metaData: {
                component: (data: any) => (
                    data.image?.url ? (
                        <Box w="50px" h="50px" borderRadius="md" overflow="hidden" border="1px solid" borderColor={dashboardPalette.borderStrong}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={data.image.url} alt={data.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Box>
                    ) : <Text color={dashboardPalette.textSoft} fontSize="sm">No Image</Text>
                )
            }
        },
        {
            headerName: "Name",
            key: "name",
            type: "text",
        },
        {
            headerName: "Slug",
            key: "slug",
            type: "text",
        },
        {
            headerName: "Parent",
            key: "parent",
            type: "component",
            metaData: {
                component: (data: any) =>
                    data.parent ? (
                        <MerchantBadge tone="accent">{data.parent.name}</MerchantBadge>
                    ) : (
                        <MerchantBadge tone="soft">Root</MerchantBadge>
                    )
            }
        },
        {
            headerName: "Status",
            key: "isActive",
            type: "component",
            metaData: {
                component: (data: any) => (
                    <MerchantBadge tone={data.isActive ? "success" : "danger"}>
                        {data.isActive ? "Active" : "Inactive"}
                    </MerchantBadge>
                )
            }
        },
        {
            headerName: "Filters",
            key: "filterConfig",
            type: "component",
            metaData: {
                component: (data: any) => {
                    const filterCount = (data.filterConfig || []).filter((item: any) => item.isActive !== false).length;

                    return (
                        <MerchantBadge tone={filterCount > 0 ? "accent" : "soft"}>
                            {filterCount} Active
                        </MerchantBadge>
                    );
                }
            }
        },
        {
            headerName: "Action",
            key: "action",
            type: "table-actions",
            props: {
                isSticky: true,
                width: "100px"
            }
        }
    ];

    const tableActions = {
        actionBtn: {
            editKey: {
                showEditButton: true,
                function: handleEditClick
            },
            deleteKey: {
                showDeleteButton: true,
                function: (row: any) => handleDeleteClick(row)
            }
        },
        pagination: {
            show: true,
            currentPage: 1,
            totalPages: 1,
            onClick: () => { }
        }
    }

    const activeCategories = categoryStore.categories.filter((category: any) => category.isActive).length;
    const rootCategories = categoryStore.categories.filter((category: any) => !category.parent).length;
    const categoriesWithFilters = categoryStore.categories.filter(
        (category: any) => (category.filterConfig || []).some((item: any) => item.isActive !== false)
    ).length;

    return (
        <MerchantPageShell>
            <MerchantHeroSection
                icon={FiLayers}
                primaryBadge="Catalog Control"
                title="Category Management"
                description="Organize category structure, keep parent-child taxonomy tidy, and maintain what sellers can classify products under."
                rightContent={
                    <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3} minW={{ xl: "320px" }}>
                        <MerchantStatCard label="Total Categories" value={categoryStore.categories.length} icon={FiLayers} />
                        <MerchantStatCard label="Filter Ready" value={categoriesWithFilters} valueColor={dashboardPalette.success} icon={FiSliders} iconColor={dashboardPalette.success} iconBg="rgba(70, 201, 139, 0.10)" />
                    </SimpleGrid>
                }
            />

            <MerchantPanel p={{ base: 4, md: 6 }}>
                <Tabs colorScheme="blue" variant="soft-rounded">
                    <TabList flexWrap="wrap" gap={2}>
                        <Tab>Categories</Tab>
                        <Tab>Product Filters</Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel px={0} pb={0}>
                            <Flex justify="space-between" align={{ base: "start", md: "center" }} direction={{ base: "column", md: "row" }} gap={3} mb={5}>
                                <Box>
                                    <Text fontSize="lg" fontWeight="700" color="var(--merchant-text)">
                                        Categories Registry
                                    </Text>
                                    <HStack spacing={2} mt={2} flexWrap="wrap">
                                        <MerchantBadge tone="soft">{rootCategories} Root Categories</MerchantBadge>
                                        <MerchantBadge tone={activeCategories > 0 ? "success" : "soft"}>{activeCategories} Active</MerchantBadge>
                                    </HStack>
                                </Box>
                                <Button leftIcon={<FiFolderPlus />} onClick={handleAddClick} {...merchantPrimaryButtonProps}>
                                    Add Category
                                </Button>
                            </Flex>

                            <CustomTable
                                title={`All Categories (${categoryStore.categories.length})`}
                                data={categoryStore.categories}
                                columns={columns}
                                loading={categoryStore.loading}
                                actions={tableActions}
                                serial={{ show: true, text: "S.No." }}
                                {...getMerchantTableProps("62vh")}
                            />
                        </TabPanel>

                        <TabPanel px={0} pb={0}>
                            <Flex justify="space-between" align={{ base: "start", md: "center" }} direction={{ base: "column", md: "row" }} gap={3} mb={5}>
                                <Box>
                                    <Text fontSize="lg" fontWeight="700" color="var(--merchant-text)">
                                        Product Filter Setup
                                    </Text>
                                    <Text color="var(--merchant-text-muted)" fontSize="sm" mt={1}>
                                        Configure which category-specific filters appear in the buyer left sidebar on product search and category results.
                                    </Text>
                                </Box>
                                <MerchantBadge tone={categoriesWithFilters > 0 ? "success" : "soft"}>
                                    {categoriesWithFilters} Categories Configured
                                </MerchantBadge>
                            </Flex>

                            <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} spacing={4}>
                                {categoryStore.categories.map((category: any) => {
                                    const filterConfig = category.filterConfig || [];
                                    const activeFilterCount = filterConfig.filter((item: any) => item.isActive !== false).length;
                                    const previewFilters = filterConfig.slice(0, 4);

                                    return (
                                        <Box
                                            key={category._id}
                                            border="1px solid"
                                            borderColor="var(--merchant-border-strong)"
                                            borderRadius="22px"
                                            p={5}
                                            bg="var(--merchant-surface-alt)"
                                        >
                                            <VStack align="stretch" spacing={4}>
                                                <Box>
                                                    <HStack justify="space-between" align="start" spacing={3}>
                                                        <Box minW={0}>
                                                            <Text fontWeight="800" color="var(--merchant-text)" noOfLines={1}>
                                                                {category.name}
                                                            </Text>
                                                            <HStack spacing={2} mt={2} flexWrap="wrap">
                                                                <MerchantBadge tone={category.parent ? "info" : "soft"}>
                                                                    {category.parent
                                                                        ? typeof category.parent === "object"
                                                                            ? category.parent.name
                                                                            : "Child"
                                                                        : "Root"}
                                                                </MerchantBadge>
                                                                <MerchantBadge tone={category.isActive ? "success" : "danger"}>
                                                                    {category.isActive ? "Active" : "Inactive"}
                                                                </MerchantBadge>
                                                            </HStack>
                                                        </Box>
                                                        <MerchantBadge tone={activeFilterCount > 0 ? "accent" : "soft"}>
                                                            {activeFilterCount} Filters
                                                        </MerchantBadge>
                                                    </HStack>
                                                </Box>

                                                {previewFilters.length > 0 ? (
                                                    <HStack spacing={2} flexWrap="wrap">
                                                        {previewFilters.map((filter: any, index: number) => (
                                                            <MerchantBadge key={`${filter.label}-${index}`} tone={filter.isActive === false ? "soft" : "accent"}>
                                                                {filter.label}
                                                            </MerchantBadge>
                                                        ))}
                                                        {filterConfig.length > previewFilters.length && (
                                                            <MerchantBadge tone="soft">+{filterConfig.length - previewFilters.length}</MerchantBadge>
                                                        )}
                                                    </HStack>
                                                ) : (
                                                    <Text color="var(--merchant-text-muted)" fontSize="sm">
                                                        No product filters configured for this category.
                                                    </Text>
                                                )}

                                                <Button leftIcon={<FiSliders />} onClick={() => handleConfigureFilters(category)} {...merchantPrimaryButtonProps}>
                                                    Configure Filters
                                                </Button>
                                            </VStack>
                                        </Box>
                                    );
                                })}
                            </SimpleGrid>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </MerchantPanel>

            {isOpen && (
                <CategoryForm
                    isOpen={isOpen}
                    onClose={onClose}
                    initialValues={selectedCategory}
                />
            )}

            {isFilterOpen && (
                <CategoryFilterConfigDrawer
                    isOpen={isFilterOpen}
                    onClose={onFilterClose}
                    category={selectedFilterCategory}
                />
            )}

            {categoryToDelete && (
                <ConfirmationModal
                    isOpen={isDeleteOpen}
                    onClose={onDeleteClose}
                    onConfirm={handleConfirmDelete}
                    title="Delete Category"
                    message={`Are you sure you want to delete "${categoryToDelete.name}"? This action cannot be undone.`}
                    image={categoryToDelete.image?.url}
                    confirmText="Yes, Delete"
                    isLoading={categoryStore.loading}
                />
            )}
        </MerchantPageShell>
    );
};

export default observer(CategoryPage);
