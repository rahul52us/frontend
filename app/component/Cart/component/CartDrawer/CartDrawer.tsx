import { ArrowLeftIcon } from '@chakra-ui/icons'
import {
  Box, Button, Drawer, DrawerBody, DrawerContent, DrawerFooter,
  DrawerHeader, DrawerOverlay, Flex, Icon, Text, useDisclosure, VStack
} from '@chakra-ui/react'
import { useState } from 'react'
import { FaLocationDot } from 'react-icons/fa6'
import CartItem from '../CartItem/CartItem'
import AddressModal from '../DeliveryAddressModal/DelivaryAddressModal'
import { observer } from 'mobx-react-lite'
import stores from '../../../../store/stores'
import { useRouter } from 'next/navigation'
import { authentication } from '../../../../config/utils/routes'

interface Address {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  id: number;
}

const CartDrawer = observer(({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { cartStore, auth } = stores;
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      name: 'Home',
      line1: '123 Main Street',
      line2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
      isDefault: true
    },
    {
      id: 2,
      name: 'Work',
      line1: '456 Business Ave',
      city: 'New York',
      state: 'NY',
      postalCode: '10002',
      country: 'USA',
      isDefault: false
    }
  ])

  const [selectedAddress, setSelectedAddress] = useState<number>(1)
  const { isOpen: isAddressModalOpen, onOpen: onAddressModalOpen, onClose: onAddressModalClose } = useDisclosure()

  const updateQuantity = (id: any, newQuantity: number) => {
    cartStore.updateQuantity(id, newQuantity);
  }

  const handleCheckout = () => {
    if (!auth.user) {
      // Need to implement later
      onClose();
      router.push(authentication.login);
    } else {
      alert("Proceeding to checkout (Order flow pending)");
    }
  }

  const totalAmount = cartStore.cartItems.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0)
  const currentAddress = addresses.find(addr => addr.id === selectedAddress) || addresses[0]

  return (
    <Box>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        size={'sm'}
      >
        <DrawerOverlay />
        <DrawerContent borderLeftRadius={'2xl'} maxW={{ lg: '28rem' }}>
          <DrawerHeader shadow={'md'} borderBottomRadius={"lg"} py={6}>
            <Flex gap={3} align={'center'}>
              <Icon as={ArrowLeftIcon} boxSize={'16px'} color={'purple.700'} onClick={onClose} cursor="pointer" />
              <Text fontSize={'lg'} fontWeight={600} color={'purple.700'}>Your Cart ({cartStore.cartItems.length})</Text>
            </Flex>
          </DrawerHeader>

          <DrawerBody py={4}>
            <VStack spacing={4} align="stretch">
              {cartStore.cartItems.length === 0 ? (
                <Text textAlign="center" py={10}>Your cart is empty</Text>
              ) : (
                cartStore.cartItems.map(item => (
                  <CartItem
                    key={item.product._id || item.product.id}
                    item={{
                      id: item.product._id || item.product.id,
                      name: item.product.name,
                      image: item.product.image || (item.product.images?.length ? item.product.images[0] : ""),
                      price: item.product.price,
                      quantity: item.quantity
                    }}
                    updateQuantity={updateQuantity}
                  />
                ))
              )}
            </VStack>
            {/* <CartItemSkeleton /> */}
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px" pt={4} flexDirection={'column'} justifyContent={'flex-start'}>
            <Flex
              mb={4}
              align={'center'}
              gap={2}
              justify={'start'}
              w={'100%'}
              onClick={onAddressModalOpen}
              cursor="pointer"
              _hover={{ bg: 'gray.50' }}
              p={2}
              rounded="md"
            >
              <Icon as={FaLocationDot} color={'purple.500'} fontSize={'20px'} />
              <Box flex="1">
                <Text fontWeight={700}>Delivering to {currentAddress?.name}</Text>
                <Text fontSize={'sm'} color={'gray.500'}>
                  {currentAddress?.line1}{currentAddress?.line2 ? `, ${currentAddress.line2}` : ''}
                </Text>
                <Text fontSize={'sm'} color={'gray.500'}>
                  {currentAddress?.city}, {currentAddress?.state} {currentAddress?.postalCode}
                </Text>
              </Box>
              <Text color="purple.500" fontSize="sm" fontWeight={500}>Change</Text>
            </Flex>

            <Button
              colorScheme='purple'
              fontWeight={500}
              w="full"
              size="lg"
              isDisabled={cartStore.cartItems.length === 0}
              rounded={'xl'}
              onClick={handleCheckout}
            >
              Checkout - ₹{totalAmount}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={onAddressModalClose}
        addresses={addresses}
        selectedAddress={selectedAddress}
        onSelectAddress={(addressId) => setSelectedAddress(addressId)}
        onAddNewAddress={async (newAddress) => {
          const newId = Math.max(...addresses.map(a => a.id), 0) + 1
          const updatedAddresses = [...addresses, {
            ...newAddress,
            id: newId,
            line2: newAddress.line2 || undefined
          }]

          if (newAddress.isDefault) {
            setAddresses(updatedAddresses.map(addr =>
              addr.id !== newId ? { ...addr, isDefault: false } : addr
            ))
            setSelectedAddress(newId)
          } else {
            setAddresses(updatedAddresses)
          }
        }}
      />
    </Box>
  )
})

export default CartDrawer