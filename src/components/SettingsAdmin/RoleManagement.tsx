import {IconButton, Tbody, Td, Th, Thead, Tooltip, Tr} from "@chakra-ui/react";
import {ResponsiveTable} from "../index";
import React from "react";
import {RoleModel, SettingProps} from "../../interfaces/user.model";
import {MdOutlineRemoveRedEye} from "react-icons/md";
import {useRouter} from "next/router";
import momentTimeZone from "moment-timezone";
import {FORMATDATE_HH_MM_SS, myTimezone} from "../../constants";

const RoleManagement = (props: SettingProps) => {
  const {roles} = props;
  const router = useRouter();
  roles.forEach((role: RoleModel) => {
    role.createDate = role.createDate ? momentTimeZone.tz(role.createDate, myTimezone).format(FORMATDATE_HH_MM_SS) : '';
  });
  roles.sort((a: RoleModel,b: RoleModel )=> a.id - b.id);
  return (
    <ResponsiveTable>
      <Thead position="sticky" top={0} bgColor="white" zIndex={10}>
        <Tr>
          <Th>Role Id</Th>
          <Th>User Role</Th>
          <Th>Create Date</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {
          roles?.map((role: RoleModel) => (
            <Tr key={role.id}>
              <Td>{role.id}</Td>
              <Td>{role.name}</Td>
              <Td>{role.createDate}</Td>
              <Td>
                <Tooltip label="View">
                  <IconButton
                    aria-label="View Role Detail"
                    icon={<MdOutlineRemoveRedEye/>}
                    colorScheme="blue"
                    onClick={() => {
                      router.push(`/settings/${role.id}`);
                      localStorage.setItem('roleViewDetail', JSON.stringify(role));
                    }}
                  />
                </Tooltip>
              </Td>
            </Tr>
          ))
        }
      </Tbody>
    </ResponsiveTable>
  );
};

export default RoleManagement;
