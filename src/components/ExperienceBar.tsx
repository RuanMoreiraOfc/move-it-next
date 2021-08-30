// @collapse

import styles from '@st-components/ExperienceBar.module.css';

import { useEffect, CSSProperties, AnimationEvent } from 'react';

import useChallenges from '@hooks/useChallenges';

export default ExperienceBar;

function ExperienceBar() {
   const {
      inContext,
      experienceUpdatingTimerConfig: delayConfig,
      levelDelayed: level,
      lastExperience: lastExp,
      currentExperience: currentExp,
      getExperienceToNextLevel: getMaxProgress,
   } = useChallenges();

   function getProgressPerCent(progressPoint: number) {
      return Math.floor((progressPoint / getMaxProgress()) * 100) + '%';
   }

   // #region DECLARATION

   const startPoint = getProgressPerCent(lastExp);
   const endPoint = getProgressPerCent(currentExp);

   const inlineProps = { startPoint, endPoint, lastExp, currentExp };

   // #endregion

   // #region SETTING UP

   const maxDelayTimer = 1000;
   const maxDelayMultiplier = 0.95;

   useEffect(() => {
      delayConfig.set.timer(maxDelayTimer);
      delayConfig.set.multiplier(maxDelayMultiplier);
   }, []);

   const inlineMotionStyle = {
      animationDuration: `${delayConfig.get.timer()}ms`,
   } as CSSProperties;
   const inlineHighlightStyle = {
      '--duration_on_render': `${delayConfig.get.treatedTimer()}ms`,
      '--duration_pos_render': `${
         delayConfig.get.treatedTimer(1 - maxDelayMultiplier) * 5
      }ms`,
   } as CSSProperties;

   for (const prop in inlineProps)
      inlineMotionStyle['--' + prop] = inlineProps[prop];

   // #endregion

   // #region CHECKING IT OUT

   if (inContext('isLevelingUp')) {
      inlineMotionStyle['--startPoint'] =
         Math.floor((lastExp / getMaxProgress(level - 1)) * 100) + '%';
      inlineMotionStyle['--endPoint'] = '100%';

      inlineMotionStyle['--currentExp'] = getMaxProgress(level - 1);
      inlineMotionStyle.color = 'transparent';
      inlineMotionStyle.animationDuration = `${delayConfig.get.treatedTimer()}ms`;
   }

   if (inContext('isPosLevelingUp')) {
      inlineHighlightStyle.animationName = 'none';
   }

   if (inContext('isPosLevelingUp') || inContext('onGainExp')) {
      inlineMotionStyle.animationName = 'none';
   }

   // #endregion

   function RemoverPosRender(event: AnimationEvent) {
      const target = event.target as HTMLElement;

      if (!target.className.includes(styles.onRender)) return;

      target.className = Array.from(target.classList)
         .filter((classItem) => classItem != styles.onRender)
         .join(' ');
   }

   // #region  DYNAMIC COUNTER( ONLY ON CHROMIUM SO FAR < chrome: 78 > )

   function CreateCounter(event: AnimationEvent) {
      const target = event.target as HTMLElement;

      if (!('registerProperty' in window.CSS)) return;

      if (target.className.includes(styles.hasCounter)) return;

      target.className += ' ' + styles.hasCounter;
      target.innerText = '';
   }

   // #endregion

   return (
      <header className={styles.experienceBarContainer}>
         <span>0 exp</span>
         <div>
            <div className={styles.experienceBar} style={inlineMotionStyle} />
            <span
               className={styles.currentExperience}
               style={inlineMotionStyle}
               onAnimationStart={CreateCounter}
            >
               {currentExp} exp
            </span>
         </div>
         <span
            className={`${styles.hasPulser} ${styles.onRender}`}
            onAnimationEnd={RemoverPosRender}
            style={inlineHighlightStyle}
         >
            {getMaxProgress(level - Number(inContext('isLevelingUp')))} exp
         </span>
      </header>
   );
}
