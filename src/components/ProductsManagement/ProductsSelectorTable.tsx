import React, {useContext, useEffect, useMemo, useState} from "react";
import DataTable from "../../components/DataTable";
import { HStack, Box, Tooltip, IconButton, useToast, Button } from "@chakra-ui/react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useRouter } from "next/router";
import { product, user } from "../../api";
import { FORMATDATE_HH_MM_SS, myTimezone, PRODUCT } from "../../constants";
import timezone from 'moment-timezone';
import {IssuanceModel} from "../../interfaces/product.model";
import { ProductsManagementTabContext } from '../../pages/productsmanagement/index'

function ProductSelectorTable() {
  const router = useRouter();
  const [listProduct, setListProduct] = useState([]);
  const locale = myTimezone;

  const useProductsManagementTabContext = () =>  useContext(ProductsManagementTabContext);
  const { tabSelected } = useProductsManagementTabContext()

  useEffect(() => {
    if (tabSelected === PRODUCT.TAB_PRODUCT_SELECTOR) {
      getListProducts();
    }
  }, [tabSelected])

  const getListProducts = () => {
    product.getListProducts().then(resp => {
      if (resp && resp.data) {
        const data = resp.data.data?.rows.filter((item: IssuanceModel) => item.status === PRODUCT.ProductStatus.approved);
        data.sort((a: IssuanceModel, b: IssuanceModel) => (b.writeDate)?.localeCompare(a.writeDate));
        data.forEach((item: IssuanceModel) => {
          item.writeDate = timezone.tz(item.writeDate, locale).format(FORMATDATE_HH_MM_SS);
        });
        setListProduct(data);
      }
    }).catch(err => console.error(err))
  }
  
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "productName",
        Cell: ({ cell: { value, key } }: any) => (
          <HStack key={key} spacing={4} justifyContent={"space-between"}>
            <Box>{value}</Box>
            <Tooltip label="View">
              <Button
                colorScheme="blue"
                onClick={(event: any) => {
                  const button = event.target;
                  const nodeParentButton = button.parentNode.parentNode.parentNode;
                  router.push(`/productsmanagement/${nodeParentButton.id}`);
                }}>
                <MdOutlineRemoveRedEye />
              </Button>
            </Tooltip>
          </HStack>
        ),
      },
      {
        Header: "Asset Class",
        accessor: "productType",
      },
      {
        Header: "Currency",
        accessor: "currencyCode",
      },
      {
        Header: "Inception Date",
        accessor: "inceptionDate",
      },
      {
        Header: "NAV",
        accessor: "nav",
      },
      {
        Header: "Last Updated",
        accessor: "writeDate",
      },
      {
        Header: "Blockchain Address",
        accessor: "contractAddress",
      },
    ],
    [router]
  );

  return <DataTable columns={columns} data={listProduct}/>;
}

export default ProductSelectorTable;
