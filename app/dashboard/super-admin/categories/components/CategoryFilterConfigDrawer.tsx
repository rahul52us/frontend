import React from "react";
import {
    Badge,
    Box,
    Button,
    Flex,
    HStack,
    Icon,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    SimpleGrid,
    Switch,
    Text,
    useBreakpointValue,
    useColorModeValue,
    useToast,
    VStack,
} from "@chakra-ui/react";
import { Field, FieldArray, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { FiChevronDown, FiPlus, FiTrash2, FiZap } from "react-icons/fi";
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
import { CATEGORY_PRESETS, CategoryPreset } from "../constants/categoryPresets";
import TagChipsInput from "./TagChipsInput";

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

const supportsAllowedValues = (source: string) => source !== "price";

const CategoryFilterConfigDrawer: React.FC<CategoryFilterConfigDrawerProps> = ({
    isOpen,
    onClose,
    category,
}) => {
    const { categoryStore } = stores;
    const toast = useToast();

    const bgCard = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const isMobile = useBreakpointValue({ base: true, md: false });

    if (!category) {
        return null;
    }

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        const formData = new FormData();
        formData.append("filterConfig", JSON.stringify(toSubmitFilterConfig(values.filterConfig)));

        const res = await categoryStore.updateCategory(category._id, formData);

        if (res.status === "success") {
            toast({
                title: "Filters & Catalog Updated",
                description: `${category.name} attributes and filters are now active.`,
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

    const drawerTitle = `Catalog & Filter Setup - ${category.name}`;

    const formContent = (
        <Formik
            initialValues={{
                filterConfig: toFormFilterConfig(category.filterConfig || []),
            }}
            onSubmit={handleSubmit}
            enableReinitialize
        >
            {(props: any) => {
                const applyPreset = (preset: CategoryPreset) => {
                    const existing = props.values.filterConfig || [];
                    const newItems = preset.attributes.map((attr) => ({
                        label: attr.label,
                        source: attr.source,
                        sourceKey: attr.sourceKey || "",
                        type: attr.type,
                        allowedValues: attr.allowedValues,
                        allowedValuesText: attr.allowedValues.join(", "),
                        sortOrder: attr.sortOrder,
                        isActive: attr.isActive,
                        isRequired: Boolean(attr.isRequired),
                    }));

                    // Append unique items or replace if empty
                    const combined = [...existing];
                    newItems.forEach((item) => {
                        const exists = combined.some(
                            (c) => c.label.toLowerCase() === item.label.toLowerCase()
                        );
                        if (!exists) {
                            combined.push(item);
                        }
                    });

                    props.setFieldValue("filterConfig", combined);
                    toast({
                        title: `${preset.name} Preset Applied`,
                        description: `Added standard attributes for ${preset.name}.`,
                        status: "info",
                        duration: 3000,
                        isClosable: true,
                    });
                };

                return (
                    <Form>
                        <VStack spacing={5} align="stretch">
                            {/* Preset Quick Loader Bar */}
                            <Box
                                p={3.5}
                                borderRadius="2xl"
                                bg={useColorModeValue("blue.50", "rgba(59, 130, 246, 0.1)")}
                                border="1px solid"
                                borderColor={useColorModeValue("blue.100", "rgba(59, 130, 246, 0.25)")}
                            >
                                <Flex
                                    direction={{ base: "column", sm: "row" }}
                                    justify="space-between"
                                    align={{ sm: "center" }}
                                    gap={2.5}
                                >
                                    <HStack spacing={2.5}>
                                        <Flex
                                            boxSize="32px"
                                            borderRadius="full"
                                            align="center"
                                            justify="center"
                                            bg="blue.500"
                                            color="white"
                                            flexShrink={0}
                                        >
                                            <Icon as={FiZap} boxSize={4} />
                                        </Flex>
                                        <Box>
                                            <Text fontSize="12.5px" fontWeight="700" color={useColorModeValue("blue.900", "blue.100")}>
                                                1-Click Catalog Presets
                                            </Text>
                                            <Text fontSize="11px" color={useColorModeValue("blue.700", "blue.300")}>
                                                Auto-fill industry standard attributes (Fashion, Mobiles, Shoes, etc.)
                                            </Text>
                                        </Box>
                                    </HStack>

                                    <Menu>
                                        <MenuButton
                                            as={Button}
                                            size="sm"
                                            rightIcon={<FiChevronDown />}
                                            colorScheme="blue"
                                            borderRadius="full"
                                            px={4}
                                            fontSize="xs"
                                            fontWeight="700"
                                            alignSelf={{ base: "flex-start", sm: "auto" }}
                                        >
                                            Load Template
                                        </MenuButton>
                                        <MenuList zIndex={100} borderRadius="xl" shadow="xl" py={2}>
                                          {CATEGORY_PRESETS.map((preset) => (
                                              <MenuItem
                                                  key={preset.id}
                                                  onClick={() => applyPreset(preset)}
                                                  py={2}
                                              >
                                                  <Box>
                                                      <Text fontSize="13px" fontWeight="700">
                                                          {preset.name}
                                                      </Text>
                                                      <Text fontSize="11px" color="gray.500">
                                                          {preset.description} ({preset.attributes.length} attributes)
                                                      </Text>
                                                  </Box>
                                              </MenuItem>
                                          ))}
                                        </MenuList>
                                    </Menu>
                                </Flex>
                            </Box>

                            <FieldArray name="filterConfig">
                                {({ push, remove }) => (
                                    <Box>
                                        <HStack justify="space-between" mb={4} align={{ base: "start", md: "center" }} spacing={4}>
                                            <Box>
                                                <Text fontWeight="800" fontSize="lg">Category Attributes & Buyer Filters</Text>
                                                <Text fontSize="xs" color="gray.500" mt={0.5}>
                                                    {(props.values.filterConfig || []).length} configured for {category.name}. Sellers choose these when uploading products.
                                                </Text>
                                            </Box>
                                            <Button
                                                size="sm"
                                                leftIcon={<FiPlus />}
                                                colorScheme="brand"
                                                borderRadius="full"
                                                px={4}
                                                onClick={() => push(createFilterConfigItem())}
                                            >
                                                Add Attribute
                                            </Button>
                                        </HStack>

                                        <VStack align="stretch" spacing={3}>
                                            {(props.values.filterConfig || []).length === 0 && (
                                                <Box
                                                    border="1px dashed"
                                                    borderColor={borderColor}
                                                    borderRadius="2xl"
                                                    p={8}
                                                    textAlign="center"
                                                    bg={useColorModeValue("gray.50", "gray.900")}
                                                >
                                                    <Text fontWeight="700" color="gray.600" mb={1}>
                                                        No attributes configured yet
                                                    </Text>
                                                    <Text color="gray.500" fontSize="xs" maxW="400px" mx="auto">
                                                        Add attributes like RAM, Size, Color, or click "Load Template" above to instantly populate standards.
                                                    </Text>
                                                </Box>
                                            )}

                                            {(props.values.filterConfig || []).map((item: any, index: number) => {
                                                const needsKey = sourcesNeedingKey.has(item.source);
                                                const keyMeta = fieldKeyMeta[item.source] || fieldKeyMeta.productDetails;

                                                return (
                                                    <Box
                                                        key={index}
                                                        border="1px solid"
                                                        borderColor={borderColor}
                                                        borderRadius="2xl"
                                                        p={{ base: 3.5, md: 4 }}
                                                        bg={bgCard}
                                                        boxShadow="sm"
                                                        transition="all 0.2s"
                                                        _hover={{ borderColor: "blue.300" }}
                                                    >
                                                        <Flex
                                                            justify="space-between"
                                                            align="center"
                                                            mb={3.5}
                                                            wrap="wrap"
                                                            gap={2}
                                                        >
                                                            <HStack spacing={2} minW={0} flex={1}>
                                                                <Badge colorScheme="blue" borderRadius="full" px={2.5} py={0.5} fontSize="11px">
                                                                    #{index + 1}
                                                                </Badge>
                                                                <Text fontWeight="800" fontSize="sm" noOfLines={1}>
                                                                    {item.label || "Untitled Attribute"}
                                                                </Text>
                                                                {item.isRequired && (
                                                                    <Badge colorScheme="red" borderRadius="full" px={2} fontSize="10px">
                                                                        Required for Seller
                                                                    </Badge>
                                                                )}
                                                            </HStack>

                                                            <HStack spacing={3}>
                                                                {/* Mandatory Toggle */}
                                                                <Field name={`filterConfig.${index}.isRequired`}>
                                                                    {({ field }: any) => (
                                                                        <HStack spacing={1.5}>
                                                                            <Text fontSize="xs" color="gray.600" fontWeight="600">Mandatory</Text>
                                                                            <Switch {...field} isChecked={field.value} colorScheme="red" size="sm" />
                                                                        </HStack>
                                                                    )}
                                                                </Field>

                                                                {/* Active Toggle */}
                                                                <Field name={`filterConfig.${index}.isActive`}>
                                                                    {({ field }: any) => (
                                                                        <HStack spacing={1.5}>
                                                                            <Text fontSize="xs" color="gray.600" fontWeight="600">Active</Text>
                                                                            <Switch {...field} isChecked={field.value} colorScheme="green" size="sm" />
                                                                        </HStack>
                                                                    )}
                                                                </Field>

                                                                <IconButton
                                                                    aria-label="Remove attribute"
                                                                    icon={<FiTrash2 />}
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    colorScheme="red"
                                                                    borderRadius="full"
                                                                    onClick={() => remove(index)}
                                                                />
                                                            </HStack>
                                                        </Flex>

                                                        <SimpleGrid columns={{ base: 1, md: needsKey ? 3 : 2 }} spacing={3}>
                                                            <Field name={`filterConfig.${index}.label`}>
                                                                {({ field }: any) => (
                                                                    <CustomInput
                                                                        label="Attribute Name (Buyer Filter)"
                                                                        name={`filterConfig.${index}.label`}
                                                                        placeholder="e.g. RAM, Shoe Size, Fabric"
                                                                        value={field.value}
                                                                        onChange={field.onChange}
                                                                    />
                                                                )}
                                                            </Field>

                                                            <Field name={`filterConfig.${index}.source`}>
                                                                {({ field, form }: any) => (
                                                                    <CustomInput
                                                                        type="select"
                                                                        label="Field Category"
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

                                                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} mt={3}>
                                                            <Field name={`filterConfig.${index}.type`}>
                                                                {({ field, form }: any) => (
                                                                    <CustomInput
                                                                        type="select"
                                                                        label="Selection UI Style"
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

                                                            <Field name={`filterConfig.${index}.sortOrder`}>
                                                                {({ field }: any) => (
                                                                    <CustomInput
                                                                        type="number"
                                                                        label="Display Priority (Order)"
                                                                        name={`filterConfig.${index}.sortOrder`}
                                                                        value={field.value}
                                                                        onChange={field.onChange}
                                                                    />
                                                                )}
                                                            </Field>
                                                        </SimpleGrid>

                                                        {/* Interactive Tag Chips for Allowed Values */}
                                                        {supportsAllowedValues(item.source) && (
                                                            <Box mt={3.5}>
                                                                <TagChipsInput
                                                                    label="Allowed Options (Sellers select from these only)"
                                                                    placeholder="Type option (e.g. 8 GB) & press Enter or comma"
                                                                    values={item.allowedValues || []}
                                                                    onChange={(newValues) => {
                                                                        props.setFieldValue(`filterConfig.${index}.allowedValues`, newValues);
                                                                        props.setFieldValue(
                                                                            `filterConfig.${index}.allowedValuesText`,
                                                                            newValues.join(", ")
                                                                        );
                                                                    }}
                                                                    helperText="Add the specific values sellers can choose. Prevents typos like '8gb', 'Eight GB'."
                                                                />
                                                            </Box>
                                                        )}
                                                    </Box>
                                                );
                                            })}
                                        </VStack>
                                    </Box>
                                )}
                            </FieldArray>

                            <Button
                                type="submit"
                                colorScheme="brand"
                                size="lg"
                                borderRadius="xl"
                                fontWeight="700"
                                isLoading={props.isSubmitting || categoryStore.loading}
                            >
                                Save Catalog & Filters
                            </Button>
                        </VStack>
                    </Form>
                );
            }}
        </Formik>
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

export default observer(CategoryFilterConfigDrawer);
