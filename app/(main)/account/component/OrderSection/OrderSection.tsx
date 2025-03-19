"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { Badge, Box, Button, Divider, Flex, Grid, Heading, Image, Text, VStack, useColorModeValue } from "@chakra-ui/react";

// Mock order data
const orders = [
  {
    id: "ORD-12345",
    date: "March 15, 2023",
    status: "Delivered",
    total: "$249.99",
    items: [
      {
        id: 1,
        name: "Wireless Headphones",
        price: "$129.99",
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: 2,
        name: "Smart Watch",
        price: "$120.00",
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
  },
  {
    id: "ORD-12344",
    date: "February 28, 2023",
    status: "Delivered",
    total: "$89.99",
    items: [
      {
        id: 3,
        name: "Graphic T-Shirt",
        price: "$29.99",
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: 4,
        name: "Denim Jeans",
        price: "$60.00",
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
  },
  {
    id: "ORD-12343",
    date: "January 15, 2023",
    status: "Delivered",
    total: "$159.99",
    items: [
      {
        id: 5,
        name: "Bluetooth Speaker",
        price: "$79.99",
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: 6,
        name: "Phone Case",
        price: "$19.99",
        quantity: 2,
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: 7,
        name: "USB-C Cable",
        price: "$19.99",
        quantity: 2,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
  },
];

export const OrdersSection = () => {
  const [openOrders, setOpenOrders] = useState<string[]>([]);
  const accentColor = useColorModeValue("purple.500", "purple.200");
  const hoverBg = useColorModeValue("gray.50", "whiteAlpha.100");

  const toggleOrder = (orderId: string) => {
    if (openOrders.includes(orderId)) {
      setOpenOrders(openOrders.filter((id) => id !== orderId));
    } else {
      setOpenOrders([...openOrders, orderId]);
    }
  };

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Box pb={4}>
          <Heading as="h2" size="lg" fontWeight="bold" mb={2}>
            Order History
          </Heading>
          <Text fontSize="lg" color="gray.500">
            Your recent purchases and transactions
          </Text>
        </Box>

        {orders.length === 0 ? (
          <Box textAlign="center" py={12} borderRadius="xl" bg={hoverBg}>
            <Heading as="h3" size="md" fontWeight="medium" mb={2}>
              No orders found
            </Heading>
            <Text color="gray.500" mb={6}>
              Your purchased items will appear here
            </Text>
            <Button colorScheme="purple" size="lg">
              Explore Products
            </Button>
          </Box>
        ) : (
          <VStack spacing={4} align="stretch">
            {orders.map((order) => (
              <Box
                key={order.id}
                borderWidth="1px"
                borderRadius="2xl"
                overflow="hidden"
                boxShadow="sm"
                _hover={{ boxShadow: "md" }}
                transition="all 0.2s"
              >
                <Flex
                  justify="space-between"
                  align={{ base: "flex-start", md: "center" }}
                  p={6}
                  cursor="pointer"
                  _hover={{ bg: hoverBg }}
                  onClick={() => toggleOrder(order.id)}
                  flexDir={{ base: "column", md: "row" }}
                  gap={4}
                >
                  <VStack align="flex-start" spacing={1}>
                    <Text fontSize="sm" color="gray.500" fontWeight="500">
                      ORDER {order.id}
                    </Text>
                    <Text fontWeight="bold" fontSize="lg">
                      {order.date}
                    </Text>
                  </VStack>

                  <Flex align="center" gap={6}>
                    <Badge
                      colorScheme={order.status === "Delivered" ? "green" : "gray"}
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontSize="sm"
                    >
                      {order.status}
                    </Badge>
                    <Text fontSize="xl" fontWeight="bold" color={accentColor}>
                      {order.total}
                    </Text>
                    {openOrders.includes(order.id) ? (
                      <ChevronUpIcon boxSize={6} />
                    ) : (
                      <ChevronDownIcon boxSize={6} />
                    )}
                  </Flex>
                </Flex>

                {openOrders.includes(order.id) && (
                  <Box
                    p={6}
                    bg={useColorModeValue("purple.50", "gray.700")}
                    borderTopWidth="1px"
                  >
                    <Grid
                      templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                      gap={6}
                      mb={8}
                    >
                      {order.items.map((item) => (
                        <Flex
                          key={item.id}
                          bg={useColorModeValue("white", "gray.600")}
                          p={4}
                          borderRadius="xl"
                          align="center"
                          gap={4}
                          boxShadow="sm"
                        >
                          <Box
                            w={24}
                            h={24}
                            borderRadius="lg"
                            overflow="hidden"
                            flexShrink={0}
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              objectFit="cover"
                              w="full"
                              h="full"
                            />
                          </Box>
                          <Box flex={1}>
                            <Text fontWeight="bold" fontSize="lg" mb={1}>
                              {item.name}
                            </Text>
                            <Text color="gray.500" fontSize="sm">
                              Quantity: {item.quantity}
                            </Text>
                            <Text fontWeight="bold" color={accentColor} mt={2}>
                              ${(Number.parseFloat(item.price.replace("$", "")) * item.quantity).toFixed(2)}
                            </Text>
                          </Box>
                        </Flex>
                      ))}
                    </Grid>

                    <Flex
                      justify="space-between"
                      pt={4}
                      borderTopWidth="1px"
                      flexDir={{ base: "column", md: "row" }}
                      gap={4}
                    >
                      <Button
                        colorScheme="purple"
                        variant="outline"
                        leftIcon={<ExternalLinkIcon />}
                        w={{ base: "full", md: "auto" }}
                      >
                        View Order Details
                      </Button>
                      <Flex gap={4} w={{ base: "full", md: "auto" }}>
                        <Button
                          colorScheme="purple"
                          variant="solid"
                          flex={1}
                        >
                          Buy Again
                        </Button>
                        <Button
                          colorScheme="gray"
                          variant="ghost"
                          flex={1}
                        >
                          Leave Review
                        </Button>
                      </Flex>
                    </Flex>
                  </Box>
                )}
              </Box>
            ))}
          </VStack>
        )}
      </VStack>
    </Box>
  );
};