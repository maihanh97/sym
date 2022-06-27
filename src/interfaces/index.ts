import {BoxProps} from "@chakra-ui/react";

export interface SidebarProps extends BoxProps {
    onClose: () => void;
}