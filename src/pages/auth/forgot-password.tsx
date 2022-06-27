import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {SEO} from "../../components";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue, useToast
} from "@chakra-ui/react";
import {auth} from "../../api";
import {ForgotPassModel} from "../../interfaces/auth.model";
import {routes} from "../../router/routes";
import {Metacode} from "../../enum/enum-info";

const ForgotPassword = () => {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const resetPassword = (event: any) => {
    event.preventDefault();
    setLoading(true);
    const {username, email} = event.currentTarget;
    const params: ForgotPassModel = {
      username: username?.value,
      email: email?.value
    }

    auth.forgotPassword(params).then(response => {
      toast({title: 'Reset Password Request Sent To Your Email', status: "success", position: "top-right", isClosable: true});
      router.push(routes.LOGIN);
    }).catch(err => {
      setLoading(false);
      const data = err.response?.data;
      if (data?.error?.status === Metacode.BAD_REQUEST) {
        toastError(data?.error?.message);
      } else {
        toastError('Error');
      }
    })
  }

  const toastError = (title: string) => {
    toast({title: title, status: "error", position: "top-right", isClosable: true})
  }

  return (
    <>
      <SEO title="Forgot Password"/>
      <Flex minH={"100vh"} align={"center"} justify={"center"} bg={useColorModeValue("gray.50", "gray.800")}>
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Heading fontSize={"4xl"}>Reset your password</Heading>

          <Box rounded={"lg"} boxShadow={"lg"} p={8} bg={useColorModeValue("white", "gray.700")} as="form" method="post" onSubmit={resetPassword}>
            <FormControl id="username">
              <FormLabel>Username</FormLabel>
              <Input name="username" type="text" required/>
            </FormControl>
            <FormControl id="email" mt={6}>
              <FormLabel>Email</FormLabel>
              <Input name="email" type="email" required/>
            </FormControl>
            <Button isFullWidth bg={"blue.400"} color={"white"}
              _hover={{
                bg: "blue.500",
              }}
              mt={12} isLoading={loading}
              type="submit"
            >
              Reset Password
            </Button>
          </Box>
        </Stack>
      </Flex>
    </>
  );
}

export default ForgotPassword;