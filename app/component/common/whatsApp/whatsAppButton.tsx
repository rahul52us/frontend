import { useEffect } from "react";
import { Box, IconButton } from "@chakra-ui/react";
import { FaWhatsapp } from "react-icons/fa";

// Declare fbq globally for TypeScript
declare global {
    interface Window {
        fbq?: any;
    }
}

const WhatsAppButton = () => {
    const phoneNumber = "919899129943"; // Your WhatsApp number
    const message = "Hello, I need some information."; // Default message

    const handleWhatsAppClick = () => {
        // 🔥 Meta Pixel Event Tracking
        if (window.fbq) {
            window.fbq("track", "Contact", { method: "WhatsApp" });
            // console.log("✅ Meta Pixel Contact event fired for WhatsApp");
        } else {
            // console.warn("⚠️ Meta Pixel (fbq) is not available");
        }
    };

    // ✅ Ensure Meta Pixel is initialized
    useEffect(() => {
        if (!window.fbq) {
            // console.warn("⚠️ Meta Pixel is not installed. Please add the Pixel script.");
        }
    }, []);

    return (
        <Box position="fixed" bottom="20px" right="20px" zIndex={1000}>
            <a
                href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick} // 🔥 Attach tracking to the `<a>` tag
                id="whatsapp-button"
            >
                <IconButton
                    aria-label="WhatsApp"
                    icon={<FaWhatsapp size={30} />}
                    backgroundColor="green.500"
                    color="white"
                    _hover={{ backgroundColor: "green.600" }}
                    borderRadius="full"
                    size="lg"
                    boxShadow="lg"
                />
            </a>
        </Box>
    );
};

export default WhatsAppButton;
