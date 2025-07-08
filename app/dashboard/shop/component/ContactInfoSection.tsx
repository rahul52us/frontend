import React from "react";
import {
  Box,
  VStack,
  Grid,
  GridItem,
  Text,
  Icon,
  Flex,
  useColorModeValue,
  Circle,
} from "@chakra-ui/react";
import { FiPhone, FiUsers } from "react-icons/fi";
import CustomInput from "../../../component/config/component/customInput/CustomInput";

// Reusable styled section card
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

const ContactInfoSection = ({ values, errors, setFieldValue, showError }) => {
  return (
    <VStack spacing={8} align="stretch">
      {/* Contact Info Card */}
      <SectionCard
        icon={FiPhone}
        title="Contact Details"
        description="Phone, email and website for your shop"
      >
        <VStack spacing={4}>
          <CustomInput
            showError={showError}
            label="Phone"
            name="contactInfo.phone"
            required
            error={errors.contactInfo?.phone}
            value={values?.contactInfo?.phone}
            onChange={(e) =>
              setFieldValue("contactInfo.phone", e.target.value)
            }
          />
          <CustomInput
            showError={showError}
            label="Email"
            name="contactInfo.email"
            type="text"
            error={errors?.contactInfo?.email}
            value={values?.contactInfo?.email}
            onChange={(e) =>
              setFieldValue("contactInfo.email", e.target.value)
            }
          />
          <CustomInput
            showError={showError}
            label="Website"
            name="contactInfo.website"
            type="url"
            error={errors.contactInfo?.website}
            value={values?.contactInfo?.website}
            onChange={(e) =>
              setFieldValue("contactInfo.website", e.target.value)
            }
          />
        </VStack>
      </SectionCard>

      {/* Social Media Links Card */}
      <SectionCard
        icon={FiUsers}
        title="Social Media"
        description="Connect your business with social platforms"
      >
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
          <GridItem>
            <CustomInput
              showError={showError}
              label="Facebook"
              name="contactInfo.socialMedia.facebook"
              type="url"
              error={errors.contactInfo?.socialMedia?.facebook}
              value={values?.contactInfo?.socialMedia?.facebook}
              onChange={(e) =>
                setFieldValue("contactInfo.socialMedia.facebook", e.target.value)
              }
            />
          </GridItem>
          <GridItem>
            <CustomInput
              showError={showError}
              label="Instagram"
              name="contactInfo.socialMedia.instagram"
              type="url"
              error={errors.contactInfo?.socialMedia?.instagram}
              value={values?.contactInfo?.socialMedia?.instagram}
              onChange={(e) =>
                setFieldValue("contactInfo.socialMedia.instagram", e.target.value)
              }
            />
          </GridItem>
          <GridItem>
            <CustomInput
              showError={showError}
              label="Twitter"
              name="contactInfo.socialMedia.twitter"
              type="url"
              error={errors.contactInfo?.socialMedia?.twitter}
              value={values?.contactInfo?.socialMedia?.twitter}
              onChange={(e) =>
                setFieldValue("contactInfo.socialMedia.twitter", e.target.value)
              }
            />
          </GridItem>
          <GridItem>
            <CustomInput
              showError={showError}
              label="LinkedIn"
              name="contactInfo.socialMedia.linkedin"
              type="url"
              error={errors.contactInfo?.socialMedia?.linkedin}
              value={values?.contactInfo?.socialMedia?.linkedin}
              onChange={(e) =>
                setFieldValue("contactInfo.socialMedia.linkedin", e.target.value)
              }
            />
          </GridItem>
          <GridItem>
            <CustomInput
              showError={showError}
              label="YouTube"
              name="contactInfo.socialMedia.youtube"
              type="url"
              error={errors.contactInfo?.socialMedia?.youtube}
              value={values?.contactInfo?.socialMedia?.youtube}
              onChange={(e) =>
                setFieldValue("contactInfo.socialMedia.youtube", e.target.value)
              }
            />
          </GridItem>
        </Grid>
      </SectionCard>
    </VStack>
  );
};

export default ContactInfoSection;
