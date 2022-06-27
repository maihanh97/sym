import React, { useEffect, useState } from "react";
import {
  Stack,
  Flex,
  Box,
  Table,
  Tr,
  Th,
  Thead,
  Tbody,
  Td,
  Tfoot,
  Input,
  Button,
  Text
} from "@chakra-ui/react";
import moment from "moment";
import { CSVLink } from "react-csv";
import { product } from "../../api";
import {
  TransactionHistoryModel,
  TransactionHistoryProps,
} from "../../interfaces/product.model";
import { DatePicker } from "antd";
import momentTimeZone from "moment-timezone";
import { FILE_FORMATDATE, FORMATDATE, FORMATDATE_HH_MM_SS, myTimezone, ORDER } from "../../constants";
import { TAB_TRANSACTION_HISTORY } from "../../constants/product";
import { ResponsiveTable } from "../index";
import { HeadersTransactionHistory } from "../../mocks/products-selector";
import { useSearch } from "../../hooks/index";

const currentTimezone = myTimezone;

function ProductTransactionHistoryContainer(props: TransactionHistoryProps) {
  const { keyword, setKeyword } = useSearch();
  const { RangePicker } = DatePicker;
  const [startDate, setStartDate] = React.useState(
    moment().subtract(1, "weeks")
  );
  const [endDate, setEndDate] = React.useState(moment());
  const [transHistory, setTransHistory] = useState<Array<TransactionHistoryModel>>([]);
  const [filtedTransHistory, setFiltedTransHistory] = useState<Array<TransactionHistoryModel>>([]);
  const { tabSelected, id } = props;

  const fileName = `transaction_history_${startDate.format(FILE_FORMATDATE)}_${endDate.format(FILE_FORMATDATE)}.csv`;

  const handleChangeDate = (date: any) => {
    if (date) {
      setStartDate(date[0]);
      setEndDate(date[1]);
    } else {
      setStartDate(moment().subtract(1, "weeks"));
      setEndDate(moment());
    }
  };

  useEffect(() => {
    if (tabSelected === TAB_TRANSACTION_HISTORY) {
      getTransactionHistory();
    }
  }, [tabSelected, endDate, startDate]);

  useEffect(() => {
    if (!keyword) {
      getTransactionHistory();
    }
    const searchKeyword = keyword.toLowerCase();
    const listFiltedHistory = transHistory.filter((history: TransactionHistoryModel) => {
      return history.txnId?.toLocaleLowerCase().includes(searchKeyword) ||
        history.product.contractAddress?.toLocaleLowerCase().includes(searchKeyword) ||
        history.product.ISINCode?.toLocaleLowerCase().includes(searchKeyword) ||
        history.account.fullName?.toLocaleLowerCase().includes(searchKeyword) ||
        history.product.productName?.toLocaleLowerCase().includes(searchKeyword) ||
        history.orderType?.toLocaleLowerCase().includes(searchKeyword)
    });
    setFiltedTransHistory(listFiltedHistory);
  }, [keyword])

  const getTransactionHistory = () => {
    const params = {
      fromDate: moment(startDate).format(FORMATDATE),
      toDate: moment(endDate).subtract(-1, 'day').format(FORMATDATE)
    }
    product.getTransactionHistory(id, params).then(response => {
      const data = response.data?.data;
      data?.sort((a: TransactionHistoryModel, b: TransactionHistoryModel) => (b.orderDateTime)?.localeCompare(a.orderDateTime));
      data?.forEach((history: TransactionHistoryModel) => {
        history.orderDateTime = history.orderDateTime ? momentTimeZone.tz(history.orderDateTime, currentTimezone).format(FORMATDATE_HH_MM_SS) : '';
        history.orderType = history.orderType === 's' ? ORDER.OrderType.SUBCRIPTION : ORDER.OrderType.REDEMTION;
      })
      setTransHistory(data || []);
      setFiltedTransHistory(data || []);
    }).catch(err => {
      console.error(err);
    });
  }

  return (
    <Stack spacing={6}>
      <Box>
        <Text>Total of {filtedTransHistory.length} transactions listed</Text>
      </Box>
      <Flex justifyContent={"space-between"} mb={4}>
        <Box>
          <Input
            placeholder="Search"
            size="sm"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </Box>
        <Box>
          <RangePicker
            value={[startDate, endDate]}
            defaultValue={[startDate, endDate]}
            onChange={handleChangeDate}
          />
        </Box>
      </Flex>
      <ResponsiveTable>
        <Thead position="sticky" top={0} bgColor="white">
          <Tr>
            {HeadersTransactionHistory.map(item => <Th>{item.label}</Th>)}
          </Tr>
        </Thead>
        <Tbody>
          {filtedTransHistory.map(history => (
            <Tr>
              <Td>{history.txnId}</Td>
              <Td>{history.orderDateTime}</Td>
              <Td>{history.product.contractAddress}</Td>
              <Td>{history.account.fullName}</Td>
              <Td>{history.product.productName}</Td>
              <Td>{history.product.ISINCode}</Td>
              <Td>{history.orderType}</Td>
              <Td>{history.orderQty}</Td>
              <Td>{history.status}</Td>
            </Tr>
          ))}

        </Tbody>
      </ResponsiveTable>
      <Box textAlign={"right"}>
        <CSVLink data={filtedTransHistory} headers={HeadersTransactionHistory} filename={fileName}>
          <Button colorScheme={"blue"} mr={5}>Export CSV</Button>
        </CSVLink>
      </Box>
    </Stack>
  );
}

export default ProductTransactionHistoryContainer;
