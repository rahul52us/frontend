import {
  Box,
  Heading,
  VStack
} from '@chakra-ui/react';
import OrderCard from './OrdersCard';
import { orders } from './utils/constant';


const OrdersSection = () => {
  return (
    <Box  py={2}>
      <Heading mb={4} fontSize="2xl" fontWeight="bold">
        Your Orders
      </Heading>

      <VStack spacing={6} align="stretch">
        {orders.map((order) => (
          <OrderCard key={order?.id} order={order} />
        ))}
      </VStack>
    </Box>
  );
};

export default OrdersSection;