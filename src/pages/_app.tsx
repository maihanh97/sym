import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import type { NextPage } from 'next';
import { 
  AlertDialog, 
  AlertDialogBody, 
  AlertDialogCloseButton, 
  AlertDialogContent, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogOverlay, 
  Button, 
  ChakraProvider, 
  useDisclosure 
} from '@chakra-ui/react';
import 'antd/dist/antd.css';
import '../assets/styles/globals.css'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '../redux/store/configureStore';
import {useRouter} from "next/router";
import { routes } from '../router/routes';
import { SESSION_TIME, SESSION_WARNING_TIME } from '../config/env';
import { ACCESS_TOKEN, IDLE_TIME_COUNT } from '../constants';
import { getItemLocalStorage } from "../hooks/index";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  const [idleTime, setIdleTime] = useState(0);
  const router = useRouter();
  const {isOpen: isSessionOpen, onOpen: onSessionOpen, onClose: onSessionClose} = useDisclosure();
  const cancelRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const idleEvents = ['load', 'mousemove', 'mousedown', 'click', 'scroll', 'keypress']

  // Increment the idle time counter every minute.
  useEffect(() => {
    const interval = setInterval(() => {
      setIdleTime(prev => prev + 1)
    }, IDLE_TIME_COUNT);
    return () => clearInterval(interval);
  }, []);

  // Set the idle timer to 0 if catch event.
  useEffect(() => {
    idleEvents.forEach(event => {
      window.addEventListener(event, () => setIdleTime(0));
    })
    return () => {
      idleEvents.forEach(event => {
        window.removeEventListener(event, () => setIdleTime(0));
      })
    };
  }, []);

  useEffect(() => {
    // Show session expire warning dialog in last {SESSION_WARNING_TIME} second
    if (idleTime == SESSION_TIME - 1 && router.route !== routes.LOGIN) {
      const timer = setTimeout(() => {
        onSessionOpen()
      }, IDLE_TIME_COUNT - SESSION_WARNING_TIME * 1000);
      return () => clearTimeout(timer);
    }
    // Clear localStorage and redirect to login page if idle timer > session time
    if (idleTime > SESSION_TIME - 1 && router.route !== routes.LOGIN) {
      router.push(routes.LOGIN);
      localStorage.clear();
      onSessionClose()
    }

    if (!getItemLocalStorage(ACCESS_TOKEN) && router.route !== routes.LOGIN) {
      router.push(routes.LOGIN);
      localStorage.clear();
      onSessionClose()
    }
  }, [idleTime]);

  const logOut = (event: any) => {
    router.push(routes.LOGIN);
    localStorage.clear();
    onSessionClose();
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ChakraProvider>
          {getLayout(<Component {...pageProps} />)}
          <AlertDialog
            leastDestructiveRef={cancelRef}
            motionPreset='slideInBottom'
            onClose={onSessionClose} isOpen={isSessionOpen} isCentered
          >
            <AlertDialogOverlay/>
            <AlertDialogContent>
              <AlertDialogHeader>Warning</AlertDialogHeader>
              <AlertDialogCloseButton/>
              <AlertDialogBody mb={3}>
                  <p>Session time is expired. Would you like to continue?</p> 
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button colorScheme='blue' mr={3} onClick={onSessionClose}>
                  Continue
                </Button>
                <Button onClick={logOut}>
                  Logout
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </ChakraProvider>
        {/* <Login/> */}
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
