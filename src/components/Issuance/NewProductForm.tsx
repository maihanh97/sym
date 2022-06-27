import React, {useEffect, useState} from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack, Box,
  Flex,
  Button,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody, Textarea, AlertDialogFooter, Divider, useDisclosure
} from '@chakra-ui/react';
import {TimePicker, Upload, UploadProps, DatePicker} from 'antd';
import moment from 'moment';
import { AiOutlineUpload } from 'react-icons/ai';
import { listCountry } from "../../mocks/clients";
import {product, user} from "../../api";
import {NewProductFormProps, IssuanceModel, IssuanceRejectParams} from "../../interfaces/product.model";
import { ProductState, TYPE_COUNTRY_TRADE_CODE, TYPE_COUNTRY_DOMICILE_CODE} from "../../mocks/products-selector";
import { getItemLocalStorage } from "../../hooks";
import { ENV } from '../../config/env';
import {ACCESS_TOKEN, FORMATDATE, HH_MM_SS, REGEX_STRING_INPUT, RoleFunction} from "../../constants";
import {ActionType, ProductStatus} from "../../constants/product";
import {checkUserAdmin, getRoleByScreen} from "../../utils/common";

export default function NewProductForm(props: NewProductFormProps) {
  const toast = useToast();
  const {checkIsCreateDone, typeModify, itemModify, isModify} = props;
  const [productParam, setProductParam] = useState<IssuanceModel>(ProductState);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [isDisableBtn, setIsDisableBtn] = useState<boolean>(false);
  const [defaultValue, setDefaultValue] = useState<any>(moment());
  const [defaultValueDate, setDefaultValueDate] = useState<any>(moment());
  const [isUpdateProduct, setIsUpdateProduct] = useState<boolean>(true);
  const [isCreateProduct, setIsCreateProduct] = useState<boolean>(true);
  const [permissionApprove, setPermissionApprove] = useState<boolean>(false);
  const {isOpen, onOpen, onClose} = useDisclosure();
  const cancelRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const [reasonReject, setReasonReject] = useState<string>('');
  const funcAccessIS = getRoleByScreen(RoleFunction.view_issuance);
  const isAdmin = checkUserAdmin();
  const fileTypeAccept = "application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  const propsUploadFile: UploadProps = {
    name: 'file',
    action: `${ENV.BASE_URL}/api/products/upload`,
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
        toastSuccess('File uploaded successfully');
        setProductParam({...productParam, files: [...productParam.files, file.response.data.Location]})
      } else if (file.status === 'error') {
        toastError('File upload failed');
      }
    },
    progress: {
      strokeColor: { '0%': '#108ee9', '100%': '#87d068' },
      format: (percent: any) => `${parseFloat(percent.toFixed(2))}%`
    }
  }

  useEffect(() => {
    if (typeModify === ActionType.UPDATE) {
      switch (itemModify.status) {
        case ProductStatus.pending:
          setPermissionApprove(funcAccessIS?.approveFlg || isAdmin);
          setIsUpdateProduct(false);
          setIsCreateProduct(false);
          break;
        case ProductStatus.approved:
          setIsUpdateProduct(false);
          setIsCreateProduct(false);
          setPermissionApprove(false);
          break;
        case ProductStatus.rejected:
          setPermissionApprove(false);
          setIsUpdateProduct(funcAccessIS?.writeFlg || isAdmin);
          setIsCreateProduct(false);
          onOpen();
          break;
      }
      setProductParam(itemModify);
    } else {
      setProductParam(ProductState);
      setDefaultValueDate(moment());
      setDefaultValue(moment());
      setIsUpdateProduct(funcAccessIS?.createFlg || isAdmin);
      setIsCreateProduct(funcAccessIS?.createFlg || isAdmin);
      setPermissionApprove(funcAccessIS?.approveFlg || isAdmin);
      setIsDisableBtn(false);
      onClose();
    }
  }, [isSubmit, isModify])

  const createNewProduct = (e: any) => {
    e.preventDefault();

    let validateString = [];
    validateString.push(handleErrorInput(productParam?.productName, 'Fund Name'))
    validateString.push(handleErrorInput(productParam?.class, "Class"))
    if (!validateString.every(Boolean)) return;

    setIsDisableBtn(true);
    if (typeModify === ActionType.UPDATE) {
      product.updateProduct(productParam.id as number, productParam).then(() => {
        checkIsCreateDone(); setIsSubmit(!isSubmit);
        toastSuccess("Updated");
      }).catch(err => {
        toastError("Error");
        setIsDisableBtn(false);
      });
    } else {
      product.createNewProduct(productParam).then(resp => {
        checkIsCreateDone(); setIsSubmit(!isSubmit);
        toastSuccess("Success");
      }).catch(err => {
        toastError("Error");
        setIsDisableBtn(false);
      });
    }
  }
  const onChangeValue = (event: any) => {
    let countrySelected;
    const {name, value} = event.target;
    switch (name) {
      case TYPE_COUNTRY_TRADE_CODE:
        countrySelected = listCountry.find(item => item.code === value);
        setProductParam({
          ...productParam,
          countryTradeCd: countrySelected?.code || '',
          countryTradeName: countrySelected?.value || ''
        });
        break;
      case TYPE_COUNTRY_DOMICILE_CODE:
        countrySelected = listCountry.find(item => item.code === value);
        setProductParam({
          ...productParam,
          countryDomicileCd: countrySelected?.code || '',
          countryDomicileName: countrySelected?.value || ''
        })
        break;
      default:
        setProductParam({
          ...productParam,
          [`${name}`] : value
        });
        break;
    }
  }

  const changeReasonReject = (event: any) => setReasonReject(event.target.value);

  const approveProduct = (item: IssuanceModel) => {
    setIsDisableBtn(true);
    product.approveProduct(item.id as number).then(() => {
      checkIsCreateDone(); setIsSubmit(!isSubmit);
      toastSuccess('Success');
    }).catch(error => {
      setIsDisableBtn(false);
      toastError("Error");
    })
  }

  const rejectProduct = (item: IssuanceModel) => {
    const params: IssuanceRejectParams = {
      reason: reasonReject
    }
    product.rejectProduct(item.id as number, params).then(() => {
      checkIsCreateDone(); onClose();
      setIsSubmit(!isSubmit);
      toastSuccess('Success');
    }).catch(error => {
      toastError("Error");
    })
  }

  const onChange = (time: any) => {
    if (time) {
      setDefaultValue(moment(time))
      setProductParam({
        ...productParam,
        cufOffTime: moment(time).format(HH_MM_SS)
      });
    } else {
      setDefaultValue(moment())
      setProductParam({
        ...productParam,
        cufOffTime: moment().format(HH_MM_SS)
      });
    }

  }

  function onChangeDate(date: any) {
    if (date) {
      setDefaultValueDate(moment(date))
      setProductParam({
        ...productParam,
        inceptionDate : moment(date).format(FORMATDATE)
      });
    } else {
      setDefaultValueDate(moment())
      setProductParam({
        ...productParam,
        inceptionDate : moment().format(FORMATDATE)
      });
    }
  }
  
  const pickCurrenthDate = (date: any) => {
    let customDate = moment().format(FORMATDATE);
    return date && date < moment(customDate, FORMATDATE);
  }

  const toastSuccess = (title: string) => {
    toast({title: title, status: "success", position: "top-right", isClosable: true});
  }

  const toastError = (title: string) => {
    toast({title: title, status: "error", position: "top-right", isClosable: true});
  }

  const handleErrorInput = (value: string, fieldName: string) => {
    const testStringInput = REGEX_STRING_INPUT.test(value)
    if (!testStringInput) {
      toast({title: fieldName + ' is invalid', status: "error", position: "top-right", isClosable: true});
      return false;
    }
    return true
  }

  return (
    <Stack spacing={4} backgroundColor={"white"} borderRadius={"md"} p="4">
      <Box id="newProductForm" as="form" method="post" onSubmit={createNewProduct}>
        <FormControl mb={4} isDisabled={!isUpdateProduct} isRequired id="productType">
          <FormLabel fontSize="sm" textColor="blue.700">
            Fund Type
          </FormLabel>
          <Select name="productType" value={productParam.productType} onChange={() => onChangeValue(event)}>
            <option value=""></option>
            <option value="REITS">REITS</option>
            <option value="MONEY MARKET">MONEY MARKET</option>
            <option value="ETF">ETF</option>
          </Select>
        </FormControl>
        <FormControl mb={4} isDisabled={!isUpdateProduct} isRequired id="productName">
          <FormLabel fontSize="sm" textColor="blue.700">
            Fund Name
          </FormLabel>
          <Input name="productName" value={productParam.productName} onChange={() => onChangeValue(event)}/>
        </FormControl>
        <FormControl mb={4} isDisabled={!isUpdateProduct} id="umbrellaFund">
          <FormLabel fontSize="sm" textColor="blue.700">
            Umbrella Fund / VCC Name (if applicable)
          </FormLabel>
          <Input name="umbrellaFund" value={productParam.umbrellaFund} onChange={() => onChangeValue(event)}/>
        </FormControl>
        <FormControl mb={4} isDisabled={!isUpdateProduct} id="class">
          <FormLabel fontSize="sm" textColor="blue.700">
            Class (if applicable)
          </FormLabel>
          <Input name="class" value={productParam.class} onChange={() => onChangeValue(event)}/>
        </FormControl>
        <FormControl mb={4} isDisabled={!isUpdateProduct} isRequired id="ISINCode">
          <FormLabel fontSize="sm" textColor="blue.700">
            ISIN Code
          </FormLabel>
          <Input name="ISINCode" value={productParam.ISINCode} onChange={() => onChangeValue(event)}/>
        </FormControl>
        <FormControl mb={4} isDisabled={!isUpdateProduct} isRequired id="transferAgentCode">
          <FormLabel fontSize="sm" textColor="blue.700">
            Transfer Agent Code
          </FormLabel>
          <Input name="transferAgentCode" value={productParam.transferAgentCode} onChange={() => onChangeValue(event)}/>
        </FormControl>
        <FormControl mb={4} isDisabled={!isUpdateProduct} isRequired id="tickerCode">
          <FormLabel fontSize="sm" textColor="blue.700">
            Ticker Code
          </FormLabel>
          <Input name="tickerCode" value={productParam.tickerCode} onChange={() => onChangeValue(event)}/>
        </FormControl>
        <FormControl mb={4} isDisabled={!isUpdateProduct} isRequired id="countryDomicileCd">
          <FormLabel fontSize="sm" textColor="blue.700">
            Domicile
          </FormLabel>
          <Select name="countryDomicileCd" value={productParam.countryDomicileCd} onChange={() => onChangeValue(event)}>
            {listCountry.map(item => (
              <option key={item.code} value={item.code}>{item.value}</option>
            ))}
          </Select>
        </FormControl>
        <FormControl mb={4} isDisabled={!isUpdateProduct} isInvalid={isSubmit && !defaultValue} isRequired id="cufOffTime">
          <FormLabel fontSize="sm" textColor="blue.700">
            Launch Date
          </FormLabel>
          <DatePicker 
            value={productParam.inceptionDate ? moment(productParam.inceptionDate) : defaultValueDate } 
            onChange={onChangeDate} 
            disabled={!isUpdateProduct} 
            disabledDate={pickCurrenthDate}
          />
        </FormControl>
        <FormControl mb={4} isDisabled={!isUpdateProduct} isRequired id="currencyCode">
          <FormLabel fontSize="sm" textColor="blue.700">
            Currency Denomination
          </FormLabel>
          <Select name="currencyCode" value={productParam.currencyCode} onChange={() => onChangeValue(event)}>
            <option value=""></option>
            <option value="SGD">SGD</option>
            <option value="HKD">HKD</option>
            <option value="USD">USD</option>
          </Select>
        </FormControl>
        <FormControl mb={4} isDisabled={!isUpdateProduct} isRequired id="launchPrice">
          <FormLabel fontSize="sm" textColor="blue.700">
            Launch Price (Per Unit/Share)
          </FormLabel>
          <Input name="launchPrice" value={productParam.launchPrice} onChange={() => onChangeValue(event)}/>
        </FormControl>
        <FormControl mb={4} isDisabled={!isUpdateProduct} isRequired id="qtyMax">
          <FormLabel fontSize="sm" textColor="blue.700">
            Number of Units/Shares (On Inception)
          </FormLabel>
          <Input name="qtyMax" value={productParam.qtyMax} onChange={() => onChangeValue(event)}/>
        </FormControl>
        <FormControl mb={4} isDisabled={!isUpdateProduct} isRequired id="countryTradeCd">
          <FormLabel fontSize="sm" textColor="blue.700">
            Customer Eligibility
          </FormLabel>
          <Select name="countryTradeCd" value={productParam.countryTradeCd} onChange={() => onChangeValue(event)}>
            {listCountry.map(item => (
              <option key={item.code} value={item.code}>{item.value}</option>
            ))}
          </Select>
        </FormControl>
        <FormControl mb={4} isDisabled={!isUpdateProduct} mt={10} id="trustee">
          <FormLabel fontSize="sm" textColor="blue.700" mb={4}>
            Service Providers (if applicable)
          </FormLabel>
        </FormControl>
        <Divider/>
        <FormControl mb={4} isDisabled={!isUpdateProduct} mt={4} id="trustee">
          <FormLabel fontSize="sm" textColor="blue.700">
            Trustee
          </FormLabel>
          <Input name="trustee" value={productParam.trustee} onChange={() => onChangeValue(event)}/>
        </FormControl>
        <FormControl mb={4} isDisabled={!isUpdateProduct} id="fundAdmin">
          <FormLabel fontSize="sm" textColor="blue.700">
            Fund Administrator
          </FormLabel>
          <Input name="fundAdmin" value={productParam.fundAdmin} onChange={() => onChangeValue(event)}/>
        </FormControl>
        <FormControl mb={4} isDisabled={!isUpdateProduct} id="transferAgent">
          <FormLabel fontSize="sm" textColor="blue.700">
            Transfer Agent
          </FormLabel>
          <Input name="transferAgent" value={productParam.transferAgent} onChange={() => onChangeValue(event)}/>
        </FormControl>
        <FormControl mb={4} isDisabled={!isUpdateProduct} id="custodian">
          <FormLabel fontSize="sm" textColor="blue.700">
            Custodian
          </FormLabel>
          <Input name="custodian" value={productParam.custodian} onChange={() => onChangeValue(event)}/>
        </FormControl>
        <FormControl mb={4} isDisabled={!isUpdateProduct} id="auditor">
          <FormLabel fontSize="sm" textColor="blue.700">
            Auditor
          </FormLabel>
          <Input name="auditor" value={productParam.auditor} onChange={() => onChangeValue(event)}/>
        </FormControl>
        <FormControl mb={4} isDisabled={!isUpdateProduct} id="taxAgent">
          <FormLabel fontSize="sm" textColor="blue.700">
            Tax Agent
          </FormLabel>
          <Input name="taxAgent" value={productParam.taxAgent} onChange={() => onChangeValue(event)}/>
        </FormControl>
        <Divider/>

        <FormControl id="documents" mb={4} mt={6} isDisabled={!isUpdateProduct}>
          <FormLabel fontSize="sm" textColor="blue.700">
            View Documents
          </FormLabel>
          <Stack spacing={6}>
            <Upload accept={fileTypeAccept} {...propsUploadFile} disabled={!isUpdateProduct}>
              <Button leftIcon={<AiOutlineUpload/>}>Prospectus / Product Placement Memorandum</Button>
            </Upload>
            <Upload accept={fileTypeAccept} {...propsUploadFile}  disabled={!isUpdateProduct}>
              <Button leftIcon={<AiOutlineUpload/>}>Fund Factsheet</Button>
            </Upload>
            <Upload accept={fileTypeAccept} {...propsUploadFile}  disabled={!isUpdateProduct}>
              <Button leftIcon={<AiOutlineUpload/>}>
                Product Highlight Sheet
              </Button>
            </Upload>
          </Stack>
        </FormControl>
        <FormControl mb={4} isDisabled={!isUpdateProduct} isRequired id="cufOffTime">
          <FormLabel fontSize="sm" textColor="blue.700">
            Transaction Cut-Off Time(T)
          </FormLabel>
          <TimePicker value={defaultValue} onChange={onChange} disabled={!isUpdateProduct}/>
        </FormControl>
      </Box>
      <Flex>
        {(isAdmin || isCreateProduct) && typeModify === ActionType.CREATE &&
          <Button colorScheme="blue" type="submit"
                  isLoading={isDisableBtn} form="newProductForm">
            Submit
          </Button>
        }
        {(isAdmin || isUpdateProduct) && typeModify === ActionType.UPDATE && itemModify.status === ProductStatus.rejected &&
          <Button colorScheme="blue" type="submit"
                  isLoading={isDisableBtn} form="newProductForm">
            Update
          </Button>}
        {(isAdmin || isUpdateProduct || isCreateProduct) && typeModify === ActionType.UPDATE && itemModify.status === ProductStatus.rejected &&
          <Button type="submit" ml={6} onClick={() => checkIsCreateDone()}>Cancel</Button>}

        {(isAdmin || permissionApprove) && typeModify === ActionType.UPDATE && itemModify.status === ProductStatus.pending &&
          <Button colorScheme="blue" type="submit"
                  isLoading={isDisableBtn} mr={6} onClick={() => approveProduct(itemModify)}> Approve
          </Button>}

        {(isAdmin || permissionApprove) && typeModify === ActionType.UPDATE && itemModify.status === ProductStatus.pending &&
        <Button colorScheme="red" onClick={() => {
          onOpen(); setReasonReject('');
        }}> Reject</Button>}
      </Flex>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        motionPreset='slideInBottom'
        onClose={onClose} isOpen={isOpen} isCentered
      >
        <AlertDialogOverlay/>
        <AlertDialogContent>
          {itemModify.status !== ProductStatus.rejected ?
              <AlertDialogHeader>Enter the reason for rejection</AlertDialogHeader> :
              <AlertDialogHeader>Reason for Rejection</AlertDialogHeader>
          }
          <AlertDialogCloseButton/>
          <AlertDialogBody mb={4}>
            {itemModify.status === ProductStatus.rejected ?
              <Textarea placeholder='Reason' disabled value={itemModify?.reason}/> :
              <Textarea placeholder='Reason' onChange={() => changeReasonReject(event)}/>
            }
          </AlertDialogBody>
          {itemModify.status !== ProductStatus.rejected ?
            <AlertDialogFooter>
              <Button colorScheme='red' mr={3} disabled={!reasonReject.trim()} onClick={() => rejectProduct(itemModify)}>
                Submit
              </Button>
              <Button onClick={onClose}>
                Cancel
              </Button>
            </AlertDialogFooter> : ''
          }
        </AlertDialogContent>
      </AlertDialog>
    </Stack>
  );
}
