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
  Icon,
  Circle,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiClock } from "react-icons/fi";
import CustomInput from "../../../component/config/component/customInput/CustomInput";

// Reusable section layout
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

const OperatingHoursSection = ({ values, errors, setFieldValue, showError }) => {
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const hoverBg = useColorModeValue("gray.100", "gray.600");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.700", "gray.100");

  return (
    <SectionCard
      icon={FiClock}
      title="Operating Hours"
      description="Set your shop’s daily schedule and any closed days"
    >
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
        {values.operatingHours.map((hour, index) => (
          <GridItem key={hour.day}>
            <VStack
              spacing={5}
              p={6}
              bg={bgColor}
              borderRadius="xl"
              border="1px solid"
              borderColor={borderColor}
              boxShadow="md"
              align="stretch"
              _hover={{
                boxShadow: "xl",
                bg: hoverBg,
              }}
              transition="all 0.2s ease-in-out"
            >
              <HStack justify="space-between">
                <Text fontSize="lg" fontWeight="bold" color={textColor}>
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

      <Box mt={8}>
        <CustomInput
          type="multi-dates"
          label="Closed Dates"
          name="closedDates"
          value={values.closedDates}
          onChange={(dates) => setFieldValue("closedDates", dates)}
          showError={showError}
          error={
            typeof errors.closedDates === "string" ? errors.closedDates : undefined
          }
        />
      </Box>
    </SectionCard>
  );
};

export default OperatingHoursSection;