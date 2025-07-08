import React from "react";
import {
  Box,
  VStack,
  Text,
  SimpleGrid,
  Flex,
  Icon,
  useColorModeValue,
  Circle,
} from "@chakra-ui/react";
import { FiMapPin } from "react-icons/fi";
import CustomInput from "../../../component/config/component/customInput/CustomInput";

// SectionCard reused from ShopDetailsSection
const SectionCard = ({ title, description, children }) => {
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
          <Icon as={FiMapPin} color="blue.600" boxSize={5} />
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

const MainLocationSection = ({ values, errors, setFieldValue, showError }) => {
  const location = values.location || {};
  const locationErrors = errors.location || {};
  const coordinates = location.coordinates || ["", ""];
  const coordinatesErrors = locationErrors.coordinates || [];

  return (
    <VStack spacing={8} align="stretch">
      <SectionCard
        // icon={FiMapPin}
        title="Main Location"
        description="Add the address and geo-coordinates of your shop"
      >
        <VStack spacing={6} align="stretch">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <CustomInput
              showError={showError}
              label="Address"
              name="location.address"
              required
              error={locationErrors.address}
              value={location.address || ""}
              onChange={(e) => setFieldValue("location.address", e.target.value)}
            />
            <CustomInput
              showError={showError}
              label="City"
              name="location.city"
              required
              error={locationErrors.city}
              value={location.city || ""}
              onChange={(e) => setFieldValue("location.city", e.target.value)}
            />
            <CustomInput
              showError={showError}
              label="State"
              name="location.state"
              required
              error={locationErrors.state}
              value={location.state || ""}
              onChange={(e) => setFieldValue("location.state", e.target.value)}
            />
            <CustomInput
              showError={showError}
              label="Postal Code"
              name="location.postalCode"
              required
              error={locationErrors.postalCode}
              value={location.postalCode || ""}
              onChange={(e) =>
                setFieldValue("location.postalCode", e.target.value)
              }
            />
            <CustomInput
              showError={showError}
              label="Country"
              name="location.country"
              required
              error={locationErrors.country}
              value={location.country || ""}
              onChange={(e) => setFieldValue("location.country", e.target.value)}
            />
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
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
          </SimpleGrid>
        </VStack>
      </SectionCard>
    </VStack>
  );
};

export default MainLocationSection;
