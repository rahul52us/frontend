import {
  Box,
  Container,
  Image,
  Text,
  AspectRatio,
  Heading,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { FiArrowRight, FiInfo } from "react-icons/fi";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const ShopImages = ({ shopData }: { shopData: any }) => {
  // Enhanced detail-oriented data fetching
  const gallery = shopData?.gallery || shopData?.images || shopData?.photos || shopData?.data?.gallery || [];
  const stageBg = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("gray.900", "white");
  const accentColor = "purple.500";

  // Data verification block
  if (gallery.length === 0) {
    return (
      <Box py={10} textAlign="center" border="1px dashed" borderColor="gray.200" borderRadius="xl" m={8}>
        <VStack spacing={4}>
          <Icon as={FiInfo} color="gray.300" boxSize={8} />
          <Text color="gray.400" fontWeight="800" fontSize="xs" letterSpacing="0.2em">
            CURATING THE COLLECTION...
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box py={{ base: 20, md: 32 }} bg={stageBg} id="gallery" position="relative">
      <Container maxW="7xl">
        <VStack spacing={16} align="stretch">
          {/* Elite Editorial Header */}
          <VStack spacing={6} align="center" textAlign="center">
            <VStack spacing={3}>
              <Text
                fontSize="xs"
                fontWeight="900"
                letterSpacing="0.5em"
                color={accentColor}
                textTransform="uppercase"
              >
                Visual Story
              </Text>
              <Heading
                fontSize={{ base: "4xl", md: "5xl", lg: "70px" }}
                fontWeight="900"
                color="gray.900"
                letterSpacing="-0.04em"
                lineHeight="1"
              >
                Atmosphere & <Text as="span" color="gray.300" fontStyle="italic" fontWeight="400">Soul</Text>
              </Heading>
            </VStack>
            <Box w="80px" h="1px" bg="purple.500" />
          </VStack>

          {/* Mosaic Grid - Performance Optimized & High Visibility */}
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(3, 1fr)",
            }}
            gap={10}
          >
            {gallery.map((image, index) => {
              const isFeatured = index === 0;
              const imageUrl = image?.file?.url || image?.url || image;

              return (
                <GridItem
                  key={index}
                  colSpan={{ base: 1, md: isFeatured ? 2 : 1 }}
                >
                  <Box
                    role="group"
                    position="relative"
                    borderRadius="0" // Sharp Boutique Edge
                    overflow="hidden"
                    bg="gray.50"
                    shadow="xl"
                    transition="all 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
                    _hover={{
                      shadow: "2xl",
                      transform: "scale(1.01)"
                    }}
                  >
                    <AspectRatio ratio={isFeatured ? 1.6 : 1}>
                      <Image
                        src={imageUrl}
                        alt={image?.title || `Boutique Detail ${index + 1}`}
                        objectFit="cover"
                        transition="transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)"
                        _groupHover={{ transform: "scale(1.08)" }}
                        fallbackSrc="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
                      />
                    </AspectRatio>

                    {/* Minimalist Overlay Label */}
                    <Box
                      position="absolute"
                      bottom={0}
                      left={0}
                      right={0}
                      p={8}
                      bgGradient="linear(to-t, blackAlpha.700, transparent)"
                      opacity={0}
                      _groupHover={{ opacity: 1 }}
                      transition="all 0.4s ease"
                    >
                      <VStack align="flex-start" spacing={1}>
                        <Text color="white" fontSize="xs" fontWeight="900" letterSpacing="0.2em">
                          PIECE {String(index + 1).padStart(2, '0')}
                        </Text>
                        <HStack justify="space-between" w="full">
                          <Heading color="white" fontSize="xl" fontWeight="900">
                            {image?.title || "Boutique Study"}
                          </Heading>
                          <Icon as={FiArrowRight} color="white" />
                        </HStack>
                      </VStack>
                    </Box>
                  </Box>
                </GridItem>
              );
            })}
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
};

export default ShopImages;
