import {useRouter} from "next/router";
import React, {ReactElement, useEffect, useState} from "react";
import {Layout, ResponsiveTable, SEO} from "../../components";
import {user} from "../../api";
import {ChevronRightIcon} from "@chakra-ui/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Text,
  Box,
  ListItem,
  List,
  Heading,
  SimpleGrid, Thead, Tr, Th, Tbody, Td, Checkbox, Button, useToast
} from "@chakra-ui/react";
import NextLink from "next/link";
import {RoleModel, UpdateRoleItem, UpdateRoleParam} from "../../interfaces/user.model";
import {getItemLocalStorage} from "../../hooks";
import {FunctionTypeAccess} from "../../constants/setting";
import {
  ListRoleAllowApprove,
  ListRoleAllowCreate,
  ListRoleAllowImport,
  ListRoleAllowWrite,
  RoleFunction
} from "../../constants";

const SettingById = () => {
  const router = useRouter();
  const toast = useToast();
  let id  = router.query?.id as string;
  const [listAccess, setListAccess] = useState<UpdateRoleItem[]>([]);
  const [setAccessDone, setSetAccessDone] = useState<boolean>(false);
  const detail = getItemLocalStorage('roleViewDetail');
  const roleObj: RoleModel = detail ? JSON.parse(detail) : undefined;

  useEffect(() => {
    getDetailRole().catch(err => console.error(err));
  }, [id]);

  const getDetailRole = async () => {
    const response = await user.getRoleById(id);
    const listFunc: UpdateRoleItem[] = response.data.data;
    user.getMenu().then(response => {
      const data = response.data?.data?.rows;
      let listAccessInit = data.map((elm: RoleModel) => {
        return {
          menuId: elm.id,
          readFlg: false,
          createFlg: false,
          writeFlg: false,
          approveFlg: false,
          importFlg: false,
          name: elm.name,
          menuCd: elm.menuCd
        }
      });
      // TODO: Impl Asset Management screen in Phase 2, delete following line to show Asset Management in Role funstions settings
      listAccessInit = [...listAccessInit].filter(menu => menu.menuCd !== "am")
      if (roleObj?.roleCode !== RoleFunction.pcm_admin) {
        listAccessInit = listAccessInit.filter((menu: UpdateRoleItem) => menu.menuCd !== RoleFunction.view_audit);
      }

      listAccessInit.forEach((elm: UpdateRoleItem) => {
        const item = listFunc.find(func => func.menuId === elm.menuId);
        return item && Object.assign(elm, item);
      })
      setListAccess(listAccessInit);
      setSetAccessDone(!setAccessDone);
    });
  }

  const changeAccess = (value: number, item: UpdateRoleItem, type: string) => {
    const indexItem = listAccess.findIndex(elm => elm.menuId === value);
    let listModify = listAccess;

    switch (type) {
      case FunctionTypeAccess.read:
        listModify[indexItem].readFlg = !listModify[indexItem].readFlg;
        if (listModify[indexItem].createFlg || listModify[indexItem].writeFlg || listModify[indexItem].approveFlg) {
          listModify[indexItem].readFlg = true;
        }
        break;
      case FunctionTypeAccess.create:
        checkTick(listModify, indexItem);
        listModify[indexItem].createFlg = !listModify[indexItem].createFlg;
        break;
      case FunctionTypeAccess.write:
        checkTick(listModify, indexItem);
        listModify[indexItem].writeFlg = !listModify[indexItem].writeFlg;
        break;
      case FunctionTypeAccess.approve:
        checkTick(listModify, indexItem);
        listModify[indexItem].approveFlg = !listModify[indexItem].approveFlg;
        break;
      case FunctionTypeAccess.import:
        checkTick(listModify, indexItem);
        listModify[indexItem].importFlg = !listModify[indexItem].importFlg;
        break;
    }
    setListAccess(listModify);
    setSetAccessDone(!setAccessDone);
  }

  const checkTick = (listModify: UpdateRoleItem[], indexItem: number) => {
    if (!(listModify[indexItem].createFlg && listModify[indexItem].writeFlg && listModify[indexItem].approveFlg && listModify[indexItem].importFlg)) {
      listModify[indexItem].readFlg = true;
    }
  }

  const updateAccessRole = () => {
    const paramUpdateRole: UpdateRoleParam = {
      roleFunction: listAccess.filter(elm => elm.readFlg || elm.writeFlg || elm.createFlg || elm.approveFlg)
    }
    user.updateAccessRole(id, paramUpdateRole).then(response => {
      toast({title: 'Update access role successfully', status: "success", position: "top-right", isClosable: true});
    }).catch(error => {
      toast({title: 'Error', status: "error", position: "top-right", isClosable: true});
    })
  }

  return (
    <>
      <SEO title="Settings Role" />
      <Breadcrumb
        spacing="8px"
        separator={<ChevronRightIcon color="gray.500" />}
        mb={8}
      >
        <BreadcrumbItem>
          <BreadcrumbLink href="/settings" as={NextLink}>
            Settings
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Text>Role</Text>
        </BreadcrumbItem>
      </Breadcrumb>
      <Heading size="md" mb={4}>Role Information</Heading>
      <Box backgroundColor={"white"} borderRadius={"md"} p="8">
        <SimpleGrid
          columns={{ sm: 1, md: 2 }}
          spacing={12}
          borderRadius="md"
          overflowX="auto"
        >
          <List spacing={3}>
            <ListItem>Role ID: {id}</ListItem>
            <ListItem>User Role: {roleObj?.name}</ListItem>
          </List>
          <List spacing={3}>
            <ListItem>Created Date: {roleObj?.createDate}</ListItem>
          </List>
        </SimpleGrid>
      </Box>

      <Heading size="md" mb={4} mt={12}>Role Functions</Heading>
      <Box backgroundColor={"white"} borderRadius={"md"} p="8">
        <ResponsiveTable>
          <Thead position="sticky" top={0} bgColor="white">
            <Tr>
              <Th>Functions</Th>
              <Th>View</Th>
              <Th>Create</Th>
              <Th>Edit</Th>
              <Th>Approve</Th>
              <Th>Import</Th>
            </Tr>
          </Thead>
          <Tbody>
            {listAccess.map((item, index) => (
              <Tr key={index}>
                <Td>{item.name}</Td>
                <Td>
                  <Checkbox
                    isChecked={item.readFlg}
                    onChange={() => changeAccess(item.menuId, item, FunctionTypeAccess.read)}
                  />
                </Td>
                <Td>
                  {ListRoleAllowCreate.includes(item.menuCd) ? <Checkbox
                    isChecked={item.createFlg}
                    onChange={() => changeAccess(item.menuId, item, FunctionTypeAccess.create)}
                  /> : ''}
                </Td>
                <Td>
                  {ListRoleAllowWrite.includes(item.menuCd) ? <Checkbox
                    isChecked={item.writeFlg}
                    onChange={() => changeAccess(item.menuId, item, FunctionTypeAccess.write)}
                  /> : ''}
                </Td>
                <Td>
                  {ListRoleAllowApprove.includes(item.menuCd) ? <Checkbox
                    isChecked={item.approveFlg}
                    onChange={() => changeAccess(item.menuId, item, FunctionTypeAccess.approve)}
                  /> : ''}
                </Td>
                <Td>
                  {ListRoleAllowImport.includes(item.menuCd) ? <Checkbox
                    isChecked={item.importFlg}
                    onChange={() => changeAccess(item.menuId, item, FunctionTypeAccess.import)}
                  /> : ''}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </ResponsiveTable>
        <Button mt={4} colorScheme={"blue"} onClick={updateAccessRole}>
          Update access
        </Button>
      </Box>
    </>
  );
}

SettingById.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default SettingById;
