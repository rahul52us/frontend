'use client';

import React, { memo } from 'react';
import DetailedProductPage from './component/DetailedProductPage';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { FiPackage } from 'react-icons/fi';

const ProductNotFoundState = memo(() => {
  const router = useRouter();
  const pageBg = useColorModeValue('#F8FAFC', 'gray.950');
  const cardBg = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.100', 'gray.800');
  const textColor = useColorModeValue('gray.900', 'white');
  const mutedText = useColorModeValue('gray.500', 'gray.400');

  return (
    <Box bg={pageBg} minH="75vh" py={16} px={4}>
      <Container maxW="md">
        <VStack
          bg={cardBg}
          p={8}
          rounded="2xl"
          border="1px solid"
          borderColor={borderColor}
          spacing={4}
          textAlign="center"
          boxShadow="xs"
        >
          <Flex
            w="52px"
            h="52px"
            rounded="full"
            bg="var(--color-surface-hover)"
            color="var(--color-primary)"
            align="center"
            justify="center"
          >
            <Icon as={FiPackage} boxSize={6} />
          </Flex>
          <Heading size="md" color={textColor}>
            Product Not Found
          </Heading>
          <Text fontSize="xs" color={mutedText}>
            No product ID was specified in the link. Explore our product catalog to discover great deals.
          </Text>
          <Button
            size="sm"
            h="38px"
            px={6}
            rounded="full"
            colorScheme="brand"
            onClick={() => router.push('/products')}
          >
            Browse Products
          </Button>
        </VStack>
      </Container>
    </Box>
  );
});
ProductNotFoundState.displayName = 'ProductNotFoundState';

export default function ProductClient() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');

  if (!productId) {
    return <ProductNotFoundState />;
  }

  return <DetailedProductPage productId={productId} />;
}
