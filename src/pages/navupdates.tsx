import React, {useEffect, useState} from "react";
import type {ReactElement} from "react";
import {Layout, SEO, NAVUpdates} from "../components/index";
import {Heading, Box, Stack, Flex, Button} from "@chakra-ui/react";
import {NavHistory, NavProps} from "../interfaces/user.model";
import {user} from "../api";
import momentTimeZone from "moment-timezone";
import {FORMATDATE_HH_MM_SS, RoleFunction} from "../constants";
import {checkUserAdmin, getRoleByScreen} from "../utils/common";
import {NavModify} from "../mocks/nav.mocks";
import {ActionType} from "../constants/product";

const NAVUpdatesPage = () => {
  const [isUpdateNavDone, setIsUpdateNavDone] = useState<boolean>(false);
  const [listNavHistory, setListNavHistory] = useState<Array<NavHistory>>([]);
  const [itemModify, setItemModify] = useState<NavProps>({type: ActionType.CREATE, value: NavModify});
  const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const funcAccessNU = getRoleByScreen(RoleFunction.view_nav);

  useEffect(() => {
    user.getListNavHistory().then(response => {
      const data = response?.data?.data;
      data?.rows.sort((a: NavHistory, b: NavHistory) => (b.writeDate)?.localeCompare(a.writeDate));
      data?.rows.forEach((nav: NavHistory) =>
        nav.writeDate = momentTimeZone.tz(nav.writeDate, currentTimezone).format(FORMATDATE_HH_MM_SS));
      setListNavHistory(data?.rows);
    }).catch(err => console.error(err));
    clearForm();
  }, [isUpdateNavDone]);

  const emitListHistoryNav = () => setIsUpdateNavDone(!isUpdateNavDone);
  const modifyNAV = (navModify: NavHistory) => {
    setItemModify({type: ActionType.UPDATE, value: navModify});
  }

  const clearForm = () => {
    setItemModify({type: ActionType.CREATE, value: NavModify});
  }

  return (
    <>
      <SEO title="NAV Updates"/>
      <Heading size="lg" mb={8}>NAV Status</Heading>
      <Box backgroundColor={"white"} borderRadius={"md"} p="4" mb={6}>
        <NAVUpdates.ProductsTable listNavHistory={listNavHistory} modifyNav={modifyNAV} emitListHistoryNav={emitListHistoryNav}/>
      </Box>
      {
        (checkUserAdmin() || funcAccessNU?.readFlg) &&
        <Stack spacing={8}>
          <Flex justifyContent="space-between" mt={4}>
            <Heading size="lg">NAV Updates</Heading>
            <Button colorScheme="blue" onClick={clearForm}>Return</Button>
          </Flex>
          <Box backgroundColor={"white"} borderRadius={"md"} p="4">
            <NAVUpdates.NewForm emitListHistoryNav={emitListHistoryNav} itemModify={itemModify}/>
          </Box>
        </Stack>
      }
    </>
  );
};

NAVUpdatesPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default NAVUpdatesPage;
