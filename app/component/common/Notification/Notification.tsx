import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useToast, ToastPosition, Box, Text } from "@chakra-ui/react";
import { FiCheckCircle, FiAlertCircle, FiInfo } from "react-icons/fi";
import stores from "../../../store/stores";

const Notification = observer(() => {
  const {
    auth: { notification, closeNotication },
  } = stores;
  const toast = useToast();

  useEffect(() => {
    if (notification) {
      const toastId = toast({
        title: notification.title,
        description: notification.message,
        status: notification.type,
        duration: notification.duration || 5000,
        isClosable: true,
        position: notification.placement
          ? (notification.placement as ToastPosition)
          : "top-right",
        containerStyle: {
          borderRadius: "12px",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
        },
        render: () => (
          <Box
            bg={getBgColor(notification.type)}
            color="white"
            borderRadius="12px"
            boxShadow="lg"
            p={4}
            maxWidth="400px"
            fontSize="sm"
            display="flex"
            alignItems="center"
            gap={3}
            transition="all 0.3s ease"
            _hover={{
              transform: "translateY(-4px)",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
            }}
          >
            {getNotificationIcon(notification.type)}
            <Box>
              <Text fontWeight="bold" fontSize="lg">
                {notification.title}
              </Text>
              <Text fontSize="sm" opacity="0.9">
                {notification.message}
              </Text>
            </Box>
          </Box>
        ),
      });

      setTimeout(() => {
        closeNotication();
        toast.close(toastId);
      }, notification.duration || 5000);
    }
  }, [notification, toast, closeNotication]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <FiCheckCircle size={24} color="white" />;
      case "error":
        return <FiAlertCircle size={24} color="white" />;
      case "info":
        return <FiInfo size={24} color="white" />;
      default:
        return null;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "success":
        return "green.500";
      case "error":
        return "red.500";
      case "info":
        return "blue.500";
      default:
        return "gray.500";
    }
  };

  return null;
});

export default Notification;
