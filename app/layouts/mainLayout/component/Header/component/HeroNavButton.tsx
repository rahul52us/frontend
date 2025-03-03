"use client";
import { Box } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import CustomButton from "../../../../../component/common/CustomButton/CustomButton";

const HeroNavButton = () => {
  const router = useRouter();

  return (
    <Box>
      {/* <Button bg={"#045B64"} size={"lg"} fontWeight={500} fontSize={"sm"}>
        Book Apppointment
      </Button> */}
      <CustomButton width={"180px"} size={"lg"} onClick={() => router.push('/therapist')}>
      Book Appointment
      </CustomButton>
      {/* <Button
        colorScheme="teal"
        size={"lg"}
        variant={"outline"}
        ml={3}
        fontSize={"sm"}
        onClick={() => {
          router.push('/login')
        }}
      >
        Log In
      </Button> */}
    </Box>
  );
};

export default HeroNavButton;
