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
  Heading,
  Button,
  Select,
} from "@chakra-ui/react";
import {FormEvent} from "react";

interface FormProps {
  onClose: () => void;
  isOpen: boolean;
  isLoading: boolean;
  onSubmit: (e: FormEvent) => void;
}

function NewClientForm({onClose, isOpen, onSubmit, isLoading}: FormProps) {
  return (
    <>
      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay/>
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Create Client</DrawerHeader>
          <DrawerBody pt={8}>
            <Box id="newclientForm" as="form" method="post" onSubmit={onSubmit}>
              <Heading color="blue.800" fontSize="lg" mb={6}>
                Account Information
              </Heading>
              <Stack spacing={4}>
                <FormControl id="accountId" isRequired>
                  <FormLabel fontSize="sm" textColor="blue.700">
                    Account ID
                  </FormLabel>
                  <Input name="accountId" />
                </FormControl>
                <FormControl id="fullName" isRequired>
                  <FormLabel fontSize="sm" textColor="blue.700">
                    Full Name
                  </FormLabel>
                  <Input name="fullName" />
                </FormControl>
                <FormControl id="accountType" isRequired>
                  <FormLabel fontSize="sm" textColor="blue.700">
                    Account Type
                  </FormLabel>
                  <Select name="accountType" isRequired>
                    <option value=""></option>
                    <option value="r">Retail</option>
                    <option value="c">Corporate</option>
                  </Select>
                </FormControl>
                <FormControl id="countryCd" isRequired>
                  <FormLabel fontSize="sm" textColor="blue.700">
                    Nationality
                  </FormLabel>
                  <Select name="countryCd" isRequired>
                    <option value=""></option>
                    <option value="SG">Singapore</option>
                    <option value="HK">Hong Kong</option>
                    <option value="USA">USA</option>
                    <option value="NA">Not applicable</option>
                  </Select>
                </FormControl>
                <FormControl id="bankAccountName" isRequired>
                  <FormLabel fontSize="sm" textColor="blue.700">
                    Bank Details - Account Name
                  </FormLabel>
                  <Input name="bankAccountName"/>
                </FormControl>
                <FormControl id="bankAccountNumber" isRequired>
                  <FormLabel fontSize="sm" textColor="blue.700">
                    Bank Details - Account Number
                  </FormLabel>
                  <Input name="bankAccountNumber"/>
                </FormControl>
              </Stack>

              <Heading color="blue.800" fontSize="lg" mb={6} mt={12}>
                Settlement Instructions
              </Heading>
              <Stack spacing={4}>
                <FormControl id="tokenTPlus" isRequired>
                  <FormLabel fontSize="sm" textColor="blue.700">
                    Settlement Cut-Off Time (Tokens)
                  </FormLabel>
                  <Select name="tokenTPlus">
                    <option value=""></option>
                    <option value="T+0">T + 0</option>
                    <option value="T+1">T + 1</option>
                    <option value="T+2">T + 2</option>
                  </Select>
                </FormControl>
                <FormControl id="cashTPlus" isRequired>
                  <FormLabel fontSize="sm" textColor="blue.700">
                    Settlement Cut-Off Time (Cash)
                  </FormLabel>
                  <Select name="cashTPlus">
                    <option value=""></option>
                    <option value="T+0">T + 0</option>
                    <option value="T+1">T + 1</option>
                    <option value="T+2">T + 2</option>
                  </Select>
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
              form="newclientForm"
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

export default NewClientForm;
