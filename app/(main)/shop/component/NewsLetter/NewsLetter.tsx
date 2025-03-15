import { Box, Button, Container, Flex, Heading, Text } from '@chakra-ui/react'
import React from 'react'

const NewsLetter = () => {
  return (
    <Box>
        <Box bg="blue.50" py="10" mb="6">
        <Container maxW="container.xl">
          <Flex 
            direction={{ base: "column", md: "row" }} 
            alignItems="center" 
            justifyContent="space-between"
            gap="6"
          >
            <Box maxW={{ base: "full", md: "lg" }}>
              <Heading as="h2" size="lg" mb="2">Join Our Newsletter</Heading>
              <Text color="gray.600">
                Subscribe to receive updates on new products, special offers, and artisan stories.
              </Text>
            </Box>
            <Flex 
              direction={{ base: "column", sm: "row" }} 
              w={{ base: "full", md: "auto" }}
              gap="3"
            >
              <input
                placeholder="Your email address"
                style={{ 
                    padding: "0.5rem 1rem", 
                    borderRadius: "0.375rem", 
                    border: "1px solid #E2E8F0",
                    width: "100%",
                    minWidth: "250px"
                  }}
                />
                <Button colorScheme="blue" >
                  Subscribe
                </Button>
              </Flex>
            </Flex>
          </Container>
          
        </Box>
    </Box>
  )
}

export default NewsLetter