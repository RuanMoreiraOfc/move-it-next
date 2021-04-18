// @collapse

import styles from "../styles/pages/Leaderboard.module.css";
import stylesCards from "../styles/components/LeaderboardCard.module.css";

import { useContext } from "react";
import { GetServerSideProps } from "next";

import { FixedLengthArray } from "../utils/Interfaces/const";

import axios from "axios";
import { ApiUrl } from "../pages/api/utils/request";
import { ValidateToken } from "./api/auth/github/validate";
import { IAddBody } from "../pages/api/database/mongo/add";

import TokenAuthenticator from "../utils/HighOrderComponents/TokenAuthenticator";

import { SessionContext } from "../contexts/SessionContext";

import Head from "next/head";

import { NavSideBar } from "../components/NavSideBar";
import { LeaderboardCard, ILeaderboardCardProps } from "../components/LeaderboardCard";

interface ILeaderboardProps {
   list: FixedLengthArray<11, ILeaderboardCardProps>;
}

function Leaderboard({ list }: ILeaderboardProps) {
   const {
      isLogged
      , login
   } = useContext(SessionContext);

   return (
      <>
         <NavSideBar />
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
                  { list && list.map((current) => <LeaderboardCard {...current} />) }
               </div>

            </div>
         </div>
      </>
   )
}

export default TokenAuthenticator(Leaderboard, false);

export const getServerSideProps: GetServerSideProps = async ({req}) => {

   const { token, token_type } = req.cookies;

   const userLogin: string = ( await ValidateToken( token_type, token ).catch( err => null ) )?.data?.login;

   const url = ApiUrl(req, '/database/mongo/get');

   const requestedData: ILeaderboardCardProps[] = ( await axios.get(url).catch(err => null) )?.data;
   if ( !requestedData ) return ({ props: {} });

   // HAS DATA

   //#region Array Dealers | Functions

   function SortArrayByExp(a: ILeaderboardCardProps, b: ILeaderboardCardProps) {
      return b.exp - a.exp;
   }

   function HighLightCard(itemBase: ILeaderboardCardProps) {
      return function (item: ILeaderboardCardProps) {
         item.highlighted = item === itemBase;
         return item;
      }
   }

   function IndexCard(item: ILeaderboardCardProps, index: number) {
      item.index = index + 1
      return item;
   }

   //#endregion

   //#region User Logged | Item

   const userItem = requestedData.find(item => item.login === userLogin) as ILeaderboardCardProps;
   const IsUserValid = () => Boolean(userItem);
   const IsUserIn = (array: unknown[]) => array.some(e => e === userItem);
   const GetArrayedUserItem = (arrayToVerify: unknown[]) => (
      IsUserIn(arrayToVerify)
         ? []
         : !IsUserValid()
            ? []
            : [userItem]
   )

   //#endregion

   //#region Array Fixing | Array

   const sortedList = Array.from(requestedData).sort(SortArrayByExp);
   const indexedList = sortedList.map(IndexCard);
   const slicedList = indexedList.slice(0, 10);
   const concatendedList = slicedList.concat( GetArrayedUserItem(slicedList) );
   const highlightedList = concatendedList.map( HighLightCard(userItem) );

   //#endregion

   return ({
      props: {
         list: highlightedList
      }
   })
}