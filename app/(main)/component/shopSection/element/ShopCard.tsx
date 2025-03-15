"use client";
import {
  Box,
  Image,
  Text,
  Flex,
  Badge,
  Link,
  VStack,
  HStack,
  Tooltip,
} from "@chakra-ui/react";
import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

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
  onClick: () => void;
}

const ShopCard: React.FC<ShopCardProps> = ({ shop, onClick }) => {
  return (
    <Box
      maxW="340px"
      m={4}
      bg="white"
      borderRadius="xl"
      overflow="hidden"
      boxShadow="lg"
      transition="all 0.3s ease"
      _hover={{
        boxShadow: "xl",
        transform: "translateY(-8px)",
        cursor: "pointer",
      }}
      onClick={onClick}
      border="1px solid"
      borderColor="gray.200"
    >
      {/* Image Section */}
      <Box position="relative" h="180px">
        <Image
          src={shop?.coverImage?.url}
          alt={shop?.coverImage?.name}
          w="100%"
          h="100%"
          objectFit="cover"
          borderTopRadius="xl"
        />
        {/* Status Badge */}
        <Badge
          position="absolute"
          top={3}
          left={3}
          bg={shop.shopStatus === "active" ? "green.400" : "red.400"}
          color="white"
          px={3}
          py={1}
          fontSize="sm"
          borderRadius="full"
          fontWeight="bold"
        >
          {shop.shopStatus.charAt(0).toUpperCase() + shop.shopStatus.slice(1)}
        </Badge>
      </Box>

      {/* Content Section */}
      <VStack p={4} spacing={4} align="start">
        {/* Name and Logo */}
        <HStack spacing={3} w="full" align="center">
          <Image
            src={shop?.logo?.url}
            alt={shop?.logo?.name}
            boxSize="50px"
            borderRadius="full"
            border="2px solid"
            borderColor="amber.300"
            objectFit="contain"
          />
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="gray.800"
            noOfLines={1}
            flex="1"
            letterSpacing="wide"
          >
            {shop.name}
          </Text>
        </HStack>

        {/* Categories */}
        <Flex wrap="wrap" gap={2}>
          {shop.categories.slice(0, 3).map((category, index) => (
            <Badge
              key={index}
              bg="amber.100"
              color="amber.800"
              px={3}
              py={1}
              fontSize="sm"
              borderRadius="full"
              textTransform="capitalize"
              fontWeight="medium"
            >
              {category}
            </Badge>
          ))}
        </Flex>

        {/* Location */}
        <HStack spacing={2} color="gray.600" fontSize="sm">
          <Box as={FaMapMarkerAlt} color="amber.500" />
          <Text noOfLines={1}>
            {`${shop.location.city}, ${shop.location.state}`}
          </Text>
        </HStack>

        {/* Description */}
        <Text fontSize="sm" color="gray.600" noOfLines={2} fontStyle="italic">
          {shop.description}
        </Text>

        {/* Contact */}
        <HStack spacing={3} w="full">
          <Tooltip label="Call Shop" aria-label="Call Shop Tooltip">
            <Link
              href={`tel:${shop.contactInfo.phone}`}
              display="flex"
              alignItems="center"
              color="amber.600"
              fontWeight="medium"
              fontSize="sm"
              _hover={{ color: "amber.800" }}
            >
              <Box as={FaPhoneAlt} mr={2} />
              {shop.contactInfo.phone}
            </Link>
          </Tooltip>
        </HStack>
      </VStack>
    </Box>
  );
};

export default ShopCard;
