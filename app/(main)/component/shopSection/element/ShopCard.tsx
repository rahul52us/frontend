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
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  return (
    <Box
      maxW="100%"
      bg="white"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
      transition="transform 0.3s ease, box-shadow 0.3s ease"
      _hover={{
        boxShadow: "xl",
        transform: "scale(1.03)",
      }}
      onClick={onClick}
      border="1px solid"
      borderColor="gray.200"
    >
      {/* Cover Image */}
      <Box position="relative" h="180px">
        <Image
          src={shop?.coverImage?.url}
          alt={shop?.coverImage?.name}
          w="100%"
          h="100%"
          objectFit="cover"
        />
        {/* Status Badge */}
        <Badge
          position="absolute"
          top="10px"
          right="10px"
          colorScheme={shop.shopStatus === "active" ? "green" : "red"}
          px={3}
          py={1}
          borderRadius="full"
          fontSize="xs"
        >
          {shop.shopStatus.charAt(0).toUpperCase() + shop.shopStatus.slice(1)}
        </Badge>
      </Box>

      {/* Content */}
      <VStack p={4} spacing={3} align="start">
        {/* Shop Name & Logo */}
        <HStack w="full" align="center">
          <Image
            src={shop?.logo?.url}
            alt={shop?.logo?.name}
            boxSize="45px"
            borderRadius="full"
            border="2px solid teal"
            objectFit="contain"
          />
          <Text
            fontSize="lg"
            fontWeight="bold"
            color="gray.800"
            cursor="pointer"
            _hover={{ color: "teal.600" }}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/${shop.name?.replace(/\s+/g, "-").toLowerCase()}`);
            }}
          >
            {shop.name}
          </Text>
        </HStack>

        {/* Categories */}
        <Flex wrap="wrap" gap={2}>
          {shop.categories.slice(0, 3).map((category, index) => (
            <Badge key={index} colorScheme="teal" px={2} py={0.5} fontSize="xs">
              {category}
            </Badge>
          ))}
        </Flex>

        {/* Location */}
        <HStack spacing={2} color="gray.600" fontSize="sm">
          <FaMapMarkerAlt color="teal" />
          <Text fontWeight="medium">
            {`${shop.location.city}, ${shop.location.state}`}
          </Text>
        </HStack>

        {/* Description */}
        <Text fontSize="sm" color="gray.500" noOfLines={2}>
          {shop.description}
        </Text>

        {/* Contact */}
        <HStack spacing={3} w="full">
          <Tooltip label="Call Shop">
            <Link
              href={`tel:${shop.contactInfo.phone}`}
              display="flex"
              alignItems="center"
              color="teal.600"
              fontWeight="semibold"
              fontSize="sm"
              _hover={{ color: "teal.700" }}
            >
              <FaPhoneAlt />
              <Text ml={2}>{shop.contactInfo.phone}</Text>
            </Link>
          </Tooltip>
        </HStack>
      </VStack>
    </Box>
  );
};

export default ShopCard;
