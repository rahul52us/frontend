"use client";
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { buildBase64ImageUpload } from "../../config/utils/imageUpload";
import stores from "../../store/stores";
import Form from "./component/Form";
import TherapistsTable from "./component/Therapists/TherapistsTable";

const TherapistPage = () => {
  const {
    userStore: { createUser, getAllUsers },
  } = stores;
  const [entries, setEntries] = useState<any[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<any>({isOpen : false, type : 'add', data : null});
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
      const fileData = thumbnail[0]
        ? await buildBase64ImageUpload(thumbnail[0], { isAdd: 1, isDeleted: 0 })
        : null;

      createUser({
        ...formData,
        title: formData?.data,
        pic : fileData,
        availability: formData?.availability?.map((it: any) => it.value),
      })
        .then(() => {
          getAllUsers({ page: 1, limit: 30 });
          setIsDrawerOpen({isOpen : false, type : 'add', data : null});
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
    setIsDrawerOpen({isOpen : false, type : 'add', data : null});
    toast({
      title: "Therapist Updated.",
      description: `${formData.name} has been updated successfully.`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box>
      <TherapistsTable onAdd={() => setIsDrawerOpen({isOpen : true, type : 'add', data : null})} onEdit={setIsDrawerOpen}/>
      <Drawer
        size="md"
        isOpen={isDrawerOpen.isOpen}
        placement="right"
        onClose={() => setIsDrawerOpen({isOpen : false, type : 'add', data : null})}
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
                onClose={() => setIsDrawerOpen({isOpen : false, type : 'add', data : null})}
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
