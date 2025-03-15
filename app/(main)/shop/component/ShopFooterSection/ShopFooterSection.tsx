import { Box, Container, Flex, Image, Text } from '@chakra-ui/react'
import React from 'react'

const ShopFooterSection = ({shopData}) => {
  return (
         <Box as="footer" borderTop="1px" borderColor="gray.200" py={{ base: "6", md: "8" }}>
          <Container maxW="container.xl" px="4">
            <Flex flexDir={{ base: "column", md: "row" }} justifyContent="space-between" alignItems="center">
              <Flex alignItems="center" mb={{ base: "4", md: "0" }}>
                <Box position="relative" w="40px" h="40px" mr="3">
                  <Image
                    src={shopData.images.logo}
                    alt={shopData.name}
                    h={'100%'}
                    objectFit="cover"
                  />
                </Box>
                <Text fontWeight="medium">{shopData.name}</Text>
              </Flex>
              <Text fontSize="sm" color="gray.500">
                © {new Date().getFullYear()} {shopData.name}. All rights reserved.
              </Text>
            </Flex>
          </Container>
        </Box>
  )
}

export default ShopFooterSection