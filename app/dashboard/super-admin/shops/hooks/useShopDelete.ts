import { useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import stores from "../../../../store/stores";

export const useShopDelete = (onRefresh: () => void) => {
    const { companyStore, auth } = stores;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedShop, setSelectedShop] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (row: any) => {
        setSelectedShop(row);
        onOpen();
    };

    const confirmDelete = async () => {
        if (!selectedShop) return;
        setIsDeleting(true);
        try {
            await companyStore.deleteShop(selectedShop._id);
            auth.openNotification({
                title: "Success",
                message: "Shop deleted successfully",
                type: "success",
                image: selectedShop?.logo?.url
            });
            onRefresh();
            onClose();
        } catch (error: any) {
            auth.openNotification({
                title: "Error",
                message: error?.message || "Failed to delete shop",
                type: "error"
            });
        } finally {
            setIsDeleting(false);
            setSelectedShop(null);
        }
    };

    return {
        isOpen,
        onClose,
        selectedShop,
        isDeleting,
        handleDeleteClick,
        confirmDelete
    };
};
