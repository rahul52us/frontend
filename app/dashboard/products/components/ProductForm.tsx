import React, { useRef } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Textarea,
  VStack,
  FormErrorMessage,
  useToast,
  Select,
  HStack,
  Text,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  IconButton,
  Image,
  Icon,
} from "@chakra-ui/react";
import { Formik, Field, Form, FieldArray } from "formik";
import { FaPlus, FaTrash, FaUpload } from "react-icons/fa";
import { observer } from "mobx-react-lite";
import CustomDrawer from "../../../component/common/Drawer/CustomDrawer";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues: any;
  validationSchema: any;
  onSubmit: any;
  categories: any[];
  isEdit: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  isOpen,
  onClose,
  initialValues,
  validationSchema,
  onSubmit,
  categories,
  isEdit,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (
    event: any,
    setFieldValue: any,
    currentImages: any[]
  ) => {
    const files = Array.from(event.target.files);

    const fileReaders = files.map((file: any) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            filename: file.name,
            buffer: reader.result,
            isAdd: true,
            preview: URL.createObjectURL(file),
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    try {
      const newImages = await Promise.all(fileReaders);
      setFieldValue("images", [...currentImages, ...newImages]);
    } catch (error) {
      alert(error?.message)
    }
  };

  return (
    <CustomDrawer
      title={isEdit ? "Edit Product" : "Add New Product"}
      open={isOpen}
      close={onClose}
      width="85vw"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(props) => {
          // Filter for root categories (no parent)
          const rootCategories = categories.filter(cat => !cat.parent);

          // Filter for subcategories based on selected category
          const availableSubCategories = categories.filter(
            cat => cat.parent && (cat.parent._id === props.values.category || cat.parent === props.values.category)
          );

          return (
            <Form>
              <VStack spacing={6} align="stretch">
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <Field name="name">
                    {({ field, form }: any) => (
                      <FormControl
                        isInvalid={form.errors.name && form.touched.name}
                        isRequired
                      >
                        <FormLabel>Product Name</FormLabel>
                        <Input
                          {...field}
                          placeholder="e.g. Wireless Headphones"
                        />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="brand">
                    {({ field, form }: any) => (
                      <FormControl
                        isInvalid={form.errors.brand && form.touched.brand}
                      >
                        <FormLabel>Brand</FormLabel>
                        <Input {...field} placeholder="e.g. Sony" />
                        <FormErrorMessage>{form.errors.brand}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                  <Field name="sku">
                    {({ field, form }: any) => (
                      <FormControl
                        isInvalid={form.errors.sku && form.touched.sku}
                      >
                        <FormLabel>SKU</FormLabel>
                        <Input {...field} placeholder="e.g. WH-1000XM4" />
                        <FormErrorMessage>{form.errors.sku}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="weight">
                    {({ field, form }: any) => (
                      <FormControl
                        isInvalid={form.errors.weight && form.touched.weight}
                      >
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
                          onChange={(e) => {
                            field.onChange(e);
                            // Clear subcategories when category changes
                            form.setFieldValue("subCategories", []);
                          }}
                        >
                          {rootCategories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                        </Select>
                        <FormErrorMessage>
                          {form.errors.category}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  {/* ---------- Subcategories ---------- */}
                  <Box>
                    <FormLabel>Subcategories</FormLabel>
                    <FieldArray name="subCategories">
                      {({ push, remove }) => {
                        if (!props.values.category) {
                          return <Box color="gray.500" fontSize="sm">Select a category first</Box>;
                        }

                        if (availableSubCategories.length === 0) {
                          return <Box color="gray.500" fontSize="sm">No subcategories found</Box>;
                        }

                        return (
                          <VStack spacing={3} align="stretch">
                            {props.values.subCategories.map((sub: string, index: number) => (
                              <HStack key={index}>
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
                                  colorScheme="red"
                                  variant="ghost"
                                  onClick={() => remove(index)}
                                />
                              </HStack>
                            ))}
                            <Button
                              leftIcon={<FaPlus />}
                              size="sm"
                              variant="outline"
                              onClick={() => push("")}
                              alignSelf="flex-start"
                            >
                              Add Subcategory
                            </Button>
                          </VStack>
                        )
                      }}
                    </FieldArray>
                  </Box>

                </SimpleGrid>

                <Field name="description">
                  {({ field, form }: any) => (
                    <FormControl
                      isInvalid={
                        form.errors.description && form.touched.description
                      }
                    >
                      <FormLabel>Description</FormLabel>
                      <Textarea
                        {...field}
                        placeholder="Detailed description..."
                        rows={4}
                      />
                      <FormErrorMessage>
                        {form.errors.description}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <Field name="price">
                    {({ field, form }: any) => (
                      <FormControl
                        isInvalid={form.errors.price && form.touched.price}
                        isRequired
                      >
                        <FormLabel>Price (₹)</FormLabel>
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
                  <Field name="discountPrice">
                    {({ field, form }: any) => (
                      <FormControl
                        isInvalid={form.errors.discountPrice && form.touched.discountPrice}
                      >
                        <FormLabel>Discount Price (₹)</FormLabel>
                        <NumberInput
                          min={0}
                          onChange={(val) => form.setFieldValue(field.name, val)}
                          value={field.value}
                        >
                          <NumberInputField placeholder="0.00" />
                        </NumberInput>
                        <FormErrorMessage>{form.errors.discountPrice}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                  <Field name="stock">
                    {({ field, form }: any) => (
                      <FormControl
                        isInvalid={form.errors.stock && form.touched.stock}
                        isRequired
                      >
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
                <Field name="tags">
                  {({ field, form }: any) => (
                    <FormControl>
                      <FormLabel>Tags (Comma separated)</FormLabel>
                      <Input
                        placeholder="e.g. summer, sale, new"
                        value={form.values.tags ? form.values.tags.join(', ') : ''}
                        onChange={(e) => {
                          const tags = e.target.value.split(',').map((tag: string) => tag.trim());
                          form.setFieldValue('tags', tags);
                        }}
                      />
                    </FormControl>
                  )}
                </Field>

                {/* Variants Section */}
                <Box>
                  <FormLabel>Variants</FormLabel>
                  <FieldArray name="variants">
                    {({ push, remove, form }: any) => (
                      <VStack spacing={4} align="stretch" width="100%">
                        {form.values.variants && form.values.variants.length > 0 && form.values.variants.map((variant: any, index: number) => (
                          <Box key={index} p={4} borderWidth="1px" borderRadius="lg" bg="whiteAlpha.100">
                            <HStack justify="space-between" mb={2}>
                              <Text fontWeight="bold">Variant #{index + 1}</Text>
                              <IconButton
                                aria-label="Remove variant"
                                icon={<FaTrash />}
                                size="sm"
                                colorScheme="red"
                                onClick={() => remove(index)}
                              />
                            </HStack>

                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                              <Field name={`variants.${index}.name`}>
                                {({ field, form }: any) => (
                                  <FormControl isRequired>
                                    <FormLabel fontSize="sm">Variant Name</FormLabel>
                                    <Input {...field} placeholder="e.g. Size, Color" />
                                  </FormControl>
                                )}
                              </Field>
                              <Field name={`variants.${index}.options`}>
                                {({ field, form }: any) => (
                                  <FormControl isRequired>
                                    <FormLabel fontSize="sm">Options (Comma separated)</FormLabel>
                                    <Input
                                      placeholder="e.g. S, M, L or Red, Blue"
                                      value={form.values.variants[index].options ? form.values.variants[index].options.join(', ') : ''}
                                      onChange={(e) => {
                                        const options = e.target.value.split(',').map((opt: string) => opt.trim());
                                        form.setFieldValue(`variants.${index}.options`, options);
                                      }}
                                    />
                                  </FormControl>
                                )}
                              </Field>
                            </SimpleGrid>
                          </Box>
                        ))}

                        <Button
                          leftIcon={<FaPlus />}
                          onClick={() => push({ name: '', options: [] })}
                          size="sm"
                          alignSelf="flex-start"
                        >
                          Add Variant
                        </Button>
                      </VStack>
                    )}
                  </FieldArray>
                </Box>

                {/* Images Section */}
                <FormControl
                  isInvalid={!!(props.errors.images && props.touched.images)}
                >
                  <FormLabel>Product Images</FormLabel>
                  <HStack spacing={4} wrap="wrap">
                    {props.values.images.map((img: any, index: number) => (
                      <Box key={index} position="relative" boxSize="100px">
                        <Image
                          src={img.preview || img}
                          alt={`Product ${index}`}
                          boxSize="100%"
                          objectFit="cover"
                          borderRadius="md"
                        />
                        <IconButton
                          aria-label="Remove image"
                          icon={<FaTrash />}
                          size="xs"
                          colorScheme="red"
                          position="absolute"
                          top={-2}
                          right={-2}
                          onClick={() => {
                            const newImages = props.values.images.filter(
                              (_: any, i: number) => i !== index
                            );
                            props.setFieldValue("images", newImages);
                          }}
                        />
                      </Box>
                    ))}
                    <Box
                      boxSize="100px"
                      border="2px dashed"
                      borderColor="gray.300"
                      borderRadius="md"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      cursor="pointer"
                      _hover={{ borderColor: "blue.500", bg: "gray.50" }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Icon as={FaUpload} color="gray.400" boxSize={6} />
                      <input
                        type="file"
                        multiple
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={(e) =>
                          handleImageUpload(
                            e,
                            props.setFieldValue,
                            props.values.images
                          )
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

                {/* Product Details & Information */}
                <Box>
                  <FormLabel>Product Details</FormLabel>
                  <FieldArray name="productDetails">
                    {({ push, remove }) => (
                      <VStack spacing={3} align="stretch">
                        {props.values.productDetails.map(
                          (detail: any, index: number) => (
                            <HStack key={index}>
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
                                      form.errors.productDetails?.[index]
                                        ?.value &&
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
                                colorScheme="red"
                                variant="ghost"
                                onClick={() => remove(index)}
                              />
                            </HStack>
                          )
                        )}
                        <Button
                          leftIcon={<FaPlus />}
                          size="sm"
                          variant="outline"
                          onClick={() => push({ key: "", value: "" })}
                          alignSelf="flex-start"
                        >
                          Add Detail
                        </Button>
                      </VStack>
                    )}
                  </FieldArray>
                </Box>

                <Box>
                  <FormLabel>Extra Information</FormLabel>
                  <FieldArray name="information">
                    {({ push, remove }) => (
                      <VStack spacing={3} align="stretch">
                        {props.values.information.map(
                          (info: any, index: number) => (
                            <HStack key={index}>
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
                                colorScheme="red"
                                variant="ghost"
                                onClick={() => remove(index)}
                              />
                            </HStack>
                          )
                        )}
                        <Button
                          leftIcon={<FaPlus />}
                          size="sm"
                          variant="outline"
                          onClick={() => push({ key: "", value: "" })}
                          alignSelf="flex-start"
                        >
                          Add Information
                        </Button>
                      </VStack>
                    )}
                  </FieldArray>
                </Box>

                <Box pt={4}>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    size="lg"
                    isLoading={props.isSubmitting}
                    width="full"
                  >
                    {isEdit ? "Update Product" : "Create Product"}
                  </Button>
                </Box>
              </VStack>
            </Form>
          )
        }}
      </Formik>
    </CustomDrawer>
  );
};

export default ProductForm;