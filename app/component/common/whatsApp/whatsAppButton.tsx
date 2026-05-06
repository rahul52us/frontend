import { Box, IconButton, Tooltip } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";

// Declare fbq globally for TypeScript
declare global {
  interface Window {
    fbq?: any;
  }
}

// 🔥 1. Define the infinite pulse animation
const pulseRing = keyframes`
  0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 20px rgba(37, 211, 102, 0); }
  100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
`;

const WhatsAppButton = () => {
  const pathname = usePathname();
  const phoneNumber = "919899129943"; // Your WhatsApp number
  const message = "Hello, I need some information."; // Default message

  if (pathname?.startsWith("/dashboard/customers")) {
    return null;
  }

  const handleWhatsAppClick = () => {
    // Meta Pixel Event Tracking
    if (window.fbq) {
      window.fbq("track", "Contact", { method: "WhatsApp" });
    }
  };

  // Ensure Meta Pixel is initialized
  useEffect(() => {
    if (!window.fbq) {
      // console.warn("⚠️ Meta Pixel is not installed.");
    }
  }, []);

  return (
    <Box
      position="fixed"
      bottom={{ base: "140px", md: "120px" }} // Adjusted to 40px for standard desktop spacing
      right={{ base: "16px", md: "24px" }}
      zIndex={1000}
    >
      <Tooltip
        label="Chat with us!"
        placement="left"
        hasArrow
        bg="white"
        color="gray.800"
        borderRadius="md"
        px={3}
        py={2}
        boxShadow="lg"
        fontSize="sm"
        fontWeight="bold"
      >
        <a
          href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(
            message
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          id="whatsapp-button"
          style={{ display: "block" }}
        >
          {/* 🔥 2. The relative container holds the animated pseudo-element */}
          <Box
            position="relative"
            w={{ base: "44px", md: "64px" }}
            h={{ base: "44px", md: "64px" }}
            display="flex"
            justifyContent="center"
            alignItems="center"
            _before={{
              content: "''",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: "full",
              animation: `${pulseRing} 2.5s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955)`,
              zIndex: -1,
            }}
          >
            <IconButton
              aria-label="WhatsApp"
              icon={<FaWhatsapp size={32} />}
              w="100%"
              h="100%"
              borderRadius="full"
              color="white"
              // Uses official WhatsApp colors with a subtle gradient
              bgGradient="linear(to-br, #25D366, #128C7E)"
              boxShadow="0 4px 14px rgba(37, 211, 102, 0.4)"
              transition="all 0.3s ease"
              _hover={{
                transform: "scale(1.1) rotate(-5deg)",
                boxShadow: "0 6px 20px rgba(37, 211, 102, 0.6)",
              }}
              _active={{
                transform: "scale(0.95)",
              }}
            />
          </Box>
        </a>
      </Tooltip>
    </Box>
  );
};

export default WhatsAppButton;