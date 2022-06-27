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
import {CheckPwHashModel, ResetPassModel} from "../../interfaces/auth.model";
import {routes} from "../../router/routes";
import {Metacode} from "../../enum/enum-info";

const ResetPassword = () => {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [isShowScreen, setIsShowScreen] = useState(false);

  useEffect(() => {
    checkPwHashValid();
  }, [])

  const checkPwHashValid = () => {
    const urlSearchParam = new URLSearchParams(window.location.search);
    const query = Object.fromEntries(urlSearchParam.entries());
    const params: CheckPwHashModel = {
      email: query?.email,
      forgotHash: query?.forgotHash
    }

    auth.checkPasswordHash(params).then(response => {
      setIsShowScreen(true);
    }).catch(error => {
      setIsShowScreen(false);
      router.push(routes.LOGIN);
      const data = error.response?.data;
      if (data?.error?.status === Metacode.BAD_REQUEST) {
        toastError(data?.error?.message);
      } else {
        toastError('Error');
      }
    })
  }

  const resetPassword = (event: any) => {
    event.preventDefault();

    const {new_pass, confirm_pass} = event.currentTarget;
    const params: ResetPassModel = {
      password: new_pass?.value,
      email: router.query?.email as string,
      forgotHash: router.query?.forgotHash as string
    }

    if (new_pass?.value !== confirm_pass?.value) {
      toastError('Password not match');
      return;
    }

    setLoading(true);
    auth.resetPassword(params).then(response => {
      toast({title: 'Reset password successfully!', status: "success", position: "top-right", isClosable: true});
      router.push(routes.LOGIN);
    }).catch(error => {
      setLoading(false);
      const data = error.response?.data;
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
      {isShowScreen && <>
        <SEO title="Reset Password"/>
        <Flex minH={"100vh"} align={"center"} justify={"center"} bg={useColorModeValue("gray.50", "gray.800")}>
          <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
            <Heading fontSize={"4xl"}>Update your password</Heading>

            <Box rounded={"lg"} boxShadow={"lg"} p={8} bg={useColorModeValue("white", "gray.700")} as="form" method="post" onSubmit={resetPassword}>
              <FormControl id="username">
                <FormLabel>New Password</FormLabel>
                <Input name="new_pass" type="password" required/>
              </FormControl>
              <FormControl id="email" mt={6}>
                <FormLabel>Confirm New Password</FormLabel>
                <Input name="confirm_pass" type="password" required/>
              </FormControl>
              <Button
                isFullWidth bg={"blue.400"} color={"white"}
                _hover={{bg: "blue.500",}} mt={12} isLoading={loading} type="submit"
              >
                Update Password
              </Button>
            </Box>
          </Stack>
        </Flex>
      </>}
    </>
  );
}

export default ResetPassword;