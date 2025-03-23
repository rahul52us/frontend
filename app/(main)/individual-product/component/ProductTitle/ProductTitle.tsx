import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { FiShare } from 'react-icons/fi';
import { IoIosArrowForward } from 'react-icons/io';

const ProductTitle = ({ brand, title }) => {
  return (
    <Box>
      <Flex align={'center'} gap={1} >
        <Text color={'gray.500'} fontWeight={500}>{brand}</Text>
        <Icon as={IoIosArrowForward} color={'gray.500'} />
      </Flex>
      <Flex justify={'space-between'} align={'center'} mt={1}>
        <Text fontSize={'lg'} fontWeight={700}>{title}</Text>
        <Icon mr={2} p={1} fontSize={'32px'} rounded={'lg'} borderWidth={1} as={FiShare} />
      </Flex>
    </Box>
  );
};

export default observer(ProductTitle);