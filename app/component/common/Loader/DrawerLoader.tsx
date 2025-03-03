import { Center, Flex, Box, Text, Icon } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { FaExclamationTriangle } from "react-icons/fa";
import SpinnerLoader from "./SpinnerLoader";

const DrawerLoader = observer(
  ({
    loading,
    children,
    noRecordFoundText = false,
    height = "25vh"
  }: {
    loading?: boolean;
    children: React.ReactNode;
    noRecordFoundText?: boolean;
    height?: string;
  }) => {
    return (
      <>
        {loading ? (
          <Center height="100%">
            <Flex alignItems="center" justifyContent="center">
              <Box p={4} mt={'40vh'}>
                <SpinnerLoader />
              </Box>
            </Flex>
          </Center>
        ) : noRecordFoundText ? (
          <Center height="100%">
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
            >
              <Box
                p={8}
                mt={height}
                borderRadius="md"
              >
                <Icon as={FaExclamationTriangle} w={12} h={12} color="red.400" />
                <Text mt={4} fontSize="xl" fontWeight="bold" color="gray.700">
                  No Records Found
                </Text>
                <Text mt={2} fontSize="md" color="gray.500">
                  Please try again later or contact support if the issue persists.
                </Text>
              </Box>
            </Flex>
          </Center>
        ) : (
          <>{children}</>
        )}
      </>
    );
  }
);

export default DrawerLoader;
