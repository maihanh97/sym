import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Stack,
  FormControl,
  Select,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  ModalFooter,
  Button,
  Input,
} from "@chakra-ui/react";

export default function SecurityTokensTransferModal({ isOpen, onClose }: any) {
  // const initialRef = React.useRef();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Transfer Security</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl id="clientId">
              <FormLabel fontSize="sm" textColor="blue.700">
                Number of Units/Shares
              </FormLabel>
              <NumberInput name="amount">
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl id="clientId">
              <FormLabel fontSize="sm" textColor="blue.700">
                Client ID
              </FormLabel>
              <Select name="clientId">
                <option value=""></option>
                <option value="Distributor 01">Distributor 01</option>
                <option value="Hong Kong Retail">Hong Kong Retail</option>
                <option value="Apple Investment Corporation">
                  Apple Investment Corporation
                </option>
                <option value="Distributor 02">Distributor 02</option>
                <option value="Orange 1">Orange 1</option>
                <option value="Distributor 03">Distributor 03</option>
                <option value="Temasek Holdings">Temasek Holdings</option>
              </Select>
            </FormControl>

            <FormControl isDisabled>
              <FormLabel fontSize="sm" textColor="blue.700">
                Primary Subscription
              </FormLabel>
              <Input placeholder="Primary Subscription" />
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={() => onClose()}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
