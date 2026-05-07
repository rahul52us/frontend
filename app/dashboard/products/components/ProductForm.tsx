"use client";

import { CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  Portal,
  Select,
  SimpleGrid,
  SlideFade,
  Spinner,
  Switch,
  Text,
  Textarea,
  useBreakpointValue,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Field, FieldArray, Form, Formik } from "formik";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FaBoxOpen,
  FaChevronRight,
  FaCogs,
  FaFileAlt,
  FaGift,
  FaImage,
  FaInfoCircle,
  FaPlus,
  FaRupeeSign,
  FaSave,
  FaStar,
  FaTag,
  FaTrash,
  FaUpload,
} from "react-icons/fa";
import { buildBase64ImageUpload } from "../../../config/utils/imageUpload";
import { dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";
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

type SectionId =
  | "basic"
  | "pricing"
  | "description"
  | "promotions"
  | "config"
  | "media";

type SectionTint = "sage" | "green" | "cyan" | "violet" | "indigo" | "rose";

const FORM_SECTIONS: {
  id: SectionId;
  title: string;
  subtitle: string;
  icon: any;
  tint: SectionTint;
}[] = [
  { id: "basic", title: "Basic Details", subtitle: "Identity of the product", icon: FaInfoCircle, tint: "sage" },
  { id: "pricing", title: "Pricing & Stock", subtitle: "Set price, tax and inventory", icon: FaRupeeSign, tint: "green" },
  { id: "description", title: "Description", subtitle: "Tell customers what makes it great", icon: FaFileAlt, tint: "cyan" },
  { id: "promotions", title: "Promotions", subtitle: "Discounts, freebies, offers", icon: FaGift, tint: "violet" },
  { id: "config", title: "Variants & Tags", subtitle: "Configurations and labels", icon: FaCogs, tint: "indigo" },
  { id: "media", title: "Product Media", subtitle: "Photos that sell the item", icon: FaImage, tint: "rose" },
];

const SECTION_TONES = {
  light: {
    sage: { bg: "#E8F7F1", color: "#1D7A61", soft: "rgba(29, 122, 97, 0.08)" },
    green: { bg: "#ECFDF5", color: "#15803D", soft: "rgba(21, 128, 61, 0.08)" },
    cyan: { bg: "#ECFEFF", color: "#0E7490", soft: "rgba(14, 116, 144, 0.08)" },
    violet: { bg: "#F5F3FF", color: "#6D28D9", soft: "rgba(109, 40, 217, 0.08)" },
    indigo: { bg: "#EEF2FF", color: "#4338CA", soft: "rgba(67, 56, 202, 0.08)" },
    rose: { bg: "#FFF1F2", color: "#BE123C", soft: "rgba(190, 18, 60, 0.08)" },
  },
  dark: {
    sage: { bg: "rgba(45, 212, 191, 0.14)", color: "#7DD3C7", soft: "rgba(45, 212, 191, 0.08)" },
    green: { bg: "rgba(16, 185, 129, 0.14)", color: "#6EE7B7", soft: "rgba(16, 185, 129, 0.08)" },
    cyan: { bg: "rgba(34, 211, 238, 0.14)", color: "#67E8F9", soft: "rgba(34, 211, 238, 0.08)" },
    violet: { bg: "rgba(139, 92, 246, 0.14)", color: "#C4B5FD", soft: "rgba(139, 92, 246, 0.08)" },
    indigo: { bg: "rgba(99, 102, 241, 0.16)", color: "#A5B4FC", soft: "rgba(99, 102, 241, 0.08)" },
    rose: { bg: "rgba(244, 63, 94, 0.14)", color: "#FDA4AF", soft: "rgba(244, 63, 94, 0.08)" },
  },
} as const;

const getProductImage = (image: any) => image?.preview || image || "https://via.placeholder.com/600x600?text=Product";

const getErrorText = (error: unknown) => (typeof error === "string" ? error : undefined);

const buildTouchedState = (errors: any): any => {
  if (Array.isArray(errors)) {
    return errors.map((item) => buildTouchedState(item));
  }

  if (errors && typeof errors === "object") {
    return Object.fromEntries(
      Object.entries(errors).map(([key, value]) => [key, buildTouchedState(value)])
    );
  }

  return true;
};

const collectErrorMessages = (errors: Record<string, any>): string[] => {
  if (!errors || typeof errors !== "object") {
    return [];
  }

  const messages: string[] = [];

  Object.values(errors).forEach((value) => {
    if (typeof value === "string") {
      messages.push(value);
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (typeof item === "string") {
          messages.push(item);
        } else if (item && typeof item === "object") {
          messages.push(...collectErrorMessages(item));
        }
      });
      return;
    }

    if (value && typeof value === "object") {
      messages.push(...collectErrorMessages(value));
    }
  });

  return messages;
};

const DRAWER_TRANSITION_MS = 260;

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
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const freebieModalTargetOfferRef = useRef<string | null>(null);
  const objectUrlsRef = useRef<string[]>([]);

  const [activeSection, setActiveSection] = useState<SectionId>("basic");
  const [tagInput, setTagInput] = useState("");
  const [isFreebieModalOpen, setIsFreebieModalOpen] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  const isDesktop = useBreakpointValue({ base: false, md: true }) ?? false;
  const isDark = useColorModeValue(false, true);
  const overlayBg = useColorModeValue("rgba(15, 23, 42, 0.24)", "rgba(2, 6, 23, 0.62)");
  const shell = useColorModeValue("white", dashboardPalette.shell);
  const surface = useColorModeValue("white", dashboardPalette.surface);
  const surfaceMuted = useColorModeValue("#F8FAFC", dashboardPalette.surfaceAlt);
  const surfaceSoft = useColorModeValue("#F1F5F9", dashboardPalette.surfaceSoft);
  const border = useColorModeValue("#E2E8F0", dashboardPalette.border);
  const borderStrong = useColorModeValue("#CBD5E1", dashboardPalette.borderStrong);
  const text = useColorModeValue("#0F172A", dashboardPalette.text);
  const textMuted = useColorModeValue("#64748B", dashboardPalette.textMuted);
  const textSoft = useColorModeValue("#94A3B8", dashboardPalette.textSoft);
  const accent = useColorModeValue("#2563EB", dashboardPalette.accent);
  const accentStrong = useColorModeValue("#1D4ED8", dashboardPalette.accentStrong);
  const accentSoft = useColorModeValue("rgba(37, 99, 235, 0.08)", dashboardPalette.accentSoft);
  const success = useColorModeValue("#15803D", dashboardPalette.success);
  const successSoft = useColorModeValue("rgba(34, 197, 94, 0.12)", dashboardPalette.successSoft);
  const danger = useColorModeValue("#DC2626", dashboardPalette.danger);
  const dangerSoft = useColorModeValue("rgba(239, 68, 68, 0.10)", dashboardPalette.dangerSoft);
  const warningSoft = useColorModeValue("rgba(234, 88, 12, 0.10)", dashboardPalette.warningSoft);
  const sheetShadow = useColorModeValue("0 28px 60px rgba(37, 99, 235, 0.12)", "0 40px 72px rgba(2, 6, 23, 0.34)");
  const heroGradient = useColorModeValue(
    "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
    "linear-gradient(135deg, #102349 0%, #173B7A 100%)"
  );

  const sectionIndex = useMemo(
    () => FORM_SECTIONS.findIndex((section) => section.id === activeSection),
    [activeSection]
  );

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);

      const frame = window.requestAnimationFrame(() => {
        setIsVisible(true);
      });

      return () => {
        window.cancelAnimationFrame(frame);
      };
    }

    setIsVisible(false);

    const timeout = window.setTimeout(() => {
      setShouldRender(false);
    }, DRAWER_TRANSITION_MS);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!shouldRender || typeof document === "undefined") {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [shouldRender]);

  useEffect(() => {
    if (!shouldRender || typeof window === "undefined") {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [shouldRender, onClose]);

  useEffect(() => {
    if (isOpen) {
      setActiveSection("basic");
      setTagInput("");
    }
  }, [isOpen, initialValues?._id]);

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current = [];
    };
  }, []);

  if (!shouldRender) {
    return null;
  }

  const sectionTone = (tint: SectionTint) =>
    isDark ? SECTION_TONES.dark[tint] : SECTION_TONES.light[tint];

  const sharedInputStyles = {
    bg: surfaceMuted,
    borderColor: borderStrong,
    color: text,
    borderRadius: "18px",
    _placeholder: { color: textSoft },
    _hover: { borderColor: accent },
    _focusVisible: {
      borderColor: accent,
      boxShadow: `0 0 0 1px ${accent}`,
      bg: surface,
    },
  };

  const selectMenuSx = {
    option: {
      color: isDark ? dashboardPalette.text : "#0F172A",
      backgroundColor: isDark ? dashboardPalette.shell : "#FFFFFF",
    },
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void,
    currentImages: any[]
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) {
      return;
    }

    setIsUploadingImages(true);

    try {
      const uploads = await Promise.all(
        files.map(async (file) => {
          const payload = await buildBase64ImageUpload(file, { isAdd: 1, isDeleted: 0 });
          const preview = URL.createObjectURL(file);
          objectUrlsRef.current.push(preview);
          return { ...payload, preview };
        })
      );

      setFieldValue("images", [...currentImages, ...uploads]);
    } catch (error: any) {
      toast({
        title: "Image upload failed",
        description: error?.message || "We could not process the selected image files.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsUploadingImages(false);
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  const showValidationToast = (errors: Record<string, any>) => {
    const messages = collectErrorMessages(errors);
    if (messages.length === 0) {
      return;
    }

    toast({
      title: "Please fix the highlighted fields",
      description: (
        <VStack align="start" spacing={1} mt={1}>
          {messages.slice(0, 5).map((message, index) => (
            <Text key={`${message}-${index}`} fontSize="sm">
              - {message}
            </Text>
          ))}
          {messages.length > 5 ? (
            <Text fontSize="sm" opacity={0.8}>
              ...and {messages.length - 5} more
            </Text>
          ) : null}
        </VStack>
      ),
      status: "error",
      duration: 5500,
      isClosable: true,
      position: "top",
    });
  };

  return (
    <Portal>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
          {(formik) => {
            const rootCategories = categories.filter((category) => !category.parent);
            const availableSubCategories = categories.filter(
              (category) =>
                category.parent &&
                (category.parent?._id === formik.values.category ||
                  category.parent === formik.values.category)
            );
            const selectedOffers = Array.isArray(formik.values.offers) ? formik.values.offers : [];
            const activeSectionConfig = FORM_SECTIONS.find((section) => section.id === activeSection) || FORM_SECTIONS[0];
            const activeTone = sectionTone(activeSectionConfig.tint);

            const toggleOffer = (offer: any) => {
              const currentIndex = selectedOffers.findIndex((item: any) => item.offerId === offer.offerId);

              if (currentIndex >= 0) {
                formik.setFieldValue(
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
                    : { freebieProductId: "", freebieProductName: "" };

              formik.setFieldValue("offers", [
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
              const currentIndex = selectedOffers.findIndex((item: any) => item.offerId === offerId);
              if (currentIndex < 0) {
                return;
              }

              formik.setFieldValue(`offers[${currentIndex}].config.${key}`, value);
            };

            const updateOfferEnabled = (offerId: string, enabled: boolean) => {
              const currentIndex = selectedOffers.findIndex((item: any) => item.offerId === offerId);
              if (currentIndex < 0) {
                return;
              }

              formik.setFieldValue(`offers[${currentIndex}].isEnabled`, enabled);
            };

            const openFreebieModal = (offerId: string) => {
              freebieModalTargetOfferRef.current = offerId;
              setIsFreebieModalOpen(true);
            };

            const addTag = () => {
              const nextTag = tagInput.trim();
              if (!nextTag) {
                return;
              }

              const nextTags = Array.isArray(formik.values.tags) ? [...formik.values.tags] : [];
              const hasTag = nextTags.some(
                (tag: string) => tag.toLowerCase() === nextTag.toLowerCase()
              );

              if (!hasTag) {
                formik.setFieldValue("tags", [...nextTags, nextTag]);
              }

              setTagInput("");
            };

            const removeTag = (tagToRemove: string) => {
              formik.setFieldValue(
                "tags",
                (formik.values.tags || []).filter((tag: string) => tag !== tagToRemove)
              );
            };

            const handleSubmitClick = async () => {
              const errors = await formik.validateForm();

              if (Object.keys(errors).length > 0) {
                formik.setTouched(buildTouchedState(errors));
                showValidationToast(errors);
                return;
              }

              await formik.submitForm();
            };

            const goToNextSection = () => {
              if (sectionIndex >= FORM_SECTIONS.length - 1) {
                return;
              }

              setActiveSection(FORM_SECTIONS[sectionIndex + 1].id);
            };

            const goToPreviousSection = () => {
              if (sectionIndex <= 0) {
                return;
              }

              setActiveSection(FORM_SECTIONS[sectionIndex - 1].id);
            };

            const renderMetaEditor = (
              fieldName: "productDetails" | "information",
              label: string,
              hint: string
            ) => (
              <FieldArray name={fieldName}>
                {({ push, remove }) => (
                  <VStack align="stretch" spacing={3}>
                    <HStack justify="space-between" align="center">
                      <Box>
                        <Text fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="0.12em" color={textSoft}>
                          {label}
                        </Text>
                        <Text mt={1} fontSize="sm" color={textMuted}>
                          {hint}
                        </Text>
                      </Box>
                      <Button
                        type="button"
                        leftIcon={<FaPlus />}
                        size="sm"
                        borderRadius="full"
                        variant="ghost"
                        color={accentStrong}
                        _hover={{ bg: accentSoft }}
                        onClick={() => push({ key: "", value: "" })}
                      >
                        Add row
                      </Button>
                    </HStack>

                    {(formik.values[fieldName] || []).length > 0 ? (
                      <VStack align="stretch" spacing={2}>
                        {(formik.values[fieldName] || []).map((row: any, index: number) => (
                          <HStack key={`${fieldName}-${index}`} align="start" spacing={2}>
                            <FormControl
                              isInvalid={Boolean(
                                (formik.errors as any)[fieldName]?.[index]?.key &&
                                  (formik.touched as any)[fieldName]?.[index]?.key
                              )}
                            >
                              <Input
                                value={row?.key || ""}
                                placeholder="Label"
                                {...sharedInputStyles}
                                onChange={(event) =>
                                  formik.setFieldValue(`${fieldName}[${index}].key`, event.target.value)
                                }
                              />
                              <FormErrorMessage>
                                {getErrorText((formik.errors as any)[fieldName]?.[index]?.key)}
                              </FormErrorMessage>
                            </FormControl>

                            <FormControl
                              isInvalid={Boolean(
                                (formik.errors as any)[fieldName]?.[index]?.value &&
                                  (formik.touched as any)[fieldName]?.[index]?.value
                              )}
                            >
                              <Input
                                value={row?.value || ""}
                                placeholder="Value"
                                {...sharedInputStyles}
                                onChange={(event) =>
                                  formik.setFieldValue(`${fieldName}[${index}].value`, event.target.value)
                                }
                              />
                              <FormErrorMessage>
                                {getErrorText((formik.errors as any)[fieldName]?.[index]?.value)}
                              </FormErrorMessage>
                            </FormControl>

                            <IconButton
                              aria-label={`Remove ${label} row`}
                              icon={<FaTrash />}
                              borderRadius="18px"
                              bg={dangerSoft}
                              color={danger}
                              _hover={{ bg: dangerSoft }}
                              _active={{ transform: "scale(0.96)" }}
                              onClick={() => remove(index)}
                            />
                          </HStack>
                        ))}
                      </VStack>
                    ) : (
                      <Box borderRadius="22px" borderWidth="1px" borderColor={border} bg={surfaceMuted} px={4} py={4}>
                        <Text fontSize="sm" color={textMuted}>
                          No rows added yet.
                        </Text>
                      </Box>
                    )}
                  </VStack>
                )}
              </FieldArray>
            );

            const renderSectionContent = (sectionId: SectionId) => {
              switch (sectionId) {
                case "basic":
                  return (
                    <VStack align="stretch" spacing={5}>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <Field name="name">
                          {({ field, form }: any) => (
                            <FormControl isRequired isInvalid={Boolean(form.errors.name && form.touched.name)}>
                              <FormLabel>Product name</FormLabel>
                              <Input {...field} placeholder="e.g. Wireless headphones" {...sharedInputStyles} />
                              <FormErrorMessage>{getErrorText(form.errors.name)}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>

                        <Field name="brand">
                          {({ field, form }: any) => (
                            <FormControl isInvalid={Boolean(form.errors.brand && form.touched.brand)}>
                              <FormLabel>Brand</FormLabel>
                              <Input {...field} placeholder="e.g. Sony" {...sharedInputStyles} />
                              <FormErrorMessage>{getErrorText(form.errors.brand)}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>

                        <Field name="sku">
                          {({ field, form }: any) => (
                            <FormControl isInvalid={Boolean(form.errors.sku && form.touched.sku)}>
                              <FormLabel>SKU</FormLabel>
                              <Input {...field} placeholder="e.g. SKU-00123" {...sharedInputStyles} />
                              <FormErrorMessage>{getErrorText(form.errors.sku)}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>

                        <Field name="category">
                          {({ field, form }: any) => (
                            <FormControl isRequired isInvalid={Boolean(form.errors.category && form.touched.category)}>
                              <FormLabel>Category</FormLabel>
                              <Select
                                {...field}
                                placeholder="Select category"
                                {...sharedInputStyles}
                                sx={selectMenuSx}
                                onChange={(event) => {
                                  form.setFieldValue("category", event.target.value);
                                  form.setFieldValue("subCategories", []);
                                }}
                              >
                                {rootCategories.map((category: any) => (
                                  <option key={category._id} value={category._id}>
                                    {category.name}
                                  </option>
                                ))}
                              </Select>
                              <FormErrorMessage>{getErrorText(form.errors.category)}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>

                        <Field name="weight">
                          {({ field, form }: any) => (
                            <FormControl isInvalid={Boolean(form.errors.weight && form.touched.weight)}>
                              <FormLabel>Weight</FormLabel>
                              <Input {...field} placeholder="e.g. 250g" {...sharedInputStyles} />
                              <FormErrorMessage>{getErrorText(form.errors.weight)}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </SimpleGrid>

                      <Divider borderColor={border} />

                      <FieldArray name="subCategories">
                        {({ push, remove }) => (
                          <VStack align="stretch" spacing={3}>
                            <HStack justify="space-between" align="center">
                              <Box>
                                <Text fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="0.12em" color={textSoft}>
                                  Subcategories
                                </Text>
                                <Text mt={1} fontSize="sm" color={textMuted}>
                                  Select one or more subcategories for better discoverability.
                                </Text>
                              </Box>
                              <Button
                                type="button"
                                leftIcon={<FaPlus />}
                                size="sm"
                                borderRadius="full"
                                variant="ghost"
                                color={accentStrong}
                                _hover={{ bg: accentSoft }}
                                onClick={() => push("")}
                                isDisabled={!formik.values.category || availableSubCategories.length === 0}
                              >
                                Add
                              </Button>
                            </HStack>

                            {!formik.values.category ? (
                              <Box borderRadius="22px" borderWidth="1px" borderColor={border} bg={surfaceMuted} px={4} py={4}>
                                <Text fontSize="sm" color={textMuted}>
                                  Choose a category first to load subcategories.
                                </Text>
                              </Box>
                            ) : availableSubCategories.length === 0 ? (
                              <Box borderRadius="22px" borderWidth="1px" borderColor={border} bg={surfaceMuted} px={4} py={4}>
                                <Text fontSize="sm" color={textMuted}>
                                  No subcategories are available for this category yet.
                                </Text>
                              </Box>
                            ) : formik.values.subCategories?.length > 0 ? (
                              <VStack align="stretch" spacing={2}>
                                {formik.values.subCategories.map((subCategory: string, index: number) => (
                                  <HStack key={`subcategory-${index}`} align="start" spacing={2}>
                                    <FormControl
                                      isInvalid={Boolean(
                                        (formik.errors as any).subCategories?.[index] &&
                                          (formik.touched as any).subCategories?.[index]
                                      )}
                                    >
                                      <Select
                                        value={subCategory}
                                        placeholder="Select subcategory"
                                        {...sharedInputStyles}
                                        sx={selectMenuSx}
                                        onChange={(event) =>
                                          formik.setFieldValue(`subCategories[${index}]`, event.target.value)
                                        }
                                      >
                                        {availableSubCategories.map((category: any) => (
                                          <option key={category._id} value={category._id}>
                                            {category.name}
                                          </option>
                                        ))}
                                      </Select>
                                      <FormErrorMessage>
                                        {getErrorText((formik.errors as any).subCategories?.[index])}
                                      </FormErrorMessage>
                                    </FormControl>

                                    <IconButton
                                      aria-label="Remove subcategory"
                                      icon={<FaTrash />}
                                      borderRadius="18px"
                                      bg={dangerSoft}
                                      color={danger}
                                      _hover={{ bg: dangerSoft }}
                                      _active={{ transform: "scale(0.96)" }}
                                      onClick={() => remove(index)}
                                    />
                                  </HStack>
                                ))}
                              </VStack>
                            ) : (
                              <Box borderRadius="22px" borderWidth="1px" borderColor={border} bg={surfaceMuted} px={4} py={4}>
                                <Text fontSize="sm" color={textMuted}>
                                  No subcategory selected yet.
                                </Text>
                              </Box>
                            )}
                          </VStack>
                        )}
                      </FieldArray>
                    </VStack>
                  );

                case "pricing":
                  return (
                    <VStack align="stretch" spacing={5}>
                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                        <Field name="price">
                          {({ field, form }: any) => (
                            <FormControl isRequired isInvalid={Boolean(form.errors.price && form.touched.price)}>
                              <FormLabel>Price (Rs)</FormLabel>
                              <Input {...field} type="number" min={0} step="0.01" placeholder="0.00" {...sharedInputStyles} />
                              <FormErrorMessage>{getErrorText(form.errors.price)}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>

                        <Field name="discountPrice">
                          {({ field, form }: any) => (
                            <FormControl isInvalid={Boolean(form.errors.discountPrice && form.touched.discountPrice)}>
                              <FormLabel>Discount price (Rs)</FormLabel>
                              <Input {...field} type="number" min={0} step="0.01" placeholder="0.00" {...sharedInputStyles} />
                              <FormErrorMessage>{getErrorText(form.errors.discountPrice)}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>

                        <Field name="taxRate">
                          {({ field, form }: any) => (
                            <FormControl isInvalid={Boolean(form.errors.taxRate && form.touched.taxRate)}>
                              <FormLabel>Tax rate (%)</FormLabel>
                              <Input {...field} type="number" min={0} max={100} placeholder="18" {...sharedInputStyles} />
                              <FormErrorMessage>{getErrorText(form.errors.taxRate)}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </SimpleGrid>

                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <Field name="stock">
                          {({ field, form }: any) => (
                            <FormControl isRequired isInvalid={Boolean(form.errors.stock && form.touched.stock)}>
                              <FormLabel>Stock quantity</FormLabel>
                              <Input {...field} type="number" min={0} placeholder="0" {...sharedInputStyles} />
                              <FormErrorMessage>{getErrorText(form.errors.stock)}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>

                        <Box borderRadius="24px" borderWidth="1px" borderColor={border} bg={surfaceMuted} px={4} py={4}>
                          <Text fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="0.12em" color={textSoft}>
                            Inventory note
                          </Text>
                          <Text mt={2} fontSize="sm" color={textMuted}>
                            Use whole numbers for stock. Discount price can be left empty if the product is not on sale.
                          </Text>
                        </Box>
                      </SimpleGrid>
                    </VStack>
                  );

                case "description":
                  return (
                    <VStack align="stretch" spacing={5}>
                      <Field name="description">
                        {({ field, form }: any) => (
                          <FormControl isInvalid={Boolean(form.errors.description && form.touched.description)}>
                            <FormLabel>Product description</FormLabel>
                            <Textarea
                              {...field}
                              rows={7}
                              resize="vertical"
                              placeholder="Describe what makes this product useful, premium, or special."
                              {...sharedInputStyles}
                            />
                            <FormErrorMessage>{getErrorText(form.errors.description)}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Divider borderColor={border} />
                      {renderMetaEditor("productDetails", "Specifications", "Add product specs like material, dimensions, or color.")}
                      <Divider borderColor={border} />
                      {renderMetaEditor("information", "Additional information", "Add extra notes like care instructions or package contents.")}
                    </VStack>
                  );

                case "promotions":
                  return (
                    <VStack align="stretch" spacing={5}>
                      <Box borderRadius="24px" borderWidth="1px" borderColor={border} bg={surfaceMuted} px={4} py={4}>
                        <HStack justify="space-between" align="center" spacing={4}>
                          <HStack align="start" spacing={3}>
                            <Center boxSize="42px" borderRadius="16px" bg={warningSoft} color="#C2410C">
                              <FaStar />
                            </Center>
                            <Box>
                              <Text fontSize="sm" fontWeight="700" color={text}>
                                Mark as featured
                              </Text>
                              <Text mt={1} fontSize="sm" color={textMuted}>
                                Featured products surface more prominently in your catalog.
                              </Text>
                            </Box>
                          </HStack>
                          <Switch
                            isChecked={Boolean(formik.values.isFeatured)}
                            onChange={(event) => formik.setFieldValue("isFeatured", event.target.checked)}
                          />
                        </HStack>
                      </Box>

                      <Box>
                        <Text fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="0.12em" color={textSoft}>
                          Active offers
                        </Text>
                        <Text mt={1} fontSize="sm" color={textMuted}>
                          Attach discount campaigns, buy X get Y offers, or freebies to this product.
                        </Text>
                      </Box>

                      {offersList.length === 0 ? (
                        <Box borderRadius="24px" borderWidth="1px" borderColor={border} bg={surfaceMuted} px={4} py={5}>
                          <Text fontSize="sm" color={textMuted}>
                            No active offers are available right now.
                          </Text>
                        </Box>
                      ) : (
                        <VStack align="stretch" spacing={3}>
                          {offersList.map((offer: any) => {
                            const selected = selectedOffers.find((item: any) => item.offerId === offer.offerId);

                            return (
                              <Box
                                key={offer.offerId}
                                borderRadius="24px"
                                borderWidth="1px"
                                borderColor={selected ? accent : border}
                                bg={selected ? accentSoft : surfaceMuted}
                                px={4}
                                py={4}
                              >
                                <HStack justify="space-between" align="start" spacing={3}>
                                  <Box flex="1">
                                    <Checkbox isChecked={Boolean(selected)} onChange={() => toggleOffer(offer)}>
                                      <Text fontWeight="700" color={text}>
                                        {offer.name}
                                      </Text>
                                    </Checkbox>
                                    <Text mt={2} fontSize="sm" color={textMuted}>
                                      {(offer.description || "").trim() || `Offer type: ${offer.type}`}
                                    </Text>
                                  </Box>

                                  {selected ? (
                                    <VStack align="end" spacing={1}>
                                      <Text fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="0.12em" color={textSoft}>
                                        Enabled
                                      </Text>
                                      <Switch
                                        isChecked={selected.isEnabled !== false}
                                        onChange={(event) =>
                                          updateOfferEnabled(offer.offerId, event.target.checked)
                                        }
                                      />
                                    </VStack>
                                  ) : null}
                                </HStack>

                                {selected && offer.type === "discount" ? (
                                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3} mt={4}>
                                    <FormControl>
                                      <FormLabel>Discount %</FormLabel>
                                      <Input
                                        type="number"
                                        min={0}
                                        max={100}
                                        value={selected.config?.discountPercentage ?? ""}
                                        placeholder="e.g. 20"
                                        {...sharedInputStyles}
                                        onChange={(event) =>
                                          updateOfferConfig(offer.offerId, "discountPercentage", event.target.value)
                                        }
                                      />
                                    </FormControl>
                                    <FormControl>
                                      <FormLabel>Max discount (Rs)</FormLabel>
                                      <Input
                                        type="number"
                                        min={0}
                                        value={selected.config?.maxDiscountAmount ?? ""}
                                        placeholder="e.g. 500"
                                        {...sharedInputStyles}
                                        onChange={(event) =>
                                          updateOfferConfig(offer.offerId, "maxDiscountAmount", event.target.value)
                                        }
                                      />
                                    </FormControl>
                                    <FormControl>
                                      <FormLabel>Min cart value (Rs)</FormLabel>
                                      <Input
                                        type="number"
                                        min={0}
                                        value={selected.config?.minCartValue ?? ""}
                                        placeholder="e.g. 999"
                                        {...sharedInputStyles}
                                        onChange={(event) =>
                                          updateOfferConfig(offer.offerId, "minCartValue", event.target.value)
                                        }
                                      />
                                    </FormControl>
                                  </SimpleGrid>
                                ) : null}

                                {selected && offer.type === "buyXgetY" ? (
                                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} mt={4}>
                                    <FormControl>
                                      <FormLabel>Buy quantity (X)</FormLabel>
                                      <Input
                                        type="number"
                                        min={1}
                                        value={selected.config?.buyQuantity ?? ""}
                                        placeholder="e.g. 2"
                                        {...sharedInputStyles}
                                        onChange={(event) =>
                                          updateOfferConfig(offer.offerId, "buyQuantity", event.target.value)
                                        }
                                      />
                                    </FormControl>
                                    <FormControl>
                                      <FormLabel>Get quantity (Y)</FormLabel>
                                      <Input
                                        type="number"
                                        min={1}
                                        value={selected.config?.getQuantity ?? ""}
                                        placeholder="e.g. 1"
                                        {...sharedInputStyles}
                                        onChange={(event) =>
                                          updateOfferConfig(offer.offerId, "getQuantity", event.target.value)
                                        }
                                      />
                                    </FormControl>
                                  </SimpleGrid>
                                ) : null}

                                {selected && offer.type === "freebie" ? (
                                  <Box mt={4}>
                                    <FormLabel>Select freebie product</FormLabel>
                                    {selected.config?.freebieProductId ? (
                                      <HStack
                                        justify="space-between"
                                        align="center"
                                        spacing={3}
                                        borderRadius="20px"
                                        borderWidth="1px"
                                        borderColor={success}
                                        bg={successSoft}
                                        px={3}
                                        py={3}
                                      >
                                        <HStack spacing={3} minW={0}>
                                          <Image
                                            src={
                                              products.find((product) => product._id === selected.config?.freebieProductId)
                                                ?.images?.[0]?.preview ||
                                              products.find((product) => product._id === selected.config?.freebieProductId)
                                                ?.images?.[0] ||
                                              "https://via.placeholder.com/80x80?text=Freebie"
                                            }
                                            alt="Freebie product"
                                            boxSize="48px"
                                            borderRadius="16px"
                                            objectFit="cover"
                                          />
                                          <Box minW={0}>
                                            <Text fontSize="sm" fontWeight="700" color={text} noOfLines={1}>
                                              {products.find((product) => product._id === selected.config?.freebieProductId)?.name ||
                                                "Selected freebie"}
                                            </Text>
                                            <Text fontSize="xs" color={textMuted}>
                                              Rs{" "}
                                              {Number(
                                                products.find((product) => product._id === selected.config?.freebieProductId)?.price || 0
                                              ).toLocaleString("en-IN")}
                                            </Text>
                                          </Box>
                                        </HStack>

                                        <Button
                                          type="button"
                                          size="sm"
                                          borderRadius="full"
                                          variant="outline"
                                          borderColor={borderStrong}
                                          color={accentStrong}
                                          _hover={{ bg: surface }}
                                          onClick={() => openFreebieModal(offer.offerId)}
                                        >
                                          Change
                                        </Button>
                                      </HStack>
                                    ) : (
                                      <Button
                                        type="button"
                                        leftIcon={<FaGift />}
                                        w="full"
                                        h="46px"
                                        borderRadius="full"
                                        variant="outline"
                                        borderColor={borderStrong}
                                        color={accentStrong}
                                        _hover={{ bg: surface }}
                                        onClick={() => openFreebieModal(offer.offerId)}
                                      >
                                        Select freebie product
                                      </Button>
                                    )}

                                    <FreebieProductModal
                                      isOpen={
                                        isFreebieModalOpen &&
                                        freebieModalTargetOfferRef.current === offer.offerId
                                      }
                                      onClose={() => setIsFreebieModalOpen(false)}
                                      products={products.filter((product) => product._id !== formik.values._id)}
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
                    </VStack>
                  );

                case "config":
                  return (
                    <VStack align="stretch" spacing={5}>
                      <Box>
                        <Text fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="0.12em" color={textSoft}>
                          Tags
                        </Text>
                        <Box
                          mt={2.5}
                          borderRadius="24px"
                          borderWidth="1px"
                          borderColor={border}
                          bg={surfaceMuted}
                          px={3}
                          py={3}
                        >
                          <HStack spacing={2} flexWrap="wrap" align="center">
                            {(formik.values.tags || []).map((tag: string) => (
                              <HStack
                                key={tag}
                                spacing={1.5}
                                px={3}
                                py={1.5}
                                borderRadius="full"
                                bg={accentSoft}
                                color={accentStrong}
                              >
                                <Icon as={FaTag} boxSize={3} />
                                <Text fontSize="xs" fontWeight="700">
                                  {tag}
                                </Text>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  minW="auto"
                                  h="18px"
                                  px={0}
                                  color={accentStrong}
                                  _hover={{ bg: "transparent" }}
                                  onClick={() => removeTag(tag)}
                                >
                                  <CloseIcon boxSize={2.5} />
                                </Button>
                              </HStack>
                            ))}

                            <HStack flex="1" minW={{ base: "100%", md: "220px" }} spacing={2}>
                              <Input
                                value={tagInput}
                                placeholder="Add tag and press Enter"
                                border="none"
                                bg="transparent"
                                color={text}
                                _focusVisible={{ boxShadow: "none" }}
                                _placeholder={{ color: textSoft }}
                                onChange={(event) => setTagInput(event.target.value)}
                                onKeyDown={(event) => {
                                  if (event.key === "Enter") {
                                    event.preventDefault();
                                    addTag();
                                  }
                                }}
                              />
                              <Button
                                type="button"
                                h="34px"
                                borderRadius="full"
                                px={4}
                                bg={accent}
                                color="white"
                                _hover={{ bg: accentStrong }}
                                onClick={addTag}
                              >
                                Add
                              </Button>
                            </HStack>
                          </HStack>
                        </Box>
                      </Box>

                      <Divider borderColor={border} />

                      <FieldArray name="variants">
                        {({ push, remove }) => (
                          <VStack align="stretch" spacing={3}>
                            <HStack justify="space-between" align="center">
                              <Box>
                                <Text fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="0.12em" color={textSoft}>
                                  Variants
                                </Text>
                                <Text mt={1} fontSize="sm" color={textMuted}>
                                  Define configurable options like size, color, or storage.
                                </Text>
                              </Box>
                              <Button
                                type="button"
                                leftIcon={<FaPlus />}
                                size="sm"
                                borderRadius="full"
                                variant="ghost"
                                color={accentStrong}
                                _hover={{ bg: accentSoft }}
                                onClick={() => push({ name: "", options: [] })}
                              >
                                Add variant
                              </Button>
                            </HStack>

                            {formik.values.variants?.length > 0 ? (
                              <VStack align="stretch" spacing={3}>
                                {formik.values.variants.map((variant: any, index: number) => (
                                  <Box
                                    key={`variant-${index}`}
                                    borderRadius="24px"
                                    borderWidth="1px"
                                    borderColor={border}
                                    bg={surfaceMuted}
                                    px={4}
                                    py={4}
                                  >
                                    <HStack justify="space-between" align="center" mb={3}>
                                      <Text fontSize="sm" fontWeight="700" color={text}>
                                        Variant #{index + 1}
                                      </Text>
                                      <IconButton
                                        aria-label="Remove variant"
                                        icon={<FaTrash />}
                                        borderRadius="18px"
                                        bg={dangerSoft}
                                        color={danger}
                                        _hover={{ bg: dangerSoft }}
                                        _active={{ transform: "scale(0.96)" }}
                                        onClick={() => remove(index)}
                                      />
                                    </HStack>

                                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                                      <Field name={`variants.${index}.name`}>
                                        {({ field, form }: any) => (
                                          <FormControl
                                            isRequired
                                            isInvalid={Boolean(
                                              form.errors.variants?.[index]?.name &&
                                                form.touched.variants?.[index]?.name
                                            )}
                                          >
                                            <FormLabel>Variant name</FormLabel>
                                            <Input {...field} placeholder="e.g. Size" {...sharedInputStyles} />
                                            <FormErrorMessage>
                                              {getErrorText(form.errors.variants?.[index]?.name)}
                                            </FormErrorMessage>
                                          </FormControl>
                                        )}
                                      </Field>

                                      <FormControl
                                        isRequired
                                        isInvalid={Boolean(
                                          (formik.errors as any).variants?.[index]?.options &&
                                            (formik.touched as any).variants?.[index]?.options
                                        )}
                                      >
                                        <FormLabel>Options (comma separated)</FormLabel>
                                        <Input
                                          value={
                                            Array.isArray(formik.values.variants[index]?.options)
                                              ? formik.values.variants[index].options.filter(Boolean).join(", ")
                                              : ""
                                          }
                                          placeholder="e.g. S, M, L"
                                          {...sharedInputStyles}
                                          onChange={(event) => {
                                            const nextOptions = event.target.value
                                              .split(",")
                                              .map((option) => option.trim())
                                              .filter(Boolean);
                                            formik.setFieldValue(`variants.${index}.options`, nextOptions);
                                          }}
                                          onBlur={() => formik.setFieldTouched(`variants.${index}.options`, true)}
                                        />
                                        <FormErrorMessage>
                                          {getErrorText((formik.errors as any).variants?.[index]?.options)}
                                        </FormErrorMessage>
                                      </FormControl>
                                    </SimpleGrid>

                                    {Array.isArray(formik.values.variants[index]?.options) &&
                                    formik.values.variants[index].options.length > 0 ? (
                                      <HStack mt={3} spacing={1.5} flexWrap="wrap">
                                        {formik.values.variants[index].options.filter(Boolean).map((option: string) => (
                                          <Box
                                            key={`${variant.name}-${option}`}
                                            px={2.5}
                                            py={1}
                                            borderRadius="full"
                                            bg={surface}
                                            borderWidth="1px"
                                            borderColor={border}
                                            color={textMuted}
                                            fontSize="11px"
                                            fontWeight="700"
                                          >
                                            {option}
                                          </Box>
                                        ))}
                                      </HStack>
                                    ) : null}
                                  </Box>
                                ))}
                              </VStack>
                            ) : (
                              <Box borderRadius="24px" borderWidth="1px" borderColor={border} bg={surfaceMuted} px={4} py={4}>
                                <Text fontSize="sm" color={textMuted}>
                                  No variants added yet.
                                </Text>
                              </Box>
                            )}
                          </VStack>
                        )}
                      </FieldArray>
                    </VStack>
                  );

                case "media":
                  return (
                    <VStack align="stretch" spacing={4}>
                      <Box
                        as="label"
                        cursor="pointer"
                        borderRadius="28px"
                        borderWidth="2px"
                        borderStyle="dashed"
                        borderColor={borderStrong}
                        bg={surfaceMuted}
                        px={6}
                        py={{ base: 8, md: 10 }}
                        textAlign="center"
                        transition="border-color 0.2s ease, background-color 0.2s ease"
                        _hover={{ borderColor: accent, bg: accentSoft }}
                      >
                        <Center mx="auto" boxSize="52px" borderRadius="20px" bg={accentSoft} color={accentStrong}>
                          {isUploadingImages ? <Spinner size="sm" /> : <FaUpload />}
                        </Center>
                        <Text mt={3} fontSize="sm" fontWeight="700" color={text}>
                          {isUploadingImages ? "Uploading images..." : "Tap to upload images"}
                        </Text>
                        <Text mt={1} fontSize="xs" color={textMuted}>
                          PNG, JPG, or WEBP supported
                        </Text>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          style={{ display: "none" }}
                          onChange={(event) =>
                            handleImageUpload(event, formik.setFieldValue, formik.values.images || [])
                          }
                        />
                      </Box>

                      <FormControl isInvalid={Boolean(formik.errors.images && formik.touched.images)}>
                        {(formik.values.images || []).length > 0 ? (
                          <SimpleGrid columns={{ base: 3, md: 4 }} spacing={3}>
                            {(formik.values.images || []).map((image: any, index: number) => (
                              <Box
                                key={`image-${index}`}
                                position="relative"
                                aspectRatio={1}
                                overflow="hidden"
                                borderRadius="22px"
                                borderWidth="1px"
                                borderColor={border}
                                bg={surfaceSoft}
                              >
                                <Image
                                  src={getProductImage(image)}
                                  alt={`Product image ${index + 1}`}
                                  w="100%"
                                  h="100%"
                                  objectFit="cover"
                                />
                                <IconButton
                                  aria-label="Remove image"
                                  icon={<CloseIcon boxSize={2.5} />}
                                  size="sm"
                                  position="absolute"
                                  top={2}
                                  right={2}
                                  borderRadius="full"
                                  bg="rgba(255,255,255,0.92)"
                                  color={danger}
                                  _hover={{ bg: "white" }}
                                  onClick={() => {
                                    formik.setFieldValue(
                                      "images",
                                      (formik.values.images || []).filter(
                                        (_: any, imageIndex: number) => imageIndex !== index
                                      )
                                    );
                                  }}
                                />
                              </Box>
                            ))}
                          </SimpleGrid>
                        ) : (
                          <Box borderRadius="24px" borderWidth="1px" borderColor={border} bg={surfaceMuted} px={4} py={4}>
                            <Text fontSize="sm" color={textMuted}>
                              Upload at least one image to publish the product.
                            </Text>
                          </Box>
                        )}

                        <FormErrorMessage>{getErrorText(formik.errors.images)}</FormErrorMessage>
                      </FormControl>
                    </VStack>
                  );

                default:
                  return null;
              }
            };
            const isLastMobileStep = sectionIndex === FORM_SECTIONS.length - 1;
            const mobileProgress = ((sectionIndex + 1) / FORM_SECTIONS.length) * 100;
            return (
              <Drawer
  isOpen={isVisible}
  placement={isDesktop ? "right" : "bottom"}
  onClose={onClose}
  size={isDesktop ? "2xl" : "full"}
  trapFocus={false}
  blockScrollOnMount={false}
  preserveScrollBarGap
>
  <DrawerOverlay
    bg={overlayBg}
    backdropFilter="blur(14px)"
  />

  <DrawerContent
    bg={shell}
    borderRadius={{ base: "28px 28px 0 0", md: "32px 0 0 32px" }}
    borderWidth="1px"
    borderColor={border}
    boxShadow={{ base: "none", md: sheetShadow }}
    overflow="hidden"
    maxW={{ base: "100%", md: "760px" }}
    h={{ base: "92dvh", md: "100dvh" }}
    ml="auto"
    sx={merchantFormSx}
  >
    <Form style={{ height: "100%" }}>
      <Flex direction="column" h="100%">
        
        {/* HEADER */}
        <Box
          px={{ base: 4, md: 6 }}
          pt={{ base: 3, md: 5 }}
          pb={{ base: 2, md: 4.5 }}
          borderBottomWidth="1px"
          borderBottomColor={border}
          bg={surface}
        >
          {!isDesktop && (
            <Box
              mx="auto"
              mb={3}
              h="5px"
              w="44px"
              borderRadius="full"
              bg={border}
            />
          )}

          <HStack justify="space-between" align="start" spacing={3}>
            <HStack
              spacing={{ base: 3, md: 4 }}
              align="start"
              flex="1"
            >
              <Center
                boxSize={{ base: "42px", md: "52px" }}
                borderRadius={{ base: "16px", md: "18px" }}
                bgGradient={heroGradient}
                color="white"
                boxShadow={{
                  base: "0 10px 20px rgba(37, 99, 235, 0.16)",
                  md: "0 18px 34px rgba(37, 99, 235, 0.18)",
                }}
              >
                <Icon as={FaBoxOpen} boxSize={{ base: 4, md: 5 }} />
              </Center>

              <Box minW={0}>
                <Text
                  fontSize="11px"
                  fontWeight="700"
                  textTransform="uppercase"
                  letterSpacing="0.14em"
                  color={accentStrong}
                >
                  {isEdit ? "Edit product" : "New product"}
                </Text>

                <Text
                  mt={1}
                  fontSize={{ base: "lg", md: "2xl" }}
                  fontWeight="700"
                  color={text}
                  lineHeight="1.15"
                >
                  {isEdit
                    ? "Refine this item"
                    : "Launch a new item"}
                </Text>

                <Text
                  mt={1.5}
                  fontSize={{ base: "xs", md: "sm" }}
                  color={textMuted}
                  maxW="2xl"
                >
                  {isDesktop
                    ? "All sections stay visible here so you can review everything in one pass."
                    : `${activeSectionConfig.title} • Step ${
                        sectionIndex + 1
                      } of ${FORM_SECTIONS.length}`}
                </Text>
              </Box>
            </HStack>

            <DrawerCloseButton
              position="relative"
              top="unset"
              right="unset"
              borderRadius="full"
            />
          </HStack>
        </Box>

        {/* MOBILE PROGRESS */}
        {!isDesktop ? (
          <Box
            px={4}
            py={3.5}
            borderBottomWidth="1px"
            borderBottomColor={border}
            bg={surface}
          >
            <Flex justify="space-between" align="center" gap={3}>
              <Text
                fontSize="xs"
                fontWeight="700"
                textTransform="uppercase"
                letterSpacing="0.12em"
                color={textSoft}
              >
                Step {sectionIndex + 1} of {FORM_SECTIONS.length}
              </Text>

              <Text
                fontSize="xs"
                color={textMuted}
                noOfLines={1}
              >
                {activeSectionConfig.subtitle}
              </Text>
            </Flex>

            <Box
              mt={3}
              h="6px"
              borderRadius="full"
              bg={surfaceMuted}
              overflow="hidden"
            >
              <Box
                h="100%"
                w={`${mobileProgress}%`}
                borderRadius="full"
                bg={accent}
                transition="width 0.28s ease"
              />
            </Box>
          </Box>
        ) : null}

        {/* BODY */}
        <DrawerBody
          px={{ base: 4, md: 5 }}
          py={{ base: 2, md: 5 }}
          bg={shell}
        >
          {isDesktop ? (
            <VStack align="stretch" spacing={4}>
              {FORM_SECTIONS.map((section) => {
                const tone = sectionTone(section.tint);

                return (
                  <Box
                    key={section.id}
                    borderRadius="26px"
                    borderWidth="1px"
                    borderColor={border}
                    bg={surface}
                    px={{ base: 4, md: 5 }}
                    py={{ base: 4, md: 5 }}
                    boxShadow="0 16px 32px rgba(15, 23, 42, 0.05)"
                  >
                    <HStack align="start" spacing={4} mb={5}>
                      <Center
                        boxSize="42px"
                        borderRadius="16px"
                        bg={tone.bg}
                        color={tone.color}
                      >
                        <Icon
                          as={section.icon}
                          boxSize={5}
                        />
                      </Center>

                      <Box>
                        <Text
                          fontSize="lg"
                          fontWeight="700"
                          color={text}
                        >
                          {section.title}
                        </Text>

                        <Text
                          mt={1}
                          fontSize="sm"
                          color={textMuted}
                        >
                          {section.subtitle}
                        </Text>
                      </Box>
                    </HStack>

                    {renderSectionContent(section.id)}
                  </Box>
                );
              })}
            </VStack>
          ) : (
            <SlideFade
              in
              key={activeSection}
              offsetY="14px"
            >
              <Box
                borderRadius="24px"
                bg={surface}
                py={4}
                boxShadow="0 14px 28px rgba(15, 23, 42, 0.06)"
              >
                <HStack align="start" spacing={3} mb={5}>
                  <Center
                    boxSize="40px"
                    borderRadius="15px"
                    bg={activeTone.bg}
                    color={activeTone.color}
                  >
                    <Icon
                      as={activeSectionConfig.icon}
                      boxSize={4}
                    />
                  </Center>

                  <Box>
                    <Text
                      fontSize="md"
                      fontWeight="700"
                      color={text}
                    >
                      {activeSectionConfig.title}
                    </Text>

                    <Text
                      mt={1}
                      fontSize="sm"
                      color={textMuted}
                    >
                      {activeSectionConfig.subtitle}
                    </Text>
                  </Box>
                </HStack>

                {renderSectionContent(activeSection)}
              </Box>
            </SlideFade>
          )}
        </DrawerBody>

        {/* FOOTER */}
        <DrawerFooter
          px={{ base: 4, md: 5 }}
          py={{ base: 3.5, md: 4 }}
          borderTopWidth="1px"
          borderTopColor={border}
          bg={surface}
        >
          {isDesktop ? (
            <Flex
              justify="space-between"
              align="center"
              gap={3}
              w="full"
            >
              <Text fontSize="sm" color={textMuted}>
                Review every section in the drawer, then save
                when you are ready.
              </Text>

              <HStack spacing={3}>
                <Button
                  type="button"
                  h="44px"
                  px={5}
                  borderRadius="full"
                  variant="outline"
                  borderColor={border}
                  color={text}
                  bg={surface}
                  _hover={{ bg: surfaceMuted }}
                  onClick={onClose}
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  h="44px"
                  px={6}
                  borderRadius="full"
                  bg={accent}
                  color="white"
                  fontWeight="700"
                  isLoading={formik.isSubmitting}
                  leftIcon={
                    <Icon as={isEdit ? FaSave : FaPlus} />
                  }
                  _hover={{ bg: accentStrong }}
                  _active={{ transform: "scale(0.98)" }}
                  onClick={handleSubmitClick}
                >
                  {isEdit
                    ? "Save changes"
                    : "Save product"}
                </Button>
              </HStack>
            </Flex>
          ) : (
            <VStack align="stretch" spacing={2.5} w="full">
              <HStack spacing={2}>
                <Button
                  type="button"
                  flex="1"
                  h="40px"
                  borderRadius="full"
                  variant="outline"
                  borderColor={border}
                  color={text}
                  bg={surface}
                  fontSize="sm"
                  _hover={{ bg: surfaceMuted }}
                  onClick={
                    sectionIndex === 0
                      ? onClose
                      : goToPreviousSection
                  }
                >
                  {sectionIndex === 0
                    ? "Cancel"
                    : "Previous"}
                </Button>

                <Button
                  type="button"
                  flex="1"
                  h="40px"
                  px={4}
                  borderRadius="full"
                  bg={accent}
                  color="white"
                  fontSize="sm"
                  fontWeight="700"
                  isLoading={
                    isLastMobileStep
                      ? formik.isSubmitting
                      : false
                  }
                  rightIcon={
                    !isLastMobileStep ? (
                      <FaChevronRight />
                    ) : undefined
                  }
                  _hover={{ bg: accentStrong }}
                  _active={{
                    transform: "scale(0.98)",
                  }}
                  onClick={
                    isLastMobileStep
                      ? handleSubmitClick
                      : goToNextSection
                  }
                >
                  {isLastMobileStep
                    ? isEdit
                      ? "Save changes"
                      : "Save product"
                    : "Next"}
                </Button>
              </HStack>
            </VStack>
          )}
        </DrawerFooter>
      </Flex>
    </Form>
  </DrawerContent>
</Drawer>
            );
          }}
      </Formik>
    </Portal>
  );
};
export default ProductForm;