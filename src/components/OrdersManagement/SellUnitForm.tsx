import {
  FormControl,
  FormLabel,
  Input,
  Box,
  Stack,
  Button,
  Select,
  useToast,
  RadioGroup,
  Radio,
  Flex,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody, Textarea, AlertDialogFooter, useDisclosure
} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {orders, user} from "../../api";
import {IssuanceModel} from "../../interfaces/product.model";
import {ProductState} from "../../mocks/products-selector";
import {OrderProps, RejectOrderParam, SellBuyUnitForm} from "../../interfaces/order.model";
import {RoleFunction, TYPE_SELECT_PRODUCT} from "../../constants";
import {ClientModel} from "../../interfaces/user.model";
import {
  BuySellOrderState, OrderStatus, OrderType,
  TAB_BALANCE, TAB_FAILED_ORDER,
  TAB_PENDING_OPEN_ORDER,
  TAB_QUANTITY,
  TAB_REDEMPTION,
} from "../../constants/orders";
import {ActionType, ProductStatus} from "../../constants/product";
import {checkUserAdmin, getRoleByScreen} from "../../utils/common";
import { Metacode } from "../../enum/enum-info";

function SellUnitForm(props: OrderProps) {
  const {listProduct, isSwitchTab, isLoadListAgain, clients, orderModify, resetOrder, tabSelected} = props;
  const toast = useToast();
  const funcAccessOM = getRoleByScreen(RoleFunction.view_order);
  const isAdmin = checkUserAdmin();
  const userInfo = user.getInfoUser();
  const [selector, setSelector] = useState<IssuanceModel>(ProductState);
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const [valueRadio, setValueRadio] = useState<string>(TAB_BALANCE);
  const [balance, setBalance] = useState<string>('');
  const [numUnits, setNumUnits] = useState<string>('');
  const [formSellUnit, setFormSellUnit] = useState<SellBuyUnitForm>(BuySellOrderState);
  const [type, setType] = useState<string>('');
  const [checkDisable, setCheckDisable] = useState<boolean>(false);
  const cancelRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const [reasonReject, setReasonReject] = useState<string>('');
  const {isOpen, onOpen, onClose} = useDisclosure();

  useEffect(() => {
    if (tabSelected === TAB_REDEMPTION) {
      setType(orderModify.type);
      setIsFirstLoad(false);
      if (orderModify.type === ActionType.UPDATE && orderModify.tabForm === TAB_REDEMPTION) {
        setFormSellUnit({
          cutOffTime: orderModify?.value?.cutOffTime,
          productId: orderModify?.value?.productId,
          customerId: orderModify?.value?.account?.id,
          amount: orderModify?.value?.transactionalValue,
          numberUnit: orderModify?.value?.orderQty,
          settDate: orderModify?.value?.settDate,
          transactionTradeDate: orderModify?.value?.transactionTradeDate
        });
        setBalance(orderModify?.value?.transactionalValue.toString());
        setNumUnits(orderModify?.value?.orderQty.toString());
        setCheckDisable(orderModify.tabList !== TAB_FAILED_ORDER);
        if (orderModify?.value?.status === OrderStatus.rejected && orderModify.value.orderType === OrderType.REDEMTION) {
          onOpen();
        }
      } else {
        setSelector(ProductState);
        setFormSellUnit(BuySellOrderState);
        setBalance('');
        setNumUnits('');
        setIsDisable(false);
        isAdmin ? setCheckDisable(false) : setCheckDisable(!funcAccessOM?.createFlg || false);
        onClose();
        setType('');
      }
    }
  }, [isSwitchTab]);

  useEffect(() => {
    if (!isFirstLoad) {
      setFormSellUnit({
        ...formSellUnit,
        numberUnit: calculateNumberOfUnit(Number(balance), orderModify.value?.product?.nav || selector?.nav),
        amount: Number(balance)
      });
    }
  }, [formSellUnit.productId, balance])

  useEffect(() => {
    if (!isFirstLoad) {
      setFormSellUnit({
        ...formSellUnit,
        numberUnit : Number(numUnits),
        amount: Number(numUnits) * (orderModify.value?.product?.nav || selector?.nav)
      });
    }
  }, [formSellUnit.productId, numUnits])

  const handleChange = (event: any) => {
    const {value, name} = event.target;
    if (name === TYPE_SELECT_PRODUCT) {
      let productSelected = listProduct.find((product: IssuanceModel) => product.id === Number(value)) || ProductState;
      setSelector(productSelected);
    }
    setFormSellUnit({...formSellUnit, [`${name}`] : Number(value), cutOffTime: selector.cufOffTime});
  }

  const onSubmitSellOrder = (e: any) => {
    e.preventDefault();
    setIsDisable(true);
    if (type === ActionType.UPDATE) {
      orders.approveSellOrder({orderId: orderModify?.value?.id}).then(response => {
        toast({title: "Success", status: "success", position: "top-right", isClosable: true});
        resetOrder();
      }).catch(err => {
        setIsDisable(false); 
        if (err?.response?.status === Metacode.BAD_REQUEST) {
          toastError(err?.response?.data?.error?.message);
        } else {
          toastError('Error');
        }
      });
    } else {
      orders.sellOrder(formSellUnit).then(response => {
        setIsDisable(false);
        isLoadListAgain(); resetOrder();
        toast({title: "Sell success", status: "success", position: "top-right", isClosable: true});
      }).catch(err => {
        setIsDisable(false);
        if (err?.response?.status === Metacode.BAD_REQUEST) {
          toastError(err?.response?.data?.error?.message);
        } else {
          toastError('Error');
        }
      })
    }
  }

  const changeValueRadio = (value: string) => {
    setValueRadio(value);
    setBalance('');
    setNumUnits('');
  }

  const calculateNumberOfUnit = (num1: number, num2: number) => {
    return Number((num1/num2).toFixed(2));
  }

  const toastError = (title: string) => {
    toast({title: title, status: "error", position: "top-right", isClosable: true});
  }

  const listSettlement = [
    {title: 'Settlement Date (Security)', value: 'settDate'},
    {title: 'Transaction Trade Date', value: 'transactionTradeDate'}
  ];

  const onChange = (e: any) => {
    const {name, value} = e.target;
    setFormSellUnit({
      ...formSellUnit,
      [`${name}`]: value
    })
  }
  const changeReasonReject = (event: any) => setReasonReject(event.target.value);

  const rejectOrder = () => {
    const params: RejectOrderParam = {
      orderId: orderModify?.value?.id,
      reason: reasonReject
    }
    orders.rejectOrder(params).then(response => {
      onClose();
      toast({title: "Success", status: "success", position: "top-right", isClosable: true});
      resetOrder();
    }).catch(error => {
      toast({title: "Error", status: "error", position: "top-right", isClosable: true});
    })
  }

  const updateOrder = () => {
    setIsDisable(true);
    orders.updateOrder(orderModify.value.id, formSellUnit).then(response => {
      toast({title: "Success", status: "success", position: "top-right", isClosable: true});
      resetOrder(); setIsDisable(false);
    }).catch(err => {
      setIsDisable(false);
      if (err?.response?.status === Metacode.BAD_REQUEST) {
        toastError(err?.response?.data?.error?.message);
      } else {
        toastError('Error');
      }
    })
  }

  return (
    <>
      <Box id="sellUnitForm" as="form" method="post" onSubmit={onSubmitSellOrder}>
        <Stack spacing={4}>
          <FormControl id="productName" isRequired isDisabled={checkDisable}>
            <FormLabel fontSize="sm" textColor="blue.700">
              Fund Name
            </FormLabel>
            <Select name="productId" value={formSellUnit.productId} onChange={() => handleChange(event)}>
              <option value=""/>
              {listProduct.filter((product: IssuanceModel) => product.status === ProductStatus.approved).map((product: IssuanceModel) => (
                <option key={product.id} value={product?.id}>{product?.productName}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl id="isin" isDisabled>
            <FormLabel fontSize="sm" textColor="blue.700">
              ISIN
            </FormLabel>
            <Input name="isin" value={selector?.ISINCode || orderModify.value?.product?.ISINCode}/>
          </FormControl>
          <RadioGroup onChange={(value) => changeValueRadio(value)} value={valueRadio} isDisabled={checkDisable}>
            <Stack direction='row'>
              <Radio value={TAB_BALANCE}>From Balance</Radio>
              <Radio value={TAB_QUANTITY}>Quantity</Radio>
            </Stack>
          </RadioGroup>
          {valueRadio === TAB_BALANCE &&
            (<FormControl id="amount" isRequired isDisabled={checkDisable}>
              <FormLabel fontSize="sm" textColor="blue.700">
                Balance
              </FormLabel>
              <Input name="amount" value={balance} type="number"
                     onChange={(event) => setBalance(event.target.value)}/>
            </FormControl>)
          }
          <FormControl id="customerId" isRequired isDisabled={checkDisable}>
            <FormLabel fontSize="sm" textColor="blue.700">
              Account
            </FormLabel>
            <Select name="customerId" value={formSellUnit.customerId} onChange={() => handleChange(event)}>
              <option value=""/>
              {clients.map((client: ClientModel) => (
                <option key={client.id} value={client.id}>{client.fullName}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl id="numberUnit" isRequired isDisabled={valueRadio === TAB_BALANCE || checkDisable}>
            <FormLabel fontSize="sm" textColor="blue.700">
              Number Of Units/Shares
            </FormLabel>
            <Input name="numberUnit" type="number" value={numUnits} onChange={(event) => setNumUnits(event.target.value)}/>
          </FormControl>
          <FormControl id="settlementCCY" isDisabled>
            <FormLabel fontSize="sm" textColor="blue.700">
              Settlement CCY
            </FormLabel>
            <Input name="settlementCCY" value={selector?.currencyCode || orderModify.value?.product?.currencyCode}/>
          </FormControl>
          <FormControl id="cutOffTime" isDisabled>
            <FormLabel fontSize="sm" textColor="blue.700">
              Transaction Cut-Off Time
            </FormLabel>
            <Input name="cutOffTime" value={formSellUnit.cutOffTime}/>
          </FormControl>
          {listSettlement.map(item => (
            <FormControl key={item.value} id={item.value} isRequired onChange={e => onChange(e)} isDisabled={checkDisable}>
              <FormLabel fontSize="sm" textColor="blue.700">
                {item.title}
              </FormLabel>
              <Select name={item.value} value={formSellUnit[`${item.value}`]}>
                <option value=""/>
                <option value="T+0">T+0</option>
                <option value="T+1">T+1</option>
                <option value="T+2">T+2</option>
              </Select>
            </FormControl>
          ))}
        </Stack>
      </Box>
      {type === ActionType.UPDATE && orderModify.tabList === TAB_PENDING_OPEN_ORDER && (isAdmin || funcAccessOM?.approveFlg) &&
        <Flex>
          <Button colorScheme="blue" form="sellUnitForm" isLoading={isDisable} type="submit" mt={12}>
            Approve
          </Button>
          <Button ml={6} colorScheme="red" mt={12} isDisabled={isDisable} onClick={() =>{onOpen(); setReasonReject('')}}>
            Reject
          </Button>
        </Flex>
      }
      <AlertDialog
        leastDestructiveRef={cancelRef}
        motionPreset='slideInBottom'
        onClose={onClose} isOpen={isOpen} isCentered
      >
        <AlertDialogOverlay/>
        <AlertDialogContent>
          { orderModify?.value?.status !== OrderStatus.rejected ?
              <AlertDialogHeader>Enter the reason for rejection</AlertDialogHeader> :
              <AlertDialogHeader>Reason for Rejection</AlertDialogHeader>
          }
          <AlertDialogCloseButton/>
          <AlertDialogBody mb={3}>
            {orderModify?.value?.status === OrderStatus.rejected ?
              <Textarea value={orderModify?.value?.orderReason} disabled={orderModify?.value?.status === OrderStatus.rejected}/> :
              <Textarea placeholder='Reason' onChange={() => changeReasonReject(event)}/>
            }
          </AlertDialogBody>
          {orderModify?.value?.status !== OrderStatus.rejected &&
            <AlertDialogFooter>
              <Button colorScheme='red' mr={3} disabled={!reasonReject.trim()} onClick={() => rejectOrder()}>
                Confirm
              </Button>
              <Button onClick={onClose}>
                Cancel
              </Button>
            </AlertDialogFooter>
          }
        </AlertDialogContent>
      </AlertDialog>
      {type === ActionType.UPDATE && 
        orderModify.tabList === TAB_FAILED_ORDER && 
        (isAdmin || (funcAccessOM?.writeFlg && orderModify.value?.createUid === userInfo?.id)) &&
        <Button mt={12} colorScheme="blue" form="sellUnitForm" isLoading={isDisable} onClick={updateOrder}>
          Update
        </Button>
      }
      {!type && (isAdmin || funcAccessOM?.createFlg) &&
        <Button mt={12} colorScheme="blue" form="sellUnitForm" isLoading={isDisable} type="submit">
         Submit
        </Button>
      }
    </>
  );
}

export default SellUnitForm;
