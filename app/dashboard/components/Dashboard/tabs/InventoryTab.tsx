import React, { useState, useMemo } from "react";
import {
  VStack,
  SimpleGrid,
  Box,
  Text,
  HStack,
  Badge,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Progress,
  Icon,
  useColorModeValue,
  Select,
  Divider,
  Center,
  Switch,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { SearchIcon, WarningIcon, InfoOutlineIcon, DownloadIcon, SettingsIcon, RepeatIcon } from "@chakra-ui/icons";
import {
  FaBoxOpen,
  FaWarehouse,
  FaCubes,
  FaEllipsisV,
  FaChartPie,
  FaFilter,
  FaLongArrowAltUp,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MotionBox = motion(Box);

const CATEGORIES = [
  { id: 1, name: "Mobiles", skuCount: 142, stock: 88, value: 54000, trend: "Rising", type: "Electronics", lastAudit: "2024-03-01" },
  { id: 2, name: "Electronics", skuCount: 89, stock: 92, value: 32000, trend: "Rising", type: "Electronics", lastAudit: "2024-02-28" },
  { id: 3, name: "Fashion", skuCount: 320, stock: 24, value: 12500, trend: "Falling", type: "Lifestyle", lastAudit: "2024-03-05" },
  { id: 4, name: "Home Decor", skuCount: 56, stock: 65, value: 8400, trend: "Stable", type: "Lifestyle", lastAudit: "2024-03-02" },
  { id: 5, name: "Beauty", skuCount: 210, stock: 12, value: 4200, trend: "Falling", type: "Cosmetics", lastAudit: "2024-03-08" },
  { id: 6, name: "Books", skuCount: 45, stock: 95, value: 2100, trend: "Stable", type: "Education", lastAudit: "2024-02-15" },
];

const InventoryTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [trendFilter, setTrendFilter] = useState("All");
  const [valueRange, setValueRange] = useState("All");
  const [urgentOnly, setUrgentOnly] = useState(false);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const tableHeadBg = useColorModeValue("gray.50", "gray.700");

  const filteredData = useMemo(() => {
    return CATEGORIES.filter((cat) => {
      const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "All" || cat.type === typeFilter;
      const matchesTrend = trendFilter === "All" || cat.trend === trendFilter;
      const matchesUrgent = !urgentOnly || cat.stock < 25;

      let matchesValue = true;
      if (valueRange === "High") matchesValue = cat.value > 20000;
      if (valueRange === "Mid") matchesValue = cat.value <= 20000 && cat.value >= 5000;
      if (valueRange === "Low") matchesValue = cat.value < 5000;

      return matchesSearch && matchesType && matchesUrgent && matchesTrend && matchesValue;
    });
  }, [searchTerm, typeFilter, urgentOnly, trendFilter, valueRange]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(43, 108, 176);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("INVENTORY MASTER REPORT", 14, 25);

    doc.setTextColor(200, 200, 200);
    doc.setFontSize(10);
    doc.text(`Run Date: ${new Date().toLocaleDateString()} | Records: ${filteredData.length}`, 14, 33);

    const tableColumn = ["Category", "Type", "Stock %", "Trend", "Value", "SKU"];
    const tableRows = filteredData.map((item) => [
      item.name,
      item.type,
      `${item.stock}%`,
      item.trend,
      `$${item.value.toLocaleString()}`,
      item.skuCount,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 50,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [43, 108, 176] },
      alternateRowStyles: { fillColor: [245, 247, 250] },
    });

    doc.save(`Inventory_Export_${Date.now()}.pdf`);
  };

  return (
    <Box
      w="100%"
      px={{ base: 3, sm: 5, md: 6, lg: 8 }}
      py={{ base: 4, md: 6, lg: 8 }}
      bg={useColorModeValue("gray.50", "gray.900")}
      minH="100vh"
    >
      <VStack spacing={{ base: 6, lg: 8 }} align="stretch" maxW="1400px" mx="auto">
        {/* Summary Cards */}
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={{ base: 4, md: 6 }}>
          <SummaryCard icon={FaWarehouse} title="Warehouse" value="78%" detail="Storage Used" color="blue.500" />
          <SummaryCard
            icon={WarningIcon}
            title="Urgent Alerts"
            value={CATEGORIES.filter((c) => c.stock < 25).length}
            detail="Action Required"
            color="red.500"
            pulse
          />
          <SummaryCard
            icon={FaCubes}
            title="Total Assets"
            value={`$${(CATEGORIES.reduce((a, b) => a + b.value, 0) / 1000).toFixed(1)}k`}
            detail="Current Value"
            color="purple.500"
          />
        </SimpleGrid>

        {/* Filter Panel */}
        <Box
          bg={cardBg}
          p={{ base: 4, md: 5, lg: 6 }}
          borderRadius="2xl"
          shadow="sm"
          border="1px solid"
          borderColor={borderColor}
        >
          <VStack spacing={5} align="stretch">
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={4}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search items..."
                  borderRadius="xl"
                  variant="filled"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>

              <Select
                borderRadius="xl"
                variant="filled"
                icon={<FaFilter />}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Electronics">Electronics</option>
                <option value="Lifestyle">Lifestyle</option>
              </Select>

              <Select
                borderRadius="xl"
                variant="filled"
                icon={<FaLongArrowAltUp />}
                onChange={(e) => setTrendFilter(e.target.value)}
              >
                <option value="All">All Trends</option>
                <option value="Rising">Rising</option>
                <option value="Stable">Stable</option>
                <option value="Falling">Falling</option>
              </Select>

              <Select borderRadius="xl" variant="filled" onChange={(e) => setValueRange(e.target.value)}>
                <option value="All">Value: All</option>
                <option value="High">High (&gt;$20k)</option>
                <option value="Mid">Mid ($5k-$20k)</option>
                <option value="Low">Low (&lt;$5k)</option>
              </Select>
            </SimpleGrid>

            <Divider />

            <Flex
              direction={{ base: "column", sm: "row" }}
              justify="space-between"
              align={{ base: "stretch", sm: "center" }}
              gap={4}
              wrap="wrap"
            >
              <HStack spacing={6} flexWrap="wrap">
                <FormControl display="flex" alignItems="center">
                  <Switch
                    id="urgent-st"
                    colorScheme="red"
                    size="sm"
                    onChange={(e) => setUrgentOnly(e.target.checked)}
                  />
                  <FormLabel htmlFor="urgent-st" mb="0" ml={2} fontSize="xs" fontWeight="bold" color="gray.500">
                    LOW STOCK ONLY
                  </FormLabel>
                </FormControl>
                <Badge colorScheme="blue" variant="subtle" borderRadius="full" px={3}>
                  {filteredData.length} Results
                </Badge>
              </HStack>

              <HStack spacing={3} justify={{ base: "space-between", sm: "flex-end" }} w={{ base: "full", sm: "auto" }}>
                <Button leftIcon={<FaChartPie />} size="sm" variant="ghost" colorScheme="blue">
                  Analytics
                </Button>
                <Button
                  leftIcon={<DownloadIcon />}
                  colorScheme="red"
                  size="sm"
                  borderRadius="xl"
                  onClick={downloadPDF}
                >
                  Export PDF
                </Button>
              </HStack>
            </Flex>
          </VStack>
        </Box>

        {/* Table Area */}
        <Box
          bg={cardBg}
          borderRadius="2xl"
          shadow="sm"
          border="1px solid"
          borderColor={borderColor}
          overflow="hidden"
        >
          <Box overflowX="auto" w="100%">
            <Table variant="simple" size={{ base: "sm", md: "md" }} minW="900px">
              <Thead bg={tableHeadBg}>
                <Tr>
                  <Th minW="220px">Asset</Th>
                  <Th minW="180px">Health</Th>
                  <Th minW="100px">Trend</Th>
                  <Th minW="120px" isNumeric>
                    Value
                  </Th>
                  <Th w="60px"></Th>
                </Tr>
              </Thead>
              <Tbody>
                <AnimatePresence mode="popLayout">
                  {filteredData.length > 0 ? (
                    filteredData.map((cat) => <TableRow key={cat.id} cat={cat} />)
                  ) : (
                    <Tr>
                      <Td colSpan={5}>
                        <Center py={12} flexDirection="column">
                          <Icon as={SearchIcon} boxSize={10} color="gray.200" mb={4} />
                          <Text color="gray.400" fontSize="md" fontWeight="medium">
                            No matching items found
                          </Text>
                        </Center>
                      </Td>
                    </Tr>
                  )}
                </AnimatePresence>
              </Tbody>
            </Table>
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};

const TableRow = ({ cat }: { cat: any }) => {
  const isCritical = cat.stock < 25;

  return (
    <Tr
      as={motion.tr}
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      _hover={{ bg: useColorModeValue("blue.50", "whiteAlpha.100") }}
      transition="background 0.2s"
    >
      <Td>
        <HStack spacing={4}>
          <Box
            p={2.5}
            bg={isCritical ? "red.50" : "blue.50"}
            color={isCritical ? "red.500" : "blue.500"}
            borderRadius="15px"
          >
            <Icon as={FaBoxOpen} boxSize={5} />
          </Box>
          <Box>
            <Text fontWeight="700" fontSize="sm">
              {cat.name}
            </Text>
            <Text fontSize="xs" color="gray.500" mt={0.5}>
              {cat.type}
            </Text>
          </Box>
        </HStack>
      </Td>
      <Td minW="180px">
        <VStack align="start" spacing={1}>
          <Flex w="full" justify="space-between" align="center">
            <Text fontSize="xs" fontWeight="bold" color={isCritical ? "red.600" : "gray.600"}>
              {cat.stock}%
            </Text>
            {isCritical && <WarningIcon color="red.400" boxSize={3} />}
          </Flex>
          <Progress
            value={cat.stock}
            size="xs"
            w="full"
            borderRadius="full"
            colorScheme={isCritical ? "red" : "blue"}
          />
        </VStack>
      </Td>
      <Td>
        <Badge
          variant="subtle"
          colorScheme={cat.trend === "Rising" ? "green" : cat.trend === "Falling" ? "red" : "gray"}
          borderRadius="full"
          px={3}
          fontSize="xs"
        >
          {cat.trend}
        </Badge>
      </Td>
      <Td isNumeric>
        <Text fontWeight="700" fontSize="sm">
          ${cat.value.toLocaleString()}
        </Text>
        <Text fontSize="xs" color="gray.500" mt={0.5}>
          Audit: {cat.lastAudit}
        </Text>
      </Td>
      <Td textAlign="right">
        <Menu isLazy>
          <MenuButton as={IconButton} icon={<FaEllipsisV />} variant="ghost" size="sm" borderRadius="full" />
          <MenuList borderRadius="xl" shadow="xl">
            <MenuItem icon={<InfoOutlineIcon />}>Details</MenuItem>
            <MenuItem icon={<RepeatIcon />}>Restock</MenuItem>
            <Divider />
            <MenuItem icon={<SettingsIcon />} color="red.500">
              Manage
            </MenuItem>
          </MenuList>
        </Menu>
      </Td>
    </Tr>
  );
};

const SummaryCard = ({ icon, title, value, detail, color, pulse }: any) => (
  <MotionBox
    whileHover={{ y: -4, shadow: "md" }}
    bg="white"
    p={{ base: 5, md: 6 }}
    borderRadius="2xl"
    shadow="sm"
    border="1px solid"
    borderColor="gray.100"
    position="relative"
    overflow="hidden"
  >
    <HStack spacing={4}>
      <Flex p={3} bg={`${color.split(".")[0]}.50`} color={color} borderRadius="2xl">
        <Icon as={icon} boxSize={6} />
      </Flex>
      <VStack align="start" spacing={1}>
        <Text fontSize="xs" color="gray.500" fontWeight="bold" textTransform="uppercase">
          {title}
        </Text>
        <Heading size={{ base: "lg", md: "xl" }} fontWeight="900">
          {value}
        </Heading>
        <Text fontSize="xs" color="gray.500">
          {detail}
        </Text>
      </VStack>
    </HStack>
    {pulse && (
      <Box position="absolute" top={3} right={3}>
        <Box animation="pulse 2s infinite" bg="red.400" w={2.5} h={2.5} borderRadius="full" />
      </Box>
    )}
  </MotionBox>
);

export default InventoryTab;