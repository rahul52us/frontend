'use client';

import React, { Suspense } from 'react';
import DetailedProductPage from './component/DetailedProductPage';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Skeleton,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { FiPackage } from 'react-icons/fi';

function ProductNotFoundState() {
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
}

function ProductPageFallback() {
  const pageBg = useColorModeValue('#F8FAFC', 'gray.950');
  const cardBg = useColorModeValue('white', 'gray.900');

  return (
    <Box bg={pageBg} minH="100vh" py={{ base: 3, md: 6 }}>
      <Container maxW="8xl" px={{ base: 3, md: 8 }}>
        <Skeleton h="20px" w="160px" mb={4} rounded="md" />
        <Box bg={cardBg} p={{ base: 4, md: 6 }} rounded="2xl" minH="380px">
          <Skeleton h={{ base: '260px', sm: '360px' }} rounded="xl" mb={4} />
          <Skeleton h="24px" w="70%" rounded="md" mb={2} />
          <Skeleton h="16px" w="40%" rounded="md" />
        </Box>
      </Container>
    </Box>
  );
}

function ProductContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');

  if (!productId) {
    return <ProductNotFoundState />;
  }

  return <DetailedProductPage productId={productId} />;
}

export default function Page() {
  return (
    <Suspense fallback={<ProductPageFallback />}>
      <ProductContent />
    </Suspense>
  );
}
