import { Box, SimpleGrid, Text, Image, IconButton, Icon } from "@chakra-ui/react";
import React, { useRef } from "react";
import { FiPlus, FiX } from "react-icons/fi";

interface GalleryBlockProps {
  gallery: any[];
  setSellerData: React.Dispatch<React.SetStateAction<any>>;
  handleGalleryFilesSelected: (files: File[]) => void;
  onPreview: (index: number) => void;
}

const GalleryBlock: React.FC<GalleryBlockProps> = ({ gallery, setSellerData, handleGalleryFilesSelected, onPreview }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddClick = () => {
    inputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleGalleryFilesSelected(Array.from(e.target.files));
      // Reset input value to allow selecting same file again if needed
      e.target.value = "";
    }
  };

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
              cursor="pointer"
              onClick={() => onPreview(index)}
            />

            <IconButton
              aria-label="Remove image"
              icon={<FiX />}
              size="xs"
              position="absolute"
              top={1}
              right={1}
              colorScheme="red"
              borderRadius="full"
              onClick={(e) => {
                e.stopPropagation();
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
          cursor="pointer"
          _hover={{ bg: "gray.100", borderColor: "gray.300" }}
          onClick={handleAddClick}
          transition="all 0.2s ease"
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            style={{ display: "none" }}
            onChange={onFileChange}
          />

          <Icon as={FiPlus} color="gray.500" boxSize={5} />
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default GalleryBlock;