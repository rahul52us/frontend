import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Circle,
  CloseButton,
  Divider,
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
  VStack,
} from "@chakra-ui/react";
import { Field, FieldArray, Form, Formik } from "formik";
import { FaGift, FaPlus, FaTrash, FaUpload } from "react-icons/fa";
import CustomDrawer from "../../../component/common/Drawer/CustomDrawer";
import { buildBase64ImageUpload } from "../../../config/utils/imageUpload";
import { dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";
import { merchantFormSx } from "../../shop/component/merchantTheme";
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

const sectionCardSx = {
  bg: dashboardPalette.surface,
  border: "1px solid",
  borderColor: dashboardPalette.border,
  borderRadius: "24px",
  p: { base: 4, md: 5 },
  boxShadow: "0 16px 36px rgba(0, 0, 0, 0.18)",
};

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const freebieModalTargetOfferRef = useRef<string | null>(null);
  const [isFreebieModalOpen, setIsFreebieModalOpen] = useState(false);

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

  return (
    <CustomDrawer open={isOpen} close={onClose} width="85vw">
      <Box
        bg={dashboardPalette.shell}
        border="1px solid"
        borderColor={dashboardPalette.border}
        borderRadius="28px"
        p={{ base: 4, md: 5 }}
        sx={{
          ...merchantFormSx,
          ".chakra-form__label": {
            color: dashboardPalette.textMuted,
            fontSize: "0.72rem",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          },
          ".chakra-input, .chakra-textarea, .chakra-numberinput__field, .chakra-select": {
            bg: dashboardPalette.surfaceAlt,
            borderColor: dashboardPalette.borderStrong,
            color: dashboardPalette.text,
            borderRadius: "16px",
          },
          ".chakra-input::placeholder, .chakra-textarea::placeholder, .chakra-numberinput__field::placeholder": {
            color: dashboardPalette.textSoft,
          },
          ".chakra-checkbox__label": {
            color: dashboardPalette.textMuted,
          },
          ".chakra-checkbox__control": {
            bg: dashboardPalette.surfaceSoft,
            borderColor: dashboardPalette.borderStrong,
          },
          ".chakra-checkbox__control[data-checked]": {
            bg: dashboardPalette.accentSoft,
            borderColor: dashboardPalette.accent,
            color: dashboardPalette.accentStrong,
          },
          ".chakra-switch__track": {
            bg: dashboardPalette.surfaceSoft,
          },
          ".chakra-switch__track[data-checked]": {
            bg: dashboardPalette.accent,
          },
        }}
      >
        <HStack justify="space-between" align={{ base: "start", md: "center" }} mb={5}>
          <HStack spacing={4} align="center">
            <Circle size="46px" bg={dashboardPalette.accentSoft}>
              <Icon as={FaGift} color={dashboardPalette.accentStrong} />
            </Circle>
            <Box>
              <Heading
                size="lg"
                color={dashboardPalette.text}
                fontWeight="500"
                fontFamily='Georgia, "Times New Roman", serif'
              >
                {isEdit ? "Edit Product" : "Add New Product"}
              </Heading>
              <Text color={dashboardPalette.textMuted} fontSize="sm">
                Manage pricing, images, variants, and offers with the same logic you already have.
              </Text>
            </Box>
          </HStack>
          <CloseButton
            onClick={onClose}
            color={dashboardPalette.text}
            bg={dashboardPalette.surfaceSoft}
            border="1px solid"
            borderColor={dashboardPalette.border}
            borderRadius="full"
            _hover={{ bg: dashboardPalette.accentSoft, color: dashboardPalette.accentStrong }}
          />
        </HStack>

        <Divider borderColor={dashboardPalette.border} mb={6} />

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
                <VStack spacing={6} align="stretch">
                  <Box {...sectionCardSx}>
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

                  <Box {...sectionCardSx}>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                      <Field name="sku">
                        {({ field, form }: any) => (
                          <FormControl isInvalid={form.errors.sku && form.touched.sku}>
                            <FormLabel>SKU</FormLabel>
                            <Input {...field} placeholder="e.g. WH-1000XM4" />
                            <FormErrorMessage>{form.errors.sku}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="weight">
                        {({ field, form }: any) => (
                          <FormControl isInvalid={form.errors.weight && form.touched.weight}>
                            <FormLabel>Weight</FormLabel>
                            <Input {...field} placeholder="e.g. 250g" />
                            <FormErrorMessage>{form.errors.weight}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="category">
                        {({ field, form }: any) => (
                          <FormControl
                            isInvalid={form.errors.category && form.touched.category}
                            isRequired
                          >
                            <FormLabel>Category</FormLabel>
                            <Select
                              {...field}
                              placeholder="Select Category"
                              onChange={(event) => {
                                field.onChange(event);
                                form.setFieldValue("subCategories", []);
                              }}
                            >
                              {rootCategories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                  {cat.name}
                                </option>
                              ))}
                            </Select>
                            <FormErrorMessage>{form.errors.category}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </SimpleGrid>

                    <Box mt={6}>
                      <FormLabel>Subcategories</FormLabel>
                      <FieldArray name="subCategories">
                        {({ push, remove }) => {
                          if (!props.values.category) {
                            return (
                              <Box color={dashboardPalette.textSoft} fontSize="sm">
                                Select a category first
                              </Box>
                            );
                          }

                          if (availableSubCategories.length === 0) {
                            return (
                              <Box color={dashboardPalette.textSoft} fontSize="sm">
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
                                    color={dashboardPalette.danger}
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
                                borderColor={dashboardPalette.borderStrong}
                                color={dashboardPalette.accentStrong}
                                _hover={{ bg: dashboardPalette.accentSoft }}
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

                  <Box {...sectionCardSx}>
                    <Field name="description">
                      {({ field, form }: any) => (
                        <FormControl
                          isInvalid={form.errors.description && form.touched.description}
                        >
                          <FormLabel>Description</FormLabel>
                          <Textarea {...field} placeholder="Detailed description..." rows={4} />
                          <FormErrorMessage>{form.errors.description}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </Box>

                  <Box {...sectionCardSx}>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
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
                    </SimpleGrid>
                  </Box>

                  <Box {...sectionCardSx}>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                      <Field name="stock">
                        {({ field, form }: any) => (
                          <FormControl isInvalid={form.errors.stock && form.touched.stock} isRequired>
                            <FormLabel>Stock</FormLabel>
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
                  </Box>

                  <Box {...sectionCardSx}>
                    <FormLabel>Offers</FormLabel>
                    {offersList.length === 0 ? (
                      <Text color={dashboardPalette.textSoft} fontSize="sm">
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
                              borderColor={dashboardPalette.borderStrong}
                              bg={dashboardPalette.surfaceAlt}
                            >
                              <HStack justify="space-between" align="start">
                                <Checkbox isChecked={!!selected} onChange={() => toggleOffer(offer)}>
                                  {offer.name} ({offer.type})
                                </Checkbox>
                                {selected ? (
                                  <HStack>
                                    <Text fontSize="sm" color={dashboardPalette.textSoft}>
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
                                            <Text fontWeight="medium" fontSize="sm" color={dashboardPalette.text}>
                                              {products.find((p) => p._id === selected.config?.freebieProductId)?.name ||
                                                "Selected Product"}
                                            </Text>
                                            <Text fontSize="xs" color={dashboardPalette.textSoft}>
                                              Rs {products.find((p) => p._id === selected.config?.freebieProductId)?.price || "--"}
                                            </Text>
                                          </Box>
                                        </HStack>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          borderColor={dashboardPalette.borderStrong}
                                          color={dashboardPalette.accentStrong}
                                          _hover={{ bg: dashboardPalette.accentSoft }}
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
                                        borderColor={dashboardPalette.borderStrong}
                                        color={dashboardPalette.accentStrong}
                                        _hover={{ bg: dashboardPalette.accentSoft }}
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

                  <Box {...sectionCardSx}>
                    <Field name="tags">
                      {({ form }: any) => (
                        <FormControl>
                          <FormLabel>Tags (Comma separated)</FormLabel>
                          <Input
                            placeholder="e.g. summer, sale, new"
                            value={form.values.tags ? form.values.tags.join(", ") : ""}
                            onChange={(event) => {
                              const tags = event.target.value
                                .split(",")
                                .map((tag: string) => tag.trim())
                                .filter(Boolean);
                              form.setFieldValue("tags", tags);
                            }}
                          />
                        </FormControl>
                      )}
                    </Field>
                  </Box>

                  <Box {...sectionCardSx}>
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
                                  borderColor={dashboardPalette.borderStrong}
                                  bg={dashboardPalette.surfaceAlt}
                                >
                                  <HStack justify="space-between" mb={2}>
                                    <Text fontWeight="bold" color={dashboardPalette.text}>
                                      Variant #{index + 1}
                                    </Text>
                                    <IconButton
                                      aria-label="Remove variant"
                                      icon={<FaTrash />}
                                      size="sm"
                                      color={dashboardPalette.danger}
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
                            borderColor={dashboardPalette.borderStrong}
                            color={dashboardPalette.accentStrong}
                            _hover={{ bg: dashboardPalette.accentSoft }}
                          >
                            Add Variant
                          </Button>
                        </VStack>
                      )}
                    </FieldArray>
                  </Box>

                  <Box {...sectionCardSx}>
                    <FormControl isInvalid={!!(props.errors.images && props.touched.images)}>
                      <FormLabel>Product Images</FormLabel>
                      <HStack spacing={4} wrap="wrap">
                        {props.values.images.map((img: any, index: number) => (
                          <Box key={index} position="relative" boxSize="100px">
                            <Image
                              src={img.preview || img}
                              alt={`Product ${index}`}
                              boxSize="100%"
                              objectFit="cover"
                              borderRadius="16px"
                            />
                            <IconButton
                              aria-label="Remove image"
                              icon={<FaTrash />}
                              size="xs"
                              bg="rgba(239, 107, 107, 0.12)"
                              color={dashboardPalette.danger}
                              _hover={{ bg: "rgba(239, 107, 107, 0.20)" }}
                              position="absolute"
                              top={-2}
                              right={-2}
                              onClick={() => {
                                const nextImages = props.values.images.filter(
                                  (_: any, imageIndex: number) => imageIndex !== index
                                );
                                props.setFieldValue("images", nextImages);
                              }}
                            />
                          </Box>
                        ))}
                        <Box
                          boxSize="100px"
                          border="2px dashed"
                          borderColor={dashboardPalette.borderStrong}
                          borderRadius="16px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          cursor="pointer"
                          bg={dashboardPalette.surfaceAlt}
                          _hover={{
                            borderColor: dashboardPalette.accent,
                            bg: dashboardPalette.surfaceSoft,
                          }}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Icon as={FaUpload} color={dashboardPalette.textSoft} boxSize={6} />
                          <input
                            type="file"
                            multiple
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={(event) =>
                              handleImageUpload(event, props.setFieldValue, props.values.images)
                            }
                            accept="image/*"
                          />
                        </Box>
                      </HStack>
                      <FormErrorMessage>
                        {typeof props.errors.images === "string"
                          ? props.errors.images
                          : "Invalid images"}
                      </FormErrorMessage>
                    </FormControl>
                  </Box>

                  <Box {...sectionCardSx}>
                    <FormLabel>Product Details</FormLabel>
                    <FieldArray name="productDetails">
                      {({ push, remove }) => (
                        <VStack spacing={3} align="stretch">
                          {props.values.productDetails.map((detail: any, index: number) => (
                            <HStack key={index} align="start">
                              <Field name={`productDetails[${index}].key`}>
                                {({ field, form }: any) => (
                                  <FormControl
                                    isInvalid={
                                      form.errors.productDetails?.[index]?.key &&
                                      form.touched.productDetails?.[index]?.key
                                    }
                                  >
                                    <Input {...field} placeholder="Attribute" />
                                  </FormControl>
                                )}
                              </Field>
                              <Field name={`productDetails[${index}].value`}>
                                {({ field, form }: any) => (
                                  <FormControl
                                    isInvalid={
                                      form.errors.productDetails?.[index]?.value &&
                                      form.touched.productDetails?.[index]?.value
                                    }
                                  >
                                    <Input {...field} placeholder="Value" />
                                  </FormControl>
                                )}
                              </Field>
                              <IconButton
                                aria-label="Remove"
                                icon={<FaTrash />}
                                color={dashboardPalette.danger}
                                bg="rgba(239, 107, 107, 0.12)"
                                _hover={{ bg: "rgba(239, 107, 107, 0.20)" }}
                                variant="ghost"
                                onClick={() => remove(index)}
                              />
                            </HStack>
                          ))}
                          <Button
                            leftIcon={<FaPlus />}
                            size="sm"
                            variant="outline"
                            borderColor={dashboardPalette.borderStrong}
                            color={dashboardPalette.accentStrong}
                            _hover={{ bg: dashboardPalette.accentSoft }}
                            onClick={() => push({ key: "", value: "" })}
                            alignSelf="flex-start"
                          >
                            Add Detail
                          </Button>
                        </VStack>
                      )}
                    </FieldArray>
                  </Box>

                  <Box {...sectionCardSx}>
                    <FormLabel>Extra Information</FormLabel>
                    <FieldArray name="information">
                      {({ push, remove }) => (
                        <VStack spacing={3} align="stretch">
                          {props.values.information.map((info: any, index: number) => (
                            <HStack key={index} align="start">
                              <Field name={`information[${index}].key`}>
                                {({ field, form }: any) => (
                                  <FormControl
                                    isInvalid={
                                      form.errors.information?.[index]?.key &&
                                      form.touched.information?.[index]?.key
                                    }
                                  >
                                    <Input {...field} placeholder="Key" />
                                  </FormControl>
                                )}
                              </Field>
                              <Field name={`information[${index}].value`}>
                                {({ field, form }: any) => (
                                  <FormControl
                                    isInvalid={
                                      form.errors.information?.[index]?.value &&
                                      form.touched.information?.[index]?.value
                                    }
                                  >
                                    <Input {...field} placeholder="Value" />
                                  </FormControl>
                                )}
                              </Field>
                              <IconButton
                                aria-label="Remove"
                                icon={<FaTrash />}
                                color={dashboardPalette.danger}
                                bg="rgba(239, 107, 107, 0.12)"
                                _hover={{ bg: "rgba(239, 107, 107, 0.20)" }}
                                variant="ghost"
                                onClick={() => remove(index)}
                              />
                            </HStack>
                          ))}
                          <Button
                            leftIcon={<FaPlus />}
                            size="sm"
                            variant="outline"
                            borderColor={dashboardPalette.borderStrong}
                            color={dashboardPalette.accentStrong}
                            _hover={{ bg: dashboardPalette.accentSoft }}
                            onClick={() => push({ key: "", value: "" })}
                            alignSelf="flex-start"
                          >
                            Add Information
                          </Button>
                        </VStack>
                      )}
                    </FieldArray>
                  </Box>

                  <Box pt={2}>
                    <Button
                      type="submit"
                      size="lg"
                      isLoading={props.isSubmitting}
                      width="full"
                      borderRadius="18px"
                      bg={dashboardPalette.accent}
                      color={dashboardPalette.page}
                      _hover={{ bg: dashboardPalette.accentStrong }}
                    >
                      {isEdit ? "Update Product" : "Create Product"}
                    </Button>
                  </Box>
                </VStack>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </CustomDrawer>
  );
};

export default ProductForm;
