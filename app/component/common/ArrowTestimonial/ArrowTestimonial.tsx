  'use client'
  import { ReactNode } from "react";
  import {
    Box,
    Flex,
    Heading,
    Text,
    Stack,
    Avatar,
    useColorModeValue,
  } from "@chakra-ui/react";

  const Testimonial = ({ children }: { children: ReactNode }) => {
    return <Box width={["100%","100%","40%","30.33%"]}>{children}</Box>;
  };

  const TestimonialContent = ({ children }: { children: ReactNode }) => {
    return (
      <Stack
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"lg"}
        p={8}
        rounded={"xl"}
        align={"center"}
        pos={"relative"}
        wordBreak={'break-word'}
        borderTopWidth={5}
        _after={{
          content: `""`,
          w: 0,
          h: 0,
          borderLeft: "solid transparent",
          borderLeftWidth: 16,
          borderRight: "solid transparent",
          borderRightWidth: 16,
          borderTop: "solid",
          borderTopWidth: 16,
          borderTopColor: useColorModeValue("white", "gray.800"),
          pos: "absolute",
          bottom: "-16px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {children}
      </Stack>
    );
  };

  const TestimonialHeading = ({ children }: { children: ReactNode }) => {
    return (
      <Heading as={"h3"} fontSize={"xl"}>
        {children}
      </Heading>
    );
  };

  const TestimonialText = ({ children }: { children: ReactNode }) => {
    return (
      <Text
        textAlign={"center"}
        color={useColorModeValue("gray.600", "gray.400")}
        fontSize={"sm"}
      >
        {children}
      </Text>
    );
  };

  const TestimonialAvatar = ({
    src,
    name,
    title,
  }: {
    src: string;
    name: string;
    title: string;
  }) => {
    return (
      <Flex align={"center"} mt={8} direction={"column"}>
        <Avatar src={src} mb={2} />
        <Stack spacing={-1} align={"center"}>
          <Text fontWeight={600}>{name}</Text>
          <Text fontSize={"sm"} color={useColorModeValue("gray.600", "gray.400")}>
            {title}
          </Text>
        </Stack>
      </Flex>
    );
  };


  interface TestimonialI {
      name: string;
      description: string;
      profession: string;
      image: string;
    }

    const ArrowTestimonial = ({ name, description, profession, image }: TestimonialI) => {
    return (
            <Testimonial>
              <TestimonialContent>
                <TestimonialHeading>{name}</TestimonialHeading>
                <TestimonialText>{description}</TestimonialText>
              </TestimonialContent>
              <TestimonialAvatar src={image} name={name} title={profession} />
            </Testimonial>

    );
  };

  export default ArrowTestimonial;
