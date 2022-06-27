import React from "react";
import { Button, HStack, useDisclosure } from "@chakra-ui/react";
import { DataTable } from "../../components/index";
import DigitalCashTransferModal from "./DigitalCashTransferModal";
import DigitalCashAdditionalIssuanceModal from "./DigitalCashAdditionalIssuanceModal";

function DigitalCashTable() {
  const data = React.useMemo(() => makeOrdersData(3), []);

  const {
    isOpen: isDigitalCashTransferModalOpen,
    onOpen: onOpenDigitalCashTransferModal,
    onClose: onCloseDigitalCashTransferModal,
  } = useDisclosure();
  const {
    isOpen: isDigitalCashAdditionalIssuanceModalOpen,
    onOpen: onOpenDigitalCashAdditionalIssuanceModal,
    onClose: onCloseDigitalCashAdditionalIssuanceModal,
  } = useDisclosure();

  const tableHeaders = [
    {
      Header: "CURRENCY",
      accessor: "currency",
    },
    {
      Header: "BALANCE",
      accessor: "balance",
    },
    {
      Header: "ACTIONS",
      accessor: "actions",
      Cell: ({ cell: { value, key } }:any) => (
        <HStack key={key} spacing={4}>
          <Button
            colorScheme="blue"
            variant="link"
            onClick={() => onOpenDigitalCashTransferModal()}
          >
            Transfer
          </Button>
          <Button
            colorScheme="blue"
            variant="link"
            onClick={() => onOpenDigitalCashAdditionalIssuanceModal()}
          >
            Additional Issuance
          </Button>
        </HStack>
      ),
    },
  ];
  const columns = tableHeaders;

  return (
    <>
      <DataTable columns={columns} data={data} />
      <DigitalCashTransferModal
        isOpen={isDigitalCashTransferModalOpen}
        onClose={onCloseDigitalCashTransferModal}
      />
      <DigitalCashAdditionalIssuanceModal
        isOpen={isDigitalCashAdditionalIssuanceModalOpen}
        onClose={onCloseDigitalCashAdditionalIssuanceModal}
      />
    </>
  );
}

const newItems = () => {
  const randomNumberBetween = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const currencyList = ["SGD", "HKD", "USD"];

  return {
    currency: currencyList[Math.floor(Math.random() * currencyList.length)],
    balance: randomNumberBetween(1_500_000, 9_990_000)?.toLocaleString(),
    actions: "random",
  };
};

export const makeOrdersData = (...lens: any[]) => {
  const makeDataLevel: any = (depth = 0) => {
    const len = lens[depth];
    return range(len).map((d) => {
      return {
        ...newItems(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      };
    });
  };

  return makeDataLevel();
};

const range = (len: number) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

export default DigitalCashTable;
