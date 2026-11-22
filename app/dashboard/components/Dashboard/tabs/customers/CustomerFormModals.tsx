"use client";

import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import BottomSheetDrawer from "../../../../../component/common/Drawer/BottomSheetDrawer";
import CustomDrawer from "../../../../../component/common/Drawer/CustomDrawer";
import CustomInput from "../../../../../component/config/component/customInput/CustomInput";
import { useCustomerTheme } from "./theme";
import {
  BuyerFormErrors,
  BuyerFormValues,
  BuyerProfile,
} from "./types";
import { getBuyerDisplayName } from "./utils";

export interface CustomerFormModalsProps {
  isOpen: boolean;
  onClose: () => void;
  isImportOpen: boolean;
  onCloseImport: () => void;
  isContactReviewOpen: boolean;
  onCloseContactReview: () => void;
  isBuyerSuccessOpen: boolean;
  onCloseBuyerSuccess: () => void;
  lastCreatedBuyer: BuyerProfile | null;
  formValues: BuyerFormValues;
  setFormValues: React.Dispatch<React.SetStateAction<BuyerFormValues>>;
  buyerFormErrors: BuyerFormErrors;
  clearBuyerFormErrors: (...fields: Array<"fullName" | "phone" | "email">) => void;
  showContactExtraFields: boolean;
  setShowContactExtraFields: React.Dispatch<React.SetStateAction<boolean>>;
  submitting: boolean;
  isImportingContacts: boolean;
  importDefaultTags: string;
  setImportDefaultTags: (tags: string) => void;
  canUseDeviceContactImport: boolean;
  useCompactBuyerView: boolean;
  activePartyType: "customer" | "supplier";
  onSubmitBuyer: () => void;
  onPickSingleContact: () => void;
  onImportFromDevice: () => void;
  onOpenLedgerFromSuccess: (buyer: BuyerProfile) => void;
}

export const CustomerFormModals: React.FC<CustomerFormModalsProps> = ({
  isOpen,
  onClose,
  isImportOpen,
  onCloseImport,
  isContactReviewOpen,
  onCloseContactReview,
  isBuyerSuccessOpen,
  onCloseBuyerSuccess,
  lastCreatedBuyer,
  formValues,
  setFormValues,
  buyerFormErrors,
  clearBuyerFormErrors,
  showContactExtraFields,
  setShowContactExtraFields,
  submitting,
  isImportingContacts,
  importDefaultTags,
  setImportDefaultTags,
  canUseDeviceContactImport,
  useCompactBuyerView,
  activePartyType,
  onSubmitBuyer,
  onPickSingleContact,
  onImportFromDevice,
  onOpenLedgerFromSuccess,
}) => {
  const theme = useCustomerTheme();
  const {
    cAccent,
    cAccentStrong,
    cTextMuted,
    cText,
    cSurface,
    cBorder,
    cHeroGradient,
    cInputBg,
    cInputMutedBg,
    cInputBorder,
    cPlaceholder,
    cFormInfoBg,
    dashboardHeroGradient,
  } = theme;

  const normalizedActivePartyType = activePartyType === "supplier" ? "supplier" : "customer";
  const partySingularLabel = normalizedActivePartyType === "supplier" ? "Supplier" : "Customer";
  const partyPluralLabel = normalizedActivePartyType === "supplier" ? "Suppliers" : "Customers";

  const renderBuyerFormFields = (isCompact: boolean) => {
    const draftPartyLabel = formValues.partyType === "supplier" ? "Supplier" : "Customer";
    const draftPartyLabelLower = draftPartyLabel.toLowerCase();

    const isCustomerActive = formValues.partyType === "customer";
    const isSupplierActive = formValues.partyType === "supplier";

    return (
      <VStack spacing={4} align="stretch">
        <Box
          p={4}
          borderRadius="20px"
          bg={cFormInfoBg}
          border="1px solid"
          borderColor={cBorder}
        >
          <Text fontSize="sm" fontWeight="800" color={cText}>
            Quick create
          </Text>
          <Text mt={1} fontSize="sm" color={cTextMuted}>
            Add a name and at least one way to reach this {draftPartyLabelLower}.
          </Text>
        </Box>

        <CustomInput
          type="text"
          name="fullName"
          label="Full name"
          required
          placeholder={`${draftPartyLabel} full name`}
          value={formValues.fullName}
          onChange={(e: any) => {
            const val = e.target.value;
            setFormValues((prev) => ({
              ...prev,
              fullName: val,
              displayName: prev.displayName === prev.fullName ? val : prev.displayName,
            }));
            clearBuyerFormErrors("fullName");
          }}
          error={buyerFormErrors.fullName}
          showError={Boolean(buyerFormErrors.fullName)}
        />

        <FormControl>
          <FormLabel color={cText} fontWeight="700" mb={2}>
            Party type
          </FormLabel>
          <HStack
            spacing={1.5}
            p={1.5}
            borderRadius="16px"
            bg={cInputMutedBg}
            border="1px solid"
            borderColor={cBorder}
          >
            <Button
              flex="1"
              h="40px"
              borderRadius="12px"
              bg={isCustomerActive ? "brand.500" : "transparent"}
              color={
                isCustomerActive
                  ? "white"
                  : useColorModeValue("gray.600", "gray.300")
              }
              boxShadow={isCustomerActive ? "0 2px 8px rgba(6, 95, 104, 0.25)" : "none"}
              fontWeight="700"
              fontSize="sm"
              _hover={{
                bg: isCustomerActive
                  ? "brand.600"
                  : useColorModeValue("blackAlpha.50", "whiteAlpha.100"),
                color: isCustomerActive
                  ? "white"
                  : useColorModeValue("gray.800", "white"),
              }}
              _active={{ transform: "scale(0.98)" }}
              onClick={() => setFormValues((prev) => ({ ...prev, partyType: "customer" }))}
            >
              Customer
            </Button>
            <Button
              flex="1"
              h="40px"
              borderRadius="12px"
              bg={isSupplierActive ? "brand.500" : "transparent"}
              color={
                isSupplierActive
                  ? "white"
                  : useColorModeValue("gray.600", "gray.300")
              }
              boxShadow={isSupplierActive ? "0 2px 8px rgba(6, 95, 104, 0.25)" : "none"}
              fontWeight="700"
              fontSize="sm"
              _hover={{
                bg: isSupplierActive
                  ? "brand.600"
                  : useColorModeValue("blackAlpha.50", "whiteAlpha.100"),
                color: isSupplierActive
                  ? "white"
                  : useColorModeValue("gray.800", "white"),
              }}
              _active={{ transform: "scale(0.98)" }}
              onClick={() => setFormValues((prev) => ({ ...prev, partyType: "supplier" }))}
            >
              Supplier
            </Button>
          </HStack>
        </FormControl>

        <HStack align="start" spacing={3}>
          <Box maxW="110px">
            <CustomInput
              type="text"
              name="phoneCountryCode"
              label="Code"
              placeholder="+91"
              value={formValues.phoneCountryCode}
              onChange={(e: any) => {
                const code = e.target.value;
                setFormValues((prev) => ({
                  ...prev,
                  phoneCountryCode: code,
                  phone: `${code}${prev.phoneNationalNumber}`.trim(),
                }));
                clearBuyerFormErrors("phone");
              }}
            />
          </Box>
          <Box flex="1">
            <CustomInput
              type="text"
              name="phoneNationalNumber"
              label="Phone"
              placeholder="Phone number"
              value={formValues.phoneNationalNumber}
              onChange={(e: any) => {
                const localPhone = e.target.value.replace(/\D/g, "");
                setFormValues((prev) => ({
                  ...prev,
                  phoneNationalNumber: localPhone,
                  phone: `${prev.phoneCountryCode}${localPhone}`.trim(),
                }));
                clearBuyerFormErrors("phone", "email");
              }}
              error={buyerFormErrors.phone}
              showError={Boolean(buyerFormErrors.phone)}
            />
          </Box>
        </HStack>

        <CustomInput
          type="text"
          name="email"
          label="Email"
          placeholder={`${draftPartyLabelLower}@example.com`}
          value={formValues.email}
          onChange={(e: any) => {
            const email = e.target.value;
            setFormValues((prev) => ({ ...prev, email }));
            clearBuyerFormErrors("email", "phone");
          }}
          error={buyerFormErrors.email}
          showError={Boolean(buyerFormErrors.email)}
        />

        <CustomInput
          type="text"
          name="displayName"
          label="Display name"
          placeholder={`How this ${draftPartyLabelLower} should appear`}
          value={formValues.displayName}
          onChange={(e: any) => {
            const displayName = e.target.value;
            setFormValues((prev) => ({ ...prev, displayName }));
          }}
        />

        <CustomInput
          type="text"
          name="tags"
          label="Tags"
          placeholder="wholesale, repeat, priority"
          value={formValues.tags}
          onChange={(e: any) => {
            const tags = e.target.value;
            setFormValues((prev) => ({ ...prev, tags }));
          }}
        />

        <Button
          variant="ghost"
          justifyContent="flex-start"
          px={0}
          color={cAccentStrong}
          fontWeight="800"
          _hover={{ bg: "transparent", color: cAccent }}
          onClick={() => setShowContactExtraFields((prev) => !prev)}
        >
          {showContactExtraFields ? "Hide address & notes" : "Add address & notes"}
        </Button>

        {showContactExtraFields ? (
          <VStack align="stretch" spacing={3}>
            <CustomInput
              type="text"
              name="addressLine1"
              label="Address line 1"
              placeholder="Shop or street address"
              value={formValues.addressLine1}
              onChange={(e: any) =>
                setFormValues((prev) => ({ ...prev, addressLine1: e.target.value }))
              }
            />
            <CustomInput
              type="text"
              name="addressLine2"
              label="Address line 2"
              placeholder="Area, landmark"
              value={formValues.addressLine2}
              onChange={(e: any) =>
                setFormValues((prev) => ({ ...prev, addressLine2: e.target.value }))
              }
            />
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
              <CustomInput
                type="text"
                name="city"
                label="City"
                placeholder="City"
                value={formValues.city}
                onChange={(e: any) =>
                  setFormValues((prev) => ({ ...prev, city: e.target.value }))
                }
              />
              <CustomInput
                type="text"
                name="state"
                label="State"
                placeholder="State"
                value={formValues.state}
                onChange={(e: any) =>
                  setFormValues((prev) => ({ ...prev, state: e.target.value }))
                }
              />
              <CustomInput
                type="text"
                name="postalCode"
                label="Postal code"
                placeholder="PIN / Postal code"
                value={formValues.postalCode}
                onChange={(e: any) =>
                  setFormValues((prev) => ({ ...prev, postalCode: e.target.value }))
                }
              />
              <CustomInput
                type="text"
                name="country"
                label="Country"
                placeholder="Country"
                value={formValues.country}
                onChange={(e: any) =>
                  setFormValues((prev) => ({ ...prev, country: e.target.value }))
                }
              />
            </SimpleGrid>
            <CustomInput
              type="textarea"
              name="notes"
              label="Notes"
              rows={3}
              placeholder={`Anything useful to remember about this ${formValues.partyType}`}
              value={formValues.notes}
              onChange={(e: any) =>
                setFormValues((prev) => ({ ...prev, notes: e.target.value }))
              }
            />
          </VStack>
        ) : null}
      </VStack>
    );
  };

  return (
    <>
      {/* Import Contacts Modal */}
      <Modal isOpen={isImportOpen} onClose={onCloseImport} isCentered size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Import {partyPluralLabel} From Contacts</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color="gray.600">
                Import {partyPluralLabel.toLowerCase()} directly from device contacts.
              </Text>

              <CustomInput
                type="text"
                name="importDefaultTags"
                label="Default Tags (comma-separated)"
                value={importDefaultTags}
                onChange={(e: any) => setImportDefaultTags(e.target.value)}
                placeholder="retail, repeat"
              />

              {canUseDeviceContactImport ? (
                <>
                  <Stack direction={{ base: "column", sm: "row" }} spacing={3} align="stretch">
                    <Button
                      colorScheme="brand"
                      variant="solid"
                      onClick={onPickSingleContact}
                      isLoading={isImportingContacts}
                      flex={1}
                      size="lg"
                      minH={{ base: "60px", sm: "64px" }}
                      borderRadius="xl"
                      fontWeight="semibold"
                      fontSize="md"
                      whiteSpace="normal"
                      textAlign="center"
                      px={6}
                      boxShadow="sm"
                      _hover={{ transform: "translateY(-1px)", boxShadow: "md" }}
                      _active={{ transform: "translateY(0)" }}
                    >
                      Pick Contact
                    </Button>
                    <Button
                      colorScheme="brand"
                      variant="outline"
                      onClick={onImportFromDevice}
                      isLoading={isImportingContacts}
                      flex={1}
                      size="lg"
                      minH={{ base: "60px", sm: "64px" }}
                      borderRadius="xl"
                      fontWeight="semibold"
                      fontSize="md"
                      whiteSpace="normal"
                      textAlign="center"
                      px={6}
                      borderWidth="1.5px"
                      bg="rgba(214, 183, 114, 0.10)"
                      borderColor={cAccent}
                      color={cAccent}
                      _hover={{ bg: "rgba(214, 183, 114, 0.16)", transform: "translateY(-1px)" }}
                      _active={{ transform: "translateY(0)" }}
                    >
                      Import All Contacts
                    </Button>
                  </Stack>
                  <Divider />
                </>
              ) : null}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCloseImport}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Picked Contact Review Modal */}
      <Modal isOpen={isContactReviewOpen} onClose={onCloseContactReview} size="full" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent bg="#F7FAFC">
          <Box bgGradient={dashboardHeroGradient} px={4} py={4} color="white">
            <HStack spacing={3}>
              <IconButton
                aria-label="Back"
                icon={<ArrowBackIcon />}
                onClick={onCloseContactReview}
                variant="ghost"
                color="white"
                _hover={{ bg: "whiteAlpha.200" }}
                _active={{ bg: "whiteAlpha.300" }}
              />
              <Text fontSize="2xl" fontWeight="700">
                Add Party
              </Text>
            </HStack>
          </Box>

          <ModalBody px={4} py={5}>
            {renderBuyerFormFields(true)}
          </ModalBody>

          <ModalFooter px={4} py={4} borderTopWidth="1px" borderTopColor="gray.200" bg="white">
            <Button
              w="full"
              h="58px"
              colorScheme="brand"
              borderRadius="16px"
              fontSize="lg"
              onClick={onSubmitBuyer}
              isLoading={submitting}
            >
              Add {formValues.partyType === "supplier" ? "Supplier" : "Customer"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Buyer Success Modal */}
      <Modal isOpen={isBuyerSuccessOpen} onClose={onCloseBuyerSuccess} isCentered size="sm">
        <ModalOverlay bg="blackAlpha.500" />
        <ModalContent borderRadius="24px" overflow="hidden">
          <Box bgGradient="linear(180deg, #0E7A44 0%, #0A6538 100%)" color="white" px={6} py={7}>
            <VStack spacing={3}>
              <Flex
                h="64px"
                w="64px"
                borderRadius="full"
                bg="whiteAlpha.250"
                align="center"
                justify="center"
                fontSize="3xl"
                fontWeight="900"
              >
                OK
              </Flex>
              <Text fontSize="2xl" fontWeight="800">
                {lastCreatedBuyer?.partyType === "supplier" ? "Supplier saved" : "Customer saved"}
              </Text>
              <Text fontSize="sm" color="whiteAlpha.900" textAlign="center">
                {lastCreatedBuyer
                  ? `${getBuyerDisplayName(lastCreatedBuyer)} is ready for ledger entries.`
                  : `The contact has been added to your ${normalizedActivePartyType === "supplier" ? "supplier" : "customer"} list.`}
              </Text>
            </VStack>
          </Box>
          <ModalBody px={6} py={5}>
            <VStack spacing={3} align="stretch">
              <Button
                colorScheme="brand"
                h="52px"
                borderRadius="16px"
                onClick={() => {
                  onCloseBuyerSuccess();
                  if (lastCreatedBuyer?._id) {
                    onOpenLedgerFromSuccess(lastCreatedBuyer);
                  }
                }}
              >
                Open Ledger
              </Button>
              <Button
                variant="outline"
                h="52px"
                borderRadius="16px"
                onClick={onCloseBuyerSuccess}
              >
                Done
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Add / Edit Customer Drawer */}
      {useCompactBuyerView ? (
        <BottomSheetDrawer
          isOpen={isOpen}
          onClose={onClose}
          title={`Add ${partySingularLabel}`}
          overlayBg="blackAlpha.600"
          contentProps={{
            bg: cSurface,
            borderTopRadius: "28px",
          }}
          headerProps={{
            borderBottomColor: cBorder,
            px: 5,
            py: 4,
          }}
          bodyProps={{
            px: 4,
            py: 4,
          }}
          footerProps={{
            borderTopColor: cBorder,
            px: 4,
            py: 4,
            flexDirection: "row",
          }}
          footer={
            <>
              <Button variant="ghost" onClick={onClose} minH="52px" borderRadius="16px">
                Cancel
              </Button>
              <Button
                onClick={onSubmitBuyer}
                isLoading={submitting}
                flex="1"
                minH="52px"
                borderRadius="16px"
                bg="brand.500"
                color="white"
                boxShadow="0 14px 28px rgba(6, 95, 104, 0.24)"
                _hover={{ bg: "brand.600" }}
              >
                Save {partySingularLabel}
              </Button>
            </>
          }
        >
          {renderBuyerFormFields(true)}
        </BottomSheetDrawer>
      ) : (
        <CustomDrawer
          isOpen={isOpen}
          onClose={onClose}
          title={`Add ${partySingularLabel}`}
          subtitle={`Create a new ${partySingularLabel.toLowerCase()} record`}
          size="md"
          showDivider={true}
          bodyProps={{
            px: { base: 4, md: 5 },
            py: 4,
            pb: 8,
          }}
          footer={
            <HStack spacing={3} w="full" justify="flex-end">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={onSubmitBuyer}
                isLoading={submitting}
                colorScheme="brand"
                px={6}
                fontWeight="800"
              >
                Save {partySingularLabel}
              </Button>
            </HStack>
          }
        >
          {renderBuyerFormFields(false)}
        </CustomDrawer>
      )}
    </>
  );
};

export default CustomerFormModals;
