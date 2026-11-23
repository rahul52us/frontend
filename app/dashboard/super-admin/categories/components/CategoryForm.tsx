import React, { useEffect, useMemo } from "react";
import {
    Button,
    FormControl,
    FormLabel,
    VStack,
    Box,
    Switch,
    useToast,
    HStack,
    Text,
    useBreakpointValue,
} from "@chakra-ui/react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { observer } from "mobx-react-lite";
import stores from "../../../../store/stores";
import CustomDrawer from "../../../../component/common/Drawer/CustomDrawer";
import BottomSheetDrawer from "../../../../component/common/Drawer/BottomSheetDrawer";
import CustomInput from "../../../../component/config/component/customInput/CustomInput";
import { convertImageFileToWebp } from "../../../../config/utils/imageUpload";
import TagChipsInput from "./TagChipsInput";
import { FiPlus } from "react-icons/fi";
import CategoryCoverUpload from "./CategoryCoverUpload";
import CategoryFilterItemCard from "./CategoryFilterItemCard";

interface CategoryFormProps {
    isOpen: boolean;
    onClose: () => void;
    initialValues: any;
    isReadOnly?: boolean;
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
    allowedValues: [] as string[],
    allowedValuesText: "",
    sortOrder: 100,
    isActive: true,
    isRequired: false,
});

export const toFormFilterConfig = (filterConfig: any[] = []) =>
    filterConfig.map((item) => {
        const valuesList = Array.isArray(item?.allowedValues)
            ? item.allowedValues
            : String(item?.allowedValuesText || "")
                  .split(",")
                  .map((v: string) => v.trim())
                  .filter(Boolean);

        return {
            label: item?.label || "",
            source: item?.source || "productDetails",
            sourceKey: item?.sourceKey || "",
            type: item?.type || "checkbox",
            allowedValues: valuesList,
            allowedValuesText: valuesList.join(", "),
            sortOrder: item?.sortOrder ?? 100,
            isActive: item?.isActive ?? true,
            isRequired: Boolean(item?.isRequired),
        };
    });

export const toSubmitFilterConfig = (filterConfig: any[] = []) =>
    filterConfig
        .map((item) => {
            const values = Array.isArray(item?.allowedValues) && item.allowedValues.length > 0
                ? item.allowedValues
                : String(item?.allowedValuesText || "")
                      .split(",")
                      .map((value: string) => value.trim())
                      .filter(Boolean);

            return {
                label: String(item?.label || "").trim(),
                source: item?.source || "productDetails",
                sourceKey: sourcesNeedingKey.has(item?.source) ? String(item?.sourceKey || "").trim() : "",
                type: item?.type || "checkbox",
                allowedValues: values,
                sortOrder: Number(item?.sortOrder || 100),
                isActive: item?.isActive !== false,
                isRequired: Boolean(item?.isRequired),
            };
        })
        .filter((item) => item.label && (!sourcesNeedingKey.has(item.source) || item.sourceKey));

const CategoryForm: React.FC<CategoryFormProps> = ({
    isOpen,
    onClose,
    initialValues,
    isReadOnly = false,
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
        if (isReadOnly) return;

        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description || "");
        formData.append("isActive", values.isActive);
        formData.append("isFeatured", values.isFeatured);
        formData.append("keywords", JSON.stringify(values.keywords || []));
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
            res = await categoryStore.updateCategory(initialValues._id, formData);
        } else {
            res = await categoryStore.createCategory(formData);
        }

        setSubmitting(false);

        if (res.status === "success") {
            toast({
                title: "Success",
                description: `Category ${initialValues ? "updated" : "created"} successfully`,
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
    };

    const formValues = useMemo(() => {
        return {
            name: initialValues?.name || "",
            description: initialValues?.description || "",
            parent: initialValues?.parent?._id || initialValues?.parent || "",
            isActive: initialValues?.isActive ?? true,
            isFeatured: initialValues?.isFeatured ?? false,
            keywords: initialValues?.keywords || [],
            filterConfig: toFormFilterConfig(initialValues?.filterConfig || []),
            image: null,
        };
    }, [initialValues]);

    useEffect(() => {
        if (categoryStore.categories.length === 0) {
            categoryStore.getAllCategories();
        }
    }, [categoryStore]);

    const isMobile = useBreakpointValue({ base: true, md: false });
    const drawerTitle = isReadOnly ? "View Category" : initialValues ? "Edit Category" : "Add New Category";

    const parentOptions = useMemo(() => {
        return [
            { label: "None (Root)", value: "" },
            ...categoryStore.categories
                .filter((c: any) => c._id !== initialValues?._id)
                .map((cat: any) => ({
                    label: cat.name,
                    value: cat._id,
                })),
        ];
    }, [categoryStore.categories, initialValues?._id]);

    const formContent = (
        <Box>
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
                                    disabled={isReadOnly}
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
                                    disabled={isReadOnly}
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
                                    disabled={isReadOnly}
                                    rows={3}
                                />
                            )}
                        </Field>

                        {/* Search Synonyms / Keywords */}
                        <Field name="keywords">
                            {({ field, form }: any) => (
                                <Box>
                                    <FormLabel fontSize="sm" fontWeight="600" color="var(--color-text-primary, #0F172A)" mb={1}>
                                        Search Synonyms & Keywords
                                    </FormLabel>
                                    <TagChipsInput
                                        values={field.value || []}
                                        onChange={(tags) => form.setFieldValue("keywords", tags.map(t => t.toLowerCase()))}
                                        placeholder={isReadOnly ? "No synonyms added" : "Add synonym (e.g. whey, protein, gym) & press Enter"}
                                        disabled={isReadOnly}
                                    />
                                    <Text fontSize="xs" color="gray.500" mt={1}>
                                        Buyers can find this category and its products when searching for any of these terms.
                                    </Text>
                                </Box>
                            )}
                        </Field>

                        {/* Cover Image Upload Area */}
                        <CategoryCoverUpload
                            previewUrl={previewUrl}
                            initialImageUrl={initialValues?.image?.url}
                            isReadOnly={isReadOnly}
                            onFileSelect={(file) => {
                                props.setFieldValue("image", file);
                                if (file) {
                                    setPreviewUrl(URL.createObjectURL(file));
                                } else {
                                    setPreviewUrl(null);
                                }
                            }}
                            onRemovePreview={() => {
                                if (previewUrl) {
                                    URL.revokeObjectURL(previewUrl);
                                }
                                setPreviewUrl(null);
                                props.setFieldValue("image", null);
                            }}
                        />

                        {/* Product Filters Config */}
                        <FieldArray name="filterConfig">
                            {({ push, remove }) => (
                                <Box>
                                    <HStack justify="space-between" mb={3}>
                                        <Box>
                                            <FormLabel mb={0} fontSize="sm" fontWeight="700" color="var(--merchant-text, #ffffff)">
                                                Product Filters
                                            </FormLabel>
                                            <Text fontSize="xs" color="var(--merchant-text-muted, #94a3b8)">
                                                Approved filters shown on product search for this category.
                                            </Text>
                                        </Box>
                                        {!isReadOnly && (
                                            <Button
                                                size="sm"
                                                leftIcon={<FiPlus />}
                                                borderRadius="10px"
                                                onClick={() => push(createFilterConfigItem())}
                                            >
                                                Add Filter
                                            </Button>
                                        )}
                                    </HStack>

                                    <VStack align="stretch" spacing={3}>
                                        {(props.values.filterConfig || []).map((item: any, index: number) => (
                                            <CategoryFilterItemCard
                                                key={index}
                                                index={index}
                                                item={item}
                                                filterSourceOptions={filterSourceOptions}
                                                filterTypeOptions={filterTypeOptions}
                                                sourcesNeedingKey={sourcesNeedingKey}
                                                onRemove={remove}
                                                isReadOnly={isReadOnly}
                                            />
                                        ))}
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
                                        isDisabled={isReadOnly}
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
                                        isDisabled={isReadOnly}
                                        onChange={(e) => form.setFieldValue("isFeatured", e.target.checked)}
                                    />
                                </FormControl>
                            )}
                        </Field>

                        <Box pt={4}>
                            {!isReadOnly ? (
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
                            ) : (
                                <Button
                                    variant="outline"
                                    width="full"
                                    minH="48px"
                                    borderRadius="16px"
                                    borderColor="var(--merchant-border-strong, #1f2e46)"
                                    color="var(--merchant-text, #ffffff)"
                                    onClick={onClose}
                                >
                                    Close
                                </Button>
                            )}
                        </Box>
                    </VStack>
                </Form>
            )}
        </Formik>
        </Box>
    );

    if (isMobile) {
        return (
            <BottomSheetDrawer
                isOpen={isOpen}
                onClose={onClose}
                title={drawerTitle}
                size="full"
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
            width={{ base: "100%", md: "78vw", lg: "1050px", xl: "1150px" }}
        >
            {formContent}
        </CustomDrawer>
    );
};

export default observer(CategoryForm);
