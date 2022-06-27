import React, {useEffect, useState} from "react";
import {
  Box, 
  Button, 
  Flex, 
  IconButton, 
  Input, 
  NumberDecrementStepper, 
  NumberIncrementStepper, 
  NumberInput, 
  NumberInputField, 
  NumberInputStepper, 
  Select, 
  Tbody, 
  Td, 
  Text, 
  Th, 
  Thead, 
  Tooltip, 
  Tr, useToast
} from "@chakra-ui/react";
import { 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon 
} from "@chakra-ui/icons";
import moment from "moment";
import { CSVLink } from "react-csv";
import {ResponsiveTable} from "../../components/index";
import {NavHistory, NavTableProps} from "../../interfaces/user.model";
import {ACCESS_TOKEN, FILE_FORMATDATE, PAGE_COUNT_SELECTION, RoleFunction} from "../../constants";
import { HeadersNavStatus } from "../../mocks/nav.mocks";
import {checkUserAdmin, getRoleByScreen} from "../../utils/common";
import {Upload, UploadProps} from "antd";
import {ENV} from "../../config/env";
import {getItemLocalStorage} from "../../hooks";
import {Metacode} from "../../enum/enum-info";

const navStatusHeaders = HeadersNavStatus;

function ProductsTable(props: NavTableProps) {
  const [keyword, setKeyword] = useState<string>('');
  const [lisHistory, setListHistory] = useState<NavHistory[]>([]);
  const {listNavHistory, modifyNav, emitListHistoryNav} = props;

  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [canPreviousPage, setCanPreviousPage] = useState(false)
  const [canNextPage, setCanNextPage] = useState(true)
  const [pageCount, setPageCount] = useState(1)
  const [pageHistory, setPageHistory] = useState<NavHistory[]>([])
  const funcAccessNU = getRoleByScreen(RoleFunction.view_nav);
  const fileTypeAccept = 'text/csv';
  const toast = useToast();

  useEffect(() => {
    let listFilter = listNavHistory.filter((nav: NavHistory) => {
      return nav.productName.toLowerCase().includes(keyword.toLowerCase()) ||
        nav.productId.toString().includes(keyword.toLowerCase()) ||
        nav.ISINCode.toLowerCase().includes(keyword.toLowerCase()) ||
        nav.status.toLowerCase().includes(keyword.toLowerCase())
    });
    setListHistory(listFilter);
  }, [...listNavHistory, keyword]);

  useEffect(() => {
    setCanPreviousPage(!!pageIndex);
  }, [pageIndex]);

  useEffect(() => {
    setCanNextPage(pageIndex !== pageCount - 1);
  }, [pageIndex, pageCount]);

  useEffect(() => {
    setPageCount(Math.ceil(lisHistory.length / pageSize));
  }, [pageSize, lisHistory]);

  useEffect(() => {
    const listNAVHistory = [...lisHistory]
    let pagiListNAVHistory = []
    let startIndex = pageIndex * pageSize
    let endIndex = pageIndex === Math.floor(lisHistory.length / pageSize) || listNAVHistory.length <= +pageSize ? listNAVHistory.length : (pageIndex + 1) * pageSize
    for (let i = startIndex; i < endIndex; i++) {
      pagiListNAVHistory.push(listNAVHistory[i])
    }
    setPageHistory(pagiListNAVHistory)
  }, [pageSize, lisHistory, pageIndex]);

  const gotoPage = (pageIndex: number) => {
    setPageIndex(pageIndex)
  }

  const modifyNAV = (nav: NavHistory) => modifyNav(nav);
  const date = moment().format(FILE_FORMATDATE);
  const fileName = `nav_status_${date}.csv`;

  const propsUploadFile: UploadProps = {
    name: 'file',
    action: `${ENV.BASE_URL}/api/products/import/nav`,
    headers: {
      authorization: `Bearer ${getItemLocalStorage(ACCESS_TOKEN)}`,
    },
    beforeUpload: file => {
      if (!file.type || fileTypeAccept !== file.type) {
        toastError("File not support");
        return Upload.LIST_IGNORE;
      }
    },
    onChange({ file }: any) {
      if (file.status === 'done') {
        emitListHistoryNav();
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

  const toastError = (title: string) => {
    toast({title: title, status: "error", position: "top-right", isClosable: true});
  }

  return (
    <>
      <Box mb={4}>
        <Text>Total of {lisHistory.length} NAV requests listed</Text>
        <Text>Displaying the latest {pageSize} NAV requests.</Text>
      </Box>
      <Input maxW="sm" placeholder="Search by Product"
        size="sm" mb={6} value={keyword} 
        onChange={(e) => {
          setKeyword(e.target.value);
          gotoPage(0);
        }}
      />
      <ResponsiveTable>
        <Thead position="sticky" top={0} bgColor="white">
          <Tr>
            {navStatusHeaders.map(item => <Th key={item.key}>{item.label}</Th>)}
          </Tr>
        </Thead>
        <Tbody>
          {
            pageHistory?.map((nav: NavHistory) => (
              <Tr key={nav?.id} onClick={() => modifyNAV(nav)}>
                <Td className="fund_name">{nav?.productName}</Td>
                <Td>{nav?.writeDate}</Td>
                <Td>{nav?.ISINCode}</Td>
                <Td>{nav?.nav}</Td>
                <Td>{nav?.status}</Td>
              </Tr>
            ))
          }
        </Tbody>
      </ResponsiveTable>

      <Flex justifyContent="space-between" m={4} alignItems="center">
        <Flex>
          <Tooltip label="First Page">
            <IconButton
              aria-label="First Page"
              onClick={() => gotoPage(0)}
              isDisabled={!canPreviousPage}
              icon={<ArrowLeftIcon h={3} w={3} />}
              mr={4}
            />
          </Tooltip>
          <Tooltip label="Previous Page">
            <IconButton
              aria-label="Previous Page"
              onClick={() => setPageIndex(pageIndex => pageIndex -1)}
              isDisabled={!canPreviousPage}
              icon={<ChevronLeftIcon h={6} w={6} />}
            />
          </Tooltip>
        </Flex>

        <Flex alignItems="center">
          <Text mr={8}>
            Page{" "}
            <Text fontWeight="bold" as="span">
              {pageIndex + 1}
            </Text>{" "}
            of{" "}
            <Text fontWeight="bold" as="span">
              {pageCount}
            </Text>
          </Text>
          <Text>Go to page:</Text>{" "}
          <NumberInput
            ml={2}
            mr={8}
            w={28}
            min={1}
            max={pageCount}
            onChange={(value) => {
              const page = value ? +value - 1 : 0;
              if (+value > 0 && +value <= pageCount) {
                gotoPage(page);
              }
            }}
            defaultValue={pageIndex + 1}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Select
            w={32}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              gotoPage(0);
            }}
          >
            {PAGE_COUNT_SELECTION.map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
        </Flex>

        <Flex>
          <Tooltip label="Next Page">
            <IconButton
              aria-label="Next Page"
              onClick={() => setPageIndex(pageIndex => pageIndex + 1)}
              isDisabled={!canNextPage}
              icon={<ChevronRightIcon h={6} w={6} />}
            />
          </Tooltip>
          <Tooltip label="Last Page">
            <IconButton
              aria-label="Last Page"
              onClick={() => gotoPage(pageCount - 1)}
              isDisabled={!canNextPage}
              icon={<ArrowRightIcon h={3} w={3} />}
              ml={4}
            />
          </Tooltip>
        </Flex>
      </Flex>

      <Flex justifyContent="end" textAlign={"right"} mt={6}>
        {(checkUserAdmin() || funcAccessNU?.importFlg) && <Upload {...propsUploadFile} accept={fileTypeAccept}>
          <Button>Import CSV</Button>
        </Upload>}

        <CSVLink data={lisHistory} headers={navStatusHeaders} filename={fileName}>
          <Button colorScheme={"blue"} ml={5}>Export CSV</Button>
        </CSVLink>
      </Flex>
    </>
  );
}

export default ProductsTable;
