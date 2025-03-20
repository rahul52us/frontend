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

  return (
    <Card
      variant="outline"
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
    
      // mb={6}
      bg={cardBg}
    >
      <CardBody>
        <VStack align="stretch" spacing={2}>
          {/* Order Header */}
          <HStack justify="space-between">
            <VStack align="start" spacing={1}>
              <Heading fontSize={"lg"}>Order {order?.id}</Heading>
              <Text fontSize="sm" color="gray.500">
                Ordered on{" "}
                {new Date(order?.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Text>
            </VStack>
            <OrderStatusBadge status={order?.status} />
          </HStack>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 1 }} spacing={4}>
            {order.products.map((product) => (
              <Flex
                key={product.id}
                align="center"
                p={3}
                borderWidth="1px"
                borderRadius="lg"
                // shadow={"sm"}
              >
                <Image
                  src={product?.image}
                  alt={product?.name}
                  // boxSize="80px"
                  w={"120px"}
                  h={"100%"}
                  objectFit="contain"
                  mr={4}
                />
                <VStack align="start" spacing={1}>
                  <Text fontWeight="medium">{product?.name}</Text>
                  <Text fontSize="sm" color="gray.500">
                    Qty: {product?.quantity}
                  </Text>
                  <HStack>
                    <Icon as={FaRupeeSign} color="green.500" boxSize={3} />
                    <Text>
                      {(product?.price * product?.quantity).toLocaleString(
                        "en-IN"
                      )}
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
                {order?.total.toLocaleString("en-IN", {
                  maximumFractionDigits: 0,
                })}
              </Text>
            </HStack>
          </HStack>
        </VStack>
      </CardBody>

      {/* <CardFooter pt={0}>
          <Text fontSize="sm" color="gray.500">
            {order.products.length} item{order.products.length > 1 ? 's' : ''} in this order
          </Text>
        </CardFooter> */}
    </Card>
  );
};

export default observer(OrderCard);
