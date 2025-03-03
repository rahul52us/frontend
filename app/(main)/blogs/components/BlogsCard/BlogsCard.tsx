import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Image, Stack, Text } from "@chakra-ui/react";
import { useRouter } from 'next/navigation';
import CustomButton from "../../../../component/common/CustomButton/CustomButton";


interface BlogCardProps {
  image?: string;
  date?: string;
  title?: string;
  description?: string;
  tags?: string[];
  otherBlog?: boolean;
  charges?: string;
}

const BlogsCard: React.FC<BlogCardProps> = ({ image, date, title, description, tags, otherBlog, charges }) => {
  const formatDate = (date?: string) => {
    if (!date) return { month: "", day: "" };
    const [day, month] = date.split(" ");
    return { month, day };
  };
  const formattedDate = formatDate(date);

  const router = useRouter();
  return (
    <Box rounded={"16px"} borderWidth={1} overflow="hidden" bg={otherBlog ? "white" : "transparent"}  >
      <Box position={'relative'}>
        <Image
          src={image}
          h={{ base: "210px", lg: "260px" }}
          objectFit={"cover"}
          alt={title}
          rounded={"12px"}
          w={"100%"}
          filter={"brightness(0.7)"}
        />
        {!otherBlog && (

          <Flex position={'absolute'} top={4} left={4} gap={2}>
            {tags && tags.map((tag, index) => (
              <Text key={index} color={'white'} py={1} px={2} rounded={'6px'} fontSize={'sm'} backdropBlur={'lg'} bg={'whiteAlpha.300'} backdropFilter={'blur(10px)'}>
                {tag}
              </Text>
            ))}
          </Flex>
        )}
        {otherBlog ? (
          <Box bg={'white'} position={'absolute'} top={4} left={4} px={2} py={1} rounded={'6px'}>
            <Text fontSize={'sm'} fontWeight={600} color={'black'}>
              {charges}
            </Text>
          </Box>
        ) : null}
      </Box>

      <Box mt={{ lg: 2 }} p={{ base: 2, lg: 4 }}>
        {otherBlog ? (
          <Flex alignItems={'center'} gap={{ base: 2, lg: 4 }}>
            <Stack spacing={0} alignItems="center">
              <Text fontSize={"sm"} color="brand.100" fontWeight={600} fontFamily={"Montserrat, sans-serif"}>
                {formattedDate.month}
              </Text>
              <Text fontSize={"2xl"} fontWeight={700}>
                {formattedDate.day}
              </Text>
            </Stack>
            <Stack spacing={1}>
              <Text fontSize={{ base: "18px", lg: "20px" }} fontWeight={700} noOfLines={2}>
                {title}
              </Text>
              <Text color={"#575757"} noOfLines={3} fontSize={{ base: "sm", lg: "md" }}>
                {description}
              </Text>
            </Stack>
          </Flex>
        ) : (
          <>
            <Text color={"#868080"} fontSize={"xs"}>
              {date}
            </Text>
            <Text fontSize={{ base: "16px", lg: "20px" }} fontWeight={700} noOfLines={2} mt={1}>
              {title}
            </Text>

            <Text color={"#575757"} mt={1} noOfLines={3} fontSize={{ base: "xs", lg: "md" }}>
              {description}
            </Text>
          </>
        )}
        <Flex justifyContent={"space-between"} alignItems={"center"} mt={2}>
          {otherBlog ? (
            <CustomButton
              onClick={() => router.push('#')} // Event booking page ka URL
              size={{ base: "sm", md: "md" }}
              bg={"brand.100"}
              color={"white"}
              _hover={{ bg: "brand.200" }}
            >
              BOOK NOW
            </CustomButton>

          ) : (
            <Button
              onClick={() => router.push('#')}
              // onClick={() => router.push('/individualBlog')}
              p={"0px"}
              size={{ base: "sm", md: "md" }}
              _hover={{ bg: "transparent", textDecoration: "underline" }}
              color={"brand.100"}
              variant={"ghost"}
              rightIcon={<ArrowForwardIcon />}
            >
              READ MORE
            </Button>
          )}
        </Flex>
      </Box>
    </Box >
  );
};

export default BlogsCard;