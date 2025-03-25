import { AddIcon, MinusIcon } from '@chakra-ui/icons'
import { Flex, Image, Text, HStack, IconButton, Divider, Box } from '@chakra-ui/react'

const CartItem = ({ item, updateQuantity }) => {
  return (
    <Flex 
      align="center" 
      gap={3}
      py={2}
      borderBottomWidth="1px"
    >
      {/* Image - Fixed size */}
      <Box flexShrink={0} width="54px" height="60px" borderWidth={1}
        rounded={'md'} 
      >
        <Image 
          width="100%"
          height="100%"
          src={item.image} 
          objectFit={'contain'} 
          alt={item.name}
        />
      </Box>
      
      <Flex align="center" flex={1} minWidth={0} gap={2}>
        <Text 
          fontWeight={500} 
          fontSize={'sm'} 
          flex={1}
          minWidth={0}
          noOfLines={2}
        >
          {item.name}
        </Text>
        
        {/* Quantity controls */}
        <HStack 
          borderWidth="1px" 
          borderRadius="md" 
          spacing={0} 
          bg={'purple.50'}
          divider={<Divider orientation="vertical" height="6" />}
          flexShrink={0}
        >
          <IconButton
            size="xs"
            variant="ghost"
            icon={<MinusIcon boxSize={3} />}
            color={'purple.500'}
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            aria-label="Decrease quantity"
            borderRadius="md 0 0 md"
            />
          <Text px={2} minWidth="30px" textAlign="center">{item.quantity}</Text>
          <IconButton
            size="xs"
            variant="ghost"
            color={'purple.500'}
            icon={<AddIcon boxSize={3} />}
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            aria-label="Increase quantity"
            borderRadius="0 md md 0"
          />
        </HStack>
        
        {/* Price - Fixed width */}
        <Text 
          fontWeight={600} 
          width="70px"
          textAlign="right"
          flexShrink={0}
        >
          ₹{item.price * item.quantity}
        </Text>
      </Flex>
    </Flex>
  )
}

export default CartItem