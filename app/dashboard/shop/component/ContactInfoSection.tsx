import React from "react";
import { Box, VStack, Grid, GridItem, Text } from "@chakra-ui/react";
import CustomInput from "../../../component/config/component/customInput/CustomInput";

const ContactInfoSection = ({ values, errors, setFieldValue, showError }) => (
  <Box>
      <Text fontSize="xl" fontWeight="bold" color="teal.600" mb={2}>
      Contact Information
    </Text>
    <VStack spacing={4}>
      <CustomInput
        showError={showError}
        label="Phone"
        name="contactInfo.phone"
        required
        error={errors.contactInfo?.phone}
        value={values?.contactInfo?.phone}
        onChange={(e) => setFieldValue("contactInfo.phone", e.target.value)}
      />
      <CustomInput
        showError={showError}
        label="Email"
        name="contactInfo.email"
        type="text"
        error={errors?.contactInfo?.email}
        value={values?.contactInfo?.email}
        onChange={(e) => setFieldValue("contactInfo.email", e.target.value)}
      />
      <CustomInput
        showError={showError}
        label="Website"
        name="contactInfo.website"
        type="url"
        error={errors.contactInfo?.website}
        value={values?.contactInfo?.website}
        onChange={(e) => setFieldValue("contactInfo.website", e.target.value)}
      />
    </VStack>
    <Text fontSize="lg" fontWeight="semibold" color="teal.500" mt={6} mb={4}>
      Social Media Links
    </Text>
    <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
      <GridItem>
        <CustomInput
          showError={showError}
          label="Facebook"
          name="contactInfo.socialMedia.facebook"
          type="url"
          error={errors.contactInfo?.socialMedia?.facebook}
          value={values?.contactInfo?.socialMedia?.facebook}
          onChange={(e) => setFieldValue("contactInfo.socialMedia.facebook", e.target.value)}
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
          onChange={(e) => setFieldValue("contactInfo.socialMedia.instagram", e.target.value)}
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
          onChange={(e) => setFieldValue("contactInfo.socialMedia.twitter", e.target.value)}
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
          onChange={(e) => setFieldValue("contactInfo.socialMedia.linkedin", e.target.value)}
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
          onChange={(e) => setFieldValue("contactInfo.socialMedia.youtube", e.target.value)}
        />
      </GridItem>
    </Grid>
  </Box>
);

export default ContactInfoSection;