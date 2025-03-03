"use client";

import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  Spinner,
} from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import CustomButton from "../../component/common/CustomButton/CustomButton";
import { useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import stores from "../../store/stores";

const Login = observer(() => {
  const {auth : {login, openNotification}} = stores
  const [formData, setFormData] = useState({ username: "", password: "", loginType : 'username' });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {

      const response : any = await login(formData);
      openNotification({
        title: "Login Successful",
        message: `${response.message}!`,
        type: "success",
        duration: 3000,
      });

      router.push("/dashboard");
    } catch (error: any) {
      openNotification({
        title: "Login Failed",
        message: error.response?.message || "Invalid credentials",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex justify={"center"}>
      <Box w={"100%"} maxW="400px" p={6} textAlign={"center"}>
        <Heading mb={2} size="lg" color="#0F0F0F">
          Log in to your account
        </Heading>
        <Text mb={8} color="brand.1000">
          Welcome back! Please enter your details.
        </Text>
        <form onSubmit={handleSubmit}>
          <FormControl id="username" mb={4}>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleInputChange}
              focusBorderColor="teal.500"
              required
            />
          </FormControl>
          <FormControl id="password" mb={4}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              focusBorderColor="teal.500"
              required
            />
          </FormControl>
          <Flex align={"center"} justify={"space-between"} my={4}>
            <Checkbox colorScheme="teal">Remember me</Checkbox>
            <Text fontWeight={600} color="#065F68" fontSize="sm">
              <Link href="/forgot-password" style={{ textDecoration: "underline" }}>
                Forgot Password?
              </Link>
            </Text>
          </Flex>

          <CustomButton
            size="md"
            width="100%"
            type="submit"
            mt={2}
            isDisabled={!formData.username || !formData.password || isLoading}
          >
            {isLoading ? <Spinner size="sm" color="white" /> : "Sign in"}
          </CustomButton>

          <Button
            size="lg"
            width="100%"
            mt={4}
            leftIcon={<FcGoogle size={"26px"} />}
            fontSize={"16px"}
            fontWeight={500}
            bg={"white"}
            color={"#616161"}
            border={"1px solid"}
            borderColor={"#D0D5DD"}
            _hover={{ bg: "white" }}
          >
            Sign in with Google
          </Button>
        </form>

        <Text mt={8} textAlign="center" color={"brand.1000"}>
          Don’t have an account?{" "}
          <Link href="/register" style={{ color: "#065F68", textDecoration: "none" }}>
            Sign up
          </Link>
        </Text>
      </Box>
    </Flex>
  );
});

export default Login;
