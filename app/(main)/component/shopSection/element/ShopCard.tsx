"use client";

import {
  Box,
  Image,
  Text,
  Flex,
  Badge,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";

interface ShopCardProps {
  shop: {
    _id?: string;
    name: string;
    description: string;
    location: {
      address: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    contactInfo: {
      phone: string;
      email: string;
      website: string;
      socialMedia: {
        facebook: string;
        instagram: string;
        twitter: string;
        linkedin: string;
        youtube: string;
      };
    };
    logo: {
      url: string;
      name: string;
    };
    coverImage: {
      url: string;
      name: string;
    };
    operatingHours: {
      monday: string;
      tuesday: string;
      wednesday: string;
      thursday: string;
      friday: string;
      saturday: string;
      sunday: string;
    };
    isActive: boolean;
    shopStatus: string;
    categories: string[];
    distanceMeters?: number;
    distanceKm?: number;
  };
}

const MotionBox = motion(Box);

const ShopCard: React.FC<ShopCardProps> = ({ shop }) => {
  const router = useRouter();

  const shopSlug = shop.name?.replace(/\s+/g, "-").toLowerCase();

  const cardBg = useColorModeValue("white", "#0f0f12");
  const borderColor = useColorModeValue(
    "rgba(0,0,0,0.06)",
    "rgba(255,255,255,0.08)"
  );

  const titleColor = useColorModeValue("gray.900", "white");
  const mutedText = useColorModeValue("gray.600", "gray.400");

  const distanceKm =
    typeof shop?.distanceKm === "number"
      ? shop.distanceKm
      : typeof shop?.distanceMeters === "number"
      ? Number((shop.distanceMeters / 1000).toFixed(2))
      : null;

  const handleNavigate = () => {
    if (shop?._id) {
      router.push(`/shop?id=${shop._id}&slug=${shopSlug}`);
      return;
    }

    router.push(`/shop-details?title=${shopSlug}`);
  };

  return (
    <MotionBox
      w="full"
      position="relative"
      overflow="hidden"
      bg={cardBg}
      borderRadius={{
        base: "26px",
        md: "30px",
      }}
      border="1px solid"
      borderColor={borderColor}
      cursor="pointer"
      role="group"
      onClick={handleNavigate}
      backdropFilter="blur(18px)"
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 22,
      }}
      whileHover={{
        y: -8,
        scale: 1.01,
      }}
      whileTap={{
        scale: 0.985,
      }}
      boxShadow={{
        base: "0 10px 30px rgba(0,0,0,0.08)",
        md: "0 18px 45px rgba(0,0,0,0.10)",
      }}
      _hover={{
        boxShadow: "0 30px 60px rgba(124, 58, 237, 0.18)",
      }}
    >
      {/* Glow Effect */}
      <Box
        position="absolute"
        top="-80px"
        right="-80px"
        w="180px"
        h="180px"
        bg="purple.500"
        opacity={0.12}
        filter="blur(80px)"
        zIndex={0}
        transition="0.4s ease"
        _groupHover={{
          opacity: 0.18,
          transform: "scale(1.1)",
        }}
      />

      {/* Cover */}
      <Box
        position="relative"
        h={{
          base: "190px",
          sm: "220px",
          md: "240px",
        }}
        overflow="hidden"
      >
        <Image
          src={shop?.coverImage?.url}
          alt={shop?.coverImage?.name}
          w="100%"
          h="100%"
          objectFit="cover"
          transition="transform 0.9s ease"
          _groupHover={{
            transform: "scale(1.08)",
          }}
        />

        {/* Gradient Overlay */}
        <Box
          position="absolute"
          inset={0}
          bgGradient="linear(to-t, blackAlpha.800, transparent, transparent)"
        />

        {/* Top Status */}
        <Badge
          position="absolute"
          top={{
            base: "14px",
            md: "18px",
          }}
          right={{
            base: "14px",
            md: "18px",
          }}
          px={4}
          py={1.5}
          borderRadius="full"
          bg="rgba(255,255,255,0.9)"
          color="gray.900"
          backdropFilter="blur(10px)"
          fontSize="10px"
          fontWeight="900"
          letterSpacing="0.14em"
          textTransform="uppercase"
          shadow="lg"
        >
          {shop?.shopStatus}
        </Badge>

        {/* Bottom Floating Info */}
        <Flex
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          p={{
            base: 4,
            md: 5,
          }}
          justify="space-between"
          align="flex-end"
        >
          {/* Logo */}
          <Box
            boxSize={{
              base: "68px",
              md: "82px",
            }}
            borderRadius={{
              base: "22px",
              md: "26px",
            }}
            overflow="hidden"
            bg="white"
            p="4px"
            border="1px solid rgba(255,255,255,0.3)"
            backdropFilter="blur(16px)"
            boxShadow="0 14px 35px rgba(0,0,0,0.18)"
            transition="0.35s ease"
            _groupHover={{
              transform: "translateY(-4px) rotate(-2deg)",
            }}
          >
            <Image
              src={shop?.logo?.url}
              alt={shop?.logo?.name}
              w="100%"
              h="100%"
              objectFit="cover"
              borderRadius={{
                base: "18px",
                md: "22px",
              }}
            />
          </Box>

          {/* Distance */}
          {distanceKm !== null && (
            <Flex
              align="center"
              gap={2}
              px={4}
              py={2}
              borderRadius="full"
              bg="rgba(255,255,255,0.12)"
              color="white"
              backdropFilter="blur(16px)"
              border="1px solid rgba(255,255,255,0.15)"
            >
              <Icon as={FaMapMarkerAlt} boxSize={3} color="green.300" />
              <Text
                fontSize="xs"
                fontWeight="800"
                letterSpacing="0.04em"
              >
                {distanceKm} KM AWAY
              </Text>
            </Flex>
          )}
        </Flex>
      </Box>

      {/* Content */}
      <VStack
        align="start"
        spacing={5}
        p={{
          base: 5,
          md: 6,
        }}
        position="relative"
        zIndex={1}
      >
        {/* Title */}
        <Box w="full">
          <Text
            fontSize={{
              base: "xl",
              md: "2xl",
            }}
            fontWeight="900"
            color={titleColor}
            lineHeight="1.1"
            noOfLines={1}
            letterSpacing="-0.03em"
          >
            {shop?.name}
          </Text>

          <HStack
            spacing={2}
            mt={2}
            flexWrap="wrap"
            color={mutedText}
          >
            <Flex align="center" gap={1.5}>
              <Icon
                as={FaMapMarkerAlt}
                boxSize={3}
                color="purple.400"
              />
              <Text
                fontSize="xs"
                fontWeight="800"
                textTransform="uppercase"
                letterSpacing="0.12em"
              >
                {(shop?.location?.city || "Local")}
              </Text>
            </Flex>

            {shop?.categories?.[0] && (
              <>
                <Box
                  w="4px"
                  h="4px"
                  bg="gray.400"
                  borderRadius="full"
                />
                <Text
                  fontSize="xs"
                  fontWeight="700"
                  color="purple.500"
                >
                  {shop.categories[0]}
                </Text>
              </>
            )}
          </HStack>
        </Box>

        {/* Description */}
        <Text
          fontSize={{
            base: "sm",
            md: "15px",
          }}
          color={mutedText}
          lineHeight="1.8"
          noOfLines={2}
          fontWeight="500"
        >
          {shop?.description ||
            "Curating exceptional products and experiences for the local neighborhood community."}
        </Text>

        {/* Footer */}
        <Flex
          w="full"
          justify="space-between"
          align="center"
          pt={4}
          borderTop="1px solid"
          borderColor={useColorModeValue(
            "blackAlpha.100",
            "whiteAlpha.100"
          )}
        >
          {/* Phone */}
          <HStack spacing={2}>
            <Flex
              align="center"
              justify="center"
              boxSize="34px"
              borderRadius="full"
              bg={useColorModeValue("purple.50", "whiteAlpha.100")}
              color="purple.500"
            >
              <Icon as={FaPhoneAlt} boxSize={3} />
            </Flex>

            <Text
              fontSize={{
                base: "11px",
                md: "12px",
              }}
              fontWeight="800"
              color={titleColor}
            >
              {shop?.contactInfo?.phone}
            </Text>
          </HStack>

          {/* CTA */}
          <HStack
            spacing={2}
            color="gray.400"
            transition="0.25s ease"
            _groupHover={{
              color: "purple.500",
              transform: "translateX(3px)",
            }}
          >
            <Text
              fontSize="10px"
              fontWeight="900"
              letterSpacing="0.16em"
            >
              VIEW MORE
            </Text>

            <Icon as={FaExternalLinkAlt} boxSize={2.5} />
          </HStack>
        </Flex>
      </VStack>
    </MotionBox>
  );
};

export default ShopCard;