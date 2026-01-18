import { HStack, Avatar, Text, Badge, Box } from "@chakra-ui/react";

const getStatusColor = (status: string) => {
    switch (status) {
        case "active":
            return "green";
        case "pending":
            return "orange";
        case "suspended":
            return "red";
        default:
            return "gray";
    }
};

export const ShopColumns = [
    {
        headerName: "Shop Name",
        key: "name",
        type: "component",
        metaData: {
            component: (row: any) => (
                <HStack>
                    <Avatar name={row.name} src={row.logo?.url} size="sm" />
                    <Text fontWeight="medium">{row.name}</Text>
                </HStack>
            ),
        },
    },
    {
        headerName: "Description",
        key: "description",
        type: "component",
        metaData: {
            component: (row: any) => (
                <Text noOfLines={1} maxW="200px">
                    {row.description || "N/A"}
                </Text>
            )
        }
    },
    {
        headerName: "Status",
        key: "shopStatus",
        type: "component",
        metaData: {
            component: (row: any) => (
                <Box>
                    <Badge colorScheme={getStatusColor(row.shopStatus)}>
                        {row.shopStatus}
                    </Badge>
                    {!row.isActive && (
                        <Badge ml={2} colorScheme="red">
                            Inactive
                        </Badge>
                    )}
                </Box>
            ),
        },
    },
    {
        headerName: "Rating",
        key: "rating",
        type: "component",
        metaData: {
            component: (row: any) => (
                <Text>{row.ratings?.averageRating?.toFixed(1) || 0} ({row.ratings?.count || 0})</Text>
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
