
import React from "react";
import {
    Badge,
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
    VStack,
    FormErrorMessage,
    Textarea,
    Box,
    Select,
    Divider,
    SimpleGrid,
    Stack,
    Text,
    HStack
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import CustomDrawer from "../../../../component/common/Drawer/CustomDrawer";

interface ShopFormProps {
    isOpen: boolean;
    onClose: () => void;
    initialValues: any;
    onSubmit: (_values: any) => void;
    isEdit?: boolean;
    isLoading?: boolean;
}

const getShopStatusMeta = (status?: string) => {
    switch (status) {
        case "active":
            return {
                label: "Active",
                colorScheme: "green",
                bg: "green.50",
                border: "green.200",
                focus: "green.400",
                description: "Shop and products are visible to buyers across the app.",
            };
        case "inactive":
            return {
                label: "Inactive",
                colorScheme: "orange",
                bg: "orange.50",
                border: "orange.200",
                focus: "orange.400",
                description: "Shop and products stay hidden until the shop is reactivated.",
            };
        case "suspended":
            return {
                label: "Suspended",
                colorScheme: "red",
                bg: "red.50",
                border: "red.200",
                focus: "red.400",
                description: "Shop and products are hidden while the suspension is active.",
            };
        case "pending":
        default:
            return {
                label: "Pending Review",
                colorScheme: "yellow",
                bg: "yellow.50",
                border: "yellow.200",
                focus: "yellow.400",
                description: "Shop exists, but it stays hidden from buyers until approved.",
            };
    }
};

const ShopValidationSchema = Yup.object().shape({
    name: Yup.string().required("Shop name is required"),
    description: Yup.string(),
    shopStatus: Yup.string().required("Status is required"),
    remarks: Yup.string(), // Added validation for remarks
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
    gstNumber: Yup.string().optional(),
    bankDetails: Yup.object().shape({
        accountHolderName: Yup.string().optional(),
        accountNumber: Yup.string().optional(),
        ifscCode: Yup.string().optional(),
        bankName: Yup.string().optional(),
    }),
    returnPolicy: Yup.string().optional(),
    paymentMethods: Yup.array().of(Yup.string()).optional(),
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
            // width="50vw" // Changed size to width
            width="80%"
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
                                <Box>
                                    <Field name="shopStatus">
                                        {({ field, form }: any) => (
                                            <FormControl
                                                isInvalid={
                                                    form.errors.shopStatus && form.touched.shopStatus
                                                }
                                                isRequired
                                            >
                                                <HStack justify="space-between" align="center" mb={2}>
                                                    <FormLabel mb="0">Shop Status</FormLabel>
                                                    <Badge
                                                        colorScheme={getShopStatusMeta(field.value).colorScheme}
                                                        px={3}
                                                        py={1}
                                                        borderRadius="full"
                                                        fontSize="0.75rem"
                                                    >
                                                        {getShopStatusMeta(field.value).label}
                                                    </Badge>
                                                </HStack>
                                                {(() => {
                                                    const statusMeta = getShopStatusMeta(field.value);
                                                    return (
                                                        <>
                                                            <Select
                                                                {...field}
                                                                placeholder="Select status"
                                                                size="lg"
                                                                bg="white"
                                                                borderWidth="2px"
                                                                borderColor={statusMeta.border}
                                                                focusBorderColor={statusMeta.focus}
                                                                fontWeight="600"
                                                                _hover={{ borderColor: statusMeta.focus }}
                                                            >
                                                                <option value="active">Active</option>
                                                                <option value="pending">Pending</option>
                                                                <option value="suspended">Suspended</option>
                                                                <option value="inactive">Inactive</option>
                                                            </Select>
                                                            <FormHelperText mt={2} color="gray.600">
                                                                {statusMeta.description}
                                                            </FormHelperText>
                                                        </>
                                                    );
                                                })()}
                                                <FormErrorMessage>
                                                    {form.errors.shopStatus}
                                                </FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                </Box>

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

                            {/* Bank & Tax Information */}
                            <Box>
                                <Text fontWeight="bold" fontSize="lg" mb={4}>Bank & Tax Details</Text>
                                <SimpleGrid columns={2} spacing={4}>
                                    <Field name="gstNumber">
                                        {({ field }: any) => (
                                            <FormControl>
                                                <FormLabel>GST Number</FormLabel>
                                                <Input {...field} placeholder="GST Number" />
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name="bankDetails.accountHolderName">
                                        {({ field }: any) => (
                                            <FormControl>
                                                <FormLabel>Account Holder</FormLabel>
                                                <Input {...field} placeholder="Name" />
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name="bankDetails.accountNumber">
                                        {({ field }: any) => (
                                            <FormControl>
                                                <FormLabel>Account Number</FormLabel>
                                                <Input {...field} placeholder="Account Number" />
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name="bankDetails.ifscCode">
                                        {({ field }: any) => (
                                            <FormControl>
                                                <FormLabel>IFSC Code</FormLabel>
                                                <Input {...field} placeholder="IFSC" />
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name="bankDetails.bankName">
                                        {({ field }: any) => (
                                            <FormControl>
                                                <FormLabel>Bank Name</FormLabel>
                                                <Input {...field} placeholder="Bank Name" />
                                            </FormControl>
                                        )}
                                    </Field>
                                </SimpleGrid>
                            </Box>

                            <Divider />

                            {/* Policy Information */}
                            <Box>
                                <Text fontWeight="bold" fontSize="lg" mb={4}>Business Policies</Text>
                                <VStack spacing={4}>
                                    <Field name="returnPolicy">
                                        {({ field }: any) => (
                                            <FormControl>
                                                <FormLabel>Return Policy</FormLabel>
                                                <Textarea {...field} placeholder="Enter return policy" rows={3} />
                                            </FormControl>
                                        )}
                                    </Field>
                                </VStack>
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
