import { Box, Center, Flex, Icon, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { TbExchange, TbRefresh, TbTruckDelivery } from 'react-icons/tb';

const ReturnExchange = ({ services }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'return':
        return TbRefresh;
      case 'exchange':
        return TbExchange;
      case 'freeShipping':
        return TbTruckDelivery;
      default:
        return TbExchange;
    }
  };

  return (
    <Flex gap={4} wrap="wrap">
      {services.map((service, index) => (
        <Box
          key={index}
          bgGradient={'linear(to-br, purple.50, blue.50)'}
          py={3}
          px={2}
          rounded={'2xl'}
          w={'130px'}
          shadow={'base'}
        >
          <Center>
            <Icon as={getIcon(service.type)} fontSize={'34px'} color={'gray.500'} />
          </Center>
          <Text mt={2} fontWeight={500} color={'gray.500'} fontSize={'xs'} textAlign={'center'}>
            {service.label}
          </Text>
        </Box>
      ))}
    </Flex>
  );
};

export default observer(ReturnExchange);