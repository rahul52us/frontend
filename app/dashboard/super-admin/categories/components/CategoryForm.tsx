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
    Stack,
    useBreakpointValue,
    Flex,
} from "@chakra-ui/react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { observer } from "mobx-react-lite";
import stores from "../../../../store/stores";
import CustomDrawer from "../../../../component/common/Drawer/CustomDrawer";
import BottomSheetDrawer from "../../../../component/common/Drawer/BottomSheetDrawer";
import CustomInput from "../../../../component/config/component/customInput/CustomInput";
import { convertImageFileToWebp } from "../../../../config/utils/imageUpload";
import { FiPlus, FiTrash2, FiUploadCloud, FiImage, FiX } from "react-icons/fi";

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

    const isMobile = useBreakpointValue({ base: true, md: false });
    const drawerTitle = initialValues ? "Edit Category" : "Add New Category";

    const parentOptions = [
        { label: "None (Root)", value: "" },
        ...categoryStore.categories
            .filter((c: any) => c._id !== initialValues?._id)
            .map((cat: any) => ({
                label: cat.name,
                value: cat._id,
            })),
    ];

    const formContent = (
        <Formik
            initialValues={formValues}
            validationSchema={CategoryValidationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
        >
            {(props: any) => (
                <Form id="category-form">
                    <VStack spacing={4} align="stretch">
                        <Field name="name">
                            {({ field, form }: any) => (
                                <CustomInput
                                    label="Category Name"
                                    placeholder="Enter category name"
                                    name="name"
                                    value={field.value}
                                    onChange={field.onChange}
                                    required
                                    showError={Boolean(form.errors.name && form.touched.name)}
                                    error={form.errors.name}
                                />
                            )}
                        </Field>

                        <Field name="parent">
                            {({ field, form }: any) => (
                                <CustomInput
                                    type="select"
                                    label="Parent Category"
                                    placeholder="Select parent category (optional)"
                                    name="parent"
                                    value={parentOptions.find((opt) => opt.value === field.value) || { label: "None (Root)", value: "" }}
                                    options={parentOptions}
                                    onChange={(opt: any) => {
                                        form.setFieldValue("parent", opt ? opt.value : "");
                                    }}
                                    isPortal
                                />
                            )}
                        </Field>

                        <Field name="description">
                            {({ field }: any) => (
                                <CustomInput
                                    type="textarea"
                                    label="Description"
                                    placeholder="Enter description"
                                    name="description"
                                    value={field.value}
                                    onChange={field.onChange}
                                    rows={3}
                                />
                            )}
                        </Field>

                        {/* Cover Image Upload Area */}
                        <Box>
                            <FormLabel fontSize="sm" fontWeight="600" color="var(--dashboard-text-muted, #4A5568)" mb={2}>
                                Cover Image
                            </FormLabel>

                            {previewUrl || initialValues?.image?.url ? (
                                <Box
                                    position="relative"
                                    borderWidth="1px"
                                    borderColor="var(--dashboard-input-border, #CBD5E0)"
                                    borderRadius="20px"
                                    overflow="hidden"
                                    bg="var(--dashboard-surface, #ffffff)"
                                    boxShadow="sm"
                                    p={2.5}
                                >
                                    <Box
                                        position="relative"
                                        w="100%"
                                        h={{ base: "160px", sm: "200px" }}
                                        borderRadius="16px"
                                        overflow="hidden"
                                        bg="blackAlpha.50"
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={previewUrl || initialValues?.image?.url}
                                            alt="Cover Preview"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                        />

                                        {/* Change photo overlay button */}
                                        <HStack
                                            position="absolute"
                                            bottom={2.5}
                                            right={2.5}
                                            spacing={2}
                                        >
                                            <Button
                                                as="label"
                                                htmlFor="category-cover-image-input"
                                                size="sm"
                                                leftIcon={<FiUploadCloud />}
                                                borderRadius="12px"
                                                bg="whiteAlpha.900"
                                                color="gray.800"
                                                backdropFilter="blur(8px)"
                                                boxShadow="md"
                                                cursor="pointer"
                                                _hover={{ bg: "white" }}
                                            >
                                                Change
                                            </Button>
                                            {previewUrl && (
                                                <IconButton
                                                    aria-label="Remove selected image"
                                                    icon={<FiX size={16} />}
                                                    size="sm"
                                                    borderRadius="12px"
                                                    bg="blackAlpha.700"
                                                    color="white"
                                                    backdropFilter="blur(8px)"
                                                    _hover={{ bg: "blackAlpha.900" }}
                                                    onClick={() => {
                                                        if (previewUrl) {
                                                            URL.revokeObjectURL(previewUrl);
                                                        }
                                                        setPreviewUrl(null);
                                                        props.setFieldValue("image", null);
                                                    }}
                                                />
                                            )}
                                        </HStack>
                                    </Box>

                                    <input
                                        id="category-cover-image-input"
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        onChange={(event: any) => {
                                            const file = event.currentTarget.files[0];
                                            props.setFieldValue("image", file);
                                            if (file) {
                                                setPreviewUrl(URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                </Box>
                            ) : (
                                <Box
                                    as="label"
                                    htmlFor="category-cover-image-input"
                                    display="block"
                                    cursor="pointer"
                                    borderWidth="1.5px"
                                    borderStyle="dashed"
                                    borderColor="var(--dashboard-input-border, #CBD5E0)"
                                    borderRadius="20px"
                                    bg="var(--merchant-surface-alt, #F8FAFC)"
                                    p={{ base: 5, sm: 6 }}
                                    textAlign="center"
                                    transition="all 0.2s ease"
                                    _hover={{
                                        borderColor: "var(--dashboard-accent, #3182CE)",
                                        bg: "var(--dashboard-accent-soft, #EBF8FF)",
                                    }}
                                >
                                    <VStack spacing={2.5}>
                                        <Flex
                                            w="50px"
                                            h="50px"
                                            borderRadius="16px"
                                            align="center"
                                            justify="center"
                                            bg="var(--dashboard-accent-soft, #EBF8FF)"
                                            color="var(--dashboard-accent, #3182CE)"
                                        >
                                            <FiUploadCloud size={24} />
                                        </Flex>
                                        <Box>
                                            <Text fontSize="sm" fontWeight="700" color="var(--dashboard-text, #1A202C)">
                                                Click or tap to upload cover photo
                                            </Text>
                                            <Text fontSize="xs" color="var(--dashboard-input-placeholder, #718096)" mt={0.5}>
                                                PNG, JPG or WebP (recommended 4:3 or 16:9 ratio)
                                            </Text>
                                        </Box>
                                    </VStack>
                                    <input
                                        id="category-cover-image-input"
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        onChange={(event: any) => {
                                            const file = event.currentTarget.files[0];
                                            props.setFieldValue("image", file);
                                            if (file) {
                                                setPreviewUrl(URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>

                        <FieldArray name="filterConfig">
                            {({ push, remove }) => (
                                <Box>
                                    <HStack justify="space-between" mb={3}>
                                        <Box>
                                            <FormLabel mb={0} fontSize="sm" fontWeight="700">Product Filters</FormLabel>
                                            <Text fontSize="xs" color="gray.500">
                                                Approved filters shown on product search for this category.
                                            </Text>
                                        </Box>
                                        <Button
                                            size="sm"
                                            leftIcon={<FiPlus />}
                                            borderRadius="12px"
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
                                                    borderColor="var(--dashboard-input-border, #CBD5E0)"
                                                    borderRadius="16px"
                                                    p={3.5}
                                                    bg="var(--merchant-surface-alt, #fafafa)"
                                                >
                                                    <Stack
                                                        direction={{ base: "column", sm: "row" }}
                                                        align={{ base: "stretch", sm: "flex-start" }}
                                                        spacing={3}
                                                    >
                                                        <Box flex="1">
                                                            <Field name={`filterConfig.${index}.label`}>
                                                                {({ field }: any) => (
                                                                    <CustomInput
                                                                        label="Label"
                                                                        name={`filterConfig.${index}.label`}
                                                                        placeholder="Storage"
                                                                        value={field.value}
                                                                        onChange={field.onChange}
                                                                    />
                                                                )}
                                                            </Field>
                                                        </Box>

                                                        <Box flex="1">
                                                            <Field name={`filterConfig.${index}.source`}>
                                                                {({ field, form }: any) => (
                                                                    <CustomInput
                                                                        type="select"
                                                                        label="Source"
                                                                        name={`filterConfig.${index}.source`}
                                                                        options={filterSourceOptions}
                                                                        value={filterSourceOptions.find((opt) => opt.value === field.value)}
                                                                        onChange={(opt: any) => {
                                                                            const val = opt ? opt.value : "";
                                                                            form.setFieldValue(`filterConfig.${index}.source`, val);
                                                                            if (!sourcesNeedingKey.has(val)) {
                                                                                form.setFieldValue(`filterConfig.${index}.sourceKey`, "");
                                                                            }
                                                                        }}
                                                                        isPortal
                                                                    />
                                                                )}
                                                            </Field>
                                                        </Box>

                                                        <Box flex="1">
                                                            <Field name={`filterConfig.${index}.sourceKey`}>
                                                                {({ field }: any) => (
                                                                    <CustomInput
                                                                        label="Field Key"
                                                                        name={`filterConfig.${index}.sourceKey`}
                                                                        placeholder={needsKey ? "Color" : "-"}
                                                                        disabled={!needsKey}
                                                                        value={field.value}
                                                                        onChange={field.onChange}
                                                                    />
                                                                )}
                                                            </Field>
                                                        </Box>

                                                        <IconButton
                                                            mt={{ base: 0, sm: 8 }}
                                                            alignSelf={{ base: "flex-end", sm: "auto" }}
                                                            aria-label="Remove filter"
                                                            icon={<FiTrash2 />}
                                                            variant="ghost"
                                                            colorScheme="red"
                                                            borderRadius="12px"
                                                            onClick={() => remove(index)}
                                                        />
                                                    </Stack>

                                                    <Stack
                                                        direction={{ base: "column", sm: "row" }}
                                                        align={{ base: "stretch", sm: "flex-start" }}
                                                        spacing={3}
                                                        mt={3}
                                                    >
                                                        <Box flex="1">
                                                            <Field name={`filterConfig.${index}.type`}>
                                                                {({ field, form }: any) => (
                                                                    <CustomInput
                                                                        type="select"
                                                                        label="Display"
                                                                        name={`filterConfig.${index}.type`}
                                                                        options={filterTypeOptions}
                                                                        value={filterTypeOptions.find((opt) => opt.value === field.value)}
                                                                        onChange={(opt: any) => {
                                                                            form.setFieldValue(`filterConfig.${index}.type`, opt ? opt.value : "checkbox");
                                                                        }}
                                                                        isPortal
                                                                    />
                                                                )}
                                                            </Field>
                                                        </Box>

                                                        <Box flex="1">
                                                            <Field name={`filterConfig.${index}.allowedValuesText`}>
                                                                {({ field }: any) => (
                                                                    <CustomInput
                                                                        label="Allowed Values"
                                                                        name={`filterConfig.${index}.allowedValuesText`}
                                                                        placeholder="Samsung, Apple, Xiaomi"
                                                                        value={field.value}
                                                                        onChange={field.onChange}
                                                                    />
                                                                )}
                                                            </Field>
                                                        </Box>

                                                        <Box maxW={{ base: "full", sm: "120px" }}>
                                                            <Field name={`filterConfig.${index}.sortOrder`}>
                                                                {({ field }: any) => (
                                                                    <CustomInput
                                                                        type="number"
                                                                        label="Order"
                                                                        name={`filterConfig.${index}.sortOrder`}
                                                                        value={field.value}
                                                                        onChange={field.onChange}
                                                                    />
                                                                )}
                                                            </Field>
                                                        </Box>

                                                        <Field name={`filterConfig.${index}.isActive`}>
                                                            {({ field, form }: any) => (
                                                                <FormControl maxW={{ base: "full", sm: "110px" }} pt={{ base: 1, sm: 8 }}>
                                                                    <HStack spacing={2} align="center">
                                                                        <FormLabel mb="0" fontSize="xs" color="gray.500" display={{ base: "inline-block", sm: "none" }}>
                                                                            Active:
                                                                        </FormLabel>
                                                                        <Switch
                                                                            {...field}
                                                                            isChecked={field.value}
                                                                            onChange={(e) => form.setFieldValue(`filterConfig.${index}.isActive`, e.target.checked)}
                                                                        />
                                                                    </HStack>
                                                                </FormControl>
                                                            )}
                                                        </Field>
                                                    </Stack>
                                                </Box>
                                            );
                                        })}
                                    </VStack>
                                </Box>
                            )}
                        </FieldArray>

                        <Field name="isActive">
                            {({ field, form }: any) => (
                                <FormControl display="flex" alignItems="center">
                                    <FormLabel htmlFor="isActive" mb="0" fontSize="sm" fontWeight="600">
                                        Is Active?
                                    </FormLabel>
                                    <Switch
                                        id="isActive"
                                        isChecked={field.value}
                                        onChange={(e) => form.setFieldValue("isActive", e.target.checked)}
                                    />
                                </FormControl>
                            )}
                        </Field>

                        <Field name="isFeatured">
                            {({ field, form }: any) => (
                                <FormControl display="flex" alignItems="center">
                                    <FormLabel htmlFor="isFeatured" mb="0" fontSize="sm" fontWeight="600">
                                        Show on Home Page?
                                    </FormLabel>
                                    <Switch
                                        id="isFeatured"
                                        isChecked={field.value}
                                        onChange={(e) => form.setFieldValue("isFeatured", e.target.checked)}
                                    />
                                </FormControl>
                            )}
                        </Field>

                        <Box pt={4}>
                            <Button
                                type="submit"
                                colorScheme="brand"
                                width="full"
                                minH="48px"
                                borderRadius="16px"
                                isLoading={props.isSubmitting}
                            >
                                {initialValues ? "Update Category" : "Add Category"}
                            </Button>
                        </Box>
                    </VStack>
                </Form>
            )}
        </Formik>
    );

    if (isMobile) {
        return (
            <BottomSheetDrawer
                isOpen={isOpen}
                onClose={onClose}
                title={drawerTitle}
                contentProps={{
                    maxH: "90dvh",
                }}
                bodyProps={{
                    overflowY: "auto",
                    px: 4,
                    py: 4,
                }}
            >
                {formContent}
            </BottomSheetDrawer>
        );
    }

    return (
        <CustomDrawer
            title={drawerTitle}
            open={isOpen}
            close={onClose}
            width="52vw"
        >
            {formContent}
        </CustomDrawer>
    );
};

export default observer(CategoryForm);
