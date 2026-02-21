import {
  Box,
  Button,
  Text,
  Heading,
  Flex,
  Tag,
  TagLabel,
  Icon,
  VStack,
  HStack,
  Circle,
  Grid,
  GridItem,
  Badge,
  Wrap,
  WrapItem,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiArrowRight, FiAward, FiTarget, FiZap, FiStar } from "react-icons/fi";
import { motion, useScroll, useTransform } from "framer-motion";

const MotionBox = motion(Box);
const MotionImage = motion(Image);

type ShopAboutProps = {
  shopData: {
    about?: string;
    tags?: string[];
    name?: string;
  };
};

const ShopAbout = ({ shopData }: ShopAboutProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const aboutText = shopData.about || "";
  const previewText = aboutText.slice(0, 300);
  const bgColor = useColorModeValue("gray.50", "gray.800");

  const { scrollYProgress } = useScroll();
  const yImage = useTransform(scrollYProgress, [0, 1], [0, -60]);

  const milestones = [
    { icon: FiAward, label: "Heritage", sub: "Since 2018", color: "blue.500" },
    { icon: FiTarget, label: "Precision", sub: "Curated", color: "purple.500" },
    { icon: FiStar, label: "Excellence", sub: "Top Rated", color: "cyan.500" },
  ];

  return (
    <VStack align="stretch" spacing={16} position="relative">
      {/* Editorial Header & Mood Image */}
      <VStack align="stretch" spacing={10}>
        <VStack align="flex-start" spacing={6}>
          <VStack align="flex-start" spacing={3}>
            <Badge
              bgGradient="linear(to-r, blue.400, blue.600)"
              color="white"
              px={4}
              py={1}
              borderRadius="full"
              fontSize="2xs"
              letterSpacing="0.2em"
              fontWeight="900"
            >
              OUR STORY
            </Badge>
            <Heading
              fontSize={{ base: "4rem", md: "5rem", xl: "6rem" }}
              fontWeight="900"
              color="gray.900"
              lineHeight="0.9"
              letterSpacing="-0.04em"
              textTransform="uppercase"
            >
              The <br />
              <Text as="span" color="blue.600" display="inline-block">Heritage</Text>
            </Heading>
          </VStack>

          <Box maxW="sm">
            <Text
              fontSize="lg"
              fontWeight="bold"
              color="gray.400"
              lineHeight="1.2"
              letterSpacing="-0.01em"
            >
              A narrative of craftsmanship, passion, and the pursuit of perfection within {shopData.name}.
            </Text>
          </Box>
        </VStack>

        {/* Floating Mood Image Container */}
        <Box position="relative" w="full" pt={{ base: 0, lg: 10 }}>
          <MotionBox
            style={{ y: yImage }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <Box
              position="relative"
              borderRadius="32px"
              overflow="hidden"
              boxShadow="0 40px 80px rgba(0,0,0,0.1)"
              transform={{ base: "none", lg: "rotate(-1deg)" }}
            >
              <Image
                src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1000&h=800&fit=crop"
                alt="Mood"
                w="full"
                h={{ base: "300px", md: "450px" }}
                objectFit="cover"
              />
              <Box
                position="absolute"
                inset={0}
                bgGradient="linear(to-t, rgba(0,0,0,0.3), transparent)"
              />
            </Box>
          </MotionBox>

          {/* Overlapping Milestone Cards */}
          <HStack
            position="absolute"
            bottom="-30px"
            right={{ base: "10px", md: "40px" }}
            spacing={4}
            zIndex={3}
            display={{ base: "none", md: "flex" }}
          >
            {milestones.slice(0, 2).map((item, idx) => (
              <Box
                key={idx}
                bg="white"
                p={5}
                borderRadius="24px"
                boxShadow="2xl"
                border="1px solid"
                borderColor="gray.50"
              >
                <VStack spacing={3} align="flex-start">
                  <Circle size="32px" bg={item.color} color="white">
                    <Icon as={item.icon} boxSize={3} />
                  </Circle>
                  <VStack align="flex-start" spacing={0}>
                    <Text fontWeight="900" fontSize="xs" color="gray.900">{item.label}</Text>
                    <Text fontWeight="bold" fontSize="3xs" color="gray.400">{item.sub}</Text>
                  </VStack>
                </VStack>
              </Box>
            ))}
          </HStack>
        </Box>
      </VStack>

      {/* Main Narrative Content */}
      <VStack align="flex-start" spacing={8} maxW="2xl">
        <Text
          color="gray.700"
          fontSize={{ base: "md", md: "xl" }}
          lineHeight="1.6"
          fontWeight="medium"
          letterSpacing="-0.01em"
        >
          {isExpanded ? aboutText : `${previewText}${aboutText.length > 300 ? '...' : ''}`}
        </Text>

        {aboutText.length > 300 && (
          <Button
            size="lg"
            variant="ghost"
            color="blue.600"
            rightIcon={<FiArrowRight />}
            onClick={() => setIsExpanded(!isExpanded)}
            fontWeight="900"
            fontSize="md"
            letterSpacing="0.1em"
            _hover={{ bg: "blue.50" }}
            borderRadius="full"
            px={8}
          >
            {isExpanded ? "SHOW LESS" : "READ FULL NARRATIVE"}
          </Button>
        )}

        <Wrap spacing={4} pt={10}>
          {shopData.tags?.map((tag, index) => (
            <WrapItem key={index}>
              <Tag
                size="lg"
                variant="subtle"
                bg="gray.50"
                color="gray.600"
                borderRadius="full"
                px={6}
                py={3}
                border="1px solid"
                borderColor="gray.100"
              >
                <TagLabel fontWeight="900" fontSize="xs" letterSpacing="0.05em">
                  #{tag.toUpperCase()}
                </TagLabel>
              </Tag>
            </WrapItem>
          ))}
        </Wrap>
      </VStack>
    </VStack>
  );
};

export default ShopAbout;
