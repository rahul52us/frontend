import {
  Avatar,
  Badge,
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Grid,
  GridItem,
  Image,
  Stack,
  Tab,
  Table,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Th,
  Thead,
  Tbody,
  Tr,
  useColorModeValue,
  useDisclosure,
  Td,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaBrain, FaUserFriends, FaVideo } from "react-icons/fa";
import { GiPsychicWaves } from "react-icons/gi";
import stores from "../../../../store/stores";
import { observer } from "mobx-react-lite";
import Link from "next/link";

const TherapistsTable = observer(() => {
  const {
    userStore: { getAllUsers, therapist },
  } = stores;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const hoverColor = useColorModeValue("gray.100", "gray.700");
  const stripedColor = useColorModeValue("gray.50", "gray.800");

  useEffect(() => {
    getAllUsers({ page: 1, limit: 30 });
  }, [getAllUsers]);

  const handleRowClick = (user) => {
    setSelectedTherapist(user);
    onOpen();
  };

  const AvailabilityBadge = ({ type }) => (
    <Badge
      colorScheme={type === "online" ? "green" : "blue"}
      px={3}
      py={1}
      borderRadius="full"
      w={"fit-content"}
      display="flex"
      alignItems="center"
      size={"lg"}
      gap={2}
    >
      {type === "online" ? <FaVideo /> : <FaUserFriends />}
      {type}
    </Badge>
  );

  return (
    <Box p={4}>
      <Table
        variant="striped"
        colorScheme="gray"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="md"
      >
        <Thead bg={"teal.700"}>
          <Tr>
            <Th color="white">User</Th>
            <Th color="white">Username</Th>
            <Th color="white">Role</Th>
            <Th color="white">Experience</Th>
            <Th color="white">Charges</Th>
            <Th color="white">Availability</Th>
            <Th color="white">Bio</Th>
          </Tr>
        </Thead>
        <Tbody>
          {Array.isArray(therapist.data?.data) &&
            therapist.data?.data.map((user, index) => (
              <Tr
                key={index}
                onClick={() => handleRowClick(user)}
                _hover={{ bg: hoverColor, cursor: "pointer" }}
                _even={{ bg: stripedColor }}
              >
                <Td>
                  <Avatar
                    src={user.profileDetails?.personalInfo?.image}
                    name={user.profileDetails?.personalInfo?.name}
                    size="md"
                  />
                </Td>
                <Td>{user.username}</Td>
                <Td>{user.role}</Td>
                <Td>{user.profileDetails?.personalInfo?.experience} years</Td>
                <Td>₹{user.profileDetails?.personalInfo?.charges}</Td>
                <Td>
                  <Stack direction="row" flexWrap="wrap">
                    {user.profileDetails?.personalInfo?.availability?.map(
                      (type, idx) => (
                        <AvailabilityBadge key={idx} type={type} />
                      )
                    )}
                  </Stack>
                </Td>
                <Td>{user.profileDetails?.personalInfo?.bio}</Td>
              </Tr>
            ))}
        </Tbody>
      </Table>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader
            bgGradient="linear(to-r, blue.400, purple.400)"
            color="white"
          >
            <Flex align="center" gap={3}>
              <GiPsychicWaves size="24px" />
              User Profile
            </Flex>
          </DrawerHeader>

          {selectedTherapist && (
            <DrawerBody>
              <Box position="relative">
                <Flex justify={"center"}>
                  <Image
                    src={selectedTherapist?.pic?.url}
                    h={"160px"}
                    objectFit={"cover"}
                    rounded={"xl"}
                    alt=""
                  />
                </Flex>

                <Box textAlign="center" mt={2}>
                  <Text fontSize="2xl" fontWeight="bold">
                    {selectedTherapist.profileDetails?.personalInfo?.name}
                  </Text>
                  <Text color="gray.500">
                    {
                      selectedTherapist.profileDetails?.personalInfo
                        ?.qualifications
                    }
                  </Text>

                  <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={4}>
                    <GridItem>
                      <Box bg="blue.50" p={3} borderRadius="lg">
                        <Text fontSize="sm" color="gray.500">
                          Experience
                        </Text>
                        <Text fontWeight="bold">
                          {
                            selectedTherapist.profileDetails?.personalInfo
                              ?.experience
                          }{" "}
                          Years
                        </Text>
                      </Box>
                    </GridItem>
                    <GridItem>
                      <Box bg="blue.50" p={3} borderRadius="lg">
                        <Text fontSize="sm" color="gray.500">
                          Session Fee
                        </Text>
                        <Text fontWeight="bold">
                          ₹
                          {
                            selectedTherapist.profileDetails?.personalInfo
                              ?.charges
                          }
                        </Text>
                      </Box>
                    </GridItem>
                  </Grid>
                </Box>

                <Tabs mt={6} variant="soft-rounded" colorScheme="teal">
                  <TabList>
                    <Tab _selected={{ color: "white", bg: "blue.400" }}>
                      Bio
                    </Tab>
                    <Tab _selected={{ color: "white", bg: "blue.400" }}>
                      Expertise
                    </Tab>
                    <Tab _selected={{ color: "white", bg: "blue.400" }}>
                      Availability
                    </Tab>
                    <Tab _selected={{ color: "white", bg: "blue.400" }}>
                      Contact
                    </Tab>
                    <Tab _selected={{ color: "white", bg: "blue.400" }}>
                      Link
                    </Tab>
                  </TabList>

                  <TabPanels mt={2}>
                    <TabPanel>
                      <Text color="gray.600" lineHeight="tall">
                        {selectedTherapist.profileDetails?.personalInfo?.bio}
                      </Text>
                    </TabPanel>

                    <TabPanel>
                      <Stack spacing={3}>
                        {selectedTherapist.profileDetails?.personalInfo?.expertise?.map(
                          (item, idx) => (
                            <Flex
                              key={idx}
                              align="center"
                              gap={3}
                              p={3}
                              bg="gray.50"
                              borderRadius="md"
                            >
                              <FaBrain color="#3182CE" />
                              <Text fontWeight="500">{item}</Text>
                            </Flex>
                          )
                        )}
                      </Stack>
                    </TabPanel>

                    <TabPanel>
                      <Stack spacing={4}>
                        {selectedTherapist.profileDetails?.personalInfo?.availability?.map(
                          (type, idx) => (
                            <AvailabilityBadge key={idx} type={type} />
                          )
                        )}
                      </Stack>
                    </TabPanel>

                    <TabPanel>
                      <Stack spacing={4}>
                        <Text fontSize="sm" color="gray.500">
                          Email: {selectedTherapist.username}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          Phone:{" "}
                          {
                            selectedTherapist.profileDetails?.personalInfo
                              ?.phoneNumber
                          }
                        </Text>
                      </Stack>
                    </TabPanel>
                    <TabPanel>
                    <Stack spacing={4}>
  <Link
    href={selectedTherapist.profileDetails?.personalInfo?.link || "#"}
    target="_blank"
    rel="noopener noreferrer"
    style={{ color: "gray" }}
  >
    {selectedTherapist.profileDetails?.personalInfo?.link}
  </Link>
</Stack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </DrawerBody>
          )}
        </DrawerContent>
      </Drawer>
    </Box>
  );
});

export default TherapistsTable;
