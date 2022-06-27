import {IssuanceModel, IssuanceProps} from "../../interfaces/product.model";
import React, {useEffect, useState} from "react";
import {product} from "../../api";
import {ResponsiveTable} from "../index";
import {Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";
import momentTimeZone from "moment-timezone";
import {FORMATDATE_DD_MMM_YYYY, FORMATDATE_HH_MM_SS, myTimezone} from "../../constants";

export default function IssuanceApproved(props: IssuanceProps) {
  const {isLoad, modifyProduct} = props;
  const [productApproved, setProductApproved] = useState<IssuanceModel[]>([]);

  useEffect(() => {
    getProductApproved();
  }, [isLoad]);

  const getProductApproved = () => {
    product.getListProducts().then(response => {
      const data = response?.data?.data;
      data?.rows.sort((a: IssuanceModel, b: IssuanceModel) => (b.writeDate)?.localeCompare(a.writeDate));
      data?.rows.forEach((product: IssuanceModel) => {
        product.writeDate = product.writeDate ? momentTimeZone.tz(product.writeDate, myTimezone).format(FORMATDATE_HH_MM_SS) : '';
      })
      setProductApproved(data?.rows);
    }).catch(error => console.error(error))
  }

  const showFormModify = (product: IssuanceModel) => modifyProduct(product);

  return (
    <>
      <ResponsiveTable>
        <Thead position="sticky" top={0} bgColor="white">
          <Tr>
            <Th>Fund Name</Th>
            <Th>Class</Th>
            <Th>Launch Date</Th>
            <Th>Currency Denomination</Th>
            <Th>Launch Price (Per Unit/Share)</Th>
            <Th>Status</Th>
            <Th>Last Updated</Th>
          </Tr>
        </Thead>
        <Tbody>
          {productApproved.length ?
            (
              productApproved.map((product: IssuanceModel) => (
                <Tr key={product.id} onClick={() => showFormModify(product)}>
                  <Td className={"fund_name"}>{product?.productName}</Td>
                  <Td>{product?.productType}</Td>
                  <Td>{product?.inceptionDate ? momentTimeZone.tz(product.inceptionDate, myTimezone).format(FORMATDATE_DD_MMM_YYYY) : ''}</Td>
                  <Td>{product?.currencyCode}</Td>
                  <Td>{product?.launchPrice}</Td>
                  <Td>{product?.status}</Td>
                  <Td>{product?.writeDate}</Td>
                </Tr>
              ))
            )
            : (<Tr>
              <Td colSpan={9} textAlign={"center"}>
                No data
              </Td>
            </Tr>)}
        </Tbody>
      </ResponsiveTable>
    </>
  );
}