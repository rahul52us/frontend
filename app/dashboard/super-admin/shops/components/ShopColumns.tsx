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

const getReviewColor = (status: string) => {
    switch (status) {
        case "approved":
            return "green";
        case "changes_requested":
            return "orange";
        case "rejected":
            return "red";
        case "pending":
        default:
            return "purple";
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
        headerName: "Review",
        key: "reviewStatus",
        type: "component",
        metaData: {
            component: (row: any) => (
                <Box>
                    <Badge colorScheme={getReviewColor(row.reviewStatus)}>
                        {row.reviewStatus || "pending"}
                    </Badge>
                    {row.reviewRemarks ? (
                        <Text mt={1} fontSize="xs" color="gray.500" noOfLines={2} maxW="220px">
                            {row.reviewRemarks}
                        </Text>
                    ) : null}
                </Box>
            ),
        },
    },
    {
        headerName: "Visibility",
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
                <Text>{row.ratings?.averageRating?.toFixed(1) || 0} ({row.ratings?.totalRatings || 0})</Text>
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
