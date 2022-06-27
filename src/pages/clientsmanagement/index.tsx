import type { ReactElement } from 'react';
import React, { useEffect, useState } from 'react';
import { ClientsManagement, Layout, SEO } from '../../components/index';
import {
  Box,
  Flex,
  Heading,
  HStack,
  IconButton,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';

import {IoMdPersonAdd} from 'react-icons/io';
import {ClientModel} from "../../interfaces/user.model";
import {user} from "../../api";
import {AccountType, FORMATDATE_HH_MM_SS, myTimezone, REGEX_STRING_INPUT, RoleFunction} from "../../constants";
import {HEADER_CLIENTS_MANAGEMENT, HeaderClient, TAB_CLIENT_PENDING} from "../../constants/users";
import momentTimeZone from "moment-timezone";
import { useSelector } from 'react-redux';
import {checkUserAdmin, getRoleByScreen} from "../../utils/common";

const ClientsManagementPage = () => {
  return (
    <>
      <SEO title="Clients Management" />
      <TableComponent />
    </>
  );
};

ClientsManagementPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

function TableComponent() {
  const toast = useToast();
  const funcAccessCM = getRoleByScreen(RoleFunction.view_client);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tabSelected, setTabSelected] = useState<number>(TAB_CLIENT_PENDING);
  const [heading, setHeading] = useState<string>(HEADER_CLIENTS_MANAGEMENT);
  const [clientPendingReject, setClientPendingReject] = useState<ClientModel[]>([]);
  const [clientApproved, setClientApproved] = useState<ClientModel[]>([]);
  const updateApi = useSelector((state: any) => state.client.statusApproved);

  const {
    isOpen: isOpenNewClientForm,
    onOpen: onOpenNewClientForm,
    onClose: onCloseNewClientForm,
  } = useDisclosure();

  useEffect(() => {
    getClientPendingRejectedApi();
    getClientApproveApi();
  }, [isDone, updateApi]);

  const getClientPendingRejectedApi = () => {
    user.getClientPendingRejected().then(response => {
      const data = response?.data?.data?.rows;
      data.forEach((client: ClientModel) => {
        client.createDate = client.createDate ? momentTimeZone.tz(client.createDate, myTimezone).format(FORMATDATE_HH_MM_SS) : '';
        client.writeDate = client.writeDate ? Date.parse(client.writeDate).toString() : '';
      });
      data.sort((a: ClientModel, b: ClientModel) => (b.writeDate)?.localeCompare(a.writeDate));
      setClientPendingReject(data);
    }).catch(error => console.error(error));
  }

  const getClientApproveApi = () => {
    user.getListClients().then(response => {
      const data = response?.data?.data?.rows;
      data.forEach((client: ClientModel) => {
        client.createDate = client.createDate ? momentTimeZone.tz(client.createDate, myTimezone).format(FORMATDATE_HH_MM_SS) : '';
        client.writeDate = client.writeDate ? Date.parse(client.writeDate).toString() : '';
      });
      data.sort((a: ClientModel, b: ClientModel) => (b.writeDate)?.localeCompare(a.writeDate) );
      setClientApproved(data);
    }).catch(error => console.error(error));
  }

  const handleSubmitNewClientForm = (e: any) => {
    e.preventDefault();
    const form = e.currentTarget;
    const { accountId, fullName, accountType, countryCd, bankAccountName, bankAccountNumber, tokenTPlus, cashTPlus } = form?.elements;

    const testStringInput = REGEX_STRING_INPUT.test(fullName?.value)
    if (!testStringInput) {
      toast({title: 'Full Name is invalid', status: "error", position: "top-right", isClosable: true});
      return;
    }

    const newClient = {
      accountId: accountId?.value,
      fullName: fullName?.value,
      countryCd: countryCd?.value,
      accountType: accountType?.value,
      bankAccountName: bankAccountName?.value,
      bankAccountNumber: bankAccountNumber?.value,
      tokenTPlus: tokenTPlus?.value,
      cashTPlus: cashTPlus?.value
    };

    setIsLoading(true);
    user.createClient(newClient).then(() => {
      toast({ title: "Success", status: "success", position: "top-right", isClosable: true });
      setIsDone(!isDone);
      onCloseNewClientForm();
      setIsLoading(false);
    }).catch(error => {
      const data = error.response.data;
      setIsLoading(false);
      toast({ title: data?.error?.message, status: "error", position: "top-right", isClosable: true });
    })
  };

  const onChangeTab = (tab: number) => {
    setTabSelected(tab);
    setHeading(HeaderClient[tab]);
  }

  return (
    <Stack spacing={8}>
      <Flex justifyContent="space-between">
        <Heading size="lg">{heading}</Heading>
        <HStack spacing={2}>
          {(checkUserAdmin() || funcAccessCM?.createFlg) ? (<Tooltip label="Create Client">
            <IconButton
              aria-label="Search database"
              icon={<IoMdPersonAdd />}
              colorScheme="blue"
              onClick={onOpenNewClientForm}
            />
          </Tooltip>) : ''}
          <ClientsManagement.NewClientForm
            isOpen={isOpenNewClientForm}
            onClose={onCloseNewClientForm}
            isLoading={isLoading}
            onSubmit={handleSubmitNewClientForm}
          />
        </HStack>
      </Flex>
      <Box backgroundColor="white" borderRadius="md">
        <Tabs onChange={(index) => onChangeTab(index)}>
          <TabList fontWeight={'bold'} fontSize={18} p={4}> Status </TabList>
          <TabPanels  className='table_clients'>
            <TabPanel>
              <ClientsManagement.ClientPending clients={clientPendingReject} loadAgain={() => setIsDone(!isDone)} update={true}/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <Box backgroundColor="white" borderRadius="md" >
        <Tabs onChange={(index) => onChangeTab(index)}>
          <TabList fontWeight={'bold'} fontSize={18} p={4}> Approved Clients List </TabList>
          <TabPanels className='table_clients'>
            <TabPanel>
              <ClientsManagement.ClientPending clients={clientApproved} loadAgain={() => setIsDone(!isDone)} update={false}/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Stack>
  );
}

export default ClientsManagementPage;
