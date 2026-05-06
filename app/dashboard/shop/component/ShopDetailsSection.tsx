import {
  Box,
  Center,
  Checkbox,
  CheckboxGroup,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import {
  FiDollarSign,
  FiFileText,
  FiImage,
  FiInfo,
  FiTag,
  FiUploadCloud,
} from "react-icons/fi";
import ShowFileUploadFile from "../../../component/common/ShowFileUploadFile/ShowFileUploadFile";
import CustomInput from "../../../component/config/component/customInput/CustomInput";
import { normalizeGstNumber } from "../../../config/utils/gstValidation";
import { removeDataByIndex } from "../../../config/utils/utils";
import stores from "../../../store/stores";
import { MerchantSectionCard } from "./merchantTheme";

const CategorySelector = observer(({ values, setFieldValue, errors, showError }: any) => {
  const { categoryStore } = stores;
  const { categories, loading, getAllCategories } = categoryStore;

  useEffect(() => {
    getAllCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading && categories.length === 0) {
    return <Spinner size="sm" color="var(--dashboard-accent)" />;
  }

  return (
    <Box
      sx={{
        ".chakra-checkbox": {
          px: 3,
          py: 3,
          borderRadius: "16px",
          border: "1px solid",
          borderColor: "var(--dashboard-border-strong)",
          bg: "var(--dashboard-checkbox-bg)",
          transition: "all 0.2s ease",
        },
        ".chakra-checkbox:hover": {
          borderColor: "var(--dashboard-accent)",
        },
        ".chakra-checkbox__control": {
          borderColor: "var(--dashboard-checkbox-border)",
          bg: "transparent",
        },
        ".chakra-checkbox__control[data-checked]": {
          bg: "var(--dashboard-checkbox-active-bg)",
          borderColor: "var(--dashboard-accent)",
          color: "var(--dashboard-accent)",
        },
        ".chakra-checkbox__label": {
          color: "var(--dashboard-text-muted)",
          fontSize: "sm",
          fontWeight: 500,
        },
      }}
    >
      <CheckboxGroup
        colorScheme="yellow"
        value={values.categories || []}
        onChange={(selected) => setFieldValue("categories", selected)}
      >
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
          {categories.map((category) => (
            <Checkbox key={category._id} value={category.name}>
              {category.name}
            </Checkbox>
          ))}
        </SimpleGrid>
      </CheckboxGroup>
      {showError && errors.categories ? (
        <Text color="var(--dashboard-danger, #ef6b6b)" fontSize="xs" mt={2}>
          {errors.categories}
        </Text>
      ) : null}
    </Box>
  );
});

const ShopDetailsSection = ({ values, errors, setFieldValue, showError }) => {
  return (
    <VStack spacing={8} align="stretch">
      <MerchantSectionCard
        icon={FiUploadCloud}
        title="Shop Logo"
        description="Your primary brand mark. PNG, JPG, SVG, or WEBP work well here."
      >
        <Center>
          {values?.logo?.file?.length === 0 ? (
            <CustomInput
              type="file-drag"
              name="logo"
              value={values.logo}
              isMulti
              accept="image/*"
              onChange={(event) =>
                setFieldValue("logo", {
                  ...values.logo,
                  file: event.target.files[0],
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
              edit
            />
          )}
        </Center>
      </MerchantSectionCard>

      <MerchantSectionCard
        icon={FiInfo}
        title="Basic Information"
        description="Name, tags, and categories buyers will use to recognize your shop."
      >
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
          <CustomInput
            label="Shop Name"
            name="name"
            required
            error={errors.name}
            value={values.name}
            onChange={(event) => setFieldValue("name", event.target.value)}
            showError={showError}
          />
          <CustomInput
            label="Tags"
            name="tags"
            placeholder="Add tags"
            required
            type="tags"
            error={errors.tags}
            value={values.tags}
            onChange={(nextTags) => setFieldValue("tags", nextTags)}
            showError={showError}
          />
        </SimpleGrid>

        <Box mt={5}>
          <CustomInput
            label="Company Code (Initials)"
            name="companyCode"
            placeholder="e.g. AMD, NIKE"
            required
            error={errors.companyCode}
            value={values.companyCode}
            onChange={(event) => setFieldValue("companyCode", event.target.value.toUpperCase())}
            showError={showError}
          />
        </Box>

        <Box mt={5}>
          <Text
            mb={3}
            color="var(--dashboard-text-muted)"
            fontSize="xs"
            fontWeight="600"
            textTransform="uppercase"
            letterSpacing="0.12em"
          >
            Categories
          </Text>
          <CategorySelector
            values={values}
            setFieldValue={setFieldValue}
            errors={errors}
            showError={showError}
          />
        </Box>
      </MerchantSectionCard>

      <MerchantSectionCard
        icon={FiImage}
        title="Cover Image"
        description="A wide hero image shown at the top of your shop profile."
      >
        <Center>
          {values?.coverImage?.file?.length === 0 ? (
            <CustomInput
              type="file-drag"
              name="coverImage"
              value={values.coverImage}
              isMulti
              accept="image/*"
              onChange={(event) =>
                setFieldValue("coverImage", {
                  ...values.coverImage,
                  file: event.target.files[0],
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
              edit
            />
          )}
        </Center>
      </MerchantSectionCard>

      <MerchantSectionCard
        icon={FiTag}
        title="Shop Description"
        description="Describe what you sell, how you operate, and what makes your shop distinct."
      >
        <VStack spacing={5}>
          <CustomInput
            label="Description"
            name="description"
            type="textarea"
            required
            error={errors.description}
            value={values.description}
            onChange={(event) => setFieldValue("description", event.target.value)}
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
            onChange={(event) => setFieldValue("about", event.target.value)}
            showError={showError}
          />
        </VStack>
      </MerchantSectionCard>

      <MerchantSectionCard
        icon={FiDollarSign}
        title="Bank Details"
        description="Business payout information for payments and settlement."
      >
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
          <CustomInput
            label="Account Holder Name"
            name="bankDetails.accountHolderName"
            value={values.bankDetails?.accountHolderName}
            onChange={(event) => setFieldValue("bankDetails.accountHolderName", event.target.value)}
            showError={showError}
          />
          <CustomInput
            label="Account Number"
            name="bankDetails.accountNumber"
            value={values.bankDetails?.accountNumber}
            onChange={(event) => setFieldValue("bankDetails.accountNumber", event.target.value)}
            showError={showError}
          />
          <CustomInput
            label="Bank Name"
            name="bankDetails.bankName"
            value={values.bankDetails?.bankName}
            onChange={(event) => setFieldValue("bankDetails.bankName", event.target.value)}
            showError={showError}
          />
          <CustomInput
            label="IFSC Code"
            name="bankDetails.ifscCode"
            value={values.bankDetails?.ifscCode}
            onChange={(event) => setFieldValue("bankDetails.ifscCode", event.target.value)}
            showError={showError}
          />
          <CustomInput
            label="GST Number"
            name="gstNumber"
            value={values.gstNumber}
            onChange={(event) => setFieldValue("gstNumber", normalizeGstNumber(event.target.value))}
            showError={showError}
          />
        </SimpleGrid>
      </MerchantSectionCard>

      <MerchantSectionCard
        icon={FiFileText}
        title="Business Policies"
        description="Return terms and accepted payment methods for buyers."
      >
        <VStack spacing={5}>
          <CustomInput
            label="Return Policy"
            name="returnPolicy"
            type="textarea"
            rows={4}
            value={values.returnPolicy}
            onChange={(event) => setFieldValue("returnPolicy", event.target.value)}
            showError={showError}
          />
          <CustomInput
            label="Payment Methods (Comma separated)"
            name="paymentMethods"
            placeholder="e.g. UPI, Credit Card, COD"
            value={values.paymentMethods ? values.paymentMethods.join(", ") : ""}
            onChange={(event) => {
              const methods = event.target.value
                .split(",")
                .map((method) => method.trim())
                .filter(Boolean);
              setFieldValue("paymentMethods", methods);
            }}
            showError={showError}
          />
        </VStack>
      </MerchantSectionCard>
    </VStack>
  );
};

export default ShopDetailsSection;
