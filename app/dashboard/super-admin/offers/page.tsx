"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Button,
  Flex,
  useDisclosure,
  useToast,
  Badge,
  Text,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import stores from "../../../store/stores";
import CustomTable from "../../../component/config/component/CustomTable/CustomTable";
import ConfirmationModal from "../../../component/common/ConfirmationModal/ConfirmationModal";
import OfferForm from "./components/OfferForm";

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
          <Badge colorScheme="purple" textTransform="capitalize">
            {data.type}
          </Badge>
        ),
      },
    },
    {
      headerName: "Status",
      key: "isActive",
      type: "component",
      metaData: {
        component: (data: any) => (
          <Badge colorScheme={data.isActive ? "green" : "red"}>
            {data.isActive ? "Active" : "Inactive"}
          </Badge>
        ),
      },
    },
    {
      headerName: "Default",
      key: "isDefault",
      type: "component",
      metaData: {
        component: (data: any) => (
          <Badge colorScheme={data.isDefault ? "blue" : "gray"}>
            {data.isDefault ? "Yes" : "No"}
          </Badge>
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

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Offers</Heading>
        <Button colorScheme="blue" onClick={handleAddClick}>
          Add Offer
        </Button>
      </Flex>

      <Box bg="white" borderRadius="lg" shadow="sm">
        <CustomTable
          title={`All Offers (${offerStore.offers.length})`}
          data={offerStore.offers}
          columns={columns}
          loading={offerStore.loading}
          actions={tableActions}
          serial={{ show: true, text: "S.No." }}
        />
      </Box>

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
    </Box>
  );
};

export default observer(OffersPage);
