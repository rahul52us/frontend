'use client';

import { Box, Flex, Text, Heading, Grid, Image, Button, Icon, HStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiClock, FiZap } from 'react-icons/fi';

const FlashSale = () => {
    const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { hours, minutes, seconds } = prev;
                if (seconds > 0) seconds--;
                else if (minutes > 0) { seconds = 59; minutes--; }
                else if (hours > 0) { seconds = 59; minutes = 59; hours--; }
                return { hours, minutes, seconds };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (time: number) => time.toString().padStart(2, '0');

    const flashProducts = [
        { id: 1, name: 'AirPods Max', price: '449', original: '549', img: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=400&q=80', discount: '15%' },
        { id: 2, name: 'Apple Watch Ultra', price: '699', original: '799', img: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&q=80', discount: '12%' },
        { id: 3, name: 'Premium Leather Boots', price: '129', original: '199', img: 'https://images.unsplash.com/photo-1520639889313-7272a74b1c73?w=400&q=80', discount: '35%' },
        { id: 4, name: 'Designer Backpack', price: '89', original: '159', img: 'https://images.unsplash.com/photo-1546750547-73099bc39223?w=400&q=80', discount: '44%' },
    ];

    return (
        <Box
            bgGradient="linear(to-br, white, #FFFAFF)"
            p={{ base: 4, md: 8 }}
            borderRadius="3xl"
            boxShadow="2xl"
            mb={10}
            border="1px solid"
            borderColor="red.100"
            position="relative"
            overflow="hidden"
        >
            <Box
                position="absolute"
                top="-10%"
                right="-5%"
                w="30%"
                h="50%"
                bgGradient="radial(circle, rgba(255,0,128,0.05) 0%, transparent 70%)"
            />

            <Flex justify="space-between" align="center" mb={10} flexWrap="wrap" gap={6}>
                <HStack spacing={4}>
                    <Box
                        bgGradient="linear(to-br, #FF0080, #7928CA)"
                        p={3}
                        borderRadius="2xl"
                        boxShadow="0 4px 15px rgba(255, 0, 128, 0.4)"
                    >
                        <Icon as={FiZap} color="white" boxSize={6} />
                    </Box>
                    <Box>
                        <Heading size="lg" color="gray.800" fontWeight="900" textTransform="uppercase" letterSpacing="tight">Flash Sale</Heading>
                        <HStack spacing={2}>
                            <Box w="8px" h="8px" borderRadius="full" bg="red.500" animation="pulse 1.5s infinite" />
                            <Text fontSize="sm" color="red.500" fontWeight="bold">LIVE NOW</Text>
                        </HStack>
                    </Box>
                </HStack>

                <HStack
                    spacing={4}
                    bg="gray.900"
                    p={3}
                    px={5}
                    borderRadius="2xl"
                    boxShadow="dark-lg"
                >
                    <Text fontSize="xs" fontWeight="black" color="gray.400" textTransform="uppercase" letterSpacing="widest">Ends In</Text>
                    <HStack spacing={3}>
                        {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((t, i) => (
                            <Flex key={i} align="center">
                                <Box
                                    bgGradient="linear(to-b, #333, #000)"
                                    color="white"
                                    px={2}
                                    py={1.5}
                                    borderRadius="lg"
                                    fontWeight="black"
                                    fontSize="lg"
                                    minW="45px"
                                    textAlign="center"
                                    border="1px solid rgba(255,255,255,0.1)"
                                >
                                    {formatTime(t)}
                                </Box>
                                {i < 2 && <Text color="white" fontWeight="black" mx={1} animation="blink 1s infinite">:</Text>}
                            </Flex>
                        ))}
                    </HStack>
                </HStack>
            </Flex>

            <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={6}>
                {flashProducts.map(product => (
                    <Box
                        key={product.id}
                        position="relative"
                        role="group"
                        cursor="pointer"
                        transition="0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                        _hover={{ transform: 'scale(1.05)' }}
                    >
                        <Box
                            borderRadius="2xl"
                            overflow="hidden"
                            bg="white"
                            mb={4}
                            boxShadow="md"
                            position="relative"
                        >
                            <Image
                                src={product.img}
                                alt={product.name}
                                objectFit="cover"
                                w="100%"
                                h={{ base: '180px', md: '220px' }}
                                transition="all 0.5s"
                                _groupHover={{ transform: 'scale(1.1)' }}
                            />
                            <Box
                                position="absolute"
                                top={3}
                                left={3}
                                bgGradient="linear(to-r, #FF0080, #7928CA)"
                                color="white"
                                px={3}
                                py={1}
                                borderRadius="full"
                                fontSize="xs"
                                fontWeight="black"
                                boxShadow="lg"
                            >
                                {product.discount} OFF
                            </Box>
                        </Box>

                        <Text fontSize="xs" fontWeight="black" color="gray.400" textTransform="uppercase" mb={1}>{product.id === 1 ? 'Tech Gear' : 'Premium'}</Text>
                        <Text fontSize="sm" fontWeight="bold" noOfLines={1} mb={2} color="gray.800">{product.name}</Text>

                        <HStack spacing={3} align="center">
                            <Text fontSize="xl" fontWeight="black" color="#FF0080">${product.price}</Text>
                            <Text fontSize="xs" color="gray.400" textDecoration="line-through" fontWeight="bold">${product.original}</Text>
                        </HStack>

                        <Box w="full" h="8px" bg="gray.100" borderRadius="full" mt={4} overflow="hidden">
                            <Box
                                w={product.id === 1 ? "85%" : "60%"}
                                h="full"
                                bgGradient="linear(to-r, #FF0080, #7928CA)"
                                borderRadius="full"
                            />
                        </Box>
                        <HStack justify="space-between" mt={2}>
                            <Text fontSize="10px" fontWeight="black" color="#FF0080">ALMOST GONE</Text>
                            <Text fontSize="10px" color="gray.500" fontWeight="bold">{product.id === 1 ? '85 sold' : '62 sold'}</Text>
                        </HStack>
                    </Box>
                ))}
            </Grid>
        </Box>
    );
};

export default FlashSale;
