"use client";
import {
  Box,
  Image,
  Text,
  Flex,
  Badge,
  VStack,
  HStack,
  Tooltip,
  Icon,
  Circle,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaMapMarkerAlt, FaPhoneAlt, FaArrowRight, FaStar } from "react-icons/fa";

interface ShopCardProps {
  shop: {
    name: string;
    description: string;
    location: { city: string; state: string };
    contactInfo: { phone: string };
    logo: { url: string; name: string };
    coverImage: { url: string; name: string };
    shopStatus: string;
    categories: string[];
  };
  onClick: () => void;
}

const ShopCard: React.FC<ShopCardProps> = ({ shop, onClick }) => {
  // Theme Colors - Skyblue focused
  const accentColor = "#00BFFF"; 
  const cardBg = useColorModeValue("white", "rgba(15, 25, 40, 1)"); // Deep Midnight Navy
  const mutedText = useColorModeValue("gray.500", "gray.400");
  
  const badgeBg = useColorModeValue("blue.50", "rgba(0, 191, 255, 0.1)");
  const borderColor = useColorModeValue("gray.100", "whiteAlpha.100");
  const footerBg = useColorModeValue("gray.50", "rgba(255, 255, 255, 0.03)");
  const footerBorder = useColorModeValue("gray.100", "whiteAlpha.200");

  return (
    <Box
      onClick={onClick}
      as="article"
      position="relative"
      cursor="pointer"
      role="group"
      transition="all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
      _hover={{ transform: "translateY(-12px)" }}
    >
      {/* The Main Container */}
      <Box
        bg={cardBg}
        borderRadius="40px"
        overflow="hidden"
        boxShadow={useColorModeValue(
          "0 20px 40px rgba(0,0,0,0.06)",
          "0 20px 40px rgba(0,0,0,0.4)"
        )}
        border="1px solid"
        borderColor={borderColor}
        position="relative"
        zIndex={1}
      >
        {/* Cover Section */}
        <Box h="200px" position="relative" overflow="hidden">
          <Image
            src={shop?.coverImage?.url}
            alt={shop?.coverImage?.name}
            w="100%"
            h="100%"
            objectFit="cover"
            transition="transform 0.8s ease"
            _groupHover={{ transform: "scale(1.15)" }}
          />
          
          {/* Status Badge with Glassmorphism */}
          <Box
            position="absolute"
            top="20px"
            right="20px"
            backdropFilter="blur(12px) saturate(180%)"
            bg={shop?.shopStatus === "active" ? "rgba(0, 191, 255, 0.7)" : "rgba(245, 101, 101, 0.7)"}
            px={4}
            py={1}
            borderRadius="full"
            border="1px solid rgba(255,255,255,0.3)"
          >
            <Text fontSize="10px" fontWeight="bold" color="white" textTransform="uppercase" letterSpacing="1px">
              {shop?.shopStatus}
            </Text>
          </Box>

          <Box
            position="absolute"
            bottom="0"
            w="full"
            h="50%"
            bgGradient="linear(to-t, rgba(5, 10, 20, 0.8), transparent)"
          />
        </Box>

        {/* Floating Brand Identity */}
        <Box px={6} pt={0} pb={8} position="relative">
          <Flex justify="space-between" align="flex-end" mt="-40px">
            <Box
              p="6px"
              bg={cardBg}
              borderRadius="28px"
              boxShadow="0 10px 25px rgba(0,0,0,0.15)"
              transition="all 0.4s ease"
              _groupHover={{ transform: "rotate(-6deg) scale(1.1)", boxShadow: `0 15px 35px ${accentColor}30` }}
            >
              <Image
                src={shop?.logo?.url}
                alt={shop?.logo?.name}
                boxSize="80px"
                borderRadius="22px"
                objectFit="cover"
              />
            </Box>
            
            <Circle 
              size="45px" 
              bg={accentColor} 
              color="white" 
              mb={2}
              boxShadow={`0 10px 20px rgba(0, 191, 255, 0.4)`}
              transition="all 0.3s ease"
              _groupHover={{ transform: "scale(1.1) rotate(90deg)", bg: "blue.400" }}
            >
              <FaArrowRight size="18px" />
            </Circle>
          </Flex>

          <VStack align="start" spacing={3} mt={4}>
            <VStack align="start" spacing={0}>
              <HStack color={accentColor} spacing={1} mb={1}>
                <Icon as={FaStar} boxSize={3} />
                <Text fontSize="xs" fontWeight="extrabold" letterSpacing="1.5px" textTransform="uppercase">
                  Featured Shop
                </Text>
              </HStack>
              <Text
                fontSize="2xl"
                fontWeight="900"
                lineHeight="1.1"
                letterSpacing="-0.5px"
                transition="all 0.3s ease"
                color={useColorModeValue("black", "white")}
                _groupHover={{ color: accentColor }}
              >
                {shop?.name}
              </Text>
            </VStack>

            <HStack color={mutedText} spacing={2}>
              <Icon as={FaMapMarkerAlt} boxSize={3.5} color={accentColor} />
              <Text fontSize="xs" fontWeight="bold">
                {shop?.location?.city.toUpperCase()} • {shop?.location?.state.toUpperCase()}
              </Text>
            </HStack>

            <Text fontSize="sm" color={mutedText} noOfLines={2} lineHeight="1.7">
              {shop?.description}
            </Text>

            <Flex wrap="wrap" gap={2} pt={2}>
              {shop?.categories?.slice(0, 3).map((cat, i) => (
                <Badge
                  key={i}
                  bg={badgeBg}
                  color={accentColor}
                  px={3}
                  py={1}
                  borderRadius="lg"
                  fontSize="9px"
                  fontWeight="bold"
                  variant="subtle"
                  border="1px solid"
                  borderColor={`${accentColor}20`}
                >
                  #{cat}
                </Badge>
              ))}
            </Flex>
          </VStack>
        </Box>

        {/* Modern Interactive Footer */}
        <Box 
          px={6} 
          py={4} 
          bg={footerBg}
          borderTop="1px solid"
          borderColor={footerBorder}
        >
          <HStack justify="space-between">
            <Tooltip label="Call Now" hasArrow placement="top">
              <HStack 
                spacing={3} 
                as="a" 
                href={`tel:${shop?.contactInfo?.phone}`}
                onClick={(e) => e.stopPropagation()}
              >
                <Box 
                  p={2} 
                  borderRadius="12px" 
                  bg={accentColor} 
                  color="white"
                  transition="all 0.3s"
                  _hover={{ transform: "scale(1.1) rotate(-10deg)" }}
                >
                  <FaPhoneAlt size="12px" />
                </Box>
                <Text fontSize="sm" fontWeight="800" letterSpacing="0.5px" color={useColorModeValue("gray.800", "white")}>
                  {shop?.contactInfo?.phone}
                </Text>
              </HStack>
            </Tooltip>
            
            <Text 
                fontSize="xs" 
                fontWeight="bold" 
                color={accentColor}
                opacity={0}
                transform="translateX(-10px)"
                transition="all 0.3s ease"
                _groupHover={{ opacity: 1, transform: "translateX(0)" }}
            >
                VISIT STORE
            </Text>
          </HStack>
        </Box>
      </Box>

      {/* Background Decorative Glow */}
      <Box
        position="absolute"
        top="10%"
        left="5%"
        right="5%"
        bottom="-2%"
        bg={accentColor}
        filter="blur(40px)"
        opacity={0}
        zIndex={0}
        transition="opacity 0.5s ease"
        _groupHover={{ opacity: 0.15 }}
      />
    </Box>
  );
};

export default ShopCard;