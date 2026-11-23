import React from "react";
import {
    Box,
    FormControl,
    FormLabel,
    HStack,
    IconButton,
    Stack,
    Switch,
} from "@chakra-ui/react";
import { Field } from "formik";
import { FiTrash2 } from "react-icons/fi";
import CustomInput from "../../../../component/config/component/customInput/CustomInput";

interface CategoryFilterItemCardProps {
    index: number;
    item: any;
    filterSourceOptions: Array<{ label: string; value: string }>;
    filterTypeOptions: Array<{ label: string; value: string }>;
    sourcesNeedingKey: Set<string>;
    onRemove: (index: number) => void;
    isReadOnly?: boolean;
}

export const CategoryFilterItemCard: React.FC<CategoryFilterItemCardProps> = ({
    index,
    item,
    filterSourceOptions,
    filterTypeOptions,
    sourcesNeedingKey,
    onRemove,
    isReadOnly = false,
}) => {
    const needsKey = sourcesNeedingKey.has(item.source);

    return (
        <Box
            border="1px solid"
            borderColor="var(--color-border, #CBD5E1)"
            borderRadius="16px"
            p={3.5}
            bg="var(--color-surface-alt, #F8FAFC)"
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
                                disabled={isReadOnly}
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
                                disabled={isReadOnly}
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
                                disabled={!needsKey || isReadOnly}
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    </Field>
                </Box>

                {!isReadOnly && (
                    <IconButton
                        mt={{ base: 0, sm: 8 }}
                        alignSelf={{ base: "flex-end", sm: "auto" }}
                        aria-label="Remove filter"
                        icon={<FiTrash2 />}
                        variant="ghost"
                        colorScheme="red"
                        borderRadius="12px"
                        onClick={() => onRemove(index)}
                    />
                )}
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
                                disabled={isReadOnly}
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
                                disabled={isReadOnly}
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
                                disabled={isReadOnly}
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
                                    isDisabled={isReadOnly}
                                    onChange={(e) => form.setFieldValue(`filterConfig.${index}.isActive`, e.target.checked)}
                                />
                            </HStack>
                        </FormControl>
                    )}
                </Field>
            </Stack>
        </Box>
    );
};

export default CategoryFilterItemCard;

