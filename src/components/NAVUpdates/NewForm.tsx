import React, {useEffect, useState} from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Box,
  Button,
  useToast,
  FormErrorMessage,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody, Textarea, AlertDialogFooter, AlertDialog, useDisclosure,
} from "@chakra-ui/react";
import {NavFormProps, NavRejectParams, NavUpdateParam} from "../../interfaces/user.model";
import {user, product} from "../../api";
import {ProductState, NavUpdateInit} from "../../mocks/products-selector";
import {Metacode} from "../../enum/enum-info";
import {IssuanceModel} from "../../interfaces/product.model";
import {ActionType, ProductStatus} from "../../constants/product";
import {NavStatus, NavType} from "../../constants/nav.constant";
import {checkUserAdmin, getRoleByScreen} from "../../utils/common";
import {FORMATDATE, RoleFunction} from "../../constants";
import { DatePicker, Upload } from "antd";
import moment from 'moment';

export default function NewProductForm(props: NavFormProps) {
  const toast = useToast();
  const {emitListHistoryNav, itemModify} = props;
  const [listProducts, setListProducts] = useState<Array<IssuanceModel>>([]);
  const [productSelected, setProductSelected] = useState<IssuanceModel>(ProductState);
  const [navUpdateParam, setNavUpdateParam] = useState<NavUpdateParam>(NavUpdateInit);
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose} = useDisclosure();
  const {isOpen: isOverrideOpen, onOpen: onOverrideOpen, onClose: onOverrideClose} = useDisclosure();
  const cancelRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const [reasonReject, setReasonReject] = useState<string>('');
  const funcAccessNU = getRoleByScreen(RoleFunction.view_nav);
  const [defaultValue, setDefaultValue] = useState<any>(moment());
  const [defaultValueDate, setDefaultValueDate] = useState<any>(moment());
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [isOverride, setIsOverride] = useState<boolean>(false);


  useEffect(() => {
    if (itemModify.type === ActionType.UPDATE) {
      setNavUpdateParam({
        nav: itemModify?.value?.nav,
        productId: itemModify?.value?.productId,
        navDate: itemModify?.value?.navDate,
      });
      const productSelected = listProducts.find(item => item.id === itemModify?.value?.productId);
      setProductSelected(productSelected || ProductState);
      if (itemModify.value?.status === NavStatus.REJECTED) {
        setIsDisable(false);
        onCreateOpen();
      } else {
        setIsDisable(true);
      }
    } else {
      if (!isLoading) {
        getListProducts();
        setDefaultValueDate(moment());
        setDefaultValue(moment());  
        emitListHistoryNav(); 
        onCreateClose();
        setIsDisable(false);
        setProductSelected(ProductState);
        setNavUpdateParam(NavUpdateInit);
      }
    }
  }, [itemModify.value, isLoading, isSubmit]);

  const getListProducts = () => {
    product.getListProducts().then(response => {
      const data = response?.data?.data;
      setListProducts(data?.rows);
    });
  }

  const selectProduct = (event: any) => {
    const {value} = event.target;
    let product = listProducts.find(product => product.id === Number(value)) || ProductState;
    setProductSelected(product);
    setNavUpdateParam({...navUpdateParam, productId: value})
  }

  const changeNav = (event: any) => {
    const {value} = event.target;
    setNavUpdateParam({...navUpdateParam, nav: value})
  }

  const toastError = (title: string) => {
    setIsLoading(false);
    toast({title: title, status: "error", position: "top-right", isClosable: true});
  }
  const toastSuccess = () => {
    setIsLoading(false); 
    onCreateClose();
    emitListHistoryNav();
    toast({title: "Success", status: "success", position: "top-right", isClosable: true});
  }

  const handleError = (err: any) => {
    if (err?.response?.status === Metacode.BAD_REQUEST || err?.response?.status === Metacode.NOT_FOUND) {
      toastError(err?.response?.data?.error?.message);
    } else {
      toastError('Error');
    }
  }

  const changeReasonReject = (event: any) => setReasonReject(event.target.value);

  const updateNAV = (event: any) => {
    event.preventDefault();
    if (itemModify.type === ActionType.UPDATE) {
      product.updateNav(itemModify.value?.id, navUpdateParam).then(response => {
        toastSuccess();
      }).catch(err => {
        handleError(err);
      })
    } else {
      product.checkNav(navUpdateParam)
        .then(response => {
          setIsLoading(true);
          product.submitNav(navUpdateParam)
            .then(response => {
              setIsSubmit(!isSubmit);
              toastSuccess();
            }).catch(err => {
              handleError(err);
            })    
        }).catch(err => {
          if (err?.response?.status === Metacode.CONFLICT) {
            onOverrideOpen();
          } else {
            handleError(err);
          }
        })
    }
  }

  const approveNav = (event: any) => {
    event.preventDefault();
    product.checkNav(navUpdateParam)
      .then(response => {
        setIsLoading(true);
        product.approveNav(itemModify.value?.id).then(response => {
          setIsOverride(false);
          onOverrideClose();
          setIsSubmit(!isSubmit);
          toastSuccess();
        }).catch(error => toastError('Error'))
      }).catch(err => {
        if (err?.response?.status === Metacode.CONFLICT) {
          onOverrideOpen();
        } else {
          handleError(err);
        }
      })
  }
  
  const createOverrideNav = (event: any) => {
    event.preventDefault();
    setIsOverride(true)
    product.submitNav(navUpdateParam)
      .then(response => {
        setIsOverride(false);
        onOverrideClose();
        setIsSubmit(!isSubmit);
        toastSuccess();
      }).catch(err => {
        setIsOverride(false);
        handleError(err);
      })    
  }

  const approveOverrideNav = (event: any) => {
    event.preventDefault();
    setIsOverride(true)
    product.approveNav(itemModify.value?.id)
      .then(response => {
        setIsOverride(false);
        onOverrideClose();
        setIsSubmit(!isSubmit);
        toastSuccess();
      }).catch(err => {
        setIsOverride(false);
        handleError(err);
      })    
  }

  const rejectNav = () => {
    setIsLoading(true);
    const params: NavRejectParams = {
      reason: reasonReject
    }
    product.rejectNav(itemModify.value?.id, params).then(response => {
      toastSuccess();
    }).catch(error => toastError('Error'))
  }

  function onChangeDate(date: any) {
    if (date) {
      setDefaultValueDate(moment(date))
      setNavUpdateParam({
        ...navUpdateParam,
        navDate : moment(date).format(FORMATDATE)
      });
    } else {
      setDefaultValueDate(moment())
      setNavUpdateParam({
        ...navUpdateParam,
        navDate : moment().format(FORMATDATE)
      });
    }
  }

  return (
    <Stack spacing={4}>
      <Box as="form" id="formSubmitNAV" method="post" onSubmit={updateNAV}>
        <FormControl id="product" isRequired isDisabled={isDisable}>
          <FormLabel fontSize="sm" textColor="blue.700">
            Fund Name
          </FormLabel>
          <Select name="product" value={navUpdateParam.productId} onChange={() => selectProduct(event)}>
            <option value=""></option>
            {listProducts.filter((product: IssuanceModel) => product.status === ProductStatus.approved).map((product: IssuanceModel) => (
              <option key={product.id} value={product?.id}>{product?.productName}</option>
            ))}
          </Select>
          <FormErrorMessage>Product is required.</FormErrorMessage>
        </FormControl>
        <FormControl id="isinCode" isDisabled mt={6}>
          <FormLabel fontSize="sm" textColor="blue.700">
            ISIN
          </FormLabel>
          <Input name="isinCode" value={productSelected?.ISINCode}/>
        </FormControl>
        <FormControl id="nav" isRequired isDisabled={isDisable} mt={6}>
          <FormLabel fontSize="sm" textColor="blue.700">
            NAV
          </FormLabel>
          <Input name="nav" value={navUpdateParam.nav} onChange={() => changeNav(event)}/>
          <FormErrorMessage>NAV is required.</FormErrorMessage>
        </FormControl>
        <FormControl mt={6} isRequired isDisabled={isDisable} isInvalid={isSubmit && !defaultValue} id="cufOffTime">
          <FormLabel fontSize="sm" textColor="blue.700">
            NAV Date
          </FormLabel>
          <DatePicker 
            value={navUpdateParam.navDate ? moment(navUpdateParam.navDate) : defaultValueDate } 
            onChange={onChangeDate} 
            disabled={isDisable} 
          />
        </FormControl>
        <FormControl id="settlementCCY" isDisabled mt={6} mb={6}>
          <FormLabel fontSize="sm" textColor="blue.700">
            Settlement CCY
          </FormLabel>
          <Input name="settlementCCY" value={productSelected?.currencyCode}/>
        </FormControl>
        {itemModify.type === ActionType.CREATE && (checkUserAdmin() || funcAccessNU?.createFlg)  &&
        <Button mr={6} colorScheme="blue" type="submit" isLoading={isLoading} form="formSubmitNAV">Submit</Button>}

        {itemModify.type === ActionType.UPDATE && itemModify.value?.status === NavStatus.REJECTED && (checkUserAdmin() || funcAccessNU?.writeFlg)  &&
        <Button colorScheme="blue" mr={6} type="submit" isLoading={isLoading} form="formSubmitNAV">Update</Button>}

        {itemModify.type === ActionType.UPDATE && itemModify.value?.status === NavStatus.PENDING && (checkUserAdmin() || funcAccessNU?.approveFlg) &&
        <>
          <Button mr={6} colorScheme="blue" isLoading={isLoading} onClick={approveNav}>Approve</Button>
          <Button mr={6} colorScheme="red" onClick={() => {
            onCreateOpen(); setReasonReject('');
          }}>Reject</Button>
        </>
        }
      </Box>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        motionPreset='slideInBottom'
        onClose={onCreateClose} isOpen={isCreateOpen} isCentered
      >
        <AlertDialogOverlay/>
        <AlertDialogContent>
          {itemModify?.value?.status === NavStatus.REJECTED ?
              <AlertDialogHeader>Reason for Rejection</AlertDialogHeader> :
              <AlertDialogHeader>Enter the reason for rejection</AlertDialogHeader>
          }
          <AlertDialogCloseButton/>
          <AlertDialogBody mb={3}>
            {itemModify?.value?.status === NavStatus.REJECTED ?
              <Textarea value={itemModify?.value?.reason} disabled/> :
              <Textarea placeholder='Reason' onChange={() => changeReasonReject(event)}/>
            }
          </AlertDialogBody>
          {itemModify?.value?.status !== NavStatus.REJECTED &&
            <AlertDialogFooter>
              <Button colorScheme='red' mr={3} disabled={!reasonReject.trim()} isLoading={isLoading} onClick={() => rejectNav()}>
                Confirm
              </Button>
              <Button onClick={onCreateClose}>
                Cancel
              </Button>
            </AlertDialogFooter>
          }
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        motionPreset='slideInBottom'
        onClose={onOverrideClose} isOpen={isOverrideOpen} isCentered
      >
        <AlertDialogOverlay/>
        <AlertDialogContent>
          <AlertDialogHeader>Warning</AlertDialogHeader>
          <AlertDialogCloseButton/>
          <AlertDialogBody mb={3}>
            {itemModify?.type === NavType.CREATE ?
              <p>Already exist NAV price for this product on date {navUpdateParam.navDate}.
              Would you like to create this request?</p> :
              <p>Already exist NAV price for this product on date {navUpdateParam.navDate}.
              Would you like to approve this request?</p>
            }
          </AlertDialogBody>
          {itemModify?.type === NavType.CREATE &&
            <AlertDialogFooter>
              <Button colorScheme='red' mr={3} isLoading={isOverride} onClick={createOverrideNav}>
                Create
              </Button>
              <Button onClick={onOverrideClose}>
                Cancel
              </Button>
            </AlertDialogFooter>
          }
          {itemModify?.type === NavType.UPDATE &&
            <AlertDialogFooter>
              <Button colorScheme='red' mr={3} isLoading={isOverride} onClick={approveOverrideNav}>
                Approve
              </Button>
              <Button onClick={onOverrideClose}>
                Cancel
              </Button>
            </AlertDialogFooter>
          }
        </AlertDialogContent>
      </AlertDialog>
    </Stack>
  );
}
