"use client";
import React, { useEffect, useState } from "react";
import {
    Box,
    Heading,
    Button,
    Flex,
    useDisclosure,
    useToast,
    Text,
    Badge,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import stores from "../../../store/stores";
import CategoryForm from "./components/CategoryForm";
// import CustomTable from "../../../component/common/Table/CustomTable";
import CustomTable from "../../../component/config/component/CustomTable/CustomTable";
import ConfirmationModal from "../../../component/common/ConfirmationModal/ConfirmationModal";

const CategoryPage = () => {
    const { categoryStore } = stores;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isDeleteOpen,
        onOpen: onDeleteOpen,
        onClose: onDeleteClose
    } = useDisclosure();

    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<any>(null);
    const toast = useToast();

    useEffect(() => {
        categoryStore.getAllCategories();
    }, [categoryStore]);

    const handleAddClick = () => {
        setSelectedCategory(null);
        onOpen();
    };

    const handleEditClick = (category: any) => {
        setSelectedCategory(category);
        onOpen();
    };

    const handleDeleteClick = (category: any) => {
        setCategoryToDelete(category);
        onDeleteOpen();
    }

    const handleConfirmDelete = async () => {
        if (categoryToDelete) {
            const res = await categoryStore.deleteCategory(categoryToDelete._id);
            if (res.status === "success") {
                toast({
                    title: "Success",
                    description: "Category deleted successfully",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                onDeleteClose();
            } else {
                toast({
                    title: "Error",
                    description: res.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    }

    const columns = [
        {
            headerName: "Image",
            key: "image",
            type: "component",
            props: {
                column: { width: "100px" },
            },
            metaData: {
                component: (data: any) => (
                    data.image?.url ? (
                        <Box w="50px" h="50px" borderRadius="md" overflow="hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={data.image.url} alt={data.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Box>
                    ) : <Text color="gray.400" fontSize="sm">No Image</Text>
                )
            }
        },
        {
            headerName: "Name",
            key: "name",
            type: "text",
        },
        {
            headerName: "Slug",
            key: "slug",
            type: "text",
        },
        {
            headerName: "Parent",
            key: "parent",
            type: "component",
            metaData: {
                component: (data: any) => data.parent ? <Badge colorScheme="blue">{data.parent.name}</Badge> : <Badge>Root</Badge>
            }
        },
        {
            headerName: "Status",
            key: "isActive",
            type: "component",
            metaData: {
                component: (data: any) => (
                    <Badge colorScheme={data.isActive ? "green" : "red"}>
                        {data.isActive ? "Active" : "Inactive"}
                    </Badge>
                )
            }
        },
        {
            headerName: "Action",
            key: "action",
            type: "table-actions",
            props: {
                isSticky: true,
                width: "100px"
            }
        }
    ];

    const tableActions = {
        actionBtn: {
            editKey: {
                showEditButton: true,
                function: handleEditClick
            },
            deleteKey: {
                showDeleteButton: true,
                function: (row: any) => handleDeleteClick(row)
            }
        },
        pagination: {
            show: true,
            currentPage: 1,
            totalPages: 1,
            onClick: () => { }
        }
    }

    return (
        <Box p={6}>
            <Flex justify="space-between" align="center" mb={6}>
                <Heading size="lg">Categories</Heading>
                <Button colorScheme="blue" onClick={handleAddClick}>
                    Add Category
                </Button>
            </Flex>

            <Box bg="white" borderRadius="lg" shadow="sm">
                <CustomTable
                    title={`All Categories (${categoryStore.categories.length})`}
                    data={categoryStore.categories}
                    columns={columns}
                    loading={categoryStore.loading}
                    actions={tableActions}
                    serial={{ show: true, text: "S.No." }}
                />
            </Box>

            {isOpen && (
                <CategoryForm
                    isOpen={isOpen}
                    onClose={onClose}
                    initialValues={selectedCategory}
                />
            )}

            {categoryToDelete && (
                <ConfirmationModal
                    isOpen={isDeleteOpen}
                    onClose={onDeleteClose}
                    onConfirm={handleConfirmDelete}
                    title="Delete Category"
                    message={`Are you sure you want to delete "${categoryToDelete.name}"? This action cannot be undone.`}
                    image={categoryToDelete.image?.url}
                    confirmText="Yes, Delete"
                    isLoading={categoryStore.loading}
                />
            )}
        </Box>
    );
};

export default observer(CategoryPage);
