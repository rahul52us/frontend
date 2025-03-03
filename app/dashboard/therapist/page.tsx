"use client";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  Icon,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { readFileAsBase64 } from "../../config/utils/utils";
import stores from "../../store/stores";
import Form from "./component/Form";
import TherapistsTable from "./component/Therapists/TherapistsTable";

const TherapistPage = () => {
  const {
    userStore: { createUser, getAllUsers },
  } = stores;
  const [entries, setEntries] = useState<any[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [thumbnail, setThumbnail] = useState([])
  const [currentEntry] = useState<any>({
    name: "",
    username: "",
    experience: "",
    expertise: [],
    link:"",
    time: "",
    availability: undefined,
    charges: "",
    bio: "",
    password: "",
    confirmPassword: "",
  });
  const toast = useToast();

  const handleAddSubmit = async(formData: any) => {
    try {

      const buffer = await readFileAsBase64(thumbnail[0]);
        const fileData = {
          buffer: buffer,
          filename: thumbnail[0].name,
          type: thumbnail[0].type,
        };

      createUser({
        ...formData,
        title: formData?.data,
        pic : fileData,
        availability: formData?.availability?.map((it: any) => it.value),
      })
        .then(() => {
          getAllUsers({ page: 1, limit: 30 });
          setIsDrawerOpen(false);
          toast({
            title: "Therapist Added.",
            description: `${formData.name} has been successfully added.`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        })
        .catch((err: any) => {
          toast({
            title: "failed to create",
            description: `${err?.message}`,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    } catch (err: any) {
      toast({
        title: "failed to create",
        description: `${err?.message}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditSubmit = (formData: any) => {
    setEntries(
      entries.map((entry) =>
        entry.username === formData.username ? formData : entry
      )
    );
    setIsDrawerOpen(false);
    toast({
      title: "Therapist Updated.",
      description: `${formData.name} has been updated successfully.`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  // const handleEditClick = (entry: any) => {
  //   setCurrentEntry(entry); // Set current entry to the therapist being edited
  //   setIsDrawerOpen(true);
  // };

  return (
    <Box p="5">
      <Box mb="6">
        {/* Flex container to align title and button */}
        <Flex justify="space-between" align="center" mb="4">
          <Heading as="h1" size="lg" fontWeight="bold" color="teal.600">
            Therapist Directory
          </Heading>

          {/* Add Therapist button with icon */}
          <Button
            colorScheme="teal"
            variant="solid"
            onClick={() => setIsDrawerOpen(true)}
            leftIcon={<Icon as={FaPlus} />} // Adding a plus icon to the button
            size="md"
            borderRadius="md"
            _hover={{
              bg: "teal.400",
              transform: "scale(1.05)",
              boxShadow: "md",
            }}
            _focus={{
              boxShadow: "outline",
            }}
          >
            Add Therapist
          </Button>
        </Flex>

        {/* Optionally, add a description or additional styling below */}
        <Box>
          <Text fontSize="md" color="gray.500">
            Manage and view therapists in the directory.
          </Text>
        </Box>
      </Box>

      <TherapistsTable />
      <Drawer
        size="md"
        isOpen={isDrawerOpen}
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        autoFocus={false}
      >
        <DrawerOverlay>
          <DrawerContent
            bg="white"
            borderRadius="lg"
            boxShadow="xl"
            maxW="80%"
            width="80%"
          >
            <DrawerCloseButton />
            <DrawerHeader
              bg="teal.500"
              color="white"
              fontSize="lg"
              fontWeight="bold"
              textAlign="center"
              bgGradient="linear(to-r, blue.400, purple.400)"
            >
              {currentEntry.username ? "Edit Therapist" : "Add Therapist"}
            </DrawerHeader>
            <DrawerBody p={6} bg="gray.50">
              <Form
                initialData={currentEntry}
                onSubmit={
                  currentEntry.username ? handleEditSubmit : handleAddSubmit
                }
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                thumbnail={thumbnail}
                setThumbnail={setThumbnail}
              />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Box>
  );
};

export default TherapistPage;
