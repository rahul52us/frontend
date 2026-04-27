import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Box,
  Badge,
  useToast,
  Text,
  useDisclosure,
  Heading,
  HStack,
  VStack,
  Flex,
  SimpleGrid,
  Icon,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { FaClipboardList, FaTruck, FaCheckCircle, FaSlidersH } from "react-icons/fa";
import stores from "../../../../store/stores";
import CustomTable from "../../../../component/config/component/CustomTable/CustomTable";
import OrderDrawer from "./OrderDrawer";
import { dashboardPalette } from "../../../../layouts/dashboardLayout/dashboardPalette";
import {
  getMerchantTableProps,
  MerchantBadge,
  MerchantHeroSection,
  MerchantPageShell,
  MerchantPanel,
  MerchantStatCard,
} from "../../common/merchantDashboardUI";

const formatCurrency = (amount: any) => {
  const numericAmount = Number(amount || 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numericAmount);
};

const getOrderStatusMeta = (status: string) => {
  const normalized = String(status || "").toLowerCase();

  if (normalized === "delivered") {
    return {
      label: "Delivered",
      bg: "rgba(70, 201, 139, 0.14)",
      color: dashboardPalette.success,
      borderColor: "rgba(70, 201, 139, 0.22)",
    };
  }

  if (normalized === "cancelled") {
    return {
      label: "Cancelled",
      bg: "rgba(239, 107, 107, 0.14)",
      color: dashboardPalette.danger,
      borderColor: "rgba(239, 107, 107, 0.24)",
    };
  }

  if (normalized === "created") {
    return {
      label: "Placed",
      bg: dashboardPalette.accentSoft,
      color: dashboardPalette.accentStrong,
      borderColor: dashboardPalette.border,
    };
  }

  return {
    label: status || "Pending",
    bg: "rgba(214, 183, 114, 0.08)",
    color: dashboardPalette.warning,
    borderColor: dashboardPalette.border,
  };
};

const OrdersTab = observer(() => {
  const { orderStore, auth } = stores;
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const companyId = auth.user?.company?._id || auth.user?.company;

  const fetchOrders = useCallback(async () => {
    if (!companyId) return;

    try {
      await orderStore.fetchCompanyOrders(companyId);
    } catch (error: any) {
      console.error("Error fetching orders:", JSON.stringify(error, null, 2));
      toast({
        title: "Error fetching orders",
        description:
          typeof error?.message === "string"
            ? error.message
            : "An unknown error occurred",
        status: "error",
      });
    }
  }, [companyId, toast, orderStore]);

  useEffect(() => {
    if (auth.token && companyId) {
      fetchOrders();
    }
  }, [fetchOrders, auth.token, companyId]);

  const handleSearchChange = useCallback(
    (e: any) => {
      orderStore.setFilter("search", e.target.value);
    },
    [orderStore]
  );

  const isMounted = React.useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    const timer = setTimeout(() => {
      if (companyId) fetchOrders();
    }, 800);
    return () => clearTimeout(timer);
  }, [orderStore.filters.search, companyId, fetchOrders]);

  const handleDateChange = useCallback(
    (date: any, type: string) => {
      const newDate = { ...orderStore.filters.date, [type]: date };
      orderStore.setFilter("date", newDate);
      fetchOrders();
    },
    [orderStore, fetchOrders]
  );

  const handleStatusChange = useCallback(
    (selectedOptions: any) => {
      orderStore.setFilter("status", selectedOptions.join(","));
      fetchOrders();
    },
    [orderStore, fetchOrders]
  );

  const handleApplyFilter = useCallback(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleReset = useCallback(() => {
    orderStore.resetFilters();
    fetchOrders();
  }, [orderStore, fetchOrders]);

  const handlePageChange = useCallback(
    (page: number) => {
      orderStore.setPage(page);
      fetchOrders();
    },
    [orderStore, fetchOrders]
  );

  const handleRowClick = useCallback(
    (row: any) => {
      setSelectedOrderId(row._id || row.orderId);
      onOpen();
    },
    [onOpen]
  );

  const handleCloseDrawer = useCallback(() => {
    onClose();
    setSelectedOrderId(null);
  }, [onClose]);

  const selectedOrder = orderStore.companyOrders.find(
    (o: any) => o._id === selectedOrderId || o.orderId === selectedOrderId
  );

  const statusOptions = useMemo(
    () => [
      { label: "Pending", value: "pending" },
      { label: "Confirmed", value: "confirmed" },
      { label: "Processing", value: "processing" },
      { label: "Shipped", value: "shipped" },
      { label: "Delivered", value: "delivered" },
      { label: "Cancelled", value: "cancelled" },
    ],
    []
  );

  const columns = useMemo(
    () => [
      {
        headerName: "Order ID",
        key: "orderId",
        type: "text",
      },
      {
        headerName: "Date",
        key: "createdAt",
        type: "date",
      },
      {
        headerName: "Customer",
        key: "customerName",
        type: "component",
        metaData: {
          component: (row: any) => (
            <VStack align="start" spacing={0.5}>
              <Text color={dashboardPalette.text} fontWeight="600">
                {row.user?.name || "N/A"}
              </Text>
              <Text color={dashboardPalette.textSoft} fontSize="xs">
                {row.user?.phone || row.user?.email || "No contact details"}
              </Text>
            </VStack>
          ),
        },
      },
      {
        headerName: "Status",
        key: "orderStatus",
        type: "component",
        metaData: {
          component: (row: any) => {
            const statusMeta = getOrderStatusMeta(row.orderStatus);
            return (
              <Badge
                px={3}
                py={1.5}
                borderRadius="full"
                bg={statusMeta.bg}
                color={statusMeta.color}
                border="1px solid"
                borderColor={statusMeta.borderColor}
                textTransform="capitalize"
              >
                {statusMeta.label}
              </Badge>
            );
          },
        },
      },
      {
        headerName: "Amount",
        key: "amount",
        type: "component",
        metaData: {
          component: (row: any) => (
            <Text color={dashboardPalette.accentStrong} fontWeight="700">
              {formatCurrency(row.quote?.price?.value || row.total)}
            </Text>
          ),
        },
      },
      {
        headerName: "Items",
        key: "itemsCount",
        type: "component",
        metaData: {
          component: (row: any) => (
            <Badge
              px={3}
              py={1.5}
              borderRadius="full"
              bg={dashboardPalette.surfaceAlt}
              color={dashboardPalette.textMuted}
              border="1px solid"
              borderColor={dashboardPalette.borderStrong}
            >
              {row.items?.length || 0} Items
            </Badge>
          ),
        },
      },
    ],
    []
  );

  const actions = useMemo(
    () => ({
      search: {
        show: true,
        placeholder: "Search by Order ID or Customer Name",
        searchValue: orderStore.filters.search,
        onSearchChange: handleSearchChange,
      },
      datePicker: {
        show: true,
        date: orderStore.filters.date,
        onDateChange: handleDateChange,
      },
      multidropdown: {
        show: true,
        title: "Status",
        dropdowns: [
          {
            label: "Status",
            options: statusOptions,
          },
        ],
        selectedOptions: orderStore.filters.status
          ? {
              Status: statusOptions.filter((option) =>
                orderStore.filters.status.split(",").includes(option.value)
              ),
            }
          : {},
        onDropdownChange: (selected: any) => {
          const statusArr = Array.isArray(selected)
            ? selected.map((option: any) => option.value)
            : [];
          handleStatusChange(statusArr);
        },
        onApply: handleApplyFilter,
      },
      resetData: {
        show: true,
        text: "Reset Filters",
        function: handleReset,
      },
      pagination: {
        show: true,
        currentPage: orderStore.pagination.page,
        totalPages: orderStore.pagination.totalPages,
        limit: orderStore.pagination.limit,
        onClick: handlePageChange,
      },
    }),
    [
      orderStore.filters.search,
      orderStore.filters.date,
      orderStore.filters.status,
      orderStore.pagination.page,
      orderStore.pagination.totalPages,
      orderStore.pagination.limit,
      handleSearchChange,
      handleDateChange,
      handleStatusChange,
      handleApplyFilter,
      handleReset,
      handlePageChange,
      statusOptions,
    ]
  );

  const metrics = useMemo(() => {
    const visibleOrders = orderStore.companyOrders.length;
    const deliveredOrders = orderStore.companyOrders.filter(
      (order: any) => String(order.orderStatus).toLowerCase() === "delivered"
    ).length;
    const inTransitOrders = orderStore.companyOrders.filter((order: any) => {
      const status = String(order.orderStatus).toLowerCase();
      return status !== "delivered" && status !== "cancelled";
    }).length;
    const activeFilterCount =
      Number(Boolean(orderStore.filters.search?.trim?.())) +
      Number(Boolean(orderStore.filters.status)) +
      Number(
        Boolean(orderStore.filters.date?.startDate || orderStore.filters.date?.endDate)
      );

    return {
      totalOrders: orderStore.pagination.total || 0,
      visibleOrders,
      deliveredOrders,
      inTransitOrders,
      activeFilterCount,
    };
  }, [
    orderStore.companyOrders,
    orderStore.pagination.total,
    orderStore.filters.search,
    orderStore.filters.status,
    orderStore.filters.date,
  ]);

  if (!companyId) {
    return (
      <MerchantPageShell maxW="7xl">
        <MerchantPanel p={{ base: 6, md: 8 }}>
            <Text color={dashboardPalette.text} fontSize="lg" fontWeight="600">
              No company information found for this user.
            </Text>
            <Text mt={2} color={dashboardPalette.textMuted}>
              Orders are tied to a seller storefront, so this tab needs a company profile before it can load.
            </Text>
        </MerchantPanel>
      </MerchantPageShell>
    );
  }

  return (
    <MerchantPageShell>
      <MerchantHeroSection
        icon={FaClipboardList}
        primaryBadge="Commerce Desk"
        extraBadges={
          metrics.activeFilterCount > 0 ? (
            <MerchantBadge tone="soft">{metrics.activeFilterCount} Active Filters</MerchantBadge>
          ) : undefined
        }
        title="Order Management"
        description="Review incoming orders, update fulfillment progress, and keep delivery operations organized from one merchant workspace."
        gap={8}
        glowProps={{ top: "-90px", right: "-40px", w: "240px", h: "240px" }}
        rightContent={
          <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={3} minW={{ xl: "420px" }}>
            <MerchantStatCard
              label="Total Orders"
              value={metrics.totalOrders}
              icon={FaClipboardList}
              iconColor={dashboardPalette.accentStrong}
            />
            <MerchantStatCard
              label="Open on Page"
              value={metrics.inTransitOrders}
              icon={FaTruck}
              iconColor={dashboardPalette.warning}
            />
            <MerchantStatCard
              label="Delivered on Page"
              value={metrics.deliveredOrders}
              icon={FaCheckCircle}
              iconColor={dashboardPalette.success}
              iconBg="rgba(70, 201, 139, 0.10)"
            />
          </SimpleGrid>
        }
      />

      <MerchantPanel p={{ base: 4, md: 6 }}>
          <Flex
            justify="space-between"
            align={{ base: "start", md: "center" }}
            direction={{ base: "column", md: "row" }}
            gap={3}
            mb={4}
          >
            <Box>
              <Heading size="md" color={dashboardPalette.text} fontWeight="600">
                All Orders
              </Heading>
              <Text mt={1} color={dashboardPalette.textMuted}>
                Showing {metrics.visibleOrders} orders on this page.
              </Text>
            </Box>
            <HStack spacing={2} flexWrap="wrap">
              <MerchantBadge tone="soft">
                <HStack spacing={2}>
                  <Icon as={FaSlidersH} />
                  <Text>{metrics.activeFilterCount} Filters</Text>
                </HStack>
              </MerchantBadge>
              <MerchantBadge tone="accent">
                {metrics.totalOrders} Total
              </MerchantBadge>
            </HStack>
          </Flex>

          <CustomTable
            title="Order Register"
            columns={columns}
            data={orderStore.companyOrders}
            loading={orderStore.isLoading}
            serial={{ show: true, text: "S.No", width: "8%" }}
            onRowClick={handleRowClick}
            actions={actions}
            {...getMerchantTableProps("62vh")}
          />
      </MerchantPanel>

      {selectedOrder ? (
        <OrderDrawer
          isOpen={isOpen}
          onClose={handleCloseDrawer}
          order={selectedOrder}
        />
      ) : null}
    </MerchantPageShell>
  );
});

export default OrdersTab;
