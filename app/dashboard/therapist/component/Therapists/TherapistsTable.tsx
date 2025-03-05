import { observer } from "mobx-react-lite";
import { useEffect, useState, useCallback } from "react";
import { Avatar, Box, Badge, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Grid, GridItem, Image, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text, Tooltip, useDisclosure } from "@chakra-ui/react";
import { FaBrain, FaUserFriends, FaVideo } from "react-icons/fa";
import { GiPsychicWaves } from "react-icons/gi";
import Link from "next/link";
import stores from "../../../../store/stores";
import useDebounce from "../../../../component/config/component/customHooks/useDebounce";
import { tablePageLimit } from "../../../../component/config/utils/variable";
import CustomTable from "../../../../component/config/component/CustomTable/CustomTable";

const TherapistsTable = observer(({onAdd, onEdit} : any) => {
  const {
    userStore: { getAllUsers, therapist },
    auth: { openNotification },
  } = stores;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  const applyGetAllTherapists = useCallback(
    ({ page = 1, limit = tablePageLimit, reset = false }) => {
      const query: any = { page, limit };

      if (debouncedSearchQuery?.trim()) {
        query.search = debouncedSearchQuery.trim();
      }

      if (reset) {
        query.page = 1;
        query.limit = tablePageLimit;
      }

      getAllUsers(query)
        .then(() => {})
        .catch((err) => {
          openNotification({
            type: "error",
            title: "Failed to get therapists",
            message: err?.message,
          });
        });
    },
    [debouncedSearchQuery, getAllUsers, openNotification]
  );

  useEffect(() => {
    applyGetAllTherapists({ page: currentPage, limit: tablePageLimit });
  }, [currentPage, debouncedSearchQuery, applyGetAllTherapists]);

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  const resetTableData = () => {
    setCurrentPage(1);
    setSearchQuery("");
    applyGetAllTherapists({ reset: true });
  };

  const handleRowClick = (user: any) => {
    setSelectedTherapist(user);
    onOpen();
  };

  const AvailabilityBadge = ({ type }: { type: string }) => (
    <Badge colorScheme={type === "online" ? "green" : "blue"} px={3} py={1} borderRadius="full" w={"fit-content"} display="flex" alignItems="center" gap={2}>
      {type === "online" ? <FaVideo /> : <FaUserFriends />}
      {type}
    </Badge>
  );

  const TherapistTableColumns = [
    {
      headerName: "S.No.",
      key: "sno",
      props: { row: { textAlign: "center" } }
    },
    {
      headerName: "User",
      key: "user",
      type: "component",
      metaData: {
        component: (dt: any) => (
          <Box m={1}>
            <Avatar
              src={dt.profileDetails?.personalInfo?.image}
              name={dt.profileDetails?.personalInfo?.name}
              size="sm"
            />
          </Box>
        ),
      },
      props: {
        row: { minW: 120, textAlign: "center" },
        column: { textAlign: "center" },
      },
    },
    {
      headerName: "Username",
      key: "username",
      props: { row: { textAlign: "center" } }
    },
    {
      headerName: "Role",
      key: "role",
      props: { row: { textAlign: "center" } }
    },
    {
      headerName: "Experience",
      key: "experience",
      type: "component",
      metaData: {
        component: (dt: any) => (
          <Stack direction="row" flexWrap="wrap">
            <Text>{dt.profileDetails?.personalInfo?.experience || '-'}</Text>
          </Stack>
        ),
      },
      props: { row: { textAlign: "center" } }
    },
    {
      headerName: "Charges",
      key: "charges",
      type: "component",
      metaData: {
        component: (dt: any) => (
          <Stack direction="row" flexWrap="wrap">
            <Text>₹{dt.profileDetails?.personalInfo?.charges || '-'}</Text>
          </Stack>
        ),
      },
      props: { row: { textAlign: "center" } }
    },
    {
      headerName: "Availability",
      key: "availability",
      type: "component",
      metaData: {
        component: (dt: any) => (
          <Stack direction="row" flexWrap="wrap" justify="center">
            {dt.profileDetails?.personalInfo?.availability?.map((type: string, idx: number) => (
              <AvailabilityBadge key={idx} type={type} />
            )) || '-'}
          </Stack>
        ),
      },
      props: { row: { textAlign: "center" } }
    },
    {
      headerName: "Bio",
      key: "bio",
      type: "tooltip",
      function: (dt: any) => dt.profileDetails?.personalInfo?.bio ? (
        <Tooltip label={dt.profileDetails.personalInfo.bio} hasArrow zIndex={9999}>
          <span>{dt.profileDetails.personalInfo.bio.slice(0, 50)}</span>
        </Tooltip>
      ) : "-",
      props: { row: { textAlign: "center" } }
    },
    {
      headerName: "Actions",
      key: "table-actions",
      type: "table-actions",
      props: {
        row: { minW: 180, textAlign: "center" },
        column: { textAlign: "center" },
      },
    },
  ];

  return (
    <Box p={4}>
      <CustomTable
        title="Therapists"
        data={therapist.data?.map((t: any, index: number) => ({
          ...t,
          sno: index + 1,
        })) || []}
        columns={TherapistTableColumns}
        actions={{
          actionBtn: {
            addKey: {
              showAddButton: true,
              function: () => {
                onAdd();
              },
            },
            editKey: {
              showViewButton: true,
              function: (e : any) => {
                onEdit(e);
              },
            },
            viewKey: {
              showViewButton: true,
              function: (e: any) => {
                handleRowClick(e);
              },
            },
          },
          search: {
            show: true,
            searchValue: searchQuery,
            onSearchChange: (e: any) => setSearchQuery(e.target.value),
          },
          resetData: {
            show: true,
            text: "Reset Data",
            function: resetTableData,
          },
          pagination: {
            show: true,
            onClick: handleChangePage,
            currentPage: currentPage,
            totalPages: therapist.totalPages || 1,
          },
        }}
        loading={therapist.loading}
      />

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader bgGradient="linear(to-r, blue.400, purple.400)" color="white">
            <Flex align="center" gap={3}>
              <GiPsychicWaves size="24px" />
              User Profile
            </Flex>
          </DrawerHeader>

          {selectedTherapist && (
            <DrawerBody>
              <Box position="relative">
                <Flex justify={"center"}>
                  <Image src={selectedTherapist?.pic?.url} h={"160px"} objectFit={"cover"} rounded={"xl"} alt="" />
                </Flex>

                <Box textAlign="center" mt={2}>
                  <Text fontSize="2xl" fontWeight="bold">
                    {selectedTherapist.profileDetails?.personalInfo?.name}
                  </Text>
                  <Text color="gray.500">{selectedTherapist.profileDetails?.personalInfo?.qualifications}</Text>

                  <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={4}>
                    <GridItem>
                      <Box bg="blue.50" p={3} borderRadius="lg">
                        <Text fontSize="sm" color="gray.500">Experience</Text>
                        <Text fontWeight="bold">{selectedTherapist.profileDetails?.personalInfo?.experience} Years</Text>
                      </Box>
                    </GridItem>
                    <GridItem>
                      <Box bg="blue.50" p={3} borderRadius="lg">
                        <Text fontSize="sm" color="gray.500">Session Fee</Text>
                        <Text fontWeight="bold">₹{selectedTherapist.profileDetails?.personalInfo?.charges}</Text>
                      </Box>
                    </GridItem>
                  </Grid>
                </Box>

                <Tabs mt={6} variant="soft-rounded" colorScheme="teal">
                  <TabList>
                    <Tab _selected={{ color: "white", bg: "blue.400" }}>Bio</Tab>
                    <Tab _selected={{ color: "white", bg: "blue.400" }}>Expertise</Tab>
                    <Tab _selected={{ color: "white", bg: "blue.400" }}>Availability</Tab>
                    <Tab _selected={{ color: "white", bg: "blue.400" }}>Contact</Tab>
                    <Tab _selected={{ color: "white", bg: "blue.400" }}>Link</Tab>
                  </TabList>

                  <TabPanels mt={2}>
                    <TabPanel>
                      <Text color="gray.600" lineHeight="tall">
                        {selectedTherapist.profileDetails?.personalInfo?.bio}
                      </Text>
                    </TabPanel>

                    <TabPanel>
                      <Stack spacing={3}>
                        {selectedTherapist.profileDetails?.personalInfo?.expertise?.map((item: string, idx: number) => (
                          <Flex key={idx} align="center" gap={3} p={3} bg="gray.50" borderRadius="md">
                            <FaBrain color="#3182CE" />
                            <Text fontWeight="500">{item}</Text>
                          </Flex>
                        ))}
                      </Stack>
                    </TabPanel>

                    <TabPanel>
                      <Stack spacing={4}>
                        {selectedTherapist.profileDetails?.personalInfo?.availability?.map((type: string, idx: number) => (
                          <AvailabilityBadge key={idx} type={type} />
                        ))}
                      </Stack>
                    </TabPanel>

                    <TabPanel>
                      <Stack spacing={4}>
                        <Text fontSize="sm" color="gray.500">Email: {selectedTherapist.username}</Text>
                        <Text fontSize="sm" color="gray.500">Phone: {selectedTherapist.profileDetails?.personalInfo?.phoneNumber}</Text>
                      </Stack>
                    </TabPanel>

                    <TabPanel>
                      <Link href={selectedTherapist.profileDetails?.personalInfo?.link || "#"} target="_blank" rel="noopener noreferrer">
                        {selectedTherapist.profileDetails?.personalInfo?.link}
                      </Link>
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