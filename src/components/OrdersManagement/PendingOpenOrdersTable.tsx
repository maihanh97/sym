import React, {useEffect, useState} from "react";
import {ResponsiveTable} from "../../components/index";
import {
  Tr,
  Tbody,
  Td,
  Th,
  Thead,
  Box,
  Button
} from "@chakra-ui/react";
import {orders, user} from "../../api";
import {OrderPending, OrderPendingProps} from "../../interfaces/order.model";
import {FORMAT_DATE, OrderType, TAB_PENDING_OPEN_ORDER} from "../../constants/orders";
import momentTimeZone from "moment-timezone";
import {myTimezone} from "../../constants";
import {CSVLink} from 'react-csv';
import moment from "moment";
import {HeadersOrder} from "../../mocks/order";
const headers = HeadersOrder;

export default function PendingOpenOrdersTable(props: OrderPendingProps) {
  const [orderPending, setOrderPending] = useState<Array<OrderPending>>([]);
  const timezone = myTimezone;
  const {tabSelected, isTabBuyUnit, isLoadAgain, getOrderModify} = props;
  const date = moment().format(FORMAT_DATE);
  const fileName = `pending_order_${date}.csv`;

  useEffect(() => {
    if (tabSelected === TAB_PENDING_OPEN_ORDER) {
      orders.getOrderPending().then(response => {
        const data = response?.data?.data;
        data.rows.forEach((order: OrderPending) => {
          order.orderDateTime = order.orderDateTime ? momentTimeZone.tz(order.orderDateTime, timezone).format('DD-MMM-YYYY HH:mm') : '';
          order.orderType = order.orderType === 'r' ? OrderType.REDEMTION : OrderType.SUBCRIPTION;
          order.isSubmit = false;
        })
        setOrderPending(data?.rows);
      }).catch(err => console.error(err));
    }
  },[tabSelected, isTabBuyUnit, isLoadAgain]);

  const modifyOrder = (order: OrderPending) => {
    getOrderModify(order);
  }
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
            orderPending?.map((order: OrderPending) => (
              <Tr key={order.orderId} onClick={() => modifyOrder(order)}>
                <Td>{order.orderDateTime}</Td>
                <Td className="order_id">{order.orderId}</Td>
                <Td>{order.productName}</Td>
                <Td textAlign={"center"}>{order?.account?.walletAddress}</Td>
                <Td>{order.orderType}</Td>
                <Td textAlign={"center"}>{order.product.ISINCode}</Td>
                <Td textAlign={"center"}>{order.transactionalValue}</Td>
                <Td textAlign={"center"}>{order.orderQty}</Td>
                <Td textAlign={"center"}>{order.status}</Td>
              </Tr>
            ))
          }
        </Tbody>
      </ResponsiveTable>
      <Box textAlign={"right"} mt={5}>
        <CSVLink data={orderPending} headers={headers} filename={fileName}>
          <Button colorScheme={"blue"} mr={5}>Export CSV</Button>
        </CSVLink>
      </Box>
    </>
  );
}
