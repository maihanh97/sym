import {user} from "../../api";
import React, {useEffect, useState} from "react";
import FormAddUser from "./FormAddUser";
import {
  IconButton,
  Input,
  Tooltip,
  Flex,
  HStack,
  Stack,
  Box,
  useDisclosure,
  Thead,
  Tr,
  Th,
  Tbody, Td, useToast
} from "@chakra-ui/react";
import {IoMdPersonAdd} from "react-icons/io";
import momentTimeZone from "moment-timezone";
import {CreateUserModel, SettingProps, UserModel} from "../../interfaces/user.model";
import {ResponsiveTable} from "../index";
import {Metacode} from "../../enum/enum-info";
import {FORMATDATE_HH_MM_SS, PASSWORD_POLICY, REGEX_PASSWORD} from "../../constants";

const UserManagement = (props: SettingProps) => {
  const toast = useToast();
  const [users, setUsers] = useState<Array<UserModel>>([]);
  const [loadListUserAgain, setLoadListUserAgain] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState<string>('');
  const [filterUser, setFilterUser] = useState<Array<UserModel>>([]);
  const {
    isOpen: isOpenNewUserForm,
    onOpen: onOpenNewUserForm,
    onClose: onCloseNewUserForm,
  } = useDisclosure();
  const {roles} = props;
  const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  useEffect(() => {
    if (!keyword) {
      getListUser();
    }
    const searchKeyword = keyword.toLowerCase();
    const userFilter = users.filter((user: UserModel) => {
      return user.username?.toLocaleLowerCase().includes(searchKeyword) ||
        user.userRole?.toLocaleLowerCase().includes(searchKeyword) ||
        user.email?.toLocaleLowerCase().includes(searchKeyword)
    });
    setFilterUser(userFilter);
  }, [keyword, loadListUserAgain])

  const getListUser = () => {
    user.getListUser().then(response => {
      const data = response.data?.data;
      data?.rows.sort((a: UserModel, b: UserModel) => (b.createDate)?.localeCompare(a.createDate));
      data?.rows.forEach((user: UserModel) =>
        user.createDate = momentTimeZone.tz(user.createDate, currentTimezone).format(FORMATDATE_HH_MM_SS));
      setUsers(data?.rows);
      setFilterUser(data?.rows);
    }).catch(error => {
      console.error(error);
    })
  }

  const handleSubmitNewUserForm = (e: any) => {
    e.preventDefault();
    const form = e.currentTarget;
    const {username, email, roleId, password} = form;
    const formAddUser: CreateUserModel = {
      username: username?.value,
      email: email?.value,
      password: password?.value,
      roleId: roleId?.value
    }

    const testPassword = REGEX_PASSWORD.test(password?.value);
    if (!testPassword) {
      toast({title: PASSWORD_POLICY, status: "error", position: "top-right", isClosable: true});
      return;
    }

    setIsLoading(true);
    user.createUser(formAddUser).then(response => {
      toast({title: 'Success', status: "success", position: "top-right", isClosable: true});
      setLoadListUserAgain(!loadListUserAgain);
      onCloseNewUserForm();
      setIsLoading(false);
    }).catch(error => {
      setIsLoading(false);
      const data = error.response?.data;
      switch (data.statusCode) {
        case Metacode.CONFLICT:
          toast({title: data?.error?.message, status: "error", position: "top-right", isClosable: true});
          break;
        default:
          toast({title: 'Error', status: "error", position: "top-right", isClosable: true});
      }
    })
  }

  return (
    <Stack>
      <Flex justifyContent={"flex-end"} pb={4}>
        <HStack spacing={2}>
          <Input
            placeholder="Search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            backgroundColor="white"
          />
          <Tooltip label="Create User">
            <IconButton
              aria-label="Create User"
              icon={<IoMdPersonAdd/>}
              colorScheme="blue"
              onClick={onOpenNewUserForm}
            />
          </Tooltip>
          <FormAddUser
            roles={roles}
            isLoading={isLoading}
            isOpen={isOpenNewUserForm}
            onClose={onCloseNewUserForm}
            onSubmit={handleSubmitNewUserForm}
          />
        </HStack>
      </Flex>

      <Box>
        <ResponsiveTable>
          <Thead position="sticky" top={0} bgColor="white">
            <Tr>
              <Th>User Id</Th>
              <Th>Username</Th>
              <Th>Email</Th>
              <Th>Role user</Th>
              <Th>Create Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {
              filterUser?.map((user: UserModel) => (
                <Tr key={user.id}>
                  <Td>{user.id}</Td>
                  <Td>{user.username}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.userRole}</Td>
                  <Td>{user.createDate}</Td>
                </Tr>
              ))
            }
          </Tbody>
        </ResponsiveTable>
      </Box>
    </Stack>
  );
};

export default UserManagement;