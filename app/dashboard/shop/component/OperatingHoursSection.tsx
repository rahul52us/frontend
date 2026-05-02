import {
  Box,
  Checkbox,
  Flex,
  Grid,
  GridItem,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiClock } from "react-icons/fi";
import CustomInput from "../../../component/config/component/customInput/CustomInput";
import { MerchantSectionCard } from "./merchantTheme";

const OperatingHoursSection = ({ values, errors, setFieldValue, showError }) => {
  return (
    <MerchantSectionCard
      icon={FiClock}
      title="Operating Hours"
      description="Set your daily schedule and any days when the shop stays closed."
    >
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={5}>
        {values.operatingHours.map((hour, index) => (
          <GridItem key={hour.day}>
            <VStack
              spacing={5}
              p={5}
              bg="var(--dashboard-surface-alt)"
              borderRadius="20px"
              border="1px solid"
              borderColor="var(--dashboard-border-strong)"
              align="stretch"
            >
              <HStack justify="space-between" align="start">
                <Text fontSize="lg" fontWeight="700" color="var(--dashboard-text)">
                  {hour.day}
                </Text>
                <Checkbox
                  colorScheme="yellow"
                  isChecked={values?.operatingHours[index].isClosed}
                  onChange={(event) =>
                    setFieldValue(`operatingHours[${index}].isClosed`, event.target.checked)
                  }
                  sx={{
                    ".chakra-checkbox__control": {
                      bg: "var(--dashboard-checkbox-bg)",
                      borderColor: "var(--dashboard-checkbox-border)",
                    },
                    ".chakra-checkbox__control[data-checked]": {
                      bg: "var(--dashboard-checkbox-active-bg)",
                      borderColor: "var(--dashboard-accent)",
                    },
                    ".chakra-checkbox__label": {
                      color: "var(--dashboard-text-muted)",
                      fontSize: "sm",
                    },
                  }}
                >
                  Closed
                </Checkbox>
              </HStack>

              <Box borderTop="1px solid" borderColor="var(--dashboard-border)" />

              <Flex gap={4} align="center" direction={{ base: "column", md: "row" }}>
                <CustomInput
                  label="Open"
                  name={`operatingHours[${index}].open`}
                  type="time"
                  value={values.operatingHours[index].open}
                  showError={showError}
                  error={errors.operatingHours?.[index]?.open}
                  onChange={(event) =>
                    setFieldValue(`operatingHours[${index}].open`, event.target.value)
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
                  onChange={(event) =>
                    setFieldValue(`operatingHours[${index}].close`, event.target.value)
                  }
                  disabled={values.operatingHours[index].isClosed}
                />
              </Flex>
            </VStack>
          </GridItem>
        ))}
      </Grid>

      <Box mt={8}>
        <CustomInput
          type="multi-dates"
          label="Closed Dates"
          name="closedDates"
          value={values.closedDates}
          onChange={(dates) => setFieldValue("closedDates", dates)}
          showError={showError}
          error={typeof errors.closedDates === "string" ? errors.closedDates : undefined}
        />
      </Box>
    </MerchantSectionCard>
  );
};

export default OperatingHoursSection;
