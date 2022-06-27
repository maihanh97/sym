import {
  FormControl,
  FormLabel,
  Input,
  Box,
  Stack,
  Button,
  Select,
  useToast,
  Radio,
  Flex,
  useDisclosure,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton, AlertDialogBody, Textarea, AlertDialogFooter, AlertDialog,
} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {orders, user} from "../../api";
import {IssuanceModel} from "../../interfaces/product.model";
import {ProductState} from "../../mocks/products-selector";
import {OrderProps, RejectOrderParam, SellBuyUnitForm} from "../../interfaces/order.model";
import {ClientModel} from "../../interfaces/user.model";
import {
  BuySellOrderState, OrderStatus, OrderType,
  TAB_FAILED_ORDER,
  TAB_PENDING_OPEN_ORDER,
  TAB_SUBCRIPTION,
} from "../../constants/orders";
import {ActionType, ProductStatus} from "../../constants/product";
import {checkUserAdmin, getRoleByScreen} from "../../utils/common";
import {RoleFunction} from "../../constants";
import { Metacode } from "../../enum/enum-info";

function BuyUnitForm(props: OrderProps) {
  const funcAccessOM = getRoleByScreen(RoleFunction.view_order);
  const isAdmin = checkUserAdmin();
  const userInfo = user.getInfoUser();
  const toast = useToast();
  const {isSwitchTab, isLoadListAgain, listProduct, clients, orderModify, resetOrder, tabSelected} = props;
  const [formBuyOrder, setFormBuyOrder] = useState<SellBuyUnitForm>(BuySellOrderState);
  const [selector, setSelector] = useState<IssuanceModel>(ProductState);
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const [type, setType] = useState<string>('');
  const listSettlement = [
    {title: 'Settlement Date (Cash)', value: 'settDate'},
    {title: 'Transaction Trade Date', value: 'transactionTradeDate'}
  ];
  const [balance, setBalance] = useState<string>('');
  const [checkDisable, setCheckDisable] = useState<boolean>(false);
  const {isOpen, onOpen, onClose} = useDisclosure();
  const cancelRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const [reasonReject, setReasonReject] = useState<string>('');
  useEffect(() => {
    setType(orderModify.type);
    setIsFirstLoad(false);
    if (tabSelected === TAB_SUBCRIPTION) {
      if (orderModify.type === ActionType.UPDATE && orderModify.tabForm === TAB_SUBCRIPTION) {
        setFormBuyOrder({
          ...formBuyOrder,
          productId: orderModify?.value?.productId,
          customerId: orderModify?.value?.account?.id,
          settDate: orderModify?.value?.settDate,
          transactionTradeDate: orderModify?.value?.transactionTradeDate,
          cutOffTime: orderModify?.value?.cutOffTime
        });
        setSelector(orderModify.value.product);
        setBalance(orderModify.value.transactionalValue.toString());
        setCheckDisable(orderModify.tabList !== TAB_FAILED_ORDER);
        if (orderModify?.value?.status === OrderStatus.rejected && orderModify.value.orderType === OrderType.SUBCRIPTION) {
          onOpen();
        }
      } else {
        setSelector(ProductState);
        setFormBuyOrder(BuySellOrderState);
        setBalance('');
        setIsDisable(false);
        isAdmin ? setCheckDisable(false) : setCheckDisable(!funcAccessOM?.createFlg || false);
        onClose();
        setType('');
      }
    }
  }, [isSwitchTab]);

  useEffect(() => {
    if (!isFirstLoad) {
      setFormBuyOrder({
        ...formBuyOrder,
        amount: Number(balance),
        numberUnit: calculateNumberOfUnit(Number(balance), selector?.nav)
      });
    }
  }, [balance, selector.id])

  const selectProduct = (event: any) => {
    const {value, name} = event.target;
    let productSelected = listProduct.find((product: IssuanceModel) => product.id?.toString() === value) || ProductState;
    setSelector(productSelected);
    setFormBuyOrder({...formBuyOrder, productId: productSelected?.id, cutOffTime: productSelected?.cufOffTime});
  }

  const handleChange = (event: any) => {
    const {name, value} = event.target;
    setFormBuyOrder({...formBuyOrder, [`${name}`]: Number(value)});
  }

  const onSubmitBuyOrder = (e: any) => {
    e.preventDefault();
    setIsDisable(true);

    if (type === ActionType.UPDATE) {
      orders.approveBuyOrder({orderId: orderModify.value.id}).then(response => {
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
      orders.buyOrder(formBuyOrder).then(response => {
        setIsDisable(false);
        isLoadListAgain(); resetOrder();
        toast({title: "Buy success", status: "success", position: "top-right", isClosable: true});
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

  const calculateNumberOfUnit = (num1: number, num2: number) => {
    return Number((num1/num2).toFixed(2));
  }

  const onChange = (e: any) => {
    const {name, value} = e.target;
    setFormBuyOrder({
      ...formBuyOrder,
      [`${name}`]: value
    })
  }

  const toastError = (title: string) => {
    toast({title: title, status: "error", position: "top-right", isClosable: true});
  }
  const changeReasonReject = (event: any) => setReasonReject(event.target.value);

  const rejectOrder = () => {
    setIsDisable(true);
    const params: RejectOrderParam = {
      orderId: orderModify.value.id,
      reason: reasonReject
    }
    orders.rejectOrder(params).then(response => {
      toast({title: "Success", status: "success", position: "top-right", isClosable: true});
      onClose(); resetOrder();
    }).catch(error => {
      setIsDisable(false);
      toastError("Error");
    })
  }

  const updateOrder = () => {
    setIsDisable(true);
    orders.updateOrder(orderModify.value.id, formBuyOrder).then(response => {
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
      <Box id="buyUnitForm" as="form" method="post" onSubmit={onSubmitBuyOrder}>
        <Stack spacing={4}>
          <FormControl id="productId" isRequired isDisabled={checkDisable}>
            <FormLabel fontSize="sm" textColor="blue.700">
              Fund Name
            </FormLabel>
            <Select name="productId" value={formBuyOrder.productId} onChange={() => selectProduct(event)}>
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
            <Input name="isin" value={selector?.ISINCode}/>
          </FormControl>
          <FormControl id="amount" isRequired isDisabled={checkDisable}>
            <FormLabel fontSize="sm" textColor="blue.700">
              Amount
            </FormLabel>
            <Input name="amount" value={balance} onChange={(event) => setBalance(event.target.value)}
                   type="number"/>
          </FormControl>
          <FormControl id="customerId" isRequired isDisabled={checkDisable}>
            <FormLabel fontSize="sm" textColor="blue.700">
              Account
            </FormLabel>
            <Select name="customerId" value={formBuyOrder.customerId} onChange={() => handleChange(event)}>
              <option value=""/>
              {clients.map((client: ClientModel) => (
                <option key={client.id} value={client.id}>{client.fullName}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl id="settlementCCY" isDisabled>
            <FormLabel fontSize="sm" textColor="blue.700">
              Settlement CCY
            </FormLabel>
            <Input name="settlementCCY" value={selector?.currencyCode}/>
          </FormControl>
          <FormControl id="cutOffTime" isDisabled>
            <FormLabel fontSize="sm" textColor="blue.700">
              Transaction Cut-Off Time
            </FormLabel>
            <Input name="cutOffTime" value={formBuyOrder.cutOffTime}/>
          </FormControl>
          {listSettlement.map(item => (
            <FormControl key={item.value} id={item.value} isRequired onChange={e => onChange(e)}
                         isDisabled={checkDisable}>
              <FormLabel fontSize="sm" textColor="blue.700">
                {item.title}
              </FormLabel>
              <Select name={item.value} value={formBuyOrder[`${item.value}`]}>
                <option value=""></option>
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
          <Button colorScheme="blue" form="buyUnitForm" isLoading={isDisable} type="submit" mt={12}>
            Approve
          </Button>
          <Button ml={6} colorScheme="red" onClick={() => {
            onOpen(); setReasonReject('');
          }} mt={12} isDisabled={isDisable}>
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
              <Button colorScheme='red' mr={3} disabled={!reasonReject.trim()} isLoading={isDisable} onClick={() => rejectOrder()}>
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
        <Button mt={12} colorScheme="blue" form="buyUnitForm" isLoading={isDisable} onClick={updateOrder}>
          Update
        </Button>
      }

      {!type && (isAdmin || funcAccessOM?.createFlg) &&
        <Button mt={12} colorScheme="blue" form="buyUnitForm" isLoading={isDisable} type="submit">
          Submit
        </Button>
      }
    </>
  );
}

export default BuyUnitForm;
