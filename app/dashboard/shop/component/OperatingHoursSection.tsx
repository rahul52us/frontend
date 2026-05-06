import React from "react";
import {
  Box,
  Checkbox,
  Flex,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiClock } from "react-icons/fi";
import CustomInput from "../../../component/config/component/customInput/CustomInput";
import {
  MerchantSectionCard,
  MerchantTextField,
  useMerchantTone,
} from "./merchantTheme";

const OperatingHoursSection = ({ values, errors, setFieldValue, showError }) => {
  const tone = useMerchantTone("amber");

  return (
    <MerchantSectionCard
      icon={FiClock}
      title="Operating Hours"
      description="Set when you're open, and mark days off when the shop stays closed."
      tint="amber"
    >
      <VStack spacing={3} align="stretch">
        {values.operatingHours.map((hour, index) => (
          <Box
            key={hour.day}
            border="1px solid"
            borderColor={hour.isClosed ? "var(--dashboard-border)" : tone.border}
            borderRadius="22px"
            px={{ base: 4, md: 5 }}
            py={{ base: 4, md: 5 }}
            bg={hour.isClosed ? "var(--dashboard-surface-alt)" : tone.soft}
          >
            <VStack spacing={4} align="stretch">
              <Flex
                justify="space-between"
                align={{ base: "start", md: "center" }}
                direction={{ base: "column", md: "row" }}
                gap={3}
              >
                <HStack spacing={3}>
                  <Box
                    h="10px"
                    w="10px"
                    borderRadius="full"
                    bg={hour.isClosed ? "var(--dashboard-text-soft)" : "var(--dashboard-success)"}
                  />
                  <Text fontSize="md" fontWeight="700" color="var(--dashboard-text)">
                    {hour.day}
                  </Text>
                </HStack>

                <Checkbox
                  isChecked={values?.operatingHours[index].isClosed}
                  onChange={(event) =>
                    setFieldValue(`operatingHours[${index}].isClosed`, event.target.checked)
                  }
                >
                  Closed
                </Checkbox>
              </Flex>

              <Flex
                gap={3}
                align="center"
                direction={{ base: "column", sm: "row" }}
                opacity={hour.isClosed ? 0.5 : 1}
                pointerEvents={hour.isClosed ? "none" : "auto"}
              >
                <Box flex={1} w="full">
                  <MerchantTextField
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
                </Box>
                <Text fontSize="sm" fontWeight="600" color="var(--dashboard-text-soft)">
                  to
                </Text>
                <Box flex={1} w="full">
                  <MerchantTextField
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
                </Box>
              </Flex>
            </VStack>
          </Box>
        ))}

        <Box pt={2}>
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
      </VStack>
    </MerchantSectionCard>
  );
};

export default OperatingHoursSection;
