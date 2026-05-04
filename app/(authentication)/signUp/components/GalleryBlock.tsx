import { Box, VStack, HStack, Flex, Input, SimpleGrid, Button, Text, Image, IconButton } from "@chakra-ui/react";
import { FiCamera, FiPlus, FiX } from "react-icons/fi";

const GalleryBlock = ({ gallery, setSellerData, handleGalleryFilesSelected, onPreview }) => {
  return (
    <Box>
      <Text fontSize="sm" fontWeight="medium" mb={2}>
        Gallery
      </Text>

      <SimpleGrid columns={3} spacing={2}>
        {gallery.map((item, index) => (
          <Box key={index} position="relative">
            <Image
              src={URL.createObjectURL(item.file)}
              borderRadius="lg"
              objectFit="cover"
              w="100%"
              h="80px"
              onClick={() => onPreview(index)}
            />

            <IconButton
            aria-label="fix"
              icon={<FiX />}
              size="xs"
              position="absolute"
              top={1}
              right={1}
              colorScheme="red"
              borderRadius="full"
              onClick={() => {
                setSellerData((prev) => ({
                  ...prev,
                  gallery: prev.gallery.filter((_, i) => i !== index),
                }));
              }}
            />
          </Box>
        ))}

        {/* Add button */}
        <Box
          border="2px dashed"
          borderColor="gray.200"
          borderRadius="lg"
          h="80px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="relative"
          bg="gray.50"
        >
          <Input
            type="file"
            multiple
            accept="image/*"
            position="absolute"
            inset={0}
            opacity={0}
            onChange={handleGalleryFilesSelected}
          />

          <FiPlus />
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default GalleryBlock;