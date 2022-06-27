import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";

export default function SecurityTokensViewModal({ isOpen, onClose }: any) {
  // const initialRef = React.useRef();

  return (
    <Modal
      size="full"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader></ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ORDER DATE</Th>
                <Th>ACCOUNT ID</Th>
                <Th>ORDER ID</Th>
                <Th>PRODUCT</Th>
                <Th>ORDER TYPE</Th>
                <Th>ISIN</Th>
                <Th>UNITS</Th>
                <Th>STATUS</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td colSpan={8} textAlign={"center"}>
                  No data
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
