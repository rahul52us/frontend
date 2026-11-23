import React from "react";
import {
    Box,
    Button,
    Flex,
    FormLabel,
    HStack,
    IconButton,
    Text,
    VStack,
} from "@chakra-ui/react";
import { FiUploadCloud, FiX } from "react-icons/fi";

interface CategoryCoverUploadProps {
    previewUrl: string | null;
    initialImageUrl?: string | null;
    onFileSelect: (file: File | null) => void;
    onRemovePreview: () => void;
    isReadOnly?: boolean;
}

export const CategoryCoverUpload: React.FC<CategoryCoverUploadProps> = ({
    previewUrl,
    initialImageUrl,
    onFileSelect,
    onRemovePreview,
    isReadOnly = false,
}) => {
    const activeUrl = previewUrl || initialImageUrl;

    return (
        <Box>
            <FormLabel
                fontSize="sm"
                fontWeight="600"
                color="var(--color-text-primary, #0F172A)"
                mb={2}
            >
                Cover Image
            </FormLabel>

            {activeUrl ? (
                <Box
                    position="relative"
                    borderWidth="1px"
                    borderColor="var(--color-border, #CBD5E1)"
                    borderRadius="20px"
                    overflow="hidden"
                    bg="var(--color-surface-alt, #F8FAFC)"
                    boxShadow="sm"
                    p={2.5}
                >
                    <Box
                        position="relative"
                        w="100%"
                        h={{ base: "160px", sm: "200px" }}
                        borderRadius="16px"
                        overflow="hidden"
                        bg="blackAlpha.50"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={activeUrl}
                            alt="Cover Preview"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />

                        {!isReadOnly && (
                            <HStack
                                position="absolute"
                                bottom={2.5}
                                right={2.5}
                                spacing={2}
                            >
                                <Button
                                    as="label"
                                    htmlFor="category-cover-image-input"
                                    size="sm"
                                    leftIcon={<FiUploadCloud />}
                                    borderRadius="12px"
                                    bg="whiteAlpha.900"
                                    color="gray.800"
                                    backdropFilter="blur(8px)"
                                    boxShadow="md"
                                    cursor="pointer"
                                    _hover={{ bg: "white" }}
                                >
                                    Change
                                </Button>
                                {previewUrl && (
                                    <IconButton
                                        aria-label="Remove selected image"
                                        icon={<FiX size={16} />}
                                        size="sm"
                                        borderRadius="12px"
                                        bg="blackAlpha.700"
                                        color="white"
                                        backdropFilter="blur(8px)"
                                        _hover={{ bg: "blackAlpha.900" }}
                                        onClick={onRemovePreview}
                                    />
                                )}
                            </HStack>
                        )}
                    </Box>

                    {!isReadOnly && (
                        <input
                            id="category-cover-image-input"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(event: any) => {
                                const file = event.currentTarget.files[0] || null;
                                onFileSelect(file);
                            }}
                        />
                    )}
                </Box>
            ) : !isReadOnly ? (
                <Box
                    as="label"
                    htmlFor="category-cover-image-input"
                    display="block"
                    cursor="pointer"
                    borderWidth="1.5px"
                    borderStyle="dashed"
                    borderColor="var(--color-border, #CBD5E1)"
                    borderRadius="16px"
                    bg="var(--color-surface-alt, #F8FAFC)"
                    p={{ base: 5, sm: 6 }}
                    textAlign="center"
                    transition="all 0.2s ease"
                    _hover={{
                        borderColor: "#094a82",
                        bg: "var(--color-surface-soft, #EDF2F7)",
                    }}
                >
                    <VStack spacing={2.5}>
                        <Flex
                            w="48px"
                            h="48px"
                            borderRadius="14px"
                            align="center"
                            justify="center"
                            bg="rgba(9, 74, 130, 0.12)"
                            color="#094a82"
                        >
                            <FiUploadCloud size={22} />
                        </Flex>
                        <Box>
                            <Text
                                fontSize="sm"
                                fontWeight="700"
                                color="var(--color-text-primary, #0F172A)"
                            >
                                Click or tap to upload cover photo
                            </Text>
                            <Text
                                fontSize="xs"
                                color="var(--color-text-muted, #64748B)"
                                mt={0.5}
                            >
                                PNG, JPG or WebP (recommended 4:3 or 16:9 ratio)
                            </Text>
                        </Box>
                    </VStack>
                    <input
                        id="category-cover-image-input"
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(event: any) => {
                            const file = event.currentTarget.files[0] || null;
                            onFileSelect(file);
                        }}
                    />
                </Box>
            ) : (
                <Box
                    display="block"
                    cursor="default"
                    borderWidth="1.5px"
                    borderStyle="dashed"
                    borderColor="var(--color-border, #CBD5E1)"
                    borderRadius="16px"
                    bg="var(--color-surface-alt, #F8FAFC)"
                    p={{ base: 5, sm: 6 }}
                    textAlign="center"
                >
                    <VStack spacing={2.5}>
                        <Flex
                            w="48px"
                            h="48px"
                            borderRadius="14px"
                            align="center"
                            justify="center"
                            bg="rgba(9, 74, 130, 0.12)"
                            color="#094a82"
                        >
                            <FiUploadCloud size={22} />
                        </Flex>
                        <Box>
                            <Text
                                fontSize="sm"
                                fontWeight="700"
                                color="var(--color-text-primary, #0F172A)"
                            >
                                No Cover Photo Uploaded
                            </Text>
                            <Text
                                fontSize="xs"
                                color="var(--color-text-muted, #64748B)"
                                mt={0.5}
                            >
                                No image available in view mode
                            </Text>
                        </Box>
                    </VStack>
                </Box>
            )}
        </Box>
    );
};

export default CategoryCoverUpload;

