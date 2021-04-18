import styles from '../styles/pages/Home.module.css';

import { useContext } from 'react';
import { GetServerSideProps } from 'next';

import axios from 'axios';
import { ApiUrl } from './api/utils/request';
import { ValidateToken } from './api/auth/github/validate';
import { IGetData } from './api/database/mongo/get';

import TokenAuthenticator from '../utils/HighOrderComponents/TokenAuthenticator';

import { SessionContext } from '../contexts/SessionContext';
import { CountdownContextProvider } from '../contexts/CountdownContext';
import { IChallengesContextProviderProps, ChallengesContextProvider, EnumContext, ChallengesContext } from "../contexts/ChallengesContext";

import Head from 'next/head';

import { NavSideBar } from '../components/NavSideBar';
import { ExperienceBar } from '../components/ExperienceBar';
import { Profile } from '../components/Profile';
import { CompletedChallenges } from '../components/CompletedChallenges';
import { Countdown } from '../components/Countdown';
import { ChallengeBox } from '../components/ChallengeBox';

interface IHomeProps extends IChallengesContextProviderProps {
   error: 'Not Found' | "None";
}

function Home( {error, ...props}: IHomeProps ) {
  const {
    name
    , login
  } = useContext(SessionContext);

  function ProfileUser() {
    const {
      levelDelayed: level
      , inContext
    } = useContext(ChallengesContext);

    return <Profile { ...{name, login} } level={ level - Number( inContext(EnumContext.isLevelingUp) ) } />
  }

  // TODO: ERROR TREATMENT

  return (
    <ChallengesContextProvider {...props}>
      <NavSideBar />
      <div className={ styles.container }>
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
  )
}

export default TokenAuthenticator(Home);

export const getServerSideProps: GetServerSideProps = async ( {req} ) => {
   const { token, token_type } = req.cookies;

   const userLogin: string = ( await ValidateToken(token_type, token).catch( err => null ) )?.data?.login;

   const url = ApiUrl(req, `/database/mongo/get/single?login=${userLogin}`);

   const requestedData: IGetData[] = ( await axios.get(url).catch(err => null) )?.data;
   if ( !requestedData ) return ({ props: {error: 'Not Found'} as IHomeProps });

   const { level, exp: experienceTotal, tasks: completedChallenges } = requestedData[0];

   return ({
      props: {
         error: 'None'
         , level
         , experienceTotal
         , completedChallenges
      } as IHomeProps
   })
}