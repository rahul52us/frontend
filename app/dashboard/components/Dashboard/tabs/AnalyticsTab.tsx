import React, { useState } from "react";
import {
  VStack, SimpleGrid, Grid, GridItem, Box, Heading, Flex, Text, Icon, HStack,
  Button, Badge, Input, Table, Thead, Tbody, Tr, Th, Td, Avatar,
  InputGroup, InputLeftElement, IconButton, Center,
  useToast, Divider, Tag, TagLabel
} from "@chakra-ui/react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Tooltip, Legend, ArcElement, BarElement, Filler
} from "chart.js";
import { 
  FaGem, FaShoppingCart, FaChartLine, FaDownload, FaSyncAlt, 
  FaSearch, FaEllipsisV, FaCalendarAlt, FaShieldAlt
} from "react-icons/fa";
import { motion } from "framer-motion";
import Select from "react-select";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, ArcElement, BarElement, Filler);

const MotionBox = motion(Box);

// --- Options for Advanced Filters ---
const CATEGORY_OPTIONS = [
  { value: 'mobiles', label: '📱 Mobiles', color: '#3182ce' },
  { value: 'electronics', label: '💻 Electronics', color: '#805ad5' },
  { value: 'fashion', label: '👕 Fashion', color: '#e53e3e' },
  { value: 'home', label: '🏠 Home & Living', color: '#38a169' }
];

const STATUS_OPTIONS = [
  { value: 'Completed', label: '✅ Completed' },
  { value: 'Processing', label: '⏳ Processing' },
  { value: 'Refunded', label: '↩️ Refunded' }
];

const TIER_OPTIONS = [
  { value: 'high', label: '💎 High Value (>$1000)' },
  { value: 'mid', label: '💳 Mid Range ($100-$1000)' },
  { value: 'low', label: '🛒 Budget (<$100)' }
];

const AnalyticsTab: React.FC = () => {
  const toast = useToast();
  const [isExporting, setIsExporting] = useState(false);
  
  // Removed unused state variables to fix build errors

  const selectStyles = {
    control: (base: any) => ({ 
      ...base, 
      borderRadius: '14px', 
      border: '1px solid #E2E8F0', 
      minHeight: '45px',
      backgroundColor: '#f8fafc',
      boxShadow: 'none',
      '&:hover': { borderColor: '#cbd5e0' }
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: '#EBF8FF',
      borderRadius: '8px',
    }),
  };

  const handleExport = () => {
    setIsExporting(true);
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Intelligence Hub - Analytics Report", 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
    
    autoTable(doc, {
      startY: 35,
      head: [['Metric', 'Value', 'Change']],
      body: [
        ['Total Revenue', '$128,430', '+12.5%'],
        ['Conversion Rate', '4.2%', '+0.8%'],
        ['Avg Basket', '$84.20', '-2.1%'],
      ],
      theme: 'grid',
      headStyles: { fillColor: [49, 130, 206] }
    });

    doc.save("Analytics_Report.pdf");
    setIsExporting(false);
    toast({ title: "Report Downloaded", status: "success", duration: 2000 });
  };

  return (
    <Box bg="#F8FAFC" minH="100vh" p={{ base: 4, md: 8 }}>
      <VStack spacing={8} align="stretch" maxW="1600px" mx="auto">
        
        {/* Header Action Row */}
        <Flex direction={{ base: "column", sm: "row" }} justify="space-between" align={{ base: "start", sm: "center" }} gap={4}>
          <Box>
            <HStack>
              <Heading size="lg" fontWeight="900" color="gray.800">Intelligence Hub</Heading>
              <Badge colorScheme="blue" borderRadius="full" px={3}>v2.0 LIVE</Badge>
            </HStack>
            <Text color="gray.500" fontWeight="medium">Real-time performance ecosystem tracking</Text>
          </Box>
          <HStack w={{ base: "full", sm: "auto" }} spacing={3}>
            <Button 
              leftIcon={<FaDownload />} 
              colorScheme="blue" 
              borderRadius="xl" 
              shadow="md" 
              onClick={handleExport}
              isLoading={isExporting}
            >
              Export PDF
            </Button>
            <IconButton aria-label="Refresh" icon={<FaSyncAlt />} variant="outline" borderRadius="xl" bg="white" />
          </HStack>
        </Flex>

        {/* --- ADVANCED MULTI-FILTER PANEL --- */}
        <MotionBox
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          bg="white" p={6} borderRadius="3xl" shadow="sm" border="1px solid" borderColor="gray.100"
        >
          <VStack spacing={5} align="stretch">
            <Flex direction={{ base: "column", lg: "row" }} gap={4} align="center">
              <InputGroup maxW={{ base: "full", lg: "350px" }}>
                <InputLeftElement h="full"><FaSearch color="gray.300" /></InputLeftElement>
                <Input 
                  placeholder="Search transactions, users..." 
                  h="45px" borderRadius="14px" bg="gray.50" border="none"
                />
              </InputGroup>
              
              <Divider orientation="vertical" h="30px" display={{ base: "none", lg: "block" }} />

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="full">
                <Box>
                  <Select 
                    isMulti 
                    placeholder="Categories..." 
                    options={CATEGORY_OPTIONS} 
                    styles={selectStyles}
                  />
                </Box>
                <Box>
                  <Select 
                    placeholder="Tier..." 
                    options={TIER_OPTIONS} 
                    styles={selectStyles}
                  />
                </Box>
                <Box>
                  <Select 
                    placeholder="Status..." 
                    options={STATUS_OPTIONS} 
                    styles={selectStyles}
                  />
                </Box>
              </SimpleGrid>
            </Flex>

            <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="center" gap={4}>
              <HStack spacing={4} flex={1} w="full">
                <HStack bg="gray.50" px={4} py={2} borderRadius="14px" flex={1} border="1px solid" borderColor="gray.100">
                  <Icon as={FaCalendarAlt} color="blue.400" />
                  <Input type="date" variant="unstyled" fontSize="xs" fontWeight="bold" />
                  <Text fontSize="xs" color="gray.300">TO</Text>
                  <Input type="date" variant="unstyled" fontSize="xs" fontWeight="bold" />
                </HStack>
              </HStack>
              
              <HStack>
                <Button variant="ghost" size="sm" color="gray.400" onClick={() => window.location.reload()}>Clear All</Button>
                <Button colorScheme="blue" size="sm" px={8} borderRadius="full">Apply Insights</Button>
              </HStack>
            </Flex>
          </VStack>
        </MotionBox>

        {/* Stats Grid */}
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
          <StatCard title="REVENUE" value="$128,430" growth="12.5%" isUp icon={FaGem} color="blue" gradient="linear(to-r, blue.500, cyan.400)" />
          <StatCard title="CONVERSION" value="4.2%" growth="0.8%" isUp icon={FaChartLine} color="purple" gradient="linear(to-r, purple.500, pink.400)" />
          <StatCard title="FRAUD RISK" value="0.02%" growth="0.1%" isUp={false} icon={FaShieldAlt} color="green" gradient="linear(to-r, green.400, teal.400)" />
          <StatCard title="ORDERS" value="1,842" growth="5.4%" isUp icon={FaShoppingCart} color="orange" gradient="linear(to-r, orange.500, yellow.400)" />
        </SimpleGrid>

        {/* Main Analytics Content */}
        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
          <GridItem bg="white" p={{ base: 6, md: 8 }} borderRadius="3xl" border="1px solid" borderColor="gray.100" shadow="sm">
            <Flex justify="space-between" align="center" mb={8}>
              <Box>
                <Heading size="md">Growth Velocity</Heading>
                <Text fontSize="sm" color="gray.400">Monthly scale vs projection</Text>
              </Box>
              <HStack bg="gray.50" p={1} borderRadius="lg">
                <Button size="xs" variant="ghost">Income</Button>
                <Button size="xs" colorScheme="blue" shadow="sm">Volume</Button>
              </HStack>
            </Flex>
            <Box h="350px">
              <Line 
                data={{
                  labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                  datasets: [{
                    label: "Current",
                    data: [4000, 7000, 5500, 9000, 12000, 15000],
                    borderColor: "#3182ce",
                    backgroundColor: (context) => {
                      const ctx = context.chart.ctx;
                      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                      gradient.addColorStop(0, "rgba(49, 130, 206, 0.2)");
                      gradient.addColorStop(1, "rgba(49, 130, 206, 0)");
                      return gradient;
                    },
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                  }]
                }} 
                options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} 
              />
            </Box>
          </GridItem>

          <GridItem bg="white" p={{ base: 6, md: 8 }} borderRadius="3xl" border="1px solid" borderColor="gray.100" shadow="sm">
            <Heading size="md" mb={1}>Acquisition</Heading>
            <Text fontSize="sm" color="gray.400" mb={8}>Channels driving growth</Text>
            <Box h="250px" position="relative">
              <Doughnut 
                data={{
                  labels: ['Search', 'Social', 'Direct'],
                  datasets: [{ data: [55, 25, 20], backgroundColor: ['#3182ce', '#805ad5', '#E2E8F0'], borderWidth: 0, hoverOffset: 10 }]
                }}
                options={{ cutout: '80%', maintainAspectRatio: false, plugins: { legend: { display: false } } }}
              />
              <Center position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" flexDirection="column">
                <Text fontSize="2xl" fontWeight="900">84%</Text>
                <Text fontSize="xs" color="gray.400">Total Organic</Text>
              </Center>
            </Box>
            <VStack mt={10} spacing={4}>
              {[{l: 'Search', p: '55%', c: 'blue.500'}, {l: 'Social', p: '25%', c: 'purple.500'}, {l: 'Direct', p: '20%', c: 'gray.200'}].map(item => (
                <Flex key={item.l} w="full" justify="space-between" align="center">
                  <HStack><Box boxSize={2} borderRadius="full" bg={item.c}/><Text fontSize="sm" fontWeight="bold" color="gray.600">{item.l}</Text></HStack>
                  <Text fontSize="sm" fontWeight="bold">{item.p}</Text>
                </Flex>
              ))}
            </VStack>
          </GridItem>
        </Grid>

        {/* Transactions Table */}
        <Box bg="white" borderRadius="3xl" border="1px solid" borderColor="gray.100" shadow="sm" overflow="hidden">
          <Flex p={6} justify="space-between" align="center">
            <VStack align="start" spacing={0}>
              <Heading size="sm">High-Value Stream</Heading>
              <Text fontSize="xs" color="gray.400">Real-time settlement tracking</Text>
            </VStack>
            <Button size="sm" rightIcon={<FaEllipsisV />} variant="ghost">Audit Logs</Button>
          </Flex>
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th color="gray.400" border="none">Entity</Th>
                  <Th color="gray.400" border="none">Category</Th>
                  <Th color="gray.400" border="none">Transaction ID</Th>
                  <Th color="gray.400" border="none">Amount</Th>
                  <Th color="gray.400" border="none">Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {[
                  { name: "Alex Rivera", cat: "Mobiles", id: "TXN-9021", amt: "$1,200.00", status: "Completed", color: "green" },
                  { name: "Sarah Chen", cat: "Fashion", id: "TXN-4412", amt: "$850.50", status: "Processing", color: "orange" },
                  { name: "Jake Muller", cat: "Electronics", id: "TXN-3310", amt: "$2,400.00", status: "Completed", color: "green" },
                ].map((row, i) => (
                  <Tr key={i} _hover={{ bg: "gray.50/50" }} transition="0.2s">
                    <Td borderBottom="1px solid" borderColor="gray.50">
                      <HStack>
                        <Avatar size="sm" name={row.name} border="2px solid white" shadow="sm" />
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="700" fontSize="sm">{row.name}</Text>
                          <Text fontSize="10px" color="gray.400">Verified Client</Text>
                        </VStack>
                      </HStack>
                    </Td>
                    <Td borderBottom="1px solid" borderColor="gray.50">
                      <Tag size="sm" variant="subtle" colorScheme="blue" borderRadius="full">
                        <TagLabel fontWeight="bold">{row.cat}</TagLabel>
                      </Tag>
                    </Td>
                    <Td borderBottom="1px solid" borderColor="gray.50" fontSize="xs" fontFamily="mono" color="gray.500">{row.id}</Td>
                    <Td borderBottom="1px solid" borderColor="gray.50" fontWeight="900" color="gray.700">{row.amt}</Td>
                    <Td borderBottom="1px solid" borderColor="gray.50">
                      <Badge colorScheme={row.color} variant="solid" borderRadius="full" px={3} fontSize="9px">
                        {row.status}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};

const StatCard = ({ title, value, growth, isUp, icon, color, gradient }: any) => (
  <MotionBox
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ y: -5, shadow: "xl" }}
    bg="white"
    p={6}
    borderRadius="3xl"
    position="relative"
    overflow="hidden"
    boxShadow="sm"
    border="1px solid"
    borderColor="gray.100"
  >
    <Box position="absolute" top={0} left={0} w="100%" h="100%" bgGradient={gradient} opacity={0.03} />
    <Flex justify="space-between" align="start">
      <VStack align="start" spacing={1} flex={1}>
        <Text fontSize="10px" fontWeight="900" color="gray.400" letterSpacing="widest">{title}</Text>
        <Heading size="lg" fontWeight="900" color="gray.800">{value}</Heading>
        <HStack>
          <Icon as={isUp ? FaChartLine : FaChartLine} color={isUp ? "green.400" : "red.400"} transform={isUp ? "" : "rotate(90deg)"} />
          <Text fontSize="xs" fontWeight="bold" color={isUp ? "green.400" : "red.400"}>{growth}</Text>
          <Text fontSize="10px" color="gray.300">vs last month</Text>
        </HStack>
      </VStack>
      <Center bg={`${color}.50`} p={3} borderRadius="2xl" color={`${color}.500`}>
        <Icon as={icon} boxSize={5} />
      </Center>
    </Flex>
  </MotionBox>
);

export default AnalyticsTab;