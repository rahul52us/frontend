"use client";

import { Badge, Box, Divider, Flex, Icon, Text } from "@chakra-ui/react";
import React, { memo, useMemo } from "react";
import { CiDiscount1 } from "react-icons/ci";

export interface OfferDisplayData {
  title: string;
  code?: string;
  key: string;
}

export const getOfferDisplayText = (offer: any, index: number): OfferDisplayData => {
  const defaultKey = `offer-${index}`;
  if (typeof offer === "string") {
    return { title: offer, key: defaultKey };
  }

  if (!offer || typeof offer !== "object") {
    return { title: "Special Local Offer", key: defaultKey };
  }

  const code = offer.offerId ? String(offer.offerId).toUpperCase() : undefined;
  const key = offer._id || offer.offerId || defaultKey;

  if (offer.title && typeof offer.title === "string") {
    return { title: offer.title, code, key };
  }

  if (offer.description && typeof offer.description === "string") {
    return { title: offer.description, code, key };
  }

  if (offer.name && typeof offer.name === "string") {
    return { title: offer.name, code, key };
  }

  if (offer.type === "discount") {
    const pct = offer.config?.discountPercentage;
    const max = offer.config?.maxDiscountAmount;
    const min = offer.config?.minCartValue;
    let text = pct ? `${pct}% OFF` : "Special Discount";
    if (min) text += ` on orders above ₹${min}`;
    if (max) text += ` (Max discount ₹${max})`;
    return { title: text, code, key };
  }

  if (offer.type === "buyXgetY") {
    const buy = offer.config?.buyQuantity || "X";
    const get = offer.config?.getQuantity || "Y";
    return { title: `Buy ${buy} Get ${get} Free`, code, key };
  }

  if (offer.type === "freebie") {
    const item = offer.config?.freebieProductName || "Free Gift";
    return { title: `Free ${item} with this purchase`, code, key };
  }

  return { title: code ? `Coupon code: ${code}` : "Special Discount Offer", code, key };
};

interface CouponOffersProps {
  offers?: any;
}

const CouponOffers: React.FC<CouponOffersProps> = memo(({ offers }) => {
  // Pre-filter and pre-parse offers once to avoid repetitive computation during re-renders
  const validOffers = useMemo(() => {
    if (!offers) return [];
    const rawList = Array.isArray(offers) ? offers : [offers];
    return rawList
      .filter((o) => o && (typeof o === "string" || o.isEnabled !== false))
      .map((o, idx) => getOfferDisplayText(o, idx));
  }, [offers]);

  if (validOffers.length === 0) return null;

  return (
    <Box my={6}>
      <Flex gap={2} align="center" mb={3}>
        <Text whiteSpace="nowrap" fontWeight={700} fontSize="sm" color="gray.600">
          Coupons & Offers
        </Text>
        <Divider borderColor="gray.200" />
      </Flex>
      <Box display="flex" flexDirection="column" gap={2.5}>
        {validOffers.map((offer) => (
          <Flex
            key={offer.key}
            gap={3}
            align="center"
            p={2.5}
            rounded="xl"
            bg="green.50"
            border="1px solid"
            borderColor="green.200"
          >
            <Icon as={CiDiscount1} fontSize="22px" color="green.600" flexShrink={0} />
            <Box flex={1} minW={0}>
              <Text fontSize="xs" fontWeight={600} color="green.900" noOfLines={2}>
                {offer.title}
              </Text>
            </Box>
            {offer.code && (
              <Badge
                colorScheme="green"
                variant="outline"
                fontSize="10px"
                fontWeight={700}
                px={2}
                py={0.5}
                rounded="md"
                letterSpacing="wider"
              >
                {offer.code}
              </Badge>
            )}
          </Flex>
        ))}
      </Box>
    </Box>
  );
});

CouponOffers.displayName = "CouponOffers";

export default CouponOffers;
