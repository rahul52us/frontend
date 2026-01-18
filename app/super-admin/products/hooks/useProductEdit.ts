import { useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import stores from "../../../store/stores";
import * as Yup from "yup";

const activeCategories = [
    "",
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Sports",
    "Toys",
    "Health & Beauty",
    "Automotive",
];

const ProductSchema = Yup.object().shape({
    name: Yup.string().required("Product Name is required"),
    category: Yup.string().required("Category is required"),
    subCategories: Yup.array().of(Yup.string().required("Subcategory is required")),
    price: Yup.number()
        .required("Price is required")
        .positive("Price must be positive"),
    description: Yup.string().optional(),
    stock: Yup.number()
        .required("Stock level is required")
        .integer("Stock must be an integer")
        .min(0, "Stock cannot be negative"),
    brand: Yup.string().optional(),
    sku: Yup.string().optional(),
    weight: Yup.string().optional(),
    productDetails: Yup.array().of(
        Yup.object().shape({
            key: Yup.string().required("Key is required"),
            value: Yup.string().required("Value is required"),
        })
    ),
    information: Yup.array().of(
        Yup.object().shape({
            key: Yup.string().required("Key is required"),
            value: Yup.string().required("Value is required"),
        })
    ),
    images: Yup.array().min(1, "At least one image is required"),
});

export const useProductEdit = (onRefresh: () => void) => {
    const { shopStore, auth } = stores;
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const [editProduct, setEditProduct] = useState<any>(null);

    const handleEditClick = (row: any) => {
        setEditProduct(row);
        onEditOpen();
    };

    const initialValues = editProduct
        ? {
            ...editProduct,
            images: editProduct.images || [],
            productDetails: editProduct.productDetails
                ? Object.entries(editProduct.productDetails).map(
                    ([key, value]) => ({ key, value })
                )
                : [],
            subCategories: editProduct.subCategories || [],
            information: editProduct.information
                ? Object.entries(editProduct.information).map(
                    ([key, value]) => ({ key, value })
                )
                : [],
        }
        : {
            name: "",
            description: "",
            sku: "",
            category: "",
            price: "",
            stock: 0,
            brand: "",
            weight: "",
            productDetails: [],
            information: [],
            images: [],
            subCategories: [],
        };

    const handleSubmit = async (values: any, actions: any) => {
        try {
            const cleanImages = values.images.map((img: any) => {
                if (!img?.buffer) return img;
                const rest = Object.fromEntries(
                    Object.entries(img).filter(([key]) => key !== "preview")
                );
                return rest;
            });

            const payload = { ...values, images: cleanImages };

            if (editProduct) {
                await shopStore.updateProduct(editProduct._id, payload);
                auth.openNotification({
                    title: "Success",
                    message: "Product updated successfully",
                    type: "success",
                    image: typeof cleanImages[0] === 'string' ? cleanImages[0] : cleanImages[0]?.preview || cleanImages[0]?.url
                });
                onRefresh();
                onEditClose();
                setEditProduct(null);
                actions.resetForm();
            }
        } catch (error: any) {
            auth.openNotification({
                title: "Error",
                message: error?.message || "Failed to update product",
                type: "error",
            });
        } finally {
            actions.setSubmitting(false);
        }
    };

    const handleClose = () => {
        onEditClose();
        setEditProduct(null);
    }

    return {
        isEditOpen,
        onEditClose: handleClose,
        editProduct,
        handleEditClick,
        handleSubmit,
        initialValues,
        ProductSchema,
        activeCategories
    };
};
