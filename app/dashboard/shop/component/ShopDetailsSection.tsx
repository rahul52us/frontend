import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import {
  FiInfo
} from "react-icons/fi";
import ShowFileUploadFile from "../../../component/common/ShowFileUploadFile/ShowFileUploadFile";
import CustomInput from "../../../component/config/component/customInput/CustomInput";
import { normalizeGstNumber } from "../../../config/utils/gstValidation";
import { removeDataByIndex } from "../../../config/utils/utils";
import stores from "../../../store/stores";
import {
  MerchantSectionCard,
  MerchantTextField,
  useMerchantTone,
} from "./merchantTheme";

const Subsection = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <Box
    border="1px solid"
    borderColor="var(--dashboard-border)"
    borderRadius="24px"
    bg="var(--dashboard-surface-alt)"
    px={{ base: 4, md: 5 }}
    py={{ base: 4, md: 5 }}
  >
    <Text fontSize="md" fontWeight="700" color="var(--dashboard-text)">
      {title}
    </Text>
    {description ? (
      <Text mt={1} fontSize="sm" color="var(--dashboard-text-soft)">
        {description}
      </Text>
    ) : null}
    <Box mt={4}>{children}</Box>
  </Box>
);

const getCategoryId = (category: any) => String(category?._id || "").trim();
const getCategoryName = (category: any) => String(category?.name || "").trim();
const getCategoryValue = (category: any) => getCategoryName(category) || getCategoryId(category);
const getParentCategoryId = (category: any) => {
  const parent = category?.parent;
  if (!parent) return "";
  return String(typeof parent === "object" ? parent?._id || "" : parent).trim();
};
const getParentCategoryName = (category: any) => {
  const parent = category?.parent;
  return String(parent && typeof parent === "object" ? parent?.name || "" : "").trim();
};
const getCategoryTokens = (category: any) =>
  [getCategoryName(category), getCategoryId(category)].filter(Boolean);
const isChildCategoryOfRoot = (category: any, rootCategory: any) => {
  const parentId = getParentCategoryId(category);
  const parentName = getParentCategoryName(category).toLowerCase();
  const rootId = getCategoryId(rootCategory);
  const rootName = getCategoryName(rootCategory).toLowerCase();

  return Boolean(parentId && parentId === rootId) || Boolean(parentName && parentName === rootName);
};

const CategorySelector = observer(({ values, setFieldValue, errors, showError }: any) => {
  const tone = useMerchantTone("blue");
  const { categoryStore } = stores;
  const { categories, loading, getAllCategories } = categoryStore;

  useEffect(() => {
    getAllCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading && categories.length === 0) {
    return <Spinner size="sm" color="var(--dashboard-accent)" />;
  }

  const activeCategories = categories.filter((category: any) => category.isActive !== false);
  const rootCategories = activeCategories.filter((category: any) => !getParentCategoryId(category));
  const selectedCategories = Array.isArray(values.categories) ? values.categories : [];
  const selectedCategoryKeys = new Set(
    selectedCategories.map((category: string) => String(category).trim().toLowerCase()).filter(Boolean)
  );

  const isCategorySelected = (category: any) =>
    getCategoryTokens(category).some((token) => selectedCategoryKeys.has(token.toLowerCase()));

  const getChildCategories = (rootCategory: any) =>
    activeCategories.filter((category: any) => isChildCategoryOfRoot(category, rootCategory));

  const normalizeCategoryValues = (items: string[]) =>
    Array.from(new Set(items.map((item) => String(item).trim()).filter(Boolean)));

  const toggleRootCategory = (rootCategory: any) => {
    const rootValue = getCategoryValue(rootCategory);

    if (isCategorySelected(rootCategory)) {
      const childCategories = getChildCategories(rootCategory);
      const removalKeys = new Set(
        [rootCategory, ...childCategories]
          .flatMap((category) => getCategoryTokens(category))
          .map((token) => token.toLowerCase())
      );

      setFieldValue(
        "categories",
        selectedCategories.filter(
          (category: string) => !removalKeys.has(String(category).trim().toLowerCase())
        )
      );
      return;
    }

    setFieldValue("categories", normalizeCategoryValues([...selectedCategories, rootValue]));
  };

  const toggleChildCategory = (childCategory: any, rootCategory: any) => {
    const childValue = getCategoryValue(childCategory);
    const rootValue = getCategoryValue(rootCategory);

    if (isCategorySelected(childCategory)) {
      const childKeys = new Set(getCategoryTokens(childCategory).map((token) => token.toLowerCase()));
      setFieldValue(
        "categories",
        selectedCategories.filter(
          (category: string) => !childKeys.has(String(category).trim().toLowerCase())
        )
      );
      return;
    }

    setFieldValue(
      "categories",
      normalizeCategoryValues([...selectedCategories, rootValue, childValue])
    );
  };

  const selectedRootCategories = rootCategories.filter(isCategorySelected);

  return (
    <VStack align="stretch" spacing={4}>
      <Box>
        <Text fontSize="xs" fontWeight="800" letterSpacing="0.08em" textTransform="uppercase" color="var(--dashboard-text-soft)" mb={2}>
          Root categories
        </Text>
        <Flex gap={2} wrap="wrap">
          {rootCategories.map((category: any) => {
            const isSelected = isCategorySelected(category);
            return (
              <Button
                key={category._id || category.name}
                type="button"
                size="sm"
                borderRadius="full"
                px={4}
                minH="36px"
                fontSize="xs"
                fontWeight="700"
                variant="outline"
                borderColor={isSelected ? tone.border : "var(--dashboard-border)"}
                bg={isSelected ? tone.soft : "var(--dashboard-surface)"}
                color={isSelected ? tone.text : "var(--dashboard-text-muted)"}
                _hover={{
                  borderColor: tone.border,
                  bg: tone.soft,
                }}
                onClick={() => toggleRootCategory(category)}
              >
                {category.name}
              </Button>
            );
          })}
        </Flex>
      </Box>

      <Box>
        <Text fontSize="xs" fontWeight="800" letterSpacing="0.08em" textTransform="uppercase" color="var(--dashboard-text-soft)" mb={2}>
          Subcategories
        </Text>
        {selectedRootCategories.length === 0 ? (
          <Box borderRadius="18px" borderWidth="1px" borderColor="var(--dashboard-border)" bg="var(--dashboard-surface)" px={4} py={3}>
            <Text fontSize="sm" color="var(--dashboard-text-muted)">
              Choose a root category to see its subcategories.
            </Text>
          </Box>
        ) : (
          <VStack align="stretch" spacing={3}>
            {selectedRootCategories.map((rootCategory: any) => {
              const childCategories = getChildCategories(rootCategory);

              return (
                <Box key={rootCategory._id || rootCategory.name}>
                  <Text fontSize="sm" fontWeight="700" color="var(--dashboard-text)" mb={2}>
                    {rootCategory.name}
                  </Text>
                  {childCategories.length === 0 ? (
                    <Text fontSize="xs" color="var(--dashboard-text-muted)">
                      No subcategories available for this category.
                    </Text>
                  ) : (
                    <Flex gap={2} wrap="wrap">
                      {childCategories.map((category: any) => {
                        const isSelected = isCategorySelected(category);
                        return (
                          <Button
                            key={category._id || category.name}
                            type="button"
                            size="sm"
                            borderRadius="full"
                            px={4}
                            minH="34px"
                            fontSize="xs"
                            fontWeight="700"
                            variant="outline"
                            borderColor={isSelected ? tone.border : "var(--dashboard-border)"}
                            bg={isSelected ? tone.soft : "var(--dashboard-surface)"}
                            color={isSelected ? tone.text : "var(--dashboard-text-muted)"}
                            _hover={{
                              borderColor: tone.border,
                              bg: tone.soft,
                            }}
                            onClick={() => toggleChildCategory(category, rootCategory)}
                          >
                            {category.name}
                          </Button>
                        );
                      })}
                    </Flex>
                  )}
                </Box>
              );
            })}
          </VStack>
        )}
      </Box>

      <Flex gap={2} wrap="wrap">
        {selectedCategories.map((category: string) => (
          <Box
            key={category}
            borderRadius="full"
            bg="var(--dashboard-accent-soft)"
            color="var(--dashboard-accent-strong)"
            px={3}
            py={1}
            fontSize="xs"
            fontWeight="700"
          >
            {category}
          </Box>
        ))}
      </Flex>
      {showError && errors.categories ? (
        <Text color="var(--dashboard-danger)" fontSize="xs" mt={2}>
          {errors.categories}
        </Text>
      ) : null}
    </VStack>
  );
});

const parseCommaSeparatedInput = (input: string) =>
  input
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const ShopDetailsSection = ({ values, errors, setFieldValue, showError }) => {
  const [tagsInput, setTagsInput] = useState("");
  const [isTagsInputFocused, setIsTagsInputFocused] = useState(false);
  const [paymentMethodsInput, setPaymentMethodsInput] = useState("");
  const [isPaymentMethodsInputFocused, setIsPaymentMethodsInputFocused] = useState(false);
  const tagsTextFromValues = Array.isArray(values.tags)
    ? values.tags.join(", ")
    : "";
  const paymentMethodsTextFromValues = Array.isArray(values.paymentMethods)
    ? values.paymentMethods.join(", ")
    : "";

  useEffect(() => {
    if (!isTagsInputFocused) {
      setTagsInput(tagsTextFromValues);
    }
  }, [isTagsInputFocused, tagsTextFromValues]);

  useEffect(() => {
    if (!isPaymentMethodsInputFocused) {
      setPaymentMethodsInput(paymentMethodsTextFromValues);
    }
  }, [isPaymentMethodsInputFocused, paymentMethodsTextFromValues]);

  return (
    <MerchantSectionCard
      icon={FiInfo}
      title="Shop Details"
      description="Tell buyers what your business is called, what you sell, and how you operate."
      tint="blue"
    >
      <VStack spacing={5} align="stretch">
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Box gridColumn={{ md: "span 2" }}>
            <MerchantTextField
              label="Shop name"
              name="name"
              required
              placeholder="e.g. Sunrise General Store"
              value={values.name || ""}
              onChange={(event) => setFieldValue("name", event.target.value)}
              showError={showError}
              error={errors.name}
            />
          </Box>
          <MerchantTextField
            label="Company code"
            name="companyCode"
            required
            placeholder="e.g. SUN1234"
            hint="Short code used internally for your shop."
            value={values.companyCode || ""}
            onChange={(event) => setFieldValue("companyCode", event.target.value.toUpperCase())}
            showError={showError}
            error={errors.companyCode}
          />
          <MerchantTextField
            label="GST number"
            name="gstNumber"
            placeholder="22AAAAA0000A1Z5"
            hint="Optional"
            value={values.gstNumber || ""}
            onChange={(event) => setFieldValue("gstNumber", normalizeGstNumber(event.target.value))}
            showError={showError}
            error={errors.gstNumber}
          />
          <Box gridColumn={{ md: "span 1" }}>
            <MerchantTextField
              label="Tags"
              name="tags"
              placeholder="grocery, essentials, wholesale"
              hint="Optional. Separate tags with commas."
              value={tagsInput}
              onChange={(event) => {
                const nextValue = event.target.value;
                setTagsInput(nextValue);
                setFieldValue("tags", parseCommaSeparatedInput(nextValue));
              }}
              onFocus={() => setIsTagsInputFocused(true)}
              onBlur={(event) => {
                const nextTags = parseCommaSeparatedInput(event.currentTarget.value);
                setIsTagsInputFocused(false);
                setFieldValue("tags", nextTags);
                setTagsInput(nextTags.join(", "));
              }}
              showError={showError}
              error={errors.tags}
            />
          </Box>
        </SimpleGrid>

        <Subsection
          title="Categories"
          description="Pick the categories buyers will use to discover your shop."
        >
          <CategorySelector
            values={values}
            setFieldValue={setFieldValue}
            errors={errors}
            showError={showError}
          />
        </Subsection>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Subsection
            title="Logo"
            description="Upload the primary brand mark shown across your storefront."
          >
            <Flex justify="center">
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
            </Flex>
          </Subsection>

          <Subsection
            title="Cover photo"
            description="A wide hero image shown at the top of your shop profile."
          >
            <Flex justify="center">
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
            </Flex>
          </Subsection>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Box gridColumn={{ md: "span 2" }}>
            <MerchantTextField
              label="Description"
              name="description"
              as="textarea"
              rows={3}
              placeholder="A short pitch about your shop..."
              value={values.description || ""}
              onChange={(event) => setFieldValue("description", event.target.value)}
              showError={showError}
              error={errors.description}
            />
          </Box>
          <Box gridColumn={{ md: "span 2" }}>
            <MerchantTextField
              label="About"
              name="about"
              as="textarea"
              rows={3}
              placeholder="Share more detail about your store, service area, or specialities."
              value={values.about || ""}
              onChange={(event) => setFieldValue("about", event.target.value)}
              showError={showError}
              error={errors.about}
            />
          </Box>
        </SimpleGrid>

        <Subsection
          title="Bank Details"
          description="Business payout information for settlements and payments."
        >
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <MerchantTextField
              label="Account holder name"
              name="bankDetails.accountHolderName"
              placeholder="Full name"
              value={values.bankDetails?.accountHolderName || ""}
              onChange={(event) =>
                setFieldValue("bankDetails.accountHolderName", event.target.value)
              }
              showError={showError}
              error={errors.bankDetails?.accountHolderName}
            />
            <MerchantTextField
              label="Account number"
              name="bankDetails.accountNumber"
              placeholder="Account number"
              value={values.bankDetails?.accountNumber || ""}
              onChange={(event) =>
                setFieldValue("bankDetails.accountNumber", event.target.value)
              }
              showError={showError}
              error={errors.bankDetails?.accountNumber}
            />
            <MerchantTextField
              label="Bank name"
              name="bankDetails.bankName"
              placeholder="Bank name"
              value={values.bankDetails?.bankName || ""}
              onChange={(event) => setFieldValue("bankDetails.bankName", event.target.value)}
              showError={showError}
              error={errors.bankDetails?.bankName}
            />
            <MerchantTextField
              label="IFSC code"
              name="bankDetails.ifscCode"
              placeholder="IFSC code"
              value={values.bankDetails?.ifscCode || ""}
              onChange={(event) => setFieldValue("bankDetails.ifscCode", event.target.value)}
              showError={showError}
              error={errors.bankDetails?.ifscCode}
            />
          </SimpleGrid>
        </Subsection>

        <Subsection
          title="Business Policies"
          description="Return terms and accepted payment methods for buyers."
        >
          <VStack spacing={4} align="stretch">
            <MerchantTextField
              label="Return policy"
              name="returnPolicy"
              as="textarea"
              rows={4}
              placeholder="Explain your return and exchange policy."
              value={values.returnPolicy || ""}
              onChange={(event) => setFieldValue("returnPolicy", event.target.value)}
              showError={showError}
              error={errors.returnPolicy}
            />
            <MerchantTextField
              label="Payment methods"
              name="paymentMethods"
              placeholder="e.g. UPI, Credit Card, COD"
              hint="Separate payment methods with commas."
              value={paymentMethodsInput}
              onChange={(event) => {
                const nextValue = event.target.value;
                setPaymentMethodsInput(nextValue);
                setFieldValue("paymentMethods", parseCommaSeparatedInput(nextValue));
              }}
              onFocus={() => setIsPaymentMethodsInputFocused(true)}
              onBlur={(event) => {
                const nextMethods = parseCommaSeparatedInput(event.currentTarget.value);
                setIsPaymentMethodsInputFocused(false);
                setFieldValue("paymentMethods", nextMethods);
                setPaymentMethodsInput(nextMethods.join(", "));
              }}
              showError={showError}
              error={errors.paymentMethods}
            />
          </VStack>
        </Subsection>
      </VStack>
    </MerchantSectionCard>
  );
};

export default ShopDetailsSection;
