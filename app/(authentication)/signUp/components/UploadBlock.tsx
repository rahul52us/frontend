import { Box, Button, Flex, HStack, Input, Text } from "@chakra-ui/react";
import { useRef } from "react";

const UploadBlock = ({
  title,
  description,
  icon: Icon,
  files,
  onFileChange,
  onRemove,
  onPreview,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <Box
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="xl"
      p={4}
      transition="all 0.2s"
      _hover={{ borderColor: "blue.400" }}
    >
      <HStack align="flex-start" spacing={4}>

        {/* Icon */}
        <Flex
          w="44px"
          h="44px"
          borderRadius="lg"
          bg="blue.50"
          align="center"
          justify="center"
        >
          <Icon size={20} />
        </Flex>

        {/* Content */}
        <Box flex="1">
          <Text fontWeight="600">{title}</Text>
          <Text fontSize="sm" color="gray.500">
            {description}
          </Text>

          {/* Hidden Input */}
          <Input
            ref={inputRef}
            type="file"
            accept="image/*"
            display="none"
            onChange={(e) => {
              const file = e.target.files?.[0];
              onFileChange(file || null);
              e.target.value = "";
            }}
          />

          {/* Upload Area */}
          <Box
            mt={3}
            border="1px dashed"
            borderColor="gray.300"
            borderRadius="lg"
            py={4}
            textAlign="center"
            cursor="pointer"
            transition="0.2s"
            _hover={{ bg: "gray.50", borderColor: "blue.400" }}
            onClick={() => inputRef.current?.click()}
          >
            <Text fontSize="sm" fontWeight="500">
              {files?.length ? "Replace image" : "Upload image"}
            </Text>
            <Text fontSize="xs" color="gray.400">
              JPG, PNG, WEBP
            </Text>
          </Box>

          {/* Preview */}
          {files?.length > 0 && (
            <HStack mt={3} justify="space-between">
              <Text fontSize="sm" color="gray.600" noOfLines={1}>
                {files[0]?.name}
              </Text>

              <HStack spacing={2}>
                <Button
                  size="xs"
                  variant="ghost"
                  colorScheme="blue"
                  onClick={onPreview}
                >
                  View
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  colorScheme="red"
                  onClick={onRemove}
                >
                  Remove
                </Button>
              </HStack>
            </HStack>
          )}
        </Box>
      </HStack>
    </Box>
  );
};

export default UploadBlock;