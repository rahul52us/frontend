import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  useColorMode,
  Flex,
  Text,
  ModalOverlay,
  Button,
  Divider,
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
  const { colorMode } = useColorMode();


  const headerTextColor = colorMode === "dark" ? "white" : "white";

  return (
    <>
      <Modal
        isCentered={isCentered}
        size={size ? size : "2xl"}
        isOpen={open}
        onClose={close}
        {...rest}
      >
        <ModalOverlay style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }} />{" "}
        {/* Increase opacity */}
        <ModalContent>
          {title && (
            <Flex
              justify="space-between"
              align="center"
              p={4}
              color={headerTextColor}
            >
              <Text fontSize="xl">{title}</Text>
              <ModalCloseButton
                color={headerTextColor}
                size="lg"
                bg="red.500"
                mt={1}
              />
            </Flex>
          )}
          <ModalBody p={-5} {...rest}>{children}</ModalBody>
          {footer && (
            <>
              <Divider />
              <Flex
                justifyContent="flex-end"
                p={4}
                columnGap={3}
                alignItems="center"
              >
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
    </>
  );
}

export default FormModel;
