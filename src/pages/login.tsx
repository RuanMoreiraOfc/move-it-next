import styles from '../styles/pages/Login.module.css';

import Head from 'next/head';
import { LoginBox } from '../components/LoginBox';

export default function Login() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Login | move-it</title>
      </Head>

      <LoginBox />
    </div>
  )
}