import { Box, Image, Text, Flex, Badge, Stack, Link } from "@chakra-ui/react";

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
  };
}

const ShopCard: React.FC<ShopCardProps> = ({ shop }) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
      bg="white"
      maxW="sm"
      m={4}
    >
      {/* Cover Image */}
      <Image
        src={shop?.coverImage?.url}
        alt={shop?.coverImage?.name}
        width="100%"
        height="200px"
        objectFit="cover"
      />

      {/* Shop Logo */}
      <Flex justify="center" mt={-10}>
        <Image
          borderRadius="full"
          boxSize="100px"
          src={shop?.logo?.url}
          alt={shop.logo.name}
          border="4px solid white"
        />
      </Flex>

      <Box p={4}>
        {/* Shop Name */}
        <Text fontSize="2xl" fontWeight="bold" mb={2}>
          {shop.name}
        </Text>

        {/* Description */}
        <Text noOfLines={3} mb={2}>
          {shop.description}
        </Text>

        {/* Location */}
        <Text fontSize="sm" color="gray.600" mb={2}>
          <strong>Location: </strong>
          {`${shop.location.address}, ${shop.location.city}, ${shop.location.state}, ${shop.location.country} - ${shop.location.postalCode}`}
        </Text>

        {/* Shop Status */}
        <Badge colorScheme={shop.shopStatus === "active" ? "green" : "red"}>
          {shop.shopStatus}
        </Badge>

        {/* Contact Information */}
        <Stack spacing={1} mt={4} fontSize="sm" color="gray.600">
          <Text>
            <strong>Phone: </strong>
            <Link href={`tel:${shop.contactInfo.phone}`}>{shop.contactInfo.phone}</Link>
          </Text>
          {shop.contactInfo.email && (
            <Text>
              <strong>Email: </strong>
              <Link href={`mailto:${shop.contactInfo.email}`}>{shop.contactInfo.email}</Link>
            </Text>
          )}
          {shop.contactInfo.website && (
            <Text>
              <strong>Website: </strong>
              <Link href={shop.contactInfo.website} isExternal>
                {shop.contactInfo.website}
              </Link>
            </Text>
          )}
        </Stack>

        {/* Operating Hours */}
        <Box mt={4}>
          <Text fontSize="sm" color="gray.600">
            <strong>Operating Hours:</strong>
          </Text>
          {Object.keys(shop.operatingHours).map((day) => (
            <Text key={day} fontSize="sm" color="gray.600">
              {day.charAt(0).toUpperCase() + day.slice(1)}:{" "}
              {shop.operatingHours[day] || "Closed"}
            </Text>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ShopCard;
