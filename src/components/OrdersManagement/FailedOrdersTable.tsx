import React, {useEffect, useState} from "react";
import {Box, Button, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";
import {ResponsiveTable} from "../../components/index";
import {FORMAT_DATE, OrderType, TAB_FAILED_ORDER} from "../../constants/orders";
import {orders} from "../../api";
import {FailedOrderProps, RejectOrderModel} from "../../interfaces/order.model";
import momentTimeZone from "moment-timezone";
import {FORMATDATE_HH_MM_SS, myTimezone} from "../../constants";
import {CSVLink} from 'react-csv';
import {HeadersOrder} from "../../mocks/order";
import moment from "moment";
const headers = HeadersOrder;

function FailedOrdersTable(props: FailedOrderProps) {
  const [failedOrders, setFailedOrders] = useState<Array<RejectOrderModel>>([]);
  const {tabSelected, getOrderModify, isTabBuyUnit, isLoadAgain} = props;
  const date = moment().format(FORMAT_DATE);
  const fileName = `failed_order_${date}.csv`;
  useEffect(() => {
    if (tabSelected === TAB_FAILED_ORDER) {
      getListFailedOrder();
    }
  }, [tabSelected, isTabBuyUnit, isLoadAgain]);
  const getListFailedOrder = () => {
    orders.getListFailedOrder().then(response => {
      const data = response.data?.data?.rows;
      data.forEach((order: RejectOrderModel) => {
        order.orderDateTime = momentTimeZone.tz(order.orderDateTime, myTimezone).format(FORMATDATE_HH_MM_SS);
        order.orderType = order.orderType === 'r' ? OrderType.REDEMTION : OrderType.SUBCRIPTION;
      })
      setFailedOrders(data);
    }).catch(error => {
      console.error(error);
    })
  }
  const modifyOrder = (order: RejectOrderModel) => {
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
            failedOrders?.map((order: RejectOrderModel) => (
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
        <CSVLink data={failedOrders} headers={headers} filename={fileName}>
          <Button colorScheme={"blue"} mr={5}>Export CSV</Button>
        </CSVLink>
      </Box>
    </>
  );
}

export default FailedOrdersTable;
