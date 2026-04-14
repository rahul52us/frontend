"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import CustomDrawer from "../../../../component/common/Drawer/CustomDrawer";

type ReviewAction = "approve" | "request_changes" | "reject";
type VisibilityAction = "active" | "inactive" | "suspended";

interface ReviewShopDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  shop: any;
  onSubmit: (action: ReviewAction, remarks: string) => Promise<void> | void;
  onVisibilitySubmit: (status: VisibilityAction, remarks: string) => Promise<void> | void;
  isSubmitting?: boolean;
}

const getReviewStatusColor = (status?: string) => {
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

const getShopStatusColor = (status?: string) => {
  switch (status) {
    case "active":
      return "green";
    case "inactive":
      return "gray";
    case "suspended":
      return "red";
    case "pending":
    default:
      return "orange";
  }
};

const ReviewShopDrawer: React.FC<ReviewShopDrawerProps> = ({
  isOpen,
  onClose,
  shop,
  onSubmit,
  onVisibilitySubmit,
  isSubmitting = false,
}) => {
  const [remarks, setRemarks] = useState("");
  const [activeAction, setActiveAction] = useState<ReviewAction | VisibilityAction | null>(null);

  useEffect(() => {
    if (isOpen) {
      setRemarks(shop?.reviewRemarks || "");
      setActiveAction(null);
    }
  }, [isOpen, shop]);

  const gallery = useMemo(() => {
    if (!Array.isArray(shop?.gallery)) return [];
    return shop.gallery
      .map((item: any) => item?.file?.url)
      .filter(Boolean)
      .slice(0, 6);
  }, [shop]);

  const handleSubmit = async (action: ReviewAction) => {
    setActiveAction(action);
    try {
      await onSubmit(action, remarks);
    } finally {
      setActiveAction(null);
    }
  };

  const handleVisibilitySubmit = async (status: VisibilityAction) => {
    setActiveAction(status);
    try {
      await onVisibilitySubmit(status, remarks);
    } finally {
      setActiveAction(null);
    }
  };

  if (!shop) return null;

  return (
    <CustomDrawer title="Review Shop Submission" open={isOpen} close={onClose} size="xl">
      <Stack spacing={5} pb={6}>
        <Box borderWidth="1px" borderColor="gray.200" borderRadius="2xl" p={5} bg="white">
          <HStack align="start" spacing={4}>
            <Image
              src={shop.logo?.url || shop.coverImage?.url || "https://via.placeholder.com/120"}
              alt={shop.name}
              boxSize="72px"
              objectFit="cover"
              borderRadius="xl"
              bg="gray.100"
            />
            <VStack align="start" spacing={2} flex={1}>
              <Text fontSize="xl" fontWeight="700" color="gray.800">
                {shop.name}
              </Text>
              <HStack spacing={2} flexWrap="wrap">
                <Badge colorScheme="blue">{shop.companyCode || "No code"}</Badge>
                <Badge colorScheme={getReviewStatusColor(shop.reviewStatus)}>
                  {shop.reviewStatus || "pending"}
                </Badge>
                <Badge colorScheme={getShopStatusColor(shop.shopStatus)}>
                  {shop.shopStatus || "pending"}
                </Badge>
              </HStack>
              <Text fontSize="sm" color="gray.500">
                Submitted {shop.createdAt ? new Date(shop.createdAt).toLocaleString() : "recently"}
              </Text>
            </VStack>
          </HStack>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Box borderWidth="1px" borderColor="gray.200" borderRadius="2xl" p={5} bg="white">
            <Text fontWeight="700" color="gray.800" mb={3}>
              Shop Details
            </Text>
            <VStack align="start" spacing={2}>
              <Text color="gray.600">
                <Text as="span" fontWeight="600" color="gray.800">
                  Description:
                </Text>{" "}
                {shop.description || "Not provided"}
              </Text>
              <Text color="gray.600">
                <Text as="span" fontWeight="600" color="gray.800">
                  GST:
                </Text>{" "}
                {shop.gstNumber || "Not provided"}
              </Text>
              <Text color="gray.600">
                <Text as="span" fontWeight="600" color="gray.800">
                  Contact:
                </Text>{" "}
                {shop.contactInfo?.phone || "No phone"} {shop.contactInfo?.email ? `• ${shop.contactInfo.email}` : ""}
              </Text>
              <Text color="gray.600">
                <Text as="span" fontWeight="600" color="gray.800">
                  Website:
                </Text>{" "}
                {shop.contactInfo?.website || "Not provided"}
              </Text>
            </VStack>
          </Box>

          <Box borderWidth="1px" borderColor="gray.200" borderRadius="2xl" p={5} bg="white">
            <Text fontWeight="700" color="gray.800" mb={3}>
              Location
            </Text>
            <VStack align="start" spacing={2}>
              <Text color="gray.600">{shop.location?.address || "Address not provided"}</Text>
              <Text color="gray.600">
                {[shop.location?.city, shop.location?.state, shop.location?.postalCode]
                  .filter(Boolean)
                  .join(", ") || "City/state/postal code missing"}
              </Text>
              <Text color="gray.600">{shop.location?.country || "Country not provided"}</Text>
              {Array.isArray(shop.location?.coordinates) && shop.location.coordinates.length >= 2 ? (
                <Text fontSize="sm" color="gray.500">
                  Coordinates: {shop.location.coordinates[1]}, {shop.location.coordinates[0]}
                </Text>
              ) : null}
            </VStack>
          </Box>
        </SimpleGrid>

        <Box borderWidth="1px" borderColor="gray.200" borderRadius="2xl" p={5} bg="white">
          <Text fontWeight="700" color="gray.800" mb={3}>
            Media Preview
          </Text>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3}>
            {[shop.logo?.url, shop.coverImage?.url, ...gallery]
              .filter(Boolean)
              .slice(0, 6)
              .map((imageUrl: string, index: number) => (
                <Image
                  key={`${imageUrl}-${index}`}
                  src={imageUrl}
                  alt={`${shop.name} media ${index + 1}`}
                  h="112px"
                  w="100%"
                  objectFit="cover"
                  borderRadius="xl"
                  bg="gray.100"
                />
              ))}
          </SimpleGrid>
          {!shop.logo?.url && !shop.coverImage?.url && gallery.length === 0 ? (
            <Text mt={3} color="gray.500">
              No images uploaded yet.
            </Text>
          ) : null}
        </Box>

        <Box borderWidth="1px" borderColor="gray.200" borderRadius="2xl" p={5} bg="white">
          <Text fontWeight="700" color="gray.800" mb={3}>
            Review Feedback
          </Text>
          <FormControl>
            <FormLabel fontSize="sm" color="gray.600">
              Remarks for the seller (required for request changes or reject)
            </FormLabel>
            <Textarea
              value={remarks}
              onChange={(event) => setRemarks(event.target.value)}
              placeholder="Add approval notes, change requests, or rejection reason..."
              minH="140px"
              resize="vertical"
            />
          </FormControl>
        </Box>

        <Box borderWidth="1px" borderColor="gray.200" borderRadius="2xl" p={5} bg="white">
          <Text fontWeight="700" color="gray.800" mb={2}>
            Visibility Controls
          </Text>
          <Text fontSize="sm" color="gray.500" mb={4}>
            Use these when you need to moderate the shop after review. Remarks above will be included in the status update for the seller.
          </Text>
          <HStack spacing={3} flexWrap="wrap">
            <Button
              colorScheme="green"
              variant="outline"
              onClick={() => handleVisibilitySubmit("active")}
              isLoading={isSubmitting && activeAction === "active"}
            >
              Activate
            </Button>
            <Button
              colorScheme="gray"
              variant="outline"
              onClick={() => handleVisibilitySubmit("inactive")}
              isLoading={isSubmitting && activeAction === "inactive"}
            >
              Mark Inactive
            </Button>
            <Button
              colorScheme="red"
              variant="outline"
              onClick={() => handleVisibilitySubmit("suspended")}
              isLoading={isSubmitting && activeAction === "suspended"}
            >
              Suspend
            </Button>
          </HStack>
        </Box>

        <Box borderWidth="1px" borderColor="gray.200" borderRadius="2xl" p={5} bg="white">
          <Text fontWeight="700" color="gray.800" mb={3}>
            Review History
          </Text>
          <VStack align="stretch" spacing={3}>
            {Array.isArray(shop.statusHistory) && shop.statusHistory.length > 0 ? (
              [...shop.statusHistory].reverse().map((item: any, index: number) => (
                <Box key={`${item.updatedAt || index}-${index}`} borderWidth="1px" borderColor="gray.100" borderRadius="xl" p={4}>
                  <HStack justify="space-between" align="start" spacing={3}>
                    <VStack align="start" spacing={2}>
                      <HStack spacing={2}>
                        <Badge colorScheme={getShopStatusColor(item.status)}>{item.status}</Badge>
                        {item.reviewStatus ? (
                          <Badge colorScheme={getReviewStatusColor(item.reviewStatus)}>
                            {item.reviewStatus}
                          </Badge>
                        ) : null}
                      </HStack>
                      <Text fontSize="sm" color="gray.500">
                        {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "Unknown time"}
                      </Text>
                    </VStack>
                  </HStack>
                  {item.remarks ? (
                    <Text mt={3} fontSize="sm" color="gray.600">
                      {item.remarks}
                    </Text>
                  ) : null}
                </Box>
              ))
            ) : (
              <Text color="gray.500">No review history yet.</Text>
            )}
          </VStack>
        </Box>

        <Divider />

        <HStack justify="flex-end" spacing={3} pb={2} flexWrap="wrap">
          <Button variant="outline" onClick={onClose} isDisabled={isSubmitting}>
            Close
          </Button>
          <Button
            colorScheme="red"
            variant="outline"
            onClick={() => handleSubmit("reject")}
            isLoading={isSubmitting && activeAction === "reject"}
          >
            Reject
          </Button>
          <Button
            colorScheme="orange"
            onClick={() => handleSubmit("request_changes")}
            isLoading={isSubmitting && activeAction === "request_changes"}
          >
            Request Changes
          </Button>
          <Button
            colorScheme="green"
            onClick={() => handleSubmit("approve")}
            isLoading={isSubmitting && activeAction === "approve"}
          >
            Approve
          </Button>
        </HStack>
      </Stack>
    </CustomDrawer>
  );
};

export default ReviewShopDrawer;
