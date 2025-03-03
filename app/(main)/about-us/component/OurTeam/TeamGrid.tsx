import { Box, Grid, Icon, Image, Link, Popover, PopoverBody, PopoverContent, PopoverTrigger, useMediaQuery } from "@chakra-ui/react";
import { FaLinkedinIn } from "react-icons/fa";

const images = [
  "/images/about/team1.png",
  "/images/about/team2.png",
  "/images/about/teamBox1.png",
  "/images/about/team4.png",
  "/images/about/team3.png",
  "/images/about/teamBox2.png",
  "/images/about/team5.png",
  "/images/about/team6.png",
];

const teamData = [
  { name: "Nikita Bhati", designation: "Founder", linkedin: "https://www.linkedin.com/in/nikita-bhati-97a173136/", twitter: "#", instagram: "#" },
  { name: "Maiena Pant", designation: "Clinical Psychologist", linkedin: "https://www.linkedin.com/in/maiena-pant-6b6b8320a/", twitter: "#", instagram: "#" },
  null, // teamBox1
  { name: "Pooja Bharadwaj", designation: "Clinical Psychologist", linkedin: "https://www.linkedin.com/in/pooja-bharadwaj-b70476142/", twitter: "#", instagram: "#" },
  { name: "Sakshi Sharma", designation: "Assistant Psychologist", linkedin: "https://www.linkedin.com/in/sakshi-sharma-61a1a41b4/", twitter: "#", instagram: "#" },
  null, // teamBox2
  { name: "Ridhima Monga", designation: "Marketing Executive", linkedin: "https://www.linkedin.com/in/ridhima-monga-4217791ab/", twitter: "#", instagram: "#" },
  { name: "Laxmi Karki", designation: "Practice Manager", linkedin: "#https://www.linkedin.com/in/laxmi-karki-b0160a275/", twitter: "#", instagram: "#" }
];

const extraBox = "/images/about/teamBox3.png"; // Extra box for mobile

const TeamGrid = () => {
  const [isMobile] = useMediaQuery("(max-width: 768px)"); // Check if mobile

  const finalImages = isMobile ? [...images, extraBox] : images;
  const finalTeamData = isMobile ? [...teamData, null] : teamData;

  return (
    <Grid
      templateColumns={{ base: "repeat(3, 1fr)", md: "repeat(4, 1fr)" }} // 3x3 for mobile, 4x2 for larger screens
      gap={{ base: 0.5, lg: 2 }}
      maxW={{ base: "90%", lg: "50%" }}
      mx="auto"
      mt={8}
    >
      {finalImages.map((src, index) => {
        const member = finalTeamData[index];
        const isTeamBox = src.includes("teamBox");

        return (
          <Box key={index} display="flex" justifyContent="center" alignItems="center"
            minW={{ base: "40px", md: "100px" }} // Mobile: 60px, Desktop: 100px
            minH={{ base: "40px", md: "100px" }}>
            {!isTeamBox && member ? (
              <Popover trigger="hover" placement="bottom-end">
                <PopoverTrigger>
                  <Box as="button">
                    <Image src={src} objectFit="contain" w="100%" alt={member.name} />
                  </Box>
                </PopoverTrigger>
                <PopoverContent bg="#065F68" color="white" border="none" w={200} mt="-1rem" mr={4}>
                  <Box position="absolute" top="-12px" right="30px" w="26px" h="22px" bg="#065F68" clipPath="polygon(0% 100%, 50% 0%, 100% 100%)" />
                  <PopoverBody>
                    <Box>
                      <Box fontWeight="bold">{member.name}</Box>
                      <Box fontSize="xs" mt={0.5}>{member.designation}</Box>
                      <Box mt={3} pb={1} display="flex" gap={5}>
                        <Link href={member.linkedin} isExternal>
                          <Box boxSize={6} display="flex" alignItems="center" justifyContent="center" rounded="full" bg="#FFFFFF1C" _hover={{ color: "gray.300" }}>
                            <Icon as={FaLinkedinIn} boxSize="55%" />
                          </Box>
                        </Link>
                      </Box>
                    </Box>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            ) : (
              <Image src={src} alt="our team" objectFit="contain" w="100%" />
            )}
          </Box>
        );
      })}
    </Grid>
  );
};

export default TeamGrid;
