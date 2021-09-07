import styles from '@st-pages/Home.module.css';

import type { GetServerSideProps, GetServerSidePropsResult } from 'next';
import type { ComponentProps } from 'react';

import api from '@services/api';
import { SetResponseCookies } from '@sf-utils/response';
import { ValidateToken } from '@sf-auth/github/validate';
import { GetDataType } from '@sf-database/mongo/get';

import TokenAuthenticator from '../utils/HighOrderComponents/TokenAuthenticator';

import useSession from '@hooks/useSession';
import useChallenges from '@hooks/useChallenges';

import CountdownContextProvider from '@contexts/CountdownContext';
import ChallengesContextProvider from '@contexts/ChallengesContext';

import Head from 'next/head';

import NavSideBar from '@components/NavSideBar';
import ExperienceBar from '@components/ExperienceBar';
import Profile from '@components/Profile';
import CompletedChallenges from '@components/CompletedChallenges';
import Countdown from '@components/Countdown';
import ChallengeBox from '@components/ChallengeBox';

export { getServerSideProps };
export default TokenAuthenticator(Home);

type HomeProps = Pick<
   ComponentProps<typeof ChallengesContextProvider>,
   'level' | 'completedChallenges' | 'experienceTotal'
>;

function Home(props: HomeProps) {
   return (
      <ChallengesContextProvider {...props}>
         <div className={styles.container}>
            <Head>
               <title>Início | move-it</title>
            </Head>
            <ExperienceBar />

            <CountdownContextProvider>
               <section>
                  <div>
                     <ProfileUser />
                     <CompletedChallenges />
                     <Countdown />
                  </div>
                  <div>
                     <ChallengeBox />
                  </div>
               </section>
            </CountdownContextProvider>
         </div>
      </ChallengesContextProvider>
   );
}

// #region Sub Components

function ProfileUser() {
   const { name, login } = useSession();

   const { levelDelayed: level, inContext } = useChallenges();

   // ***

   return (
      <Profile
         {...{ name, login }}
         level={level - Number(inContext('isLevelingUp'))}
      />
   );
}

// #endregion Sub Components

const getServerSideProps: GetServerSideProps = async ({
   res: response,
   req: { cookies },
}) => {
   const { token, token_type } = cookies;

   // IT IS SET TO STRICT ONLY AFTER SF_VALIDATE TO AVOID ERRORS OF NO DATA AT EXECUTION
   // FIXME: MAKE IT STRICT EARLY
   SetResponseCookies('strict')(response)([{ token }, { token_type }]);

   function DataNotFoundCase(scenario: string) {
      SetResponseCookies('strict')(response)([
         { token: '' },
         { token_type: '' },
      ]);
      return {
         redirect: {
            statusCode: 307,
            destination: `/login?redirect=${scenario}`,
         },
      } as GetServerSidePropsResult<HomeProps>;
   }

   const login: string = (
      (await ValidateToken(token_type, token).catch(console.log)) || null
   )?.data?.login;

   if (!login) {
      return DataNotFoundCase('invalid');
   }

   const requestedData: GetDataType = (
      (await api
         .get('/database/mongo/get/single', {
            params: { login },
         })
         .catch(console.log)) || null
   )?.data?.[0];

   if (!requestedData) {
      return DataNotFoundCase('database');
   }

   const {
      level,
      exp: experienceTotal,
      tasks: completedChallenges,
   } = requestedData;

   return {
      props: {
         level,
         experienceTotal,
         completedChallenges,
      } as HomeProps,
   };
};
