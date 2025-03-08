"use client"
import { Box } from '@chakra-ui/react';
import BentoGrid from './components/BentoGrid/BentoGrid';
import TopFilterBar from './components/FilterComponent/Filter';
import ProductsListSection from './components/ProductCard/ProductsListSection';
import ProductCarousel from './components/ProductCarousel/ProductCarousel';



const page = () => {
  return (
    <Box maxW={'95%'} mx={'auto'}>
            <TopFilterBar/>

      <ProductsListSection/>

      <ProductCarousel/>
      <BentoGrid/>

    </Box>
  );
};

export default page;
