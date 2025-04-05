import React from "react";
import { Box, Grid, GridItem, Text } from "@chakra-ui/react";
import CustomInput from "../../../component/config/component/customInput/CustomInput";

const MainLocationSection = ({ values, errors, setFieldValue, showError }) => {
  const location = values.location || {};
  const locationErrors = errors.location || {};
  const coordinates = location.coordinates || ["", ""];
  const coordinatesErrors = locationErrors.coordinates || [];

  return (
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
            error={locationErrors.address}
            value={location.address || ""}
            onChange={(e) => setFieldValue("location.address", e.target.value)}
          />
        </GridItem>
        <GridItem>
          <CustomInput
            showError={showError}
            label="City"
            name="location.city"
            required
            error={locationErrors.city}
            value={location.city || ""}
            onChange={(e) => setFieldValue("location.city", e.target.value)}
          />
        </GridItem>
        <GridItem>
          <CustomInput
            showError={showError}
            label="State"
            name="location.state"
            required
            error={locationErrors.state}
            value={location.state || ""}
            onChange={(e) => setFieldValue("location.state", e.target.value)}
          />
        </GridItem>
        <GridItem>
          <CustomInput
            showError={showError}
            label="Postal Code"
            name="location.postalCode"
            required
            error={locationErrors.postalCode}
            value={location.postalCode || ""}
            onChange={(e) => setFieldValue("location.postalCode", e.target.value)}
          />
        </GridItem>
        <GridItem>
          <CustomInput
            showError={showError}
            label="Country"
            name="location.country"
            required
            error={locationErrors.country}
            value={location.country || ""}
            onChange={(e) => setFieldValue("location.country", e.target.value)}
          />
        </GridItem>
        <GridItem>
          <CustomInput
            showError={showError}
            label="Longitude"
            name="location.coordinates[0]"
            required
            error={coordinatesErrors[0]}
            value={coordinates[0] || ""}
            onChange={(e) =>
              setFieldValue("location.coordinates[0]", e.target.value)
            }
          />
        </GridItem>
        <GridItem>
          <CustomInput
            showError={showError}
            label="Latitude"
            name="location.coordinates[1]"
            required
            error={coordinatesErrors[1]}
            value={coordinates[1] || ""}
            onChange={(e) =>
              setFieldValue("location.coordinates[1]", e.target.value)
            }
          />
        </GridItem>
      </Grid>
    </Box>
  );
};

export default MainLocationSection;
