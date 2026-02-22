import {
  Box, Container, Image, Text, Grid, GridItem, Tooltip, AspectRatio, Heading,
  Badge,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import CommonHeading from "../../../../component/common/CommonHeading/CommonHeading";

const MotionGrid = motion(Grid);
const MotionBox = motion(Box);

// Helper function for Box styles
const imageContainerStyles = {
  borderRadius: "lg",
  overflow: "hidden",
  boxShadow: "md",
  _hover: {
    transform: "scale(1.05)",
    boxShadow: "xl",
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  },
  cursor: "pointer",
};

const ShopImages = ({ shopData }: { shopData: any }) => {
  const gallery = shopData?.gallery || [];
  const bgColor = useColorModeValue("white", "gray.900");
  const overlayBg = useColorModeValue("blackAlpha.700", "blackAlpha.800");

  if (gallery.length === 0) return null;

  return (
    <Box py={{ base: 12, md: 24 }} p={10} id="gallery" position="relative">
      <VStack spacing={16} align="stretch" position="relative" zIndex={1}>
        <VStack spacing={4} align="center" textAlign="center">
          <Badge
            bgGradient="linear(to-r, blue.400, blue.600)"
            color="white"
            px={4}
            py={1}
            borderRadius="full"
            fontSize="xs"
            letterSpacing="0.1em"
          >
            PORTFOLIO
          </Badge>
          <Heading
            fontSize={{ base: "3xl", md: "5xl" }}
            fontWeight="900"
            color="gray.900"
            letterSpacing="-0.04em"
            lineHeight="1"
          >
            Insights & Highlights
          </Heading>
          <Text color="gray.500" fontSize="lg" maxW="2xl" fontWeight="medium">
            A curated look into our craftsmanship, workspace, and the signature projects that define our excellence.
          </Text>
        </VStack>

        <MotionGrid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap={6}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {gallery.map((image, index) => (
            <GridItem key={index}>
              <MotionBox
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
                }}
                whileHover="hover"
                position="relative"
                borderRadius="2xl"
                overflow="hidden"
                cursor="pointer"
                role="group"
                bg="gray.100"
              >
                <AspectRatio ratio={1}>
                  <Image
                    src={image?.file?.url}
                    alt={image?.title || `Gallery image ${index + 1}`}
                    objectFit="cover"
                    loading="lazy"
                    transition="transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
                    _groupHover={{ transform: "scale(1.05)" }}
                  />
                </AspectRatio>

                {/* Modern Minimal Overlay */}
                <MotionBox
                  variants={{
                    hover: { opacity: 1 },
                    initial: { opacity: 0 }
                  }}
                  transition={{ duration: 0.3 }}
                  position="absolute"
                  inset="0"
                  bg={overlayBg}
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-end"
                  p={6}
                >
                  <MotionBox
                    variants={{
                      hover: { y: 0, opacity: 1 },
                      initial: { y: 10, opacity: 0 }
                    }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <Text
                      color="white"
                      fontSize="lg"
                      fontWeight="800"
                      mb={1}
                    >
                      {image?.title || "Portfolio Work"}
                    </Text>
                    <HStack spacing={2}>
                      <Text color="blue.300" fontSize="xs" fontWeight="bold" letterSpacing="widest">
                        VIEW PROJECT
                      </Text>
                      <Icon as={FiArrowRight} color="blue.300" boxSize={3} />
                    </HStack>
                  </MotionBox>
                </MotionBox>
              </MotionBox>
            </GridItem>
          ))}
        </MotionGrid>
      </VStack>
    </Box>
  );
};


export default ShopImages;
