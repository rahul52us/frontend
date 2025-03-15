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
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;
const ContactSection = ({ shopData }) => {
  return (
    <Box id="contact">
      <CommonHeading
        heading="Let's Connect"
        subheading="Get in touch with us"
      />
      <Box>
        <Grid templateColumns={["1fr", "1fr", "repeat(3, 1fr)"]} gap={8}>
          {/* Phone Card */}
          <motion.div whileHover={{ scale: 1.025 }}>
            <Flex
              direction="column"
              align="center"
              p={6}
              bg="white"
              borderRadius="2xl"
              boxShadow="lg"
              textAlign="center"
              transition="all 0.3s"
              _hover={{ boxShadow: "xl" }}
            >
              <Box
                as={FaPhone}
                w={8}
                h={8}
                mb={2}
                color="purple.500"
                animation={`${float} 3s ease-in-out infinite`}
              />
              <Heading fontSize={"2xl"} mb={2} color="purple.800">
                Call Us
              </Heading>
              <Link
                href={`tel:${shopData.contact.phone}`}
                fontSize="lg"
                fontWeight="semibold"
                color="gray.700"
                _hover={{ color: "purple.600" }}
              >
                {shopData.contact.phone}
              </Link>
            </Flex>
          </motion.div>

          {/* Email Card */}
          <motion.div whileHover={{ scale: 1.025 }}>
            <Flex
              direction="column"
              align="center"
              p={6}
              bg="white"
              borderRadius="2xl"
              boxShadow="lg"
              textAlign="center"
              transition="all 0.3s"
              _hover={{ boxShadow: "xl" }}
            >
              <Box
                as={FaEnvelope}
                w={8}
                h={8}
                mb={2}
                color="purple.500"
                animation={`${float} 3s ease-in-out infinite`}
              />
              <Heading fontSize={"2xl"} mb={2} color="purple.800">
                Email Us
              </Heading>
              <Link
                href={`mailto:${shopData.contact.email}`}
                fontSize="lg"
                fontWeight="semibold"
                color="gray.700"
                _hover={{ color: "purple.600" }}
              >
                {shopData.contact.email}
              </Link>
            </Flex>
          </motion.div>

          {/* Website Card */}
          <motion.div whileHover={{ scale: 1.025 }}>
            <Flex
              direction="column"
              align="center"
              p={6}
              bg="white"
              borderRadius="2xl"
              boxShadow="lg"
              textAlign="center"
              transition="all 0.3s"
              _hover={{ boxShadow: "xl" }}
            >
              <Box
                as={FaGlobe}
                w={8}
                h={8}
                mb={2}
                color="purple.500"
                animation={`${float} 3s ease-in-out infinite`}
              />
              <Heading fontSize={"2xl"} mb={2} color="purple.800">
                Visit Us
              </Heading>
              <Link
                href={shopData.contact.website}
                fontSize="lg"
                fontWeight="semibold"
                color="gray.700"
                _hover={{ color: "purple.600" }}
                isExternal
              >
                {shopData.contact.website}
              </Link>
            </Flex>
          </motion.div>
        </Grid>
        {/* Social Media Section */}
        <Box mt={12} textAlign="center">
          <Heading size="xl" mb={6} color="purple.800">
            Follow Us
          </Heading>
          <HStack spacing={8} justify="center">
            {[
              {
                icon: FaInstagram,
                color: "pink.500",
                link: shopData.contact.socialMedia.instagram,
              },
              {
                icon: FaFacebook,
                color: "blue.600",
                link: shopData.contact.socialMedia.facebook,
              },
              {
                icon: FaTwitter,
                color: "blue.400",
                link: shopData.contact.socialMedia.twitter,
              },
            ].map((social, index) => (
              <Box key={index}>
                <IconButton
                  as="a"
                  href={`https://${
                    social.icon === FaInstagram
                      ? "instagram.com"
                      : social.icon === FaFacebook
                      ? "facebook.com"
                      : "twitter.com"
                  }/${social.link}`}
                  target="_blank"
                  aria-label={"social.icon"}
                  icon={<social.icon />}
                  size="lg"
                  fontSize="2xl"
                  color={social.color}
                  variant="ghost"
                  borderRadius="full"
                  _hover={{ bg: "white", boxShadow: "xl" }}
                />
              </Box>
            ))}
          </HStack>
        </Box>
      </Box>
    </Box>
  );
};

export default ContactSection;
