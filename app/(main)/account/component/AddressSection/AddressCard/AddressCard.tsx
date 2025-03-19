import React from 'react';  
import {  
  Box, Card, CardBody, CardFooter, Flex, Heading, Text, VStack, Badge, Button, Divider  
} from '@chakra-ui/react';  
import { FaHome, FaMapMarkerAlt, FaCity, FaGlobeAmericas, FaEdit, FaTrash } from 'react-icons/fa';  

const AddressCard = ({ address, handleEdit, handleSetDefault, handleDelete }) => {  
  return (  
    <Card   
      key={address.id}  
      position="relative"  
      overflow="hidden"  
      borderWidth="1px"  
      borderColor="gray.100"  
      _hover={{   
        transform: "translateY(-2px)",  
        boxShadow: "lg",  
      }}  
      transition="all 0.2s cubic-bezier(.08,.52,.52,1)"  
      boxShadow="md"  
      borderRadius="xl"  
    >  
      {/* Gradient accent for default address */}  
      {address.isDefault && (  
        <Box  
          position="absolute"  
          top={0}  
          left={0}  
          w="4px"  
          h="full"  
          bgGradient="linear(to-b, teal.400, blue.400)"  
        />  
      )}  

      <CardBody pb={2}>  
        <Flex align="center" gap={2} mb={4}>  
          <Box  
            p={2}  
            borderRadius="lg"  
            bg={address.isDefault ? "teal.50" : "gray.50"}  
          >  
            <FaHome size={20} color={address.isDefault ? "teal.500" : "gray.500"} />  
          </Box>  
          <Flex justify={'space-between'} w={'100%'}>  
            <Heading as="h3" size="md" fontWeight="semibold">  
              {address.name}   
            </Heading>  
            {address.isDefault && (  
              <Badge   
                colorScheme="teal"   
                variant="subtle"  
                mt={1}  
                borderRadius="md"  
                px={2}  
                py={1}  
              >  
                Primary Address  
              </Badge>  
            )}  
          </Flex>  
        </Flex>  

        <VStack spacing={2} align="start" color="gray.600" fontSize="sm">  
          <Flex align="center" gap={2}>  
            <FaMapMarkerAlt color="gray.400" />  
            <Text>{address.line1}</Text>  
          </Flex>  
          {address.line2 && (  
            <Flex align="center" gap={2}>  
              <Box w="16px" /> {/* Spacer for alignment */}  
              <Text>{address.line2}</Text>  
            </Flex>  
          )}  
          <Flex align="center" gap={2}>  
            <FaCity color="gray.400" />  
            <Text>  
              {address.city}, {address.state} {address.postalCode}  
            </Text>  
          </Flex>  
          <Flex align="center" gap={2}>  
            <FaGlobeAmericas color="gray.400" />  
            <Text>{address.country}</Text>  
          </Flex>  
        </VStack>  
      </CardBody>  

      <CardFooter p={3} bg="gray.50">  
        <Flex justify="space-between" w="full" align="center">  
          <Button  
            size="sm"  
            variant="ghost"  
            colorScheme="gray"  
            leftIcon={<FaEdit />}  
            onClick={() => handleEdit(address)}  
            _hover={{ bg: "white", boxShadow: "sm" }}  
          >  
            Edit  
          </Button>  
          
          <Flex gap={2} align="center">  
            {!address.isDefault && (  
              <Button  
                size="sm"  
                variant="outline"  
                colorScheme="blue"  
                onClick={() => handleSetDefault(address.id)}  
                _hover={{ transform: "scale(1.05)" }}  
              >  
                Set Default  
              </Button>  
            )}  
            <Divider orientation="vertical" h={6} />  
            <Button  
              variant="ghost"  
              colorScheme="red"  
              size="sm"  
              leftIcon={<FaTrash />}  
              onClick={() => handleDelete(address.id)}  
              _hover={{   
                bg: "red.50",  
                "& > svg": { transform: "scale(1.2)" }   
              }}  
            >  
              Delete  
            </Button>  
          </Flex>  
        </Flex>  
      </CardFooter>  

      {/* Hover overlay */}  
      <Box  
        position="absolute"  
        top={0}  
        left={0}  
        w="full"  
        h="full"  
        bg="blackAlpha.50"  
        opacity={0}  
        _hover={{ opacity: 1 }}  
        transition="opacity 0.2s"  
        pointerEvents="none"  
      />  
    </Card>  
  );  
};  

export default AddressCard;  