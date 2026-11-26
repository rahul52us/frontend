"use client";

import React from "react";
import { DownloadIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Circle,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  Stack,
  Tab,
  TabList,
  Tabs,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiTrendingDown,
  FiTrendingUp,
  FiUserPlus,
  FiUsers,
  FiX,
} from "react-icons/fi";
import {
  MerchantBadge,
  MerchantPageHeader,
  merchantPrimaryButtonProps,
  MerchantStatCard,
} from "../../../common/merchantDashboardUI";
import { useCustomerTheme } from "./theme";
import {
  BuyerFilterKey,
  BuyerProfile,
} from "./types";
import {
  formatCompactCurrency,
  formatCurrency,
  getBuyerBalanceMeta,
  getBuyerDisplayName,
  getBuyerInitials,
  getBuyerPrimaryContact,
} from "./utils";

export interface CustomerListViewProps {
  buyers: BuyerProfile[];
  filteredBuyers: BuyerProfile[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  search: string;
  setSearch: (val: string) => void;
  activePartyType: "customer" | "supplier";
  setActivePartyType: (val: "customer" | "supplier") => void;
  balanceFilter: BuyerFilterKey;
  setBalanceFilter: (val: BuyerFilterKey) => void;
  buyerFilterOptions: { key: BuyerFilterKey; label: string }[];
  buyerOverview: { receivable: number; payable: number; active: number };
  isCompact: boolean;
  canUseDeviceContactImport: boolean;
  isShopApproved?: boolean;
  onOpenAddBuyer: () => void;
  onOpenImport: () => void;
  onSelectBuyer: (buyer: BuyerProfile) => void;
  onPageChange: (newPage: number) => void;
}

export const CustomerListView: React.FC<CustomerListViewProps> = ({
  filteredBuyers,
  total,
  page,
  totalPages,
  loading,
  search,
  setSearch,
  activePartyType,
  setActivePartyType,
  balanceFilter,
  setBalanceFilter,
  buyerFilterOptions,
  buyerOverview,
  isCompact,
  canUseDeviceContactImport,
  isShopApproved = true,
  onOpenAddBuyer,
  onOpenImport,
  onSelectBuyer,
  onPageChange,
}) => {
  const theme = useCustomerTheme();
  const {
    cAccentSoft,
    cAccentStrong,
    cTextMuted,
    cText,
    cSurface,
    cDanger,
    cSuccess,
  } = theme;

  const normalizedActivePartyType = activePartyType === "supplier" ? "supplier" : "customer";
  const isSupplierTab = normalizedActivePartyType === "supplier";
  const partySingularLabel = isSupplierTab ? "Supplier" : "Customer";
  const partyPluralLabel = isSupplierTab ? "Suppliers" : "Customers";
  const blockedCount = Math.max(total - buyerOverview.active, 0);

  const heroDescription = isSupplierTab
    ? "Manage supplier relationships, track payables, and keep every payout in one clean flow."
    : "Manage customer relationships, track collections, and keep every balance easy to review.";

  return (
    <Box w="100%">
      {/* ----------------- Standard Page Header matching Shops & Users ----------------- */}
      <MerchantPageHeader
        icon={FiUsers}
        title={partyPluralLabel}
        description={heroDescription}
        badges={
          <HStack spacing={2}>
            <MerchantBadge tone="accent">
              {total} {total === 1 ? partySingularLabel : partyPluralLabel}
            </MerchantBadge>
            {blockedCount > 0 ? (
              <MerchantBadge tone="danger">
                {blockedCount} Blocked
              </MerchantBadge>
            ) : null}
          </HStack>
        }
        actions={
          <HStack spacing={2.5}>
            {canUseDeviceContactImport ? (
              <Button
                onClick={onOpenImport}
                leftIcon={<DownloadIcon />}
                size="sm"
                h="38px"
                px={3.5}
                borderRadius="12px"
                variant="outline"
                borderColor="var(--merchant-border-strong)"
                color="var(--merchant-text)"
                _hover={{ bg: "var(--merchant-surface-alt)" }}
              >
                Import
              </Button>
            ) : null}
            <Button
              leftIcon={<FiUserPlus />}
              onClick={onOpenAddBuyer}
              size="sm"
              h="38px"
              px={4}
              {...merchantPrimaryButtonProps}
              opacity={!isShopApproved ? 0.65 : 1}
              title={!isShopApproved ? "Shop approval required to add customers" : undefined}
            >
              Add {partySingularLabel}
            </Button>
          </HStack>
        }
        mobileActions={
          <HStack spacing={2}>
            {canUseDeviceContactImport ? (
              <IconButton
                aria-label="Import contacts"
                icon={<DownloadIcon />}
                size="sm"
                variant="outline"
                borderRadius="10px"
                onClick={onOpenImport}
              />
            ) : null}
            <IconButton
              aria-label={`Add ${partySingularLabel}`}
              icon={<FiUserPlus />}
              size="sm"
              {...merchantPrimaryButtonProps}
              borderRadius="10px"
              opacity={!isShopApproved ? 0.65 : 1}
              title={!isShopApproved ? "Shop approval required to add customers" : undefined}
              onClick={onOpenAddBuyer}
            />
          </HStack>
        }
      />

      {/* ----------------- Top Stats Grid matching Shops / Users / Products ----------------- */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={{ base: 3, md: 4 }} mb={{ base: 4, md: 6 }}>
        <MerchantStatCard
          label={`Total ${partyPluralLabel}`}
          value={String(total)}
          icon={FiUsers}
          color="#3B82F6"
        />
        <MerchantStatCard
          label="To Receive"
          value={formatCompactCurrency(buyerOverview.receivable)}
          icon={FiTrendingUp}
          color="#10B981"
        />
        <MerchantStatCard
          label="To Pay"
          value={formatCompactCurrency(buyerOverview.payable)}
          icon={FiTrendingDown}
          color="#EF4444"
        />
      </SimpleGrid>

      {/* ----------------- Filter Tabs & Search Controls Row ----------------- */}
      <Flex
        justify="space-between"
        align="center"
        direction={{ base: "column", lg: "row" }}
        gap={3}
        mb={5}
        flexWrap="wrap"
      >
        {/* Left: Party Type Switcher Tabs (Customers vs Suppliers) + Balance Filters */}
        <HStack spacing={3} flexWrap="wrap">
          <Tabs
            variant="unstyled"
            index={normalizedActivePartyType === "customer" ? 0 : 1}
            onChange={(index) => setActivePartyType(index === 0 ? "customer" : "supplier")}
          >
            <TabList
              bg="var(--merchant-surface-alt)"
              border="1px solid"
              borderColor="var(--merchant-border-strong)"
              borderRadius="14px"
              p={1}
              display="inline-flex"
              alignItems="center"
            >
              {[
                { label: "Customers", value: "customer" },
                { label: "Suppliers", value: "supplier" },
              ].map((tab, idx) => {
                const isSelected = (normalizedActivePartyType === "customer" ? 0 : 1) === idx;
                return (
                  <Tab
                    key={tab.value}
                    px={3.5}
                    py={1.5}
                    borderRadius="10px"
                    fontSize="xs"
                    fontWeight="700"
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
                    {tab.label}
                  </Tab>
                );
              })}
            </TabList>
          </Tabs>

          {/* Balance Filter Chips */}
          <HStack spacing={1.5} overflowX="auto" py={0.5}>
            {buyerFilterOptions.map((filterOption) => {
              const isActive = balanceFilter === filterOption.key;
              return (
                <Button
                  key={filterOption.key}
                  size="sm"
                  h="36px"
                  px={3}
                  borderRadius="10px"
                  flexShrink={0}
                  bg={isActive ? "var(--color-primary, #065F68)" : "transparent"}
                  color={isActive ? "white" : "var(--merchant-text-muted)"}
                  border="1px solid"
                  borderColor={isActive ? "var(--color-primary, #065F68)" : "var(--merchant-border-strong)"}
                  fontSize="xs"
                  fontWeight="600"
                  _hover={{
                    bg: isActive ? "var(--color-primary-hover, #044249)" : "var(--merchant-surface-alt)",
                    color: isActive ? "white" : "var(--merchant-text)",
                  }}
                  _active={{ transform: "scale(0.98)" }}
                  onClick={() => setBalanceFilter(filterOption.key)}
                >
                  {filterOption.label}
                </Button>
              );
            })}
          </HStack>
        </HStack>

        {/* Right: Search Input matching Shops / Products / Users */}
        <InputGroup size="sm" maxW={{ base: "100%", lg: "340px" }} w="100%">
          <InputLeftElement pointerEvents="none" h="38px">
            <Icon as={FiSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder={`Search ${partyPluralLabel.toLowerCase()} by name or phone...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            h="38px"
            pl={9}
            borderRadius="12px"
            fontSize="xs"
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
                icon={<FiX />}
                size="xs"
                variant="ghost"
                onClick={() => setSearch("")}
              />
            </InputRightElement>
          )}
        </InputGroup>
      </Flex>

      {/* ----------------- Cards Grid Area ----------------- */}
      <Box pb={isCompact ? "104px" : 8}>
        {loading ? (
          <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={3.5}>
            {Array.from({ length: isCompact ? 4 : 6 }).map((_, index) => (
              <Box
                key={`buyer-skeleton-${index}`}
                bg="var(--merchant-surface-alt)"
                border="1px solid"
                borderColor="var(--merchant-border-strong)"
                borderRadius="20px"
                p={4}
              >
                <HStack align="start" spacing={3}>
                  <SkeletonCircle size="12" />
                  <Box flex="1">
                    <Skeleton h="16px" w="48%" />
                    <Skeleton h="12px" w="72%" mt={2} />
                    <HStack spacing={2} mt={3}>
                      <Skeleton h="20px" w="58px" borderRadius="full" />
                      <Skeleton h="20px" w="52px" borderRadius="full" />
                    </HStack>
                  </Box>
                  <Box minW="88px">
                    <Skeleton h="18px" w="74px" ml="auto" />
                    <Skeleton h="10px" w="54px" mt={2} ml="auto" />
                  </Box>
                </HStack>
              </Box>
            ))}
          </SimpleGrid>
        ) : filteredBuyers.length === 0 ? (
          <Box
            textAlign="center"
            py={{ base: 12, md: 16 }}
            px={5}
            bg="var(--merchant-surface-alt)"
            border="1px dashed"
            borderColor="var(--merchant-border-strong)"
            borderRadius="20px"
          >
            <Circle mx="auto" size="14" bg={cAccentSoft} color={cAccentStrong}>
              <Icon as={FiUsers} boxSize={6} />
            </Circle>
            <Text mt={4} fontSize="md" fontWeight="800" color="var(--merchant-text)">
              No {partyPluralLabel.toLowerCase()} found
            </Text>
            <Text mt={1} fontSize="sm" color="var(--merchant-text-muted)" maxW="md" mx="auto">
              {balanceFilter === "all"
                ? `Try a different search or add a new ${partySingularLabel.toLowerCase()}.`
                : `No ${partyPluralLabel.toLowerCase()} match the selected filter.`}
            </Text>
            <Button
              mt={4}
              size="sm"
              leftIcon={<FiUserPlus />}
              {...merchantPrimaryButtonProps}
              onClick={onOpenAddBuyer}
            >
              Add {partySingularLabel}
            </Button>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={3.5}>
            {filteredBuyers.map((buyer) => {
              const balanceMeta = getBuyerBalanceMeta(buyer, normalizedActivePartyType, {
                textMuted: cTextMuted,
                success: cSuccess,
                danger: cDanger,
              });
              const tagList = buyer.tags?.length
                ? buyer.tags.slice(0, 2)
                : [buyer.source ? buyer.source.charAt(0).toUpperCase() + buyer.source.slice(1) : "Manual"];

              return (
                <Box
                  key={buyer._id}
                  as="button"
                  type="button"
                  w="full"
                  textAlign="left"
                  bg="var(--merchant-surface)"
                  border="1px solid"
                  borderColor="var(--merchant-border)"
                  borderRadius="20px"
                  px={{ base: 3.5, md: 4.5 }}
                  py={{ base: 3.5, md: 4 }}
                  boxShadow="sm"
                  transition="all 0.2s ease"
                  _hover={{
                    transform: "translateY(-2px)",
                    borderColor: "var(--color-primary, #065F68)",
                    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.08)",
                  }}
                  _active={{ transform: "scale(0.99)" }}
                  onClick={() => onSelectBuyer(buyer)}
                >
                  <Flex align="center" gap={3}>
                    <Box position="relative">
                      <Flex
                        h={{ base: "38px", md: "46px" }}
                        w={{ base: "38px", md: "46px" }}
                        borderRadius="full"
                        align="center"
                        justify="center"
                        color="white"
                        fontWeight="700"
                        fontSize={{ base: "sm", md: "md" }}
                        bg="var(--color-primary, #065F68)"
                        boxShadow="0 4px 12px rgba(6, 95, 104, 0.25)"
                        flexShrink={0}
                      >
                        {getBuyerInitials(buyer)}
                      </Flex>
                      {buyer.isBlocked ? (
                        <Circle
                          position="absolute"
                          bottom="-1px"
                          right="-1px"
                          size="18px"
                          bg={cDanger}
                          color="white"
                          border="2px solid"
                          borderColor={cSurface}
                          fontSize="10px"
                          fontWeight="900"
                        >
                          !
                        </Circle>
                      ) : null}
                    </Box>

                    <Box flex="1" minW={0}>
                      <Text fontSize={{ base: "sm", md: "md" }} fontWeight="700" color="var(--merchant-text)" noOfLines={1}>
                        {getBuyerDisplayName(buyer)}
                      </Text>
                      <Text mt={0.5} fontSize="xs" color="var(--merchant-text-muted)" noOfLines={1}>
                        {getBuyerPrimaryContact(buyer)}
                      </Text>
                      <Flex mt={1.5} gap={1.5} flexWrap="wrap">
                        {tagList.map((tag) => (
                          <Badge
                            key={`${buyer._id}-${tag}`}
                            px={2}
                            py={0.5}
                            borderRadius="full"
                            bg="var(--merchant-surface-alt)"
                            border="1px solid"
                            borderColor="var(--merchant-border-strong)"
                            color="var(--merchant-text-muted)"
                            textTransform="none"
                            fontSize="10px"
                            fontWeight="600"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </Flex>
                    </Box>

                    <VStack align="end" spacing={0.5} flexShrink={0}>
                      <Text fontSize="sm" fontWeight="800" color={balanceMeta.color} textAlign="right">
                        {balanceMeta.state === "settled" ? "Settled" : formatCurrency(balanceMeta.amount)}
                      </Text>
                      <Text fontSize="10px" color="var(--merchant-text-muted)">
                        {balanceMeta.helper}
                      </Text>
                      <Icon as={FiChevronRight} boxSize={4} color="var(--merchant-text-muted)" mt={1} />
                    </VStack>
                  </Flex>
                </Box>
              );
            })}
          </SimpleGrid>
        )}

        {(totalPages || 1) > 1 ? (
          <Flex justify="space-between" align="center" gap={3} mt={5}>
            <Button
              minW="96px"
              h="36px"
              borderRadius="12px"
              bg="var(--merchant-surface)"
              border="1px solid"
              borderColor="var(--merchant-border-strong)"
              color="var(--merchant-text)"
              fontSize="xs"
              fontWeight="600"
              leftIcon={<Icon as={FiChevronLeft} />}
              _hover={{ bg: "var(--merchant-surface-alt)" }}
              _active={{ transform: "scale(0.98)" }}
              isDisabled={page <= 1 || loading}
              onClick={() => {
                if (page <= 1) return;
                onPageChange(page - 1);
              }}
            >
              Previous
            </Button>
            <Text fontSize="xs" color="var(--merchant-text-muted)">
              Page {page} of {totalPages}
            </Text>
            <Button
              minW="96px"
              h="36px"
              borderRadius="12px"
              bg="var(--merchant-surface)"
              border="1px solid"
              borderColor="var(--merchant-border-strong)"
              color="var(--merchant-text)"
              fontSize="xs"
              fontWeight="600"
              rightIcon={<Icon as={FiChevronRight} />}
              _hover={{ bg: "var(--merchant-surface-alt)" }}
              _active={{ transform: "scale(0.98)" }}
              isDisabled={page >= totalPages || loading}
              onClick={() => {
                if (page >= totalPages) return;
                onPageChange(page + 1);
              }}
            >
              Next
            </Button>
          </Flex>
        ) : null}
      </Box>

      {isCompact ? (
        <Button
          position="fixed"
          right="16px"
          bottom="calc(76px + env(safe-area-inset-bottom, 0px))"
          zIndex={110}
          h="44px"
          px={4}
          borderRadius="full"
          bg="var(--color-primary, #065F68)"
          color="white"
          leftIcon={<Icon as={FiUserPlus} boxSize={4} />}
          fontWeight="700"
          fontSize="sm"
          boxShadow="0 8px 24px rgba(6, 95, 104, 0.35)"
          _hover={{ bg: "var(--color-primary-hover, #044249)" }}
          _active={{ transform: "scale(0.97)" }}
          onClick={onOpenAddBuyer}
        >
          Add {partySingularLabel}
        </Button>
      ) : null}
    </Box>
  );
};

export default CustomerListView;