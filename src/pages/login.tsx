import styles from '../styles/pages/Login.module.css';

import Head from 'next/head';

import TokenAuthenticator from '../utils/HighOrderComponents/TokenAuthenticator';

import { LoginBox } from '../components/LoginBox';

function Login() {
  return (
    <div className={ styles.container }>
      <Head>
        <title>Login | move-it</title>
      </Head>

      <LoginBox />
    </div>
  )
}

export default TokenAuthenticator(Login, false);