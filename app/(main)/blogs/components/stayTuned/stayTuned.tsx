import { Box, Input, Image, Text, VStack, HStack, Grid, Heading, Flex, useBreakpointValue } from "@chakra-ui/react";
import React from "react";
import CustomSmallTitle from "../../../../component/common/CustomSmallTitle/CustomSmallTitle";
import CustomButton from "../../../../component/common/CustomButton/CustomButton";

const StayTune = () => {
    const buttonHeight = useBreakpointValue({ base: "40px", md: "50px" })
    return (
        <Box p={{ base: 4, md: 8 }}> {/* Add padding for mobile and tablet */}
            <Grid
                templateColumns={{ base: "1fr", md: "1fr 1fr" }} // Stack columns on mobile, side by side on tablet and desktop  
                alignItems="center"
                gap={{ base: 6, md: 4 }} // Adjust gap for mobile and tablet  
            >
                {/* Left Side - Text & Input Fully Left-Aligned */}
                <VStack align="flex-start" spacing={2}>
                    <CustomSmallTitle>Stay Inspired</CustomSmallTitle>

                    <Heading
                        as="h2"
                        fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }} // Responsive font size  
                        fontWeight="600"
                        color="#000"
                    >
                        Subscribe for Expert Guidance
                    </Heading>

                    <Text fontSize={{ base: "sm", md: "md" }} color="gray.600">
                        Explore helpful articles, upcoming events, and resources {" "}
                        <Box as="br" display={{ base: "none", md: "block" }} /> {/* Hide line break on mobile */}
                        to support your mental health journey.
                    </Text>

                    {/* Input Box and Button */}
                    <HStack spacing={2} w="100%" mt={6}>
                        <Input
                            placeholder="Enter Your Email"
                            bg="white"
                            border="1px solid #ccc"
                            _focus={{ borderColor: "#065F68" }}
                            h={{ base: "40px", md: "50px" }} // Adjust height for mobile and tablet  
                            borderRadius="8px"
                        />
                        <CustomButton height={buttonHeight} borderRadius="8px" onClick={() =>
                            window.open(
                                "https://www.instagram.com/metamindhealth/",
                                "_blank"
                            )
                        }>
                            Subscribe Us
                        </CustomButton>
                    </HStack>
                </VStack>

                {/* Right Side - Image */}
                <Flex justify={{ base: "center", md: "end" }} mt={{ base: 6, md: 0 }}> {/* Center image on mobile */}
                    <Image
                        src="images/blogs/stayillustration.png"
                        alt="Stay Tuned"
                        h={{ base: "200px", md: "300px" }} // Adjust height for mobile and tablet  
                        objectFit="cover"
                        blendMode={"multiply"}
                    />
                </Flex>
            </Grid>
        </Box>
    );
};

export default StayTune;