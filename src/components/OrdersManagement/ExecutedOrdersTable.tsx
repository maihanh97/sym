import React, {useEffect, useState} from "react";
import {
  Box,
  Button,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";
import {ResponsiveTable} from "../../components/index";
import { orders } from "../../api";
import {FORMAT_DATE, OrderType, TAB_EXECUTED_ORDER} from "../../constants/orders";
import {OrderPending} from "../../interfaces/order.model";
import { myTimezone } from "../../constants";
import momentTimeZone from "moment-timezone";
import {CSVLink} from 'react-csv';
import {HeadersOrder} from "../../mocks/order";
import moment from "moment";
const headers = HeadersOrder;

function ExecutedOrdersTable(props: any) {
  const [executeOrder, setExecuteOrder] = useState([]);
  const timezone = myTimezone;
  const { tabSelected, isLoadAgain } = props;
  const date = moment().format(FORMAT_DATE);
  const fileName = `executed_order_${date}.csv`;

  useEffect(() => {
    if (tabSelected === TAB_EXECUTED_ORDER) {
      orders.getOrderExecute().then(response => {
        const data = response?.data?.data.rows;
        data.forEach((order: OrderPending) => {
          order.orderDateTime =  order.orderDateTime ? momentTimeZone.tz(order.orderDateTime, timezone).format('DD-MMM-YYYY HH:mm'): '';
          order.tradeDateTime =  order.tradeDateTime ? momentTimeZone.tz(order.tradeDateTime, timezone).format('DD-MMM-YYYY HH:mm'): '';
          order.orderType = order.orderType === 'r' ? OrderType.REDEMTION : OrderType.SUBCRIPTION;
          order.settlementComment = 'T + 0 (Instant DVP)'
        })
        setExecuteOrder(data);
      }).catch(err => {
        console.error(err);
      });
    }
  }, [tabSelected, isLoadAgain])

  const {getOrderModify} = props;
  const modifyOrder = (order: OrderPending) => getOrderModify(order)
  return (
    <>
      <ResponsiveTable>
        <Thead position="sticky" top={0} bgColor="white">
          <Tr>
            {headers.map(item => <Th key={item.key} textAlign={"center"}>{item.label}</Th>)}
          </Tr>
        </Thead>
        <Tbody>
          {
            executeOrder?.map((order: OrderPending) => (
              <Tr key={order?.orderId} onClick={() => modifyOrder(order)}>
                <Td>{order?.orderDateTime}</Td>
                <Td className="order_id">{order?.orderId}</Td>
                <Td>{order?.productName}</Td>
                <Td textAlign={"center"}>{order?.account?.walletAddress}</Td>
                <Td>{order?.orderType}</Td>
                <Td textAlign={"center"}>{order?.product?.ISINCode}</Td>
                <Td textAlign={"center"}>{order?.transactionalValue}</Td>
                <Td textAlign={"center"}>{order?.orderQty}</Td>
                <Td textAlign={"center"}>{order?.status}</Td>
              </Tr>
            ))
          }
        </Tbody>
      </ResponsiveTable>
      <Box textAlign={"right"} mt={5}>
        <CSVLink data={executeOrder} headers={headers} filename={fileName}>
          <Button colorScheme={"blue"} mr={5}>Export CSV</Button>
        </CSVLink>
      </Box>
    </>
  );
}

export default ExecutedOrdersTable;
