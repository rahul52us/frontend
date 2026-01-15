import React from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Text,
    ButtonProps,
    Flex,
    Box,
    Image,
} from "@chakra-ui/react";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    confirmButtonProps?: ButtonProps;
    isLoading?: boolean;
    image?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    confirmButtonProps,
    isLoading = false,
    image,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex align="center" gap={4}>
                        {image && (
                            <Box boxSize="60px" flexShrink={0} borderRadius="md" overflow="hidden">
                                <Image src={image} alt="Item" w="100%" h="100%" objectFit="cover" />
                            </Box>
                        )}
                        <Box>
                            {typeof message === "string" ? <Text>{message}</Text> : message}
                        </Box>
                    </Flex>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose} isDisabled={isLoading}>
                        {cancelText}
                    </Button>
                    <Button
                        colorScheme="red"
                        onClick={onConfirm}
                        isLoading={isLoading}
                        {...confirmButtonProps}
                    >
                        {confirmText}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ConfirmationModal;
