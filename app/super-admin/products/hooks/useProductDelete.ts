import { useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import stores from "../../../store/stores";

export const useProductDelete = (onRefresh: () => void) => {
    const { shopStore, auth } = stores;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (row: any) => {
        setSelectedProduct(row);
        onOpen();
    };

    const confirmDelete = async () => {
        if (!selectedProduct) return;
        setIsDeleting(true);
        try {
            await shopStore.deleteProduct(selectedProduct._id);
            auth.openNotification({
                title: "Success",
                message: "Product deleted successfully",
                type: "success",
                image: selectedProduct?.images?.[0]
            });
            onRefresh(); // Refresh list
            onClose();
        } catch (error: any) {
            auth.openNotification({
                title: "Error",
                message: error?.message || "Failed to delete product",
                type: "error"
            });
        } finally {
            setIsDeleting(false);
            setSelectedProduct(null);
        }
    };

    return {
        isOpen,
        onClose,
        selectedProduct,
        isDeleting,
        handleDeleteClick,
        confirmDelete
    };
};
