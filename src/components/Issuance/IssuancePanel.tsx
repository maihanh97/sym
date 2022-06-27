import React, {useState} from "react";
import {
  Box, Button,
  Heading, Flex
} from "@chakra-ui/react";
import {Issuance} from '../../components/index';
import {ActionType, HeaderIssuance, ProductStatus} from "../../constants/product";
import {IssuanceModel} from "../../interfaces/product.model";
import {ProductState} from "../../mocks/products-selector";

export default function IssuancePanel() {
  const [isLoad, setIsLoad] = useState<boolean>(false);
  const [isModify, setIsModify] = useState<boolean>(false);
  const [heading, setHeading] = useState<string>(HeaderIssuance.create);
  const [typeModify, setTypeModify] = useState<string>(ActionType.CREATE);
  const [productModify, setProductModify] = useState<IssuanceModel>(ProductState);

  const checkIsCreateDone = () => {
    setIsLoad(!isLoad); setIsModify(!isModify);
    setTypeModify(ActionType.CREATE);
    setHeading(HeaderIssuance.create);
  }

  const modifyProduct = (item: IssuanceModel) => {
    if (item.status === ProductStatus.approved) {
      checkIsCreateDone();
    } else if (item.status === ProductStatus.pending) {
      setHeading(HeaderIssuance.request);
    } else {
      setHeading(HeaderIssuance.modify);
    }
    setProductModify(item);
    setIsModify(!isModify);
    setTypeModify(ActionType.UPDATE);
  }

  return (
    <>
      <Heading size="lg" mb={8}> Issuance Status </Heading>
      <Box className={"table_issuance"} backgroundColor={"white"} borderRadius={"md"} p={4}  mb={8}>
        <Issuance.IssuanceApproved isLoad={isLoad} modifyProduct={modifyProduct}/>
      </Box>
      <Flex justifyContent={"space-between"}>
        <Heading size="lg" mb={8}> {heading} </Heading>
        <Button colorScheme="blue" type="submit" ml={6} onClick={() => checkIsCreateDone()}> Return </Button>
      </Flex>
      <Issuance.NewProductForm isModify={isModify} typeModify={typeModify} checkIsCreateDone={checkIsCreateDone} itemModify={productModify}/>
    </>
  );
}
