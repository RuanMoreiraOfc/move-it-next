import styles from '@st-components/NavSideBar.module.css';

import { useRouter } from 'next/router';

import Cookies from 'js-cookie';

import Link from 'next/link';

export default NavSideBar;

type LinkProps = {
   href: string;
};
type ImageProps = {
   alt: string;
   icon: string;
};

function NavSideBar() {
   return (
      <nav className={styles.container}>
         <ul className={styles.menuTop}>
            <li>
               <img src='/icons/logo.svg' alt='Logo' />
            </li>
         </ul>

         <ul className={styles.nav}>
            <PageLink href='/' icon='home' alt='Home' />
            <PageLink href={`/leaderboard`} icon='medal' alt='Leaderboard' />
         </ul>

         <ul className={styles.menuBottom}>
            <AccountLink icon='account' alt='Account' />
         </ul>
      </nav>
   );
}

// #region Sub Components

function PageLink({ href, icon, ...rest }: LinkProps & ImageProps) {
   const router = useRouter();

   const pathnames = router.asPath.split('/');
   const pathname = Array.from(pathnames)[1];

   // ***

   return (
      <Link href={href}>
         <a className={`/${pathname}` === href ? styles.activePage : null}>
            <li>
               <img src={`/icons/${icon}.svg`} {...rest} />
            </li>
         </a>
      </Link>
   );
}

function AccountLink({ icon, ...rest }: ImageProps) {
   const router = useRouter();

   // ***

   return (
      <li>
         <a
            onClick={() => {
               if (!confirm('Deseja encerrar a sessão?')) return;

               Cookies.remove('token');
               Cookies.remove('token_type');
               router.replace('/login');
            }}
         >
            <img src={`/icons/${icon}.svg`} {...rest} />
         </a>
      </li>
   );
}

// #endregion
