"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  SimpleGrid,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import {
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiDatabase,
  FiFolder,
  FiFolderPlus,
  FiLayers,
  FiSliders,
  FiSearch,
  FiX,
} from "react-icons/fi";
import ConfirmationModal from "../../../component/common/ConfirmationModal/ConfirmationModal";
import CustomTable from "../../../component/config/component/CustomTable/CustomTable";
import { dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";
import stores from "../../../store/stores";
import {
  getMerchantTableProps,
  MerchantBadge,
  MerchantPageShell,
  merchantPrimaryButtonProps,
  MerchantStatCard,
} from "../../components/common/merchantDashboardUI";
import CategoryFilterConfigDrawer from "./components/CategoryFilterConfigDrawer";
import CategoryForm from "./components/CategoryForm";
import CategoryMobileCard from "./components/CategoryMobileCard";
import CategoryFilterSetupCard from "./components/CategoryFilterSetupCard";
import CategoryToolbar from "./components/CategoryToolbar";

const CategoryPage = observer(() => {
  const { categoryStore } = stores;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isFilterOpen,
    onOpen: onFilterOpen,
    onClose: onFilterClose,
  } = useDisclosure();

  const [isSeeding, setIsSeeding] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isDrawerReadOnly, setIsDrawerReadOnly] = useState<boolean>(false);
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<any>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [hierarchyFilter, setHierarchyFilter] = useState<"all" | "root" | "sub">("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const toast = useToast();

  const handleSeedCatalog = async () => {
    const confirmSeed = window.confirm(
      "Kya aap complete marketplace catalog (1000+ Categories, Subcategories aur Filters) auto-load karna chahte hain? Ye safe hai aur missing categories add kar dega."
    );
    if (!confirmSeed) return;

    setIsSeeding(true);
    try {
      const res = await categoryStore.seedCatalog(false);
      if (res.status === "success") {
        toast({
          title: "Catalog Seeded Successfully! 🎉",
          description: res.message || "Full marketplace taxonomy has been loaded.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Seeding Failed",
          description: res.message || "Failed to load catalog.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to seed catalog.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const fetchCategories = (
    page: number = currentPage,
    search: string = searchQuery,
    hierarchy: string = hierarchyFilter,
    start: string = startDate,
    end: string = endDate
  ) => {
    const params: any = { page, limit: 10 };
    if (search.trim()) {
      params.search = search.trim();
    }
    if (hierarchy === "root") {
      params.parent = "null";
    }
    if (start) params.startDate = start;
    if (end) params.endDate = end;
    categoryStore.getAllCategories(params, true);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchCategories(currentPage, searchQuery, hierarchyFilter, startDate, endDate);
    }, 350);

    return () => clearTimeout(handler);
  }, [categoryStore, currentPage, searchQuery, hierarchyFilter, startDate, endDate]);

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const params: any = {};
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (hierarchyFilter === "root") params.parent = "null";
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await (await import("axios")).default.get("/category/export", {
        params,
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `categories_export_${new Date().toISOString().slice(0, 10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Excel export successful",
        description: "Categories spreadsheet downloaded successfully",
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
      setIsExporting(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleHierarchyChange = (type: "all" | "root" | "sub") => {
    setHierarchyFilter(type);
    setCurrentPage(1);
  };

  const handleAddClick = () => {
    setSelectedCategory(null);
    setIsDrawerReadOnly(false);
    onOpen();
  };

  const handleViewClick = (category: any) => {
    setSelectedCategory(category);
    setIsDrawerReadOnly(true);
    onOpen();
  };

  const handleEditClick = (category: any) => {
    setSelectedCategory(category);
    setIsDrawerReadOnly(false);
    onOpen();
  };

  const handleConfigureFilters = (category: any) => {
    setSelectedFilterCategory(category);
    onFilterOpen();
  };

  const handleDeleteClick = (category: any) => {
    setCategoryToDelete(category);
    onDeleteOpen();
  };

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
  };

  const columns = useMemo(() => [
    {
      headerName: "Image",
      key: "image",
      type: "component",
      props: {
        column: { width: "100px" },
      },
      metaData: {
        component: (data: any) =>
          data.image?.url ? (
            <Box
              w="50px"
              h="50px"
              borderRadius="md"
              overflow="hidden"
              border="1px solid"
              borderColor={dashboardPalette.borderStrong}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.image.url}
                alt={data.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          ) : (
            <Text color={dashboardPalette.textSoft} fontSize="sm">
              No Image
            </Text>
          ),
      },
    },
    {
      headerName: "Name",
      key: "name",
      type: "component",
      metaData: {
        component: (data: any) => (
          <VStack align="start" spacing={0.5}>
            <Text fontWeight="600" fontSize="sm" color="var(--merchant-text)">
              {data.name}
            </Text>
            {data.parent ? (
              <Text fontSize="xs" color="gray.400">
                ↳ under <Text as="span" color="blue.400" fontWeight="500">{data.parent.name}</Text>
              </Text>
            ) : (
              <MerchantBadge tone="accent">★ Master Category</MerchantBadge>
            )}
          </VStack>
        ),
      },
    },
    {
      headerName: "Slug",
      key: "slug",
      type: "text",
    },
    {
      headerName: "Level / Type",
      key: "parent",
      type: "component",
      metaData: {
        component: (data: any) =>
          data.parent ? (
            <MerchantBadge tone="soft">Subcategory</MerchantBadge>
          ) : (
            <MerchantBadge tone="success">Master Root</MerchantBadge>
          ),
      },
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
        ),
      },
    },
    {
      headerName: "Filters",
      key: "filterConfig",
      type: "component",
      metaData: {
        component: (data: any) => {
          const filterCount = (data.filterConfig || []).filter(
            (item: any) => item.isActive !== false,
          ).length;

          return (
            <MerchantBadge tone={filterCount > 0 ? "accent" : "soft"}>
              {filterCount} Active
            </MerchantBadge>
          );
        },
      },
    },
    {
      headerName: "Action",
      key: "action",
      type: "table-actions",
      props: {
        isSticky: true,
        width: "130px",
      },
    },
  ], []);

  const tableActions = useMemo(() => ({
    actionBtn: {
      viewKey: {
        showViewButton: true,
        title: "View Category",
        function: handleViewClick,
      },
      editKey: {
        showEditButton: true,
        title: "Edit Category",
        function: handleEditClick,
      },
      deleteKey: {
        showDeleteButton: true,
        function: (row: any) => handleDeleteClick(row),
      },
    },
    pagination: {
      show: true,
      currentPage: categoryStore.currentPage || currentPage,
      totalPages: categoryStore.totalPages || 1,
      onClick: (page: number) => handlePageChange(page),
    },
  }), [currentPage, categoryStore.currentPage, categoryStore.totalPages]);

  const totalCategories = categoryStore.totalCategories || categoryStore.categories.length;
  const activeCategories = categoryStore.activeCategories || categoryStore.categories.filter((c: any) => c.isActive).length;
  const rootCategories = categoryStore.rootCategories || categoryStore.categories.filter((c: any) => !c.parent).length;
  const categoriesWithFilters = categoryStore.filterReadyCategories || categoryStore.categories.filter((c: any) => (c.filterConfig || []).length > 0).length;

  return (
    <MerchantPageShell>
      {/* ------------------------------ Stat cards ------------------------------ */}
      <SimpleGrid
        columns={{ base: 2, xl: 4 }}
        spacing={{ base: 3, md: 4 }}
        mb={{ base: 5, md: 6 }}
      >
        <MerchantStatCard
          label="Total Categories"
          variant="panel"
          value={totalCategories}
          icon={FiLayers}
          iconColor={dashboardPalette.accentStrong}
          iconBg="rgba(59, 130, 246, 0.12)"
          valueColor={dashboardPalette.accentStrong}
        />

        <MerchantStatCard
          label="Active"
          variant="panel"
          value={activeCategories}
          icon={FiCheckCircle}
          iconColor={dashboardPalette.success}
          iconBg="rgba(70, 201, 139, 0.14)"
          valueColor={dashboardPalette.success}
        />

        <MerchantStatCard
          label="Root Categories"
          variant="panel"
          value={rootCategories}
          icon={FiFolder}
          iconColor={dashboardPalette.info}
          iconBg="rgba(139, 92, 246, 0.14)"
          valueColor={dashboardPalette.info}
        />

        <MerchantStatCard
          label="Filter Ready"
          value={categoriesWithFilters}
          variant="panel"
          icon={FiSliders}
          iconColor={dashboardPalette.warning}
          iconBg="rgba(224, 179, 91, 0.14)"
          valueColor={dashboardPalette.warning}
        />
      </SimpleGrid>

      {/* ---------------------------- Clean Modern Tabs ---------------------------- */}
      <Tabs
        variant="unstyled"
        colorScheme="brand"
        onChange={(index) => {
          if (index === 1 && categoryStore.categories.length === 0) {
            categoryStore.getAllCategories();
          }
        }}
      >
        <TabList
          mb={4}
          gap={2}
          display="flex"
          alignItems="center"
          borderBottom="1px solid"
          borderColor="var(--merchant-border-strong)"
          pb={2.5}
        >
          <Tab
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
            <Icon as={FiLayers} mr={1.5} boxSize={3.5} />
            Categories
          </Tab>
          <Tab
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
            <Icon as={FiSliders} mr={1.5} boxSize={3.5} />
            Product Filters
          </Tab>
        </TabList>

        <TabPanels>
          {/* ============================ TAB 1: Categories ============================ */}
          <TabPanel px={0} pb={0} pt={0}>
            {/* Tablet / Desktop Table View */}
            <Box display={{ base: "none", md: "block" }} dir="ltr" w="100%">
              <CategoryToolbar
                hierarchyFilter={hierarchyFilter}
                onHierarchyChange={handleHierarchyChange}
                totalCategories={categoryStore.totalCategories || categoryStore.categories.length}
                rootCategories={categoryStore.rootCategories || 0}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                onClearSearch={handleClearSearch}
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={(val) => {
                  setStartDate(val);
                  setCurrentPage(1);
                }}
                onEndDateChange={(val) => {
                  setEndDate(val);
                  setCurrentPage(1);
                }}
                onClearDates={() => {
                  setStartDate("");
                  setEndDate("");
                  setCurrentPage(1);
                }}
                onExportExcel={handleExportExcel}
                isExporting={isExporting}
                onSeedCatalog={handleSeedCatalog}
                isSeeding={isSeeding}
                onAddClick={handleAddClick}
              />

              <Box
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
                  data={categoryStore.tableCategories.length > 0 ? categoryStore.tableCategories : categoryStore.categories}
                  columns={columns}
                  loading={categoryStore.tableLoading}
                  actions={tableActions}
                  {...getMerchantTableProps("62vh")}
                />
              </Box>

              {/* Tablet / Desktop Pagination Bar */}
              {categoryStore.totalPages > 1 && (
                <Flex
                  mt={4}
                  pt={3}
                  borderTop="1px solid"
                  borderColor="var(--merchant-border-strong, #1f2e46)"
                  align="center"
                  justify="space-between"
                  flexWrap="wrap"
                  gap={3}
                >
                  <Text fontSize="xs" color="var(--merchant-text-muted, #94a3b8)" fontWeight="600">
                    Page {currentPage} of {categoryStore.totalPages} ({totalCategories} total categories)
                  </Text>

                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      variant="outline"
                      borderRadius="12px"
                      borderColor="var(--merchant-border-strong, #1f2e46)"
                      color="var(--merchant-text, #ffffff)"
                      leftIcon={<FiChevronLeft />}
                      isDisabled={currentPage <= 1 || categoryStore.loading}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </Button>

                    <HStack spacing={1}>
                      {Array.from({ length: Math.min(categoryStore.totalPages, 5) }).map((_, i) => {
                        const pNum = i + 1;
                        const isCurrent = pNum === currentPage;
                        return (
                          <IconButton
                            key={pNum}
                            size="sm"
                            aria-label={`Page ${pNum}`}
                            icon={<Text fontSize="xs">{pNum}</Text>}
                            borderRadius="10px"
                            variant={isCurrent ? "solid" : "ghost"}
                            colorScheme={isCurrent ? "brand" : "gray"}
                            onClick={() => handlePageChange(pNum)}
                          />
                        );
                      })}
                    </HStack>

                    <Button
                      size="sm"
                      variant="outline"
                      borderRadius="12px"
                      borderColor="var(--merchant-border-strong, #1f2e46)"
                      color="var(--merchant-text, #ffffff)"
                      rightIcon={<FiChevronRight />}
                      isDisabled={currentPage >= categoryStore.totalPages || categoryStore.loading}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </HStack>
                </Flex>
              )}
            </Box>

            {/* Mobile View */}
            <Box display={{ base: "block", md: "none" }}>
              <VStack spacing={3} align="stretch" mb={4}>
                <Flex align="center" justify="space-between">
                  <Text
                    fontSize="md"
                    fontWeight="700"
                    color="var(--merchant-text)"
                  >
                    All Categories ({categoryStore.totalCategories || categoryStore.categories.length})
                  </Text>
                  <HStack spacing={2}>
                    <Button
                      size="xs"
                      leftIcon={<FiDatabase />}
                      onClick={handleSeedCatalog}
                      isLoading={isSeeding}
                      variant="outline"
                      colorScheme="blue"
                      borderRadius="10px"
                    >
                      Load Catalog
                    </Button>
                    <IconButton
                      aria-label="Add category"
                      icon={<FiFolderPlus size={20} />}
                      onClick={handleAddClick}
                      w="40px"
                      h="40px"
                      minW="40px"
                      borderRadius="12px"
                      {...merchantPrimaryButtonProps}
                    />
                  </HStack>
                </Flex>

                <InputGroup size="sm">
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiSearch} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search categories..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    borderRadius="12px"
                    bg="var(--merchant-surface-alt)"
                    borderColor="var(--merchant-border-strong)"
                  />
                  {searchQuery && (
                    <InputRightElement>
                      <IconButton
                        aria-label="Clear search"
                        icon={<FiX />}
                        size="xs"
                        variant="ghost"
                        onClick={handleClearSearch}
                      />
                    </InputRightElement>
                  )}
                </InputGroup>
              </VStack>

              {categoryStore.tableLoading ? (
                <Flex justify="center" py={10}>
                  <Spinner />
                </Flex>
              ) : (categoryStore.tableCategories.length > 0 ? categoryStore.tableCategories : categoryStore.categories).length === 0 ? (
                <Text
                  textAlign="center"
                  py={10}
                  fontSize="sm"
                  color="var(--merchant-text-muted)"
                >
                  No categories yet. Tap the folder button to add one.
                </Text>
              ) : (
                <SimpleGrid columns={2} spacing={3}>
                  {(categoryStore.tableCategories.length > 0 ? categoryStore.tableCategories : categoryStore.categories).map((category: any, idx: number) => (
                    <CategoryMobileCard
                      key={category._id}
                      category={category}
                      index={idx}
                      onView={handleViewClick}
                      onEdit={handleEditClick}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </SimpleGrid>
              )}

              {categoryStore.totalPages > 1 && (
                <HStack justify="space-between" align="center" mt={4} px={1}>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                    isDisabled={currentPage <= 1 || categoryStore.loading}
                  >
                    Previous
                  </Button>
                  <Text fontSize="xs" fontWeight="600" color="var(--merchant-text-muted)">
                    Page {currentPage} of {categoryStore.totalPages}
                  </Text>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => handlePageChange(Math.min(currentPage + 1, categoryStore.totalPages))}
                    isDisabled={currentPage >= categoryStore.totalPages || categoryStore.loading}
                  >
                    Next
                  </Button>
                </HStack>
              )}
            </Box>
          </TabPanel>

          {/* ========================= TAB 2: Product Filters ========================= */}
          <TabPanel px={0} pb={0} pt={0}>
            <Flex
              justify="space-between"
              align={{ base: "start", md: "center" }}
              direction={{ base: "column", md: "row" }}
              gap={3}
              mb={5}
            >
              <Box>
                <Text
                  fontSize="lg"
                  fontWeight="700"
                  color="var(--merchant-text)"
                >
                  Product Filter Setup
                </Text>
                <Text color="var(--merchant-text-muted)" fontSize="sm" mt={1}>
                  Configure which category-specific filters appear in the buyer
                  left sidebar on product search and category results.
                </Text>
              </Box>
              <MerchantBadge
                tone={categoriesWithFilters > 0 ? "success" : "soft"}
              >
                {categoriesWithFilters} Categories Configured
              </MerchantBadge>
            </Flex>

            {/* Filter Setup Categories: Show filter-configured categories or all categories with a search/filter */}
            {(() => {
              const displayCategories = categoryStore.categories.length > 0
                ? categoryStore.categories
                : categoryStore.tableCategories;

              if (displayCategories.length === 0) {
                return (
                  <Text textAlign="center" py={10} fontSize="sm" color="var(--merchant-text-muted)">
                    No categories found.
                  </Text>
                );
              }

              return (
                <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={{ base: 3, md: 4 }}>
                  {displayCategories.map((category: any, idx: number) => (
                    <CategoryFilterSetupCard
                      key={category._id}
                      category={category}
                      index={idx}
                      onConfigureFilters={handleConfigureFilters}
                    />
                  ))}
                </SimpleGrid>
              );
            })()}
          </TabPanel>
        </TabPanels>
      </Tabs>

      {isOpen && (
        <CategoryForm
          isOpen={isOpen}
          onClose={onClose}
          initialValues={selectedCategory}
          isReadOnly={isDrawerReadOnly}
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
});

export default CategoryPage;
