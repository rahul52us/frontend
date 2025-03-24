import React from "react";
import ShopHeaderSkeleton from "../ShopHeroSection/ShopHeroSkeleton";
import AboutUsSkeleton from "../ShopAbout/ShopAboutSkeleton";
import ShopImageSkeleton from "../ShopImages/ShopImageSkeleton";
import AddressMapSkeleton from "../LocationSection/AddressMapSkeleton";
import ContactSectionSkeleton from "../ContactSection/ContactSkeleton";
import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Skeleton,
} from "@chakra-ui/react";

const ShopLayoutSkeletan = () => {
  return (
    <Box>
      {/* Sticky Header Skeleton */}
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
          <Flex flex="1" justify="center">
            <Skeleton height="24px" width="150px" />
          </Flex>
          <Skeleton height="20px" width="80px" borderRadius="md" />
        </Flex>
      </Box>

      {/* Hero Section Skeleton */}
      <ShopHeaderSkeleton />

      {/* Sticky Nav Skeleton */}
      <Skeleton height="50px" width="full" />

      {/* About Section Skeleton */}
      <Container maxW="container.xl" px="4" py="8" id="about">
        <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap="8">
          <GridItem>
            <AboutUsSkeleton />
          </GridItem>
          <GridItem>
            <Skeleton height="200px" borderRadius="md" />
          </GridItem>
        </Grid>
      </Container>

      {/* Gallery Section Skeleton */}
      <Box id="gallery">
        <ShopImageSkeleton />
      </Box>

      {/* Products Section Skeleton */}
      <Container maxW="container.xl" id="products">
        <Skeleton height="40px" width="200px" mb={{ base: 4, md: 8 }} />
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap={{ base: 4, md: 3, lg: 4 }}
          justifyItems="center"
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              height="250px"
              width="100%"
              borderRadius="md"
            />
          ))}
        </Grid>
      </Container>

      {/* Location Section Skeleton */}
      <AddressMapSkeleton />

      {/* Newsletter Section Skeleton */}
      <Container maxW="container.xl" py="8">
        <Skeleton height="120px" borderRadius="md" />
      </Container>

      {/* Contact Section Skeleton */}
      <Container my={16} maxW="container.xl">
        <ContactSectionSkeleton />
      </Container>
    </Box>
  );
};

export default ShopLayoutSkeletan;
