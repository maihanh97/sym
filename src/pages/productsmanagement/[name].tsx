import React, {useEffect, useState} from "react";
import type { ReactElement } from "react";
import NextLink from "next/link";
import { SEO, Layout } from "../../components/index";
import { useRouter } from "next/router";
import {
  Heading,
  Stack,
  Flex,
  Text,
  List,
  ListItem,
  SimpleGrid,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import momentTimeZone from "moment-timezone";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { product } from "../../api";
import {
  FundPerformance,
  ProductParam,
} from "../../interfaces/product.model";
import { FORMATDATE_HH_MM_SS, myTimezone } from "../../constants";
import { TAB_FUND_PERFORMANCE } from "../../constants/product";
import { ProductsManagement } from "../../components/index";

const currentTimezone = myTimezone;
const ProductSelectorPage = () => {
  const router = useRouter();
  const name = router?.query?.name as string;
  const [selector, setSelector] = useState<ProductParam>();
  const [fundPerformance, setFundPerformance] = useState<FundPerformance>();
  const [tabSelected, setTabSelected] = useState<number>(0);

  useEffect(() => {
    if (tabSelected === TAB_FUND_PERFORMANCE) {
      getProductDetail();
      getFundPerformance();
    }
  }, [name, tabSelected]);

  const getProductDetail = () => {
    product.getProductDetail(name).then(response => {
      if (response && response.data) {
        const data = response.data.data;
        setSelector(data);
      }
    }).catch(err => console.error(err));
  }

  const getFundPerformance = () => {
    product.getFundPerformance(name).then(response => {
      if (response) {
        const data: FundPerformance = response.data.data;
        data.preNavDate = data.preNavDate ? momentTimeZone.tz(data.preNavDate, currentTimezone).format(FORMATDATE_HH_MM_SS) : '';
        data.diffPercent = Number(data.diffPercent).toFixed(2);
        setFundPerformance(data);
      }
    }).catch(err => console.error(err));
  }

  return (
    <>
      <SEO title="Products Management > Product Selector" />
      <Breadcrumb
        spacing="8px"
        separator={<ChevronRightIcon color="gray.500" />}
        mb={12}
      >
        <BreadcrumbItem>
          <BreadcrumbLink href="/productsmanagement" as={NextLink}>
            Products Management
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <Text>Product Selector</Text>
        </BreadcrumbItem>
      </Breadcrumb>
      <Stack spacing={14}>
        <Stack spacing={4}>
          <Flex justifyContent="space-between">
            <Heading size="lg">Product Information</Heading>
          </Flex>
          <SimpleGrid
            columns={{ sm: 1, md: 2 }}
            spacing={12}
            backgroundColor="white"
            p={8}
            borderRadius="md"
            overflowX="auto"
          >
            <List spacing={3}>
              <ListItem>Product Type: <b>{selector?.productType}</b></ListItem>
              <ListItem>Domicile: <b>{selector?.countryDomicileName}</b></ListItem>
              <ListItem>
                Security Settlement Cut-Off Time:{" "}
                <b>{selector?.cufOffTime}</b>
              </ListItem>
            </List>
            <List spacing={3}>
              <ListItem>ISIN Code: <b>{selector?.ISINCode}</b></ListItem>
              <ListItem>Last Fund Size: <b>{selector?.totalSupply}</b></ListItem>
              <ListItem>NAV: <b>{selector?.nav}</b></ListItem>
              <ListItem>Inception Date: <b>{selector?.inceptionDate}</b></ListItem>
              <ListItem>Launch Price: <b>{selector?.launchPrice}</b></ListItem>
            </List>
          </SimpleGrid>
        </Stack>

        <Box backgroundColor={"white"} borderRadius={"md"} p="4">
          <Tabs onChange={(index) => setTabSelected(index)}>
            <TabList>
              <Tab>Fund Performance</Tab>
              <Tab>Transaction History</Tab>
              <Tab>Holders List</Tab>
              <Tab>Fund Productivity</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <FundPerformanceContainer tabSelected={tabSelected} fundPerformance={fundPerformance} />
              </TabPanel>
              <TabPanel>
                <ProductsManagement.ProductTransactionHistoryContainer tabSelected={tabSelected} id={name}/>
              </TabPanel>
              <TabPanel>
                <ProductsManagement.HolderListTable tabSelected={tabSelected} id={name}/>
              </TabPanel>
              <TabPanel>
                <ProductsManagement.FundProductivityContainer tabSelected={tabSelected} id={name}/>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Stack>
    </>
  );
};

function FundPerformanceContainer({ fundPerformance }: any) {
  return (
    <>
      <Heading size="sm">Unit Trust Performance</Heading>
      <SimpleGrid
        columns={{ sm: 1, md: 2 }}
        spacing={12}
        backgroundColor="white"
        p={8}
        borderRadius="md"
        overflowX="auto"
      >
        <List spacing={3}>
          <ListItem>NAV: <b>{fundPerformance?.nav}</b></ListItem>
          <ListItem>Product Type: <b>{fundPerformance?.productType}</b></ListItem>
          <ListItem>Previous NAV: <b>{fundPerformance?.preNav}</b></ListItem>
          <ListItem>Previous NAV Date: <b>{fundPerformance?.preNavDate}</b></ListItem>
          <ListItem>Difference: <b>{fundPerformance?.different}</b></ListItem>
          <ListItem>Difference (%): <b>{fundPerformance?.diffPercent}</b></ListItem>
        </List>
      </SimpleGrid>
    </>
  );
}

ProductSelectorPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ProductSelectorPage;
