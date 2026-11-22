"use client";

import React from "react";
import { ArrowBackIcon, DownloadIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Input,
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
  Textarea,
  VStack,
} from "@chakra-ui/react";
import BottomSheetDrawer from "../../../../../component/common/Drawer/BottomSheetDrawer";
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
    const inputHeight = isCompact ? "56px" : "52px";
    const radius = isCompact ? "18px" : "16px";
    const draftPartyLabel = formValues.partyType === "supplier" ? "Supplier" : "Customer";
    const draftPartyLabelLower = draftPartyLabel.toLowerCase();

    return (
      <VStack spacing={4} align="stretch">
        <Box
          p={4}
          borderRadius="24px"
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

        <FormControl isInvalid={Boolean(buyerFormErrors.fullName)}>
          <FormLabel color={cText} fontWeight="700">
            Full name
          </FormLabel>
          <Input
            value={formValues.fullName}
            onChange={(e) =>
              setFormValues((prev) => ({
                ...prev,
                fullName: e.target.value,
                displayName: prev.displayName === prev.fullName ? e.target.value : prev.displayName,
              }))
            }
            placeholder={`${draftPartyLabel} full name`}
            bg={cInputBg}
            borderColor={cInputBorder}
            borderRadius={radius}
            h={inputHeight}
            _placeholder={{ color: cPlaceholder }}
            _focus={{ borderColor: cAccent, boxShadow: `0 0 0 1px ${cAccent}` }}
            onChangeCapture={() => clearBuyerFormErrors("fullName")}
          />
          <FormErrorMessage>{buyerFormErrors.fullName}</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel color={cText} fontWeight="700">
            Party type
          </FormLabel>
          <HStack
            spacing={1}
            p={1}
            borderRadius="18px"
            bg={cInputMutedBg}
            border="1px solid"
            borderColor={cBorder}
          >
            <Button
              flex="1"
              h="42px"
              borderRadius="14px"
              bg={formValues.partyType === "customer" ? cHeroGradient : "transparent"}
              color={formValues.partyType === "customer" ? "white" : cTextMuted}
              fontWeight="800"
              _hover={{ color: formValues.partyType === "customer" ? "white" : cText }}
              _active={{ transform: "scale(0.98)" }}
              onClick={() => setFormValues((prev) => ({ ...prev, partyType: "customer" }))}
            >
              Customer
            </Button>
            <Button
              flex="1"
              h="42px"
              borderRadius="14px"
              bg={formValues.partyType === "supplier" ? cHeroGradient : "transparent"}
              color={formValues.partyType === "supplier" ? "white" : cTextMuted}
              fontWeight="800"
              _hover={{ color: formValues.partyType === "supplier" ? "white" : cText }}
              _active={{ transform: "scale(0.98)" }}
              onClick={() => setFormValues((prev) => ({ ...prev, partyType: "supplier" }))}
            >
              Supplier
            </Button>
          </HStack>
        </FormControl>

        <HStack align="start" spacing={3}>
          <FormControl maxW="118px" isInvalid={Boolean(buyerFormErrors.phone)}>
            <FormLabel color={cText} fontWeight="700">
              Code
            </FormLabel>
            <Input
              value={formValues.phoneCountryCode}
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  phoneCountryCode: e.target.value,
                  phone: `${e.target.value}${prev.phoneNationalNumber}`.trim(),
                }))
              }
              onChangeCapture={() => clearBuyerFormErrors("phone")}
              placeholder="+91"
              bg={cInputBg}
              borderColor={cInputBorder}
              borderRadius={radius}
              h={inputHeight}
              textAlign="center"
              _placeholder={{ color: cPlaceholder }}
              _focus={{ borderColor: cAccent, boxShadow: `0 0 0 1px ${cAccent}` }}
            />
          </FormControl>
          <FormControl flex="1" isInvalid={Boolean(buyerFormErrors.phone)}>
            <FormLabel color={cText} fontWeight="700">
              Phone
            </FormLabel>
            <Input
              value={formValues.phoneNationalNumber}
              onChange={(e) =>
                setFormValues((prev) => {
                  const localPhone = e.target.value.replace(/\D/g, "");
                  return {
                    ...prev,
                    phoneNationalNumber: localPhone,
                    phone: `${prev.phoneCountryCode}${localPhone}`.trim(),
                  };
                })
              }
              onChangeCapture={() => clearBuyerFormErrors("phone", "email")}
              placeholder="Phone number"
              inputMode="tel"
              bg={cInputBg}
              borderColor={cInputBorder}
              borderRadius={radius}
              h={inputHeight}
              _placeholder={{ color: cPlaceholder }}
              _focus={{ borderColor: cAccent, boxShadow: `0 0 0 1px ${cAccent}` }}
            />
            <FormErrorMessage>{buyerFormErrors.phone}</FormErrorMessage>
          </FormControl>
        </HStack>

        <FormControl isInvalid={Boolean(buyerFormErrors.email)}>
          <FormLabel color={cText} fontWeight="700">
            Email
          </FormLabel>
          <Input
            value={formValues.email}
            onChange={(e) => setFormValues((prev) => ({ ...prev, email: e.target.value }))}
            onChangeCapture={() => clearBuyerFormErrors("email", "phone")}
            placeholder={`${draftPartyLabelLower}@example.com`}
            bg={cInputBg}
            borderColor={cInputBorder}
            borderRadius={radius}
            h={inputHeight}
            _placeholder={{ color: cPlaceholder }}
            _focus={{ borderColor: cAccent, boxShadow: `0 0 0 1px ${cAccent}` }}
          />
          <FormErrorMessage>{buyerFormErrors.email}</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel color={cText} fontWeight="700">
            Display name
          </FormLabel>
          <Input
            value={formValues.displayName}
            onChange={(e) => setFormValues((prev) => ({ ...prev, displayName: e.target.value }))}
            placeholder={`How this ${draftPartyLabelLower} should appear`}
            bg={cInputBg}
            borderColor={cInputBorder}
            borderRadius={radius}
            h={inputHeight}
            _placeholder={{ color: cPlaceholder }}
            _focus={{ borderColor: cAccent, boxShadow: `0 0 0 1px ${cAccent}` }}
          />
        </FormControl>

        <FormControl>
          <FormLabel color={cText} fontWeight="700">
            Tags
          </FormLabel>
          <Input
            value={formValues.tags}
            onChange={(e) => setFormValues((prev) => ({ ...prev, tags: e.target.value }))}
            placeholder="wholesale, repeat, priority"
            bg={cInputBg}
            borderColor={cInputBorder}
            borderRadius={radius}
            h={inputHeight}
            _placeholder={{ color: cPlaceholder }}
            _focus={{ borderColor: cAccent, boxShadow: `0 0 0 1px ${cAccent}` }}
          />
        </FormControl>

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
            <FormControl>
              <FormLabel color={cText} fontWeight="700">
                Address line 1
              </FormLabel>
              <Input
                value={formValues.addressLine1}
                onChange={(e) => setFormValues((prev) => ({ ...prev, addressLine1: e.target.value }))}
                placeholder="Shop or street address"
                bg={cInputBg}
                borderColor={cInputBorder}
                borderRadius={radius}
                h={inputHeight}
                _placeholder={{ color: cPlaceholder }}
                _focus={{ borderColor: cAccent, boxShadow: `0 0 0 1px ${cAccent}` }}
              />
            </FormControl>
            <FormControl>
              <FormLabel color={cText} fontWeight="700">
                Address line 2
              </FormLabel>
              <Input
                value={formValues.addressLine2}
                onChange={(e) => setFormValues((prev) => ({ ...prev, addressLine2: e.target.value }))}
                placeholder="Area, landmark"
                bg={cInputBg}
                borderColor={cInputBorder}
                borderRadius={radius}
                h={inputHeight}
                _placeholder={{ color: cPlaceholder }}
                _focus={{ borderColor: cAccent, boxShadow: `0 0 0 1px ${cAccent}` }}
              />
            </FormControl>
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
              <FormControl>
                <FormLabel color={cText} fontWeight="700">
                  City
                </FormLabel>
                <Input
                  value={formValues.city}
                  onChange={(e) => setFormValues((prev) => ({ ...prev, city: e.target.value }))}
                  bg={cInputBg}
                  borderColor={cInputBorder}
                  borderRadius={radius}
                  h={inputHeight}
                  _focus={{ borderColor: cAccent, boxShadow: `0 0 0 1px ${cAccent}` }}
                />
              </FormControl>
              <FormControl>
                <FormLabel color={cText} fontWeight="700">
                  State
                </FormLabel>
                <Input
                  value={formValues.state}
                  onChange={(e) => setFormValues((prev) => ({ ...prev, state: e.target.value }))}
                  bg={cInputBg}
                  borderColor={cInputBorder}
                  borderRadius={radius}
                  h={inputHeight}
                  _focus={{ borderColor: cAccent, boxShadow: `0 0 0 1px ${cAccent}` }}
                />
              </FormControl>
              <FormControl>
                <FormLabel color={cText} fontWeight="700">
                  Postal code
                </FormLabel>
                <Input
                  value={formValues.postalCode}
                  onChange={(e) => setFormValues((prev) => ({ ...prev, postalCode: e.target.value }))}
                  inputMode="numeric"
                  bg={cInputBg}
                  borderColor={cInputBorder}
                  borderRadius={radius}
                  h={inputHeight}
                  _focus={{ borderColor: cAccent, boxShadow: `0 0 0 1px ${cAccent}` }}
                />
              </FormControl>
              <FormControl>
                <FormLabel color={cText} fontWeight="700">
                  Country
                </FormLabel>
                <Input
                  value={formValues.country}
                  onChange={(e) => setFormValues((prev) => ({ ...prev, country: e.target.value }))}
                  bg={cInputBg}
                  borderColor={cInputBorder}
                  borderRadius={radius}
                  h={inputHeight}
                  _focus={{ borderColor: cAccent, boxShadow: `0 0 0 1px ${cAccent}` }}
                />
              </FormControl>
            </SimpleGrid>
            <FormControl>
              <FormLabel color={cText} fontWeight="700">
                Notes
              </FormLabel>
              <Textarea
                value={formValues.notes}
                onChange={(e) => setFormValues((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder={`Anything useful to remember about this ${formValues.partyType}`}
                bg={cInputBg}
                borderColor={cInputBorder}
                borderRadius={radius}
                minH="116px"
                resize="vertical"
                _placeholder={{ color: cPlaceholder }}
                _focus={{ borderColor: cAccent, boxShadow: `0 0 0 1px ${cAccent}` }}
              />
            </FormControl>
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

              <FormControl>
                <FormLabel>Default Tags (comma-separated)</FormLabel>
                <Input
                  value={importDefaultTags}
                  onChange={(e) => setImportDefaultTags(e.target.value)}
                  placeholder="retail, repeat"
                />
              </FormControl>

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

      {/* Add / Edit Customer Drawer or Modal */}
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
                bgGradient={cHeroGradient}
                color="white"
                boxShadow="0 16px 30px rgba(69, 104, 255, 0.22)"
                _hover={{ filter: "brightness(1.05)" }}
              >
                Save {partySingularLabel}
              </Button>
            </>
          }
        >
          {renderBuyerFormFields(true)}
        </BottomSheetDrawer>
      ) : (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
          <ModalOverlay />
          <ModalContent borderRadius="28px" bg={cSurface}>
            <ModalHeader>Add {partySingularLabel}</ModalHeader>
            <ModalCloseButton />
            <ModalBody px={6} py={5}>
              {renderBuyerFormFields(false)}
            </ModalBody>
            <ModalFooter borderTopWidth="1px" borderTopColor={cBorder}>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={onSubmitBuyer}
                isLoading={submitting}
                bgGradient={cHeroGradient}
                color="white"
                borderRadius="16px"
                px={5}
                _hover={{ filter: "brightness(1.05)" }}
              >
                Save {partySingularLabel}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default CustomerFormModals;
