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
      borderRadius="3xl"
      overflow="hidden"
      boxShadow="lg"
      transition="all 0.3s ease"
      border="1px solid"
      borderColor="gray.100"
    >
      {/* Cover Image */}
      <Box position="relative" h={{ base: "140px", md: "180px" }}>
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
          top="12px"
          right="12px"
          colorScheme={shop?.shopStatus === "active" ? "green" : "red"}
          px={3}
          py={1}
          borderRadius="full"
          fontSize="xs"
          boxShadow="sm"
        >
          {shop?.shopStatus?.charAt(0).toUpperCase() + shop?.shopStatus?.slice(1)}
        </Badge>
      </Box>

      {/* Content */}
      <VStack p={{ base: 3, md: 5 }} spacing={3} align="start">
        {/* Shop Name & Logo */}
        <HStack w="full" align="center" spacing={3}>
          <Image
            src={shop?.logo?.url}
            alt={shop?.logo?.name}
            boxSize="40px"
            borderRadius="full"
            border="2px solid white"
            boxShadow="md"
            objectFit="contain"
            bg="white"
          />
          <Text
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="bold"
            color="gray.800"
            noOfLines={1}
          >
            {shop?.name}
          </Text>
        </HStack>

        {/* Categories */}
        {Array.isArray(shop?.categories) && (
          <Flex wrap="wrap" gap={2}>
            {shop?.categories?.slice(0, 2).map((category, index) => (
              <Badge
                key={index}
                variant="subtle"
                colorScheme="teal"
                px={2}
                py={0.5}
                borderRadius="md"
                fontSize="2xs"
                textTransform="none"
              >
                {category}
              </Badge>
            ))}
          </Flex>
        )}

        {/* Location */}
        <HStack spacing={2} color="gray.600" fontSize="sm">
          <FaMapMarkerAlt color="teal" />
          <Text fontWeight="medium">
            {`${shop?.location?.city}, ${shop?.location?.state}`}
          </Text>
        </HStack>

        {/* Description */}
        <Text fontSize="sm" color="gray.500" noOfLines={2}>
          {shop?.description}
        </Text>

        {/* Contact & Action */}
        <Flex justify="space-between" align="center" w="full" mt={2}>
          <Tooltip label="Call Shop">
            <Link
              href={`tel:${shop?.contactInfo?.phone}`}
              display="flex"
              alignItems="center"
              color="teal.600"
              fontWeight="semibold"
              fontSize="xs"
              _hover={{ color: "teal.700" }}
            >
              <FaPhoneAlt />
              <Text ml={1}>{shop?.contactInfo?.phone}</Text>
            </Link>
          </Tooltip>
          <Box
            as="button"
            px={4}
            py={1.5}
            bg="teal.500"
            color="white"
            borderRadius="full"
            fontSize="xs"
            fontWeight="bold"
            transition="all 0.2s"
            _active={{ transform: "scale(0.95)" }}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/${shop.name?.replace(/\s+/g, "-").toLowerCase()}`);
            }}
          >
            Visit Shop
          </Box>
        </Flex>
      </VStack>
    </Box>
  );
};

export default ShopCard;
