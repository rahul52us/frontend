"use client"
import { Box, Heading, Text, Flex, VStack, useColorModeValue, Divider } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

interface ProductAboutSectionProps {
    product: any;
}

const ProductAboutSection = observer(({ product }: ProductAboutSectionProps) => {
    const { productDetails, information, description } = product;

    const labelColor = useColorModeValue('gray.500', 'gray.500');
    const valueColor = useColorModeValue('gray.800', 'gray.200');
    const dividerColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.400');

    // Filter specs
    const dynamicSpecs = [
        ...Object.entries(productDetails || {}),
        ...Object.entries(information || {})
    ].filter(([key, value]) => key !== 'color' && key !== 'size' && key !== 'ssd' && value);

    if (!description && dynamicSpecs.length === 0) return null;

    return (
        <VStack spacing={12} align="stretch" mt={16}>
            <Divider borderColor={dividerColor} />

            <Flex direction={{ base: "column", lg: "row" }} gap={{ base: 10, lg: 20 }}>
                {/* Description Column */}
                {description && (
                    <Box flex="1.5">
                        <Heading fontSize="xl" fontWeight="800" mb={6} letterSpacing="-0.02em">
                            About this item
                        </Heading>
                        <Text color={textColor} fontSize="lg" lineHeight="1.8">
                            {description}
                        </Text>
                    </Box>
                )}

                {/* Specifications Column */}
                {dynamicSpecs.length > 0 && (
                    <Box flex="1">
                        <Heading fontSize="xl" fontWeight="800" mb={6} letterSpacing="-0.02em">
                            Specifications
                        </Heading>
                        <Box
                            borderWidth="1px"
                            borderColor={dividerColor}
                            rounded="2xl"
                            overflow="hidden"
                        >
                            {dynamicSpecs.map(([key, value], idx) => (
                                <Flex
                                    key={idx}
                                    borderBottom={idx === dynamicSpecs.length - 1 ? "none" : "1px solid"}
                                    borderColor={dividerColor}
                                    bg={idx % 2 === 0 ? useColorModeValue("gray.50", "whiteAlpha.50") : "transparent"}
                                    p={4}
                                    align="center"
                                >
                                    <Text
                                        flex="1"
                                        fontSize="sm"
                                        color={labelColor}
                                        fontWeight="semibold"
                                        textTransform="capitalize"
                                    >
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </Text>
                                    <Text
                                        flex="1.2"
                                        fontSize="sm"
                                        color={valueColor}
                                        fontWeight="bold"
                                    >
                                        {String(value)}
                                    </Text>
                                </Flex>
                            ))}
                        </Box>
                    </Box>
                )}
            </Flex>
        </VStack>
    );
});

export default ProductAboutSection;
