"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  useDisclosure,
  useToast,
  Box,
  HStack,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { FiGift, FiPlusCircle, FiStar } from "react-icons/fi";
import { observer } from "mobx-react-lite";
import stores from "../../../store/stores";
import CustomTable from "../../../component/config/component/CustomTable/CustomTable";
import ConfirmationModal from "../../../component/common/ConfirmationModal/ConfirmationModal";
import OfferForm from "./components/OfferForm";
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
    const res = await offerStore.deleteOffer(offerToDelete._id || offerToDelete.offerId);
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
      onClick: () => { },
    },
  };

  const activeOffers = offerStore.offers.filter((offer: any) => offer.isActive).length;
  const defaultOffers = offerStore.offers.filter((offer: any) => offer.isDefault).length;

  return (
    <MerchantPageShell>
      <MerchantHeroSection
        icon={FiGift}
        primaryBadge="Promotions Desk"
        title="Offer Management"
        description="Control offer visibility, keep default promotions sane, and manage the incentives available across the marketplace."
        rightContent={
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3} minW={{ xl: "320px" }}>
            <MerchantStatCard label="Total Offers" value={offerStore.offers.length} icon={FiGift} />
            <MerchantStatCard label="Defaults Active" value={defaultOffers} valueColor={dashboardPalette.accentStrong} icon={FiStar} />
          </SimpleGrid>
        }
      />

      <MerchantPanel p={{ base: 4, md: 6 }}>
        <Flex justify="space-between" align={{ base: "start", md: "center" }} direction={{ base: "column", md: "row" }} gap={3} mb={5}>
          <Box>
            <Text fontSize="lg" fontWeight="700" color={dashboardPalette.text}>
              Offers Registry
            </Text>
            <HStack spacing={2} mt={2} flexWrap="wrap">
              <MerchantBadge tone={activeOffers > 0 ? "success" : "soft"}>{activeOffers} Active</MerchantBadge>
              <MerchantBadge tone={defaultOffers > 0 ? "accent" : "soft"}>{defaultOffers} Default</MerchantBadge>
            </HStack>
          </Box>
          <Button leftIcon={<FiPlusCircle />} onClick={handleAddClick} {...merchantPrimaryButtonProps}>
            Add Offer
          </Button>
        </Flex>

        <CustomTable
          title={`All Offers (${offerStore.offers.length})`}
          data={offerStore.offers}
          columns={columns}
          loading={offerStore.loading}
          actions={tableActions}
          serial={{ show: true, text: "S.No." }}
          {...getMerchantTableProps("62vh")}
        />
      </MerchantPanel>

      {isOpen && (
        <OfferForm
          isOpen={isOpen}
          onClose={onClose}
          initialValues={selectedOffer}
        />
      )}

      {offerToDelete && (
        <ConfirmationModal
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          onConfirm={handleConfirmDelete}
          title="Delete Offer"
          message={
            <Text>
              Are you sure you want to delete{" "}
              <strong>{offerToDelete.name}</strong>? This action cannot be undone.
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
