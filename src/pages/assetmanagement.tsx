import React from "react";
import type { ReactElement } from "react";
import { Layout, SEO, AssetManagement } from "../components/index";
import {
  Heading,
  Box,
  Stack,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { AiOutlineCopy as CopyIcon } from "react-icons/ai";
import { useAuth } from "../hooks/index";

const AssetManagementPage = () => {
  useAuth();

  return (
    <>
      <SEO title="Asset Management" />
      <Heading size="lg" mb={8}>
        Asset Management
      </Heading>
      <Stack spacing={8}>
        <Box backgroundColor={"white"} borderRadius={"md"} p="4">
          <Heading size="sm" fontWeight="normal">
            My Address: 4e7a0c506f8693b725dd6176c61f35c5fddd2449{" "}
            <IconButton
              icon={<CopyIcon />}
              aria-label="Copy Address"
              size="sm"
            />
          </Heading>
        </Box>
        <Box backgroundColor={"white"} borderRadius={"md"} p="4">
          <Tabs>
            <TabList>
              <Tab>Digital Cash</Tab>
              <Tab>Security Tokens</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <AssetManagement.DigitalCashTable />
              </TabPanel>
              <TabPanel>
                <AssetManagement.SecurityTokensTable />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Stack>
    </>
  );
};

AssetManagementPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default AssetManagementPage;
