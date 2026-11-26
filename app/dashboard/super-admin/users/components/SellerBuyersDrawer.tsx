"use client";

import {
  Avatar,
  Badge,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
  Tooltip,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import {
  FiCalendar,
  FiDownload,
  FiPhone,
  FiRefreshCw,
  FiSearch,
  FiShoppingBag,
  FiX,
} from "react-icons/fi";
import CustomTable from "../../../../component/config/component/CustomTable/CustomTable";
import { dashboardPalette } from "../../../../layouts/dashboardLayout/dashboardPalette";
import { getMerchantTableProps } from "../../../components/common/merchantDashboardUI";

export interface SellerShopData {
  _id: string;
  name: string;
  companyCode: string;
  phone?: string;
  email?: string;
}

export interface SellerUserData {
  _id: string;
  name: string;
  phone?: string;
  email?: string;
  shopDetails?: SellerShopData;
}

interface SellerBuyersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  seller: SellerUserData | null;
}

export const SellerBuyersDrawer: React.FC<SellerBuyersDrawerProps> = ({
  isOpen,
  onClose,
  seller,
}) => {
  const toast = useToast();
  const [buyers, setBuyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [exporting, setExporting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const sellerShopId = seller?.shopDetails?._id;

  const fetchSellerBuyers = useCallback(
    async (
      shopId: string,
      targetPage: number = 1,
      searchQuery: string = "",
      start: string = "",
      end: string = ""
    ) => {
      if (!shopId) return;
      setLoading(true);
      try {
        const params: any = { page: targetPage, limit: 10 };
        if (searchQuery.trim()) params.search = searchQuery.trim();
        if (start) params.startDate = start;
        if (end) params.endDate = end;

        const { data } = await axios.get(`/user/admin/seller-buyers/${shopId}`, {
          params,
        });
        if (data?.data) {
          setBuyers(data.data.buyers || []);
          setTotalPages(data.data.totalPages || 1);
          setTotalCount(data.data.total || 0);
        }
      } catch (err: any) {
        toast({
          title: "Failed to load seller buyers",
          description: err?.response?.data?.message || err?.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    if (isOpen && sellerShopId) {
      setPage(1);
      setSearch("");
      setStartDate("");
      setEndDate("");
      fetchSellerBuyers(sellerShopId, 1, "", "", "");
    } else {
      setBuyers([]);
      setTotalCount(0);
      setTotalPages(1);
    }
  }, [isOpen, sellerShopId, fetchSellerBuyers]);

  // Dedicated Excel (.xlsx) export
  const handleExportExcel = async () => {
    if (!sellerShopId) return;

    setExporting(true);
    try {
      const params: any = {};
      if (search.trim()) params.search = search.trim();
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await axios.get(
        `/user/admin/seller-buyers/${sellerShopId}/export`,
        {
          params,
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const sanitizedShop = (seller?.shopDetails?.name || "Seller")
        .replace(/[^a-zA-Z0-9]/g, "_")
        .toLowerCase();
      link.href = url;
      link.setAttribute(
        "download",
        `${sanitizedShop}_buyers_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Excel export successful",
        description: "Spreadsheet downloaded successfully",
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
  };

  // Columns definition using the project's native CustomTable (guarantees 100% theme consistency)
  const columns: any = [
    {
      headerName: "Buyer / Customer",
      key: "name",
      type: "component",
      metaData: {
        component: (row: any) => {
          const customerName =
            row.buyerProfile?.displayName ||
            row.name ||
            row.user?.name ||
            "Customer";
          return (
            <HStack spacing={3}>
              <Avatar
                size="sm"
                name={customerName}
                src={row.user?.pic}
                bg="var(--color-primary, #065F68)"
                color="white"
                fontWeight={700}
              />
              <VStack align="start" spacing={0}>
                <Text fontSize="xs" fontWeight={700} color="var(--merchant-text, #0f172a)">
                  {customerName}
                </Text>
                <Text fontSize="10px" color="var(--merchant-text-muted, #94a3b8)">
                  ID: {row._id?.slice(-6)?.toUpperCase()}
                </Text>
              </VStack>
            </HStack>
          );
        },
      },
    },
    {
      headerName: "Contact Info",
      key: "phone",
      type: "component",
      metaData: {
        component: (row: any) => {
          const phone = row.phone || row.user?.phone || row.buyerProfile?.altPhone || "—";
          return (
            <VStack align="start" spacing={0.5}>
              <HStack spacing={1.5}>
                <Icon as={FiPhone} boxSize={3} color="var(--color-primary, #065F68)" />
                <Text fontSize="xs" fontWeight={600} color="var(--merchant-text, #0f172a)">
                  {phone}
                </Text>
              </HStack>
              {row.email && (
                <Text fontSize="10px" color="var(--merchant-text-muted, #94a3b8)">
                  {row.email}
                </Text>
              )}
            </VStack>
          );
        },
      },
    },
    {
      headerName: "Customer Code",
      key: "companyCode",
      type: "component",
      metaData: {
        component: (row: any) => (
          <Badge
            colorScheme="cyan"
            variant="subtle"
            borderRadius="md"
            px={2}
            py={0.5}
            fontSize="xs"
            fontWeight={600}
          >
            {row.companyCode || "—"}
          </Badge>
        ),
      },
    },
    {
      headerName: "Connected On",
      key: "createdAt",
      type: "component",
      metaData: {
        component: (row: any) => (
          <VStack align="start" spacing={0}>
            <Text fontSize="xs" fontWeight={600} color="var(--merchant-text, #0f172a)">
              {row.createdAt
                ? new Date(row.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "—"}
            </Text>
            <Text fontSize="10px" color="var(--merchant-text-muted, #94a3b8)">
              {row.createdAt
                ? new Date(row.createdAt).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </Text>
          </VStack>
        ),
      },
    },
  ];

  const tableActions = {
    pagination: {
      show: true,
      currentPage: page,
      totalPages: totalPages,
      onClick: (p: number) => {
        setPage(p);
        if (sellerShopId) {
          fetchSellerBuyers(sellerShopId, p, search, startDate, endDate);
        }
      },
    },
    search: {
      show: false,
    },
  };

  return (
    <Drawer isOpen={isOpen} placement="right" size="xl" onClose={onClose}>
      <DrawerOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <DrawerContent
        bg="var(--merchant-surface, #ffffff)"
        maxW={{ base: "100%", md: "780px", lg: "860px" }}
        boxShadow="-8px 0 32px rgba(0,0,0,0.15)"
      >
        {/* Custom Styled Premium Close Button */}
        <IconButton
          aria-label="Close drawer"
          icon={<Icon as={FiX} boxSize={5} />}
          position="absolute"
          top={4}
          right={4}
          zIndex={10}
          size="md"
          borderRadius="full"
          bg="var(--merchant-surface, #ffffff)"
          color="var(--merchant-text-muted, #64748b)"
          border="1px solid"
          borderColor="var(--merchant-border, #E2E8F0)"
          boxShadow="0 2px 6px rgba(0,0,0,0.06)"
          _hover={{
            bg: "red.50",
            color: "red.500",
            borderColor: "red.200",
            transform: "rotate(90deg)",
          }}
          transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
          onClick={onClose}
        />

        {/* Header */}
        <DrawerHeader
          bg="var(--merchant-surface-alt, #f8fafc)"
          borderBottom="1px solid"
          borderColor="var(--merchant-border, #E2E8F0)"
          px={6}
          py={5}
        >
          <HStack spacing={3.5} align="center">
            <Flex
              w="44px"
              h="44px"
              borderRadius="xl"
              bg="var(--color-primary, #065F68)"
              color="white"
              align="center"
              justify="center"
              boxShadow="0 4px 12px rgba(6, 95, 104, 0.25)"
              flexShrink={0}
            >
              <Icon as={FiShoppingBag} boxSize={5} />
            </Flex>
            <VStack align="start" spacing={0.5} flex={1}>
              <HStack spacing={2} align="center">
                <Text fontSize="md" fontWeight={700} color="var(--merchant-text, #0f172a)">
                  {seller?.shopDetails?.name || seller?.name || "Seller Shop"}
                </Text>
                {seller?.shopDetails?.companyCode && (
                  <Badge
                    bg="var(--color-primary-soft, rgba(6, 95, 104, 0.1))"
                    color="var(--color-primary, #065F68)"
                    borderRadius="md"
                    px={2}
                    py={0.5}
                    fontSize="10px"
                    fontWeight={700}
                  >
                    {seller.shopDetails.companyCode}
                  </Badge>
                )}
              </HStack>
              <HStack spacing={2} fontSize="xs" color="var(--merchant-text-muted, #64748b)">
                <Text>
                  Owner: <strong>{seller?.name}</strong> ({seller?.phone || "—"})
                </Text>
              </HStack>
            </VStack>
          </HStack>
        </DrawerHeader>

        <DrawerBody px={{ base: 3, md: 5 }} py={4}>
          {/* Clean Unified Drawer Toolbar */}
          <Box
            bg="var(--merchant-surface-alt, #f8fafc)"
            p={2.5}
            borderRadius="14px"
            border="1px solid"
            borderColor="var(--merchant-border, #E2E8F0)"
            mb={4}
          >
            <Flex
              direction={{ base: "column", lg: "row" }}
              align={{ base: "stretch", lg: "center" }}
              justify="space-between"
              gap={2.5}
            >
              {/* Search Bar + Date Range Group */}
              <HStack spacing={2} flex={1} flexWrap={{ base: "wrap", md: "nowrap" }}>
                <InputGroup size="sm" maxW={{ base: "100%", md: "230px" }}>
                  <InputLeftElement pointerEvents="none" h="36px">
                    <Icon as={FiSearch} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    value={search}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSearch(val);
                      setPage(1);
                      if (sellerShopId) {
                        fetchSellerBuyers(sellerShopId, 1, val, startDate, endDate);
                      }
                    }}
                    placeholder="Search buyer name, phone..."
                    borderRadius="10px"
                    h="36px"
                    fontSize="xs"
                    bg="var(--merchant-surface, #ffffff)"
                    borderColor="var(--merchant-border, #E2E8F0)"
                    _hover={{ borderColor: "var(--color-primary, #065F68)" }}
                    _focus={{
                      borderColor: "var(--color-primary, #065F68)",
                      boxShadow: "0 0 0 1px var(--color-primary, #065F68)",
                    }}
                  />
                  {search && (
                    <InputRightElement h="36px">
                      <IconButton
                        aria-label="Clear search"
                        icon={<Icon as={FiX} />}
                        size="xs"
                        variant="ghost"
                        onClick={() => {
                          setSearch("");
                          setPage(1);
                          if (sellerShopId) {
                            fetchSellerBuyers(sellerShopId, 1, "", startDate, endDate);
                          }
                        }}
                      />
                    </InputRightElement>
                  )}
                </InputGroup>

                {/* Compact Date Range Inputs */}
                <HStack
                  spacing={1.5}
                  bg="var(--merchant-surface, #ffffff)"
                  px={2.5}
                  py={1}
                  borderRadius="10px"
                  border="1px solid"
                  borderColor="var(--merchant-border, #E2E8F0)"
                  align="center"
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
                      const val = e.target.value;
                      setStartDate(val);
                      setPage(1);
                      if (sellerShopId) {
                        fetchSellerBuyers(sellerShopId, 1, search, val, endDate);
                      }
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
                      const val = e.target.value;
                      setEndDate(val);
                      setPage(1);
                      if (sellerShopId) {
                        fetchSellerBuyers(sellerShopId, 1, search, startDate, val);
                      }
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
                        setPage(1);
                        if (sellerShopId) {
                          fetchSellerBuyers(sellerShopId, 1, search, "", "");
                        }
                      }}
                    />
                  )}
                </HStack>
              </HStack>

              {/* Right Side: Export Excel Button + Count Badge + Refresh */}
              <HStack spacing={2} justify="flex-end">
                <Button
                  size="sm"
                  h="36px"
                  px={3.5}
                  bg="var(--color-primary, #065F68)"
                  _hover={{
                    bg: "var(--color-primary-hover, #044249)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(6, 95, 104, 0.3)",
                  }}
                  _active={{ bg: "var(--color-primary-dark, #032b30)" }}
                  color="white"
                  borderRadius="10px"
                  fontSize="xs"
                  fontWeight={600}
                  leftIcon={<Icon as={FiDownload} boxSize={3.5} />}
                  isLoading={exporting}
                  loadingText="Exporting..."
                  boxShadow="0 2px 6px rgba(6, 95, 104, 0.2)"
                  transition="all 0.15s ease"
                  onClick={handleExportExcel}
                >
                  Export Excel
                </Button>

                <Badge
                  bg="var(--color-primary-soft, rgba(6, 95, 104, 0.1))"
                  color="var(--color-primary, #065F68)"
                  borderRadius="lg"
                  px={2.5}
                  h="36px"
                  display="inline-flex"
                  alignItems="center"
                  fontSize="xs"
                  fontWeight={700}
                >
                  {totalCount} {totalCount === 1 ? "Buyer" : "Buyers"}
                </Badge>

                <Tooltip label="Refresh buyer list" hasArrow>
                  <IconButton
                    aria-label="Refresh buyers"
                    icon={<Icon as={FiRefreshCw} boxSize={3.5} />}
                    size="sm"
                    h="36px"
                    w="36px"
                    variant="outline"
                    borderRadius="10px"
                    bg="var(--merchant-surface, #ffffff)"
                    borderColor="var(--merchant-border, #E2E8F0)"
                    _hover={{ bg: "var(--merchant-surface-alt, #f8fafc)", borderColor: "var(--color-primary, #065F68)" }}
                    isLoading={loading}
                    onClick={() => {
                      if (sellerShopId) {
                        fetchSellerBuyers(sellerShopId, page, search, startDate, endDate);
                      }
                    }}
                  />
                </Tooltip>
              </HStack>
            </Flex>
          </Box>

          {/* Table Container seamlessly styled like Shops page */}
          <Box
            w="100%"
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
                    borderRadius: "14px !important",
                    border: "1px solid var(--merchant-border, #E2E8F0) !important",
                  },
                },
              },
            }}
          >
            <CustomTable
              {...getMerchantTableProps("56vh")}
              tableProps={{
                ...getMerchantTableProps("56vh").tableProps,
                compact: true,
              }}
              columns={columns}
              data={buyers}
              loading={loading}
              actions={tableActions}
            />
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
export default SellerBuyersDrawer;
