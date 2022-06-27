import {
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    FormControl,
    FormLabel,
    Input,
    Box,
    Stack,
    Heading,
    Button,
    Select,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent,
    Textarea,
    AlertDialogFooter,
    FormErrorMessage,
    useToast,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { user } from "../../api";
import {AccountStatus, REGEX_STRING_INPUT, RoleFunction} from "../../constants";
import { Metacode } from "../../enum/enum-info";
import { IListClientContant } from "../../interfaces/client.model";
import { IClientInfoProps } from "../../interfaces/props.model";
import { RejectClientParams } from "../../interfaces/user.model";
import { listAccountType, listCash, listCountry, listToken } from "../../mocks/clients";
import { getStatusUpdateApi } from '../../redux/actions/client'
import {checkUserAdmin, getRoleByScreen} from "../../utils/common";

function ClientInfo({ onClose, isOpen, clientInfo, update }: IClientInfoProps) {
    const toast = useToast();
    const cancelRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;
    const dispatch = useDispatch();
    const [isRejected, setIsRejected] = useState(false);
    const [reasonMsg, setReasonMsg] = useState('');
    const [isDisable, setIsDisable] = useState(false);
    const [updateReject, setUpdateReject] = useState(false);
    const [isloading, setIsloading] = useState(false)
    const [accountId, setAccountId] = useState('');
    const [fullName, setFullname] = useState('');
    const [accountType, setAccountType] = useState('');
    const [countryCd, setCountryCd] = useState('');
    const [bankAccountName, setBankAccountName] = useState('');
    const [bankAccountNumber, setBankAccountNumber] = useState('');
    const [tokenTPlus, setTokenTPlus] = useState('');
    const [cashTPlus, setCashTPlus] = useState('');
    const funcAccessCM = getRoleByScreen(RoleFunction.view_client);
    const userInfo = user.getInfoUser();

    useEffect(() => {
        if (clientInfo.status === AccountStatus.REJECTED) {
            setIsDisable(clientInfo.createUid === userInfo.id || checkUserAdmin());
            setUpdateReject(true);
            if (clientInfo) {
                setAccountId(clientInfo.accountId);
                setFullname(clientInfo.fullName);
                setAccountType(clientInfo.accountType);
                setCountryCd(clientInfo.countryCd);
                setBankAccountName(clientInfo.bankAccountName);
                setBankAccountNumber(clientInfo.bankAccountNumber);
                setTokenTPlus(clientInfo.tokenTPlus);
                setCashTPlus(clientInfo.cashTPlus);
            }
        } else {
            setUpdateReject(false);
            setIsDisable(false);
            setIsloading(false);
        }
    }, [clientInfo])


    const handleApprove = (id: number) => {
        user.approveClient(id).then(() => {
            toast({ title: "Success", status: "success", position: "top-right", isClosable: true });
            dispatch(getStatusUpdateApi());
            onClose();
        })
            .catch(error => {
                toast({ title: 'Error', status: "error", position: "top-right", isClosable: true });
            });
            setIsloading(true)
    }

    const handleSubmitReJected = () => {
        const reason = reasonMsg;
        const param: RejectClientParams = { reason };
        user.rejectClient(clientInfo.id, param).then(() => {
            toast({ title: "Success", status: "success", position: "top-right", isClosable: true });
            dispatch(getStatusUpdateApi());
        })
            .catch(error => {
                toast({ title: 'Error', status: "error", position: "top-right", isClosable: true });
            });
        setReasonMsg('');
        setIsRejected(false);
        onClose();
    }

    const handleUpdateRejected = (e: any) => {
        e.preventDefault();
        const param = {
            accountId,
            fullName,
            accountType,
            countryCd,
            bankAccountName,
            bankAccountNumber,
            tokenTPlus,
            cashTPlus,
        }
        
        const testStringInput = REGEX_STRING_INPUT.test(param.fullName)
        if (!testStringInput) {
          toast({title: 'Full Name is invalid', status: "error", position: "top-right", isClosable: true});
          return;
        }   
         
        user.updateRejectClient(clientInfo.id.toString(), param).then(() => {
            toast({ title: "Success", status: "success", position: "top-right", isClosable: true });
            dispatch(getStatusUpdateApi());
            onClose();
        }).catch(err => {
            if (err?.response?.status === Metacode.CONFLICT) {
                toast({title: err?.response?.data?.error?.message, status: "error", position: "top-right", isClosable: true});
            } else {
                toast({title: 'Error', status: "error", position: "top-right", isClosable: true});
            }
        });
    }

    const _renderAlertReasonRejected = () => (
        (isRejected || updateReject) && <AlertDialog
            leastDestructiveRef={cancelRef}
            motionPreset='slideInBottom'
            onClose={() => {
                setUpdateReject(false);
                setIsRejected(false);
            }} isOpen={true} isCentered
        >
            <AlertDialogOverlay />
            <AlertDialogContent>
                {updateReject ?
                    <AlertDialogHeader>Reason for Rejection</AlertDialogHeader> :
                    <AlertDialogHeader>Enter the reason for rejection</AlertDialogHeader>
                }
                <AlertDialogCloseButton />
                <AlertDialogBody>
                    {updateReject ? <Textarea placeholder='Reason' value={clientInfo.reason} disabled={true} />
                        : <Textarea placeholder='Reason' onChange={(e) => setReasonMsg(e.target.value)} />
                    }
                </AlertDialogBody>
                {clientInfo.status !== AccountStatus.REJECTED && <AlertDialogFooter>
                    <Button disabled={!reasonMsg.trim()} colorScheme='red' mr={3} onClick={handleSubmitReJected}>
                        Confirm
                    </Button>
                    <Button onClick={() => setIsRejected(false)}>
                        Cancel
                    </Button>
                </AlertDialogFooter>}
            </AlertDialogContent>
        </AlertDialog>
    )

    const _renderFormControl = (title: string, className: string, defaultValue: string | number, setValue: (item: string) => void) => (
        <FormControl isDisabled={!isDisable} className={className} isRequired>
            <FormLabel fontSize="sm" textColor="blue.700">
                {title}
            </FormLabel>
            <Input name={className} defaultValue={defaultValue} onChange={(e) => setValue(e.target.value)} />
            <FormErrorMessage>{`${title} is required.`}</FormErrorMessage>
        </FormControl>
    )

    const getNameOption = (listData: IListClientContant[], clientItem: string) => {
        const tilte = listData.find((item: IListClientContant) => item.code === clientItem)?.value;
        return <option value={clientItem}>{tilte}</option>
    }

    const _renderOptionInput = (listData: IListClientContant[], clientItem: string) => {
        const listdataFiter = listData.filter((item: IListClientContant) => item.code !== clientItem && item.code !== '');
        return listdataFiter.map((item: IListClientContant) => <option value={item.code} key={item.code}>{item.value}</option>)
    }

    const _renderSelectInput = (title: string, className: string, listData: IListClientContant[], clientItem: string, setValue: (item: string) => void) => {
        return <FormControl className={className} isRequired>
        <FormLabel fontSize="sm" textColor="blue.700">
          {title}
        </FormLabel>
        <Select name={className} isDisabled={!isDisable} onChange={(e) => setValue(e.target.value)}>
            {getNameOption(listData, clientItem)}
            {_renderOptionInput(listData, clientItem)}
        </Select>
      </FormControl>
    }

    const _renderBodyForm = () => (
        <DrawerBody pt={8}>
            <Box id="newclientForm" as="form" method="post" onSubmit={handleUpdateRejected}>
                <Heading color="blue.800" fontSize="lg" mb={6}>
                    Account Information
                </Heading>
                <Stack spacing={4}>
                    {_renderFormControl('Account ID', 'accountId', clientInfo.accountId, setAccountId)}
                    {_renderFormControl('Full Name', 'fullName', clientInfo.fullName, setFullname)}
                    {_renderSelectInput('Account Type', 'accountType', listAccountType, clientInfo.accountType, setAccountType)}
                    {_renderSelectInput('Nationality', 'countryCd', listCountry, clientInfo.countryCd, setCountryCd)}
                    {_renderFormControl('Bank Details - Account Name', 'bankAccountName', clientInfo.bankAccountName, setBankAccountName)}
                    {_renderFormControl('Bank Details - Account Number', 'bankAccountNumber', clientInfo.bankAccountNumber, setBankAccountNumber)}
                </Stack>

                <Heading color="blue.800" fontSize="lg" mb={6} mt={12}>
                    Settlement Instructions
                </Heading>
                <Stack spacing={4}>
                    {_renderSelectInput('Settlement Cut-Off Time (Tokens)', 'tokenTPlus', listToken, clientInfo.tokenTPlus, setTokenTPlus)}
                    {_renderSelectInput('Settlement Cut-Off Time (Cash)', 'cashTPlus', listCash, clientInfo.cashTPlus, setCashTPlus )}
                </Stack>
            </Box>
        </DrawerBody>
    )

    const _renderFooterForm = () => (
        <DrawerFooter justifyContent="space-around">
            {clientInfo.status === AccountStatus.PENDING && (checkUserAdmin() || funcAccessCM?.approveFlg) && <>
                <Button isLoading={isloading} colorScheme="blue" onClick={() => handleApprove(clientInfo.id)}>Approve</Button>
                <Button colorScheme="red" onClick={() => {
                    setIsRejected(true);
                    setReasonMsg('');
                }}> Reject</Button>
            </>}

            {clientInfo.status === AccountStatus.REJECTED && (checkUserAdmin() || (funcAccessCM?.writeFlg && clientInfo.createUid === userInfo.id)) &&
            <Button colorScheme="blue" isFullWidth type="submit" form="newclientForm">Submit</Button>}
        </DrawerFooter>
    )

    return (
        <>
            {_renderAlertReasonRejected()}
            <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">{clientInfo.status === AccountStatus.REJECTED ? 'Modify Client Infor' : 'New Client Request'}</DrawerHeader>
                    {_renderBodyForm()}
                    {_renderFooterForm()}
                </DrawerContent>
            </Drawer>
        </>
    );
}

export default ClientInfo;
