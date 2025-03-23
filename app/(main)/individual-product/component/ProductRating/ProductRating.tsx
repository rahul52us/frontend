import { Flex, Tag, TagLeftIcon, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { FiStar } from 'react-icons/fi';

const ProductRating = ({ rating, reviews }) => {
  return (
    <Flex align={'center'} gap={2} my={2}>
      <Tag colorScheme='green' variant={'solid'}>
        <TagLeftIcon as={FiStar} />
        {rating}
      </Tag>
      <Text fontSize={'sm'} color={'gray.500'}>({reviews} reviews)</Text>
    </Flex>
  );
};

export default observer(ProductRating);