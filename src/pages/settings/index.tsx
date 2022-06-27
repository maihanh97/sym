import {Layout, SEO} from "../../components";
import React, {ReactElement, useEffect, useState} from "react";
import {Tab, TabList, TabPanel, TabPanels, Tabs, Stack, Box} from "@chakra-ui/react";
import UserManagement from "../../components/SettingsAdmin/UserManagement";
import RoleManagement from "../../components/SettingsAdmin/RoleManagement";
import {user} from "../../api";
import {RoleModel} from "../../interfaces/user.model";

const SettingsPage = () => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [roles, setRoles] = useState<Array<RoleModel>>([]);
  useEffect(() => {
    getListRole();
  }, [tabIndex]);

  const getListRole = () => {
    user.getRole().then(response => {
      setRoles(response.data?.data?.rows);
    }).catch(error => {
      console.error(error);
    })
  }
  return (
    <>
      <SEO title="Settings"/>
      <Stack spacing={12} backgroundColor={"white"} borderRadius={"md"} p="4">
        <Tabs onChange={(index) => setTabIndex(index)}>
          <TabList>
            <Tab>User Management</Tab>
            <Tab>Role Management</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <UserManagement roles={roles}/>
            </TabPanel>
            <TabPanel>
              <RoleManagement roles={roles}/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </>
  );
};

SettingsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default SettingsPage;
