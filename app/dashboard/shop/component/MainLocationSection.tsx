import React from "react";
import { Box, Grid, GridItem, Text } from "@chakra-ui/react";
import CustomInput from "../../../component/config/component/customInput/CustomInput";

const MainLocationSection = ({ values, errors, setFieldValue, showError }) => (
  <Box>
      <Text fontSize="xl" fontWeight="bold" color="teal.600" mb={2}>
      Main Shop Location
    </Text>
    <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
      <GridItem>
        <CustomInput
          showError={showError}
          label="Address"
          name="location.address"
          required
          error={errors.location?.address}
          value={values.location.address}
          onChange={(e) => setFieldValue("location.address", e.target.value)}
        />
      </GridItem>
      <GridItem>
        <CustomInput
          showError={showError}
          label="City"
          name="location.city"
          required
          error={errors.location?.city}
          value={values.location.city}
          onChange={(e) => setFieldValue("location.city", e.target.value)}
        />
      </GridItem>
      <GridItem>
        <CustomInput
          showError={showError}
          label="State"
          name="location.state"
          required
          error={errors.location?.state}
          value={values.location.state}
          onChange={(e) => setFieldValue("location.state", e.target.value)}
        />
      </GridItem>
      <GridItem>
        <CustomInput
          showError={showError}
          label="Postal Code"
          name="location.postalCode"
          required
          error={errors.location?.postalCode}
          value={values.location.postalCode}
          onChange={(e) => setFieldValue("location.postalCode", e.target.value)}
        />
      </GridItem>
      <GridItem>
        <CustomInput
          showError={showError}
          label="Country"
          name="location.country"
          required
          error={errors.location?.country}
          value={values.location.country}
          onChange={(e) => setFieldValue("location.country", e.target.value)}
        />
      </GridItem>
      <GridItem>
        <CustomInput
          showError={showError}
          label="Longitude"
          name="location.coordinates[0]"
          required
          error={errors.location?.coordinates?.[0]}
          value={values.location.coordinates[0]}
          onChange={(e) => setFieldValue("location.coordinates[0]", e.target.value)}
        />
      </GridItem>
      <GridItem>
        <CustomInput
          showError={showError}
          label="Latitude"
          name="location.coordinates[1]"
          required
          error={errors.location?.coordinates?.[1]}
          value={values.location.coordinates[1]}
          onChange={(e) => setFieldValue("location.coordinates[1]", e.target.value)}
        />
      </GridItem>
    </Grid>
  </Box>
);

export default MainLocationSection;