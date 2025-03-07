'use client';
import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Header from "./component/Header";
import Sidebar from "./component/Sidebar";
import { useRouter } from "next/navigation";
import Loader from "../../component/common/Loader/Loader";
import stores from "../../store/stores";
import { observer } from "mobx-react-lite";
import { AUTH_TOKEN } from "../../config/utils/variables";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = observer(({ children }) => {
  const { auth: { user, openNotification } } = stores;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN);

    if (!token) {
      openNotification({
        title: "Oops! You're not logged in",
        message: "Please log in to continue and access your dashboard.",
        type: "error",
      });
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [router,openNotification]);

  const renderChildren = () => {
    if (!user) {
      return <Loader fullPage message="Verifying permissions..." />;
    }
    return children;
  };

  if (loading) {
    return <Loader fullPage message="Loading dashboard..." />;
  }

  return (
    <Flex minH="100vh" direction="row" bg="gray.100">
      <IconButton
        aria-label="Open Menu"
        icon={<HamburgerIcon />}
        display={{ base: "block", md: "none" }}
        onClick={onOpen}
        position="fixed"
        top="4"
        left="4"
        zIndex="overlay"
      />
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="gray.800" color="white">
          <Sidebar />
        </DrawerContent>
      </Drawer>
      <Box
        as="aside"
        w="250px"
        bg="gray.800"
        color="white"
        position="fixed"
        top="0"
        left="0"
        h="100vh"
        display={{ base: "none", md: "block" }}
        boxShadow="lg"
      >
        <Sidebar />
      </Box>

      <Flex flex="1" direction="column" ml={{ base: "0", md: "250px" }}>
        <Box
          as="header"
          bg="blue.500"
          color="white"
          px="6"
          py="4"
          boxShadow="md"
          position="sticky"
          top="0"
          zIndex="sticky"
        >
          <Box ml={{ base: "50px", md: "2px" }}>
            <Header />
          </Box>
        </Box>

        <Box
          as="main"
          flex="1"
          p="2"
          overflowY="auto"
          h={{ base: "calc(100vh - 4rem)", md: "calc(100vh - 4rem)" }}
        >
          {renderChildren()}
        </Box>
      </Flex>
    </Flex>
  );
});

export default DashboardLayout;
