import {Box, Button, Table, Tbody, Td, Text, Tfoot, Th, Thead, Tr} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {HeaderHolderList, TAB_HOLDER_LIST} from "../../constants/product";
import {IHolderList, IHolderListProps} from "../../interfaces/product.model";
import {product} from "../../api";
import moment from "moment";
import {FILE_FORMATDATE} from "../../constants";
import {CSVLink} from "react-csv";
import {ResponsiveTable} from "../../components/index";

const HoldersListTable = (props: IHolderListProps) => {
    const {tabSelected, id} = props;
    const [holdersList, setHoldersList] = useState<IHolderList[]>([]);
    const date = moment().format(FILE_FORMATDATE);
    const fileName = `holder_list_${date}.csv`;

    useEffect(() => {
        if (tabSelected === TAB_HOLDER_LIST) {
            product.getHolderList(id).then(response => {
                const data = response.data?.data;
                data?.sort((a: IHolderList, b: IHolderList) => parseInt(b.unit) - parseInt(a.unit));
                setHoldersList(data);
            }).catch(error => console.error(error))
        }
    }, [tabSelected])

    const getPercentageHolding = (percentHolding: number) => {
        return percentHolding.toFixed(2);
    }

    return (
        <Box>
            <Text mb={3}>Top {holdersList.length} holders (Total of {holdersList.length} Holders)</Text>
            <ResponsiveTable>
                <Thead position="sticky" top={0} bgColor="white">
                    <Tr>
                        {HeaderHolderList.map(item => (
                            <Th>{item.label}</Th>
                        ))}
                    </Tr>
                </Thead>
                <Tbody>
                    {holdersList.map(item => (
                        <Tr>
                            <Td>{item?.walletAddress}</Td>
                            <Td>{item?.clientName}</Td>
                            <Td>{item?.unit}</Td>
                            <Td>{getPercentageHolding(item?.percentHolding)}</Td>
                            <Td>{item?.navHolding}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </ResponsiveTable>
            <Box textAlign={"right"}>
                <CSVLink data={holdersList} headers={HeaderHolderList} filename={fileName}>
                    <Button colorScheme={"blue"} mr={5}>Export CSV</Button>
                </CSVLink>
            </Box>
        </Box>
    );
}

export default HoldersListTable;