'use client';

import { Box, Flex, Text, Icon, HStack } from '@chakra-ui/react';
import { FiTruck, FiShield, FiRefreshCcw, FiClock } from 'react-icons/fi';

const TrustBar = () => {
    const benefits = [
        { icon: FiTruck, title: 'Free Shipping', sub: 'Orders over $50' },
        { icon: FiRefreshCcw, title: 'Easy Returns', sub: '30-day window' },
        { icon: FiShield, title: 'Secure Pay', sub: '100% encrypted' },
        { icon: FiClock, title: '24/7 Support', sub: 'Expert help' },
    ];

    return (
        <Box bg="gray.50" borderBottom="1px solid" borderColor="gray.100" py={3} px={4}>
            <Flex
                maxW="container.xl"
                mx="auto"
                justify="space-between"
                direction={{ base: 'row', md: 'row' }}
                wrap="nowrap"
                sx={{
                    '@media screen and (max-width: 768px)': {
                        overflowX: 'auto',
                        '&::-webkit-scrollbar': { display: 'none' },
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none',
                    }
                }}
            >
                {benefits.map((b, i) => (
                    <HStack key={i} flexShrink={0} mr={8} spacing={3} align="center">
                        <Icon as={b.icon} color="blue.600" boxSize={4} />
                        <Box>
                            <Text fontSize="2xs" fontWeight="black" color="gray.800" whiteSpace="nowrap">{b.title}</Text>
                            <Text fontSize="3xs" color="gray.500" whiteSpace="nowrap">{b.sub}</Text>
                        </Box>
                    </HStack>
                ))}
            </Flex>
        </Box>
    );
};

export default TrustBar;
