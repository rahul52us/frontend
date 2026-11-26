"use client";

import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Circle,
  Divider,
  Flex,
  HStack,
  Icon,
  IconButton,
  SimpleGrid,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  FiCheckCircle,
  FiClock,
  FiEdit3,
  FiGift,
  FiPlusCircle,
  FiStar,
  FiTag,
  FiTrash2,
} from "react-icons/fi";
import { observer } from "mobx-react-lite";
import stores from "../../../store/stores";
import CustomTable from "../../../component/config/component/CustomTable/CustomTable";
import ConfirmationModal from "../../../component/common/ConfirmationModal/ConfirmationModal";
import OfferForm from "./components/OfferForm";
import { dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";
import {
  getMerchantTableProps,
  MerchantBadge,
  merchantGhostButtonProps,
  MerchantPageHeader,
  MerchantPageShell,
  MerchantStatCard,
} from "../../components/common/merchantDashboardUI";

const OffersPage = () => {
  const { offerStore } = stores;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [offerToDelete, setOfferToDelete] = useState<any>(null);
  const toast = useToast();

  const surfaceBg = useColorModeValue("white", dashboardPalette.surface);
  const shellBg = useColorModeValue("#F8FAFC", dashboardPalette.surfaceAlt);
  const borderCol = useColorModeValue("#E2E8F0", dashboardPalette.border);
  const textCol = useColorModeValue("#0F172A", dashboardPalette.text);
  const textMuted = useColorModeValue("#64748B", dashboardPalette.textMuted);

  useEffect(() => {
    offerStore.getAllOffers();
  }, [offerStore]);

  const handleAddClick = () => {
    setSelectedOffer(null);
    onOpen();
  };

  const handleEditClick = (offer: any) => {
    setSelectedOffer(offer);
    onOpen();
  };

  const handleDeleteClick = (offer: any) => {
    setOfferToDelete(offer);
    onDeleteOpen();
  };

  const handleConfirmDelete = async () => {
    if (!offerToDelete) return;
    const res = await offerStore.deleteOffer(
      offerToDelete._id || offerToDelete.offerId
    );
    if (res.status === "success") {
      toast({
        title: "Success",
        description: "Offer deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onDeleteClose();
      offerStore.getAllOffers({}, true);
    } else {
      toast({
        title: "Error",
        description: res.message || "Failed to delete offer",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const columns = [
    {
      headerName: "Offer ID",
      key: "offerId",
      type: "text",
    },
    {
      headerName: "Name",
      key: "name",
      type: "text",
    },
    {
      headerName: "Type",
      key: "type",
      type: "component",
      metaData: {
        component: (data: any) => (
          <MerchantBadge tone="accent" textTransform="capitalize">
            {data.type}
          </MerchantBadge>
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
      headerName: "Default",
      key: "isDefault",
      type: "component",
      metaData: {
        component: (data: any) => (
          <MerchantBadge tone={data.isDefault ? "accent" : "soft"}>
            {data.isDefault ? "Yes" : "No"}
          </MerchantBadge>
        ),
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
        function: handleDeleteClick,
      },
    },
    pagination: {
      show: true,
      currentPage: 1,
      totalPages: 1,
      onClick: () => {},
    },
  };

  const totalOffers = offerStore.offers.length;
  const activeOffers = offerStore.offers.filter(
    (offer: any) => offer.isActive
  ).length;
  const defaultOffers = offerStore.offers.filter(
    (offer: any) => offer.isDefault
  ).length;
  const inactiveOffers = totalOffers - activeOffers;

  return (
    <MerchantPageShell>
      {/* Page Header */}
      <MerchantPageHeader
        icon={FiGift}
        title="Offer Management"
        description="Control promotional incentives, manage default discounts, and audit marketplace campaign visibility."
        badges={
          <HStack spacing={2}>
            <MerchantBadge tone={activeOffers > 0 ? "success" : "soft"}>
              {activeOffers} Active
            </MerchantBadge>
            <MerchantBadge tone={defaultOffers > 0 ? "accent" : "soft"}>
              {defaultOffers} Default
            </MerchantBadge>
          </HStack>
        }
        actions={
          <Button
            leftIcon={<FiPlusCircle />}
            onClick={handleAddClick}
            bg="var(--color-primary, #065F68)"
            _hover={{
              bg: "var(--color-primary-hover, #044249)",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(6, 95, 104, 0.3)",
            }}
            _active={{ bg: "var(--color-primary-dark, #032b30)" }}
            color="white"
            borderRadius="12px"
            fontSize="sm"
            fontWeight={600}
            h="40px"
            px={4}
            boxShadow="0 2px 6px rgba(6, 95, 104, 0.2)"
            transition="all 0.15s ease"
          >
            Add Offer
          </Button>
        }
        mobileActions={
          <Button
            size="sm"
            bg="var(--color-primary, #065F68)"
            _hover={{ bg: "var(--color-primary-hover, #044249)" }}
            color="white"
            borderRadius="full"
            leftIcon={<FiPlusCircle />}
            onClick={handleAddClick}
          >
            New Offer
          </Button>
        }
      />

      {/* Top Stats Grid */}
      <SimpleGrid
        columns={{ base: 2, lg: 4 }}
        spacing={{ base: 3, md: 4 }}
        mb={{ base: 4, md: 6 }}
      >
        <MerchantStatCard
          label="Total Offers"
          value={totalOffers}
          icon={FiGift}
          variant="panel"
          iconColor={dashboardPalette.accentStrong}
          iconBg="rgba(59, 130, 246, 0.12)"
        />
        <MerchantStatCard
          label="Active Offers"
          value={activeOffers}
          icon={FiCheckCircle}
          variant="panel"
          iconColor={dashboardPalette.success}
          iconBg="rgba(70, 201, 139, 0.14)"
          valueColor={dashboardPalette.success}
        />
        <MerchantStatCard
          label="Default Active"
          value={defaultOffers}
          icon={FiStar}
          variant="panel"
          iconColor={dashboardPalette.accent}
          iconBg="rgba(6, 95, 104, 0.14)"
        />
        <MerchantStatCard
          label="Inactive / Paused"
          value={inactiveOffers}
          icon={FiClock}
          variant="panel"
          iconColor={dashboardPalette.textMuted}
          iconBg="rgba(148, 163, 184, 0.14)"
        />
      </SimpleGrid>

      {/* Filter and Count Summary Bar matching Shops & Users */}
      <Flex
        justify="space-between"
        align="center"
        mb={4}
        flexWrap="wrap"
        gap={3}
      >
        <HStack spacing={2} align="center">
          <Badge
            bg="var(--color-primary, #065F68)"
            color="white"
            borderRadius="10px"
            px={3.5}
            py={1.5}
            fontSize="xs"
            fontWeight="700"
            boxShadow="0 2px 8px rgba(0, 0, 0, 0.25)"
          >
            All Offers ({totalOffers})
          </Badge>
        </HStack>

        <HStack spacing={2} flexWrap="wrap">
          <MerchantBadge tone={totalOffers > 0 ? "soft" : "soft"}>
            {totalOffers} In View
          </MerchantBadge>
          <Text fontSize="xs" color="var(--merchant-text-muted)" fontWeight="600">
            {totalOffers} total offers recorded
          </Text>
        </HStack>
      </Flex>

      {/* Desktop View: Custom Table with clean outer container matching Shops and Users */}
      <Box
        display={{ base: "none", md: "block" }}
        dir="ltr"
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
                borderRadius: "16px !important",
              },
            },
          },
        }}
      >
        <CustomTable
          data={offerStore.offers}
          columns={columns}
          loading={offerStore.loading}
          actions={tableActions}
          {...getMerchantTableProps("62vh")}
        />
      </Box>

      {/* Mobile View: High-Quality Activity Cards */}
      <Box display={{ base: "block", md: "none" }}>
        {offerStore.loading ? (
          <VStack spacing={3} align="stretch">
            {Array.from({ length: 4 }).map((_, i) => (
              <Box
                key={i}
                p={4}
                borderRadius="18px"
                border="1px solid"
                borderColor={borderCol}
                bg={surfaceBg}
              >
                <HStack spacing={3} mb={3}>
                  <Circle size="40px" bg={shellBg} />
                  <Box flex="1">
                    <Box h="14px" bg={shellBg} w="60%" borderRadius="md" mb={2} />
                    <Box h="10px" bg={shellBg} w="35%" borderRadius="md" />
                  </Box>
                </HStack>
                <HStack spacing={2}>
                  <Box h="22px" bg={shellBg} w="60px" borderRadius="full" />
                  <Box h="22px" bg={shellBg} w="60px" borderRadius="full" />
                </HStack>
              </Box>
            ))}
          </VStack>
        ) : offerStore.offers.length > 0 ? (
          <VStack spacing={3} align="stretch">
            {offerStore.offers.map((offer: any) => (
              <Box
                key={offer._id || offer.offerId}
                p={4}
                borderRadius="18px"
                border="1px solid"
                borderColor={borderCol}
                bg={surfaceBg}
                boxShadow="0 2px 8px rgba(15, 23, 42, 0.04)"
                transition="all 0.2s ease"
                _hover={{ borderColor: dashboardPalette.accent }}
              >
                <Flex justify="space-between" align="start" gap={2} mb={2.5}>
                  <HStack spacing={3} align="center" minW={0}>
                    <Circle
                      size="38px"
                      bg={offer.isActive ? "rgba(70, 201, 139, 0.12)" : shellBg}
                      flexShrink={0}
                    >
                      <Icon
                        as={FiGift}
                        boxSize={4}
                        color={offer.isActive ? "green.500" : textMuted}
                      />
                    </Circle>
                    <Box minW={0}>
                      <Text
                        fontSize="sm"
                        fontWeight="700"
                        color={textCol}
                        noOfLines={1}
                      >
                        {offer.name}
                      </Text>
                      <Text fontSize="xs" color={textMuted} fontWeight="600">
                        ID: {offer.offerId || "N/A"}
                      </Text>
                    </Box>
                  </HStack>

                  <HStack spacing={1}>
                    <IconButton
                      size="sm"
                      variant="ghost"
                      color="var(--color-primary, #065F68)"
                      _hover={{
                        bg: "var(--color-primary, #065F68)",
                        color: "white",
                      }}
                      borderRadius="full"
                      icon={<FiEdit3 />}
                      aria-label="Edit offer"
                      onClick={() => handleEditClick(offer)}
                    />
                    <IconButton
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      borderRadius="full"
                      icon={<FiTrash2 />}
                      aria-label="Delete offer"
                      onClick={() => handleDeleteClick(offer)}
                    />
                  </HStack>
                </Flex>

                {offer.description && (
                  <Text fontSize="xs" color={textMuted} mb={3} noOfLines={2}>
                    {offer.description}
                  </Text>
                )}

                <Divider my={2.5} borderColor={borderCol} />

                <Flex justify="space-between" align="center" flexWrap="wrap" gap={1.5}>
                  <HStack spacing={1.5} flexWrap="wrap">
                    <MerchantBadge tone="accent" textTransform="capitalize">
                      {offer.type || "standard"}
                    </MerchantBadge>
                    {offer.isDefault && (
                      <MerchantBadge tone="accent">
                        ★ Default
                      </MerchantBadge>
                    )}
                  </HStack>

                  <MerchantBadge tone={offer.isActive ? "success" : "danger"}>
                    {offer.isActive ? "Active" : "Inactive"}
                  </MerchantBadge>
                </Flex>
              </Box>
            ))}
          </VStack>
        ) : (
          <Box
            py={10}
            textAlign="center"
            bg={shellBg}
            borderRadius="16px"
            border="1px dashed"
            borderColor={borderCol}
          >
            <Icon as={FiGift} boxSize={7} color={textMuted} mb={2} />
            <Text fontSize="sm" fontWeight="700" color={textCol}>
              No offers registered
            </Text>
            <Button
              size="sm"
              bg="var(--color-primary, #065F68)"
              _hover={{ bg: "var(--color-primary-hover, #044249)" }}
              color="white"
              borderRadius="full"
              mt={3}
              leftIcon={<FiPlusCircle />}
              onClick={handleAddClick}
            >
              Create First Offer
            </Button>
          </Box>
        )}
      </Box>

      {/* Offer Form Drawer (BottomSheetDrawer on mobile, CustomDrawer on desktop) */}
      {isOpen && (
        <OfferForm
          isOpen={isOpen}
          onClose={onClose}
          initialValues={selectedOffer}
        />
      )}

      {/* Confirmation Modal */}
      {offerToDelete && (
        <ConfirmationModal
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          onConfirm={handleConfirmDelete}
          title="Delete Offer"
          message={
            <Text>
              Are you sure you want to delete{" "}
              <strong>{offerToDelete.name}</strong>? This action cannot be
              undone.
            </Text>
          }
          confirmText="Yes, Delete"
          isLoading={offerStore.loading}
        />
      )}
    </MerchantPageShell>
  );
};

export default observer(OffersPage);
