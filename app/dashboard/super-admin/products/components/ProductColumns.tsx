import { HStack, Box, Image, Text } from "@chakra-ui/react";

export const ProductColumns = [
    {
        headerName: "Product",
        key: "name",
        type: "component",
        metaData: {
            component: (row: any) => (
                <HStack>
                    <Box boxSize="40px" borderRadius="md" overflow="hidden" flexShrink={0}>
                        {row.images && row.images[0] ? (
                            <Image src={row.images[0]} alt={row.name} w="100%" h="100%" objectFit="cover" />
                        ) : (
                            <Box w="100%" h="100%" bg="gray.200" />
                        )}
                    </Box>
                    <Text fontWeight="medium" noOfLines={2} title={row.name}>{row.name}</Text>
                </HStack>
            ),
        },
        props: {
            column: { minW: "200px" }
        }
    },
    {
        headerName: "Category",
        key: "category",
        type: "component",
        metaData: {
            component: (row: any) => (
                <Box>
                    <Text fontWeight="bold">{row.category?.name || "--"}</Text>
                    {row.subCategories && row.subCategories.length > 0 && (
                        <Text fontSize="xs" color="gray.500">
                            {row.subCategories.map((sub: any) => sub.name).join(", ")}
                        </Text>
                    )}
                </Box>
            )
        }
    },
    {
        headerName: "Shop",
        key: "company",
        type: "component",
        metaData: {
            component: (row: any) => (
                // If company is populated, show name, else show ID or --
                <Text>{row.company?.name || row.company || "--"}</Text>
            )
        }
    },
    {
        headerName: "Price",
        key: "price",
        type: "component",
        metaData: {
            component: (row: any) => (
                <Text>₹{row.price}</Text>
            )
        }
    },
    {
        headerName: "Action",
        key: "action",
        type: "table-actions",
        props: {
            isSticky: true,
        }
    }
];
