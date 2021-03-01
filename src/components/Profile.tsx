import styles from '../styles/components/Profile.module.css';

import { useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';

export function Profile() {
	const { level } = useContext(ChallengesContext)

	return (
		<div className={styles.profileContainer}>
			<img src="http://github.com/ruanmoreiraofc.png" alt="Ruan Moreira" />
			<div>
				<strong>Ruan Moreira</strong>
				<p>
					<img src="icons/level.svg" alt="Level" />
					Level {level}
				</p>
			</div>
		</div>
	)
}