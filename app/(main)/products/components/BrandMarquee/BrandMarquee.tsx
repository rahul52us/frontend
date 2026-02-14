'use client';

import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

const scroll = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const BrandMarquee = () => {
    const brands = [
        { name: 'Brand 1', logo: 'https://cdn-icons-png.flaticon.com/128/732/732221.png' },
        { name: 'Brand 2', logo: 'https://cdn-icons-png.flaticon.com/128/732/732229.png' },
        { name: 'Brand 3', logo: 'https://cdn-icons-png.flaticon.com/128/732/732190.png' },
        { name: 'Brand 4', logo: 'https://cdn-icons-png.flaticon.com/128/732/732228.png' },
        { name: 'Brand 5', logo: 'https://cdn-icons-png.flaticon.com/128/731/731985.png' },
        { name: 'Brand 6', logo: 'https://cdn-icons-png.flaticon.com/128/732/732243.png' },
    ];

    return (
        <Box py={8} bg="white" overflow="hidden" position="relative">
            <Text fontSize="xs" fontWeight="black" color="gray.300" textAlign="center" mb={6} textTransform="uppercase" letterSpacing="widest">
                Trusted by global brands
            </Text>

            <Flex
                w="max-content"
                animation={`${scroll} 25s linear infinite`}
                _hover={{ animationPlayState: 'paused' }}
            >
                {[...brands, ...brands].map((brand, index) => (
                    <Flex
                        key={index}
                        align="center"
                        justify="center"
                        px={8}
                        filter="grayscale(100%) opacity(0.4)"
                        transition="all 0.3s"
                        _hover={{ filter: 'grayscale(0%) opacity(1)' }}
                    >
                        <Image
                            src={brand.logo}
                            alt={brand.name}
                            h="30px"
                            maxW="120px"
                            objectFit="contain"
                        />
                    </Flex>
                ))}
            </Flex>

            {/* Gradient Mask */}
            <Box
                position="absolute"
                top={0}
                left={0}
                h="full"
                w="100px"
                bgGradient="linear(to-r, white, transparent)"
                zIndex={1}
                pointerEvents="none"
            />
            <Box
                position="absolute"
                top={0}
                right={0}
                h="full"
                w="100px"
                bgGradient="linear(to-l, white, transparent)"
                zIndex={1}
                pointerEvents="none"
            />
        </Box>
    );
};

export default BrandMarquee;
