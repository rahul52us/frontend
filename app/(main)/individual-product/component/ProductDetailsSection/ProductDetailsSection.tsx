"use client";

import { Box, Divider } from "@chakra-ui/react";
import React, { memo } from "react";
import { observer } from "mobx-react-lite";
import CouponOffers from "../CouponOffers.tsx/CouponOffers";
import ProductColorSelector from "../ProductColorSelector/ProductColorSelector";
import ProductPrice from "../ProductPrice/ProductPrice";
import ProductRating from "../ProductRating/ProductRating";
import ProductSizeSelector from "../ProductSizeSelector/ProductSizeSelector";
import ProductSpecs from "../ProductSpecs/ProductSpecs";
import ProductTitle from "../ProductTitle/ProductTitle";
import ReturnExchange from "../ReturnExchange/ReturnExchange";
import { productData } from "../utils/constant";

const ProductDetailsSection = memo(
  observer(() => {
    return (
      <Box>
        <Box p={{ base: 3, md: 5 }} borderWidth={1} borderColor="gray.200" rounded="2xl" bg="white">
          <ProductTitle brand={productData.brand} title={productData.title} />
          <ProductRating
            rating={productData.rating.score}
            reviews={productData.rating.reviewsCount}
          />
          <ProductPrice
            price={productData.priceDetails.currentPrice}
            discount={productData.priceDetails.discount}
            mrp={productData.priceDetails.originalPrice}
          />
          <Divider borderColor="gray.200" maxW="90%" mx="auto" my={4} />
          {productData?.colors && productData.colors.length > 0 && (
            <ProductColorSelector colors={productData.colors} />
          )}
          {productData?.sizes && productData.sizes.length > 0 && (
            <ProductSizeSelector sizes={productData.sizes} />
          )}
          {productData?.offers && <CouponOffers offers={productData.offers} />}
          <Divider borderColor="gray.200" maxW="90%" mx="auto" my={6} />
          {productData?.services && (
            <ReturnExchange services={productData.services} />
          )}
        </Box>

        {productData?.highlights && (
          <ProductSpecs specs={productData.highlights} title="Highlights" />
        )}
        {productData?.information && (
          <ProductSpecs specs={productData.information} title="Information" />
        )}
      </Box>
    );
  })
);

ProductDetailsSection.displayName = "ProductDetailsSection";

export default ProductDetailsSection;
