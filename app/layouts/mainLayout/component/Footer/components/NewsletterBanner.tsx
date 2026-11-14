import {
  Box,
  Flex,
  HStack,
  Stack,
  Heading,
  Text,
  Icon,
  Input,
  Button,
//   keyframes,
  usePrefersReducedMotion,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { FiMail, FiZap, FiMapPin, FiGift } from "react-icons/fi";

/* ---------- keyframes ---------- */
const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const float = keyframes`
  0%, 100% { transform: translateY(0) scale(1); }
  50%      { transform: translateY(-12px) scale(1.05); }
`;
const pulseRing = keyframes`
  0%   { transform: scale(1);   opacity: 0.55; }
  100% { transform: scale(1.9); opacity: 0; }
`;
const shimmer = keyframes`
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;
const wiggle = keyframes`
  0%, 100% { transform: rotate(0); }
  25%      { transform: rotate(-10deg); }
  75%      { transform: rotate(10deg); }
`;

const perks = [
  { icon: FiZap, label: "Flash sales" },
  { icon: FiMapPin, label: "Local stores" },
  { icon: FiGift, label: "₹500 voucher" },
];

/* ---------- component ---------- */
// Keep your existing state + handler:
// const [email, setEmail] = useState("");
// const [isSubscribing, setIsSubscribing] = useState(false);
// const handleSubscribe = (e) => { ... };

const NewsletterBanner = ({ email, setEmail, handleSubscribe, isSubscribing }) => {
  const reduceMotion = usePrefersReducedMotion();
  const anim = (value: string) => (reduceMotion ? undefined : value);

  return (
    <Box
      position="relative"
      overflow="hidden"
      bgGradient="linear(to-br, #EFF6FF, #EEF2FF, #F5F3FF)"
      border="1px solid"
      borderColor="blue.100"
      borderRadius="2xl"
      px={{ base: 4, sm: 6, md: 8 }}
      py={{ base: 5, md: 6 }}
      mb={{ base: 6, md: 8 }}
      boxShadow="0 4px 20px rgba(79, 70, 229, 0.06)"
      transition="all 0.3s ease"
      _hover={{
        boxShadow: "0 10px 30px rgba(79, 70, 229, 0.12)",
        transform: "translateY(-2px)",
      }}
      animation={anim(`${fadeSlideUp} 0.6s ease-out both`)}
    >
      {/* decorative floating orbs */}
      <Box
        position="absolute"
        top="-40px"
        right="-30px"
        w="140px"
        h="140px"
        borderRadius="full"
        bg="blue.200"
        opacity={0.35}
        filter="blur(30px)"
        pointerEvents="none"
        animation={anim(`${float} 7s ease-in-out infinite`)}
      />
      <Box
        position="absolute"
        bottom="-50px"
        left="-20px"
        w="120px"
        h="120px"
        borderRadius="full"
        bg="purple.200"
        opacity={0.35}
        filter="blur(28px)"
        pointerEvents="none"
        animation={anim(`${float} 9s ease-in-out infinite reverse`)}
      />

      <Flex
        position="relative"
        zIndex={1}
        direction={{ base: "column", lg: "row" }}
        align={{ base: "stretch", lg: "center" }}
        justify="space-between"
        gap={{ base: 4, lg: 10 }}
      >
        {/* left: copy */}
        <Box flex="1" animation={anim(`${fadeSlideUp} 0.6s ease-out 0.1s both`)}>
          <HStack spacing={2.5} mb={2}>
            <Box position="relative" role="group">
              <Box
                position="absolute"
                inset={0}
                borderRadius="full"
                bg="blue.300"
                animation={anim(`${pulseRing} 2.2s ease-out infinite`)}
              />
              <Flex
                position="relative"
                w="28px"
                h="28px"
                align="center"
                justify="center"
                borderRadius="full"
                bg="white"
                boxShadow="sm"
                _groupHover={{ animation: anim(`${wiggle} 0.5s ease`) }}
              >
                <Icon as={FiMail} color="blue.600" boxSize={3.5} />
              </Flex>
            </Box>
            <Text
              fontSize="10px"
              fontWeight="800"
              textTransform="uppercase"
              letterSpacing="widest"
              color="blue.600"
            >
              Stay Updated
            </Text>
          </HStack>

          <Heading
            as="h3"
            fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
            fontWeight="800"
            lineHeight="1.25"
            color="gray.800"
          >
            Get Exclusive Local Deals &{" "}
            <Box
              as="span"
              bgGradient="linear(to-r, #2563EB, #7C3AED, #2563EB)"
              bgClip="text"
              backgroundSize="200% auto"
              animation={anim(`${shimmer} 6s linear infinite`)}
            >
              ₹500 Welcome Voucher
            </Box>
          </Heading>

          <Text fontSize="sm" color="gray.600" mt={1.5}>
            Subscribe for flash sale alerts and neighborhood store offers.
          </Text>

          {/* perk chips */}
          <HStack spacing={2} mt={3} flexWrap="wrap" rowGap={2}>
            {perks.map((perk, i) => (
              <HStack
                key={perk.label}
                spacing={1.5}
                px={2.5}
                py={1}
                bg="whiteAlpha.800"
                border="1px solid"
                borderColor="blue.100"
                borderRadius="full"
                fontSize="11px"
                fontWeight="600"
                color="gray.700"
                transition="all 0.2s"
                _hover={{ transform: "translateY(-2px)", borderColor: "blue.300", bg: "white" }}
                animation={anim(`${fadeSlideUp} 0.5s ease-out ${0.25 + i * 0.1}s both`)}
              >
                <Icon as={perk.icon} color="blue.500" boxSize={3} />
                <Text>{perk.label}</Text>
              </HStack>
            ))}
          </HStack>
        </Box>

        {/* right: form */}
        <Box
          as="form"
          onSubmit={handleSubscribe}
          w={{ base: "full", lg: "420px" }}
          flexShrink={0}
          animation={anim(`${fadeSlideUp} 0.6s ease-out 0.2s both`)}
        >
          <Stack direction={{ base: "column", sm: "row" }} spacing={{ base: 2.5, sm: 2 }}>
            <Input
              type="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              bg="white"
              border="1px solid"
              borderColor="blue.100"
              color="gray.800"
              fontSize="sm"
              borderRadius="full"
              h="46px"
              px={5}
              boxShadow="sm"
              _placeholder={{ color: "gray.400" }}
              _hover={{ borderColor: "blue.300" }}
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 4px rgba(59, 130, 246, 0.15)",
              }}
              transition="all 0.2s"
            />
            <Button
              type="submit"
              h="46px"
              px={7}
              w={{ base: "full", sm: "auto" }}
              flexShrink={0}
              color="white"
              fontWeight="700"
              fontSize="sm"
              borderRadius="full"
              bgGradient="linear(to-r, #2563EB, #4F46E5, #2563EB)"
              backgroundSize="200% auto"
              boxShadow="0 6px 16px rgba(37, 99, 235, 0.3)"
              isLoading={isSubscribing}
              loadingText="Subscribing"
              transition="all 0.25s ease"
              _hover={{
                animation: anim(`${shimmer} 2s linear infinite`),
                transform: "translateY(-2px)",
                boxShadow: "0 10px 22px rgba(37, 99, 235, 0.4)",
              }}
              _active={{ transform: "translateY(0) scale(0.97)" }}
            >
              Subscribe
            </Button>
          </Stack>

          <Text fontSize="11px" color="gray.500" mt={2} textAlign={{ base: "center", lg: "left" }}>
            No spam. Unsubscribe anytime.
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default NewsletterBanner;