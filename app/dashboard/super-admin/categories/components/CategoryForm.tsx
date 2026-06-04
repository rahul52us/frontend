import React, { useEffect } from "react";
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    FormErrorMessage,
    Textarea,
    Box,
    Select,
    Switch,
    useToast,
    HStack,
    Text,
    IconButton,
} from "@chakra-ui/react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { observer } from "mobx-react-lite";
import stores from "../../../../store/stores";
import CustomDrawer from "../../../../component/common/Drawer/CustomDrawer";
import { convertImageFileToWebp } from "../../../../config/utils/imageUpload";
import { FiPlus, FiTrash2 } from "react-icons/fi";

interface CategoryFormProps {
    isOpen: boolean;
    onClose: () => void;
    initialValues: any;
}

const CategoryValidationSchema = Yup.object().shape({
    name: Yup.string().required("Category name is required"),
    description: Yup.string(),
    parent: Yup.string().nullable(),
    isActive: Yup.boolean(),
    isFeatured: Yup.boolean(),
    filterConfig: Yup.array().of(
        Yup.object().shape({
            label: Yup.string().required("Label is required"),
            source: Yup.string().required("Source is required"),
            sourceKey: Yup.string(),
            type: Yup.string().required("Type is required"),
            allowedValuesText: Yup.string(),
            sortOrder: Yup.number().min(0),
            isActive: Yup.boolean(),
        })
    ),
});

export const filterSourceOptions = [
    { value: "brand", label: "Product brand" },
    { value: "price", label: "Price range" },
    { value: "deal", label: "Deals and discounts" },
    { value: "availability", label: "Stock availability" },
    { value: "tag", label: "Tags / shopping ideas" },
    { value: "variant", label: "Variant option" },
    { value: "productDetails", label: "Product details field" },
    { value: "information", label: "Product information field" },
];

export const filterTypeOptions = [
    { value: "checkbox", label: "Checkbox" },
    { value: "pills", label: "Pills" },
    { value: "color", label: "Color" },
    { value: "range", label: "Range" },
];

export const sourcesNeedingKey = new Set(["variant", "productDetails", "information"]);

export const createFilterConfigItem = () => ({
    label: "",
    source: "productDetails",
    sourceKey: "",
    type: "checkbox",
    allowedValuesText: "",
    sortOrder: 100,
    isActive: true,
});

export const toFormFilterConfig = (filterConfig: any[] = []) =>
    filterConfig.map((item) => ({
        label: item?.label || "",
        source: item?.source || "productDetails",
        sourceKey: item?.sourceKey || "",
        type: item?.type || "checkbox",
        allowedValuesText: Array.isArray(item?.allowedValues) ? item.allowedValues.join(", ") : "",
        sortOrder: item?.sortOrder ?? 100,
        isActive: item?.isActive ?? true,
    }));

export const toSubmitFilterConfig = (filterConfig: any[] = []) =>
    filterConfig
        .map((item) => ({
            label: String(item?.label || "").trim(),
            source: item?.source || "productDetails",
            sourceKey: sourcesNeedingKey.has(item?.source) ? String(item?.sourceKey || "").trim() : "",
            type: item?.type || "checkbox",
            allowedValues: String(item?.allowedValuesText || "")
                .split(",")
                .map((value) => value.trim())
                .filter(Boolean),
            sortOrder: Number(item?.sortOrder || 100),
            isActive: item?.isActive !== false,
        }))
        .filter((item) => item.label && (!sourcesNeedingKey.has(item.source) || item.sourceKey));

const CategoryForm: React.FC<CategoryFormProps> = ({
    isOpen,
    onClose,
    initialValues,
}) => {
    const { categoryStore } = stores;
    const toast = useToast();
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description || "");
        formData.append("isActive", values.isActive);
        formData.append("isFeatured", values.isFeatured);
        formData.append("filterConfig", JSON.stringify(toSubmitFilterConfig(values.filterConfig)));
        if (values.parent) {
            formData.append("parent", values.parent);
        }
        if (values.image instanceof File) {
            const normalizedImage = await convertImageFileToWebp(values.image);
            formData.append("image", normalizedImage, normalizedImage.name);
        }

        let res;
        if (initialValues?._id) {
            // Handle image delete flag if needed, currently assuming replacement or keeping old
            res = await categoryStore.updateCategory(initialValues._id, formData);
        } else {
            res = await categoryStore.createCategory(formData);
        }

        if (res.status === "success") {
            toast({
                title: initialValues?._id ? "Category Updated" : "Category Created",
                description: initialValues?._id
                    ? "The category has been successfully updated."
                    : "The new category has been successfully created.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            onClose();
        } else {
            toast({
                title: "Error",
                description: res.message || "Something went wrong",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
        setSubmitting(false);
    };

    const formValues = {
        name: initialValues?.name || "",
        description: initialValues?.description || "",
        parent: initialValues?.parent?._id || initialValues?.parent || "",
        isActive: initialValues?.isActive ?? true,
        isFeatured: initialValues?.isFeatured ?? false,
        filterConfig: toFormFilterConfig(initialValues?.filterConfig || []),
        image: initialValues?.image || null,
    };

    // Ensure parents are loaded for the dropdown
    useEffect(() => {
        if (categoryStore.categories.length === 0) {
            categoryStore.getAllCategories();
        }
    }, [categoryStore]);

    return (
        <CustomDrawer
            title={initialValues ? "Edit Category" : "Add New Category"}
            open={isOpen}
            close={onClose}
            width="52vw"
        >
            <Formik
                initialValues={formValues}
                validationSchema={CategoryValidationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {(props: any) => (
                    <Form>
                        <VStack spacing={4} align="stretch">
                            <Field name="name">
                                {({ field, form }: any) => (
                                    <FormControl
                                        isInvalid={form.errors.name && form.touched.name}
                                        isRequired
                                    >
                                        <FormLabel>Category Name</FormLabel>
                                        <Input {...field} placeholder="Enter category name" />
                                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>

                            <Field name="parent">
                                {({ field }: any) => (
                                    <FormControl>
                                        <FormLabel>Parent Category</FormLabel>
                                        <Select {...field} placeholder="Select parent category (optional)">
                                            <option value="">None (Root)</option>
                                            {categoryStore.categories
                                                .filter((c: any) => c._id !== initialValues?._id) // Prevent self-parenting
                                                .map((category: any) => (
                                                    <option key={category._id} value={category._id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                        </Select>
                                    </FormControl>
                                )}
                            </Field>

                            <Field name="description">
                                {({ field }: any) => (
                                    <FormControl>
                                        <FormLabel>Description</FormLabel>
                                        <Textarea
                                            {...field}
                                            placeholder="Enter description"
                                            rows={3}
                                        />
                                    </FormControl>
                                )}
                            </Field>

                            <FormControl>
                                <FormLabel>Cover Image</FormLabel>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(event: any) => {
                                        const file = event.currentTarget.files[0];
                                        props.setFieldValue("image", file);
                                        if (file) {
                                            setPreviewUrl(URL.createObjectURL(file));
                                        }
                                    }}
                                    pt={1}
                                />
                                {previewUrl ? (
                                    <Box mt={2} w="100px" h="100px" borderRadius="md" overflow="hidden">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </Box>
                                ) : initialValues?.image?.url ? (
                                    <Box mt={2} w="100px" h="100px" borderRadius="md" overflow="hidden">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={initialValues.image.url} alt="Current" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </Box>
                                ) : null}
                            </FormControl>

                            <FieldArray name="filterConfig">
                                {({ push, remove }) => (
                                    <Box>
                                        <HStack justify="space-between" mb={3}>
                                            <Box>
                                                <FormLabel mb={0}>Product Filters</FormLabel>
                                                <Text fontSize="sm" color="gray.500">
                                                    Approved filters shown on product search for this category.
                                                </Text>
                                            </Box>
                                            <Button
                                                size="sm"
                                                leftIcon={<FiPlus />}
                                                onClick={() => push(createFilterConfigItem())}
                                            >
                                                Add Filter
                                            </Button>
                                        </HStack>

                                        <VStack align="stretch" spacing={3}>
                                            {(props.values.filterConfig || []).map((item: any, index: number) => {
                                                const needsKey = sourcesNeedingKey.has(item.source);

                                                return (
                                                    <Box
                                                        key={index}
                                                        border="1px solid"
                                                        borderColor="gray.200"
                                                        borderRadius="md"
                                                        p={3}
                                                    >
                                                        <HStack align="flex-start" spacing={3}>
                                                            <Field name={`filterConfig.${index}.label`}>
                                                                {({ field }: any) => (
                                                                    <FormControl>
                                                                        <FormLabel fontSize="sm">Label</FormLabel>
                                                                        <Input {...field} placeholder="Storage" />
                                                                    </FormControl>
                                                                )}
                                                            </Field>

                                                            <Field name={`filterConfig.${index}.source`}>
                                                                {({ field, form }: any) => (
                                                                    <FormControl>
                                                                        <FormLabel fontSize="sm">Source</FormLabel>
                                                                        <Select
                                                                            {...field}
                                                                            onChange={(event) => {
                                                                                field.onChange(event);
                                                                                if (!sourcesNeedingKey.has(event.target.value)) {
                                                                                    form.setFieldValue(`filterConfig.${index}.sourceKey`, "");
                                                                                }
                                                                            }}
                                                                        >
                                                                            {filterSourceOptions.map((option) => (
                                                                                <option key={option.value} value={option.value}>
                                                                                    {option.label}
                                                                                </option>
                                                                            ))}
                                                                        </Select>
                                                                    </FormControl>
                                                                )}
                                                            </Field>

                                                            <Field name={`filterConfig.${index}.sourceKey`}>
                                                                {({ field }: any) => (
                                                                    <FormControl isDisabled={!needsKey}>
                                                                        <FormLabel fontSize="sm">Field Key</FormLabel>
                                                                        <Input {...field} placeholder={needsKey ? "Color" : "-"} />
                                                                    </FormControl>
                                                                )}
                                                            </Field>

                                                            <IconButton
                                                                mt={8}
                                                                aria-label="Remove filter"
                                                                icon={<FiTrash2 />}
                                                                variant="ghost"
                                                                colorScheme="red"
                                                                onClick={() => remove(index)}
                                                            />
                                                        </HStack>

                                                        <HStack align="flex-start" spacing={3} mt={3}>
                                                            <Field name={`filterConfig.${index}.type`}>
                                                                {({ field }: any) => (
                                                                    <FormControl>
                                                                        <FormLabel fontSize="sm">Display</FormLabel>
                                                                        <Select {...field}>
                                                                            {filterTypeOptions.map((option) => (
                                                                                <option key={option.value} value={option.value}>
                                                                                    {option.label}
                                                                                </option>
                                                                            ))}
                                                                        </Select>
                                                                    </FormControl>
                                                                )}
                                                            </Field>

                                                            <Field name={`filterConfig.${index}.allowedValuesText`}>
                                                                {({ field }: any) => (
                                                                    <FormControl>
                                                                        <FormLabel fontSize="sm">Allowed Values</FormLabel>
                                                                        <Input {...field} placeholder="Samsung, Apple, Xiaomi" />
                                                                    </FormControl>
                                                                )}
                                                            </Field>

                                                            <Field name={`filterConfig.${index}.sortOrder`}>
                                                                {({ field }: any) => (
                                                                    <FormControl maxW="120px">
                                                                        <FormLabel fontSize="sm">Order</FormLabel>
                                                                        <Input {...field} type="number" min={0} />
                                                                    </FormControl>
                                                                )}
                                                            </Field>

                                                            <Field name={`filterConfig.${index}.isActive`}>
                                                                {({ field }: any) => (
                                                                    <FormControl maxW="110px" pt={8}>
                                                                        <Switch
                                                                            {...field}
                                                                            isChecked={field.value}
                                                                        />
                                                                    </FormControl>
                                                                )}
                                                            </Field>
                                                        </HStack>
                                                    </Box>
                                                );
                                            })}
                                        </VStack>
                                    </Box>
                                )}
                            </FieldArray>

                            <Field name="isActive">
                                {({ field }: any) => (
                                    <FormControl display="flex" alignItems="center">
                                        <FormLabel htmlFor="isActive" mb="0">
                                            Is Active?
                                        </FormLabel>
                                        <Switch
                                            id="isActive"
                                            {...field}
                                            isChecked={field.value}
                                        />
                                    </FormControl>
                                )}
                            </Field>

                            <Field name="isFeatured">
                                {({ field }: any) => (
                                    <FormControl display="flex" alignItems="center">
                                        <FormLabel htmlFor="isFeatured" mb="0">
                                            Show on Home Page?
                                        </FormLabel>
                                        <Switch
                                            id="isFeatured"
                                            {...field}
                                            isChecked={field.value}
                                        />
                                    </FormControl>
                                )}
                            </Field>

                            <Box pt={4}>
                                <Button
                                    type="submit"
                                    colorScheme="blue"
                                    width="full"
                                    isLoading={props.isSubmitting}
                                >
                                    {initialValues ? "Update Category" : "Add Category"}
                                </Button>
                            </Box>
                        </VStack>
                    </Form>
                )}
            </Formik>
        </CustomDrawer>
    );
};

export default observer(CategoryForm);
