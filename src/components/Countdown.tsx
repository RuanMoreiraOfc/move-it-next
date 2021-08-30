import styles from '@st-components/Countdown.module.css';

import useCountdown from '@hooks/useCountdown';

export default Countdown;

function Countdown() {
   const {
      hasFinished,
      isActive,
      minutes,
      seconds,
      StartCountdown,
      ResetCountdown,
   } = useCountdown();

   const [minuteLeft, minuteRight] = minutes
      .toString()
      .padStart(2, '0')
      .split('');
   const [secondLeft, secondRight] = seconds
      .toString()
      .padStart(2, '0')
      .split('');

   //

   interface IButtonBaseProps {
      disabled?: boolean;
      onClick?: (event?) => void;

      className?: string;

      icon: string;
      children: string;
   }

   function ButtonBase({
      className = '',
      children,
      icon,
      ...buttonProps
   }: IButtonBaseProps) {
      return (
         <button
            type='button'
            className={`${styles.countdownButton} ${className}`.trimEnd()}
            {...buttonProps}
         >
            {children}
            <span className={styles[`${icon}Icon`]} />
         </button>
      );
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

         {hasFinished ? (
            <ButtonBase icon='done' disabled>
               Ciclo Encerrado
            </ButtonBase>
         ) : !isActive ? (
            <ButtonBase icon='play' onClick={StartCountdown}>
               Iniciar Ciclo
            </ButtonBase>
         ) : (
            <ButtonBase
               className={styles.countdownButtonActive}
               icon='close'
               onClick={ResetCountdown}
            >
               Abandonar Ciclo
            </ButtonBase>
         )}
      </div>
   );
}
