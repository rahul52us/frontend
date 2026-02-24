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
import { FaMapMarkerAlt, FaPhoneAlt, FaExternalLinkAlt } from "react-icons/fa";

interface ShopCardProps {
  shop: {
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
  const cardBg = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.100", "whiteAlpha.100");
  const distanceKm =
    typeof shop?.distanceKm === "number"
      ? shop.distanceKm
      : typeof shop?.distanceMeters === "number"
      ? Number((shop.distanceMeters / 1000).toFixed(2))
      : null;

  const handleNavigate = () => {
    router.push(`/${shopSlug}`);
  };

  return (
    <MotionBox
      w="full"
      bg={cardBg}
      borderRadius="24px"
      overflow="hidden"
      border="1px solid"
      borderColor={borderColor}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      whileHover={{
        y: -10,
        shadow: "0 22px 35px -16px rgba(0, 0, 0, 0.12)"
      }}
      whileTap={{ scale: 0.98 }}
      cursor="pointer"
      onClick={handleNavigate}
      role="group"
    >
      {/* Visual Header */}
      <Box position="relative" h="200px" overflow="hidden">
        <Image
          src={shop?.coverImage?.url}
          alt={shop?.coverImage?.name}
          w="100%"
          h="100%"
          objectFit="cover"
          transition="transform 0.8s ease-out"
          _groupHover={{ transform: "scale(1.1)" }}
        />
        <Box
          position="absolute"
          inset={0}
          bgGradient="linear(to-t, blackAlpha.600, transparent)"
          opacity={0.4}
        />

        {/* Status Label */}
        <Badge
          position="absolute"
          top="16px"
          right="16px"
          bg="white"
          color="gray.900"
          px={3}
          py={1}
          borderRadius="full"
          fontSize="10px"
          fontWeight="800"
          textTransform="uppercase"
          letterSpacing="wider"
        >
          {shop?.shopStatus}
        </Badge>
      </Box>

      {/* Boutique Info */}
      <VStack p={6} spacing={4} align="start" position="relative" mt={-10}>
        {/* Rounded Logo */}
        <Box
          boxSize="72px"
          borderRadius="20px"
          bg="white"
          p={1}
          shadow="lg"
          border="1px solid"
          borderColor="gray.100"
          zIndex={2}
        >
          <Image
            src={shop?.logo?.url}
            alt={shop?.logo?.name}
            w="full"
            h="full"
            borderRadius="18px"
            objectFit="cover"
          />
        </Box>

        <Box w="full">
          <Text
            fontSize="xl"
            fontWeight="800"
            color={useColorModeValue("gray.900", "white")}
            noOfLines={1}
            mb={1}
            letterSpacing="tight"
          >
            {shop?.name}
          </Text>
          <HStack spacing={1} color="gray.500">
            <Icon as={FaMapMarkerAlt} boxSize={3} color="purple.500" />
            <Text fontSize="xs" fontWeight="700">
              {(shop?.location?.city || 'Local').toUpperCase()}
            </Text>
            {distanceKm !== null && (
              <Text fontSize="xs" fontWeight="700" color="green.600">
                • {distanceKm} KM
              </Text>
            )}
          </HStack>
        </Box>

        <Text fontSize="sm" color="gray.500" noOfLines={2} lineHeight="tall" fontWeight="500">
          {shop?.description || "Curating exceptional products and experiences for our local neighborhood community."}
        </Text>

        <Flex justify="space-between" align="center" w="full" pt={4} borderTop="1px solid" borderColor="gray.50">
          <HStack spacing={1} color="purple.500">
            <Icon as={FaPhoneAlt} boxSize={2.5} />
            <Text fontSize="12px" fontWeight="800">{shop?.contactInfo?.phone}</Text>
          </HStack>

          <HStack spacing={1} color="gray.400" _groupHover={{ color: "purple.500" }} transition="all 0.2s">
            <Text fontSize="10px" fontWeight="900" letterSpacing="0.1em">VIEW MORE</Text>
            <Icon as={FaExternalLinkAlt} boxSize={2.5} />
          </HStack>
        </Flex>
      </VStack>
    </MotionBox>
  );
};

export default ShopCard;
