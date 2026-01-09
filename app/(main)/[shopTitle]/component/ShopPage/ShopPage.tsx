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
import stores from "../../../../store/stores";
import { useEffect, useState } from "react";

const ShopPage = observer(({ shopData }: any) => {
  const { shopStore: { getShopProducts } } = stores;
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    if (shopData?._id) {
      getShopProducts({ company: shopData?._id, limit: 12 }).then((res: any) => {
        setProducts(res?.data?.products || [])
      })
    }
  }, [shopData?._id])

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
    return shopData?.operatingHours?.find((day: any) => day.day === today) ?? null;
  };

  const isShopClosed = () => {
    const todayDate = new Date().toISOString().split("T")[0];
    return Array.isArray(shopData?.closedDates)
      ? shopData.closedDates.includes(todayDate)
      : false;
  };

  const todayHours = getCurrentDayHours();

  const isOpen24Hours = () => {
    if (isShopClosed()) return false;
    if (!todayHours?.open || !todayHours?.close) return false;

    const openParts = todayHours.open.split(":").map(Number);
    const closeParts = todayHours.close.split(":").map(Number);

    if (openParts.length !== 2 || closeParts.length !== 2 || openParts.some(isNaN) || closeParts.some(isNaN)) {
      return false;
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const openTime = openParts[0] * 60 + openParts[1];
    const closeTime = closeParts[0] * 60 + closeParts[1];

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
              {shopData?.name ?? "Shop"}
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
      <StickyNav shopData={shopData} />
      <Container maxW="container.xl" px="4" py="8" id="about">
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
      </Container>
      <Box id="gallery">
        <ShopImages shopData={shopData} />
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
          {(Array.isArray(products) && products.length > 0 ? products : []).map((product) => (
            <ProductCard
              key={`${product._id || product.id}-${product.name}`}
              product={product}
            />
          ))}
        </Grid>
      </Container>
      <LocationSection shopData={shopData} />
      <NewsLetter />
      <Container my={16} maxW="container.xl">
        <ContactSection shopData={shopData} />
      </Container>
      <ShopFooterSection shopData={shopData} />
    </Box>
  );
});

export default ShopPage;
