"use client";

import { Badge, Box, Divider, Flex, Icon, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import React from "react";
import { CiDiscount1 } from "react-icons/ci";

export interface OfferDisplayData {
  title: string;
  code?: string;
}

/**
 * Safely extracts human-readable text and optional coupon code from
 * either a string or an offer object ({ offerId, type, isEnabled, config, _id }).
 */
export const getOfferDisplayText = (offer: any): OfferDisplayData => {
  if (typeof offer === "string") {
    return { title: offer };
  }

  if (!offer || typeof offer !== "object") {
    return { title: "Special Local Offer" };
  }

  const code = offer.offerId ? String(offer.offerId).toUpperCase() : undefined;

  if (offer.title && typeof offer.title === "string") {
    return { title: offer.title, code };
  }

  if (offer.description && typeof offer.description === "string") {
    return { title: offer.description, code };
  }

  if (offer.name && typeof offer.name === "string") {
    return { title: offer.name, code };
  }

  if (offer.type === "discount") {
    const pct = offer.config?.discountPercentage;
    const max = offer.config?.maxDiscountAmount;
    const min = offer.config?.minCartValue;
    let text = pct ? `${pct}% OFF` : "Special Discount";
    if (min) text += ` on orders above ₹${min}`;
    if (max) text += ` (Max discount ₹${max})`;
    return { title: text, code };
  }

  if (offer.type === "buyXgetY") {
    const buy = offer.config?.buyQuantity || "X";
    const get = offer.config?.getQuantity || "Y";
    return { title: `Buy ${buy} Get ${get} Free`, code };
  }

  if (offer.type === "freebie") {
    const item = offer.config?.freebieProductName || "Free Gift";
    return { title: `Free ${item} with this purchase`, code };
  }

  return { title: code ? `Coupon code: ${code}` : "Special Discount Offer", code };
};

interface CouponOffersProps {
  offers?: any;
}

const CouponOffers: React.FC<CouponOffersProps> = ({ offers }) => {
  if (!offers) return null;

  const rawList = Array.isArray(offers) ? offers : [offers];
  const validOffers = rawList.filter(
    (o) => o && (typeof o === "string" || o.isEnabled !== false)
  );

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
        {validOffers.map((offer, index) => {
          const { title, code } = getOfferDisplayText(offer);
          return (
            <Flex
              key={offer?._id || offer?.offerId || index}
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
                <Text fontSize="xs" fontWeight={600} color="gray.800" lineHeight="1.3">
                  {title}
                </Text>
              </Box>
              {code && (
                <Badge
                  colorScheme="green"
                  variant="solid"
                  px={2}
                  py={0.5}
                  rounded="md"
                  fontSize="10px"
                  fontFamily="mono"
                  fontWeight="800"
                  flexShrink={0}
                >
                  {code}
                </Badge>
              )}
            </Flex>
          );
        })}
      </Box>
    </Box>
  );
};

export default observer(CouponOffers);
