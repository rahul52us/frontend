import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  useColorModeValue,
  Flex,
  Text,
  ModalOverlay,
  Button,
  Divider,
  Box,
} from "@chakra-ui/react";

function FormModel({
  open,
  close,
  isCentered,
  title,
  footer,
  children,
  size,
  ...rest
}: any) {
  const headerBg = useColorModeValue("linear-gradient(135deg, #f8f9fa, #e9ecef)", "linear-gradient(135deg, #2d3748, #4a5568)");
  const headerTextColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.300", "gray.600")
  return (
    <Modal isCentered={isCentered} size={size || "2xl"} isOpen={open} onClose={close} {...rest}>
      <ModalOverlay style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }} />
      <ModalContent borderRadius="xl" overflow="hidden" boxShadow="2xl">
        {title && (
          <Flex
            justify="space-between"
            align="center"
            p={4}
            bg={headerBg}
            color={headerTextColor}
            borderBottom="1px solid"
            borderColor={borderColor}
            boxShadow="md"
          >
            <Text fontSize="lg" fontWeight="bold">
              {title}
            </Text>
            <Box>
              <ModalCloseButton
                size="lg"
                borderRadius="full"
                bg="red.500"
                color="white"
                _hover={{ bg: "red.600", transform: "scale(1.1)" }}
                _focus={{ boxShadow: "0 0 10px rgba(255, 0, 0, 0.5)" }}
                transition="all 0.2s ease-in-out"
              />
            </Box>
          </Flex>
        )}
        <ModalBody p={2}>{children}</ModalBody>
        {footer && (
          <>
            <Divider />
            <Flex justifyContent="flex-end" p={4} columnGap={3} alignItems="center">
              <Button variant="outline" onClick={close} colorScheme="gray">
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={() => {}}>
                Submit
              </Button>
            </Flex>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default FormModel;