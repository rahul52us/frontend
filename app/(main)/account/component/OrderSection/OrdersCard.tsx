import {
  Card,
  CardBody,
  Divider,
  Flex,
  HStack,
  Heading,
  Icon,
  Image,
  SimpleGrid,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { FaRupeeSign } from "react-icons/fa";
import OrderStatusBadge from "./OrderStatusBadge";

const OrderCard = ({ order }) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const orderItems = order.items || [];
  const orderTotal = order.quote?.price?.value || order.total || 0;

  return (
    <Card
      variant="outline"
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      bg={cardBg}
    >
      <CardBody>
        <VStack align="stretch" spacing={2}>
          {/* Order Header */}
          <HStack justify="space-between">
            <VStack align="start" spacing={1}>
              <Heading fontSize={"lg"}>Order #{order?.orderId}</Heading>
              <Text fontSize="sm" color="gray.500">
                Ordered on{" "}
                {order?.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }) : "N/A"}
              </Text>
            </VStack>
            <OrderStatusBadge status={order?.orderStatus || "pending"} />
          </HStack>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 1 }} spacing={4}>
            {orderItems.map((item, index) => (
              <Flex
                key={item.item_id || index}
                align="center"
                p={3}
                borderWidth="1px"
                borderRadius="lg"
              >
                <Image
                  src={item.productImage || "/placeholder.png"}
                  alt={item.productName}
                  w={"80px"}
                  h={"80px"}
                  objectFit="contain"
                  mr={4}
                  fallbackSrc="https://via.placeholder.com/80"
                />
                <VStack align="start" spacing={1} flex={1}>
                  <Text fontWeight="medium" noOfLines={2}>{item.productName}</Text>
                  <Text fontSize="sm" color="gray.500">
                    Qty: {item.quantity}
                  </Text>
                  <HStack>
                    <Icon as={FaRupeeSign} color="green.500" boxSize={3} />
                    <Text>
                      {(item.unitPrice * item.quantity).toLocaleString("en-IN")}
                    </Text>
                  </HStack>
                </VStack>
              </Flex>
            ))}
          </SimpleGrid>

          <Divider />

          {/* Order Summary */}
          <HStack justify="space-between">
            <Text fontSize="lg" fontWeight="semibold">
              Total Amount:
            </Text>
            <HStack>
              <Icon as={FaRupeeSign} color="green.500" boxSize={5} />
              <Text fontSize="xl" fontWeight="bold">
                {parseFloat(orderTotal.toString()).toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </Text>
            </HStack>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default observer(OrderCard);
