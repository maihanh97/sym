import React from "react";
import type { ReactElement } from "react";
import { Layout, SEO, Issuance } from "../components/index";
import { Heading, Box } from "@chakra-ui/react";
import { useAuth } from "../hooks/index";

const IssuancePage = () => {
  useAuth();

  return (
    <>
      <SEO title="Issuance" />
      <Issuance.IssuancePanel />
    </>
  );
};

IssuancePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default IssuancePage;
