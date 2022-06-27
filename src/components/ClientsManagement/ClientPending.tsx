import React, {useEffect, useState} from "react";
import {user} from "../../api";
import {ClientsManagement, ResponsiveTable} from "../index";
import {Box, Flex, Input, Spacer, Tbody, Td, Text, Th, Thead, Tr, useDisclosure} from "@chakra-ui/react";
import {ClientModel} from "../../interfaces/user.model";
import {ClientPendingProps} from "../../interfaces/props.model";
import { IClientInfo } from "../../interfaces/client.model";
import { DEFAULT_CLIENT_INFOR } from "../../mocks/clients";
import { getAccountType, getCountryName } from "../../utils/common";

export default function ClientPending(props: ClientPendingProps) {
  const {clients, update} = props;
  const [keyword, setKeyword] = useState("");

  const {
    isOpen,
    onOpen,
    onClose
  } = useDisclosure();
  const [clientInfo, setClientInfo] = useState<IClientInfo>(DEFAULT_CLIENT_INFOR);
  const [filtedListClients, setFiltedListClients] = useState<ClientModel[]>([]);

  useEffect(() => {
    if (!keyword) {
      setFiltedListClients(clients);
    }
    const searchKeyword = keyword.toLowerCase();
    const clientFilter = clients?.filter((client: ClientModel) => {
      return client.accountId?.toLocaleLowerCase().includes(searchKeyword) ||
        client.fullName?.toLocaleLowerCase().includes(searchKeyword) ||
        getAccountType(client.accountType)?.toLocaleLowerCase().includes(searchKeyword) ||
        getCountryName(client.countryCd)?.toLocaleLowerCase().includes(searchKeyword) 
    });
    setFiltedListClients(clientFilter);
  }, [keyword, clients])

  const capitalizedStr = (str: string) => {
    return str.charAt(0).toLocaleUpperCase() + str.slice(1)
  }

  const handleClickClient = (client: ClientModel) => {
    onOpen();
    user.getClientById(client.id.toString()).then(response => {
      const data = response?.data?.data;
      setClientInfo(data)
    }).catch(error => console.error(error));
  }

  const handleCloseForm = () => {
    onClose();
    setClientInfo(DEFAULT_CLIENT_INFOR);
  }

  return (
    <>
      <ClientsManagement.ClientInfo
        isOpen={isOpen}
        onClose={handleCloseForm}
        clientInfo={clientInfo}
        update={update}
      />

      <Flex justifyContent={"space-between"} mb={4}>
        <Spacer />
        <Box>
          <Text textAlign={['right']}>Total of { filtedListClients.length } clients listed.</Text>
        </Box>
      </Flex>
      <Flex justifyContent={"space-between"} mb={4}>
        <Spacer />
        <Box>
          <Input
            placeholder="Search"
            size="sm"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </Box>
      </Flex>

      <ResponsiveTable>
        <Thead position="sticky" top={0} bgColor="white">
          <Tr>
            <Th>Account ID</Th>
            <Th>Full name</Th>
            <Th>Account Type</Th>
            <Th>Nationality</Th>
            <Th>Bank Details Account Name</Th>
            <Th>Bank Details Account Number</Th>
            <Th>Settlement Cut-off Time (Tokens)</Th>
            <Th>Settlement Cut-off Time (Cash)</Th>
            {update ? <Th>Status</Th> : ''}
          </Tr>
        </Thead>
        <Tbody>
          {filtedListClients.length ?
            (
              filtedListClients.map((client: ClientModel) => (
                <Tr key={client.id} onClick={() => handleClickClient(client)}>
                  <Td className={"account_id"}>{client.accountId}</Td>
                  <Td>{client.fullName}</Td>
                  <Td>{getAccountType(client.accountType)}</Td>
                  <Td>{getCountryName(client.countryCd)}</Td>
                  <Td>{client.bankAccountName}</Td>
                  <Td>{client.bankAccountNumber}</Td>
                  <Td>{client.tokenTPlus}</Td>
                  <Td>{client.cashTPlus}</Td>
                  {update ? <Td>{capitalizedStr(client.status)}</Td> : ''}
                </Tr>
              ))
            )
            : (<Tr>
              <Td colSpan={9} textAlign={"center"}>
                No data
              </Td>
            </Tr>)}
        </Tbody>
      </ResponsiveTable>
    </>
  );
}