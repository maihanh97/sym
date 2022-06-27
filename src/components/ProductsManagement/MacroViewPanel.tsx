import React, {useContext, useEffect, useState} from "react";
import { DatePicker, Upload, UploadProps } from "antd";
import { ProductsManagement } from "../../components/index";
import {
  Flex,
  Input,
  Stack,
  Box,
  Heading,
  Text,
  Button,
  useToast,
} from "@chakra-ui/react";
import moment from "moment";
import { add, format } from "date-fns";
import {
  IssuanceModel,
  TransactionHistoryModel,
} from "../../interfaces/product.model";
import { 
  FORMATDATE, 
  FORMATDATE_HH_MM_SS, 
  myTimezone, 
  ORDER, 
  PRODUCT, 
  FILE_FORMATDATE, 
  FORMATDATE_yyyy_MM_dd, 
  FORMATDATE_DD_MMM_YY, 
  ACCESS_TOKEN,
  RoleFunction
} from "../../constants";
import { orders, product } from "../../api";
import momentTimeZone from "moment-timezone";
import { DataTable } from "../../components/index";
import { ProductsManagementTabContext } from '../../pages/productsmanagement/index'
import { CSVLink } from "react-csv";
import { HeadersMacroViewAUMFunds, HeadersMacroViewPurchaseActivities, HeadersTransactionHistory } from "../../mocks/products-selector";
import { AssetBalanceModel, AUMFundsModel } from "../../interfaces/asset-balance.model";
import { PurchaseActivitiesModel } from "../../interfaces/purchase.model";
import { ENV } from "../../config/env";
import { getItemLocalStorage } from "../../hooks";
import { Metacode } from "../../enum/enum-info";
import { checkUserAdmin, getRoleByScreen } from "../../utils/common";

const currentTimezone = myTimezone;
const transactionHistoryHeaders = HeadersTransactionHistory;

export default function MacroViewPanel() {
  return (
    <Stack spacing={24}>
      <AUMFundsContainer />
      <SubscriptionAndRedemptionActivitiesContainer />
      <TransactionHistoryContainer />
    </Stack>
  );
}

function AUMFundsContainer() {
  const [keyword, setKeyword] = React.useState("");
  const { RangePicker } = DatePicker;
  const [startDate, setStartDate] = React.useState(
    moment().subtract(1, "weeks")
  );
  const [endDate, setEndDate] = React.useState(moment());
  const differenceInDays = moment.duration(endDate.diff(startDate)).asDays();
  const [aumFunds, setAumFunds] = useState<Array<AUMFundsModel>>([]);
  const [filtedAumFunds, setFiltedAumFunds] = useState<Array<AUMFundsModel>>([]);
  const [listApprovedProduct, setListApprovedProduct] = useState<Array<IssuanceModel>>([]);
  const useProductsManagementTabContext = () =>  useContext(ProductsManagementTabContext);
  const { tabSelected } = useProductsManagementTabContext()

  const fileName = `aum_trends_${startDate.format(FILE_FORMATDATE)}_${endDate.format(FILE_FORMATDATE)}.csv`;

  useEffect(() => {
    if (tabSelected === PRODUCT.TAB_MACRO_VIEW) {
      getAumFunds();
    }
  }, [startDate, endDate, tabSelected]);

  useEffect(() => {
    if (!keyword) {
      getAumFunds();
    }
    const searchKeyword = keyword.toLowerCase();
    const aumFilter = aumFunds.filter((aum: AUMFundsModel) => {
      return aum?.product?.productName?.toLocaleLowerCase().includes(searchKeyword) ||
        aum?.product?.productType?.toLocaleLowerCase().includes(searchKeyword) ||
        aum?.product?.class?.toLocaleLowerCase().includes(searchKeyword)
    });
    setFiltedAumFunds(aumFilter);
  }, [keyword])

  const handleChangeDate = (date: any) => {
    if (date) {
      setStartDate(date[0]);
      setEndDate(date[1]);
    } else {
      setStartDate(moment().subtract(1, "weeks"));
      setEndDate(moment());
    }
  };

  const tableHeaders = [
    {
      Header: "Fund Name",
      accessor: "product.productName",
    },
    {
      Header: "Fund Type",
      accessor: "product.productType",
    },    
    {
      Header: "Class",
      accessor: "product.class",
    },
    {
      Header: "Date",
      accessor: "date",
    },
    {
      Header: "AUM($)",
      accessor: "aum",
      isNumeric: true,
    },
  ];
  const columns = tableHeaders;

  const getAumFunds = () => {
    const params = {
      fromDate: moment(startDate).format(FORMATDATE),
      toDate: moment(endDate).format(FORMATDATE)
    }
    
    product.getListProductApproved().then(resp => {
      const listProduct = resp?.data?.data?.rows;
      listProduct.sort((a: IssuanceModel, b: IssuanceModel) => (b.writeDate)?.localeCompare(a.writeDate));
      setListApprovedProduct(listProduct);
    }).catch(err => console.error(err))

    product.getAumFunds(params).then(response => {
      const aumFundsValue = response?.data?.data;
      const data: AUMFundsModel[] = []
      for (let i = differenceInDays; i >= 0; i--) {
        let assetDate = format(
          add(new Date(params.fromDate), { days: i }),
          FORMATDATE_yyyy_MM_dd
        );
        listApprovedProduct.forEach((prod: IssuanceModel) => {
          let aum = aumFundsValue?.find((e: AssetBalanceModel) => e.valuationDate === assetDate && e.productId === prod?.id)
          data.push({
            product: prod,
            date: assetDate,
            aum: aum?.netValue ? aum?.netValue : 0,        
          })
        })
      }
      setAumFunds(data || []);
      setFiltedAumFunds(data || []);
    }).catch(err => {
      console.error(err);
    });
  }

  return (
    <Stack spacing={6}>
      <Box>
        <Heading size="md">AUM Trends</Heading>
        <Text>
          (Displaying {differenceInDays} Days AUM changes for 14 products for
          the period of {startDate.format(FORMATDATE_DD_MMM_YY)} to{" "}
          {endDate.format(FORMATDATE_DD_MMM_YY)})
        </Text>
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
      <DataTable columns={columns} data={filtedAumFunds} />
      <Box textAlign={"right"}>
        <CSVLink data={filtedAumFunds} headers={HeadersMacroViewAUMFunds} filename={fileName}>
          <Button colorScheme={"blue"} mr={5}>Export CSV</Button>
        </CSVLink>
      </Box>
    </Stack>
  );
}

function SubscriptionAndRedemptionActivitiesContainer() {
  const [keyword, setKeyword] = React.useState("");
  const { RangePicker } = DatePicker;
  const [startDate, setStartDate] = React.useState(
    moment().subtract(1, "weeks")
  );
  const [endDate, setEndDate] = React.useState(moment());
  const fileName = `purchase_activities_${startDate.format(FILE_FORMATDATE)}_${endDate.format(FILE_FORMATDATE)}.csv`;
  const handleChangeDate = (date: any) => {
    if (date) {
      setStartDate(date[0]);
      setEndDate(date[1]);
    } else {
      setStartDate(moment().subtract(1, "weeks"));
      setEndDate(moment());
    }
  };
  const [activities, setActivities] = useState<Array<PurchaseActivitiesModel>>([]);
  const [filtedActivities, setFiltedActivities] = useState<Array<PurchaseActivitiesModel>>([]);
  const [listApprovedProduct, setListApprovedProduct] = useState<Array<IssuanceModel>>([]);
  const useProductsManagementTabContext = () =>  useContext(ProductsManagementTabContext);
  const { tabSelected } = useProductsManagementTabContext()
  const differenceInDays = moment.duration(endDate.diff(startDate)).asDays();
  const funcAccessPM = getRoleByScreen(RoleFunction.view_product);
  const fileTypeAccept = "application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  const toast = useToast();

  useEffect(() => {
    if (tabSelected === PRODUCT.TAB_MACRO_VIEW) {
      getPurchaseActivities();
    }
  }, [startDate, endDate, tabSelected]);

  useEffect(() => {
    if (!keyword) {
      getPurchaseActivities();
    }
    const searchKeyword = keyword.toLowerCase();
    const activitiesFilter = activities.filter((activity: PurchaseActivitiesModel) => {
      return activity.product?.productName?.toLocaleLowerCase().includes(searchKeyword) ||
        activity?.product?.class?.toLocaleLowerCase().includes(searchKeyword)
    });
    setFiltedActivities(activitiesFilter);
  }, [keyword])

  const getPurchaseActivities = () => {
    const params = {
      fromDate: moment(startDate).format(FORMATDATE),
      toDate: moment(endDate).format(FORMATDATE)
    }

    product.getListProductApproved().then(resp => {
      const listProduct = resp?.data?.data?.rows;
      listProduct.sort((a: IssuanceModel, b: IssuanceModel) => (b.writeDate)?.localeCompare(a.writeDate));
      setListApprovedProduct(listProduct);
    }).catch(err => console.error(err))

    product.getPurchaseActivities(params).then(response => {
      const purchaseData = response?.data?.data;
      const data: PurchaseActivitiesModel[] = []
      for (let i = differenceInDays; i >= 0; i--) {
        let purchaseDate = format(
          add(new Date(params.fromDate), { days: i }),
          FORMATDATE_yyyy_MM_dd
        );
        listApprovedProduct.forEach((prod: IssuanceModel) => {
          let purchase = purchaseData?.find((e: PurchaseActivitiesModel) => e.activityDate === purchaseDate && e.product.id === prod?.id)
          data.push({
            product: prod,
            activityDate: purchaseDate,
            netSubRedAmount: purchase ? purchase?.netSubRedAmount : 0,
            netSubRedUnits: purchase ? purchase?.netSubRedUnits : 0,
            redemptionAmount: purchase ? purchase?.redemptionAmount : 0,
            redemptionUnits: purchase ? purchase?.redemptionUnits : 0,
            subscriptionAmount: purchase ? purchase?.subscriptionAmount : 0,
            subscriptionUnits: purchase ? purchase?.subscriptionUnits : 0,
          })
        })
      }
      setActivities(data || []);
      setFiltedActivities(data || []);
    }).catch(err => {
      console.error(err);
    });
  }

  const toastError = (title: string) => {
    toast({title: title, status: "error", position: "top-right", isClosable: true});
  }
  const propsUploadFile: UploadProps = {
    name: 'file',
    action: `${ENV.BASE_URL}/api/products/import-purchase`,
    headers: {
      authorization: `Bearer ${getItemLocalStorage(ACCESS_TOKEN)}`,
    },
    beforeUpload: file => {
      if (!file.type || !fileTypeAccept.includes(file.type)) {
        toastError("File not support");
        return Upload.LIST_IGNORE;
      }
    },
    onChange({ file }: any) {
      if (file.status === 'done') {
        toast({title: "Success", status: "success", position: "top-right", isClosable: true});
      } else if (file.status === 'error') {
        if (file?.response?.statusCode === Metacode.BAD_REQUEST || file?.response?.statusCode === Metacode.NOT_FOUND) {
          toastError(file?.response?.error?.message);
        } else {
          toastError('Error');
        }
      }
    }
  }

  const tableHeaders = [
    {
      Header: "Product",
      accessor: "product.productName",
    },
    {
      Header: "Class",
      accessor: "product.class",
    },
    {
      Header: "Date",
      accessor: "activityDate",
    },
    {
      Header: "CCY",
      accessor: "product.currencyCode",
    },
    {
      Header: "Total Number of Shares Subscribed",
      accessor: "subscriptionUnits",
      isNumeric: true,
    },
    {
      Header: "Total Notional Amount (Subscribed)",
      accessor: "subscriptionAmount",
      isNumeric: true,
    },
    {
      Header: "Total Number of Shares Redeemed",
      accessor: "redemptionUnits",
      isNumeric: true,
    },
    {
      Header: "Total Notional Amount (Redeemed)",
      accessor: "redemptionAmount",
      isNumeric: true,
    },
    {
      Header: "Net Subscription/ Redemption",
      accessor: "netSubRedUnits",
      isNumeric: true,
    },
    {
      Header: "Net Notional Amount",
      accessor: "netSubRedAmount",
      isNumeric: true,
    },
  ];
  const columns = tableHeaders;

  return (
    <Stack spacing={6}>
      <Box>
        <Heading size="md">Subscription & Redemption Activities</Heading>
        <Text>
          (Displaying {differenceInDays} Days AUM changes Subscription and
          Redemption Activities for 1 products for the period of{" "}
          {startDate.format("DD-MMM-YY")} to {endDate.format("DD-MMM-YY")})
        </Text>
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
      <DataTable columns={columns} data={filtedActivities} />
      <Flex justifyContent="end" textAlign={"right"} mt={6}>
        {(checkUserAdmin() || funcAccessPM?.importFlg) && <Upload {...propsUploadFile} accept={fileTypeAccept}>
          <Button mr={5}>Import File</Button>
        </Upload>}
        <CSVLink data={filtedActivities} headers={HeadersMacroViewPurchaseActivities} filename={fileName}>
          <Button colorScheme={"blue"} mr={5}>Export CSV</Button>
        </CSVLink>
      </Flex>
    </Stack>
  );
}

function TransactionHistoryContainer() {
  const [keyword, setKeyword] = React.useState("");
  const { RangePicker } = DatePicker;
  const [startDate, setStartDate] = React.useState(
    moment().subtract(1, "weeks")
  );
  const [endDate, setEndDate] = React.useState(moment());
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

  const tableHeaders = [
    {
      Header: "TXN ID",
      accessor: "txnId",
    },
    {
      Header: "Timestamp",
      accessor: "orderDateTime",
    },
    {
      Header: "Contract Address",
      accessor: "product.contractAddress",
    },
    {
      Header: "Initiator",
      accessor: "account.fullName",
    },
    {
      Header: "Product Name",
      accessor: "product.productName",
    },
    {
      Header: "ISIN",
      accessor: "product.ISINCode",
    },
    {
      Header: "Order Type",
      accessor: "orderType",
    },
    {
      Header: "Number of Units/Shares",
      accessor: "orderQty",
      isNumeric: true,
    },
    {
      Header: "Status",
      accessor: "status",
    },
  ];
  const columns = tableHeaders;
  const [transHistory, setTransHistory] = useState<Array<TransactionHistoryModel>>([]);
  const [filtedTransHistory, setFiltedTransHistory] = useState<Array<TransactionHistoryModel>>([]);
  const [newPageSize, setNewPageSize] = React.useState(10)

  const useProductsManagementTabContext = () =>  useContext(ProductsManagementTabContext);
  const { tabSelected } = useProductsManagementTabContext()

  useEffect(() => {
    if (tabSelected === PRODUCT.TAB_MACRO_VIEW) {
      getOrderTransactionHistory();
    }
  }, [startDate, endDate, tabSelected]);

  useEffect(() => {
    if (!keyword) {
      getOrderTransactionHistory();
    }
    const searchKeyword = keyword.toLowerCase();
    const orderFilter = transHistory.filter((order: TransactionHistoryModel) => {
      return order.txnId?.toLocaleLowerCase().includes(searchKeyword) ||
        order.product.contractAddress?.toLocaleLowerCase().includes(searchKeyword) ||
        order.product.ISINCode?.toLocaleLowerCase().includes(searchKeyword) ||
        order.account.fullName?.toLocaleLowerCase().includes(searchKeyword) ||
        order.product.productName?.toLocaleLowerCase().includes(searchKeyword) ||        
        order.orderType?.toLocaleLowerCase().includes(searchKeyword)
      });
      setFiltedTransHistory(orderFilter);
  }, [keyword])


  const getOrderTransactionHistory = () => {
    const params = {
      fromDate: moment(startDate).format(FORMATDATE),
      toDate: moment(endDate).subtract(-1, 'day').format(FORMATDATE)
    }
    orders.getOrderTransactionHistory(params).then(response => {
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

  const handlePageSize = (pageSize: number) => {
    setNewPageSize(pageSize)
  }
  const countFilteredData = transHistory.length

  return (
    <Stack spacing={6}>
      <Box>
        <Heading size="md">Transaction History</Heading>
        <Text>Total of {countFilteredData} transactions listed.</Text>
        <Text>Displaying the latest {newPageSize} transactions.</Text>
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
      <DataTable
        columns={columns}
        data={filtedTransHistory}
        handlePageSize={handlePageSize}
      />
      <Box textAlign={"right"}>
        <CSVLink data={filtedTransHistory} headers={transactionHistoryHeaders} filename={fileName}>
          <Button colorScheme={"blue"} mr={5}>Export CSV</Button>
        </CSVLink>
      </Box>
    </Stack>
  );
}
