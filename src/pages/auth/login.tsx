import React, {useEffect, useState} from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { SEO } from "../../components/index";
import {getItemLocalStorage, useAuth} from "../../hooks/index";
import { useRouter } from "next/router";
import { routes } from "../../router/routes";
import {LoginParam} from "../../interfaces/user.model";
import {ACCESS_TOKEN, REMEMBER_LOGIN, USER_INFOR} from "../../constants";
import {Metacode} from "../../enum/enum-info";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const toast = useToast();
  const [isShowScreen, setIsShowScreen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRemember, setIsRemember] = useState<boolean>(false);

  useEffect(() => {
    if (router.pathname === '/' || router.pathname === routes.LOGIN) {
      const remember = JSON.parse(getItemLocalStorage(REMEMBER_LOGIN) || 'false');
      const accessToken = getItemLocalStorage(ACCESS_TOKEN);
      setIsRemember(remember);
      if (remember && accessToken) {
        router.push(routes.PRODUCTS_MANAGEMENT);
      } else {
        localStorage.clear();
        setIsShowScreen(true);
      }
    }
  }, [router.pathname])

  const handleFormSubmit = (e: any) => {
    setIsLoggingIn(true);
    e.preventDefault();

    const form = e.currentTarget;
    const { username, password } = form.elements;

    const paramLogin: LoginParam = {
      password: password?.value,
      username: username?.value
    }

    login(paramLogin).then(response => {
      setIsLoggingIn(false);
      if (response && response.data) {
        localStorage.setItem(USER_INFOR, JSON.stringify(response.data?.data?.userInfo));
        localStorage.setItem(REMEMBER_LOGIN, JSON.stringify(isRemember));
        if (response.data?.data?.userInfo?.twoFAFlg) {
          router.push(routes.TWO_FA);
        } else {
          localStorage.setItem(ACCESS_TOKEN, response.data?.data?.accessToken);
          toast({title: "Yay! Welcome back.", status: "success", position: "top-right", isClosable: true});
          router.push(routes.PRODUCTS_MANAGEMENT);
        }
      }
    }).catch(err => {
      setIsLoggingIn(false);
      const data = err.response?.data;
      if (data?.error?.status === Metacode.BAD_REQUEST) {
        toatError(data?.error?.message);
      } else {
        toatError('Error');
      }
    })
  };

  const toatError = (title: string) => {
    toast({title: title, status: "error", position: "top-right", isClosable: true});
  }

  return (
    <>
      {isShowScreen ? <>
        <SEO title="Login"/>
        <Flex
          minH={"100vh"}
          align={"center"}
          justify={"center"}
          bg={useColorModeValue("gray.50", "gray.800")}
        >
          <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
            <Stack align={"center"}>
              <Heading fontSize={"4xl"}>Sign in to your account</Heading>
            </Stack>
            <Box
              rounded={"lg"}
              bg={useColorModeValue("white", "gray.700")}
              boxShadow={"lg"}
              p={8}
            >
              <form method="post" onSubmit={handleFormSubmit}>
                <Stack spacing={4}>
                  <FormControl id="username">
                    <FormLabel>Username</FormLabel>
                    <Input name="username" type="text" required/>
                  </FormControl>
                  <FormControl id="password">
                    <FormLabel>Password</FormLabel>
                    <Input name="password" type="password" required/>
                  </FormControl>
                  <Stack spacing={10}>
                    <Stack
                      direction={{base: "column", sm: "row"}}
                      align={"start"}
                      justify={"space-between"}
                    >
                      <Checkbox isChecked={isRemember} onChange={() => setIsRemember(!isRemember)}>Remember me</Checkbox>
                      <Link onClick={() => router.push(routes.FORGOT_PASSWORD)} color={"blue.400"}>Forgot password?</Link>
                    </Stack>
                    <Button
                      bg={"blue.400"}
                      color={"white"}
                      _hover={{
                        bg: "blue.500",
                      }}
                      type="submit"
                      isLoading={isLoggingIn}
                    >
                      Sign in
                    </Button>
                  </Stack>
                </Stack>
              </form>
            </Box>
          </Stack>
        </Flex>
      </> : ''}
    </>
  );
}
