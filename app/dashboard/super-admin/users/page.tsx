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
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useState } from "react";
import {
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
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
import { dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";
import {
  getMerchantTableProps,
  MerchantBadge,
  merchantGhostButtonProps,
  MerchantPageHeader,
  MerchantPageShell,
  MerchantStatCard,
} from "../../components/common/merchantDashboardUI";

const USER_TYPE_TABS = [
  { label: "All Users", value: "all" },
  { label: "Buyers / Customers", value: "buyer" },
  { label: "Sellers", value: "seller" },
  { label: "Admins", value: "admin" },
];

const SuperAdminUsersPage = observer(() => {
  const toast = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [userType, setUserType] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Quick stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    sellerUsers: 0,
    buyerUsers: 0,
  });

  const fetchUsers = useCallback(
    async (page: number = 1) => {
      setLoading(true);
      try {
        const params: any = {
          page,
          limit: 10,
        };
        if (search.trim()) params.search = search.trim();
        if (userType !== "all") params.type = userType;
        if (activeFilter === "active") params.isActive = "true";
        if (activeFilter === "inactive") params.isActive = "false";

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
    [search, userType, activeFilter, toast]
  );

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

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, userType, activeFilter]);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [fetchUsers, currentPage]);

  const columns: any = [
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
          const badgeColor = isAdmin
            ? "purple"
            : isSeller
            ? "blue"
            : "teal";
          const roleLabel = isAdmin
            ? "Admin"
            : isSeller
            ? "Seller"
            : "Buyer / Customer";

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
  ];

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

      {/* ---------------- Clean Filter Tabs & Status Row ---------------- */}
      <Flex
        justify="space-between"
        align="center"
        mb={4}
        flexWrap="wrap"
        gap={3}
      >
        {/* Quick Filter Buttons with live counts */}
        <HStack spacing={2} flexWrap="wrap">
          {USER_TYPE_TABS.map(({ value, label }) => {
            const isActive = userType === value;
            const count =
              value === "all"
                ? stats.totalUsers
                : value === "buyer"
                ? stats.buyerUsers
                : value === "seller"
                ? stats.sellerUsers
                : stats.totalUsers - stats.buyerUsers - stats.sellerUsers;

            return (
              <Button
                key={value}
                size="sm"
                h="38px"
                px={4}
                bg={isActive ? "var(--color-primary, #065F68)" : "transparent"}
                color={isActive ? "white" : "var(--merchant-text-muted, #94a3b8)"}
                border="1px solid"
                borderColor={isActive ? "var(--color-primary, #065F68)" : "var(--merchant-border, #1f2e46)"}
                _hover={{
                  bg: isActive ? "var(--color-primary-hover, #044249)" : "rgba(255, 255, 255, 0.04)",
                  borderColor: "var(--color-primary, #065F68)",
                }}
                borderRadius="12px"
                fontWeight="600"
                fontSize="xs"
                onClick={() => setUserType(value)}
              >
                {label} ({count >= 0 ? count : 0})
              </Button>
            );
          })}
        </HStack>

        {/* Search Bar & Active Status Filter */}
        <HStack spacing={2.5} flexWrap="nowrap" align="center">
          <InputGroup size="sm" w={{ base: "220px", sm: "260px", md: "300px" }}>
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
            w="130px"
            flexShrink={0}
            borderRadius="12px"
            bg="var(--merchant-surface-alt)"
            borderColor="var(--merchant-border-strong)"
            fontSize="xs"
            fontWeight="600"
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </Select>
        </HStack>
      </Flex>

      {/* CustomTable */}
      <Box
        bg={dashboardPalette.surface}
        border="1px solid"
        borderColor={dashboardPalette.border}
        borderRadius="xl"
        overflow="hidden"
      >
        <CustomTable
          {...getMerchantTableProps()}
          columns={columns}
          data={users}
          loading={loading}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <Flex
            px={4}
            py={3}
            justify="space-between"
            align="center"
            borderTop="1px solid"
            borderColor={dashboardPalette.border}
          >
            <Text fontSize="xs" color="gray.500">
              Showing page {currentPage} of {totalPages} ({totalUsers} total users)
            </Text>
            <HStack spacing={2}>
              <IconButton
                aria-label="Previous Page"
                icon={<Icon as={FiChevronLeft} />}
                size="sm"
                isDisabled={currentPage <= 1 || loading}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              />
              <IconButton
                aria-label="Next Page"
                icon={<Icon as={FiChevronRight} />}
                size="sm"
                isDisabled={currentPage >= totalPages || loading}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              />
            </HStack>
          </Flex>
        )}
      </Box>
    </MerchantPageShell>
  );
});

export default SuperAdminUsersPage;
