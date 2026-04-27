import React from "react";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { FiImage } from "react-icons/fi";
import ShowFileUploadFile from "../../../component/common/ShowFileUploadFile/ShowFileUploadFile";
import CustomInput from "../../../component/config/component/customInput/CustomInput";
import { removeDataByIndex } from "../../../config/utils/utils";
import { MerchantSectionCard } from "./merchantTheme";

const GallerySection = ({ values, errors, setFieldValue, showError }) => {
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
    <MerchantSectionCard
      icon={FiImage}
      title="Shop Gallery"
      description="Add supporting photos for your storefront, products, or workspace."
    >
      <VStack spacing={6} align="stretch">
        {values?.gallery?.map((item, index) => (
          <Flex
            key={index}
            gap={4}
            p={4}
            borderRadius="20px"
            border="1px solid"
            borderColor="var(--dashboard-border-strong)"
            bg="rgba(255,255,255,0.02)"
            wrap="wrap"
            align="center"
          >
            <Box flex="1" minW={{ base: "100%", md: "240px" }}>
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
            </Box>

            <Box flex="1" minW={{ base: "100%", md: "220px" }}>
              <CustomInput
                label="Image Title"
                name={`gallery[${index}].title`}
                placeholder="Enter image title"
                value={item.title}
                onChange={(event) => handleTitleChange(index, event.target.value)}
                showError={showError}
                error={errors?.gallery?.[index]?.title}
              />
            </Box>

            <IconButton
              icon={<DeleteIcon />}
              onClick={() => handleRemoveGalleryItem(index)}
              aria-label="Remove Image"
              variant="ghost"
              color="#ef6b6b"
              _hover={{ bg: "rgba(239, 107, 107, 0.12)" }}
            />
          </Flex>
        ))}

        <Box>
          <Button
            leftIcon={<AddIcon />}
            variant="outline"
            borderRadius="16px"
            borderColor="var(--dashboard-border-strong)"
            color="var(--dashboard-accent-strong)"
            _hover={{ bg: "var(--dashboard-accent-soft)" }}
            onClick={handleAddGalleryItem}
          >
            Add Image
          </Button>
          {!values?.gallery?.length ? (
            <Text mt={3} fontSize="sm" color="var(--dashboard-text-soft)">
              Start with a few strong visuals. You can always add more later.
            </Text>
          ) : null}
        </Box>
      </VStack>
    </MerchantSectionCard>
  );
};

export default GallerySection;
