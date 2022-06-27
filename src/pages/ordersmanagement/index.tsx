import React from "react";
import type { ReactElement } from "react";
import { Layout, SEO, OrdersManagement } from "../../components/index";
import { Heading } from "@chakra-ui/react";

const OrdersManagementPage = () => {
  return (
    <>
      <SEO title="Orders Management" />
      <OrdersManagement.SubscriptionPanel />
    </>
  );
};

OrdersManagementPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default OrdersManagementPage;
