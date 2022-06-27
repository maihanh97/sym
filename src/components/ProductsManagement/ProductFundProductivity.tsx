import React, { useEffect, useState } from "react";
import {
  Heading,
  Stack,
  Flex,
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Tr,
  Th,
  Thead,
  Tbody,
  Td,
  Tfoot,
  Button
} from "@chakra-ui/react";
import moment from "moment";
import { add, format } from "date-fns";
import { DatePicker } from "antd";
import { ResponsiveTable } from "../index";
import { FundProductivityProps, ProductAUMTrendsProps, ProductPurchaseActivitiesProps } from "../../interfaces/product.model";
import { FILE_FORMATDATE, FORMATDATE, FORMATDATE_yyyy_MM_dd } from "../../constants";
import { TAB_AUM_TRENDS, TAB_FUND_PRODUCTIVITY, TAB_SUB_RED_STAT } from "../../constants/product";
import { product } from "../../api";
import { AssetBalanceModel, ProductAUMTrends } from "../../interfaces/asset-balance.model";
import { CSVLink } from "react-csv";
import { HeadersProductAUMTrends, HeadersProductPurchaseStats } from "../../mocks/products-selector";
import { ProductPurchaseModel, PurchaseActivitiesModel } from "../../interfaces/purchase.model";
import { roundFloat } from "../../utils/common";

const FundProductivityContainer = (props: FundProductivityProps) => {
  const { tabSelected, id } = props;
  const [tabFundSelected, setTabFundSelected] = useState<number>(0);

  return (
    <Tabs variant="solid-rounded" onChange={(index) => setTabFundSelected(index)}>
      <TabList>
        <Tab>Subscription & Redemption Stat</Tab>
        <Tab>AUM Trends</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <SubscriptionAndRedemptionStatsContainer tabSelected={tabSelected} tabFundSelected={tabFundSelected} id={id}/>
        </TabPanel>
        <TabPanel>
          <AUMTrendsContainer tabSelected={tabSelected} tabFundSelected={tabFundSelected} id={id} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

const SubscriptionAndRedemptionStatsContainer = (props: ProductPurchaseActivitiesProps) => {
  const { tabSelected, tabFundSelected, id } = props;
  const { RangePicker } = DatePicker;
  const [productPuchase, setProductPuchase] = useState<Array<ProductPurchaseModel>>([]);
  const [productPuchaseTotal, setProductPuchaseTotal] = useState<ProductPurchaseModel>();
  const [startDate, setStartDate] = React.useState(
    moment().subtract(1, "weeks")
  );
  const [endDate, setEndDate] = React.useState(moment());
  const differenceInDays = moment.duration(endDate.diff(startDate)).asDays();
  const handleChangeDate = (date: any) => {
    if (date) {
      setStartDate(date[0]);
      setEndDate(date[1]);
    } else {
      setStartDate(moment().subtract(1, "weeks"));
      setEndDate(moment());
    }
  };
  const fileName = `purchase_activities_${startDate.format(FILE_FORMATDATE)}_${endDate.format(FILE_FORMATDATE)}.csv`;

  useEffect(() => {
    if (tabSelected === TAB_FUND_PRODUCTIVITY && tabFundSelected === TAB_SUB_RED_STAT) {
      getProductPuchase();
    }
  }, [tabSelected, tabFundSelected, endDate, startDate]);

  const getProductPuchase = () => {
    const params = {
      fromDate: moment(startDate).format(FORMATDATE),
      toDate: moment(endDate).format(FORMATDATE)
    }
    product.getProductPurchaseActivities(id, params).then(response => {
      const data = response?.data?.data;
      const purchaseData: ProductPurchaseModel[] = []
      for (let i = differenceInDays; i >= 0; i--) {
        let purchaseDate = format(
          add(new Date(params.fromDate), { days: i }),
          FORMATDATE_yyyy_MM_dd
        );
        let purchase = data?.find((e: ProductPurchaseModel) => e.activityDate === purchaseDate)
        purchaseData.push({
          activityDate: purchaseDate,
          netSubRedAmount: purchase ? purchase?.netSubRedAmount : 0,
          netSubRedUnits: purchase ? purchase?.netSubRedUnits : 0,
          redemptionAmount: purchase ? purchase?.redemptionAmount : 0,
          redemptionUnits: purchase ? purchase?.redemptionUnits : 0,
          subscriptionAmount: purchase ? purchase?.subscriptionAmount : 0,
          subscriptionUnits: purchase ? purchase?.subscriptionUnits : 0,
        })
      }

      let totalRedemptionAmount = roundFloat(data.map((e: PurchaseActivitiesModel) => e.redemptionAmount).reduce((a: number, b: number) => +a + +b, 0));
      let totalRedemptionUnits = roundFloat(data.map((e: PurchaseActivitiesModel) => e.redemptionUnits).reduce((a: number, b: number) => +a + +b, 0));
      let totalSubscriptionAmount = roundFloat(data.map((e: PurchaseActivitiesModel) => e.subscriptionAmount).reduce((a: number, b: number) => +a + +b, 0));
      let totalSubscriptionUnits = roundFloat(data.map((e: PurchaseActivitiesModel) => e.subscriptionUnits).reduce((a: number, b: number) => +a + +b, 0));
      let totalNetSubRedAmount = roundFloat(totalSubscriptionAmount - totalRedemptionAmount);
      let totalNetSubRedUnits = roundFloat(totalSubscriptionUnits - totalRedemptionUnits);
      let totalData = {
        activityDate: "Total",
        netSubRedAmount: totalNetSubRedAmount,
        netSubRedUnits: totalNetSubRedUnits,
        redemptionAmount: totalRedemptionAmount,
        redemptionUnits: totalRedemptionUnits,
        subscriptionAmount: totalSubscriptionAmount,
        subscriptionUnits: totalSubscriptionUnits,
      }
      setProductPuchaseTotal(totalData);
      setProductPuchase(purchaseData);
    }).catch(err => {
      console.error(err);
    });
  }

  return (
    <Stack spacing={6}>
      <Flex justifyContent={"space-between"} mb={4}>
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
            {HeadersProductPurchaseStats.map((item, index) => <Th key={index}>{item.label}</Th>)}
          </Tr>
        </Thead>
        <Tbody>
          {
            productPuchase?.map((purchase: ProductPurchaseModel, index) => (
              <Tr key={index}>
                <Td>{purchase?.activityDate}</Td>
                <Td>{purchase?.subscriptionUnits}</Td>
                <Td>{purchase?.subscriptionAmount}</Td>
                <Td>{purchase?.redemptionUnits}</Td>
                <Td>{purchase?.redemptionAmount}</Td>
                <Td>{purchase?.netSubRedUnits}</Td>
                <Td>{purchase?.netSubRedAmount}</Td>
              </Tr>
            ))
          }
          <Tr fontWeight="extrabold">
            <Td>{productPuchaseTotal?.activityDate}</Td>
            <Td>{productPuchaseTotal?.subscriptionUnits}</Td>
            <Td>{productPuchaseTotal?.subscriptionAmount}</Td>
            <Td>{productPuchaseTotal?.redemptionUnits}</Td>
            <Td>{productPuchaseTotal?.redemptionAmount}</Td>
            <Td>{productPuchaseTotal?.netSubRedUnits}</Td>
            <Td>{productPuchaseTotal?.netSubRedAmount}</Td>
          </Tr>
        </Tbody>
      </ResponsiveTable>
      <Box textAlign={"right"}>
        <CSVLink data={productPuchase} headers={HeadersProductPurchaseStats} filename={fileName}>
          <Button colorScheme={"blue"} mr={5}>Export CSV</Button>
        </CSVLink>
      </Box>
    </Stack>
  );
}

const AUMTrendsContainer = (props: ProductAUMTrendsProps) => {
  const { tabSelected, tabFundSelected, id } = props;
  const { RangePicker } = DatePicker;
  const [productAUM, setProductAUM] = useState<Array<ProductAUMTrends>>([]);
  const [startDate, setStartDate] = React.useState(
    moment().subtract(1, "weeks")
  );
  const [endDate, setEndDate] = React.useState(moment());
  const differenceInDays = moment.duration(endDate.diff(startDate)).asDays();
  const handleChangeDate = (date: any) => {
    if (date) {
      setStartDate(date[0]);
      setEndDate(date[1]);
    } else {
      setStartDate(moment().subtract(1, "weeks"));
      setEndDate(moment());
    }
  };

  const fileName = `aum_trends_${startDate.format(FILE_FORMATDATE)}_${endDate.format(FILE_FORMATDATE)}.csv`;

  useEffect(() => {
    if (tabSelected === TAB_FUND_PRODUCTIVITY && tabFundSelected === TAB_AUM_TRENDS) {
      getProductPuchase();
    }
  }, [tabSelected, tabFundSelected, endDate, startDate]);

  const getProductPuchase = () => {
    const params = {
      fromDate: moment(startDate).format(FORMATDATE),
      toDate: moment(endDate).format(FORMATDATE)
    }
    product.getProductAumFunds(id, params).then(response => {
      const data = response?.data?.data;
      const assetData: ProductAUMTrends[] = []
      for (let i = differenceInDays; i >= 0; i--) {
        let assetDate = format(
          add(new Date(params.fromDate), { days: i }),
          FORMATDATE_yyyy_MM_dd
        );
        let aum = data.find((e: AssetBalanceModel) => e.valuationDate === assetDate)
        assetData.push({
          date: assetDate,
          aum: Number(aum?.netValue) ? Number(aum?.netValue) : 0
        })
      }
      setProductAUM(assetData);
    }).catch(err => {
      console.error(err);
    });
  }

  return (
    <Stack spacing={6}>
      <Flex justifyContent={"space-between"} mb={4}>
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
            {HeadersProductAUMTrends.map(item => <Th key={item.key}>{item.label}</Th>)}
          </Tr>
        </Thead>
        <Tbody>
          {
            productAUM?.map((aum: ProductAUMTrends, index) => (
              <Tr key={index}>
                <Td>{aum?.date}</Td>
                <Td>{aum?.aum}</Td>
              </Tr>
            ))
          }
        </Tbody>
      </ResponsiveTable>
      <Box textAlign={"right"}>
        <CSVLink data={productAUM} headers={HeadersProductAUMTrends} filename={fileName}>
          <Button colorScheme={"blue"} mr={5}>Export CSV</Button>
        </CSVLink>
      </Box>
    </Stack>
  );
}

export default FundProductivityContainer;
