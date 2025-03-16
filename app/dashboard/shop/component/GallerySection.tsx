import React from "react";
import { Box, VStack, Flex, Text, IconButton, Button } from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import CustomInput from "../../../component/config/component/customInput/CustomInput";
import ShowFileUploadFile from "../../../component/common/ShowFileUploadFile/ShowFileUploadFile";
import { removeDataByIndex } from "../../../config/utils/utils";

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
    setFieldValue("gallery", removeDataByIndex(values.gallery, index));
  };

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" color="teal.600" mb={4}>
        Gallery
      </Text>
      <VStack spacing={4} align="start" width="100%">
        {values?.gallery?.map((item, index) => (
          <Flex
            key={index}
            width="100%"
            gap={4}
            p={4}
            borderRadius="md"
            border="1px solid #ddd"
            align="center"
            wrap="wrap"
          >
            <Box flex="1">
              {item.file ? (
                <ShowFileUploadFile
                  files={item.file}
                  removeFile={() => {
                    if(!item.isAdd){
                      setFieldValue('deletedFiles', (prevDeletedFiles) => {
                        return (prevDeletedFiles || []).concat(item?.file?.name);
                      });
                  }
                    handleRemoveGalleryItem(index)}}
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
        <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={handleAddGalleryItem}>
          Add Image
        </Button>
      </VStack>
    </Box>
  );
};

export default GallerySection;
