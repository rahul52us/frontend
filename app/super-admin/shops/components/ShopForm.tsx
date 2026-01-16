import React from "react";
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
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import CustomDrawer from "../../../component/common/Drawer/CustomDrawer";

interface ShopFormProps {
    isOpen: boolean;
    onClose: () => void;
    initialValues: any;
    onSubmit: (values: any) => void;
    isEdit?: boolean;
    isLoading?: boolean;
}

const ShopValidationSchema = Yup.object().shape({
    name: Yup.string().required("Shop name is required"),
    description: Yup.string(),
    shopStatus: Yup.string().required("Status is required"),
});

const ShopForm: React.FC<ShopFormProps> = ({
    isOpen,
    onClose,
    initialValues,
    onSubmit,
    isEdit = false,
    isLoading = false,
}) => {
    return (
        <CustomDrawer
            title={isEdit ? "Edit Shop" : "Add New Shop"}
            open={isOpen}
            close={onClose}
            size="md"
        >
            <Formik
                initialValues={initialValues}
                validationSchema={ShopValidationSchema}
                onSubmit={onSubmit}
                enableReinitialize
            >
                {(props) => (
                    <Form>
                        <VStack spacing={6} align="stretch">
                            <Field name="name">
                                {({ field, form }: any) => (
                                    <FormControl
                                        isInvalid={form.errors.name && form.touched.name}
                                        isRequired
                                    >
                                        <FormLabel>Shop Name</FormLabel>
                                        <Input {...field} placeholder="Enter shop name" />
                                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>

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
                                            placeholder="Enter shop description"
                                            rows={4}
                                        />
                                        <FormErrorMessage>
                                            {form.errors.description}
                                        </FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>

                            <Field name="shopStatus">
                                {({ field, form }: any) => (
                                    <FormControl
                                        isInvalid={
                                            form.errors.shopStatus && form.touched.shopStatus
                                        }
                                        isRequired
                                    >
                                        <FormLabel>Status</FormLabel>
                                        <Select {...field} placeholder="Select status">
                                            <option value="active">Active</option>
                                            <option value="pending">Pending</option>
                                            <option value="suspended">Suspended</option>
                                        </Select>
                                        <FormErrorMessage>
                                            {form.errors.shopStatus}
                                        </FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>

                            <Field name="remarks">
                                {({ field, form }: any) => (
                                    <FormControl
                                        isInvalid={
                                            form.errors.remarks && form.touched.remarks
                                        }
                                    >
                                        <FormLabel>Remarks / Reason for Status Change</FormLabel>
                                        <Textarea
                                            {...field}
                                            placeholder="Enter remarks (optional)"
                                            rows={2}
                                        />
                                        <FormErrorMessage>
                                            {form.errors.remarks}
                                        </FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>

                            <Box pt={4}>
                                <Button
                                    type="submit"
                                    colorScheme="blue"
                                    width="full"
                                    isLoading={isLoading}
                                >
                                    {isEdit ? "Update Shop" : "Create Shop"}
                                </Button>
                            </Box>
                        </VStack>
                    </Form>
                )}
            </Formik>
        </CustomDrawer>
    );
};

export default ShopForm;
