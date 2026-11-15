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
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
} from "@chakra-ui/react";
import {
  FiFolderPlus,
  FiLayers,
  FiSliders,
  FiCheckCircle,
  FiFolder,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";
import type { IconType } from "react-icons";
import { observer } from "mobx-react-lite";
import stores from "../../../store/stores";
import CategoryForm from "./components/CategoryForm";
import CategoryFilterConfigDrawer from "./components/CategoryFilterConfigDrawer";
import CustomTable from "../../../component/config/component/CustomTable/CustomTable";
import ConfirmationModal from "../../../component/common/ConfirmationModal/ConfirmationModal";
import { dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";
import {
  getMerchantTableProps,
  MerchantBadge,
  merchantPrimaryButtonProps,
  MerchantPageShell,
} from "../../components/common/merchantDashboardUI";

/* -------------------------------------------------------------------------- */
/*  Stat card (compact on mobile)                                             */
/* -------------------------------------------------------------------------- */

type StatCardProps = {
  label: string;
  value: number | string;
  icon: IconType;
  color: string;
};

const StatCard = ({ label, value, icon, color }: StatCardProps) => (
  <Box
    bg="var(--merchant-surface-alt)"
    border="1px solid"
    borderColor="#CDE5FF"
    borderRadius={{ base: "18px", md: "26px" }}
    p={{ base: 3, md: 4 }}
    minW={0}
    minH={{ base: "112px", md: "162px" }}
    display="flex"
    flexDirection="column"
    justifyContent="center"
    transition="all 0.2s ease"
    _hover={{
      borderColor: color,
      boxShadow: "0 5px 16px rgba(59, 130, 246, 0.07)",
    }}
  >
    {/* Icon and Label */}
    <Flex align="center" gap={{ base: 2, md: 3 }} minW={0}>
      <Flex
        w={{ base: "36px", md: "50px" }}
        h={{ base: "36px", md: "50px" }}
        flexShrink={0}
        align="center"
        justify="center"
        borderRadius="full"
        bg={`${color}14`}
      >
        <Icon as={icon} boxSize={{ base: 4, md: 5 }} color={color} />
      </Flex>

      <Text
        fontSize={{ base: "10px", sm: "xs", md: "sm" }}
        fontWeight="700"
        letterSpacing={{ base: "0.04em", md: "0.10em" }}
        textTransform="uppercase"
        color="var(--merchant-text-muted)"
        lineHeight="1.4"
        noOfLines={2}
        minW={0}
      >
        {label}
      </Text>
    </Flex>

    {/* Value */}
    <Text
      mt={{ base: 3, md: 4 }}
      fontSize={{ base: "xl", md: "3xl" }}
      fontWeight="600"
      lineHeight="1.2"
      color={color}
      noOfLines={1}
    >
      {value}
    </Text>
  </Box>
);

/* -------------------------------------------------------------------------- */
/*  Mobile category card: photo on the top half, details below                */
/* -------------------------------------------------------------------------- */

type CategoryMobileCardProps = {
  category: any;
  onEdit: (category: any) => void;
  onDelete: (category: any) => void;
};

const CategoryMobileCard = ({
  category,
  onEdit,
  onDelete,
}: CategoryMobileCardProps) => {
  const filterCount = (category.filterConfig || []).filter(
    (item: any) => item.isActive !== false,
  ).length;
  const parentName = category.parent?.name ?? "Root";

  return (
    <Box
      bg="var(--merchant-surface-alt)"
      border="1px solid"
      borderColor="var(--merchant-border-strong)"
      borderRadius="16px"
      overflow="hidden"
    >
      {/* Photo (top half) */}
      <Box position="relative" w="100%" aspectRatio={4 / 3}>
        {category.image?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={category.image.url}
            alt={category.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Flex
            w="100%"
            h="100%"
            align="center"
            justify="center"
            bg="linear-gradient(135deg, #4F7CFF33, #A855F733)"
          >
            <Icon as={FiLayers} boxSize={8} color="#4F7CFF" />
          </Flex>
        )}

        <Menu isLazy strategy="fixed" placement="bottom-end">
          <MenuButton
            as={IconButton}
            aria-label="Category actions"
            icon={<HiDotsVertical />}
            size="xs"
            position="absolute"
            top={2}
            right={2}
            borderRadius="full"
            bg="blackAlpha.600"
            color="white"
            _hover={{ bg: "blackAlpha.700" }}
            _active={{ bg: "blackAlpha.800" }}
          />
          <MenuList minW="140px" zIndex={20}>
            <MenuItem icon={<FiEdit2 />} onClick={() => onEdit(category)}>
              Edit
            </MenuItem>
            <MenuItem
              icon={<FiTrash2 />}
              color="red.500"
              onClick={() => onDelete(category)}
            >
              Delete
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>

      {/* Details (bottom half) */}
      <Box p={3}>
        <Text
          fontSize="sm"
          fontWeight="700"
          color="var(--merchant-text)"
          noOfLines={1}
        >
          {category.name}
        </Text>
        <Text
          mt={0.5}
          fontSize="xs"
          color="var(--merchant-text-muted)"
          noOfLines={1}
        >
          {parentName}
        </Text>

        <Flex mt={2} align="center" justify="space-between" gap={2}>
          <HStack spacing={1.5} minW={0}>
            <Box
              w="7px"
              h="7px"
              flexShrink={0}
              borderRadius="full"
              bg={category.isActive ? "green.400" : "red.400"}
            />
            <Text
              fontSize="xs"
              fontWeight="600"
              color={category.isActive ? "green.500" : "red.500"}
              noOfLines={1}
            >
              {category.isActive ? "Active" : "Inactive"}
            </Text>
          </HStack>
          <Text fontSize="xs" color="var(--merchant-text-muted)" flexShrink={0}>
            {filterCount} {filterCount === 1 ? "filter" : "filters"}
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

const CategoryPage = () => {
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

  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedFilterCategory, setSelectedFilterCategory] =
    useState<any>(null);
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

  const columns = [
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
        width: "100px",
      },
    },
  ];

  const tableActions = {
    actionBtn: {
      editKey: {
        showEditButton: true,
        function: handleEditClick,
      },
      deleteKey: {
        showDeleteButton: true,
        function: (row: any) => handleDeleteClick(row),
      },
    },
    pagination: {
      show: true,
      currentPage: 1,
      totalPages: 1,
      onClick: () => { },
    },
  };

  // Table box: no vertical scroll, horizontal scrollbar at the bottom.
  const merchantTableProps: any = getMerchantTableProps("62vh");

  const totalCategories = categoryStore.categories.length;
  const pct = (n: number) =>
    totalCategories ? Math.round((n / totalCategories) * 100) : 0;

  const activeCategories = categoryStore.categories.filter(
    (category: any) => category.isActive,
  ).length;
  const rootCategories = categoryStore.categories.filter(
    (category: any) => !category.parent,
  ).length;
  const categoriesWithFilters = categoryStore.categories.filter(
    (category: any) =>
      (category.filterConfig || []).some(
        (item: any) => item.isActive !== false,
      ),
  ).length;

  return (
    <MerchantPageShell>
      {/* ------------------------------ Stat cards ------------------------------ */}

      <SimpleGrid
        columns={{ base: 2, xl: 4 }}
        spacing={{ base: 3, md: 4 }}
        mb={{ base: 5, md: 6 }}
      >
        <StatCard
          label="Total Categories"
          value={totalCategories}
          icon={FiLayers}
          color="#5B9BFF"
        />

        <StatCard
          label="Active"
          value={activeCategories}
          icon={FiCheckCircle}
          color="#16C98D"
        />

        <StatCard
          label="Root Categories"
          value={rootCategories}
          icon={FiFolder}
          color="#A855F7"
        />

        <StatCard
          label="Filter Ready"
          value={categoriesWithFilters}
          icon={FiSliders}
          color="#F59E0B"
        />
      </SimpleGrid>

      {/* ---------------------------- Simple underline tabs ---------------------------- */}
      <Tabs variant="line" colorScheme="brand">
        <TabList
          borderBottom="1px solid"
          borderColor="var(--merchant-border-strong)"
        >
          <Tab
            px={{ base: 3, md: 5 }}
            py={3}
            fontSize={{ base: "sm", md: "md" }}
            fontWeight="600"
            color="var(--merchant-text-muted)"
            _selected={{ color: "blue.500", borderColor: "blue.500" }}
          >
            <Icon as={FiLayers} mr={2} />
            Categories
          </Tab>
          <Tab
            px={{ base: 3, md: 5 }}
            py={3}
            fontSize={{ base: "sm", md: "md" }}
            fontWeight="600"
            color="var(--merchant-text-muted)"
            _selected={{ color: "blue.500", borderColor: "blue.500" }}
          >
            <Icon as={FiSliders} mr={2} />
            Product Filters
          </Tab>
        </TabList>

        <TabPanels>
          {/* ============================ TAB 1: Categories ============================ */}
          <TabPanel px={0} pb={0} pt={5}>
            {/* Tablet / desktop: Clean header Flex + Table card */}
            <Box display={{ base: "none", md: "block" }} dir="ltr" w="100%">
              <Flex justify="space-between" align="center" mb={4}>
                <Text
                  fontSize="lg"
                  fontWeight="700"
                  color="var(--merchant-text)"
                >
                  All Categories ({categoryStore.categories.length})
                </Text>
                <Button
                  leftIcon={<FiFolderPlus />}
                  onClick={handleAddClick}
                  {...merchantPrimaryButtonProps}
                >
                  Add Category
                </Button>
              </Flex>

              <CustomTable
                data={categoryStore.categories}
                columns={columns}
                loading={categoryStore.loading}
                actions={tableActions}
                serial={{ show: true, text: "S.No." }}
                {...merchantTableProps}
                tableProps={{
                  ...(merchantTableProps.tableProps || {}),
                  tableBox: {
                    ...(merchantTableProps.tableProps?.tableBox || {}),
                    minH: "unset",
                    maxH: "none",
                    px: 0,
                    overflowX: "auto",
                    overflowY: "hidden",
                  },
                  table: {
                    ...(merchantTableProps.tableProps?.table || {}),
                    minW: "900px",
                  },
                }}
              />
            </Box>

            {/* Mobile: 2 photo cards per row */}
            <Box display={{ base: "block", md: "none" }}>
              <Flex align="center" justify="space-between" mb={4}>
                <Text
                  fontSize="md"
                  fontWeight="700"
                  color="var(--merchant-text)"
                >
                  All Categories ({categoryStore.categories.length})
                </Text>
                <IconButton
                  aria-label="Add category"
                  icon={<FiFolderPlus size={20} />}
                  onClick={handleAddClick}
                  w="44px"
                  h="44px"
                  minW="44px"
                  borderRadius="14px"
                  {...merchantPrimaryButtonProps}
                />
              </Flex>

              {categoryStore.loading ? (
                <Flex justify="center" py={10}>
                  <Spinner />
                </Flex>
              ) : categoryStore.categories.length === 0 ? (
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
                  {categoryStore.categories.map((category: any) => (
                    <CategoryMobileCard
                      key={category._id}
                      category={category}
                      onEdit={handleEditClick}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </SimpleGrid>
              )}
            </Box>
          </TabPanel>

          {/* ========================= TAB 2: Product Filters ========================= */}
          <TabPanel px={0} pb={0} pt={5}>
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

            <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} spacing={4}>
              {categoryStore.categories.map((category: any) => {
                const filterConfig = category.filterConfig || [];
                const activeFilterCount = filterConfig.filter(
                  (item: any) => item.isActive !== false,
                ).length;
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
                        <HStack
                          justify="space-between"
                          align="start"
                          spacing={3}
                        >
                          <Box minW={0}>
                            <Text
                              fontWeight="800"
                              color="var(--merchant-text)"
                              noOfLines={1}
                            >
                              {category.name}
                            </Text>
                            <HStack spacing={2} mt={2} flexWrap="wrap">
                              <MerchantBadge
                                tone={category.parent ? "info" : "soft"}
                              >
                                {category.parent
                                  ? typeof category.parent === "object"
                                    ? category.parent.name
                                    : "Child"
                                  : "Root"}
                              </MerchantBadge>
                              <MerchantBadge
                                tone={category.isActive ? "success" : "danger"}
                              >
                                {category.isActive ? "Active" : "Inactive"}
                              </MerchantBadge>
                            </HStack>
                          </Box>
                          <MerchantBadge
                            tone={activeFilterCount > 0 ? "accent" : "soft"}
                          >
                            {activeFilterCount} Filters
                          </MerchantBadge>
                        </HStack>
                      </Box>

                      {previewFilters.length > 0 ? (
                        <HStack spacing={2} flexWrap="wrap">
                          {previewFilters.map((filter: any, index: number) => (
                            <MerchantBadge
                              key={`${filter.label}-${index}`}
                              tone={
                                filter.isActive === false ? "soft" : "accent"
                              }
                            >
                              {filter.label}
                            </MerchantBadge>
                          ))}
                          {filterConfig.length > previewFilters.length && (
                            <MerchantBadge tone="soft">
                              +{filterConfig.length - previewFilters.length}
                            </MerchantBadge>
                          )}
                        </HStack>
                      ) : (
                        <Text color="var(--merchant-text-muted)" fontSize="sm">
                          No product filters configured for this category.
                        </Text>
                      )}

                      <Button
                        leftIcon={<FiSliders />}
                        onClick={() => handleConfigureFilters(category)}
                        {...merchantPrimaryButtonProps}
                      >
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
