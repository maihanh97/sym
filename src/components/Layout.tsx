import React, {ReactNode, ReactText, useEffect, useState} from "react";
import {
  Avatar,
  Box,
  BoxProps,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  FlexProps,
  HStack,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import {FiBell, FiChevronDown, FiCompass, FiMenu, FiSettings as FaFileArchive, FiStar,} from "react-icons/fi";
import {FaListUl, FaProductHunt, FaUserFriends} from "react-icons/fa";
import {IconType} from "react-icons";
import NextLink from "next/link";
import {useRouter} from "next/router";
import {useAuth} from "../hooks/index";
import {FunctionModel, UserModel} from "../interfaces/user.model";
import {user} from "../api";
import {ROLE_FUNCTION, RoleFunction} from "../constants";
import {SidebarProps} from "../interfaces";
import {checkUserAdmin} from "../utils/common";

interface LinkItemProps {
  name: string;
  icon: IconType;
  target?: string;
  roleCd: string;
}
let linkItems: Array<LinkItemProps> = [
  { name: "Products Management", icon: FaProductHunt, target: "/productsmanagement", roleCd: RoleFunction.view_product },
  { name: "Clients Management", icon: FaUserFriends, target: "/clientsmanagement", roleCd: RoleFunction.view_client },
  { name: "Issuance", icon: FiCompass, target: "/issuance", roleCd: RoleFunction.view_issuance },
  { name: "Orders Management", icon: FiStar, target: "/ordersmanagement", roleCd: RoleFunction.view_order },
  { name: "NAV Updates", icon: FiMenu, target: "/navupdates", roleCd: RoleFunction.view_nav },
  { name: "Audit Log", icon: FaListUl, target: "/auditlog", roleCd: RoleFunction.pcm_admin },
  // TODO: Impl Asset Management screen in Phase 2
  // { name: "Asset Management", icon: FaFileArchive, target: "/assetmanagement", roleCd: RoleFunction.view_asset },
  { name: "Settings", icon: FaFileArchive, target: "/settings", roleCd: RoleFunction.pcm_admin}
];

const Layout = ({ children }: { children: ReactNode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { logout } = useAuth();

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} onLogout={logout} />
      <Box ml={{ base: 0, md: 60 }} p="8">
        {children}
      </Box>
    </Box>
  );
};

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const router = useRouter();
  const userInfo: UserModel = user.getInfoUser();
  const [listPageAccessibility, setListPageAccessibility] = useState<Array<LinkItemProps>>(linkItems);
  useEffect(() => {
    user.listRoleFunction().then(response => {
      const roleFunction = response.data.data;
      const roleCode = roleFunction.map((item: FunctionModel) => item?.menu?.menuCd)
      localStorage.setItem(ROLE_FUNCTION, JSON.stringify(roleFunction));

      const linkActive = linkItems.find(item => router.pathname.includes(item.target as string));
      const pageAccessibility = linkItems.filter(link => userInfo.roleCode === RoleFunction.pcm_admin || roleCode?.includes(link.roleCd));
      setListPageAccessibility(pageAccessibility);
      if (pageAccessibility.length && !pageAccessibility.map(item => item.roleCd).includes(linkActive?.roleCd as string)) {
        router.push(pageAccessibility[0]?.target || '');
      }
    }).catch(err => console.error(err));
  }, [router]);

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          SYMPHONY
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {listPageAccessibility.map((link) => (
        <NavItem
          key={link.name}
          icon={link.icon}
          target={link.target}
          currentPath={router.pathname}
        >
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
  target?: string;
  currentPath: string;
}
const NavItem = ({
  icon,
  children,
  target,
  currentPath,
  ...rest
}: NavItemProps) => {
  return (
    <Link style={{ textDecoration: "none" }} as={NextLink} href={target || ""}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        backgroundColor={
          currentPath.includes(target!) && currentPath !== "/"
            ? "blue.700"
            : "inherit"
        }
        color={
          currentPath.includes(target!) && currentPath !== "/"
            ? "white"
            : "inherit"
        }
        {...rest}
      >
        {icon && <Icon mr="4" fontSize="16" as={icon} />}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
  onLogout: () => void;
}
const MobileNav = ({ onOpen, onLogout, ...rest }: MobileProps) => {
  const userInfo: UserModel = user.getInfoUser();
  const router = useRouter();
  const gotoSettingPage = () => router.push('/settings');
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        SYMPHONY
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        {/* <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        /> */}
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar
                  size={"sm"}
                  // TODO: avatar default
                  src='https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png'
                />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{userInfo?.username}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {userInfo?.userRole}
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              {/* <MenuItem>Profile</MenuItem> */}
              {checkUserAdmin() && <MenuItem onClick={gotoSettingPage}>Settings</MenuItem>}
              {/* <MenuItem>Billing</MenuItem> */}
              {checkUserAdmin() && <MenuDivider/>}
              <MenuItem onClick={onLogout}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

export default Layout;
