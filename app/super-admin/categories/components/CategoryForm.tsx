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
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { observer } from "mobx-react-lite";
import stores from "../../../store/stores";
import CustomDrawer from "../../../component/common/Drawer/CustomDrawer";

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
});

const CategoryForm: React.FC<CategoryFormProps> = ({
    isOpen,
    onClose,
    initialValues,
}) => {
    const { categoryStore } = stores;

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description || "");
        formData.append("isActive", values.isActive);
        formData.append("isFeatured", values.isFeatured);
        if (values.parent) {
            formData.append("parent", values.parent);
        }
        if (values.image instanceof File) {
            formData.append("image", values.image);
        }

        let res;
        if (initialValues?._id) {
            // Handle image delete flag if needed, currently assuming replacement or keeping old
            res = await categoryStore.updateCategory(initialValues._id, formData);
        } else {
            res = await categoryStore.createCategory(formData);
        }

        if (res.status === "success") {
            onClose();
        }
        setSubmitting(false);
    };

    const formValues = initialValues || {
        name: "",
        description: "",
        parent: "",
        isActive: true,
        isFeatured: false,
        image: null,
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
            width="40vw"
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
                                        props.setFieldValue("image", event.currentTarget.files[0]);
                                    }}
                                    pt={1}
                                />
                                {initialValues?.image?.url && (
                                    <Box mt={2} w="100px">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={initialValues.image.url} alt="Current" />
                                    </Box>
                                )}
                            </FormControl>

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
