import type { GetStaticPaths, GetStaticProps } from 'next';
import type { ComponentProps } from 'react';
import { Fragment } from 'react';
import { useRouter } from 'next/router';

import TokenAuthenticator from '@u-hoc/TokenAuthenticator';

import api from '@services/api';
import type {
   ApiSearchOptionsType,
   GetQueryType,
} from '@sf-database/mongo/get';

import Head from 'next/head';
import LeaderboardCard from '@components/LeaderboardCard';

import { Leaderboard } from '@pages/leaderboard';

export { getStaticPaths, getStaticProps };
export default TokenAuthenticator(LeaderboardSlug, false);

type LeaderboardCardProps = ComponentProps<typeof LeaderboardCard>;
type LeaderboardSlugProps = ComponentProps<typeof Leaderboard>;

function LeaderboardSlug(props: LeaderboardSlugProps) {
   const router = useRouter();

   const pathnames = router.asPath.slice(1).split('/');
   const user = Array.from(pathnames).reverse()[0];

   return (
      <Fragment>
         <Head>
            <title>Leaderboard - {user} | move-it</title>
         </Head>
         {Leaderboard(props)}
      </Fragment>
   );
}

const getStaticPaths: GetStaticPaths = async (ctx) => {
   return {
      paths: [],
      fallback: true,
   };
};

const getStaticProps: GetStaticProps = async ({ params }) => {
   const requestedData: LeaderboardCardProps[] = (
      await api
         .get('/database/mongo/get/all', {
            params: {
               sort: JSON.stringify({ exp: -1 }),
            } as ApiSearchOptionsType,
         })
         .catch((err) => null)
   )?.data;

   if (!requestedData) {
      return {
         props: {
            list: [
               {
                  index: -1,
                  login: 'github',
                  name: '404 - Database Error',
                  level: -1,
                  tasks: -1,
                  exp: -1,
                  highlighted: true,
               },
            ] as LeaderboardCardProps[],
         },
      };
   }

   const userItem: LeaderboardCardProps = requestedData.find(
      (item) => item.login === params.slug,
   );
   const IsUserValid = () => Boolean(userItem);

   if (!IsUserValid()) return { notFound: true };

   // HAS DATA

   //#region Array Dealers | Functions

   function HighLightCard(itemBase: LeaderboardCardProps) {
      return function (item: LeaderboardCardProps) {
         item.highlighted = item === itemBase;
         return item;
      };
   }

   function IndexCard(item: LeaderboardCardProps, index: number) {
      item.index = index + 1;
      return item;
   }

   //#endregion

   //#region Array Dealers | User Item

   const IsUserIn = (array: LeaderboardCardProps[]) =>
      array.some((e) => e === userItem);
   const GetArrayedUserItem = (arrayToVerify: LeaderboardCardProps[]) =>
      IsUserIn(arrayToVerify) ? [] : !IsUserValid() ? [] : [userItem];

   //#endregion

   //#region Array Dealers | Fixing

   const indexedList = requestedData.map(IndexCard);
   const slicedList = indexedList.slice(0, 10);
   const concatendedList = slicedList.concat(GetArrayedUserItem(slicedList));
   const highlightedList = concatendedList.map(HighLightCard(userItem));

   const list = highlightedList;

   //#endregion

   return {
      props: { list },
      revalidate: 24 * 60, // 24 min
   };
};
