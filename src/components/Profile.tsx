import styles from '../styles/components/Profile.module.css';

import { useContext, CSSProperties } from 'react';
import { EnumContext, ChallengesContext } from '../contexts/ChallengesContext';

export function Profile() {
	const {
		inContext
		, level
		, experienceUpdatingTimerConfig: delayConfig
	} = useContext(ChallengesContext)

	const inlineHighlightStyle = {
		'--duration_on_render': `${ delayConfig.get.treatedTimer() }ms`,
		'--duration_pos_render': `${ delayConfig.get.treatedTimer(1 - delayConfig.get.multiplier() ) * 5 }ms`
	} as CSSProperties;

	if ( inContext(EnumContext.isPosLevelingUp) ) {
		inlineHighlightStyle.animationName = 'none';
	}

	function RemoverPosRender(event: AnimationEvent){
		const target = event.target as HTMLElement;

		if ( !target.className.includes( styles.onRender ) )
	return;

		target.className = (
			Array.from(target.classList)
				.filter( classItem => classItem != styles.onRender)
				.join(' ')
		);
	}

	return (
		<div className={styles.profileContainer}>
			<img src="http://github.com/ruanmoreiraofc.png" alt="Ruan Moreira" />
			<div>
				<strong>Ruan Moreira</strong>
				<p>
					<img src="icons/level.svg" alt="Level" />
					{ 'Level ' }
					<span
						className={ `${styles.hasPulser} ${styles.onRender}` }
						onAnimationEnd={ RemoverPosRender.bind(null) }
						style={ inlineHighlightStyle }
					>
						{level - Number( inContext(EnumContext.isLevelingUp) ) }
					</span>
				</p>
			</div>
		</div>
	)
}