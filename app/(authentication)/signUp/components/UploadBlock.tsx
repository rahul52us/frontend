import { Box, IconButton, Image, Text, VStack } from "@chakra-ui/react";
import React, { useRef } from "react";
import { FiX } from "react-icons/fi";

interface UploadTileProps {
  title: string;
  subtitle: string;
  file: any[];
  onFileChange: (file: File) => void;
  onRemove: () => void;
  onPreview: () => void;
  icon: any;
}

const UploadTile: React.FC<UploadTileProps> = ({
  title,
  subtitle,
  file,
  onFileChange,
  onRemove,
  onPreview,
  icon: Icon,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <Box>
      <Text fontSize="sm" fontWeight="medium" mb={2}>
        {title}
      </Text>

      <Box
        position="relative"
        border="2px dashed"
        borderColor="gray.200"
        borderRadius="xl"
        p={3}
        h={{ base: file?.length ? "180px" : "70px", md: "110px" }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="gray.50"
        _active={{ bg: "gray.100" }}
        cursor="pointer"
        transition="all 0.3s ease"
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files[0]) {
              onFileChange(e.target.files[0]);
            }
          }}
        />

        {file?.length ? (
          <Box position="relative" w="100%" h="100%">
            <Image
              src={URL.createObjectURL(file[0])}
              objectFit="cover"
              w="100%"
              h="100%"
              borderRadius="lg"
              onClick={(e) => {
                e.stopPropagation();
                onPreview();
              }}
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
                onRemove();
              }}
            />
          </Box>
        ) : (
          <VStack spacing={1} pointerEvents="none">
            <Box
              p={2}
              borderRadius="full"
              bg="white"
              boxShadow="sm"
            >
              <Icon size={18} />
            </Box>
            <Text fontSize="xs" color="gray.500">
              Tap to upload
            </Text>
          </VStack>
        )}
      </Box>

      <Text fontSize="xs" color="gray.400" mt={1}>
        {subtitle}
      </Text>
    </Box>
  );
};

export default UploadTile;