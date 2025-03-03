import {
    Box, Grid, Text, Divider, VStack, Modal, ModalOverlay, ModalContent,
    ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel,
    Input, Textarea, Button, useDisclosure
} from "@chakra-ui/react";

import { useState } from "react";
import CustomSmallTitle from "../../../../component/common/CustomSmallTitle/CustomSmallTitle";
import CustomButton from "../../../../component/common/CustomButton/CustomButton";
import CustomSubHeading from "../../../../component/common/CustomSubHeading/CustomSubHeading";
import { useRouter } from 'next/navigation';

const CareersSection = () => {
    const { isOpen, onOpen, onClose } = useDisclosure(); // Modal control
    const router = useRouter();
    const buttonWidth = "180px"; // Reduced button width
    const buttonSize = "md"; // Reduced button size for a sleeker look
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = () => {
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            onClose();
        }, 2000); // Closes modal after 2 seconds
    };

    return (
        <Box my={{ base: "2rem", lg: "6rem" }} maxW={{ md: "90%", xl: "85%" }} mx="auto">
            <Grid templateColumns={{ base: "1fr", md: "1fr auto 1fr" }} gap={8} alignItems="start">

                {/* Hiring Section */}
                <VStack align="start" spacing={3} p={6} bg="white" borderRadius="10px">
                    <CustomSmallTitle>Careers</CustomSmallTitle>
                    <CustomSubHeading highlightText="Hiring">We are</CustomSubHeading>

                    <Text mt={1} color="gray.600">
                        We may have open roles, and we’d like to hear from you.
                    </Text>
                    <Box mt={3}>
                        <CustomButton
                            onClick={onOpen} // Open the modal
                            width={buttonWidth}
                            size={buttonSize}
                            bg="teal.500"
                            color="white"
                        >
                            Join Our Team
                        </CustomButton>
                    </Box>
                </VStack>

                {/* Light Shadowed Divider */}
                <Divider
                    orientation="vertical"
                    display={{ base: "none", md: "block" }}
                    height="80%"
                    borderWidth="1px"
                    borderColor="gray.300"
                    opacity="0.5"
                />

                {/* Contact Section */}
                <VStack align="start" spacing={3} p={6} bg="white" borderRadius="10px">
                    <CustomSmallTitle>Contact Us</CustomSmallTitle>
                    <CustomSubHeading highlightText="Touch">Get in</CustomSubHeading>

                    <Text mt={1} color="gray.600">
                        Start the journey towards better mental health.
                    </Text>
                    <Box mt={3}>
                        <CustomButton
                            onClick={() => router.push('/contact-us')}
                            width={buttonWidth}
                            size={buttonSize}
                            bg="teal.500"
                            color="white"
                            _hover={{ bg: "teal.600" }} // Hover effect
                        >
                            Contact
                        </CustomButton>
                    </Box>
                </VStack>

            </Grid>

            {/* Modal for Hiring Form */}
            <Modal isOpen={isOpen} onClose={() => {
                setIsSubmitted(false); // Reset success state when closing modal
                onClose();
            }}>
                <ModalOverlay />
                <ModalContent bg="white" borderRadius="12px">
                    <ModalHeader color="teal.500">Apply for a Position</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {isSubmitted ? (
                            <Text color="green.500" fontSize="lg" textAlign="center" mb={4}>
                                Application Successfully Sent!
                            </Text>
                        ) : (
                            <>
                                <Text mb={4} color="gray.600">
                                    Please fill in the form below to apply for a role. We look forward to hearing from you!
                                </Text>
                                <FormControl mb={4}>
                                    <FormLabel color="teal.600">Name</FormLabel>
                                    <Input
                                        type="text"
                                        placeholder="Your Name"
                                        focusBorderColor="teal.500"
                                        borderColor="gray.300"
                                        _hover={{ borderColor: "teal.500" }}
                                    />
                                </FormControl>
                                <FormControl mb={4}>
                                    <FormLabel color="teal.600">Email</FormLabel>
                                    <Input
                                        type="email"
                                        placeholder="Your Email"
                                        focusBorderColor="teal.500"
                                        borderColor="gray.300"
                                        _hover={{ borderColor: "teal.500" }}
                                    />
                                </FormControl>
                                <FormControl mb={4}>
                                    <FormLabel color="teal.600">What role are you applying for?</FormLabel>
                                    <Textarea
                                        placeholder="Describe the role you're interested in..."
                                        focusBorderColor="teal.500"
                                        borderColor="gray.300"
                                        _hover={{ borderColor: "teal.500" }}
                                    />
                                </FormControl>
                                <FormControl mb={4}>
                                    <FormLabel color="teal.600">Upload your Resume</FormLabel>
                                    <Input
                                        type="file"
                                        focusBorderColor="teal.500"
                                        borderColor="gray.300"
                                        _hover={{ borderColor: "teal.500" }}
                                    />
                                </FormControl>
                                <Button
                                    colorScheme="teal"
                                    width="100%"
                                    onClick={handleSubmit}
                                    _hover={{ bg: "teal.600" }} // Hover effect
                                >
                                    Submit
                                </Button>
                            </>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default CareersSection;
