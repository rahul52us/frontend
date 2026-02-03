import { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  VStack,
  Text,
  Spinner,
  Center
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import OrderCard from './OrdersCard';
import stores from '../../../../store/stores';

const OrdersSection = observer(() => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await stores.orderStore.fetchMyOrders();
        if (res.success) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Center p={10}><Spinner /></Center>;

  return (
    <Box py={2}>
      <Heading mb={4} fontSize="2xl" fontWeight="bold">
        Your Orders
      </Heading>

      {orders.length === 0 ? (
        <Text color="gray.500">No orders found.</Text>
      ) : (
        <VStack spacing={6} align="stretch">
          {orders.map((order) => (
            <OrderCard key={order._id || order.orderId} order={order} />
          ))}
        </VStack>
      )}
    </Box>
  );
});

export default OrdersSection;