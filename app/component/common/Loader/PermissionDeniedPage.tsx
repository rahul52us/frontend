'use client'
import {
    Flex,
    Icon,
    Text,
    Button,
    VStack,
    useTheme,
    useColorMode,
    Box,
    Image,
  } from "@chakra-ui/react";
  import { FaExclamationTriangle, FaHome } from "react-icons/fa";
  import { useState } from "react";
  import { useRouter } from "next/router";
import { dashboard } from "../../../config/utils/routes";

  const PermissionDeniedPage = ({
    onClick,
    title = "Permission Denied", // Default title
    subTitle = "You do not have permission to access this page.", // Default subtitle
    btnText = "Go to Home", // Default button text
    show = true,
    children,
  }: {
    onClick?: () => void;
    title?: string;
    subTitle?: string;
    btnText?: string;
    show?: boolean;
    children?: React.ReactNode;
  }) => {
    const router = useRouter();
    const { colorMode } = useColorMode();
    const theme = useTheme();
    const isDarkMode = colorMode === "dark";

    const [imageError, setImageError] = useState(false);

    return show ? (
      <Flex
        direction="column"
        align="center"
        justify="center"
        height="85vh"
        textAlign="center"
      >
        <Box
          bg={isDarkMode ? theme.colors.gray[800] : theme.colors.white}
          maxW="xl"
          w="full"
          p={6}
        >
          {!imageError && (
            <Image
              src="https://img.freepik.com/premium-vector/login-access-denied-vector-illustration-system-refuses-password-error-entry-computer-device-showing-user-does-have-permission-website-mobile-development_2175-1262.jpg"
              alt="Access Denied"
              borderRadius="lg"
              mb={6}
              maxW="100%"
              onError={() => setImageError(true)}
            />
          )}

          <Icon
            as={FaExclamationTriangle}
            boxSize={{ base: 12, md: 12 }}
            color={isDarkMode ? theme.colors.orange[300] : theme.colors.orange[500]}
            mb={4}
          />

          <VStack spacing={4}>
            <Text
              fontSize={{ base: "2xl", md: "3xl" }}
              color={isDarkMode ? theme.colors.gray[200] : theme.colors.gray[800]}
              fontWeight="bold"
            >
              {title}
            </Text>

            <Text
              fontSize={{ base: "md", md: "lg" }}
              color={isDarkMode ? theme.colors.gray[400] : theme.colors.gray[600]}
              px={4}
            >
              {subTitle}
            </Text>

            <Button
              leftIcon={<FaHome />}
              colorScheme="teal"
              variant="solid"
              onClick={() => {
                if (onClick) {
                  onClick();
                } else {
                  router.push(dashboard.home);
                }
              }}
              size="lg"
              borderRadius="full"
              _hover={{
                bg: isDarkMode ? theme.colors.teal[500] : theme.colors.teal[600],
              }}
              _active={{
                bg: isDarkMode ? theme.colors.teal[600] : theme.colors.teal[700],
              }}
            >
              {btnText}
            </Button>
          </VStack>
        </Box>
      </Flex>
    ) : (
      children
    );
  };

  export default PermissionDeniedPage;