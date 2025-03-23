import { Box, Divider } from '@chakra-ui/react';
import CouponOffers from '../CouponOffers.tsx/CouponOffers';
import ProductColorSelector from '../ProductColorSelector/ProductColorSelector';
import ProductPrice from '../ProductPrice/ProductPrice';
import ProductRating from '../ProductRating/ProductRating';
import ProductSizeSelector from '../ProductSizeSelector/ProductSizeSelector';
import ProductSpecs from '../ProductSpecs/ProductSpecs';
import ProductTitle from '../ProductTitle/ProductTitle';
import ReturnExchange from '../ReturnExchange/ReturnExchange';
import { productData } from '../utils/constant';
import { observer } from 'mobx-react-lite';

const ProductDetailsSection = () => {
  return (
    <Box>
      <Box p={4} borderWidth={1} rounded={'2xl'}>
        <ProductTitle brand={productData.brand} title={productData.title} />
        <ProductRating rating={productData.rating.score} reviews={productData.rating.reviewsCount} />
        <ProductPrice price={productData.priceDetails.currentPrice} discount={productData.priceDetails.discount} mrp={productData.priceDetails.originalPrice} />
        <Divider borderColor={'gray.400'} maxW={'90%'} mx={'auto'} my={4} />
        {productData?.colors?.length > 0 && <ProductColorSelector colors={productData?.colors} />}
        {productData?.sizes?.length > 0 && <ProductSizeSelector sizes={productData?.sizes} />}
        <CouponOffers offers={productData.offers} />
        <Divider borderColor={'gray.400'} maxW={'90%'} mx={'auto'} my={6} />
        <ReturnExchange services={productData.services} />
      </Box>
      <ProductSpecs specs={productData.highlights} title={'Highlights'} />
      <ProductSpecs specs={productData.information} title={'Information'} />
    </Box>
  );
};

export default observer(ProductDetailsSection);
