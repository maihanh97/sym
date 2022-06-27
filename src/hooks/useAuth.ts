import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { getItemLocalStorage } from "./index";
import { routes } from "../router/routes";
import { auth } from "../api/index";
import { LoginParam } from "../interfaces/user.model";
import { ACCESS_TOKEN } from "../constants";

function useAuth() {
  const router = useRouter();
  const accessToken = getItemLocalStorage(ACCESS_TOKEN);
  useEffect(() => {
    if (!accessToken) {
      router.push(routes.LOGIN)
    }
  }, [router.pathname]);

  const login = (params: LoginParam) => auth.login(params);

  const logout = () => {
    localStorage.clear();
    router.push(routes.LOGIN)
  };
  const redirectToLogin = () => router.push(routes.LOGIN);

  return { login, logout, redirectToLogin };
}

export default useAuth;
