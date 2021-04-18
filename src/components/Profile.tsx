import styles from '../styles/components/Profile.module.css';

import { useContext } from 'react';

import { SessionContext } from '../contexts/SessionContext';

interface IProfileProps {
	name: string;
	login: string;
	level: number;
}

export function Profile( { name, login, level } : IProfileProps ) {
	return (
		<div className={ styles.profileContainer }>
			<img src={ `http://github.com/${ login }.png` } alt={ `Foto de Perfil - ${login}` } />
			<div>
				<strong>{ name }</strong>
				<p>
					<img src="/icons/level.svg" alt="Level" />
					<span>{ "Level " + level }</span>
				</p>
			</div>
		</div>
	)
}