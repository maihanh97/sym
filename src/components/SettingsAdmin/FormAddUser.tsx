import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  FormControl,
  FormLabel,
  Input,
  Box,
  Stack,
  Button,
  Select,
} from "@chakra-ui/react";
import {RoleModel} from "../../interfaces/user.model";
import {FormEvent} from "react";

interface FormProps {
  onClose: () => void;
  isOpen: boolean;
  roles: Array<RoleModel>;
  onSubmit: (e: FormEvent) => void;
  isLoading: boolean;
}

function FormAddUser({ onClose, isOpen, onSubmit, roles, isLoading }: FormProps) {
  return (
    <>
      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Create User</DrawerHeader>
          <DrawerBody pt={8}>
            <Box id="formAddUser" as="form" method="post" onSubmit={onSubmit}>
              <Stack spacing={4}>
                <FormControl id="username" isRequired>
                  <FormLabel fontSize="sm" textColor="blue.700">
                    Username
                  </FormLabel>
                  <Input name="username" />
                </FormControl>
                <FormControl id="email" isRequired>
                  <FormLabel fontSize="sm" textColor="blue.700">
                    Email
                  </FormLabel>
                  <Input name="email" />
                </FormControl>
                <FormControl id="roleId" isRequired>
                  <FormLabel fontSize="sm" textColor="blue.700">
                    Role User
                  </FormLabel>
                  <Select name="roleId">
                    <option value=""></option>
                    {roles.map((role: RoleModel) => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl id="password" isRequired>
                  <FormLabel fontSize="sm" textColor="blue.700">
                    Password
                  </FormLabel>
                  <Input name="password" type="password"/>
                </FormControl>
              </Stack>
            </Box>
          </DrawerBody>
          <DrawerFooter>
            <Button
              mt={12}
              isFullWidth
              variant="solid"
              colorScheme="blue"
              type="submit"
              form="formAddUser"
              isLoading={isLoading}
            >
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default FormAddUser;
