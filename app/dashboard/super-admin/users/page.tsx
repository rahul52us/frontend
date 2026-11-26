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
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Select,
  SimpleGrid,
  Skeleton,
  Tab,
  TabList,
  Tabs,
  Text,
  Tooltip,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiPhone,
  FiRefreshCw,
  FiSearch,
  FiShoppingBag,
  FiUserCheck,
  FiUsers,
  FiX,
  FiXCircle,
} from "react-icons/fi";
import CustomTable from "../../../component/config/component/CustomTable/CustomTable";
import {
  getMerchantTableProps,
  MerchantBadge,
  merchantGhostButtonProps,
  MerchantPageHeader,
  MerchantPageShell,
  MerchantStatCard,
} from "../../components/common/merchantDashboardUI";
import SellerBuyersDrawer, { SellerUserData } from "./components/SellerBuyersDrawer";

const USER_TYPE_TABS = [
  { label: "All Users", value: "all" },
  { label: "Buyers / Customers", value: "buyer" },
  { label: "Sellers", value: "seller" },
  { label: "Admins", value: "admin" },
] as const;

const SuperAdminUsersPage = observer(() => {
  const toast = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [userType, setUserType] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [exporting, setExporting] = useState(false);

  // Quick stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    sellerUsers: 0,
    buyerUsers: 0,
  });

  // Drawer modal state for seller buyers
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<SellerUserData | null>(null);

  // Debounce search input by 350ms to eliminate unnecessary API requests
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch users with optimized parameter generation
  const fetchUsers = useCallback(
    async (page: number = 1) => {
      setLoading(true);
      try {
        const params: Record<string, any> = {
          page,
          limit: 10,
        };
        if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
        if (userType !== "all") params.type = userType;
        if (activeFilter === "active") params.isActive = "true";
        if (activeFilter === "inactive") params.isActive = "false";
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const { data } = await axios.get("/user/admin/list", { params });
        if (data?.data) {
          setUsers(data.data.users || []);
          setTotalPages(data.data.totalPages || 1);
          setTotalUsers(data.data.total || 0);
        }
      } catch (err: any) {
        toast({
          title: "Failed to fetch users",
          description: err?.response?.data?.message || err?.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, userType, activeFilter, startDate, endDate, toast]
  );

  // Dedicated Platform Users Excel Export (.xlsx)
  const exportUsersToExcel = useCallback(async () => {
    setExporting(true);
    try {
      const params: Record<string, any> = {};
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (userType !== "all") params.type = userType;
      if (activeFilter === "active") params.isActive = "true";
      if (activeFilter === "inactive") params.isActive = "false";
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await axios.get("/user/admin/export", {
        params,
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `platform_users_${new Date().toISOString().slice(0, 10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Excel export successful",
        description: "Users spreadsheet downloaded successfully",
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
  }, [debouncedSearch, userType, activeFilter, startDate, endDate, toast]);

  // Fetch dedicated user stats directly
  const fetchStats = useCallback(async () => {
    try {
      const { data } = await axios.get("/user/admin/stats");
      if (data?.data) {
        setStats({
          totalUsers: data.data.totalUsers || 0,
          activeUsers: data.data.activeUsers || 0,
          sellerUsers: data.data.sellerUsers || 0,
          buyerUsers: data.data.buyerUsers || 0,
        });
      }
    } catch {
      // Non-blocking
    }
  }, []);

  const handleOpenSellerBuyers = useCallback(
    (sellerRow: any) => {
      const shop = sellerRow.shop || (sellerRow.company ? sellerRow.company : null);
      if (!shop?._id) {
        toast({
          title: "No seller shop ID found",
          status: "warning",
          duration: 2000,
        });
        return;
      }
      setSelectedSeller({
        _id: sellerRow._id,
        name: sellerRow.name,
        phone: sellerRow.phone,
        email: sellerRow.email,
        shopDetails: shop,
      });
      setIsDrawerOpen(true);
    },
    [toast]
  );

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setSelectedSeller(null);
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [fetchUsers, currentPage]);

  // Memoized columns definition so CustomTable does not trigger re-render on every state change
  const columns: any = useMemo(
    () => [
      {
        headerName: "User Profile",
        key: "name",
        type: "component",
        metaData: {
          component: (row: any) => (
            <HStack spacing={3}>
              <Avatar
                size="sm"
                name={row.name || row.phone}
                src={row.pic}
                bg="brand.500"
                color="white"
              />
              <VStack align="start" spacing={0}>
                <Text fontSize="sm" fontWeight={700}>
                  {row.name || "Unnamed User"}
                </Text>
                <HStack spacing={1}>
                  <Icon as={FiPhone} boxSize={3} color="gray.500" />
                  <Text fontSize="xs" color="gray.500">
                    {row.phone || "—"}
                  </Text>
                </HStack>
              </VStack>
            </HStack>
          ),
        },
      },
      {
        headerName: "Role / Type",
        key: "type",
        type: "component",
        metaData: {
          component: (row: any) => {
            const isSeller = Boolean(row.shop || row.type === "seller");
            const isAdmin = row.type === "superAdmin" || row.type === "admin";
            const badgeColor = isAdmin ? "purple" : isSeller ? "blue" : "teal";
            const roleLabel = isAdmin ? "Admin" : isSeller ? "Seller" : "Buyer / Customer";

            return (
              <HStack spacing={2}>
                <Badge
                  colorScheme={badgeColor}
                  borderRadius="full"
                  px={2.5}
                  py={0.5}
                  fontSize="xs"
                  fontWeight={700}
                  textTransform="capitalize"
                >
                  {roleLabel}
                </Badge>
                {row.shop && (
                  <Badge
                    colorScheme="orange"
                    variant="subtle"
                    borderRadius="full"
                    px={2}
                    py={0.5}
                    fontSize="10px"
                  >
                    Shop Owner
                  </Badge>
                )}
              </HStack>
            );
          },
        },
      },
      {
        headerName: "Seller Shop",
        key: "shop",
        type: "component",
        metaData: {
          component: (row: any) => {
            if (!row.shop) {
              return (
                <Text fontSize="xs" color="gray.500">
                  No shop registered
                </Text>
              );
            }
            return (
              <VStack align="start" spacing={0.5}>
                <HStack spacing={1.5}>
                  <Icon as={FiShoppingBag} boxSize={3.5} color="brand.500" />
                  <Text fontSize="xs" fontWeight={700}>
                    {row.shop.name}
                  </Text>
                </HStack>
                <HStack spacing={1}>
                  <Badge
                    fontSize="9px"
                    colorScheme={
                      row.shop.reviewStatus === "approved"
                        ? "green"
                        : row.shop.reviewStatus === "pending"
                        ? "orange"
                        : "gray"
                    }
                  >
                    {row.shop.reviewStatus}
                  </Badge>
                  <Text fontSize="10px" color="gray.500">
                    ({row.shop.companyCode})
                  </Text>
                </HStack>
              </VStack>
            );
          },
        },
      },
      {
        headerName: "Status",
        key: "isActive",
        type: "component",
        metaData: {
          component: (row: any) => (
            <HStack spacing={1.5}>
              <Icon
                as={row.isActive ? FiCheckCircle : FiXCircle}
                color={row.isActive ? "green.500" : "red.400"}
                boxSize={3.5}
              />
              <Text
                fontSize="xs"
                fontWeight={600}
                color={row.isActive ? "green.600" : "red.500"}
              >
                {row.isActive ? "Active" : "Inactive"}
              </Text>
            </HStack>
          ),
        },
      },
      {
        headerName: "Joined On",
        key: "createdAt",
        type: "component",
        metaData: {
          component: (row: any) => (
            <Text fontSize="xs" color="gray.500">
              {row.createdAt
                ? new Date(row.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "—"}
            </Text>
          ),
        },
      },
      {
        headerName: "Action",
        key: "action",
        type: "component",
        metaData: {
          component: (row: any) => {
            const hasShop = Boolean(row.shop);
            if (!hasShop) {
              return (
                <Text fontSize="xs" color="gray.400">
                  —
                </Text>
              );
            }
            return (
              <Tooltip
                label="View Seller's Buyers / Customers"
                hasArrow
                placement="top"
                bg="var(--color-primary, #065F68)"
                color="white"
                fontSize="xs"
                borderRadius="md"
              >
                <IconButton
                  aria-label="View Buyers"
                  icon={<Icon as={FiUsers} boxSize={4} />}
                  size="sm"
                  variant="ghost"
                  color="var(--color-primary, #065F68)"
                  borderRadius="lg"
                  onClick={() => handleOpenSellerBuyers(row)}
                  _hover={{
                    bg: "var(--color-primary, #065F68)",
                    color: "white",
                    transform: "translateY(-1px)",
                    boxShadow: "0 2px 8px rgba(6, 95, 104, 0.3)",
                  }}
                  _active={{
                    bg: "var(--color-primary-hover, #044249)",
                  }}
                  transition="all 0.15s ease-in-out"
                />
              </Tooltip>
            );
          },
        },
      },
    ],
    [handleOpenSellerBuyers]
  );

  const tableActions = useMemo(
    () => ({
      pagination: {
        show: true,
        currentPage: currentPage,
        totalPages: totalPages,
        onClick: (page: number) => setCurrentPage(page),
      },
      search: {
        show: false,
      },
    }),
    [currentPage, totalPages]
  );

  const selectedTabIndex = useMemo(
    () => USER_TYPE_TABS.findIndex((t) => t.value === userType),
    [userType]
  );

  const tableContainerSx = useMemo(
    () => ({
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
    }),
    []
  );

  const tablePropsConfig = useMemo(() => getMerchantTableProps("62vh"), []);

  return (
    <MerchantPageShell>
      {/* Page Header */}
      <MerchantPageHeader
        icon={FiUsers}
        title="Platform Users"
        badges={
          <MerchantBadge variant="primary">
            {totalUsers} {totalUsers === 1 ? "User" : "Users"}
          </MerchantBadge>
        }
        description="View, search and manage all buyers, sellers, and system accounts"
        actions={
          <Button
            {...merchantGhostButtonProps}
            size="sm"
            leftIcon={<Icon as={FiRefreshCw} boxSize={3.5} />}
            onClick={() => {
              fetchStats();
              fetchUsers(currentPage);
            }}
            isLoading={loading}
          >
            Refresh
          </Button>
        }
      />

      {/* Metric Cards */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3} mb={5}>
        <MerchantStatCard
          label="Total Users"
          value={stats.totalUsers}
          icon={FiUsers}
          color="#3B82F6"
        />
        <MerchantStatCard
          label="Active Users"
          value={stats.activeUsers}
          icon={FiUserCheck}
          color="#10B981"
        />
        <MerchantStatCard
          label="Sellers"
          value={stats.sellerUsers}
          icon={FiShoppingBag}
          color="#F59E0B"
        />
        <MerchantStatCard
          label="Buyers / Customers"
          value={stats.buyerUsers}
          icon={FiUsers}
          color="#8B5CF6"
        />
      </SimpleGrid>

      {/* Modern Filter Tabs Row matching Shop page */}
      <Flex
        justify="space-between"
        align="center"
        mb={4}
        flexWrap="wrap"
        gap={3}
      >
        {/* Desktop Filter Tabs */}
        <Tabs
          variant="unstyled"
          index={selectedTabIndex >= 0 ? selectedTabIndex : 0}
          onChange={(index) => {
            setUserType(USER_TYPE_TABS[index].value);
            setCurrentPage(1);
          }}
          display={{ base: "none", md: "block" }}
        >
          <TabList
            bg="var(--merchant-surface-alt)"
            border="1px solid"
            borderColor="var(--merchant-border)"
            borderRadius="14px"
            p={1}
            display="inline-flex"
            alignItems="center"
          >
            {USER_TYPE_TABS.map((tab) => {
              const isSelected = userType === tab.value;
              const count =
                tab.value === "all"
                  ? stats.totalUsers
                  : tab.value === "buyer"
                  ? stats.buyerUsers
                  : tab.value === "seller"
                  ? stats.sellerUsers
                  : stats.totalUsers - stats.buyerUsers - stats.sellerUsers;

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
                    bg: "var(--merchant-surface)",
                  }}
                  _selected={{
                    color: "white",
                    bg: "var(--color-primary, #065F68)",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <HStack spacing={1.5}>
                    <Text>{tab.label}</Text>
                    <Badge
                      bg={isSelected ? "whiteAlpha.300" : "blackAlpha.100"}
                      color={isSelected ? "white" : "inherit"}
                      borderRadius="full"
                      px={1.5}
                      fontSize="10px"
                    >
                      {count >= 0 ? count : 0}
                    </Badge>
                  </HStack>
                </Tab>
              );
            })}
          </TabList>
        </Tabs>

        {/* Right Controls: Date Range + Search Bar + Active Status Filter + Export Excel Button */}
        <HStack spacing={2.5} flexWrap="wrap" align="center" ml={{ base: 0, md: "auto" }}>
          {/* Compact Date Range Inputs */}
          <HStack
            spacing={1.5}
            bg="var(--merchant-surface-alt)"
            px={2.5}
            py={1}
            borderRadius="12px"
            border="1px solid"
            borderColor="var(--merchant-border-strong)"
            align="center"
            h="38px"
          >
            <Icon as={FiCalendar} color="var(--color-primary, #065F68)" boxSize={3.5} />
            <Input
              type="date"
              size="xs"
              h="26px"
              w="115px"
              border="none"
              p={0}
              fontSize="11px"
              _focus={{ boxShadow: "none" }}
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Text fontSize="10px" color="gray.400" fontWeight={700}>
              TO
            </Text>
            <Input
              type="date"
              size="xs"
              h="26px"
              w="115px"
              border="none"
              p={0}
              fontSize="11px"
              _focus={{ boxShadow: "none" }}
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
            />
            {(startDate || endDate) && (
              <IconButton
                aria-label="Clear dates"
                icon={<Icon as={FiX} />}
                size="xs"
                h="20px"
                w="20px"
                minW="20px"
                variant="ghost"
                colorScheme="red"
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                  setCurrentPage(1);
                }}
              />
            )}
          </HStack>

          <InputGroup size="sm" w={{ base: "200px", sm: "240px", md: "260px" }}>
            <InputLeftElement pointerEvents="none" h="38px">
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, or email..."
              borderRadius="12px"
              h="38px"
              fontSize="sm"
              bg="var(--merchant-surface-alt)"
              borderColor="var(--merchant-border-strong)"
              _hover={{ borderColor: "brand.400" }}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
              }}
            />
            {search && (
              <InputRightElement h="38px">
                <IconButton
                  aria-label="Clear search"
                  icon={<Icon as={FiX} />}
                  size="xs"
                  variant="ghost"
                  onClick={() => setSearch("")}
                />
              </InputRightElement>
            )}
          </InputGroup>

          <Select
            size="sm"
            h="38px"
            w="125px"
            flexShrink={0}
            borderRadius="12px"
            bg="var(--merchant-surface-alt)"
            borderColor="var(--merchant-border-strong)"
            fontSize="xs"
            fontWeight="600"
            value={activeFilter}
            onChange={(e) => {
              setActiveFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </Select>

          {/* Export Excel Button */}
          <Button
            size="sm"
            h="38px"
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
            onClick={exportUsersToExcel}
          >
            Export Excel
          </Button>
        </HStack>
      </Flex>

      {/* Desktop View: Custom Table with clean outer container exactly matching Shops Page */}
      <Box
        display={{ base: "none", md: "block" }}
        dir="ltr"
        w="100%"
        sx={tableContainerSx}
      >
        <CustomTable
          columns={columns}
          data={users}
          loading={loading}
          actions={tableActions}
          {...tablePropsConfig}
        />
      </Box>

      {/* Mobile View: Activity Cards exactly like Shops Page */}
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
        ) : users.length === 0 ? (
          <Box
            textAlign="center"
            py={10}
            px={4}
            bg="var(--merchant-surface-alt)"
            borderRadius="20px"
            borderWidth="1px"
            borderColor="var(--merchant-border)"
          >
            <Text fontSize="sm" color="var(--merchant-text-muted)" fontWeight="600">
              No users found matching your filters
            </Text>
          </Box>
        ) : (
          users.map((u: any) => {
            const isSeller = Boolean(u.shop || u.type === "seller");
            const isAdmin = u.type === "superAdmin" || u.type === "admin";
            const roleBadgeColor = isAdmin ? "purple" : isSeller ? "blue" : "teal";
            const roleText = isAdmin ? "Admin" : isSeller ? "Seller" : "Buyer";

            return (
              <Box
                key={u._id}
                p={3.5}
                border="1px solid"
                borderColor="var(--merchant-border)"
                borderRadius="20px"
                bg="var(--merchant-surface)"
                transition="all 0.2s ease"
                _hover={{ bg: "var(--merchant-surface-alt)" }}
              >
                <Flex align="start" justify="space-between" gap={3}>
                  <HStack spacing={3}>
                    <Avatar
                      size="sm"
                      name={u.name || u.phone}
                      src={u.pic}
                      bg="brand.500"
                      color="white"
                    />
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" fontWeight={700} color="var(--merchant-text)">
                        {u.name || "Unnamed"}
                      </Text>
                      <Text fontSize="xs" color="var(--merchant-text-muted)">
                        {u.phone || "—"}
                      </Text>
                    </VStack>
                  </HStack>

                  <Badge colorScheme={roleBadgeColor} borderRadius="full" px={2} py={0.5} fontSize="10px">
                    {roleText}
                  </Badge>
                </Flex>

                {u.shop && (
                  <Box
                    mt={2.5}
                    p={2}
                    borderRadius="10px"
                    bg="var(--merchant-surface-alt)"
                    border="1px solid var(--merchant-border)"
                  >
                    <HStack justify="space-between">
                      <HStack spacing={1.5}>
                        <Icon as={FiShoppingBag} boxSize={3.5} color="brand.500" />
                        <Text fontSize="xs" fontWeight={600}>
                          {u.shop.name}
                        </Text>
                      </HStack>
                      <Text fontSize="10px" color="var(--merchant-text-muted)">
                        ({u.shop.companyCode})
                      </Text>
                    </HStack>
                  </Box>
                )}

                {/* Bottom Action Row */}
                <Flex align="center" justify="space-between" mt={3} pt={2} borderTop="1px solid var(--merchant-border)">
                  <Text fontSize="11px" color="var(--merchant-text-muted)">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ""}
                  </Text>
                  {u.shop && (
                    <Button
                      size="xs"
                      variant="ghost"
                      color="var(--color-primary, #065F68)"
                      borderRadius="8px"
                      leftIcon={<Icon as={FiUsers} />}
                      _hover={{
                        bg: "var(--color-primary, #065F68)",
                        color: "white",
                      }}
                      _active={{
                        bg: "var(--color-primary-hover, #044249)",
                      }}
                      onClick={() => handleOpenSellerBuyers(u)}
                    >
                      View Buyers
                    </Button>
                  )}
                </Flex>
              </Box>
            );
          })
        )}

        {/* Mobile Pagination */}
        {totalPages > 1 && (
          <Flex justify="space-between" align="center" pt={3}>
            <Text fontSize="xs" color="var(--merchant-text-muted)">
              Page {currentPage} of {totalPages}
            </Text>
            <HStack spacing={2}>
              <IconButton
                aria-label="Previous page"
                icon={<FiChevronLeft />}
                size="sm"
                variant="outline"
                borderRadius="10px"
                isDisabled={currentPage <= 1 || loading}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              />
              <IconButton
                aria-label="Next page"
                icon={<FiChevronRight />}
                size="sm"
                variant="outline"
                borderRadius="10px"
                isDisabled={currentPage >= totalPages || loading}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              />
            </HStack>
          </Flex>
        )}
      </VStack>

      {/* Modular Seller Buyers Drawer */}
      <SellerBuyersDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        seller={selectedSeller}
      />
    </MerchantPageShell>
  );
});

export default SuperAdminUsersPage;
