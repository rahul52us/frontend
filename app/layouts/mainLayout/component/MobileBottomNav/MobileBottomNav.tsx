'use client';

import { Box, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import { useRouter, usePathname } from 'next/navigation';
import { FiHome, FiGrid, FiShoppingBag, FiShoppingCart, FiUser } from 'react-icons/fi';

const MobileBottomNav = () => {
    const router = useRouter();
    const pathname = usePathname();
    const bg = useColorModeValue('white', 'gray.900');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const activeColor = useColorModeValue('teal.500', 'teal.300');
    const inactiveColor = useColorModeValue('gray.500', 'gray.400');

    const navItems = [
        { label: 'Home', icon: FiHome, path: '/' },
        { label: 'Categories', icon: FiGrid, path: '/categories' },
        { label: 'Shops', icon: FiShoppingBag, path: '/shops' },
        { label: 'Cart', icon: FiShoppingCart, path: '/cart' },
        { label: 'Account', icon: FiUser, path: '/account' },
    ];

    return (
        <Box
            position="fixed"
            bottom="0"
            left="0"
            right="0"
            zIndex="1000"
            bg={useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(23, 25, 35, 0.8)')}
            backdropFilter="blur(10px)"
            borderTop="1px solid"
            borderColor={borderColor}
            boxShadow="0 -4px 12px rgba(0,0,0,0.08)"
            display={{ base: 'block', md: 'none' }}
            pb="safe-area-inset-bottom"
        >
            <Flex justify="space-around" align="center" h="60px">
                {navItems.map((item) => {
                    const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
                    return (
                        <Flex
                            key={item.label}
                            direction="column"
                            align="center"
                            justify="center"
                            flex="1"
                            h="100%"
                            cursor="pointer"
                            onClick={() => router.push(item.path)}
                            color={isActive ? activeColor : inactiveColor}
                            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                            position="relative"
                        >
                            <Box
                                transition="all 0.3s"
                                transform={isActive ? 'translateY(-2px)' : 'none'}
                            >
                                <Icon as={item.icon} boxSize="22px" mb="1" />
                            </Box>
                            <Text fontSize="10px" fontWeight={isActive ? '700' : '500'}>
                                {item.label}
                            </Text>
                            {isActive && (
                                <Box
                                    position="absolute"
                                    bottom="4px"
                                    w="4px"
                                    h="4px"
                                    bg={activeColor}
                                    borderRadius="full"
                                />
                            )}
                        </Flex>
                    );
                })}
            </Flex>
        </Box>
    );
};

export default MobileBottomNav;
