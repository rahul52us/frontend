import React from "react";
import {
  Box,
  VStack,
  Flex,
  IconButton,
  Button,
  Icon,
  useColorModeValue,
  Text,
  Circle,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { FiImage } from "react-icons/fi";
import CustomInput from "../../../component/config/component/customInput/CustomInput";
import ShowFileUploadFile from "../../../component/common/ShowFileUploadFile/ShowFileUploadFile";
import { removeDataByIndex } from "../../../config/utils/utils";

// Shared styled card
const SectionCard = ({ icon, title, description, children }) => {
  const headerBg = useColorModeValue("gray.100", "gray.700");
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const circleBg = useColorModeValue("blue.100", "blue.600");

  return (
    <Box
      bg={cardBg}
      borderRadius="xl"
      border="1px solid"
      borderColor={cardBorder}
      overflow="hidden"
      boxShadow="md"
    >
      <Flex
        bg={headerBg}
        px={5}
        py={3}
        align="center"
        gap={3}
        borderBottom="1px solid"
        borderColor={cardBorder}
      >
        <Circle size="36px" bg={circleBg}>
          <Icon as={icon} color="blue.600" boxSize={5} />
        </Circle>
        <Box>
          <Text fontSize="md" fontWeight="bold" color={textColor}>
            {title}
          </Text>
          {description && (
            <Text fontSize="xs" color="gray.500">
              {description}
            </Text>
          )}
        </Box>
      </Flex>
      <Box px={{ base: 4, md: 6 }} py={6}>
        {children}
      </Box>
    </Box>
  );
};

const GallerySection = ({ values, errors, setFieldValue, showError }) => {
  const inputBorderColor = useColorModeValue("gray.200", "gray.600");

  const handleAddGalleryItem = () => {
    setFieldValue("gallery", [...values.gallery, { file: null, title: "" }]);
  };

  const handleFileChange = (index, file) => {
    const updatedGallery = [...values.gallery];
    updatedGallery[index] = { ...updatedGallery[index], file, isAdd: 1 };
    setFieldValue("gallery", updatedGallery);
  };

  const handleTitleChange = (index, title) => {
    const updatedGallery = [...values.gallery];
    updatedGallery[index] = { ...updatedGallery[index], title };
    setFieldValue("gallery", updatedGallery);
  };

  const handleRemoveGalleryItem = (index) => {
    const item = values.gallery[index];
    if (item?.file && !item?.isAdd) {
      setFieldValue("deletedFiles", (prev = []) => [...prev, item.file.name]);
    }
    setFieldValue("gallery", removeDataByIndex(values.gallery, index));
  };

  return (
    <SectionCard
      icon={FiImage}
      title="Shop Gallery"
      description="Add images and titles for your shop gallery"
    >
      <VStack spacing={6} align="stretch">
        {values?.gallery?.map((item, index) => (
          <Flex
            key={index}
            gap={4}
            p={4}
            borderRadius="md"
            border="1px solid"
            borderColor={inputBorderColor}
            wrap="wrap"
            align="center"
          >
            <Box flex="1">
              {item.file ? (
                <ShowFileUploadFile
                  files={item.file}
                  removeFile={() => handleRemoveGalleryItem(index)}
                  edit={true}
                />
              ) : (
                <CustomInput
                  type="file-drag"
                  name={`gallery[${index}].file`}
                  isMulti={false}
                  accept="image/*"
                  onChange={(e) => handleFileChange(index, e.target.files[0])}
                  showError={showError}
                  error={errors?.gallery?.[index]?.file}
                />
              )}
            </Box>
            <Box flex="1">
              <CustomInput
                name={`gallery[${index}].title`}
                placeholder="Enter image title"
                value={item.title}
                onChange={(e) => handleTitleChange(index, e.target.value)}
                showError={showError}
                error={errors?.gallery?.[index]?.title}
              />
            </Box>
            <IconButton
              icon={<DeleteIcon />}
              colorScheme="red"
              onClick={() => handleRemoveGalleryItem(index)}
              aria-label="Remove Image"
            />
          </Flex>
        ))}
        <Button
          leftIcon={<AddIcon />}
          colorScheme="teal"
          variant="outline"
          onClick={handleAddGalleryItem}
          alignSelf="flex-start"
        >
          Add Image
        </Button>
      </VStack>
    </SectionCard>
  );
};

export default GallerySection;
