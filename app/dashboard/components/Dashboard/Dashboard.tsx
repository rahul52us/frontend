import React, { useState, useMemo } from "react";
import {
  Box,
  ChakraProvider,
  extendTheme,
  Grid,
  GridItem,
  Heading,
  SimpleGrid,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Badge,
  Flex,
  Icon,
  Input,
  Select,
  Stack,
  HStack,
  Button,
  Divider,
  Avatar,
  useToast,
} from "@chakra-ui/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import {
  FaBoxes,
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaShoppingCart,
  FaFilter,
  FaUndo,
  FaDownload,
  FaUserTag,
  FaArrowUp,
} from "react-icons/fa";

// PDF Exports
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ======================= Chart.js Setup ======================= */
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

/* ======================= Theme Configuration ======================= */
const theme = extendTheme({
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  colors: {
    brand: {
      50: "#eef2ff",
      500: "#6366f1",
      600: "#4f46e5",
    },
  },
});

/* ======================= Types & Interfaces ======================= */
interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  status: "Delivered" | "Pending" | "Shipped" | "Cancelled";
  amount: number;
  items: number;
}

/* ======================= Dummy Data Constants ======================= */
const CATEGORIES = [
  "Electronics", "Fashion", "Home Decor", "Mobiles",
  "Beauty", "Sports", "Books", "Toys", "Fitness"
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];

const DUMMY_ORDERS: Order[] = [
  { id: "#ORD-9901", customer: "Rajesh Kumar", email: "rajesh@example.com", date: "2023-10-20", status: "Delivered", amount: 12500, items: 3 },
  { id: "#ORD-9902", customer: "Anita Desai", email: "anita@example.com", date: "2023-10-21", status: "Pending", amount: 450, items: 1 },
  { id: "#ORD-9903", customer: "Suresh Raina", email: "suresh@example.com", date: "2023-10-22", status: "Shipped", amount: 8900, items: 2 },
  { id: "#ORD-9904", customer: "Megha Gupta", email: "megha@example.com", date: "2023-10-23", status: "Cancelled", amount: 2100, items: 1 },
  { id: "#ORD-9905", customer: "Vikram Seth", email: "vikram@example.com", date: "2023-10-24", status: "Delivered", amount: 5600, items: 4 },
  { id: "#ORD-9906", customer: "Pooja Hegde", email: "pooja@example.com", date: "2023-10-25", status: "Shipped", amount: 1200, items: 2 },
];

const TOP_PRODUCTS = [
  { name: "Wireless Earbuds", sales: 145, trend: "+12%" },
  { name: "Cotton T-Shirt", sales: 98, trend: "+5%" },
  { name: "Smart Watch", sales: 76, trend: "+18%" },
];

/* ======================= Main Dashboard Component ======================= */
const Dashboard: React.FC = () => {
  const toast = useToast();

  // State for Filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  // Handler for PDF Export
  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.text("Business Overview Report", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
    doc.text(`Category: ${selectedCategory}`, 14, 33);

    // Summary Section
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Order Summary", 14, 45);

    const tableColumn = ["Order ID", "Customer", "Date", "Status", "Amount (INR)"];
    const tableRows = DUMMY_ORDERS.map(order => [
      order.id,
      order.customer,
      order.date,
      order.status,
      `Rs. ${order.amount.toLocaleString()}`
    ]);

    autoTable(doc, {
      startY: 50,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241] }, // Brand color
    });

    // Save PDF
    doc.save(`Business_Report_${new Date().getTime()}.pdf`);

    toast({
      title: "Report Downloaded",
      description: "Your PDF business report has been generated.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top-right"
    });
  };

  // Handler for Reset
  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setSelectedCategory("All Categories");
    toast({
      title: "Filters Reset",
      status: "info",
      duration: 2000,
      isClosable: true,
      position: "top-right"
    });
  };

  // Dynamic Chart Data Calculations
  const barChartData = useMemo(() => ({
    labels: CATEGORIES,
    datasets: [{
      label: "Revenue (₹)",
      data: CATEGORIES.map(() => Math.floor(Math.random() * 50000) + 10000),
      backgroundColor: "rgba(99, 102, 241, 0.8)",
      borderRadius: 5,
    }],
  }), []);

  const lineChartData = useMemo(() => ({
    labels: MONTHS,
    datasets: [{
      label: "Monthly Sales Growth",
      data: MONTHS.map(() => Math.floor(Math.random() * 100000)),
      borderColor: "#48BB78",
      backgroundColor: "rgba(72, 187, 120, 0.1)",
      fill: true,
      tension: 0.4,
    }],
  }), []);

  return (
    <ChakraProvider theme={theme}>
      <Box bg="gray.50" minH="100vh" p={{ base: 4, md: 8 }}>

        {/* --- HEADER SECTION --- */}
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          mb={10}
          gap={4}
        >
          <Box>
            <Heading size="lg" color="gray.800" letterSpacing="tight">
              Business Overview
            </Heading>
            <Text color="gray.500" fontSize="sm">
              {`Welcome back, Shopkeeper! Here's what's happening today.`}
            </Text>
          </Box>

          <HStack spacing={3}>
            <Button
              leftIcon={<FaDownload />}
              variant="solid"
              size="sm"
              colorScheme="brand"
              onClick={handleExportPDF}
            >
              Export Report (PDF)
            </Button>
            <Avatar size="sm" name="Shop Owner" src="https://bit.ly/broken-link" />
          </HStack>
        </Flex>

        {/* --- FILTER BAR --- */}
        <Box
          bg="white"
          p={4}
          borderRadius="2xl"
          boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
          mb={8}
        >
          <Stack direction={{ base: "column", lg: "row" }} spacing={6} align="center">
            <HStack flex={1} spacing={4} w="full">
              <Icon as={FaFilter} color="brand.500" />
              <Text fontWeight="600" fontSize="sm" whiteSpace="nowrap">Advanced Filters:</Text>

              <HStack spacing={2} flex={1}>
                <Input
                  size="sm"
                  type="date"
                  borderRadius="md"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Text fontSize="xs" color="gray.400">to</Text>
                <Input
                  size="sm"
                  type="date"
                  borderRadius="md"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </HStack>
            </HStack>

            <HStack spacing={4} w={{ base: "full", lg: "auto" }}>
              <Select
                size="sm"
                borderRadius="md"
                w={{ base: "full", lg: "220px" }}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All Categories">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>

              <Button
                leftIcon={<FaUndo />}
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={handleReset}
              >
                Reset
              </Button>
              <Button colorScheme="brand" size="sm" px={8}>
                Apply
              </Button>
            </HStack>
          </Stack>
        </Box>

        {/* --- KPI CARDS --- */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={10}>
          {[
            { label: "Revenue", value: "₹4,85,000", icon: FaMoneyBillWave, color: "green", growth: "+12.5%" },
            { label: "Orders", value: "1,240", icon: FaShoppingCart, color: "blue", growth: "+8.2%" },
            { label: "Total Stock", value: "860", icon: FaBoxes, color: "purple", growth: "-2.1%" },
            { label: "Low Stock", value: "32 Items", icon: FaExclamationTriangle, color: "red", growth: "Critical" },
          ].map((card, i) => (
            <Box
              key={i}
              bg="white"
              p={6}
              borderRadius="2xl"
              boxShadow="sm"
              borderLeft="4px solid"
              borderColor={`${card.color}.400`}
              transition="transform 0.2s"
              _hover={{ transform: "translateY(-5px)", boxShadow: "md" }}
            >
              <Flex align="center" justify="space-between">
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="gray.400" textTransform="uppercase">
                    {card.label}
                  </Text>
                  <Text fontSize="2xl" fontWeight="800" my={1}>
                    {card.value}
                  </Text>
                  <HStack spacing={1}>
                    <Icon as={FaArrowUp} boxSize={2} color="green.500" />
                    <Text fontSize="xs" color="green.500" fontWeight="bold">
                      {card.growth}
                    </Text>
                    <Text fontSize="xs" color="gray.400">vs last month</Text>
                  </HStack>
                </Box>
                <Box bg={`${card.color}.50`} p={3} borderRadius="lg">
                  <Icon as={card.icon} boxSize={6} color={`${card.color}.500`} />
                </Box>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>

        {/* --- ANALYTICS SECTION --- */}
        <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap={8} mb={10}>
          <GridItem colSpan={{ base: 1, lg: 2 }} bg="white" p={6} borderRadius="2xl" boxShadow="sm">
            <Flex justify="space-between" align="center" mb={6}>
              <Text fontWeight="800" fontSize="md">Sales Performance</Text>
              <Badge colorScheme="purple" variant="outline">Live Data</Badge>
            </Flex>
            <Box h="300px">
              <Bar
                data={barChartData}
                options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }}
              />
            </Box>
          </GridItem>

          <GridItem bg="white" p={6} borderRadius="2xl" boxShadow="sm">
            <Text fontWeight="800" fontSize="md" mb={6}>Revenue Trends</Text>
            <Box h="300px">
              <Line
                data={lineChartData}
                options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }}
              />
            </Box>
          </GridItem>
        </Grid>

        {/* --- INVENTORY & ORDERS SECTION --- */}
        <Grid templateColumns={{ base: "1fr", xl: "1.5fr 1fr" }} gap={8}>

          {/* STOCK TABLE */}
          <Box bg="white" p={6} borderRadius="2xl" boxShadow="sm" overflowX="auto">
            <Flex justify="space-between" align="center" mb={6}>
              <VStack align="start" spacing={0}>
                <Text fontWeight="800" fontSize="md">Inventory Management</Text>
                <Text fontSize="xs" color="gray.500">Managing {selectedCategory}</Text>
              </VStack>
              <Button size="sm" colorScheme="brand" variant="ghost">View Full Inventory</Button>
            </Flex>

            <Table variant="simple" size="sm">
              <Thead bg="gray.50">
                <Tr>
                  <Th borderRadius="tl-md">Category</Th>
                  <Th>Availability</Th>
                  <Th>Status</Th>
                  <Th isNumeric borderRadius="tr-md">Asset Value</Th>
                </Tr>
              </Thead>
              <Tbody>
                {CATEGORIES
                  .filter(c => selectedCategory === "All Categories" || c === selectedCategory)
                  .slice(0, 6)
                  .map((cat, idx) => {
                    const stock = Math.floor(Math.random() * 200);
                    return (
                      <Tr key={idx} _hover={{ bg: "gray.50" }}>
                        <Td fontWeight="600" color="gray.700">{cat}</Td>
                        <Td>
                          <Stack spacing={1}>
                            <Text fontSize="xs">{stock} Units</Text>
                            <Box w="100px" h="4px" bg="gray.100" borderRadius="full">
                              <Box w={`${(stock/200)*100}%`} h="full" bg={stock < 30 ? "red.400" : "green.400"} borderRadius="full" />
                            </Box>
                          </Stack>
                        </Td>
                        <Td>
                          <Badge
                            variant="subtle"
                            colorScheme={stock < 30 ? "red" : "green"}
                            px={3}
                            borderRadius="full"
                          >
                            {stock < 30 ? "Low Stock" : "In Stock"}
                          </Badge>
                        </Td>
                        <Td isNumeric fontWeight="bold">₹{(stock * 1200).toLocaleString()}</Td>
                      </Tr>
                    );
                  })}
              </Tbody>
            </Table>
          </Box>

          {/* RECENT ORDERS LIST */}
          <Box bg="white" p={6} borderRadius="2xl" boxShadow="sm">
            <Text fontWeight="800" fontSize="md" mb={6}>Recent Transactions</Text>
            <Stack spacing={5}>
              {DUMMY_ORDERS.map((order) => (
                <Flex key={order.id} justify="space-between" align="center">
                  <HStack spacing={4}>
                    <Avatar size="sm" icon={<FaUserTag fontSize="1rem" />} bg="brand.50" color="brand.500" />
                    <Box>
                      <Text fontWeight="bold" fontSize="sm">{order.customer}</Text>
                      <Text fontSize="xs" color="gray.500">{order.id} • {order.items} Items</Text>
                    </Box>
                  </HStack>
                  <Box textAlign="right">
                    <Text fontWeight="800" fontSize="sm">₹{order.amount.toLocaleString()}</Text>
                    <Badge
                      fontSize="9px"
                      colorScheme={
                        order.status === "Delivered" ? "green" :
                        order.status === "Pending" ? "orange" : "blue"
                      }
                    >
                      {order.status}
                    </Badge>
                  </Box>
                </Flex>
              ))}
              <Divider />
              <Button w="full" variant="outline" size="sm" colorScheme="gray" onClick={handleExportPDF}>
                Generate Full Order Report (PDF)
              </Button>
            </Stack>
          </Box>
        </Grid>

        {/* --- TOP PRODUCTS FOOTER SECTION --- */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mt={8}>
          {TOP_PRODUCTS.map((product, i) => (
            <Flex
              key={i}
              bg="brand.600"
              color="white"
              p={4}
              borderRadius="xl"
              align="center"
              justify="space-between"
            >
              <VStack align="start" spacing={0}>
                <Text fontSize="xs" opacity={0.8}>Top Seller #{i+1}</Text>
                <Text fontWeight="bold" fontSize="sm">{product.name}</Text>
              </VStack>
              <Box textAlign="right">
                <Text fontWeight="bold">{product.sales}</Text>
                <Text fontSize="10px" color="green.200">{product.trend} growth</Text>
              </Box>
            </Flex>
          ))}
        </SimpleGrid>

      </Box>
    </ChakraProvider>
  );
};

// Helper components for layout structure
const VStack = ({ children, align, spacing }: any) => (
  <Flex direction="column" align={align} gap={spacing}>{children}</Flex>
);

export default Dashboard;