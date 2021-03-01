import styles from '../styles/components/CompletedChallenges.module.css';

import { ChallengesContext } from '../contexts/ChallengesContext';

import { useContext } from 'react';

export function CompletedChallenges() {
	const { completedChallenges } = useContext(ChallengesContext);

	return (
		<div className={styles.completedChallengesContainer}>
			<span>Desafios Completos</span>
			<span>{ completedChallenges }</span>
		</div>
	)
}