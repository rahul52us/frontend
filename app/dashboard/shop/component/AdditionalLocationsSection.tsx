import React from "react";
import {
  Box,
  VStack,
  Button,
  IconButton,
  Grid,
  GridItem,
  HStack,
  Text,
  Flex,
  useColorModeValue,
  Circle,
  Icon,
} from "@chakra-ui/react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { FieldArray } from "formik";
import CustomInput from "../../../component/config/component/customInput/CustomInput";

// Shared SectionCard wrapper
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

const AdditionalLocationsSection = ({ values, errors, setFieldValue, showError }) => (
  <SectionCard
    icon={FiMapPin}
    title="Additional Locations"
    description="Add multiple branches or delivery points"
  >
    <FieldArray name="multipleLocations">
      {({ push, remove }) => (
        <VStack spacing={6} align="stretch">
          {values.multipleLocations && values.multipleLocations.length > 0 && values.multipleLocations.map((location, index) => (
            <Box
              key={index}
              p={4}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              bg="gray.50"
            >
              <HStack justify="space-between" mb={4}>
                <Text fontSize="lg" fontWeight="semibold" color="teal.500">
                  Location {index + 1}
                </Text>
                <IconButton
                  aria-label="Remove Location"
                  icon={<FaMinus />}
                  size="sm"
                  colorScheme="red"
                  variant="outline"
                  onClick={() => remove(index)}
                />
              </HStack>
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
                <GridItem>
                  <CustomInput
                    showError={showError}
                    label="Address"
                    name={`multipleLocations[${index}].address`}
                    required
                    error={errors.multipleLocations?.[index]?.address}
                    value={location.address}
                    onChange={(e) =>
                      setFieldValue(`multipleLocations[${index}].address`, e.target.value)
                    }
                  />
                </GridItem>
                <GridItem>
                  <CustomInput
                    showError={showError}
                    label="City"
                    name={`multipleLocations[${index}].city`}
                    required
                    error={errors.multipleLocations?.[index]?.city}
                    value={location.city}
                    onChange={(e) =>
                      setFieldValue(`multipleLocations[${index}].city`, e.target.value)
                    }
                  />
                </GridItem>
                <GridItem>
                  <CustomInput
                    showError={showError}
                    label="State"
                    name={`multipleLocations[${index}].state`}
                    required
                    error={errors.multipleLocations?.[index]?.state}
                    value={location.state}
                    onChange={(e) =>
                      setFieldValue(`multipleLocations[${index}].state`, e.target.value)
                    }
                  />
                </GridItem>
                <GridItem>
                  <CustomInput
                    showError={showError}
                    label="Postal Code"
                    name={`multipleLocations[${index}].postalCode`}
                    required
                    error={errors.multipleLocations?.[index]?.postalCode}
                    value={location.postalCode}
                    onChange={(e) =>
                      setFieldValue(`multipleLocations[${index}].postalCode`, e.target.value)
                    }
                  />
                </GridItem>
                <GridItem>
                  <CustomInput
                    showError={showError}
                    label="Country"
                    name={`multipleLocations[${index}].country`}
                    required
                    error={errors.multipleLocations?.[index]?.country}
                    value={location.country}
                    onChange={(e) =>
                      setFieldValue(`multipleLocations[${index}].country`, e.target.value)
                    }
                  />
                </GridItem>
                <GridItem>
                  <CustomInput
                    showError={showError}
                    label="Longitude"
                    name={`multipleLocations[${index}].coordinates[0]`}
                    required
                    error={errors.multipleLocations?.[index]?.coordinates?.[0]}
                    value={location.coordinates[0]}
                    onChange={(e) =>
                      setFieldValue(`multipleLocations[${index}].coordinates[0]`, e.target.value)
                    }
                  />
                </GridItem>
                <GridItem>
                  <CustomInput
                    showError={showError}
                    label="Latitude"
                    name={`multipleLocations[${index}].coordinates[1]`}
                    required
                    error={errors.multipleLocations?.[index]?.coordinates?.[1]}
                    value={location.coordinates[1]}
                    onChange={(e) =>
                      setFieldValue(`multipleLocations[${index}].coordinates[1]`, e.target.value)
                    }
                  />
                </GridItem>
              </Grid>
            </Box>
          ))}
          <Button
            leftIcon={<FaPlus />}
            colorScheme="teal"
            variant="outline"
            size="md"
            w="fit-content"
            onClick={() =>
              push({
                address: "",
                city: "",
                state: "",
                postalCode: "",
                country: "",
                coordinates: [0, 0],
              })
            }
          >
            Add Location
          </Button>
        </VStack>
      )}
    </FieldArray>
  </SectionCard>
);

export default AdditionalLocationsSection;
