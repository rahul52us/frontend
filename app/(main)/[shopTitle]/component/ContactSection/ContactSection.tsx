import {
  Box,
  Flex,
  Grid,
  Heading,
  HStack,
  IconButton,
  Link,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaFacebook,
  FaGlobe,
  FaInstagram,
  FaPhone,
  FaTwitter,
} from "react-icons/fa";
import CommonHeading from "../../../../component/common/CommonHeading/CommonHeading";

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

const ContactSection = ({ shopData }) => {
  return (
    <Box id="contact" py={2} px={6}>
      <CommonHeading
        heading="Let's Connect"
        subheading="Get in touch with us"
      />
      <Box mt={8}>
        <Grid templateColumns={["1fr", "1fr", "repeat(3, 1fr)"]} gap={8}>
          {[
            {
              icon: FaPhone,
              label: "Call Us",
              value: shopData.contactInfo?.phone,
              href: `tel:${shopData.contactInfo?.phone}`,
            },
            {
              icon: FaEnvelope,
              label: "Email Us",
              value: shopData.contactInfo?.email,
              href: `mailto:${shopData.contactInfo?.email}`,
            },
            {
              icon: FaGlobe,
              label: "Visit Us",
              value: shopData.contactInfo?.website,
              href: shopData.contactInfo?.website,
            },
          ].map((item, index) => (
            <motion.div whileHover={{ scale: 1.05 }} key={index}>
              <Flex
                direction="column"
                align="center"
                p={8}
                bg="white"
                borderRadius="2xl"
                boxShadow="xl"
                textAlign="center"
                transition="all 0.3s"
                _hover={{ boxShadow: "2xl", transform: "translateY(-5px)" }}
              >
                <Box
                  as={item.icon}
                  w={12}
                  h={12}
                  mb={3}
                  color="purple.500"
                  animation={`${float} 3s ease-in-out infinite`}
                />
                <Heading
                  fontSize="2xl"
                  mb={2}
                  color="purple.800"
                  fontWeight="bold"
                >
                  {item.label}
                </Heading>
                <Link
                  href={item.href}
                  fontSize="sm"
                  fontWeight="semibold"
                  color="gray.700"
                  _hover={{ color: "purple.600", textDecoration: "underline" }}
                  isExternal={item.label === "Visit Us"}
                  wordBreak="break-word"
                  overflowWrap="break-word"
                >
                  {item.value}
                </Link>
              </Flex>
            </motion.div>
          ))}
        </Grid>

        {/* Social Media Section */}
        <Box mt={16} textAlign="center">
          <Heading size="xl" mb={6} color="purple.800" fontWeight="bold">
            Follow Us
          </Heading>
          <HStack spacing={6} justify="center">
            {[
              {
                icon: FaInstagram,
                color: "pink.500",
                name: "Instagram",
                link: shopData.contactInfo?.socialMedia?.instagram,
              },
              {
                icon: FaFacebook,
                color: "blue.600",
                name: "Facebook",
                link: shopData.contactInfo?.socialMedia?.facebook,
              },
              {
                icon: FaTwitter,
                color: "blue.400",
                name: "Twitter",
                link: shopData.contactInfo?.socialMedia?.twitter,
              },
            ].map((social, index) => {
              const IconComponent = social.icon;
              return (
                <motion.div key={index} whileHover={{ scale: 1.2 }}>
                  <IconButton
                    as="a"
                    href={social.link}
                    target="_blank"
                    aria-label={social.name}
                    icon={<IconComponent size="1.5em" />} // Correct way to use the icon
                    size="lg"
                    color="white"
                    bg={social.color}
                    borderRadius="full"
                    _hover={{
                      bg: "white",
                      color: social.color,
                      boxShadow: "lg",
                      transform: "scale(1.2)",
                    }}
                  />
                </motion.div>
              );
            })}
          </HStack>
        </Box>
      </Box>
    </Box>
  );
};

export default ContactSection;
