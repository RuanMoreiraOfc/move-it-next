import styles from '../styles/pages/Home.module.css';

import { CountdownContextProvider } from '../contexts/CountdownContext';
import { ChallengesContextProvider } from "../contexts/ChallengesContext";

import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Profile } from '../components/Profile';
import { ExperienceBar } from '../components/ExperienceBar';
import { CompletedChallenges } from '../components/CompletedChallenges';
import { Countdown } from '../components/Countdown';
import { ChallengeBox } from '../components/ChallengeBox';

interface HomeProps {
  level: number;
  currentExperience: number;
  completedChallenges: number;
}

export default function Home( props: HomeProps ) {
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
              <Profile />
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

export const getServerSideProps: GetServerSideProps = async(ctx) =>
{
  const cookies = {...ctx.req.cookies}
  const props = {} as HomeProps

    for( const value in cookies )
  props[value] = Number(cookies[value])
  
  return({
    props: {...props}
  })
}