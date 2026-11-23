import { HStack, Box, Image, Text, Badge } from "@chakra-ui/react";

export const ProductColumns = [
    {
        headerName: "Product",
        key: "name",
        type: "component",
        metaData: {
            component: (row: any) => (
                <HStack spacing={3} align="center">
                    <Box boxSize="44px" borderRadius="10px" overflow="hidden" flexShrink={0} bg="blackAlpha.200">
                        {row.images && row.images[0] ? (
                            <Image src={row.images[0]} alt={row.name} w="100%" h="100%" objectFit="cover" />
                        ) : (
                            <Box w="100%" h="100%" bg="whiteAlpha.100" />
                        )}
                    </Box>
                    <Box minW={0}>
                        <Text fontWeight="600" fontSize="sm" color="var(--merchant-text, #ffffff)" noOfLines={1} title={row.name}>
                            {row.name}
                        </Text>
                        <Text fontSize="xs" color="var(--merchant-text-muted, #94a3b8)" noOfLines={1}>
                            {row.company?.name || (typeof row.company === "string" ? row.company : "Direct Store")}
                        </Text>
                    </Box>
                </HStack>
            ),
        },
        props: {
            column: { minW: "260px" }
        }
    },
    {
        headerName: "Category",
        key: "category",
        type: "component",
        metaData: {
            component: (row: any) => (
                <Box>
                    <Text fontWeight="600" fontSize="sm" color="var(--merchant-text, #ffffff)">
                        {row.category?.name || "General"}
                    </Text>
                    {row.subCategories && row.subCategories.length > 0 && (
                        <Text fontSize="xs" color="var(--merchant-text-muted, #94a3b8)">
                            {row.subCategories.map((sub: any) => sub.name || sub).slice(0, 2).join(", ")}
                        </Text>
                    )}
                </Box>
            )
        }
    },
    {
        headerName: "Stock",
        key: "stock",
        type: "component",
        metaData: {
            component: (row: any) => {
                const stock = row.stock ?? row.quantity;
                const isOutOfStock = stock !== undefined && stock <= 0;
                const isLow = stock !== undefined && stock > 0 && stock <= 5;

                return (
                    <Badge
                        colorScheme={isOutOfStock ? "red" : isLow ? "orange" : "green"}
                        variant="subtle"
                        borderRadius="full"
                        px={2.5}
                        py={0.5}
                        fontSize="xs"
                        fontWeight="700"
                    >
                        {isOutOfStock ? "Out of Stock" : isLow ? `Only ${stock} left` : `In Stock (${stock ?? 0})`}
                    </Badge>
                );
            }
        }
    },
    {
        headerName: "Price",
        key: "price",
        type: "component",
        metaData: {
            component: (row: any) => (
                <HStack align="baseline" spacing={1.5}>
                    <Text fontWeight="700" fontSize="sm" color="var(--merchant-text, #ffffff)">
                        ₹{(Number(row.price) || 0).toLocaleString("en-IN")}
                    </Text>
                    {row.mrp > row.price && (
                        <Text as="s" fontSize="xs" color="var(--merchant-text-muted, #94a3b8)">
                            ₹{(Number(row.mrp) || 0).toLocaleString("en-IN")}
                        </Text>
                    )}
                </HStack>
            )
        }
    },
    {
        headerName: "Action",
        key: "action",
        type: "table-actions",
        props: {
            isSticky: true,
            width: "130px",
        }
    }
];

export default ProductColumns;
