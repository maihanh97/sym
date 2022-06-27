import React from "react";
import { Box, Button, HStack, useDisclosure } from "@chakra-ui/react";
import { DataTable } from "../../components/index";
import SecurityTokensViewModal from "./SecurityTokensViewModal";
import SecurityTokensTransferModal from "./SecurityTokensTransferModal";

function SecurityTokensTable() {
  const data = React.useMemo(() => makeOrdersData(100), []);

  const {
    isOpen: isSecurityTokensViewModalOpen,
    onOpen: onOpenSecurityTokensViewModal,
    onClose: onCloseSecurityTokensViewModal,
  } = useDisclosure();
  const {
    isOpen: isSecurityTokensTransferModalOpen,
    onOpen: onOpenSecurityTokensTransferModal,
    onClose: onCloseSecurityTokensTransferModal,
  } = useDisclosure();

  const tableHeaders = [
    {
      Header: "TICKER CODE",
      accessor: "tickerCode",
    },
    {
      Header: "ISIN",
      accessor: "isin",
    },
    {
      Header: "AVAILABLE BALANCE",
      accessor: "balance",
      isNumeric: true,
    },
    {
      Header: "LOCKED BALANCE",
      accessor: "lockedBalance",
      Cell: ({ cell: { value, key } }: any) => (
        <HStack key={key} spacing={8}>
          <Box>{value}</Box>
          <Button
            colorScheme="blue"
            variant="link"
            onClick={onOpenSecurityTokensViewModal}
          >
            View
          </Button>
        </HStack>
      ),
    },
    {
      Header: "ACTIONS",
      accessor: "actions",
      Cell: ({ cell: { value, key } }: any) => (
        <HStack key={key} spacing={8}>
          <Button
            colorScheme="blue"
            variant="link"
            onClick={onOpenSecurityTokensTransferModal}
          >
            Transfer
          </Button>
        </HStack>
      ),
    },
  ];
  const columns = tableHeaders;

  return (
    <>
      <DataTable columns={columns} data={data} />
      <SecurityTokensViewModal
        isOpen={isSecurityTokensViewModalOpen}
        onClose={onCloseSecurityTokensViewModal}
      />
      <SecurityTokensTransferModal
        isOpen={isSecurityTokensTransferModalOpen}
        onClose={onCloseSecurityTokensTransferModal}
      />
    </>
  );
}

const newItems = () => {
  const randomNumberBetween = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const namesList = [
    "SGD-9265475902",
    "SG9999005987",
    "SG1D890000009",
    "2312709384",
    "SGXC25065050",
    "SG999006043",
    "STACS_MM_04",
    "SG9999007884",
    "STACS_MM_02",
  ];
  const productList = [
    "P_APACREIT_ETF",
    "PUSDMMF_A_Class",
    "P_APACREIT_ETF",
    "STACS_MM_07",
    "STACS_MM_02",
    "STACS_MM_03",
  ];

  return {
    tickerCode: namesList[Math.floor(Math.random() * namesList.length)],
    isin: productList[Math.floor(Math.random() * productList.length)],
    balance: randomNumberBetween(1_000_000, 15_000_000)?.toLocaleString(),
    lockedBalance: "0.0"?.toLocaleString(),
    actions: null,
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

export default SecurityTokensTable;
