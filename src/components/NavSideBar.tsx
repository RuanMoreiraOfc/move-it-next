import styles from '../styles/components/NavSideBar.module.css';

import { ReactNode, useContext } from 'react';

import { useRouter } from 'next/router';

import { SessionContext } from '../contexts/SessionContext';
import Cookies from 'js-cookie';

export function NavSideBar() {
    const router = useRouter();

	const {
		isLogged
	} = useContext(SessionContext);

	interface ILinkProps {
		href: string;
	}
	interface IImageProps {
		alt: string;
		icon: string;
	}

    function PageLink( { href, icon, ...rest } : ILinkProps & IImageProps  ) {
        return (
			<a
				onClick={ () => router.replace(href) }
				className={ router.pathname === href ? styles.activePage : null }
			>
				<li><img src={ `/icons/${icon}.svg` } {...rest} /></li>
			</a>
        )
    }

    function AccountLink( { icon, ...rest }: IImageProps ) {
        return (
			<li>
				<a
					onClick={ () => {
						if ( !confirm('Deseja encerrar a sessão?') ) return;

						Cookies.remove('token');
						Cookies.remove('token_type');
						router.replace('/login');
					} }
				>
					<img src={ `/icons/${icon}.svg` } {...rest} />
				</a>
			</li>
        )
    }

	return (
		<nav className={ styles.container }>
            <ul className={ styles.menuTop }>
                <li><img src="/icons/logo.svg" alt="Logo"/></li>
            </ul>

            <ul className={ styles.nav }>
                <PageLink href="/" icon="home" alt="Home"/>
                <PageLink href="/leaderboard" icon="medal" alt="Leaderboard"/>
            </ul>

			<ul className={ styles.menuBottom }>
				<AccountLink icon="account" alt="Account"/>
			</ul>
        </nav>
	)
}