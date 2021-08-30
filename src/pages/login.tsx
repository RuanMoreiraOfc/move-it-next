import styles from '../styles/pages/Login.module.css';

import TokenAuthenticator from '@u-hoc/TokenAuthenticator';

import Head from 'next/head';
import LoginBox from '@components/LoginBox';

export default TokenAuthenticator(Login, false);

function Login() {
   return (
      <div className={styles.container}>
         <Head>
            <title>Login | move-it</title>
         </Head>

         <LoginBox />
      </div>
   );
}
