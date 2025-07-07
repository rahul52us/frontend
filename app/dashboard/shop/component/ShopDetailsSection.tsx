import React from "react";
import { Box, VStack, Text, SimpleGrid, Divider, Center } from "@chakra-ui/react";
import CustomInput from "../../../component/config/component/customInput/CustomInput";
import ShowFileUploadFile from "../../../component/common/ShowFileUploadFile/ShowFileUploadFile";
import { removeDataByIndex } from "../../../config/utils/utils";

const ShopDetailsSection = ({ values, errors, setFieldValue, showError }) => {
  return (
    <Box p={2}>
      {/* <Text fontSize="2xl" fontWeight="bold" color="teal.600" mb={4}>
        Shop Details
      </Text> */}

      {/* Logo Upload Section */}
      <Box mb={6}>
        <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={2}>
          Shop Logo
        </Text>
        <Center>
          {values?.logo?.file?.length === 0 ? (
            <CustomInput
              type="file-drag"
              name="logo"
              value={values.logo}
              isMulti={true}
              accept="image/*"
              onChange={(e) =>
                setFieldValue("logo", {
                  ...values.logo,
                  file: e.target.files[0],
                  isAdd: 1,
                })
              }
              showError={showError}
              error={errors.logo}
            />
          ) : (
            <ShowFileUploadFile
              files={values.logo?.file}
              removeFile={() =>
                setFieldValue("logo", {
                  ...values.logo,
                  file: removeDataByIndex(values.logo, 0),
                  isDeleted: 1,
                })
              }
              edit={true}
            />
          )}
        </Center>
      </Box>

      <Divider my={6} />

      {/* Basic Info Section */}
      <VStack spacing={6} align="stretch">
        <Text fontSize="lg" fontWeight="semibold" color="gray.700">
          Basic Information
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <CustomInput
            label="Shop Name"
            name="name"
            required
            error={errors.name}
            value={values.name}
            onChange={(e) => setFieldValue("name", e.target.value)}
            showError={showError}
          />
          <CustomInput
            label="Tags"
            name="tags"
            placeholder="Add Tags"
            required
            type="tags"
            error={errors.tags}
            value={values.tags}
            onChange={(e) => setFieldValue("tags", e)}
            showError={showError}
          />
        </SimpleGrid>
        <CustomInput
            label="Categories"
            name="categories"
            placeholder="Add Category"
            required
            type="tags"
            error={errors.categories}
            value={values.categories}
            onChange={(e) => setFieldValue("categories", e)}
            showError={showError}
          />
      </VStack>

      <Divider my={6} />

      {/* Description & About Section */}
      <VStack spacing={6} align="stretch">
        <Text fontSize="lg" fontWeight="semibold" color="gray.700">
          Shop Description
        </Text>

        <Box>
        <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={2}>
          Cover Image
        </Text>
        <Center>
          {values?.coverImage?.file?.length === 0 ? (
            <CustomInput
              type="file-drag"
              name="coverImage"
              value={values.coverImage}
              isMulti={true}
              accept="image/*"
              onChange={(e) =>
                setFieldValue("coverImage", {
                  ...values.coverImage,
                  file: e.target.files[0],
                  isAdd: 1,
                })
              }
              showError={showError}
              error={errors.coverImage}
            />
          ) : (
            <ShowFileUploadFile
              files={values.coverImage?.file}
              removeFile={() =>
                setFieldValue("coverImage", {
                  ...values.coverImage,
                  file: removeDataByIndex(values.coverImage, 0),
                  isDeleted: 1,
                })
              }
              edit={true}
            />
          )}
        </Center>
      </Box>

        <CustomInput
          label="Description"
          name="description"
          type="textarea"
          required
          error={errors.description}
          value={values.description}
          onChange={(e) => setFieldValue("description", e.target.value)}
          showError={showError}
        />
        <CustomInput
          rows={10}
          label="About"
          name="about"
          type="textarea"
          placeholder="Write about your shop..."
          error={errors.about}
          value={values.about}
          onChange={(e) => setFieldValue("about", e.target.value)}
          showError={showError}
        />
      </VStack>

      <Divider my={6} />

      {/* Cover Image Upload Section */}

    </Box>
  );
};

export default ShopDetailsSection;
