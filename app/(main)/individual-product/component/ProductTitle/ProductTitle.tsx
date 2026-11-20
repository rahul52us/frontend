"use client";

import { Box, Flex, Icon, IconButton, Text, useToast } from "@chakra-ui/react";
import React, { memo, useCallback } from "react";
import { FiShare2 } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";

interface ProductTitleProps {
  brand?: string;
  title: string;
}

const ProductTitle: React.FC<ProductTitleProps> = memo(({ brand, title }) => {
  const toast = useToast();

  const handleShare = useCallback(async () => {
    if (typeof window === "undefined") return;
    const shareData = {
      title,
      text: `Check out ${title} on Business Sahayta`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied to clipboard",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      }
    } catch {
      // User cancelled share
    }
  }, [title, toast]);

  return (
    <Box>
      {brand && (
        <Flex align="center" gap={1} mb={0.5}>
          <Text color="gray.500" fontWeight={600} fontSize="xs">
            {brand}
          </Text>
          <Icon as={IoIosArrowForward} color="gray.400" boxSize={3} />
        </Flex>
      )}
      <Flex justify="space-between" align="center" gap={3}>
        <Text fontSize={{ base: "md", md: "lg" }} fontWeight={800} color="gray.900" lineHeight="short">
          {title}
        </Text>
        <IconButton
          aria-label="Share product"
          icon={<FiShare2 size={16} />}
          size="sm"
          rounded="lg"
          borderWidth={1}
          borderColor="gray.200"
          variant="ghost"
          onClick={handleShare}
          flexShrink={0}
        />
      </Flex>
    </Box>
  );
});

ProductTitle.displayName = "ProductTitle";

export default ProductTitle;
