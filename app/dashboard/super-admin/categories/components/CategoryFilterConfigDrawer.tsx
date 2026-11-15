import React from "react";
import {
    Badge,
    Box,
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    IconButton,
    Input,
    Select,
    SimpleGrid,
    Switch,
    Text,
    useToast,
    VStack,
    useBreakpointValue,
} from "@chakra-ui/react";
import { Field, FieldArray, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import CustomDrawer from "../../../../component/common/Drawer/CustomDrawer";
import BottomSheetDrawer from "../../../../component/common/Drawer/BottomSheetDrawer";
import stores from "../../../../store/stores";
import CustomInput from "../../../../component/config/component/customInput/CustomInput";
import {
    createFilterConfigItem,
    filterSourceOptions,
    filterTypeOptions,
    sourcesNeedingKey,
    toFormFilterConfig,
    toSubmitFilterConfig,
} from "./CategoryForm";

interface CategoryFilterConfigDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    category: any;
}

const fieldKeyMeta: Record<string, { label: string; placeholder: string }> = {
    variant: {
        label: "Variant name",
        placeholder: "Color, Size, Storage",
    },
    productDetails: {
        label: "Product detail name",
        placeholder: "RAM, Material, Capacity",
    },
    information: {
        label: "Information field name",
        placeholder: "Gender, Warranty, Fabric",
    },
};

const allowedValuePlaceholder: Record<string, string> = {
    brand: "Samsung, Apple, OnePlus",
    tag: "Budget, Full Sleeve, Gaming",
    variant: "Black, Blue, 128 GB",
    productDetails: "4 GB, 8 GB, 16 GB",
    information: "Men, Women, Unisex",
    deal: "Discounted, Featured",
    availability: "In stock, Out of stock",
};

const supportsAllowedValues = (source: string) => source !== "price";

const CategoryFilterConfigDrawer: React.FC<CategoryFilterConfigDrawerProps> = ({
    isOpen,
    onClose,
    category,
}) => {
    const { categoryStore } = stores;
    const toast = useToast();

    if (!category) {
        return null;
    }

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        const formData = new FormData();
        formData.append("filterConfig", JSON.stringify(toSubmitFilterConfig(values.filterConfig)));

        const res = await categoryStore.updateCategory(category._id, formData);

        if (res.status === "success") {
            toast({
                title: "Filters Updated",
                description: `${category.name} filters are now active for product search.`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            onClose();
        } else {
            toast({
                title: "Unable to update filters",
                description: res.message || "Something went wrong",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }

        setSubmitting(false);
    };

    const isMobile = useBreakpointValue({ base: true, md: false });
    const drawerTitle = `Product Filters - ${category.name}`;

    const formContent = (
        <Formik
            initialValues={{
                filterConfig: toFormFilterConfig(category.filterConfig || []),
            }}
            onSubmit={handleSubmit}
            enableReinitialize
        >
            {(props: any) => (
                <Form>
                    <VStack spacing={5} align="stretch">
                        <FieldArray name="filterConfig">
                            {({ push, remove }) => (
                                <Box>
                                    <HStack justify="space-between" mb={4} align={{ base: "start", md: "center" }} spacing={4}>
                                        <Box>
                                            <Text fontWeight="800" fontSize="lg">Product Filters</Text>
                                            <Text fontSize="sm" color="gray.500" mt={1}>
                                                {(props.values.filterConfig || []).length} configured for {category.name}
                                            </Text>
                                        </Box>
                                        <Button size="sm" leftIcon={<FiPlus />} colorScheme="brand" variant="outline" onClick={() => push(createFilterConfigItem())}>
                                            Add Filter
                                        </Button>
                                    </HStack>

                                    <VStack align="stretch" spacing={3}>
                                        {(props.values.filterConfig || []).length === 0 && (
                                            <Box border="1px dashed" borderColor="gray.300" borderRadius="md" p={5}>
                                                <Text color="gray.500" fontSize="sm">
                                                    No filters configured yet. Add a filter to make this category show advanced buyer filters.
                                                </Text>
                                            </Box>
                                        )}

                                        {(props.values.filterConfig || []).map((item: any, index: number) => {
                                            const needsKey = sourcesNeedingKey.has(item.source);
                                            const keyMeta = fieldKeyMeta[item.source] || fieldKeyMeta.productDetails;

                                            return (
                                                <Box key={index} border="1px solid" borderColor="gray.200" borderRadius="lg" p={4} bg="white">
                                                    <HStack justify="space-between" align="center" mb={4}>
                                                        <HStack spacing={2}>
                                                            <Badge colorScheme="brand" borderRadius="full" px={3} py={1}>
                                                                Filter {index + 1}
                                                            </Badge>
                                                            <Text fontWeight="800" noOfLines={1}>
                                                                {item.label || "Untitled filter"}
                                                            </Text>
                                                        </HStack>

                                                        <HStack spacing={3}>
                                                            <Field name={`filterConfig.${index}.isActive`}>
                                                                {({ field }: any) => (
                                                                    <HStack spacing={2}>
                                                                        <Text fontSize="sm" color="gray.600">Active</Text>
                                                                        <Switch {...field} isChecked={field.value} colorScheme="brand" />
                                                                    </HStack>
                                                                )}
                                                            </Field>

                                                            <IconButton
                                                                aria-label="Remove filter"
                                                                icon={<FiTrash2 />}
                                                                variant="ghost"
                                                                colorScheme="red"
                                                                onClick={() => remove(index)}
                                                            />
                                                        </HStack>
                                                    </HStack>

                                                    <SimpleGrid columns={{ base: 1, md: needsKey ? 3 : 2 }} spacing={3}>
                                                        <Field name={`filterConfig.${index}.label`}>
                                                            {({ field }: any) => (
                                                                <CustomInput
                                                                    label="Buyer filter name"
                                                                    name={`filterConfig.${index}.label`}
                                                                    placeholder="Brand, Color, Storage"
                                                                    value={field.value}
                                                                    onChange={field.onChange}
                                                                />
                                                            )}
                                                        </Field>

                                                        <Field name={`filterConfig.${index}.source`}>
                                                            {({ field, form }: any) => (
                                                                <CustomInput
                                                                    type="select"
                                                                    label="Values come from"
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

                                                        {needsKey && (
                                                            <Field name={`filterConfig.${index}.sourceKey`}>
                                                                {({ field }: any) => (
                                                                    <CustomInput
                                                                        label={keyMeta.label}
                                                                        name={`filterConfig.${index}.sourceKey`}
                                                                        placeholder={keyMeta.placeholder}
                                                                        value={field.value}
                                                                        onChange={field.onChange}
                                                                    />
                                                                )}
                                                            </Field>
                                                        )}
                                                    </SimpleGrid>

                                                    <SimpleGrid columns={{ base: 1, md: supportsAllowedValues(item.source) ? 3 : 2 }} spacing={3} mt={3}>
                                                        <Field name={`filterConfig.${index}.type`}>
                                                            {({ field, form }: any) => (
                                                                <CustomInput
                                                                    type="select"
                                                                    label="Display style"
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

                                                        {supportsAllowedValues(item.source) && (
                                                            <Field name={`filterConfig.${index}.allowedValuesText`}>
                                                                {({ field }: any) => (
                                                                    <CustomInput
                                                                        label="Limit to options (optional)"
                                                                        name={`filterConfig.${index}.allowedValuesText`}
                                                                        placeholder={allowedValuePlaceholder[item.source] || "Option 1, Option 2"}
                                                                        value={field.value}
                                                                        onChange={field.onChange}
                                                                    />
                                                                )}
                                                            </Field>
                                                        )}

                                                        <Field name={`filterConfig.${index}.sortOrder`}>
                                                            {({ field }: any) => (
                                                                <CustomInput
                                                                    type="number"
                                                                    label="Position"
                                                                    name={`filterConfig.${index}.sortOrder`}
                                                                    value={field.value}
                                                                    onChange={field.onChange}
                                                                />
                                                            )}
                                                        </Field>
                                                    </SimpleGrid>
                                                </Box>
                                            );
                                        })}
                                    </VStack>
                                </Box>
                            )}
                        </FieldArray>

                        <Button type="submit" colorScheme="brand" isLoading={props.isSubmitting || categoryStore.loading}>
                            Save Product Filters
                        </Button>
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
            width="62vw"
        >
            {formContent}
        </CustomDrawer>
    );
};

export default observer(CategoryFilterConfigDrawer);
