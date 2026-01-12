import React, { useState, useMemo } from "react";
import {
  VStack,SimpleGrid,Box,Text,Avatar,
  HStack,Badge,Heading,Table,Thead,
  Tbody,Tr,Th,Td,Flex,Input,InputGroup,InputLeftElement,
  Button,Menu,MenuButton,MenuList,MenuItem,IconButton,Progress,Icon,Grid,GridItem,useColorModeValue,Select,Divider,Center,
  Tooltip as ChakraTooltip,
} from "@chakra-ui/react";
import { SearchIcon, InfoOutlineIcon, DownloadIcon } from "@chakra-ui/icons";
import {
  FaUserPlus,FaEnvelope,FaBan,FaArrowTrendUp,FaWallet,FaEllipsis,FaClock, FaFilePdf,FaFilter,
} from "react-icons/fa6";
import { Bar } from "react-chartjs-2";
import {
Chart as ChartJS,CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend,
} from "chart.js";
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
  const tableHeadBg = useColorModeValue("gray.50", "gray.700");

  const filteredUsers = useMemo(() => {
    return CUSTOMER_DATA.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || user.status === statusFilter;
      const matchesSpent = spentFilter === "All" || (spentFilter === "High" ? user.spent > 3000 : user.spent <= 3000);
      const matchesLoyalty = loyaltyFilter === "All" || (loyaltyFilter === "Premium" ? user.loyalty >= 80 : user.loyalty < 80);
      return matchesSearch && matchesStatus && matchesSpent && matchesLoyalty;
    });
  }, [searchQuery, statusFilter, spentFilter, loyaltyFilter]);

  const downloadReport = () => {
    setIsExporting(true);
    const doc = new jsPDF();

    doc.setFillColor(107, 70, 193);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("Customer Insights Report", 15, 25);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()} | Total Records: ${filteredUsers.length}`, 15, 33);

    const tableRows = filteredUsers.map((u) => [u.name, u.email, u.status, `$${u.spent}`, `${u.loyalty}%`]);

    autoTable(doc, {
      head: [["Name", "Email", "Status", "Total Spent", "Loyalty"]],
      body: tableRows,
      startY: 45,
      headStyles: { fillColor: [107, 70, 193] },
      alternateRowStyles: { fillColor: [245, 245, 255] },
    });

    doc.save(`Customer_Report_${Date.now()}.pdf`);
    setTimeout(() => setIsExporting(false), 1000);
  };

  return (
    <Box
      w="100%"
      px={{ base: 2, sm: 2, md: 4, lg: 4 }}
      py={{ base: 2, md: 4, lg: 4 }}
      bg={useColorModeValue("gray.50", "gray.900")}
      minH="100vh"
    >
      <VStack spacing={{ base: 6, lg: 8 }} align="stretch" maxW="1400px" mx="auto">
        {/* Header */}
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "start", md: "center" }}
          gap={5}
        >
          <Box>
            <Heading
              size={{ base: "xl", md: "xl" }}
              fontWeight="900"
              letterSpacing="tight"
              color={useColorModeValue("gray.800", "white")}
            >
              CRM Directory
            </Heading>
            <Text color="gray.500" fontSize={{ base: "sm", md: "md" }} mt={1}>
              Manage relationships and track customer lifecycle
            </Text>
          </Box>
          <Button
            leftIcon={<DownloadIcon />}
            colorScheme="purple"
            variant="solid"
            borderRadius="xl"
            size={{ base: "md", md: "lg" }}
            isLoading={isExporting}
            onClick={downloadReport}
            shadow="lg"
            w={{ base: "full", md: "auto" }}
          >
            Download PDF
          </Button>
        </Flex>

        {/* Stats */}
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={{ base: 4, md: 6 }}>
          <StatSummary title="Active Base" value="8,420" growth="+12%" color="blue.500" icon={FaUserPlus} />
          <StatSummary title="Avg. Ticket" value="$142.50" growth="+5.2%" color="purple.500" icon={FaWallet} />
          <StatSummary title="Retention" value="64%" growth="+2.1%" color="teal.500" icon={FaClock} />
          <StatSummary title="Risk Level" value="Low" growth="Safe" color="green.500" icon={FaArrowTrendUp} />
        </SimpleGrid>

        {/* Filters */}
        <Box
          bg={bgCard}
          p={{ base: 4, md: 5, lg: 6 }}
          borderRadius="2xl"
          shadow="sm"
          border="1px solid"
          borderColor={borderColor}
        >
          <Flex direction={{ base: "column", lg: "row" }} gap={4} align="stretch">
            <InputGroup size="md" flex="1">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search name, email or ID..."
                borderRadius="xl"
                variant="filled"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3} flex="2">
              <Select
                borderRadius="xl"
                variant="filled"
                icon={<FaFilter />}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="VIP">VIP Members</option>
                <option value="Active">Active Users</option>
                <option value="Inactive">Inactive</option>
              </Select>

              <Select borderRadius="xl" variant="filled" onChange={(e) => setSpentFilter(e.target.value)}>
                <option value="All">All Spending</option>
                <option value="High">High Spenders ({`>`}$3k)</option>
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

        {/* Main Content */}
        <Grid
          templateColumns={{ base: "100%", xl: "minmax(350px, 1fr) 2.5fr" }}
          gap={{ base: 6, md: 8 }}
          w="100%"
          maxW="100%"
        >
          {/* Left side - Chart + Promo */}
          <VStack spacing={6} align="stretch" w="100%" maxW="100vw">
            {/* Purchase Frequency Chart */}
            <MotionBox
              bg={bgCard}
              p={{ base: 4, md: 6 }}
              borderRadius="2xl"
              shadow="sm"
              border="1px solid"
              borderColor={borderColor}
              w="100%"
              overflow="hidden" // Prevents the chart from leaking out
            >
              <Heading
                size="xs"
                mb={6}
                textTransform="uppercase"
                letterSpacing="widest"
                color="gray.500"
              >
                Purchase Frequency
              </Heading>

              <Box
                position="relative"
                height={{ base: "200px", md: "260px" }}
                w="100%"
              >
                <Bar
                  data={{
                    labels: ["1-2", "3-5", "6-10", "10+"],
                    datasets: [
                      {
                        label: "Users",
                        data: [450, 230, 120, 85],
                        backgroundColor: ["#E2E8F0", "#CBD5E0", "#9F7AEA", "#6B46C1"],
                        borderRadius: 10,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: { beginAtZero: true },
                    },
                  }}
                />
              </Box>
            </MotionBox>

            {/* Promo Card */}
            <Box
              bgGradient="linear(to-br, purple.600, blue.600)"
              p={{ base: 5, md: 6 }}
              borderRadius="2xl"
              color="white"
              shadow="xl"
              position="relative"
              overflow="hidden"
              w="100%" // Explicitly full width
            >
              <VStack
                align="start"
                spacing={4}
                position="relative"
                zIndex={1}
                w="full"
              >
                <Badge colorScheme="whiteAlpha" px={3} py={1} borderRadius="full">
                  Campaign Live
                </Badge>

                <Box w="full">
                  <Heading size={{ base: "md", md: "lg" }}>
                    VIP Retention
                  </Heading>
                  <Text
                    fontSize="sm"
                    mt={1}
                    opacity={0.9}
                    whiteSpace="normal" // Ensures text wraps on small screens
                  >
                    Automated outreach for high-value churn risks.
                  </Text>
                </Box>

                <Button
                  size="md"
                  w="full"
                  bg="white"
                  color="purple.600"
                  _hover={{ bg: "gray.100" }}
                  borderRadius="xl"
                >
                  Configure Workflow
                </Button>
              </VStack>
              <Icon
                as={FaFilePdf}
                position="absolute"
                right="-10%"
                bottom="-10%"
                boxSize={{ base: "80px", md: "140px" }}
                opacity={0.1}
                transform="rotate(-15deg)"
              />
            </Box>
          </VStack>

          {/* Right side - Table (Keep as is since you liked it) */}
          <GridItem
            bg={bgCard}
            p={{ base: 4, md: 6 }}
            borderRadius="2xl"
            shadow="sm"
            border="1px solid"
            borderColor={borderColor}
            w="100%"
            overflow="hidden"
          >
            <Flex justify="space-between" align="center" mb={6} flexWrap="wrap" gap={4}>

              <Box>

                <Heading size={{ base: "lg", md: "xl" }} fontWeight="900">

                  User Directory

                </Heading>

                <Text fontSize="sm" color="gray.500" fontWeight="medium">

                  SHOWING {filteredUsers.length} MEMBERS

                </Text>

              </Box>

              <ChakraTooltip label="Table Settings">

                <IconButton aria-label="Settings" icon={<InfoOutlineIcon />} size="md" variant="ghost" />

              </ChakraTooltip>

            </Flex>



            <Box overflowX="auto" w="100%">

              <Table variant="simple" size={{ base: "sm", md: "md" }} minW="600px">

                <Thead bg={tableHeadBg}>

                  <Tr>

                    <Th border="none" minW="180px">Member</Th>

                    <Th border="none" display={{ base: "none", md: "table-cell" }}>Volume</Th>

                    <Th border="none">Status</Th>

                    <Th border="none" minW="120px">Loyalty</Th>

                    <Th border="none" w="60px"></Th>

                  </Tr>

                </Thead>

                <Tbody>

                  <AnimatePresence mode="popLayout">

                    {filteredUsers.length > 0 ? (

                      filteredUsers.map((user) => (

                        <Tr

                          key={user.id}

                          as={motion.tr}

                          layout

                          initial={{ opacity: 0, y: 10 }}

                          animate={{ opacity: 1, y: 0 }}

                          exit={{ opacity: 0, y: -10 }}

                          _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}

                          transition="background 0.2s"

                        >

                          <Td py={4}>

                            <HStack spacing={3}>

                              <Avatar size="sm" src={`https://i.pravatar.cc/150?u=${user.id}`} />

                              <Box>

                                <Text fontWeight="700" fontSize="sm">

                                  {user.name}

                                </Text>

                                <Text fontSize="xs" color="gray.500" mt={0.5}>

                                  {user.email}

                                </Text>

                              </Box>

                            </HStack>

                          </Td>

                          <Td display={{ base: "none", md: "table-cell" }}>

                            <Text fontWeight="bold" fontSize="sm">

                              ${user.spent.toLocaleString()}

                            </Text>

                          </Td>

                          <Td>

                            <Badge

                              fontSize="xs"

                              px={3}

                              py={1}

                              borderRadius="md"

                              colorScheme={user.status === "VIP" ? "purple" : "blue"}

                            >

                              {user.status}

                            </Badge>

                          </Td>

                          <Td>

                            <VStack align="stretch" spacing={1}>

                              <Progress

                                value={user.loyalty}

                                size="sm"

                                colorScheme={user.loyalty > 80 ? "purple" : "blue"}

                                borderRadius="full"

                              />

                              <Text fontSize="xs" fontWeight="bold" color="gray.600">

                                {user.loyalty}% Score

                              </Text>

                            </VStack>

                          </Td>

                          <Td textAlign="right">

                            <Menu isLazy>

                              <MenuButton

                                as={IconButton}

                                icon={<FaEllipsis />}

                                variant="ghost"

                                size="sm"

                                borderRadius="full"

                              />

                              <MenuList fontSize="sm" borderRadius="xl" shadow="xl" p={2}>

                                <MenuItem icon={<FaEnvelope />} borderRadius="lg">

                                  Send Message

                                </MenuItem>

                                <MenuItem icon={<FaClock />} borderRadius="lg">

                                  View History

                                </MenuItem>

                                <Divider my={2} />

                                <MenuItem icon={<FaBan />} color="red.500" borderRadius="lg">

                                  Flag Account

                                </MenuItem>

                              </MenuList>

                            </Menu>

                          </Td>

                        </Tr>

                      ))

                    ) : (

                      <Tr>

                        <Td colSpan={5}>

                          <Center py={12} flexDirection="column">

                            <Icon as={SearchIcon} boxSize={10} color="gray.200" mb={4} />

                            <Text color="gray.400" fontSize="md" fontWeight="medium">

                              No matching customers found

                            </Text>

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
    bg="white"
    p={{ base: 5, md: 6 }}
    borderRadius="2xl"
    shadow="sm"
    border="1px solid"
    borderColor="gray.100"
    position="relative"
    overflow="hidden"
    transition={{ duration: 0.2 }}
  >
    <VStack align="start" spacing={2}>
      <Text
        color="gray.500"
        fontSize="xs"
        fontWeight="extrabold"
        textTransform="uppercase"
        letterSpacing="wide"
      >
        {title}
      </Text>
      <Heading size={{ base: "xl", md: "2xl" }} fontWeight="900">
        {value}
      </Heading>
      <Badge colorScheme="green" fontSize="xs" borderRadius="md" px={2} variant="subtle">
        {growth}
      </Badge>
    </VStack>
    <Icon
      as={StatIcon}
      position="absolute"
      right={-2}
      bottom={-2}
      boxSize={20}
      color={color}
      opacity={0.06}
      transform="rotate(-15deg)"
    />
  </MotionBox>
);

export default CustomersTab;