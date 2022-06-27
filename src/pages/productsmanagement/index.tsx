import React, {createContext, useEffect, useState} from "react";
import type { ReactElement } from "react";
import { Layout, SEO, ProductsManagement } from "../../components/index";
import {
  Heading,
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { PRODUCT } from "../../constants";
import { ProductsManagementTabContextProps } from "../../interfaces/product.model";

export const ProductsManagementTabContext = createContext<ProductsManagementTabContextProps>({ tabSelected: PRODUCT.TAB_PRODUCT_SELECTOR })

const ProductsManagementPage = () => {
  const [tabSelected, setTabSelected] = useState<number>(PRODUCT.TAB_PRODUCT_SELECTOR);
  return (
    <>
      <SEO title="Products Management" />
      <Heading size="lg" mb={8}>
        Products Overview
      </Heading>
      <Box backgroundColor={"white"} borderRadius={"md"} p="4">
        <Tabs onChange={(index) => setTabSelected(index)}>
          <TabList>
            <Tab>Product Selector</Tab>
            <Tab>Macro View</Tab>
          </TabList>

          <ProductsManagementTabContext.Provider value={{tabSelected}}>
            <TabPanels>
              <TabPanel>
                <ProductsManagement.ProductsSelectorTable />
              </TabPanel>
              <TabPanel>
                <ProductsManagement.MacroViewPanel />
              </TabPanel>
            </TabPanels>
          </ProductsManagementTabContext.Provider>
        </Tabs>
      </Box>
    </>
  );
};

ProductsManagementPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ProductsManagementPage;
