import React, { useState } from "react";
import {
  VStack,
  SimpleGrid,
  Grid,
  GridItem,
  Box,
  Heading,
  Flex,
  Text,
  Icon,
  HStack,
  Button,
  Badge,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  InputGroup,
  InputLeftElement,
  IconButton,
  Center,
  useToast,
  Tag,
  TagLabel,
} from "@chakra-ui/react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  Filler,
} from "chart.js";
import {
  FaGem,
  FaShoppingCart,
  FaChartLine,
  FaDownload,
  FaSyncAlt,
  FaSearch,
  FaEllipsisV,
  FaCalendarAlt,
  FaShieldAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Select from "react-select";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  Filler
);

const MotionBox = motion(Box);

// --- Options for Advanced Filters ---
const CATEGORY_OPTIONS = [
  { value: "mobiles", label: "📱 Mobiles", color: "#3182ce" },
  { value: "electronics", label: "💻 Electronics", color: "#805ad5" },
  { value: "fashion", label: "👕 Fashion", color: "#e53e3e" },
  { value: "home", label: "🏠 Home & Living", color: "#38a169" },
];

const STATUS_OPTIONS = [
  { value: "Completed", label: "✅ Completed" },
  { value: "Processing", label: "⏳ Processing" },
  { value: "Refunded", label: "↩️ Refunded" },
];

const TIER_OPTIONS = [
  { value: "high", label: "💎 High Value (>$1000)" },
  { value: "mid", label: "💳 Mid Range ($100-$1000)" },
  { value: "low", label: "🛒 Budget (<$100)" },
];

const AnalyticsTab: React.FC = () => {
  const toast = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const selectStyles = {
    control: (base: any) => ({
      ...base,
      borderRadius: "14px",
      border: "1px solid #E2E8F0",
      minHeight: "44px",
      backgroundColor: "#f8fafc",
      boxShadow: "none",
      fontSize: "14px",
      "&:hover": { borderColor: "#cbd5e0" },
    }),
    menu: (base: any) => ({
      ...base,
      zIndex: 9999,
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: "#EBF8FF",
      borderRadius: "8px",
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
      head: [["Metric", "Value", "Change"]],
      body: [
        ["Total Revenue", "$128,430", "+12.5%"],
        ["Conversion Rate", "4.2%", "+0.8%"],
        ["Avg Basket", "$84.20", "-2.1%"],
      ],
      theme: "grid",
      headStyles: { fillColor: [49, 130, 206] },
    });

    doc.save("Analytics_Report.pdf");
    setIsExporting(false);
    toast({ title: "Report Downloaded", status: "success", duration: 2000 });
  };

  return (
    <Box
      p={{ base: 2, sm: 2, md: 6, lg: 4 }}
      w="100%"
      maxW="100%"
      mx="auto"
    >
      <VStack spacing={{ base: 2, md: 4, lg: 6 }} align="stretch">
        {/* Header Action Row */}
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "start", md: "center" }}
          gap={{ base: 5, md: 4 }}
        >
          <Box>
            <HStack spacing={3}>
              <Heading size={{ base: "md", md: "lg" }} fontWeight="900" color="gray.800">
                Intelligence Hub
              </Heading>
              <Badge colorScheme="blue" borderRadius="full" px={3} fontSize="sm">
                v2.0 LIVE
              </Badge>
            </HStack>
            <Text color="gray.500" fontWeight="medium" mt={1} fontSize={{ base: "sm", md: "md" }}>
              Real-time performance ecosystem tracking
            </Text>
          </Box>
          <HStack
            w={{ base: "full", md: "auto" }}
            spacing={3}
            justify={{ base: "space-between", sm: "flex-end" }}
          >
            <Button
              leftIcon={<FaDownload />}
              colorScheme="blue"
              borderRadius="xl"
              shadow="md"
              size={{ base: "md", md: "md" }}
              onClick={handleExport}
              isLoading={isExporting}
              w={{ base: "full", sm: "auto" }}
            >
              Export PDF
            </Button>
            <IconButton
              aria-label="Refresh"
              icon={<FaSyncAlt />}
              variant="outline"
              borderRadius="xl"
              size={{ base: "md", md: "md" }}
            />
          </HStack>
        </Flex>

        {/* ADVANCED MULTI-FILTER PANEL */}
        <MotionBox
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          bg="white"
          p={{ base: 4, md: 6 }}
          borderRadius="3xl"
          shadow="sm"
          border="1px solid"
          borderColor="gray.100"
        >
          <VStack spacing={5} align="stretch">
            <Flex
              direction={{ base: "column", md: "row" }}
              gap={4}
              align="stretch"
            >
              <InputGroup flex={1} minW="0">
                <InputLeftElement h="full" pointerEvents="none">
                  <FaSearch color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="Search transactions, users..."
                  h="44px"
                  borderRadius="14px"
                  bg="gray.50"
                  border="none"
                />
              </InputGroup>

              <SimpleGrid
                columns={{ base: 1, sm: 2, lg: 3 }}
                spacing={4}
                w="100%"
                flex={2}
              >
                <Box minW="0">
                  <Select
                    isMulti
                    placeholder="Categories..."
                    options={CATEGORY_OPTIONS}
                    styles={selectStyles}
                  />
                </Box>
                <Box minW="0">
                  <Select
                    placeholder="Tier..."
                    options={TIER_OPTIONS}
                    styles={selectStyles}
                  />
                </Box>
                <Box minW="0">
                  <Select
                    placeholder="Status..."
                    options={STATUS_OPTIONS}
                    styles={selectStyles}
                  />
                </Box>
              </SimpleGrid>
            </Flex>

            <Flex
              direction={{ base: "column", sm: "row" }}
              gap={4}
              align="center"
              justify="space-between"
            >
              <HStack
                spacing={3}
                flex={1}
                w="100%"
                maxW={{ sm: "320px", md: "380px" }}
              >
                <HStack
                  bg="gray.50"
                  px={4}
                  py={2}
                  borderRadius="14px"
                  flex={1}
                  border="1px solid"
                  borderColor="gray.100"
                  minW="0"
                >
                  <Icon as={FaCalendarAlt} color="blue.400" />
                  <Input
                    type="date"
                    variant="unstyled"
                    fontSize="sm"
                    fontWeight="bold"
                    minW="100px"
                  />
                  <Text fontSize="xs" color="gray.400" whiteSpace="nowrap">
                    TO
                  </Text>
                  <Input
                    type="date"
                    variant="unstyled"
                    fontSize="sm"
                    fontWeight="bold"
                    minW="100px"
                  />
                </HStack>
              </HStack>

              <HStack spacing={3} w={{ base: "full", sm: "auto" }}>
                <Button
                  variant="ghost"
                  size="sm"
                  color="gray.500"
                  onClick={() => window.location.reload()}
                  w={{ base: "full", sm: "auto" }}
                >
                  Clear All
                </Button>
                <Button
                  colorScheme="blue"
                  size="sm"
                  px={8}
                  borderRadius="full"
                  w={{ base: "full", sm: "auto" }}
                >
                  Apply Insights
                </Button>
              </HStack>
            </Flex>
          </VStack>
        </MotionBox>

        {/* Stats Grid */}
        <SimpleGrid
          columns={{ base: 1, sm: 2, lg: 4 }}
          spacing={{ base: 4, md: 6 }}
        >
          <StatCard
            title="REVENUE"
            value="$128,430"
            growth="12.5%"
            isUp
            icon={FaGem}
            color="blue"
            gradient="linear(to-r, blue.500, cyan.400)"
          />
          <StatCard
            title="CONVERSION"
            value="4.2%"
            growth="0.8%"
            isUp
            icon={FaChartLine}
            color="purple"
            gradient="linear(to-r, purple.500, pink.400)"
          />
          <StatCard
            title="FRAUD RISK"
            value="0.02%"
            growth="0.1%"
            isUp={false}
            icon={FaShieldAlt}
            color="green"
            gradient="linear(to-r, green.400, teal.400)"
          />
          <StatCard
            title="ORDERS"
            value="1,842"
            growth="5.4%"
            isUp
            icon={FaShoppingCart}
            color="orange"
            gradient="linear(to-r, orange.500, yellow.400)"
          />
        </SimpleGrid>

        {/* Main Analytics Content */}
        <Grid
  templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
  gap={{ base: 6, md: 8 }}
  w="100%"
  maxW="100%"
  overflow="hidden"
>
  {/* Left Chart - Growth Velocity */}
  <GridItem
    bg="white"
    p={{ base: 5, md: 6, lg: 8 }}
    borderRadius="2xl"
    border="1px solid"
    borderColor="gray.200"
    shadow="sm"
    w="100%"
    overflow="hidden"
  >
    <Flex
      direction={{ base: "column", sm: "row" }}
      justify="space-between"
      align={{ base: "start", sm: "center" }}
      mb={6}
      gap={4}
      flexWrap="wrap"
    >
      <Box>
        <Heading size={{ base: "md", md: "lg" }}>Growth Velocity</Heading>
        <Text fontSize="sm" color="gray.500">
          Monthly scale vs projection
        </Text>
      </Box>
      <HStack
        bg="gray.50"
        p={1}
        borderRadius="md"
        alignSelf={{ base: "flex-start", sm: "center" }}
        flexShrink={0}
      >
        <Button size="xs" variant="ghost">
          Income
        </Button>
        <Button size="xs" colorScheme="blue" shadow="sm">
          Volume
        </Button>
      </HStack>
    </Flex>

    {/* Chart container with controlled height + no overflow */}
    <Box
      position="relative"
      height={{ base: "260px", sm: "300px", md: "340px", lg: "380px" }}
      w="100%"
      minHeight="240px"
      overflow="hidden"
    >
      <Line
        data={{
          labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            {
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
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { maxTicksLimit: 6 } },
            y: { beginAtZero: true },
          },
        }}
      />
    </Box>
  </GridItem>

  {/* Right Chart - Acquisition */}
  <GridItem
    bg="white"
    p={{ base: 5, md: 6, lg: 8 }}
    borderRadius="2xl"
    border="1px solid"
    borderColor="gray.200"
    shadow="sm"
    w="100%"
    overflow="hidden"
  >
    <Heading size={{ base: "md", md: "lg" }} mb={2}>
      Acquisition
    </Heading>
    <Text fontSize="sm" color="gray.500" mb={6}>
      Channels driving growth
    </Text>

    {/* Doughnut container */}
    <Box
      position="relative"
      height={{ base: "220px", sm: "240px", md: "280px", lg: "320px" }}
      w="100%"
      minHeight="200px"
      overflow="hidden"
    >
      <Doughnut
        data={{
          labels: ["Search", "Social", "Direct"],
          datasets: [
            {
              data: [55, 25, 20],
              backgroundColor: ["#3182ce", "#805ad5", "#E2E8F0"],
              borderWidth: 0,
              hoverOffset: 10,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          cutout: "70%",
          plugins: { legend: { display: false } },
        }}
      />

      <Center
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        flexDirection="column"
        textAlign="center"
        pointerEvents="none"
      >
        <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="900">
          84%
        </Text>
        <Text fontSize="sm" color="gray.500">
          Total Organic
        </Text>
      </Center>
    </Box>

    <VStack mt={8} spacing={4}>
      {[
        { l: "Search", p: "55%", c: "blue.500" },
        { l: "Social", p: "25%", c: "purple.500" },
        { l: "Direct", p: "20%", c: "gray.200" },
      ].map((item) => (
        <Flex key={item.l} w="full" justify="space-between" align="center">
          <HStack>
            <Box boxSize={2.5} borderRadius="full" bg={item.c} />
            <Text fontSize="sm" fontWeight="bold" color="gray.600">
              {item.l}
            </Text>
          </HStack>
          <Text fontSize="sm" fontWeight="bold">
            {item.p}
          </Text>
        </Flex>
      ))}
    </VStack>
  </GridItem>
</Grid>
        {/* Transactions Table */}
        <Box
          bg="white"
          borderRadius="3xl"
          border="1px solid"
          borderColor="gray.100"
          shadow="sm"
          overflow="hidden"
        >
          <Flex
            p={{ base: 4, md: 6 }}
            direction={{ base: "column", sm: "row" }}
            justify="space-between"
            align={{ base: "start", sm: "center" }}
            gap={4}
          >
            <VStack align="start" spacing={0}>
              <Heading size="sm">High-Value Stream</Heading>
              <Text fontSize="xs" color="gray.400">
                Real-time settlement tracking
              </Text>
            </VStack>
            <Button size="sm" rightIcon={<FaEllipsisV />} variant="ghost">
              Audit Logs
            </Button>
          </Flex>
          <Box overflowX="auto">
            <Table variant="simple" size={{ base: "sm", md: "md" }} minW="800px">
              <Thead bg="gray.50">
                <Tr>
                  <Th color="gray.400" border="none" pl={6}>Entity</Th>
                  <Th color="gray.400" border="none">Category</Th>
                  <Th color="gray.400" border="none">Transaction ID</Th>
                  <Th color="gray.400" border="none">Amount</Th>
                  <Th color="gray.400" border="none">Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {[
                  {
                    name: "Alex Rivera",
                    cat: "Mobiles",
                    id: "TXN-9021",
                    amt: "$1,200.00",
                    status: "Completed",
                    color: "green",
                  },
                  {
                    name: "Sarah Chen",
                    cat: "Fashion",
                    id: "TXN-4412",
                    amt: "$850.50",
                    status: "Processing",
                    color: "orange",
                  },
                  {
                    name: "Jake Muller",
                    cat: "Electronics",
                    id: "TXN-3310",
                    amt: "$2,400.00",
                    status: "Completed",
                    color: "green",
                  },
                ].map((row, i) => (
                  <Tr key={i} _hover={{ bg: "gray.50" }} transition="0.2s">
                    <Td borderBottom="1px solid" borderColor="gray.100" pl={6}>
                      <HStack spacing={3}>
                        <Avatar
                          size={{ base: "xs", md: "sm" }}
                          name={row.name}
                          border="2px solid white"
                          shadow="sm"
                        />
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="700" fontSize={{ base: "sm", md: "md" }}>
                            {row.name}
                          </Text>
                          <Text fontSize="xs" color="gray.400">
                            Verified Client
                          </Text>
                        </VStack>
                      </HStack>
                    </Td>
                    <Td borderBottom="1px solid" borderColor="gray.100">
                      <Tag
                        size="sm"
                        variant="subtle"
                        colorScheme="blue"
                        borderRadius="full"
                      >
                        <TagLabel fontWeight="bold">{row.cat}</TagLabel>
                      </Tag>
                    </Td>
                    <Td
                      borderBottom="1px solid"
                      borderColor="gray.100"
                      fontSize="xs"
                      fontFamily="mono"
                      color="gray.500"
                    >
                      {row.id}
                    </Td>
                    <Td
                      borderBottom="1px solid"
                      borderColor="gray.100"
                      fontWeight="900"
                      color="gray.700"
                    >
                      {row.amt}
                    </Td>
                    <Td borderBottom="1px solid" borderColor="gray.100">
                      <Badge
                        colorScheme={row.color}
                        variant="solid"
                        borderRadius="full"
                        px={3}
                        fontSize="10px"
                      >
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

const StatCard = ({
  title,
  value,
  growth,
  isUp,
  icon,
  color,
  gradient,
}: any) => (
  <MotionBox
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ y: -4, shadow: "xl" }}
    bg="white"
    p={{ base: 5, md: 6 }}
    borderRadius="3xl"
    position="relative"
    overflow="hidden"
    boxShadow="sm"
    border="1px solid"
    borderColor="gray.100"
  >
    <Box
      position="absolute"
      top={0}
      left={0}
      w="100%"
      h="100%"
      bgGradient={gradient}
      opacity={0.04}
    />
    <Flex
      justify="space-between"
      align="start"
      direction={{ base: "row", sm: "row" }}
    >
      <VStack align="start" spacing={2} flex={1}>
        <Text
          fontSize="10px"
          fontWeight="900"
          color="gray.400"
          letterSpacing="widest"
        >
          {title}
        </Text>
        <Heading
          size={{ base: "lg", md: "xl" }}
          fontWeight="900"
          color="gray.800"
        >
          {value}
        </Heading>
        <HStack spacing={2}>
          <Icon
            as={FaChartLine}
            color={isUp ? "green.400" : "red.400"}
            transform={isUp ? "" : "rotate(180deg)"}
            boxSize={4}
          />
          <Text
            fontSize="xs"
            fontWeight="bold"
            color={isUp ? "green.400" : "red.400"}
          >
            {growth}
          </Text>
          <Text fontSize="10px" color="gray.400">
            vs last month
          </Text>
        </HStack>
      </VStack>
      <Center
        bg={`${color}.50`}
        p={4}
        borderRadius="2xl"
        color={`${color}.600`}
        minW="60px"
      >
        <Icon as={icon} boxSize={6} />
      </Center>
    </Flex>
  </MotionBox>
);

export default AnalyticsTab;