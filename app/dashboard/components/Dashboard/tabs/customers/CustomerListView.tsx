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
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  FiChevronRight,
  FiSearch,
  FiTrendingDown,
  FiTrendingUp,
  FiUserPlus,
  FiUsers,
} from "react-icons/fi";
import { ProductStatCard } from "../../../../products/components/ProductStatCard";
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
  onOpenAddBuyer,
  onOpenImport,
  onSelectBuyer,
  onPageChange,
}) => {
  const theme = useCustomerTheme();
  const {
    cAccentSoft,
    cAccentStrong,
    cAccent,
    cTextMuted,
    cText,
    cSurface,
    cBorder,
    cPage,
    cDanger,
    cSuccess,
    cHeroGradient,
    cGlassSurface,
    cSoftShadow,
    cInputMutedBg,
    cPlaceholder,
    cSuccessSoftBg,
    cDangerSoftBg,
    dashboardPalette,
  } = theme;

  const normalizedActivePartyType = activePartyType === "supplier" ? "supplier" : "customer";
  const isSupplierTab = normalizedActivePartyType === "supplier";
  const partySingularLabel = isSupplierTab ? "Supplier" : "Customer";
  const partyPluralLabel = isSupplierTab ? "Suppliers" : "Customers";
  const blockedCount = Math.max(total - buyerOverview.active, 0);

  const sectionX = { base: 3, md: 6, xl: 0 };
  const heroDescription = isSupplierTab
    ? "Manage supplier relationships, track payables, and keep every payout in one clean flow."
    : "Manage customer relationships, track collections, and keep every balance easy to review.";

  const statCards = [
    {
      key: "total",
      icon: FiUsers,
      label: `Total ${partyPluralLabel}`,
      value: String(total),
      iconBg: cAccentSoft,
      iconColor: cAccentStrong,
      valueColor: cText,
    },
    {
      key: "receivable",
      icon: FiTrendingUp,
      label: "To receive",
      value: formatCompactCurrency(buyerOverview.receivable),
      iconBg: cSuccessSoftBg,
      iconColor: cSuccess,
      valueColor: cSuccess,
    },
    {
      key: "payable",
      icon: FiTrendingDown,
      label: "To pay",
      value: formatCompactCurrency(buyerOverview.payable),
      iconBg: cDangerSoftBg,
      iconColor: cDanger,
      valueColor: cDanger,
    },
  ];

  return (
    <Box
      bg={isCompact ? cPage : "transparent"}
      overflow="hidden"
      mt={{ base: -2, md: 0 }}
      mx={isCompact ? -2 : 0}
      minH={isCompact ? "100dvh" : "auto"}
    >
      <Box
        bgGradient={cHeroGradient}
        px={sectionX}
        pt={{ base: 2, md: 0 }}
        pb={{ base: 14, md: 16 }}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="-36px"
          right="-28px"
          w={{ base: "164px", md: "220px" }}
          h={{ base: "164px", md: "220px" }}
          borderRadius="full"
          bg="whiteAlpha.180"
          filter="blur(18px)"
        />
        <Box
          position="absolute"
          bottom="-74px"
          left="-24px"
          w={{ base: "140px", md: "180px" }}
          h={{ base: "140px", md: "180px" }}
          borderRadius="full"
          bg="whiteAlpha.120"
        />

        <Box position="relative" zIndex={1}>
          <Flex justify="space-between" align={{ base: "start", md: "center" }} gap={4} flexWrap="wrap">
            <Box maxW="2xl">
              <Text fontSize="xs" fontWeight="800" textTransform="uppercase" letterSpacing="0.14em">
                Workspace
              </Text>
              <Heading mt={2} fontSize={{ base: "2xl", md: "4xl" }} lineHeight="0.98" letterSpacing="-0.03em" display={{ base: "none", md: "block" }}>
                {partyPluralLabel}
              </Heading>
              <Text mt={2} color="whiteAlpha.860" fontSize={{ base: "sm", md: "md" }} maxW="xl" display={{ base: "none", md: "block" }}>
                {heroDescription}
              </Text>

              <Flex mt={{ base: 2, md: 4 }} gap={2} flexWrap="wrap" align="center">
                <HStack
                  spacing={1}
                  borderRadius="18px"
                  bg="whiteAlpha.180"
                  borderColor="whiteAlpha.280"
                >
                  <Button
                    h={{ base: "32px", md: "38px" }}
                    px={4}
                    borderRadius="14px"
                    bg={normalizedActivePartyType === "customer" ? dashboardPalette.accent : "transparent"}
                    color={normalizedActivePartyType === "customer" ? "white" : "blackAlpha.700"}
                    fontSize="sm"
                    fontWeight="800"
                    _hover={{ bg: normalizedActivePartyType === "customer" ? dashboardPalette.accent : "whiteAlpha.180" }}
                    _active={{ transform: "scale(0.98)" }}
                    onClick={() => setActivePartyType("customer")}
                  >
                    Customers
                  </Button>
                  <Button
                    h={{ base: "32px", md: "38px" }}
                    px={4}
                    borderRadius="14px"
                    bg={normalizedActivePartyType === "supplier" ? dashboardPalette.accent : "transparent"}
                    color={normalizedActivePartyType === "supplier" ? "white" : "blackAlpha.900"}
                    fontSize="sm"
                    fontWeight="800"
                    _hover={{ bg: normalizedActivePartyType === "supplier" ? dashboardPalette.accent : "whiteAlpha.180" }}
                    _active={{ transform: "scale(0.98)" }}
                    onClick={() => setActivePartyType("supplier")}
                  >
                    Suppliers
                  </Button>
                </HStack>

                {blockedCount > 0 ? (
                  <Badge px={3} py={1.5} borderRadius="full" bg="rgba(127, 29, 29, 0.26)" color="white" textTransform="none" fontWeight="800">
                    {blockedCount} blocked
                  </Badge>
                ) : null}
              </Flex>
            </Box>

            {!isCompact ? (
              <Stack direction={{ base: "column", sm: "row" }} spacing={3} w={{ base: "full", md: "auto" }}>
                {canUseDeviceContactImport ? (
                  <Button
                    onClick={onOpenImport}
                    leftIcon={<DownloadIcon />}
                    minH="46px"
                    borderRadius="full"
                    bg="whiteAlpha.180"
                    color="white"
                    border="1px solid"
                    borderColor="whiteAlpha.280"
                    _hover={{ bg: "whiteAlpha.240" }}
                    _active={{ transform: "scale(0.98)" }}
                  >
                    Import
                  </Button>
                ) : null}
                <Button
                  leftIcon={<FiUserPlus />}
                  onClick={onOpenAddBuyer}
                  minH="46px"
                  px={5}
                  borderRadius="full"
                  bg="white"
                  color={cAccentStrong}
                  fontWeight="800"
                  boxShadow="0 16px 34px rgba(15, 23, 42, 0.14)"
                  _hover={{ transform: "translateY(-1px)" }}
                  _active={{ transform: "scale(0.98)" }}
                >
                  Add {partySingularLabel}
                </Button>
              </Stack>
            ) : null}
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 2, md: 4 }} mt={6}>
            {statCards.map((stat) => (
              <ProductStatCard
                key={stat.key}
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
                tint="sage"
              />
            ))}
          </SimpleGrid>
        </Box>
      </Box>

      <Box px={sectionX} mt={{ base: -6, md: -7 }} position="sticky" top={0} zIndex={20}>
        <Box
          bg={cGlassSurface}
          border="1px solid"
          borderColor={cBorder}
          borderRadius="24px"
          p={{ base: 2, md: 3 }}
          boxShadow={cSoftShadow}
          backdropFilter="blur(18px)"
        >
          <InputGroup>
            <InputLeftElement pointerEvents="none" h="100%">
              <Icon as={FiSearch} color={cTextMuted} boxSize={4} />
            </InputLeftElement>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${partyPluralLabel.toLowerCase()} by name or phone`}
              pl={10}
              h={{ base: "38px", md: "46px" }}
              borderRadius="18px"
              bg={cInputMutedBg}
              borderColor="transparent"
              color={cText}
              fontSize="sm"
              _placeholder={{ color: cPlaceholder }}
              _focus={{ borderColor: cAccent, boxShadow: `0 0 0 1px ${cAccent}` }}
            />
          </InputGroup>

          <Flex
            mt={2}
            gap={2}
            overflowX="auto"
            pb={0.5}
            sx={{
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {buyerFilterOptions.map((filterOption) => {
              const isActive = balanceFilter === filterOption.key;
              return (
                <Button
                  key={filterOption.key}
                  h="34px"
                  px={4}
                  borderRadius="full"
                  flexShrink={0}
                  bg={isActive ? dashboardPalette.accent : "transparent"}
                  color={isActive ? "white" : cTextMuted}
                  fontSize="xs"
                  fontWeight="800"
                  border={isActive ? "none" : "1px solid"}
                  borderColor={isActive ? "transparent" : cBorder}
                  boxShadow={isActive ? "0 12px 24px rgba(69, 104, 255, 0.20)" : "none"}
                  _hover={{ color: isActive ? "white" : cText }}
                  _active={{ transform: "scale(0.98)" }}
                  onClick={() => setBalanceFilter(filterOption.key)}
                >
                  {filterOption.label}
                </Button>
              );
            })}
          </Flex>
        </Box>
      </Box>

      <Box px={sectionX} mt={4} pb={isCompact ? "104px" : 8}>
        {loading ? (
          <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={3}>
            {Array.from({ length: isCompact ? 4 : 6 }).map((_, index) => (
              <Box
                key={`buyer-skeleton-${index}`}
                bg={cSurface}
                border="1px solid"
                borderColor={cBorder}
                borderRadius="24px"
                p={4}
                boxShadow={cSoftShadow}
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
            bg={cSurface}
            border="1px solid"
            borderColor={cBorder}
            borderRadius="26px"
            boxShadow={cSoftShadow}
          >
            <Circle mx="auto" size="14" bg={cAccentSoft} color={cAccentStrong}>
              <Icon as={FiUsers} boxSize={6} />
            </Circle>
            <Text mt={4} fontSize="md" fontWeight="800" color={cText}>
              No {partyPluralLabel.toLowerCase()} found
            </Text>
            <Text mt={1} fontSize="sm" color={cTextMuted}>
              {balanceFilter === "all"
                ? `Try a different search or add a new ${partySingularLabel.toLowerCase()}.`
                : `No ${partyPluralLabel.toLowerCase()} match the selected filter.`}
            </Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, xl: 3 }} spacing={{ base: 1, md: 3 }}>
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
                  bg={cSurface}
                  border="1px solid"
                  borderColor={cBorder}
                  borderRadius="24px"
                  px={{ base: 3, md: 4 }}
                  py={{ base: 2, md: 4 }}
                  boxShadow="sm"
                  transition="all 0.2s ease"
                  _hover={{ transform: "translateY(-2px)", borderColor: cAccentSoft }}
                  _active={{ transform: "scale(0.99)" }}
                  onClick={() => onSelectBuyer(buyer)}
                >
                  <Flex align="center" gap={3}>
                    <Box position="relative">
                      <Flex
                        h={{ base: "32px", md: "48px" }}
                        w={{ base: "32px", md: "48px" }}
                        borderRadius="full"
                        align="center"
                        justify="center"
                        color="white"
                        fontWeight="700"
                        fontSize={{ base: "sm", md: "lg" }}
                        bg={dashboardPalette.accent}
                        boxShadow="0 10px 24px rgba(69, 104, 255, 0.18)"
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
                      <Text fontSize={{ base: "sm", md: "md" }} fontWeight="800" color={cText} noOfLines={1}>
                        {getBuyerDisplayName(buyer)}
                      </Text>
                      <Text mt={0.5} fontSize="xs" color={cTextMuted} noOfLines={1}>
                        {getBuyerPrimaryContact(buyer)}
                      </Text>
                      <Flex mt={1} gap={1.5} flexWrap="wrap">
                        {tagList.map((tag) => (
                          <Badge
                            key={`${buyer._id}-${tag}`}
                            px={2.5}
                            py={0.5}
                            borderRadius="full"
                            bg={cAccentSoft}
                            color={cAccentStrong}
                            textTransform="none"
                            fontSize="10px"
                            fontWeight="700"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </Flex>
                    </Box>

                    <VStack align="end" spacing={1} flexShrink={0}>
                      <Text fontSize="sm" fontWeight="700" color={balanceMeta.color} textAlign="right">
                        {balanceMeta.state === "settled" ? "Settled" : formatCurrency(balanceMeta.amount)}
                      </Text>
                      <Text fontSize="10px" color={cTextMuted}>
                        {balanceMeta.helper}
                      </Text>
                      <Icon as={FiChevronRight} boxSize={4} color={cTextMuted} />
                    </VStack>
                  </Flex>
                </Box>
              );
            })}
          </SimpleGrid>
        )}

        {(totalPages || 1) > 1 ? (
          <Flex justify="space-between" align="center" gap={3} mt={4}>
            <Button
              minW="96px"
              h="38px"
              borderRadius="full"
              bg={cSurface}
              border="1px solid"
              borderColor={cBorder}
              color={cTextMuted}
              boxShadow={cSoftShadow}
              _hover={{ color: cText }}
              _active={{ transform: "scale(0.98)" }}
              isDisabled={page <= 1 || loading}
              onClick={() => {
                if (page <= 1) return;
                onPageChange(page - 1);
              }}
            >
              Previous
            </Button>
            <Text fontSize="sm" color={cTextMuted} fontWeight="700">
              Page {page} of {totalPages || 1}
            </Text>
            <Button
              minW="96px"
              h="38px"
              borderRadius="full"
              bg={cSurface}
              border="1px solid"
              borderColor={cBorder}
              color={cTextMuted}
              boxShadow={cSoftShadow}
              _hover={{ color: cText }}
              _active={{ transform: "scale(0.98)" }}
              isDisabled={page >= (totalPages || 1) || loading}
              onClick={() => {
                if (page >= (totalPages || 1)) return;
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
          right="18px"
          bottom="calc(76px + env(safe-area-inset-bottom, 0px))"
          zIndex={110}
          h="56px"
          px={5}
          borderRadius="full"
          bgGradient={cHeroGradient}
          color="white"
          leftIcon={<Icon as={FiUserPlus} boxSize={4.5} />}
          fontWeight="800"
          boxShadow="0 18px 34px rgba(69, 104, 255, 0.28)"
          _hover={{ filter: "brightness(1.05)" }}
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
