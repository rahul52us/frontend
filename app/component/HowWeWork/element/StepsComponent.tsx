import {
    Box,
    Center,
    Flex,
    Grid,
    Image,
    Step,
    StepIndicator,
    Stepper,
    StepSeparator,
    Text,
    useBreakpointValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import CustomButton from "../../common/CustomButton/CustomButton";

const MotionBox = motion(Box);

const StepsComponent = ({ steps, onButtonClick }) => {
    const buttonHeight = useBreakpointValue({ base: "40px", md: "52px" });
    const buttonWidth = useBreakpointValue({ base: "8rem", md: "145px" });
    const [activeStep, setActiveStep] = useState(0);

    const isMobile = useBreakpointValue({ base: true, md: false });

    return (
        <Box>
            <Flex gap={8} px={4} direction={{ base: "column", md: "row" }}>
                {/* Left content */}
                {isMobile ? (
                    // Mobile View
                    <Box flex={1} display="flex" flexDirection="column" justifyContent="space-between">  
                    {/* Step Number */}  
                    <Text fontSize="14px" color="#033136">  
                        STEP {steps[activeStep].id}  
                    </Text>  
                
                    {/* Title */}  
                    <Text color="#2C2B2B" fontSize="3xl" fontWeight={600} mt={2} lineHeight="1.1">  
                        {steps[activeStep].title}  
                    </Text>  
                
                    {/* Image */}  
                    <Center minHeight="240px" maxHeight="400px">  
                        <MotionBox  
                            key={steps[activeStep].id}  
                            initial={{ opacity: 0, x: -20 }}  
                            animate={{ opacity: 1, x: 0 }}  
                            exit={{ opacity: 0, x: 20 }}  
                            transition={{ duration: 0.4 }}  
                            mt={4}  
                            {...steps[activeStep].imageStyles}  
                        >  
                            <Image  
                                src={steps[activeStep].image}  
                                boxSize="100%"  
                                objectFit="contain"  
                                alt="image"  
                            />  
                        </MotionBox>  
                    </Center>  
                
                    {/* Description */}  
                    <Text color="#434343" w="100%" mt={4} >  
                        {steps[activeStep].description}  
                    </Text>  
                
                    {/* Stepper */}  
                    <Box mt={6}>  
                        <Stepper  
                            index={activeStep}  
                            orientation="horizontal"  
                            colorScheme="teal"  
                            size="lg"  
                            gap={2}  
                        >  
                            {steps.map((step, index) => (  
                                <Step  
                                    key={step.id}  
                                    onClick={() => setActiveStep(index)}  
                                    cursor="pointer"  
                                >  
                                    <StepIndicator  
                                        bg={index <= activeStep ? "#045B64" : "gray.300"}  
                                        color="white"  
                                    >  
                                        <Text fontSize="lg">{step.id}</Text>  
                                    </StepIndicator>  
                                    <StepSeparator  
                                        border="2px dashed"  
                                        borderColor={index <= activeStep ? "teal.500" : "gray.200"}  
                                    />  
                                </Step>  
                            ))}  
                        </Stepper>  
                    </Box>  
                
                    {/* Get Started Button */}  
                    <Flex justify="center" mt={6}>  
                        <CustomButton  
                            width={buttonWidth}  
                            h={buttonHeight}  
                            size="lg"  
                            onClick={onButtonClick}  
                        >  
                            Get Started  
                        </CustomButton>  
                    </Flex>  
                </Box>
                ) : (
                    // Desktop View (same as before)
                    <Grid templateColumns={"1fr 1.35fr"} gap={4} flex={1}>
                        {/* Image */}
                        <MotionBox
                            key={steps[activeStep].id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.4 }}
                            {...steps[activeStep].imageStyles}
                        >
                            <Image
                                src={steps[activeStep].image}
                                boxSize="100%"
                                h={{ base: "200px", md: "320px" }}
                                objectFit="contain"
                                alt={steps[activeStep].title}
                            />
                        </MotionBox>
                        {/* Text Content */}
                        <MotionBox
                            key={`content-${steps[activeStep].id}`}
                            pt={6}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Text fontSize={"14px"} color={"#033136"}>
                                STEP {steps[activeStep].id}
                            </Text>
                            <Text color={"#2C2B2B"} fontSize={"3xl"} fontWeight={600} mt={2}>
                                {steps[activeStep].title}
                            </Text>
                            <Text color={"#434343"} w={"85%"} mt={4}>
                                {steps[activeStep].description}
                            </Text>
                            <Box mt={{ base: 4, md: 6 }}>
                                <CustomButton
                                    width={buttonWidth}
                                    h={buttonHeight}
                                    size={"lg"}
                                    onClick={onButtonClick}
                                >
                                    Get Started
                                </CustomButton>
                            </Box>
                        </MotionBox>
                    </Grid>
                )}

                {/* Stepper (Desktop View) */}
                {!isMobile && (
                    <Box pt={6}>
                        <Stepper
                            index={activeStep}
                            orientation="vertical"
                            h={"85%"}
                            colorScheme="teal"
                            size="lg"
                            gap={2}
                        >
                            {steps.map((step, index) => (
                                <Step
                                    key={step.id}
                                    onMouseOver={() => setActiveStep(index)}
                                    onMouseLeave={() => setActiveStep(activeStep)}
                                    cursor={"pointer"}
                                >
                                    <StepIndicator
                                        bg={index <= activeStep ? "#045B64" : "gray.300"}
                                        color="white"
                                    >
                                        <Text fontSize={"lg"}>{step.id}</Text>
                                    </StepIndicator>
                                    <StepSeparator
                                        border={"2px dashed"}
                                        borderColor={index <= activeStep ? "teal.500" : "gray.200"}
                                    />
                                </Step>
                            ))}
                        </Stepper>
                    </Box>
                )}
            </Flex>
        </Box>
    );
};

export default StepsComponent;
