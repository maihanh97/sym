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
import {auth, user} from "../../api";
import {TwoFaParam} from "../../interfaces/auth.model";
import {routes} from "../../router/routes";
import {Metacode} from "../../enum/enum-info";
import {UserModel} from "../../interfaces/user.model";
import { ACCESS_TOKEN } from "../../constants";

const TwoFA = () => {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [isShowScreen, setIsShowScreen] = useState(false);
  const userInfo: UserModel = user.getInfoUser();

  useEffect(() => {
    if (!userInfo) {
      router.push(routes.LOGIN);
    } else setIsShowScreen(true);
  }, [])

  const checkOTP = (event: any) => {
    event.preventDefault();
    setLoading(true);
    const {otp} = event.currentTarget;
    const param: TwoFaParam = {
      username: userInfo?.username,
      twoFAKey: otp?.value
    }

    auth.twoFa(param).then(response => {
      if (response && response.data) {
        localStorage.setItem(ACCESS_TOKEN, response.data?.data?.accessToken);
      }
      toast({title: "Yay! Welcome back.", status: "success", position: "top-right", isClosable: true});
      router.push(routes.PRODUCTS_MANAGEMENT);
    }).catch(err => {
      setLoading(false);
      const data = err?.response?.data;
      if (data?.error?.status === Metacode.BAD_REQUEST || data?.error?.status === Metacode.UNAUTHORIZED) {
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
        <SEO title="2FA"/>
        <Flex minH={"100vh"} align={"center"} justify={"center"} bg={useColorModeValue("gray.50", "gray.800")}>
          <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
            <Heading fontSize={"4xl"}>Enter your OTP</Heading>

            <Box rounded={"lg"} boxShadow={"lg"} p={8} bg={useColorModeValue("white", "gray.700")}
                 as="form" method="post" onSubmit={checkOTP}>
              <FormControl id="username">
                <FormLabel>OTP</FormLabel>
                <Input name="otp" type="text" required/>
              </FormControl>

              <Button
                isFullWidth bg={"blue.400"} color={"white"}
                _hover={{bg: "blue.500",}}
                mt={12} isLoading={loading}
                type="submit"
              >
                Submit
              </Button>
            </Box>
          </Stack>
        </Flex>
      </>}
    </>
  );
}

export default TwoFA;