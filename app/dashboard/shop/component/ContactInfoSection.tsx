import React from "react";
import { Grid, GridItem, VStack } from "@chakra-ui/react";
import { FiPhone, FiUsers } from "react-icons/fi";
import CustomInput from "../../../component/config/component/customInput/CustomInput";
import { MerchantSectionCard } from "./merchantTheme";

const ContactInfoSection = ({ values, errors, setFieldValue, showError }) => {
  return (
    <VStack spacing={8} align="stretch">
      <MerchantSectionCard
        icon={FiPhone}
        title="Contact Details"
        description="Phone, email, and website details that buyers can use to reach you."
      >
        <VStack spacing={5}>
          <CustomInput
            showError={showError}
            label="Phone"
            name="contactInfo.phone"
            required
            error={errors.contactInfo?.phone}
            value={values?.contactInfo?.phone}
            onChange={(event) => setFieldValue("contactInfo.phone", event.target.value)}
          />
          <CustomInput
            showError={showError}
            label="Email"
            name="contactInfo.email"
            type="text"
            error={errors?.contactInfo?.email}
            value={values?.contactInfo?.email}
            onChange={(event) => setFieldValue("contactInfo.email", event.target.value)}
          />
          <CustomInput
            showError={showError}
            label="Website"
            name="contactInfo.website"
            type="url"
            error={errors.contactInfo?.website}
            value={values?.contactInfo?.website}
            onChange={(event) => setFieldValue("contactInfo.website", event.target.value)}
          />
        </VStack>
      </MerchantSectionCard>

      <MerchantSectionCard
        icon={FiUsers}
        title="Social Media"
        description="Optional social profiles to build trust and help buyers discover you."
      >
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={5}>
          <GridItem>
            <CustomInput
              showError={showError}
              label="Facebook"
              name="contactInfo.socialMedia.facebook"
              type="url"
              error={errors.contactInfo?.socialMedia?.facebook}
              value={values?.contactInfo?.socialMedia?.facebook}
              onChange={(event) =>
                setFieldValue("contactInfo.socialMedia.facebook", event.target.value)
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
              onChange={(event) =>
                setFieldValue("contactInfo.socialMedia.instagram", event.target.value)
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
              onChange={(event) =>
                setFieldValue("contactInfo.socialMedia.twitter", event.target.value)
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
              onChange={(event) =>
                setFieldValue("contactInfo.socialMedia.linkedin", event.target.value)
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
              onChange={(event) =>
                setFieldValue("contactInfo.socialMedia.youtube", event.target.value)
              }
            />
          </GridItem>
        </Grid>
      </MerchantSectionCard>
    </VStack>
  );
};

export default ContactInfoSection;
