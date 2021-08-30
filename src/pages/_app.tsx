import '@styles/global.css';
import '@styles/global.colors.css';
import '@styles/global.animations.css';

import styles from '@st-pages/App.module.css';

import { Fragment } from 'react';
import { useRouter } from 'next/router';

import NavSideBar from '@components/NavSideBar';

export default MyApp;

function MyApp({ Component, pageProps }) {
   const router = useRouter();

   const isLoginPage = router.pathname === '/login';

   // ***

   return (
      <div className={!isLoginPage ? styles.wrapper : styles.noWrapper}>
         {!isLoginPage && <NavSideBar />}
         <Component {...pageProps} />
      </div>
   );
}
