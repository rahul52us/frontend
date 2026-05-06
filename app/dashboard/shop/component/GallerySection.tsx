import React from "react";
import {
  Box,
  Button,
  Flex,
  IconButton,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { FiImage } from "react-icons/fi";
import ShowFileUploadFile from "../../../component/common/ShowFileUploadFile/ShowFileUploadFile";
import CustomInput from "../../../component/config/component/customInput/CustomInput";
import { removeDataByIndex } from "../../../config/utils/utils";
import {
  MerchantSectionCard,
  MerchantTextField,
  useMerchantTone,
} from "./merchantTheme";

const GallerySection = ({ values, errors, setFieldValue, showError }) => {
  const tone = useMerchantTone("rose");

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
      setFieldValue("deletedFiles", [...(values.deletedFiles || []), item.file.name]);
    }
    setFieldValue("gallery", removeDataByIndex(values.gallery, index));
  };

  return (
    <MerchantSectionCard
      icon={FiImage}
      title="Shop Gallery"
      description="Upload photos of your storefront, products, or workspace."
      tint="rose"
    >
      <VStack spacing={4} align="stretch">
        {values?.gallery?.length ? (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {values.gallery.map((item, index) => (
              <Box
                key={index}
                border="1px solid"
                borderColor={tone.border}
                borderRadius="24px"
                bg={tone.soft}
                p={4}
              >
                <VStack spacing={4} align="stretch">
                  {item.file ? (
                    <ShowFileUploadFile
                      files={item.file}
                      removeFile={() => handleRemoveGalleryItem(index)}
                      edit
                    />
                  ) : (
                    <CustomInput
                      type="file-drag"
                      name={`gallery[${index}].file`}
                      isMulti={false}
                      accept="image/*"
                      onChange={(event) => handleFileChange(index, event.target.files[0])}
                      showError={showError}
                      error={errors?.gallery?.[index]?.file}
                    />
                  )}

                  <Flex align="start" gap={2}>
                    <Box flex={1}>
                      <MerchantTextField
                        label="Caption"
                        name={`gallery[${index}].title`}
                        placeholder="Caption (optional)"
                        value={item.title || ""}
                        onChange={(event) => handleTitleChange(index, event.target.value)}
                        showError={showError}
                        error={errors?.gallery?.[index]?.title}
                      />
                    </Box>
                    <IconButton
                      aria-label="Remove image"
                      icon={<DeleteIcon />}
                      mt={7}
                      borderRadius="16px"
                      variant="ghost"
                      color="var(--dashboard-danger)"
                      _hover={{ bg: "rgba(239, 68, 68, 0.10)" }}
                      onClick={() => handleRemoveGalleryItem(index)}
                    />
                  </Flex>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        ) : (
          <Box
            border="1px dashed"
            borderColor={tone.border}
            borderRadius="24px"
            bg={tone.soft}
            px={6}
            py={8}
            textAlign="center"
          >
            <Text fontSize="md" fontWeight="700" color="var(--dashboard-text)">
              Start with a few strong visuals
            </Text>
            <Text mt={1} fontSize="sm" color="var(--dashboard-text-soft)">
              Showcase your storefront, products, or workspace. You can always add more later.
            </Text>
          </Box>
        )}

        <Button
          leftIcon={<AddIcon />}
          variant="outline"
          borderRadius="18px"
          borderStyle="dashed"
          borderColor={tone.border}
          color={tone.text}
          w="full"
          minH="52px"
          bg="transparent"
          _hover={{ bg: tone.soft }}
          onClick={handleAddGalleryItem}
        >
          Add another photo
        </Button>
      </VStack>
    </MerchantSectionCard>
  );
};

export default GallerySection;
