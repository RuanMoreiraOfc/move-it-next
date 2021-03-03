import styles from '../styles/components/Countdown.module.css';

import { CountdownContext } from '../contexts/CountdownContext';

import { useState, useEffect, useContext } from 'react';

export function Countdown() {
	const { hasFinished, isActive, minutes, seconds, StartCountdown, ResetCountdown } = useContext(CountdownContext)

	const [minuteLeft, minuteRight] = minutes.toString().padStart(2, '0').split('');
	const [secondLeft, secondRight] = seconds.toString().padStart(2, '0').split('');

	//

	interface IButtonBaseProps
	{
		disabled?: boolean;
		onClick?: (event?) => void;

		extraClassName?: string;

		textChildren: string;
		imageChildren: string;
	}

	function ButtonBase( props: IButtonBaseProps )
	{
		return (
			<button
				onClick={ props.onClick }
				type='button'
				disabled={ props.disabled || false }
				className={ `${styles.countdownButton} ${props.extraClassName || '' }` }
			>
				{ props.textChildren }
				<span className={styles[props.imageChildren + 'Icon']}/>
			</button>
		)
	}
	
	return (
		<div>
			<div className={styles.countdownContainer}>
				<div>
					<span>{minuteLeft}</span>
					<span>{minuteRight}</span>
				</div>
				<span>:</span>
				<div>
					<span>{secondLeft}</span>
					<span>{secondRight}</span>
				</div>
			</div>

			{ hasFinished ? (

				ButtonBase( {
					disabled: true,
					textChildren: 'Ciclo Encerrado',
					imageChildren: 'done'
				} )

			) : (
				!isActive ? (

					ButtonBase( {
						onClick: StartCountdown,
						textChildren: 'Iniciar Ciclo',
						imageChildren: 'play'
					} )
	
				) : (

					ButtonBase( {
						onClick: ResetCountdown,
						extraClassName: styles.countdownButtonActive,
						textChildren: 'Abandonar Ciclo',
						imageChildren: 'close'
					} )
					
				)
			) }

		</div>
	)
}