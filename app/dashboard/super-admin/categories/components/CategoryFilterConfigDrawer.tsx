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
} from "@chakra-ui/react";
import { Field, FieldArray, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import CustomDrawer from "../../../../component/common/Drawer/CustomDrawer";
import stores from "../../../../store/stores";
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

    return (
        <CustomDrawer
            title={`Product Filters - ${category.name}`}
            open={isOpen}
            close={onClose}
            width="62vw"
        >
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
                                            <Button size="sm" leftIcon={<FiPlus />} colorScheme="blue" variant="outline" onClick={() => push(createFilterConfigItem())}>
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
                                                                <Badge colorScheme="blue" borderRadius="full" px={3} py={1}>
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
                                                                            <Switch {...field} isChecked={field.value} colorScheme="blue" />
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

                                                        <SimpleGrid columns={{ base: 1, xl: needsKey ? 3 : 2 }} spacing={3}>
                                                            <Field name={`filterConfig.${index}.label`}>
                                                                {({ field }: any) => (
                                                                    <FormControl>
                                                                        <FormLabel fontSize="sm">Buyer filter name</FormLabel>
                                                                        <Input {...field} placeholder="Brand, Color, Storage" />
                                                                    </FormControl>
                                                                )}
                                                            </Field>

                                                            <Field name={`filterConfig.${index}.source`}>
                                                                {({ field, form }: any) => (
                                                                    <FormControl>
                                                                        <FormLabel fontSize="sm">Values come from</FormLabel>
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

                                                            {needsKey && (
                                                                <Field name={`filterConfig.${index}.sourceKey`}>
                                                                    {({ field }: any) => (
                                                                        <FormControl>
                                                                            <FormLabel fontSize="sm">{keyMeta.label}</FormLabel>
                                                                            <Input {...field} placeholder={keyMeta.placeholder} />
                                                                        </FormControl>
                                                                    )}
                                                                </Field>
                                                            )}
                                                        </SimpleGrid>

                                                        <SimpleGrid columns={{ base: 1, xl: supportsAllowedValues(item.source) ? 3 : 2 }} spacing={3} mt={3}>
                                                            <Field name={`filterConfig.${index}.type`}>
                                                                {({ field }: any) => (
                                                                    <FormControl>
                                                                        <FormLabel fontSize="sm">Display style</FormLabel>
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

                                                            {supportsAllowedValues(item.source) && (
                                                                <Field name={`filterConfig.${index}.allowedValuesText`}>
                                                                    {({ field }: any) => (
                                                                        <FormControl>
                                                                            <FormLabel fontSize="sm">Limit to options</FormLabel>
                                                                            <Input {...field} placeholder={allowedValuePlaceholder[item.source] || "Option 1, Option 2"} />
                                                                            <FormHelperText fontSize="xs">
                                                                                Optional. Leave empty to show values from products.
                                                                            </FormHelperText>
                                                                        </FormControl>
                                                                    )}
                                                                </Field>
                                                            )}

                                                            <Field name={`filterConfig.${index}.sortOrder`}>
                                                                {({ field }: any) => (
                                                                    <FormControl>
                                                                        <FormLabel fontSize="sm">Position</FormLabel>
                                                                        <Input {...field} type="number" min={0} />
                                                                    </FormControl>
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

                            <Button type="submit" colorScheme="blue" isLoading={props.isSubmitting || categoryStore.loading}>
                                Save Product Filters
                            </Button>
                        </VStack>
                    </Form>
                )}
            </Formik>
        </CustomDrawer>
    );
};

export default observer(CategoryFilterConfigDrawer);
