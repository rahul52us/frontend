"use client";

import {
  Box,
  Text,
  Button,
  VStack,
  HStack,
  useColorModeValue,
  Flex,
  Image,
} from "@chakra-ui/react";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import ShopPage from "./component/ShopPage/ShopPage";
import { useSearchParams, useRouter } from "next/navigation";
import stores from "../../store/stores";
import ShopLayoutSkeletan from "./component/ShopPage/ShopLayoutSkeletan";
import { keyframes } from "@emotion/react";
import { authentication } from "../../config/utils/routes";

const DEFAULT_RATINGS = {
  average: 4.8,
  total: 256,
};

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 192, 203, 0.5); }
  50% { box-shadow: 0 0 15px rgba(255, 192, 203, 0.8); }
  100% { box-shadow: 0 0 5px rgba(255, 192, 203, 0.5); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ACCENT_COLOR = "pink.300";

const ShopTitleContent = memo(
  observer(() => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [shopData, setShopData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const searchParams = useSearchParams();
    const shopTitle = searchParams.get("title");
    const {
      shopStore: { getSingleShop },
    } = stores;

    useEffect(() => {
      let isMounted = true;

      if (!shopTitle) {
        setLoading(false);
        setError("Shop title is required");
        return;
      }

      const fetchShopData = async () => {
        setLoading(true);
        setError(null);

        try {
          const formattedTitle = Array.isArray(shopTitle)
            ? shopTitle.join(" ")
            : shopTitle.replace(/-/g, " ");

          const data = await getSingleShop({ title: formattedTitle });
          if (!isMounted) return;

          if (!data?.data) {
            setError("Shop not found");
          } else {
            setShopData(data.data);
          }
        } catch {
          if (isMounted) {
            setError("Something went wrong. Please try again.");
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };

      fetchShopData();

      return () => {
        isMounted = false;
      };
    }, [shopTitle, getSingleShop]);

    const bgColor = useColorModeValue("yellow.50", "gray.700");
    const textColor = useColorModeValue("brown.700", "brown.200");

    const handleGoBack = useCallback(() => {
      window.history.back();
    }, []);

    const handleStartShop = useCallback(() => {
      router.push(authentication.register);
    }, [router]);

    const handleReload = useCallback(() => {
      window.location.reload();
    }, []);

    const fullShopData = useMemo(() => {
      if (!shopData) return null;
      return {
        ...shopData,
        ratings: shopData.ratings || DEFAULT_RATINGS,
      };
    }, [shopData]);

    if (loading) {
      return <ShopLayoutSkeletan />;
    }

    if (error) {
      return (
        <Flex bg={bgColor} justify="center" p={{ md: 8, sm: 5 }}>
          <Flex
            direction="column"
            bg="white"
            borderRadius="3xl"
            border="3px solid"
            borderColor="brown.300"
            p={{ base: 6, md: 10 }}
            animation={`${fadeIn} 1s ease-out, ${glow} 3s infinite`}
            boxShadow="lg"
            maxW="lg"
            w="full"
          >
            <Text
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="bold"
              color={textColor}
              fontFamily="heading"
              textAlign="center"
              mb={4}
            >
              The Lost Story
            </Text>

            <Box position="relative" mx="auto" maxW="320px" mb={6}>
              <Box
                position="absolute"
                top="-10px"
                left="-10px"
                w="calc(100% + 20px)"
                h="calc(100% + 20px)"
                bg="rgba(255, 192, 203, 0.3)"
                borderRadius="xl"
                zIndex={-1}
              />
              <Image
                src="https://cdni.iconscout.com/illustration/premium/thumb/404-not-found-illustration-download-in-svg-png-gif-file-formats--error-message-no-result-evening-cityscapes-pack-art-abstract-illustrations-8703544.png?f=webp"
                alt="Lost Story"
                borderRadius="xl"
                border="4px solid"
                borderColor="brown.300"
                boxShadow="md"
                w="100%"
                loading="lazy"
                decoding="async"
              />
            </Box>

            <Text
              fontSize="md"
              color="gray.600"
              fontFamily="body"
              textAlign="center"
              mb={6}
            >
              Oops! This shop’s story got lost in a magical forest. You can look
              for it again or start your own adventure!
            </Text>

            <HStack justify="center" spacing={4} mb={4} flexWrap="wrap">
              <Button
                bg={ACCENT_COLOR}
                color="white"
                size="md"
                borderRadius="full"
                border="2px solid"
                borderColor="brown.400"
                _hover={{ bg: "pink.400", transform: "scale(1.05)" }}
                transition="all 0.3s ease"
                onClick={handleGoBack}
              >
                Try Again
              </Button>
              <Button
                as="a"
                href="/shops"
                bg="teal.400"
                color="white"
                size="md"
                borderRadius="full"
                border="2px solid"
                borderColor="brown.400"
                _hover={{ bg: "teal.500", transform: "scale(1.05)" }}
                transition="all 0.3s ease"
              >
                Explore More
              </Button>
            </HStack>

            <Text
              fontSize="sm"
              color={textColor}
              fontFamily="heading"
              fontStyle="italic"
              textAlign="center"
              mb={2}
            >
              Want to make your own magic? Open a shop and share your story!
            </Text>
            <Button
              onClick={handleStartShop}
              variant="outline"
              size="sm"
              px={6}
              borderColor={ACCENT_COLOR}
              color={ACCENT_COLOR}
              fontFamily="body"
              _hover={{ bg: "pink.50", transform: "scale(1.05)" }}
              transition="all 0.3s ease"
              alignSelf="center"
              mt={2}
            >
              Start Your Shop
            </Button>
          </Flex>
        </Flex>
      );
    }

    return (
      <Box minH="100vh">
        {fullShopData ? (
          <ShopPage shopData={fullShopData} />
        ) : (
          <Flex
            align="center"
            justify="center"
            px={4}
            py={12}
            minH="100vh"
            direction="column"
          >
            <VStack
              spacing={6}
              bg="white"
              borderRadius="3xl"
              border="3px solid"
              borderColor="brown.300"
              p={{ base: 6, md: 10 }}
              animation={`${fadeIn} 1s ease-out, ${glow} 3s infinite`}
              boxShadow="lg"
              maxW="lg"
              w="full"
            >
              <Text
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="bold"
                color={textColor}
                fontFamily="heading"
                textAlign="center"
              >
                A New Story Begins
              </Text>

              <Box position="relative" mx="auto" maxW="280px">
                <Box
                  position="absolute"
                  top="-10px"
                  left="-10px"
                  w="calc(100% + 20px)"
                  h="calc(100% + 20px)"
                  bg="rgba(255, 192, 203, 0.3)"
                  borderRadius="xl"
                  zIndex={-1}
                />
                <Image
                  src="https://static.vecteezy.com/system/resources/previews/002/198/589/non_2x/detective-investigating-with-magnifying-glass-free-vector.jpg"
                  alt="New Story"
                  borderRadius="xl"
                  border="4px solid"
                  borderColor="brown.300"
                  boxShadow="md"
                  w="100%"
                  loading="lazy"
                  decoding="async"
                />
              </Box>

              <Text
                fontSize="md"
                color="gray.600"
                fontFamily="body"
                textAlign="center"
              >
                This shop hasn’t started yet. It’s waiting for its magic moment.
                Check back soon or create your own shop!
              </Text>

              <Button
                bg={ACCENT_COLOR}
                color="white"
                size="md"
                borderRadius="full"
                border="2px solid"
                borderColor="brown.400"
                _hover={{ bg: "pink.400", transform: "scale(1.05)" }}
                transition="all 0.3s ease"
                onClick={handleReload}
              >
                Check Again
              </Button>

              <Text
                fontSize="sm"
                color={textColor}
                fontFamily="heading"
                fontStyle="italic"
                textAlign="center"
              >
                Want to make your own magic? Open a shop and share your story!
              </Text>

              <Button
                onClick={handleStartShop}
                variant="outline"
                size="sm"
                px={6}
                borderColor={ACCENT_COLOR}
                color={ACCENT_COLOR}
                fontFamily="body"
                _hover={{ bg: "pink.50", transform: "scale(1.05)" }}
                transition="all 0.3s ease"
              >
                Start Your Shop
              </Button>
            </VStack>
          </Flex>
        )}
      </Box>
    );
  })
);

ShopTitleContent.displayName = "ShopTitleContent";

export default function ShopTitleClientPage() {
  return <ShopTitleContent />;
}
