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
} from "@chakra-ui/react";
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { FaCalendarAlt, FaEye, FaUserMd, FaUsers } from 'react-icons/fa';
import DashboardCard from "../common/DashboardCard/DashboardCard";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Extend Chakra UI theme (optional)
const theme = extendTheme({
  colors: {
    brand: {
      100: "#f7fafc",
      500: "#3182ce",
      900: "#1a365d",
    },
  },
});

const data = [
    { id: 1, label: 'Total Website Visits', value: 12456, icon: FaEye, color: 'teal' },
    { id: 2, label: 'Total Patients Registered', value: 3456, icon: FaUsers, color: 'blue' },
    { id: 3, label: 'Total Therapists', value: 123, icon: FaUserMd, color: 'purple' },
    { id: 4, label: 'Total Appointments', value: 789, icon: FaCalendarAlt, color: 'orange' },
  ];

// Dummy data
const dummyData = {
  visits: 1200,
  patients: 350,
  therapists: 25,
  appointments: 180,
  patientGrowth: [50, 230, 180, 210, 230, 370, 350],
  monthlyVisits: [100, 200, 150, 300, 250, 400, 500],
};

// Bar chart data
const barChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "Monthly Visits",
      data: dummyData.monthlyVisits,
      backgroundColor: "rgba(75, 192, 192, 0.6)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
    },
  ],
};

// Line chart data
const lineChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "Patient Growth",
      data: dummyData.patientGrowth,
      borderColor: "rgba(153, 102, 255, 1)",
      backgroundColor: "rgba(153, 102, 255, 0.2)",
      borderWidth: 2,
    },
  ],
};

// Dashboard component
const Dashboard = () => {
  return (
    <ChakraProvider theme={theme}>
      <Box p={5}>
        <Heading mb={5} size={'lg'} color={'teal.600'}>Dashboard</Heading>
        <Box mb={4}>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
        {data.map((item) => (
          <DashboardCard
            key={item.id}
            label={item.label}
            value={item.value}
            icon={item.icon}
            color={item.color}
          />
        ))}
      </SimpleGrid>
    </Box>

        <Grid templateColumns="repeat(2, 1fr)" gap={6} mb={10}>
          <GridItem>
            <Box bg="white" p={5} borderRadius="lg" boxShadow="md">
              <Text fontSize="lg" fontWeight="bold" mb={5}>
                Monthly Visits
              </Text>
              <Bar data={barChartData} />
            </Box>
          </GridItem>
          <GridItem>
            <Box bg="white" p={5} borderRadius="lg" boxShadow="md">
              <Text fontSize="lg" fontWeight="bold" mb={5}>
                Patient Growth
              </Text>
              <Line data={lineChartData} />
            </Box>
          </GridItem>
        </Grid>

        <Box bg="white" p={5} borderRadius="lg" boxShadow="md">
          <Text fontSize="lg" fontWeight="bold" mb={5}>
            Recent Appointments
          </Text>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Patient Name</Th>
                <Th>Therapist</Th>
                <Th>Date</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>John Doe</Td>
                <Td>Dr. Smith</Td>
                <Td>2023-10-01</Td>
                <Td>Completed</Td>
              </Tr>
              <Tr>
                <Td>Jane Doe</Td>
                <Td>Dr. Brown</Td>
                <Td>2023-10-02</Td>
                <Td>Scheduled</Td>
              </Tr>
              <Tr>
                <Td>Alice Johnson</Td>
                <Td>Dr. Lee</Td>
                <Td>2023-10-03</Td>
                <Td>Pending</Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default Dashboard;