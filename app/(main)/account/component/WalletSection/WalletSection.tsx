"use client";

import {
    Badge,
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Flex,
    Grid,
    Heading,
    HStack,
    Icon,
    IconButton,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    useColorModeValue,
    VStack
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { FaArrowDown, FaArrowUp, FaCreditCard, FaEdit, FaMobileAlt, FaPlus, FaWallet } from "react-icons/fa";

// Mock wallet data
const walletBalance = 250.75;
const transactions = [
  {
    id: 1,
    type: "credit",
    amount: 50.0,
    date: "March 18, 2023",
    description: "Refund for Order #ORD-12342",
  },
  {
    id: 2,
    type: "debit",
    amount: 89.99,
    date: "March 15, 2023",
    description: "Payment for Order #ORD-12345",
  },
  {
    id: 3,
    type: "credit",
    amount: 100.0,
    date: "March 10, 2023",
    description: "Added funds",
  },
];

const paymentMethods = [
  {
    id: 1,
    type: "Visa",
    last4: "4242",
    expiry: "04/25",
    isDefault: true,
  },
  {
    id: 2,
    type: "Mastercard",
    last4: "5555",
    expiry: "08/24",
    isDefault: false,
  },
];

export const WalletSection = observer(() => {
    const cardBg = useColorModeValue("white", "gray.700");
    const borderColor = useColorModeValue("gray.100", "gray.600");
  
    const formatRupees = (amount) => 
      new Intl.NumberFormat('en-IN', { 
        style: 'currency', 
        currency: 'INR' 
      }).format(amount);
  
    return (
      <Box>
        <VStack align="stretch" spacing={6}>
          <Box>
            <Heading as="h2" size="lg" fontWeight="bold" mb={2}>
              My Wallet
            </Heading>
            <Text fontSize="lg" color="gray.500">
              Manage your balance and payment methods
            </Text>
          </Box>
  
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
            {/* Wallet Balance Card */}
            <Card 
              borderRadius="2xl" 
              boxShadow="lg"
              bgGradient="linear(to-br, purple.50, blue.50)"
              position="relative"
              overflow="hidden"
            >
              <Box 
                position="absolute" 
                top="-20px" 
                right="-20px" 
                w="100px" 
                h="100px" 
                bg="purple.100" 
                borderRadius="full"
              />
              <CardHeader pb={3}>
                <Heading as="h3" size="md" fontWeight="bold" color="purple.600">
                  Wallet Balance
                </Heading>
                <Text color="purple.500" fontSize="sm">Available for purchases & withdrawals</Text>
              </CardHeader>
              <CardBody>
                <VStack align="stretch" justify="center" py={6}>
                  <Flex align="center" gap={3}>
                    <Box 
                      p={3} 
                      borderRadius="full" 
                      bg="purple.100" 
                      color="purple.600"
                    >
                      <FaWallet size={24} />
                    </Box>
                    <Heading as="h4" size="2xl" fontWeight="bold">
                      {formatRupees(walletBalance)}
                    </Heading>
                  </Flex>
                  <HStack mt={6} spacing={3}>
                    <Button 
                      colorScheme="purple" 
                      leftIcon={<FaPlus />}
                      flex={1}
                      borderRadius="lg"
                    >
                      Add Money
                    </Button>
                    <Button 
                      variant="outline" 
                      colorScheme="purple" 
                      flex={1}
                      borderRadius="lg"
                    >
                      Withdraw
                    </Button>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
  
            {/* Payment Methods Card */}
            <Card borderRadius="2xl" boxShadow="lg" bg={cardBg}>
              <CardHeader pb={3}>
                <Heading as="h3" size="md" fontWeight="bold">
                  Payment Methods
                </Heading>
                <Text color="gray.500" fontSize="sm">Saved cards & UPI IDs</Text>
              </CardHeader>
              <CardBody>
                <VStack spacing={3} align="stretch">
                  {paymentMethods.map((method:any) => (
                    <Flex
                      key={method.id}
                      align="center"
                      justify="space-between"
                      p={3}
                      borderWidth="1px"
                      borderColor={borderColor}
                      borderRadius="xl"
                      _hover={{
                        borderColor: "purple.300",
                        boxShadow: "sm",
                      }}
                      transition="all 0.2s"
                    >
                      <Flex align="center" gap={3}>
                        <Box
                          p={2}
                          borderRadius="lg"
                          bg={method.isDefault ? "purple.100" : "gray.100"}
                          color={method.isDefault ? "purple.600" : "gray.600"}
                        >
                          {method.type === "upi" ? (
                            <FaMobileAlt size={20} />
                          ) : (
                            <FaCreditCard size={20} />
                          )}
                        </Box>
                        <Box>
                          <Text fontWeight="medium">
                            {method.type === "upi" 
                              ? method.upiId 
                              : `•••• ${method.last4}`}
                            {method.isDefault && (
                              <Badge 
                                colorScheme="purple" 
                                variant="subtle" 
                                ml={2}
                                borderRadius="md"
                              >
                                Default
                              </Badge>
                            )}
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            {method.type === "upi" ? "UPI ID" : `Exp ${method.expiry}`}
                          </Text>
                        </Box>
                      </Flex>
                      <IconButton
                        icon={<FaEdit />}
                        variant="ghost"
                        aria-label="Edit payment method"
                        colorScheme="gray"
                      />
                    </Flex>
                  ))}
                  <Button 
                    variant="ghost" 
                    colorScheme="purple" 
                    w="full" 
                    leftIcon={<FaPlus />}
                    mt={2}
                  >
                    Add New Method
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </Grid>
  
          {/* Transaction History Card */}
          <Card borderRadius="2xl" boxShadow="lg" bg={cardBg}>
            <CardHeader>
              <Heading as="h3" size="md" fontWeight="bold">
                Transaction History
              </Heading>
              <Text color="gray.500" fontSize="sm">Last 30 days activity</Text>
            </CardHeader>
            <CardBody>
              <Tabs variant="soft-rounded" colorScheme="purple">
                <TabList gap={2}>
                  <Tab _selected={{ bg: "purple.100", color: "purple.600" }}>
                    All
                  </Tab>
                  <Tab _selected={{ bg: "green.100", color: "green.600" }}>
                    Credits
                  </Tab>
                  <Tab _selected={{ bg: "red.100", color: "red.600" }}>
                    Debits
                  </Tab>
                </TabList>
                <TabPanels mt={4}>
                  {['all', 'credit', 'debit'].map((type) => (
                    <TabPanel key={type} p={0}>
                      <VStack spacing={3} align="stretch">
                        {transactions
                          .filter(t => type === 'all' || t.type === type)
                          .map((transaction) => (
                            <Flex
                              key={transaction.id}
                              align="center"
                              justify="space-between"
                              p={3}
                              borderWidth="1px"
                              borderColor={borderColor}
                              borderRadius="xl"
                            >
                              <Flex align="center" gap={3}>
                                <Box
                                  p={2}
                                  borderRadius="full"
                                  bg={
                                    transaction.type === "credit" 
                                      ? "green.100" 
                                      : "red.100"
                                  }
                                >
                                  <Icon
                                    as={
                                      transaction.type === "credit" 
                                        ? FaArrowDown 
                                        : FaArrowUp
                                    }
                                    color={
                                      transaction.type === "credit" 
                                        ? "green.600" 
                                        : "red.600"
                                    }
                                  />
                                </Box>
                                <Box>
                                  <Text fontWeight="medium">
                                    {transaction.description}
                                  </Text>
                                  <Text fontSize="sm" color="gray.500">
                                    {new Date(transaction.date).toLocaleDateString('en-IN', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric'
                                    })}
                                  </Text>
                                </Box>
                              </Flex>
                              <Text
                                fontWeight="bold"
                                color={
                                  transaction.type === "credit" 
                                    ? "green.600" 
                                    : "red.600"
                                }
                              >
                                {transaction.type === "credit" ? '+' : '-'}
                                {formatRupees(transaction.amount)}
                              </Text>
                            </Flex>
                          ))}
                      </VStack>
                    </TabPanel>
                  ))}
                </TabPanels>
              </Tabs>
            </CardBody>
          </Card>
        </VStack>
      </Box>
    );
  });