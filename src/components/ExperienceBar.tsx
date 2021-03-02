import styles from '../styles/components/ExperienceBar.module.css'

import { ChallengesContext } from '../contexts/ChallengesContext';

import { useEffect, useContext, CSSProperties } from "react";

export function ExperienceBar() {
	const {
		level
		, onLevelUp
		, inLevelingUp: inLeveling
		, inLevelingUpOffDelayConfig: delayConfig
		, onGainExperience: onProgress
		, lastExperience: lastProgress
		, currentExperience: progress
		, getExperienceToSpecificLevel: getMaxProgress
	} = useContext(ChallengesContext)

	function getProgressPerCent(progressPoint: number) {
		return Math.floor(progressPoint / getMaxProgress() * 100) + '%';
	}
	
// DECLARATION

	const startPoint = getProgressPerCent( lastProgress );
	const endPoint = getProgressPerCent( progress );

	const inlineProps = { startPoint, endPoint };

// SETTING UP

	useEffect( delayConfig.set.bind(null, 1600), [] );

	const inlineStyle = { animationDuration: `${ delayConfig.get() * 1.25 }ms` } as CSSProperties;
	
		for ( const prop in inlineProps )
	inlineStyle['--' + prop] = inlineProps[prop];

// CHECKING IT OUT

	//TODO: ANIMATION ON LEVEL

	if ( inLeveling ) {
		inlineStyle['--startPoint'] =  Math.floor(lastProgress / getMaxProgress(level - 1) * 100) + '%';
		inlineStyle['--endPoint'] = '100%';
		inlineStyle.animationDuration = delayConfig.get() + 'ms';
	}

	if ( onLevelUp || ( !onProgress && !inLeveling ) ) {
		inlineStyle['--startPoint'] = '0%'
	}

	if ( onLevelUp || onProgress ) {
		inlineStyle.animationName = 'none';
	}
	
	return (
		<header className={ styles.experienceBarContainer }>
			<span>0 exp</span>
			<div>
				<div className={ styles.experienceBar } style={ inlineStyle } />
				<span className={ styles.currentExperience } style={ inlineStyle } >
					{progress} exp
				</span>
			</div>
			<span>{ getMaxProgress( level - Number(inLeveling) ) } exp</span>
		</header>
	)
}