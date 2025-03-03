import { Box, Flex, Grid, Image, Tag, Text } from "@chakra-ui/react";

const MissionStatement = () => {
  return (
    <Box bg="brand.100" pb={{ base: 8, lg: 0 }} px={{ base: -1.5, md: 0 }}>
      <Grid
        templateColumns={{ base: "1fr", lg: "1fr 1.25fr" }}
        alignItems="center"
        gap={{ base: 6, lg: 8 }}
        textAlign={{ base: "center", lg: "start" }}
      >
        {/* Image Section */}
        <Box w="100%" position={'relative'}>
          <Image
            src="/images/about/missionStatement.png"
            objectFit="cover"
            alt="Mission Statement"
            borderBottomRightRadius={{ base: "0", md: "80px", lg: "100px" }}
            w="100%"
            h={{ base: "100%", md: "400px", lg: "100%" }}
          />

          <Tag position={'absolute'} top={0} left={0} rounded={'none'} size={'lg'} colorScheme="green" py={2} fontWeight={700} display={{ base: "block", lg: "none" }}>Founder&apos;s Note</Tag>
        </Box>

        {/* Text Content */}
        <Box
          // order={{ base: 1, lg: 2 }}
          color="white"
          w={{ base: "100%", md: "90%", lg: "90%" }}
          mx="auto"
          pl={{ lg: 4 }}
          px={{ base: 4, lg: 0 }}
        >
          {/* Title Section */}
          <Text
            fontSize={{ base: "16px", md: "18px", lg: "22px" }}
            fontFamily="Montserrat, sans-serif"
            letterSpacing="-2%"
            lineHeight={{ base: "22px", md: "26px", lg: "32px" }}
            mt={4}
            textAlign={{ base: "left", lg: "left" }}
            fontWeight="200"
            color="#9DEAB2"
            textTransform="none"
            display={{ base: "none", lg: "block" }}
          >
            Founder’s Note
          </Text>

          {/* Body Text Section */}
          <Text
            fontSize={{ base: "16px", md: "18px", lg: "24px" }}
            fontFamily="Montserrat, sans-serif"
            letterSpacing="-2%"
            lineHeight={{ base: "22px", md: "26px", lg: "32px" }}
            mt={4}
            textAlign={{ base: "left", lg: "left" }}
            fontWeight="thin"
            color="white"
            textTransform="none"
          >
            At <strong>Metamind</strong>, we believe that <strong>everyone deserves access</strong> to high-quality,
            evidence-based, and holistic mental health care.
            When I founded Metamind in <strong>2023</strong>, my vision was to create a <strong>safe and supportive
              space</strong> where people of all ages could receive <strong>specialized care</strong> for their mental health challenges.

            <br /><br />

            Since then, our <strong>dedicated team</strong> has been working tirelessly to provide the <strong>best possible
              care</strong> using <strong>advanced treatment methods</strong> and <strong>scientifically backed practices</strong>.
            Our goal is to ensure that <strong>everyone who walks through our doors</strong> receives the <strong>support, guidance, and care they need to heal and thrive</strong>.

            <Image
              src="/images/about/apos.png"
              alt="our mission"
              display="inline-block"
              h="28px"
              ml={2}
              mt={{ base: 2, lg: 0 }}
              verticalAlign="middle"
            />
          </Text>

          {/* Footer Section with Founder Name */}
          <Flex direction="column" mt={6} fontSize={{ base: "14px", md: "16px" }} textAlign="start" justify={{ base: "center" }}>
            <Text fontWeight="normal" fontSize={{ base: "16px", md: "18px" }} textAlign={{ base: "left", lg: "start" }}>
              <strong> — Nikita Bhati</strong>
            </Text>
            <Text fontSize={{ base: "12px", md: "14px" }} color="gray.400" textAlign={{ base: "left", lg: "start" }} fontStyle="italic">
              Founder & Clinical Psychologist
            </Text>
          </Flex>
        </Box>
      </Grid>
    </Box>
  );
};

export default MissionStatement;
