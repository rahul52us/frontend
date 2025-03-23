"use client";
import { Box, Flex, Grid } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import CategoryFilter from "../../component/common/CategoryFilter/CategoryFilter";
import ProductBanner from "../../component/common/ProductBanner/ProductBanner";
import IndianStateFilter from "../../component/common/StateFilter/StateFilter";
import HeroSection from "../../component/HeroSection/HeroSection";
import CategoryTabs from "./components/CategoryTabs/CategoryTabs";
import ProductsListSection from "./components/ProductCard/ProductsListSection";
import ProductCarousel from "./components/ProductCarousel/ProductCarousel";
import SpecificCategorySection from "./components/SpecificCategorySection/SpecificCategorySection";
import ShopByValues from "./components/ValueCard";

const banners = [
'/images/banners/blackFriday.jpg' ,
  '/images/banners/shoes.jpg' ,
  '/images/banners/summerSale.jpg' ,
'/images/banners/cyberMonday.jpg' ,
  '/images/banners/sofa.jpg'
];

const Page = observer(() => {
  return (
    <Box maxW="95%" mx="auto" py={{ base: 2, md: 2 }} overflowX="hidden">
      <CategoryFilter />
      <HeroSection/>
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={{ base: 4, md: 2 }}
        align="stretch"
        w="full"
      >
        <Box
          w="full"
          overflowY={{ base: "visible", md: "auto" }}
          sx={{
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": { background: "#888", borderRadius: "4px" },
          }}
        >
          <ProductsListSection />
        </Box>
      </Flex>
      <SpecificCategorySection/>
      <Box>
        <ProductCarousel />
      </Box>
      <CategoryTabs/>
      <IndianStateFilter/>
        <Grid gridTemplateColumns={{base : '1fr', md : '1fr 1fr'}} gap={4} mb={5}>
          {/* <BenefitSection/> */}
          <ShopByValues images={banners} />
          <ShopByValues images={banners} />

          </Grid>
      <Box mb={{ base: 4, md: 6 }}>
        <ProductBanner />
      </Box>
    </Box>
  );
});

export default Page;
