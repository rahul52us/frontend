"use client";
import {
  Badge,
  Box,
  Link as ChakraLink,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Image,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";
import CommonHeading from "../../../../component/common/CommonHeading/CommonHeading";
import ProductCard from "../../../products/components/ProductCard/ProductCard";
import { uniqueProducts } from "../../../products/components/utils/constant";
import ContactSection from "../ContactSection/ContactSection";
import NewsLetter from "../NewsLetter/NewsLetter";
import OperatingHours from "../OperatingHours/OperatingHours";
import ShopAbout from "../ShopAbout/ShopAbout";
import ShopFooterSection from "../ShopFooterSection/ShopFooterSection";
import ShopHeroSection from "../ShopHeroSection/ShopHeroSection";
import ShopImages from "../ShopImages/ShopImages";
import StickyNav from "../StickyNav/StickyNav";
import LocationSection from "../LocationSection/LocationSection";

// Mock data for the shop
const shopData = {
  _id: "shop123",
  name: "Artisan Crafts & Co.",
  description:
    "Premium handcrafted goods made with sustainable materials and traditional techniques. Premium handcrafted goods made with sustainable materials and traditional techniques. Premium handcrafted goods made with sustainable materials and traditional techniques. Premium handcrafted goods made with sustainable materials and traditional techniques.",
  about:
    "Founded in 2015, Artisan Crafts & Co. brings together skilled artisans from around the world. We believe in preserving traditional craftsmanship while embracing modern design sensibilities. Each product tells a story and supports local communities.",
  categories: ["Home Decor", "Furniture", "Textiles", "Ceramics"],
  tags: ["handmade", "sustainable", "eco-friendly", "fair-trade", "artisanal"],
  images: {
    logo: "https://images.unsplash.com/photo-1557053964-937650b63311?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGxvZ298ZW58MHx8MHx8fDA%3D/placeholder.svg?height=200&width=200",
    cover:
      "https://images.unsplash.com/photo-1572611932849-7f0f116fb2f1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    gallery: [
      "https://images.unsplash.com/photo-1526745925052-dd824d27b9ab?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1526745925052-dd824d27b9ab?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1526745925052-dd824d27b9ab?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1526745925052-dd824d27b9ab?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
  },
  ratings: {
    average: 4.8,
    total: 256,
  },
  location: {
    address: "123 Craft Avenue",
    city: "Portland",
    state: "Oregon",
    postalCode: "97201",
    country: "USA",
    coordinates: {
      latitude: 45.523064,
      longitude: -122.676483,
    },
    additionalLocations: [
      {
        address: "456 Artisan Street",
        city: "Seattle",
        state: "Washington",
        postalCode: "98101",
        country: "USA",
        coordinates: {
          latitude: 47.606209,
          longitude: -122.332071,
        },
      },
    ],
  },
  contact: {
    phone: "+1 (503) 555-1234",
    email: "hello@artisancrafts.co",
    website: "https://artisancrafts.co",
    socialMedia: {
      instagram: "artisancraftsco",
      facebook: "ArtisanCraftsCo",
      twitter: "ArtisanCraftsCo",
    },
  },
  operatingHours: [
    { day: "Monday", open: "10:00", close: "18:00" },
    { day: "Tuesday", open: "10:00", close: "18:00" },
    { day: "Wednesday", open: "10:00", close: "18:00" },
    { day: "Thursday", open: "10:00", close: "20:00" },
    { day: "Friday", open: "10:00", close: "20:00" },
    { day: "Saturday", open: "11:00", close: "13:00" },
    { day: "Sunday", open: "12:00", close: "16:00" },
  ],
  status: "active",
};

export default function ShopPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Calculate if shop is currently open
  const getCurrentDayHours = () => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const today = days[new Date().getDay()];
    return shopData.operatingHours.find((day) => day.day === today);
  };

  const todayHours = getCurrentDayHours();
  const isOpen24Hours = () => {
    if (!todayHours) return false;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const [openHour, openMinute] = todayHours.open.split(":").map(Number);
    const [closeHour, closeMinute] = todayHours.close.split(":").map(Number);

    const currentTime = currentHour * 60 + currentMinute;
    const openTime = openHour * 60 + openMinute;
    const closeTime = closeHour * 60 + closeMinute;

    return currentTime >= openTime && currentTime < closeTime;
  };
  const gridColumns = useBreakpointValue({
    base: "repeat(1, 1fr)",
    md: "repeat(3, 1fr)",
    lg: "repeat(4, 1fr)",
  });

  return (
    <Box>
      {/* Mobile Navigation */}
      <Box
        position="sticky"
        top="0"
        zIndex="50"
        w="full"
        bg="white"
        boxShadow="sm"
        borderBottom="1px"
        borderColor="gray.200"
        display={{ base: "block", md: "none" }}
      >
        <Flex h="14" alignItems="center" px="4">
          <IconButton
            aria-label="Open menu"
            icon={<FaBars />}
            variant="ghost"
            mr="2"
            onClick={onOpen}
          />
          <Flex flex="1" justify="center">
            <Heading as="h1" size="md" fontWeight="semibold">
              {shopData.name}
            </Heading>
          </Flex>
          <Badge
            colorScheme={isOpen24Hours() ? "green" : "gray"}
            variant={isOpen24Hours() ? "solid" : "outline"}
          >
            {isOpen24Hours() ? "Open Now" : "Closed"}
          </Badge>
        </Flex>
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Flex alignItems="center">
              <Box position="relative" w="40px" h="40px" mr="3">
                <Image
                  src={shopData.images.logo}
                  alt={shopData.name}
                  objectFit="cover"
                  //   borderRadius="md"
                />
              </Box>
              <Heading size="md">{shopData.name}</Heading>
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <VStack align="stretch" spacing="3">
              <ChakraLink
                href="#about"
                onClick={onClose}
                p="2"
                borderRadius="md"
                _hover={{ bg: "gray.100" }}
              >
                About
              </ChakraLink>
              <ChakraLink
                href="#products"
                onClick={onClose}
                p="2"
                borderRadius="md"
                _hover={{ bg: "gray.100" }}
              >
                Products
              </ChakraLink>
              <ChakraLink
                href="#gallery"
                onClick={onClose}
                p="2"
                borderRadius="md"
                _hover={{ bg: "gray.100" }}
              >
                Gallery
              </ChakraLink>
              <ChakraLink
                href="#location"
                onClick={onClose}
                p="2"
                borderRadius="md"
                _hover={{ bg: "gray.100" }}
              >
                Location
              </ChakraLink>
              <ChakraLink
                href="#contact"
                onClick={onClose}
                p="2"
                borderRadius="md"
                _hover={{ bg: "gray.100" }}
              >
                Contact
              </ChakraLink>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Hero Section */}
      <ShopHeroSection shopData={shopData} />
      <StickyNav shopData={shopData} />
      <Container maxW="container.xl" px="4" py="8" id="about" mt="8">
        <Box>
          <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap="8">
            <GridItem>
              <ShopAbout shopData={shopData} />
            </GridItem>

            <GridItem>
              <OperatingHours
                shopData={shopData}
                getCurrentDayHours={getCurrentDayHours}
              />
            </GridItem>
          </Grid>
        </Box>
      </Container>
      <Box id="gallery">
        <ShopImages shopData={shopData} />
      </Box>
      <Container maxW={"container.xl"} id="products">
        <CommonHeading
          heading="Our Products"
          subheading="Discover Our most popular products"
          mb={{ base: 4, md: 8 }}
        />

        <Grid
          templateColumns={gridColumns}
          gap={{ base: 4, md: 3, lg: 4 }}
          justifyItems="center"
        >
          {uniqueProducts.map((product) => (
            <ProductCard
              key={`${product.id}-${product.name}`}
              product={product}
            />
          ))}
        </Grid>
      </Container>
      <LocationSection shopData={shopData} />

      <NewsLetter />
      <Container my={16} maxW={"container.xl"}>
        <Box>
          <ContactSection shopData={shopData} />
        </Box>
      </Container>
      <ShopFooterSection shopData={shopData} />
    </Box>
  );
}
