import React, {useEffect, useState} from "react";
import {DataTable} from "../../components/index";
import {auditlog} from "../../api";
import momentTimeZone from "moment-timezone";
import {AccountType, FORMATDATE_HH_MM_SS, myTimezone} from "../../constants";
import {AuditlogModel} from "../../interfaces/auditlog.model";
import {Box, Heading, Input, Flex} from "@chakra-ui/react";

function AuditLogTable() {
  const columns = [
    {
      Header: "USER ID",
      accessor: "user.username",
    },
    {
      Header: "Record Id",
      accessor: "recordId",
    },
    {
      Header: "MODULE",
      accessor: "menu",
    },
    {
      Header: "ACTION",
      accessor: "actionName",
    },
    {
      Header: "TIMESTAMP",
      accessor: "createDate",
    },
    {
      Header: "Field Name",
      accessor: "fieldName",
    },
    {
      Header: "New Value",
      accessor: "newValue"
    },
    {
      Header: "Old Value",
      accessor: "oldValue"
    },
  ];

  const [auditLogs, setAuditLogs] = useState<AuditlogModel[]>([]);
  const [auditLogFilter, setAuditLogFilter] = useState<AuditlogModel[]>([]);
  const [keyword, setKeyword] = useState<string>('');

  useEffect(() => {
    getAuditLog();
  }, [])

  useEffect(() => {
    if (keyword) {
      const data = auditLogs.filter(item => item?.user?.username?.includes(keyword));
      setAuditLogFilter(data);
    } else {
      getAuditLog();
    }
  }, [keyword])

  const getAuditLog = () => {
    auditlog.getAuditLog().then(response => {
      const data = response.data?.data;
      data?.rows.forEach((elm: AuditlogModel) => {
        elm.createDate = momentTimeZone.tz(elm.createDate, myTimezone).format(FORMATDATE_HH_MM_SS);
        elm.newValue = elm.newValue && handleValue(elm.newValue);
        elm.oldValue = elm.oldValue && handleValue(elm.oldValue);
      })
      setAuditLogs(data?.rows);
      setAuditLogFilter(data?.rows);
    }).catch(error => console.error(error))
  }

  const handleValue = (accType: string) => {
    if (accType === 'r') {
      return AccountType.RETAIL;
    }

    if (accType === 'c') {
      return AccountType.CORPORATE;
    }

    return accType;
  }

  return (
    <>
      <Flex justifyContent={"space-between"}>
        <Heading size="lg" mb={6}>Audit Log</Heading>
        <Input
          placeholder="Search"
          width={"sm"}
          value={keyword}
          backgroundColor="white"
          borderRadius={"md"}
          onChange={(e) => setKeyword(e.target.value)}/>
      </Flex>

      <Box backgroundColor={"white"} borderRadius={"md"} p="4">
        <DataTable columns={columns} data={auditLogFilter} />
      </Box>
    </>
  );
}

export default AuditLogTable;
