import styles from '@st-components/LevelUpModal.module.css';

import useChallenges from '@hooks/useChallenges';

export default LevelUpModal;

function LevelUpModal() {
   const { levelRaw: level, CloseLevelUpModal } = useChallenges();

   // TODO: Music Level Up

   return (
      <div className={styles.overlay}>
         <div className={styles.container}>
            <header data-level={level}>{level}</header>

            <strong>Parabéns 🎉</strong>
            <p>Você alcançou um novo level.</p>
            <button type='button' onClick={CloseLevelUpModal}>
               <img src='/icons/close.svg' alt='Fechar modal' />
            </button>
         </div>
      </div>
   );
}
