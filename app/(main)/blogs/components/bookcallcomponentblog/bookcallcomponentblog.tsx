import { Box, Center, Image, Text } from "@chakra-ui/react";
import React from "react";
import CustomSmallTitle from "../../../../component/common/CustomSmallTitle/CustomSmallTitle";
import CustomButton from "../../../../component/common/CustomButton/CustomButton";
import { useRouter } from 'next/navigation';


const BookCallComponentBlog = ({ }) => {
    const router = useRouter();

    return (
        <Box bg={"#FDFFDD"} position="relative" overflow="hidden"
            border={"1px solid #F4FB7F"} // Added border for the frame
            borderRadius={"8px"} // Optional: Adds rounded corners
            p={["1rem", "1.5rem", "2rem"]} // Optional: Adds padding inside the border
        >
            <Box
                // bg={"#FFF1F0"}
                py={["2rem", "1rem"]}
                // px={{ base: "1rem", md: "2rem", lg: "7.5rem" }}
                color={"#FFFFFF"}
            >
                <Text textAlign={"center"} fontSize={["14px", "16px", "18px"]}></Text>
                <CustomSmallTitle textAlign={{ base: "center" }} color={"#065F68"}>
                    Have Questions?
                </CustomSmallTitle>
                <Text
                    fontSize={["24px", "32px", "34px"]}
                    textAlign={"center"}
                    lineHeight={["32px", "40px", "56px"]}
                    color={"#000000"}
                    fontWeight={400}
                    mb={4}
                >
                    Need details about an event or anything else?{" "}
                    <Text as={"span"} fontWeight={700}>
                        We’re here to help.

                    </Text>{" "}
                </Text>
                <Center>
                    <CustomButton onClick={() => router.push('/contact-us')}> Contact Us </CustomButton>
                </Center>
            </Box>
            <Image
                src="images/shape1.png"
                w={["5rem", "10rem", "12rem"]}
                h={["4rem", "8rem", "11rem"]}
                position={"absolute"}
                left={"0"}
                bottom={"0"}
                alt="shape"
            />
        </Box>
    );
};

export default BookCallComponentBlog;
