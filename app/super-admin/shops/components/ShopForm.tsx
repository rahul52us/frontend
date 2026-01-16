
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
    Heading,
    Divider,
    SimpleGrid,
    Stack,
    Text,
    Switch
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
    remarks: Yup.string(), // Added validation for remarks
    isActive: Yup.boolean(), // Added validation for isActive
    contactInfo: Yup.object().shape({ // Added validation for contactInfo
        phone: Yup.string().matches(/^[0-9]+$/, "Phone number must be digits only").min(10, "Phone number must be at least 10 digits").max(15, "Phone number must be at most 15 digits").optional(),
        email: Yup.string().email("Invalid email address").optional(),
        website: Yup.string().url("Invalid URL").optional(),
    }),
    location: Yup.object().shape({ // Added validation for location
        address: Yup.string().optional(),
        city: Yup.string().optional(),
        state: Yup.string().optional(),
        postalCode: Yup.string().optional(),
        country: Yup.string().optional(),
    }),
});

const ShopForm: React.FC<ShopFormProps> = ({
    isOpen,
    onClose,
    initialValues,
    onSubmit,
    isEdit = false,
    // isLoading = false, // Removed from props destructuring
}) => {
    return (
        <CustomDrawer
            title={isEdit ? "Edit Shop" : "Add New Shop"}
            open={isOpen}
            close={onClose}
            width="50vw" // Changed size to width
        >
            <Formik
                initialValues={initialValues}
                validationSchema={ShopValidationSchema}
                onSubmit={onSubmit}
            // enableReinitialize // Removed
            >
                {(props) => (
                    <Form>
                        <VStack spacing={6} align="stretch">
                            {/* Basic Details Section */}
                            <Box>
                                <Text fontWeight="bold" fontSize="lg" mb={4}>Basic Details</Text>
                                <Stack spacing={4}>
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
                                                    rows={3} // Changed rows from 4 to 3
                                                />
                                                <FormErrorMessage>
                                                    {form.errors.description}
                                                </FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                </Stack>
                            </Box>

                            <Divider />

                            {/* Status Section */}
                            <Box>
                                <Text fontWeight="bold" fontSize="lg" mb={4}>Status & Visibility</Text>
                                <SimpleGrid columns={2} spacing={6}>
                                    <Field name="shopStatus">
                                        {({ field, form }: any) => (
                                            <FormControl
                                                isInvalid={
                                                    form.errors.shopStatus && form.touched.shopStatus
                                                }
                                                isRequired
                                            >
                                                <FormLabel>Shop Status</FormLabel>
                                                <Select {...field} placeholder="Select status">
                                                    <option value="active">Active</option>
                                                    <option value="pending">Pending</option>
                                                    <option value="suspended">Suspended</option>
                                                    <option value="inactive">Inactive</option> {/* Added inactive option */}
                                                </Select>
                                                <FormErrorMessage>
                                                    {form.errors.shopStatus}
                                                </FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>

                                    <Field name="isActive">
                                        {({ field }: any) => (
                                            <FormControl display="flex" alignItems="center" mt={8}>
                                                <FormLabel htmlFor="isActive" mb="0">
                                                    Is Active?
                                                </FormLabel>
                                                <Switch id="isActive" {...field} isChecked={field.value} />
                                            </FormControl>
                                        )}
                                    </Field>
                                </SimpleGrid>

                                <Box mt={4}>
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
                                </Box>
                            </Box>

                            <Divider />

                            {/* Contact Information */}
                            <Box>
                                <Text fontWeight="bold" fontSize="lg" mb={4}>Contact Information</Text>
                                <SimpleGrid columns={2} spacing={4}>
                                    <Field name="contactInfo.phone">
                                        {({ field, form }: any) => (
                                            <FormControl isInvalid={form.errors.contactInfo?.phone && form.touched.contactInfo?.phone}>
                                                <FormLabel>Phone</FormLabel>
                                                <Input {...field} placeholder="Phone number" />
                                                <FormErrorMessage>{form.errors.contactInfo?.phone}</FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name="contactInfo.email">
                                        {({ field, form }: any) => (
                                            <FormControl isInvalid={form.errors.contactInfo?.email && form.touched.contactInfo?.email}>
                                                <FormLabel>Email</FormLabel>
                                                <Input {...field} placeholder="Email address" />
                                                <FormErrorMessage>{form.errors.contactInfo?.email}</FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name="contactInfo.website">
                                        {({ field, form }: any) => (
                                            <FormControl isInvalid={form.errors.contactInfo?.website && form.touched.contactInfo?.website}>
                                                <FormLabel>Website</FormLabel>
                                                <Input {...field} placeholder="Website URL" />
                                                <FormErrorMessage>{form.errors.contactInfo?.website}</FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                </SimpleGrid>
                            </Box>

                            <Divider />

                            {/* Location Information */}
                            <Box>
                                <Text fontWeight="bold" fontSize="lg" mb={4}>Location</Text>
                                <Stack spacing={4}>
                                    <Field name="location.address">
                                        {({ field }: any) => (
                                            <FormControl>
                                                <FormLabel>Address</FormLabel>
                                                <Input {...field} placeholder="Street Address" />
                                            </FormControl>
                                        )}
                                    </Field>
                                    <SimpleGrid columns={2} spacing={4}>
                                        <Field name="location.city">
                                            {({ field }: any) => (
                                                <FormControl>
                                                    <FormLabel>City</FormLabel>
                                                    <Input {...field} placeholder="City" />
                                                </FormControl>
                                            )}
                                        </Field>
                                        <Field name="location.state">
                                            {({ field }: any) => (
                                                <FormControl>
                                                    <FormLabel>State</FormLabel>
                                                    <Input {...field} placeholder="State" />
                                                </FormControl>
                                            )}
                                        </Field>
                                        <Field name="location.postalCode">
                                            {({ field }: any) => (
                                                <FormControl>
                                                    <FormLabel>Postal Code</FormLabel>
                                                    <Input {...field} placeholder="Zip Code" />
                                                </FormControl>
                                            )}
                                        </Field>
                                        <Field name="location.country">
                                            {({ field }: any) => (
                                                <FormControl>
                                                    <FormLabel>Country</FormLabel>
                                                    <Input {...field} placeholder="Country" />
                                                </FormControl>
                                            )}
                                        </Field>
                                    </SimpleGrid>
                                </Stack>
                            </Box>

                            <Box pt={4}>
                                <Button
                                    type="submit"
                                    colorScheme="blue"
                                    width="full"
                                    isLoading={props.isSubmitting} // Changed to props.isSubmitting
                                >
                                    {isEdit ? "Update Shop" : "Add Shop"} {/* Changed text */}
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
