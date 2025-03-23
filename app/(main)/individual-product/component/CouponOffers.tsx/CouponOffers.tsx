import { Box, Divider, Flex, Icon, Text } from '@chakra-ui/react';
import { CiDiscount1 } from 'react-icons/ci';

const CouponOffers = ({ offers }) => {
  return (
    <Box my={8}>
      <Flex gap={2} align={'center'}>
        <Text whiteSpace={'nowrap'} fontWeight={600} color={'gray.500'}>Coupon & Offers</Text>
        <Divider borderColor={'gray.400'} />
      </Flex>
      {offers.map((offer, index) => (
        <Flex key={index} gap={4} align={'center'} mt={2}>
          <Icon as={CiDiscount1} fontSize={'24px'} color={'green.500'} />
          <Text as={'span'} fontWeight={500} color={'gray.500'}>{offer}</Text>
        </Flex>
      ))}
    </Box>
  );
};

export default CouponOffers;