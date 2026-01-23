import React from "react";
import {
  Box,
  VStack,
  Text,
  SimpleGrid,
  Center,
  Flex,
  Icon,
  useColorModeValue,
  Circle,
} from "@chakra-ui/react";
import {
  FiImage,
  FiInfo,
  FiTag,
  FiUploadCloud,
} from "react-icons/fi";
import CustomInput from "../../../component/config/component/customInput/CustomInput";
import ShowFileUploadFile from "../../../component/common/ShowFileUploadFile/ShowFileUploadFile";
import { removeDataByIndex } from "../../../config/utils/utils";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import stores from "../../../store/stores";
import { Checkbox, CheckboxGroup, Spinner } from "@chakra-ui/react";

const CategorySelector = observer(({ values, setFieldValue, errors, showError }: any) => {
  const { categoryStore } = stores;
  const { categories, loading, getAllCategories } = categoryStore;

  useEffect(() => {
    getAllCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (selected) => {
    setFieldValue("categories", selected);
  };

  if (loading && categories.length === 0) return <Spinner size="sm" />;

  return (
    <Box>
      <CheckboxGroup colorScheme="blue" value={values.categories || []} onChange={handleChange}>
        <SimpleGrid columns={{ base: 2, md: 3 }} spacing={2}>
          {categories.map((cat) => (
            <Checkbox key={cat._id} value={cat.name}>
              {cat.name}
            </Checkbox>
          ))}
        </SimpleGrid>
      </CheckboxGroup>
      {showError && errors.categories && (
        <Text color="red.500" fontSize="xs" mt={1}>{errors.categories}</Text>
      )}
    </Box>
  );
});

// Card layout with header and clean solid colors
const SectionCard = ({ icon, title, description, children }) => {
  const headerBg = useColorModeValue("gray.100", "gray.700");
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.800", "gray.100");

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
        <Circle size="36px" bg={useColorModeValue("blue.100", "blue.600")}>
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

const ShopDetailsSection = ({ values, errors, setFieldValue, showError }) => {
  return (
    <VStack spacing={8} align="stretch">
      {/* Logo Upload */}
      <SectionCard
        icon={FiUploadCloud}
        title="Shop Logo"
        description="Upload your business logo"
      >
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
      </SectionCard>

      {/* Basic Info */}
      <SectionCard
        icon={FiInfo}
        title="Basic Information"
        description="Shop name, tags and categories"
      >
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
        <Box mt={4}>
          <CustomInput
            label="Company Code (Initials)"
            name="companyCode"
            placeholder="e.g. AMD, NIKE"
            required
            error={errors.companyCode}
            value={values.companyCode}
            onChange={(e) => setFieldValue("companyCode", e.target.value.toUpperCase())}
            showError={showError}
          />
        </Box>
        <Box mt={4}>
          <Text mb={2} fontWeight="medium" fontSize="sm">
            Categories
          </Text>
          <CategorySelector
            values={values}
            setFieldValue={setFieldValue}
            errors={errors}
            showError={showError}
          />
        </Box>
      </SectionCard>

      {/* Cover Image */}
      <SectionCard
        icon={FiImage}
        title="Cover Image"
        description="Image shown at the top of your shop page"
      >
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
      </SectionCard>

      {/* Description */}
      <SectionCard
        icon={FiTag}
        title="Shop Description"
        description="Describe your business in detail"
      >
        <VStack spacing={4}>
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
            rows={8}
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
      </SectionCard>
    </VStack>
  );
};

export default ShopDetailsSection;
