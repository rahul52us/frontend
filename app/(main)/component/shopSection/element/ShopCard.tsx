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
  };
  onClick?: () => void;
}

const MotionBox = motion(Box);

const ShopCard: React.FC<ShopCardProps> = ({ shop }) => {
  const router = useRouter();
  const shopSlug = shop.name?.replace(/\s+/g, "-").toLowerCase();

  const handleNavigate = () => {
    router.push(`/${shopSlug}`);
  };

  return (
    <MotionBox
      w="full"
      bg="white"
      borderRadius="3xl"
      overflow="hidden"
      boxShadow="0 4px 20px rgba(0, 0, 0, 0.05)"
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      whileHover={{ y: -8, boxShadow: "0 12px 30px rgba(0, 0, 0, 0.1)" }}
      whileTap={{ scale: 0.98 }}
      cursor="pointer"
      onClick={handleNavigate}
      border="1px solid"
      borderColor="gray.50"
      position="relative"
    >
      {/* Cover Image Section */}
      <Box position="relative" h={{ base: "160px", md: "200px" }} overflow="hidden">
        <Image
          src={shop?.coverImage?.url}
          alt={shop?.coverImage?.name}
          w="100%"
          h="100%"
          objectFit="cover"
          transition="transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)"
          _groupHover={{ transform: "scale(1.08)" }}
        />

        {/* Overlay for better text readability if needed */}
        <Box
          position="absolute"
          inset={0}
          bgGradient="linear(to-t, blackAlpha.400, transparent)"
          opacity={0.6}
        />

        {/* Status Badge - Glassmorphism */}
        <Badge
          position="absolute"
          top="16px"
          right="16px"
          bg="whiteAlpha.400"
          backdropFilter="blur(10px)"
          color="white"
          border="1px solid"
          borderColor="whiteAlpha.500"
          px={3}
          py={1.5}
          borderRadius="full"
          fontSize="xs"
          fontWeight="bold"
          textTransform="capitalize"
          letterSpacing="wider"
        >
          {shop?.shopStatus}
        </Badge>

        {/* Categories on Image */}
        <Flex position="absolute" bottom="16px" left="80px" gap={2}>
          {shop?.categories?.slice(0, 2).map((category, index) => (
            <Badge
              key={index}
              bg="blackAlpha.600"
              backdropFilter="blur(4px)"
              color="white"
              px={2.5}
              py={0.5}
              borderRadius="lg"
              fontSize="2xs"
              fontWeight="medium"
              textTransform="none"
            >
              {category}
            </Badge>
          ))}
        </Flex>
      </Box>

      {/* Info Section */}
      <VStack px={5} pt={8} pb={6} spacing={4} align="start" position="relative">
        {/* Logo Overlap */}
        <Box
          position="absolute"
          top="-40px"
          left="20px"
          boxSize="64px"
          borderRadius="2xl"
          bg="white"
          p={1}
          boxShadow="0 8px 16px rgba(0,0,0,0.1)"
          zIndex={2}
        >
          <Image
            src={shop?.logo?.url}
            alt={shop?.logo?.name}
            w="full"
            h="full"
            borderRadius="xl"
            objectFit="cover"
          />
        </Box>

        {/* Name and Location */}
        <Box w="full">
          <Text
            fontSize="xl"
            fontWeight="900"
            color="gray.800"
            noOfLines={1}
            mb={1}
            letterSpacing="tight"
          >
            {shop?.name}
          </Text>
          <HStack spacing={1.5} color="gray.500">
            <Icon as={FaMapMarkerAlt} boxSize={3} color="purple.500" />
            <Text fontSize="xs" fontWeight="bold">
              {`${shop?.location?.city}, ${shop?.location?.state}`}
            </Text>
          </HStack>
        </Box>

        {/* Description */}
        <Text fontSize="sm" color="gray.500" noOfLines={2} lineHeight="tall">
          {shop?.description || "Experience the best quality products at our shop. Visit us for an exclusive collection."}
        </Text>

        {/* Footer Actions */}
        <Flex justify="space-between" align="center" w="full" pt={2} borderTop="1px solid" borderColor="gray.50">
          <HStack spacing={4}>
            <HStack spacing={1} color="purple.600">
              <Icon as={FaPhoneAlt} boxSize={3} />
              <Text fontSize="xs" fontWeight="black">{shop?.contactInfo?.phone}</Text>
            </HStack>
          </HStack>

          <HStack spacing={1} color="gray.400" _hover={{ color: "purple.500" }} transition="all 0.2s">
            <Text fontSize="xs" fontWeight="bold">VISIT</Text>
            <Icon as={FaExternalLinkAlt} boxSize={2.5} />
          </HStack>
        </Flex>
      </VStack>
    </MotionBox>
  );
};

export default ShopCard;
