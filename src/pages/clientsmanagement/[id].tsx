import type {ReactElement} from "react";
import React, {useEffect} from "react";
import NextLink from "next/link";
import {Layout, SEO} from "../../components/index";
import {useRouter} from "next/router";

import {
  Heading,
  Stack,
  Flex,
  Text,
  List,
  ListItem,
  SimpleGrid,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink
} from "@chakra-ui/react";

import {ChevronRightIcon} from "@chakra-ui/icons";
import {user} from "../../api";
import {ClientModel} from "../../interfaces/user.model";
import {AccountType, NationalityCode} from "../../constants";

const ClientsManagementById = () => {
  const router = useRouter();
  const id = router.query?.id as string;
  const [account, setAccount] = React.useState<ClientModel>();

  useEffect(() => {
    user.getClientById(id).then(response => {
      const data = response.data?.data;
      data.accountType = data?.accountType === 'r' ? AccountType.RETAIL : AccountType.CORPORATE;
      data.countryCd = NationalityCode[`${data.countryCd}`];
      setAccount(data);
    }).catch(error => {
      console.error(error);
    })
  }, [id])

  return (
    <>
      <SEO title="Clients Management" />
      <Breadcrumb
        spacing="8px"
        separator={<ChevronRightIcon color="gray.500" />}
        mb={12}
      >
        <BreadcrumbItem>
          <BreadcrumbLink href="/clientsmanagement" as={NextLink}>
            Clients Management
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <Text>View Client</Text>
        </BreadcrumbItem>
      </Breadcrumb>
      <Stack spacing={14}>
        <Stack spacing={4}>
          <Flex justifyContent="space-between">
            <Heading size="lg">Account Information</Heading>
          </Flex>
          <SimpleGrid
            columns={{ sm: 1, md: 2 }}
            spacing={12}
            backgroundColor="white"
            p={8}
            borderRadius="md"
            overflowX="auto"
          >
            <List spacing={3}>
              <ListItem>Account ID: {account?.accountId}</ListItem>
              <ListItem>Full Name: {account?.fullName}</ListItem>
              <ListItem>Account Type: {account?.accountType}</ListItem>
              <ListItem>Nationality: {account?.countryCd}</ListItem>
              <ListItem>Bank Details - Account Number: {account?.bankAccountNumber}</ListItem>
              <ListItem>Bank Details - Account Name: {account?.bankAccountName}</ListItem>
            </List>
            <List spacing={3}>
              <ListItem>Wallet Address: {account?.walletAddress}</ListItem>
              <ListItem>Settlement Cut-Off Time (Tokens): {account?.tokenTPlus} </ListItem>
              <ListItem>Settlement Cut-Off Time (Cash): {account?.cashTPlus}</ListItem>
            </List>
          </SimpleGrid>
        </Stack>
      </Stack>
    </>
  );
};

ClientsManagementById.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ClientsManagementById;
