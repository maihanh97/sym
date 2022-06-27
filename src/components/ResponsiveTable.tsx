import type { FC } from "react";
import { Box, Table } from "@chakra-ui/react";
import type { TableProps } from "@chakra-ui/react";

const ResponsiveTable: FC<TableProps> = ({ children, ...props }) => {
  return (
    <Box overflowX="auto" style={{maxHeight: '350px'}}>
      <Table {...props}>{children}</Table>
    </Box>
  );
};

export default ResponsiveTable;
