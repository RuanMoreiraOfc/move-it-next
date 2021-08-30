import type { ComponentProps, ElementType } from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import Cookies from 'js-cookie';

import { ValidateToken } from '@sf-auth/github/validate';

import SessionContextProvider from '@contexts/SessionContext';

import LoadingAnimation from '@u-hoc-components/LoadingAnimation';

export default TokenAuthenticator;

type SessionContextDataType = Pick<
   ComponentProps<typeof SessionContextProvider>,
   'name' | 'login' | 'isLogged'
>;

function TokenAuthenticator(
   Component: ElementType,
   mustHaveValidToken: boolean = true,
) {
   function Wrap(props: unknown) {
      const router = useRouter();

      const [hasAccess, setHasAccess] = useState(false);
      const [sessionProps, setSessionProps] = useState(
         {} as SessionContextDataType,
      );

      async function ValidateAcess() {
         const token = Cookies.get('token');
         const tokenType = Cookies.get('token_type');

         const hasToken = Boolean(token);

         const IsLoginPage = () => router.pathname === '/login';

         /* ---- NO TOKEN TEST */ {
            if (!hasToken)
               if (mustHaveValidToken) {
                  router.replace(`/login?redirect=${'need_auth'}`);
                  return;
               }

            if (!hasToken) {
               setHasAccess(true);
               return;
            }
         }

         /* ---- INTERNET SAVER */ if (sessionProps.isLogged) {
            setHasAccess(true);
            return;
         }

         // ---- REQUEST
         const requestedData =
            (await ValidateToken(tokenType, token).catch(console.log)) || null;

         /* ---- TOKEN TEST */ {
            const tokenIsValid = Boolean(requestedData);

            if (!tokenIsValid)
               if (mustHaveValidToken) {
                  router.replace(`/login?redirect=${'denied'}`);
                  return;
               }

            if (tokenIsValid)
               if (!IsLoginPage()) {
                  setSessionProps(requestedData.data as SessionContextDataType);
               }

            setHasAccess(true);

            if (IsLoginPage()) {
               if (tokenIsValid) {
                  router.replace('/');
                  return;
               }

               router.replace(`/login?redirect=${'invalid'}`);
            }
         }
      }

      useEffect(ValidateAcess as () => void, []);

      return hasAccess ? (
         <SessionContextProvider
            {...sessionProps}
            children={<Component {...props} />}
         />
      ) : (
         <LoadingAnimation />
      );
   }

   return Wrap;
}
