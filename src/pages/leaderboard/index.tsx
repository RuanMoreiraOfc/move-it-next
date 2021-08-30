import styles from '@st-pages/Leaderboard.module.css';
import stylesCards from '@st-components/LeaderboardCard.module.css';

import type { GetStaticProps } from 'next';
import type { ComponentProps } from 'react';
import { Fragment } from 'react';
import { useRouter } from 'next/router';

import TokenAuthenticator from '@u-hoc/TokenAuthenticator';

import api from '@services/api';
import { ApiUrl } from '@sf-utils/request';
import { ApiSearchOptionsType } from '@sf-database/mongo/get';

import { FixedLengthArrayType } from '@@types/const';

import useSession from '@hooks/useSession';

import Head from 'next/head';
import NavSideBar from '@components/NavSideBar';
import LeaderboardCard from '@components/LeaderboardCard';

export { getStaticProps, Leaderboard };
export default TokenAuthenticator(LeaderboardRedirector, false);

type LeaderboardCardProps = ComponentProps<typeof LeaderboardCard>;
type LeaderboardProps = {
   list: FixedLengthArrayType<11, LeaderboardCardProps>;
};

function LeaderboardRedirector(props: LeaderboardProps) {
   const router = useRouter();

   const { login } = useSession();

   if (login) {
      router.replace(`${router.pathname}/${login}`);
      return null;
   }

   return Leaderboard(props);
}

function Leaderboard({ list }: LeaderboardProps) {
   return (
      <div className={styles.container}>
         <Head>
            <title>Leaderboard | move-it</title>
         </Head>
         <h1>Leaderboard | TOP 10 </h1>
         <div className={styles.grid}>
            <header className={`${styles.columns} ${stylesCards.container}`}>
               <span>Posição</span>
               <div className={stylesCards.dataContainer}>
                  <span className={stylesCards.user}>Usuário</span>
                  <span>Desafios</span>
                  <span>Experiência</span>
               </div>
            </header>

            <div className={styles.grid}>
               {list &&
                  list.map((current) => (
                     <LeaderboardCard key={current.login} {...current} />
                  ))}
            </div>
         </div>
      </div>
   );
}

const getStaticProps: GetStaticProps = async (ctx) => {
   const requestedData: LeaderboardCardProps[] = (
      await api
         .get('/database/mongo/get/all', {
            params: {
               limit: '10',
               sort: JSON.stringify({ exp: -1 }),
            } as ApiSearchOptionsType,
         })
         .catch((err) => null)
   )?.data;

   if (!requestedData) return { props: {} };

   // HAS DATA

   function IndexCard(item: LeaderboardCardProps, index: number) {
      item.index = index + 1;
      return item;
   }

   const list = requestedData.map(IndexCard);

   return {
      props: { list },
      revalidate: 25 * 60 + 1, // 25 min(s) & 1 sec(s)
   };
};
