import React from "react";
import { Box, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { FiPhone } from "react-icons/fi";
import { MerchantSectionCard, MerchantTextField } from "./merchantTheme";

const ContactInfoSection = ({ values, errors, setFieldValue, showError }) => {
  return (
    <MerchantSectionCard
      icon={FiPhone}
      title="Contact"
      description="How buyers reach you and discover you online."
      tint="cyan"
    >
      <VStack spacing={6} align="stretch">
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <MerchantTextField
            label="Seller Login Number"
            name="contactInfo.phone"
            type="tel"
            required
            placeholder="+91 98765 43210"
            value={values?.contactInfo?.phone || ""}
            readOnly
            hint="This always follows the seller account phone number."
            showError={showError}
            error={errors.contactInfo?.phone}
          />
          <MerchantTextField
            label="Email"
            name="contactInfo.email"
            type="email"
            placeholder="hello@yourshop.com"
            value={values?.contactInfo?.email || ""}
            onChange={(event) => setFieldValue("contactInfo.email", event.target.value)}
            showError={showError}
            error={errors?.contactInfo?.email}
          />
          <Box gridColumn={{ md: "span 2" }}>
            <MerchantTextField
              label="Website"
              name="contactInfo.website"
              type="url"
              placeholder="https://yourshop.com"
              value={values?.contactInfo?.website || ""}
              onChange={(event) => setFieldValue("contactInfo.website", event.target.value)}
              showError={showError}
              error={errors.contactInfo?.website}
            />
          </Box>
        </SimpleGrid>

        <Box>
          <Text
            mb={3}
            fontSize="xs"
            fontWeight="700"
            letterSpacing="0.12em"
            textTransform="uppercase"
            color="var(--dashboard-text-soft)"
          >
            Social
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <MerchantTextField
              label="Facebook"
              name="contactInfo.socialMedia.facebook"
              type="url"
              placeholder="Facebook URL"
              value={values?.contactInfo?.socialMedia?.facebook || ""}
              onChange={(event) =>
                setFieldValue("contactInfo.socialMedia.facebook", event.target.value)
              }
              showError={showError}
              error={errors.contactInfo?.socialMedia?.facebook}
            />
            <MerchantTextField
              label="Instagram"
              name="contactInfo.socialMedia.instagram"
              type="url"
              placeholder="Instagram URL"
              value={values?.contactInfo?.socialMedia?.instagram || ""}
              onChange={(event) =>
                setFieldValue("contactInfo.socialMedia.instagram", event.target.value)
              }
              showError={showError}
              error={errors.contactInfo?.socialMedia?.instagram}
            />
            <MerchantTextField
              label="X / Twitter"
              name="contactInfo.socialMedia.twitter"
              type="url"
              placeholder="X / Twitter URL"
              value={values?.contactInfo?.socialMedia?.twitter || ""}
              onChange={(event) =>
                setFieldValue("contactInfo.socialMedia.twitter", event.target.value)
              }
              showError={showError}
              error={errors.contactInfo?.socialMedia?.twitter}
            />
            <MerchantTextField
              label="LinkedIn"
              name="contactInfo.socialMedia.linkedin"
              type="url"
              placeholder="LinkedIn URL"
              value={values?.contactInfo?.socialMedia?.linkedin || ""}
              onChange={(event) =>
                setFieldValue("contactInfo.socialMedia.linkedin", event.target.value)
              }
              showError={showError}
              error={errors.contactInfo?.socialMedia?.linkedin}
            />
            <Box gridColumn={{ md: "span 2" }}>
              <MerchantTextField
                label="YouTube"
                name="contactInfo.socialMedia.youtube"
                type="url"
                placeholder="YouTube URL"
                value={values?.contactInfo?.socialMedia?.youtube || ""}
                onChange={(event) =>
                  setFieldValue("contactInfo.socialMedia.youtube", event.target.value)
                }
                showError={showError}
                error={errors.contactInfo?.socialMedia?.youtube}
              />
            </Box>
          </SimpleGrid>
        </Box>
      </VStack>
    </MerchantSectionCard>
  );
};

export default ContactInfoSection;
