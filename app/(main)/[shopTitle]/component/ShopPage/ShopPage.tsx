"use client";
import {
  Badge,
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
} from "@chakra-ui/react";
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
import { observer } from "mobx-react-lite";
import ShopHeaderSkeleton from "../ShopHeroSection/ShopHeroSkeleton";
import AboutUsSkeleton from "../ShopAbout/ShopAboutSkeleton";
import ShopImageSkeleton from "../ShopImages/ShopImageSkeleton";
import AddressMapSkeleton from "../LocationSection/AddressMapSkeleton";
import ContactSkeleton from "../ContactSection/ContactSkeleton";

const ShopPage = observer(({ shopData }: any) => {
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

  const isShopClosed = () => {
    const todayDate = new Date().toISOString().split("T")[0]; // Get current date in "YYYY-MM-DD" format

    return shopData.closedDates.includes(todayDate);
  };

  const todayHours = getCurrentDayHours();
  const isOpen24Hours = () => {
    if (isShopClosed()) return false;
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

  return (
    <Box>
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
      <ShopHeroSection shopData={shopData} />
      <ShopHeaderSkeleton/>
      <StickyNav shopData={shopData} />
      <Container maxW="container.xl" px="4" py="8" id="about">
        <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap="8">
          <GridItem>
            <ShopAbout shopData={shopData} />
            <AboutUsSkeleton/>
          </GridItem>
          <GridItem>
            <OperatingHours
              shopData={shopData}
              getCurrentDayHours={getCurrentDayHours}
            />
          </GridItem>
        </Grid>
      </Container>
      <Box id="gallery">
        <ShopImages shopData={shopData} />
        <ShopImageSkeleton/>
      </Box>
      <Container maxW="container.xl" id="products">
        <CommonHeading
          heading="Our Products"
          subheading="Discover Our most popular products"
          mb={{ base: 4, md: 8 }}
        />
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
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
      <AddressMapSkeleton/>
      <NewsLetter />
      <Container my={16} maxW="container.xl">
        <ContactSection shopData={shopData} />
        <ContactSkeleton/>
      </Container>
      <ShopFooterSection shopData={shopData} />
    </Box>
  );
});

export default ShopPage;