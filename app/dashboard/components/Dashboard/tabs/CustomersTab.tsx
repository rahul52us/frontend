import React, { useState, useMemo } from "react";
import {
  VStack, SimpleGrid, Box, Text, Avatar, HStack, Badge, Heading, Table, Thead, 
  Tbody, Tr, Th, Td, Flex, Input, InputGroup, InputLeftElement, Button, 
  Menu, MenuButton, MenuList, MenuItem, IconButton, Progress, Icon,
  Grid, GridItem, useColorModeValue, Select, Divider, Center, Tooltip as ChakraTooltip
} from "@chakra-ui/react";
import { SearchIcon, InfoOutlineIcon, DownloadIcon } from "@chakra-ui/icons";
import { 
  FaUserPlus, FaEnvelope, FaBan, FaArrowTrendUp, 
  FaWallet, FaEllipsis, FaClock, FaFilePdf, FaFilter
} from "react-icons/fa6";
import { Bar } from "react-chartjs-2";
import { 
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend 
} from 'chart.js';
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MotionBox = motion(Box);

const CUSTOMER_DATA = [
  { id: "1", name: "Alex Johnson", email: "alex@sky.com", spent: 4200, orders: 12, status: "VIP", loyalty: 95, lastSeen: "2 hours ago", type: "Corporate" },
  { id: "2", name: "Sarah Chen", email: "sarah@sky.com", spent: 2850, orders: 8, status: "Active", loyalty: 70, lastSeen: "5 mins ago", type: "Individual" },
  { id: "3", name: "Michael Bell", email: "mike@sky.com", spent: 1100, orders: 3, status: "Active", loyalty: 40, lastSeen: "Yesterday", type: "Individual" },
  { id: "4", name: "Emma Wilson", email: "emma@sky.com", spent: 450, orders: 2, status: "Inactive", loyalty: 15, lastSeen: "2 weeks ago", type: "Corporate" },
  { id: "5", name: "David Miller", email: "d.miller@web.com", spent: 5400, orders: 15, status: "VIP", loyalty: 98, lastSeen: "Just now", type: "Corporate" },
];

const CustomersTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [spentFilter, setSpentFilter] = useState("All");
  const [loyaltyFilter, setLoyaltyFilter] = useState("All");
  const [isExporting, setIsExporting] = useState(false);

  const bgCard = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");

  const filteredUsers = useMemo(() => {
    return CUSTOMER_DATA.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || user.status === statusFilter;
      const matchesSpent = spentFilter === "All" || (spentFilter === "High" ? user.spent > 3000 : user.spent <= 3000);
      const matchesLoyalty = loyaltyFilter === "All" || (loyaltyFilter === "Premium" ? user.loyalty >= 80 : user.loyalty < 80);
      return matchesSearch && matchesStatus && matchesSpent && matchesLoyalty;
    });
  }, [searchQuery, statusFilter, spentFilter, loyaltyFilter]);

  // PDF Export Function
  const downloadReport = () => {
    setIsExporting(true);
    const doc = new jsPDF();
    
    // Header Styling
    doc.setFillColor(107, 70, 193); // Purple.600
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("Customer Insights Report", 15, 25);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()} | Total Records: ${filteredUsers.length}`, 15, 33);

    const tableRows = filteredUsers.map(u => [
      u.name, u.email, u.status, `$${u.spent}`, `${u.loyalty}%`
    ]);

    autoTable(doc, {
      head: [['Name', 'Email', 'Status', 'Total Spent', 'Loyalty']],
      body: tableRows,
      startY: 45,
      headStyles: { fillColor: [107, 70, 193] },
      alternateRowStyles: { fillColor: [245, 245, 255] },
    });

    doc.save(`Customer_Report_${Date.now()}.pdf`);
    setTimeout(() => setIsExporting(false), 1000);
  };

  return (
    <Box w="100%" px={{ base: 2, md: 4 }} py={4}>
      <VStack spacing={{ base: 6, md: 8 }} align="stretch">
        
        {/* 1. Top Action Bar */}
        <Flex justify="space-between" align="center">
          <Box>
            <Heading size="lg" fontWeight="900" letterSpacing="tight">CRM Directory</Heading>
            <Text color="gray.500" fontSize="sm">Manage relationships and track customer lifecycle</Text>
          </Box>
          <Button 
            leftIcon={<DownloadIcon />} 
            colorScheme="purple" 
            variant="solid" 
            borderRadius="xl" 
            size="md"
            isLoading={isExporting}
            onClick={downloadReport}
            shadow="lg"
          >
            Download PDF
          </Button>
        </Flex>

        {/* 2. Stat Summary Cards */}
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={{ base: 4, md: 6 }}>
          <StatSummary title="Active Base" value="8,420" growth="+12%" color="blue.500" icon={FaUserPlus} />
          <StatSummary title="Avg. Ticket" value="$142.50" growth="+5.2%" color="purple.500" icon={FaWallet} />
          <StatSummary title="Retention" value="64%" growth="+2.1%" color="teal.500" icon={FaClock} />
          <StatSummary title="Risk Level" value="Low" growth="Safe" color="green.500" icon={FaArrowTrendUp} />
        </SimpleGrid>

        {/* 3. Advanced Multi-Filter Bar */}
        <Box bg={bgCard} p={5} borderRadius="3xl" shadow="sm" border="1px solid" borderColor={borderColor}>
          <Flex direction={{ base: "column", lg: "row" }} gap={4}>
            <InputGroup size="md" flex="2">
              <InputLeftElement pointerEvents="none"><SearchIcon color="gray.400" /></InputLeftElement>
              <Input 
                placeholder="Search name, email or ID..." 
                borderRadius="xl" variant="filled" 
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
            
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3} flex="3">
              <Select borderRadius="xl" variant="filled" icon={<FaFilter />} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All">All Statuses</option>
                <option value="VIP">VIP Members</option>
                <option value="Active">Active Users</option>
                <option value="Inactive">Inactive</option>
              </Select>

              <Select borderRadius="xl" variant="filled" onChange={(e) => setSpentFilter(e.target.value)}>
                <option value="All">All Spending</option>
                <option value="High">High Spenders ({'>'}$3k)</option>
                <option value="Low">Regular Spenders</option>
              </Select>

              <Select borderRadius="xl" variant="filled" onChange={(e) => setLoyaltyFilter(e.target.value)}>
                <option value="All">All Loyalty</option>
                <option value="Premium">Premium (80%+)</option>
                <option value="Standard">Standard</option>
              </Select>
            </SimpleGrid>
          </Flex>
        </Box>

        {/* 4. Main Content Grid */}
        <Grid templateColumns={{ base: "1fr", xl: "1fr 2.5fr" }} gap={{ base: 6, md: 8 }}>
          
          <VStack spacing={6} align="stretch">
            {/* Segmentation Chart */}
            <MotionBox bg={bgCard} p={6} borderRadius="3xl" shadow="sm" border="1px solid" borderColor={borderColor}>
              <Heading size="xs" mb={6} textTransform="uppercase" letterSpacing="widest" color="gray.500">
                Purchase Frequency
              </Heading>
              <Box h="200px">
                <Bar 
                  data={{
                    labels: ["1-2", "3-5", "6-10", "10+"],
                    datasets: [{
                      label: "Users",
                      data: [450, 230, 120, 85],
                      backgroundColor: ['#E2E8F0', '#CBD5E0', '#9F7AEA', '#6B46C1'],
                      borderRadius: 10,
                    }]
                  }}
                  options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }}
                />
              </Box>
            </MotionBox>

            {/* Promo Card */}
            <Box bgGradient="linear(to-br, purple.600, blue.600)" p={6} borderRadius="3xl" color="white" shadow="xl" position="relative" overflow="hidden">
              <VStack align="start" spacing={4} position="relative" zIndex={1}>
                <Badge colorScheme="whiteAlpha" px={3} py={1} borderRadius="full">Campaign Live</Badge>
                <Box>
                  <Heading size="md">VIP Retention</Heading>
                  <Text fontSize="xs" mt={1} opacity={0.8}>Automated outreach for high-value churn risks.</Text>
                </Box>
                <Button size="sm" w="full" bg="white" color="purple.600" _hover={{ bg: "gray.100" }} borderRadius="xl">
                  Configure Workflow
                </Button>
              </VStack>
              <Icon as={FaFilePdf} position="absolute" right="-10%" bottom="-10%" boxSize="150px" opacity="0.1" transform="rotate(-15deg)" />
            </Box>
          </VStack>

          {/* User Directory */}
          <GridItem bg={bgCard} p={{ base: 4, md: 6 }} borderRadius="3xl" shadow="sm" border="1px solid" borderColor={borderColor}>
            <Flex justify="space-between" align="center" mb={6}>
               <Box>
                  <Heading size="md" fontWeight="900">User Directory</Heading>
                  <Text fontSize="xs" color="gray.400" fontWeight="bold">SHOWING {filteredUsers.length} MEMBERS</Text>
               </Box>
               <HStack>
                <ChakraTooltip label="Table Settings">
                  <IconButton aria-label="Settings" icon={<InfoOutlineIcon />} size="sm" variant="ghost" />
                </ChakraTooltip>
               </HStack>
            </Flex>

            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th border="none">Member</Th>
                    <Th border="none" display={{ base: "none", md: "table-cell" }}>Volume</Th>
                    <Th border="none">Status</Th>
                    <Th border="none">Loyalty</Th>
                    <Th border="none"></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <AnimatePresence mode="popLayout">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <Tr key={user.id} as={motion.tr} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} _hover={{ bg: "gray.50" }} transition="0.2s">
                          <Td py={4} borderBottom="1px solid" borderColor="gray.50">
                            <HStack spacing={3}>
                              <Avatar size="sm" src={`https://i.pravatar.cc/150?u=${user.id}`} />
                              <Box>
                                <Text fontWeight="800" fontSize="xs">{user.name}</Text>
                                <Text fontSize="10px" color="gray.400">{user.email}</Text>
                              </Box>
                            </HStack>
                          </Td>
                          <Td display={{ base: "none", md: "table-cell" }} borderBottom="1px solid" borderColor="gray.50">
                            <Text fontWeight="bold" fontSize="xs">${user.spent.toLocaleString()}</Text>
                          </Td>
                          <Td borderBottom="1px solid" borderColor="gray.50">
                            <Badge fontSize="9px" px={2} py={0.5} borderRadius="md" colorScheme={user.status === 'VIP' ? 'purple' : 'blue'}>
                              {user.status}
                            </Badge>
                          </Td>
                          <Td minW="120px" borderBottom="1px solid" borderColor="gray.50">
                            <VStack align="stretch" spacing={1}>
                              <Progress value={user.loyalty} size="xs" colorScheme={user.loyalty > 80 ? "purple" : "blue"} borderRadius="full" bg="gray.100" />
                              <Text fontSize="9px" fontWeight="extrabold">{user.loyalty}% Score</Text>
                            </VStack>
                          </Td>
                          <Td isNumeric borderBottom="1px solid" borderColor="gray.50">
                            <Menu isLazy>
                              <MenuButton as={IconButton} icon={<FaEllipsis />} variant="ghost" size="xs" borderRadius="full" />
                              <MenuList fontSize="xs" borderRadius="xl" shadow="2xl" p={2}>
                                <MenuItem icon={<FaEnvelope />} borderRadius="lg">Send Message</MenuItem>
                                <MenuItem icon={<FaClock />} borderRadius="lg">View History</MenuItem>
                                <Divider my={2} />
                                <MenuItem icon={<FaBan />} color="red.500" borderRadius="lg">Flag Account</MenuItem>
                              </MenuList>
                            </Menu>
                          </Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td colSpan={5}>
                          <Center py={10} flexDirection="column">
                            <Icon as={SearchIcon} boxSize={8} color="gray.200" mb={4} />
                            <Text color="gray.400" fontSize="sm" fontWeight="bold">No matching customers found</Text>
                          </Center>
                        </Td>
                      </Tr>
                    )}
                  </AnimatePresence>
                </Tbody>
              </Table>
            </Box>
          </GridItem>
        </Grid>
      </VStack>
    </Box>
  );
};

const StatSummary = ({ title, value, growth, color, icon: StatIcon }: any) => (
  <MotionBox 
    whileHover={{ y: -4, shadow: "xl" }} 
    bg="white" p={6} borderRadius="3xl" shadow="sm" 
    border="1px solid" borderColor="gray.100"
    position="relative" overflow="hidden"
    transition={{ duration: 0.2 }}
  >
    <VStack align="start" spacing={1}>
      <Text color="gray.400" fontSize="10px" fontWeight="extrabold" textTransform="uppercase" letterSpacing="widest">{title}</Text>
      <Heading size="lg" fontWeight="900">{value}</Heading>
      <Badge colorScheme="green" fontSize="10px" borderRadius="lg" px={2} variant="subtle">
        {growth}
      </Badge>
    </VStack>
    <Icon as={StatIcon} position="absolute" right={-2} bottom={-2} boxSize={16} color={color} opacity={0.07} transform="rotate(-15deg)" />
  </MotionBox>
);

export default CustomersTab;