"use client";

import {
  Box,
  Button,
  Center,
  Checkbox,
  CloseButton,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  SimpleGrid,
  Switch,
  Text,
  Textarea,
  useColorModeValue,
  VStack
} from "@chakra-ui/react";
import { Field, FieldArray, Form, Formik } from "formik";
import React, { useRef, useState } from "react";
import {
  FaBoxOpen,
  FaCogs,
  FaFileAlt,
  FaGift,
  FaImage,
  FaInfoCircle,
  FaPlus,
  FaRupeeSign,
  FaSave,
  FaTrash,
  FaUpload
} from "react-icons/fa";
import CustomDrawer from "../../../component/common/Drawer/CustomDrawer";
import { buildBase64ImageUpload } from "../../../config/utils/imageUpload";
import { dashboardHeroGradient, dashboardHeroGradientLight, dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";
import { useMerchantFormSx } from "../../shop/component/merchantTheme";
import FreebieProductModal from "./FreebieProductModal";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues: any;
  validationSchema: any;
  onSubmit: any;
  categories: any[];
  offersList?: any[];
  products?: any[];
  isEdit: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  isOpen,
  onClose,
  initialValues,
  validationSchema,
  onSubmit,
  categories,
  offersList = [],
  products = [],
  isEdit,
}) => {
  const merchantFormSx = useMerchantFormSx();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const freebieModalTargetOfferRef = useRef<string | null>(null);
  const [isFreebieModalOpen, setIsFreebieModalOpen] = useState(false);

  // Dynamic Theme Colors
  const cAccentSoft = useColorModeValue("blue.50", dashboardPalette.accentSoft);
  const cAccentStrong = useColorModeValue("blue.700", dashboardPalette.accentStrong);
  const cAccent = useColorModeValue("blue.600", dashboardPalette.accent);
  const cTextMuted = useColorModeValue("gray.500", dashboardPalette.textMuted);
  const cText = useColorModeValue("gray.800", dashboardPalette.text);
  const cTextSoft = useColorModeValue("gray.400", dashboardPalette.textSoft);
  const cBorder = useColorModeValue("gray.200", dashboardPalette.border);
  const cBorderStrong = useColorModeValue("gray.300", dashboardPalette.borderStrong);
  const cSurface = useColorModeValue("white", dashboardPalette.surface);
  const cSurfaceAlt = useColorModeValue("gray.50", dashboardPalette.surfaceAlt);
  const cSurfaceSoft = useColorModeValue("gray.100", dashboardPalette.surfaceSoft);
  const cShell = useColorModeValue("white", dashboardPalette.shell);
  const cDanger = useColorModeValue("red.500", dashboardPalette.danger);

  // Section accent colors
const SECTION_COLORS = [
  { id: 'basic', title: 'Basic Details', icon: FaInfoCircle, gradient: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)", glow: "rgba(59,130,246,0.12)", iconColor: "#3B82F6", soft: "rgba(59,130,246,0.05)", text: "#60A5FA" },
  { id: 'pricing', title: 'Pricing & Stock', icon: FaRupeeSign, gradient: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)", glow: "rgba(16,185,129,0.12)", iconColor: "#10B981", soft: "rgba(16,185,129,0.05)", text: "#34D399" },
  { id: 'description', title: 'Description', icon: FaFileAlt, gradient: "linear-gradient(135deg, #ECFEFF 0%, #CFFAFE 100%)", glow: "rgba(6,182,212,0.12)", iconColor: "#0891B2", soft: "rgba(6,182,212,0.05)", text: "#22D3EE" },
  { id: 'promotions', title: 'Promotions', icon: FaGift, gradient: "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)", glow: "rgba(139,92,246,0.12)", iconColor: "#8B5CF6", soft: "rgba(139,92,246,0.05)", text: "#A78BFA" },
  { id: 'config', title: 'Variants & Tags', icon: FaCogs, gradient: "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)", glow: "rgba(99,102,241,0.12)", iconColor: "#6366F1", soft: "rgba(99,102,241,0.05)", text: "#818CF8" },
  { id: 'media', title: 'Product Media', icon: FaImage, gradient: "linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)", glow: "rgba(244,63,94,0.12)", iconColor: "#E11D48", soft: "rgba(244,63,94,0.05)", text: "#FB7185" },
];

  const sectionCardSx = {
    bg: cSurface,
    border: "1px solid",
    borderColor: cBorder,
    borderRadius: "24px",
    p: { base: 5, md: 7 },
    boxShadow: useColorModeValue(
      "0 4px 20px rgba(0,0,0,0.04)", 
      "0 16px 36px rgba(0, 0, 0, 0.22)"
    ),
    position: "relative",
    overflow: "hidden",
  };

const SectionHeader = ({ index }: { index: number }) => {
  const config = SECTION_COLORS[index];
  
  return (
    <HStack spacing={4} mb={6} align="center">
      <Box
        w="48px"
        h="48px"
        borderRadius="16px"
        bgGradient={config.gradient}
        display="flex"
        alignItems="center"
        justifyContent="center"
        // Softened the shadow blur and spread for a subtler look
        boxShadow={`0 4px 12px ${config.glow}`} 
      >
        {/* Changed from "white" to config.iconColor for contrast */}
        <Icon as={config.icon} boxSize={5} color={config.iconColor} />
      </Box>
      <VStack align="start" spacing={0}>
        <Text fontSize="10px" fontWeight="800" color={cTextSoft} textTransform="uppercase" letterSpacing="0.2em">
          Section {index + 1}
        </Text>
        <Heading size="md" color={cText} letterSpacing="-0.01em">
          {config.title}
        </Heading>
      </VStack>
    </HStack>
  );
};

  const handleImageUpload = async (
    event: any,
    setFieldValue: any,
    currentImages: any[]
  ) => {
    const files = Array.from(event.target.files);

    const fileReaders = files.map((file: any) =>
      buildBase64ImageUpload(file, { isAdd: 1, isDeleted: 0 }).then((payload) => ({
        ...payload,
        preview: URL.createObjectURL(file),
      }))
    );

    try {
      const newImages = await Promise.all(fileReaders);
      setFieldValue("images", [...currentImages, ...newImages]);
    } catch (error: any) {
      alert(error?.message);
    }
  };
  const heroBg = useColorModeValue(dashboardHeroGradientLight, dashboardHeroGradient);

  return (
    <CustomDrawer open={isOpen} close={onClose} width="85vw">
      <Box
        bg={cShell}
        border="1px solid"
        borderColor={cBorder}
        borderRadius="28px"
        p={{ base: 4, md: 5 }}
        sx={{
          ...merchantFormSx,
          ".chakra-form__label": {
            color: useColorModeValue("black", "whiteAlpha.900"),
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          },
          ".chakra-input, .chakra-textarea, .chakra-numberinput__field, .chakra-select": {
            bg: cSurfaceAlt,
            borderColor: cBorderStrong,
            color: cText,
            borderRadius: "16px",
          },
          ".chakra-input::placeholder, .chakra-textarea::placeholder, .chakra-numberinput__field::placeholder": {
            color: cTextSoft,
          },
          ".chakra-checkbox__label": {
            color: cTextMuted,
          },
          ".chakra-checkbox__control": {
            bg: cSurfaceSoft,
            borderColor: cBorderStrong,
          },
          ".chakra-checkbox__control[data-checked]": {
            bg: cAccentSoft,
            borderColor: cAccent,
            color: cAccentStrong,
          },
          ".chakra-switch__track": {
            bg: cSurfaceSoft,
          },
          ".chakra-switch__track[data-checked]": {
            bg: cAccent,
          },
        }}
      >
        <Box position="relative">
          {/* Main Hero Header */}
          <Box 
            bgGradient={heroBg}
            borderRadius="24px"
            p={6}
            mb={6}
            color="white"
            position="relative"
            overflow="hidden"
            boxShadow="0 8px 20px rgba(37,99,235,0.10)"
          >
          
            <HStack justify="space-between" align="center" position="relative" zIndex={1}>
              <HStack spacing={5}>
                <Box 
                  p={4} 
                  bg="whiteAlpha.200" 
                  borderRadius="20px" 
                  backdropFilter="blur(10px)"
                  border="1px solid"
                  borderColor="whiteAlpha.300"
                >
                  <Icon as={FaBoxOpen} boxSize={8} />
                </Box>
                <VStack align="start" spacing={0}>
                  <Heading size="lg" fontWeight="800" letterSpacing="-0.02em">
                    {isEdit ? "Refine Product" : "Launch New Product"}
                  </Heading>
                  <Text opacity={0.9} fontSize="sm" fontWeight="500">
                    {isEdit ? "Update details, pricing, and inventory for your existing item." : "Complete the details below to add a new product to your inventory."}
                  </Text>
                </VStack>
              </HStack>
              <IconButton
                aria-label="Close"
                icon={<CloseButton />}
                variant="ghost"
                color="white"
                _hover={{ bg: "whiteAlpha.200" }}
                onClick={onClose}
                borderRadius="full"
              />
            </HStack>
          </Box>


        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(props) => {
            const rootCategories = categories.filter((cat) => !cat.parent);
            const availableSubCategories = categories.filter(
              (cat) =>
                cat.parent &&
                (cat.parent._id === props.values.category || cat.parent === props.values.category)
            );
            const selectedOffers = Array.isArray(props.values.offers) ? props.values.offers : [];

            const toggleOffer = (offer: any) => {
              const idx = selectedOffers.findIndex((item: any) => item.offerId === offer.offerId);
              if (idx >= 0) {
                props.setFieldValue(
                  "offers",
                  selectedOffers.filter((item: any) => item.offerId !== offer.offerId)
                );
                return;
              }

              const defaultConfig =
                offer.type === "discount"
                  ? { discountPercentage: "", maxDiscountAmount: "", minCartValue: "" }
                  : offer.type === "buyXgetY"
                    ? { buyQuantity: "", getQuantity: "" }
                    : { freebieTitle: "" };

              props.setFieldValue("offers", [
                ...selectedOffers,
                {
                  offerId: offer.offerId,
                  type: offer.type,
                  isEnabled: true,
                  config: defaultConfig,
                },
              ]);
            };

            const updateOfferConfig = (offerId: string, key: string, value: any) => {
              const idx = selectedOffers.findIndex((item: any) => item.offerId === offerId);
              if (idx < 0) return;
              props.setFieldValue(`offers[${idx}].config.${key}`, value);
            };

            const updateOfferEnabled = (offerId: string, enabled: boolean) => {
              const idx = selectedOffers.findIndex((item: any) => item.offerId === offerId);
              if (idx < 0) return;
              props.setFieldValue(`offers[${idx}].isEnabled`, enabled);
            };

            const openFreebieModal = (offerId: string) => {
              freebieModalTargetOfferRef.current = offerId;
              setIsFreebieModalOpen(true);
            };

            return (
              <Form>
                <Flex direction={{ base: "column", lg: "row" }} gap={6} align="start">
                  {/* Sidebar Navigation */}
                  {/* <Box
                    w={{ base: "100%", lg: "260px" }}
                    bg={cSurface}
                    borderRadius="24px"
                    p={4}
                    border="1px solid"
                    borderColor={cBorder}
                    position={{ base: "static", lg: "sticky" }}
                    top="0"
                    boxShadow="sm"
                  >
                    <VStack align="stretch" spacing={2}>
                      {SECTION_COLORS.map((section, index) => {
                        const isActive = activeTab === index;
                        return (
                          <Button
                            key={section.id}
                            variant="unstyled"
                            display="flex"
                            alignItems="center"
                            gap={3}
                            px={4}
                            py={3}
                            h="auto"
                            borderRadius="16px"
                            bg={isActive ? section.soft : "transparent"}
                            color={isActive ? section.text : cTextMuted}
                            border="1px solid"
                            borderColor={isActive ? section.text : "transparent"}
                            _hover={{ bg: isActive ? section.soft : cSurfaceAlt, transform: "translateX(4px)" }}
                            transition="all 0.2s"
                            onClick={() => {
                              setActiveTab(index);
                              const el = document.getElementById(`section-${section.id}`);
                              el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }}
                          >
                            <Box 
                              w="32px" h="32px" 
                              borderRadius="10px" 
                              bgGradient={isActive ? section.gradient : "none"} 
                              bg={isActive ? "none" : cSurfaceSoft}
                              display="flex" alignItems="center" justifyContent="center"
                            >
                              <Icon as={section.icon} boxSize={isActive ? 4 : 3.5} color={isActive ? "white" : cTextSoft} />
                            </Box>
                            <Text fontSize="sm" fontWeight={isActive ? "700" : "500"}>{section.title}</Text>
                          </Button>
                        );
                      })}
                    </VStack>
                  </Box> */}

                  {/* Main Form Content */}
                  <VStack spacing={6} align="stretch" flex={1} w="100%">
                    <Box id="section-basic" {...(sectionCardSx as any)}>
                      <SectionHeader index={0} />
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      <Field name="name">
                        {({ field, form }: any) => (
                          <FormControl isInvalid={form.errors.name && form.touched.name} isRequired>
                            <FormLabel>Product Name</FormLabel>
                            <Input {...field} placeholder="e.g. Wireless Headphones" />
                            <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="brand">
                        {({ field, form }: any) => (
                          <FormControl isInvalid={form.errors.brand && form.touched.brand}>
                            <FormLabel>Brand</FormLabel>
                            <Input {...field} placeholder="e.g. Sony" />
                            <FormErrorMessage>{form.errors.brand}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </SimpleGrid>
                    </Box>

                    <Box id="section-pricing" {...(sectionCardSx as any)}>
                      <SectionHeader index={1} />
                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                        <Field name="price">
                          {({ field, form }: any) => (
                            <FormControl isInvalid={form.errors.price && form.touched.price} isRequired>
                              <FormLabel>Price (Rs)</FormLabel>
                              <NumberInput
                                min={0}
                                onChange={(val) => form.setFieldValue(field.name, val)}
                                value={field.value}
                              >
                                <NumberInputField placeholder="0.00" />
                              </NumberInput>
                              <FormErrorMessage>{form.errors.price}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="taxRate">
                          {({ field, form }: any) => (
                            <FormControl isInvalid={form.errors.taxRate && form.touched.taxRate}>
                              <FormLabel>Tax Rate (%)</FormLabel>
                              <NumberInput
                                min={0}
                                max={100}
                                onChange={(val) => form.setFieldValue(field.name, val)}
                                value={field.value ?? 18}
                              >
                                <NumberInputField placeholder="18" />
                              </NumberInput>
                              <FormErrorMessage>{form.errors.taxRate}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="stock">
                          {({ field, form }: any) => (
                            <FormControl isInvalid={form.errors.stock && form.touched.stock} isRequired>
                              <FormLabel>Stock Quantity</FormLabel>
                              <NumberInput
                                min={0}
                                onChange={(val) => form.setFieldValue(field.name, val)}
                                value={field.value}
                              >
                                <NumberInputField placeholder="0" />
                              </NumberInput>
                              <FormErrorMessage>{form.errors.stock}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </SimpleGrid>

                      <Divider my={6} borderColor={cBorder} />

                    <Box mt={6}>
                      <FormLabel>Subcategories</FormLabel>
                      <FieldArray name="subCategories">
                        {({ push, remove }) => {
                          if (!props.values.category) {
                            return (
                              <Box color={cTextSoft} fontSize="sm">
                                Select a category first
                              </Box>
                            );
                          }

                          if (availableSubCategories.length === 0) {
                            return (
                              <Box color={cTextSoft} fontSize="sm">
                                No subcategories found
                              </Box>
                            );
                          }

                          return (
                            <VStack spacing={3} align="stretch">
                              {props.values.subCategories.map((sub: string, index: number) => (
                                <HStack key={index} align="start">
                                  <Field name={`subCategories[${index}]`}>
                                    {({ field, form }: any) => (
                                      <FormControl
                                        isInvalid={
                                          form.errors.subCategories?.[index] &&
                                          form.touched.subCategories?.[index]
                                        }
                                      >
                                        <Select {...field} placeholder="Select Subcategory">
                                          {availableSubCategories.map((subCat) => (
                                            <option key={subCat._id} value={subCat._id}>
                                              {subCat.name}
                                            </option>
                                          ))}
                                        </Select>
                                        <FormErrorMessage>
                                          {form.errors.subCategories?.[index]}
                                        </FormErrorMessage>
                                      </FormControl>
                                    )}
                                  </Field>
                                  <IconButton
                                    aria-label="Remove"
                                    icon={<FaTrash />}
                                    color={cDanger}
                                    bg="rgba(239, 107, 107, 0.12)"
                                    _hover={{ bg: "rgba(239, 107, 107, 0.20)" }}
                                    onClick={() => remove(index)}
                                  />
                                </HStack>
                              ))}
                              <Button
                                leftIcon={<FaPlus />}
                                size="sm"
                                variant="outline"
                                borderColor={cBorderStrong}
                                color={cAccentStrong}
                                _hover={{ bg: cAccentSoft }}
                                onClick={() => push("")}
                                alignSelf="flex-start"
                              >
                                Add Subcategory
                              </Button>
                            </VStack>
                          );
                        }}
                      </FieldArray>
                    </Box>
                  </Box>

                    <Box id="section-description" {...(sectionCardSx as any)}>
                      <SectionHeader index={2} />
                      <Field name="description">
                        {({ field, form }: any) => (
                          <FormControl
                            isInvalid={form.errors.description && form.touched.description}
                          >
                            <FormLabel>Product Story / Description</FormLabel>
                            <Textarea {...field} placeholder="Tell your customers about this amazing product..." rows={6} borderRadius="20px" />
                            <FormErrorMessage>{form.errors.description}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </Box>


                    <Box id="section-promotions" {...(sectionCardSx as any)}>
                      <SectionHeader index={3} />
                      <FormLabel>Active Offers</FormLabel>
                    {offersList.length === 0 ? (
                      <Text color={cTextSoft} fontSize="sm">
                        No offers available.
                      </Text>
                    ) : (
                      <VStack spacing={4} align="stretch">
                        {offersList.map((offer: any) => {
                          const selected = selectedOffers.find(
                            (item: any) => item.offerId === offer.offerId
                          );

                          return (
                            <Box
                              key={offer.offerId}
                              p={4}
                              borderWidth="1px"
                              borderRadius="18px"
                              borderColor={cBorderStrong}
                              bg={cSurfaceAlt}
                            >
                              <HStack justify="space-between" align="start">
                                <Checkbox isChecked={!!selected} onChange={() => toggleOffer(offer)}>
                                  {offer.name} ({offer.type})
                                </Checkbox>
                                {selected ? (
                                  <HStack>
                                    <Text fontSize="sm" color={cTextSoft}>
                                      Enabled
                                    </Text>
                                    <Switch
                                      isChecked={selected.isEnabled !== false}
                                      onChange={(event) =>
                                        updateOfferEnabled(offer.offerId, event.target.checked)
                                      }
                                    />
                                  </HStack>
                                ) : null}
                              </HStack>

                              {selected && offer.type === "discount" ? (
                                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mt={4}>
                                  <FormControl>
                                    <FormLabel fontSize="sm">Discount %</FormLabel>
                                    <NumberInput
                                      min={0}
                                      max={100}
                                      onChange={(val) =>
                                        updateOfferConfig(offer.offerId, "discountPercentage", val)
                                      }
                                      value={selected.config?.discountPercentage ?? ""}
                                    >
                                      <NumberInputField placeholder="e.g. 60" />
                                    </NumberInput>
                                  </FormControl>
                                  <FormControl>
                                    <FormLabel fontSize="sm">Max Discount (Rs)</FormLabel>
                                    <NumberInput
                                      min={0}
                                      onChange={(val) =>
                                        updateOfferConfig(offer.offerId, "maxDiscountAmount", val)
                                      }
                                      value={selected.config?.maxDiscountAmount ?? ""}
                                    >
                                      <NumberInputField placeholder="e.g. 120" />
                                    </NumberInput>
                                  </FormControl>
                                  <FormControl>
                                    <FormLabel fontSize="sm">Min Cart Value (Rs)</FormLabel>
                                    <NumberInput
                                      min={0}
                                      onChange={(val) =>
                                        updateOfferConfig(offer.offerId, "minCartValue", val)
                                      }
                                      value={selected.config?.minCartValue ?? ""}
                                    >
                                      <NumberInputField placeholder="e.g. 159" />
                                    </NumberInput>
                                  </FormControl>
                                </SimpleGrid>
                              ) : null}

                              {selected && offer.type === "buyXgetY" ? (
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={4}>
                                  <FormControl>
                                    <FormLabel fontSize="sm">Buy Quantity (X)</FormLabel>
                                    <NumberInput
                                      min={1}
                                      onChange={(val) =>
                                        updateOfferConfig(offer.offerId, "buyQuantity", val)
                                      }
                                      value={selected.config?.buyQuantity ?? ""}
                                    >
                                      <NumberInputField placeholder="e.g. 2" />
                                    </NumberInput>
                                  </FormControl>
                                  <FormControl>
                                    <FormLabel fontSize="sm">Get Quantity (Y)</FormLabel>
                                    <NumberInput
                                      min={1}
                                      onChange={(val) =>
                                        updateOfferConfig(offer.offerId, "getQuantity", val)
                                      }
                                      value={selected.config?.getQuantity ?? ""}
                                    >
                                      <NumberInputField placeholder="e.g. 1" />
                                    </NumberInput>
                                  </FormControl>
                                </SimpleGrid>
                              ) : null}

                              {selected && offer.type === "freebie" ? (
                                <Box mt={4}>
                                  <FormControl>
                                    <FormLabel fontSize="sm">Select Freebie Product</FormLabel>
                                    {selected.config?.freebieProductId ? (
                                      <HStack
                                        p={3}
                                        borderWidth="1px"
                                        borderRadius="16px"
                                        borderColor="rgba(70, 201, 139, 0.24)"
                                        bg="rgba(70, 201, 139, 0.10)"
                                        justify="space-between"
                                      >
                                        <HStack spacing={3}>
                                          <Image
                                            src={
                                              products.find((p) => p._id === selected.config?.freebieProductId)
                                                ?.images?.[0]?.preview ||
                                              products.find((p) => p._id === selected.config?.freebieProductId)
                                                ?.images?.[0] ||
                                              "https://via.placeholder.com/40x40?text=?"
                                            }
                                            alt="Freebie"
                                            boxSize="40px"
                                            objectFit="cover"
                                            borderRadius="md"
                                          />
                                          <Box>
                                            <Text fontWeight="medium" fontSize="sm" color={cText}>
                                              {products.find((p) => p._id === selected.config?.freebieProductId)?.name ||
                                                "Selected Product"}
                                            </Text>
                                            <Text fontSize="xs" color={cTextSoft}>
                                              Rs {products.find((p) => p._id === selected.config?.freebieProductId)?.price || "--"}
                                            </Text>
                                          </Box>
                                        </HStack>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          borderColor={cBorderStrong}
                                          color={cAccentStrong}
                                          _hover={{ bg: cAccentSoft }}
                                          onClick={() => openFreebieModal(offer.offerId)}
                                        >
                                          Change
                                        </Button>
                                      </HStack>
                                    ) : (
                                      <Button
                                        leftIcon={<Icon as={FaGift} />}
                                        variant="outline"
                                        size="md"
                                        w="full"
                                        borderColor={cBorderStrong}
                                        color={cAccentStrong}
                                        _hover={{ bg: cAccentSoft }}
                                        onClick={() => openFreebieModal(offer.offerId)}
                                      >
                                        Select Freebie Product
                                      </Button>
                                    )}
                                  </FormControl>

                                  <FreebieProductModal
                                    isOpen={
                                      isFreebieModalOpen &&
                                      freebieModalTargetOfferRef.current === offer.offerId
                                    }
                                    onClose={() => setIsFreebieModalOpen(false)}
                                    products={products.filter((p) => p._id !== props.values._id)}
                                    selectedProductId={selected.config?.freebieProductId}
                                    onSelect={(product) => {
                                      updateOfferConfig(offer.offerId, "freebieProductId", product._id);
                                      updateOfferConfig(offer.offerId, "freebieProductName", product.name);
                                    }}
                                  />
                                </Box>
                              ) : null}
                            </Box>
                          );
                        })}
                      </VStack>
                    )}
                  </Box>

                    <Box id="section-config" {...(sectionCardSx as any)}>
                      <SectionHeader index={4} />
                      <VStack spacing={6} align="stretch">
                        <Field name="tags">
                          {({ form }: any) => (
                            <FormControl>
                              <FormLabel>Search Tags</FormLabel>
                              <Input
                                placeholder="e.g. summer, sale, organic (press comma to separate)"
                                value={form.values.tags ? form.values.tags.join(", ") : ""}
                                onChange={(event) => {
                                  const tags = event.target.value
                                    .split(",")
                                    .map((tag: string) => tag.trim())
                                    .filter(Boolean);
                                  form.setFieldValue("tags", tags);
                                }}
                              />
                              <Text fontSize="xs" color={cTextSoft} mt={1.5}>
                                Tags help customers find your product more easily in search results.
                              </Text>
                            </FormControl>
                          )}
                        </Field>

                        <Divider borderColor={cBorder} />
                        <FormLabel>Variants</FormLabel>
                        <FieldArray name="variants">
                          {({ push, remove, form }: any) => (
                            <VStack spacing={4} align="stretch" width="100%">
                              {form.values.variants?.length > 0
                                ? form.values.variants.map((variant: any, index: number) => (
                                    <Box
                                      key={index}
                                      p={4}
                                      borderWidth="1px"
                                      borderRadius="18px"
                                      borderColor={cBorderStrong}
                                      bg={cSurfaceAlt}
                                    >
                                      <HStack justify="space-between" mb={2}>
                                        <Text fontWeight="bold" color={cText}>
                                          Variant #{index + 1}
                                        </Text>
                                        <IconButton
                                          aria-label="Remove variant"
                                          icon={<FaTrash />}
                                          size="sm"
                                          color={cDanger}
                                          bg="rgba(239, 107, 107, 0.12)"
                                          _hover={{ bg: "rgba(239, 107, 107, 0.20)" }}
                                          onClick={() => remove(index)}
                                        />
                                      </HStack>

                                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                        <Field name={`variants.${index}.name`}>
                                          {({ field }: any) => (
                                            <FormControl isRequired>
                                              <FormLabel fontSize="sm">Variant Name</FormLabel>
                                              <Input {...field} placeholder="e.g. Size, Color" />
                                            </FormControl>
                                          )}
                                        </Field>
                                        <Field name={`variants.${index}.options`}>
                                          {({ form }: any) => (
                                            <FormControl isRequired>
                                              <FormLabel fontSize="sm">Options (Comma separated)</FormLabel>
                                              <Input
                                                placeholder="e.g. S, M, L or Red, Blue"
                                                value={
                                                  form.values.variants[index].options
                                                    ? form.values.variants[index].options.join(", ")
                                                    : ""
                                                }
                                                onChange={(event) => {
                                                  const options = event.target.value
                                                    .split(",")
                                                    .map((opt: string) => opt.trim())
                                                    .filter(Boolean);
                                                  form.setFieldValue(`variants.${index}.options`, options);
                                                }}
                                              />
                                            </FormControl>
                                          )}
                                        </Field>
                                      </SimpleGrid>
                                    </Box>
                                  ))
                                : null}

                              <Button
                                leftIcon={<FaPlus />}
                                onClick={() => push({ name: "", options: [] })}
                                size="sm"
                                alignSelf="flex-start"
                                variant="outline"
                                borderColor={cBorderStrong}
                                color={cAccentStrong}
                                _hover={{ bg: cAccentSoft }}
                              >
                                Add Variant
                              </Button>
                            </VStack>
                          )}
                        </FieldArray>
                      </VStack>
                    </Box>

                    <Box id="section-media" {...(sectionCardSx as any)}>
                      <SectionHeader index={5} />
                      <FormControl isInvalid={!!(props.errors.images && props.touched.images)}>
                        <FormLabel>Product Showcase / Images</FormLabel>
                        <HStack spacing={4} wrap="wrap">
                          {props.values.images.map((img: any, index: number) => (
                            <Box key={index} position="relative" boxSize="100px">
                              <Image
                                src={img.preview || img}
                                alt={`Product ${index}`}
                                boxSize="100%"
                                objectFit="cover"
                                borderRadius="20px"
                                boxShadow="sm"
                              />
                              <IconButton
                                aria-label="Remove image"
                                icon={<FaTrash />}
                                size="xs"
                                bg="rgba(248, 113, 113, 0.12)"
                                color={cDanger}
                                _hover={{ bg: "rgba(248, 113, 113, 0.20)" }}
                                position="absolute"
                                top={-2}
                                right={-2}
                                onClick={() => {
                                  const nextImages = props.values.images.filter(
                                    (_: any, imageIndex: number) => imageIndex !== index
                                  );
                                  props.setFieldValue("images", nextImages);
                                }}
                                borderRadius="full"
                              />
                            </Box>
                          ))}
                          <Center
                            boxSize="100px"
                            border="2px dashed"
                            borderColor={cBorderStrong}
                            borderRadius="20px"
                            cursor="pointer"
                            bg={cSurfaceAlt}
                            _hover={{ bg: cAccentSoft, borderColor: cAccent, color: cAccent }}
                            onClick={() => fileInputRef.current?.click()}
                            transition="all 0.2s"
                          >
                            <VStack spacing={1}>
                              <Icon as={FaUpload} boxSize={5} />
                              <Text fontSize="10px" fontWeight="700">UPLOAD</Text>
                            </VStack>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              ref={fileInputRef}
                              style={{ display: "none" }}
                              onChange={(e) => handleImageUpload(e, props.setFieldValue, props.values.images)}
                            />
                          </Center>
                        </HStack>
                        {props.errors.images && props.touched.images && (
                          <Text color={cDanger} fontSize="xs" mt={2}>
                            {props.errors.images as string}
                          </Text>
                        )}
                      </FormControl>
                    </Box>

                    {/* Form Actions Footer */}
                    <Box pt={4} pb={6}>
                      <Divider mb={8} borderColor={cBorder} />
                      <HStack justify="flex-end" spacing={4}>
                        <Button
                          variant="ghost"
                          onClick={onClose}
                          borderRadius="18px"
                          h="54px"
                          px={8}
                          color={cTextMuted}
                          _hover={{ bg: cSurfaceSoft, color: cText }}
                        >
                          Discard
                        </Button>
                        <Button
                          type="submit"
                          isLoading={props.isSubmitting}
                          bgGradient={dashboardHeroGradientLight}
                          color="white"
                          borderRadius="20px"
                          h="54px"
                          px={10}
                          fontWeight="700"
                          leftIcon={<Icon as={isEdit ? FaSave : FaPlus} />}
                          boxShadow="0 10px 24px rgba(37,99,235,0.3)"
                          _hover={{ 
                            transform: "translateY(-2px)", 
                            boxShadow: "0 14px 30px rgba(37,99,235,0.42)" 
                          }}
                          _active={{ transform: "scale(0.98)" }}
                        >
                          {isEdit ? "Update Changes" : "Publish Product"}
                        </Button>
                      </HStack>
                    </Box>
                  </VStack>
                </Flex>
              </Form>
            );
          }}
        </Formik>
        </Box>
      </Box>
    </CustomDrawer>
  );
};

export default ProductForm;
