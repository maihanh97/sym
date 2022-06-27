import React, {useEffect, useState} from "react";
import {
  Stack,
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel, BreadcrumbItem, BreadcrumbLink, Text, Breadcrumb, Flex, Heading, Button,
} from "@chakra-ui/react";
import BuyUnitForm from "./BuyUnitForm";
import SellUnitForm from "./SellUnitForm";
import PendingOpenOrdersTable from "./PendingOpenOrdersTable";
import FailedOrdersTable from "./FailedOrdersTable";
import ExecutedOrdersTable from "./ExecutedOrdersTable";
import {product, user} from "../../api";
import {IssuanceModel} from "../../interfaces/product.model";
import {ProductState} from "../../mocks/products-selector";
import {ClientModel} from "../../interfaces/user.model";
import {ChevronRightIcon} from "@chakra-ui/icons";
import NextLink from "next/link";
import {OrderModifyModel, OrderPending} from "../../interfaces/order.model";
import {OrderType, TAB_PENDING_OPEN_ORDER, TAB_REDEMPTION, TAB_SUBCRIPTION} from "../../constants/orders";
import {OrderModifyState} from "../../mocks/order";
import {ActionType} from "../../constants/product";

export default function SubscriptionPanel() {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [isSwitchTab, setIsSwitchTab] = useState<boolean>(false);
  const [isLoadAgain, setIsLoadAgain] = useState<boolean>(false);
  const [tabOrderSelected, setTabOrderSelected] = useState<number>(TAB_PENDING_OPEN_ORDER);
  const [products, setProducts] = useState<Array<IssuanceModel>>([ProductState]);
  const [clients, setClient] = useState<Array<ClientModel>>([]);
  const [orderModify, setOrderModify] = useState<OrderModifyModel>(OrderModifyState);

  useEffect(() => {
    product.getListProducts().then(response => {
      const data = response?.data?.data;
      setProducts(data?.rows);
    }).catch(err => console.error("Error when get list products"))
    getListClient();
  }, []);
  const loadListOrderAgain = () => setIsLoadAgain(!isLoadAgain);
  const getListClient = () => {
    user.getListClients().then(reponse => {
      const data = reponse.data?.data;
      setClient(data.rows);
    }).catch(error => console.error(error))
  }
  const getOrderModify = (order: OrderPending) => {
    setOrderModify({
      type: ActionType.UPDATE,
      value: order,
      tabForm: order.orderType === OrderType.SUBCRIPTION ? TAB_SUBCRIPTION : TAB_REDEMPTION,
      tabList: tabOrderSelected
    });
    if (order.orderType === OrderType.SUBCRIPTION) {
      setTabIndex(TAB_SUBCRIPTION);
    } else {
      setTabIndex(TAB_REDEMPTION);
    }
    setIsSwitchTab(!isSwitchTab);
  }

  const resetOrder = () => {
    setOrderModify({...OrderModifyState, tabForm: tabIndex, tabList: tabOrderSelected})
    setIsLoadAgain(!isLoadAgain)
    setIsSwitchTab(!isSwitchTab);
  }

  return (
    <>
      <Breadcrumb spacing="8px" mb={8} separator={<ChevronRightIcon color="gray.500"/>}>
        <BreadcrumbItem>
          <BreadcrumbLink href="/ordersmanagement" as={NextLink}>
            Orders Management
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <Text>{tabIndex ? 'Redemptions' : 'Subscriptions'}</Text>
        </BreadcrumbItem>
      </Breadcrumb>
      <Stack spacing={12}>
        <Box backgroundColor={"white"} borderRadius={"md"} p="4">
          <Tabs onChange={(index) => setTabOrderSelected(index)}>
            <TabList>
              <Tab>Pending Open Orders</Tab>
              <Tab>Failed Orders</Tab>
              <Tab>Executed Orders</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <PendingOpenOrdersTable
                  tabSelected={tabOrderSelected}
                  isTabBuyUnit={tabIndex}
                  isLoadAgain={isLoadAgain}
                  getOrderModify={getOrderModify}
                />
              </TabPanel>
              <TabPanel>
                <FailedOrdersTable
                  tabSelected={tabOrderSelected}
                  isTabBuyUnit={tabIndex}
                  isLoadAgain={isLoadAgain}
                  getOrderModify={getOrderModify}
                />
              </TabPanel>
              <TabPanel>
                <ExecutedOrdersTable
                  tabSelected={tabOrderSelected}
                  getOrderModify={getOrderModify}
                  isTabBuyUnit={tabIndex}
                  isLoadAgain={isLoadAgain}/>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
        <Flex justifyContent={"space-between"}>
          <span></span>
          <Button colorScheme="blue" onClick={resetOrder}>Return </Button>
        </Flex>
        <Box backgroundColor={"white"} borderRadius={"md"} p="4">
          <Tabs index={tabIndex} onChange={(index) => {
            setTabIndex(index);
            setIsSwitchTab(!isSwitchTab);
          }}>
            <TabList>
              <Tab>Subscriptions</Tab>
              <Tab>Redemptions</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <BuyUnitForm
                  listProduct={products}
                  clients={clients}
                  isSwitchTab={isSwitchTab}
                  isLoadListAgain={loadListOrderAgain}
                  orderModify={orderModify}
                  resetOrder={resetOrder}
                  tabSelected={tabIndex}
                />
              </TabPanel>
              <TabPanel>
                <SellUnitForm
                  listProduct={products}
                  clients={clients}
                  isSwitchTab={isSwitchTab}
                  isLoadListAgain={loadListOrderAgain}
                  orderModify={orderModify}
                  resetOrder={resetOrder}
                  tabSelected={tabIndex}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Stack>
    </>
  );
}
