import React from "react";
import {
  Box,
  Grid,
  GridItem,
  VStack,
  HStack,
  Text,
  Checkbox,
  Divider,
  Flex,
} from "@chakra-ui/react";
import CustomInput from "../../../component/config/component/customInput/CustomInput";

const OperatingHoursSection = ({ values, errors, setFieldValue, showError }) => {
  return (
    <Box
    >
      {/* <Text fontSize="xl" fontWeight="bold" color="teal.600" mb={2}>
      Operating Hours
      </Text> */}

      {/* Operating Hours Grid */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
        {values.operatingHours.map((hour, index) => (
          <GridItem key={hour.day}>
            <VStack
              spacing={5}
              p={6}
              bg="gray.50"
              borderRadius="xl"
              border="1px solid"
              borderColor="gray.200"
              boxShadow="md"
              align="stretch"
              _hover={{ boxShadow: "xl", bg: "gray.100" }}
              transition="all 0.2s ease-in-out"
            >
              {/* Day & Closed Checkbox */}
              <HStack justify="space-between">
                <Text fontSize="lg" fontWeight="bold" color="gray.700">
                  {hour.day}
                </Text>
                <Checkbox
                  colorScheme="teal"
                  isChecked={values?.operatingHours[index].isClosed}
                  onChange={(e) =>
                    setFieldValue(
                      `operatingHours[${index}].isClosed`,
                      e.target.checked
                    )
                  }
                >
                  <Text fontSize="sm" color="gray.600">
                    Closed
                  </Text>
                </Checkbox>
              </HStack>

              <Divider borderColor="gray.300" />

              {/* Open & Close Time Fields */}
              <Flex gap={4} align="center">
                <CustomInput
                  label="Open"
                  name={`operatingHours[${index}].open`}
                  type="time"
                  value={values.operatingHours[index].open}
                  showError={showError}
                  error={errors.operatingHours?.[index]?.open}
                  onChange={(e) =>
                    setFieldValue(`operatingHours[${index}].open`, e.target.value)
                  }
                  disabled={values.operatingHours[index].isClosed}
                />
                <CustomInput
                  label="Close"
                  name={`operatingHours[${index}].close`}
                  type="time"
                  value={values.operatingHours[index].close}
                  showError={showError}
                  error={errors.operatingHours?.[index]?.close}
                  onChange={(e) =>
                    setFieldValue(`operatingHours[${index}].close`, e.target.value)
                  }
                  disabled={values.operatingHours[index].isClosed}
                />
              </Flex>
            </VStack>
          </GridItem>
        ))}
      </Grid>

      {/* Closed Dates Section */}
      <Box mt={8} p={6} bg="gray.50" borderRadius="xl" boxShadow="md">
        <CustomInput
          type="multi-dates"
          label="Closed Dates"
          name="closedDates"
          value={values.closedDates}
          onChange={(dates) => setFieldValue("closedDates", dates)}
          showError={showError}
          error={
            errors.closedDates && typeof errors.closedDates === "string"
              ? errors.closedDates
              : undefined
          }
        />
      </Box>
    </Box>
  );
};

export default OperatingHoursSection;
