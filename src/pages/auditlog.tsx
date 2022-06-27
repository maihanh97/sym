import React from "react";
import type { ReactElement } from "react";
import { Layout, SEO, AuditLog } from "../components/index";
import { Heading, Box, Stack } from "@chakra-ui/react";
import { useAuth } from "../hooks/index";

const AuditLogPage = () => {
  useAuth();

  return (
    <>
      <SEO title="Audit Log" />
      <Stack spacing={8}>
        <AuditLog.AuditLogTable />
      </Stack>
    </>
  );
};

AuditLogPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default AuditLogPage;
