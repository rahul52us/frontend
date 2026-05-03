import { Box, VStack, HStack, Flex, Input, SimpleGrid, Button, Text } from "@chakra-ui/react";
import { FiCamera } from "react-icons/fi";

const GalleryBlock = ({
  gallery,
  setSellerData,
  galleryInputRef,
  handleGalleryFilesSelected,
  onPreview,
}) => {
  return (
    <Box
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="xl"
      p={4}
    >
      <VStack align="stretch" spacing={4}>

        {/* Header */}
        <HStack spacing={3}>
          <Flex
            w="44px"
            h="44px"
            borderRadius="lg"
            bg="blue.50"
            align="center"
            justify="center"
          >
            <FiCamera size={20} />
          </Flex>

          <Box>
            <Text fontWeight="600">Gallery photos</Text>
            <Text fontSize="sm" color="gray.500">
              Add 2–4 real photos of your shop
            </Text>
          </Box>
        </HStack>

        {/* Input */}
        <Input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          multiple
          display="none"
          onChange={(e) => {
            handleGalleryFilesSelected(Array.from(e.target.files || []));
            e.target.value = "";
          }}
        />

        {/* Upload Area */}
        <Box
          border="1px dashed"
          borderColor="gray.300"
          borderRadius="lg"
          py={6}
          textAlign="center"
          cursor="pointer"
          _hover={{ bg: "gray.50", borderColor: "blue.400" }}
          onClick={() => galleryInputRef.current?.click()}
        >
          <Text fontSize="sm" fontWeight="500">
            {gallery.length ? "Add more photos" : "Upload photos"}
          </Text>
          <Text fontSize="xs" color="gray.400">
            Multiple images supported
          </Text>
        </Box>

        {/* Preview Grid */}
        {gallery.length > 0 && (
          <SimpleGrid columns={{ base: 2, md: 3 }} spacing={3}>
            {gallery.map((item, index) => (
              <Box
                key={index}
                borderRadius="lg"
                borderWidth="1px"
                p={2}
              >
                <VStack spacing={2}>
                  <Text fontSize="xs" noOfLines={1}>
                    {item.file?.name}
                  </Text>

                  <HStack spacing={2} w="full">
                    <Button
                      size="xs"
                      colorScheme="blue"
                      variant="ghost"
                      flex={1}
                      onClick={() => onPreview(index)}
                    >
                      View
                    </Button>
                    <Button
                      size="xs"
                      colorScheme="red"
                      variant="ghost"
                      flex={1}
                      onClick={() =>
                        setSellerData((prev) => ({
                          ...prev,
                          gallery: prev.gallery.filter(
                            (_, i) => i !== index
                          ),
                        }))
                      }
                    >
                      Remove
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </Box>
  );
};

export default GalleryBlock;